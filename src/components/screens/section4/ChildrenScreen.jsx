import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ScreenLayout from '../../ScreenLayout';
import FieldRenderer from '../../../utils/FieldRenderer';
import { getNextScreen, getPreviousScreen, isFirstScreen } from '../../../utils/navigationUtils';

/**
 * ChildrenScreen - Section 4, Children Information (Beneficiary only)
 *
 * Shows:
 * - Does beneficiary have children? (Yes/No)
 * - Children details (if Yes)
 */
const ChildrenScreen = ({
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

  const personName = currentData.beneficiaryFirstName || 'Beneficiary';

  // Get field definitions from App.tsx
  const fields = [
    {
      id: 'beneficiaryHasChildren',
      label: `Does ${personName} have any children?`,
      type: 'select',
      options: ['Yes', 'No'],
      required: true
    },
    {
      id: 'beneficiaryChildrenDetails',
      label: 'Children Details',
      type: 'children-list',
      required: false,
      showWhen: (data) => data.beneficiaryHasChildren === 'Yes',
      helpText: 'Provide information for all children, including those from previous relationships'
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
    const hasChildren = currentData.beneficiaryHasChildren;

    if (!hasChildren) return false;

    // If has children, ensure at least one child is added with complete info
    if (hasChildren === 'Yes') {
      const childrenDetails = currentData.beneficiaryChildrenDetails || [];
      if (childrenDetails.length === 0) return false;

      // Check that all children have required fields filled
      return childrenDetails.every(child =>
        child.firstName &&
        child.lastName &&
        child.dob &&
        child.birthCountry &&
        child.currentCountry
      );
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
          {personName}'s Children
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

              {field.helpText && (
                <p className="text-sm text-gray-600 mb-2">{field.helpText}</p>
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
            </div>
          );
        })}
      </div>
    </ScreenLayout>
  );
};

export default ChildrenScreen;
