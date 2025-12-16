import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';

/**
 * SectionTimeline Component
 *
 * Horizontal timeline showing all sections with:
 * - Visual progress line
 * - Active section highlighted
 * - Completed sections marked with checkmark
 * - Clickable to jump to sections
 */
const SectionTimeline = ({ sections, currentSectionId }) => {
  const navigate = useNavigate();

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

  const navigateToSection = (section) => {
    if (section.subsections && section.subsections.length > 0) {
      const firstSubsection = section.subsections[0];
      navigate(`/${section.id}/${firstSubsection.id}`);
    }
  };

  const isSectionActive = (section) => {
    return section.id === currentSectionId;
  };

  const isSectionCompleted = (section) => {
    // TODO: Calculate based on actual completion
    // For now, return false
    return false;
  };

  return (
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
  );
};

export default SectionTimeline;
