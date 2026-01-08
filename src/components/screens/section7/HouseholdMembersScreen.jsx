import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Info, Plus, Trash2, AlertCircle, CheckCircle } from 'lucide-react';
import ScreenLayout from '../../ScreenLayout';
import DisqualificationStandaloneScreen from '../../DisqualificationStandaloneScreen';
import { getNextScreen, getPreviousScreen, isFirstScreen } from '../../../utils/navigationUtils';

const HouseholdMembersScreen = ({ currentData = {}, updateField }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // READ data from previous screens (for household size calculation only)
  const previousPetitions = currentData.previousPetitions || [];
  const otherObligations = currentData.otherObligations || [];
  const hasPreviousPetitions = currentData.hasPreviousPetitions;
  const petitionsCount = currentData.petitionsCount;

  // HOUSEHOLD MEMBERS (this screen manages this data)
  const [hasChildrenUnder18, setHasChildrenUnder18] = useState(
    currentData.hasChildrenUnder18 || null
  );

  // Help section state
  const [showChildANumberHelp, setShowChildANumberHelp] = useState({});
  const [showDependentANumberHelp, setShowDependentANumberHelp] = useState({});
  const [showDependentReceiptHelp, setShowDependentReceiptHelp] = useState({});

  // DQ screen state
  const [showDisqualification, setShowDisqualification] = useState(false);
  const [childrenCount, setChildrenCount] = useState(
    currentData.childrenCount || 0
  );
  const [childrenDetails, setChildrenDetails] = useState(
    currentData.childrenDetails || []
  );

  // Other Household Members (not children)
  const [otherDependentsCount, setOtherDependentsCount] = useState(
    currentData.otherDependentsCount || 0
  );
  const [otherDependents, setOtherDependents] = useState(
    currentData.otherDependents || []
  );

  // Get fiancé name from data
  const fianceName = currentData.beneficiaryFirstName || 'your fiancé(e)';
  const fiancePronoun = currentData.beneficiaryGender === 'male' ? 'him' :
                        currentData.beneficiaryGender === 'female' ? 'her' : 'them';

  // 2025 Poverty Guidelines
  const povertyGuidelines2025 = {
    1: 15650, 2: 21150, 3: 26650, 4: 32150,
    5: 37650, 6: 43150, 7: 48650, 8: 54150
  };

  const getPovertyGuideline = (size) => {
    if (size <= 8) return povertyGuidelines2025[size];
    return povertyGuidelines2025[8] + ((size - 8) * 5500);
  };

  // Calculate household size (memoized to prevent recalculation on every render)
  const householdData = useMemo(() => {
    const sponsorCount = 1;
    const fianeeCount = 1;

    // Count active I-134 obligations from Previous Sponsorships
    const activeI134Count = previousPetitions.filter(p =>
      p.uscisAction === 'Approved' && p.filedI134 === 'yes'
    ).length;

    // Count other obligations from Other Obligations
    const otherObligCount = otherObligations.length;

    // Count children meeting I-134 criteria from Household Members (checked boxes)
    const childrenLivingCount = childrenDetails.filter(child => child.meetsCriteria === true).length;

    // Count other dependents from Household Members
    const otherDepsCount = otherDependents.length;

    const totalHouseholdSize = sponsorCount + fianeeCount + activeI134Count +
                               otherObligCount + childrenLivingCount + otherDepsCount;
    const minimumIncome = getPovertyGuideline(totalHouseholdSize);

    return {
      householdSize: totalHouseholdSize,
      minimumRequiredIncome: minimumIncome,
      breakdown: {
        sponsor: sponsorCount,
        fiance: fianeeCount,
        activeI134: activeI134Count,
        otherObligations: otherObligCount,
        childrenLiving: childrenLivingCount,
        otherDependents: otherDepsCount
      }
    };
  }, [previousPetitions, otherObligations, childrenDetails, otherDependents]);

  // Update parent whenever household member data changes
  useEffect(() => {
    updateField('hasChildrenUnder18', hasChildrenUnder18);
  }, [hasChildrenUnder18]);

  useEffect(() => {
    updateField('childrenCount', childrenCount);
  }, [childrenCount]);

  useEffect(() => {
    updateField('childrenDetails', childrenDetails);
  }, [childrenDetails]);

  useEffect(() => {
    updateField('otherDependentsCount', otherDependentsCount);
  }, [otherDependentsCount]);

  useEffect(() => {
    updateField('otherDependents', otherDependents);
  }, [otherDependents]);

  useEffect(() => {
    updateField('householdSize', householdData.householdSize);
    updateField('minimumRequiredIncome', householdData.minimumRequiredIncome);
  }, [householdData.householdSize, householdData.minimumRequiredIncome]);

  // Check for IMBRA waiver requirements
  const requiresIMBRAWaiver = () => {
    // Condition 1: User selected 2+ petitions
    if (petitionsCount === '2+') {
      return true;
    }

    // Condition 2: User has 1 petition that was approved AND filed less than 2 years ago
    if (petitionsCount === '1' && previousPetitions.length > 0) {
      const petition = previousPetitions[0];
      if (petition.uscisAction === 'Approved' && petition.dateOfFiling) {
        const filingDate = new Date(petition.dateOfFiling);
        const twoYearsAgo = new Date();
        twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);

        if (filingDate > twoYearsAgo) {
          return true;
        }
      }
    }

    return false;
  };

  const needsIMBRAWaiver = requiresIMBRAWaiver();

  // Initialize children array when count changes
  useEffect(() => {
    setChildrenDetails(prev => {
      if (childrenCount > prev.length) {
        const newChildren = Array(childrenCount - prev.length).fill(null).map(() => ({
          firstName: '',
          middleName: '',
          lastName: '',
          dateOfBirth: '',
          aNumber: '',
          meetsCriteria: false
        }));
        return [...prev, ...newChildren];
      } else if (childrenCount < prev.length && childrenCount !== 5) {
        // Only slice down if NOT in "5+" mode
        return prev.slice(0, childrenCount);
      }
      return prev;
    });
  }, [childrenCount]);

  useEffect(() => {
    setOtherDependents(prev => {
      if (otherDependentsCount > prev.length) {
        const newDeps = Array(otherDependentsCount - prev.length).fill(null).map(() => ({
          firstName: '',
          middleName: '',
          lastName: '',
          dateOfBirth: '',
          relationship: '',
          relationshipOther: '',
          aNumber: '',
          receiptNumber: ''
        }));
        return [...prev, ...newDeps];
      } else if (otherDependentsCount < prev.length && otherDependentsCount !== 5) {
        // Only slice down if NOT in "5+" mode
        return prev.slice(0, otherDependentsCount);
      }
      return prev;
    });
  }, [otherDependentsCount]);

  // Helper functions for children and dependents
  const removeChild = (index) => {
    setChildrenDetails(prev => prev.filter((_, i) => i !== index));
    // Don't update count - user must manually adjust count via buttons
  };

  const updateChild = (index, field, value) => {
    setChildrenDetails(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addChild = () => {
    setChildrenDetails(prev => [...prev, {
      firstName: '',
      middleName: '',
      lastName: '',
      dateOfBirth: '',
      aNumber: '',
      meetsCriteria: false
    }]);
    // Don't update count - user must manually adjust count via buttons
  };

  const updateOtherDependent = (index, field, value) => {
    setOtherDependents(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const removeOtherDependent = (index) => {
    setOtherDependents(prev => prev.filter((_, i) => i !== index));
    // Don't update count - user must manually adjust count via buttons
  };

  const addOtherDependent = () => {
    setOtherDependents(prev => [...prev, {
      firstName: '',
      middleName: '',
      lastName: '',
      dateOfBirth: '',
      relationship: '',
      relationshipOther: '',
      aNumber: '',
      receiptNumber: ''
    }]);
    // Don't update count - user must manually adjust count via buttons
  };

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
  const isOnThisScreen = location.pathname.includes('household-members');
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
    if (hasChildrenUnder18 === null) return false;

    // If answered "yes", validate children details
    if (hasChildrenUnder18 === 'yes') {
      // Must select a count
      if (childrenCount === 0) return false;

      // Must have filled in details for all children
      for (const child of childrenDetails) {
        if (!child.firstName?.trim()) return false;
        if (!child.lastName?.trim()) return false;
        if (!child.dateOfBirth) return false;
      }
    }

    // Validate other dependents if any
    if (otherDependentsCount > 0) {
      for (const dependent of otherDependents) {
        if (!dependent.firstName?.trim()) return false;
        if (!dependent.lastName?.trim()) return false;
        if (!dependent.dateOfBirth) return false;
        if (!dependent.relationship) return false;
        // If "other-relative", must specify
        if (dependent.relationship === 'other-relative' && !dependent.relationshipOther?.trim()) return false;
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
            Household Members
          </h3>
          <p className="text-sm text-gray-700">
            We need to know about your children and other dependents to calculate your household size and minimum income requirement for sponsoring {fianceName}.
          </p>
        </div>

        {/* HOUSEHOLD MEMBERS */}
        <div className="space-y-4">
          <h4 className="text-base font-semibold text-gray-900">
            Household Members
          </h4>


          {/* Children Question */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-sm font-semibold text-gray-900 mb-2">
              Do you have any children under 18 years of age?
            </p>
            <p className="text-xs text-gray-700">
              Include biological children, adopted children, and stepchildren. Count all children under 18, regardless of where they live or their citizenship.
            </p>
          </div>

          <div className="space-y-3">
            {['yes', 'no'].map(option => (
              <label key={option} className="flex items-center space-x-3 p-4 border-2 border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="hasChildrenUnder18"
                  value={option}
                  checked={hasChildrenUnder18 === option}
                  onChange={(e) => {
                    setHasChildrenUnder18(e.target.value);
                    if (e.target.value === 'no') {
                      setChildrenCount(0);
                      setChildrenDetails([]);
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

          {hasChildrenUnder18 === 'yes' && (
            <>
              <div className="mt-8 space-y-4">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-sm font-semibold text-gray-900 mb-2">
                    How many children under 18 do you have? <span className="text-red-500">*</span>
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
                        setChildrenCount(num);
                      }}
                      className={`flex items-center justify-center p-3 border-2 rounded-lg transition-colors ${
                        childrenCount === num
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <span className={`text-sm font-medium ${childrenCount === num ? 'text-blue-600' : 'text-gray-900'}`}>
                        {num === 5 ? '5+' : num}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {childrenCount > 0 && (
                <>
                  {/* First, collect details for ALL children (for I-129F Items 49.a & 49.b) */}
                  <div className="ml-6 space-y-4 mt-6">
                    <p className="text-sm font-medium text-gray-900">
                      Please provide details for each child under 18:
                    </p>
                    <p className="text-xs text-gray-700">
                      This information is required for Form I-129F (Items 48, 49.a, 49.b).
                    </p>

                  {childrenDetails.map((child, index) => (
                      <div key={index} className="border-2 border-gray-300 rounded-lg p-6 space-y-4 bg-white">
                        <div className="flex justify-between items-center border-b pb-3">
                          <h5 className="text-base font-semibold text-gray-900">Child #{index + 1}</h5>
                          {childrenCount >= 5 && childrenDetails.length > 5 && (
                            <button
                              onClick={() => removeChild(index)}
                              className="text-red-600 hover:text-red-700 text-sm flex items-center gap-1"
                            >
                              <Trash2 className="h-4 w-4" />
                              Remove
                            </button>
                          )}
                        </div>

                        {/* Name */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Full legal name:</label>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">First Name <span className="text-red-500">*</span></label>
                              <input
                                type="text"
                                value={child.firstName}
                                onChange={(e) => updateChild(index, 'firstName', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">Middle Name</label>
                              <input
                                type="text"
                                value={child.middleName}
                                onChange={(e) => updateChild(index, 'middleName', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">Last Name <span className="text-red-500">*</span></label>
                              <input
                                type="text"
                                value={child.lastName}
                                onChange={(e) => updateChild(index, 'lastName', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                required
                              />
                            </div>
                          </div>
                        </div>

                        {/* Date of Birth */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Date of Birth <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="date"
                            value={child.dateOfBirth}
                            onChange={(e) => updateChild(index, 'dateOfBirth', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>

                        {/* A-Number */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            A-Number (if any)
                          </label>
                          <div className="flex">
                            <span className="inline-flex items-center px-3 py-2 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm rounded-l font-medium">
                              A
                            </span>
                            <input
                              type="text"
                              value={child.aNumber ? child.aNumber.replace(/^A0*/, '') : ''}
                              onChange={(e) => {
                                let val = e.target.value.replace(/\D/g, '');
                                if (val.length > 9) val = val.slice(0, 9);
                                if (val) {
                                  const paddedVal = val.padStart(9, '0');
                                  updateChild(index, 'aNumber', `A${paddedVal}`);
                                } else {
                                  updateChild(index, 'aNumber', '');
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
                            onClick={() => setShowChildANumberHelp({...showChildANumberHelp, [index]: !showChildANumberHelp[index]})}
                            className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-2"
                          >
                            {showChildANumberHelp[index] ? '▼' : '▶'} Where to find this number
                          </button>

                          {showChildANumberHelp[index] && (
                            <div className="text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded p-3 space-y-2 mt-2">
                              <p className="font-semibold">Where to find your child's A-Number (if they have one):</p>
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
                                <strong>Note:</strong> Most children won't have an A-Number unless they previously had a green card, work permit, or filed for permanent residence. If they've never had U.S. immigration status, leave this blank.
                              </p>
                            </div>
                          )}

                          {child.aNumber && child.aNumber.replace(/^A0*/, '').length >= 7 && child.aNumber.replace(/^A0*/, '').length <= 9 && (
                            <div className="text-sm text-green-600 mt-1">
                              ✅ Valid A-Number format
                            </div>
                          )}

                          {child.aNumber && child.aNumber.replace(/^A0*/, '').length > 0 && (child.aNumber.replace(/^A0*/, '').length < 7 || child.aNumber.replace(/^A0*/, '').length > 9) && (
                            <div className="text-sm text-orange-600 mt-1">
                              A-Number should be 7-9 digits (e.g., A12345678)
                            </div>
                          )}
                        </div>
                        {/* Checkbox for meeting I-134 criteria */}
                        <div className="pt-3 border-t border-gray-200">
                          <label className="flex items-start space-x-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={child.meetsCriteria || false}
                              onChange={(e) => updateChild(index, 'meetsCriteria', e.target.checked)}
                              className="h-4 w-4 text-blue-600 mt-1"
                            />
                            <div>
                              <span className="text-sm font-medium text-gray-900">This child meets the criteria below:</span>
                              <ul className="text-xs text-gray-600 ml-4 list-disc space-y-1 mt-1">
                                <li>I claimed them as a dependent on my most recent Federal income tax return, OR</li>
                                <li>They have lived with me for at least the past 6 months</li>
                              </ul>
                            </div>
                          </label>
                        </div>
                      </div>
                    ))}

                    {childrenCount === 5 && (
                      <button
                        onClick={addChild}
                        className="w-full px-4 py-3 bg-blue-50 text-blue-700 border-2 border-blue-300 rounded-lg hover:bg-blue-100 font-medium flex items-center justify-center gap-2"
                      >
                        <Plus className="h-5 w-5" />
                        Add Another Child
                      </button>
                    )}
                </div>
              </>
            )}
          </>
        )}

        {/* Other Dependents */}
        <div className="mt-8 space-y-4">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-sm font-semibold text-gray-900 mb-2">
              How many dependents did you claim on your most recent Federal income tax return? <span className="text-red-500">*</span>
            </p>
            <p className="text-xs text-gray-600 mb-3 italic">
              If you did not file a Federal income tax return, select "0" (None).
            </p>
            <div className="bg-yellow-50 border border-yellow-300 rounded p-3 mb-3">
              <p className="text-xs text-yellow-900 font-medium mb-1">⚠️ Do NOT include:</p>
              <ul className="text-xs text-yellow-900 space-y-1 ml-4 list-disc">
                <li>Yourself</li>
                <li>{fianceName}</li>
                <li>Anyone from "Previous Sponsorships" above</li>
                <li>Children you already listed in "Household Members" above</li>
              </ul>
            </div>
            <div className="bg-white border border-gray-200 rounded p-3 mb-3">
              <p className="text-xs text-gray-700 mb-2">
                <strong>This can include:</strong>
              </p>
              <ul className="text-xs text-gray-700 ml-4 list-disc space-y-1">
                <li>Adult children (18+)</li>
                <li>Parents or grandparents</li>
                <li>Siblings</li>
                <li>Other relatives</li>
                <li>Non-relatives you claimed as dependents</li>
              </ul>
            </div>
            <p className="text-xs text-gray-600 italic">
              💡 Check your Form 1040 to see who you listed as dependents.
            </p>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {[0, 1, 2, 3, 4, 5].map(num => (
              <button
                key={num}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setOtherDependentsCount(num);
                }}
                className={`flex items-center justify-center p-3 border-2 rounded-lg transition-colors ${
                  otherDependentsCount === num
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                <span className={`text-sm font-medium ${otherDependentsCount === num ? 'text-blue-600' : 'text-gray-900'}`}>
                  {num === 0 ? 'None' : num === 5 ? '5+' : num}
                </span>
              </button>
            ))}
          </div>
        </div>

        {otherDependentsCount > 0 && (
          <div className="ml-6 space-y-6 mt-6">
            {otherDependents.map((dependent, index) => (
              <div key={index} className="border-2 border-gray-300 rounded-lg p-6 space-y-4 bg-white">
                <div className="flex justify-between items-center border-b pb-3">
                  <h5 className="text-base font-semibold text-gray-900">Person #{index + 1}</h5>
                  {otherDependentsCount >= 5 && otherDependents.length > 5 && (
                    <button
                      onClick={() => removeOtherDependent(index)}
                      className="text-red-600 hover:text-red-700 text-sm flex items-center gap-1"
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </button>
                  )}
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full legal name:</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">First Name <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        value={dependent.firstName}
                        onChange={(e) => updateOtherDependent(index, 'firstName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Middle Name</label>
                      <input
                        type="text"
                        value={dependent.middleName}
                        onChange={(e) => updateOtherDependent(index, 'middleName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Last Name <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        value={dependent.lastName}
                        onChange={(e) => updateOtherDependent(index, 'lastName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth <span className="text-red-500">*</span></label>
                  <input
                    type="date"
                    value={dependent.dateOfBirth}
                    onChange={(e) => updateOtherDependent(index, 'dateOfBirth', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Relationship */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Relationship to you <span className="text-red-500">*</span></label>
                  <select
                    value={dependent.relationship}
                    onChange={(e) => updateOtherDependent(index, 'relationship', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select relationship...</option>
                    <option value="child">Child (18 or older)</option>
                    <option value="parent">Parent</option>
                    <option value="grandparent">Grandparent</option>
                    <option value="grandchild">Grandchild</option>
                    <option value="sibling">Sibling</option>
                    <option value="other-relative">Other relative</option>
                    <option value="non-relative">Non-relative dependent</option>
                  </select>

                  {dependent.relationship === 'other-relative' && (
                    <input
                      type="text"
                      value={dependent.relationshipOther}
                      onChange={(e) => updateOtherDependent(index, 'relationshipOther', e.target.value)}
                      placeholder="Please specify relationship..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 mt-2"
                    />
                  )}
                </div>

                {/* A-Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">A-Number (if any)</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 py-2 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm rounded-l font-medium">
                      A
                    </span>
                    <input
                      type="text"
                      value={dependent.aNumber ? dependent.aNumber.replace(/^A0*/, '') : ''}
                      onChange={(e) => {
                        let val = e.target.value.replace(/\D/g, '');
                        if (val.length > 9) val = val.slice(0, 9);
                        if (val) {
                          const paddedVal = val.padStart(9, '0');
                          updateOtherDependent(index, 'aNumber', `A${paddedVal}`);
                        } else {
                          updateOtherDependent(index, 'aNumber', '');
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
                    onClick={() => setShowDependentANumberHelp({...showDependentANumberHelp, [index]: !showDependentANumberHelp[index]})}
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-2"
                  >
                    {showDependentANumberHelp[index] ? '▼' : '▶'} Where to find this number
                  </button>

                  {showDependentANumberHelp[index] && (
                    <div className="text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded p-3 space-y-2 mt-2">
                      <p className="font-semibold">Where to find the A-Number (if they have one):</p>
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

                  {dependent.aNumber && dependent.aNumber.replace(/^A0*/, '').length >= 7 && dependent.aNumber.replace(/^A0*/, '').length <= 9 && (
                    <div className="text-sm text-green-600 mt-1">
                      ✅ Valid A-Number format
                    </div>
                  )}

                  {dependent.aNumber && dependent.aNumber.replace(/^A0*/, '').length > 0 && (dependent.aNumber.replace(/^A0*/, '').length < 7 || dependent.aNumber.replace(/^A0*/, '').length > 9) && (
                    <div className="text-sm text-orange-600 mt-1">
                      A-Number should be 7-9 digits (e.g., A12345678)
                    </div>
                  )}
                </div>

                {/* Receipt Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Receipt Number (if any)</label>
                  <p className="text-xs text-gray-600 mb-2">
                    Only if you're sponsoring this person on another immigration form. Leave blank otherwise.
                  </p>
                  <input
                    type="text"
                    value={dependent.receiptNumber}
                    onChange={(e) => {
                      let val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
                      if (val.length > 13) val = val.slice(0, 13);
                      updateOtherDependent(index, 'receiptNumber', val);
                    }}
                    placeholder="MSC2190123456 or IOE1234567890123"
                    maxLength="13"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 uppercase"
                  />

                  {/* Expandable help section */}
                  <button
                    type="button"
                    onClick={() => setShowDependentReceiptHelp({...showDependentReceiptHelp, [index]: !showDependentReceiptHelp[index]})}
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-2"
                  >
                    {showDependentReceiptHelp[index] ? '▼' : '▶'} What is a receipt number?
                  </button>

                  {showDependentReceiptHelp[index] && (
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

            {otherDependentsCount >= 5 && (
              <button
                onClick={addOtherDependent}
                className="w-full px-4 py-3 bg-blue-50 text-blue-700 border-2 border-blue-300 rounded-lg hover:bg-blue-100 font-medium flex items-center justify-center gap-2"
              >
                <Plus className="h-5 w-5" />
                Add Another Person
              </button>
            )}
          </div>
        )}
      </div>

      {/* Household Size Summary */}
      <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6 mt-8">
        <div className="flex items-start gap-3">
          <Info className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h4 className="text-base font-semibold text-blue-900 mb-4">
              📊 Household Size Summary
            </h4>

            <div className="space-y-2 text-sm text-blue-900 mb-4">
              <p>Based on your answers:</p>
              <ul className="ml-4 space-y-1">
                <li>• You: <strong>1 person</strong></li>
                <li>• {fianceName}: <strong>1 person</strong></li>
                <li>• Active I-134 obligations (from Previous Sponsorships): <strong>{householdData.breakdown.activeI134} {householdData.breakdown.activeI134 === 1 ? 'person' : 'people'}</strong></li>
                <li>• Other financial obligations (from Other Obligations): <strong>{householdData.breakdown.otherObligations} {householdData.breakdown.otherObligations === 1 ? 'person' : 'people'}</strong></li>
                <li>• Children under 18 meeting criteria: <strong>{householdData.breakdown.childrenLiving} {householdData.breakdown.childrenLiving === 1 ? 'child' : 'children'}</strong></li>
                <li>• Other dependents: <strong>{householdData.breakdown.otherDependents} {householdData.breakdown.otherDependents === 1 ? 'person' : 'people'}</strong></li>
              </ul>
            </div>

            <div className="border-t border-blue-300 pt-4 mt-4">
              <p className="font-semibold text-base text-blue-900">
                Total household size: <strong className="text-lg">{householdData.householdSize} people</strong>
              </p>
              <p className="font-semibold text-base mt-2 text-green-700">
                Minimum annual income required: <strong className="text-lg">${householdData.minimumRequiredIncome.toLocaleString()}</strong>
              </p>
              <p className="text-xs text-blue-800 mt-2 italic">
                (Based on 2025 Federal Poverty Guidelines - 100% for Form I-134)
              </p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </ScreenLayout>
  );
};

export default HouseholdMembersScreen;
