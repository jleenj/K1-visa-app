import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import ScreenLayout from '../../ScreenLayout';
import DisqualificationStandaloneScreen from '../../DisqualificationStandaloneScreen';
import { getNextScreen, isFirstScreen } from '../../../utils/navigationUtils';

/**
 * MetInPersonScreen - Section 2, Visa Requirements Question 2
 * Content copied exactly from Section1.jsx Question 2 (lines 261-369)
 */
const MetInPersonScreen = ({
  currentData,
  updateField,
  userRole
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const metInPerson = currentData.metInPerson || null;
  const plannedMeetingOption = currentData.plannedMeetingOption || null;
  const plannedMeetingDate = currentData.plannedMeetingDate || '';
  const acknowledgedMeetingRequirement = currentData.acknowledgedMeetingRequirement ?? false;
  const acknowledgedMeetingDate = currentData.acknowledgedMeetingDate || '';
  const [showDisqualification, setShowDisqualification] = useState(false);
  const [hasDQ, setHasDQ] = useState(false);
  const [dateError, setDateError] = useState('');

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

  // Calculate if meeting date is valid and within next 90 days (not past)
  const isValidFutureDate = (dateStr) => {
    if (!dateStr || dateStr.length !== 10) return false;

    const selectedDate = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const maxDate = new Date(today);
    maxDate.setDate(maxDate.getDate() + 90);

    // Must be today or later AND within 90 days
    return selectedDate >= today && selectedDate <= maxDate;
  };

  // Track DQ state (but don't show standalone screen yet)
  useEffect(() => {
    if (plannedMeetingOption === 'not-next-3-months') {
      setHasDQ(true);
      updateField('section2_metInPerson_DQ', true);
    } else {
      setHasDQ(false);
      setShowDisqualification(false);
      updateField('section2_metInPerson_DQ', false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plannedMeetingOption]);

  // Reset DQ screen when navigating away from this screen
  useEffect(() => {
    const isOnThisScreen = location.pathname.includes('/met-in-person');
    if (!isOnThisScreen) {
      setShowDisqualification(false);
    }
  }, [location.pathname]);

  // Re-validate date when screen loads or date changes
  useEffect(() => {
    if (plannedMeetingDate && plannedMeetingDate.length === 10) {
      const yearMatch = plannedMeetingDate.match(/^(\d{4})-/);
      const year = yearMatch ? parseInt(yearMatch[1]) : 0;

      if (year > 2000) {
        const selectedDate = new Date(plannedMeetingDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const maxDate = new Date(today);
        maxDate.setDate(maxDate.getDate() + 90);

        if (selectedDate < today) {
          setDateError('Please select a date today or in the future (within the next 90 days)');
          updateField('section2_metInPerson_dateInvalid', true);
        } else if (selectedDate > maxDate) {
          setDateError('Please select a date within the next 90 days');
          updateField('section2_metInPerson_dateInvalid', true);
        } else {
          setDateError('');
          // Valid date - but check if acknowledgment is needed
          // Date changed? Need new acknowledgment
          const dateChanged = acknowledgedMeetingDate !== plannedMeetingDate;
          const needsAcknowledgment = plannedMeetingOption === 'next-3-months' && (!acknowledgedMeetingRequirement || dateChanged);
          updateField('section2_metInPerson_dateInvalid', needsAcknowledgment);
        }
      }
    } else if (plannedMeetingDate && plannedMeetingDate.length > 0 && plannedMeetingDate.length < 10) {
      // Partial date entered
      updateField('section2_metInPerson_dateInvalid', true);
    } else {
      // No date or valid date
      updateField('section2_metInPerson_dateInvalid', false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plannedMeetingDate, acknowledgedMeetingRequirement, plannedMeetingOption, acknowledgedMeetingDate]);

  // Handle "Go Back" button - don't clear user's answer, just hide DQ screen
  const handleGoBack = () => {
    setShowDisqualification(false);
  };

  // Tailored DQ message
  const dqMessage = `USCIS requires that you and ${beneficiaryName} must have met in person at least once within the 2 years before filing your petition.\n\nWithout meeting in person first, your K-1 petition will likely be denied. USCIS needs proof that you've already met, like photos together or travel records.`;

  // Show standalone disqualification screen (only when on this screen's path AND showDisqualification is true)
  const isOnThisScreen = location.pathname.includes('/met-in-person');
  if (showDisqualification && isOnThisScreen) {
    return (
      <DisqualificationStandaloneScreen
        reason={dqMessage}
        onGoBack={handleGoBack}
        supportEmail="support@evernestusa.com"
        supportPhone="+1 (555) 123-4567"
      />
    );
  }

  // Info Message Component (Blue, for meeting date warning)
  const InfoMessage = ({ date }) => {
    // Check if user has acknowledged AND the date hasn't changed
    const dateMatches = acknowledgedMeetingDate === date;
    const hasAcknowledged = acknowledgedMeetingRequirement && dateMatches;

    // If user has acknowledged and date hasn't changed, show confirmation message
    if (hasAcknowledged) {
      return (
        <div className="mt-4 p-4 bg-green-50 border-l-4 border-green-400 rounded">
          <p className="text-sm text-green-800">
            ✓ You've acknowledged that your petition cannot be filed until after {new Date(date).toLocaleDateString()}. You can continue filling out this questionnaire to save time.
          </p>
        </div>
      );
    }

    // Otherwise show the warning with action buttons (either never acknowledged, or date changed)
    return (
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
                onClick={() => {
                  // Mark that user has acknowledged the 2-year requirement AND store the date
                  updateField('acknowledgedMeetingRequirement', true);
                  updateField('acknowledgedMeetingDate', date);
                }}
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
  };

  // Check if form is valid (for Next button)
  const isFormValid = () => {
    if (!metInPerson) return false;
    if (metInPerson === 'yes') return true;
    if (metInPerson === 'no' && !plannedMeetingOption) return false;
    if (plannedMeetingOption === 'next-3-months') {
      // Must have a date AND no validation errors AND acknowledgment
      if (!plannedMeetingDate || dateError || !acknowledgedMeetingRequirement) return false;
    }
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
                updateField('metInPerson', e.target.value);
                updateField('plannedMeetingOption', null);
                updateField('plannedMeetingDate', '');
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
              onChange={(e) => updateField('metInPerson', e.target.value)}
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
                  onChange={(e) => updateField('plannedMeetingOption', e.target.value)}
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
                    updateField('plannedMeetingOption', e.target.value);
                    updateField('plannedMeetingDate', '');
                  }}
                  className="h-4 w-4 text-blue-600"
                />
                <span className="text-sm font-medium text-gray-900">I'm not meeting {beneficiaryName} in the next 3 months</span>
              </label>
            </div>

            {/* Inline Warning - Appears immediately when "not in next 3 months" is selected */}
            {plannedMeetingOption === 'not-next-3-months' && (
              <div className="mt-4 p-5 bg-red-50 border-l-4 border-red-500 rounded-lg">
                <p className="text-sm font-semibold text-red-900 mb-3">
                  ⚠️ USCIS Requirement Conflict
                </p>
                <p className="text-sm text-red-800 mb-3">
                  USCIS requires that you and {beneficiaryName} must have met in person at
                  least once within the 2 years before filing your petition.
                </p>
                <p className="text-sm text-red-800">
                  Without meeting in person first, your K-1 petition will likely be denied. USCIS
                  needs proof that you've already met, like photos together or travel records.
                </p>
              </div>
            )}

            {/* Date picker for next 3 months */}
            {plannedMeetingOption === 'next-3-months' && (
              <div className="mt-4 space-y-3">
                <label className="block text-sm font-medium text-gray-900">
                  Select the date you plan to meet:
                </label>
                <input
                  type="date"
                  value={plannedMeetingDate}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    updateField('plannedMeetingDate', inputValue);
                    setDateError(''); // Clear error while typing

                    // Only validate if: 10 characters AND year > 2000
                    if (inputValue && inputValue.length === 10) {
                      const yearMatch = inputValue.match(/^(\d{4})-/);
                      const year = yearMatch ? parseInt(yearMatch[1]) : 0;

                      if (year > 2000) {
                        // Check if date is within valid range
                        const selectedDate = new Date(inputValue);
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        const maxDate = new Date(today);
                        maxDate.setDate(maxDate.getDate() + 90);

                        if (selectedDate < today) {
                          setDateError('Please select a date today or in the future (within the next 90 days)');
                        } else if (selectedDate > maxDate) {
                          setDateError('Please select a date within the next 90 days');
                        } else {
                          setDateError('');
                        }
                      }
                    }
                  }}
                  onBlur={(e) => {
                    const inputValue = e.target.value;

                    // Check for incomplete date
                    if (inputValue && inputValue.length > 0 && inputValue.length < 10) {
                      setDateError('Please enter a complete date (month, day, and year)');
                    } else if (e.target.validity.badInput) {
                      setDateError('Please enter a complete date (month, day, and year)');
                    } else if (!inputValue || inputValue.length === 0) {
                      setDateError('');
                    }
                  }}
                  min={new Date().toISOString().split('T')[0]}
                  max={(() => {
                    const today = new Date();
                    const maxDate = new Date(today);
                    maxDate.setDate(maxDate.getDate() + 90);
                    return maxDate.toISOString().split('T')[0];
                  })()}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    dateError ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {dateError && (
                  <p className="text-xs text-red-600 mt-1">{dateError}</p>
                )}

                {plannedMeetingDate && isValidFutureDate(plannedMeetingDate) && (
                  <InfoMessage date={plannedMeetingDate} />
                )}
              </div>
            )}

          </div>
        )}
      </div>
    </ScreenLayout>
  );
};

export default MetInPersonScreen;
