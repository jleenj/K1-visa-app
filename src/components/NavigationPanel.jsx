import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight, User, AlertCircle } from 'lucide-react';

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
    return false;
  };

  const renderSubsections = (profileType) => {
    if (!currentSection) return null;

    // Find the correct section for this profile type
    let targetSection = null;

    if (profileType === 'user') {
      // For user profile, use the sponsor version of the section
      targetSection = sections.find(s =>
        s.title === currentSection.title && s.isSponsor === true
      );
    } else {
      // For partner profile, use the beneficiary version of the section
      targetSection = sections.find(s =>
        s.title === currentSection.title && s.isSponsor === false
      );
    }

    if (!targetSection || !targetSection.subsections) return null;

    return (
      <div className="space-y-1">
        {targetSection.subsections.map(subsection => {
          const showWarning = hasSubsectionWarning(subsection.id, targetSection);

          return (
            <button
              key={subsection.id}
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
                <AlertCircle className="h-4 w-4 text-amber-500 flex-shrink-0" />
              )}
            </button>
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
