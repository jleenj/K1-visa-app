import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ScreenLayout from '../../ScreenLayout';
import DisqualificationStandaloneScreen from '../../DisqualificationStandaloneScreen';
import { getNextScreen, getPreviousScreen, isFirstScreen } from '../../../utils/navigationUtils';

/**
 * BeneficiarySecurityHumanRightsScreen - Section 6, Beneficiary Security & Human Rights
 *
 * Content source: App.tsx (lines 7219-7298)
 * 1 question about terrorism, genocide, human trafficking, communist party membership, etc.
 */
const BeneficiarySecurityHumanRightsScreen = ({
  currentData,
  updateField,
  userRole
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const beneficiaryFirstName = currentData['beneficiaryFirstName'] || 'your fiancé(e)';
  const securityViolations = currentData.beneficiarySecurityViolations || null;

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
    if (securityViolations === 'yes') {
      setHasDQ(true);
      updateField('section6_beneficiary_security_DQ', true);
    } else {
      setHasDQ(false);
      setShowDisqualification(false);
      updateField('section6_beneficiary_security_DQ', false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [securityViolations]);

  // Reset DQ screen when navigating away
  useEffect(() => {
    const isOnThisScreen = location.pathname.includes('security-human-rights');
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

  // Show standalone disqualification screen
  const isOnThisScreen = location.pathname.includes('security-human-rights');
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

  // Inline warning component
  const DisqualificationMessage = () => (
    <div className="mt-4 p-5 bg-red-50 border-l-4 border-red-500 rounded-lg">
      <p className="text-sm font-semibold text-red-900 mb-3">
        ⚠️ Additional Review Required
      </p>
      <p className="text-sm text-red-800">
        USCIS carefully reviews security and human rights concerns when evaluating K-1 visa applications. This does not automatically disqualify {beneficiaryFirstName}, but requires additional documentation and review.
      </p>
    </div>
  );

  return (
    <ScreenLayout
      showBackButton={!isFirst}
      onBack={handleBack}
      onNext={handleNext}
      nextButtonDisabled={!securityViolations}
    >
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900">
          Security & Human Rights
        </h2>

        {/* Question 4: Security & Human Rights Violations */}
        <div className="space-y-4">
          <h4 className="text-base font-semibold text-gray-900">
            Has {beneficiaryFirstName} ever been involved in or convicted of:
          </h4>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <ul className="text-sm text-gray-700 space-y-1 ml-4 list-disc">
              <li>Terrorism or support to terrorist organizations</li>
              <li>Espionage, sabotage, or export control violations</li>
              <li>Genocide, torture, war crimes, or extrajudicial killings</li>
              <li>Human trafficking (sex trafficking or labor trafficking)</li>
              <li>Recruitment or use of child soldiers</li>
              <li>Religious freedom violations (while serving as government official)</li>
              <li>Forced abortion/sterilization programs or coercive organ transplantation</li>
              <li>Member of Communist or totalitarian party</li>
              <li>Benefited from family member's trafficking or terrorist activities (past 5 years)</li>
            </ul>

            <div className="mt-3 text-sm text-gray-600 bg-blue-50 border-l-4 border-blue-300 pl-3 py-2 rounded">
              <span>💡 </span>
              These situations apply to very few people, but the DS-160 requires us to ask about them as part of the visa screening process.
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex items-center space-x-3 p-4 border-2 border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="radio"
                name="beneficiarySecurityViolations"
                value="yes"
                checked={securityViolations === 'yes'}
                onChange={(e) => updateField('beneficiarySecurityViolations', e.target.value)}
                className="h-4 w-4 text-blue-600"
              />
              <span className="text-sm font-medium text-gray-900">Yes</span>
            </label>

            <label className="flex items-center space-x-3 p-4 border-2 border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="radio"
                name="beneficiarySecurityViolations"
                value="no"
                checked={securityViolations === 'no'}
                onChange={(e) => updateField('beneficiarySecurityViolations', e.target.value)}
                className="h-4 w-4 text-blue-600"
              />
              <span className="text-sm font-medium text-gray-900">No</span>
            </label>
          </div>

          {securityViolations === 'yes' && <DisqualificationMessage />}
        </div>
      </div>
    </ScreenLayout>
  );
};

export default BeneficiarySecurityHumanRightsScreen;
