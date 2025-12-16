import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ScreenLayout from '../ScreenLayout';
import { getNextScreen, isFirstScreen } from '../../utils/navigationUtils';

/**
 * CitizenshipScreen Component
 *
 * Screen for collecting citizenship and identification information
 */
const CitizenshipScreen = ({
  currentData,
  updateField,
  userRole,
  isSponsor = true
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const prefix = isSponsor ? 'sponsor' : 'beneficiary';

  const handleNext = () => {
    const nextPath = getNextScreen(location.pathname, userRole);
    if (nextPath) {
      navigate(nextPath);
    }
  };

  const isFirst = isFirstScreen(location.pathname, userRole);

  // SSN validation
  const formatSSN = (value) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 3) return digits;
    if (digits.length <= 5) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5, 9)}`;
  };

  const handleSSNChange = (value) => {
    const formatted = formatSSN(value);
    updateField(`${prefix}SSN`, formatted);
  };

  // Check if required fields are filled
  const isFormValid = () => {
    const ssn = currentData[`${prefix}SSN`] || '';
    const ssnDigits = ssn.replace(/\D/g, '');

    // For sponsor: citizenship method and SSN required
    if (isSponsor) {
      const hasCertificate = currentData[`${prefix}HasCertificate`];
      const citizenshipMethod = currentData[`${prefix}CitizenshipMethod`];

      // If they have a certificate, require cert details
      if (hasCertificate === 'Yes') {
        return citizenshipMethod &&
               ssnDigits.length === 9 &&
               currentData[`${prefix}CertNumber`] &&
               currentData[`${prefix}CertIssueDate`] &&
               currentData[`${prefix}CertIssuePlace`];
      }

      return citizenshipMethod && hasCertificate && ssnDigits.length === 9;
    }

    // For beneficiary: just citizenship required
    return currentData[`${prefix}Citizenship`];
  };

  return (
    <ScreenLayout
      showBackButton={!isFirst}
      onNext={handleNext}
      nextButtonDisabled={!isFormValid()}
    >
      {/* Screen Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {isSponsor ? 'U.S. Citizenship & Identification' : 'Citizenship Information'}
        </h2>
        <p className="text-gray-600">
          {isSponsor
            ? 'We need to verify your U.S. citizenship and collect identification numbers.'
            : 'Please provide your citizenship information.'}
        </p>
      </div>

      {/* Form Fields */}
      <div className="space-y-6">
        {isSponsor ? (
          <>
            {/* How did you obtain citizenship */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                How did you obtain U.S. citizenship? <span className="text-red-500">*</span>
              </label>
              <select
                value={currentData[`${prefix}CitizenshipMethod`] || ''}
                onChange={(e) => updateField(`${prefix}CitizenshipMethod`, e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select one</option>
                <option value="Birth in the United States">Birth in the United States</option>
                <option value="Birth abroad to U.S. citizen parent(s)">Birth abroad to U.S. citizen parent(s)</option>
                <option value="Naturalization">Naturalization</option>
                <option value="Acquisition after birth through parents">Acquisition after birth through parents</option>
              </select>
            </div>

            {/* Certificate Question */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Do you have a Certificate of Naturalization or Certificate of Citizenship in your own name? <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={`${prefix}HasCertificate`}
                    value="Yes"
                    checked={currentData[`${prefix}HasCertificate`] === 'Yes'}
                    onChange={(e) => updateField(`${prefix}HasCertificate`, e.target.value)}
                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Yes</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={`${prefix}HasCertificate`}
                    value="No"
                    checked={currentData[`${prefix}HasCertificate`] === 'No'}
                    onChange={(e) => {
                      updateField(`${prefix}HasCertificate`, e.target.value);
                      // Clear certificate fields if No
                      updateField(`${prefix}CertNumber`, '');
                      updateField(`${prefix}CertIssueDate`, '');
                      updateField(`${prefix}CertIssuePlace`, '');
                    }}
                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">No</span>
                </label>
              </div>
            </div>

            {/* Certificate Details (conditional) */}
            {currentData[`${prefix}HasCertificate`] === 'Yes' && (
              <>
                <div className="border-l-4 border-blue-500 pl-4 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Certificate Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={currentData[`${prefix}CertNumber`] || ''}
                      onChange={(e) => updateField(`${prefix}CertNumber`, e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 12345678"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Issuance <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={currentData[`${prefix}CertIssueDate`] || ''}
                      onChange={(e) => updateField(`${prefix}CertIssueDate`, e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      max={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Place of Issuance <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={currentData[`${prefix}CertIssuePlace`] || ''}
                      onChange={(e) => updateField(`${prefix}CertIssuePlace`, e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Los Angeles, CA"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Social Security Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Social Security Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={currentData[`${prefix}SSN`] || ''}
                onChange={(e) => handleSSNChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                placeholder="XXX-XX-XXXX"
                maxLength={11}
              />
              <p className="text-sm text-gray-500 mt-1">
                Format: XXX-XX-XXXX
              </p>
            </div>

            {/* A-Number (Optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                USCIS File Number (A-Number)
              </label>
              <input
                type="text"
                value={currentData[`${prefix}ANumber`] || ''}
                onChange={(e) => updateField(`${prefix}ANumber`, e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="A123456789"
              />
              <p className="text-sm text-gray-500 mt-1">
                Optional - Only if you have one
              </p>
            </div>

            {/* USCIS Account Number (Optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                USCIS Online Account Number
              </label>
              <input
                type="text"
                value={currentData[`${prefix}USCISAccountNumber`] || ''}
                onChange={(e) => updateField(`${prefix}USCISAccountNumber`, e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Optional"
              />
              <p className="text-sm text-gray-500 mt-1">
                Optional - From your USCIS online account
              </p>
            </div>
          </>
        ) : (
          <>
            {/* Beneficiary - Just citizenship */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country of Citizenship or Nationality <span className="text-red-500">*</span>
              </label>
              <select
                value={currentData[`${prefix}Citizenship`] || ''}
                onChange={(e) => updateField(`${prefix}Citizenship`, e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a country</option>
                <option value="Afghanistan">Afghanistan</option>
                <option value="Albania">Albania</option>
                <option value="Algeria">Algeria</option>
                <option value="Argentina">Argentina</option>
                <option value="Australia">Australia</option>
                <option value="Austria">Austria</option>
                <option value="Bangladesh">Bangladesh</option>
                <option value="Belgium">Belgium</option>
                <option value="Brazil">Brazil</option>
                <option value="Canada">Canada</option>
                <option value="Chile">Chile</option>
                <option value="China">China</option>
                <option value="Colombia">Colombia</option>
                <option value="Denmark">Denmark</option>
                <option value="Egypt">Egypt</option>
                <option value="France">France</option>
                <option value="Germany">Germany</option>
                <option value="Greece">Greece</option>
                <option value="India">India</option>
                <option value="Indonesia">Indonesia</option>
                <option value="Iran">Iran</option>
                <option value="Iraq">Iraq</option>
                <option value="Ireland">Ireland</option>
                <option value="Israel">Israel</option>
                <option value="Italy">Italy</option>
                <option value="Japan">Japan</option>
                <option value="Kenya">Kenya</option>
                <option value="Mexico">Mexico</option>
                <option value="Netherlands">Netherlands</option>
                <option value="New Zealand">New Zealand</option>
                <option value="Nigeria">Nigeria</option>
                <option value="Norway">Norway</option>
                <option value="Pakistan">Pakistan</option>
                <option value="Peru">Peru</option>
                <option value="Philippines">Philippines</option>
                <option value="Poland">Poland</option>
                <option value="Portugal">Portugal</option>
                <option value="Russia">Russia</option>
                <option value="Saudi Arabia">Saudi Arabia</option>
                <option value="South Africa">South Africa</option>
                <option value="South Korea">South Korea</option>
                <option value="Spain">Spain</option>
                <option value="Sweden">Sweden</option>
                <option value="Switzerland">Switzerland</option>
                <option value="Thailand">Thailand</option>
                <option value="Turkey">Turkey</option>
                <option value="Ukraine">Ukraine</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Venezuela">Venezuela</option>
                <option value="Vietnam">Vietnam</option>
              </select>
            </div>
          </>
        )}
      </div>
    </ScreenLayout>
  );
};

export default CitizenshipScreen;
