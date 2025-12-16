import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ScreenLayout from '../ScreenLayout';
import { getNextScreen, isFirstScreen } from '../../utils/navigationUtils';

/**
 * AddressHistoryScreen Component
 *
 * Screen for collecting 5-year address history
 * TODO: Implement full timeline widget with gap detection
 */
const AddressHistoryScreen = ({
  currentData,
  updateField,
  userRole,
  isSponsor = true
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const prefix = isSponsor ? 'sponsor' : 'beneficiary';

  const handleNext = () => {
    const nextPath = getNextScreen(location.pathname, userRole);
    if (nextPath) {
      navigate(nextPath);
    }
  };

  const isFirst = isFirstScreen(location.pathname, userRole);

  // Get current address
  const currentAddress = currentData[`${prefix}CurrentAddress`] || {};

  // Check if at least current address is filled
  const isFormValid = () => {
    return currentAddress.street &&
           currentAddress.city &&
           currentAddress.country &&
           currentAddress.postalCode;
  };

  const handleAddressChange = (field, value) => {
    updateField(`${prefix}CurrentAddress`, {
      ...currentAddress,
      [field]: value
    });
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
          Address History
        </h2>
        <p className="text-gray-600">
          Provide {isSponsor ? 'your' : 'your partner\'s'} current address and previous addresses for the last 5 years.
        </p>
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> This is a placeholder screen. Full address history timeline widget will be implemented next.
          </p>
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900">Current Address</h3>

        {/* Street Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Street Address <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={currentAddress.street || ''}
            onChange={(e) => handleAddressChange('street', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="123 Main Street"
          />
        </div>

        {/* Apt/Unit */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Apt/Suite/Unit
          </label>
          <input
            type="text"
            value={currentAddress.unit || ''}
            onChange={(e) => handleAddressChange('unit', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Apt 4B"
          />
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={currentAddress.city || ''}
            onChange={(e) => handleAddressChange('city', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Los Angeles"
          />
        </div>

        {/* State */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            State/Province
          </label>
          <input
            type="text"
            value={currentAddress.state || ''}
            onChange={(e) => handleAddressChange('state', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="California"
          />
        </div>

        {/* Country */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Country <span className="text-red-500">*</span>
          </label>
          <select
            value={currentAddress.country || ''}
            onChange={(e) => handleAddressChange('country', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select a country</option>
            <option value="United States">United States</option>
            <option value="Canada">Canada</option>
            <option value="Mexico">Mexico</option>
            <option value="United Kingdom">United Kingdom</option>
            {/* Add more countries as needed */}
          </select>
        </div>

        {/* Postal Code */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Postal Code <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={currentAddress.postalCode || ''}
            onChange={(e) => handleAddressChange('postalCode', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="90001"
          />
        </div>

        {/* TODO Note */}
        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Coming Soon:</strong> Full 5-year address history timeline with:
          </p>
          <ul className="mt-2 text-sm text-yellow-800 list-disc list-inside space-y-1">
            <li>Visual timeline showing address periods</li>
            <li>Automatic gap detection</li>
            <li>Add/remove multiple addresses</li>
            <li>Date range validation</li>
          </ul>
        </div>
      </div>
    </ScreenLayout>
  );
};

export default AddressHistoryScreen;
