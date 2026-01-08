import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ScreenLayout from '../../ScreenLayout';
import FieldRenderer from '../../../utils/FieldRenderer';
import { getNextScreen, getPreviousScreen, isFirstScreen } from '../../../utils/navigationUtils';

/**
 * AddressHistoryScreen - Section 3, Address History (Conversational Flow)
 *
 * Shows:
 * 1. Current address from previous screen
 * 2. "When did you move there?" - move-in date field
 * 3. Conditionally shows based on move-in date and age:
 *    - If age ≤ 23 AND 5+ years: "You're all set!"
 *    - If < 5 years: Previous address fields
 *    - If age 24+: States/countries since 18
 *
 * Uses natural language, context preservation, and inline messages
 */
const AddressHistoryScreen = ({
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
  const isSponsor = location.pathname.includes('section-3-address-history') &&
                    !location.pathname.includes('beneficiary');
  const prefix = isSponsor ? 'sponsor' : 'beneficiary';
  const personName = isSponsor ? 'Your' : (currentData.beneficiaryFirstName || "Beneficiary's");

  // Get current address from previous screen
  const mailingDifferent = currentData[`${prefix}MailingDifferent`];
  const currentAddress = mailingDifferent === 'Yes'
    ? currentData[`${prefix}CurrentAddress`]
    : currentData[`${prefix}MailingAddress`];

  // Format address for display
  const formatAddress = (addr) => {
    if (!addr || !addr.country) return '';

    const parts = [];
    if (addr.street) parts.push(addr.street);
    if (addr.unitType && addr.unitNumber) parts.push(`${addr.unitType} ${addr.unitNumber}`);
    if (addr.city) parts.push(addr.city);
    if (addr.state) parts.push(addr.state);
    if (addr.zipCode) parts.push(addr.zipCode);
    if (addr.country) parts.push(addr.country);

    return parts.join(', ');
  };

  const displayAddress = formatAddress(currentAddress);

  // Calculate age from DOB
  const calculateAge = (dob) => {
    if (!dob) return null;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Calculate date when user turned 18
  const getAgeAt18Date = (dob) => {
    if (!dob) return null;
    const birthDate = new Date(dob);
    const age18Date = new Date(birthDate);
    age18Date.setFullYear(birthDate.getFullYear() + 18);
    return age18Date;
  };

  const userDOB = currentData[`${prefix}DOB`];
  const userAge = calculateAge(userDOB);
  const age18Date = getAgeAt18Date(userDOB);

  // Format date range for "since age 18" message
  const formatDateRange = () => {
    if (!age18Date) return '';
    const options = { year: 'numeric', month: 'long' };
    return age18Date.toLocaleDateString('en-US', options);
  };

  // Check if move-in date requires address history
  const moveInDate = currentData[`${prefix}AddressDuration`];
  const fiveYearsAgo = new Date();
  fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);

  // Logic: If they moved to current address AFTER the 5-year cutoff date,
  // we need previous addresses to fill the gap from 5-years-ago to move-in date
  const needsAddressHistory = moveInDate && new Date(moveInDate) > fiveYearsAgo;

  // Format date for conversational messages
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const fiveYearsAgoFormatted = formatDate(fiveYearsAgo.toISOString().split('T')[0]);
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

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
    // Must have move-in date
    if (!moveInDate) return false;

    // If needs address history, check that all addresses are complete
    if (needsAddressHistory) {
      const addressHistory = currentData[`${prefix}AddressHistory`];

      // Must have at least one previous address
      if (!addressHistory || addressHistory.length === 0) {
        return false;
      }

      // All addresses must be complete with required fields
      const allAddressesComplete = addressHistory.every(addr => {
        // Check if address is complete
        if (!isAddressComplete(addr)) return false;

        // Also check if date range is provided
        if (!addr.dateFrom || !addr.dateTo) return false;

        return true;
      });

      if (!allAddressesComplete) {
        return false;
      }
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
          {isSponsor ? 'Your Address History' : `${personName}'s Address History`}
        </h2>

        {/* Show current address from previous screen */}
        {displayAddress && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-2">
              {isSponsor ? "You told us your current address is:" : `${personName}'s current address is:`}
            </p>
            <p className="text-base font-medium text-gray-900">
              📍 {displayAddress}
            </p>
          </div>
        )}

        {/* Move-in date question */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            When did {isSponsor ? 'you' : personName} move there?
            <span className="text-red-500 ml-1">*</span>
          </label>
          <FieldRenderer
            field={{
              id: `${prefix}AddressDuration`,
              type: 'date',
              required: true
            }}
            currentData={currentData}
            updateField={updateField}
            fieldErrors={fieldErrors}
            setFieldErrors={setFieldErrors}
            touchedFields={touchedFields}
            setTouchedFields={setTouchedFields}
          />
        </div>

        {/* Conditional messages based on age and move-in date */}
        {moveInDate && (
          <>
            {/* Case 1: Age ≤ 22 and 5+ years - "You're all set!" */}
            {!needsAddressHistory && userAge !== null && userAge <= 22 && (
              <div className="bg-green-50 border-l-4 border-green-400 p-4">
                <p className="text-sm text-green-800">
                  ✓ {isSponsor ? "You're" : `${personName} is`} all set! No additional address history required.
                </p>
              </div>
            )}

            {/* Case 2: Move-in date < 5 years - Show previous addresses */}
            {needsAddressHistory && (
              <div className="space-y-4">
                <p className="text-sm text-gray-700">
                  We need {isSponsor ? 'your' : `${personName}'s`} complete address history for the past 5 years
                  (back to {fiveYearsAgoFormatted}). Since {isSponsor ? 'you' : personName} moved to {isSponsor ? 'your' : 'their'} current
                  address on {formatDate(moveInDate)}, please add each address {isSponsor ? 'you' : personName} lived
                  at <strong>before</strong> that date, going back to {fiveYearsAgoFormatted}.
                </p>

                <FieldRenderer
                  field={{
                    id: `${prefix}AddressHistory`,
                    label: 'Previous Addresses',
                    type: 'conditional-address-history',
                    required: true
                  }}
                  currentData={currentData}
                  updateField={updateField}
                  fieldErrors={fieldErrors}
                  setFieldErrors={setFieldErrors}
                  touchedFields={touchedFields}
                  setTouchedFields={setTouchedFields}
                />
              </div>
            )}
          </>
        )}
      </div>
    </ScreenLayout>
  );
};

export default AddressHistoryScreen;
