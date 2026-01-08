import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import ScreenLayout from '../../ScreenLayout';
import DisqualificationStandaloneScreen from '../../DisqualificationStandaloneScreen';
import { getNextScreen, isFirstScreen } from '../../../utils/navigationUtils';
import { stateMarriageLaws, canFirstCousinsMarry, canAdoptedSiblingsMarry, canStepSiblingsMarry } from '../../../data/stateMarriageLaws';

/**
 * RelationshipScreen - Section 2, Visa Requirements Question 4
 * Content copied exactly from Section1.jsx Question 6 (lines 506-839)
 */
const RelationshipScreen = ({
  currentData,
  updateField,
  userRole
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const areRelated = currentData.areRelated || null;
  const relationshipType = currentData.relationshipType || '';
  const bloodRelationship = currentData.bloodRelationship || '';
  const adoptionRelationship = currentData.adoptionRelationship || '';
  const marriageRelationship = currentData.marriageRelationship || '';
  const marriageState = currentData.marriageState || '';

  const [showDisqualification, setShowDisqualification] = useState(false);
  const [disqualificationReason, setDisqualificationReason] = useState('');
  const [disqualificationType, setDisqualificationType] = useState('');
  const [hasDQ, setHasDQ] = useState(false);

  // US States list for embedded state selector
  const states = Object.keys(stateMarriageLaws).map(code => ({
    code,
    name: stateMarriageLaws[code].name
  }));

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

  // Get beneficiary name
  const beneficiaryName = currentData.beneficiaryFirstName || 'your fiancé(e)';

  // Check if blood relationship is allowed in selected state
  const checkBloodRelationship = () => {
    if (!bloodRelationship) return { allowed: true };

    // Universal disqualifications (illegal everywhere - don't need state)
    if (bloodRelationship === 'closer-than-first-cousins' || bloodRelationship === 'aunt-uncle-niece-nephew') {
      return { allowed: false, requiresStop: true };
    }

    // State-specific rules (only check if state is selected)
    if (marriageState && (bloodRelationship === 'first-cousins' || bloodRelationship === 'first-cousins-once-removed')) {
      const allowed = canFirstCousinsMarry(marriageState);
      return { allowed, requiresStop: false, stateName: stateMarriageLaws[marriageState]?.name };
    }

    // Second cousins+ always allowed
    return { allowed: true };
  };

  // Check if adoption relationship is allowed in selected state
  const checkAdoptionRelationship = () => {
    if (!adoptionRelationship) return { allowed: true };

    // Universal disqualification (illegal everywhere)
    if (adoptionRelationship === 'one-adopted-other') {
      return { allowed: false, requiresStop: true };
    }

    // State-specific rules (only check if state is selected)
    if (marriageState && adoptionRelationship === 'adopted-siblings') {
      const allowed = canAdoptedSiblingsMarry(marriageState);
      return { allowed, requiresStop: false, stateName: stateMarriageLaws[marriageState]?.name };
    }

    return { allowed: true };
  };

  // Check if marriage relationship is allowed in selected state
  const checkMarriageRelationship = () => {
    if (!marriageRelationship) return { allowed: true };

    // State-specific rules (only check if state is selected)
    if (marriageState && marriageRelationship === 'step-siblings') {
      const allowed = canStepSiblingsMarry(marriageState);
      return { allowed, requiresStop: false, stateName: stateMarriageLaws[marriageState]?.name };
    }

    return { allowed: true };
  };

  const bloodCheck = checkBloodRelationship();
  const adoptionCheck = checkAdoptionRelationship();
  const marriageCheck = checkMarriageRelationship();

  // Track DQ state for blood relationships (but don't show standalone screen yet)
  useEffect(() => {
    if (bloodRelationship && bloodCheck.requiresStop) {
      setDisqualificationReason(`Marriages between close blood relatives like siblings or aunt/uncle-niece/nephew are prohibited in all 50 U.S. states and aren't recognized under federal immigration law.\n\nBecause of your blood relationship with ${beneficiaryName}, USCIS will deny your K-1 petition and ${beneficiaryName} cannot obtain a K-1 visa.`);
      setDisqualificationType('blood');
      setHasDQ(true);
    }
  }, [bloodRelationship, bloodCheck.requiresStop, beneficiaryName]);

  // Track DQ state for adoption relationships (but don't show standalone screen yet)
  useEffect(() => {
    if (adoptionRelationship === 'one-adopted-other') {
      setDisqualificationReason(`Marriages between individuals with a legal parent-child relationship aren't permitted under U.S. law, including cases where one person adopted the other.\n\nBecause you have a parent-child relationship with ${beneficiaryName}, USCIS will deny your K-1 petition and ${beneficiaryName} cannot obtain a K-1 visa.`);
      setDisqualificationType('adoption');
      setHasDQ(true);
    }
  }, [adoptionRelationship, beneficiaryName]);

  // Track DQ state when state prohibits first cousin marriage (but don't show standalone screen yet)
  useEffect(() => {
    if (bloodRelationship && marriageState && !bloodCheck.allowed && !bloodCheck.requiresStop) {
      setDisqualificationReason(`Your marriage must be legally valid in the state where you plan to marry. Marriage between first cousins is not permitted in ${bloodCheck.stateName}.\n\nIf you marry in ${bloodCheck.stateName}, your marriage won't be legally recognized and USCIS will deny your petition. You'd need to marry in a state that allows first cousin marriage.`);
      setDisqualificationType('blood-state');
      setHasDQ(true);
    }
  }, [bloodRelationship, marriageState, bloodCheck.allowed, bloodCheck.requiresStop, bloodCheck.stateName]);

  // Track DQ state when state prohibits adopted sibling marriage (but don't show standalone screen yet)
  useEffect(() => {
    if (adoptionRelationship === 'adopted-siblings' && marriageState && !adoptionCheck.allowed) {
      setDisqualificationReason(`Your marriage must be legally valid in the state where you plan to marry. Marriage between adopted siblings is not permitted in ${adoptionCheck.stateName}.\n\nIf you marry in ${adoptionCheck.stateName}, your marriage won't be legally recognized and USCIS will deny your petition. You'd need to marry in a state that allows adopted sibling marriage.`);
      setDisqualificationType('adoption-state');
      setHasDQ(true);
    }
  }, [adoptionRelationship, marriageState, adoptionCheck.allowed, adoptionCheck.stateName]);

  // Track DQ state when adoption relationship is "other" (but don't show standalone screen yet)
  useEffect(() => {
    if (adoptionRelationship === 'other') {
      setDisqualificationReason(`USCIS requires clear documentation of adoption relationships. We need to understand your specific situation to determine if your marriage would be legally recognized.\n\nYour situation requires personalized guidance to evaluate your K-1 visa eligibility.`);
      setDisqualificationType('adoption-other');
      setHasDQ(true);
    }
  }, [adoptionRelationship]);

  // Track DQ state when state prohibits step-sibling marriage (but don't show standalone screen yet)
  useEffect(() => {
    if (marriageRelationship === 'step-siblings' && marriageState && !marriageCheck.allowed) {
      setDisqualificationReason(`Your marriage must be legally valid in the state where you plan to marry. Marriage between step-siblings is not permitted in ${marriageCheck.stateName}.\n\nIf you marry in ${marriageCheck.stateName}, your marriage won't be legally recognized and USCIS will deny your petition. You'd need to marry in a state that allows step-sibling marriage.`);
      setDisqualificationType('marriage-state');
      setHasDQ(true);
    }
  }, [marriageRelationship, marriageState, marriageCheck.allowed, marriageCheck.stateName]);

  // Track DQ state when marriage relationship is "other" (but don't show standalone screen yet)
  useEffect(() => {
    if (marriageRelationship === 'other') {
      setDisqualificationReason(`Your relationship involves marriage-based family connections that require careful legal review. State laws vary on these types of relationships, and we need to verify that your marriage will be legally recognized.\n\nPlease contact customer service to discuss your specific situation and determine your eligibility for a K-1 visa.`);
      setDisqualificationType('marriage-other');
      setHasDQ(true);
    }
  }, [marriageRelationship]);

  // Clear DQ state when user changes selections and update currentData
  useEffect(() => {
    // If no DQ conditions are met, clear the DQ state
    const hasBloodDQ = bloodRelationship && bloodCheck.requiresStop;
    const hasAdoptionDQ = adoptionRelationship === 'one-adopted-other';
    const hasBloodStateDQ = bloodRelationship && marriageState && !bloodCheck.allowed && !bloodCheck.requiresStop;
    const hasAdoptionStateDQ = adoptionRelationship === 'adopted-siblings' && marriageState && !adoptionCheck.allowed;
    const hasAdoptionOtherDQ = adoptionRelationship === 'other';
    const hasMarriageStateDQ = marriageRelationship === 'step-siblings' && marriageState && !marriageCheck.allowed;
    const hasMarriageOtherDQ = marriageRelationship === 'other';

    const anyDQ = hasBloodDQ || hasAdoptionDQ || hasBloodStateDQ || hasAdoptionStateDQ || hasAdoptionOtherDQ || hasMarriageStateDQ || hasMarriageOtherDQ;

    if (!anyDQ) {
      setHasDQ(false);
      setShowDisqualification(false);
      setDisqualificationReason('');
      setDisqualificationType('');
      updateField('section2_relationship_DQ', false);
    } else {
      updateField('section2_relationship_DQ', true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bloodRelationship, adoptionRelationship, marriageRelationship, marriageState, bloodCheck.requiresStop, bloodCheck.allowed, adoptionCheck.allowed, marriageCheck.allowed]);

  // Reset DQ screen when navigating away from this screen
  useEffect(() => {
    const isOnThisScreen = location.pathname.includes('/relationship');
    if (!isOnThisScreen) {
      setShowDisqualification(false);
    }
  }, [location.pathname]);

  // Handle "Go Back" button - don't clear user's answer, just hide DQ screen
  const handleGoBack = () => {
    setShowDisqualification(false);
    setDisqualificationReason('');
    setDisqualificationType('');
  };

  // Show standalone disqualification screen (only when on this screen's path AND showDisqualification is true)
  const isOnThisScreen = location.pathname.includes('/relationship');
  if (showDisqualification && isOnThisScreen) {
    return (
      <DisqualificationStandaloneScreen
        reason={disqualificationReason}
        onGoBack={handleGoBack}
        supportEmail="support@evernestusa.com"
        supportPhone="+1 (555) 123-4567"
      />
    );
  }

  // Check if form is valid (for Next button)
  const isFormValid = () => {
    if (!areRelated) return false;
    if (areRelated === 'no') return true;
    if (!relationshipType) return false;
    if (relationshipType === 'blood' && !bloodRelationship) return false;
    if (relationshipType === 'adoption' && !adoptionRelationship) return false;
    if (relationshipType === 'marriage' && !marriageRelationship) return false;
    return true;
  };

  return (
    <ScreenLayout
      showBackButton={!isFirst}
      onNext={handleNext}
      nextButtonDisabled={!isFormValid()}
    >
      <div className="space-y-4">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-sm font-semibold text-gray-900 mb-2">
            Are you and {beneficiaryName} currently related to each other in any way (by blood, adoption, or marriage)?
          </p>
        </div>

        <p className="text-xs text-gray-600">
          <strong>Why we ask this:</strong> All familial relationships must be disclosed to ensure marriage eligibility under state law.
        </p>

        <div className="space-y-3">
          <label className="flex items-center space-x-3 p-4 border-2 border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
            <input
              type="radio"
              name="areRelated"
              value="yes"
              checked={areRelated === 'yes'}
              onChange={(e) => updateField('areRelated', e.target.value)}
              className="h-4 w-4 text-blue-600"
            />
            <span className="text-sm font-medium text-gray-900">Yes</span>
          </label>

          <label className="flex items-center space-x-3 p-4 border-2 border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
            <input
              type="radio"
              name="areRelated"
              value="no"
              checked={areRelated === 'no'}
              onChange={(e) => {
                updateField('areRelated', e.target.value);
                updateField('relationshipType', '');
                updateField('bloodRelationship', '');
                updateField('adoptionRelationship', '');
                updateField('marriageRelationship', '');
              }}
              className="h-4 w-4 text-blue-600"
            />
            <span className="text-sm font-medium text-gray-900">No</span>
          </label>
        </div>

        {/* Q8: How are you related */}
        {areRelated === 'yes' && (
          <div className="ml-6 mt-4 space-y-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-sm font-medium text-gray-900">
              How are you related?
            </p>

            <div className="space-y-3">
              <label className="flex items-center space-x-3 p-4 border-2 border-gray-300 rounded-lg hover:bg-white cursor-pointer">
                <input
                  type="radio"
                  name="relationshipType"
                  value="blood"
                  checked={relationshipType === 'blood'}
                  onChange={(e) => {
                    updateField('relationshipType', e.target.value);
                    updateField('adoptionRelationship', '');
                    updateField('marriageRelationship', '');
                  }}
                  className="h-4 w-4 text-blue-600"
                />
                <span className="text-sm font-medium text-gray-900">Related by blood</span>
              </label>

              <label className="flex items-center space-x-3 p-4 border-2 border-gray-300 rounded-lg hover:bg-white cursor-pointer">
                <input
                  type="radio"
                  name="relationshipType"
                  value="adoption"
                  checked={relationshipType === 'adoption'}
                  onChange={(e) => {
                    updateField('relationshipType', e.target.value);
                    updateField('bloodRelationship', '');
                    updateField('marriageRelationship', '');
                  }}
                  className="h-4 w-4 text-blue-600"
                />
                <span className="text-sm font-medium text-gray-900">Related through adoption</span>
              </label>

              <label className="flex items-center space-x-3 p-4 border-2 border-gray-300 rounded-lg hover:bg-white cursor-pointer">
                <input
                  type="radio"
                  name="relationshipType"
                  value="marriage"
                  checked={relationshipType === 'marriage'}
                  onChange={(e) => {
                    updateField('relationshipType', e.target.value);
                    updateField('bloodRelationship', '');
                    updateField('adoptionRelationship', '');
                  }}
                  className="h-4 w-4 text-blue-600"
                />
                <span className="text-sm font-medium text-gray-900">Related through marriage</span>
              </label>
            </div>

            {/* Q8a: Blood Relationship */}
            {relationshipType === 'blood' && (
              <div className="mt-4 space-y-4 p-4 bg-white border border-gray-300 rounded-lg">
                <p className="text-sm font-medium text-gray-900">
                  What is your blood relationship?
                </p>

                <p className="text-xs text-gray-600">
                  <strong>Why we ask this:</strong> State marriage laws have different requirements for blood relatives.
                </p>

                <div className="space-y-3">
                  <label className="flex items-start space-x-3 p-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      name="bloodRelationship"
                      value="first-cousins"
                      checked={bloodRelationship === 'first-cousins'}
                      onChange={(e) => updateField('bloodRelationship', e.target.value)}
                      className="h-4 w-4 text-blue-600 mt-0.5"
                    />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-900 block">First cousins</span>
                      <span className="text-xs text-gray-600 italic">You and your fiancé(e) share the same grandparents. Your parents are siblings.</span>
                    </div>
                  </label>

                  <label className="flex items-start space-x-3 p-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      name="bloodRelationship"
                      value="first-cousins-once-removed"
                      checked={bloodRelationship === 'first-cousins-once-removed'}
                      onChange={(e) => updateField('bloodRelationship', e.target.value)}
                      className="h-4 w-4 text-blue-600 mt-0.5"
                    />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-900 block">First cousins once removed</span>
                      <span className="text-xs text-gray-600 italic">You and your fiancé(e) are one generation apart: either your fiancé(e) is your parent's first cousin, or your fiancé(e) is your first cousin's child.</span>
                    </div>
                  </label>

                  <label className="flex items-start space-x-3 p-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      name="bloodRelationship"
                      value="second-cousins-or-more"
                      checked={bloodRelationship === 'second-cousins-or-more'}
                      onChange={(e) => updateField('bloodRelationship', e.target.value)}
                      className="h-4 w-4 text-blue-600 mt-0.5"
                    />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-900 block">Second cousins or more distant</span>
                      <span className="text-xs text-gray-600 italic">You and your fiancé(e) share the same great-grandparents (or more distant ancestors). Your grandparents are siblings.</span>
                    </div>
                  </label>

                  <label className="flex items-start space-x-3 p-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      name="bloodRelationship"
                      value="aunt-uncle-niece-nephew"
                      checked={bloodRelationship === 'aunt-uncle-niece-nephew'}
                      onChange={(e) => updateField('bloodRelationship', e.target.value)}
                      className="h-4 w-4 text-blue-600 mt-0.5"
                    />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-900 block">Aunt/Uncle and Niece/Nephew</span>
                      <span className="text-xs text-gray-600 italic">One of you is the parent's sibling of the other.</span>
                    </div>
                  </label>

                  <label className="flex items-start space-x-3 p-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      name="bloodRelationship"
                      value="closer-than-first-cousins"
                      checked={bloodRelationship === 'closer-than-first-cousins'}
                      onChange={(e) => updateField('bloodRelationship', e.target.value)}
                      className="h-4 w-4 text-blue-600 mt-0.5"
                    />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-900 block">Closer than first cousins</span>
                      <span className="text-xs text-gray-600 italic">You and your fiancé(e) are siblings, half-siblings, parent/child, or grandparent/grandchild.</span>
                    </div>
                  </label>
                </div>

                {/* Inline Warning - Siblings or closer */}
                {(bloodRelationship === 'closer-than-first-cousins' || bloodRelationship === 'aunt-uncle-niece-nephew') && (
                  <div className="mt-3 p-5 bg-red-50 border-l-4 border-red-500 rounded-lg">
                    <p className="text-sm font-semibold text-red-900 mb-3">
                      ⚠️ USCIS Requirement Conflict
                    </p>
                    <p className="text-sm text-red-800 mb-3">
                      Marriages between close blood relatives like siblings or aunt/uncle-niece/nephew
                      are prohibited in all 50 U.S. states and aren't recognized under federal immigration law.
                    </p>
                    <p className="text-sm text-red-800">
                      Because of your blood relationship with {beneficiaryName}, USCIS will deny
                      your K-1 petition and {beneficiaryName} cannot obtain a K-1 visa.
                    </p>
                  </div>
                )}

                {/* Green success message when state allows first cousins */}
                {(bloodRelationship === 'first-cousins' || bloodRelationship === 'first-cousins-once-removed') &&
                  marriageState && bloodCheck.allowed && (
                  <div className="mt-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm font-semibold text-green-900">
                      ✅ First cousin marriage is legal in {stateMarriageLaws[marriageState]?.name}. You're all set!
                    </p>
                  </div>
                )}

                {/* Green success message for second cousins or more distant (always allowed) */}
                {bloodRelationship === 'second-cousins-or-more' && (
                  <div className="mt-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm font-semibold text-green-900">
                      ✅ Marriage between second cousins or more distant relatives is legal in all U.S. states. You're all set!
                    </p>
                  </div>
                )}

                {/* Inline Warning - First cousins in state that prohibits it */}
                {(bloodRelationship === 'first-cousins' || bloodRelationship === 'first-cousins-once-removed') &&
                  marriageState && !bloodCheck.allowed && (
                  <div className="mt-3 p-5 bg-red-50 border-l-4 border-red-500 rounded-lg">
                    <p className="text-sm font-semibold text-red-900 mb-3">
                      ⚠️ USCIS Requirement Conflict
                    </p>
                    <p className="text-sm text-red-800 mb-3">
                      Your marriage must be legally valid in the state where you plan to marry.
                      Marriage between first cousins is not permitted in {bloodCheck.stateName}.
                    </p>
                    <p className="text-sm text-red-800">
                      If you marry in {bloodCheck.stateName}, your marriage won't be legally recognized and
                      USCIS will deny your petition. You'd need to marry in a state that allows
                      first cousin marriage.
                    </p>
                  </div>
                )}

                {/* Blue info with embedded state selector when first cousins selected but no state selected yet */}
                {(bloodRelationship === 'first-cousins' || bloodRelationship === 'first-cousins-once-removed') && !marriageState && (
                  <div className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-3">
                    <p className="text-sm font-semibold text-blue-900">
                      First cousin marriage is legal in some U.S. states but not others. Please select your planned marriage state to verify eligibility:
                    </p>

                    <select
                      value={marriageState}
                      onChange={(e) => updateField('marriageState', e.target.value)}
                      className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="">Select a state...</option>
                      {states.map(state => (
                        <option key={state.code} value={state.code}>
                          {state.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}

            {/* Q8b: Adoption Relationship */}
            {relationshipType === 'adoption' && (
              <div className="mt-4 space-y-4 p-4 bg-white border border-gray-300 rounded-lg">
                <p className="text-sm font-medium text-gray-900">
                  What is your relationship?
                </p>

                <div className="space-y-3">
                  <label className="flex items-start space-x-3 p-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      name="adoptionRelationship"
                      value="adopted-siblings"
                      checked={adoptionRelationship === 'adopted-siblings'}
                      onChange={(e) => updateField('adoptionRelationship', e.target.value)}
                      className="h-4 w-4 text-blue-600 mt-0.5"
                    />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-900 block">Legally adopted siblings</span>
                      <span className="text-xs text-gray-600 italic">You and your fiancé(e) were both adopted by the same parent(s), or one of you was adopted by the other's parent(s).</span>
                    </div>
                  </label>

                  <label className="flex items-start space-x-3 p-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      name="adoptionRelationship"
                      value="one-adopted-other"
                      checked={adoptionRelationship === 'one-adopted-other'}
                      onChange={(e) => updateField('adoptionRelationship', e.target.value)}
                      className="h-4 w-4 text-blue-600 mt-0.5"
                    />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-900 block">One of you adopted the other</span>
                      <span className="text-xs text-gray-600 italic">You legally adopted your fiancé(e), or your fiancé(e) legally adopted you.</span>
                    </div>
                  </label>

                  <label className="flex items-start space-x-3 p-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      name="adoptionRelationship"
                      value="other"
                      checked={adoptionRelationship === 'other'}
                      onChange={(e) => updateField('adoptionRelationship', e.target.value)}
                      className="h-4 w-4 text-blue-600 mt-0.5"
                    />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-900 block">None of these describe our relationship</span>
                    </div>
                  </label>
                </div>

                {/* Inline Warning - One adopted the other (parent-child) */}
                {adoptionRelationship === 'one-adopted-other' && (
                  <div className="mt-3 p-5 bg-red-50 border-l-4 border-red-500 rounded-lg">
                    <p className="text-sm font-semibold text-red-900 mb-3">
                      ⚠️ USCIS Requirement Conflict
                    </p>
                    <p className="text-sm text-red-800 mb-3">
                      Marriages between individuals with a legal parent-child relationship aren't
                      permitted under U.S. law, including cases where one person adopted the other.
                    </p>
                    <p className="text-sm text-red-800">
                      Because you have a parent-child relationship with {beneficiaryName},
                      USCIS will deny your K-1 petition and {beneficiaryName} cannot obtain
                      a K-1 visa.
                    </p>
                  </div>
                )}

                {/* Inline Warning - Other/unclear adoption relationship */}
                {adoptionRelationship === 'other' && (
                  <div className="mt-3 p-5 bg-red-50 border-l-4 border-red-500 rounded-lg">
                    <p className="text-sm font-semibold text-red-900 mb-3">
                      ⚠️ Unable to Verify USCIS Requirements
                    </p>
                    <p className="text-sm text-red-800 mb-3">
                      USCIS requires clear documentation of adoption relationships. We need to
                      understand your specific situation to determine if your marriage would be
                      legally recognized.
                    </p>
                    <p className="text-sm text-red-800">
                      Your situation requires personalized guidance to evaluate your K-1 visa
                      eligibility.
                    </p>
                  </div>
                )}

                {/* Green success message when state allows adopted siblings */}
                {adoptionRelationship === 'adopted-siblings' &&
                  marriageState && adoptionCheck.allowed && (
                  <div className="mt-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm font-semibold text-green-900">
                      ✅ Marriage between adopted siblings is legal in {stateMarriageLaws[marriageState]?.name}. You're all set!
                    </p>
                  </div>
                )}

                {/* Inline Warning - Adopted siblings in state that prohibits it */}
                {adoptionRelationship === 'adopted-siblings' &&
                  marriageState && !adoptionCheck.allowed && (
                  <div className="mt-3 p-5 bg-red-50 border-l-4 border-red-500 rounded-lg">
                    <p className="text-sm font-semibold text-red-900 mb-3">
                      ⚠️ USCIS Requirement Conflict
                    </p>
                    <p className="text-sm text-red-800 mb-3">
                      Your marriage must be legally valid in the state where you plan to marry.
                      Marriage between adopted siblings is not permitted in {adoptionCheck.stateName}.
                    </p>
                    <p className="text-sm text-red-800">
                      If you marry in {adoptionCheck.stateName}, your marriage won't be legally recognized and
                      USCIS will deny your petition. You'd need to marry in a state that allows
                      adopted sibling marriage.
                    </p>
                  </div>
                )}

                {/* Blue info with embedded state selector when adopted siblings selected but no state selected yet */}
                {adoptionRelationship === 'adopted-siblings' && !marriageState && (
                  <div className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-3">
                    <p className="text-sm font-semibold text-blue-900">
                      Marriage between adopted siblings is legal in some U.S. states but not others. Please select your planned marriage state to verify eligibility:
                    </p>

                    <select
                      value={marriageState}
                      onChange={(e) => updateField('marriageState', e.target.value)}
                      className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="">Select a state...</option>
                      {states.map(state => (
                        <option key={state.code} value={state.code}>
                          {state.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}

            {/* Q8c: Marriage Relationship */}
            {relationshipType === 'marriage' && (
              <div className="mt-4 space-y-4 p-4 bg-white border border-gray-300 rounded-lg">
                <p className="text-sm font-medium text-gray-900">
                  What is your relationship?
                </p>

                <div className="space-y-3">
                  <label className="flex items-start space-x-3 p-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      name="marriageRelationship"
                      value="step-siblings"
                      checked={marriageRelationship === 'step-siblings'}
                      onChange={(e) => updateField('marriageRelationship', e.target.value)}
                      className="h-4 w-4 text-blue-600 mt-0.5"
                    />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-900 block">Step-siblings</span>
                      <span className="text-xs text-gray-600 italic">Your parent is married to your fiancé(e)'s parent, making you step-siblings. Neither of you was legally adopted.</span>
                    </div>
                  </label>

                  <label className="flex items-start space-x-3 p-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      name="marriageRelationship"
                      value="other"
                      checked={marriageRelationship === 'other'}
                      onChange={(e) => updateField('marriageRelationship', e.target.value)}
                      className="h-4 w-4 text-blue-600 mt-0.5"
                    />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-900 block">Other</span>
                      <span className="text-xs text-gray-600 italic">Step-aunt/uncle, step-niece/nephew, or other marriage-based relationship</span>
                    </div>
                  </label>
                </div>

                {/* Green success message when state allows step-siblings */}
                {marriageRelationship === 'step-siblings' &&
                  marriageState && marriageCheck.allowed && (
                  <div className="mt-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm font-semibold text-green-900">
                      ✅ Marriage between step-siblings is legal in {stateMarriageLaws[marriageState]?.name}. You're all set!
                    </p>
                  </div>
                )}

                {/* Inline Warning - Step-siblings in Virginia (prohibited) */}
                {marriageRelationship === 'step-siblings' &&
                  marriageState && !marriageCheck.allowed && (
                  <div className="mt-3 p-5 bg-red-50 border-l-4 border-red-500 rounded-lg">
                    <p className="text-sm font-semibold text-red-900 mb-3">
                      ⚠️ USCIS Requirement Conflict
                    </p>
                    <p className="text-sm text-red-800 mb-3">
                      Your marriage must be legally valid in the state where you plan to marry.
                      Marriage between step-siblings is not permitted in {marriageCheck.stateName}.
                    </p>
                    <p className="text-sm text-red-800">
                      If you marry in {marriageCheck.stateName}, your marriage won't be legally recognized and
                      USCIS will deny your petition. You'd need to marry in a state that allows
                      step-sibling marriage.
                    </p>
                  </div>
                )}

                {/* Blue info with embedded state selector when step-siblings selected but no state selected yet */}
                {marriageRelationship === 'step-siblings' && !marriageState && (
                  <div className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-3">
                    <p className="text-sm font-semibold text-blue-900">
                      Marriage between step-siblings is legal in most U.S. states but not all. Please select your planned marriage state to verify eligibility:
                    </p>

                    <select
                      value={marriageState}
                      onChange={(e) => updateField('marriageState', e.target.value)}
                      className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="">Select a state...</option>
                      {states.map(state => (
                        <option key={state.code} value={state.code}>
                          {state.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Inline Warning - Other marriage relationships require review */}
                {marriageRelationship === 'other' && (
                  <div className="mt-3 p-5 bg-red-50 border-l-4 border-red-500 rounded-lg">
                    <p className="text-sm font-semibold text-red-900 mb-3">
                      ⚠️ Complex Relationship - Expert Review Required
                    </p>
                    <p className="text-sm text-red-800 mb-3">
                      Your relationship involves marriage-based family connections that require careful legal review. State laws vary on these types of relationships, and we need to verify that your marriage will be legally recognized.
                    </p>
                    <p className="text-sm text-red-800">
                      Your situation requires personalized guidance to evaluate your K-1 visa eligibility.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </ScreenLayout>
  );
};

export default RelationshipScreen;
