// This script reads Section1_7.jsx and outputs PreviousPetitionsScreen.jsx
const fs = require('fs');

const sourceFile = 'C:/Users/vnix8/Documents/k1-visa-app/src/components/sections/Section1_7.jsx';
const source = fs.readFileSync(sourceFile, 'utf8');

// Extract the component body (everything after the component declaration)
const componentStart = source.indexOf('const Section1_7 = ({ currentData = {}, updateField }) => {');
const componentBody = source.substring(componentStart);

// Get just the body content (remove the const declaration and closing export)
const bodyStart = componentBody.indexOf('{') + 1;
const bodyEnd = componentBody.lastIndexOf('export default Section1_7;');
const innerBody = componentBody.substring(bodyStart, bodyEnd);

// Create the new screen component
const newComponent = `import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Info, Plus, Trash2, AlertCircle, CheckCircle } from 'lucide-react';
import ScreenLayout from '../../ScreenLayout';
import { getNextScreen, getPreviousScreen, isFirstScreen } from '../../../utils/navigationUtils';

const PreviousPetitionsScreen = ({ currentData = {}, updateField }) => {
  const navigate = useNavigate();
  const location = useLocation();

  ${innerBody.trim()}

  // Navigation handlers
  const handleBack = () => {
    const prevScreen = getPreviousScreen(location.pathname, currentData.userRole, currentData);
    if (prevScreen) {
      navigate(prevScreen);
    }
  };

  const handleNext = () => {
    const nextScreen = getNextScreen(location.pathname, currentData.userRole, currentData);
    if (nextScreen) {
      navigate(nextScreen);
    }
  };

  const isFirst = isFirstScreen(location.pathname, currentData.userRole, currentData);

  // Disable Next button if IMBRA waiver is needed OR required questions aren't answered
  const isNextDisabled = needsIMBRAWaiver || hasPreviousPetitions === null || hasChildrenUnder18 === null;

  return (
    <ScreenLayout
      showBackButton={!isFirst}
      showNextButton={true}
      onBack={handleBack}
      onNext={handleNext}
      nextButtonDisabled={isNextDisabled}
    >
REPLACE_RETURN_CONTENT
    </ScreenLayout>
  );
};

export default PreviousPetitionsScreen;
`;

console.log(newComponent);
