import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ScreenLayout from '../ScreenLayout';
import FieldRenderer from '../../utils/FieldRenderer';
import { getNextScreen, isFirstScreen } from '../../utils/navigationUtils';

/**
 * ContactInfoScreen Component - USING ACTUAL FIELD DEFINITIONS FROM APP.TSX
 *
 * Screen for collecting contact information using FieldRenderer component
 * Fields copied from App.tsx lines 640-644
 */
const ContactInfoScreen = ({
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

  // Field definitions from App.tsx lines 640-644
  const contactFields = [
    { id: `${prefix}Email`, label: 'Email Address', type: 'smart-email', required: true },
    { id: `${prefix}Newsletter`, label: 'Keep me informed about immigration policy changes, news, and updates that may affect my case', type: 'checkbox', required: false, hideLabel: true },
    { id: `${prefix}DaytimePhone`, label: 'Daytime Phone Number', type: 'international-phone', required: true },
    { id: `${prefix}MobilePhone`, label: 'Mobile Phone Number', type: 'international-phone', required: false }
  ];

  return (
    <ScreenLayout
      showBackButton={!isFirst}
      onNext={handleNext}
      nextButtonDisabled={!currentData[`${prefix}Email`] || !currentData[`${prefix}DaytimePhone`]}
    >
      {/* Screen Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          What is {isSponsor ? 'your' : 'your partner\'s'} contact information?
        </h2>
        <p className="text-gray-600">
          We'll use this to send important updates about the visa application.
        </p>
      </div>

      {/* Form Fields using FieldRenderer */}
      <div className="space-y-6">
        {contactFields.map(field => (
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

export default ContactInfoScreen;
