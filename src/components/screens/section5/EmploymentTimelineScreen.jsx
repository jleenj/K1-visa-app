import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ScreenLayout from '../../ScreenLayout';
import FieldRenderer, { addressFormats } from '../../../utils/FieldRenderer';
import { getNextScreen, getPreviousScreen, isFirstScreen } from '../../../utils/navigationUtils';

/**
 * EmploymentTimelineScreen - Section 5, Employment History (5 Years)
 *
 * Shows:
 * - Help text about 5-year employment history requirements
 * - Chronological timeline for adding employment periods
 * - Timeline summary showing gaps and coverage
 */
const EmploymentTimelineScreen = ({
  currentData,
  updateField,
  fieldErrors,
  setFieldErrors,
  touchedFields,
  setTouchedFields,
  userRole
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Helper: Format gap duration in human-readable form
  const formatGapDuration = (days) => {
    if (days === 1) return '1 day';
    if (days < 7) return `${days} days`;
    if (days < 30) {
      const weeks = Math.floor(days / 7);
      const remainingDays = days % 7;
      if (remainingDays === 0) return `${weeks} ${weeks === 1 ? 'week' : 'weeks'}`;
      return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} and ${remainingDays} ${remainingDays === 1 ? 'day' : 'days'}`;
    }
    if (days < 365) {
      const months = Math.floor(days / 30);
      return `${months} ${months === 1 ? 'month' : 'months'}`;
    }
    const years = Math.floor(days / 365);
    const remainingMonths = Math.floor((days % 365) / 30);
    if (remainingMonths === 0) return `${years} ${years === 1 ? 'year' : 'years'}`;
    return `${years} ${years === 1 ? 'year' : 'years'} and ${remainingMonths} ${remainingMonths === 1 ? 'month' : 'months'}`;
  };

  // Helper: Format date for display
  const formatDisplayDate = (date) => {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  // Helper: Get a short, intuitive name for an entry to use in gap messages
  const getShortEntryName = (entry) => {
    const shortTypeNames = {
      'working': entry.organization || 'previous job',
      'seeking-work': 'job search period',
      'in-education': entry.organization || 'school',
      'homemaker': 'homemaker period',
      'retired': 'Retired',
      'unable-to-work': 'unable to work period',
      'military': entry.organization || 'military service',
      'other': 'Other/Personal Time'
    };

    return shortTypeNames[entry.type] || entry.organization || entry.type;
  };

  // Helper: Format gap message showing what the gap falls between
  const formatGapOption2 = (gap, entries) => {
    const duration = formatGapDuration(gap.days);

    let beforeEntry = null;
    let afterEntry = null;

    entries.forEach(entry => {
      if (!entry.startDate) return;
      const entryStart = new Date(entry.startDate);
      const entryEnd = entry.endDate ? new Date(entry.endDate) : new Date();

      if (entryEnd <= gap.start) {
        if (!beforeEntry || entryEnd > new Date(beforeEntry.endDate || 0)) {
          beforeEntry = entry;
        }
      }
      if (entryStart >= gap.end) {
        if (!afterEntry || entryStart < new Date(afterEntry.startDate)) {
          afterEntry = entry;
        }
      }
    });

    if (beforeEntry && afterEntry) {
      const beforeName = getShortEntryName(beforeEntry);
      const afterName = getShortEntryName(afterEntry);
      return `${duration} missing between ${beforeName} and ${afterName}`;
    } else if (afterEntry) {
      const afterName = getShortEntryName(afterEntry);
      return `${duration} missing before ${afterName} (${formatDisplayDate(gap.start)} - ${formatDisplayDate(gap.end)})`;
    } else if (beforeEntry) {
      const beforeName = getShortEntryName(beforeEntry);
      return `${duration} missing after ${beforeName} (${formatDisplayDate(gap.start)} - ${formatDisplayDate(gap.end)})`;
    }

    return `${duration} missing from ${formatDisplayDate(gap.start)} to ${formatDisplayDate(gap.end)}`;
  };

  // Helper: Check if an entry has all required fields complete
  const isEntryComplete = (entry, index) => {
    const reasons = [];

    if (!entry.type) reasons.push('missing type');
    if (!entry.startDate) reasons.push('missing startDate');
    if (!entry.type || !entry.startDate) {
      return false;
    }

    const isCurrentEntry = index === 0 || entry.isCurrent;
    if (!isCurrentEntry && !entry.endDate) {
      reasons.push('missing endDate (not current)');
      return false;
    }

    if ((entry.type === 'working' || entry.type === 'in-education' || entry.type === 'military' || entry.type === 'seeking-work' || entry.type === 'retired' || entry.type === 'other') && !entry.organization) {
      reasons.push(`missing organization for type ${entry.type}`);
      return false;
    }

    if ((entry.type === 'working' || entry.type === 'military' || entry.type === 'in-education') && !entry.jobTitle) {
      reasons.push(`missing jobTitle for type ${entry.type}`);
      return false;
    }

    if (!entry.country) {
      reasons.push('missing country');
      return false;
    }
    if (!entry.streetAddress) {
      reasons.push('missing streetAddress');
      return false;
    }
    if (!entry.city) {
      reasons.push('missing city');
      return false;
    }
    if (!entry.zipCode) {
      reasons.push('missing zipCode');
      return false;
    }

    if (entry.country === 'United States' && !entry.state) {
      reasons.push('missing state (US address)');
      return false;
    }

    const countryFormat = addressFormats[entry.country];
    if (countryFormat && !countryFormat.provinceNA && (countryFormat.states || countryFormat.provinceLabel)) {
      if (!entry.state) {
        reasons.push(`missing state/province for ${entry.country}`);
        return false;
      }
    }

    return true;
  };

  // Helper: Get list of incomplete entries with helpful identifiers
  const getIncompleteEntries = () => {
    return entries
      .map((entry, originalIndex) => ({ entry, originalIndex }))
      .filter(({ entry, originalIndex }) => !isEntryComplete(entry, originalIndex))
      .map(({ entry, originalIndex }) => {
        const isCurrent = originalIndex === 0 || entry.isCurrent;

        if (entry.organization) {
          return entry.organization;
        }

        if (isCurrent) {
          return 'your current position';
        }

        if (entry.startDate) {
          const startDate = new Date(entry.startDate);
          const endDate = entry.endDate ? new Date(entry.endDate) : null;
          const formatMonthYear = (date) => {
            const options = { month: 'short', year: 'numeric' };
            return date.toLocaleDateString('en-US', options);
          };

          if (endDate) {
            return `your position from ${formatMonthYear(startDate)} - ${formatMonthYear(endDate)}`;
          } else {
            return `your position starting ${formatMonthYear(startDate)}`;
          }
        }

        return `employment entry #${originalIndex + 1}`;
      });
  };

  // Determine if this is sponsor or beneficiary based on URL
  const isSponsor = location.pathname.includes('section-5-employment') &&
                    !location.pathname.includes('beneficiary');
  const prefix = isSponsor ? 'sponsor' : 'beneficiary';
  const personName = isSponsor
    ? (currentData.sponsorFirstName || 'You')
    : (currentData.beneficiaryFirstName || 'Beneficiary');

  // Get field definitions
  const fields = [
    {
      id: `${prefix}HelpText`,
      type: 'info-panel',
      label: '📋 Work History Instructions\n\nUSCIS requires a complete 5-year employment history with no unexplained gaps. Overlapping periods are perfectly acceptable for situations like part-time work alongside full-time employment, consulting while employed, or transitional periods between jobs.',
      hideLabel: true
    },
    {
      id: `${prefix}Timeline`,
      label: '5-Year Work History',
      type: 'chronological-timeline',
      required: true
    }
  ];

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

  // Validation: Check if 5-year timeline is complete with no gaps
  const isFormValid = () => {
    const timelineEntriesField = isSponsor ? 'sponsorTimelineEntries' : 'beneficiaryTimelineEntries';
    const entries = currentData[timelineEntriesField] || [];

    // Must have at least one entry with a type
    const validEntries = entries.filter(entry => entry.type);
    if (validEntries.length === 0) return false;

    // Check if all entries have required fields
    const allEntriesComplete = validEntries.every((entry, index) => {
      // Type and Start Date are always required
      if (!entry.type || !entry.startDate) return false;

      // End Date is required unless current (first entry is always current)
      const isCurrentEntry = index === 0 || entry.isCurrent;
      if (!isCurrentEntry && !entry.endDate) return false;

      // Organization is required for: working, in-education, military, seeking-work, retired, other
      if ((entry.type === 'working' || entry.type === 'in-education' || entry.type === 'military' || entry.type === 'seeking-work' || entry.type === 'retired' || entry.type === 'other') && !entry.organization) return false;

      // Job Title is required for: working, military, in-education
      if ((entry.type === 'working' || entry.type === 'military' || entry.type === 'in-education') && !entry.jobTitle) return false;

      // Employer Address is required for all types: country, streetAddress, city, state (if applicable), zipCode
      if (!entry.country) return false;
      if (!entry.streetAddress) return false;
      if (!entry.city) return false;
      if (!entry.zipCode) return false;

      // State is required for US and countries with state/province fields
      if (entry.country === 'United States' && !entry.state) return false;

      // Check if other countries require state/province
      const countryFormat = addressFormats[entry.country];
      if (countryFormat && !countryFormat.provinceNA && (countryFormat.states || countryFormat.provinceLabel)) {
        if (!entry.state) return false;
      }

      return true;
    });

    if (!allEntriesComplete) return false;

    // Check for complete 5-year coverage (no gaps)
    const calculateTimelineCoverage = (entries) => {
      if (entries.length === 0) return { gaps: [] };

      const today = new Date();
      const fiveYearsAgo = new Date();
      fiveYearsAgo.setFullYear(today.getFullYear() - 5);

      // Filter out entries with invalid dates
      const validEntries = entries.filter((entry, index) => {
        if (!entry.startDate) return false;
        // First entry (index 0) is always current
        const isCurrentEntry = index === 0 || entry.isCurrent;
        if (!isCurrentEntry && !entry.endDate) return false;
        return true;
      });

      if (validEntries.length === 0) return { gaps: [] };

      // Create periods from entries, clamped to 5-year window
      const periods = validEntries.map((entry, index) => {
        let start = new Date(entry.startDate);
        // First entry (index 0) is always current
        const isCurrentEntry = index === 0 || entry.isCurrent;
        let end = isCurrentEntry || !entry.endDate ? today : new Date(entry.endDate);

        // Clamp start date to not be earlier than 5 years ago
        if (start < fiveYearsAgo) {
          start = fiveYearsAgo;
        }

        // Clamp end date to not be later than today
        if (end > today) {
          end = today;
        }

        return { start, end };
      });

      // Sort periods by start date
      periods.sort((a, b) => a.start - b.start);

      // Merge overlapping periods
      const merged = [];
      for (const period of periods) {
        if (merged.length === 0) {
          merged.push({ ...period });
        } else {
          const last = merged[merged.length - 1];
          // Check if periods overlap (period starts before or when last ends)
          if (period.start <= last.end) {
            // Overlapping - extend if needed
            if (period.end > last.end) {
              last.end = period.end;
            }
          } else {
            // No overlap - add as new period
            merged.push({ ...period });
          }
        }
      }

      // Find gaps - count calendar days between employment periods
      const gaps = [];
      const oneDayMs = 24 * 60 * 60 * 1000;

      // Helper: Calculate calendar days between two dates
      // If last day worked is Dec 30 and next job starts Jan 1, gap = 1 day (Dec 31)
      // If dates are adjacent (Dec 31 → Jan 1), gap = 0 days
      const getCalendarDaysBetween = (endDate, startDate) => {
        // Move end date to start of next day (first uncovered day)
        const nextDayAfterEnd = new Date(endDate);
        nextDayAfterEnd.setDate(nextDayAfterEnd.getDate() + 1);
        nextDayAfterEnd.setHours(0, 0, 0, 0);

        // Normalize start date to start of day
        const startOfStartDate = new Date(startDate);
        startOfStartDate.setHours(0, 0, 0, 0);

        // Calculate difference in days
        const diffMs = startOfStartDate - nextDayAfterEnd;
        const diffDays = Math.floor(diffMs / oneDayMs);

        return diffDays;
      };

      // Gap before first period
      if (merged.length > 0) {
        const gapDays = getCalendarDaysBetween(fiveYearsAgo, merged[0].start);
        if (gapDays > 0) {
          gaps.push({
            start: fiveYearsAgo,
            end: merged[0].start,
            days: gapDays
          });
        }
      }

      // Gaps between periods
      for (let i = 0; i < merged.length - 1; i++) {
        const gapDays = getCalendarDaysBetween(merged[i].end, merged[i + 1].start);
        if (gapDays > 0) {
          gaps.push({
            start: merged[i].end,
            end: merged[i + 1].start,
            days: gapDays
          });
        }
      }

      return { gaps };
    };

    const coverage = calculateTimelineCoverage(validEntries);
    return coverage.gaps.length === 0;
  };

  // Get validation status for banner
  const timelineEntriesField = isSponsor ? 'sponsorTimelineEntries' : 'beneficiaryTimelineEntries';
  const entries = currentData[timelineEntriesField] || [];
  const validEntries = entries.filter(entry => entry.type);

  const hasIncompleteFields = validEntries.some((entry, index) => {
    if (!entry.type || !entry.startDate) return true;
    const isCurrentEntry = index === 0 || entry.isCurrent;
    if (!isCurrentEntry && !entry.endDate) return true;
    if ((entry.type === 'working' || entry.type === 'in-education' || entry.type === 'military' || entry.type === 'seeking-work' || entry.type === 'retired' || entry.type === 'other') && !entry.organization) return true;
    if ((entry.type === 'working' || entry.type === 'military' || entry.type === 'in-education') && !entry.jobTitle) return true;
    if (!entry.country || !entry.streetAddress || !entry.city || !entry.zipCode) return true;
    if (entry.country === 'United States' && !entry.state) return true;
    const countryFormat = addressFormats[entry.country];
    if (countryFormat && !countryFormat.provinceNA && (countryFormat.states || countryFormat.provinceLabel) && !entry.state) return true;
    return false;
  });

  const calculateTimelineCoverage = (entries) => {
    if (entries.length === 0) return { gaps: [] };
    const today = new Date();
    const fiveYearsAgo = new Date();
    fiveYearsAgo.setFullYear(today.getFullYear() - 5);
    const validDateEntries = entries.filter((entry, index) => {
      if (!entry.startDate) return false;
      const isCurrentEntry = index === 0 || entry.isCurrent;
      if (!isCurrentEntry && !entry.endDate) return false;
      return true;
    });
    if (validDateEntries.length === 0) return { gaps: [] };
    const periods = validDateEntries.map((entry, index) => {
      let start = new Date(entry.startDate);
      const isCurrentEntry = index === 0 || entry.isCurrent;
      let end = isCurrentEntry || !entry.endDate ? today : new Date(entry.endDate);
      if (start < fiveYearsAgo) start = fiveYearsAgo;
      if (end > today) end = today;
      return { start, end };
    });
    periods.sort((a, b) => a.start - b.start);
    const merged = [];
    for (const period of periods) {
      if (merged.length === 0) {
        merged.push({ ...period });
      } else {
        const last = merged[merged.length - 1];
        if (period.start <= last.end) {
          if (period.end > last.end) last.end = period.end;
        } else {
          merged.push({ ...period });
        }
      }
    }
    const gaps = [];
    const oneDayMs = 24 * 60 * 60 * 1000;

    // Helper: Calculate calendar days between two dates
    const getCalendarDaysBetween = (endDate, startDate) => {
      const nextDayAfterEnd = new Date(endDate);
      nextDayAfterEnd.setDate(nextDayAfterEnd.getDate() + 1);
      nextDayAfterEnd.setHours(0, 0, 0, 0);
      const startOfStartDate = new Date(startDate);
      startOfStartDate.setHours(0, 0, 0, 0);
      const diffMs = startOfStartDate - nextDayAfterEnd;
      const diffDays = Math.floor(diffMs / oneDayMs);
      return diffDays;
    };

    if (merged.length > 0) {
      const gapDays = getCalendarDaysBetween(fiveYearsAgo, merged[0].start);
      if (gapDays > 0) {
        gaps.push({
          start: fiveYearsAgo,
          end: merged[0].start,
          days: gapDays
        });
      }
    }
    for (let i = 0; i < merged.length - 1; i++) {
      const gapDays = getCalendarDaysBetween(merged[i].end, merged[i + 1].start);
      if (gapDays > 0) {
        gaps.push({
          start: merged[i].end,
          end: merged[i + 1].start,
          days: gapDays
        });
      }
    }
    return { gaps };
  };

  const coverage = validEntries.length > 0 ? calculateTimelineCoverage(validEntries) : { gaps: [] };
  const hasGaps = coverage.gaps.length > 0;

  // Store incomplete status for NavigationPanel "!" indicator
  const isIncomplete = hasGaps || validEntries.length === 0;
  const incompleteFieldName = isSponsor ? 'section5_sponsor_incomplete' : 'section5_beneficiary_incomplete';
  if (currentData[incompleteFieldName] !== isIncomplete) {
    updateField(incompleteFieldName, isIncomplete);
  }

  const incompleteEntryNames = getIncompleteEntries();
  const hasIncompleteEntries = incompleteEntryNames.length > 0;

  return (
    <ScreenLayout
      showBackButton={!isFirst}
      onBack={handleBack}
      onNext={handleNext}
      nextButtonDisabled={!isFormValid()}
    >
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900">
          {isSponsor ? 'Your Employment History' : `${personName}'s Employment History`}
        </h2>

        {/* Render fields */}
        {fields.map((field) => {
          // Check showWhen condition if exists
          if (field.showWhen && !field.showWhen(currentData)) {
            return null;
          }

          return (
            <div key={field.id}>
              {!field.hideLabel && (
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
              )}

              <FieldRenderer
                field={field}
                currentData={currentData}
                updateField={updateField}
                fieldErrors={fieldErrors}
                setFieldErrors={setFieldErrors}
                touchedFields={touchedFields}
                setTouchedFields={setTouchedFields}
              />
            </div>
          );
        })}

        {/* Validation Banner - Bottom */}
        {(hasIncompleteEntries || hasGaps) && (
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
                <ul className="text-sm text-amber-700 mt-2 ml-5 space-y-1 list-disc">
                  {entries.length === 0 && (
                    <li>You need to add at least one employment entry to cover the last 5 years</li>
                  )}
                  {hasIncompleteEntries && incompleteEntryNames.map((name, index) => (
                    <li key={index}>Complete required fields for {name}</li>
                  ))}
                  {coverage.gaps.length > 0 && (
                    coverage.gaps.length === 1 ? (
                      <li>Account for all time in the last 5 years: {formatGapOption2(coverage.gaps[0], validEntries)}</li>
                    ) : (
                      <li>
                        <div>Account for all time in the last 5 years:</div>
                        <ul className="ml-5 mt-1 space-y-0.5" style={{ listStyleType: 'circle', paddingLeft: '1.25rem' }}>
                          {coverage.gaps.map((gap, index) => (
                            <li key={index} style={{ display: 'list-item' }}>
                              {formatGapOption2(gap, validEntries)}
                            </li>
                          ))}
                        </ul>
                      </li>
                    )
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </ScreenLayout>
  );
};

export default EmploymentTimelineScreen;
