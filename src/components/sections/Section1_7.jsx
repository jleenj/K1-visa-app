import React, { useState, useEffect } from 'react';
import { Info, Plus, Trash2, AlertCircle } from 'lucide-react';

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
  const [hasReceiptNumbers, setHasReceiptNumbers] = useState(
    currentData.hasReceiptNumbers || null
  );
  const [receiptNumbers, setReceiptNumbers] = useState(
    currentData.previousSponsorshipsReceiptNumbers || []
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

  // 2025 Poverty Guidelines (100% - for I-134)
  const povertyGuidelines2025 = {
    1: 15140,
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

  // Update parent component whenever data changes
  useEffect(() => {
    const dataToSave = {
      hasPreviousSponsorships,
      previousSponsorshipsCount,
      previousSponsorshipsCountCustom,
      hasReceiptNumbers,
      previousSponsorshipsReceiptNumbers: receiptNumbers,
      householdMembersCount,
      householdMembersCountCustom,
      householdMembers,
      householdSize: householdData.householdSize,
      minimumRequiredIncome: householdData.minimumRequiredIncome
    };

    Object.keys(dataToSave).forEach(key => {
      updateField(key, dataToSave[key]);
    });
  }, [
    hasPreviousSponsorships,
    previousSponsorshipsCount,
    previousSponsorshipsCountCustom,
    hasReceiptNumbers,
    receiptNumbers,
    householdMembersCount,
    householdMembersCountCustom,
    householdMembers
  ]);

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

  const updateReceiptNumber = (index, value) => {
    const updated = [...receiptNumbers];
    updated[index] = value;
    setReceiptNumbers(updated);
  };

  // Initialize receipt numbers array when count changes
  useEffect(() => {
    const count = previousSponsorshipsCount === 5
      ? parseInt(previousSponsorshipsCountCustom) || 5
      : previousSponsorshipsCount;

    if (count > receiptNumbers.length) {
      setReceiptNumbers([...receiptNumbers, ...Array(count - receiptNumbers.length).fill('')]);
    } else if (count < receiptNumbers.length) {
      setReceiptNumbers(receiptNumbers.slice(0, count));
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
          <p className="text-sm text-gray-700 font-medium mt-3">You're still financially responsible if:</p>
          <ul className="text-sm text-gray-700 space-y-1 ml-4 list-disc">
            <li>The person you sponsored is still in the U.S. on that visa</li>
            <li>The sponsorship hasn't been terminated by USCIS</li>
            <li>The person hasn't become a U.S. citizen</li>
          </ul>
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
                setReceiptNumbers([]);
                setHasReceiptNumbers(null);
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

        {/* Follow-up: Receipt numbers */}
        {hasPreviousSponsorships === 'yes' && previousSponsorshipsCount > 0 && (
          <div className="ml-6 space-y-4 mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Receipt Numbers (if any)
              </label>
              <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-3">
                <p className="text-sm text-blue-900">
                  Receipt numbers are on Form I-797 (Notice of Action) from USCIS. They appear at the top and look like <strong>EAC2190012345</strong> or <strong>IOE1234567890</strong> (3 letters + 10 numbers).
                </p>
                <p className="text-sm text-blue-900 mt-2">
                  <strong>If the individuals have them, please include them.</strong> You can skip this if you don't have them available right now.
                </p>
              </div>
            </div>

            {Array.from({ length: previousSponsorshipsCount === 5 ? parseInt(previousSponsorshipsCountCustom) || 5 : previousSponsorshipsCount }).map((_, index) => (
              <div key={index}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Receipt Number for Sponsorship {index + 1} (if any)
                </label>
                <input
                  type="text"
                  value={receiptNumbers[index] || ''}
                  onChange={(e) => updateReceiptNumber(index, e.target.value)}
                  placeholder="e.g., EAC2190012345"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Question 2: Household Members */}
      <div className="space-y-4 border-t pt-8">
        <h4 className="text-base font-semibold text-gray-900">
          Besides yourself and {fianceName}, how many people live in your household or depend on your income?
        </h4>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2">
          <p className="text-sm text-gray-700 font-medium">Include:</p>
          <ul className="text-sm text-gray-700 space-y-1 ml-4 list-disc">
            <li>Your spouse (if married)</li>
            <li>Your children under 21 who are unmarried</li>
            <li>Your children over 21 if they're listed on your tax return as dependents</li>
            <li>Children from a previous relationship that you financially support (include them separately - don't count your ex-spouse)</li>
            <li>Anyone else listed as a dependent on your federal tax return</li>
            <li>Other relatives living with you who you financially support</li>
          </ul>
          <p className="text-sm text-gray-700 font-medium mt-3">Don't include:</p>
          <ul className="text-sm text-gray-700 space-y-1 ml-4 list-disc">
            <li>Yourself (we count you automatically)</li>
            <li>{fianceName} (we count {fianePronoun} automatically)</li>
            <li>Your ex-spouse (unless they're still your tax dependent, which is rare)</li>
            <li>Roommates who pay their own way</li>
            <li>Adult children who are financially independent</li>
          </ul>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of household members/dependents
          </label>
          <select
            value={householdMembersCount}
            onChange={(e) => setHouseholdMembersCount(parseInt(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={0}>0 (just me)</option>
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
                    <option value="spouse">Spouse</option>
                    <option value="child">Child</option>
                    <option value="stepchild">Stepchild</option>
                    <option value="parent">Parent</option>
                    <option value="sibling">Sibling</option>
                    <option value="grandparent">Grandparent</option>
                    <option value="grandchild">Grandchild</option>
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
                      An A-Number is assigned by USCIS to immigrants. Found on green cards, work permits, or USCIS letters.
                      <strong> If this person has one, please include it.</strong>
                    </p>
                  </div>
                  <input
                    type="text"
                    value={member.aNumber}
                    onChange={(e) => updateHouseholdMember(index, 'aNumber', e.target.value)}
                    placeholder="e.g., A123456789"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Receipt Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Receipt Number (if any)
                  </label>
                  <div className="bg-blue-50 border border-blue-200 rounded p-2 mb-2">
                    <p className="text-xs text-blue-900">
                      Only if you're sponsoring this person on another immigration form. Found on Form I-797 from USCIS.
                      <strong> If they have one, please include it.</strong>
                    </p>
                  </div>
                  <input
                    type="text"
                    value={member.receiptNumber}
                    onChange={(e) => updateHouseholdMember(index, 'receiptNumber', e.target.value)}
                    placeholder="e.g., EAC2190012345"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Visual Summary */}
      <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6 mt-8">
        <div className="flex items-start gap-3">
          <Info className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h4 className="text-base font-semibold text-blue-900 mb-3">
              📊 Your Household Size
            </h4>
            <div className="space-y-2 text-sm text-blue-900">
              <p>Based on your answers:</p>
              <ul className="ml-4 space-y-1">
                <li>• You: <strong>1 person</strong></li>
                <li>• {fianceName}: <strong>1 person</strong></li>
                <li>• People you're sponsoring on other forms: <strong>{householdData.breakdown.previousSponsorships} {householdData.breakdown.previousSponsorships === 1 ? 'person' : 'people'}</strong></li>
                <li>• Your household members/dependents: <strong>{householdData.breakdown.householdMembers} {householdData.breakdown.householdMembers === 1 ? 'person' : 'people'}</strong></li>
              </ul>
              <div className="border-t border-blue-300 pt-2 mt-3">
                <p className="font-semibold text-base">
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
    </div>
  );
};

export default Section1_7;
