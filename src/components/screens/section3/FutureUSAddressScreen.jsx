import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ScreenLayout from '../../ScreenLayout';
import FieldRenderer from '../../../utils/FieldRenderer';
import { getNextScreen, getPreviousScreen, isFirstScreen } from '../../../utils/navigationUtils';

/**
 * FutureUSAddressScreen - Section 3, Future U.S. Address (Beneficiary Only)
 * Shows intended U.S. address where beneficiary plans to live
 *
 * Content from App.tsx lines 869-870 (beneficiary)
 * Structure from QUESTIONNAIRE_SECTION_STRUCTURE.md lines 185-186
 */
const FutureUSAddressScreen = ({
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

  const beneficiaryName = currentData.beneficiaryFirstName || 'the beneficiary';

  // Field definition from App.tsx line 870
  const fields = [
    {
      id: 'beneficiaryIntendedUSAddress',
      label: `Address in the United States Where ${beneficiaryName} Intends to Live`,
      type: 'address',
      required: true
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
    const futureAddress = currentData.beneficiaryIntendedUSAddress;
    return isAddressComplete(futureAddress);
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
          Future U.S. Address
        </h2>

        <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
          <p className="text-sm text-blue-800">
            <strong>💡 Why we ask this:</strong>
          </p>
          <p className="mt-2 text-sm text-blue-700">
            USCIS needs to know where {beneficiaryName} intends to live after arriving in the United States. This is typically the sponsor's address, but it doesn't have to be.
          </p>
        </div>

        {/* Render field */}
        {fields.map((field) => {
          return (
            <FieldRenderer
              key={field.id}
              field={field}
              currentData={currentData}
              updateField={updateField}
              fieldErrors={fieldErrors}
              setFieldErrors={setFieldErrors}
              touchedFields={touchedFields}
              setTouchedFields={setTouchedFields}
            />
          );
        })}
      </div>
    </ScreenLayout>
  );
};

export default FutureUSAddressScreen;
