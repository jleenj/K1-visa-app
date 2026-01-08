import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import ScreenLayout from '../../ScreenLayout';
import { getNextScreen, getPreviousScreen, isFirstScreen } from '../../../utils/navigationUtils';

/**
 * SponsorCriminalHistoryIntroScreen - Section 6, Criminal History Introduction
 *
 * Intro screen showing important information about the criminal history questions
 * User must click Next to proceed to the first question
 */
const SponsorCriminalHistoryIntroScreen = ({
  currentData,
  updateField,
  userRole
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    const prevScreen = getPreviousScreen(location.pathname, userRole, currentData);
    if (prevScreen) navigate(prevScreen);
  };

  const handleNext = () => {
    // Mark intro as viewed
    updateField('sponsorCriminalHistoryIntroViewed', true);
    const nextScreen = getNextScreen(location.pathname, userRole, currentData);
    if (nextScreen) navigate(nextScreen);
  };

  const isFirst = isFirstScreen(location.pathname, userRole, currentData);

  return (
    <ScreenLayout
      showBackButton={!isFirst}
      onBack={handleBack}
      onNext={handleNext}
      nextButtonDisabled={false}
    >
      <div className="space-y-6">
        {/* Introduction */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Criminal History
          </h2>
          <p className="text-sm text-gray-700">
            USCIS requires U.S. citizen petitioners to disclose information about protection orders and criminal history. The following questions will ask about any legal issues you may have had, including protection orders, arrests, charges, and convictions.
          </p>
        </div>

        {/* Important Information Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
            <div className="space-y-3 text-sm text-gray-800">
              <p className="font-semibold text-blue-900">
                Important information about answering these questions:
              </p>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Worldwide:</span> USCIS screens for criminal records from any country worldwide, not just the United States.
                </p>
                <p>
                  <span className="font-medium">Juvenile records:</span> Even if you were arrested or convicted as a minor (under 18), you must disclose those incidents.
                </p>
                <p>
                  <span className="font-medium">All records count:</span> You must disclose arrests, charges, and cases that were dismissed, dropped, or expunged - even if you were not found guilty. This includes records that have been sealed or pardoned.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ScreenLayout>
  );
};

export default SponsorCriminalHistoryIntroScreen;
