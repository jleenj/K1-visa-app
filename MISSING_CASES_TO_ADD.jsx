/**
 * MISSING FIELD RENDERER CASES
 *
 * These cases need to be added to FieldRenderer.jsx BEFORE the default: case
 *
 * INSTRUCTIONS:
 * 1. Open C:\Users\vnix8\Documents\k1-visa-app\src\utils\FieldRenderer.jsx
 * 2. Find the line that says: case 'native-alphabet-address': {
 * 3. Scroll down to find the closing brace and the line: default:
 * 4. Insert ALL the cases below BETWEEN the closing brace of 'native-alphabet-address' and the 'default:' case
 * 5. Make sure to maintain proper indentation (all cases should be at the same level)
 */

// ==================== INSERT THESE CASES BEFORE default: ====================

    case 'address-with-careof': {
      const addressWithCareOfValue = currentData[field.id] || {};
      const { street: addressWithCareOfStreet = '', unitType: addressWithCareOfUnitType = '', unitNumber: addressWithCareOfUnitNumber = '', city: addressWithCareOfCity = '', state: addressWithCareOfState = '', zipCode: addressWithCareOfZipCode = '', country: addressWithCareOfCountry = '', careOf: addressWithCareOfCareOf = '' } = addressWithCareOfValue;
      const addressWithCareOfCountryFormat = addressFormats[addressWithCareOfCountry] || addressFormats['United States'];

      return (
        <div className="space-y-3">
          {/* C/O Field */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Care Of (c/o) - Optional
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              value={addressWithCareOfCareOf}
              onChange={(e) => updateField(field.id, { ...addressWithCareOfValue, careOf: e.target.value })}
              placeholder="Name of person or organization (if applicable)"
            />
            <p className="text-xs text-gray-500 mt-1">
              Only use this if mail is being sent to an address in care of someone else (e.g., "c/o John Smith" or "c/o ABC Company")
            </p>
          </div>

          {/* Country Selection */}
          <select
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            value={addressWithCareOfCountry}
            onChange={(e) => {
              updateField(field.id, { ...addressWithCareOfValue, country: e.target.value, state: '', zipCode: '' });
            }}
          >
            <option value="">Select country...</option>
            {phoneCountries.map(c => (
              <option key={c.code} value={c.name}>
                {c.flag} {c.name}
              </option>
            ))}
          </select>

          {addressWithCareOfCountry && (
            <>
              {/* Street Address */}
              <input
                type="text"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                value={addressWithCareOfStreet}
                onChange={(e) => updateField(field.id, { ...addressWithCareOfValue, street: e.target.value })}
                placeholder="Street Number and Name"
              />

              {/* Unit Details */}
              <div className="grid grid-cols-2 gap-2">
                <select
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 text-sm"
                  value={addressWithCareOfUnitType}
                  onChange={(e) => updateField(field.id, { ...addressWithCareOfValue, unitType: e.target.value, unitNumber: e.target.value ? addressWithCareOfUnitNumber : '' })}
                >
                  <option value="">Unit type (optional)</option>
                  <option value="Apt">Apt</option>
                  <option value="Ste">Ste</option>
                  <option value="Flr">Flr</option>
                </select>
                <input
                  type="text"
                  className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 text-sm ${!addressWithCareOfUnitType ? 'bg-gray-100 text-gray-400' : ''}`}
                  value={addressWithCareOfUnitNumber}
                  onChange={(e) => updateField(field.id, { ...addressWithCareOfValue, unitNumber: e.target.value })}
                  placeholder="Number/ID"
                  disabled={!addressWithCareOfUnitType}
                />
              </div>

              {/* City and State */}
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  className="p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  value={addressWithCareOfCity}
                  onChange={(e) => updateField(field.id, { ...addressWithCareOfValue, city: e.target.value })}
                  placeholder="City"
                />
                {addressWithCareOfCountryFormat.states ? (
                  <select
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    value={addressWithCareOfState}
                    onChange={(e) => updateField(field.id, { ...addressWithCareOfValue, state: e.target.value })}
                  >
                    <option value="">Select {addressWithCareOfCountryFormat.stateLabel.toLowerCase()}...</option>
                    {addressWithCareOfCountryFormat.states.map(stateOption => (
                      <option key={stateOption} value={stateOption}>{stateOption}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    value={addressWithCareOfState}
                    onChange={(e) => updateField(field.id, { ...addressWithCareOfValue, state: e.target.value })}
                    placeholder={addressWithCareOfCountryFormat.stateLabel || 'State/Province'}
                  />
                )}
              </div>

              {/* Postal Code */}
              <input
                type="text"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                value={addressWithCareOfZipCode}
                onChange={(e) => {
                  const formatted = formatPostalCode(e.target.value, addressWithCareOfCountry);
                  updateField(field.id, { ...addressWithCareOfValue, zipCode: formatted });
                }}
                placeholder={addressWithCareOfCountryFormat.postalPlaceholder}
              />
              {addressWithCareOfZipCode && !addressWithCareOfCountryFormat.postalFormat.test(addressWithCareOfZipCode) && (
                <div className="text-sm text-orange-600 flex items-center mt-1">
                  <span>Please enter a valid {addressWithCareOfCountryFormat.postalLabel.toLowerCase()} for {addressWithCareOfCountry}</span>
                </div>
              )}
            </>
          )}
        </div>
      );
    }

    case 'beneficiary-currently-in-us-warning': {
      const beneficiaryCurrentlyInUS = currentData['beneficiaryCurrentlyInUS'] || '';

      if (beneficiaryCurrentlyInUS !== 'Yes') {
        return null;
      }

      return (
        <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <span className="text-amber-600 text-lg">⚠️</span>
            <div>
              <h4 className="font-medium text-amber-800 mb-2">Important: Beneficiary Currently in the U.S.</h4>
              <p className="text-sm text-amber-700 mb-3">
                Since [BeneficiaryFirstName] is currently in the United States, there are some important considerations:
              </p>
              <ul className="list-disc ml-5 text-sm text-amber-700 space-y-1">
                <li><strong>Maintain legal status:</strong> [BeneficiaryFirstName] must maintain legal immigration status throughout the K-1 process</li>
                <li><strong>Consular processing:</strong> [BeneficiaryFirstName] will need to return to their home country for the visa interview</li>
                <li><strong>Travel considerations:</strong> Leaving the U.S. before the interview may affect pending applications</li>
              </ul>
              <p className="text-sm text-amber-700 mt-3">
                <strong>We recommend consulting with an immigration attorney</strong> to ensure [BeneficiaryFirstName]'s situation is handled correctly.
              </p>
            </div>
          </div>
        </div>
      );
    }

    case 'beneficiary-married-eligibility-check': {
      const beneficiaryMaritalStatus = currentData['beneficiaryMaritalStatus'] || '';
      const beneficiaryFirstName = currentData['beneficiaryFirstName'] || '[BeneficiaryFirstName]';
      const sponsorFirstName = currentData['sponsorFirstName'] || '[SponsorFirstName]';

      if (beneficiaryMaritalStatus !== 'Married') {
        return null;
      }

      return (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <span className="text-red-600 text-xl">🚫</span>
            <div>
              <h4 className="font-medium text-red-800 mb-2">K-1 Visa Not Available</h4>
              <p className="text-sm text-red-700 mb-3">
                K-1 visas are only available for engaged couples who are both legally free to marry. Since {beneficiaryFirstName} is currently married, they cannot apply for a K-1 visa.
              </p>
              <p className="text-sm text-red-700 mb-3">
                <strong>What to do:</strong>
              </p>
              <ul className="list-disc ml-5 text-sm text-red-700 space-y-1 mb-3">
                <li>If {beneficiaryFirstName} is in the process of getting divorced, wait until the divorce is finalized before applying</li>
                <li>If {beneficiaryFirstName} and {sponsorFirstName} are already married, you may qualify for a spousal visa instead</li>
              </ul>
              <button
                className="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors"
                onClick={() => {
                  console.log('TODO: Route to support for married beneficiary scenario');
                }}
              >
                Contact Support for Guidance
              </button>
            </div>
          </div>
        </div>
      );
    }

    case 'children-list': {
      const childrenCount = parseInt(currentData['beneficiaryChildren'] || '0');

      if (childrenCount === 0) return null;

      const childrenValue = currentData[field.id] || [];

      return (
        <div className="space-y-4">
          {[...Array(childrenCount)].map((_, index) => {
            const child = childrenValue[index] || {};
            return (
              <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <h4 className="font-medium text-gray-800 mb-3">Child #{index + 1}</h4>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      className="p-2 border rounded focus:ring-2 focus:ring-blue-500"
                      value={child.lastName || ''}
                      onChange={(e) => {
                        const newChildren = [...childrenValue];
                        newChildren[index] = { ...child, lastName: e.target.value };
                        updateField(field.id, newChildren);
                      }}
                      placeholder="Last Name"
                    />
                    <input
                      type="text"
                      className="p-2 border rounded focus:ring-2 focus:ring-blue-500"
                      value={child.firstName || ''}
                      onChange={(e) => {
                        const newChildren = [...childrenValue];
                        newChildren[index] = { ...child, firstName: e.target.value };
                        updateField(field.id, newChildren);
                      }}
                      placeholder="First Name"
                    />
                    <input
                      type="text"
                      className="p-2 border rounded focus:ring-2 focus:ring-blue-500"
                      value={child.middleName || ''}
                      onChange={(e) => {
                        const newChildren = [...childrenValue];
                        newChildren[index] = { ...child, middleName: e.target.value };
                        updateField(field.id, newChildren);
                      }}
                      placeholder="Middle Name"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Date of Birth</label>
                      <input
                        type="date"
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                        value={child.dob || ''}
                        onChange={(e) => {
                          const newChildren = [...childrenValue];
                          newChildren[index] = { ...child, dob: e.target.value };
                          updateField(field.id, newChildren);
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Country of Birth</label>
                      <select
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                        value={child.birthCountry || ''}
                        onChange={(e) => {
                          const newChildren = [...childrenValue];
                          newChildren[index] = { ...child, birthCountry: e.target.value };
                          updateField(field.id, newChildren);
                        }}
                      >
                        <option value="">Select country...</option>
                        {phoneCountries.map(c => (
                          <option key={c.code} value={c.name}>
                            {c.flag} {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      );
    }

// NOTE: The chronological-timeline, timeline-summary, states-countries-list, conditional-address-history,
// married-eligibility-check, and beneficiary-legal-screening cases are EXTREMELY LARGE (200-400 lines each).
// They need to be copied manually from App.tsx. See the line numbers below for exact locations:

// - chronological-timeline: Lines 5407-6832 in App.tsx
// - timeline-summary: Lines 6832-6944 in App.tsx
// - states-countries-list: Lines 1247-1470 in App.tsx
// - conditional-address-history: Lines 1673-1963 in App.tsx
// - married-eligibility-check: Lines 4578-4909 in App.tsx
// - beneficiary-legal-screening: Lines 6962-7302 in App.tsx (need to find exact end)

// I'll add these in the next message due to token/size limitations
