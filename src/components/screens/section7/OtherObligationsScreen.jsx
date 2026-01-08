import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Plus, Trash2 } from 'lucide-react';
import ScreenLayout from '../../ScreenLayout';
import DisqualificationStandaloneScreen from '../../DisqualificationStandaloneScreen';
import { getNextScreen, getPreviousScreen, isFirstScreen } from '../../../utils/navigationUtils';

const OtherObligationsScreen = ({ currentData = {}, updateField }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Check if IMBRA waiver is needed (from previous screen)
  const previousPetitions = currentData.previousPetitions || [];
  const hasPreviousPetitions = currentData.hasPreviousPetitions;
  const petitionsCount = currentData.petitionsCount;

  const needsIMBRAWaiver = hasPreviousPetitions === 'yes' && petitionsCount === '1' &&
    previousPetitions.length > 0 &&
    previousPetitions.some(p => {
      if (!p.dateOfFiling) return false;
      const filingDate = new Date(p.dateOfFiling);
      const twoYearsAgo = new Date();
      twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
      return filingDate > twoYearsAgo;
    });

  // OTHER OBLIGATIONS state
  const [hasOtherObligations, setHasOtherObligations] = useState(
    currentData.hasOtherObligations || null
  );
  const [otherObligationsCount, setOtherObligationsCount] = useState(
    currentData.otherObligationsCount || 0
  );
  const [otherObligations, setOtherObligations] = useState(
    currentData.otherObligations || []
  );

  // Help section state
  const [showObligationReceiptHelp, setShowObligationReceiptHelp] = useState({});

  // DQ screen state
  const [showDisqualification, setShowDisqualification] = useState(false);

  // Sync state to currentData
  useEffect(() => {
    updateField('hasOtherObligations', hasOtherObligations);
  }, [hasOtherObligations]);

  useEffect(() => {
    updateField('otherObligationsCount', otherObligationsCount);
  }, [otherObligationsCount]);

  useEffect(() => {
    updateField('otherObligations', otherObligations);
  }, [otherObligations]);

  // Helper functions
  const updateOtherObligation = (index, field, value) => {
    setOtherObligations(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addOtherObligation = () => {
    setOtherObligations(prev => [...prev, {
      formType: '',
      firstName: '',
      middleName: '',
      lastName: '',
      dateOfFiling: '',
      relationship: '',
      relationshipOther: '',
      receiptNumber: ''
    }]);
    // Don't update count - it stays at 5 for "5+" mode
  };

  const removeOtherObligation = (index) => {
    setOtherObligations(prev => prev.filter((_, i) => i !== index));
    // Don't update count - it stays at 5 for "5+" mode
  };

  // Get excluded names for Other Obligations
  const getExcludedNames = () => {
    return previousPetitions
      .filter(p => p.beneficiaryFirstName && p.beneficiaryLastName)
      .map((p, idx) => `${p.beneficiaryFirstName} ${p.beneficiaryLastName} (Petition #${idx + 1})`)
      .join(', ');
  };

  // Initialize obligation forms when count is set
  useEffect(() => {
    if (hasOtherObligations === 'yes' && otherObligationsCount > 0) {
      setOtherObligations(prev => {
        const targetCount = otherObligationsCount === 5 ? 5 : otherObligationsCount;

        if (prev.length < targetCount) {
          // Add more forms
          const newObligations = [...prev];
          for (let i = prev.length; i < targetCount; i++) {
            newObligations.push({
              formType: '',
              firstName: '',
              middleName: '',
              lastName: '',
              dateOfFiling: '',
              relationship: '',
              relationshipOther: '',
              receiptNumber: ''
            });
          }
          return newObligations;
        } else if (prev.length > targetCount && otherObligationsCount !== 5) {
          // Remove excess forms (but only if not in 5+ mode)
          return prev.slice(0, targetCount);
        }
        return prev;
      });
    }
  }, [hasOtherObligations, otherObligationsCount]);

  // Navigation handlers
  const handleBack = () => {
    const prevScreen = getPreviousScreen(location.pathname, currentData.userRole, currentData);
    if (prevScreen) {
      navigate(prevScreen);
    }
  };

  const handleNext = () => {
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
  const isOnThisScreen = location.pathname.includes('other-obligations');
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

  const isFirst = isFirstScreen(location.pathname, currentData.userRole, currentData);

  // Comprehensive validation function
  const validateRequiredFields = () => {
    // Must answer the main question
    if (hasOtherObligations === null) return false;

    // If answered "no", we're done
    if (hasOtherObligations === 'no') return true;

    // If answered "yes", must have at least one obligation
    if (otherObligationsCount === 0 || otherObligations.length === 0) return false;

    // Validate each obligation
    for (const obligation of otherObligations) {
      if (!obligation.formType) return false;
      if (!obligation.firstName?.trim()) return false;
      if (!obligation.lastName?.trim()) return false;
      if (!obligation.dateOfFiling) return false;
      if (!obligation.relationship) return false;
      if (obligation.relationship === 'other-relative' && !obligation.relationshipOther?.trim()) return false;
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
            Other Obligations
          </h3>
          <p className="text-sm text-gray-700">
            We need to know if you have any other active financial sponsorship obligations from previous immigration forms. This counts toward your household size and affects your minimum income requirement.
          </p>
        </div>

        {/* OTHER OBLIGATIONS */}
        <div className="space-y-4">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
            <p className="text-sm font-semibold text-gray-900">
              Have you previously sponsored anyone ELSE using an immigration form where you're still financially responsible? <span className="text-red-500">*</span>
            </p>

            {getExcludedNames() && (
              <div className="bg-yellow-50 border border-yellow-300 rounded p-3">
                <p className="text-sm text-yellow-900">
                  <strong>⚠️ Please do not include:</strong> {getExcludedNames()} - we've already counted them above.
                </p>
              </div>
            )}

            <p className="text-sm text-gray-700 font-medium">This includes these forms:</p>
            <ul className="text-sm text-gray-700 space-y-1 ml-4 list-disc">
              <li>Form I-134A (Online Request to be a Supporter)</li>
              <li>Form I-864 (Affidavit of Support)</li>
              <li>Form I-864EZ (Affidavit of Support - simplified)</li>
              <li>Form I-864A (Contract Between Sponsor and Household Member)</li>
            </ul>

            <p className="text-sm text-gray-700 font-medium mt-3">Your support obligation has ended ONLY if one of these happened:</p>

            <div className="ml-4 mt-2 space-y-3">
              <div className="bg-white border border-gray-300 rounded p-3">
                <p className="text-sm font-semibold text-gray-900 mb-2">For I-134A (supporting someone else's I-134):</p>
                <p className="text-sm text-gray-700 mb-2">The beneficiary's temporary immigration status has expired</p>
                <p className="text-xs text-gray-600 italic">
                  Examples of expired status: K-1 visa holder's 90-day entry period ended without filing for adjustment of status, K-3 visa expired,
                  beneficiary on humanitarian parole and parole period ended, OR the beneficiary adjusted status to permanent resident (green card)
                  which ended their temporary K-1/K-3/parole status.
                </p>
              </div>

              <div className="bg-white border border-gray-300 rounded p-3">
                <p className="text-sm font-semibold text-gray-900 mb-2">For I-864 / I-864EZ / I-864A (permanent immigration):</p>
                <p className="text-sm text-gray-700 mb-2">The person you sponsored:</p>
                <ul className="text-sm text-gray-700 space-y-1 ml-4 list-disc">
                  <li>Became a U.S. citizen, <strong>OR</strong></li>
                  <li>Earned 40 quarters of work (~10 years), <strong>OR</strong></li>
                  <li>Died, <strong>OR</strong></li>
                  <li>Lost permanent residence <strong>AND</strong> left the U.S., <strong>OR</strong></li>
                  <li>Got a new grant of adjustment of status with a different sponsor's I-864</li>
                </ul>
                <p className="text-xs text-gray-600 mt-2 italic">⚠️ Divorce does NOT end your obligation</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {['yes', 'no'].map(option => (
              <label key={option} className="flex items-center space-x-3 p-4 border-2 border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="hasOtherObligations"
                  value={option}
                  checked={hasOtherObligations === option}
                  onChange={(e) => {
                    setHasOtherObligations(e.target.value);
                    if (e.target.value !== 'yes') {
                      setOtherObligationsCount(0);
                      setOtherObligations([]);
                    }
                  }}
                  className="h-4 w-4 text-blue-600"
                />
                <span className="text-sm font-medium text-gray-900">
                  {option === 'yes' ? 'Yes' : 'No'}
                </span>
              </label>
            ))}
          </div>

          {hasOtherObligations === 'yes' && (
            <div className="mt-8 space-y-4">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-sm font-semibold text-gray-900 mb-2">
                  How many individuals{getExcludedNames() ? ' (not including anyone from your previous I-129F petitions listed above)' : ''}? <span className="text-red-500">*</span>
                </p>
              </div>

              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {[1, 2, 3, 4, 5].map(num => (
                  <button
                    key={num}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setOtherObligationsCount(num);
                    }}
                    className={`flex items-center justify-center p-3 border-2 rounded-lg transition-colors ${
                      otherObligationsCount === num
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <span className={`text-sm font-medium ${otherObligationsCount === num ? 'text-blue-600' : 'text-gray-900'}`}>
                      {num === 5 ? '5+' : num}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {hasOtherObligations === 'yes' && otherObligations.length > 0 && (
            <div className="ml-6 space-y-6 mt-6">
              {otherObligations.map((obligation, index) => (
                <div key={index} className="border-2 border-gray-300 rounded-lg p-6 space-y-4 bg-white">
                  <div className="flex justify-between items-center border-b pb-3">
                    <h5 className="text-base font-semibold text-gray-900">Individual #{index + 1}</h5>
                    {otherObligationsCount >= 5 && otherObligations.length > 5 && (
                      <button
                        onClick={() => removeOtherObligation(index)}
                        className="text-red-600 hover:text-red-700 text-sm flex items-center gap-1"
                      >
                        <Trash2 className="h-4 w-4" />
                        Remove
                      </button>
                    )}
                  </div>

                  {/* Form Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Which form did you file? <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={obligation.formType}
                      onChange={(e) => updateOtherObligation(index, 'formType', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select form...</option>
                      <option value="I-134A">I-134A (Online Request to be a Supporter)</option>
                      <option value="I-864">I-864 (Affidavit of Support)</option>
                      <option value="I-864EZ">I-864EZ (Affidavit of Support - simplified)</option>
                      <option value="I-864A">I-864A (Contract Between Sponsor and Household Member)</option>
                    </select>
                  </div>

                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      What is this person's full legal name?
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">First Name <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          value={obligation.firstName}
                          onChange={(e) => updateOtherObligation(index, 'firstName', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Middle Name</label>
                        <input
                          type="text"
                          value={obligation.middleName}
                          onChange={(e) => updateOtherObligation(index, 'middleName', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Last Name <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          value={obligation.lastName}
                          onChange={(e) => updateOtherObligation(index, 'lastName', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Date of Filing */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      When did you file this form? <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={obligation.dateOfFiling}
                      onChange={(e) => updateOtherObligation(index, 'dateOfFiling', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  {/* Relationship */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      What is their relationship to you? <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={obligation.relationship}
                      onChange={(e) => updateOtherObligation(index, 'relationship', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select relationship...</option>
                      <option value="spouse">Spouse</option>
                      <option value="parent">Parent</option>
                      <option value="child">Child</option>
                      <option value="sibling">Sibling</option>
                      <option value="other-relative">Other relative</option>
                      <option value="non-relative">Non-relative</option>
                    </select>

                    {obligation.relationship === 'other-relative' && (
                      <input
                        type="text"
                        value={obligation.relationshipOther}
                        onChange={(e) => updateOtherObligation(index, 'relationshipOther', e.target.value)}
                        placeholder="Please specify relationship..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 mt-2"
                      />
                    )}
                  </div>

                  {/* Receipt Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      USCIS Receipt Number
                    </label>
                    <input
                      type="text"
                      value={obligation.receiptNumber}
                      onChange={(e) => {
                        let val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
                        if (val.length > 13) val = val.slice(0, 13);
                        updateOtherObligation(index, 'receiptNumber', val);
                      }}
                      placeholder="MSC2190123456 or IOE1234567890123"
                      maxLength="13"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 uppercase"
                    />

                    {/* Expandable help section */}
                    <button
                      type="button"
                      onClick={() => setShowObligationReceiptHelp({...showObligationReceiptHelp, [index]: !showObligationReceiptHelp[index]})}
                      className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-2"
                    >
                      {showObligationReceiptHelp[index] ? '▼' : '▶'} What is a receipt number?
                    </button>

                    {showObligationReceiptHelp[index] && (
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
              ))}

              {otherObligationsCount >= 5 && (
                <button
                  type="button"
                  onClick={addOtherObligation}
                  className="w-full px-4 py-3 bg-blue-50 text-blue-700 border-2 border-blue-300 rounded-lg hover:bg-blue-100 font-medium flex items-center justify-center gap-2"
                >
                  <Plus className="h-5 w-5" />
                  Add Another Individual
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </ScreenLayout>
  );
};

export default OtherObligationsScreen;
