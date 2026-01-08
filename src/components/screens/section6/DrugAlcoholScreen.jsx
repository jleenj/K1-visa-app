import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ScreenLayout from '../../ScreenLayout';
import DisqualificationStandaloneScreen from '../../DisqualificationStandaloneScreen';
import { getNextScreen, isFirstScreen } from '../../../utils/navigationUtils';

/**
 * DrugAlcoholScreen - Section 6, Criminal History Question 4
 *
 * Content source: Section1_9.jsx / SponsorCriminalHistoryScreen.jsx
 * Question about drug or alcohol-related offenses
 */
const DrugAlcoholScreen = ({
  currentData,
  updateField,
  userRole
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const drugAlcohol = currentData.sponsorDrugAlcoholOffenses || null;
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
    if (drugAlcohol === 'yes') {
      setHasDQ(true);
      updateField('section6_drugAlcohol_DQ', true);
    } else {
      setHasDQ(false);
      setShowDisqualification(false);
      updateField('section6_drugAlcohol_DQ', false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drugAlcohol]);

  // Reset DQ screen when navigating away from this screen
  useEffect(() => {
    const isOnThisScreen = location.pathname.includes('drug-alcohol');
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
  const isOnThisScreen = location.pathname.includes('drug-alcohol');
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
      nextButtonDisabled={!drugAlcohol}
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
            <li>Drug possession, manufacturing, or trafficking</li>
            <li>Driving under the influence (DUI) or driving while intoxicated (DWI)</li>
            <li>Public intoxication</li>
            <li>Prescription drug fraud</li>
            <li>Any other drug or alcohol-related offense</li>
          </ul>
        </div>

        <div className="space-y-3">
          <label className="flex items-center space-x-3 p-4 border-2 border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
            <input
              type="radio"
              name="drugAlcohol"
              value="yes"
              checked={drugAlcohol === 'yes'}
              onChange={(e) => updateField('sponsorDrugAlcoholOffenses', e.target.value)}
              className="h-4 w-4 text-blue-600"
            />
            <span className="text-sm font-medium text-gray-900">Yes</span>
          </label>

          <label className="flex items-center space-x-3 p-4 border-2 border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
            <input
              type="radio"
              name="drugAlcohol"
              value="no"
              checked={drugAlcohol === 'no'}
              onChange={(e) => updateField('sponsorDrugAlcoholOffenses', e.target.value)}
              className="h-4 w-4 text-blue-600"
            />
            <span className="text-sm font-medium text-gray-900">No</span>
          </label>
        </div>

        {drugAlcohol === 'yes' && <DisqualificationMessage />}
      </div>
    </ScreenLayout>
  );
};

export default DrugAlcoholScreen;
