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

  // Field definitions per QUESTIONNAIRE_SECTION_STRUCTURE.md lines 38-41
  const contactFields = [
    { id: `${prefix}Email`, label: 'Email Address', type: 'smart-email', required: true },
    { id: `${prefix}DaytimePhone`, label: 'Daytime Phone Number', type: 'international-phone', required: true },
    { id: `${prefix}MobilePhone`, label: 'Mobile Phone Number', type: 'international-phone', required: false }
  ];

  // Helper to validate email is complete
  const isEmailComplete = (email) => {
    if (!email) return false;
    const { localPart, domain, customDomain } = email;

    // Must have local part
    if (!localPart || localPart.trim() === '') return false;

    // Must have domain
    if (!domain || domain.trim() === '') return false;

    // If domain is 'other', must have customDomain
    if (domain === 'other' && (!customDomain || customDomain.trim() === '')) return false;

    return true;
  };

  // Helper to validate phone is complete
  const isPhoneComplete = (phone) => {
    if (!phone) return false;
    const { country, number } = phone;

    // Must have country (defaults to 'US', so check if number exists)
    if (!number || number.trim() === '') return false;

    // Check minimum digits based on country
    const phoneDigits = number.replace(/\D/g, '').length;
    const minDigits = (country === 'US' || country === 'CA') ? 10 : 7;

    return phoneDigits >= minDigits;
  };

  // Check if all required fields are filled
  const isFormValid = () => {
    const email = currentData[`${prefix}Email`];
    const daytimePhone = currentData[`${prefix}DaytimePhone`];

    return isEmailComplete(email) && isPhoneComplete(daytimePhone);
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
