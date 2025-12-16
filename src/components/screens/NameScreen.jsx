import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ScreenLayout from '../ScreenLayout';
import { getNextScreen, isFirstScreen } from '../../utils/navigationUtils';

/**
 * NameScreen Component
 *
 * Screen for collecting name information (pilot/sample implementation)
 * This demonstrates the pattern for subsection screens
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

  const handleNext = () => {
    // TODO: Add validation before proceeding
    const nextPath = getNextScreen(location.pathname, userRole);
    if (nextPath) {
      navigate(nextPath);
    }
  };

  const isFirst = isFirstScreen(location.pathname, userRole);

  return (
    <ScreenLayout
      showBackButton={!isFirst}
      onNext={handleNext}
      nextButtonDisabled={!currentData[`${prefix}FirstName`] || !currentData[`${prefix}LastName`]}
    >
      {/* Screen Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-blue-600 text-sm font-medium">1</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            What is {isSponsor ? 'your' : 'your partner\'s'} full legal name?
          </h2>
        </div>
        <p className="text-gray-600 ml-10">
          Enter the name exactly as it appears on {isSponsor ? 'your' : 'their'} passport or birth certificate.
        </p>
      </div>

      {/* Form Fields */}
      <div className="space-y-6">
        {/* Last Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Legal Last Name (Family Name) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={currentData[`${prefix}LastName`] || ''}
            onChange={(e) => updateField(`${prefix}LastName`, e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Smith"
          />
        </div>

        {/* First Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Legal First Name (Given Name) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={currentData[`${prefix}FirstName`] || ''}
            onChange={(e) => updateField(`${prefix}FirstName`, e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="John"
          />
        </div>

        {/* Middle Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Middle Name
          </label>
          <input
            type="text"
            value={currentData[`${prefix}MiddleName`] || ''}
            onChange={(e) => updateField(`${prefix}MiddleName`, e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Optional"
          />
          <p className="text-sm text-gray-500 mt-1">
            Leave blank if you don't have a middle name
          </p>
        </div>

        {/* Other Names */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Other Names Used
          </label>
          <input
            type="text"
            value={currentData[`${prefix}OtherNames`] || ''}
            onChange={(e) => updateField(`${prefix}OtherNames`, e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Maiden name, aliases, nicknames"
          />
          <p className="text-sm text-gray-500 mt-1">
            Include any other names you've used (maiden name, previous married names, aliases)
          </p>
        </div>

        {/* Native Alphabet (Beneficiary only) */}
        {!isSponsor && (
          <>
            <div className="border-t border-gray-200 pt-6 mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Name in Native Alphabet (if applicable)
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                If your name is written in a non-Latin alphabet (Arabic, Chinese, Cyrillic, etc.),
                please provide it here.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name in Native Alphabet
              </label>
              <input
                type="text"
                value={currentData.beneficiaryNativeLastName || ''}
                onChange={(e) => updateField('beneficiaryNativeLastName', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name in Native Alphabet
              </label>
              <input
                type="text"
                value={currentData.beneficiaryNativeFirstName || ''}
                onChange={(e) => updateField('beneficiaryNativeFirstName', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Middle Name in Native Alphabet
              </label>
              <input
                type="text"
                value={currentData.beneficiaryNativeMiddleName || ''}
                onChange={(e) => updateField('beneficiaryNativeMiddleName', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </>
        )}
      </div>
    </ScreenLayout>
  );
};

export default NameScreen;
