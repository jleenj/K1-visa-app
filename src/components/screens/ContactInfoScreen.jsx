import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ScreenLayout from '../ScreenLayout';
import { getNextScreen, isFirstScreen } from '../../utils/navigationUtils';

/**
 * ContactInfoScreen Component
 *
 * Screen for collecting contact information (email and phone numbers)
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

  const handleNext = () => {
    const nextPath = getNextScreen(location.pathname, userRole);
    if (nextPath) {
      navigate(nextPath);
    }
  };

  const isFirst = isFirstScreen(location.pathname, userRole);

  // Check if email is valid (basic validation)
  const isEmailValid = (email) => {
    if (!email) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Check if required fields are filled
  const isFormValid = () => {
    const email = currentData[`${prefix}Email`];
    const daytimePhone = currentData[`${prefix}DaytimePhone`];

    return isEmailValid(email) && daytimePhone && daytimePhone.number;
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

      {/* Form Fields */}
      <div className="space-y-6">
        {/* Email Address - Using smart-email field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={currentData[`${prefix}Email`] || ''}
            onChange={(e) => updateField(`${prefix}Email`, e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="example@email.com"
          />
          <p className="text-sm text-gray-500 mt-1">
            Make sure this is an email you check regularly
          </p>
        </div>

        {/* Newsletter Opt-in (Sponsor only) */}
        {isSponsor && (
          <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
            <input
              type="checkbox"
              id={`${prefix}Newsletter`}
              checked={currentData[`${prefix}Newsletter`] || false}
              onChange={(e) => updateField(`${prefix}Newsletter`, e.target.checked)}
              className="mt-1 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <label htmlFor={`${prefix}Newsletter`} className="text-sm text-gray-700 cursor-pointer">
              Keep me informed about immigration policy changes, news, and updates that may affect my case
            </label>
          </div>
        )}

        {/* Daytime Phone - Using international-phone field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Daytime Phone Number <span className="text-red-500">*</span>
          </label>

          {/* Country Selection */}
          <div className="mb-2">
            <select
              value={currentData[`${prefix}DaytimePhone`]?.country || 'US'}
              onChange={(e) => updateField(`${prefix}DaytimePhone`, {
                ...(currentData[`${prefix}DaytimePhone`] || {}),
                country: e.target.value
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="US">🇺🇸 United States (+1)</option>
              <option value="CA">🇨🇦 Canada (+1)</option>
              <option value="GB">🇬🇧 United Kingdom (+44)</option>
              <option value="AU">🇦🇺 Australia (+61)</option>
              <option value="DE">🇩🇪 Germany (+49)</option>
              <option value="MX">🇲🇽 Mexico (+52)</option>
              <option value="PH">🇵🇭 Philippines (+63)</option>
              <option value="IN">🇮🇳 India (+91)</option>
              <option value="BR">🇧🇷 Brazil (+55)</option>
            </select>
          </div>

          {/* Phone Number */}
          <input
            type="tel"
            value={currentData[`${prefix}DaytimePhone`]?.number || ''}
            onChange={(e) => updateField(`${prefix}DaytimePhone`, {
              ...(currentData[`${prefix}DaytimePhone`] || { country: 'US' }),
              number: e.target.value
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="(555) 123-4567"
          />
          <p className="text-sm text-gray-500 mt-1">
            Include area code
          </p>
        </div>

        {/* Mobile Phone (Optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mobile Phone Number
          </label>

          {/* Country Selection */}
          <div className="mb-2">
            <select
              value={currentData[`${prefix}MobilePhone`]?.country || 'US'}
              onChange={(e) => updateField(`${prefix}MobilePhone`, {
                ...(currentData[`${prefix}MobilePhone`] || {}),
                country: e.target.value
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="US">🇺🇸 United States (+1)</option>
              <option value="CA">🇨🇦 Canada (+1)</option>
              <option value="GB">🇬🇧 United Kingdom (+44)</option>
              <option value="AU">🇦🇺 Australia (+61)</option>
              <option value="DE">🇩🇪 Germany (+49)</option>
              <option value="MX">🇲🇽 Mexico (+52)</option>
              <option value="PH">🇵🇭 Philippines (+63)</option>
              <option value="IN">🇮🇳 India (+91)</option>
              <option value="BR">🇧🇷 Brazil (+55)</option>
            </select>
          </div>

          {/* Phone Number */}
          <input
            type="tel"
            value={currentData[`${prefix}MobilePhone`]?.number || ''}
            onChange={(e) => updateField(`${prefix}MobilePhone`, {
              ...(currentData[`${prefix}MobilePhone`] || { country: 'US' }),
              number: e.target.value
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="(555) 987-6543"
          />
          <p className="text-sm text-gray-500 mt-1">
            Optional - If different from daytime number
          </p>
        </div>
      </div>
    </ScreenLayout>
  );
};

export default ContactInfoScreen;
