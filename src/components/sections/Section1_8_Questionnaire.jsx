import React from 'react';
import { CheckCircle, HelpCircle, AlertCircle, Info } from 'lucide-react';

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

  // ============================================
  // TAX YEAR LOGIC
  // ============================================
  // Determine which tax years are "current" vs "stale"
  // Rule: After April 15 of year Y, tax year (Y-1) becomes "current" and (Y-2) becomes "stale"
  // Before April 15 of year Y, tax year (Y-2) is still "current" and (Y-3) becomes "stale"

  const getCurrentTaxYears = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-11
    const currentDay = now.getDate();

    // Check if we're past April 15 (month 3 = April, 0-indexed)
    const pastApril15 = currentMonth > 3 || (currentMonth === 3 && currentDay >= 15);

    if (pastApril15) {
      // After April 15: Most recent tax year is (currentYear - 1)
      return {
        mostRecentYear: currentYear - 1,
        previousYear: currentYear - 2,
        isStale: (year) => year < currentYear - 2,
        expectedIncomeYear: currentYear
      };
    } else {
      // Before April 15: Most recent tax year is still (currentYear - 2)
      return {
        mostRecentYear: currentYear - 2,
        previousYear: currentYear - 3,
        isStale: (year) => year < currentYear - 3,
        expectedIncomeYear: currentYear
      };
    }
  };

  const taxYears = getCurrentTaxYears();
  const MOST_RECENT_TAX_YEAR = taxYears.mostRecentYear; // e.g., 2024 if after Apr 15, 2025
  const PREVIOUS_TAX_YEAR = taxYears.previousYear; // e.g., 2023
  const EXPECTED_INCOME_YEAR = taxYears.expectedIncomeYear; // Always current calendar year

  // ============================================
  // EXPECTED ANNUAL INCOME QUESTION (REUSABLE)
  // ============================================
  // This gets asked when we need current income that differs from tax return AGI
  const renderExpectedIncomeQuestion = (context) => {
    const handleSubmit = () => {
      const expectedIncome = parseFloat(questionnaireData.expectedAnnualIncome || 0);

      // Route back to the context that called this question
      if (context.nextStep) {
        goToStep(context.nextStep);
      }
    };

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            What is your expected annual income for {EXPECTED_INCOME_YEAR}?
          </h3>
          <p className="text-sm text-gray-600">
            Enter your gross income (before taxes) that you expect to earn this calendar year
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            <strong>What to include:</strong> Salary, wages, tips, self-employment income, and other lawful income sources you expect to receive in {EXPECTED_INCOME_YEAR}
          </p>
        </div>

        {context.previousIncome && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-900">
              <strong>Note:</strong> Your {context.previousYear} {context.incomeType} was ${parseFloat(context.previousIncome).toLocaleString()}. Enter your expected {EXPECTED_INCOME_YEAR} income even if it's similar or lower.
            </p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Expected Annual Income ({EXPECTED_INCOME_YEAR})
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              value={questionnaireData.expectedAnnualIncome || ''}
              onChange={(e) => updateQuestionnaireData('expectedAnnualIncome', e.target.value)}
              className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0"
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!questionnaireData.expectedAnnualIncome || parseFloat(questionnaireData.expectedAnnualIncome) <= 0}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    );
  };

  // Specific instances of expected income question for different routes
  const renderExpectedIncome2023 = () => renderExpectedIncomeQuestion({
    previousYear: PREVIOUS_TAX_YEAR,
    previousIncome: questionnaireData.agi2023,
    incomeType: 'AGI',
    nextStep: 'q3b-2023'
  });

  const renderExpectedIncome2024 = () => renderExpectedIncomeQuestion({
    previousYear: MOST_RECENT_TAX_YEAR,
    previousIncome: questionnaireData.agi2024,
    incomeType: 'AGI',
    nextStep: 'q3b-2024'
  });

  const renderExpectedIncomeW2 = () => {
    // Determine the W-2 year from available docs
    const docs = questionnaireData.availableDocs || [];
    const w2Year = docs.includes('w2-2024') ? MOST_RECENT_TAX_YEAR : PREVIOUS_TAX_YEAR;

    return renderExpectedIncomeQuestion({
      previousYear: w2Year,
      previousIncome: questionnaireData.agiW2,
      incomeType: 'AGI',
      nextStep: 'q4-improve-yes'
    });
  };

  const renderExpectedIncomeSE = () => {
    // Determine the self-employment year from available docs
    const docs = questionnaireData.availableDocs || [];
    const seYear = docs.includes('self-employed-2024') ? MOST_RECENT_TAX_YEAR : PREVIOUS_TAX_YEAR;

    return renderExpectedIncomeQuestion({
      previousYear: seYear,
      previousIncome: questionnaireData.agiSE,
      incomeType: 'AGI',
      nextStep: 'q5e'
    });
  };

  // Q1: Did you file taxes?
  const renderQ1 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Did you file federal income taxes for {MOST_RECENT_TAX_YEAR} or {PREVIOUS_TAX_YEAR}?
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
          <p className="text-sm text-gray-600">
            Find this on Line 11 of your Form 1040
          </p>
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
                goToStep('expected-income-2024');
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
            {docs.includes('w2-2024') && <li>• All W-2s from 2024 (if you had multiple jobs)</li>}
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

  // ===========================================
  // W-2 ONLY ROUTE (Q4)
  // ===========================================

  // Q4: Did you file federal taxes using these W-2s?
  const renderQ4 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Did you file federal taxes using these W-2s?
        </h3>
        <p className="text-sm text-gray-600">
          If you received W-2 forms, you were likely required to file a tax return.
        </p>
      </div>

      <div className="space-y-3">
        <button
          onClick={() => goToStep('q4a')}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 text-left"
        >
          Yes - I filed taxes
        </button>
        <button
          onClick={() => goToStep('q4b')}
          className="w-full bg-gray-100 text-gray-900 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 text-left"
        >
          No - I did not file taxes
        </button>
      </div>
    </div>
  );

  // Q4a: Do you have your Form 1040?
  const renderQ4a = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Do you have your Form 1040 (tax return)?
        </h3>
        <p className="text-sm text-gray-600">
          We need your AGI (Adjusted Gross Income) from Line 11 to determine your income level.
        </p>
      </div>

      <div className="space-y-3">
        <button
          onClick={() => goToStep('q4a-input')}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 text-left"
        >
          Yes - I have my Form 1040
        </button>
        <button
          onClick={() => goToStep('q4a-alt')}
          className="w-full bg-gray-100 text-gray-900 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 text-left"
        >
          No - I don't have it right now
        </button>
      </div>
    </div>
  );

  // Q4a-input: Enter AGI from Form 1040
  const renderQ4a_input = () => {
    const handleAgiSubmit = () => {
      const agi = parseFloat(questionnaireData.agiW2 || 0);

      if (agi >= MINIMUM_INCOME_REQUIRED) {
        goToStep('endpoint-w1');
      } else {
        goToStep('q4-improve');
      }
    };

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            What is your Adjusted Gross Income (AGI) from your Form 1040?
          </h3>
          <p className="text-sm text-gray-600">
            Find this on Line 11 of your Form 1040
          </p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-900">
            <strong>Important:</strong> We're looking for your AGI (Line 11), not your W-2 Box 1 wages. Your AGI accounts for deductions and provides the most accurate income picture.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            AGI Amount (Line 11)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              value={questionnaireData.agiW2 || ''}
              onChange={(e) => updateQuestionnaireData('agiW2', e.target.value)}
              className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0"
            />
          </div>
        </div>

        <button
          onClick={handleAgiSubmit}
          disabled={!questionnaireData.agiW2 || parseFloat(questionnaireData.agiW2) <= 0}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    );
  };

  // Q4a-alt: Help getting AGI
  const renderQ4a_alt = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          How to get your AGI (Adjusted Gross Income)
        </h3>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="text-base font-semibold text-blue-900 mb-3">You can find your AGI from:</h4>
        <ul className="space-y-3 text-sm text-blue-900">
          <li><strong>1. IRS online account</strong> - Create a free account at irs.gov and view your tax transcript</li>
          <li><strong>2. Tax software login</strong> - If you used TurboTax, H&R Block, etc., log back in to view your return</li>
          <li><strong>3. Tax preparer</strong> - Contact whoever prepared your taxes for a copy</li>
          <li><strong>4. Request IRS transcript</strong> - Order a free tax transcript from IRS (takes 5-10 days by mail)</li>
        </ul>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-900">
          <strong>Note:</strong> Getting your actual tax transcript from the IRS is the strongest evidence. For now, you can skip to manual upload mode and gather your documents.
        </p>
      </div>

      <div className="space-y-3">
        <button
          onClick={() => goToStep('q4a-input')}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700"
        >
          I found my AGI - Enter it now
        </button>
        <button
          onClick={() => updateQuestionnaireData('mode', 'manual')}
          className="w-full bg-gray-100 text-gray-900 py-3 px-4 rounded-lg font-medium hover:bg-gray-200"
        >
          Skip to manual upload
        </button>
      </div>
    </div>
  );

  // Q4-improve: Has income improved since filing?
  const renderQ4_improve = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Has your income improved since you filed your taxes?
        </h3>
        <p className="text-sm text-gray-600">
          Your AGI of ${parseFloat(questionnaireData.agiW2 || 0).toLocaleString()} is below the ${MINIMUM_INCOME_REQUIRED.toLocaleString()} requirement, but recent income changes could help.
        </p>
      </div>

      <div className="space-y-3">
        <button
          onClick={() => goToStep('expected-income-w2')}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 text-left"
        >
          Yes - My income has increased
        </button>
        <button
          onClick={() => goToStep('endpoint-w2')}
          className="w-full bg-gray-100 text-gray-900 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 text-left"
        >
          No - Income is about the same
        </button>
      </div>
    </div>
  );

  // Q4-improve-yes: Income improvement path
  const renderQ4_improve_yes = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Can you provide recent pay stubs showing your increased income?
        </h3>
        <p className="text-sm text-gray-600">
          Recent pay stubs (1-3 months) help demonstrate your current income level.
        </p>
      </div>

      <div className="space-y-3">
        <button
          onClick={() => goToStep('endpoint-w3')}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 text-left"
        >
          Yes - I can provide recent pay stubs
        </button>
        <button
          onClick={() => goToStep('endpoint-w2')}
          className="w-full bg-gray-100 text-gray-900 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 text-left"
        >
          No - I don't have recent pay stubs
        </button>
      </div>
    </div>
  );

  // Q4b: How many W-2s do you have? (Not Filed Branch)
  const renderQ4b = () => {
    const handleContinue = () => {
      if (questionnaireData.w2Count) {
        goToStep('q4c');
      }
    };

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            How many W-2 forms do you have for this tax year?
          </h3>
          <p className="text-sm text-gray-600">
            Count all W-2s if you had multiple jobs during the year
          </p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-900">
            <strong>Important:</strong> If you received W-2 forms and earned income, you are generally required to file a tax return. We recommend filing before submitting your I-134.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of W-2s
          </label>
          <input
            type="number"
            min="1"
            value={questionnaireData.w2Count || ''}
            onChange={(e) => updateQuestionnaireData('w2Count', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="1"
          />
        </div>

        <button
          onClick={handleContinue}
          disabled={!questionnaireData.w2Count || parseInt(questionnaireData.w2Count) < 1}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    );
  };

  // Q4c: Enter total wages from Box 1 of all W-2s combined
  const renderQ4c = () => {
    const handleContinue = () => {
      if (questionnaireData.w2TotalWages) {
        goToStep('q4d');
      }
    };

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            What is the total of Box 1 (Wages) from all your W-2s combined?
          </h3>
          <p className="text-sm text-gray-600">
            Add up Box 1 from {questionnaireData.w2Count || 'all'} W-2{parseInt(questionnaireData.w2Count) > 1 ? 's' : ''}
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            <strong>Box 1</strong> shows your total taxable wages from each employer. This is your gross pay minus pre-tax deductions like 401(k) contributions.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Total Wages (Box 1 combined)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              value={questionnaireData.w2TotalWages || ''}
              onChange={(e) => updateQuestionnaireData('w2TotalWages', e.target.value)}
              className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0"
            />
          </div>
        </div>

        <button
          onClick={handleContinue}
          disabled={!questionnaireData.w2TotalWages || parseFloat(questionnaireData.w2TotalWages) <= 0}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    );
  };

  // Q4d: Is this from current employer from Section 2.6?
  const renderQ4d = () => {
    const mostRecentEmployer = mostRecentEmployment?.employer || 'your current employer';

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Is this W-2 income from {mostRecentEmployer}?
          </h3>
          <p className="text-sm text-gray-600">
            We're checking if this is your current employment from Section 2.6
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => goToStep('q4e')}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 text-left"
          >
            Yes - Same employer
          </button>
          <button
            onClick={() => goToStep('q4f')}
            className="w-full bg-gray-100 text-gray-900 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 text-left"
          >
            No - Different employer or multiple employers
          </button>
        </div>
      </div>
    );
  };

  // Q4e: Can you get employment letter?
  const renderQ4e = () => {
    const totalWages = parseFloat(questionnaireData.w2TotalWages || 0);

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Can you obtain an employment verification letter from your current employer?
          </h3>
          <p className="text-sm text-gray-600">
            An employment letter significantly strengthens your case
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => {
              if (totalWages >= MINIMUM_INCOME_REQUIRED) {
                goToStep('endpoint-w4');
              } else {
                goToStep('endpoint-w5');
              }
            }}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 text-left"
          >
            Yes - I can get an employment letter
          </button>
          <button
            onClick={() => goToStep('endpoint-w6')}
            className="w-full bg-gray-100 text-gray-900 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 text-left"
          >
            No - I cannot get an employment letter
          </button>
        </div>
      </div>
    );
  };

  // Q4f: Has income changed since W-2 period?
  const renderQ4f = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Has your employment or income situation changed since the W-2 period?
        </h3>
        <p className="text-sm text-gray-600">
          For example, did you get a new job, promotion, or raise?
        </p>
      </div>

      <div className="space-y-3">
        <button
          onClick={() => goToStep('endpoint-w5')}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 text-left"
        >
          Yes - My situation has changed
        </button>
        <button
          onClick={() => goToStep('endpoint-w6')}
          className="w-full bg-gray-100 text-gray-900 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 text-left"
        >
          No - About the same
        </button>
      </div>
    </div>
  );

  // ===========================================
  // W-2 ROUTE ENDPOINTS
  // ===========================================

  // ENDPOINT W1: W-2 + Form 1040, meets income requirement
  const renderEndpointW1 = () => {
    const agi = parseFloat(questionnaireData.agiW2 || 0);

    return (
      <div className="space-y-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-start">
            <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-green-900">Great!</h3>
              <p className="text-sm text-green-800 mt-1">
                Your income of ${agi.toLocaleString()} meets the ${MINIMUM_INCOME_REQUIRED.toLocaleString()} requirement.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-900">
            <strong>Important:</strong> While you have your Form 1040 and W-2s, obtaining an IRS Tax Transcript would provide stronger evidence. Consider requesting one from the IRS.
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h4 className="text-base font-semibold text-blue-900 mb-3">We recommend uploading:</h4>
          <ul className="space-y-2 text-sm text-blue-900">
            <li>• Form 1040 (your filed tax return)</li>
            <li>• All W-2s from the tax year (if you had multiple jobs)</li>
            <li>• Employment verification letter from current employer</li>
            <li>• Recent pay stubs (1-3 months)</li>
            <li>• Bank statements showing regular deposits</li>
          </ul>
        </div>

        <button onClick={() => goToStep('document-upload')} className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700">
          Proceed to Document Upload
        </button>
      </div>
    );
  };

  // ENDPOINT W2: Income below, no improvement
  const renderEndpointW2 = () => {
    const agi = parseFloat(questionnaireData.agiW2 || 0);
    const gap = MINIMUM_INCOME_REQUIRED - agi;
    const assetsNeeded = gap * 3;

    return (
      <div className="space-y-6">
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
          <div className="flex items-start">
            <AlertCircle className="h-6 w-6 text-orange-600 flex-shrink-0 mt-0.5" />
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-orange-900">Income Below Requirement</h3>
              <p className="text-sm text-orange-800 mt-1">
                Your AGI of ${agi.toLocaleString()} is ${gap.toLocaleString()} below the ${MINIMUM_INCOME_REQUIRED.toLocaleString()} requirement.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h4 className="text-base font-semibold text-blue-900 mb-3">You will need to show assets of approximately ${assetsNeeded.toLocaleString()}</h4>
          <p className="text-sm text-blue-900 mb-3">Assets can include:</p>
          <ul className="space-y-2 text-sm text-blue-900">
            <li>• Savings and checking account balances</li>
            <li>• Certificates of deposit (CDs)</li>
            <li>• Stocks, bonds, mutual funds</li>
            <li>• Real estate equity (minus mortgages)</li>
            <li>• Retirement accounts (401k, IRA) - only amount accessible without penalty</li>
          </ul>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h4 className="text-base font-semibold text-blue-900 mb-3">For now, upload:</h4>
          <ul className="space-y-2 text-sm text-blue-900">
            <li>• Form 1040 (your filed tax return)</li>
            <li>• All W-2s from the tax year</li>
            <li>• Recent pay stubs if available</li>
            <li>• Bank statements</li>
          </ul>
          <p className="text-sm text-blue-900 mt-3">
            You'll document your assets in the next section.
          </p>
        </div>

        <button onClick={() => goToStep('document-upload')} className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700">
          Proceed to Document Upload
        </button>
      </div>
    );
  };

  // ENDPOINT W3: Income improved with pay stubs
  const renderEndpointW3 = () => {
    const agi = parseFloat(questionnaireData.agiW2 || 0);

    return (
      <div className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start">
            <Info className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-blue-900">Income Improvement Path</h3>
              <p className="text-sm text-blue-800 mt-1">
                Your tax return showed ${agi.toLocaleString()}, but recent pay stubs will help demonstrate your current income level.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-900">
            <strong>Important:</strong> Make sure your recent pay stubs clearly show increased wages. Include an employment letter if possible to confirm your current salary.
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h4 className="text-base font-semibold text-blue-900 mb-3">We recommend uploading:</h4>
          <ul className="space-y-2 text-sm text-blue-900">
            <li>• Form 1040 (your filed tax return)</li>
            <li>• All W-2s from the tax year</li>
            <li>• Employment verification letter (showing current salary)</li>
            <li>• Recent pay stubs (1-3 months showing increased income)</li>
            <li>• Bank statements showing regular deposits</li>
          </ul>
        </div>

        <button onClick={() => goToStep('document-upload')} className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700">
          Proceed to Document Upload
        </button>
      </div>
    );
  };

  // ENDPOINT W4: W-2 only, no filing, meets income
  const renderEndpointW4 = () => {
    const totalWages = parseFloat(questionnaireData.w2TotalWages || 0);

    return (
      <div className="space-y-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-start">
            <AlertCircle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-yellow-900">Stronger Evidence Needed</h3>
              <p className="text-sm text-yellow-800 mt-1">
                While your W-2 wages of ${totalWages.toLocaleString()} meet the requirement, not filing taxes weakens your case significantly.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-900">
            <strong>Strongly Recommended:</strong> File your tax return before submitting Form I-134. This provides official IRS documentation of your income and demonstrates tax compliance.
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h4 className="text-base font-semibold text-blue-900 mb-3">We recommend uploading:</h4>
          <ul className="space-y-2 text-sm text-blue-900">
            <li>• All W-2s from the tax year</li>
            <li>• Employment verification letter from current employer</li>
            <li>• Recent pay stubs (1-3 months)</li>
            <li>• Bank statements showing regular deposits</li>
          </ul>
        </div>

        <button onClick={() => goToStep('document-upload')} className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700">
          Proceed to Document Upload
        </button>
      </div>
    );
  };

  // ENDPOINT W5: W-2 only, below threshold or situation changed
  const renderEndpointW5 = () => {
    const totalWages = parseFloat(questionnaireData.w2TotalWages || 0);
    const isBelowThreshold = totalWages < MINIMUM_INCOME_REQUIRED;

    return (
      <div className="space-y-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-start">
            <AlertCircle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-yellow-900">
                {isBelowThreshold ? 'Income Below Requirement' : 'Employment Situation Changed'}
              </h3>
              <p className="text-sm text-yellow-800 mt-1">
                {isBelowThreshold
                  ? `Your W-2 wages of $${totalWages.toLocaleString()} are below the $${MINIMUM_INCOME_REQUIRED.toLocaleString()} requirement.`
                  : 'Since your situation has changed, you\'ll need current employment documentation.'
                }
              </p>
            </div>
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-900">
            <strong>Strongly Recommended:</strong> File your tax return before submitting Form I-134 to provide official income documentation.
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h4 className="text-base font-semibold text-blue-900 mb-3">We recommend uploading:</h4>
          <ul className="space-y-2 text-sm text-blue-900">
            <li>• All W-2s from the tax year</li>
            <li>• Employment verification letter from current employer (showing current salary)</li>
            <li>• Recent pay stubs (1-3 months)</li>
            <li>• Bank statements showing regular deposits</li>
            {isBelowThreshold && <li>• Asset documentation (you may need to supplement with assets)</li>}
          </ul>
        </div>

        <button onClick={() => goToStep('document-upload')} className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700">
          Proceed to Document Upload
        </button>
      </div>
    );
  };

  // ENDPOINT W6: W-2 only, weakest case
  const renderEndpointW6 = () => {
    const totalWages = parseFloat(questionnaireData.w2TotalWages || 0);
    const gap = Math.max(0, MINIMUM_INCOME_REQUIRED - totalWages);
    const assetsNeeded = gap > 0 ? gap * 3 : 0;

    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-start">
            <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-red-900">Weak Evidence - Action Required</h3>
              <p className="text-sm text-red-800 mt-1">
                Without tax filing or employment letter, your case is significantly weakened.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-900 mb-3">
            <strong>Strongly Recommended Actions:</strong>
          </p>
          <ol className="list-decimal list-inside space-y-2 text-sm text-red-900">
            <li>File your tax return to get official IRS documentation</li>
            <li>Obtain an employment verification letter from your employer</li>
            {gap > 0 && <li>Prepare to document ${assetsNeeded.toLocaleString()} in assets to cover the income gap</li>}
          </ol>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h4 className="text-base font-semibold text-blue-900 mb-3">For now, upload:</h4>
          <ul className="space-y-2 text-sm text-blue-900">
            <li>• All W-2s from the tax year</li>
            <li>• Recent pay stubs (1-3 months)</li>
            <li>• Bank statements showing regular deposits</li>
            {gap > 0 && <li>• Asset documentation</li>}
          </ul>
        </div>

        <button onClick={() => goToStep('document-upload')} className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700">
          Proceed to Document Upload
        </button>
      </div>
    );
  };

  // ===========================================
  // SELF-EMPLOYED ROUTE (Q5)
  // ===========================================

  // Q5: Did you file taxes including self-employment income?
  const renderQ5 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Did you file federal taxes including your self-employment income?
        </h3>
        <p className="text-sm text-gray-600">
          Self-employment income is typically reported on Schedule C or via 1099 forms
        </p>
      </div>

      <div className="space-y-3">
        <button
          onClick={() => goToStep('q5a')}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 text-left"
        >
          Yes - I filed taxes
        </button>
        <button
          onClick={() => goToStep('q5f')}
          className="w-full bg-gray-100 text-gray-900 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 text-left"
        >
          No - I did not file taxes
        </button>
      </div>
    </div>
  );

  // Q5a: Enter AGI from Form 1040
  const renderQ5a = () => {
    const handleAgiSubmit = () => {
      const agi = parseFloat(questionnaireData.agiSE || 0);

      if (agi >= MINIMUM_INCOME_REQUIRED) {
        goToStep('q5c');
      } else {
        goToStep('q5d');
      }
    };

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            What is your Adjusted Gross Income (AGI) from your Form 1040?
          </h3>
          <p className="text-sm text-gray-600">
            Find this on Line 11 of your Form 1040
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            <strong>Important for self-employed:</strong> Your AGI (Line 11) may be different from your Schedule C net profit. The AGI includes all income sources and deductions, providing the most accurate picture for I-134 purposes.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            AGI Amount (Line 11)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              value={questionnaireData.agiSE || ''}
              onChange={(e) => updateQuestionnaireData('agiSE', e.target.value)}
              className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0"
            />
          </div>
        </div>

        <button
          onClick={handleAgiSubmit}
          disabled={!questionnaireData.agiSE || parseFloat(questionnaireData.agiSE) <= 0}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    );
  };

  // Q5c: Has income been consistent for past 12 months? (AGI meets requirement)
  const renderQ5c = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Has your self-employment income been consistent over the past 12 months?
        </h3>
        <p className="text-sm text-gray-600">
          Consistent income demonstrates financial stability, which strengthens your I-134 case
        </p>
      </div>

      <div className="space-y-3">
        <button
          onClick={() => goToStep('endpoint-se1')}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 text-left"
        >
          Yes - Consistent income
        </button>
        <button
          onClick={() => goToStep('endpoint-se2')}
          className="w-full bg-gray-100 text-gray-900 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 text-left"
        >
          No - Income fluctuates significantly
        </button>
      </div>
    </div>
  );

  // Q5d: Has income increased since filing? (AGI below requirement)
  const renderQ5d = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Has your self-employment income increased since you filed your taxes?
        </h3>
        <p className="text-sm text-gray-600">
          Your AGI of ${parseFloat(questionnaireData.agiSE || 0).toLocaleString()} is below the ${MINIMUM_INCOME_REQUIRED.toLocaleString()} requirement
        </p>
      </div>

      <div className="space-y-3">
        <button
          onClick={() => goToStep('expected-income-se')}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 text-left"
        >
          Yes - My income has increased
        </button>
        <button
          onClick={() => goToStep('endpoint-se5')}
          className="w-full bg-gray-100 text-gray-900 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 text-left"
        >
          No - Income is about the same or lower
        </button>
      </div>
    </div>
  );

  // Q5e: Can you provide bank statements showing increase?
  const renderQ5e = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Can you provide bank statements showing increased business deposits?
        </h3>
        <p className="text-sm text-gray-600">
          Bank statements (12 months) showing regular deposits help demonstrate your current income level
        </p>
      </div>

      <div className="space-y-3">
        <button
          onClick={() => goToStep('endpoint-se3')}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 text-left"
        >
          Yes - I have bank statements showing increase
        </button>
        <button
          onClick={() => goToStep('endpoint-se4')}
          className="w-full bg-gray-100 text-gray-900 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 text-left"
        >
          No - I don't have clear documentation of increase
        </button>
      </div>
    </div>
  );

  // Q5f: Earned $400+ from self-employment in past year? (Not Filed Branch)
  const renderQ5f = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Did you earn $400 or more from self-employment in the past year?
        </h3>
        <p className="text-sm text-gray-600">
          IRS requires filing if you earned $400+ from self-employment
        </p>
      </div>

      <div className="space-y-3">
        <button
          onClick={() => goToStep('endpoint-se-critical')}
          className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 text-left"
        >
          Yes - I earned $400 or more
        </button>
        <button
          onClick={() => goToStep('q7')}
          className="w-full bg-gray-100 text-gray-900 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 text-left"
        >
          No - I earned less than $400
        </button>
      </div>
    </div>
  );

  // ===========================================
  // SELF-EMPLOYED ROUTE ENDPOINTS
  // ===========================================

  // ENDPOINT SE-1: Self-employed, filed taxes, meets income, consistent
  const renderEndpointSE1 = () => {
    const agi = parseFloat(questionnaireData.agiSE || 0);

    return (
      <div className="space-y-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-start">
            <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-green-900">Strong Case!</h3>
              <p className="text-sm text-green-800 mt-1">
                Your income of ${agi.toLocaleString()} meets the ${MINIMUM_INCOME_REQUIRED.toLocaleString()} requirement with consistent self-employment earnings.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h4 className="text-base font-semibold text-blue-900 mb-3">We recommend uploading:</h4>
          <ul className="space-y-2 text-sm text-blue-900">
            <li>• Form 1040 (your filed tax return)</li>
            <li>• IRS Tax Transcript (if available - strengthens your case)</li>
            <li>• Schedule C or all 1099 forms</li>
            <li>• Business bank statements (12 months showing regular deposits)</li>
            <li>• Personal bank statements</li>
          </ul>
        </div>

        <button onClick={() => goToStep('document-upload')} className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700">
          Proceed to Document Upload
        </button>
      </div>
    );
  };

  // ENDPOINT SE-2: Self-employed, filed taxes, meets income, but inconsistent
  const renderEndpointSE2 = () => {
    const agi = parseFloat(questionnaireData.agiSE || 0);

    return (
      <div className="space-y-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-start">
            <AlertCircle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-yellow-900">Income Fluctuation - Additional Evidence Needed</h3>
              <p className="text-sm text-yellow-800 mt-1">
                While your AGI of ${agi.toLocaleString()} meets the requirement, income fluctuations may raise questions. You'll need to demonstrate financial stability.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            <strong>Tip:</strong> Include a brief explanation letter describing your business cycle and showing that you can consistently meet the income requirement despite fluctuations.
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h4 className="text-base font-semibold text-blue-900 mb-3">We recommend uploading:</h4>
          <ul className="space-y-2 text-sm text-blue-900">
            <li>• Form 1040 (your filed tax return)</li>
            <li>• IRS Tax Transcript (if available)</li>
            <li>• Schedule C or all 1099 forms</li>
            <li>• Business bank statements (12 months showing deposit pattern)</li>
            <li>• Personal bank statements</li>
            <li>• Brief explanation letter about income fluctuations and business stability</li>
          </ul>
        </div>

        <button onClick={() => goToStep('document-upload')} className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700">
          Proceed to Document Upload
        </button>
      </div>
    );
  };

  // ENDPOINT SE-3: Self-employed, income improved with bank statements
  const renderEndpointSE3 = () => {
    const agi = parseFloat(questionnaireData.agiSE || 0);

    return (
      <div className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start">
            <Info className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-blue-900">Income Improvement Path</h3>
              <p className="text-sm text-blue-800 mt-1">
                Your tax return showed ${agi.toLocaleString()}, but recent bank statements will help demonstrate your improved income.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-900">
            <strong>Important:</strong> Your bank statements should clearly show regular business deposits that demonstrate improved income. Highlight or annotate business-related deposits if your account has mixed personal/business transactions.
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h4 className="text-base font-semibold text-blue-900 mb-3">We recommend uploading:</h4>
          <ul className="space-y-2 text-sm text-blue-900">
            <li>• Form 1040 (your filed tax return)</li>
            <li>• IRS Tax Transcript (if available)</li>
            <li>• Schedule C or all 1099 forms</li>
            <li>• Business bank statements (12 months showing increased deposits)</li>
            <li>• Personal bank statements</li>
            <li>• Brief explanation of income increase</li>
          </ul>
        </div>

        <button onClick={() => goToStep('document-upload')} className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700">
          Proceed to Document Upload
        </button>
      </div>
    );
  };

  // ENDPOINT SE-4: Self-employed, weak proof of income increase
  const renderEndpointSE4 = () => {
    const agi = parseFloat(questionnaireData.agiSE || 0);
    const gap = MINIMUM_INCOME_REQUIRED - agi;
    const assetsNeeded = gap * 3;

    return (
      <div className="space-y-6">
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
          <div className="flex items-start">
            <AlertCircle className="h-6 w-6 text-orange-600 flex-shrink-0 mt-0.5" />
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-orange-900">Weak Income Documentation</h3>
              <p className="text-sm text-orange-800 mt-1">
                Without clear documentation of increased income, you'll likely need to supplement with assets.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h4 className="text-base font-semibold text-blue-900 mb-3">You will need to show assets of approximately ${assetsNeeded.toLocaleString()}</h4>
          <p className="text-sm text-blue-900 mb-3">This covers the ${gap.toLocaleString()} gap between your documented income and the requirement.</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h4 className="text-base font-semibold text-blue-900 mb-3">We recommend uploading:</h4>
          <ul className="space-y-2 text-sm text-blue-900">
            <li>• Form 1040 (your filed tax return)</li>
            <li>• IRS Tax Transcript (if available)</li>
            <li>• Schedule C or all 1099 forms</li>
            <li>• Business and personal bank statements</li>
            <li>• Asset documentation (you'll detail this in the next section)</li>
          </ul>
        </div>

        <button onClick={() => goToStep('document-upload')} className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700">
          Proceed to Document Upload
        </button>
      </div>
    );
  };

  // ENDPOINT SE-5: Self-employed, income below, no improvement
  const renderEndpointSE5 = () => {
    const agi = parseFloat(questionnaireData.agiSE || 0);
    const gap = MINIMUM_INCOME_REQUIRED - agi;
    const assetsNeeded = gap * 3;

    return (
      <div className="space-y-6">
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
          <div className="flex items-start">
            <AlertCircle className="h-6 w-6 text-orange-600 flex-shrink-0 mt-0.5" />
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-orange-900">Income Below Requirement</h3>
              <p className="text-sm text-orange-800 mt-1">
                Your AGI of ${agi.toLocaleString()} is ${gap.toLocaleString()} below the ${MINIMUM_INCOME_REQUIRED.toLocaleString()} requirement.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h4 className="text-base font-semibold text-blue-900 mb-3">You will need to show assets of approximately ${assetsNeeded.toLocaleString()}</h4>
          <p className="text-sm text-blue-900 mb-3">Assets can include:</p>
          <ul className="space-y-2 text-sm text-blue-900">
            <li>• Savings and checking account balances</li>
            <li>• Certificates of deposit (CDs)</li>
            <li>• Stocks, bonds, mutual funds</li>
            <li>• Real estate equity (minus mortgages)</li>
            <li>• Retirement accounts (401k, IRA) - only amount accessible without penalty</li>
          </ul>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h4 className="text-base font-semibold text-blue-900 mb-3">For now, upload:</h4>
          <ul className="space-y-2 text-sm text-blue-900">
            <li>• Form 1040 (your filed tax return)</li>
            <li>• IRS Tax Transcript (if available)</li>
            <li>• Schedule C or all 1099 forms</li>
            <li>• Business bank statements (12 months)</li>
            <li>• Personal bank statements</li>
          </ul>
          <p className="text-sm text-blue-900 mt-3">
            You'll document your assets in the next section.
          </p>
        </div>

        <button onClick={() => goToStep('document-upload')} className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700">
          Proceed to Document Upload
        </button>
      </div>
    );
  };

  // ENDPOINT SE-CRITICAL: Self-employed, earned $400+, should have filed
  const renderEndpointSE_Critical = () => (
    <div className="space-y-6">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-start">
          <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="ml-3">
            <h3 className="text-lg font-semibold text-red-900">Critical Issue - Tax Filing Required</h3>
            <p className="text-sm text-red-800 mt-1">
              If you earned $400 or more from self-employment, you are required by law to file a tax return. Not filing creates a serious problem for your I-134.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h4 className="text-base font-semibold text-red-900 mb-3">We strongly recommend:</h4>
        <ol className="list-decimal list-inside space-y-2 text-sm text-red-900">
          <li><strong>File your tax return immediately</strong> - This resolves both the legal requirement and provides official income documentation</li>
          <li><strong>Consider a joint sponsor</strong> - Someone else who meets the income requirement can co-sponsor</li>
          <li><strong>Consult an immigration attorney</strong> - Professional guidance for this complex situation</li>
        </ol>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-900">
          <strong>Note:</strong> Proceeding without filing taxes when required significantly weakens your I-134 and may raise red flags about tax compliance.
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="text-base font-semibold text-blue-900 mb-3">If you proceed anyway, upload what you can:</h4>
        <ul className="space-y-2 text-sm text-blue-900">
          <li>• Business bank statements (Must show: date opened, total deposited past year, present balance)</li>
          <li>• All 1099 forms you've received</li>
          <li>• Business financial records</li>
          <li>• Asset documentation</li>
        </ul>
      </div>

      <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
        <p className="text-sm text-gray-700">
          <strong>Consider contacting customer support</strong> to discuss your options before proceeding.
        </p>
      </div>

      <button onClick={() => updateQuestionnaireData('mode', 'manual')} className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700">
        Proceed to Manual Upload
      </button>
    </div>
  );

  // ===========================================
  // Q7 - Q11: No Taxes Filed Route
  // ===========================================

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

  // Q8: Employment check (routes based on Section 2.6 data)
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

  // ===========================================
  // 2023 TAX TRANSCRIPT ROUTE (NEW)
  // ===========================================

  // Q3-2023: Tax Transcript 2023 - AGI entry
  const renderQ3_2023 = () => {
    const handleAgiSubmit = () => {
      const agi = parseFloat(questionnaireData.agi2023 || 0);

      if (agi >= MINIMUM_INCOME_REQUIRED) {
        goToStep('endpoint-a1-2023');
      } else {
        goToStep('q3a-2023');
      }
    };

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            What is your Adjusted Gross Income (AGI) from your 2023 tax return?
          </h3>
          <p className="text-sm text-gray-600">
            Find this on Line 11 of your Form 1040
          </p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-900">
            <strong>Note:</strong> Since your 2023 tax return is from an earlier year, including recent 2024/2025 employment documentation will strengthen your case.
          </p>
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
              value={questionnaireData.agi2023 || ''}
              onChange={(e) => updateQuestionnaireData('agi2023', e.target.value)}
              className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0"
            />
          </div>
        </div>

        <button
          onClick={handleAgiSubmit}
          disabled={!questionnaireData.agi2023}
          className={`w-full py-3 px-4 rounded-lg font-medium ${
            questionnaireData.agi2023
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Continue
        </button>
      </div>
    );
  };

  // Q3a-2023: Has income improved since 2023?
  const renderQ3a_2023 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Has your income improved since you filed your 2023 tax return?
        </h3>
        <p className="text-sm text-gray-600">
          Your 2023 AGI was ${parseFloat(questionnaireData.agi2023 || 0).toLocaleString()}, which is below the ${MINIMUM_INCOME_REQUIRED.toLocaleString()} requirement.
        </p>
      </div>

      <div className="space-y-3">
        <label className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
          <input
            type="radio"
            name="incomeImproved2023"
            value="yes"
            checked={questionnaireData.incomeImproved2023 === 'yes'}
            onChange={(e) => {
              updateQuestionnaireData('incomeImproved2023', e.target.value);
              goToStep('expected-income-2023');
            }}
            className="h-4 w-4 text-blue-600"
          />
          <span className="text-sm font-medium text-gray-900">Yes, my income has improved</span>
        </label>

        <label className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
          <input
            type="radio"
            name="incomeImproved2023"
            value="no"
            checked={questionnaireData.incomeImproved2023 === 'no'}
            onChange={(e) => {
              updateQuestionnaireData('incomeImproved2023', e.target.value);
              goToStep('q3b-2023-same');
            }}
            className="h-4 w-4 text-blue-600"
          />
          <span className="text-sm font-medium text-gray-900">No, my income is about the same or lower</span>
        </label>
      </div>
    </div>
  );

  // Q3b-2023: Will 2025 AGI meet requirement?
  const renderQ3b_2023 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Will your projected 2025 AGI be at least ${MINIMUM_INCOME_REQUIRED.toLocaleString()}?
        </h3>
      </div>

      <div className="space-y-3">
        <label className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
          <input
            type="radio"
            name="projected2025Meets2023"
            value="yes"
            checked={questionnaireData.projected2025Meets2023 === 'yes'}
            onChange={(e) => {
              updateQuestionnaireData('projected2025Meets2023', e.target.value);
              goToStep('q3c-2023');
            }}
            className="h-4 w-4 text-blue-600"
          />
          <span className="text-sm font-medium text-gray-900">Yes</span>
        </label>

        <label className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
          <input
            type="radio"
            name="projected2025Meets2023"
            value="no"
            checked={questionnaireData.projected2025Meets2023 === 'no'}
            onChange={(e) => {
              updateQuestionnaireData('projected2025Meets2023', e.target.value);
              goToStep('q3d-2023');
            }}
            className="h-4 w-4 text-blue-600"
          />
          <span className="text-sm font-medium text-gray-900">No</span>
        </label>
      </div>
    </div>
  );

  // Q3c-2023: Can get employment letter?
  const renderQ3c_2023 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Can you get an employment verification letter from your employer?
        </h3>
        <p className="text-sm text-gray-600">
          Letter must include: date/nature of employment, current salary, and whether position is temporary or permanent
        </p>
      </div>

      <div className="space-y-3">
        <label className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
          <input
            type="radio"
            name="canGetLetter2023"
            value="yes"
            checked={questionnaireData.canGetLetter2023 === 'yes'}
            onChange={(e) => {
              updateQuestionnaireData('canGetLetter2023', e.target.value);
              goToStep('q3e-2023');
            }}
            className="h-4 w-4 text-blue-600"
          />
          <span className="text-sm font-medium text-gray-900">Yes</span>
        </label>

        <label className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
          <input
            type="radio"
            name="canGetLetter2023"
            value="no"
            checked={questionnaireData.canGetLetter2023 === 'no'}
            onChange={(e) => {
              updateQuestionnaireData('canGetLetter2023', e.target.value);
              goToStep('endpoint-a3-2023');
            }}
            className="h-4 w-4 text-blue-600"
          />
          <span className="text-sm font-medium text-gray-900">No</span>
        </label>
      </div>
    </div>
  );

  // Q3e-2023: Position type?
  const renderQ3e_2023 = () => (
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
            name="positionType2023"
            value="permanent"
            checked={questionnaireData.positionType2023 === 'permanent'}
            onChange={(e) => {
              updateQuestionnaireData('positionType2023', e.target.value);
              goToStep('endpoint-a4-2023');
            }}
            className="h-4 w-4 text-blue-600"
          />
          <span className="text-sm font-medium text-gray-900">Permanent</span>
        </label>

        <label className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
          <input
            type="radio"
            name="positionType2023"
            value="temporary"
            checked={questionnaireData.positionType2023 === 'temporary'}
            onChange={(e) => {
              updateQuestionnaireData('positionType2023', e.target.value);
              goToStep('endpoint-a5-2023');
            }}
            className="h-4 w-4 text-blue-600"
          />
          <span className="text-sm font-medium text-gray-900">Temporary</span>
        </label>
      </div>
    </div>
  );

  // Q3d-2023 and Q3b-2023-same: Supplementary docs (similar to 2024)
  const renderQ3d_2023 = () => {
    const current = questionnaireData.supplementaryDocs2023StillBelow || [];
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
            { id: 'employment-letter', label: 'Employment verification letter (recent)' },
            { id: 'w2-recent', label: 'Recent W-2s or pay stubs from 2024/2025' },
            { id: 'pay-stubs', label: 'Pay stubs from 2024/2025' },
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
                onChange={() => handleNoneOfAboveToggle(current, doc.id, 'supplementaryDocs2023StillBelow')}
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
                onChange={() => handleNoneOfAboveToggle(current, 'none', 'supplementaryDocs2023StillBelow')}
                className="h-4 w-4 text-blue-600 rounded"
              />
              <span className="text-sm font-medium text-gray-700">None of the above</span>
            </label>
          </div>
        </div>

        <button
          onClick={() => goToStep('endpoint-a6-2023')}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700"
        >
          Continue
        </button>
      </div>
    );
  };

  const renderQ3b_2023_same = () => {
    const current = questionnaireData.supplementaryDocs2023Same || [];
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
            { id: 'employment-letter', label: 'Employment verification letter (recent)' },
            { id: 'recent-docs', label: 'Recent pay stubs from 2024/2025' },
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
                onChange={() => handleNoneOfAboveToggle(current, doc.id, 'supplementaryDocs2023Same')}
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
                onChange={() => handleNoneOfAboveToggle(current, 'none', 'supplementaryDocs2023Same')}
                className="h-4 w-4 text-blue-600 rounded"
              />
              <span className="text-sm font-medium text-gray-700">None of the above</span>
            </label>
          </div>
        </div>

        <button
          onClick={() => goToStep('endpoint-a2-2023')}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700"
        >
          Continue
        </button>
      </div>
    );
  };

  // 2023 ENDPOINTS
  const renderEndpointA1_2023 = () => (
    <div className="space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-start">
          <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
          <div className="ml-3">
            <h3 className="text-lg font-semibold text-green-900">Great!</h3>
            <p className="text-sm text-green-800 mt-1">
              Your 2023 income of ${parseFloat(questionnaireData.agi2023 || 0).toLocaleString()} meets the ${MINIMUM_INCOME_REQUIRED.toLocaleString()} requirement.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-900">
          <strong>Important:</strong> Since your 2023 tax return is from an earlier year, include recent 2024/2025 documentation to show your income remains stable.
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="text-base font-semibold text-blue-900 mb-3">We recommend uploading:</h4>
        <ul className="space-y-3">
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            <div>
              <p className="text-sm font-medium text-blue-900">IRS Tax Transcript (2023)</p>
              <p className="text-sm text-blue-800">Primary proof - official IRS verification of 2023 income</p>
            </div>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            <div>
              <p className="text-sm font-medium text-blue-900">Form 1040 (2023)</p>
              <p className="text-sm text-blue-800">Helpful to include alongside transcript</p>
            </div>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            <div>
              <p className="text-sm font-medium text-blue-900">All W-2s from 2023 (if you had multiple jobs)</p>
            </div>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            <div>
              <p className="text-sm font-medium text-blue-900">Employment verification letter (recent - dated 2024/2025)</p>
              <p className="text-sm text-blue-800">Must show date/nature of employment, salary paid, temporary/permanent status</p>
            </div>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            <div>
              <p className="text-sm font-medium text-blue-900">Recent pay stubs (1-3 months from 2024/2025)</p>
              <p className="text-sm text-blue-800">Shows your income has continued</p>
            </div>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            <div>
              <p className="text-sm font-medium text-blue-900">Bank statements</p>
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

  const renderEndpointA2_2023 = () => {
    const docs = questionnaireData.supplementaryDocs2023Same || [];
    const gap = calculateGap(questionnaireData.agi2023);

    return (
      <div className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-gray-700">
            Not to worry - we'll document your 2023 income and use assets to cover the ${gap.toLocaleString()} shortfall.
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h4 className="text-base font-semibold text-blue-900 mb-3">We recommend uploading:</h4>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <div>
                <p className="text-sm font-medium text-blue-900">IRS Tax Transcript (2023)</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <div>
                <p className="text-sm font-medium text-blue-900">Form 1040 (2023)</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <div>
                <p className="text-sm font-medium text-blue-900">All W-2s from 2023 (if you had multiple jobs)</p>
              </div>
            </li>
            {docs.includes('employment-letter') && (
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <div>
                  <p className="text-sm font-medium text-blue-900">Employment verification letter (recent)</p>
                </div>
              </li>
            )}
            {docs.includes('recent-docs') && (
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <div>
                  <p className="text-sm font-medium text-blue-900">Recent pay stubs from 2024/2025</p>
                </div>
              </li>
            )}
            {docs.includes('bank-statements') && (
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <div>
                  <p className="text-sm font-medium text-blue-900">Bank statements</p>
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

  const renderEndpointA3_2023 = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-gray-700">
          Without an employment letter to verify your increased income, we'll need other documentation to show your improved income.
        </p>
        <p className="text-sm text-gray-700 mt-2">
          💡 Note: We recommend trying to get an employment verification letter from your employer, as it clearly states your current annual salary.
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="text-base font-semibold text-blue-900 mb-3">We recommend uploading:</h4>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>• IRS Tax Transcript (2023)</li>
          <li>• Form 1040 (2023)</li>
          <li>• All W-2s from 2023 (if you had multiple jobs)</li>
          <li>• Recent pay stubs from 2024/2025 (minimum 1 month consecutive, 2-3 months preferred)</li>
          <li>• Bank statements</li>
        </ul>
      </div>

      <button onClick={() => goToStep('document-upload')} className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700">
        Proceed to Document Upload
      </button>
    </div>
  );

  const renderEndpointA4_2023 = () => (
    <div className="space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <CheckCircle className="h-6 w-6 text-green-600 mb-2" />
        <p className="text-sm text-green-800">
          Excellent! Your 2023 transcript combined with your current permanent position shows you meet the requirement.
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="text-base font-semibold text-blue-900 mb-3">We recommend uploading:</h4>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>• IRS Tax Transcript (2023)</li>
          <li>• Form 1040 (2023)</li>
          <li>• All W-2s from 2023 (if you had multiple jobs)</li>
          <li>• Employment verification letter (recent - dated 2024/2025)</li>
          <li>• Recent pay stubs from 2024/2025 (minimum 1 month, 2-3 preferred)</li>
          <li>• Bank statements</li>
        </ul>
      </div>

      <button onClick={() => goToStep('document-upload')} className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700">
        Proceed to Document Upload
      </button>
    </div>
  );

  const renderEndpointA5_2023 = () => (
    <div className="space-y-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-900">
          Temporary positions require additional proof of financial stability.
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="text-base font-semibold text-blue-900 mb-3">We recommend uploading:</h4>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>• IRS Tax Transcript (2023)</li>
          <li>• Form 1040 (2023)</li>
          <li>• All W-2s from 2023 (if you had multiple jobs)</li>
          <li>• Employment verification letter (recent - must show temporary status)</li>
          <li>• Recent pay stubs from 2024/2025</li>
          <li>• Bank statements</li>
        </ul>
      </div>

      <button onClick={() => goToStep('document-upload')} className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700">
        Proceed to Document Upload
      </button>
    </div>
  );

  const renderEndpointA6_2023 = () => {
    const docs = questionnaireData.supplementaryDocs2023StillBelow || [];
    return (
      <div className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h4 className="text-base font-semibold text-blue-900 mb-3">We recommend uploading:</h4>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• IRS Tax Transcript (2023)</li>
            <li>• Form 1040 (2023)</li>
            <li>• All W-2s from 2023 (if you had multiple jobs)</li>
            {docs.includes('employment-letter') && <li>• Employment verification letter (recent)</li>}
            {docs.includes('w2-recent') && <li>• Recent W-2s or pay stubs from 2024/2025</li>}
            {docs.includes('pay-stubs') && <li>• Pay stubs from 2024/2025 (minimum 1 month, 2-3 preferred)</li>}
            {docs.includes('bank-statements') && <li>• Bank statements</li>}
            {docs.includes('ssa-1099') && <li>• SSA-1099</li>}
          </ul>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-700">
            <strong>Next:</strong> You'll need to document assets to supplement your income.
          </p>
        </div>

        <button onClick={() => goToStep('document-upload')} className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700">
          Proceed to Document Upload
        </button>
      </div>
    );
  };

  // ALL STEPS MAPPED
  const steps = {
    'q1': renderQ1,
    'q2': renderQ2,
    'q3-2024': renderQ3_2024,
    'q3a-2024': renderQ3a_2024,
    'expected-income-2024': renderExpectedIncome2024,
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
    'q3-2023': renderQ3_2023,
    'q3a-2023': renderQ3a_2023,
    'expected-income-2023': renderExpectedIncome2023,
    'q3b-2023': renderQ3b_2023,
    'q3b-2023-same': renderQ3b_2023_same,
    'q3c-2023': renderQ3c_2023,
    'q3d-2023': renderQ3d_2023,
    'q3e-2023': renderQ3e_2023,
    'endpoint-a1-2023': renderEndpointA1_2023,
    'endpoint-a2-2023': renderEndpointA2_2023,
    'endpoint-a3-2023': renderEndpointA3_2023,
    'endpoint-a4-2023': renderEndpointA4_2023,
    'endpoint-a5-2023': renderEndpointA5_2023,
    'endpoint-a6-2023': renderEndpointA6_2023,
    'q4': renderQ4,
    'q4a': renderQ4a,
    'q4a-input': renderQ4a_input,
    'q4a-alt': renderQ4a_alt,
    'q4-improve': renderQ4_improve,
    'q4-improve-yes': renderQ4_improve_yes,
    'expected-income-w2': renderExpectedIncomeW2,
    'q4b': renderQ4b,
    'q4c': renderQ4c,
    'q4d': renderQ4d,
    'q4e': renderQ4e,
    'q4f': renderQ4f,
    'endpoint-w1': renderEndpointW1,
    'endpoint-w2': renderEndpointW2,
    'endpoint-w3': renderEndpointW3,
    'endpoint-w4': renderEndpointW4,
    'endpoint-w5': renderEndpointW5,
    'endpoint-w6': renderEndpointW6,
    'q5': renderQ5,
    'q5a': renderQ5a,
    'expected-income-se': renderExpectedIncomeSE,
    'q5c': renderQ5c,
    'q5d': renderQ5d,
    'q5e': renderQ5e,
    'q5f': renderQ5f,
    'endpoint-se1': renderEndpointSE1,
    'endpoint-se2': renderEndpointSE2,
    'endpoint-se3': renderEndpointSE3,
    'endpoint-se4': renderEndpointSE4,
    'endpoint-se5': renderEndpointSE5,
    'endpoint-se-critical': renderEndpointSE_Critical,
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
