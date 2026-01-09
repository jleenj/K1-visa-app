import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight, User, AlertCircle } from 'lucide-react';
import SubsectionProgressBar from './SubsectionProgressBar';

/**
 * NavigationPanel Component - SECTION-AWARE VERSION
 *
 * Shows:
 * - Section tracker at top (all sections, clickable to jump)
 * - Only subsections of CURRENT section
 * - User/Partner profile toggle
 */
const NavigationPanel = ({ sections, currentData, userRole }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine current section from URL
  const getCurrentSection = () => {
    const pathParts = location.pathname.split('/').filter(Boolean);
    if (pathParts.length > 0) {
      return pathParts[0]; // e.g., 'section-1-personal-info'
    }
    return null;
  };

  const currentSectionId = getCurrentSection();

  // Find the current section object
  const currentSection = sections.find(s => s.id === currentSectionId);

  // Get unique sections for the tracker (remove duplicates like sponsor/beneficiary instances)
  const getUniqueSections = () => {
    const seen = new Set();
    const unique = [];

    sections.forEach(section => {
      // Skip relationship section in profile view
      if (section.appliesToBoth) return;

      // Create a key based on title only (groups sponsor/beneficiary instances)
      const key = section.title;

      if (!seen.has(key)) {
        seen.add(key);
        unique.push(section);
      }
    });

    return unique;
  };

  const uniqueSections = getUniqueSections();

  // Track which profile is expanded (user's or partner's)
  const [expandedProfile, setExpandedProfile] = useState('user');

  // Get names from data
  const userName = currentData.USER_FIRST_NAME || 'Your';
  const partnerName = currentData.PARTNER_FIRST_NAME || "Partner's";

  const toggleProfile = (profile) => {
    setExpandedProfile(expandedProfile === profile ? null : profile);
  };

  const navigateToScreen = (sectionId, subsectionId) => {
    // Find the section and subsection
    const section = sections.find(s => s.id === sectionId);
    const subsection = section?.subsections.find(sub => sub.id === subsectionId);

    // Check if subsection uses oneQuestionPerScreen format (like Section 2)
    if (subsection?.oneQuestionPerScreen && subsection?.screens && subsection.screens.length > 0) {
      const firstScreen = subsection.screens[0];
      const path = `/${sectionId}/${firstScreen.id}`;
      navigate(path);
    } else {
      const path = `/${sectionId}/${subsectionId}`;
      navigate(path);
    }
  };

  const navigateToSection = (section) => {
    // Navigate to first subsection of the clicked section
    if (section.subsections && section.subsections.length > 0) {
      const firstSubsection = section.subsections[0];
      navigateToScreen(section.id, firstSubsection.id);
    }
  };

  const isActive = (sectionId, subsectionId) => {
    return location.pathname === `/${sectionId}/${subsectionId}`;
  };

  const isSectionActive = (sectionTitle) => {
    return currentSection && currentSection.title === sectionTitle;
  };

  // Check if a subsection should show a warning icon
  const hasSubsectionWarning = (subsectionId, targetSection) => {
    // Section 5: Employment History incomplete indicator
    if (subsectionId === 'employment-timeline') {
      if (targetSection.id === 'section-5-employment') {
        return currentData.section5_sponsor_incomplete;
      } else if (targetSection.id === 'section-5-employment-beneficiary') {
        return currentData.section5_beneficiary_incomplete;
      }
    }

    // Section 6 Sponsor: Criminal History DQ - shows on criminal-history subsection only
    if (targetSection.id === 'section-6-legal' && subsectionId === 'criminal-history') {
      return !!(
        currentData.section6_protectionOrder_DQ ||
        currentData.section6_domesticViolence_DQ ||
        currentData.section6_violentCrimes_DQ ||
        currentData.section6_drugAlcohol_DQ ||
        currentData.section6_otherCriminalHistory_DQ
      );
    }

    // Section 6 Beneficiary: DQ indicators per subsection
    if (targetSection.id === 'section-6-legal-beneficiary') {
      if (subsectionId === 'us-travel') return !!currentData.section6_beneficiary_willBeInUS_DQ;
      if (subsectionId === 'criminal-history') return !!currentData.section6_beneficiary_criminalHistory_DQ;
      if (subsectionId === 'immigration-issues') return !!currentData.section6_beneficiary_immigrationIssues_DQ;
      if (subsectionId === 'health-vaccinations') return !!currentData.section6_beneficiary_health_DQ;
      if (subsectionId === 'security-human-rights') return !!currentData.section6_beneficiary_security_DQ;
    }

    // Section 7: All DQs are set in Previous Sponsorships screen, so only show icon there
    if (targetSection.id === 'section-7-petitions' && subsectionId === 'previous-sponsorships') {
      return !!(
        currentData.section7_twoPlus_DQ ||
        currentData.section7_withinTwoYears_DQ ||
        currentData.section7_currentSpouse_DQ
      );
    }

    return false;
  };

  // Get completion status for oneQuestionPerScreen subsections
  const getCompletionStatus = (subsection) => {
    if (!subsection.screens) return [];

    return subsection.screens.map(screen => {
      const field = screen.field || (screen.fields && screen.fields[0]);
      return !!(field && currentData[field]);
    });
  };

  // Get disqualification status for oneQuestionPerScreen subsections
  const getDisqualificationStatus = (subsection, targetSection) => {
    if (!subsection.screens) return [];

    // DQ field mapping for different sections
    const dqFieldMaps = {
      'section-2-relationship': {
        'marriage-state': 'section2_relationship_DQ',
        'intent-to-marry': 'section2_intentToMarry_DQ',
        'legally-free': 'section2_legallyFree_DQ',
        'met-in-person': 'section2_metInPerson_DQ',
        'marriage-broker': 'section2_marriageBroker_DQ',
        'relationship': 'section2_relationship_DQ',
      },
      'section-6-legal': {
        'criminal-history-protection-orders': 'section6_protectionOrder_DQ',
        'criminal-history-domestic-violence': 'section6_domesticViolence_DQ',
        'criminal-history-violent-crimes': 'section6_violentCrimes_DQ',
        'criminal-history-drug-alcohol': 'section6_drugAlcohol_DQ',
        'criminal-history-other': 'section6_otherCriminalHistory_DQ',
      }
    };

    const dqFieldMap = dqFieldMaps[targetSection.id] || {};

    return subsection.screens.map((screen, index) => {
      const dqField = dqFieldMap[screen.id];
      const hasDQ = !!(dqField && currentData[dqField]);

      const completionStatus = getCompletionStatus(subsection);
      const isIncomplete = completionStatus[index] === false;

      const field = screen.field || (screen.fields && screen.fields[0]);
      const hasEngaged = !!(field && currentData[field]);

      const isEngagedButIncomplete = hasEngaged && isIncomplete;

      return hasDQ || isEngagedButIncomplete;
    });
  };

  const renderSubsections = (profileType) => {
    if (!currentSection) return null;

    // Find the correct section for this profile type
    let targetSection = null;

    // Handle appliesToBoth sections (Section 2) - receives section object directly
    if (typeof profileType === 'object' && profileType !== null) {
      targetSection = profileType;
    } else if (profileType === 'user') {
      // For user profile, use the sponsor version of the section
      targetSection = sections.find(s =>
        s.title === currentSection.title && s.isSponsor === true
      );
    } else if (profileType === 'partner') {
      // For partner profile, use the beneficiary version of the section
      targetSection = sections.find(s =>
        s.title === currentSection.title && s.isSponsor === false
      );
    }

    if (!targetSection || !targetSection.subsections) return null;

    return (
      <div className="space-y-3">
        {targetSection.subsections.map(subsection => {
          const showWarning = hasSubsectionWarning(subsection.id, targetSection);

          // Check if this subsection uses oneQuestionPerScreen format (like Section 2, Section 6)
          const hasQuestionDots = subsection.oneQuestionPerScreen && subsection.screens;

          // Get current question index if we're in this subsection
          let currentQuestionIndex = null;
          if (hasQuestionDots) {
            const currentPath = location.pathname;
            const screenIndex = subsection.screens.findIndex(screen =>
              currentPath.includes(`/${screen.id}`)
            );
            if (screenIndex !== -1) {
              currentQuestionIndex = screenIndex;
            }
          }

          return (
            <div key={subsection.id}>
              <button
                onClick={() => navigateToScreen(targetSection.id, subsection.id)}
                className={`
                  w-full text-left px-4 py-2 text-sm rounded
                  transition-colors duration-150 flex items-center justify-between
                  ${isActive(targetSection.id, subsection.id)
                    ? 'bg-blue-100 text-blue-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-100'
                  }
                `}
              >
                <span>{subsection.title}</span>
                {showWarning && (
                  <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
                )}
              </button>

              {/* Dot navigation for oneQuestionPerScreen subsections */}
              {hasQuestionDots && (
                <div className="px-4 mt-2">
                  <SubsectionProgressBar
                    completionStatus={getCompletionStatus(subsection)}
                    disqualificationStatus={getDisqualificationStatus(subsection, targetSection)}
                    total={subsection.screens.length}
                    currentQuestionIndex={currentQuestionIndex}
                    onQuestionClick={(index) => {
                      const screen = subsection.screens[index];
                      navigate(`/${targetSection.id}/${screen.id}`);
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderProfile = (profileType) => {
    const isExpanded = expandedProfile === profileType;
    const profileName = profileType === 'user'
      ? `YOUR PROFILE (SPONSOR)`
      : `PARTNER'S PROFILE (BENEFICIARY)`;

    // Only show profile toggle if current section has both sponsor and beneficiary
    const hasBothProfiles = currentSection && !currentSection.appliesToBoth && !currentSection.sponsorOnly;

    if (!hasBothProfiles && profileType === 'partner') {
      return null; // Don't show partner profile for sponsor-only sections
    }

    return (
      <div className="mb-4">
        {/* Profile Header */}
        {hasBothProfiles && (
          <button
            onClick={() => toggleProfile(profileType)}
            className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors text-left"
          >
            <div className="flex items-center gap-2 flex-1">
              <User className="h-4 w-4 text-gray-500 flex-shrink-0" />
              <span className="uppercase tracking-wide text-xs text-gray-500 text-left">
                {profileName}
              </span>
            </div>
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 text-gray-400" />
            ) : (
              <ChevronRight className="h-4 w-4 text-gray-400" />
            )}
          </button>
        )}

        {/* Profile Subsections (when expanded OR when it's the only profile) */}
        {(isExpanded || !hasBothProfiles) && (
          <div className="mt-1">
            {renderSubsections(profileType)}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-64 h-screen bg-gray-50 border-r border-gray-200 flex flex-col">
      {/* Current Section Navigation */}
      <div className="flex-1 overflow-y-auto py-4 pt-6">
        {currentSection && !currentSection.appliesToBoth && (
          <>
            {renderProfile('user')}
            {renderProfile('partner')}
          </>
        )}

        {/* Relationship Section (no profiles) */}
        {currentSection && currentSection.appliesToBoth && (
          <div className="px-4">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
              {currentSection.title}
            </div>
            {renderSubsections(currentSection, null)}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-gray-200 bg-white">
        <button className="w-full px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
          Save & Exit
        </button>
      </div>
    </div>
  );
};

export default NavigationPanel;
