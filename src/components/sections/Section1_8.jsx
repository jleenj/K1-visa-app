import React, { useState, useEffect } from 'react';
import { Upload, Plus, Trash2, Info, AlertCircle, DollarSign, HelpCircle, X, CheckCircle, ArrowLeft } from 'lucide-react';
import { QuestionnaireSteps } from './Section1_8_Questionnaire';

const Section1_8 = ({ currentData = {}, updateField, mostRecentEmployment = {} }) => {
  // Questionnaire state
  const [questionnaireMode, setQuestionnaireMode] = useState(currentData.incomeProofMode || null);
  const [questionnaireStep, setQuestionnaireStep] = useState(currentData.incomeProofStep || 'mode-selection');
  const [questionnaireData, setQuestionnaireData] = useState(currentData.incomeProofQuestionnaire || {});
  const [questionnaireHistory, setQuestionnaireHistory] = useState(currentData.incomeProofHistory || []);
  const [showAgiHelp, setShowAgiHelp] = useState(false);
  const [showSalaryAgiHelp, setShowSalaryAgiHelp] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Existing document upload state
  const [incomeMethod, setIncomeMethod] = useState(currentData.incomeMethod || 'transcript');
  const [assets, setAssets] = useState(currentData.assets || []);
  const [incomeSources, setIncomeSources] = useState(currentData.incomeSources || []);
  const [providesContributions, setProvidesContributions] = useState(currentData.providesContributions || false);
  const [exchangeRates, setExchangeRates] = useState({});
  const [lastUpdated, setLastUpdated] = useState(null);
  const [showIncomeGuide, setShowIncomeGuide] = useState(false);

  const MINIMUM_INCOME_REQUIRED = currentData.minimumIncomeRequired || 30000;
  // Calculate current and available tax years dynamically
  const getCurrentTaxYear = () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth(); // 0-indexed
    return currentMonth >= 3 ? currentYear - 1 : currentYear - 2; // Tax deadline is April
  };

  const getAvailableTaxYears = () => {
    const currentTaxYear = getCurrentTaxYear();
    return [
      currentTaxYear.toString(),
      (currentTaxYear - 1).toString(),
      (currentTaxYear - 2).toString()
    ];
  };

  const [selectedTaxYear, setSelectedTaxYear] = useState(currentData.selectedTaxYear || getCurrentTaxYear().toString());

  // Common currencies for international relationships
  const currencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
    { code: 'KRW', name: 'South Korean Won', symbol: '₩' },
    { code: 'MXN', name: 'Mexican Peso', symbol: '$' },
    { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
    { code: 'RUB', name: 'Russian Ruble', symbol: '₽' },
    { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
    { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr' },
    { code: 'SEK', name: 'Swedish Krona', symbol: 'kr' },
    { code: 'DKK', name: 'Danish Krone', symbol: 'kr' },
    { code: 'PHP', name: 'Philippine Peso', symbol: '₱' },
    { code: 'THB', name: 'Thai Baht', symbol: '฿' },
    { code: 'VND', name: 'Vietnamese Dong', symbol: '₫' }
  ];

  // Fetch exchange rates with daily caching
  useEffect(() => {
    const fetchExchangeRates = async () => {
      const today = new Date().toDateString();
      const cachedData = localStorage.getItem('exchangeRates');
      const cachedDate = localStorage.getItem('exchangeRatesDate');

      // Use cached rates if they're from today
      if (cachedData && cachedDate === today) {
        setExchangeRates(JSON.parse(cachedData));
        setLastUpdated(today);
        return;
      }

      try {
        // Fetch fresh rates
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const data = await response.json();

        // Cache the rates
        localStorage.setItem('exchangeRates', JSON.stringify(data.rates));
        localStorage.setItem('exchangeRatesDate', today);

        setExchangeRates(data.rates);
        setLastUpdated(today);
      } catch (error) {
        console.warn('Could not fetch exchange rates:', error);
        // Use cached rates if available, otherwise fallback
        if (cachedData) {
          setExchangeRates(JSON.parse(cachedData));
          setLastUpdated(cachedDate || 'Cached rates');
        } else {
          // Fallback rates (approximate, for demo purposes)
          setExchangeRates({
            EUR: 0.85, GBP: 0.73, CAD: 1.35, AUD: 1.45, JPY: 110,
            CNY: 6.45, INR: 74, KRW: 1180, MXN: 20, BRL: 5.2,
            RUB: 75, SGD: 1.35, CHF: 0.92, NOK: 8.5, SEK: 8.7,
            DKK: 6.3, PHP: 50, THB: 33, VND: 23000
          });
          setLastUpdated('Approximate rates');
        }
      }
    };

    fetchExchangeRates();
  }, []);

  const convertToUSD = (amount, fromCurrency) => {
    if (fromCurrency === 'USD') return amount;
    const rate = exchangeRates[fromCurrency];
    if (!rate) return amount;
    return amount / rate;
  };

  // Questionnaire helper functions
  const updateQuestionnaireData = (field, value) => {
    const updated = { ...questionnaireData, [field]: value };
    setQuestionnaireData(updated);
    updateField('incomeProofQuestionnaire', updated);
  };

  const setMode = (mode) => {
    setQuestionnaireMode(mode);
    updateField('incomeProofMode', mode);

    if (mode === 'guided') {
      setQuestionnaireStep('q1');
      updateField('incomeProofStep', 'q1');
      setQuestionnaireHistory(['q1']);
      updateField('incomeProofHistory', ['q1']);
    } else {
      setQuestionnaireStep('document-upload');
      updateField('incomeProofStep', 'document-upload');
      setQuestionnaireHistory([]);
      updateField('incomeProofHistory', []);
    }
  };

  const goToStep = (step) => {
    // Add current step to history before moving forward
    const newHistory = [...questionnaireHistory, step];
    setQuestionnaireHistory(newHistory);
    updateField('incomeProofHistory', newHistory);

    setQuestionnaireStep(step);
    updateField('incomeProofStep', step);
  };

  const goBackOneStep = () => {
    if (questionnaireHistory.length > 1) {
      // Remove current step and go to previous
      const newHistory = [...questionnaireHistory];
      newHistory.pop(); // Remove current
      const previousStep = newHistory[newHistory.length - 1];

      setQuestionnaireHistory(newHistory);
      updateField('incomeProofHistory', newHistory);
      setQuestionnaireStep(previousStep);
      updateField('incomeProofStep', previousStep);
    } else {
      // If at first question, go back to mode selection
      resetToModeSelection();
    }
  };

  const resetToModeSelection = () => {
    setQuestionnaireMode(null);
    setQuestionnaireStep('mode-selection');
    setQuestionnaireHistory([]);
    updateField('incomeProofMode', null);
    updateField('incomeProofStep', 'mode-selection');
    updateField('incomeProofHistory', []);
  };

  const resetQuestionnaireWithConfirm = () => {
    if (showResetConfirm) {
      // User confirmed - reset questionnaire data but stay in guided mode
      setQuestionnaireStep('q1');
      setQuestionnaireHistory(['q1']);
      setQuestionnaireData({});
      updateField('incomeProofStep', 'q1');
      updateField('incomeProofHistory', ['q1']);
      updateField('incomeProofQuestionnaire', {});
      setShowResetConfirm(false);
    } else {
      // Show confirmation
      setShowResetConfirm(true);
    }
  };

  const calculateGap = (agi) => {
    return MINIMUM_INCOME_REQUIRED - parseFloat(agi || 0);
  };

  const handleNoneOfAboveToggle = (currentArray, itemId, stateField) => {
    const current = currentArray || [];

    if (itemId === 'none') {
      if (current.includes('none')) {
        updateQuestionnaireData(stateField, []);
      } else {
        updateQuestionnaireData(stateField, ['none']);
      }
    } else {
      const withoutNone = current.filter(d => d !== 'none');
      const updated = withoutNone.includes(itemId)
        ? withoutNone.filter(d => d !== itemId)
        : [...withoutNone, itemId];
      updateQuestionnaireData(stateField, updated);
    }
  };

  const assetTypes = [
    'Checking account',
    'Savings account',
    'Annuities',
    'Stocks, Bonds, Certificates of Deposit',
    'Retirement or educational account',
    'Real estate holdings',
    'Personal property (net value)'
  ];

  const incomeTypes = [
    {
      id: 'employment',
      label: 'Employment Income',
      documents: [
        `Form W-2 (Latest tax year (${getCurrentTaxYear()}) preferred)`,
        `Recent pay stubs (Last 3-6 months preferred)`,
        `Employer verification letter (Within 30-60 days preferred)`
      ]
    },
    {
      id: 'selfEmployment',
      label: 'Self-Employment Income',
      documents: [
        `Schedule C from tax return (Latest tax year (${getCurrentTaxYear()}) preferred)`,
        `Form 1099-NEC (Latest tax year (${getCurrentTaxYear()}) preferred)`,
        `Form 1099-MISC (Latest tax year (${getCurrentTaxYear()}) preferred)`,
        `Business financial statements (Most recent 12 months preferred)`
      ]
    },
    {
      id: 'socialSecurity',
      label: 'Social Security/Government Benefits',
      documents: [`Form SSA-1099 (Latest tax year (${getCurrentTaxYear()}) preferred)`]
    },
    {
      id: 'investment',
      label: 'Investment Income',
      documents: [
        `Form 1099-DIV (Latest tax year (${getCurrentTaxYear()}) preferred)`,
        `Form 1099-INT (Latest tax year (${getCurrentTaxYear()}) preferred)`,
        `Form 1099-B (Latest tax year (${getCurrentTaxYear()}) preferred)`,
        `Investment account statements (Most recent 12 months preferred)`
      ]
    },
    {
      id: 'rental',
      label: 'Rental Income',
      documents: [
        `Schedule E from tax return (Latest tax year (${getCurrentTaxYear()}) preferred)`,
        `Rental agreements/leases (Current agreements preferred)`,
        `Property management statements (Most recent 12 months preferred)`
      ]
    },
    {
      id: 'retirement',
      label: 'Retirement Income',
      documents: [
        `Form 1099-R (Latest tax year (${getCurrentTaxYear()}) preferred)`,
        `Pension statements (Most recent preferred)`,
        `401(k)/IRA distribution statements (Most recent preferred)`
      ]
    },
    {
      id: 'other',
      label: 'Other Income',
      documents: ['Supporting documentation describing income source']
    }
  ];

  const addAsset = () => {
    const newAsset = {
      id: Date.now(),
      type: '',
      description: '',
      value: '0',
      currency: 'USD',
      originalValue: '0',
      usdValue: '0',
      documents: []
    };
    const updatedAssets = [...assets, newAsset];
    setAssets(updatedAssets);
    updateField('assets', updatedAssets);
  };

  const updateAsset = (id, field, value) => {
    const updatedAssets = assets.map(asset =>
      asset.id === id ? { ...asset, [field]: value } : asset
    );
    setAssets(updatedAssets);
    updateField('assets', updatedAssets);
  };

  const removeAsset = (id) => {
    const updatedAssets = assets.filter(asset => asset.id !== id);
    setAssets(updatedAssets);
    updateField('assets', updatedAssets);
  };

  const calculateTotalAssets = () => {
    return assets.reduce((total, asset) => {
      const usdValue = parseFloat(asset?.usdValue || asset?.value || 0) || 0;
      return total + usdValue;
    }, 0);
  };

  const updateAssetWithCurrency = (id, field, value) => {
    const updatedAssets = assets.map(asset => {
      if (asset.id === id) {
        const updatedAsset = { ...asset, [field]: value };

        // If currency or value changed, recalculate USD value
        if (field === 'currency' || field === 'originalValue') {
          const currency = field === 'currency' ? value : asset.currency;
          const originalValue = field === 'originalValue' ? parseFloat(value || 0) : parseFloat(asset.originalValue || 0);
          const usdValue = convertToUSD(originalValue, currency);
          updatedAsset.usdValue = usdValue.toFixed(2);

          // For display consistency, if USD, sync value with originalValue
          if (currency === 'USD') {
            updatedAsset.value = updatedAsset.originalValue;
          } else {
            updatedAsset.value = updatedAsset.usdValue;
          }
        }

        return updatedAsset;
      }
      return asset;
    });
    setAssets(updatedAssets);
    updateField('assets', updatedAssets);
  };

  // Income source management
  const addIncomeSource = () => {
    const newIncomeSource = {
      id: Date.now(),
      type: '',
      amount: '0',
      currency: 'USD',
      originalAmount: '0',
      usdAmount: '0',
      selectedDocuments: [],
      uploadedFiles: []
    };
    const updatedSources = [...incomeSources, newIncomeSource];
    setIncomeSources(updatedSources);
    updateField('incomeSources', updatedSources);
  };

  const removeIncomeSource = (id) => {
    const updatedSources = incomeSources.filter(source => source.id !== id);
    setIncomeSources(updatedSources);
    updateField('incomeSources', updatedSources);
  };

  const updateIncomeSource = (id, field, value) => {
    const updatedSources = incomeSources.map(source => {
      if (source.id === id) {
        const updatedSource = { ...source, [field]: value };

        // If currency or amount changed, recalculate USD value
        if (field === 'currency' || field === 'originalAmount') {
          const currency = field === 'currency' ? value : source.currency;
          const originalAmount = field === 'originalAmount' ? parseFloat(value || 0) : parseFloat(source.originalAmount || 0);
          const usdAmount = convertToUSD(originalAmount, currency);
          updatedSource.usdAmount = usdAmount.toFixed(2);

          // For display consistency, if USD, sync amount with originalAmount
          if (currency === 'USD') {
            updatedSource.amount = updatedSource.originalAmount;
          } else {
            updatedSource.amount = updatedSource.usdAmount;
          }
        }

        return updatedSource;
      }
      return source;
    });
    setIncomeSources(updatedSources);
    updateField('incomeSources', updatedSources);
  };

  const calculateTotalIncome = () => {
    return incomeSources.reduce((total, source) => {
      const usdAmount = parseFloat(source?.usdAmount || source?.amount || 0) || 0;
      return total + usdAmount;
    }, 0);
  };

  // Document strength assessment system
  const assessDocumentStrength = (documentType, coverageDate, endDate = null) => {
    if (!coverageDate) return null;

    const currentDate = new Date();
    const docDate = new Date(coverageDate);
    const endDocDate = endDate ? new Date(endDate) : docDate;
    const daysDiff = Math.floor((currentDate - endDocDate) / (1000 * 60 * 60 * 24));
    const currentTaxYear = getCurrentTaxYear();

    const assessments = {
      'w2': () => {
        const docYear = docDate.getFullYear();
        if (docYear === currentTaxYear) return { score: 'strong', message: 'Current tax year W-2 - excellent evidence' };
        if (docYear === currentTaxYear - 1) return { score: 'acceptable', message: 'Previous tax year W-2 - acceptable but may trigger questions' };
        return { score: 'weak', message: 'Outdated W-2 - high risk of RFE' };
      },
      'pay_stubs': () => {
        if (daysDiff <= 30) return { score: 'strong', message: 'Very recent pay stubs - excellent evidence' };
        if (daysDiff <= 90) return { score: 'strong', message: 'Recent pay stubs - strong evidence' };
        if (daysDiff <= 180) return { score: 'acceptable', message: 'Somewhat recent pay stubs - acceptable evidence' };
        return { score: 'weak', message: 'Outdated pay stubs - may raise questions about current employment' };
      },
      'employment_letter': () => {
        if (daysDiff <= 30) return { score: 'strong', message: 'Very recent employment letter - excellent evidence' };
        if (daysDiff <= 60) return { score: 'acceptable', message: 'Recent employment letter - acceptable evidence' };
        return { score: 'at_risk', message: 'Employment letter may be too old - consider getting a newer one' };
      },
      'bank_statements': () => {
        const coverageMonths = endDate ?
          Math.round((new Date(endDate) - new Date(coverageDate)) / (1000 * 60 * 60 * 24 * 30.44)) : 1;

        if (daysDiff <= 30 && coverageMonths >= 12) return { score: 'strong', message: 'Full year of recent statements - excellent evidence' };
        if (daysDiff <= 60 && coverageMonths >= 6) return { score: 'strong', message: 'Good coverage of recent statements - strong evidence' };
        if (daysDiff <= 90 && coverageMonths >= 3) return { score: 'acceptable', message: 'Adequate coverage - acceptable evidence' };
        return { score: 'weak', message: 'Insufficient or outdated bank statements' };
      },
      '1099': () => {
        const docYear = docDate.getFullYear();
        if (docYear === currentTaxYear) return { score: 'strong', message: 'Current tax year 1099 - excellent evidence' };
        if (docYear === currentTaxYear - 1) return { score: 'acceptable', message: 'Previous tax year 1099 - acceptable but may trigger questions' };
        return { score: 'weak', message: 'Outdated 1099 - high risk of RFE' };
      }
    };

    return assessments[documentType] ? assessments[documentType]() : null;
  };

  // Assess overall document strength for an income source
  const assessOverallDocumentStrength = (source) => {
    if (!source.documentInstances) return null;

    const allAssessments = [];
    Object.values(source.documentInstances).forEach(instanceArray => {
      instanceArray.forEach(instance => {
        if (instance.dates) {
          let assessmentDate, endDate = null;

          if (instance.dates.year) {
            assessmentDate = `${instance.dates.year}-01-01`;
          } else if (instance.dates.date) {
            assessmentDate = instance.dates.date;
          } else if (instance.dates.start) {
            assessmentDate = `${instance.dates.start}-01`;
            endDate = instance.dates.end ? `${instance.dates.end}-01` : null;
          } else if (instance.dates.month) {
            assessmentDate = `${instance.dates.month}-01`;
          }

          if (assessmentDate) {
            const assessment = assessDocumentStrength(instance.docType, assessmentDate, endDate);
            if (assessment) allAssessments.push(assessment);
          }
        }
      });
    });

    if (allAssessments.length === 0) return null;

    // Determine overall strength based on best and worst assessments
    const scores = allAssessments.map(a => a.score);
    const hasStrong = scores.includes('strong');
    const hasWeak = scores.includes('weak');
    const hasAtRisk = scores.includes('at_risk');

    if (hasStrong && !hasWeak && !hasAtRisk) {
      return { score: 'strong', message: `Strong documentation package (${allAssessments.length} documents)` };
    } else if (hasStrong || scores.includes('acceptable')) {
      return { score: 'acceptable', message: `Mixed document strength - consider strengthening weak documents` };
    } else if (hasAtRisk) {
      return { score: 'at_risk', message: `Document package needs improvement` };
    } else {
      return { score: 'weak', message: `Weak documentation - high risk of RFE` };
    }
  };

  const getStrengthColor = (score) => {
    const colors = {
      'strong': 'text-green-700 bg-green-50 border-green-200',
      'acceptable': 'text-blue-700 bg-blue-50 border-blue-200',
      'at_risk': 'text-yellow-700 bg-yellow-50 border-yellow-200',
      'weak': 'text-red-700 bg-red-50 border-red-200'
    };
    return colors[score] || 'text-gray-700 bg-gray-50 border-gray-200';
  };

  const getStrengthIcon = (score) => {
    const icons = {
      'strong': '✅',
      'acceptable': '✓',
      'at_risk': '⚠️',
      'weak': '❌'
    };
    return icons[score] || 'ℹ️';
  };

  const handleIncomeMethodChange = (method) => {
    setIncomeMethod(method);
    updateField('incomeMethod', method);
  };

  // Calculate current valid date ranges for different document types
  const getDocumentDateGuidance = (documentType, taxYear = null) => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth(); // 0-indexed

    // Use provided tax year or determine latest complete tax year
    const useTaxYear = taxYear || (currentMonth >= 3 ? currentYear - 1 : currentYear - 2);

    const formatDate = (date) => {
      return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    };

    const ranges = {
      'irs_transcript': {
        period: `${useTaxYear} Tax Year`,
        example: `${useTaxYear} IRS Tax Transcript`,
        note: `USCIS prefers the most recent tax year that accurately represents your current financial capacity. Older transcripts may trigger an RFE and delay your application.`
      },
      'tax_return': {
        period: `${useTaxYear} Tax Year`,
        example: `${useTaxYear} Form 1040`,
        note: `USCIS expects tax returns to match your transcript year. Mismatched years may raise questions about your financial documentation.`
      },
      'w2': {
        period: `${useTaxYear} Tax Year`,
        example: `${useTaxYear} W-2 Forms`,
        note: `USCIS prefers the most recent year of W-2 forms that accurately represent your current financial capacity. Older forms may trigger an RFE and delay your application.`
      },
      'employment_letter': {
        period: 'Within 30-60 days',
        example: `Dated ${formatDate(new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000))} or later`,
        note: `USCIS requires current employment verification. Letters older than 60 days may be questioned or rejected.`
      },
      'pay_stubs': {
        period: 'Last 3-6 months',
        example: `${formatDate(new Date(currentDate.getTime() - 6 * 30 * 24 * 60 * 60 * 1000))} - ${formatDate(currentDate)}`,
        note: `USCIS wants evidence of current, consistent income. Recent pay stubs demonstrate ongoing employment and salary stability.`
      },
      'bank_statements': {
        period: 'Most recent 12 months',
        example: `${formatDate(new Date(currentDate.getTime() - 12 * 30 * 24 * 60 * 60 * 1000))} - ${formatDate(currentDate)}`,
        note: `USCIS prefers a full year of consecutive statements to verify financial stability and cash flow patterns.`
      },
      '1099': {
        period: `${useTaxYear} Tax Year`,
        example: `${useTaxYear} Form 1099`,
        note: `USCIS expects 1099 forms to match your tax return year. Mismatched years may trigger questions about undisclosed income.`
      }
    };

    return ranges[documentType] || null;
  };

  // Income documentation guide data
  const incomeGuideData = {
    tier1: {
      title: "🏆 Tier 1: USCIS Gold Standard Documents",
      subtitle: "Documents explicitly mentioned or strongly preferred by USCIS",
      documents: [
        {
          name: "IRS Tax Transcripts",
          badge: "BEST OPTION",
          description: "Official IRS-generated summary of filed tax returns",
          why: "Tamper-proof, verified income directly from IRS",
          when: "Always preferred over personal tax copies",
          limitations: "Takes weeks to obtain; use personal returns as backup"
        },
        {
          name: "Federal Tax Returns (Form 1040)",
          description: "Complete tax return with all schedules",
          why: "Shows comprehensive annual income and tax compliance",
          when: "Essential for all sponsors (1-3 years)",
          limitations: "Include ALL schedules (C, D, E, F for self-employed)"
        },
        {
          name: "W-2 Forms",
          description: "Employer-issued wage statements",
          why: "Verifies employment income and withholdings",
          when: "Required for employed sponsors",
          limitations: "Must match tax return information exactly"
        },
        {
          name: "Employment Verification Letter",
          description: "Official employer letter on company letterhead",
          why: "Confirms current employment and salary",
          when: "Required for all employed sponsors",
          limitations: "Must include job title, salary, dates, permanence"
        }
      ]
    },
    tier2: {
      title: "✅ Tier 2: Commonly Accepted Documents",
      subtitle: "Regularly accepted but may need additional explanation",
      documents: [
        {
          name: "Bank Statements (12 months)",
          description: "Official bank records showing deposits/withdrawals",
          why: "Demonstrates cash flow and financial stability",
          when: "Essential for self-employed; supplementary for employed",
          limitations: "Must show regular deposits matching stated income"
        },
        {
          name: "Recent Pay Stubs (3-6 months)",
          description: "Employer payment records",
          why: "Shows current income if recent changes",
          when: "Demonstrates employment stability",
          limitations: "Should align with W-2s and employment letter"
        },
        {
          name: "Form 1099s",
          description: "Non-employee compensation forms",
          why: "Verifies contractor/freelance income",
          when: "Required for self-employed with 1099 income",
          limitations: "Must show corresponding bank deposits"
        }
      ]
    },
    tier3: {
      title: "📋 Tier 3: Supplementary Documents",
      subtitle: "Strengthens case but shouldn't be primary evidence",
      documents: [
        {
          name: "Business Documentation",
          description: "Licenses, profit/loss statements, commercial ratings",
          why: "Establishes business legitimacy",
          when: "Strengthens self-employment claims",
          limitations: "Valuable for newer businesses"
        },
        {
          name: "Social Security Benefits Letters",
          description: "Official SSA award letters",
          why: "Verifies government benefit income",
          when: "When benefits are significant income portion",
          limitations: "Must be current and ongoing"
        },
        {
          name: "Retirement/Pension Statements",
          description: "Official retirement account statements",
          why: "Documents retirement income streams",
          when: "For retired sponsors",
          limitations: "Distinguish balance vs. actual distributions"
        }
      ]
    }
  };

  // QUESTIONNAIRE RENDER FUNCTIONS

  // AGI Help Panel
  const AgiHelpPanel = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Where to Find Your AGI</h3>
          <button
            onClick={() => setShowAgiHelp(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>
        <div className="space-y-4">
          <p className="text-sm text-gray-700">
            Your Adjusted Gross Income (AGI) is located on <strong>Line 11</strong> of your Form 1040.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <strong>If you have an IRS Tax Transcript:</strong> Look for "Adjusted Gross Income" in the transcript.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // Salary vs AGI Help Panel
  const SalaryAgiHelpPanel = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Salary vs. AGI: What's the Difference?</h3>
          <button
            onClick={() => setShowSalaryAgiHelp(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>
        <div className="space-y-4">
          <p className="text-sm text-gray-700">
            Your employment letter shows your <strong>gross salary</strong> (before any deductions).
            Your AGI (Adjusted Gross Income) is typically lower.
          </p>
        </div>
      </div>
    </div>
  );

  // Get questionnaire step render functions
  const questionnaireSteps = QuestionnaireSteps({
    questionnaireData,
    updateQuestionnaireData,
    goToStep,
    handleNoneOfAboveToggle,
    mostRecentEmployment,
    MINIMUM_INCOME_REQUIRED,
    calculateGap,
    setShowAgiHelp,
    setShowSalaryAgiHelp
  });

  const renderModeSelection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          How would you like to provide proof of income?
        </h3>
        <p className="text-sm text-gray-600">
          We'll help you gather the right documents for your situation.
        </p>
      </div>

      <div className="space-y-4">
        <button
          onClick={() => setMode('guided')}
          className="w-full text-left border-2 border-blue-300 rounded-lg p-6 hover:border-blue-500 hover:bg-blue-50 transition-colors"
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <CheckCircle className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-base font-medium text-gray-900">
                Guide me through the process (Recommended)
              </p>
              <p className="mt-1 text-sm text-gray-600">
                We'll ask a few questions to recommend the strongest combination of documents for your situation.
              </p>
            </div>
          </div>
        </button>

        <button
          onClick={() => setMode('manual')}
          className="w-full text-left border-2 border-gray-300 rounded-lg p-6 hover:border-gray-400 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <Info className="h-6 w-6 text-gray-600" />
            </div>
            <div className="ml-3">
              <p className="text-base font-medium text-gray-900">
                I'll upload documents manually
              </p>
              <p className="mt-1 text-sm text-gray-600">
                Choose this if you have a complex situation or prefer to handle it yourself.
              </p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );

  return (
    <div className="relative space-y-8">
      {/* Help Panels */}
      {showAgiHelp && <AgiHelpPanel />}
      {showSalaryAgiHelp && <SalaryAgiHelpPanel />}

      {/* Show mode selection if no mode chosen yet */}
      {questionnaireMode === null && (
        <div className="space-y-6">
          <div className="border-b border-gray-200 pb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Section 1.8: Financial Information - Income Proof
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              We'll help you gather the right documents to prove your income meets USCIS requirements.
            </p>
          </div>
          {renderModeSelection()}
        </div>
      )}

      {/* Show questionnaire steps when in guided mode (but not at document-upload step) */}
      {questionnaireMode === 'guided' && questionnaireStep !== 'document-upload' && (
        <div className="space-y-6">
          <div className="border-b border-gray-200 pb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Section 1.8: Financial Information - Income Proof
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              We'll help you gather the right documents to prove your income meets USCIS requirements.
            </p>
          </div>

          {/* Top navigation - Return to mode selection */}
          <button
            onClick={resetToModeSelection}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            ← Return to mode selection
          </button>

          {/* Render current questionnaire step */}
          {questionnaireSteps[questionnaireStep] && questionnaireSteps[questionnaireStep]()}
          {!questionnaireSteps[questionnaireStep] && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-900">
                Step "{questionnaireStep}" is not yet implemented. This will be added soon.
              </p>
              <button
                onClick={() => goToStep('document-upload')}
                className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Skip to document upload →
              </button>
            </div>
          )}

          {/* Bottom navigation - Back and Start over */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-6">
              {questionnaireHistory.length > 1 && (
                <button
                  onClick={goBackOneStep}
                  className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </button>
              )}

              {!showResetConfirm ? (
                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="text-sm text-gray-500 hover:text-red-600 underline"
                >
                  Start this section over
                </button>
              ) : (
                <div className="flex items-center space-x-3 bg-yellow-50 border border-yellow-200 rounded-md px-3 py-2">
                  <p className="text-xs text-yellow-900">
                    Reset all answers in Section 1.8? (Other sections are safe)
                  </p>
                  <button
                    onClick={resetQuestionnaireWithConfirm}
                    className="text-xs font-medium text-red-600 hover:text-red-700"
                  >
                    Yes, reset
                  </button>
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="text-xs font-medium text-gray-600 hover:text-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Income Guide Side Panel */}
      {showIncomeGuide && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black bg-opacity-50" onClick={() => setShowIncomeGuide(false)} />
          <div className="w-1/2 max-w-2xl bg-white shadow-2xl h-full overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Proof of Income Documentation Guide</h2>
              <button
                onClick={() => setShowIncomeGuide(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-8">
              {/* Introduction to Tier System */}
              <div className="text-center pb-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Understanding Your Document Options</h3>
                <p className="text-gray-600 mb-4">
                  We've organized acceptable income documents into three tiers based on how USCIS values them.
                  This helps you choose the strongest possible documentation for your case.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="font-medium text-green-800 mb-1">🏆 Tier 1: Gold Standard</div>
                    <div className="text-green-700">Documents USCIS prefers most</div>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="font-medium text-blue-800 mb-1">✅ Tier 2: Commonly Accepted</div>
                    <div className="text-blue-700">Regularly accepted with explanation</div>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <div className="font-medium text-yellow-800 mb-1">📋 Tier 3: Supplementary</div>
                    <div className="text-yellow-700">Supports but shouldn't be primary</div>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-4">
                  <strong>Pro tip:</strong> Start with Tier 1 documents when possible, then add Tier 2 for completeness.
                </p>
              </div>

              {/* Tier 1 */}
              <div>
                <h3 className="text-lg font-semibold text-green-700 mb-2">{incomeGuideData.tier1.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{incomeGuideData.tier1.subtitle}</p>
                <div className="space-y-4">
                  {incomeGuideData.tier1.documents.map((doc, index) => (
                    <div key={index} className="border border-green-200 rounded-lg p-4 bg-green-50">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-medium text-gray-900">{doc.name}</h4>
                        {doc.badge && (
                          <span className="px-2 py-1 text-xs font-bold text-green-800 bg-green-200 rounded">
                            {doc.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-700 mb-3">{doc.description}</p>
                      <div className="text-xs space-y-1">
                        <p><strong>Why USCIS accepts:</strong> {doc.why}</p>
                        <p><strong>When to use:</strong> {doc.when}</p>
                        <p><strong>Limitations:</strong> {doc.limitations}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tier 2 */}
              <div>
                <h3 className="text-lg font-semibold text-blue-700 mb-2">{incomeGuideData.tier2.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{incomeGuideData.tier2.subtitle}</p>
                <div className="space-y-4">
                  {incomeGuideData.tier2.documents.map((doc, index) => (
                    <div key={index} className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                      <h4 className="font-medium text-gray-900 mb-2">{doc.name}</h4>
                      <p className="text-sm text-gray-700 mb-3">{doc.description}</p>
                      <div className="text-xs space-y-1">
                        <p><strong>Why USCIS accepts:</strong> {doc.why}</p>
                        <p><strong>When to use:</strong> {doc.when}</p>
                        <p><strong>Limitations:</strong> {doc.limitations}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tier 3 */}
              <div>
                <h3 className="text-lg font-semibold text-yellow-700 mb-2">{incomeGuideData.tier3.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{incomeGuideData.tier3.subtitle}</p>
                <div className="space-y-4">
                  {incomeGuideData.tier3.documents.map((doc, index) => (
                    <div key={index} className="border border-yellow-200 rounded-lg p-4 bg-yellow-50">
                      <h4 className="font-medium text-gray-900 mb-2">{doc.name}</h4>
                      <p className="text-sm text-gray-700 mb-3">{doc.description}</p>
                      <div className="text-xs space-y-1">
                        <p><strong>Why USCIS accepts:</strong> {doc.why}</p>
                        <p><strong>When to use:</strong> {doc.when}</p>
                        <p><strong>Limitations:</strong> {doc.limitations}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>


            </div>
          </div>
        </div>
      )}

      {/* Show existing document upload interface when manual mode or reached document-upload step */}
      {(questionnaireMode === 'manual' || questionnaireStep === 'document-upload') && (
        <>
          {/* Back button - always show when in document upload section */}
          <button
            onClick={resetToModeSelection}
            className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            {questionnaireMode === 'guided' ? 'Start over' : 'Back to mode selection'}
          </button>

          {/* Part 1: Annual Income */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Part 1: Annual Income</h3>

        <div className="space-y-4">
          <label className="text-sm font-medium text-gray-700">
            How would you like to provide your income information?
          </label>

          {/* Option A: IRS Transcript */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <input
                type="radio"
                id="transcript"
                name="incomeMethod"
                value="transcript"
                checked={incomeMethod === 'transcript'}
                onChange={(e) => handleIncomeMethodChange(e.target.value)}
                className="mt-1"
              />
              <div className="flex-1">
                <label htmlFor="transcript" className="font-medium text-gray-900 cursor-pointer">
                  IRS Tax Transcript (Recommended)
                </label>
                <p className="text-sm text-gray-600 mt-1">
                  Most accepted by USCIS - your Adjusted Gross Income will be automatically extracted
                </p>

                {incomeMethod === 'transcript' && (
                  <div className="mt-4 space-y-4">
                    <div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tax Year
                        </label>
                        <select
                          value={selectedTaxYear}
                          onChange={(e) => {
                            setSelectedTaxYear(e.target.value);
                            updateField('selectedTaxYear', e.target.value);
                          }}
                          className="w-full max-w-xs border border-gray-300 rounded-md px-3 py-2"
                        >
                          {getAvailableTaxYears().map((year) => (
                            <option key={year} value={year}>{year}</option>
                          ))}
                        </select>
                      </div>

                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload IRS Tax Transcript
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-600">
                          Click to upload or drag and drop your IRS Tax Transcript
                        </p>
                        <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG up to 10MB</p>
                        <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" />
                      </div>

                      {/* Date Guidance for IRS Transcript */}
                      {(() => {
                        const guidance = getDocumentDateGuidance('irs_transcript', parseInt(selectedTaxYear));
                        return (
                          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-start space-x-2">
                              <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                              <div>
                                {(() => {
                                  const currentTaxYear = getCurrentTaxYear();
                                  const availableYears = getAvailableTaxYears();
                                  return (
                                    <div className="text-sm text-blue-800">
                                      <p className="font-medium mb-2">Use {currentTaxYear} tax documents unless you have special circumstances.</p>
                                      <p className="text-xs">Older tax years may trigger an RFE (Request for Evidence), which can delay your K-1 visa. Only use {availableYears[1]} or {availableYears[2]} if {currentTaxYear} isn't available or doesn't represent your financial capability.</p>
                                    </div>
                                  );
                                })()}
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                    {currentData.extractedIncome && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm font-medium text-green-800">
                            Your annual income: ${currentData.extractedIncome?.toLocaleString()} (from IRS transcript line 11)
                          </span>
                        </div>
                        <p className="text-sm text-green-700 mt-1">Is this amount correct?</p>
                        <div className="flex space-x-4 mt-2">
                          <button className="text-sm text-green-700 font-medium hover:text-green-800">
                            ✓ Yes, continue
                          </button>
                          <button
                            className="text-sm text-green-700 hover:text-green-800"
                            onClick={() => handleIncomeMethodChange('manual')}
                          >
                            ✗ No, let me enter manually
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Option B: Manual Entry */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <input
                type="radio"
                id="manual"
                name="incomeMethod"
                value="manual"
                checked={incomeMethod === 'manual'}
                onChange={(e) => handleIncomeMethodChange(e.target.value)}
                className="mt-1"
              />
              <div className="flex-1">
                <label htmlFor="manual" className="font-medium text-gray-900 cursor-pointer">
                  Enter income details manually
                </label>
                <p className="text-sm text-gray-600 mt-1">
                  Provide income sources with supporting documentation
                </p>

                {incomeMethod === 'manual' && (
                  <div className="mt-4 space-y-6">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <div className="flex items-start space-x-2">
                        <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
                        <p className="text-sm text-yellow-800">
                          Add each income source separately with matching documentation. Your total should match your Form 1040 AGI.
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <button
                        onClick={() => setShowIncomeGuide(true)}
                        className="inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <HelpCircle className="w-4 h-4" />
                        <span>More about proof of income</span>
                      </button>
                    </div>

                    <div className="space-y-4">
                      {incomeSources.map((source) => (
                        <div key={source.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-4">
                            <h4 className="font-medium text-gray-900">Income Source #{incomeSources.indexOf(source) + 1}</h4>
                            <button
                              onClick={() => removeIncomeSource(source.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Income Type
                              </label>
                              <select
                                value={source.type}
                                onChange={(e) => updateIncomeSource(source.id, 'type', e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                              >
                                <option value="">Select income type</option>
                                {incomeTypes.map((type) => (
                                  <option key={type.id} value={type.id}>
                                    {type.label}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Currency
                                </label>
                                <select
                                  value={source.currency || 'USD'}
                                  onChange={(e) => updateIncomeSource(source.id, 'currency', e.target.value)}
                                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                                >
                                  {currencies.map((currency) => (
                                    <option key={currency.code} value={currency.code}>
                                      {currency.code} - {currency.name}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Annual Amount in {currencies.find(c => c.code === (source.currency || 'USD'))?.name || 'USD'}
                                </label>
                                <div className="relative">
                                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                    {currencies.find(c => c.code === (source.currency || 'USD'))?.symbol || '$'}
                                  </span>
                                  <input
                                    type="number"
                                    value={source.originalAmount || source.amount || '0'}
                                    onChange={(e) => updateIncomeSource(source.id, 'originalAmount', e.target.value)}
                                    className="pl-8 w-full border border-gray-300 rounded-md px-3 py-2"
                                    placeholder="0"
                                    step="0.01"
                                  />
                                </div>
                              </div>
                            </div>

                            {source.currency && source.currency !== 'USD' && (
                              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                                <div className="flex items-center space-x-2">
                                  <Info className="w-4 h-4 text-gray-600" />
                                  <span className="text-sm font-medium text-gray-800">
                                    Amount for USCIS forms: ${source.usdAmount || '0'} USD
                                  </span>
                                </div>
                                <p className="text-xs text-gray-600 mt-1">
                                  This converted amount will be used in your official USCIS documentation.
                                </p>
                              </div>
                            )}

                            {source.type && (
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Required Documents (select what you're uploading):
                                </label>
                                <div className="space-y-3">
                                  {incomeTypes.find(t => t.id === source.type)?.documents.map((doc, index) => {
                                    // Initialize document instances if not exists
                                    const documentInstances = source.documentInstances || {};
                                    const docKey = (() => {
                                      const lowerDoc = doc.toLowerCase();
                                      if (lowerDoc.includes('w-2')) return 'w2';
                                      if (lowerDoc.includes('1099')) return '1099';
                                      if (lowerDoc.includes('pay stub')) return 'pay_stubs';
                                      if (lowerDoc.includes('employer') || lowerDoc.includes('verification') || lowerDoc.includes('letter')) return 'employment_letter';
                                      if (lowerDoc.includes('bank') || lowerDoc.includes('statements') || lowerDoc.includes('account')) return 'bank_statements';
                                      if (lowerDoc.includes('tax return') || lowerDoc.includes('schedule') || lowerDoc.includes('form 1040')) return 'tax_return';
                                      return 'other';
                                    })();

                                    const docInstances = documentInstances[docKey] || [];
                                    const guidance = docKey ? getDocumentDateGuidance(docKey) : null;

                                    const addDocumentInstance = () => {
                                      const newInstance = {
                                        id: Date.now(),
                                        docType: docKey,
                                        dates: {}
                                      };
                                      const updatedInstances = {
                                        ...documentInstances,
                                        [docKey]: [...docInstances, newInstance]
                                      };
                                      updateIncomeSource(source.id, 'documentInstances', updatedInstances);
                                    };

                                    const removeDocumentInstance = (instanceId) => {
                                      const updatedInstances = {
                                        ...documentInstances,
                                        [docKey]: docInstances.filter(inst => inst.id !== instanceId)
                                      };
                                      updateIncomeSource(source.id, 'documentInstances', updatedInstances);
                                    };

                                    const updateDocumentInstance = (instanceId, field, value) => {
                                      const updatedInstances = {
                                        ...documentInstances,
                                        [docKey]: docInstances.map(inst =>
                                          inst.id === instanceId ? { ...inst, [field]: value } : inst
                                        )
                                      };
                                      updateIncomeSource(source.id, 'documentInstances', updatedInstances);
                                    };

                                    return (
                                      <div key={index} className="border border-gray-300 rounded-lg p-3">
                                        <div className="flex items-center justify-between mb-3">
                                          <span className="font-medium text-gray-900">{doc}</span>
                                          <button
                                            onClick={addDocumentInstance}
                                            className="text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                                          >
                                            <Plus className="w-4 h-4" />
                                            <span>Add {docKey === 'w2' ? 'W-2' : docKey === '1099' ? '1099' : docKey.replace('_', ' ')}</span>
                                          </button>
                                        </div>

                                        {/* Show guidance */}
                                        {guidance && (
                                          <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded text-xs">
                                            <div className="flex items-start space-x-1">
                                              <Info className="w-3 h-3 text-blue-600 mt-0.5" />
                                              <p className="text-blue-800">{guidance.note}</p>
                                            </div>
                                          </div>
                                        )}

                                        {/* Document instances */}
                                        <div className="space-y-3">
                                          {docInstances.map((instance, instanceIndex) => {
                                            const getDateInputType = (docKey) => {
                                              if (docKey === 'w2' || docKey === '1099') return 'year';
                                              if (docKey === 'employment_letter') return 'full-date';
                                              if (docKey === 'pay_stubs' || docKey === 'bank_statements') return 'period-with-count';
                                              return 'month-year';
                                            };

                                            const inputType = getDateInputType(docKey);

                                            return (
                                              <div key={instance.id} className="bg-gray-50 border border-gray-200 rounded p-3">
                                                <div className="flex items-center justify-between mb-2">
                                                  <span className="text-sm font-medium text-gray-700">
                                                    {doc} #{instanceIndex + 1}
                                                  </span>
                                                  <button
                                                    onClick={() => removeDocumentInstance(instance.id)}
                                                    className="text-red-600 hover:text-red-800"
                                                  >
                                                    <Trash2 className="w-4 h-4" />
                                                  </button>
                                                </div>

                                                {inputType === 'year' && (
                                                  <div>
                                                    <label className="block text-xs font-medium text-gray-700 mb-2">
                                                      Tax Year:
                                                    </label>
                                                    <select
                                                      className="w-full text-xs border border-gray-300 rounded px-2 py-1"
                                                      value={instance.dates.year || ''}
                                                      onChange={(e) => {
                                                        updateDocumentInstance(instance.id, 'dates', { ...instance.dates, year: e.target.value });
                                                      }}
                                                    >
                                                      <option value="">Select year</option>
                                                      {getAvailableTaxYears().map(year => (
                                                        <option key={year} value={year}>{year}</option>
                                                      ))}
                                                    </select>
                                                  </div>
                                                )}

                                                {inputType === 'full-date' && (
                                                  <div>
                                                    <label className="block text-xs font-medium text-gray-700 mb-2">
                                                      Letter Date:
                                                    </label>
                                                    <input
                                                      type="date"
                                                      className="w-full text-xs border border-gray-300 rounded px-2 py-1"
                                                      value={instance.dates.date || ''}
                                                      onChange={(e) => {
                                                        updateDocumentInstance(instance.id, 'dates', { ...instance.dates, date: e.target.value });
                                                      }}
                                                    />
                                                  </div>
                                                )}

                                                {inputType === 'period-with-count' && (
                                                  <div className="space-y-3">
                                                    <div>
                                                      <label className="block text-xs font-medium text-gray-700 mb-2">
                                                        How many {docKey === 'pay_stubs' ? 'pay stubs' : 'months'}?
                                                      </label>
                                                      <select
                                                        className="w-full text-xs border border-gray-300 rounded px-2 py-1"
                                                        value={instance.dates.count || ''}
                                                        onChange={(e) => {
                                                          updateDocumentInstance(instance.id, 'dates', { ...instance.dates, count: e.target.value });
                                                        }}
                                                      >
                                                        <option value="">Select quantity</option>
                                                        {docKey === 'pay_stubs' ? (
                                                          [2, 3, 4, 5, 6].map(num => (
                                                            <option key={num} value={num}>{num} pay stubs</option>
                                                          ))
                                                        ) : (
                                                          [3, 6, 9, 12, 18, 24].map(num => (
                                                            <option key={num} value={num}>{num} months</option>
                                                          ))
                                                        )}
                                                      </select>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-2">
                                                      <div>
                                                        <label className="block text-xs text-gray-600 mb-1">From:</label>
                                                        <input
                                                          type="month"
                                                          className="w-full text-xs border border-gray-300 rounded px-2 py-1"
                                                          value={instance.dates.start || ''}
                                                          onChange={(e) => {
                                                            updateDocumentInstance(instance.id, 'dates', { ...instance.dates, start: e.target.value });
                                                          }}
                                                        />
                                                      </div>
                                                      <div>
                                                        <label className="block text-xs text-gray-600 mb-1">To:</label>
                                                        <input
                                                          type="month"
                                                          className="w-full text-xs border border-gray-300 rounded px-2 py-1"
                                                          value={instance.dates.end || ''}
                                                          onChange={(e) => {
                                                            updateDocumentInstance(instance.id, 'dates', { ...instance.dates, end: e.target.value });
                                                          }}
                                                        />
                                                      </div>
                                                    </div>

                                                    {instance.dates.count && instance.dates.start && instance.dates.end && (
                                                      <div className="text-xs text-gray-600">
                                                        {(() => {
                                                          const count = parseInt(instance.dates.count);
                                                          const start = new Date(instance.dates.start + '-01');
                                                          const end = new Date(instance.dates.end + '-01');
                                                          const monthsDiff = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()) + 1;

                                                          if (monthsDiff === count) {
                                                            return <span className="text-green-600">✓ Consecutive coverage</span>;
                                                          } else if (monthsDiff > count) {
                                                            return <span className="text-yellow-600">⚠️ Gaps in coverage</span>;
                                                          } else {
                                                            return <span className="text-red-600">❌ Invalid period</span>;
                                                          }
                                                        })()}
                                                      </div>
                                                    )}
                                                  </div>
                                                )}

                                                {inputType === 'month-year' && (
                                                  <div>
                                                    <label className="block text-xs font-medium text-gray-700 mb-2">
                                                      Document Date:
                                                    </label>
                                                    <input
                                                      type="month"
                                                      className="w-full text-xs border border-gray-300 rounded px-2 py-1"
                                                      value={instance.dates.month || ''}
                                                      onChange={(e) => {
                                                        updateDocumentInstance(instance.id, 'dates', { ...instance.dates, month: e.target.value });
                                                      }}
                                                    />
                                                  </div>
                                                )}

                                                {/* Document strength assessment */}
                                                {(() => {
                                                  let assessmentDate, endDate = null;

                                                  if (inputType === 'year' && instance.dates.year) {
                                                    assessmentDate = `${instance.dates.year}-01-01`;
                                                  } else if (inputType === 'full-date' && instance.dates.date) {
                                                    assessmentDate = instance.dates.date;
                                                  } else if (inputType === 'period-with-count' && instance.dates.start) {
                                                    assessmentDate = `${instance.dates.start}-01`;
                                                    endDate = instance.dates.end ? `${instance.dates.end}-01` : null;
                                                  } else if (inputType === 'month-year' && instance.dates.month) {
                                                    assessmentDate = `${instance.dates.month}-01`;
                                                  }

                                                  if (!assessmentDate) return null;

                                                  const assessment = assessDocumentStrength(docKey, assessmentDate, endDate);
                                                  if (!assessment) return null;

                                                  return (
                                                    <div className={`mt-2 p-2 border rounded text-xs ${getStrengthColor(assessment.score)}`}>
                                                      <div className="flex items-center space-x-1">
                                                        <span>{getStrengthIcon(assessment.score)}</span>
                                                        <span className="font-medium">{assessment.message}</span>
                                                      </div>
                                                    </div>
                                                  );
                                                })()}

                                                {/* Upload section for this specific document instance */}
                                                <div className="mt-3">
                                                  <label className="block text-xs font-medium text-gray-700 mb-2">
                                                    Upload {doc} #{instanceIndex + 1}:
                                                  </label>
                                                  <div
                                                    className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center cursor-pointer hover:border-gray-400 transition-colors"
                                                    onClick={() => {
                                                      const fileInput = document.getElementById(`upload-${instance.id}`);
                                                      fileInput?.click();
                                                    }}
                                                  >
                                                    <Upload className="mx-auto h-6 w-6 text-gray-400" />
                                                    <p className="mt-1 text-xs text-gray-600">
                                                      Click to upload {docKey === 'w2' ? 'W-2' : docKey === '1099' ? '1099' : docKey.replace('_', ' ')}
                                                    </p>
                                                    <p className="text-xs text-gray-500">PDF, JPG, PNG up to 10MB</p>
                                                    <input
                                                      id={`upload-${instance.id}`}
                                                      type="file"
                                                      className="hidden"
                                                      accept=".pdf,.jpg,.jpeg,.png"
                                                      multiple
                                                      onChange={(e) => {
                                                        // Handle file upload for this specific instance
                                                        const files = Array.from(e.target.files);
                                                        const existingFiles = instance.uploadedFiles || [];
                                                        updateDocumentInstance(instance.id, 'uploadedFiles', [...existingFiles, ...files]);
                                                      }}
                                                    />
                                                  </div>

                                                  {/* Show uploaded files for this instance */}
                                                  {instance.uploadedFiles && instance.uploadedFiles.length > 0 && (
                                                    <div className="mt-2">
                                                      <div className="text-xs text-gray-600 mb-1">Uploaded files:</div>
                                                      <div className="space-y-1">
                                                        {instance.uploadedFiles.map((file, fileIndex) => (
                                                          <div key={fileIndex} className="flex items-center justify-between text-xs bg-green-50 border border-green-200 rounded px-2 py-1">
                                                            <span className="text-green-800">{file.name}</span>
                                                            <button
                                                              className="text-red-600 hover:text-red-800 ml-2"
                                                              onClick={() => {
                                                                const updatedFiles = instance.uploadedFiles.filter((_, idx) => idx !== fileIndex);
                                                                updateDocumentInstance(instance.id, 'uploadedFiles', updatedFiles);
                                                              }}
                                                            >
                                                              ✕
                                                            </button>
                                                          </div>
                                                        ))}
                                                      </div>
                                                    </div>
                                                  )}
                                                </div>
                                              </div>
                                            );
                                          })}

                                          {docInstances.length === 0 && (
                                            <div className="text-center py-4 text-gray-500 text-sm">
                                              Click "Add {docKey === 'w2' ? 'W-2' : docKey === '1099' ? '1099' : docKey.replace('_', ' ')}" above to start adding documents
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {/* Overall document strength assessment */}
                            {(() => {
                              const overallAssessment = assessOverallDocumentStrength(source);
                              if (!overallAssessment) return null;

                              return (
                                <div className={`mt-4 p-3 border rounded-lg ${getStrengthColor(overallAssessment.score)}`}>
                                  <div className="flex items-center space-x-2">
                                    <span className="text-lg">{getStrengthIcon(overallAssessment.score)}</span>
                                    <div>
                                      <div className="font-medium">Overall Documentation Strength</div>
                                      <div className="text-sm">{overallAssessment.message}</div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })()}

                          </div>
                        </div>
                      ))}

                      <button
                        onClick={addIncomeSource}
                        className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors"
                      >
                        <Plus className="mx-auto h-8 w-8 text-gray-400" />
                        <p className="mt-1 text-sm text-gray-600">Add Income Source</p>
                      </button>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-900">Total Annual Income:</span>
                        <span className="text-lg font-semibold text-gray-900">
                          ${calculateTotalIncome().toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        This should match your Form 1040 Adjusted Gross Income
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Part 2: Assets */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900">Part 2: Assets</h3>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            List assets available to support the beneficiary (convertible to cash within 12 months)
          </p>
        </div>

        <div className="space-y-4">
          {assets.map((asset) => (
            <div key={asset.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-medium text-gray-900">Asset #{assets.indexOf(asset) + 1}</h4>
                <button
                  onClick={() => removeAsset(asset.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Asset Type
                  </label>
                  <select
                    value={asset.type}
                    onChange={(e) => updateAsset(asset.id, 'type', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="">Select asset type</option>
                    {assetTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Currency
                  </label>
                  <select
                    value={asset.currency || 'USD'}
                    onChange={(e) => updateAssetWithCurrency(asset.id, 'currency', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    {currencies.map((currency) => (
                      <option key={currency.code} value={currency.code}>
                        {currency.code} - {currency.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Asset Value in {currencies.find(c => c.code === (asset.currency || 'USD'))?.name || 'USD'}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    {currencies.find(c => c.code === (asset.currency || 'USD'))?.symbol || '$'}
                  </span>
                  <input
                    type="number"
                    value={asset.originalValue || asset.value || '0'}
                    onChange={(e) => updateAssetWithCurrency(asset.id, 'originalValue', e.target.value)}
                    className="pl-8 w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="0"
                    step="0.01"
                  />
                </div>

                {asset.currency && asset.currency !== 'USD' && (
                  <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Info className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-800">
                        Amount for USCIS Form I-134: ${asset.usdValue || '0'} USD
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      This USD amount will appear on your official forms. Exchange rates may vary.
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description/Details
                </label>
                <input
                  type="text"
                  value={asset.description}
                  onChange={(e) => updateAsset(asset.id, 'description', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Bank name, account details, property address, etc."
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Supporting Documentation
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <Upload className="mx-auto h-8 w-8 text-gray-400" />
                  <p className="mt-1 text-sm text-gray-600">Upload statements, appraisals, or documentation</p>
                  <input type="file" className="hidden" multiple accept=".pdf,.jpg,.jpeg,.png" />
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={addAsset}
            className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors"
          >
            <Plus className="mx-auto h-8 w-8 text-gray-400" />
            <p className="mt-1 text-sm text-gray-600">Add Asset</p>
          </button>

          {assets.length > 0 && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-900">Total Liquid Assets:</span>
                <span className="text-lg font-semibold text-gray-900">
                  ${calculateTotalAssets().toLocaleString()}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Part 3: Specific Contributions */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900">Part 3: Additional Support Beyond Income</h3>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div className="flex items-start">
            <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-900">Why we're asking this</p>
              <p className="text-sm text-blue-800 mt-1">
                Beyond proving your income meets requirements, USCIS wants to know what other ways you'll help support your fiancé(e)
                when they arrive. Mentioning things like providing housing or helping with job searches can strengthen your application
                by showing your commitment and reducing their immediate financial needs.
              </p>
              <p className="text-sm text-blue-700 mt-2 italic">
                Note: This doesn't reduce the income requirement - you still need to meet 100% of the poverty guidelines.
                This is just additional context that can make your case stronger.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Will you be providing any of the following types of support when your fiancé(e) arrives?
            </label>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="providesContributions"
                  value="yes"
                  checked={providesContributions === true}
                  onChange={(e) => {
                    setProvidesContributions(true);
                    updateField('providesContributions', true);
                  }}
                  className="h-4 w-4 text-blue-600"
                />
                <span className="text-sm text-gray-700">Yes, I'll be providing non-financial support</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="providesContributions"
                  value="no"
                  checked={providesContributions === false}
                  onChange={(e) => {
                    setProvidesContributions(false);
                    updateField('providesContributions', false);
                  }}
                  className="h-4 w-4 text-blue-600"
                />
                <span className="text-sm text-gray-700">No, just financial support</span>
              </label>
            </div>
          </div>

          {providesContributions && (
            <div className="space-y-6 border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="bg-white border border-gray-200 rounded-lg p-3">
                <p className="text-sm text-gray-700">
                  <strong>What to include:</strong> Think about practical ways you'll help - will they live with you? Can you help them
                  find work? Will you assist with English classes or healthcare enrollment? Be specific but honest.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Describe the support you'll provide
                </label>
                <p className="text-xs text-gray-600 mb-3">
                  Examples: "I will provide free housing in my home", "I will help them find employment through my professional network",
                  "I will help them enroll in ESL classes at the community college", "I will help them apply for health insurance"
                </p>
                <textarea
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  rows={5}
                  placeholder="Describe how you'll support your fiancé(e) beyond financial help..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  If you're providing housing, where will they live?
                </label>
                <p className="text-xs text-gray-600 mb-2">
                  Only required if you mentioned providing housing above
                </p>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Full address (street, city, state, zip)"
                />
              </div>
            </div>
          )}
        </div>
      </div>
        </>
      )}
    </div>
  );
};

export default Section1_8;