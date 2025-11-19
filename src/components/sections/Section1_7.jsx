import React, { useState, useEffect } from 'react';
import { Info, Plus, Trash2, AlertCircle, CheckCircle } from 'lucide-react';

const Section1_7 = ({ currentData = {}, updateField }) => {
  // PART A: Previous I-129F Petitions
  const [hasPreviousPetitions, setHasPreviousPetitions] = useState(
    currentData.hasPreviousPetitions || null
  );
  const [petitionsCount, setPetitionsCount] = useState(
    currentData.petitionsCount || '0'
  );
  const [previousPetitions, setPreviousPetitions] = useState(
    currentData.previousPetitions || []
  );

  // PART B: Other Ongoing Financial Obligations
  const [hasOtherObligations, setHasOtherObligations] = useState(
    currentData.hasOtherObligations || null
  );
  const [otherObligationsCount, setOtherObligationsCount] = useState(
    currentData.otherObligationsCount || 0
  );
  const [otherObligations, setOtherObligations] = useState(
    currentData.otherObligations || []
  );

  // PART C: Children Under 18
  const [hasChildrenUnder18, setHasChildrenUnder18] = useState(
    currentData.hasChildrenUnder18 || null
  );
  const [childrenCount, setChildrenCount] = useState(
    currentData.childrenCount || 0
  );
  const [childrenLivingStatus, setChildrenLivingStatus] = useState(
    currentData.childrenLivingStatus || null
  );
  const [childrenLivingWithSponsor, setChildrenLivingWithSponsor] = useState(
    currentData.childrenLivingWithSponsor || 0
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

  // Calculate household size
  const calculateHouseholdData = () => {
    const sponsorCount = 1;
    const fianeeCount = 1;

    // Count active I-134 obligations from Part A
    const activeI134Count = previousPetitions.filter(p =>
      p.uscisAction === 'Approved' && p.filedI134 === 'yes'
    ).length;

    // Count other obligations from Part B
    const otherObligCount = otherObligations.length;

    // Count children living with sponsor from Part C
    const childrenLivingCount = childrenLivingWithSponsor || 0;

    // Count other dependents from Part C
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
  };

  const householdData = calculateHouseholdData();

  // Update parent whenever data changes
  useEffect(() => {
    const dataToSave = {
      hasPreviousPetitions,
      petitionsCount,
      previousPetitions,
      hasOtherObligations,
      otherObligationsCount,
      otherObligations,
      hasChildrenUnder18,
      childrenCount,
      childrenLivingStatus,
      childrenLivingWithSponsor,
      childrenDetails,
      otherDependentsCount,
      otherDependents,
      householdSize: householdData.householdSize,
      minimumRequiredIncome: householdData.minimumRequiredIncome
    };

    Object.keys(dataToSave).forEach(key => {
      updateField(key, dataToSave[key]);
    });
  }, [
    hasPreviousPetitions, petitionsCount, previousPetitions,
    hasOtherObligations, otherObligationsCount, otherObligations,
    hasChildrenUnder18, childrenCount, childrenLivingStatus,
    childrenLivingWithSponsor, childrenDetails,
    otherDependentsCount, otherDependents
  ]);

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

  // Initialize arrays when counts change
  useEffect(() => {
    const count = petitionsCount === '2+' ? Math.max(previousPetitions.length, 2) : parseInt(petitionsCount) || 0;

    if (count > previousPetitions.length) {
      const newPetitions = Array(count - previousPetitions.length).fill(null).map(() => ({
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
      }));
      setPreviousPetitions([...previousPetitions, ...newPetitions]);
    } else if (count < previousPetitions.length && petitionsCount !== '2+') {
      setPreviousPetitions(previousPetitions.slice(0, count));
    }
  }, [petitionsCount]);

  useEffect(() => {
    if (otherObligationsCount > otherObligations.length) {
      const newObs = Array(otherObligationsCount - otherObligations.length).fill(null).map(() => ({
        formType: '',
        firstName: '',
        middleName: '',
        lastName: '',
        dateOfFiling: '',
        relationship: '',
        relationshipOther: '',
        receiptNumber: ''
      }));
      setOtherObligations([...otherObligations, ...newObs]);
    } else if (otherObligationsCount < otherObligations.length) {
      setOtherObligations(otherObligations.slice(0, otherObligationsCount));
    }
  }, [otherObligationsCount]);

  useEffect(() => {
    if (childrenLivingWithSponsor > childrenDetails.length) {
      const newChildren = Array(childrenLivingWithSponsor - childrenDetails.length).fill(null).map(() => ({
        firstName: '',
        middleName: '',
        lastName: '',
        dateOfBirth: '',
        aNumber: ''
      }));
      setChildrenDetails([...childrenDetails, ...newChildren]);
    } else if (childrenLivingWithSponsor < childrenDetails.length) {
      setChildrenDetails(childrenDetails.slice(0, childrenLivingWithSponsor));
    }
  }, [childrenLivingWithSponsor]);

  useEffect(() => {
    if (otherDependentsCount > otherDependents.length) {
      const newDeps = Array(otherDependentsCount - otherDependents.length).fill(null).map(() => ({
        firstName: '',
        middleName: '',
        lastName: '',
        dateOfBirth: '',
        relationship: '',
        relationshipOther: '',
        aNumber: '',
        receiptNumber: ''
      }));
      setOtherDependents([...otherDependents, ...newDeps]);
    } else if (otherDependentsCount < otherDependents.length) {
      setOtherDependents(otherDependents.slice(0, otherDependentsCount));
    }
  }, [otherDependentsCount]);

  // Helper functions
  const updatePetition = (index, field, value) => {
    const updated = [...previousPetitions];
    updated[index][field] = value;
    setPreviousPetitions(updated);
  };

  const addPetition = () => {
    setPreviousPetitions([...previousPetitions, {
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
  };

  const removePetition = (index) => {
    setPreviousPetitions(previousPetitions.filter((_, i) => i !== index));
  };

  const updateOtherObligation = (index, field, value) => {
    const updated = [...otherObligations];
    updated[index][field] = value;
    setOtherObligations(updated);
  };

  const addOtherObligation = () => {
    setOtherObligations([...otherObligations, {
      formType: '',
      firstName: '',
      middleName: '',
      lastName: '',
      dateOfFiling: '',
      relationship: '',
      relationshipOther: '',
      receiptNumber: ''
    }]);
    setOtherObligationsCount(otherObligations.length + 1);
  };

  const updateChild = (index, field, value) => {
    const updated = [...childrenDetails];
    updated[index][field] = value;
    setChildrenDetails(updated);
  };

  const updateOtherDependent = (index, field, value) => {
    const updated = [...otherDependents];
    updated[index][field] = value;
    setOtherDependents(updated);
  };

  const addOtherDependent = () => {
    setOtherDependents([...otherDependents, {
      firstName: '',
      middleName: '',
      lastName: '',
      dateOfBirth: '',
      relationship: '',
      relationshipOther: '',
      aNumber: '',
      receiptNumber: ''
    }]);
    setOtherDependentsCount(otherDependents.length + 1);
  };

  // Get excluded names for Part B
  const getExcludedNames = () => {
    return previousPetitions
      .filter(p => p.beneficiaryFirstName && p.beneficiaryLastName)
      .map((p, idx) => `${p.beneficiaryFirstName} ${p.beneficiaryLastName} (Petition #${idx + 1})`)
      .join(', ');
  };

  // Disqualification component for IMBRA waiver
  const DisqualificationMessage = () => (
    <div className="mt-4 p-6 bg-red-50 border-l-4 border-red-400 rounded">
      <div className="flex items-start">
        <AlertCircle className="w-6 h-6 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-base font-semibold text-red-800 mb-2">
            Your situation requires individual review
          </p>
          <p className="text-sm text-red-700 mb-4">
            Based on your answer, you require an IMBRA multiple filer waiver. This is a complex situation that requires personalized guidance. Please contact our customer service team to discuss your options.
          </p>
          <button
            type="button"
            onClick={() => window.location.href = 'mailto:support@example.com?subject=K-1 Visa Application - IMBRA Multiple Filer Waiver'}
            className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded transition-colors"
          >
            Contact Customer Service
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Introduction */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Previous Petitions & Financial Obligations
        </h3>
        <p className="text-sm text-gray-700">
          We need to understand your previous immigration petitions and current financial obligations to determine
          the minimum income you'll need to sponsor {fianceName}. This helps ensure you can financially support both {fiancePronoun} and
          anyone else depending on your income.
        </p>
      </div>

      {/* PART A: Previous I-129F Petitions */}
      <div className="space-y-4">
        <h4 className="text-base font-semibold text-gray-900">
          Part A: Previous I-129F Petitions
        </h4>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-sm font-semibold text-gray-900 mb-2">
            Have you ever filed Form I-129F (Petition for Alien Fiancé(e)) for any other beneficiary?
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

            {petitionsCount === '2+' && <DisqualificationMessage />}
          </div>
        )}

        {/* Previous Petitions Details */}
        {hasPreviousPetitions === 'yes' && previousPetitions.length > 0 && petitionsCount !== '2+' && (
          <div className="ml-6 space-y-6 mt-6">
            {previousPetitions.map((petition, index) => (
              <div key={index} className="border-2 border-gray-300 rounded-lg p-6 space-y-4 bg-white">
                <div className="flex justify-between items-center border-b pb-3">
                  <h5 className="text-base font-semibold text-gray-900">Previous Petition #{index + 1}</h5>
                  {petitionsCount === '3+' && previousPetitions.length > 3 && (
                    <button
                      onClick={() => removePetition(index)}
                      className="text-red-600 hover:text-red-700 text-sm flex items-center gap-1"
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </button>
                  )}
                </div>

                {/* Beneficiary Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Beneficiary's full legal name for this petition:
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">First Name (Given Name) *</label>
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
                      <label className="block text-xs text-gray-600 mb-1">Last Name (Family Name) *</label>
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
                  <p className="text-xs text-gray-600 mb-2">
                    Format: 7, 8, or 9 digits. May be written with an "A" prefix (A12345678) or with dashes (123-456-789). Leave blank if they were never assigned one.
                  </p>
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
                </div>

                {/* Date of Filing */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    When did you file this Form I-129F petition? *
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    What action did USCIS take on this petition? *
                  </label>
                  <select
                    value={petition.uscisAction}
                    onChange={(e) => {
                      updatePetition(index, 'uscisAction', e.target.value);
                      if (e.target.value !== 'Approved') {
                        updatePetition(index, 'filedI134', null);
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900 mb-2">
                        Do you currently have an active Form I-134 filed for {petition.beneficiaryFirstName || 'this beneficiary'}?
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
                            What is {petition.beneficiaryFirstName ? `${petition.beneficiaryFirstName}'s` : "this beneficiary's"} relationship to you? *
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
                        {petition.relationship === 'current-spouse' && (
                          <div className="bg-red-50 border-2 border-red-400 rounded-lg p-4">
                            <div className="flex gap-3">
                              <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0" />
                              <div>
                                <p className="text-sm font-semibold text-red-900 mb-2">⚠️ Your situation requires individual review</p>
                                <p className="text-sm text-red-800 mb-3">
                                  If you previously sponsored {petition.beneficiaryFirstName || 'someone'} on a K-1 visa and are now married to {petition.beneficiaryFirstName ? 'them' : 'that person'}, you would typically file
                                  Form I-485 (Adjustment of Status) and Form I-864 (Affidavit of Support), not another K-1 petition.
                                </p>
                                <p className="text-sm text-red-800 mb-3">
                                  If you're trying to sponsor a different person while currently married, K-1 visas are only for unmarried
                                  U.S. citizens sponsoring their fiancé(e). You may need a different visa category.
                                </p>
                                <p className="text-sm font-medium text-red-900">
                                  Please contact our support team for personalized guidance on your situation.
                                </p>
                                <p className="text-xs text-red-700 mt-2 italic">
                                  Note: You can continue filling out this questionnaire, but we recommend getting professional review before submitting.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Date of Birth */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            What is {petition.beneficiaryFirstName ? `${petition.beneficiaryFirstName}'s` : "this beneficiary's"} date of birth? *
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
                          <div className="bg-gray-50 border border-gray-200 rounded p-3 mb-2 space-y-2">
                            <p className="text-xs text-gray-700">
                              <strong>What is this?</strong>
                            </p>
                            <p className="text-xs text-gray-700">
                              A unique 13-character identifier assigned when USCIS receives your form.
                            </p>
                            <p className="text-xs text-gray-700">
                              <strong>Format:</strong>
                            </p>
                            <ul className="text-xs text-gray-700 ml-4 list-disc space-y-1">
                              <li>3 letters (MSC, EAC, WAC, LIN, SRC, NBC, TSC, VSC, or CSC) + 10 numbers<br/><span className="italic">Example: MSC2190123456</span></li>
                            </ul>
                            <p className="text-xs text-gray-700 ml-4 font-medium my-1">OR</p>
                            <ul className="text-xs text-gray-700 ml-4 list-disc space-y-1">
                              <li>IOE + 13 digits<br/><span className="italic">Example: IOE1234567890123</span></li>
                            </ul>
                            <p className="text-xs text-gray-700">
                              <strong>Where to find it:</strong>
                            </p>
                            <ul className="text-xs text-gray-700 ml-4 list-disc">
                              <li>I-797 Notice of Action</li>
                              <li>Your USCIS online account</li>
                              <li>Email or text notifications from USCIS</li>
                            </ul>
                            <p className="text-xs text-gray-600 italic">
                              Leave blank if you don't have it available.
                            </p>
                          </div>
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
        {hasPreviousPetitions === 'yes' && petitionsCount === '1' && needsIMBRAWaiver && (
          <div className="ml-6 mt-4">
            <DisqualificationMessage />
          </div>
        )}
      </div>

      {/* PART B: Other Ongoing Financial Obligations */}
      <div className={`space-y-4 border-t pt-8 ${needsIMBRAWaiver ? 'opacity-50 pointer-events-none' : ''}`}>
        <h4 className="text-base font-semibold text-gray-900">
          Part B: Other Ongoing Financial Obligations
        </h4>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
          <p className="text-sm font-semibold text-gray-900">
            Have you previously sponsored anyone ELSE using an immigration form where you're still financially responsible?
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
          <div className="ml-6 space-y-4 mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <label className="block text-sm font-medium text-gray-900">
              How many people are you still financially obligated to support (not including anyone listed above)?
            </label>
            <input
              type="number"
              min="1"
              value={otherObligationsCount}
              onChange={(e) => setOtherObligationsCount(parseInt(e.target.value) || 0)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter number..."
            />
          </div>
        )}

        {hasOtherObligations === 'yes' && otherObligations.length > 0 && (
          <div className="ml-6 space-y-6 mt-6">
            {otherObligations.map((obligation, index) => (
              <div key={index} className="border-2 border-gray-300 rounded-lg p-6 space-y-4 bg-white">
                <h5 className="text-base font-semibold text-gray-900 border-b pb-3">Individual #{index + 1}</h5>

                {/* Form Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Which form did you file? *
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
                      <label className="block text-xs text-gray-600 mb-1">First Name *</label>
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
                      <label className="block text-xs text-gray-600 mb-1">Last Name *</label>
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
                    When did you file this form? *
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
                    What is their relationship to you? *
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
                  <div className="bg-gray-50 border border-gray-200 rounded p-3 mb-2 space-y-2">
                    <p className="text-xs text-gray-700">
                      <strong>What is this?</strong>
                    </p>
                    <p className="text-xs text-gray-700">
                      A unique 13-character identifier assigned when USCIS receives your form.
                    </p>
                    <p className="text-xs text-gray-700">
                      <strong>Format:</strong>
                    </p>
                    <ul className="text-xs text-gray-700 ml-4 list-disc space-y-1">
                      <li>3 letters (MSC, EAC, WAC, LIN, SRC, NBC, TSC, VSC, or CSC) + 10 numbers<br/><span className="italic">Example: MSC2190123456</span></li>
                    </ul>
                    <p className="text-xs text-gray-700 ml-4 font-medium my-1">OR</p>
                    <ul className="text-xs text-gray-700 ml-4 list-disc space-y-1">
                      <li>IOE + 13 digits<br/><span className="italic">Example: IOE1234567890123</span></li>
                    </ul>
                    <p className="text-xs text-gray-700">
                      <strong>Where to find it:</strong>
                    </p>
                    <ul className="text-xs text-gray-700 ml-4 list-disc">
                      <li>I-797 Notice of Action</li>
                      <li>Your USCIS online account</li>
                      <li>Email or text notifications from USCIS</li>
                    </ul>
                    <p className="text-xs text-gray-600 italic">
                      Leave blank if you don't have it available.
                    </p>
                  </div>
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
                </div>
              </div>
            ))}

            <button
              onClick={addOtherObligation}
              className="w-full px-4 py-3 bg-blue-50 text-blue-700 border-2 border-blue-300 rounded-lg hover:bg-blue-100 font-medium flex items-center justify-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Add Another Individual
            </button>
          </div>
        )}
      </div>

      {/* PART C: Children Under 18 & Other Household Members */}
      <div className={`space-y-4 border-t pt-8 ${needsIMBRAWaiver ? 'opacity-50 pointer-events-none' : ''}`}>
        <h4 className="text-base font-semibold text-gray-900">
          Part C: Children Under 18 & Other Household Members
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
                    setChildrenLivingStatus(null);
                    setChildrenLivingWithSponsor(0);
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
                  How many children under 18 do you have?
                </p>
              </div>

              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {[1, 2, 3, 4, 5].map(num => (
                  <label key={num} className="flex items-center justify-center p-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      name="childrenCount"
                      value={num}
                      checked={childrenCount === num}
                      onChange={() => setChildrenCount(num)}
                      className="sr-only"
                    />
                    <span className={`text-sm font-medium ${childrenCount === num ? 'text-blue-600' : 'text-gray-900'}`}>
                      {num === 5 ? '5+' : num}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {childrenCount > 0 && (
              <>
                <div className="ml-6 space-y-4 mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <p className="text-sm font-medium text-gray-900">
                    Do any of the children under 18 meet the criteria below?
                  </p>
                  <ul className="text-sm text-gray-700 ml-6 list-disc space-y-2 mt-3 mb-3">
                    <li>You claimed them as a dependent on your most recent Federal income tax return, OR</li>
                    <li>They have lived with you for at least the past 6 months</li>
                  </ul>
                  <p className="text-xs text-gray-600 mb-3 italic">
                    💡 Note: If you did not file a Federal income tax return, select "No, none of them."
                  </p>
                  <div className="space-y-2 mt-4">
                    {['all', 'some', 'none'].map(option => (
                      <label key={option} className="flex items-center space-x-3 p-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="radio"
                          name="childrenLivingStatus"
                          value={option}
                          checked={childrenLivingStatus === option}
                          onChange={(e) => {
                            setChildrenLivingStatus(e.target.value);
                            if (e.target.value === 'all') {
                              setChildrenLivingWithSponsor(childrenCount);
                            } else if (e.target.value === 'none') {
                              setChildrenLivingWithSponsor(0);
                              setChildrenDetails([]);
                            }
                          }}
                          className="h-4 w-4 text-blue-600"
                        />
                        <span className="text-sm text-gray-900">
                          {option === 'all' ? 'Yes, all of them' :
                           option === 'some' ? 'Yes, some of them' :
                           'No, none of them'}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {childrenLivingStatus === 'some' && (
                  <div className="ml-6 space-y-4 mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <label className="block text-sm font-medium text-gray-900">
                      How many of your children under 18 did you claim as dependents?
                    </label>
                    <input
                      type="number"
                      min="1"
                      max={childrenCount}
                      value={childrenLivingWithSponsor}
                      onChange={(e) => setChildrenLivingWithSponsor(Math.min(parseInt(e.target.value) || 0, childrenCount))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter number..."
                    />
                  </div>
                )}

                {childrenLivingWithSponsor > 0 && (
                  <div className="ml-6 space-y-4 mt-6">
                    <p className="text-sm font-medium text-gray-900">
                      Please provide details for each child you claimed as a dependent:
                    </p>
                    <p className="text-xs text-gray-700">
                      We need complete information for household size calculation (required for Form I-134).
                    </p>

                    {childrenDetails.map((child, index) => (
                      <div key={index} className="border-2 border-gray-300 rounded-lg p-6 space-y-4 bg-white">
                        <h5 className="text-base font-semibold text-gray-900 border-b pb-3">Child #{index + 1}</h5>

                        {/* Name */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Full legal name:</label>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">First Name *</label>
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
                              <label className="block text-xs text-gray-600 mb-1">Last Name *</label>
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
                            Date of Birth *
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
                          <p className="text-xs text-gray-600 mb-2">
                            Leave blank if your child doesn't have one.
                          </p>
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
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* Other Dependents */}
        <div className="mt-8 space-y-4">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-sm font-semibold text-gray-900 mb-2">
              How many dependents did you claim on your most recent Federal income tax return?
            </p>
            <p className="text-xs text-gray-600 mb-3 italic">
              If you did not file a Federal income tax return, select "0" (None).
            </p>
            <div className="bg-yellow-50 border border-yellow-300 rounded p-3 mb-3">
              <p className="text-xs text-yellow-900 font-medium mb-1">⚠️ Do NOT include:</p>
              <ul className="text-xs text-yellow-900 space-y-1 ml-4 list-disc">
                <li>Yourself</li>
                <li>{fianceName}</li>
                <li>Anyone from "Previous Petitions" (Part A) above</li>
                <li>Children you already listed in Part C above</li>
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
              <label key={num} className="flex items-center justify-center p-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="otherDependentsCount"
                  value={num}
                  checked={otherDependentsCount === num}
                  onChange={() => setOtherDependentsCount(num)}
                  className="sr-only"
                />
                <span className={`text-sm font-medium ${otherDependentsCount === num ? 'text-blue-600' : 'text-gray-900'}`}>
                  {num === 0 ? 'None' : num === 5 ? '5+' : num}
                </span>
              </label>
            ))}
          </div>
        </div>

        {otherDependentsCount > 0 && (
          <div className="ml-6 space-y-6 mt-6">
            {otherDependents.map((dependent, index) => (
              <div key={index} className="border-2 border-gray-300 rounded-lg p-6 space-y-4 bg-white">
                <h5 className="text-base font-semibold text-gray-900 border-b pb-3">Person #{index + 1}</h5>

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full legal name:</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">First Name *</label>
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
                      <label className="block text-xs text-gray-600 mb-1">Last Name *</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Relationship to you *</label>
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
                    placeholder="MSC2190123456"
                    maxLength="13"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 uppercase"
                  />
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
                <li>• Active I-134 obligations (from Part A): <strong>{householdData.breakdown.activeI134} {householdData.breakdown.activeI134 === 1 ? 'person' : 'people'}</strong></li>
                <li>• Other financial obligations (from Part B): <strong>{householdData.breakdown.otherObligations} {householdData.breakdown.otherObligations === 1 ? 'person' : 'people'}</strong></li>
                <li>• Children under 18 living with you: <strong>{householdData.breakdown.childrenLiving} {householdData.breakdown.childrenLiving === 1 ? 'child' : 'children'}</strong></li>
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
  );
};

export default Section1_7;
