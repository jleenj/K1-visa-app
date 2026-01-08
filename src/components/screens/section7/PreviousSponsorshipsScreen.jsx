import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import ScreenLayout from '../../ScreenLayout';
import DisqualificationStandaloneScreen from '../../DisqualificationStandaloneScreen';
import { getNextScreen, getPreviousScreen, isFirstScreen } from '../../../utils/navigationUtils';

const PreviousSponsorshipsScreen = ({ currentData = {}, updateField }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // PREVIOUS SPONSORSHIPS state
  const [hasPreviousPetitions, setHasPreviousPetitions] = useState(
    currentData.hasPreviousPetitions || null
  );
  const [petitionsCount, setPetitionsCount] = useState(
    currentData.petitionsCount || '0'
  );
  const [previousPetitions, setPreviousPetitions] = useState(
    currentData.previousPetitions || []
  );

  // DQ tracking state
  const [showDisqualification, setShowDisqualification] = useState(false);
  const [dqScenario, setDqScenario] = useState(null); // 'twoPlus', 'withinTwoYears', 'currentSpouse'

  // Help section state
  const [showPetitionANumberHelp, setShowPetitionANumberHelp] = useState({});
  const [showPetitionReceiptHelp, setShowPetitionReceiptHelp] = useState({});

  // Get fiancé name from data
  const fianceName = currentData.beneficiaryFirstName || 'your fiancé(e)';
  const fiancePronoun = currentData.beneficiaryGender === 'male' ? 'him' :
                        currentData.beneficiaryGender === 'female' ? 'her' : 'them';

  // Check if IMBRA waiver is needed
  const needsIMBRAWaiver = hasPreviousPetitions === 'yes' && petitionsCount === '1' &&
    previousPetitions.length > 0 &&
    previousPetitions.some(p => {
      if (!p.dateOfFiling) return false;
      const filingDate = new Date(p.dateOfFiling);
      const twoYearsAgo = new Date();
      twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
      return filingDate > twoYearsAgo;
    });

  // Sync state to currentData
  useEffect(() => {
    updateField('hasPreviousPetitions', hasPreviousPetitions);
  }, [hasPreviousPetitions]);

  useEffect(() => {
    updateField('petitionsCount', petitionsCount);
  }, [petitionsCount]);

  useEffect(() => {
    updateField('previousPetitions', previousPetitions);
  }, [previousPetitions]);

  // Track DQ scenarios with useEffect
  useEffect(() => {
    if (petitionsCount === '2+') {
      setDqScenario('twoPlus');
      updateField('section7_twoPlus_DQ', true);
    } else {
      if (dqScenario === 'twoPlus') {
        setDqScenario(null);
        setShowDisqualification(false);
      }
      updateField('section7_twoPlus_DQ', false);
    }
  }, [petitionsCount]);

  useEffect(() => {
    if (petitionsCount === '1' && previousPetitions.length > 0) {
      const petition = previousPetitions[0];
      if (petition.dateOfFiling) {
        const filingDate = new Date(petition.dateOfFiling);
        const twoYearsAgo = new Date();
        twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);

        if (filingDate > twoYearsAgo) {
          setDqScenario('withinTwoYears');
          updateField('section7_withinTwoYears_DQ', true);
        } else {
          if (dqScenario === 'withinTwoYears') {
            setDqScenario(null);
            setShowDisqualification(false);
          }
          updateField('section7_withinTwoYears_DQ', false);
        }
      } else {
        if (dqScenario === 'withinTwoYears') {
          setDqScenario(null);
          setShowDisqualification(false);
        }
        updateField('section7_withinTwoYears_DQ', false);
      }
    } else {
      if (dqScenario === 'withinTwoYears') {
        setDqScenario(null);
        setShowDisqualification(false);
      }
      updateField('section7_withinTwoYears_DQ', false);
    }
  }, [petitionsCount, previousPetitions]);

  // Track current spouse DQ
  useEffect(() => {
    const hasCurrentSpouse = previousPetitions.some(p => p.relationship === 'current-spouse');
    if (hasCurrentSpouse) {
      setDqScenario('currentSpouse');
      updateField('section7_currentSpouse_DQ', true);
    } else {
      if (dqScenario === 'currentSpouse') {
        setDqScenario(null);
        setShowDisqualification(false);
      }
      updateField('section7_currentSpouse_DQ', false);
    }
  }, [previousPetitions]);

  // Reset DQ screen when navigating away from this screen
  useEffect(() => {
    const isOnThisScreen = location.pathname.includes('previous-sponsorships');
    if (!isOnThisScreen) {
      setShowDisqualification(false);
    }
  }, [location.pathname]);

  // Initialize petition forms when count is set
  useEffect(() => {
    if (hasPreviousPetitions === 'yes' && petitionsCount === '1' && previousPetitions.length === 0) {
      setPreviousPetitions([{
        beneficiaryFirstName: '',
        beneficiaryMiddleName: '',
        beneficiaryLastName: '',
        beneficiaryANumber: '',
        dateOfFiling: '',
        uscisAction: '',
        uscisActionOther: '',
        filedI134: null,
        relationship: '',
        relationshipOther: '',
        beneficiaryDOB: '',
        i134ReceiptNumber: ''
      }]);
    }
  }, [hasPreviousPetitions, petitionsCount]);

  // Update petition function
  const updatePetition = (index, field, value) => {
    setPreviousPetitions(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  // IMBRA Waiver Disqualification Message Component
  // Handle "Go Back" button - don't clear user's answer, just hide DQ screen
  const handleGoBack = () => {
    setShowDisqualification(false);
  };

  // Collect ALL Section 7 DQ messages - return single encompassing message
  const getAllDQMessages = () => {
    const hasAnySection7DQ = !!(
      currentData.section7_twoPlus_DQ ||
      currentData.section7_withinTwoYears_DQ ||
      currentData.section7_currentSpouse_DQ
    );

    if (hasAnySection7DQ) {
      return [`Based on your answers, the K-1 visa may not be the best option for your situation.\n\nUSCIS has specific requirements and limitations regarding previous K-1 petition filings. Your responses indicate circumstances that may require additional documentation, waivers, or alternative visa pathways.\n\nPlease contact our support team for personalized guidance on your specific situation.`];
    }

    return [];
  };

  // Show standalone disqualification screen
  const isOnThisScreen = location.pathname.includes('previous-sponsorships');
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

  // Inline warning components (soft warnings)
  const TwoPlusWarning = () => (
    <div className="mt-4 p-5 bg-red-50 border-l-4 border-red-500 rounded-lg">
      <p className="text-sm font-semibold text-red-900 mb-3">
        ⚠️ Important Information
      </p>
      <p className="text-sm text-red-800">
        USCIS typically does not allow more than two K-1 petitions to be filed in a lifetime. There are limited exceptions, but these cases may involve a more complex process.
      </p>
    </div>
  );

  const WithinTwoYearsWarning = () => (
    <div className="mt-4 p-5 bg-red-50 border-l-4 border-red-500 rounded-lg">
      <p className="text-sm font-semibold text-red-900 mb-3">
        ⚠️ Important Information
      </p>
      <p className="text-sm text-red-800">
        USCIS does not allow filing another K-1 petition within 2 years of a previous filing. There are exceptions, but these cases may involve a more complex process.
      </p>
    </div>
  );

  const CurrentSpouseWarning = () => (
    <div className="mt-4 p-5 bg-red-50 border-l-4 border-red-500 rounded-lg">
      <p className="text-sm font-semibold text-red-900 mb-3">
        ⚠️ Important Information
      </p>
      <p className="text-sm text-red-800 mb-3">
        If you previously sponsored this person on a K-1 visa and are now married to them, you would typically file Form I-485 (Adjustment of Status), not another K-1 petition.
      </p>
      <p className="text-sm text-red-800">
        If you're trying to sponsor a different person while currently married to someone else, K-1 visas are only available to unmarried U.S. citizens.
      </p>
    </div>
  );

  // Navigation handlers
  const handleBack = () => {
    const prevScreen = getPreviousScreen(location.pathname, currentData.userRole, currentData);
    if (prevScreen) {
      navigate(prevScreen);
    }
  };

  const handleNext = () => {
    // Check if THIS screen has any DQ
    if (dqScenario) {
      setShowDisqualification(true);
      return;
    }

    // Get next screen to check if we're leaving Section 7
    const nextScreen = getNextScreen(location.pathname, currentData.userRole, currentData);

    // If next screen is outside Section 7, check for ANY Section 7 DQ
    if (nextScreen && !nextScreen.startsWith('/section-7-petitions')) {
      const hasAnySection7DQ = !!(
        currentData.section7_twoPlus_DQ ||
        currentData.section7_withinTwoYears_DQ ||
        currentData.section7_currentSpouse_DQ
      );

      if (hasAnySection7DQ) {
        setShowDisqualification(true);
        return;
      }
    }

    if (nextScreen) {
      navigate(nextScreen);
    }
  };

  const isFirst = isFirstScreen(location.pathname, currentData.userRole, currentData);

  // Comprehensive validation function
  const validateRequiredFields = () => {
    // Must answer the main question
    if (hasPreviousPetitions === null) return false;

    // If answered "no", we're done
    if (hasPreviousPetitions === 'no') return true;

    // If answered "yes", must select count
    if (!petitionsCount || petitionsCount === '0') return false;

    // If 2+, validation complete (shows disqualification message)
    if (petitionsCount === '2+') return true;

    // If 1 petition, validate petition details
    if (petitionsCount === '1' && previousPetitions.length > 0) {
      const petition = previousPetitions[0];

      // Required fields for all petitions
      if (!petition.beneficiaryFirstName?.trim()) return false;
      if (!petition.beneficiaryLastName?.trim()) return false;
      if (!petition.dateOfFiling) return false;
      if (!petition.uscisAction) return false;

      // If "Other" selected, must specify
      if (petition.uscisAction === 'Other' && !petition.uscisActionOther?.trim()) return false;

      // If approved and not requiring IMBRA waiver, must answer I-134 question
      if (petition.uscisAction === 'Approved' && !needsIMBRAWaiver) {
        if (petition.filedI134 === null || petition.filedI134 === undefined) return false;

        // If filed I-134, must provide relationship and DOB
        if (petition.filedI134 === 'yes') {
          if (!petition.relationship) return false;
          if (petition.relationship === 'other' && !petition.relationshipOther?.trim()) return false;
          if (!petition.beneficiaryDOB) return false;
        }
      }
    }

    return true;
  };

  const isNextDisabled = !validateRequiredFields();

  return (
    <ScreenLayout
      showBackButton={!isFirst}
      showNextButton={true}
      onBack={handleBack}
      onNext={handleNext}
      nextButtonDisabled={isNextDisabled}
    >
      <div className="space-y-8">
        {/* Introduction */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Previous Sponsorships
          </h3>
          <p className="text-sm text-gray-700">
            We need to know if you've previously filed Form I-129F (K-1 petition) for anyone else. This helps us determine if you need any special waivers and ensures your current petition complies with IMBRA regulations.
          </p>
        </div>

        {/* PREVIOUS SPONSORSHIPS */}
        <div className="space-y-4">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-sm font-semibold text-gray-900 mb-2">
              Have you ever filed Form I-129F (Petition for Alien Fiancé(e)) for any other beneficiary? <span className="text-red-500">*</span>
            </p>
            <p className="text-xs text-gray-700">
              This includes petitions that were approved, denied, revoked, or withdrawn. Don't include your current fiancé(e) - we'll count them separately.
            </p>
          </div>

          <div className="space-y-3">
            <label className="flex items-center space-x-3 p-4 border-2 border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="radio"
                name="hasPreviousPetitions"
                value="yes"
                checked={hasPreviousPetitions === 'yes'}
                onChange={(e) => {
                  setHasPreviousPetitions(e.target.value);
                  if (petitionsCount === '0') setPetitionsCount('1');
                }}
                className="h-4 w-4 text-blue-600"
              />
              <span className="text-sm font-medium text-gray-900">Yes</span>
            </label>

            <label className="flex items-center space-x-3 p-4 border-2 border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="radio"
                name="hasPreviousPetitions"
                value="no"
                checked={hasPreviousPetitions === 'no'}
                onChange={(e) => {
                  setHasPreviousPetitions(e.target.value);
                  setPetitionsCount('0');
                  setPreviousPetitions([]);
                }}
                className="h-4 w-4 text-blue-600"
              />
              <span className="text-sm font-medium text-gray-900">No</span>
            </label>
          </div>

          {hasPreviousPetitions === 'yes' && (
            <div className="ml-6 space-y-4 mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <label className="block text-sm font-medium text-gray-900">
                How many times have you filed Form I-129F for other beneficiaries?
              </label>
              <p className="text-xs text-gray-600">
                Count the total number of petitions filed, even if some were for the same person. For example, if you filed twice for the
                same beneficiary (once withdrawn, once approved), count that as 2 petitions.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {['1', '2+'].map(option => (
                  <label key={option} className="flex items-center space-x-2 p-3 border-2 border-gray-300 rounded-lg hover:bg-white cursor-pointer">
                    <input
                      type="radio"
                      name="petitionsCount"
                      value={option}
                      checked={petitionsCount === option}
                      onChange={(e) => setPetitionsCount(e.target.value)}
                      className="h-4 w-4 text-blue-600"
                    />
                    <span className="text-sm font-medium text-gray-900">{option}</span>
                  </label>
                ))}
              </div>

              {currentData.section7_twoPlus_DQ && <TwoPlusWarning />}
            </div>
          )}

          {/* Previous Petitions Details */}
          {hasPreviousPetitions === 'yes' && previousPetitions.length > 0 && petitionsCount !== '2+' && (
            <div className="ml-6 space-y-6 mt-6">
              {previousPetitions.map((petition, index) => (
                <div key={index} className="border-2 border-gray-300 rounded-lg p-6 space-y-4 bg-white overflow-visible">
                  <h5 className="text-base font-semibold text-gray-900 border-b pb-3">Previous Petition #{index + 1}</h5>

                  {/* Beneficiary Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Beneficiary's full legal name for this petition:
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">First Name (Given Name) <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          value={petition.beneficiaryFirstName}
                          onChange={(e) => updatePetition(index, 'beneficiaryFirstName', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Middle Name</label>
                        <input
                          type="text"
                          value={petition.beneficiaryMiddleName}
                          onChange={(e) => updatePetition(index, 'beneficiaryMiddleName', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Last Name (Family Name) <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          value={petition.beneficiaryLastName}
                          onChange={(e) => updatePetition(index, 'beneficiaryLastName', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* A-Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Beneficiary's A-Number (Alien Registration Number)
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 py-2 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm rounded-l font-medium">
                        A
                      </span>
                      <input
                        type="text"
                        value={petition.beneficiaryANumber ? petition.beneficiaryANumber.replace(/^A0*/, '') : ''}
                        onChange={(e) => {
                          let val = e.target.value.replace(/\D/g, '');
                          if (val.length > 9) val = val.slice(0, 9);
                          if (val) {
                            const paddedVal = val.padStart(9, '0');
                            updatePetition(index, 'beneficiaryANumber', `A${paddedVal}`);
                          } else {
                            updatePetition(index, 'beneficiaryANumber', '');
                          }
                        }}
                        placeholder="12345678 (7-9 digits)"
                        maxLength="9"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-r focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Expandable help section */}
                    <button
                      type="button"
                      onClick={() => setShowPetitionANumberHelp({...showPetitionANumberHelp, [index]: !showPetitionANumberHelp[index]})}
                      className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-2"
                    >
                      {showPetitionANumberHelp[index] ? '▼' : '▶'} Where to find this number
                    </button>

                    {showPetitionANumberHelp[index] && (
                      <div className="text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded p-3 space-y-2 mt-2">
                        <p className="font-semibold">Where to find the beneficiary's A-Number (if they have one):</p>
                        <ul className="list-disc ml-4 space-y-1">
                          <li><strong>Green Card:</strong> Front of card under "USCIS#"</li>
                          <li><strong>Work Permit (EAD):</strong> Front of card under "USCIS#"</li>
                          <li><strong>Visa stamp in passport:</strong> Listed as "Registration Number"</li>
                          <li><strong>USCIS notices/letters:</strong> Near top, labeled "A#" or "USCIS A#"</li>
                        </ul>
                        <p className="font-semibold mt-3">Format:</p>
                        <p>A followed by 7-9 digits (e.g., A12345678)</p>
                        <p className="font-semibold mt-3">Don't confuse with:</p>
                        <ul className="list-disc ml-4 space-y-1">
                          <li>Receipt numbers (3 letters + 10 digits like MSC1234567890)</li>
                          <li>Green card number (13 characters on back of card)</li>
                          <li>USCIS online account number (12 digits, no "A")</li>
                        </ul>
                        <p className="mt-3 italic text-gray-700">
                          <strong>Note:</strong> Most people won't have an A-Number unless they previously had a green card, work permit, or filed for permanent residence. If they've never had U.S. immigration status, leave this blank.
                        </p>
                      </div>
                    )}

                    {petition.beneficiaryANumber && petition.beneficiaryANumber.replace(/^A0*/, '').length >= 7 && petition.beneficiaryANumber.replace(/^A0*/, '').length <= 9 && (
                      <div className="text-sm text-green-600 mt-1">
                        ✅ Valid A-Number format
                      </div>
                    )}

                    {petition.beneficiaryANumber && petition.beneficiaryANumber.replace(/^A0*/, '').length > 0 && (petition.beneficiaryANumber.replace(/^A0*/, '').length < 7 || petition.beneficiaryANumber.replace(/^A0*/, '').length > 9) && (
                      <div className="text-sm text-orange-600 mt-1">
                        A-Number should be 7-9 digits (e.g., A12345678)
                      </div>
                    )}
                  </div>

                  {/* Date of Filing */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      When did you file this Form I-129F petition? <span className="text-red-500">*</span>
                    </label>
                    <p className="text-xs text-gray-600 mb-2">
                      This is the date you submitted the petition to USCIS, not when it was approved.
                    </p>
                    <input
                      type="date"
                      value={petition.dateOfFiling}
                      onChange={(e) => updatePetition(index, 'dateOfFiling', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  {/* USCIS Action */}
                  <div className="relative z-10">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      What action did USCIS take on this petition? <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={petition.uscisAction}
                      onChange={(e) => {
                        updatePetition(index, 'uscisAction', e.target.value);
                        if (e.target.value !== 'Approved') {
                          updatePetition(index, 'filedI134', null);
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 relative z-10"
                      required
                    >
                      <option value="">Select action...</option>
                      <option value="Approved">Approved</option>
                      <option value="Denied">Denied</option>
                      <option value="Revoked">Revoked</option>
                      <option value="Withdrawn">Withdrawn</option>
                      <option value="Other">Other (please specify)</option>
                    </select>

                    {petition.uscisAction === 'Other' && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-600 mb-1">
                          Please specify (e.g., "Still pending", "Reopened", etc.):
                        </p>
                        <input
                          type="text"
                          value={petition.uscisActionOther}
                          onChange={(e) => updatePetition(index, 'uscisActionOther', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="Describe the status..."
                        />
                      </div>
                    )}
                  </div>

                  {/* I-134 Question (only if Approved AND not requiring IMBRA waiver) */}
                  {petition.uscisAction === 'Approved' && !needsIMBRAWaiver && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-4 mt-8">
                      <div>
                        <p className="text-sm font-medium text-gray-900 mb-2">
                          Do you currently have an active Form I-134 filed for {petition.beneficiaryFirstName || 'this beneficiary'}? <span className="text-red-500">*</span>
                        </p>
                        <div className="bg-white border border-gray-300 rounded p-3 mb-3 space-y-2">
                          <p className="text-xs text-gray-700">
                            <strong>What is Form I-134?</strong>
                          </p>
                          <p className="text-xs text-gray-700">
                            Form I-134 is the financial support form sponsors may submit to help their beneficiary obtain a K-1 visa at the consular interview.
                          </p>
                          <p className="text-xs text-gray-700 mt-3">
                            <strong>⚠️ Important:</strong> Answer "Yes" only if {petition.beneficiaryFirstName ? `${petition.beneficiaryFirstName}'s` : "the beneficiary's"} K-1 status has not yet expired.
                          </p>
                          <p className="text-xs text-gray-700">
                            K-1 status expires when {petition.beneficiaryFirstName ? 'they' : 'the beneficiary'} either:
                          </p>
                          <ul className="text-xs text-gray-700 ml-4 list-disc space-y-1">
                            <li>Reaches 90 days after entering the U.S., OR</li>
                            <li>Adjusts status to permanent resident (gets their green card)</li>
                          </ul>
                          <p className="text-xs text-gray-700 italic">
                            If either has happened, answer "No" below.
                          </p>
                        </div>
                        <div className="space-y-2">
                          {['yes', 'no'].map(option => (
                            <label key={option} className="flex items-center space-x-3 p-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                              <input
                                type="radio"
                                name={`filedI134_${index}`}
                                value={option}
                                checked={petition.filedI134 === option}
                                onChange={(e) => updatePetition(index, 'filedI134', e.target.value)}
                                className="h-4 w-4 text-blue-600"
                              />
                              <span className="text-sm text-gray-900">
                                {option === 'yes' ? 'Yes' : 'No'}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {petition.filedI134 === 'yes' && (
                        <div className="space-y-4 pt-4 border-t border-blue-300">
                          {/* Relationship */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              What is {petition.beneficiaryFirstName ? `${petition.beneficiaryFirstName}'s` : "this beneficiary's"} relationship to you? <span className="text-red-500">*</span>
                            </label>
                            <select
                              value={petition.relationship}
                              onChange={(e) => updatePetition(index, 'relationship', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                              required
                            >
                              <option value="">Select relationship...</option>
                              <option value="former-fiance">Former fiancé(e)</option>
                              <option value="former-spouse">Former spouse</option>
                              <option value="current-spouse">Current spouse</option>
                              <option value="former-partner">Former romantic partner (never married or engaged)</option>
                              <option value="parent">Parent</option>
                              <option value="sibling">Sibling</option>
                              <option value="child">Child</option>
                              <option value="other-relative">Other relative</option>
                              <option value="friend">Friend</option>
                              <option value="other">Other</option>
                            </select>

                            {petition.relationship === 'other' && (
                              <input
                                type="text"
                                value={petition.relationshipOther}
                                onChange={(e) => updatePetition(index, 'relationshipOther', e.target.value)}
                                placeholder="Please specify relationship..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 mt-2"
                              />
                            )}
                          </div>

                          {/* Current Spouse Warning */}
                          {currentData.section7_currentSpouse_DQ && <CurrentSpouseWarning />}

                          {/* Date of Birth */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              What is {petition.beneficiaryFirstName ? `${petition.beneficiaryFirstName}'s` : "this beneficiary's"} date of birth? <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="date"
                              value={petition.beneficiaryDOB}
                              onChange={(e) => updatePetition(index, 'beneficiaryDOB', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                              required
                            />
                          </div>

                          {/* Receipt Number */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              USCIS Receipt Number for {petition.beneficiaryFirstName ? `${petition.beneficiaryFirstName}'s` : "this"} I-134
                            </label>
                            <input
                              type="text"
                              value={petition.i134ReceiptNumber}
                              onChange={(e) => {
                                let val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
                                if (val.length > 13) val = val.slice(0, 13);
                                updatePetition(index, 'i134ReceiptNumber', val);
                              }}
                              placeholder="MSC2190123456 or IOE1234567890123"
                              maxLength="13"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 uppercase"
                            />

                            {/* Expandable help section */}
                            <button
                              type="button"
                              onClick={() => setShowPetitionReceiptHelp({...showPetitionReceiptHelp, [index]: !showPetitionReceiptHelp[index]})}
                              className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-2"
                            >
                              {showPetitionReceiptHelp[index] ? '▼' : '▶'} What is a receipt number?
                            </button>

                            {showPetitionReceiptHelp[index] && (
                              <div className="text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded p-3 space-y-2 mt-2">
                                <p className="font-semibold">What is this?</p>
                                <p>A unique 13-character identifier assigned when USCIS receives your form.</p>

                                <p className="font-semibold mt-3">Format:</p>
                                <ul className="list-disc ml-4 space-y-1">
                                  <li>3 letters (MSC, EAC, WAC, LIN, SRC, NBC, TSC, VSC, or CSC) + 10 numbers<br/><span className="italic">Example: MSC2190123456</span></li>
                                </ul>
                                <p className="ml-4 font-medium my-1">OR</p>
                                <ul className="list-disc ml-4 space-y-1">
                                  <li>IOE + 10 numbers<br/><span className="italic">Example: IOE1234567890</span></li>
                                </ul>

                                <p className="font-semibold mt-3">Where to find it:</p>
                                <ul className="list-disc ml-4">
                                  <li>I-797 Notice of Action</li>
                                  <li>Your USCIS online account</li>
                                  <li>Email or text notifications from USCIS</li>
                                </ul>

                                <p className="italic text-gray-700 mt-3">Leave blank if you don't have it available.</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Show disqualification if 2-year condition is met */}
          {hasPreviousPetitions === 'yes' && petitionsCount === '1' && currentData.section7_withinTwoYears_DQ && (
            <div className="ml-6 mt-4">
              <WithinTwoYearsWarning />
            </div>
          )}
        </div>
      </div>
    </ScreenLayout>
  );
};

export default PreviousSponsorshipsScreen;
