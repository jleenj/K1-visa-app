import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ScreenLayout from '../../ScreenLayout';
import FieldRenderer from '../../../utils/FieldRenderer';
import { getNextScreen, getPreviousScreen, isFirstScreen } from '../../../utils/navigationUtils';

/**
 * MarriageScreen - Section 4, Marriage Background
 *
 * Shows:
 * - Current marital status
 * - Married eligibility check (if married)
 * - Number of previous marriages
 * - Marriage history details
 */
const MarriageScreen = ({
  currentData,
  updateField,
  fieldErrors,
  setFieldErrors,
  touchedFields,
  setTouchedFields,
  userRole
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine if this is sponsor or beneficiary based on URL
  const isSponsor = location.pathname.includes('section-4-family') &&
                    !location.pathname.includes('beneficiary');
  const prefix = isSponsor ? 'sponsor' : 'beneficiary';
  const personName = isSponsor
    ? (currentData.sponsorFirstName || 'You')
    : (currentData.beneficiaryFirstName || 'Beneficiary');

  // Get field definitions from App.tsx
  const fields = isSponsor ? [
    {
      id: 'sponsorMaritalStatus',
      label: 'Current Marital Status',
      type: 'select',
      options: ['Single, never married', 'Divorced', 'Widowed', 'Married'],
      required: true,
      helpText: 'Choose based on how your most recent marriage ended. For example, if you were widowed then remarried and divorced, select "Divorced".'
    },
    {
      id: 'marriedEligibilityCheck',
      type: 'married-eligibility-check',
      hideLabel: true,
      required: false,
      showWhen: (data) => data.sponsorMaritalStatus === 'Married'
    },
    {
      id: 'sponsorPreviousMarriages',
      label: `How many times has ${personName} been previously married?`,
      type: 'select',
      options: ['1', '2', '3', '4', '5+'],
      required: true,
      showWhen: (data) =>
        data.sponsorMaritalStatus === 'Divorced' ||
        data.sponsorMaritalStatus === 'Widowed' ||
        (data.sponsorMaritalStatus === 'Married' && data.preparingWhileDivorcing)
    },
    {
      id: 'sponsorMarriageHistory',
      label: 'Previous Marriage Details',
      type: 'marriage-history',
      required: false,
      showWhen: (data) => {
        const previousMarriages = parseInt(data.sponsorPreviousMarriages) || 0;
        const maritalStatus = data.sponsorMaritalStatus;

        // Don't show if "Single, never married"
        if (maritalStatus === 'Single, never married') return false;

        return (maritalStatus !== 'Married' && previousMarriages > 0) ||
               (maritalStatus === 'Married' && data.preparingWhileDivorcing && previousMarriages > 0);
      }
    }
  ] : [
    {
      id: 'beneficiaryMaritalStatus',
      label: 'Current Marital Status',
      type: 'select',
      options: ['Single, never married', 'Divorced', 'Widowed', 'Married'],
      required: true,
      helpText: 'Choose based on how most recent marriage ended. For K-1 visa, beneficiary must be legally free to marry.'
    },
    {
      id: 'beneficiaryMarriedEligibilityCheck',
      type: 'beneficiary-married-eligibility-check',
      hideLabel: true,
      required: false,
      showWhen: (data) => data.beneficiaryMaritalStatus === 'Married'
    },
    {
      id: 'beneficiaryPreviousMarriages',
      label: `How many times has ${personName} been previously married?`,
      type: 'select',
      options: ['1', '2', '3', '4', '5+'],
      required: true,
      showWhen: (data) =>
        data.beneficiaryMaritalStatus === 'Divorced' ||
        data.beneficiaryMaritalStatus === 'Widowed' ||
        (data.beneficiaryMaritalStatus === 'Married' && data.beneficiaryPreparingWhileDivorcing)
    },
    {
      id: 'beneficiaryMarriageHistory',
      label: 'Previous Marriage Details',
      type: 'marriage-history',
      required: false,
      showWhen: (data) => {
        const previousMarriages = parseInt(data.beneficiaryPreviousMarriages) || 0;
        const maritalStatus = data.beneficiaryMaritalStatus;

        // Don't show if "Single, never married"
        if (maritalStatus === 'Single, never married') return false;

        return (maritalStatus !== 'Married' && previousMarriages > 0) ||
               (maritalStatus === 'Married' && data.beneficiaryPreparingWhileDivorcing && previousMarriages > 0);
      }
    }
  ];

  const handleNext = () => {
    const nextPath = getNextScreen(location.pathname, userRole, currentData);
    if (nextPath) {
      navigate(nextPath);
    }
  };

  const handleBack = () => {
    const prevPath = getPreviousScreen(location.pathname, userRole, currentData);
    if (prevPath) {
      navigate(prevPath);
    }
  };

  const isFirst = isFirstScreen(location.pathname, userRole, currentData);

  // Check if form is valid
  const isFormValid = () => {
    const maritalStatusField = isSponsor ? 'sponsorMaritalStatus' : 'beneficiaryMaritalStatus';
    const maritalStatus = currentData[maritalStatusField];

    if (!maritalStatus) return false;

    // If married, check eligibility check status
    if (maritalStatus === 'Married') {
      const preparingField = isSponsor ? 'preparingWhileDivorcing' : 'beneficiaryPreparingWhileDivorcing';
      const marriedTo = currentData.marriedTo;

      // For sponsor: block if married to sponsor or someone else (not preparing)
      if (isSponsor && (!marriedTo || (marriedTo === 'sponsor') || (marriedTo === 'someone-else' && !currentData[preparingField]))) {
        return false;
      }

      // For beneficiary: require preparing while divorcing checkbox
      if (!isSponsor && !currentData[preparingField]) {
        return false;
      }
    }

    // Check previous marriages field if applicable
    const previousMarriagesField = isSponsor ? 'sponsorPreviousMarriages' : 'beneficiaryPreviousMarriages';
    const shouldShowPreviousMarriages =
      maritalStatus === 'Divorced' ||
      maritalStatus === 'Widowed' ||
      (maritalStatus === 'Married' && currentData[isSponsor ? 'preparingWhileDivorcing' : 'beneficiaryPreparingWhileDivorcing']);

    if (shouldShowPreviousMarriages && !currentData[previousMarriagesField]) {
      return false;
    }

    return true;
  };

  return (
    <ScreenLayout
      showBackButton={!isFirst}
      onBack={handleBack}
      onNext={handleNext}
      nextButtonDisabled={!isFormValid()}
    >
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900">
          {isSponsor ? 'Your Marriage Background' : `${personName}'s Marriage Background`}
        </h2>

        {/* Render fields */}
        {fields.map((field) => {
          // Check showWhen condition
          if (field.showWhen && !field.showWhen(currentData)) {
            return null;
          }

          return (
            <div key={field.id}>
              {!field.hideLabel && (
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
              )}

              <FieldRenderer
                field={field}
                currentData={currentData}
                updateField={updateField}
                fieldErrors={fieldErrors}
                setFieldErrors={setFieldErrors}
                touchedFields={touchedFields}
                setTouchedFields={setTouchedFields}
              />

              {field.helpText && (
                <p className="text-sm text-gray-600 mt-2">{field.helpText}</p>
              )}
            </div>
          );
        })}
      </div>
    </ScreenLayout>
  );
};

export default MarriageScreen;
