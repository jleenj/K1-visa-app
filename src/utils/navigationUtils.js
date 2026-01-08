import questionnaireStructure from '../data/sectionStructure';

/**
 * Navigation Utilities
 *
 * Handles navigation logic:
 * - Determining next/previous screens
 * - Checking if screen is first/last
 * - Building navigation paths
 */

/**
 * Get all screens in order (flattened list)
 * This creates the master navigation sequence
 */
export const getAllScreens = (userRole, currentData = {}) => {
  const screens = [];

  questionnaireStructure.sections.forEach(section => {
    // Include all sections:
    // - appliesToBoth (like Your Relationship)
    // - sponsor sections (isSponsor === true)
    // - beneficiary sections (isSponsor === false)
    // Skip only sponsor-only sections when they don't apply
    if (section.sponsorOnly && userRole !== 'SPONSOR') {
      return; // Skip sponsor-only sections for non-sponsors
    }

    section.subsections.forEach(subsection => {
      // Check if subsection has a showWhen condition
      if (subsection.showWhen && typeof subsection.showWhen === 'function') {
        // Evaluate the condition - skip if it returns false
        if (!subsection.showWhen(currentData)) {
          return; // Skip this subsection
        }
      }

      // Check if this subsection uses one-question-per-screen format (Section 2)
      if (subsection.oneQuestionPerScreen && subsection.screens) {
        // Add each screen as a separate navigation item
        subsection.screens.forEach(screen => {
          screens.push({
            sectionId: section.id,
            subsectionId: screen.id, // Use screen ID instead of subsection ID
            sectionTitle: section.title,
            subsectionTitle: subsection.title,
            path: `/${section.id}/${screen.id}`
          });
        });
      } else {
        // Regular subsection (one screen per subsection)
        screens.push({
          sectionId: section.id,
          subsectionId: subsection.id,
          sectionTitle: section.title,
          subsectionTitle: subsection.title,
          path: `/${section.id}/${subsection.id}`
        });
      }
    });
  });

  return screens;
};

/**
 * Get the next screen path
 */
export const getNextScreen = (currentPath, userRole, currentData = {}) => {
  const screens = getAllScreens(userRole, currentData);
  const currentIndex = screens.findIndex(s => s.path === currentPath);

  if (currentIndex === -1 || currentIndex === screens.length - 1) {
    return null; // No next screen
  }

  return screens[currentIndex + 1].path;
};

/**
 * Get the previous screen path
 */
export const getPreviousScreen = (currentPath, userRole, currentData = {}) => {
  const screens = getAllScreens(userRole, currentData);
  const currentIndex = screens.findIndex(s => s.path === currentPath);

  if (currentIndex === -1 || currentIndex === 0) {
    return null; // No previous screen
  }

  return screens[currentIndex - 1].path;
};

/**
 * Check if this is the first screen
 */
export const isFirstScreen = (currentPath, userRole, currentData = {}) => {
  const screens = getAllScreens(userRole, currentData);
  return screens.length > 0 && screens[0].path === currentPath;
};

/**
 * Check if this is the last screen
 */
export const isLastScreen = (currentPath, userRole, currentData = {}) => {
  const screens = getAllScreens(userRole, currentData);
  return screens.length > 0 && screens[screens.length - 1].path === currentPath;
};

/**
 * Get current screen info
 */
export const getCurrentScreenInfo = (currentPath) => {
  const pathParts = currentPath.split('/').filter(Boolean);

  if (pathParts.length < 2) {
    return null;
  }

  const sectionId = pathParts[0];
  const subsectionId = pathParts[1];

  const section = questionnaireStructure.sections.find(s => s.id === sectionId);
  const subsection = section?.subsections.find(ss => ss.id === subsectionId);

  if (!section || !subsection) {
    return null;
  }

  return {
    sectionId,
    subsectionId,
    sectionTitle: section.title,
    subsectionTitle: subsection.title,
    section,
    subsection
  };
};
