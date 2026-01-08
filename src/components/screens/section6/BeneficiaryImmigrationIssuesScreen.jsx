import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ScreenLayout from '../../ScreenLayout';
import DisqualificationStandaloneScreen from '../../DisqualificationStandaloneScreen';
import { getNextScreen, getPreviousScreen, isFirstScreen } from '../../../utils/navigationUtils';

/**
 * BeneficiaryImmigrationIssuesScreen - Section 6, Beneficiary Immigration Issues
 *
 * Comprehensive immigration issues screening
 * ANY "yes" answer triggers DQ
 */
const BeneficiaryImmigrationIssuesScreen = ({
  currentData,
  updateField,
  userRole
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const beneficiaryFirstName = currentData.beneficiaryFirstName || 'your fiancé(e)';
  const immigrationIssues = currentData.beneficiaryImmigrationIssues || null;

  const [showDisqualification, setShowDisqualification] = useState(false);
  const [hasDQ, setHasDQ] = useState(false);

  const handleBack = () => {
    const prevScreen = getPreviousScreen(location.pathname, userRole, currentData);
    if (prevScreen) navigate(prevScreen);
  };

  const handleNext = () => {
    // Check if THIS screen has a DQ
    if (hasDQ) {
      setShowDisqualification(true);
      return;
    }

    // Get next screen to check if we're leaving Section 6
    const nextScreen = getNextScreen(location.pathname, userRole, currentData);

    // If next screen is outside Section 6, check for ANY Section 6 beneficiary DQ
    if (nextScreen && !nextScreen.startsWith('/section-6-legal-beneficiary')) {
      const hasAnySection6DQ = !!(
        currentData.section6_beneficiary_willBeInUS_DQ ||
        currentData.section6_beneficiary_criminalHistory_DQ ||
        currentData.section6_beneficiary_immigrationIssues_DQ ||
        currentData.section6_beneficiary_health_DQ ||
        currentData.section6_beneficiary_security_DQ
      );

      if (hasAnySection6DQ) {
        setShowDisqualification(true);
        return;
      }
    }

    if (nextScreen) navigate(nextScreen);
  };

  const isFirst = isFirstScreen(location.pathname, userRole, currentData);

  // Track DQ state
  useEffect(() => {
    if (immigrationIssues === 'yes') {
      setHasDQ(true);
      updateField('section6_beneficiary_immigrationIssues_DQ', true);
    } else {
      setHasDQ(false);
      setShowDisqualification(false);
      updateField('section6_beneficiary_immigrationIssues_DQ', false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [immigrationIssues]);

  // Reset DQ screen when navigating away
  useEffect(() => {
    const isOnThisScreen = location.pathname.includes('immigration-issues');
    if (!isOnThisScreen) {
      setShowDisqualification(false);
    }
  }, [location.pathname]);

  const handleGoBack = () => {
    setShowDisqualification(false);
  };

  // Collect ALL Section 6 beneficiary DQ messages
  const getAllDQMessages = () => {
    const messages = [];
    const beneficiaryName = currentData.beneficiaryFirstName || 'your fiancé(e)';

    if (currentData.section6_beneficiary_willBeInUS_DQ) {
      messages.push(`Based on your answers, the K-1 fiancé(e) visa may not be the best option for your situation.\n\nThe K-1 visa requires ${beneficiaryName} to apply for the visa at a U.S. embassy or consulate in their home country. ${beneficiaryName} cannot "switch" to K-1 status while already in the United States.\n\nIf ${beneficiaryName} will still be in the U.S. when you're ready to file, you may want to consider alternative options such as getting married and filing for adjustment of status (Form I-130/I-485) instead.`);
    }

    if (currentData.section6_beneficiary_criminalHistory_DQ ||
        currentData.section6_beneficiary_immigrationIssues_DQ ||
        currentData.section6_beneficiary_health_DQ ||
        currentData.section6_beneficiary_security_DQ) {
      messages.push(`USCIS carefully reviews ${beneficiaryName}'s background when evaluating K-1 visa applications. Based on your answers, this case requires in-depth review and personalized guidance.`);
    }

    return messages;
  };

  const isOnThisScreen = location.pathname.includes('immigration-issues');
  if (showDisqualification && isOnThisScreen) {
    const allDQMessages = getAllDQMessages();
    return (
      <DisqualificationStandaloneScreen
        reasons={allDQMessages}
        onGoBack={handleGoBack}
        supportEmail="support@evernestusa.com"
        supportPhone="+1 (555) 123-4567"
      />
    );
  }

  const DisqualificationMessage = () => (
    <div className="mt-4 p-5 bg-red-50 border-l-4 border-red-500 rounded-lg">
      <p className="text-sm font-semibold text-red-900 mb-3">
        ⚠️ Additional Review Required
      </p>
      <p className="text-sm text-red-800">
        USCIS carefully reviews immigration history when evaluating K-1 visa applications. This does not automatically disqualify {beneficiaryFirstName}, but requires additional documentation and review.
      </p>
    </div>
  );

  return (
    <ScreenLayout
      showBackButton={!isFirst}
      onBack={handleBack}
      onNext={handleNext}
      nextButtonDisabled={!immigrationIssues}
    >
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900">
          Immigration Issues
        </h2>

        <div className="space-y-4">
          <h4 className="text-base font-semibold text-gray-900">
            Has {beneficiaryFirstName} EVER:
          </h4>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <ul className="text-sm text-gray-700 space-y-1 ml-4 list-disc">
              <li>Been refused a U.S. visa, denied entry, or had a visa canceled/revoked?</li>
              <li>Been deported or removed from any country?</li>
              <li>Been unlawfully present in the U.S. for more than 6 months?</li>
              <li>Sought to obtain a visa or U.S. entry through fraud or misrepresentation?</li>
              <li>Withheld custody of a U.S. citizen child from a person with legal custody?</li>
              <li>Voted in the United States illegally?</li>
              <li>Renounced U.S. citizenship for tax avoidance purposes?</li>
              <li>Worked in the United States without authorization?</li>
            </ul>
          </div>

          <div className="space-y-3">
            <label className="flex items-center space-x-3 p-4 border-2 border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="radio"
                name="beneficiaryImmigrationIssues"
                value="yes"
                checked={immigrationIssues === 'yes'}
                onChange={(e) => updateField('beneficiaryImmigrationIssues', e.target.value)}
                className="h-4 w-4 text-blue-600"
              />
              <span className="text-sm font-medium text-gray-900">Yes</span>
            </label>

            <label className="flex items-center space-x-3 p-4 border-2 border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="radio"
                name="beneficiaryImmigrationIssues"
                value="no"
                checked={immigrationIssues === 'no'}
                onChange={(e) => updateField('beneficiaryImmigrationIssues', e.target.value)}
                className="h-4 w-4 text-blue-600"
              />
              <span className="text-sm font-medium text-gray-900">No</span>
            </label>
          </div>

          {immigrationIssues === 'yes' && <DisqualificationMessage />}
        </div>
      </div>
    </ScreenLayout>
  );
};

export default BeneficiaryImmigrationIssuesScreen;
