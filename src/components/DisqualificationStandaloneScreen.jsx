import React from 'react';
import { AlertTriangle, Mail, Phone, ArrowLeft } from 'lucide-react';

const DisqualificationStandaloneScreen = ({
  reason = "Your situation requires individual review by our team.",
  reasons = null, // Array of multiple DQ reasons
  onGoBack,
  supportEmail = "support@evernestusa.com",
  supportPhone = "+1 (555) 123-4567"
}) => {
  console.log('DisqualificationStandaloneScreen rendering');
  console.log('Props:', { reason, reasons });

  // If multiple DQ reasons, show consolidated message
  const hasMultipleReasons = reasons && reasons.length > 1;

  const consolidatedMessage = `Based on your answers in multiple areas, the K-1 visa may not be the best option for your situation.

USCIS carefully reviews applicants' backgrounds across several factors including criminal history, immigration issues, health requirements, and security concerns. Your responses indicate areas that require in-depth review and personalized legal guidance.

Please contact our support team for further assistance.`;

  // Use consolidated message for multiple DQs, otherwise use provided reasons
  const reasonsToShow = hasMultipleReasons ? [consolidatedMessage] : (reasons || [reason]);

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-red-50 to-orange-50 overflow-y-auto">
      <div className="min-h-screen flex flex-col items-center justify-start p-6 pt-12 pb-12">
        <div className="max-w-2xl w-full">
          {/* Alert Icon */}
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center shadow-lg">
              <svg
                className="text-red-600"
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 text-center">
            We're Unable to Proceed at This Time
          </h1>

          {/* Explanation(s) */}
          <div className="space-y-4">
            {reasonsToShow.map((singleReason, index) => (
              <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="text-gray-800 leading-relaxed whitespace-pre-line space-y-4">
                  {singleReason}
                </div>
              </div>
            ))}
            {reasonsToShow.length > 1 && (
              <p className="text-sm text-gray-600 text-center">
                If any of these were selected by mistake, please use the "Back" button to update your responses.
              </p>
            )}
          </div>

          {/* Go Back Button - Primary Action */}
          <button
            onClick={onGoBack}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg flex items-center justify-center gap-3 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>

          {/* Divider */}
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-4 text-sm text-gray-500">
                or
              </span>
            </div>
          </div>

          {/* Contact Support Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 text-center">
              Need Help? Contact Our Support Team
            </h2>

            <div className="space-y-3">
              {/* Email */}
              <a
                href={`mailto:${supportEmail}`}
                className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-600">Email us at</div>
                  <div className="text-blue-600 font-semibold">{supportEmail}</div>
                </div>
              </a>

              {/* Phone */}
              <a
                href={`tel:${supportPhone}`}
                className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
              >
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <Phone className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-600">Call us at</div>
                  <div className="text-green-600 font-semibold">{supportPhone}</div>
                </div>
              </a>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default DisqualificationStandaloneScreen;
