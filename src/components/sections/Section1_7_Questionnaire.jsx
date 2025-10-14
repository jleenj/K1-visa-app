import React from 'react';
import { CheckCircle, HelpCircle } from 'lucide-react';

// Complete questionnaire with ALL steps and endpoints
export const QuestionnaireSteps = ({
  questionnaireData,
  updateQuestionnaireData,
  goToStep,
  handleNoneOfAboveToggle,
  mostRecentEmployment,
  MINIMUM_INCOME_REQUIRED,
  calculateGap,
  setShowAgiHelp,
  setShowSalaryAgiHelp
}) => {

  // Q1: Did you file taxes?
  const renderQ1 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Did you file federal income taxes for 2024 or 2023?
        </h3>
      </div>

      <div className="space-y-3">
        <label className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
          <input
            type="radio"
            name="filedTaxes"
            value="yes"
            checked={questionnaireData.filedTaxes === 'yes'}
            onChange={(e) => {
              updateQuestionnaireData('filedTaxes', e.target.value);
              goToStep('q2');
            }}
            className="h-4 w-4 text-blue-600"
          />
          <span className="text-sm font-medium text-gray-900">Yes</span>
        </label>

        <label className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
          <input
            type="radio"
            name="filedTaxes"
            value="no"
            checked={questionnaireData.filedTaxes === 'no'}
            onChange={(e) => {
              updateQuestionnaireData('filedTaxes', e.target.value);
              goToStep('q7');
            }}
            className="h-4 w-4 text-blue-600"
          />
          <span className="text-sm font-medium text-gray-900">No</span>
        </label>
      </div>
    </div>
  );

  // Q2: Which tax documents do you have?
  const renderQ2 = () => {
    const toggleDocument = (docType) => {
      const current = questionnaireData.availableDocs || [];
      const updated = current.includes(docType)
        ? current.filter(d => d !== docType)
        : [...current, docType];
      updateQuestionnaireData('availableDocs', updated);
    };

    const handleContinue = () => {
      const docs = questionnaireData.availableDocs || [];

      if (docs.includes('transcript-2024')) {
        goToStep('q3-2024');
      } else if (docs.includes('transcript-2023')) {
        goToStep('q3-2023');
      } else if (docs.includes('w2-2024') || docs.includes('w2-2023')) {
        goToStep('q4');
      } else if (docs.includes('self-employed-2024') || docs.includes('self-employed-2023')) {
        goToStep('q5');
      }
    };

    const canContinue = (questionnaireData.availableDocs || []).length > 0;

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Which tax documents do you have?
          </h3>
          <p className="text-sm text-gray-600">Select all that apply</p>
        </div>

        <div className="space-y-3">
          {[
            { id: 'transcript-2024', label: 'IRS Tax Transcript from 2024' },
            { id: 'transcript-2023', label: 'IRS Tax Transcript from 2023' },
            { id: 'w2-2024', label: 'W-2(s) from 2024 (with or without filed return)' },
            { id: 'w2-2023', label: 'W-2(s) from 2023 (with or without filed return)' },
            { id: 'self-employed-2024', label: 'Schedule C/1099 income (self-employed) from 2024' },
            { id: 'self-employed-2023', label: 'Schedule C/1099 income (self-employed) from 2023' },
          ].map(doc => (
            <label
              key={doc.id}
              className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={(questionnaireData.availableDocs || []).includes(doc.id)}
                onChange={() => toggleDocument(doc.id)}
                className="h-4 w-4 text-blue-600 rounded"
              />
              <span className="text-sm font-medium text-gray-900">{doc.label}</span>
            </label>
          ))}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <HelpCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-900">What's the difference?</p>
              <p className="text-sm text-blue-800 mt-1">
                A tax transcript is an official IRS document and provides the strongest proof. Form 1040 with W-2s is also accepted.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleContinue}
          disabled={!canContinue}
          className={`w-full py-3 px-4 rounded-lg font-medium ${
            canContinue
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Continue
        </button>
      </div>
    );
  };

  // Q3-2024: Tax Transcript 2024 - AGI entry
  const renderQ3_2024 = () => {
    const handleAgiSubmit = () => {
      const agi = parseFloat(questionnaireData.agi2024 || 0);

      if (agi >= MINIMUM_INCOME_REQUIRED) {
        goToStep('endpoint-a1');
      } else {
        goToStep('q3a-2024');
      }
    };

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            What is your Adjusted Gross Income (AGI) from your 2024 tax return?
          </h3>
        </div>

        <div>
          <button
            onClick={() => setShowAgiHelp(true)}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium mb-3"
          >
            Where to find your AGI
          </button>

          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-500">$</span>
            <input
              type="number"
              value={questionnaireData.agi2024 || ''}
              onChange={(e) => updateQuestionnaireData('agi2024', e.target.value)}
              className="pl-8 w-full border border-gray-300 rounded-lg px-4 py-3 text-base"
              placeholder="0"
            />
          </div>
        </div>

        <button
          onClick={handleAgiSubmit}
          disabled={!questionnaireData.agi2024}
          className={`w-full py-3 px-4 rounded-lg font-medium ${
            questionnaireData.agi2024
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Continue
        </button>
      </div>
    );
  };

  // Q3a-2024: Income Below Minimum
  const renderQ3a_2024 = () => {
    const gap = calculateGap(questionnaireData.agi2024);

    return (
      <div className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-gray-700">
            Your 2024 AGI is ${parseFloat(questionnaireData.agi2024 || 0).toLocaleString()}, which is ${gap.toLocaleString()} below the ${MINIMUM_INCOME_REQUIRED.toLocaleString()} requirement.
          </p>
          <p className="text-sm text-gray-700 mt-2">
            Not to worry - assets can help cover this shortfall! (Assets must equal 3× the gap = ${(gap * 3).toLocaleString()})
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Has your income situation improved since you filed your 2024 taxes?
          </h3>
        </div>

        <div className="space-y-3">
          <label className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
            <input
              type="radio"
              name="incomeImproved2024"
              value="yes"
              checked={questionnaireData.incomeImproved2024 === 'yes'}
              onChange={(e) => {
                updateQuestionnaireData('incomeImproved2024', e.target.value);
                goToStep('q3b-2024');
              }}
              className="h-4 w-4 text-blue-600"
            />
            <span className="text-sm font-medium text-gray-900">Yes, my income is higher now</span>
          </label>

          <label className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
            <input
              type="radio"
              name="incomeImproved2024"
              value="no"
              checked={questionnaireData.incomeImproved2024 === 'no'}
              onChange={(e) => {
                updateQuestionnaireData('incomeImproved2024', e.target.value);
                goToStep('q3b-2024-same');
              }}
              className="h-4 w-4 text-blue-600"
            />
            <span className="text-sm font-medium text-gray-900">No, it's about the same or lower</span>
          </label>
        </div>
      </div>
    );
  };

  // Q3b-2024: AGI Expectation (Income Improved)
  const renderQ3b_2024 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Based on your current situation, do you expect your 2025 AGI to meet or exceed ${MINIMUM_INCOME_REQUIRED.toLocaleString()}?
        </h3>

        <button
          onClick={() => setShowSalaryAgiHelp(true)}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium mt-2"
        >
          Help: What's the difference between salary and AGI?
        </button>
      </div>

      <div className="space-y-3">
        <label className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
          <input
            type="radio"
            name="agi2025Meets"
            value="yes"
            checked={questionnaireData.agi2025Meets === 'yes'}
            onChange={(e) => {
              updateQuestionnaireData('agi2025Meets', e.target.value);
              goToStep('q3c-2024');
            }}
            className="h-4 w-4 text-blue-600"
          />
          <span className="text-sm font-medium text-gray-900">Yes, my 2025 AGI should be above ${MINIMUM_INCOME_REQUIRED.toLocaleString()}</span>
        </label>

        <label className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
          <input
            type="radio"
            name="agi2025Meets"
            value="no"
            checked={questionnaireData.agi2025Meets === 'no'}
            onChange={(e) => {
              updateQuestionnaireData('agi2025Meets', e.target.value);
              goToStep('q3d-2024');
            }}
            className="h-4 w-4 text-blue-600"
          />
          <span className="text-sm font-medium text-gray-900">No, my 2025 AGI will still be below ${MINIMUM_INCOME_REQUIRED.toLocaleString()}</span>
        </label>
      </div>
    </div>
  );

  // Q3b-2024-same: Select supplementary docs (income not improved)
  const renderQ3b_2024_same = () => {
    const current = questionnaireData.supplementaryDocs2024 || [];
    const hasNone = current.includes('none');

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Which of the following do you have?
          </h3>
          <p className="text-sm text-gray-600">Select all that apply</p>
        </div>

        <div className="space-y-3">
          {[
            { id: 'employment-letter', label: 'Employment verification letter (shows current employment status)' },
            { id: 'bank-statements', label: 'Bank statements' },
            { id: 'ssa-1099', label: 'SSA-1099 (Social Security benefits)' },
          ].map(doc => (
            <label
              key={doc.id}
              className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer ${
                hasNone
                  ? 'border-gray-200 bg-gray-50 opacity-50'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              <input
                type="checkbox"
                checked={current.includes(doc.id)}
                onChange={() => handleNoneOfAboveToggle(current, doc.id, 'supplementaryDocs2024')}
                disabled={hasNone}
                className="h-4 w-4 text-blue-600 rounded"
              />
              <span className="text-sm font-medium text-gray-900">{doc.label}</span>
            </label>
          ))}

          <div className="pt-2 mt-2 border-t border-gray-200">
            <label className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={hasNone}
                onChange={() => handleNoneOfAboveToggle(current, 'none', 'supplementaryDocs2024')}
                className="h-4 w-4 text-blue-600 rounded"
              />
              <span className="text-sm font-medium text-gray-700 italic">None of the above</span>
            </label>
          </div>
        </div>

        {hasNone && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-900">
              We recommend uploading documents that USCIS is familiar with (employment letters, bank statements, etc.) to strengthen your application.
            </p>
          </div>
        )}

        <button
          onClick={() => goToStep('endpoint-a2')}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700"
        >
          Continue
        </button>
      </div>
    );
  };

  // Q3c-2024: Employment Letter Validation
  const renderQ3c_2024 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Can you get an employment verification letter with these USCIS requirements:
        </h3>
        <ul className="text-sm text-gray-700 ml-6 mt-2 space-y-1 list-disc">
          <li>Date and nature of employment (your position/title)</li>
          <li>Salary paid (annual amount)</li>
          <li>Whether position is temporary or permanent</li>
        </ul>
      </div>

      <div className="space-y-3">
        <label className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
          <input
            type="radio"
            name="hasEmploymentLetter"
            value="yes"
            checked={questionnaireData.hasEmploymentLetter2024 === 'yes'}
            onChange={(e) => {
              updateQuestionnaireData('hasEmploymentLetter2024', e.target.value);
              goToStep('q3e-2024');
            }}
            className="h-4 w-4 text-blue-600"
          />
          <span className="text-sm font-medium text-gray-900">Yes, I can get a letter with all these elements</span>
        </label>

        <label className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
          <input
            type="radio"
            name="hasEmploymentLetter"
            value="no"
            checked={questionnaireData.hasEmploymentLetter2024 === 'no'}
            onChange={(e) => {
              updateQuestionnaireData('hasEmploymentLetter2024', e.target.value);
              goToStep('endpoint-a3');
            }}
            className="h-4 w-4 text-blue-600"
          />
          <span className="text-sm font-medium text-gray-900">No</span>
        </label>
      </div>
    </div>
  );

  // Q3d-2024: Supplementary docs (AGI still below)
  const renderQ3d_2024 = () => {
    const current = questionnaireData.supplementaryDocs2024StillBelow || [];
    const hasNone = current.includes('none');

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Which of the following do you have?
          </h3>
          <p className="text-sm text-gray-600">Select all that apply</p>
        </div>

        <div className="space-y-3">
          {[
            { id: 'employment-letter', label: 'Employment verification letter' },
            { id: 'w2-2024', label: 'W-2 from 2024 (if you received a raise/promotion mid-2024)' },
            { id: 'pay-stubs', label: 'Pay stubs from 2025' },
            { id: 'bank-statements', label: 'Bank statements' },
            { id: 'ssa-1099', label: 'SSA-1099 (Social Security benefits)' },
          ].map(doc => (
            <label
              key={doc.id}
              className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer ${
                hasNone
                  ? 'border-gray-200 bg-gray-50 opacity-50'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              <input
                type="checkbox"
                checked={current.includes(doc.id)}
                onChange={() => handleNoneOfAboveToggle(current, doc.id, 'supplementaryDocs2024StillBelow')}
                disabled={hasNone}
                className="h-4 w-4 text-blue-600 rounded"
              />
              <span className="text-sm font-medium text-gray-900">{doc.label}</span>
            </label>
          ))}

          <div className="pt-2 mt-2 border-t border-gray-200">
            <label className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={hasNone}
                onChange={() => handleNoneOfAboveToggle(current, 'none', 'supplementaryDocs2024StillBelow')}
                className="h-4 w-4 text-blue-600 rounded"
              />
              <span className="text-sm font-medium text-gray-700 italic">None of the above</span>
            </label>
          </div>
        </div>

        {hasNone && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-900">
              We recommend uploading documents that USCIS is familiar with to strengthen your application.
            </p>
          </div>
        )}

        <button
          onClick={() => goToStep('endpoint-a6')}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700"
        >
          Continue
        </button>
      </div>
    );
  };

  // Q3e-2024: Position Type
  const renderQ3e_2024 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Is your current position permanent or temporary?
        </h3>
      </div>

      <div className="space-y-3">
        <label className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
          <input
            type="radio"
            name="positionType2024"
            value="permanent"
            checked={questionnaireData.positionType2024 === 'permanent'}
            onChange={(e) => {
              updateQuestionnaireData('positionType2024', e.target.value);
              goToStep('endpoint-a4');
            }}
            className="h-4 w-4 text-blue-600"
          />
          <span className="text-sm font-medium text-gray-900">Permanent</span>
        </label>

        <label className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
          <input
            type="radio"
            name="positionType2024"
            value="temporary"
            checked={questionnaireData.positionType2024 === 'temporary'}
            onChange={(e) => {
              updateQuestionnaireData('positionType2024', e.target.value);
              goToStep('endpoint-a5');
            }}
            className="h-4 w-4 text-blue-600"
          />
          <span className="text-sm font-medium text-gray-900">Temporary</span>
        </label>
      </div>
    </div>
  );

  // ENDPOINT A1: 2024 Transcript + Meets Requirement
  const renderEndpointA1 = () => (
    <div className="space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-start">
          <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
          <div className="ml-3">
            <h3 className="text-lg font-semibold text-green-900">Great!</h3>
            <p className="text-sm text-green-800 mt-1">
              Your 2024 income of ${parseFloat(questionnaireData.agi2024 || 0).toLocaleString()} meets the ${MINIMUM_INCOME_REQUIRED.toLocaleString()} requirement.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="text-base font-semibold text-blue-900 mb-3">We recommend uploading:</h4>
        <ul className="space-y-3">
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            <div>
              <p className="text-sm font-medium text-blue-900">IRS Tax Transcript (2024)</p>
              <p className="text-sm text-blue-800">Primary proof - official IRS verification of 2024 income</p>
            </div>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            <div>
              <p className="text-sm font-medium text-blue-900">Form 1040 (2024)</p>
              <p className="text-sm text-blue-800">Helpful to include alongside transcript</p>
            </div>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            <div>
              <p className="text-sm font-medium text-blue-900">Employment verification letter</p>
              <p className="text-sm text-blue-800">Must show date/nature of employment, salary paid, temporary/permanent status</p>
            </div>
          </li>
        </ul>
      </div>

      <button
        onClick={() => goToStep('document-upload')}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700"
      >
        Proceed to Document Upload
      </button>
    </div>
  );

  // ENDPOINT A2: 2024 Transcript + Income Not Improved
  const renderEndpointA2 = () => {
    const docs = questionnaireData.supplementaryDocs2024 || [];
    const gap = calculateGap(questionnaireData.agi2024);

    return (
      <div className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-gray-700">
            Not to worry - we'll document your 2024 income and use assets to cover the ${gap.toLocaleString()} shortfall.
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h4 className="text-base font-semibold text-blue-900 mb-3">We recommend uploading:</h4>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <div>
                <p className="text-sm font-medium text-blue-900">IRS Tax Transcript (2024)</p>
                <p className="text-sm text-blue-800">Shows your 2024 income verified by IRS</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <div>
                <p className="text-sm font-medium text-blue-900">Form 1040 (2024)</p>
                <p className="text-sm text-blue-800">Helpful alongside transcript</p>
              </div>
            </li>

            {docs.includes('employment-letter') && (
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <div>
                  <p className="text-sm font-medium text-blue-900">Employment verification letter</p>
                  <p className="text-sm text-blue-800">USCIS requirement: Must show date/nature of employment, salary paid, temporary/permanent status</p>
                </div>
              </li>
            )}

            {docs.includes('bank-statements') && (
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <div>
                  <p className="text-sm font-medium text-blue-900">Bank statements</p>
                  <p className="text-sm text-blue-800">Must show: date opened, total deposited past year, present balance</p>
                </div>
              </li>
            )}

            {docs.includes('ssa-1099') && (
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <div>
                  <p className="text-sm font-medium text-blue-900">SSA-1099 (Social Security Benefits Statement)</p>
                </div>
              </li>
            )}
          </ul>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-700">
            <strong>Next:</strong> Assets section to cover the ${gap.toLocaleString()} shortfall (need ${(gap * 3).toLocaleString()} in assets)
          </p>
        </div>

        <button
          onClick={() => goToStep('document-upload')}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700"
        >
          Proceed to Document Upload
        </button>
      </div>
    );
  };

  // ENDPOINT A3-A6
  const renderEndpointA3 = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-gray-700">
          Without an employment letter to verify your increased income, we'll need other documentation to show your improved income.
        </p>
        <p className="text-sm text-gray-700 mt-2">
          💡 Note: Calculating annual income from pay stubs alone can be tricky. We recommend trying to get an employment verification letter from your employer, as it clearly states your annual salary.
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="text-base font-semibold text-blue-900 mb-3">We recommend uploading:</h4>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>• IRS Tax Transcript (2024)</li>
          <li>• Form 1040 (2024)</li>
          <li>• Pay stubs (minimum 1 month consecutive, 2-3 months preferred)</li>
          <li>• Bank statements</li>
        </ul>
      </div>

      <button onClick={() => goToStep('document-upload')} className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700">
        Proceed to Document Upload
      </button>
    </div>
  );

  const renderEndpointA4 = () => (
    <div className="space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <CheckCircle className="h-6 w-6 text-green-600 mb-2" />
        <p className="text-sm text-green-800">
          Excellent! Your 2024 transcript combined with your current permanent position shows you meet the requirement.
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="text-base font-semibold text-blue-900 mb-3">We recommend uploading:</h4>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>• IRS Tax Transcript (2024)</li>
          <li>• Form 1040 (2024)</li>
          <li>• Employment verification letter</li>
          <li>• Pay stubs (minimum 1 month, 2-3 preferred)</li>
          <li>• Bank statements</li>
        </ul>
      </div>

      <button onClick={() => goToStep('document-upload')} className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700">
        Proceed to Document Upload
      </button>
    </div>
  );

  const renderEndpointA5 = () => (
    <div className="space-y-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-900">
          Temporary positions require additional proof of financial stability.
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="text-base font-semibold text-blue-900 mb-3">We recommend uploading:</h4>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>• IRS Tax Transcript (2024)</li>
          <li>• Form 1040 (2024)</li>
          <li>• Employment verification letter (must show temporary status)</li>
          <li>• Pay stubs</li>
          <li>• Bank statements</li>
        </ul>
      </div>

      <button onClick={() => goToStep('document-upload')} className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700">
        Proceed to Document Upload
      </button>
    </div>
  );

  const renderEndpointA6 = () => {
    const docs = questionnaireData.supplementaryDocs2024StillBelow || [];
    return (
      <div className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h4 className="text-base font-semibold text-blue-900 mb-3">We recommend uploading:</h4>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• IRS Tax Transcript (2024)</li>
            <li>• Form 1040 (2024)</li>
            {docs.includes('employment-letter') && <li>• Employment verification letter</li>}
            {docs.includes('w2-2024') && <li>• W-2 from 2024</li>}
            {docs.includes('pay-stubs') && <li>• Pay stubs (minimum 1 month, 2-3 preferred)</li>}
            {docs.includes('bank-statements') && <li>• Bank statements</li>}
            {docs.includes('ssa-1099') && <li>• SSA-1099</li>}
          </ul>
        </div>

        <button onClick={() => goToStep('document-upload')} className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700">
          Proceed to Document Upload
        </button>
      </div>
    );
  };

  // Q7: No taxes filed - Social Security question
  const renderQ7 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Do you receive Social Security retirement or disability benefits?
        </h3>
      </div>

      <div className="space-y-3">
        <label className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
          <input
            type="radio"
            name="receivesSocialSecurity"
            value="yes"
            checked={questionnaireData.receivesSocialSecurity === 'yes'}
            onChange={(e) => {
              updateQuestionnaireData('receivesSocialSecurity', e.target.value);
              goToStep('q8');
            }}
            className="h-4 w-4 text-blue-600"
          />
          <span className="text-sm font-medium text-gray-900">Yes</span>
        </label>

        <label className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
          <input
            type="radio"
            name="receivesSocialSecurity"
            value="no"
            checked={questionnaireData.receivesSocialSecurity === 'no'}
            onChange={(e) => {
              updateQuestionnaireData('receivesSocialSecurity', e.target.value);
              goToStep('q8');
            }}
            className="h-4 w-4 text-blue-600"
          />
          <span className="text-sm font-medium text-gray-900">No</span>
        </label>
      </div>
    </div>
  );

  // Q8: Employment check (routes based on Section 1.6 data)
  const renderQ8 = () => {
    const employmentType = mostRecentEmployment?.type || '';

    if (employmentType === 'Self-employed') {
      goToStep('endpoint-e1-self-employed');
      return null;
    }

    if (employmentType.includes('Employed')) {
      goToStep('q9-employed');
      return null;
    }

    // Unemployed or no employment info
    goToStep('endpoint-e1-unemployed');
    return null;
  };

  // Q9-Employed: Salary question
  const renderQ9Employed = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          What is your current annual salary (gross, before taxes)?
        </h3>
      </div>

      <div className="relative">
        <span className="absolute left-3 top-3 text-gray-500">$</span>
        <input
          type="number"
          value={questionnaireData.currentSalary || ''}
          onChange={(e) => updateQuestionnaireData('currentSalary', e.target.value)}
          className="pl-8 w-full border border-gray-300 rounded-lg px-4 py-3 text-base"
          placeholder="0"
        />
      </div>

      <button
        onClick={() => {
          const salary = parseFloat(questionnaireData.currentSalary || 0);
          if (salary >= MINIMUM_INCOME_REQUIRED) {
            goToStep('q10');
          } else {
            goToStep('endpoint-e2-below');
          }
        }}
        disabled={!questionnaireData.currentSalary}
        className={`w-full py-3 px-4 rounded-lg font-medium ${
          questionnaireData.currentSalary
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        Continue
      </button>
    </div>
  );

  // Q10: Employment Letter (No Tax Return + Meets Salary)
  const renderQ10 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Can you get an employment verification letter with these USCIS requirements:
        </h3>
        <ul className="text-sm text-gray-700 ml-6 mt-2 space-y-1 list-disc">
          <li>Date and nature of employment (your position/title)</li>
          <li>Salary paid</li>
          <li>Whether position is temporary or permanent</li>
        </ul>
      </div>

      <div className="space-y-3">
        <label className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
          <input
            type="radio"
            name="hasEmploymentLetterNoTax"
            value="yes"
            checked={questionnaireData.hasEmploymentLetterNoTax === 'yes'}
            onChange={(e) => {
              updateQuestionnaireData('hasEmploymentLetterNoTax', e.target.value);
              goToStep('q11');
            }}
            className="h-4 w-4 text-blue-600"
          />
          <span className="text-sm font-medium text-gray-900">Yes</span>
        </label>

        <label className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
          <input
            type="radio"
            name="hasEmploymentLetterNoTax"
            value="no"
            checked={questionnaireData.hasEmploymentLetterNoTax === 'no'}
            onChange={(e) => {
              updateQuestionnaireData('hasEmploymentLetterNoTax', e.target.value);
              goToStep('endpoint-e3');
            }}
            className="h-4 w-4 text-blue-600"
          />
          <span className="text-sm font-medium text-gray-900">No</span>
        </label>
      </div>
    </div>
  );

  // Q11: Position Type (No Tax Return)
  const renderQ11 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Is your position permanent or temporary?
        </h3>
      </div>

      <div className="space-y-3">
        <label className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
          <input
            type="radio"
            name="positionTypeNoTax"
            value="permanent"
            checked={questionnaireData.positionTypeNoTax === 'permanent'}
            onChange={(e) => {
              updateQuestionnaireData('positionTypeNoTax', e.target.value);
              goToStep('endpoint-e4');
            }}
            className="h-4 w-4 text-blue-600"
          />
          <span className="text-sm font-medium text-gray-900">Permanent</span>
        </label>

        <label className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
          <input
            type="radio"
            name="positionTypeNoTax"
            value="temporary"
            checked={questionnaireData.positionTypeNoTax === 'temporary'}
            onChange={(e) => {
              updateQuestionnaireData('positionTypeNoTax', e.target.value);
              goToStep('endpoint-e5');
            }}
            className="h-4 w-4 text-blue-600"
          />
          <span className="text-sm font-medium text-gray-900">Temporary</span>
        </label>
      </div>
    </div>
  );

  // Endpoints E1-E5
  const renderEndpointE1Unemployed = () => (
    <div className="space-y-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-900">
          Without current employment or filed taxes, you'll need to demonstrate financial support through other means or consider a joint sponsor.
        </p>
      </div>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="text-base font-semibold text-blue-900 mb-3">You may need:</h4>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>• Substantial assets</li>
          {questionnaireData.receivesSocialSecurity === 'yes' && <li>• SSA-1099 (Social Security Benefits Statement)</li>}
        </ul>
      </div>
      <button onClick={() => goToStep('document-upload')} className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700">
        Proceed to Document Upload
      </button>
    </div>
  );

  const renderEndpointE1SelfEmployed = () => (
    <div className="space-y-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-900">
          Since you're self-employed without filed taxes, proving your income will be challenging. USCIS prefers official tax documents.
        </p>
        <p className="text-sm text-yellow-900 mt-2">
          <strong>We strongly recommend:</strong> Filing your taxes and getting a tax transcript before applying.
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="text-base font-semibold text-blue-900 mb-3">If you proceed anyway, upload what you can:</h4>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>• Bank statements (Must show: date opened, total deposited past year, present balance)</li>
          <li>• Any 1099 forms you've received</li>
          <li>• Business financial records</li>
        </ul>
      </div>

      <button onClick={() => goToStep('document-upload')} className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700">
        Proceed to Document Upload
      </button>
    </div>
  );

  const renderEndpointE2Below = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-gray-700">
          Your salary is below ${MINIMUM_INCOME_REQUIRED.toLocaleString()}. You'll supplement with assets.
        </p>
      </div>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="text-base font-semibold text-blue-900 mb-3">We recommend uploading:</h4>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>• Employment verification letter (if available)</li>
          <li>• Pay stubs (minimum 1 month, 2-3 preferred)</li>
          {questionnaireData.receivesSocialSecurity === 'yes' && <li>• SSA-1099</li>}
        </ul>
      </div>
      <button onClick={() => goToStep('document-upload')} className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700">
        Proceed to Document Upload
      </button>
    </div>
  );

  const renderEndpointE3 = () => (
    <div className="space-y-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-900">
          Without an employment letter to verify your income, you'll need substantial documentation.
        </p>
      </div>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="text-base font-semibold text-blue-900 mb-3">We recommend uploading:</h4>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>• Pay stubs (minimum 1 month, 2-3 preferred)</li>
          <li>• Bank statements</li>
          {questionnaireData.receivesSocialSecurity === 'yes' && <li>• SSA-1099</li>}
        </ul>
      </div>
      <button onClick={() => goToStep('document-upload')} className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700">
        Proceed to Document Upload
      </button>
    </div>
  );

  const renderEndpointE4 = () => (
    <div className="space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <CheckCircle className="h-5 w-5 text-green-600 mb-2" />
        <p className="text-sm text-green-800">
          Your permanent position with salary above ${MINIMUM_INCOME_REQUIRED.toLocaleString()} provides good proof.
        </p>
      </div>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="text-base font-semibold text-blue-900 mb-3">We recommend uploading:</h4>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>• Employment verification letter</li>
          <li>• Pay stubs (minimum 1 month, 2-3 preferred)</li>
          <li>• Bank statements</li>
          {questionnaireData.receivesSocialSecurity === 'yes' && <li>• SSA-1099</li>}
        </ul>
      </div>
      <button onClick={() => goToStep('document-upload')} className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700">
        Proceed to Document Upload
      </button>
    </div>
  );

  const renderEndpointE5 = () => (
    <div className="space-y-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-900">
          Temporary positions require additional proof of financial stability.
        </p>
      </div>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="text-base font-semibold text-blue-900 mb-3">We recommend uploading:</h4>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>• Employment verification letter (must show temporary nature and end date)</li>
          <li>• Pay stubs (minimum 1 month, 2-3 preferred)</li>
          <li>• Bank statements</li>
          {questionnaireData.receivesSocialSecurity === 'yes' && <li>• SSA-1099</li>}
        </ul>
      </div>
      <button onClick={() => goToStep('document-upload')} className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700">
        Proceed to Document Upload
      </button>
    </div>
  );

  // ALL STEPS MAPPED
  const steps = {
    'q1': renderQ1,
    'q2': renderQ2,
    'q3-2024': renderQ3_2024,
    'q3a-2024': renderQ3a_2024,
    'q3b-2024': renderQ3b_2024,
    'q3b-2024-same': renderQ3b_2024_same,
    'q3c-2024': renderQ3c_2024,
    'q3d-2024': renderQ3d_2024,
    'q3e-2024': renderQ3e_2024,
    'endpoint-a1': renderEndpointA1,
    'endpoint-a2': renderEndpointA2,
    'endpoint-a3': renderEndpointA3,
    'endpoint-a4': renderEndpointA4,
    'endpoint-a5': renderEndpointA5,
    'endpoint-a6': renderEndpointA6,
    'q7': renderQ7,
    'q8': renderQ8,
    'q9-employed': renderQ9Employed,
    'q10': renderQ10,
    'q11': renderQ11,
    'endpoint-e1-unemployed': renderEndpointE1Unemployed,
    'endpoint-e1-self-employed': renderEndpointE1SelfEmployed,
    'endpoint-e2-below': renderEndpointE2Below,
    'endpoint-e3': renderEndpointE3,
    'endpoint-e4': renderEndpointE4,
    'endpoint-e5': renderEndpointE5,
  };

  return steps;
};

export default QuestionnaireSteps;
