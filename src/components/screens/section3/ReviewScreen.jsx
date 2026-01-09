import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ScreenLayout from '../../ScreenLayout';
import { getNextScreen, getPreviousScreen, isFirstScreen } from '../../../utils/navigationUtils';
import { Calendar, CheckCircle } from 'lucide-react';

/**
 * ReviewScreen - Section 3, Address History Review
 *
 * Shows a visual timeline of all addresses provided:
 * - Current address
 * - Previous addresses (if any)
 * - States/countries since 18 (sponsor only, if applicable)
 *
 * Provides a final summary before moving to next section
 */
const ReviewScreen = ({
  currentData,
  updateField,
  userRole
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine if this is sponsor or beneficiary based on URL
  const isSponsor = location.pathname.includes('section-3-address-history') &&
                    !location.pathname.includes('beneficiary');
  const prefix = isSponsor ? 'sponsor' : 'beneficiary';
  const personName = isSponsor ? 'You' : (currentData.beneficiaryFirstName || "Beneficiary");

  // Get future US address (beneficiary only)
  const futureUSAddress = !isSponsor ? currentData.beneficiaryIntendedUSAddress : null;

  // Get current address
  const mailingDifferent = currentData[`${prefix}MailingDifferent`];
  const currentAddress = mailingDifferent === 'Yes'
    ? currentData[`${prefix}CurrentAddress`]
    : currentData[`${prefix}MailingAddress`];

  // Get move-in date
  const moveInDate = currentData[`${prefix}AddressDuration`];

  // Get previous addresses
  const previousAddresses = currentData[`${prefix}AddressHistory`] || [];

  // Get states/countries since 18 (sponsor only)
  // This section is ONLY for places lived BEFORE the 5-year period
  // (between age 18 and 5 years ago), NOT places from the 5-year address history
  const placesResidedRaw = isSponsor ? (currentData.sponsorPlacesResided || []) : [];

  // Format manually added places only
  const placesResided = placesResidedRaw.map(place => ({
    displayName: place.type === 'united-states' || place.type === 'us-state' ? `${place.location}, USA` : place.location,
    isExtracted: false
  }));

  // Format address for display
  const formatAddress = (addr) => {
    if (!addr || !addr.country) return 'Address not provided';

    const parts = [];
    if (addr.street) parts.push(addr.street);
    if (addr.unitType && addr.unitNumber) parts.push(`${addr.unitType} ${addr.unitNumber}`);
    if (addr.city) parts.push(addr.city);
    if (addr.state) parts.push(addr.state);
    if (addr.zipCode) parts.push(addr.zipCode);
    if (addr.country) parts.push(addr.country);

    return parts.join(', ');
  };

  // Format date
  const formatDate = (dateStr) => {
    if (!dateStr) return 'Not specified';
    const date = new Date(dateStr);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const handleNext = () => {
    const nextPath = getNextScreen(location.pathname, userRole, currentData);
    if (nextPath) {
      navigate(nextPath);
    }
  };

  const handleBack = () => {
    const prevPath = getPreviousScreen(location.pathname, userRole, currentData);
    if (prevPath) {
      navigate(prevPath);
    }
  };

  const isFirst = isFirstScreen(location.pathname, userRole, currentData);

  // Check if sponsor needs to provide places lived since 18
  const needsPlacesSince18 = () => {
    if (!isSponsor) return false;

    const dob = currentData.sponsorDOB;
    if (!dob) return false;

    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age >= 23;
  };

  // Check if previous addresses are required based on move-in date
  const needsPreviousAddresses = () => {
    // If no move-in date, we can't determine coverage, so assume previous addresses needed
    if (!moveInDate) return true;

    const moveIn = new Date(moveInDate);
    const fiveYearsAgo = new Date();
    fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);

    // If move-in date is AFTER 5 years ago, we need previous addresses
    return moveIn > fiveYearsAgo;
  };

  // Helper function to validate if address has all required fields
  const isAddressComplete = (address) => {
    if (!address) return false;

    // Required fields for all addresses
    const hasBasicFields = address.street &&
                          address.city &&
                          address.zipCode &&
                          address.country;

    if (!hasBasicFields) return false;

    // US addresses also require state
    if (address.country === 'United States') {
      return address.state && address.state.trim() !== '';
    }

    // Canada addresses also require province
    if (address.country === 'Canada') {
      return address.province && address.province.trim() !== '';
    }

    // All other countries just need basic fields
    return true;
  };

  // Validation logic to check if all required information is complete
  const validateAddressInfo = () => {
    const issues = [];

    // Check if current address is complete with all required fields
    if (!isAddressComplete(currentAddress)) {
      issues.push('current address is incomplete');
    }

    // For beneficiary, check if future US address is complete
    if (!isSponsor) {
      if (!isAddressComplete(futureUSAddress)) {
        issues.push('future U.S. address is incomplete');
      }
    }

    // Check if 5-year address history requirement is met
    if (needsPreviousAddresses()) {
      // Check if move-in date is provided (needed to determine 5-year coverage)
      if (!moveInDate) {
        issues.push('5-year address history (move-in date needed)');
      }

      // Check if we have previous addresses to fill the gap
      if (previousAddresses.length === 0) {
        issues.push('5-year address history (previous addresses needed)');
      } else {
        // Check if previous addresses are complete
        const incompletePrevious = previousAddresses.some(addr => !isAddressComplete(addr));
        if (incompletePrevious) {
          issues.push('previous addresses have incomplete information');
        } else {
          // Check if the oldest address actually covers the 5-year period
          const fiveYearsAgo = new Date();
          fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);

          const lastAddress = previousAddresses[previousAddresses.length - 1];
          if (lastAddress && lastAddress.dateFrom) {
            const oldestDate = new Date(lastAddress.dateFrom);
            if (oldestDate > fiveYearsAgo) {
              issues.push('5-year address history (coverage gap - need earlier addresses)');
            }
          } else {
            issues.push('previous addresses missing date information');
          }
        }
      }
    }

    // Check if places lived since 18 is required but not provided (sponsor only, age 23+)
    if (needsPlacesSince18()) {
      const answer = currentData.sponsorPlacesResided_answer;

      // Issue if: no answer provided OR answered "yes" but no places added
      if (!answer) {
        issues.push('states/countries lived since age 18');
      } else if (answer === 'yes' && placesResided.length === 0) {
        issues.push('states/countries lived since age 18');
      }
      // If answer is "no", that's complete - no issue
    }

    return issues;
  };

  const validationIssues = validateAddressInfo();
  const isComplete = validationIssues.length === 0;

  return (
    <ScreenLayout
      showBackButton={!isFirst}
      onBack={handleBack}
      onNext={handleNext}
      nextButtonDisabled={!isComplete}
    >
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            Address Summary
          </h2>
        </div>

        {/* Timeline Visualization */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Address Timeline</h3>

          <div className="space-y-6">
            {/* Future US Address (Beneficiary Only) */}
            {!isSponsor && (
              <div className={`relative pl-8 pb-6 border-l-2 ${!isAddressComplete(futureUSAddress) ? 'border-amber-300 bg-amber-50/30' : 'border-green-300 bg-green-50/30'}`}>
                <div className={`absolute -left-2.5 top-0 w-5 h-5 rounded-full border-4 border-white ${!isAddressComplete(futureUSAddress) ? 'bg-amber-500' : 'bg-green-500'}`}></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-900">Future U.S. Address</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${!isAddressComplete(futureUSAddress) ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}`}>
                      {!isAddressComplete(futureUSAddress) ? 'Incomplete' : 'Complete'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mt-1">
                    {formatAddress(futureUSAddress)}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Where {personName} intends to live in the United States
                  </p>
                </div>
              </div>
            )}

            {/* Current Address */}
            <div className={`relative pl-8 pb-6 border-l-2 ${!isAddressComplete(currentAddress) ? 'border-amber-300 bg-amber-50/30' : 'border-green-300 bg-green-50/30'}`}>
              <div className={`absolute -left-2.5 top-0 w-5 h-5 rounded-full border-4 border-white ${!isAddressComplete(currentAddress) ? 'bg-amber-500' : 'bg-green-500'}`}></div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-900">Current Address</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${!isAddressComplete(currentAddress) ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}`}>
                    {!isAddressComplete(currentAddress) ? 'Incomplete' : 'Complete'}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mt-1">
                  {formatAddress(currentAddress)}
                </p>
                {moveInDate && (
                  <div className="flex items-center mt-2 text-xs text-gray-500">
                    <Calendar className="h-3.5 w-3.5 mr-1" />
                    Since {formatDate(moveInDate)}
                  </div>
                )}
              </div>
            </div>

            {/* Previous Addresses - Grouped */}
            {(() => {
              const isRequired = needsPreviousAddresses();
              const hasAddresses = previousAddresses.length > 0;

              // Check if any individual address is incomplete
              const hasIncompleteAddresses = hasAddresses && previousAddresses.some(addr => !isAddressComplete(addr));

              // Check if the date coverage actually reaches back 5 years
              let hasCoverageGap = false;
              if (hasAddresses && !hasIncompleteAddresses) {
                const fiveYearsAgo = new Date();
                fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);
                const lastAddress = previousAddresses[previousAddresses.length - 1];
                if (lastAddress && lastAddress.dateFrom) {
                  const oldestDate = new Date(lastAddress.dateFrom);
                  hasCoverageGap = oldestDate > fiveYearsAgo;
                } else {
                  hasCoverageGap = true; // Missing date info
                }
              }

              // Overall status: incomplete if required but missing, or if any address is incomplete, or if coverage gap exists, or if move-in date missing
              const overallIncomplete = (isRequired && !hasAddresses) || hasIncompleteAddresses || hasCoverageGap || !moveInDate;

              return (
                <div className={`relative pl-8 pb-6 border-l-2 ${overallIncomplete ? 'border-amber-300 bg-amber-50/30' : hasAddresses ? 'border-green-300 bg-green-50/30' : 'border-gray-200'}`}>
                  <div className={`absolute -left-2.5 top-0 w-5 h-5 rounded-full border-4 border-white ${overallIncomplete ? 'bg-amber-500' : hasAddresses ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-semibold text-gray-900">Previous Addresses (5 years)</p>
                      {overallIncomplete ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                          {!hasAddresses ? 'Missing' : 'Incomplete'}
                        </span>
                      ) : hasAddresses ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Complete
                        </span>
                      ) : null}
                    </div>

                    {hasAddresses ? (
                      <div className="space-y-3">
                        {previousAddresses.map((addr, index) => (
                          <div key={index} className="pl-4 border-l-2 border-gray-200">
                            <p className="text-sm font-medium text-gray-900">
                              Address #{index + 1}
                            </p>
                            <p className="text-sm text-gray-700 mt-1">{formatAddress(addr)}</p>
                            <div className="flex items-center mt-1 text-xs text-gray-500">
                              <Calendar className="h-3.5 w-3.5 mr-1" />
                              {formatDate(addr.dateFrom)} - {formatDate(addr.dateTo)}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-700 italic">
                        {isRequired
                          ? 'Previous addresses needed to complete 5-year history'
                          : 'No previous addresses in the past 5 years'}
                      </p>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* Other Places Lived Since Age 18 (Sponsor Only, Age 23+) */}
            {isSponsor && needsPlacesSince18() && (() => {
              const answer = currentData.sponsorPlacesResided_answer;

              // Check if there are COMPLETE places (not just empty entries)
              const completePlaces = placesResidedRaw.filter(place =>
                place.type && place.type.trim() !== '' &&
                place.location && place.location.trim() !== ''
              );
              const hasCompletePlaces = completePlaces.length > 0;

              // Determine status
              let status = 'missing'; // No answer provided
              if (answer === 'no') {
                status = 'complete'; // Answered no
              } else if (answer === 'yes' && hasCompletePlaces) {
                status = 'complete'; // Answered yes and provided complete places
              } else if (answer === 'yes' && !hasCompletePlaces) {
                status = 'incomplete'; // Answered yes but no complete places
              }

              const isComplete = status === 'complete';
              const statusLabel = status === 'missing' ? 'Missing' : status === 'incomplete' ? 'Incomplete' : 'Complete';

              return (
                <div className={`relative pl-8 border-l-2 ${!isComplete ? 'border-amber-300 bg-amber-50/30' : 'border-green-300 bg-green-50/30'}`}>
                  <div className={`absolute -left-2.5 top-0 w-5 h-5 rounded-full border-4 border-white ${!isComplete ? 'bg-amber-500' : 'bg-green-500'}`}></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-gray-900">Other Places Lived Since Age 18</p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${!isComplete ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}`}>
                        {statusLabel}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      States and countries where you've resided (full addresses not required)
                    </p>
                    {answer === 'no' ? (
                      <p className="text-sm text-gray-700 mt-2">
                        No other places lived since age 18
                      </p>
                    ) : hasCompletePlaces ? (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {completePlaces.map((place, index) => {
                          const displayName = place.type === 'united-states' || place.type === 'us-state'
                            ? `${place.location}, USA`
                            : place.location;
                          return (
                            <span
                              key={index}
                              className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-300"
                            >
                              {displayName}
                            </span>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-700 mt-2 italic">
                        No places provided yet
                      </p>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        {/* Call to Action - Dynamic based on validation */}
        {isComplete ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
              <p className="text-sm text-green-800">
                Everything looks good! Click <strong>Next</strong> to continue to the next section.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-0.5">
                <svg className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-amber-800">
                  We're missing some information that USCIS requires.
                </p>
                <p className="text-sm text-amber-700 mt-2">
                  The highlighted sections above show where we still need more information.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </ScreenLayout>
  );
};

export default ReviewScreen;
