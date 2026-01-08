import React from 'react';

/**
 * EmploymentTimelineVisual - Visual timeline bar for Section 5
 *
 * Shows a horizontal timeline bar representing 5 years of employment coverage
 * with filled segments (green) and gaps (red)
 */
const EmploymentTimelineVisual = ({ entries = [], isSponsor }) => {
  // Calculate timeline segments
  const calculateSegments = () => {
    if (entries.length === 0) {
      return { filledSegments: [], gaps: [], coverage: 0 };
    }

    const today = new Date();
    const fiveYearsAgo = new Date();
    fiveYearsAgo.setFullYear(today.getFullYear() - 5);
    const totalDuration = today - fiveYearsAgo;

    // Convert dates to position percentages
    const dateToPercent = (date) => {
      const d = new Date(date);
      if (d < fiveYearsAgo) return 0;
      if (d > today) return 100;
      return ((d - fiveYearsAgo) / totalDuration) * 100;
    };

    // Create periods from entries
    const periods = entries
      .filter(entry => entry.type && entry.startDate)
      .map(entry => {
        const start = new Date(entry.startDate);
        const end = entry.isCurrent || !entry.endDate ? today : new Date(entry.endDate);
        return {
          start,
          end,
          startPercent: dateToPercent(start),
          endPercent: dateToPercent(end),
          employer: entry.organization || entry.type
        };
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
        if (period.start <= last.end) {
          // Overlapping - merge
          if (period.end > last.end) {
            last.end = period.end;
            last.endPercent = period.endPercent;
            last.employer += ` / ${period.employer}`; // Show both employers for overlaps
          }
        } else {
          merged.push({ ...period });
        }
      }
    }

    // Calculate gaps
    const gaps = [];

    // Gap before first period
    if (merged.length > 0 && merged[0].startPercent > 0) {
      gaps.push({
        startPercent: 0,
        endPercent: merged[0].startPercent
      });
    }

    // Gaps between periods
    for (let i = 0; i < merged.length - 1; i++) {
      const currentEnd = merged[i].endPercent;
      const nextStart = merged[i + 1].startPercent;
      if (nextStart > currentEnd) {
        gaps.push({
          startPercent: currentEnd,
          endPercent: nextStart
        });
      }
    }

    // Calculate coverage percentage
    const coveredPercent = merged.reduce((sum, segment) => {
      return sum + (segment.endPercent - segment.startPercent);
    }, 0);

    return {
      filledSegments: merged,
      gaps,
      coverage: Math.round(coveredPercent)
    };
  };

  const { filledSegments, gaps, coverage } = calculateSegments();

  // Get year markers for the last 5 years
  const getYearMarkers = () => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const years = [];

    for (let i = 0; i <= 5; i++) {
      years.push(currentYear - (5 - i));
    }

    return years;
  };

  const yearMarkers = getYearMarkers();

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-semibold text-gray-700">5-Year Coverage</h4>
        <span className={`text-xs font-medium ${coverage === 100 ? 'text-green-600' : 'text-gray-600'}`}>
          {coverage}% {coverage === 100 && '✅'}
        </span>
      </div>

      {/* Timeline Bar */}
      <div className="relative h-8 bg-gray-100 rounded overflow-hidden mb-2">
        {/* Filled segments (green) */}
        {filledSegments.map((segment, index) => (
          <div
            key={`filled-${index}`}
            className="absolute h-full bg-green-500 hover:bg-green-600 transition-colors group cursor-help"
            style={{
              left: `${segment.startPercent}%`,
              width: `${segment.endPercent - segment.startPercent}%`
            }}
            title={segment.employer}
          >
            {/* Tooltip on hover */}
            <div className="invisible group-hover:visible absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap z-10">
              {segment.employer}
            </div>
          </div>
        ))}

        {/* Gap segments (red) */}
        {gaps.map((gap, index) => (
          <div
            key={`gap-${index}`}
            className="absolute h-full bg-red-400 hover:bg-red-500 transition-colors cursor-help"
            style={{
              left: `${gap.startPercent}%`,
              width: `${gap.endPercent - gap.startPercent}%`
            }}
            title="Gap in employment history"
          />
        ))}
      </div>

      {/* Year Markers */}
      <div className="relative h-6 mt-1">
        <div className="absolute inset-0 flex justify-between items-start text-xs text-gray-500">
          {yearMarkers.map((year, index) => (
            <div
              key={year}
              className={`flex flex-col items-center ${index === 0 || index === yearMarkers.length - 1 ? 'font-medium' : ''}`}
              style={{
                position: 'absolute',
                left: `${(index / (yearMarkers.length - 1)) * 100}%`,
                transform: 'translateX(-50%)'
              }}
            >
              <div className="h-2 w-px bg-gray-300 mb-0.5"></div>
              <span>{year}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-4 mt-3 text-xs text-gray-600">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span>Covered</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-red-400 rounded"></div>
          <span>Gap</span>
        </div>
      </div>

      {/* Status Message */}
      <div className="mt-3 text-xs">
        {coverage === 100 ? (
          <p className="text-green-700 bg-green-50 px-2 py-1 rounded">
            ✅ Timeline complete!
          </p>
        ) : gaps.length > 0 ? (
          <p className="text-amber-700 bg-amber-50 px-2 py-1 rounded">
            💡 {gaps.length} gap{gaps.length !== 1 ? 's' : ''} - add more periods
          </p>
        ) : (
          <p className="text-gray-600 bg-gray-50 px-2 py-1 rounded">
            Start adding employment periods
          </p>
        )}
      </div>
    </div>
  );
};

export default EmploymentTimelineVisual;
