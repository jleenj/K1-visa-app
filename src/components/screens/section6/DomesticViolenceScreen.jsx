import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Info } from 'lucide-react';
import ScreenLayout from '../../ScreenLayout';
import DisqualificationStandaloneScreen from '../../DisqualificationStandaloneScreen';
import { getNextScreen, isFirstScreen } from '../../../utils/navigationUtils';

/**
 * DomesticViolenceScreen - Section 6, Criminal History Question 2
 *
 * Content source: Section1_9.jsx / SponsorCriminalHistoryScreen.jsx
 * Question about domestic violence, sexual assault, child abuse, etc.
 */
const DomesticViolenceScreen = ({
  currentData,
  updateField,
  userRole
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const domesticViolence = currentData.sponsorDomesticViolence || null;
  const [showDisqualification, setShowDisqualification] = useState(false);
  const [hasDQ, setHasDQ] = useState(false);
  const [showDomesticViolenceDefinition, setShowDomesticViolenceDefinition] = useState(false);

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
    if (domesticViolence === 'yes') {
      setHasDQ(true);
      updateField('section6_domesticViolence_DQ', true);
    } else {
      setHasDQ(false);
      setShowDisqualification(false);
      updateField('section6_domesticViolence_DQ', false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [domesticViolence]);

  // Reset DQ screen when navigating away from this screen
  useEffect(() => {
    const isOnThisScreen = location.pathname.includes('domestic-violence');
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
  const isOnThisScreen = location.pathname.includes('domestic-violence');
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
      nextButtonDisabled={!domesticViolence}
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
            <li>Domestic violence</li>
            <li>Sexual assault</li>
            <li>Child abuse or neglect</li>
            <li>Dating violence</li>
            <li>Elder abuse</li>
            <li>Stalking</li>
            <li>Any other crime where violence or threat of violence was involved</li>
          </ul>
        </div>

        <button
          type="button"
          onClick={() => setShowDomesticViolenceDefinition(!showDomesticViolenceDefinition)}
          className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-800"
        >
          <Info className="w-4 h-4" />
          <span className="underline">
            {showDomesticViolenceDefinition ? 'Hide' : 'Show'} what these terms mean
          </span>
        </button>

        {showDomesticViolenceDefinition && (
          <div className="bg-blue-50 border-l-4 border-blue-300 p-4 space-y-3">
            <div>
              <p className="text-sm font-semibold text-blue-900">Domestic Violence:</p>
              <p className="text-sm text-blue-800">
                Violence or threats toward a current or former spouse, partner, or family member.
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-blue-900">Sexual Assault:</p>
              <p className="text-sm text-blue-800">
                Any non-consensual sexual contact or behavior.
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-blue-900">Child Abuse/Neglect:</p>
              <p className="text-sm text-blue-800">
                Physical, emotional, or sexual harm to a child, or failure to provide basic care.
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-blue-900">Dating Violence:</p>
              <p className="text-sm text-blue-800">
                Violence or controlling behavior in a dating relationship.
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-blue-900">Elder Abuse:</p>
              <p className="text-sm text-blue-800">
                Physical, emotional, or financial harm to an elderly person (usually 65+).
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-blue-900">Stalking:</p>
              <p className="text-sm text-blue-800">
                Repeated unwanted attention that causes fear or distress.
              </p>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <label className="flex items-center space-x-3 p-4 border-2 border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
            <input
              type="radio"
              name="domesticViolence"
              value="yes"
              checked={domesticViolence === 'yes'}
              onChange={(e) => updateField('sponsorDomesticViolence', e.target.value)}
              className="h-4 w-4 text-blue-600"
            />
            <span className="text-sm font-medium text-gray-900">Yes</span>
          </label>

          <label className="flex items-center space-x-3 p-4 border-2 border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
            <input
              type="radio"
              name="domesticViolence"
              value="no"
              checked={domesticViolence === 'no'}
              onChange={(e) => updateField('sponsorDomesticViolence', e.target.value)}
              className="h-4 w-4 text-blue-600"
            />
            <span className="text-sm font-medium text-gray-900">No</span>
          </label>
        </div>

        {domesticViolence === 'yes' && <DisqualificationMessage />}
      </div>
    </ScreenLayout>
  );
};

export default DomesticViolenceScreen;
