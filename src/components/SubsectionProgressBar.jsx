import React from 'react';
import { Check } from 'lucide-react';

/**
 * SubsectionProgressBar Component (now using Question Dots)
 *
 * Displays clickable question dots showing:
 * - Current position (blue ring) - only if currentQuestionIndex is set
 * - Disqualified questions (red with !) - takes precedence over completion
 * - Completed questions (green with checkmark)
 * - Unanswered questions (gray)
 *
 * @param {Array<boolean>} completionStatus - Array of booleans indicating which questions are completed
 * @param {Array<boolean>} disqualificationStatus - Array of booleans indicating which questions have DQ selections
 * @param {number} total - Total number of questions in the subsection
 * @param {number|null} currentQuestionIndex - Index of current question (0-based), or null if not in this subsection
 * @param {function} onQuestionClick - Callback when a question dot is clicked
 */
const SubsectionProgressBar = ({
  completionStatus = [],
  disqualificationStatus = [],
  total,
  currentQuestionIndex = null,
  onQuestionClick
}) => {
  // Create array of question states
  const questions = Array.from({ length: total }, (_, index) => {
    const isCurrent = currentQuestionIndex !== null && index === currentQuestionIndex;
    const isCompleted = completionStatus[index] || false;
    const hasDisqualification = disqualificationStatus[index] || false;

    return { index, isCurrent, isCompleted, hasDisqualification };
  });

  return (
    <div className="mt-2 mb-4">
      {/* Question dots */}
      <div className="flex items-center gap-2">
        {questions.map(({ index, isCurrent, isCompleted, hasDisqualification }) => (
          <button
            key={index}
            onClick={() => onQuestionClick && onQuestionClick(index)}
            disabled={!onQuestionClick}
            className={`
              flex items-center justify-center
              transition-all duration-200
              ${isCurrent
                ? 'w-8 h-8 rounded-full bg-blue-600 ring-4 ring-blue-100'
                : hasDisqualification
                ? 'w-6 h-6 rounded-full bg-red-600 hover:ring-2 hover:ring-red-100'
                : isCompleted
                ? 'w-6 h-6 rounded-full bg-green-600 hover:ring-2 hover:ring-green-100'
                : 'w-6 h-6 rounded-full bg-gray-300 hover:bg-gray-400'
              }
              ${onQuestionClick ? 'cursor-pointer' : 'cursor-default'}
            `}
            title={`Question ${index + 1}${hasDisqualification ? ' (disqualified)' : isCompleted ? ' (completed)' : ''}${isCurrent ? ' (current)' : ''}`}
          >
            {hasDisqualification && !isCurrent ? (
              <span className="text-xs font-bold text-white">!</span>
            ) : isCompleted && !isCurrent ? (
              <Check className="h-3 w-3 text-white" />
            ) : isCurrent ? (
              <span className="text-xs font-semibold text-white">{index + 1}</span>
            ) : null}
          </button>
        ))}
      </div>

      {/* Progress text - only show if we're in this subsection */}
      {currentQuestionIndex !== null && (
        <div className="text-xs text-gray-600 mt-2">
          Question {currentQuestionIndex + 1} of {total}
        </div>
      )}
    </div>
  );
};

export default SubsectionProgressBar;
