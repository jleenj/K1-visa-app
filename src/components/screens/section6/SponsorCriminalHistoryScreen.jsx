import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AlertCircle, Info } from 'lucide-react';
import ScreenLayout from '../../ScreenLayout';
import { getNextScreen, getPreviousScreen, isFirstScreen } from '../../../utils/navigationUtils';

/**
 * SponsorCriminalHistoryScreen - Section 6, Sponsor Criminal History
 *
 * Content source: Section1_9.jsx (lines 1-463)
 * 5 questions about protection orders and criminal history
 */
const SponsorCriminalHistoryScreen = ({
  currentData,
  updateField,
  fieldErrors,
  setFieldErrors,
  touchedFields,
  setTouchedFields,
  userRole
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  // State for all 5 questions
  const [protectionOrder, setProtectionOrder] = useState(currentData.sponsorProtectionOrder || null);
  const [domesticViolence, setDomesticViolence] = useState(currentData.sponsorDomesticViolence || null);
  const [violentCrimes, setViolentCrimes] = useState(currentData.sponsorViolentCrimes || null);
  const [drugAlcoholOffenses, setDrugAlcoholOffenses] = useState(currentData.sponsorDrugAlcoholOffenses || null);
  const [otherCriminalHistory, setOtherCriminalHistory] = useState(currentData.sponsorOtherCriminalHistory || null);

  // State for expandable panels
  const [showDomesticViolenceDefinition, setShowDomesticViolenceDefinition] = useState(false);

  // Check if any criminal history exists
  const hasAnyYesAnswer = protectionOrder === 'Yes' ||
                          domesticViolence === 'Yes' ||
                          violentCrimes === 'Yes' ||
                          drugAlcoholOffenses === 'Yes' ||
                          otherCriminalHistory === 'Yes';

  const handleBack = () => {
    const prevScreen = getPreviousScreen(location.pathname, userRole, currentData);
    if (prevScreen) navigate(prevScreen);
  };

  const handleNext = () => {
    const nextScreen = getNextScreen(location.pathname, userRole, currentData);
    if (nextScreen) navigate(nextScreen);
  };

  const isFirst = isFirstScreen(location.pathname, userRole, currentData);

  // Disqualification component
  const DisqualificationMessage = () => (
    <div className="mt-4 p-6 bg-red-50 border-l-4 border-red-400 rounded">
      <div className="flex items-start">
        <AlertCircle className="w-6 h-6 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-base font-semibold text-red-800 mb-2">
            Your situation requires individual review
          </p>
          <p className="text-sm text-red-700 mb-4">
            Based on your answer, your situation is complex and requires personalized guidance. Please contact our customer service team to discuss your options.
          </p>
          <button
            type="button"
            onClick={() => window.location.href = 'mailto:support@example.com?subject=K-1 Visa Application - Criminal History Question'}
            className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded transition-colors"
          >
            Contact Customer Service
          </button>
        </div>
      </div>
    </div>
  );

  // Domestic Violence Definition Panel
  const DomesticViolenceDefinition = () => (
    <div className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="flex items-start mb-3">
        <Info className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
        <p className="text-sm font-semibold text-blue-900">What counts as "domestic violence"?</p>
      </div>
      <div className="text-sm text-blue-800 space-y-2 ml-7">
        <p>Domestic violence includes felony or misdemeanor crimes of violence committed by:</p>
        <ul className="list-disc ml-4 space-y-1">
          <li>A current or former spouse of the victim</li>
          <li>Someone who shares a child with the victim</li>
          <li>Someone who lives or lived with the victim</li>
          <li>Someone in a domestic relationship under state/local laws</li>
          <li>Someone subject to domestic violence protection laws</li>
        </ul>
        <p className="mt-2 italic">
          This is broader than just married couples - it includes dating relationships, cohabitation, and other domestic situations.
        </p>
      </div>
    </div>
  );

  return (
    <ScreenLayout
      showBackButton={!isFirst}
      onBack={handleBack}
      onNext={handleNext}
      nextButtonDisabled={hasAnyYesAnswer}
    >
      <div className="space-y-8">
        {/* Introduction */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Criminal History
            </h2>
            <p className="text-sm text-gray-700">
              USCIS requires U.S. citizen petitioners to disclose information about protection orders and criminal history. The following questions will ask about any legal issues you may have had, including protection orders, arrests, charges, and convictions.
            </p>
          </div>

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

        {/* Question 1: Protection Orders */}
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
                value="Yes"
                checked={protectionOrder === 'Yes'}
                onChange={(e) => {
                  setProtectionOrder(e.target.value);
                  updateField('sponsorProtectionOrder', e.target.value);
                }}
                className="h-4 w-4 text-blue-600"
              />
              <span className="text-sm font-medium text-gray-900">Yes</span>
            </label>

            <label className="flex items-center space-x-3 p-4 border-2 border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="radio"
                name="protectionOrder"
                value="No"
                checked={protectionOrder === 'No'}
                onChange={(e) => {
                  setProtectionOrder(e.target.value);
                  updateField('sponsorProtectionOrder', e.target.value);
                }}
                className="h-4 w-4 text-blue-600"
              />
              <span className="text-sm font-medium text-gray-900">No</span>
            </label>
          </div>

          {protectionOrder === 'Yes' && <DisqualificationMessage />}
        </div>

        {/* Question 2: Domestic Violence */}
        <div className={`space-y-4 ${protectionOrder === 'Yes' ? 'opacity-50 pointer-events-none' : ''}`}>
          <h4 className="text-base font-semibold text-gray-900">
            Have you EVER been arrested, charged, or convicted of any of the following crimes (or an attempt to commit any of these crimes)?
          </h4>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2">
            <ul className="text-sm text-gray-700 space-y-1 ml-4 list-disc">
              <li>
                Domestic violence
                <button
                  type="button"
                  onClick={() => setShowDomesticViolenceDefinition(!showDomesticViolenceDefinition)}
                  className="ml-2 text-blue-600 hover:text-blue-800 underline text-xs"
                >
                  (What counts as domestic violence?)
                </button>
              </li>
              <li>Sexual assault</li>
              <li>Child abuse</li>
              <li>Child neglect</li>
              <li>Dating violence</li>
              <li>Elder abuse</li>
              <li>Stalking</li>
            </ul>

            {showDomesticViolenceDefinition && <DomesticViolenceDefinition />}

            <div className="mt-3 text-sm text-gray-600 bg-blue-50 border-l-4 border-blue-300 pl-3 py-2 rounded">
              <span>💡 </span>
              This includes arrests, charges, and cases that were dismissed, dropped, or expunged. Even if charges were dropped or you were found not guilty, you must disclose if you were arrested or charged. "Attempt to commit" means you were arrested, charged, or convicted of trying to commit one of these crimes (e.g., "attempted stalking").
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex items-center space-x-3 p-4 border-2 border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="radio"
                name="domesticViolence"
                value="Yes"
                checked={domesticViolence === 'Yes'}
                onChange={(e) => {
                  setDomesticViolence(e.target.value);
                  updateField('sponsorDomesticViolence', e.target.value);
                }}
                className="h-4 w-4 text-blue-600"
              />
              <span className="text-sm font-medium text-gray-900">Yes</span>
            </label>

            <label className="flex items-center space-x-3 p-4 border-2 border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="radio"
                name="domesticViolence"
                value="No"
                checked={domesticViolence === 'No'}
                onChange={(e) => {
                  setDomesticViolence(e.target.value);
                  updateField('sponsorDomesticViolence', e.target.value);
                }}
                className="h-4 w-4 text-blue-600"
              />
              <span className="text-sm font-medium text-gray-900">No</span>
            </label>
          </div>

          {domesticViolence === 'Yes' && <DisqualificationMessage />}
        </div>

        {/* Question 3: Violent Crimes */}
        <div className={`space-y-4 ${protectionOrder === 'Yes' || domesticViolence === 'Yes' ? 'opacity-50 pointer-events-none' : ''}`}>
          <h4 className="text-base font-semibold text-gray-900">
            Have you EVER been arrested, charged, or convicted of any of the following crimes (or an attempt to commit any of these crimes)?
          </h4>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-900 mb-2">Homicide & Manslaughter:</p>
              <ul className="text-sm text-gray-700 space-y-1 ml-4 list-disc">
                <li>Homicide</li>
                <li>Murder</li>
                <li>Manslaughter</li>
              </ul>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-900 mb-2">Sexual Offenses:</p>
              <ul className="text-sm text-gray-700 space-y-1 ml-4 list-disc">
                <li>Rape</li>
                <li>Abusive sexual contact</li>
                <li>Sexual exploitation</li>
                <li>Incest</li>
              </ul>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-900 mb-2">Abduction & Confinement:</p>
              <ul className="text-sm text-gray-700 space-y-1 ml-4 list-disc">
                <li>Kidnapping</li>
                <li>Abduction</li>
                <li>False imprisonment</li>
                <li>Unlawful criminal restraint</li>
                <li>Holding hostage</li>
              </ul>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-900 mb-2">Trafficking & Forced Labor:</p>
              <ul className="text-sm text-gray-700 space-y-1 ml-4 list-disc">
                <li>Human trafficking</li>
                <li>Forced labor</li>
                <li>Peonage</li>
                <li>Involuntary servitude</li>
                <li>Slave trade</li>
              </ul>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-900 mb-2">Other Crimes:</p>
              <ul className="text-sm text-gray-700 space-y-1 ml-4 list-disc">
                <li>Torture</li>
              </ul>
            </div>

            <div className="mt-3 text-sm text-gray-600 bg-blue-50 border-l-4 border-blue-300 pl-3 py-2 rounded">
              <span>💡 </span>
              These situations do not apply to most people, but USCIS requires us to ask about them as part of the petition process.
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex items-center space-x-3 p-4 border-2 border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="radio"
                name="violentCrimes"
                value="Yes"
                checked={violentCrimes === 'Yes'}
                onChange={(e) => {
                  setViolentCrimes(e.target.value);
                  updateField('sponsorViolentCrimes', e.target.value);
                }}
                className="h-4 w-4 text-blue-600"
              />
              <span className="text-sm font-medium text-gray-900">Yes</span>
            </label>

            <label className="flex items-center space-x-3 p-4 border-2 border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="radio"
                name="violentCrimes"
                value="No"
                checked={violentCrimes === 'No'}
                onChange={(e) => {
                  setViolentCrimes(e.target.value);
                  updateField('sponsorViolentCrimes', e.target.value);
                }}
                className="h-4 w-4 text-blue-600"
              />
              <span className="text-sm font-medium text-gray-900">No</span>
            </label>
          </div>

          {violentCrimes === 'Yes' && <DisqualificationMessage />}
        </div>

        {/* Question 4: Drug/Alcohol Offenses */}
        <div className={`space-y-4 ${protectionOrder === 'Yes' || domesticViolence === 'Yes' || violentCrimes === 'Yes' ? 'opacity-50 pointer-events-none' : ''}`}>
          <h4 className="text-base font-semibold text-gray-900">
            Have you been arrested, charged, or convicted 3 or more times for drug or alcohol-related offenses?
          </h4>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2">
            <p className="text-sm text-gray-700 font-medium">This includes:</p>
            <ul className="text-sm text-gray-700 space-y-1 ml-4 list-disc">
              <li>Drug or controlled substance offenses (including marijuana, cocaine, heroin, prescription drugs possessed illegally, etc.)</li>
              <li>Alcohol-related offenses (DUI, DWI, public intoxication, etc.)</li>
              <li>We're asking about 3 or more separate incidents, not multiple charges from one arrest</li>
            </ul>
            <div className="mt-3 text-sm text-gray-600 bg-blue-50 border-l-4 border-blue-300 pl-3 py-2 rounded">
              <span>💡 </span>
              <div className="space-y-2">
                <p>
                  "Not from a single act" means if you were arrested once and charged with multiple offenses (e.g., DUI + reckless driving from the same traffic stop), that counts as ONE incident, not two.
                </p>
                <p>
                  For example, if you had one DUI in 2015, one public intoxication charge in 2018, and one DUI in 2020 - those would count as three separate incidents.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex items-center space-x-3 p-4 border-2 border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="radio"
                name="drugAlcoholOffenses"
                value="Yes"
                checked={drugAlcoholOffenses === 'Yes'}
                onChange={(e) => {
                  setDrugAlcoholOffenses(e.target.value);
                  updateField('sponsorDrugAlcoholOffenses', e.target.value);
                }}
                className="h-4 w-4 text-blue-600"
              />
              <span className="text-sm font-medium text-gray-900">Yes</span>
            </label>

            <label className="flex items-center space-x-3 p-4 border-2 border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="radio"
                name="drugAlcoholOffenses"
                value="No"
                checked={drugAlcoholOffenses === 'No'}
                onChange={(e) => {
                  setDrugAlcoholOffenses(e.target.value);
                  updateField('sponsorDrugAlcoholOffenses', e.target.value);
                }}
                className="h-4 w-4 text-blue-600"
              />
              <span className="text-sm font-medium text-gray-900">No</span>
            </label>
          </div>

          {drugAlcoholOffenses === 'Yes' && <DisqualificationMessage />}
        </div>

        {/* Question 5: Other Criminal History */}
        <div className={`space-y-4 ${protectionOrder === 'Yes' || domesticViolence === 'Yes' || violentCrimes === 'Yes' || drugAlcoholOffenses === 'Yes' ? 'opacity-50 pointer-events-none' : ''}`}>
          <h4 className="text-base font-semibold text-gray-900">
            Have you ever been arrested, cited, charged, indicted, convicted, fined, or imprisoned for breaking or violating any law or ordinance in any country?
          </h4>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2">
            <p className="text-sm text-gray-700 font-medium">Don't include:</p>
            <ul className="text-sm text-gray-700 space-y-1 ml-4 list-disc">
              <li>Traffic violations under $500 (unless alcohol/drug-related)</li>
            </ul>

            <p className="text-sm text-gray-700 font-medium mt-3">Do include ANY other arrest, citation, charge, indictment, conviction, fine, or imprisonment from ANY country, including but not limited to:</p>
            <ul className="text-sm text-gray-700 space-y-1 ml-4 list-disc">
              <li>DUI/DWI (even if it happened only once)</li>
              <li>Driving with suspended/revoked license</li>
              <li>Reckless driving (criminal charge)</li>
              <li>Theft or shoplifting (even if charges were dropped)</li>
              <li>Disorderly conduct or public disturbance</li>
              <li>Fake ID or age misrepresentation</li>
              <li>Minor in possession of alcohol</li>
              <li>Any fines over $500 for violating any law or ordinance</li>
            </ul>

            <div className="mt-3 text-sm text-gray-600 bg-blue-50 border-l-4 border-blue-300 pl-3 py-2 rounded">
              <span>💡 </span>
              This list shows common examples, but it is NOT exhaustive. If you have ANY criminal history not listed above, you must disclose it. This includes records that were sealed, expunged, or dismissed.
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex items-center space-x-3 p-4 border-2 border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="radio"
                name="otherCriminalHistory"
                value="Yes"
                checked={otherCriminalHistory === 'Yes'}
                onChange={(e) => {
                  setOtherCriminalHistory(e.target.value);
                  updateField('sponsorOtherCriminalHistory', e.target.value);
                }}
                className="h-4 w-4 text-blue-600"
              />
              <span className="text-sm font-medium text-gray-900">Yes</span>
            </label>

            <label className="flex items-center space-x-3 p-4 border-2 border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="radio"
                name="otherCriminalHistory"
                value="No"
                checked={otherCriminalHistory === 'No'}
                onChange={(e) => {
                  setOtherCriminalHistory(e.target.value);
                  updateField('sponsorOtherCriminalHistory', e.target.value);
                }}
                className="h-4 w-4 text-blue-600"
              />
              <span className="text-sm font-medium text-gray-900">No</span>
            </label>
          </div>

          {otherCriminalHistory === 'Yes' && <DisqualificationMessage />}
        </div>
      </div>
    </ScreenLayout>
  );
};

export default SponsorCriminalHistoryScreen;
