import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ScreenLayout from '../../ScreenLayout';
import DisqualificationStandaloneScreen from '../../DisqualificationStandaloneScreen';
import { getNextScreen, isFirstScreen } from '../../../utils/navigationUtils';

/**
 * MeetingDescriptionScreen - Section 2, Visa Requirements Question 5 (LAST question in section)
 * Content copied exactly from Section1.jsx Question 7 (lines 841-949)
 */
const MeetingDescriptionScreen = ({
  currentData,
  updateField,
  userRole
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [showMeetingExamples, setShowMeetingExamples] = useState(false);
  const [showDisqualification, setShowDisqualification] = useState(false);
  const [showIncompleteWarning, setShowIncompleteWarning] = useState(false);
  const meetingCircumstances = currentData.meetingCircumstances || '';

  // Check if Section 2 has incomplete questions
  const hasSection2Incomplete = () => {
    // Check marriage state (if engaged but not completed)
    if (currentData.marriageState_engaged && !currentData.marriageState) {
      return true;
    }

    // Check met-in-person conditional chain
    if (currentData.metInPerson === 'no') {
      if (!currentData.plannedMeetingOption) return true;
      if (currentData.plannedMeetingOption === 'next-3-months') {
        if (!currentData.plannedMeetingDate) return true;
        if (!currentData.acknowledgedMeetingRequirement) return true;
        if (currentData.section2_metInPerson_dateInvalid) return true;
      }
    }

    // Check relationship conditional chain
    if (currentData.areRelated === 'yes') {
      if (!currentData.relationshipType) return true;

      if (currentData.relationshipType === 'blood') {
        if (!currentData.bloodRelationship) return true;
        if (currentData.bloodRelationship === 'first-cousins' && !currentData.marriageState) return true;
      }

      if (currentData.relationshipType === 'adoption') {
        if (!currentData.adoptionRelationship) return true;
        if (currentData.adoptionRelationship === 'adopted-siblings' && !currentData.marriageState) return true;
      }

      if (currentData.relationshipType === 'marriage') {
        if (!currentData.marriageRelationship) return true;
        if (currentData.marriageRelationship === 'step-siblings' && !currentData.marriageState) return true;
      }
    }

    return false;
  };

  const handleNext = () => {
    // SCENARIO C: This is the last question in Section 2
    // Check if ANY DQ exists in Section 2 before allowing navigation to next section
    const hasAnyDQ = !!(
      currentData.section2_legallyFree_DQ ||
      currentData.section2_metInPerson_DQ ||
      currentData.section2_marriageBroker_DQ ||
      currentData.section2_intentToMarry_DQ ||
      currentData.section2_relationship_DQ
    );

    if (hasAnyDQ) {
      setShowDisqualification(true);
      return;
    }

    // Check if any questions are incomplete
    if (hasSection2Incomplete()) {
      setShowIncompleteWarning(true);
      return;
    }

    const nextPath = getNextScreen(location.pathname, userRole);
    if (nextPath) {
      navigate(nextPath);
    }
  };

  const handleGoBack = () => {
    setShowDisqualification(false);
  };

  const isFirst = isFirstScreen(location.pathname, userRole);

  // Get beneficiary name
  const beneficiaryName = currentData.beneficiaryFirstName || 'your fiancé(e)';

  // Collect all DQ messages for this section
  const getDQMessages = () => {
    const messages = [];

    if (currentData.section2_legallyFree_DQ) {
      messages.push(`To qualify for a K-1 visa, both you and ${beneficiaryName} must be legally free to marry. This means neither of you can be currently married to anyone else.\n\nIf either of you is still legally married, your K-1 petition won't be approved and ${beneficiaryName} won't be able to enter the U.S. on a K-1 visa.`);
    }

    if (currentData.section2_metInPerson_DQ) {
      messages.push(`USCIS requires that you and ${beneficiaryName} must have met in person at least once within the 2 years before filing your petition.\n\nWithout meeting in person first, your K-1 petition will likely be denied. USCIS needs proof that you've already met, like photos together or travel records.`);
    }

    if (currentData.section2_marriageBroker_DQ) {
      messages.push(`USCIS generally does not approve K-1 visas for couples who met through an international marriage broker (a business that matches Americans with foreign partners for marriage).\n\nIf you met ${beneficiaryName} through such a service, additional legal requirements apply and your petition may face extra scrutiny or denial.`);
    }

    if (currentData.section2_intentToMarry_DQ) {
      messages.push(`The K-1 visa requires that you and ${beneficiaryName} intend to marry within 90 days of ${beneficiaryName}'s arrival in the U.S.\n\nIf you don't plan to marry within this timeframe, the K-1 visa is not the right option. USCIS will deny your petition if you cannot demonstrate this intent.`);
    }

    if (currentData.section2_relationship_DQ) {
      // This is complex - multiple possible relationship DQ scenarios
      // For now, use a generic message
      messages.push(`Based on your relationship status, there may be legal restrictions on your marriage in your chosen state.\n\nUSCIS requires that your marriage be legally valid under state law. Please review your answers and consult with our support team about your specific situation.`);
    }

    return messages;
  };


  // Show standalone disqualification screen when trying to leave section with DQs
  if (showDisqualification) {
    const dqMessages = getDQMessages();
    return (
      <DisqualificationStandaloneScreen
        reasons={dqMessages}
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
      nextButtonDisabled={!meetingCircumstances || meetingCircumstances.trim().length === 0}
    >
      {/* Incomplete Warning Modal */}
      {showIncompleteWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              ⚠️ Incomplete Questions
            </h3>
            <p className="text-sm text-gray-700 mb-6">
              Please complete all questions in this section before moving on.
            </p>
            <button
              onClick={() => setShowIncompleteWarning(false)}
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded transition-colors"
            >
              Go Back and Complete
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-sm font-semibold text-gray-900 mb-2">
            Describe the circumstances of your in-person meeting with {beneficiaryName}
          </p>
        </div>

        {/* Strategic Guidance Panel */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-3">
          <div>
            <p className="text-xs font-semibold text-blue-900 mb-2">
              📋 What we are asking and why:
            </p>
            <p className="text-xs text-blue-800">
              K-1 visa applications require proof that you and {beneficiaryName} met in person within the last 2 years. Before you describe your meeting, think about which meeting you have the most evidence for.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold text-blue-900 mb-2">
              📄 Evidence types that strengthen your application:
            </p>
            <ul className="text-xs text-blue-800 space-y-1 ml-4 list-disc">
              <li>Passport entry/exit stamps showing travel dates</li>
              <li>Boarding passes or airline tickets</li>
              <li>Hotel receipts or accommodation confirmations</li>
              <li>Photos together with family members or friends (with dates)</li>
              <li>Dated receipts from restaurants, attractions, or activities</li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold text-blue-900 mb-2">
              ✍️ Keep it simple and factual:
            </p>
            <p className="text-xs text-blue-800 mb-2">
              Your application mainly needs to verify you physically met—not hear your complete love story.
            </p>
            <p className="text-xs text-blue-800 mb-2">
              <strong>Good to include:</strong> Date, location, how long you stayed together, what you did together, where you stayed
            </p>
            <p className="text-xs text-blue-800">
              <strong>Keep it brief:</strong> 3-5 sentences (about 50-150 words) is perfect
            </p>
          </div>
        </div>

        {/* Free Text Area */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-900">
            Your response:
          </label>
          <div className="relative">
            <textarea
              value={meetingCircumstances}
              onChange={(e) => updateField('meetingCircumstances', e.target.value)}
              rows={8}
              placeholder="Example: I traveled to Manila, Philippines from June 15-30, 2024 to meet Maria. We had been communicating online for 8 months prior. During my visit, I stayed at the Manila Hotel and met her family including her parents and two siblings. We spent time together daily exploring the city."
              className="w-full px-3 py-2 pb-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <div className="absolute bottom-2 right-3 text-xs text-gray-500">
              {meetingCircumstances.trim().split(/\s+/).filter(w => w.length > 0).length} words
            </div>
          </div>

          {/* Word Count Warning (only if >300 words) */}
          {meetingCircumstances.trim().split(/\s+/).filter(w => w.length > 0).length > 300 && (
            <p className="text-xs text-yellow-700">
              Consider shortening your response. 3-5 sentences (about 50-150 words) is perfect.
            </p>
          )}

          {/* Toggle for Examples */}
          <button
            type="button"
            onClick={() => setShowMeetingExamples(!showMeetingExamples)}
            className="text-xs text-blue-600 hover:text-blue-800 underline"
          >
            {showMeetingExamples ? 'Hide examples' : 'Show more examples'}
          </button>

          {/* Examples Section */}
          {showMeetingExamples && (
            <div className="mt-3 p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-4">
              <div>
                <p className="text-xs font-semibold text-gray-900 mb-1">Example 1:</p>
                <p className="text-xs text-gray-700 italic">
                  "I traveled to Tokyo, Japan from March 10-24, 2024 to meet Yuki. We had been communicating online since August 2023. During my visit, I stayed at the Park Hyatt Tokyo and met her parents and younger brother. We spent time together daily and got engaged on March 20, 2024."
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-900 mb-1">Example 2:</p>
                <p className="text-xs text-gray-700 italic">
                  "I most recently visited Carlos in Mexico City from January 5-19, 2025. I stayed at the Hilton Mexico City Reforma and spent time with him and his family daily exploring the city and sharing meals together."
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-900 mb-1">Example 3:</p>
                <p className="text-xs text-gray-700 italic">
                  "Anna and I met in Dubai, UAE from September 1-14, 2024. We both traveled there to spend time together. We stayed at separate hotels but spent our days together visiting the city."
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </ScreenLayout>
  );
};

export default MeetingDescriptionScreen;
