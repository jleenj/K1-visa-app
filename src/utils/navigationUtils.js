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
export const getAllScreens = (userRole) => {
  const screens = [];

  questionnaireStructure.sections.forEach(section => {
    // Skip sections that don't apply
    if (section.appliesToBoth || section.isSponsor === (userRole === 'SPONSOR') || section.isSponsor === undefined) {
      section.subsections.forEach(subsection => {
        screens.push({
          sectionId: section.id,
          subsectionId: subsection.id,
          sectionTitle: section.title,
          subsectionTitle: subsection.title,
          path: `/${section.id}/${subsection.id}`
        });
      });
    }
  });

  return screens;
};

/**
 * Get the next screen path
 */
export const getNextScreen = (currentPath, userRole) => {
  const screens = getAllScreens(userRole);
  const currentIndex = screens.findIndex(s => s.path === currentPath);

  if (currentIndex === -1 || currentIndex === screens.length - 1) {
    return null; // No next screen
  }

  return screens[currentIndex + 1].path;
};

/**
 * Get the previous screen path
 */
export const getPreviousScreen = (currentPath, userRole) => {
  const screens = getAllScreens(userRole);
  const currentIndex = screens.findIndex(s => s.path === currentPath);

  if (currentIndex === -1 || currentIndex === 0) {
    return null; // No previous screen
  }

  return screens[currentIndex - 1].path;
};

/**
 * Check if this is the first screen
 */
export const isFirstScreen = (currentPath, userRole) => {
  const screens = getAllScreens(userRole);
  return screens.length > 0 && screens[0].path === currentPath;
};

/**
 * Check if this is the last screen
 */
export const isLastScreen = (currentPath, userRole) => {
  const screens = getAllScreens(userRole);
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
