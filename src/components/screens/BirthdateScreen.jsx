import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ScreenLayout from '../ScreenLayout';
import FieldRenderer from '../../utils/FieldRenderer';
import { getNextScreen, isFirstScreen } from '../../utils/navigationUtils';

/**
 * BirthdateScreen Component - USING ACTUAL FIELD DEFINITIONS FROM APP.TSX
 *
 * Screen for collecting date of birth and place of birth using FieldRenderer component
 * Fields copied from App.tsx lines 587-588
 */
const BirthdateScreen = ({
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

  // Get sponsor first name for dynamic label
  const sponsorFirstName = currentData.sponsorFirstName || 'your';

  // Field definitions from App.tsx lines 587-588
  const birthdateFields = [
    {
      id: `${prefix}DOB`,
      label: isSponsor ? `${sponsorFirstName}'s Date of Birth` : 'Date of Birth',
      type: 'date',
      required: true
    },
    { id: `${prefix}BirthLocation`, label: 'Place of Birth', type: 'birth-location', required: true }
  ];

  // Helper to validate birth location is complete
  const isBirthLocationComplete = (birthLocation) => {
    if (!birthLocation) return false;
    const { city, country } = birthLocation;

    // Must have country and city
    if (!country || country.trim() === '') return false;
    if (!city || city.trim() === '') return false;

    return true;
  };

  // Check if all required fields are filled
  const isFormValid = () => {
    const dob = currentData[`${prefix}DOB`];
    const birthLocation = currentData[`${prefix}BirthLocation`];

    return dob && isBirthLocationComplete(birthLocation);
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
          When and where {isSponsor ? 'were you' : 'was your partner'} born?
        </h2>
        <p className="text-gray-600">
          Enter the information exactly as it appears on {isSponsor ? 'your' : 'their'} birth certificate.
        </p>
      </div>

      {/* Form Fields using FieldRenderer */}
      <div className="space-y-6">
        {birthdateFields.map(field => (
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

export default BirthdateScreen;
