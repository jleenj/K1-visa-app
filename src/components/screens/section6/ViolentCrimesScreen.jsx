import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ScreenLayout from '../../ScreenLayout';
import DisqualificationStandaloneScreen from '../../DisqualificationStandaloneScreen';
import { getNextScreen, isFirstScreen } from '../../../utils/navigationUtils';

/**
 * ViolentCrimesScreen - Section 6, Criminal History Question 3
 *
 * Content source: Section1_9.jsx / SponsorCriminalHistoryScreen.jsx
 * Question about violent crimes (homicide, sexual offenses, kidnapping, trafficking, torture)
 */
const ViolentCrimesScreen = ({
  currentData,
  updateField,
  userRole
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const violentCrimes = currentData.sponsorViolentCrimes || null;
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
    if (violentCrimes === 'yes') {
      setHasDQ(true);
      updateField('section6_violentCrimes_DQ', true);
    } else {
      setHasDQ(false);
      setShowDisqualification(false);
      updateField('section6_violentCrimes_DQ', false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [violentCrimes]);

  // Reset DQ screen when navigating away from this screen
  useEffect(() => {
    const isOnThisScreen = location.pathname.includes('violent-crime');
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
  const isOnThisScreen = location.pathname.includes('violent-crime');
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
      nextButtonDisabled={!violentCrimes}
    >
      <div className="space-y-4">
        <h4 className="text-base font-semibold text-gray-900">
          Have you EVER been arrested, cited, charged, indicted, convicted, fined, or imprisoned for breaking or violating any law or ordinance, excluding traffic violations?
        </h4>

        <p className="text-sm text-gray-700">
          This includes any crime involving:
        </p>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2">
          <ul className="text-sm text-gray-700 space-y-1 ml-4 list-disc">
            <li>Homicide (murder, manslaughter)</li>
            <li>Sexual offense (rape, sexual assault, sexual exploitation)</li>
            <li>Kidnapping</li>
            <li>Human trafficking</li>
            <li>Torture</li>
            <li>Any other violent crime</li>
          </ul>
        </div>

        <div className="space-y-3">
          <label className="flex items-center space-x-3 p-4 border-2 border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
            <input
              type="radio"
              name="violentCrimes"
              value="yes"
              checked={violentCrimes === 'yes'}
              onChange={(e) => updateField('sponsorViolentCrimes', e.target.value)}
              className="h-4 w-4 text-blue-600"
            />
            <span className="text-sm font-medium text-gray-900">Yes</span>
          </label>

          <label className="flex items-center space-x-3 p-4 border-2 border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
            <input
              type="radio"
              name="violentCrimes"
              value="no"
              checked={violentCrimes === 'no'}
              onChange={(e) => updateField('sponsorViolentCrimes', e.target.value)}
              className="h-4 w-4 text-blue-600"
            />
            <span className="text-sm font-medium text-gray-900">No</span>
          </label>
        </div>

        {violentCrimes === 'yes' && <DisqualificationMessage />}
      </div>
    </ScreenLayout>
  );
};

export default ViolentCrimesScreen;
