import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ScreenLayout from '../ScreenLayout';
import FieldRenderer from '../../utils/FieldRenderer';
import { getNextScreen, isFirstScreen } from '../../utils/navigationUtils';

/**
 * PhysicalDescriptionScreen Component - USING ACTUAL FIELD DEFINITIONS FROM APP.TSX
 *
 * Screen for collecting biographic and physical description using FieldRenderer component
 * Fields copied from App.tsx lines 589, 593-616
 */
const PhysicalDescriptionScreen = ({
  currentData,
  updateField,
  userRole,
  isSponsor = true
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const prefix = isSponsor ? 'sponsor' : 'beneficiary';

  // State for field validation tracking
  const [touchedFields, setTouchedFields] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});

  const handleNext = () => {
    const nextPath = getNextScreen(location.pathname, userRole);
    if (nextPath) {
      navigate(nextPath);
    }
  };

  const isFirst = isFirstScreen(location.pathname, userRole);

  // Field definitions from App.tsx lines 589, 593-616
  const physicalFields = [
    {
      id: `${prefix}Sex`,
      label: 'Sex',
      type: 'select',
      options: ['Male', 'Female'],
      required: true,
      helpText: 'Please note: Starting January 2025, USCIS made the decision to recognize only two biological sexes - male and female - on all immigration forms.'
    },
    {
      id: `${prefix}Ethnicity`,
      label: 'Ethnicity',
      type: 'select',
      options: ['Hispanic or Latino', 'Not Hispanic or Latino'],
      required: true
    },
    {
      id: `${prefix}Race`,
      label: 'Race (Select all that apply)',
      type: 'multi-select',
      options: ['American Indian or Alaska Native', 'Asian', 'Black or African American', 'Native Hawaiian or Other Pacific Islander', 'White'],
      required: true
    },
    { id: `${prefix}Height`, label: 'Height', type: 'height-converter', required: true },
    { id: `${prefix}Weight`, label: 'Weight', type: 'weight', required: true },
    {
      id: `${prefix}EyeColor`,
      label: 'Eye Color',
      type: 'select',
      options: ['Black', 'Blue', 'Brown', 'Gray', 'Green', 'Hazel', 'Maroon', 'Pink', 'Unknown/Other'],
      required: true
    },
    {
      id: `${prefix}HairColor`,
      label: 'Hair Color',
      type: 'select',
      options: ['Bald (No hair)', 'Black', 'Blonde', 'Brown', 'Gray', 'Red', 'Sandy', 'White', 'Unknown/Other'],
      required: true
    }
  ];

  // Check if all required fields are filled
  const isFormValid = () => {
    return currentData[`${prefix}Sex`] &&
           currentData[`${prefix}Ethnicity`] &&
           currentData[`${prefix}Race`] &&
           currentData[`${prefix}Height`] &&
           currentData[`${prefix}Weight`] &&
           currentData[`${prefix}EyeColor`] &&
           currentData[`${prefix}HairColor`];
  };

  return (
    <ScreenLayout
      showBackButton={!isFirst}
      onNext={handleNext}
      nextButtonDisabled={!isFormValid()}
    >
      {/* Screen Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Physical Description
        </h2>
        <p className="text-gray-600">
          Provide {isSponsor ? 'your' : 'your partner\'s'} biographic and physical information.
        </p>
      </div>

      {/* Form Fields using FieldRenderer */}
      <div className="space-y-6">
        {physicalFields.map(field => (
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
              touchedFields={touchedFields}
              setTouchedFields={setTouchedFields}
              fieldErrors={fieldErrors}
              setFieldErrors={setFieldErrors}
            />
          </div>
        ))}
      </div>
    </ScreenLayout>
  );
};

export default PhysicalDescriptionScreen;
