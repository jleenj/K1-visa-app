import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ScreenLayout from '../../ScreenLayout';
import DisqualificationStandaloneScreen from '../../DisqualificationStandaloneScreen';
import { getNextScreen, isFirstScreen } from '../../../utils/navigationUtils';

/**
 * ProtectionOrderScreen - Section 6, Criminal History Question 1
 *
 * Content source: Section1_9.jsx / SponsorCriminalHistoryScreen.jsx
 * Question about protection orders or restraining orders
 */
const ProtectionOrderScreen = ({
  currentData,
  updateField,
  userRole
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const protectionOrder = currentData.sponsorProtectionOrder || null;
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

  // Track DQ state
  useEffect(() => {
    if (protectionOrder === 'yes') {
      setHasDQ(true);
      updateField('section6_protectionOrder_DQ', true);
    } else {
      setHasDQ(false);
      setShowDisqualification(false);
      updateField('section6_protectionOrder_DQ', false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [protectionOrder]);

  // Reset DQ screen when navigating away from this screen
  useEffect(() => {
    const isOnThisScreen = location.pathname.includes('protection-order');
    if (!isOnThisScreen) {
      setShowDisqualification(false);
    }
  }, [location.pathname]);

  // Handle "Go Back" button - don't clear user's answer, just hide DQ screen
  const handleGoBack = () => {
    setShowDisqualification(false);
  };

  // DQ message
  const dqMessage = "USCIS carefully reviews criminal history when evaluating K-1 visa petitions. Based on your answer, your application requires in-depth review and personalized guidance.";

  // Show standalone disqualification screen
  const isOnThisScreen = location.pathname.includes('protection-order');
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

  // Inline warning component (no contact button)
  const DisqualificationMessage = () => (
    <div className="mt-4 p-5 bg-red-50 border-l-4 border-red-500 rounded-lg">
      <p className="text-sm font-semibold text-red-900 mb-3">
        ⚠️ USCIS Requirement Conflict
      </p>
      <p className="text-sm text-red-800">
        USCIS carefully reviews criminal history when evaluating K-1 visa petitions. Your application may require in-depth review and personalized guidance.
      </p>
    </div>
  );

  return (
    <ScreenLayout
      showBackButton={!isFirst}
      onNext={handleNext}
      nextButtonDisabled={!protectionOrder}
    >
      <div className="space-y-4">
        <h4 className="text-base font-semibold text-gray-900">
          Have you EVER been subject to a temporary or permanent protection or restraining order (either civil or criminal)?
        </h4>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2">
          <p className="text-sm text-gray-700 font-medium">This includes:</p>
          <ul className="text-sm text-gray-700 space-y-1 ml-4 list-disc">
            <li>Civil or criminal restraining orders (temporary or permanent)</li>
            <li>Civil or criminal protection orders (temporary or permanent)</li>
            <li>Orders related to domestic situations</li>
            <li>Any such orders, even if dismissed or expired</li>
            <li>Mutual restraining orders (where both parties were restricted)</li>
          </ul>
          <div className="mt-3 text-sm text-gray-600 bg-blue-50 border-l-4 border-blue-300 pl-3 py-2 rounded">
            <span>💡 </span>
            "Subject to" an order means the order was issued <strong>against you</strong>, requiring you to stay away from someone or limiting your contact with them. This does not apply if you obtained a protective order for your own protection (where someone was ordered to stay away from you). However, this does apply to mutual orders where both parties were restricted.
          </div>
        </div>

        <div className="space-y-3">
          <label className="flex items-center space-x-3 p-4 border-2 border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
            <input
              type="radio"
              name="protectionOrder"
              value="yes"
              checked={protectionOrder === 'yes'}
              onChange={(e) => updateField('sponsorProtectionOrder', e.target.value)}
              className="h-4 w-4 text-blue-600"
            />
            <span className="text-sm font-medium text-gray-900">Yes</span>
          </label>

          <label className="flex items-center space-x-3 p-4 border-2 border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
            <input
              type="radio"
              name="protectionOrder"
              value="no"
              checked={protectionOrder === 'no'}
              onChange={(e) => updateField('sponsorProtectionOrder', e.target.value)}
              className="h-4 w-4 text-blue-600"
            />
            <span className="text-sm font-medium text-gray-900">No</span>
          </label>
        </div>

        {protectionOrder === 'yes' && <DisqualificationMessage />}
      </div>
    </ScreenLayout>
  );
};

export default ProtectionOrderScreen;
