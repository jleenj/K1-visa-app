import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { stateMarriageLaws, canFirstCousinsMarry, getMinimumMarriageAge, canAdoptedSiblingsMarry } from '../../data/stateMarriageLaws';

const Section1 = ({ currentData = {}, updateField }) => {
  // State variables
  const [legallyFree, setLegallyFree] = useState(currentData.legallyFreeToMarry || null);
  const [metInPerson, setMetInPerson] = useState(currentData.metInPerson || null);
  const [plannedMeetingOption, setPlannedMeetingOption] = useState(currentData.plannedMeetingOption || null);
  const [plannedMeetingDate, setPlannedMeetingDate] = useState(currentData.plannedMeetingDate || '');
  const [meetingCircumstances, setMeetingCircumstances] = useState(currentData.meetingCircumstances || '');
  const [showMeetingExamples, setShowMeetingExamples] = useState(false);
  const [metThroughIMB, setMetThroughIMB] = useState(currentData.metThroughIMB || null);
  const [intendToMarry90Days, setIntendToMarry90Days] = useState(currentData.intendToMarry90Days || null);
  const [marriageState, setMarriageState] = useState(currentData.marriageState || '');
  const [areRelated, setAreRelated] = useState(currentData.areRelated || null);
  const [relationshipType, setRelationshipType] = useState(currentData.relationshipType || '');
  const [bloodRelationship, setBloodRelationship] = useState(currentData.bloodRelationship || '');
  const [adoptionRelationship, setAdoptionRelationship] = useState(currentData.adoptionRelationship || '');
  const [marriageRelationship, setMarriageRelationship] = useState(currentData.marriageRelationship || '');

  // Get beneficiary name and gender for personalization
  const beneficiaryName = currentData.beneficiaryFirstName || 'your fiancé(e)';
  const beneficiaryPronoun = currentData.beneficiaryGender === 'male' ? 'his' :
                             currentData.beneficiaryGender === 'female' ? 'her' : 'their';

  // Calculate if meeting date is within 3 months
  const isWithin3Months = (dateStr) => {
    if (!dateStr) return false;
    const selectedDate = new Date(dateStr);
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
    return selectedDate <= threeMonthsFromNow;
  };

  // Calculate age from date of birth
  const calculateAge = (dob) => {
    if (!dob) return null;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Check if age requirements are met for selected state
  const checkAgeRequirements = () => {
    if (!marriageState) return { met: true };

    const sponsorAge = calculateAge(currentData.sponsorDateOfBirth);
    const beneficiaryAge = calculateAge(currentData.beneficiaryDateOfBirth);
    const minAge = getMinimumMarriageAge(marriageState);

    if (sponsorAge !== null && sponsorAge < minAge) {
      return { met: false, person: 'you', age: minAge };
    }
    if (beneficiaryAge !== null && beneficiaryAge < minAge) {
      return { met: false, person: beneficiaryName, age: minAge };
    }

    return { met: true };
  };

  // Check if blood relationship is allowed in selected state
  const checkBloodRelationship = () => {
    if (!marriageState || !bloodRelationship) return { allowed: true };

    if (bloodRelationship === 'closer-than-first-cousins' || bloodRelationship === 'aunt-uncle-niece-nephew') {
      return { allowed: false, requiresStop: true };
    }

    if (bloodRelationship === 'first-cousins' || bloodRelationship === 'first-cousins-once-removed') {
      const allowed = canFirstCousinsMarry(marriageState);
      return { allowed, requiresStop: false, stateName: stateMarriageLaws[marriageState]?.name };
    }

    return { allowed: true };
  };

  // Check if adoption relationship is allowed in selected state
  const checkAdoptionRelationship = () => {
    if (!marriageState || !adoptionRelationship) return { allowed: true };

    if (adoptionRelationship === 'one-adopted-other') {
      return { allowed: false, requiresStop: true };
    }

    if (adoptionRelationship === 'adopted-siblings') {
      const allowed = canAdoptedSiblingsMarry(marriageState);
      return { allowed, requiresStop: false, stateName: stateMarriageLaws[marriageState]?.name };
    }

    return { allowed: true };
  };

  const ageCheck = checkAgeRequirements();
  const bloodCheck = checkBloodRelationship();
  const adoptionCheck = checkAdoptionRelationship();

  // Update parent whenever data changes
  useEffect(() => {
    const dataToSave = {
      legallyFreeToMarry: legallyFree,
      metInPerson,
      plannedMeetingOption,
      plannedMeetingDate,
      meetingCircumstances,
      metThroughIMB,
      intendToMarry90Days,
      marriageState,
      areRelated,
      relationshipType,
      bloodRelationship,
      adoptionRelationship,
      marriageRelationship
    };

    Object.keys(dataToSave).forEach(key => {
      updateField(key, dataToSave[key]);
    });
  }, [
    legallyFree, metInPerson, plannedMeetingOption, plannedMeetingDate,
    meetingCircumstances, metThroughIMB, intendToMarry90Days, marriageState, areRelated,
    relationshipType, bloodRelationship, adoptionRelationship, marriageRelationship
  ]);

  // Disqualification Message Component
  const DisqualificationMessage = ({ message, emailSubject }) => (
    <div className="mt-4 p-6 bg-red-50 border-l-4 border-red-400 rounded">
      <div className="flex items-start">
        <AlertCircle className="w-6 h-6 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-base font-semibold text-red-800 mb-2">
            Your situation requires individual review
          </p>
          <p className="text-sm text-red-700 mb-4">
            {message}
          </p>
          <button
            type="button"
            onClick={() => window.location.href = `mailto:support@example.com?subject=${encodeURIComponent(emailSubject)}`}
            className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded transition-colors"
          >
            Contact Customer Service
          </button>
        </div>
      </div>
    </div>
  );

  // Info Message Component (Blue, for meeting date warning)
  const InfoMessage = ({ date }) => (
    <div className="mt-4 p-6 bg-blue-50 border-l-4 border-blue-400 rounded">
      <div className="flex items-start">
        <AlertCircle className="w-6 h-6 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-base font-semibold text-blue-800 mb-2">
            Important: 2-Year Meeting Requirement
          </p>
          <p className="text-sm text-blue-700 mb-4">
            K-1 visa applications require that you have physically met your fiancé(e) in person within the 2 years <strong>before filing</strong> your petition. Since your planned meeting date is {new Date(date).toLocaleDateString()}, please note that your application cannot be submitted until after that date.
          </p>
          <p className="text-sm text-blue-700 mb-4">
            Don't worry - you can continue filling out this questionnaire now to save time. Just remember to wait until after {new Date(date).toLocaleDateString()} to file your petition, or it will be rejected.
          </p>
          <p className="text-sm font-semibold text-blue-800 mb-3">
            What would you like to do?
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {/* Continue to next section */}}
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition-colors"
            >
              I understand - let's continue
            </button>
            <button
              type="button"
              onClick={() => window.location.href = 'mailto:support@example.com?subject=K-1 Visa Application - Meeting Date Question'}
              className="inline-flex items-center px-4 py-2 bg-white hover:bg-gray-50 text-blue-600 text-sm font-medium rounded border-2 border-blue-600 transition-colors"
            >
              Contact customer service
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // US States list
  const states = Object.keys(stateMarriageLaws).map(code => ({
    code,
    name: stateMarriageLaws[code].name
  }));

  return (
    <div className="space-y-8">
      {/* Introduction */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Your Relationship
        </h3>
        <p className="text-sm text-gray-700">
          These questions help us determine your K-1 visa eligibility based on your relationship with {beneficiaryName}. We'll verify that you meet USCIS requirements for marriage timing, in-person meetings, and state marriage laws.
        </p>
      </div>

      {/* Question 1: Legally Free to Marry */}
      <div className="space-y-4">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-sm font-semibold text-gray-900 mb-2">
            Are both {currentData.sponsorFirstName || 'you'} and {beneficiaryName} legally free to marry under U.S. law?
          </p>
          <div className="mt-3 text-xs text-gray-700 bg-white border border-gray-200 rounded p-3">
            <p className="font-medium text-gray-900 mb-2">What this means:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Both must meet your state's minimum age for marriage (18 in most states)</li>
              <li>Neither can be currently married to anyone else, anywhere in the world</li>
              <li>All previous marriages must be legally terminated (divorce, death, or annulment)</li>
            </ul>
          </div>
        </div>

        <div className="space-y-3">
          <label className="flex items-center space-x-3 p-4 border-2 border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
            <input
              type="radio"
              name="legallyFree"
              value="yes"
              checked={legallyFree === 'yes'}
              onChange={(e) => setLegallyFree(e.target.value)}
              className="h-4 w-4 text-blue-600"
            />
            <span className="text-sm font-medium text-gray-900">Yes</span>
          </label>

          <label className="flex items-center space-x-3 p-4 border-2 border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
            <input
              type="radio"
              name="legallyFree"
              value="no"
              checked={legallyFree === 'no'}
              onChange={(e) => setLegallyFree(e.target.value)}
              className="h-4 w-4 text-blue-600"
            />
            <span className="text-sm font-medium text-gray-900">No</span>
          </label>
        </div>

        {legallyFree === 'no' && (
          <DisqualificationMessage
            message="Your situation is complex and needs individual review. Please contact our customer service team to discuss your case."
            emailSubject="K-1 Visa Application - Legally Free to Marry Question"
          />
        )}
      </div>

      {/* Question 2: Met in Person */}
      <div className={`space-y-4 ${legallyFree === 'no' ? 'opacity-50 pointer-events-none' : ''}`}>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-sm font-semibold text-gray-900 mb-2">
            Have you and {beneficiaryName} physically met in person (in the same place at the same time) within the past 2 years?
          </p>
        </div>

        <p className="text-xs text-gray-600">
          <strong>Why we ask this:</strong> K-1 visa applications require that you have met in person within 2 years before filing. This is a mandatory eligibility requirement.
        </p>

        <div className="space-y-3">
          <label className="flex items-center space-x-3 p-4 border-2 border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
            <input
              type="radio"
              name="metInPerson"
              value="yes"
              checked={metInPerson === 'yes'}
              onChange={(e) => {
                setMetInPerson(e.target.value);
                setPlannedMeetingOption(null);
                setPlannedMeetingDate('');
              }}
              className="h-4 w-4 text-blue-600"
            />
            <span className="text-sm font-medium text-gray-900">Yes</span>
          </label>

          <label className="flex items-center space-x-3 p-4 border-2 border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
            <input
              type="radio"
              name="metInPerson"
              value="no"
              checked={metInPerson === 'no'}
              onChange={(e) => setMetInPerson(e.target.value)}
              className="h-4 w-4 text-blue-600"
            />
            <span className="text-sm font-medium text-gray-900">No</span>
          </label>
        </div>

        {/* Q2a: Planned Meeting */}
        {metInPerson === 'no' && (
          <div className="ml-6 mt-4 space-y-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-sm font-medium text-gray-900">
              When do you plan to meet {beneficiaryName} in person?
            </p>

            <div className="space-y-3">
              <label className="flex items-center space-x-3 p-4 border-2 border-gray-300 rounded-lg hover:bg-white cursor-pointer">
                <input
                  type="radio"
                  name="plannedMeeting"
                  value="next-3-months"
                  checked={plannedMeetingOption === 'next-3-months'}
                  onChange={(e) => setPlannedMeetingOption(e.target.value)}
                  className="h-4 w-4 text-blue-600"
                />
                <span className="text-sm font-medium text-gray-900">I'm meeting {beneficiaryName} in the next 3 months</span>
              </label>

              <label className="flex items-center space-x-3 p-4 border-2 border-gray-300 rounded-lg hover:bg-white cursor-pointer">
                <input
                  type="radio"
                  name="plannedMeeting"
                  value="not-next-3-months"
                  checked={plannedMeetingOption === 'not-next-3-months'}
                  onChange={(e) => {
                    setPlannedMeetingOption(e.target.value);
                    setPlannedMeetingDate('');
                  }}
                  className="h-4 w-4 text-blue-600"
                />
                <span className="text-sm font-medium text-gray-900">I'm not meeting {beneficiaryName} in the next 3 months</span>
              </label>
            </div>

            {/* Date picker for next 3 months */}
            {plannedMeetingOption === 'next-3-months' && (
              <div className="mt-4 space-y-3">
                <label className="block text-sm font-medium text-gray-900">
                  Select the date you plan to meet:
                </label>
                <input
                  type="date"
                  value={plannedMeetingDate}
                  onChange={(e) => setPlannedMeetingDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  max={new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />

                {plannedMeetingDate && isWithin3Months(plannedMeetingDate) && (
                  <InfoMessage date={plannedMeetingDate} />
                )}
              </div>
            )}

            {/* Disqualification for not meeting in next 3 months */}
            {plannedMeetingOption === 'not-next-3-months' && (
              <DisqualificationMessage
                message="Unfortunately, meeting in person within the past 2 years is a required eligibility criterion for K-1 visas. Since you do not plan to meet within the next 3 months, we cannot proceed with your application at this time. Please contact customer support to discuss your options."
                emailSubject="K-1 Visa Application - In-Person Meeting Requirement"
              />
            )}
          </div>
        )}
      </div>

      {/* Question 3: International Marriage Broker */}
      <div className={`space-y-4 ${legallyFree === 'no' || (metInPerson === 'no' && plannedMeetingOption === 'not-next-3-months') ? 'opacity-50 pointer-events-none' : ''}`}>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-sm font-semibold text-gray-900 mb-2">
            Did you meet {beneficiaryName} through an International Marriage Broker or marriage agency?
          </p>
          <details className="mt-3">
            <summary className="text-xs text-blue-600 cursor-pointer hover:text-blue-800">
              What is an International Marriage Broker?
            </summary>
            <p className="text-xs text-gray-700 mt-2">
              An International Marriage Broker (IMB) is a for-profit organization that charges fees to facilitate communication and meetings between U.S. citizens and foreign nationals for dating or marriage purposes. This does NOT include free social media sites, dating apps, or cultural/religious matchmaking organizations.
            </p>
          </details>
        </div>

        <p className="text-xs text-gray-600">
          <strong>Why we ask this:</strong> Federal law requires disclosure if you used an International Marriage Broker service. Using an IMB adds additional documentation requirements.
        </p>

        <div className="space-y-3">
          <label className="flex items-center space-x-3 p-4 border-2 border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
            <input
              type="radio"
              name="metThroughIMB"
              value="yes"
              checked={metThroughIMB === 'yes'}
              onChange={(e) => setMetThroughIMB(e.target.value)}
              className="h-4 w-4 text-blue-600"
            />
            <span className="text-sm font-medium text-gray-900">Yes</span>
          </label>

          <label className="flex items-center space-x-3 p-4 border-2 border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
            <input
              type="radio"
              name="metThroughIMB"
              value="no"
              checked={metThroughIMB === 'no'}
              onChange={(e) => setMetThroughIMB(e.target.value)}
              className="h-4 w-4 text-blue-600"
            />
            <span className="text-sm font-medium text-gray-900">No</span>
          </label>
        </div>

        {metThroughIMB === 'yes' && (
          <DisqualificationMessage
            message="Couples who met through International Marriage Brokers have additional IMBRA requirements that need specialized handling. Please contact our customer service team to discuss your options."
            emailSubject="K-1 Visa Application - International Marriage Broker"
          />
        )}
      </div>

      {/* Question 4: Intent to Marry Within 90 Days */}
      <div className={`space-y-4 ${legallyFree === 'no' || (metInPerson === 'no' && plannedMeetingOption === 'not-next-3-months') || metThroughIMB === 'yes' ? 'opacity-50 pointer-events-none' : ''}`}>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-sm font-semibold text-gray-900 mb-2">
            Do you and {beneficiaryName} intend to marry each other within 90 days of {beneficiaryPronoun} arrival in the United States?
          </p>
        </div>

        <p className="text-xs text-gray-600">
          <strong>Why we ask this:</strong> K-1 visas require that you marry within 90 days of your fiancé(e)'s arrival in the United States. This is a mandatory eligibility requirement.
        </p>

        <div className="space-y-3">
          <label className="flex items-center space-x-3 p-4 border-2 border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
            <input
              type="radio"
              name="intendToMarry90Days"
              value="yes"
              checked={intendToMarry90Days === 'yes'}
              onChange={(e) => setIntendToMarry90Days(e.target.value)}
              className="h-4 w-4 text-blue-600"
            />
            <span className="text-sm font-medium text-gray-900">Yes</span>
          </label>

          <label className="flex items-center space-x-3 p-4 border-2 border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
            <input
              type="radio"
              name="intendToMarry90Days"
              value="no"
              checked={intendToMarry90Days === 'no'}
              onChange={(e) => setIntendToMarry90Days(e.target.value)}
              className="h-4 w-4 text-blue-600"
            />
            <span className="text-sm font-medium text-gray-900">No</span>
          </label>
        </div>

        {intendToMarry90Days === 'no' && (
          <DisqualificationMessage
            message="K-1 visas require that you marry within 90 days of your fiancé(e)'s arrival. If you do not intend to marry within this timeframe, please contact our customer service team to discuss alternative visa options."
            emailSubject="K-1 Visa Application - 90-Day Marriage Intent"
          />
        )}
      </div>

      {/* Question 5: Marriage State */}
      <div className={`space-y-4 ${legallyFree === 'no' || (metInPerson === 'no' && plannedMeetingOption === 'not-next-3-months') || metThroughIMB === 'yes' || intendToMarry90Days === 'no' ? 'opacity-50 pointer-events-none' : ''}`}>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-sm font-semibold text-gray-900 mb-2">
            Which U.S. state do you plan to marry in?
          </p>
        </div>

        <p className="text-xs text-gray-600">
          <strong>Why we ask this:</strong> Your marriage must comply with state law (age requirements and familial relationship restrictions).
        </p>

        <select
          value={marriageState}
          onChange={(e) => setMarriageState(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select a state...</option>
          {states.map(state => (
            <option key={state.code} value={state.code}>
              {state.name}
            </option>
          ))}
        </select>

        {/* Age validation error */}
        {marriageState && !ageCheck.met && (
          <div className="mt-3 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
            <p className="text-sm text-yellow-800">
              In {stateMarriageLaws[marriageState]?.name}, the minimum age to marry is {ageCheck.age}. Based on the dates of birth provided, {ageCheck.person} do not meet this requirement. Please select a different state where you plan to marry, or contact customer support if you need assistance.
            </p>
          </div>
        )}
      </div>

      {/* Question 6: Are You Related */}
      <div className={`space-y-4 ${legallyFree === 'no' || (metInPerson === 'no' && plannedMeetingOption === 'not-next-3-months') || metThroughIMB === 'yes' || intendToMarry90Days === 'no' ? 'opacity-50 pointer-events-none' : ''}`}>
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
              onChange={(e) => setAreRelated(e.target.value)}
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
                setAreRelated(e.target.value);
                setRelationshipType('');
                setBloodRelationship('');
                setAdoptionRelationship('');
                setMarriageRelationship('');
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
                    setRelationshipType(e.target.value);
                    setAdoptionRelationship('');
                    setMarriageRelationship('');
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
                    setRelationshipType(e.target.value);
                    setBloodRelationship('');
                    setMarriageRelationship('');
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
                    setRelationshipType(e.target.value);
                    setBloodRelationship('');
                    setAdoptionRelationship('');
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
                      onChange={(e) => setBloodRelationship(e.target.value)}
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
                      onChange={(e) => setBloodRelationship(e.target.value)}
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
                      onChange={(e) => setBloodRelationship(e.target.value)}
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
                      onChange={(e) => setBloodRelationship(e.target.value)}
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
                      onChange={(e) => setBloodRelationship(e.target.value)}
                      className="h-4 w-4 text-blue-600 mt-0.5"
                    />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-900 block">Closer than first cousins</span>
                      <span className="text-xs text-gray-600 italic">You and your fiancé(e) are siblings, half-siblings, parent/child, or grandparent/grandchild.</span>
                    </div>
                  </label>
                </div>

                {/* Blood relationship validation */}
                {bloodRelationship && bloodCheck.requiresStop && (
                  <DisqualificationMessage
                    message="Based on your answer, your situation is complex and requires personalized guidance. Please contact our customer service team to discuss your options."
                    emailSubject="K-1 Visa Application - Blood Relationship Question"
                  />
                )}

                {bloodRelationship && !bloodCheck.allowed && !bloodCheck.requiresStop && (
                  <div className="mt-3 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                    <p className="text-sm text-yellow-800">
                      In {bloodCheck.stateName}, marriage between first cousins is not permitted. You can either (1) select a different state where this marriage is legal, or (2) contact customer support for assistance.
                    </p>
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
                      onChange={(e) => setAdoptionRelationship(e.target.value)}
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
                      onChange={(e) => setAdoptionRelationship(e.target.value)}
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
                      onChange={(e) => setAdoptionRelationship(e.target.value)}
                      className="h-4 w-4 text-blue-600 mt-0.5"
                    />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-900 block">None of these describe our relationship</span>
                      <button
                        type="button"
                        onClick={() => window.location.href = 'mailto:support@example.com?subject=K-1 Visa Application - Adoption Relationship Question'}
                        className="mt-2 inline-flex items-center px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded transition-colors"
                      >
                        Contact Customer Service
                      </button>
                    </div>
                  </label>
                </div>

                {/* Adoption relationship validation */}
                {adoptionRelationship === 'one-adopted-other' && (
                  <DisqualificationMessage
                    message="Based on your answer, your situation is complex and requires personalized guidance. Please contact our customer service team to discuss your options."
                    emailSubject="K-1 Visa Application - Adoption Relationship Question"
                  />
                )}

                {adoptionRelationship === 'adopted-siblings' && !adoptionCheck.allowed && (
                  <div className="mt-3 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                    <p className="text-sm text-yellow-800">
                      In {adoptionCheck.stateName}, marriage between adopted siblings is not permitted. You can either (1) select a different state where this marriage is legal, or (2) contact customer support for assistance.
                    </p>
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
                      onChange={(e) => setMarriageRelationship(e.target.value)}
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
                      onChange={(e) => setMarriageRelationship(e.target.value)}
                      className="h-4 w-4 text-blue-600 mt-0.5"
                    />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-900 block">Other</span>
                      <button
                        type="button"
                        onClick={() => window.location.href = 'mailto:support@example.com?subject=K-1 Visa Application - Marriage Relationship Question'}
                        className="mt-2 inline-flex items-center px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded transition-colors"
                      >
                        Contact Customer Service
                      </button>
                    </div>
                  </label>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Question 7: Circumstances of In-Person Meeting */}
      <div className={`space-y-4 ${legallyFree === 'no' || (metInPerson === 'no' && plannedMeetingOption === 'not-next-3-months') || metThroughIMB === 'yes' || intendToMarry90Days === 'no' ? 'opacity-50 pointer-events-none' : ''}`}>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-sm font-semibold text-gray-900 mb-2">
            Describe the circumstances of your in-person meeting with {beneficiaryName}
          </p>
        </div>

        {/* Strategic Guidance Panel */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-3">
          <div>
            <p className="text-xs font-semibold text-blue-900 mb-2">
              📋 What we are asking and why:
            </p>
            <p className="text-xs text-blue-800">
              K-1 visa applications require proof that you and {beneficiaryName} met in person within the last 2 years. Before you describe your meeting, think about which meeting you have the most evidence for.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold text-blue-900 mb-2">
              📄 Evidence types that strengthen your application:
            </p>
            <ul className="text-xs text-blue-800 space-y-1 ml-4 list-disc">
              <li>Passport entry/exit stamps showing travel dates</li>
              <li>Boarding passes or airline tickets</li>
              <li>Hotel receipts or accommodation confirmations</li>
              <li>Photos together with family members or friends (with dates)</li>
              <li>Dated receipts from restaurants, attractions, or activities</li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold text-blue-900 mb-2">
              ✍️ Keep it simple and factual:
            </p>
            <p className="text-xs text-blue-800 mb-2">
              Your application mainly needs to verify you physically met—not hear your complete love story.
            </p>
            <p className="text-xs text-blue-800 mb-2">
              <strong>Good to include:</strong> Date, location, how long you stayed together, what you did together, where you stayed
            </p>
            <p className="text-xs text-blue-800">
              <strong>Keep it brief:</strong> 3-5 sentences (about 50-150 words) is perfect
            </p>
          </div>
        </div>

        {/* Free Text Area */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-900">
            Your response:
          </label>
          <div className="relative">
            <textarea
              value={meetingCircumstances}
              onChange={(e) => setMeetingCircumstances(e.target.value)}
              rows={8}
              placeholder="Example: I traveled to Manila, Philippines from June 15-30, 2024 to meet Maria. We had been communicating online for 8 months prior. During my visit, I stayed at the Manila Hotel and met her family including her parents and two siblings. We spent time together daily exploring the city."
              className="w-full px-3 py-2 pb-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <div className="absolute bottom-2 right-3 text-xs text-gray-500">
              {meetingCircumstances.trim().split(/\s+/).filter(w => w.length > 0).length} words
            </div>
          </div>

          {/* Word Count Warning (only if >300 words) */}
          {meetingCircumstances.trim().split(/\s+/).filter(w => w.length > 0).length > 300 && (
            <p className="text-xs text-yellow-700">
              Consider shortening your response. 3-5 sentences (about 50-150 words) is perfect.
            </p>
          )}

          {/* Toggle for Examples */}
          <button
            type="button"
            onClick={() => setShowMeetingExamples(!showMeetingExamples)}
            className="text-xs text-blue-600 hover:text-blue-800 underline"
          >
            {showMeetingExamples ? 'Hide examples' : 'Show more examples'}
          </button>

          {/* Examples Section */}
          {showMeetingExamples && (
            <div className="mt-3 p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-4">
              <div>
                <p className="text-xs font-semibold text-gray-900 mb-1">Example 1:</p>
                <p className="text-xs text-gray-700 italic">
                  "I traveled to Tokyo, Japan from March 10-24, 2024 to meet Yuki. We had been communicating online since August 2023. During my visit, I stayed at the Park Hyatt Tokyo and met her parents and younger brother. We spent time together daily and got engaged on March 20, 2024."
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-900 mb-1">Example 2:</p>
                <p className="text-xs text-gray-700 italic">
                  "I most recently visited Carlos in Mexico City from January 5-19, 2025. I stayed at the Hilton Mexico City Reforma and spent time with him and his family daily exploring the city and sharing meals together."
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-900 mb-1">Example 3:</p>
                <p className="text-xs text-gray-700 italic">
                  "Anna and I met in Dubai, UAE from September 1-14, 2024. We both traveled there to spend time together. We stayed at separate hotels but spent our days together visiting the city."
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Section1;
