import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ScreenLayout from '../../ScreenLayout';
import DisqualificationStandaloneScreen from '../../DisqualificationStandaloneScreen';
import { getNextScreen, isFirstScreen } from '../../../utils/navigationUtils';

/**
 * OtherCriminalHistoryScreen - Section 6, Criminal History Question 5
 *
 * Content source: Section1_9.jsx / SponsorCriminalHistoryScreen.jsx
 * Question about any other criminal history (catch-all question)
 */
const OtherCriminalHistoryScreen = ({
  currentData,
  updateField,
  userRole
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const otherCriminalHistory = currentData.sponsorOtherCriminalHistory || null;
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

  // Track DQ state
  useEffect(() => {
    if (otherCriminalHistory === 'yes') {
      setHasDQ(true);
      updateField('section6_otherCriminalHistory_DQ', true);
    } else {
      setHasDQ(false);
      setShowDisqualification(false);
      updateField('section6_otherCriminalHistory_DQ', false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otherCriminalHistory]);

  // Reset DQ screen when navigating away from this screen
  useEffect(() => {
    const isOnThisScreen = location.pathname.includes('criminal-history-other');
    if (!isOnThisScreen) {
      setShowDisqualification(false);
    }
  }, [location.pathname]);

  // Handle "Go Back" button - don't clear user's answer, just hide DQ screen
  const handleGoBack = () => {
    setShowDisqualification(false);
  };

  // DQ message
  const dqMessage = "USCIS carefully reviews criminal history when evaluating K-1 visa petitions. Based on your answer, your application requires in-depth review and personalized guidance.";

  // Show standalone disqualification screen
  const isOnThisScreen = location.pathname.includes('criminal-history-other');
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

  // Inline warning component
  const DisqualificationMessage = () => (
    <div className="mt-4 p-5 bg-red-50 border-l-4 border-red-500 rounded-lg">
      <p className="text-sm font-semibold text-red-900 mb-3">
        ⚠️ USCIS Requirement Conflict
      </p>
      <p className="text-sm text-red-800">
        USCIS carefully reviews criminal history when evaluating K-1 visa petitions. Your application may require in-depth review and personalized guidance.
      </p>
    </div>
  );

  return (
    <ScreenLayout
      showBackButton={!isFirst}
      onNext={handleNext}
      nextButtonDisabled={!otherCriminalHistory}
    >
      <div className="space-y-4">
        <h4 className="text-base font-semibold text-gray-900">
          Have you ever been arrested, cited, charged, indicted, convicted, fined, or imprisoned for breaking or violating any law or ordinance in any country?
        </h4>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2">
          <p className="text-sm text-gray-700 font-medium">Don't include:</p>
          <ul className="text-sm text-gray-700 space-y-1 ml-4 list-disc">
            <li>Traffic violations under $500 (unless alcohol/drug-related)</li>
          </ul>

          <p className="text-sm text-gray-700 font-medium mt-3">Do include ANY other arrest, citation, charge, indictment, conviction, fine, or imprisonment from ANY country, including but not limited to:</p>
          <ul className="text-sm text-gray-700 space-y-1 ml-4 list-disc">
            <li>DUI/DWI (even if it happened only once)</li>
            <li>Driving with suspended/revoked license</li>
            <li>Reckless driving (criminal charge)</li>
            <li>Theft or shoplifting (even if charges were dropped)</li>
            <li>Disorderly conduct or public disturbance</li>
            <li>Fake ID or age misrepresentation</li>
            <li>Minor in possession of alcohol</li>
            <li>Any fines over $500 for violating any law or ordinance</li>
          </ul>

          <div className="mt-3 text-sm text-gray-600 bg-blue-50 border-l-4 border-blue-300 pl-3 py-2 rounded">
            <span>💡 </span>
            This list shows common examples, but it is NOT exhaustive. If you have ANY criminal history not listed above, you must disclose it. This includes records that were sealed, expunged, or dismissed.
          </div>
        </div>

        <div className="space-y-3">
          <label className="flex items-center space-x-3 p-4 border-2 border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
            <input
              type="radio"
              name="otherCriminalHistory"
              value="yes"
              checked={otherCriminalHistory === 'yes'}
              onChange={(e) => updateField('sponsorOtherCriminalHistory', e.target.value)}
              className="h-4 w-4 text-blue-600"
            />
            <span className="text-sm font-medium text-gray-900">Yes</span>
          </label>

          <label className="flex items-center space-x-3 p-4 border-2 border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
            <input
              type="radio"
              name="otherCriminalHistory"
              value="no"
              checked={otherCriminalHistory === 'no'}
              onChange={(e) => updateField('sponsorOtherCriminalHistory', e.target.value)}
              className="h-4 w-4 text-blue-600"
            />
            <span className="text-sm font-medium text-gray-900">No</span>
          </label>
        </div>

        {otherCriminalHistory === 'yes' && <DisqualificationMessage />}
      </div>
    </ScreenLayout>
  );
};

export default OtherCriminalHistoryScreen;
