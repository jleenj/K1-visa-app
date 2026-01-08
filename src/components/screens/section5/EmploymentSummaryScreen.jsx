import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ScreenLayout from '../../ScreenLayout';
import { getNextScreen, getPreviousScreen, isFirstScreen } from '../../../utils/navigationUtils';
import { Calendar, CheckCircle } from 'lucide-react';
import { addressFormats } from '../../../utils/FieldRenderer';

/**
 * EmploymentSummaryScreen - Section 5, Employment History Summary
 *
 * Shows a visual timeline/summary of all employment periods
 * Matches the format of Address ReviewScreen with vertical timeline
 */
const EmploymentSummaryScreen = ({
  currentData,
  updateField,
  userRole
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine if this is sponsor or beneficiary based on URL
  const isSponsor = location.pathname.includes('section-5-employment') &&
                    !location.pathname.includes('beneficiary');
  const personName = isSponsor ? 'You' : (currentData.beneficiaryFirstName || "Beneficiary");

  // Get timeline entries
  const timelineEntriesField = isSponsor ? 'sponsorTimelineEntries' : 'beneficiaryTimelineEntries';
  const entries = (currentData[timelineEntriesField] || []).filter(entry => entry.type);

  // DEBUG: Log actual data
  console.log('=== EMPLOYMENT SUMMARY DEBUG ===');
  console.log('Total entries:', entries.length);
  entries.forEach((entry, index) => {
    console.log(`\nEntry ${index}:`, {
      type: entry.type,
      organization: entry.organization,
      jobTitle: entry.jobTitle,
      startDate: entry.startDate,
      endDate: entry.endDate,
      isCurrent: entry.isCurrent,
      country: entry.country,
      streetAddress: entry.streetAddress,
      city: entry.city,
      state: entry.state,
      zipCode: entry.zipCode
    });
  });

  // Format date
  const formatDate = (dateStr) => {
    if (!dateStr) return 'Not specified';
    const date = new Date(dateStr);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  // Format gap duration in days/weeks/months/years
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

  // Format a date object for display
  const formatDisplayDate = (date) => {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  // Get a short, intuitive name for an entry to use in gap messages
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

  // OPTION 1: Date range focused - shows exact dates where coverage is missing
  const formatGapOption1 = (gap) => {
    const duration = formatGapDuration(gap.days);
    return `${duration} missing from ${formatDisplayDate(gap.start)} to ${formatDisplayDate(gap.end)}`;
  };

  // OPTION 2: Between companies - identifies which positions the gap falls between
  const formatGapOption2 = (gap, entries) => {
    const duration = formatGapDuration(gap.days);

    // Find which entries this gap is between
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

    // Fallback: no entries found (shouldn't happen but just in case)
    return `${duration} missing from ${formatDisplayDate(gap.start)} to ${formatDisplayDate(gap.end)}`;
  };

  // OPTION 3: Compact format - duration with date range in parentheses
  const formatGapOption3 = (gap) => {
    const duration = formatGapDuration(gap.days);
    return `${duration} (${formatDisplayDate(gap.start)} - ${formatDisplayDate(gap.end)})`;
  };

  // Helper: Check if an entry has all required fields complete
  const isEntryComplete = (entry, index) => {
    const reasons = [];

    // Type and Start Date are always required
    if (!entry.type) reasons.push('missing type');
    if (!entry.startDate) reasons.push('missing startDate');
    if (!entry.type || !entry.startDate) {
      console.log(`Entry ${index} incomplete:`, reasons);
      return false;
    }

    // End Date is required unless current (first entry is always current)
    const isCurrentEntry = index === 0 || entry.isCurrent;
    if (!isCurrentEntry && !entry.endDate) {
      reasons.push('missing endDate (not current)');
      console.log(`Entry ${index} incomplete:`, reasons);
      return false;
    }

    // Organization is required for: working, in-education, military, seeking-work, retired, other
    // (I-129F requires "Your Occupation (specify)" for all employment types)
    if ((entry.type === 'working' || entry.type === 'in-education' || entry.type === 'military' || entry.type === 'seeking-work' || entry.type === 'retired' || entry.type === 'other') && !entry.organization) {
      reasons.push(`missing organization for type ${entry.type}`);
      console.log(`Entry ${index} incomplete:`, reasons);
      return false;
    }

    // Job Title is required for: working, military, in-education
    if ((entry.type === 'working' || entry.type === 'military' || entry.type === 'in-education') && !entry.jobTitle) {
      reasons.push(`missing jobTitle for type ${entry.type}`);
      console.log(`Entry ${index} incomplete:`, reasons);
      return false;
    }

    // Employer Address is required for all types
    if (!entry.country) {
      reasons.push('missing country');
      console.log(`Entry ${index} incomplete:`, reasons);
      return false;
    }
    if (!entry.streetAddress) {
      reasons.push('missing streetAddress');
      console.log(`Entry ${index} incomplete:`, reasons);
      return false;
    }
    if (!entry.city) {
      reasons.push('missing city');
      console.log(`Entry ${index} incomplete:`, reasons);
      return false;
    }
    if (!entry.zipCode) {
      reasons.push('missing zipCode');
      console.log(`Entry ${index} incomplete:`, reasons);
      return false;
    }

    // State is required for US and countries with state/province fields
    if (entry.country === 'United States' && !entry.state) {
      reasons.push('missing state (US address)');
      console.log(`Entry ${index} incomplete:`, reasons);
      return false;
    }

    const countryFormat = addressFormats[entry.country];
    if (countryFormat && !countryFormat.provinceNA && (countryFormat.states || countryFormat.provinceLabel)) {
      if (!entry.state) {
        reasons.push(`missing state/province for ${entry.country}`);
        console.log(`Entry ${index} incomplete:`, reasons);
        return false;
      }
    }

    console.log(`Entry ${index} COMPLETE ✓`);
    return true;
  };

  // Calculate coverage and gaps - ONLY count complete entries
  const calculateCoverage = () => {
    if (entries.length === 0) {
      console.log('No entries - 0% coverage');
      return { gaps: [], complete: false, coveragePercent: 0 };
    }

    const today = new Date();
    const fiveYearsAgo = new Date();
    fiveYearsAgo.setFullYear(today.getFullYear() - 5);
    console.log('Coverage window:', fiveYearsAgo.toISOString(), 'to', today.toISOString());

    // For gap calculation, use entries that have valid dates (regardless of other missing fields)
    // This ensures we calculate coverage based on time periods, not field completeness
    const entriesWithDates = entries.filter(entry => entry.startDate);
    console.log(`Entries with dates: ${entriesWithDates.length} out of ${entries.length}`);

    // If no entries with dates, return 0% coverage
    if (entriesWithDates.length === 0) {
      console.log('No entries with dates - 0% coverage');
      return { gaps: [], complete: false, coveragePercent: 0, completeEntries: [] };
    }

    // Create periods from entries with dates, clamped to 5-year window
    const periods = entriesWithDates.map((entry, originalIndex) => {
      // Find original index in full entries array for proper isCurrent check
      const entryIndex = entries.findIndex(e => e === entry);
      let start = new Date(entry.startDate);
      // First entry (index 0 in original entries array) is always current
      const isCurrentEntry = entryIndex === 0 || entry.isCurrent;
      let end = isCurrentEntry || !entry.endDate ? today : new Date(entry.endDate);

      // Clamp start date to not be earlier than 5 years ago
      if (start < fiveYearsAgo) {
        start = fiveYearsAgo;
      }

      // Clamp end date to not be later than today
      if (end > today) {
        end = today;
      }

      return { start, end, entry };
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
          // Overlapping - extend the last period if needed
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

    // Calculate coverage percentage using calendar days
    const totalDuration = today - fiveYearsAgo;
    const totalDays = Math.ceil(totalDuration / oneDayMs);

    // Sum up gap days (using the calendar day count we calculated)
    const gapDays = gaps.reduce((sum, gap) => sum + gap.days, 0);

    // Coverage = (total days - gap days) / total days
    // If there are ANY gaps, don't round up to 100% (floor instead of round)
    const exactCoverage = ((totalDays - gapDays) / totalDays) * 100;
    const coveragePercent = gaps.length > 0 ? Math.floor(exactCoverage) : Math.round(exactCoverage);

    console.log('Coverage calculation:', {
      totalDays,
      gapDays,
      gapCount: gaps.length,
      coveragePercent,
      gapsDetail: gaps.map(g => ({
        days: g.days,
        start: g.start.toISOString(),
        end: g.end.toISOString()
      }))
    });

    return { gaps, complete: gaps.length === 0, coveragePercent, entriesWithDates };
  };

  const coverage = calculateCoverage();
  console.log('Coverage result:', {
    coveragePercent: coverage.coveragePercent,
    complete: coverage.complete,
    gapsCount: coverage.gaps.length,
    gaps: coverage.gaps
  });

  // Get list of incomplete entries with helpful identifiers
  const getIncompleteEntries = () => {
    return entries
      .map((entry, originalIndex) => ({ entry, originalIndex }))
      .filter(({ entry, originalIndex }) => !isEntryComplete(entry, originalIndex))
      .map(({ entry, originalIndex }) => {
        // For current position (original index 0 in the entries array)
        const isCurrent = originalIndex === 0 || entry.isCurrent;

        // Try to get a meaningful name
        if (entry.organization) {
          return entry.organization;
        }

        // Fallback to position-based identifier
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

        // Last resort: use entry number (use original index)
        return `employment entry #${originalIndex + 1}`;
      });
  };

  const incompleteEntryNames = getIncompleteEntries();
  const hasIncompleteEntries = incompleteEntryNames.length > 0;
  console.log('Has incomplete entries:', hasIncompleteEntries, incompleteEntryNames);

  // Validate overall completion
  const validateEmploymentHistory = () => {
    const issues = [];

    if (entries.length === 0) {
      issues.push('employment history');
      return issues;
    }

    if (hasIncompleteEntries) {
      issues.push('employment entries with incomplete information');
      console.log('Adding issue: incomplete entries');
    }

    if (coverage.gaps.length > 0) {
      issues.push('gaps in 5-year coverage');
      console.log('Adding issue: gaps exist', coverage.gaps);
    }

    return issues;
  };

  const validationIssues = validateEmploymentHistory();
  const isComplete = validationIssues.length === 0;
  console.log('Validation issues:', validationIssues);
  console.log('Is complete:', isComplete);

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

  // Helper to get display info for employment entry
  const getEmploymentDisplay = (entry) => {
    const typeDisplayNames = {
      'working': entry.organization || '⚠️ Missing Company Name',
      'seeking-work': entry.organization ? 'Seeking Work' : '⚠️ Missing Description',
      'in-education': entry.organization || '⚠️ Missing School/Institution Name',
      'homemaker': 'Homemaker',
      'retired': 'Retired',
      'unable-to-work': 'Unable to Work',
      'military': entry.organization || '⚠️ Missing Military Branch',
      'other': 'Other/Personal Time'
    };

    const typeIcons = {
      'working': '💼',
      'in-education': '📚',
      'seeking-work': '🔍',
      'homemaker': '🏠',
      'retired': '🌴',
      'unable-to-work': '🏥',
      'military': '🪖',
      'other': '📝'
    };

    return {
      name: typeDisplayNames[entry.type] || entry.type,
      icon: typeIcons[entry.type] || '📝'
    };
  };

  // Helper to format and validate address
  const getAddressDisplay = (entry) => {
    const missingFields = [];

    if (!entry.country) missingFields.push('Country');
    if (!entry.streetAddress) missingFields.push('Street Address');
    if (!entry.city) missingFields.push('City');
    if (!entry.zipCode) missingFields.push('Postal Code');

    // Check if state is required
    if (entry.country === 'United States' && !entry.state) {
      missingFields.push('State');
    } else if (entry.country) {
      const countryFormat = addressFormats[entry.country];
      if (countryFormat && !countryFormat.provinceNA && (countryFormat.states || countryFormat.provinceLabel)) {
        if (!entry.state) {
          missingFields.push(countryFormat.provinceLabel || 'Province');
        }
      }
    }

    // If there are missing fields, return warning message
    if (missingFields.length > 0) {
      return `⚠️ Missing: ${missingFields.join(', ')}`;
    }

    // Format complete address
    const parts = [entry.streetAddress];
    if (entry.unitType && entry.unitNumber) {
      parts[0] += ` ${entry.unitType} ${entry.unitNumber}`;
    }
    parts.push(entry.city);
    if (entry.state) {
      parts.push(entry.state);
    }
    parts.push(entry.zipCode);
    parts.push(entry.country);

    return parts.join(', ');
  };

  // Sort entries (current first, then by start date descending)
  const sortedEntries = [...entries].sort((a, b) => {
    const aIsCurrent = a.isCurrent || !a.endDate;
    const bIsCurrent = b.isCurrent || !b.endDate;

    if (aIsCurrent && !bIsCurrent) return -1;
    if (!aIsCurrent && bIsCurrent) return 1;

    const aStartDate = new Date(a.startDate || '1970-01-01');
    const bStartDate = new Date(b.startDate || '1970-01-01');
    return bStartDate - aStartDate;
  });

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
            Employment Summary
          </h2>
        </div>

        {/* Timeline entries - no nested boxes */}
        {(() => {
          const hasEntries = entries.length > 0;
          const overallIncomplete = !hasEntries || hasIncompleteEntries || coverage.gaps.length > 0;

          return (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-base font-semibold text-gray-900 mb-4">5-year timeline</h3>
              <div className="space-y-4">
                {/* Employment Entries */}
                {hasEntries ? (
                  <div className="space-y-3">
                    {sortedEntries.map((entry, index) => {
                      const display = getEmploymentDisplay(entry);
                      const isCurrent = entry.isCurrent || !entry.endDate;
                      const entryIncomplete = !isEntryComplete(entry, entries.findIndex(e => e === entry));

                      return (
                        <div key={index} className={`pl-4 border-l-2 ${entryIncomplete ? 'border-amber-300 bg-amber-50/30' : 'border-gray-200'}`}>
                              <div className="flex items-start justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="text-base">{display.icon}</span>
                                  <p className="text-sm font-medium text-gray-900">
                                    {display.name}
                                  </p>
                                  {isCurrent && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                      Current
                                    </span>
                                  )}
                                </div>
                              </div>
                              {/* Job Title - show if present, or show missing message for working/military/education types */}
                              {(entry.type === 'working' || entry.type === 'military' || entry.type === 'in-education') && (
                                <p className="text-sm text-gray-600 mt-1 ml-6">
                                  {entry.jobTitle || '⚠️ Missing Job Title'}
                                </p>
                              )}
                              {/* Description - show for retired/other types */}
                              {(entry.type === 'retired' || entry.type === 'other') && (
                                <p className="text-sm text-gray-600 mt-1 ml-6">
                                  {entry.organization || '⚠️ Missing Description'}
                                </p>
                              )}
                              {/* Address - always show */}
                              <p className="text-sm text-gray-600 mt-1 ml-6">
                                📍 {getAddressDisplay(entry)}
                              </p>
                              {/* Dates - with warning if missing */}
                              <div className="flex items-center mt-1 ml-6 text-xs">
                                <Calendar className="h-3.5 w-3.5 mr-1" />
                                <span className={!entry.startDate ? 'text-red-600 font-medium' : 'text-gray-500'}>
                                  {entry.startDate ? formatDate(entry.startDate) : '⚠️ Missing Start Date'}
                                </span>
                                <span className="mx-1 text-gray-500">→</span>
                                {isCurrent ? (
                                  <span className="text-gray-500">Present</span>
                                ) : (
                                  <span className={!entry.endDate ? 'text-red-600 font-medium' : 'text-gray-500'}>
                                    {entry.endDate ? formatDate(entry.endDate) : '⚠️ Missing End Date'}
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-700 italic">
                        Employment history needed to complete 5-year requirement
                      </p>
                    )}

                    {/* Coverage Percentage */}
                    {hasEntries && (
                      <div className="mt-4 pt-3 border-t border-gray-200">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600">5-year coverage:</span>
                          <span className={`font-medium ${coverage.complete ? 'text-green-600' : 'text-amber-600'}`}>
                            {coverage.coveragePercent}% {coverage.complete && '✅'}
                          </span>
                        </div>
                      </div>
                )}
              </div>
            </div>
          );
        })()}

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
                <ul className="text-sm text-amber-700 mt-2 ml-5 space-y-1 list-disc">
                  {entries.length === 0 && (
                    <li>You need to add at least one employment entry to cover the last 5 years</li>
                  )}
                  {hasIncompleteEntries && incompleteEntryNames.map((name, index) => (
                    <li key={index}>Complete required fields for {name}</li>
                  ))}
                  {coverage.gaps.length > 0 && (
                    coverage.gaps.length === 1 ? (
                      <li>Account for all time in the last 5 years: {formatGapOption2(coverage.gaps[0], coverage.entriesWithDates || [])}</li>
                    ) : (
                      <li>
                        <div>Account for all time in the last 5 years:</div>
                        <ul className="ml-5 mt-1 space-y-0.5" style={{ listStyleType: 'circle', paddingLeft: '1.25rem' }}>
                          {coverage.gaps.map((gap, index) => (
                            <li key={index} style={{ display: 'list-item' }}>
                              {formatGapOption2(gap, coverage.entriesWithDates || [])}
                            </li>
                          ))}
                        </ul>
                      </li>
                    )
                  )}
                </ul>
                <p className="text-sm text-amber-700 mt-3">
                  Click <strong>Back</strong> to add or edit employment entries.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </ScreenLayout>
  );
};

export default EmploymentSummaryScreen;
