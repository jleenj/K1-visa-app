import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ScreenLayout from '../../ScreenLayout';
import FieldRenderer from '../../../utils/FieldRenderer';
import { getNextScreen, getPreviousScreen, isFirstScreen } from '../../../utils/navigationUtils';
import { Info } from 'lucide-react';

/**
 * ParentsScreen - Section 4, Parents Information
 *
 * Shows:
 * - First Parent's information (name, DOB, sex, birth country, residence)
 * - Second Parent's information (name, DOB, sex, birth country, residence)
 * - Info panel about USCIS requirements for parent information
 */
const ParentsScreen = ({
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
    // First Parent's Information
    {
      id: 'sponsorParent1Header',
      type: 'section-header',
      label: "First Parent's Information"
    },
    {
      id: 'sponsorParent1InfoPanel',
      type: 'info-panel',
      label: 'USCIS requires a best-effort basis for finding this information - such as reaching out to family members or checking old records. In rare cases - such as for those raised in institutional settings like orphanages or foster care with no parental records - "Unknown" is acceptable.',
      hideLabel: true
    },
    {
      id: 'sponsorParent1FirstName',
      label: "First Parent's First Name",
      type: 'text',
      required: true,
      allowUnknown: true
    },
    {
      id: 'sponsorParent1MiddleName',
      label: "First Parent's Middle Name",
      type: 'text',
      required: false,
      allowUnknown: true
    },
    {
      id: 'sponsorParent1LastName',
      label: "First Parent's Last Name",
      type: 'text',
      required: true,
      allowUnknown: true
    },
    {
      id: 'sponsorParent1DOB',
      label: "First Parent's Date of Birth",
      type: 'date',
      required: true,
      allowUnknown: true
    },
    {
      id: 'sponsorParent1Sex',
      label: "First Parent's Sex",
      type: 'select',
      options: ['Male', 'Female'],
      required: true,
      allowUnknown: true
    },
    {
      id: 'sponsorParent1BirthCountry',
      label: "First Parent's Country of Birth",
      type: 'country',
      required: true,
      allowUnknown: true
    },
    {
      id: 'sponsorParent1ResidenceCountry',
      label: "First Parent's Country of Residence",
      type: 'country',
      required: true,
      allowUnknown: true
    },
    {
      id: 'sponsorParent1ResidenceCity',
      label: "First Parent's City/Town/Village of Residence",
      type: 'text',
      required: true,
      allowUnknown: true,
      helpText: '• Enter the most specific location where your parent resides. For cities, use the official city name. For small towns or villages, use that name even if it\'s very small.\n\n• If the parent is deceased, please enter their last known residence before they passed away'
    },

    // Second Parent's Information
    {
      id: 'sponsorParent2Header',
      type: 'section-header',
      label: "Second Parent's Information"
    },
    {
      id: 'sponsorParent2FirstName',
      label: "Second Parent's First Name",
      type: 'text',
      required: true,
      allowUnknown: true
    },
    {
      id: 'sponsorParent2MiddleName',
      label: "Second Parent's Middle Name",
      type: 'text',
      required: false,
      allowUnknown: true
    },
    {
      id: 'sponsorParent2LastName',
      label: "Second Parent's Last Name",
      type: 'text',
      required: true,
      allowUnknown: true
    },
    {
      id: 'sponsorParent2DOB',
      label: "Second Parent's Date of Birth",
      type: 'date',
      required: true,
      allowUnknown: true
    },
    {
      id: 'sponsorParent2Sex',
      label: "Second Parent's Sex",
      type: 'select',
      options: ['Male', 'Female'],
      required: true,
      allowUnknown: true
    },
    {
      id: 'sponsorParent2BirthCountry',
      label: "Second Parent's Country of Birth",
      type: 'country',
      required: true,
      allowUnknown: true
    },
    {
      id: 'sponsorParent2ResidenceCountry',
      label: "Second Parent's Country of Residence",
      type: 'country',
      required: true,
      allowUnknown: true
    },
    {
      id: 'sponsorParent2ResidenceCity',
      label: "Second Parent's City/Town/Village of Residence",
      type: 'text',
      required: true,
      allowUnknown: true,
      helpText: '• Enter the most specific location where your parent resides. For cities, use the official city name. For small towns or villages, use that name even if it\'s very small.\n\n• If the parent is deceased, please enter their last known residence before they passed away'
    }
  ] : [
    // First Parent's Information
    {
      id: 'beneficiaryParent1Header',
      type: 'section-header',
      label: "First Parent's Information"
    },
    {
      id: 'beneficiaryParent1InfoPanel',
      type: 'info-panel',
      label: 'USCIS requires a best-effort basis for finding this information - such as reaching out to family members or checking old records. In rare cases - such as for those raised in institutional settings like orphanages or foster care with no parental records - "Unknown" is acceptable.',
      hideLabel: true
    },
    {
      id: 'beneficiaryParent1FirstName',
      label: "First Parent's First Name",
      type: 'text',
      required: true,
      allowUnknown: true
    },
    {
      id: 'beneficiaryParent1MiddleName',
      label: "First Parent's Middle Name",
      type: 'text',
      required: false,
      allowUnknown: true
    },
    {
      id: 'beneficiaryParent1LastName',
      label: "First Parent's Last Name",
      type: 'text',
      required: true,
      allowUnknown: true
    },
    {
      id: 'beneficiaryParent1DOB',
      label: "First Parent's Date of Birth",
      type: 'date',
      required: true,
      allowUnknown: true
    },
    {
      id: 'beneficiaryParent1Sex',
      label: "First Parent's Sex",
      type: 'select',
      options: ['Male', 'Female'],
      required: true,
      allowUnknown: true
    },
    {
      id: 'beneficiaryParent1BirthCountry',
      label: "First Parent's Country of Birth",
      type: 'country',
      required: true,
      allowUnknown: true
    },
    {
      id: 'beneficiaryParent1ResidenceCountry',
      label: "First Parent's Country of Residence",
      type: 'country',
      required: true,
      allowUnknown: true
    },
    {
      id: 'beneficiaryParent1ResidenceCity',
      label: "First Parent's City/Town/Village of Residence",
      type: 'text',
      required: true,
      allowUnknown: true,
      helpText: `• Enter the most specific location where ${personName}'s parent resides. For cities, use the official city name. For small towns or villages, use that name even if it's very small.\n\n• If the parent is deceased, please enter their last known residence before they passed away`
    },

    // Second Parent's Information
    {
      id: 'beneficiaryParent2Header',
      type: 'section-header',
      label: "Second Parent's Information"
    },
    {
      id: 'beneficiaryParent2FirstName',
      label: "Second Parent's First Name",
      type: 'text',
      required: true,
      allowUnknown: true
    },
    {
      id: 'beneficiaryParent2MiddleName',
      label: "Second Parent's Middle Name",
      type: 'text',
      required: false,
      allowUnknown: true
    },
    {
      id: 'beneficiaryParent2LastName',
      label: "Second Parent's Last Name",
      type: 'text',
      required: true,
      allowUnknown: true
    },
    {
      id: 'beneficiaryParent2DOB',
      label: "Second Parent's Date of Birth",
      type: 'date',
      required: true,
      allowUnknown: true
    },
    {
      id: 'beneficiaryParent2Sex',
      label: "Second Parent's Sex",
      type: 'select',
      options: ['Male', 'Female'],
      required: true,
      allowUnknown: true
    },
    {
      id: 'beneficiaryParent2BirthCountry',
      label: "Second Parent's Country of Birth",
      type: 'country',
      required: true,
      allowUnknown: true
    },
    {
      id: 'beneficiaryParent2ResidenceCountry',
      label: "Second Parent's Country of Residence",
      type: 'country',
      required: true,
      allowUnknown: true
    },
    {
      id: 'beneficiaryParent2ResidenceCity',
      label: "Second Parent's City/Town/Village of Residence",
      type: 'text',
      required: true,
      allowUnknown: true,
      helpText: `• Enter the most specific location where ${personName}'s parent resides. For cities, use the official city name. For small towns or villages, use that name even if it's very small.\n\n• If the parent is deceased, please enter their last known residence before they passed away`
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

  // Check if form is valid - all required fields must be filled or marked as unknown
  const isFormValid = () => {
    const requiredFields = fields.filter(f => f.required && f.type !== 'section-header' && f.type !== 'info-panel');

    return requiredFields.every(field => {
      const value = currentData[field.id];
      const unknownField = `${field.id}Unknown`;
      const isUnknown = currentData[unknownField];

      return (value && value !== '') || isUnknown;
    });
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
          {isSponsor ? 'Your Parents' : `${personName}'s Parents`}
        </h2>

        <p className="text-sm text-gray-600">
          Please provide information about {isSponsor ? 'your' : `${personName}'s`} parents.
        </p>

        {/* Render fields */}
        {fields.map((field) => {
          // Render section headers differently
          if (field.type === 'section-header') {
            return (
              <div key={field.id} className="mt-8 mb-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                  {field.label}
                </h3>
              </div>
            );
          }

          // Render info panels
          if (field.type === 'info-panel') {
            return (
              <div key={field.id} className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                <div className="flex items-start">
                  <Info className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                  <p className="text-sm text-blue-800">{field.label}</p>
                </div>
              </div>
            );
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
            </div>
          );
        })}
      </div>
    </ScreenLayout>
  );
};

export default ParentsScreen;
