import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ScreenLayout from '../ScreenLayout';
import FieldRenderer from '../../utils/FieldRenderer';
import { getNextScreen, isFirstScreen } from '../../utils/navigationUtils';

/**
 * CitizenshipScreen Component - USING ACTUAL FIELD DEFINITIONS FROM APP.TSX
 *
 * Screen for collecting citizenship and identification information using FieldRenderer component
 * Fields copied from App.tsx lines 590, 619-630
 */
const CitizenshipScreen = ({
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

  // Field definitions from App.tsx lines 590, 619-630 (sponsor only)
  const citizenshipFields = isSponsor ? [
    { id: 'sponsorSSN', label: 'Social Security Number', type: 'ssn', required: true },
    { id: 'sponsorANumber', label: 'USCIS File Number (A-Number) if any', type: 'a-number', required: false },
    { id: 'sponsorUSCISAccount', label: 'USCIS Online Account Number (if any)', type: 'uscis-account', required: false },
    { id: 'sponsorCitizenshipThrough', label: 'How did you obtain U.S. citizenship?', type: 'citizenship-method', required: true },
    { id: 'sponsorHasCertificate', label: 'Do you have a Certificate of Naturalization or Certificate of Citizenship in your own name?', type: 'cert-question', required: true },
    { id: 'sponsorCertNumber', label: 'Certificate Number', type: 'cert-number', required: true, showWhen: (data) => data.sponsorHasCertificate === 'Yes' },
    { id: 'sponsorCertIssueDate', label: 'Date of Issuance', type: 'date', required: true, showWhen: (data) => data.sponsorHasCertificate === 'Yes' },
    { id: 'sponsorCertIssuePlace', label: 'Place of Issuance', type: 'cert-place', required: true, showWhen: (data) => data.sponsorHasCertificate === 'Yes' }
  ] : [
    // Beneficiary citizenship fields would go here
    { id: 'beneficiaryCitizenship', label: 'Country of Citizenship or Nationality', type: 'select', options: ['Afghanistan', 'Albania', 'Algeria', 'Argentina', 'Australia', 'Austria', 'Bangladesh', 'Belgium', 'Brazil', 'Canada', 'Chile', 'China', 'Colombia', 'Denmark', 'Egypt', 'France', 'Germany', 'Greece', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Japan', 'Kenya', 'Mexico', 'Netherlands', 'New Zealand', 'Nigeria', 'Norway', 'Pakistan', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Russia', 'Saudi Arabia', 'South Africa', 'South Korea', 'Spain', 'Sweden', 'Switzerland', 'Thailand', 'Turkey', 'Ukraine', 'United Kingdom', 'Venezuela', 'Vietnam'], required: true }
  ];

  // Check if all required fields are filled
  const isFormValid = () => {
    if (isSponsor) {
      // Sponsor must have SSN, citizenship method, and certificate question answered
      const hasBasicFields = currentData.sponsorSSN &&
                             currentData.sponsorCitizenshipThrough &&
                             currentData.sponsorHasCertificate;

      // If they have a certificate, also require certificate details
      if (currentData.sponsorHasCertificate === 'Yes') {
        return hasBasicFields &&
               currentData.sponsorCertNumber &&
               currentData.sponsorCertIssueDate &&
               currentData.sponsorCertIssuePlace;
      }

      return hasBasicFields;
    } else {
      // Beneficiary just needs citizenship
      return currentData.beneficiaryCitizenship;
    }
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
          {isSponsor ? 'U.S. Citizenship & Identification' : 'Citizenship Information'}
        </h2>
        <p className="text-gray-600">
          {isSponsor
            ? 'We need to verify your U.S. citizenship and collect identification numbers.'
            : 'Please provide your citizenship information.'}
        </p>
      </div>

      {/* Form Fields using FieldRenderer */}
      <div className="space-y-6">
        {citizenshipFields.map(field => (
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

export default CitizenshipScreen;
