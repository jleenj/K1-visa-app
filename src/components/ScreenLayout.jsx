import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';

/**
 * ScreenLayout Component
 *
 * Layout wrapper for each screen with:
 * - Navigation panel on left
 * - Content area on right
 * - Back/Next buttons at bottom
 */
const ScreenLayout = ({
  children,
  showBackButton = true,
  showNextButton = true,
  onBack,
  onNext,
  nextButtonText = 'Next',
  nextButtonDisabled = false
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1); // Browser back
    }
  };

  const handleNext = () => {
    if (onNext) {
      onNext();
    }
  };

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      {/* Content Area */}
      <div className="flex-1 overflow-y-auto bg-white">
        <div className="max-w-3xl mx-auto px-8 py-12">
          {children}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="border-t border-gray-200 bg-white px-8 py-4">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          {/* Back Button */}
          {showBackButton ? (
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
          ) : (
            <div /> // Spacer
          )}

          {/* Next Button */}
          {showNextButton && (
            <button
              onClick={handleNext}
              disabled={nextButtonDisabled}
              className={`
                flex items-center gap-2 px-6 py-2 text-sm font-medium rounded
                transition-colors
                ${nextButtonDisabled
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
                }
              `}
            >
              {nextButtonText}
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScreenLayout;
