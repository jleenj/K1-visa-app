import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import ScreenLayout from '../../ScreenLayout';
import DisqualificationStandaloneScreen from '../../DisqualificationStandaloneScreen';
import { getNextScreen, getPreviousScreen, isFirstScreen } from '../../../utils/navigationUtils';

/**
 * BeneficiaryUSTravelHistoryScreen - Section 6, Beneficiary US Travel History
 *
 * Content source: App.tsx (lines 984-1001 field definitions, lines 5005-5064 warning component)
 * Questions:
 * 1. Has beneficiary ever been to US? (for I-129F form data)
 * 2. Will beneficiary be in US when filing? (DQ trigger)
 */
const BeneficiaryUSTravelHistoryScreen = ({
  currentData,
  updateField,
  userRole
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const beneficiaryFirstName = currentData.beneficiaryFirstName || 'your fiancé(e)';
  const everInUS = currentData.beneficiaryEverInUS || null;
  const willBeInUSWhenFiling = currentData.beneficiaryWillBeInUSWhenFiling || null;

  const [showDisqualification, setShowDisqualification] = useState(false);
  const [hasDQ, setHasDQ] = useState(false);

  const handleBack = () => {
    const prevScreen = getPreviousScreen(location.pathname, userRole, currentData);
    if (prevScreen) navigate(prevScreen);
  };

  const handleNext = () => {
    // Check if THIS screen has a DQ
    if (hasDQ) {
      setShowDisqualification(true);
      return;
    }

    // Get next screen to check if we're leaving Section 6
    const nextScreen = getNextScreen(location.pathname, userRole, currentData);

    // If next screen is outside Section 6, check for ANY Section 6 beneficiary DQ
    if (nextScreen && !nextScreen.startsWith('/section-6-legal-beneficiary')) {
      const hasAnySection6DQ = !!(
        currentData.section6_beneficiary_willBeInUS_DQ ||
        currentData.section6_beneficiary_criminalHistory_DQ ||
        currentData.section6_beneficiary_immigrationIssues_DQ ||
        currentData.section6_beneficiary_health_DQ ||
        currentData.section6_beneficiary_security_DQ
      );

      if (hasAnySection6DQ) {
        setShowDisqualification(true);
        return;
      }
    }

    if (nextScreen) navigate(nextScreen);
  };

  const isFirst = isFirstScreen(location.pathname, userRole, currentData);

  // Track DQ state
  useEffect(() => {
    if (willBeInUSWhenFiling === 'yes') {
      setHasDQ(true);
      updateField('section6_beneficiary_willBeInUS_DQ', true);
    } else {
      setHasDQ(false);
      setShowDisqualification(false);
      updateField('section6_beneficiary_willBeInUS_DQ', false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [willBeInUSWhenFiling]);

  // Reset DQ screen when navigating away from this screen
  useEffect(() => {
    const isOnThisScreen = location.pathname.includes('us-travel');
    if (!isOnThisScreen) {
      setShowDisqualification(false);
    }
  }, [location.pathname]);

  // Handle "Go Back" button - don't clear user's answer, just hide DQ screen
  const handleGoBack = () => {
    setShowDisqualification(false);
  };

  // Collect ALL Section 6 beneficiary DQ messages
  const getAllDQMessages = () => {
    const messages = [];
    const beneficiaryName = currentData.beneficiaryFirstName || 'your fiancé(e)';

    if (currentData.section6_beneficiary_willBeInUS_DQ) {
      messages.push(`Based on your answers, the K-1 fiancé(e) visa may not be the best option for your situation.\n\nThe K-1 visa requires ${beneficiaryName} to apply for the visa at a U.S. embassy or consulate in their home country. ${beneficiaryName} cannot "switch" to K-1 status while already in the United States.\n\nIf ${beneficiaryName} will still be in the U.S. when you're ready to file, you may want to consider alternative options such as getting married and filing for adjustment of status (Form I-130/I-485) instead.`);
    }

    if (currentData.section6_beneficiary_criminalHistory_DQ ||
        currentData.section6_beneficiary_immigrationIssues_DQ ||
        currentData.section6_beneficiary_health_DQ ||
        currentData.section6_beneficiary_security_DQ) {
      messages.push(`USCIS carefully reviews ${beneficiaryName}'s background when evaluating K-1 visa applications. Based on your answers, this case requires in-depth review and personalized guidance.`);
    }

    return messages;
  };

  // Show standalone disqualification screen
  const isOnThisScreen = location.pathname.includes('us-travel');
  if (showDisqualification && isOnThisScreen) {
    const allDQMessages = getAllDQMessages();
    return (
      <DisqualificationStandaloneScreen
        reasons={allDQMessages}
        onGoBack={handleGoBack}
        supportEmail="support@evernestusa.com"
        supportPhone="+1 (555) 123-4567"
      />
    );
  }

  // Inline warning component
  const DisqualificationMessage = () => (
    <div className="mt-4 p-5 bg-red-50 border-l-4 border-red-500 rounded-lg">
      <p className="text-sm font-semibold text-red-900 mb-3">
        ⚠️ K-1 Visa May Not Be the Right Option
      </p>
      <p className="text-sm text-red-800">
        The K-1 visa requires {beneficiaryFirstName} to apply at a U.S. embassy or consulate in their home country. If {beneficiaryFirstName} will be in the U.S. when you file, you may need to consider alternative visa pathways.
      </p>
    </div>
  );

  // Check if form is valid
  const isFormValid = () => {
    if (!everInUS) return false;
    if (!willBeInUSWhenFiling) return false;
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
          U.S. Travel History
        </h2>

        {/* Question 1: Ever been in US */}
        <div className="space-y-4">
          <label className="block text-base font-semibold text-gray-900">
            Has {beneficiaryFirstName} ever been to the United States?
          </label>

          <p className="text-xs text-gray-600">
            <strong>Why we ask this:</strong> This information is required for Form I-129F. Answer "Yes" even if the visit was brief or many years ago.
          </p>

          <div className="space-y-3">
            <label className="flex items-center space-x-3 p-4 border-2 border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="radio"
                name="beneficiaryEverInUS"
                value="yes"
                checked={everInUS === 'yes'}
                onChange={(e) => updateField('beneficiaryEverInUS', e.target.value)}
                className="h-4 w-4 text-blue-600"
              />
              <span className="text-sm font-medium text-gray-900">Yes</span>
            </label>

            <label className="flex items-center space-x-3 p-4 border-2 border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="radio"
                name="beneficiaryEverInUS"
                value="no"
                checked={everInUS === 'no'}
                onChange={(e) => updateField('beneficiaryEverInUS', e.target.value)}
                className="h-4 w-4 text-blue-600"
              />
              <span className="text-sm font-medium text-gray-900">No</span>
            </label>
          </div>
        </div>

        {/* Question 2: Will be in US when filing */}
        <div className="space-y-4">
          <label className="block text-base font-semibold text-gray-900">
            Will {beneficiaryFirstName} be in the United States when you file your K-1 petition?
          </label>

          <details className="mb-3">
            <summary className="text-xs text-blue-600 cursor-pointer hover:text-blue-800 font-medium">
              What this means
            </summary>
            <p className="text-xs text-gray-700 mt-2 pl-4">
              "Filing" happens when you physically mail your K-1 petition (Form I-129F) to USCIS. This is different from when you complete your application on Evernest.
            </p>
          </details>

          <div className="space-y-3">
            <label className="flex items-center space-x-3 p-4 border-2 border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="radio"
                name="beneficiaryWillBeInUSWhenFiling"
                value="yes"
                checked={willBeInUSWhenFiling === 'yes'}
                onChange={(e) => updateField('beneficiaryWillBeInUSWhenFiling', e.target.value)}
                className="h-4 w-4 text-blue-600"
              />
              <span className="text-sm font-medium text-gray-900">Yes</span>
            </label>

            <label className="flex items-center space-x-3 p-4 border-2 border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="radio"
                name="beneficiaryWillBeInUSWhenFiling"
                value="no"
                checked={willBeInUSWhenFiling === 'no'}
                onChange={(e) => updateField('beneficiaryWillBeInUSWhenFiling', e.target.value)}
                className="h-4 w-4 text-blue-600"
              />
              <span className="text-sm font-medium text-gray-900">No</span>
            </label>
          </div>

          {willBeInUSWhenFiling === 'yes' && <DisqualificationMessage />}
        </div>
      </div>
    </ScreenLayout>
  );
};

export default BeneficiaryUSTravelHistoryScreen;
