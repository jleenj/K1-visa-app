import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ScreenLayout from '../../ScreenLayout';
import { getNextScreen, isFirstScreen } from '../../../utils/navigationUtils';
import { stateMarriageLaws, getMinimumMarriageAge } from '../../../data/stateMarriageLaws';

/**
 * MarriageStateScreen - Section 2, Marriage Plans Question 1
 * Content copied exactly from Section1.jsx Question 5 (lines 471-504)
 */
const MarriageStateScreen = ({
  currentData,
  updateField,
  userRole
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const marriageState = currentData.marriageState || '';
  const beneficiaryName = currentData.beneficiaryFirstName || 'your fiancé(e)';

  const handleStateChange = (value) => {
    updateField('marriageState', value);
    // Mark as engaged when user interacts with dropdown
    // This includes selecting a state OR selecting the empty "Select a state..." option
    updateField('marriageState_engaged', true);
  };

  const handleNext = () => {
    const nextPath = getNextScreen(location.pathname, userRole);
    if (nextPath) {
      navigate(nextPath);
    }
  };

  const isFirst = isFirstScreen(location.pathname, userRole);

  // Calculate age from date of birth
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

  // Check if age requirements are met for selected state
  const checkAgeRequirements = () => {
    if (!marriageState) return { met: true };

    const beneficiaryName = currentData.beneficiaryFirstName || 'your fiancé(e)';
    const sponsorAge = calculateAge(currentData.sponsorDOB);
    const beneficiaryAge = calculateAge(currentData.beneficiaryDOB);
    const minAge = getMinimumMarriageAge(marriageState);

    if (sponsorAge !== null && sponsorAge < minAge) {
      return { met: false, person: 'you', age: minAge };
    }
    if (beneficiaryAge !== null && beneficiaryAge < minAge) {
      return { met: false, person: beneficiaryName, age: minAge };
    }

    return { met: true };
  };

  const ageCheck = checkAgeRequirements();

  // US States list
  const states = Object.keys(stateMarriageLaws).map(code => ({
    code,
    name: stateMarriageLaws[code].name
  }));

  return (
    <ScreenLayout
      showBackButton={!isFirst}
      onNext={handleNext}
      nextButtonDisabled={!marriageState || !ageCheck.met}
    >
      <div className="space-y-4">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-sm font-semibold text-gray-900 mb-2">
            Which U.S. state do you plan to marry in?
          </p>
        </div>

        <p className="text-xs text-gray-600">
          <strong>Why we ask this:</strong> Your marriage must comply with state law (age requirements and familial relationship restrictions).
        </p>

        <select
          value={marriageState}
          onChange={(e) => handleStateChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select a state...</option>
          {states.map(state => (
            <option key={state.code} value={state.code}>
              {state.name}
            </option>
          ))}
        </select>

        {/* Age validation error */}
        {marriageState && !ageCheck.met && (
          <div className="mt-3 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
            <p className="text-sm text-yellow-800">
              In {stateMarriageLaws[marriageState]?.name}, the minimum age to marry is {ageCheck.age}. Based on the dates of birth provided, {ageCheck.person} do not meet this requirement. Please select a different state where you plan to marry, or contact customer support if you need assistance.
            </p>
          </div>
        )}

        {/* Relationship DQ warning */}
        {marriageState && currentData.section2_relationship_DQ && (
          <div className="mt-3 p-4 bg-red-50 border-l-4 border-red-500 rounded">
            <p className="text-sm font-semibold text-red-800 mb-2">
              ⚠️ USCIS Requirement Conflict
            </p>
            <p className="text-sm text-red-800 mb-3">
              Marriages between close blood relatives like siblings or aunt/uncle-niece/nephew
              are prohibited in all 50 U.S. states and aren't recognized under federal immigration law.
            </p>
            <p className="text-sm text-red-800">
              Because of your blood relationship with {beneficiaryName}, USCIS will deny
              your K-1 petition and {beneficiaryName} cannot obtain a K-1 visa.
            </p>
          </div>
        )}
      </div>
    </ScreenLayout>
  );
};

export default MarriageStateScreen;
