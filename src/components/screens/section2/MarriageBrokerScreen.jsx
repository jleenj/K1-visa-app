import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ScreenLayout from '../../ScreenLayout';
import DisqualificationStandaloneScreen from '../../DisqualificationStandaloneScreen';
import { getNextScreen, isFirstScreen } from '../../../utils/navigationUtils';

/**
 * MarriageBrokerScreen - Section 2, Visa Requirements Question 3
 * Content copied exactly from Section1.jsx Question 3 (lines 371-423)
 */
const MarriageBrokerScreen = ({
  currentData,
  updateField,
  userRole
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const metThroughIMB = currentData.metThroughIMB || null;
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

  // Get beneficiary name
  const beneficiaryName = currentData.beneficiaryFirstName || 'your fiancé(e)';

  // Track DQ state (but don't show standalone screen yet)
  useEffect(() => {
    if (metThroughIMB === 'yes') {
      setHasDQ(true);
      updateField('section2_marriageBroker_DQ', true);
    } else {
      setHasDQ(false);
      setShowDisqualification(false);
      updateField('section2_marriageBroker_DQ', false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metThroughIMB]);

  // Reset DQ screen when navigating away from this screen
  useEffect(() => {
    const isOnThisScreen = location.pathname.includes('/marriage-broker');
    if (!isOnThisScreen) {
      setShowDisqualification(false);
    }
  }, [location.pathname]);

  // Handle "Go Back" button - don't clear user's answer, just hide DQ screen
  const handleGoBack = () => {
    setShowDisqualification(false);
  };

  // Tailored DQ message
  const dqMessage = "Meeting through an international marriage broker requires additional documentation under IMBRA, including background checks and criminal history records.\n\nYour situation needs specialized legal guidance to ensure you meet all IMBRA requirements. Without proper documentation, your petition may be denied.";

  // Show standalone disqualification screen (only when on this screen's path AND showDisqualification is true)
  const isOnThisScreen = location.pathname.includes('/marriage-broker');
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
      nextButtonDisabled={!metThroughIMB}
    >
      <div className="space-y-4">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-sm font-semibold text-gray-900 mb-2">
            Did you meet {beneficiaryName} through an International Marriage Broker or marriage agency?
          </p>
          <details className="mt-3">
            <summary className="text-xs text-blue-600 cursor-pointer hover:text-blue-800">
              What is an International Marriage Broker?
            </summary>
            <p className="text-xs text-gray-700 mt-2">
              An International Marriage Broker (IMB) is a for-profit organization that charges fees to facilitate communication and meetings between U.S. citizens and foreign nationals for dating or marriage purposes. This does NOT include free social media sites, dating apps, or cultural/religious matchmaking organizations.
            </p>
          </details>
        </div>

        <p className="text-xs text-gray-600">
          <strong>Why we ask this:</strong> Federal law requires disclosure if you used an International Marriage Broker service. Using an IMB adds additional documentation requirements.
        </p>

        <div className="space-y-3">
          <label className="flex items-center space-x-3 p-4 border-2 border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
            <input
              type="radio"
              name="metThroughIMB"
              value="yes"
              checked={metThroughIMB === 'yes'}
              onChange={(e) => updateField('metThroughIMB', e.target.value)}
              className="h-4 w-4 text-blue-600"
            />
            <span className="text-sm font-medium text-gray-900">Yes</span>
          </label>

          <label className="flex items-center space-x-3 p-4 border-2 border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
            <input
              type="radio"
              name="metThroughIMB"
              value="no"
              checked={metThroughIMB === 'no'}
              onChange={(e) => updateField('metThroughIMB', e.target.value)}
              className="h-4 w-4 text-blue-600"
            />
            <span className="text-sm font-medium text-gray-900">No</span>
          </label>
        </div>

        {/* Inline Warning - Appears immediately when "Yes" is selected */}
        {metThroughIMB === 'yes' && (
          <div className="mt-4 p-5 bg-red-50 border-l-4 border-red-500 rounded-lg">
            <p className="text-sm font-semibold text-red-900 mb-3">
              ⚠️ USCIS Requirement Conflict
            </p>
            <p className="text-sm text-red-800 mb-3">
              Meeting through an international marriage broker requires additional documentation
              under IMBRA, including background checks and criminal history records.
            </p>
            <p className="text-sm text-red-800">
              Your situation needs specialized legal guidance to ensure you meet all IMBRA
              requirements. Without proper documentation, your petition may be denied.
            </p>
          </div>
        )}
      </div>
    </ScreenLayout>
  );
};

export default MarriageBrokerScreen;
