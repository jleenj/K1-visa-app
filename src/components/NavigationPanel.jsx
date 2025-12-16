import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight, User } from 'lucide-react';

/**
 * NavigationPanel Component
 *
 * Boundless-style left sidebar navigation with:
 * - Collapsible user/partner profiles
 * - Subsection navigation
 * - Active state highlighting
 * - Overall progress tracking
 */
const NavigationPanel = ({ sections, currentData, userRole }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine which profile belongs to user vs partner
  // userRole comes from qualification test (SPONSOR or BENEFICIARY)
  const userSections = sections.filter(s => {
    if (s.appliesToBoth) return false; // Section 2 (Relationship) - not in profiles
    return userRole === 'SPONSOR' ? s.isSponsor : !s.isSponsor;
  });

  const partnerSections = sections.filter(s => {
    if (s.appliesToBoth) return false;
    return userRole === 'SPONSOR' ? !s.isSponsor : s.isSponsor;
  });

  const relationshipSection = sections.find(s => s.appliesToBoth);

  // Track which profile is expanded (user's or partner's)
  const [expandedProfile, setExpandedProfile] = useState('user'); // 'user' or 'partner'

  // Get names from qualification test data (or use defaults)
  const userName = currentData.USER_FIRST_NAME || 'Your';
  const partnerName = currentData.PARTNER_FIRST_NAME || "Partner's";

  // Calculate overall progress
  const calculateProgress = () => {
    // TODO: Calculate based on completed fields
    // For now, return 0
    return 0;
  };

  const toggleProfile = (profile) => {
    setExpandedProfile(expandedProfile === profile ? null : profile);
  };

  const navigateToScreen = (sectionId, subsectionId) => {
    const path = `/${sectionId}/${subsectionId}`;
    navigate(path);
  };

  const isActive = (sectionId, subsectionId) => {
    return location.pathname === `/${sectionId}/${subsectionId}`;
  };

  const renderSubsections = (section) => {
    if (!section.subsections) return null;

    return (
      <div className="ml-4 mt-2 space-y-1">
        {section.subsections.map(subsection => (
          <button
            key={subsection.id}
            onClick={() => navigateToScreen(section.id, subsection.id)}
            className={`
              w-full text-left px-3 py-2 text-sm rounded
              transition-colors duration-150
              ${isActive(section.id, subsection.id)
                ? 'bg-blue-100 text-blue-700 font-medium'
                : 'text-gray-600 hover:bg-gray-100'
              }
            `}
          >
            {subsection.title}
          </button>
        ))}
      </div>
    );
  };

  const renderProfile = (profileSections, profileName, profileType) => {
    const isExpanded = expandedProfile === profileType;

    return (
      <div className="mb-4">
        {/* Profile Header */}
        <button
          onClick={() => toggleProfile(profileType)}
          className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-gray-500" />
            <span className="uppercase tracking-wide text-xs text-gray-500">
              {profileName} Profile
            </span>
          </div>
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 text-gray-400" />
          ) : (
            <ChevronRight className="h-4 w-4 text-gray-400" />
          )}
        </button>

        {/* Profile Sections (when expanded) */}
        {isExpanded && (
          <div className="mt-1 space-y-1">
            {profileSections.map(section => (
              <div key={section.id}>
                {renderSubsections(section)}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-64 h-screen bg-gray-50 border-r border-gray-200 flex flex-col">
      {/* Progress Indicator */}
      <div className="px-4 py-4 border-b border-gray-200 bg-white">
        <div className="text-xs font-medium text-gray-500 mb-1">
          Overall Progress
        </div>
        <div className="text-2xl font-bold text-gray-900">
          {calculateProgress()}%
        </div>
      </div>

      {/* Navigation Content */}
      <div className="flex-1 overflow-y-auto py-4">
        {/* User's Profile */}
        {renderProfile(userSections, userName, 'user')}

        {/* Partner's Profile */}
        {renderProfile(partnerSections, partnerName, 'partner')}

        {/* Relationship Section (if exists) */}
        {relationshipSection && (
          <div className="px-4 py-2">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
              {relationshipSection.title}
            </div>
            {renderSubsections(relationshipSection)}
          </div>
        )}
      </div>

      {/* Footer (optional - could add help link, save button, etc.) */}
      <div className="px-4 py-3 border-t border-gray-200 bg-white">
        <button className="w-full px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
          Save & Exit
        </button>
      </div>
    </div>
  );
};

export default NavigationPanel;
