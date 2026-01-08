import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import DisqualificationStandaloneScreen from './DisqualificationStandaloneScreen';

/**
 * SectionTimeline Component
 *
 * Horizontal timeline showing all sections with:
 * - Visual progress line
 * - Active section highlighted
 * - Completed sections marked with checkmark
 * - Clickable to jump to sections
 * - DQ blocking when trying to leave Section 2
 */
const SectionTimeline = ({ sections, currentSectionId, currentData = {} }) => {
  const navigate = useNavigate();
  const [showDisqualification, setShowDisqualification] = useState(false);
  const [showIncompleteWarning, setShowIncompleteWarning] = useState(false);

  // Get unique sections (remove sponsor/beneficiary duplicates)
  const getUniqueSections = () => {
    const seen = new Set();
    const unique = [];

    sections.forEach(section => {
      // Include sections that apply to both (like Your Relationship)
      if (section.appliesToBoth) {
        unique.push(section);
        return;
      }

      // For sponsor/beneficiary duplicate sections, only show once
      const key = section.title;
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(section);
      }
    });

    return unique;
  };

  const uniqueSections = getUniqueSections();

  // Check if user has ANY DQs in Section 2
  const hasSection2DQ = () => {
    return !!(
      currentData.section2_legallyFree_DQ ||
      currentData.section2_metInPerson_DQ ||
      currentData.section2_marriageBroker_DQ ||
      currentData.section2_intentToMarry_DQ ||
      currentData.section2_relationship_DQ
    );
  };

  // Check if user has ANY DQs in Section 6 (Sponsor)
  const hasSection6DQ = () => {
    return !!(
      currentData.section6_protectionOrder_DQ ||
      currentData.section6_domesticViolence_DQ ||
      currentData.section6_violentCrimes_DQ ||
      currentData.section6_drugAlcohol_DQ ||
      currentData.section6_otherCriminalHistory_DQ
    );
  };

  // Check if user has ANY DQs in Section 6 (Beneficiary)
  const hasBeneficiarySection6DQ = () => {
    return !!(
      currentData.section6_beneficiary_willBeInUS_DQ ||
      currentData.section6_beneficiary_criminalHistory_DQ ||
      currentData.section6_beneficiary_immigrationIssues_DQ ||
      currentData.section6_beneficiary_health_DQ ||
      currentData.section6_beneficiary_security_DQ
    );
  };

  // Check if user has ANY DQs in Section 7
  const hasSection7DQ = () => {
    return !!(
      currentData.section7_twoPlus_DQ ||
      currentData.section7_withinTwoYears_DQ ||
      currentData.section7_currentSpouse_DQ
    );
  };

  // Check if Section 2 has incomplete questions (user engaged but didn't finish)
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

  const navigateToSection = (section) => {
    // SCENARIO D: If currently in Section 2 and trying to navigate to a different section
    // Check if ANY DQ exists OR incomplete questions in Section 2 and block navigation
    if (currentSectionId === 'section-2-relationship' && section.id !== 'section-2-relationship') {
      if (hasSection2DQ()) {
        setShowDisqualification(true);
        return;
      }
      if (hasSection2Incomplete()) {
        setShowIncompleteWarning(true);
        return;
      }
    }

    // SCENARIO E: If currently in Section 6 (Sponsor) and trying to navigate to a different section
    // Check if ANY DQ exists in Section 6 and block navigation
    if (currentSectionId === 'section-6-legal' && section.id !== 'section-6-legal') {
      if (hasSection6DQ()) {
        setShowDisqualification(true);
        return;
      }
    }

    // SCENARIO F: If currently in Section 6 (Beneficiary) and trying to navigate to a different section
    // Check if ANY DQ exists in beneficiary Section 6 and block navigation
    if (currentSectionId === 'section-6-legal-beneficiary' && section.id !== 'section-6-legal-beneficiary') {
      if (hasBeneficiarySection6DQ()) {
        setShowDisqualification(true);
        return;
      }
    }

    // SCENARIO G: If currently in Section 7 and trying to navigate to a different section
    // Check if ANY DQ exists in Section 7 and block navigation
    if (currentSectionId === 'section-7-petitions' && section.id !== 'section-7-petitions') {
      if (hasSection7DQ()) {
        setShowDisqualification(true);
        return;
      }
    }

    if (section.subsections && section.subsections.length > 0) {
      const firstSubsection = section.subsections[0];

      // Check if first subsection uses oneQuestionPerScreen format (Section 2)
      if (firstSubsection.oneQuestionPerScreen && firstSubsection.screens && firstSubsection.screens.length > 0) {
        // Navigate to first screen within the subsection
        const firstScreen = firstSubsection.screens[0];
        navigate(`/${section.id}/${firstScreen.id}`);
      } else {
        // Regular subsection navigation
        navigate(`/${section.id}/${firstSubsection.id}`);
      }
    }
  };

  const isSectionActive = (section) => {
    // Check if current section ID matches
    if (section.id === currentSectionId) return true;

    // For sections with both sponsor/beneficiary instances (Personal Information),
    // highlight if EITHER instance is active
    const currentSection = sections.find(s => s.id === currentSectionId);
    if (currentSection && section.title === currentSection.title) {
      return true;
    }

    return false;
  };

  const isSectionCompleted = (section) => {
    // TODO: Calculate based on actual completion
    // For now, return false
    return false;
  };

  // Collect all DQ messages for Section 2 and Section 6
  const getDQMessages = () => {
    const messages = [];
    const beneficiaryName = currentData.beneficiaryFirstName || 'your fiancé(e)';

    // Section 2 DQ messages
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
      messages.push(`Based on your relationship status, there may be legal restrictions on your marriage in your chosen state.\n\nUSCIS requires that your marriage be legally valid under state law. Please review your answers and consult with our support team about your specific situation.`);
    }

    // Section 6 (Sponsor) DQ messages
    if (currentData.section6_protectionOrder_DQ ||
        currentData.section6_domesticViolence_DQ ||
        currentData.section6_violentCrimes_DQ ||
        currentData.section6_drugAlcohol_DQ ||
        currentData.section6_otherCriminalHistory_DQ) {
      messages.push("USCIS carefully reviews criminal history when evaluating K-1 visa petitions. Based on your answer, your application requires in-depth review and personalized guidance.");
    }

    // Section 6 (Beneficiary) DQ messages
    if (currentData.section6_beneficiary_willBeInUS_DQ) {
      messages.push(`Based on your answers, the K-1 fiancé(e) visa may not be the best option for your situation.\n\nThe K-1 visa requires ${beneficiaryName} to apply for the visa at a U.S. embassy or consulate in their home country. ${beneficiaryName} cannot "switch" to K-1 status while already in the United States.\n\nIf ${beneficiaryName} will still be in the U.S. when you're ready to file, you may want to consider alternative options such as getting married and filing for adjustment of status (Form I-130/I-485) instead.`);
    }

    if (currentData.section6_beneficiary_criminalHistory_DQ ||
        currentData.section6_beneficiary_immigrationIssues_DQ ||
        currentData.section6_beneficiary_health_DQ ||
        currentData.section6_beneficiary_security_DQ) {
      messages.push(`USCIS carefully reviews ${beneficiaryName}'s background when evaluating K-1 visa applications. Based on your answers, this case requires in-depth review and personalized guidance.`);
    }

    // Section 7 DQ messages - single encompassing message for all DQ scenarios
    const hasAnySection7DQ = !!(
      currentData.section7_twoPlus_DQ ||
      currentData.section7_withinTwoYears_DQ ||
      currentData.section7_currentSpouse_DQ
    );

    if (hasAnySection7DQ) {
      messages.push(`Based on your answers, the K-1 visa may not be the best option for your situation.\n\nUSCIS has specific requirements and limitations regarding previous K-1 petition filings. Your responses indicate circumstances that may require additional documentation, waivers, or alternative visa pathways.\n\nPlease contact our support team for personalized guidance on your specific situation.`);
    }

    return messages;
  };


  const handleGoBack = () => {
    setShowDisqualification(false);
  };

  // Show standalone disqualification screen when trying to leave Section 2 with DQs
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
    <>
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

    <div className="bg-white border-b border-gray-200 px-8 py-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between gap-2">
          {uniqueSections.map((section, index) => {
            const isActive = isSectionActive(section);
            const isCompleted = isSectionCompleted(section);

            return (
              <React.Fragment key={section.id}>
                {/* Section Step */}
                <button
                  onClick={() => navigateToSection(section)}
                  className="flex flex-col items-center gap-2 group flex-shrink-0"
                >
                  {/* Circle/Checkmark */}
                  <div
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center
                      transition-all duration-200
                      ${isActive
                        ? 'bg-blue-600 ring-4 ring-blue-100'
                        : isCompleted
                        ? 'bg-green-600'
                        : 'bg-gray-200 group-hover:bg-gray-300'
                      }
                    `}
                  >
                    {isCompleted ? (
                      <Check className="h-5 w-5 text-white" />
                    ) : (
                      <span
                        className={`
                          text-sm font-semibold
                          ${isActive ? 'text-white' : 'text-gray-600'}
                        `}
                      >
                        {index + 1}
                      </span>
                    )}
                  </div>

                  {/* Section Title */}
                  <span
                    className={`
                      text-xs font-medium text-center max-w-[120px]
                      transition-colors
                      ${isActive
                        ? 'text-blue-600'
                        : isCompleted
                        ? 'text-green-600'
                        : 'text-gray-500 group-hover:text-gray-700'
                      }
                    `}
                  >
                    {section.title}
                  </span>
                </button>

                {/* Connecting Line (except after last section) */}
                {index < uniqueSections.length - 1 && (
                  <div
                    className={`
                      flex-1 h-1 rounded
                      transition-colors
                      ${isCompleted ? 'bg-green-600' : 'bg-gray-200'}
                    `}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
    </>
  );
};

export default SectionTimeline;
