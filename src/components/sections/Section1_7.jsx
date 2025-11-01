import React, { useState, useEffect } from 'react';
import { Info, Plus, Trash2, AlertCircle, CheckCircle } from 'lucide-react';

const Section1_7 = ({ currentData = {}, updateField }) => {
  // State for previous sponsorships
  const [hasPreviousSponsorships, setHasPreviousSponsorships] = useState(
    currentData.hasPreviousSponsorships || null
  );
  const [previousSponsorshipsCount, setPreviousSponsorshipsCount] = useState(
    currentData.previousSponsorshipsCount || 0
  );
  const [previousSponsorshipsCountCustom, setPreviousSponsorshipsCountCustom] = useState(
    currentData.previousSponsorshipsCountCustom || ''
  );
  const [previouslySponsoredIndividuals, setPreviouslySponsoredIndividuals] = useState(
    currentData.previouslySponsoredIndividuals || []
  );

  // State for household members
  const [householdMembersCount, setHouseholdMembersCount] = useState(
    currentData.householdMembersCount || 0
  );
  const [householdMembersCountCustom, setHouseholdMembersCountCustom] = useState(
    currentData.householdMembersCountCustom || ''
  );
  const [householdMembers, setHouseholdMembers] = useState(
    currentData.householdMembers || []
  );

  // Get fiancé name from data (fallback to generic terms)
  const fianceName = currentData.beneficiaryFirstName || 'your fiancé(e)';
  const fianePronoun = currentData.beneficiaryGender === 'male' ? 'him' :
                       currentData.beneficiaryGender === 'female' ? 'her' : 'them';

  // State for duplicate detection
  const [duplicateAcknowledgments, setDuplicateAcknowledgments] = useState(
    currentData.duplicateAcknowledgments || {}
  );

  // 2025 Poverty Guidelines (100% - for I-134)
  // Source: HHS Federal Poverty Guidelines effective January 15, 2025
  const povertyGuidelines2025 = {
    1: 15650,
    2: 21150,
    3: 26650,
    4: 32150,
    5: 37650,
    6: 43150,
    7: 48650,
    8: 54150
  };

  const getPovertyGuideline = (size) => {
    if (size <= 8) {
      return povertyGuidelines2025[size];
    }
    // For each person over 8, add $5,500
    return povertyGuidelines2025[8] + ((size - 8) * 5500);
  };

  // Calculate household size and minimum income
  const calculateHouseholdData = () => {
    const sponsorCount = 1; // User
    const fianeeCount = 1; // Fiancé(e)

    const prevSponsorships = previousSponsorshipsCount === 5
      ? parseInt(previousSponsorshipsCountCustom) || 5
      : previousSponsorshipsCount;

    const householdCount = householdMembersCount === 5
      ? parseInt(householdMembersCountCustom) || 5
      : householdMembersCount;

    const totalHouseholdSize = sponsorCount + fianeeCount + prevSponsorships + householdCount;
    const minimumIncome = getPovertyGuideline(totalHouseholdSize);

    return {
      householdSize: totalHouseholdSize,
      minimumRequiredIncome: minimumIncome,
      breakdown: {
        sponsor: sponsorCount,
        fiance: fianeeCount,
        previousSponsorships: prevSponsorships,
        householdMembers: householdCount
      }
    };
  };

  const householdData = calculateHouseholdData();

  // Duplicate detection: Compare previously sponsored individuals with household members, sponsor, and beneficiary
  const detectDuplicates = () => {
    const duplicates = [];

    // Get sponsor and beneficiary info from currentData
    const sponsorFirstName = currentData.sponsorFirstName || '';
    const sponsorLastName = currentData.sponsorLastName || '';
    const sponsorDOB = currentData.sponsorDOB || '';
    const beneficiaryFirstName = currentData.beneficiaryFirstName || '';
    const beneficiaryLastName = currentData.beneficiaryLastName || '';
    const beneficiaryDOB = currentData.beneficiaryDOB || '';

    // Helper function to check for duplicates
    const checkDuplicate = (person1Name, person1DOB, person2Name, person2DOB) => {
      if (person1Name && person2Name && person1DOB && person2DOB) {
        return person1Name === person2Name && person1DOB === person2DOB;
      }
      return false;
    };

    // Check previously sponsored vs household members
    previouslySponsoredIndividuals.forEach((sponsored, sponsoredIndex) => {
      householdMembers.forEach((member, memberIndex) => {
        const sponsoredFullName = `${sponsored.firstName} ${sponsored.lastName}`.toLowerCase().trim();
        const memberFullName = `${member.firstName} ${member.lastName}`.toLowerCase().trim();

        if (checkDuplicate(sponsoredFullName, sponsored.dateOfBirth, memberFullName, member.dateOfBirth)) {
          const duplicateKey = `${sponsoredFullName}-${sponsored.dateOfBirth}`;
          duplicates.push({
            key: duplicateKey,
            name: `${sponsored.firstName} ${sponsored.lastName}`,
            dob: sponsored.dateOfBirth,
            type: 'sponsored-vs-household',
            sponsoredIndex,
            memberIndex
          });
        }
      });
    });

    // Check previously sponsored vs sponsor
    const sponsorFullName = `${sponsorFirstName} ${sponsorLastName}`.toLowerCase().trim();
    previouslySponsoredIndividuals.forEach((sponsored, sponsoredIndex) => {
      const sponsoredFullName = `${sponsored.firstName} ${sponsored.lastName}`.toLowerCase().trim();

      if (checkDuplicate(sponsoredFullName, sponsored.dateOfBirth, sponsorFullName, sponsorDOB)) {
        const duplicateKey = `sponsor-${sponsoredFullName}-${sponsored.dateOfBirth}`;
        duplicates.push({
          key: duplicateKey,
          name: `${sponsored.firstName} ${sponsored.lastName}`,
          dob: sponsored.dateOfBirth,
          type: 'sponsored-vs-sponsor',
          sponsoredIndex
        });
      }
    });

    // Check previously sponsored vs beneficiary
    const beneficiaryFullName = `${beneficiaryFirstName} ${beneficiaryLastName}`.toLowerCase().trim();
    previouslySponsoredIndividuals.forEach((sponsored, sponsoredIndex) => {
      const sponsoredFullName = `${sponsored.firstName} ${sponsored.lastName}`.toLowerCase().trim();

      if (checkDuplicate(sponsoredFullName, sponsored.dateOfBirth, beneficiaryFullName, beneficiaryDOB)) {
        const duplicateKey = `beneficiary-${sponsoredFullName}-${sponsored.dateOfBirth}`;
        duplicates.push({
          key: duplicateKey,
          name: `${sponsored.firstName} ${sponsored.lastName}`,
          dob: sponsored.dateOfBirth,
          type: 'sponsored-vs-beneficiary',
          sponsoredIndex
        });
      }
    });

    // Check household members vs sponsor
    householdMembers.forEach((member, memberIndex) => {
      const memberFullName = `${member.firstName} ${member.lastName}`.toLowerCase().trim();

      if (checkDuplicate(memberFullName, member.dateOfBirth, sponsorFullName, sponsorDOB)) {
        const duplicateKey = `sponsor-household-${memberFullName}-${member.dateOfBirth}`;
        duplicates.push({
          key: duplicateKey,
          name: `${member.firstName} ${member.lastName}`,
          dob: member.dateOfBirth,
          type: 'household-vs-sponsor',
          memberIndex
        });
      }
    });

    // Check household members vs beneficiary
    householdMembers.forEach((member, memberIndex) => {
      const memberFullName = `${member.firstName} ${member.lastName}`.toLowerCase().trim();

      if (checkDuplicate(memberFullName, member.dateOfBirth, beneficiaryFullName, beneficiaryDOB)) {
        const duplicateKey = `beneficiary-household-${memberFullName}-${member.dateOfBirth}`;
        duplicates.push({
          key: duplicateKey,
          name: `${member.firstName} ${member.lastName}`,
          dob: member.dateOfBirth,
          type: 'household-vs-beneficiary',
          memberIndex
        });
      }
    });

    return duplicates;
  };

  const duplicates = detectDuplicates();

  // Update parent component whenever data changes
  useEffect(() => {
    const dataToSave = {
      hasPreviousSponsorships,
      previousSponsorshipsCount,
      previousSponsorshipsCountCustom,
      previouslySponsoredIndividuals,
      householdMembersCount,
      householdMembersCountCustom,
      householdMembers,
      householdSize: householdData.householdSize,
      minimumRequiredIncome: householdData.minimumRequiredIncome,
      duplicateAcknowledgments
    };

    Object.keys(dataToSave).forEach(key => {
      updateField(key, dataToSave[key]);
    });
  }, [
    hasPreviousSponsorships,
    previousSponsorshipsCount,
    previousSponsorshipsCountCustom,
    previouslySponsoredIndividuals,
    householdMembersCount,
    householdMembersCountCustom,
    householdMembers,
    duplicateAcknowledgments
  ]);

  // Handle adding/removing previously sponsored individuals
  const addPreviouslySponsoredIndividual = () => {
    setPreviouslySponsoredIndividuals([
      ...previouslySponsoredIndividuals,
      {
        firstName: '',
        middleName: '',
        lastName: '',
        dateOfBirth: '',
        relationship: '',
        relationshipOther: '',
        aNumber: '',
        receiptNumber: ''
      }
    ]);
  };

  const removePreviouslySponsoredIndividual = (index) => {
    setPreviouslySponsoredIndividuals(previouslySponsoredIndividuals.filter((_, i) => i !== index));
  };

  const updatePreviouslySponsoredIndividual = (index, field, value) => {
    const updated = [...previouslySponsoredIndividuals];
    updated[index][field] = value;
    setPreviouslySponsoredIndividuals(updated);
  };

  // Handle adding/removing household members
  const addHouseholdMember = () => {
    setHouseholdMembers([
      ...householdMembers,
      {
        firstName: '',
        middleName: '',
        lastName: '',
        dateOfBirth: '',
        relationship: '',
        relationshipOther: '',
        aNumber: '',
        receiptNumber: ''
      }
    ]);
  };

  const removeHouseholdMember = (index) => {
    setHouseholdMembers(householdMembers.filter((_, i) => i !== index));
  };

  const updateHouseholdMember = (index, field, value) => {
    const updated = [...householdMembers];
    updated[index][field] = value;
    setHouseholdMembers(updated);
  };

  // Initialize previously sponsored individuals array when count changes
  useEffect(() => {
    const count = previousSponsorshipsCount === 5
      ? parseInt(previousSponsorshipsCountCustom) || 5
      : previousSponsorshipsCount;

    if (count > previouslySponsoredIndividuals.length) {
      const newIndividuals = Array(count - previouslySponsoredIndividuals.length).fill(null).map(() => ({
        firstName: '',
        middleName: '',
        lastName: '',
        dateOfBirth: '',
        relationship: '',
        relationshipOther: '',
        aNumber: '',
        receiptNumber: ''
      }));
      setPreviouslySponsoredIndividuals([...previouslySponsoredIndividuals, ...newIndividuals]);
    } else if (count < previouslySponsoredIndividuals.length) {
      setPreviouslySponsoredIndividuals(previouslySponsoredIndividuals.slice(0, count));
    }
  }, [previousSponsorshipsCount, previousSponsorshipsCountCustom]);

  // Initialize household members array when count changes
  useEffect(() => {
    const count = householdMembersCount === 5
      ? parseInt(householdMembersCountCustom) || 5
      : householdMembersCount;

    if (count > householdMembers.length) {
      const newMembers = Array(count - householdMembers.length).fill(null).map(() => ({
        firstName: '',
        middleName: '',
        lastName: '',
        dateOfBirth: '',
        relationship: '',
        relationshipOther: '',
        aNumber: '',
        receiptNumber: ''
      }));
      setHouseholdMembers([...householdMembers, ...newMembers]);
    } else if (count < householdMembers.length) {
      setHouseholdMembers(householdMembers.slice(0, count));
    }
  }, [householdMembersCount, householdMembersCountCustom]);

  return (
    <div className="space-y-8">
      {/* Introduction */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Previous Sponsorship Obligations
        </h3>
        <p className="text-sm text-gray-700">
          We need to understand your current financial obligations to determine the minimum income you'll need to sponsor {fianceName}.
          This helps ensure you can financially support both {fianePronoun} and anyone else depending on your income.
        </p>
      </div>

      {/* Question 1: Previous Sponsorships */}
      <div className="space-y-4">
        <h4 className="text-base font-semibold text-gray-900">
          Have you previously sponsored anyone using an immigration form where you're still financially responsible?
        </h4>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2">
          <p className="text-sm text-gray-700 font-medium">This includes these forms:</p>
          <ul className="text-sm text-gray-700 space-y-1 ml-4 list-disc">
            <li>Form I-134 (Declaration of Financial Support)</li>
            <li>Form I-134A (Online Request to be a Supporter)</li>
            <li>Form I-864 (Affidavit of Support)</li>
            <li>Form I-864EZ (Affidavit of Support - simplified)</li>
            <li>Form I-864A (Contract Between Sponsor and Household Member)</li>
          </ul>
          <p className="text-sm text-gray-700 font-medium mt-3">Your support obligation has ended ONLY if one of these happened:</p>

          <div className="ml-4 mt-2 space-y-3">
            <div className="bg-white border border-gray-300 rounded p-3">
              <p className="text-sm font-semibold text-gray-900 mb-2">For I-134 / I-134A (temporary visas/parole):</p>
              <p className="text-sm text-gray-700">Their temporary status expired (for instance, K-1, K-3, B-2 tourist, F-1 student, humanitarian parole)</p>
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
          <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mt-3">
            <p className="text-sm text-yellow-900">
              <strong>Don't include:</strong> {fianceName} - we'll count {fianePronoun} separately.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <label className="flex items-center space-x-3 p-4 border-2 border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
            <input
              type="radio"
              name="hasPreviousSponsorships"
              value="yes"
              checked={hasPreviousSponsorships === 'yes'}
              onChange={(e) => {
                setHasPreviousSponsorships(e.target.value);
                if (previousSponsorshipsCount === 0) {
                  setPreviousSponsorshipsCount(1);
                }
              }}
              className="h-4 w-4 text-blue-600"
            />
            <span className="text-sm font-medium text-gray-900">Yes, I have active sponsorships</span>
          </label>

          <label className="flex items-center space-x-3 p-4 border-2 border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
            <input
              type="radio"
              name="hasPreviousSponsorships"
              value="no"
              checked={hasPreviousSponsorships === 'no'}
              onChange={(e) => {
                setHasPreviousSponsorships(e.target.value);
                setPreviousSponsorshipsCount(0);
                setPreviousSponsorshipsCountCustom('');
                setPreviouslySponsoredIndividuals([]);
              }}
              className="h-4 w-4 text-blue-600"
            />
            <span className="text-sm font-medium text-gray-900">No, I haven't sponsored anyone before</span>
          </label>
        </div>

        {/* Follow-up: How many sponsorships */}
        {hasPreviousSponsorships === 'yes' && (
          <div className="ml-6 space-y-4 mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <label className="block text-sm font-medium text-gray-900">
              How many people are you currently sponsoring through these forms?
            </label>
            <select
              value={previousSponsorshipsCount}
              onChange={(e) => setPreviousSponsorshipsCount(parseInt(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={0}>Select...</option>
              <option value={1}>1 person</option>
              <option value={2}>2 people</option>
              <option value={3}>3 people</option>
              <option value={4}>4 people</option>
              <option value={5}>5 or more people</option>
            </select>

            {previousSponsorshipsCount === 5 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How many people total?
                </label>
                <input
                  type="number"
                  min="5"
                  max="99"
                  value={previousSponsorshipsCountCustom}
                  onChange={(e) => setPreviousSponsorshipsCountCustom(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter number"
                />
              </div>
            )}
          </div>
        )}

        {/* Follow-up: Previously Sponsored Individual Details */}
        {hasPreviousSponsorships === 'yes' && previousSponsorshipsCount > 0 && (
          <div className="ml-6 space-y-4 mt-6">
            <h5 className="text-sm font-semibold text-gray-900">
              Tell us about each person you're currently sponsoring
            </h5>

            {previouslySponsoredIndividuals.map((individual, index) => (
              <div key={index} className="border border-gray-300 rounded-lg p-4 space-y-4 bg-white">
                <div className="flex justify-between items-center">
                  <h6 className="text-sm font-medium text-gray-900">Sponsored Person {index + 1}</h6>
                  {previouslySponsoredIndividuals.length > 1 && (
                    <button
                      onClick={() => removePreviouslySponsoredIndividual(index)}
                      className="text-red-600 hover:text-red-700 text-sm flex items-center gap-1"
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </button>
                  )}
                </div>

                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={individual.firstName}
                      onChange={(e) => updatePreviouslySponsoredIndividual(index, 'firstName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Middle Name
                    </label>
                    <input
                      type="text"
                      value={individual.middleName}
                      onChange={(e) => updatePreviouslySponsoredIndividual(index, 'middleName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={individual.lastName}
                      onChange={(e) => updatePreviouslySponsoredIndividual(index, 'lastName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={individual.dateOfBirth}
                    onChange={(e) => updatePreviouslySponsoredIndividual(index, 'dateOfBirth', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Relationship */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Relationship to you <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={individual.relationship}
                    onChange={(e) => updatePreviouslySponsoredIndividual(index, 'relationship', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select relationship...</option>
                    <option value="child">Child</option>
                    <option value="ex-spouse">Ex-spouse</option>
                    <option value="grandchild">Grandchild</option>
                    <option value="grandparent">Grandparent</option>
                    <option value="parent">Parent</option>
                    <option value="sibling">Sibling</option>
                    <option value="other-relative">Other relative</option>
                    <option value="non-relative">Non-relative</option>
                  </select>

                  {(individual.relationship === 'other-relative' || individual.relationship === 'non-relative') && (
                    <input
                      type="text"
                      value={individual.relationshipOther}
                      onChange={(e) => updatePreviouslySponsoredIndividual(index, 'relationshipOther', e.target.value)}
                      placeholder="Please describe the relationship"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mt-2"
                    />
                  )}
                </div>

                {/* A-Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    A-Number (if any)
                  </label>
                  <div className="bg-blue-50 border border-blue-200 rounded p-2 mb-2">
                    <p className="text-xs text-blue-900">
                      An A-Number (Alien Registration Number) is 7-9 digits starting with "A". Found on green cards (under "USCIS#"), work permits (EAD), immigrant visa stamps (as "Registration Number"), or USCIS notices (Form I-797).
                      <strong> If this person has one, please include it.</strong>
                    </p>
                  </div>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 py-2 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm rounded-l font-medium">
                      A
                    </span>
                    <input
                      type="text"
                      value={individual.aNumber ? individual.aNumber.replace(/^A0*/, '') : ''}
                      onChange={(e) => {
                        let val = e.target.value.replace(/\D/g, '');
                        if (val.length > 9) val = val.slice(0, 9);

                        if (val) {
                          const paddedVal = val.padStart(9, '0');
                          updatePreviouslySponsoredIndividual(index, 'aNumber', `A${paddedVal}`);
                        } else {
                          updatePreviouslySponsoredIndividual(index, 'aNumber', '');
                        }
                      }}
                      placeholder="12345678 (7-9 digits)"
                      maxLength="9"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-r focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  {individual.aNumber && individual.aNumber.replace(/^A0*/, '').length >= 7 && individual.aNumber.replace(/^A0*/, '').length <= 9 && (
                    <div className="text-sm text-green-600 mt-1">
                      ✅ Valid A-Number format
                    </div>
                  )}
                  {individual.aNumber && (individual.aNumber.replace(/^A0*/, '').length < 7 || individual.aNumber.replace(/^A0*/, '').length > 9) && (
                    <div className="text-sm text-orange-600 mt-1">
                      A-Number should be 7-9 digits
                    </div>
                  )}
                </div>

                {/* Receipt Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Receipt Number (if any)
                  </label>
                  <div className="bg-blue-50 border border-blue-200 rounded p-2 mb-2">
                    <p className="text-xs text-blue-900">
                      13-character USCIS receipt number. Found on Form I-797, in your USCIS online account, or in email/text notifications. Format: 3 letters + 10 numbers (e.g., <strong>EAC2190012345</strong> or <strong>IOE1234567890</strong>).
                      <strong> If they have one, please include it.</strong>
                    </p>
                  </div>
                  <input
                    type="text"
                    value={individual.receiptNumber || ''}
                    onChange={(e) => {
                      let val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
                      if (val.length > 13) val = val.slice(0, 13);
                      updatePreviouslySponsoredIndividual(index, 'receiptNumber', val);
                    }}
                    placeholder="EAC2190012345"
                    maxLength="13"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
                  />
                  {individual.receiptNumber && individual.receiptNumber.length === 13 && /^[A-Z]{3}\d{10}$/.test(individual.receiptNumber) && (
                    <div className="text-sm text-green-600 mt-1">
                      ✅ Valid receipt number format
                    </div>
                  )}
                  {individual.receiptNumber && individual.receiptNumber.length > 0 && !/^[A-Z]{3}\d{10}$/.test(individual.receiptNumber) && (
                    <div className="text-sm text-orange-600 mt-1">
                      Receipt number should be 3 letters + 10 numbers (13 characters total)
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Question 2: Household Members */}
      <div className="space-y-4 border-t pt-8">
        <h4 className="text-base font-semibold text-gray-900">
          Besides yourself and {fianceName}, how many people depend on your income for their financial support?
        </h4>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
          <p className="text-sm text-gray-700">
            Count anyone you support financially - meaning you pay for <strong>more than half of their living expenses</strong> (food, housing, bills, medical care, etc.).
          </p>

          <p className="text-sm text-gray-700">
            This includes anyone who depends on you for support, regardless of their relationship to you or where they live.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded p-3">
            <p className="text-sm text-blue-900">
              <strong>Tip:</strong> If you claimed someone as a dependent on your tax return, they likely meet this test (the IRS uses the same 50% rule).
            </p>
          </div>

          <p className="text-sm text-gray-700 font-medium">Do NOT include:</p>
          <ul className="text-sm text-gray-700 space-y-1 ml-4 list-disc">
            <li><strong>Yourself and {fianceName}</strong> (counted separately)</li>
            <li><strong>Anyone listed in "Previously Sponsored" above</strong> (already counted)</li>
          </ul>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of people you financially support
          </label>
          <select
            value={householdMembersCount}
            onChange={(e) => setHouseholdMembersCount(parseInt(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={0}>None</option>
            <option value={1}>1 person</option>
            <option value={2}>2 people</option>
            <option value={3}>3 people</option>
            <option value={4}>4 people</option>
            <option value={5}>5 or more people</option>
          </select>

          {householdMembersCount === 5 && (
            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                How many people total?
              </label>
              <input
                type="number"
                min="5"
                max="99"
                value={householdMembersCountCustom}
                onChange={(e) => setHouseholdMembersCountCustom(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter number"
              />
            </div>
          )}
        </div>

        {/* Household Member Details */}
        {householdMembersCount > 0 && (
          <div className="space-y-4 mt-6">
            <h5 className="text-sm font-semibold text-gray-900">
              Tell us about each person in your household
            </h5>

            {householdMembers.map((member, index) => (
              <div key={index} className="border border-gray-300 rounded-lg p-4 space-y-4 bg-white">
                <div className="flex justify-between items-center">
                  <h6 className="text-sm font-medium text-gray-900">Person {index + 1}</h6>
                  {householdMembers.length > 1 && (
                    <button
                      onClick={() => removeHouseholdMember(index)}
                      className="text-red-600 hover:text-red-700 text-sm flex items-center gap-1"
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </button>
                  )}
                </div>

                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={member.firstName}
                      onChange={(e) => updateHouseholdMember(index, 'firstName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Middle Name
                    </label>
                    <input
                      type="text"
                      value={member.middleName}
                      onChange={(e) => updateHouseholdMember(index, 'middleName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={member.lastName}
                      onChange={(e) => updateHouseholdMember(index, 'lastName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={member.dateOfBirth}
                    onChange={(e) => updateHouseholdMember(index, 'dateOfBirth', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Relationship */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Relationship to you <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={member.relationship}
                    onChange={(e) => updateHouseholdMember(index, 'relationship', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select relationship...</option>
                    <option value="child">Child</option>
                    <option value="ex-spouse">Ex-spouse</option>
                    <option value="grandchild">Grandchild</option>
                    <option value="grandparent">Grandparent</option>
                    <option value="parent">Parent</option>
                    <option value="sibling">Sibling</option>
                    <option value="other-relative">Other relative</option>
                    <option value="non-relative">Non-relative dependent</option>
                  </select>

                  {(member.relationship === 'other-relative' || member.relationship === 'non-relative') && (
                    <input
                      type="text"
                      value={member.relationshipOther}
                      onChange={(e) => updateHouseholdMember(index, 'relationshipOther', e.target.value)}
                      placeholder="Please describe the relationship"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mt-2"
                    />
                  )}
                </div>

                {/* A-Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    A-Number (if any)
                  </label>
                  <div className="bg-blue-50 border border-blue-200 rounded p-2 mb-2">
                    <p className="text-xs text-blue-900">
                      An A-Number (Alien Registration Number) is 7-9 digits starting with "A". Found on green cards (under "USCIS#"), work permits (EAD), immigrant visa stamps (as "Registration Number"), or USCIS notices (Form I-797).
                      <strong> If this person has one, please include it.</strong>
                    </p>
                  </div>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 py-2 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm rounded-l font-medium">
                      A
                    </span>
                    <input
                      type="text"
                      value={member.aNumber ? member.aNumber.replace(/^A0*/, '') : ''}
                      onChange={(e) => {
                        let val = e.target.value.replace(/\D/g, '');
                        if (val.length > 9) val = val.slice(0, 9);

                        if (val) {
                          const paddedVal = val.padStart(9, '0');
                          updateHouseholdMember(index, 'aNumber', `A${paddedVal}`);
                        } else {
                          updateHouseholdMember(index, 'aNumber', '');
                        }
                      }}
                      placeholder="12345678 (7-9 digits)"
                      maxLength="9"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-r focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  {member.aNumber && member.aNumber.replace(/^A0*/, '').length >= 7 && member.aNumber.replace(/^A0*/, '').length <= 9 && (
                    <div className="text-sm text-green-600 mt-1">
                      ✅ Valid A-Number format
                    </div>
                  )}
                  {member.aNumber && (member.aNumber.replace(/^A0*/, '').length < 7 || member.aNumber.replace(/^A0*/, '').length > 9) && (
                    <div className="text-sm text-orange-600 mt-1">
                      A-Number should be 7-9 digits
                    </div>
                  )}
                </div>

                {/* Receipt Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Receipt Number (if any)
                  </label>
                  <div className="bg-blue-50 border border-blue-200 rounded p-2 mb-2">
                    <p className="text-xs text-blue-900">
                      13-character USCIS receipt number (only if you're sponsoring this person on another immigration form). Found on Form I-797, in your USCIS online account, or in email/text notifications. Format: 3 letters + 10 numbers (e.g., <strong>EAC2190012345</strong>).
                      <strong> If they have one, please include it.</strong>
                    </p>
                  </div>
                  <input
                    type="text"
                    value={member.receiptNumber || ''}
                    onChange={(e) => {
                      let val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
                      if (val.length > 13) val = val.slice(0, 13);
                      updateHouseholdMember(index, 'receiptNumber', val);
                    }}
                    placeholder="EAC2190012345"
                    maxLength="13"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
                  />
                  {member.receiptNumber && member.receiptNumber.length === 13 && /^[A-Z]{3}\d{10}$/.test(member.receiptNumber) && (
                    <div className="text-sm text-green-600 mt-1">
                      ✅ Valid receipt number format
                    </div>
                  )}
                  {member.receiptNumber && member.receiptNumber.length > 0 && !/^[A-Z]{3}\d{10}$/.test(member.receiptNumber) && (
                    <div className="text-sm text-orange-600 mt-1">
                      Receipt number should be 3 letters + 10 numbers (13 characters total)
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Duplicate Detection Warning */}
      {duplicates.length > 0 && (
        <div className="bg-red-50 border-2 border-red-400 rounded-lg p-6 mt-8">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h4 className="text-base font-semibold text-red-900 mb-3">
                ⚠️ Duplicate Person Detected
              </h4>
              <div className="space-y-4">
                {duplicates.map((duplicate) => {
                  // Determine what message to show based on duplicate type
                  let listDescription = '';
                  let warningMessage = '';

                  if (duplicate.type === 'sponsored-vs-household') {
                    listDescription = (
                      <ul className="text-sm text-red-800 mb-3 ml-4 list-disc">
                        <li>Previously Sponsored Individuals (Person #{duplicate.sponsoredIndex + 1})</li>
                        <li>Household Members/Dependents (Person #{duplicate.memberIndex + 1})</li>
                      </ul>
                    );
                    warningMessage = 'The same person should only appear in ONE list. If this person was previously sponsored AND is currently a household member, they should ONLY be counted in "Previously Sponsored" above.';
                  } else if (duplicate.type === 'sponsored-vs-sponsor') {
                    listDescription = (
                      <ul className="text-sm text-red-800 mb-3 ml-4 list-disc">
                        <li>Previously Sponsored Individuals (Person #{duplicate.sponsoredIndex + 1})</li>
                        <li>You (the sponsor)</li>
                      </ul>
                    );
                    warningMessage = 'You should not list yourself in "Previously Sponsored Individuals." This section is only for other people you have sponsored.';
                  } else if (duplicate.type === 'sponsored-vs-beneficiary') {
                    listDescription = (
                      <ul className="text-sm text-red-800 mb-3 ml-4 list-disc">
                        <li>Previously Sponsored Individuals (Person #{duplicate.sponsoredIndex + 1})</li>
                        <li>Your fiancé(e) (beneficiary)</li>
                      </ul>
                    );
                    warningMessage = 'Your fiancé(e) should not be listed in "Previously Sponsored Individuals." They are already counted automatically in the household size.';
                  } else if (duplicate.type === 'household-vs-sponsor') {
                    listDescription = (
                      <ul className="text-sm text-red-800 mb-3 ml-4 list-disc">
                        <li>Household Members/Dependents (Person #{duplicate.memberIndex + 1})</li>
                        <li>You (the sponsor)</li>
                      </ul>
                    );
                    warningMessage = 'You should not list yourself in "Household Members/Dependents." You are already counted automatically in the household size.';
                  } else if (duplicate.type === 'household-vs-beneficiary') {
                    listDescription = (
                      <ul className="text-sm text-red-800 mb-3 ml-4 list-disc">
                        <li>Household Members/Dependents (Person #{duplicate.memberIndex + 1})</li>
                        <li>Your fiancé(e) (beneficiary)</li>
                      </ul>
                    );
                    warningMessage = 'Your fiancé(e) should not be listed in "Household Members/Dependents." They are already counted automatically in the household size.';
                  }

                  return (
                    <div key={duplicate.key} className="bg-white border border-red-300 rounded-lg p-4">
                      <p className="text-sm text-red-900 mb-3">
                        <strong>{duplicate.name}</strong> (DOB: {new Date(duplicate.dob).toLocaleDateString()}) appears in both:
                      </p>
                      {listDescription}

                      <div className="bg-yellow-50 border border-yellow-300 rounded p-3 mb-3">
                        <p className="text-xs text-yellow-900">
                          <strong>Important:</strong> {warningMessage}
                        </p>
                      </div>

                      {!duplicateAcknowledgments[duplicate.key] && (
                        <div className="space-y-3">
                          <p className="text-sm text-gray-700 font-medium">Choose one option:</p>

                          {/* Remove Duplicate Button - shown for cases where we can auto-remove */}
                          {(duplicate.type === 'sponsored-vs-household' ||
                            duplicate.type === 'household-vs-sponsor' ||
                            duplicate.type === 'household-vs-beneficiary' ||
                            duplicate.type === 'sponsored-vs-sponsor' ||
                            duplicate.type === 'sponsored-vs-beneficiary') && (
                            <button
                              type="button"
                              onClick={() => {
                                // Remove from lower-priority list based on type
                                if (duplicate.type === 'sponsored-vs-household') {
                                  // Remove from household members (lower priority)
                                  const newHouseholdMembers = householdMembers.filter((_, i) => i !== duplicate.memberIndex);
                                  setHouseholdMembers(newHouseholdMembers);
                                  // Decrease the count
                                  const newCount = Math.max(0, householdMembersCount - 1);
                                  setHouseholdMembersCount(newCount);
                                } else if (duplicate.type === 'household-vs-sponsor' || duplicate.type === 'household-vs-beneficiary') {
                                  // Remove from household members (this person shouldn't be there at all)
                                  const newHouseholdMembers = householdMembers.filter((_, i) => i !== duplicate.memberIndex);
                                  setHouseholdMembers(newHouseholdMembers);
                                  // Decrease the count
                                  const newCount = Math.max(0, householdMembersCount - 1);
                                  setHouseholdMembersCount(newCount);
                                } else if (duplicate.type === 'sponsored-vs-sponsor' || duplicate.type === 'sponsored-vs-beneficiary') {
                                  // Remove from previously sponsored (this person shouldn't be there at all)
                                  const newPreviouslySponsoredIndividuals = previouslySponsoredIndividuals.filter((_, i) => i !== duplicate.sponsoredIndex);
                                  setPreviouslySponsoredIndividuals(newPreviouslySponsoredIndividuals);
                                  // Decrease the count
                                  const newCount = Math.max(0, previousSponsorshipsCount - 1);
                                  setPreviousSponsorshipsCount(newCount);
                                }
                              }}
                              className="w-full px-4 py-3 bg-red-100 text-red-900 border-2 border-red-400 rounded-lg hover:bg-red-200 transition-colors font-medium text-sm text-left"
                            >
                              Remove duplicate
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => {
                              const updated = {
                                ...duplicateAcknowledgments,
                                [duplicate.key]: true
                              };
                              setDuplicateAcknowledgments(updated);
                              updateField('duplicateAcknowledgments', updated);
                            }}
                            className="w-full px-4 py-3 bg-red-100 text-red-900 border-2 border-red-400 rounded-lg hover:bg-red-200 transition-colors font-medium text-sm text-left"
                          >
                            Keep both - they're different people
                          </button>
                        </div>
                      )}

                      {duplicateAcknowledgments[duplicate.key] && (
                        <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-300 rounded p-3">
                          <CheckCircle className="h-5 w-5" />
                          <span className="text-sm font-medium">Confirmed as separate individuals</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Visual Summary */}
      <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6 mt-8">
        <div className="flex items-start gap-3">
          <Info className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h4 className="text-base font-semibold text-blue-900 mb-4">
              📊 Household Size Summary
            </h4>

            {/* Summary counts */}
            <div className="space-y-2 text-sm text-blue-900 mb-4">
              <p>Based on your answers:</p>
              <ul className="ml-4 space-y-1">
                <li>• You: <strong>1 person</strong></li>
                <li>• {fianceName}: <strong>1 person</strong></li>
                <li>• People you're sponsoring on other forms: <strong>{householdData.breakdown.previousSponsorships} {householdData.breakdown.previousSponsorships === 1 ? 'person' : 'people'}</strong></li>
                <li>• Your household members/dependents: <strong>{householdData.breakdown.householdMembers} {householdData.breakdown.householdMembers === 1 ? 'person' : 'people'}</strong></li>
              </ul>
            </div>

            {/* Detailed Table */}
            {(previouslySponsoredIndividuals.length > 0 || householdMembers.length > 0) && (
              <div className="bg-white border border-blue-300 rounded-lg overflow-hidden mt-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-blue-200">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-blue-900 uppercase">Full Name</th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-blue-900 uppercase">DOB</th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-blue-900 uppercase">Relationship to You</th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-blue-900 uppercase">A-Number</th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-blue-900 uppercase">Receipt Number</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-blue-200">
                      {/* Previously Sponsored Individuals */}
                      {previouslySponsoredIndividuals.map((individual, index) => (
                        <tr key={`sponsored-${index}`} className="bg-yellow-50">
                          <td className="px-3 py-2 text-blue-900">
                            {individual.firstName} {individual.middleName} {individual.lastName}
                          </td>
                          <td className="px-3 py-2 text-blue-900">
                            {individual.dateOfBirth ? new Date(individual.dateOfBirth).toLocaleDateString() : '—'}
                          </td>
                          <td className="px-3 py-2 text-blue-900">
                            {individual.relationship === 'other-relative' || individual.relationship === 'non-relative'
                              ? individual.relationshipOther || individual.relationship
                              : individual.relationship || '—'}
                            <span className="ml-1 text-xs text-yellow-800">(Previously Sponsored)</span>
                          </td>
                          <td className="px-3 py-2 text-blue-900">{individual.aNumber || '—'}</td>
                          <td className="px-3 py-2 text-blue-900">{individual.receiptNumber || '—'}</td>
                        </tr>
                      ))}

                      {/* Household Members */}
                      {householdMembers.map((member, index) => (
                        <tr key={`household-${index}`} className="bg-white">
                          <td className="px-3 py-2 text-blue-900">
                            {member.firstName} {member.middleName} {member.lastName}
                          </td>
                          <td className="px-3 py-2 text-blue-900">
                            {member.dateOfBirth ? new Date(member.dateOfBirth).toLocaleDateString() : '—'}
                          </td>
                          <td className="px-3 py-2 text-blue-900">
                            {member.relationship === 'other-relative' || member.relationship === 'non-relative'
                              ? member.relationshipOther || member.relationship
                              : member.relationship || '—'}
                            <span className="ml-1 text-xs text-blue-800">(Household Member)</span>
                          </td>
                          <td className="px-3 py-2 text-blue-900">{member.aNumber || '—'}</td>
                          <td className="px-3 py-2 text-blue-900">{member.receiptNumber || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Total Summary */}
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
