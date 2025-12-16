import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import NavigationPanel from './components/NavigationPanel';
import NameScreen from './components/screens/NameScreen';
import questionnaireStructure from './data/sectionStructure';

/**
 * QuestionnaireRouter Component
 *
 * Main router for the multi-screen questionnaire experience
 * Manages:
 * - URL-based navigation
 * - Global state (currentData)
 * - Navigation panel integration
 * - Screen routing
 */
const QuestionnaireRouter = () => {
  // Global questionnaire state
  const [currentData, setCurrentData] = useState({
    // TODO: Pre-fill from qualification test when connected
    USER_FIRST_NAME: 'Your',
    PARTNER_FIRST_NAME: "Partner's",
    // For now, assume user is sponsor (will come from qualification test)
    userRole: 'SPONSOR'
  });

  const updateField = (field, value) => {
    setCurrentData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <BrowserRouter>
      <div className="flex h-screen overflow-hidden">
        {/* Navigation Panel */}
        <NavigationPanel
          sections={questionnaireStructure.sections}
          currentData={currentData}
          userRole={currentData.userRole}
        />

        {/* Main Content Area with Routes */}
        <Routes>
          {/* Default route - redirect to first screen */}
          <Route
            path="/"
            element={<Navigate to="/section-1-personal-info/name" replace />}
          />

          {/* Sample screen route - NAME subsection for sponsor */}
          <Route
            path="/section-1-personal-info/name"
            element={
              <NameScreen
                currentData={currentData}
                updateField={updateField}
                userRole={currentData.userRole}
                isSponsor={true}
              />
            }
          />

          {/* Sample screen route - NAME subsection for beneficiary */}
          <Route
            path="/section-1-personal-info-beneficiary/name"
            element={
              <NameScreen
                currentData={currentData}
                updateField={updateField}
                userRole={currentData.userRole}
                isSponsor={false}
              />
            }
          />

          {/* TODO: Add routes for all other subsections */}
          {/* For now, we'll show a placeholder for undefined routes */}
          <Route
            path="/:sectionId/:subsectionId"
            element={
              <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Screen Under Construction
                  </h2>
                  <p className="text-gray-600">
                    This screen will be implemented soon.
                  </p>
                  <p className="text-sm text-gray-500 mt-4">
                    Check the URL to see which section you're viewing
                  </p>
                </div>
              </div>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default QuestionnaireRouter;
