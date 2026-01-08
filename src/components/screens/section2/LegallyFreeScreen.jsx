import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ScreenLayout from '../../ScreenLayout';
import DisqualificationStandaloneScreen from '../../DisqualificationStandaloneScreen';
import { getNextScreen, isFirstScreen } from '../../../utils/navigationUtils';

/**
 * LegallyFreeScreen - Section 2, Visa Requirements Question 1
 * Content copied exactly from Section1.jsx Question 1 (lines 211-259)
 */
const LegallyFreeScreen = ({
  currentData,
  updateField,
  userRole
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const legallyFree = currentData.legallyFreeToMarry || null;
  const [showDisqualification, setShowDisqualification] = useState(false);
  const [hasDQ, setHasDQ] = useState(false);

  const handleNext = () => {
    // Check for DQ before navigating
    if (hasDQ) {
      setShowDisqualification(true);
      return;
    }

    const nextPath = getNextScreen(location.pathname, userRole);
    if (nextPath) {
      navigate(nextPath);
    }
  };

  const isFirst = isFirstScreen(location.pathname, userRole);

  // Get names from data
  const sponsorFirstName = currentData.sponsorFirstName || 'you';
  const beneficiaryName = currentData.beneficiaryFirstName || 'your fiancé(e)';

  // Track DQ state (but don't show standalone screen yet)
  useEffect(() => {
    if (legallyFree === 'no') {
      setHasDQ(true);
      updateField('section2_legallyFree_DQ', true);
    } else {
      setHasDQ(false);
      setShowDisqualification(false);
      updateField('section2_legallyFree_DQ', false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [legallyFree]);

  // Reset DQ screen when navigating away from this screen
  useEffect(() => {
    // Only show DQ screen when we're actually on THIS screen's path
    const isOnThisScreen = location.pathname.includes('/legally-free');
    if (!isOnThisScreen) {
      setShowDisqualification(false);
    }
  }, [location.pathname]);

  // Handle "Go Back" button - don't clear user's answer, just hide DQ screen
  const handleGoBack = () => {
    setShowDisqualification(false);
  };

  // Tailored DQ message
  const dqMessage = `To qualify for a K-1 visa, both you and ${beneficiaryName} must be legally free to marry. This means neither of you can be currently married to anyone else.\n\nIf either of you is still legally married, your K-1 petition won't be approved and ${beneficiaryName} won't be able to enter the U.S. on a K-1 visa.`;

  // Show standalone disqualification screen (only when on this screen's path AND showDisqualification is true)
  const isOnThisScreen = location.pathname.includes('/legally-free');
  if (showDisqualification && isOnThisScreen) {
    return (
      <DisqualificationStandaloneScreen
        reason={dqMessage}
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
      nextButtonDisabled={!legallyFree}
    >
      <div className="space-y-4">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-sm font-semibold text-gray-900 mb-2">
            Are both {sponsorFirstName} and {beneficiaryName} legally free to marry under U.S. law?
          </p>
          <div className="mt-3 text-xs text-gray-700 bg-white border border-gray-200 rounded p-3">
            <p className="font-medium text-gray-900 mb-2">What this means:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Both must meet your state's minimum age for marriage (18 in most states)</li>
              <li>Neither can be currently married to anyone else, anywhere in the world</li>
              <li>All previous marriages must be legally terminated (divorce, death, or annulment)</li>
            </ul>
          </div>
        </div>

        <div className="space-y-3">
          <label className="flex items-center space-x-3 p-4 border-2 border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
            <input
              type="radio"
              name="legallyFree"
              value="yes"
              checked={legallyFree === 'yes'}
              onChange={(e) => updateField('legallyFreeToMarry', e.target.value)}
              className="h-4 w-4 text-blue-600"
            />
            <span className="text-sm font-medium text-gray-900">Yes</span>
          </label>

          <label className="flex items-center space-x-3 p-4 border-2 border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
            <input
              type="radio"
              name="legallyFree"
              value="no"
              checked={legallyFree === 'no'}
              onChange={(e) => updateField('legallyFreeToMarry', e.target.value)}
              className="h-4 w-4 text-blue-600"
            />
            <span className="text-sm font-medium text-gray-900">No</span>
          </label>
        </div>

        {/* Inline Warning - Appears immediately when "No" is selected */}
        {legallyFree === 'no' && (
          <div className="mt-4 p-5 bg-red-50 border-l-4 border-red-500 rounded-lg">
            <p className="text-sm font-semibold text-red-900 mb-3">
              ⚠️ USCIS Requirement Conflict
            </p>
            <p className="text-sm text-red-800 mb-3">
              To qualify for a K-1 visa, both you and {beneficiaryName} must be legally
              free to marry. This means neither of you can be currently married to anyone else.
            </p>
            <p className="text-sm text-red-800">
              If either of you is still legally married, your K-1 petition won't be approved
              and {beneficiaryName} won't be able to enter the U.S. on a K-1 visa.
            </p>
          </div>
        )}
      </div>
    </ScreenLayout>
  );
};

export default LegallyFreeScreen;
