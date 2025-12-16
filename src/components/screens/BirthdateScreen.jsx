import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ScreenLayout from '../ScreenLayout';
import { getNextScreen, isFirstScreen } from '../../utils/navigationUtils';

/**
 * BirthdateScreen Component
 *
 * Screen for collecting date of birth and place of birth information
 */
const BirthdateScreen = ({
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

  // Check if required fields are filled
  const isFormValid = () => {
    return currentData[`${prefix}DOB`] &&
           currentData[`${prefix}BirthCity`] &&
           currentData[`${prefix}BirthCountry`];
  };

  // List of countries that require state/province
  const countriesWithStates = ['United States', 'Canada', 'Australia', 'India', 'Brazil', 'Mexico'];
  const selectedCountry = currentData[`${prefix}BirthCountry`] || '';
  const requiresState = countriesWithStates.includes(selectedCountry);

  return (
    <ScreenLayout
      showBackButton={!isFirst}
      onNext={handleNext}
      nextButtonDisabled={!isFormValid()}
    >
      {/* Screen Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          When and where {isSponsor ? 'were you' : 'was your partner'} born?
        </h2>
        <p className="text-gray-600">
          Enter the information exactly as it appears on {isSponsor ? 'your' : 'their'} birth certificate.
        </p>
      </div>

      {/* Form Fields */}
      <div className="space-y-6">
        {/* Date of Birth */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date of Birth <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={currentData[`${prefix}DOB`] || ''}
            onChange={(e) => updateField(`${prefix}DOB`, e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            max={new Date().toISOString().split('T')[0]} // Cannot be in the future
          />
        </div>

        {/* Birth Country */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Country of Birth <span className="text-red-500">*</span>
          </label>
          <select
            value={currentData[`${prefix}BirthCountry`] || ''}
            onChange={(e) => {
              updateField(`${prefix}BirthCountry`, e.target.value);
              // Clear state if switching to a country that doesn't need it
              if (!countriesWithStates.includes(e.target.value)) {
                updateField(`${prefix}BirthState`, '');
              }
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select a country</option>
            <option value="United States">United States</option>
            <option value="Afghanistan">Afghanistan</option>
            <option value="Albania">Albania</option>
            <option value="Algeria">Algeria</option>
            <option value="Argentina">Argentina</option>
            <option value="Australia">Australia</option>
            <option value="Austria">Austria</option>
            <option value="Bangladesh">Bangladesh</option>
            <option value="Belgium">Belgium</option>
            <option value="Brazil">Brazil</option>
            <option value="Canada">Canada</option>
            <option value="Chile">Chile</option>
            <option value="China">China</option>
            <option value="Colombia">Colombia</option>
            <option value="Denmark">Denmark</option>
            <option value="Egypt">Egypt</option>
            <option value="France">France</option>
            <option value="Germany">Germany</option>
            <option value="Greece">Greece</option>
            <option value="India">India</option>
            <option value="Indonesia">Indonesia</option>
            <option value="Iran">Iran</option>
            <option value="Iraq">Iraq</option>
            <option value="Ireland">Ireland</option>
            <option value="Israel">Israel</option>
            <option value="Italy">Italy</option>
            <option value="Japan">Japan</option>
            <option value="Kenya">Kenya</option>
            <option value="Mexico">Mexico</option>
            <option value="Netherlands">Netherlands</option>
            <option value="New Zealand">New Zealand</option>
            <option value="Nigeria">Nigeria</option>
            <option value="Norway">Norway</option>
            <option value="Pakistan">Pakistan</option>
            <option value="Peru">Peru</option>
            <option value="Philippines">Philippines</option>
            <option value="Poland">Poland</option>
            <option value="Portugal">Portugal</option>
            <option value="Russia">Russia</option>
            <option value="Saudi Arabia">Saudi Arabia</option>
            <option value="South Africa">South Africa</option>
            <option value="South Korea">South Korea</option>
            <option value="Spain">Spain</option>
            <option value="Sweden">Sweden</option>
            <option value="Switzerland">Switzerland</option>
            <option value="Thailand">Thailand</option>
            <option value="Turkey">Turkey</option>
            <option value="Ukraine">Ukraine</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="Venezuela">Venezuela</option>
            <option value="Vietnam">Vietnam</option>
          </select>
        </div>

        {/* Birth State (conditional - only for certain countries) */}
        {requiresState && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              State/Province of Birth <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={currentData[`${prefix}BirthState`] || ''}
              onChange={(e) => updateField(`${prefix}BirthState`, e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={selectedCountry === 'United States' ? 'e.g., California' : 'e.g., Ontario'}
            />
          </div>
        )}

        {/* Birth City */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City/Town of Birth <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={currentData[`${prefix}BirthCity`] || ''}
            onChange={(e) => updateField(`${prefix}BirthCity`, e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Los Angeles"
          />
          <p className="text-sm text-gray-500 mt-1">
            Enter the city or town where you were born
          </p>
        </div>
      </div>
    </ScreenLayout>
  );
};

export default BirthdateScreen;
