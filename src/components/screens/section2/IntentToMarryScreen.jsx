import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ScreenLayout from '../../ScreenLayout';
import DisqualificationStandaloneScreen from '../../DisqualificationStandaloneScreen';
import { getNextScreen, isFirstScreen } from '../../../utils/navigationUtils';

/**
 * IntentToMarryScreen - Section 2, Marriage Plans Question 2
 * Content copied exactly from Section1.jsx Question 4 (lines 425-469)
 */
const IntentToMarryScreen = ({
  currentData,
  updateField,
  userRole
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const intendToMarry90Days = currentData.intendToMarry90Days || null;
  const [showDisqualification, setShowDisqualification] = useState(false);
  const [hasDQ, setHasDQ] = useState(false);

  const handleNext = () => {
    // Check for DQ before navigating
    if (hasDQ) {
      setShowDisqualification(true);
      return;
    }

    const nextPath = getNextScreen(location.pathname, userRole);
    if (nextPath) {
      navigate(nextPath);
    }
  };

  const isFirst = isFirstScreen(location.pathname, userRole);

  // Get beneficiary name and pronoun
  const beneficiaryName = currentData.beneficiaryFirstName || 'your fiancé(e)';
  const beneficiaryPronoun = currentData.beneficiarySex === 'Male' ? 'his' :
                             currentData.beneficiarySex === 'Female' ? 'her' : 'their';

  // Track DQ state (but don't show standalone screen yet)
  useEffect(() => {
    if (intendToMarry90Days === 'no') {
      setHasDQ(true);
      updateField('section2_intentToMarry_DQ', true);
    } else {
      setHasDQ(false);
      setShowDisqualification(false);
      updateField('section2_intentToMarry_DQ', false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intendToMarry90Days]);

  // Reset DQ screen when navigating away from this screen
  useEffect(() => {
    const isOnThisScreen = location.pathname.includes('/intent-to-marry');
    if (!isOnThisScreen) {
      setShowDisqualification(false);
    }
  }, [location.pathname]);

  // Handle "Go Back" button - don't clear user's answer, just hide DQ screen
  const handleGoBack = () => {
    setShowDisqualification(false);
  };

  // Tailored DQ message
  const dqMessage = `The K-1 visa requires that you marry within 90 days of ${beneficiaryName}'s arrival to the U.S. This is the fundamental purpose of the K-1 visa.\n\nWithout intent to marry within 90 days, ${beneficiaryName} isn't eligible for a K-1 visa. If you don't marry in time, ${beneficiaryName} may lose legal status and need to leave the U.S.`;

  // Show standalone disqualification screen (only when on this screen's path AND showDisqualification is true)
  const isOnThisScreen = location.pathname.includes('/intent-to-marry');
  if (showDisqualification && isOnThisScreen) {
    return (
      <DisqualificationStandaloneScreen
        reason={dqMessage}
        onGoBack={handleGoBack}
        supportEmail="support@evernestusa.com"
        supportPhone="+1 (555) 123-4567"
      />
    );
  }

  return (
    <ScreenLayout
      showBackButton={!isFirst}
      onNext={handleNext}
      nextButtonDisabled={!intendToMarry90Days}
    >
      <div className="space-y-4">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-sm font-semibold text-gray-900 mb-2">
            Do you and {beneficiaryName} intend to marry each other within 90 days of {beneficiaryPronoun} arrival in the United States?
          </p>
        </div>

        <p className="text-xs text-gray-600">
          <strong>Why we ask this:</strong> K-1 visas require that you marry within 90 days of your fiancé(e)'s arrival in the United States. This is a mandatory eligibility requirement.
        </p>

        <div className="space-y-3">
          <label className="flex items-center space-x-3 p-4 border-2 border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
            <input
              type="radio"
              name="intendToMarry90Days"
              value="yes"
              checked={intendToMarry90Days === 'yes'}
              onChange={(e) => updateField('intendToMarry90Days', e.target.value)}
              className="h-4 w-4 text-blue-600"
            />
            <span className="text-sm font-medium text-gray-900">Yes</span>
          </label>

          <label className="flex items-center space-x-3 p-4 border-2 border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
            <input
              type="radio"
              name="intendToMarry90Days"
              value="no"
              checked={intendToMarry90Days === 'no'}
              onChange={(e) => updateField('intendToMarry90Days', e.target.value)}
              className="h-4 w-4 text-blue-600"
            />
            <span className="text-sm font-medium text-gray-900">No</span>
          </label>
        </div>

        {/* Inline Warning - Appears immediately when "No" is selected */}
        {intendToMarry90Days === 'no' && (
          <div className="mt-4 p-5 bg-red-50 border-l-4 border-red-500 rounded-lg">
            <p className="text-sm font-semibold text-red-900 mb-3">
              ⚠️ USCIS Requirement Conflict
            </p>
            <p className="text-sm text-red-800 mb-3">
              The K-1 visa requires that you marry within 90 days of {beneficiaryName}'s
              arrival to the U.S. This is the fundamental purpose of the K-1 visa.
            </p>
            <p className="text-sm text-red-800">
              Without intent to marry within 90 days, {beneficiaryName} isn't eligible
              for a K-1 visa. If you don't marry in time, {beneficiaryName} may lose
              legal status and need to leave the U.S.
            </p>
          </div>
        )}
      </div>
    </ScreenLayout>
  );
};

export default IntentToMarryScreen;
