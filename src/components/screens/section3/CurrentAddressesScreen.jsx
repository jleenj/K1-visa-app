import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ScreenLayout from '../../ScreenLayout';
import FieldRenderer, { addressFormats } from '../../../utils/FieldRenderer';
import { getNextScreen, getPreviousScreen, isFirstScreen } from '../../../utils/navigationUtils';

/**
 * CurrentAddressesScreen - Section 3, Current Addresses
 * Shows mailing address, physical address option, and move-in date
 *
 * Content from App.tsx lines 656-666 (sponsor) or 854-864 (beneficiary)
 * Structure from QUESTIONNAIRE_SECTION_STRUCTURE.md lines 117-125
 */
const CurrentAddressesScreen = ({
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
  const [showInfoPanel, setShowInfoPanel] = useState(false);

  // Determine if this is sponsor or beneficiary based on URL
  const isSponsor = location.pathname.includes('section-3-address-history') &&
                    !location.pathname.includes('beneficiary');
  const prefix = isSponsor ? 'sponsor' : 'beneficiary';
  const personName = isSponsor ? 'Your' : (currentData.beneficiaryFirstName || "Beneficiary's");

  // Field definitions from App.tsx lines 656-666 (sponsor) or 854-864 (beneficiary)
  const fields = [
    // Mailing Address (FIRST)
    {
      id: `${prefix}MailingAddress`,
      label: 'Mailing Address',
      type: 'address-with-careof',
      required: true
    },

    // Check if physical is different
    {
      id: `${prefix}MailingDifferent`,
      label: isSponsor
        ? 'Is your physical address different from your mailing address?'
        : `Is ${personName}'s physical address different from the mailing address?`,
      type: 'select',
      options: ['Yes', 'No'],
      required: true
    },

    // Physical Address (conditional)
    {
      id: `${prefix}CurrentAddress`,
      label: 'Current Physical Address',
      type: 'address-with-careof',
      required: true,
      showWhen: (data) => data[`${prefix}MailingDifferent`] === 'Yes'
    }
  ];

  // Add beneficiary-only field: Address in Native Alphabet
  // Only show if beneficiary's country uses non-Latin alphabet
  if (!isSponsor) {
    // Helper function to check if beneficiary's address country uses non-Latin alphabet
    const beneficiaryUsesNonLatinAlphabet = () => {
      // Check both current and mailing address for country
      const mailingAddress = currentData.beneficiaryMailingAddress;
      const currentAddress = currentData.beneficiaryCurrentAddress;
      const mailingDifferent = currentData.beneficiaryMailingDifferent;

      // Determine which address to check (physical if different, otherwise mailing)
      const addressToCheck = mailingDifferent === 'Yes' ? currentAddress : mailingAddress;

      if (!addressToCheck || !addressToCheck.country) {
        return false; // Don't show if no country selected yet
      }

      const countryFormat = addressFormats[addressToCheck.country];
      return countryFormat && countryFormat.usesNonLatinAlphabet === true;
    };

    fields.push({
      id: 'beneficiaryNativeAddress',
      label: 'Address in Native Alphabet',
      type: 'native-alphabet-address',
      required: true,
      helpText: 'Provide the current physical address (or mailing address if same) written in the native script of your country',
      showWhen: beneficiaryUsesNonLatinAlphabet
    });
  }

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

  // Helper function to validate if address has all required fields
  const isAddressComplete = (address) => {
    if (!address) return false;

    // Required fields for all addresses
    const hasBasicFields = address.street &&
                          address.city &&
                          address.zipCode &&
                          address.country;

    if (!hasBasicFields) return false;

    // US addresses also require state
    if (address.country === 'United States') {
      return address.state && address.state.trim() !== '';
    }

    // Canada addresses also require province
    if (address.country === 'Canada') {
      return address.province && address.province.trim() !== '';
    }

    // All other countries just need basic fields
    return true;
  };

  // Check if all required fields are filled
  const isFormValid = () => {
    // Mailing address must be complete
    const mailingAddress = currentData[`${prefix}MailingAddress`];
    if (!isAddressComplete(mailingAddress)) {
      return false;
    }

    // "Is physical different?" must be answered
    const mailingDifferent = currentData[`${prefix}MailingDifferent`];
    if (!mailingDifferent) {
      return false;
    }

    // If physical is different, current address must be complete
    if (mailingDifferent === 'Yes') {
      const currentAddress = currentData[`${prefix}CurrentAddress`];
      if (!isAddressComplete(currentAddress)) {
        return false;
      }
    }

    // For beneficiary only: Check if native alphabet address is required and provided
    if (!isSponsor) {
      // Determine which address to check (physical if different, otherwise mailing)
      const addressToCheck = mailingDifferent === 'Yes' ? currentData.beneficiaryCurrentAddress : mailingAddress;

      // Check if this country uses non-Latin alphabet
      if (addressToCheck && addressToCheck.country) {
        const countryFormat = addressFormats[addressToCheck.country];
        if (countryFormat && countryFormat.usesNonLatinAlphabet === true) {
          const nativeAddress = currentData.beneficiaryNativeAddress;
          // Native address must have all required fields
          if (!nativeAddress ||
              !nativeAddress.street || !nativeAddress.street.trim() ||
              !nativeAddress.city || !nativeAddress.city.trim() ||
              !nativeAddress.zipCode || !nativeAddress.zipCode.trim()) {
            return false;
          }

          // Check if province is required for this country
          if (countryFormat.stateRequired === true) {
            if (!nativeAddress.province || !nativeAddress.province.trim()) {
              return false;
            }
          }
        }
      }
    }

    return true;
  };

  return (
    <>
      {/* Info Panel for In Care Of */}
      <div className={`fixed top-0 right-0 h-full w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${showInfoPanel ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="h-full overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">What is "In Care Of"?</h3>
              <button
                type="button"
                onClick={() => setShowInfoPanel(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4 text-sm text-gray-700">
              <p className="text-gray-600">
                "In Care Of" (often abbreviated as "c/o") is used when mail for you is being sent to someone else's address.
                It tells the postal service who should receive and hold your mail at that address.
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-3">Common Examples:</h4>

                <div className="space-y-3">
                  <div className="border-l-4 border-blue-400 pl-3">
                    <p className="font-medium text-blue-800">Living with someone temporarily:</p>
                    <p className="text-gray-600 text-xs mt-1">You're staying with your friend John Smith</p>
                    <div className="bg-white rounded p-2 mt-2 text-xs font-mono">
                      In Care Of: John Smith<br />
                      123 Main Street<br />
                      City, State ZIP
                    </div>
                  </div>

                  <div className="border-l-4 border-blue-400 pl-3">
                    <p className="font-medium text-blue-800">Using a business address:</p>
                    <p className="text-gray-600 text-xs mt-1">You receive mail at your workplace</p>
                    <div className="bg-white rounded p-2 mt-2 text-xs font-mono">
                      In Care Of: ABC Company<br />
                      456 Business Blvd
                    </div>
                  </div>

                  <div className="border-l-4 border-blue-400 pl-3">
                    <p className="font-medium text-blue-800">Staying with family:</p>
                    <p className="text-gray-600 text-xs mt-1">Living with parents but mail comes in their name</p>
                    <div className="bg-white rounded p-2 mt-2 text-xs font-mono">
                      In Care Of: Mr. and Mrs. Johnson
                    </div>
                  </div>

                  <div className="border-l-4 border-blue-400 pl-3">
                    <p className="font-medium text-blue-800">Using a mail service:</p>
                    <div className="bg-white rounded p-2 mt-2 text-xs font-mono">
                      In Care Of: UPS Store #1234<br />
                      Or: Your Attorney's Name
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-900 mb-2">Why you might use it:</h4>
                <ul className="list-disc list-inside space-y-1 text-xs text-gray-600">
                  <li>Mail going to a relative's house while traveling</li>
                  <li>Using an attorney's office for important documents</li>
                  <li>Temporarily staying somewhere while maintaining a permanent address elsewhere</li>
                  <li>Having someone reliable receive time-sensitive USCIS mail</li>
                </ul>
              </div>

              <div className="bg-gray-100 rounded-lg p-3">
                <p className="font-semibold text-gray-800 text-sm">✨ Bottom line:</p>
                <p className="text-xs mt-1">
                  If mail comes directly to you at your own address, leave this blank. Only fill it in if someone
                  else's name needs to be on the mail for it to be properly delivered to you.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay when panel is open */}
      {showInfoPanel && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setShowInfoPanel(false)}
        />
      )}

      <ScreenLayout
        showBackButton={!isFirst}
        onBack={handleBack}
        onNext={handleNext}
        nextButtonDisabled={!isFormValid()}
      >
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            {isSponsor ? 'Your Current Addresses' : `${personName}'s Current Addresses`}
          </h2>

          <p className="text-sm text-gray-600">
            Provide your current mailing and physical addresses. These must be complete and accurate for USCIS correspondence.
          </p>

        {/* Render all fields */}
        {fields.map((field) => {
          // Check if field should be shown based on showWhen condition
          if (field.showWhen && !field.showWhen(currentData)) {
            return null;
          }

          return (
            <div key={field.id}>
              {/* Render label for non-address fields (address fields render their own labels) */}
              {field.type !== 'address-with-careof' && !field.hideLabel && (
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
                showInfoPanel={showInfoPanel}
                setShowInfoPanel={setShowInfoPanel}
              />
            </div>
          );
        })}
      </div>
    </ScreenLayout>
    </>
  );
};

export default CurrentAddressesScreen;
