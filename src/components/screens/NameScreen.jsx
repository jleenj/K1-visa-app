import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ScreenLayout from '../ScreenLayout';
import FieldRenderer from '../../utils/FieldRenderer';
import { getNextScreen, isFirstScreen } from '../../utils/navigationUtils';

/**
 * NameScreen Component - USING ACTUAL FIELD DEFINITIONS FROM APP.TSX
 *
 * Screen for collecting name information using FieldRenderer component
 * Fields copied from App.tsx lines 578-584
 */
const NameScreen = ({
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

  // Field definitions from App.tsx lines 578-584
  const nameFields = [
    { id: `${prefix}LastName`, label: 'Legal Last Name (Family Name)', type: 'text', required: true },
    { id: `${prefix}FirstName`, label: 'Legal First Name (Given Name)', type: 'text', required: true },
    { id: `${prefix}MiddleName`, label: 'Middle Name', type: 'text', required: false },
    { id: `${prefix}OtherNames`, label: 'Other Names Used (aliases, maiden name, nicknames)', type: 'other-names', required: false }
  ];

  // Add native alphabet fields for beneficiary
  if (!isSponsor) {
    nameFields.push(
      { id: 'beneficiaryNativeLastName', label: 'Last Name in Native Alphabet', type: 'text', required: false },
      { id: 'beneficiaryNativeFirstName', label: 'First Name in Native Alphabet', type: 'text', required: false },
      { id: 'beneficiaryNativeMiddleName', label: 'Middle Name in Native Alphabet', type: 'text', required: false }
    );
  }

  return (
    <ScreenLayout
      showBackButton={!isFirst}
      onNext={handleNext}
      nextButtonDisabled={!currentData[`${prefix}FirstName`] || !currentData[`${prefix}LastName`]}
    >
      {/* Screen Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          What is {isSponsor ? 'your' : 'your partner\'s'} full legal name?
        </h2>
        <p className="text-gray-600">
          Enter the name exactly as it appears on {isSponsor ? 'your' : 'their'} passport or birth certificate.
        </p>
      </div>

      {/* Form Fields using FieldRenderer */}
      <div className="space-y-6">
        {nameFields.map(field => (
          <FieldRenderer
            key={field.id}
            field={field}
            currentData={currentData}
            updateField={updateField}
            touchedFields={touchedFields}
            setTouchedFields={setTouchedFields}
            fieldErrors={fieldErrors}
            setFieldErrors={setFieldErrors}
          />
        ))}

        {/* Native Alphabet Section Header for Beneficiary */}
        {!isSponsor && nameFields.length > 4 && (
          <div className="border-t border-gray-200 pt-6 mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Name in Native Alphabet (if applicable)
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              If your name is written in a non-Latin alphabet (Arabic, Chinese, Cyrillic, etc.),
              please provide it here.
            </p>
          </div>
        )}
      </div>
    </ScreenLayout>
  );
};

export default NameScreen;
