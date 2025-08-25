import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Check, Info, User, Users, FileText, Home, Phone, MapPin } from 'lucide-react';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// Yup schema for marriage history validation
const marriageHistorySchema = yup.object().shape({
  marriages: yup.array().of(
    yup.object().shape({
      spouseLastName: yup.string().required('Spouse last name is required'),
      spouseFirstName: yup.string().required('Spouse first name is required'),
      spouseDOB: yup.date().required('Spouse date of birth is required'),
      spouseBirthCountry: yup.string().required('Spouse country of birth is required'),
      marriageDate: yup.date().required('Marriage date is required'),
      marriageEndDate: yup.date()
        .required('Marriage end date is required')
        .min(yup.ref('marriageDate'), 'Marriage end date must be after marriage date')
    })
  ).test('no-overlapping-dates', 'Marriage dates cannot overlap', function(marriages) {
    if (!marriages || marriages.length < 2) return true;
    
    // Check for overlapping dates
    for (let i = 0; i < marriages.length; i++) {
      for (let j = i + 1; j < marriages.length; j++) {
        const marriage1 = marriages[i];
        const marriage2 = marriages[j];
        
        if (marriage1.marriageDate && marriage1.marriageEndDate && 
            marriage2.marriageDate && marriage2.marriageEndDate) {
          
          const m1Start = new Date(marriage1.marriageDate);
          const m1End = new Date(marriage1.marriageEndDate);
          const m2Start = new Date(marriage2.marriageDate);
          const m2End = new Date(marriage2.marriageEndDate);
          
          // Check if dates overlap
          if (m1Start <= m2End && m1End >= m2Start) {
            return this.createError({
              message: `Marriage ${i + 1} and Marriage ${j + 1} have overlapping dates`,
              path: `marriages[${i}].marriageEndDate`
            });
          }
        }
      }
    }
    return true;
  })
});

const K1VisaQuestionnaire = () => {
  const [expandedSections, setExpandedSections] = useState({ 0: true });
  const [expandedSubsections, setExpandedSubsections] = useState({});
  const [currentData, setCurrentData] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const [showInfoPanel, setShowInfoPanel] = useState(false);
  const [showEarlierPlaces, setShowEarlierPlaces] = useState(false);
  
// TODO: Expand phone validation for international support
// Current implementation only supports 5 countries (US, CA, GB, AU, DE)
// Required improvements:
// 1. Add comprehensive country list with ISO 3166-1 alpha-2 codes
// 2. Implement country-specific phone validation rules:
//    - Min/max digit requirements per country
//    - Format patterns (use libphonenumber-js or similar library)
//    - Mobile vs landline number detection where applicable
// 3. Consider using international phone input library (e.g., react-phone-number-input)
// 4. Add phone number validation against ITU-T E.164 standard
// 5. Support for extension numbers and country-specific prefixes
// Reference: https://github.com/google/libphonenumber for validation rules
  const phoneCountries = [
    { code: 'US', name: 'United States', flag: '🇺🇸', dialCode: '+1', format: '(XXX) XXX-XXXX' },
    { code: 'CA', name: 'Canada', flag: '🇨🇦', dialCode: '+1', format: '(XXX) XXX-XXXX' },
    { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', dialCode: '+44', format: 'XXXX XXX XXX' },
    { code: 'AU', name: 'Australia', flag: '🇦🇺', dialCode: '+61', format: 'XXX XXX XXX' },
    { code: 'DE', name: 'Germany', flag: '🇩🇪', dialCode: '+49', format: 'XXX XXXXXXX' }
  ];

  const addressFormats = {
    'United States': {
      stateRequired: true,
      stateLabel: 'State',
      postalLabel: 'ZIP Code',
      postalFormat: /^\d{5}(-\d{4})?$/,
      postalPlaceholder: '12345 or 12345-6789',
      states: [
        'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
        'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
        'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
        'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
        'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
        'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
        'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
        'Wisconsin', 'Wyoming', 'District of Columbia'
      ]
    },
    'Canada': {
      stateRequired: true,
      stateLabel: 'Province/Territory',
      postalLabel: 'Postal Code',
      postalFormat: /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/,
      postalPlaceholder: 'K1A 0A9',
      states: [
        'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick', 'Newfoundland and Labrador',
        'Northwest Territories', 'Nova Scotia', 'Nunavut', 'Ontario', 'Prince Edward Island',
        'Quebec', 'Saskatchewan', 'Yukon'
      ]
    },
    'United Kingdom': {
      stateRequired: false,
      stateLabel: 'County (Optional)',
      postalLabel: 'Postcode',
      postalFormat: /^[A-Za-z]{1,2}\d[A-Za-z\d]?\s\d[A-Za-z]{2}$/,
      postalPlaceholder: 'SW1A 1AA'
    },
    'Australia': {
      stateRequired: false,
      stateLabel: 'State/Territory (Optional)',
      postalLabel: 'Postcode',
      postalFormat: /^\d{4}$/,
      postalPlaceholder: '2000',
      states: [
        'Australian Capital Territory', 'New South Wales', 'Northern Territory',
        'Queensland', 'South Australia', 'Tasmania', 'Victoria', 'Western Australia'
      ]
    },
    'Germany': {
      stateRequired: false,
      stateLabel: 'State (Optional)',
      postalLabel: 'Postleitzahl (PLZ)',
      postalFormat: /^\d{5}$/,
      postalPlaceholder: '10115',
      states: [
        'Baden-Württemberg', 'Bavaria', 'Berlin', 'Brandenburg', 'Bremen', 'Hamburg',
        'Hesse', 'Lower Saxony', 'Mecklenburg-Vorpommern', 'North Rhine-Westphalia',
        'Rhineland-Palatinate', 'Saarland', 'Saxony', 'Saxony-Anhalt', 'Schleswig-Holstein',
        'Thuringia'
      ]
    }
  };

  const formatPostalCode = (value, country) => {
    const format = addressFormats[country];
    if (!format) return value;

    const digits = value.replace(/\D/g, '');

    switch (country) {
      case 'United States':
        if (digits.length > 5) {
          return digits.slice(0, 5) + '-' + digits.slice(5, 9);
        }
        return digits.slice(0, 5);

      case 'Canada':
        const letters = value.replace(/[^A-Za-z]/gi, '').toUpperCase();
        const nums = value.replace(/[^0-9]/g, '');
        if (letters.length >= 3 && nums.length >= 3) {
          return `${letters[0]}${nums[0]}${letters[1]} ${nums[1]}${letters[2]}${nums[2]}`;
        }
        return value.toUpperCase();

      case 'United Kingdom':
        return value.toUpperCase();

      default:
        return digits;
    }
  };

  const formatPhoneByCountry = (value, countryCode) => {
    const country = phoneCountries.find(c => c.code === countryCode);
    if (!country) return value;
    const digits = value.replace(/\D/g, '');
    const format = country.format;
    let formatted = '';
    let digitIndex = 0;
    for (let i = 0; i < format.length && digitIndex < digits.length; i++) {
      if (format[i] === 'X') {
        formatted += digits[digitIndex];
        digitIndex++;
      } else {
        formatted += format[i];
      }
    }
    return formatted;
  };

  const validateEmail = (emailObj) => {
    if (!emailObj || (!emailObj.localPart && !emailObj.domain)) {
      return { isValid: true, message: '' };
    }
    const { localPart, domain, customDomain } = emailObj;

    if (localPart && localPart.length === 0) {
      return { isValid: false, message: "Please enter your email name" };
    }

    if (localPart && !domain) {
      return { isValid: false, message: "Please select an email provider (like Gmail)" };
    }

    if (domain === 'other' && (!customDomain || customDomain.length === 0)) {
      return { isValid: false, message: "Please enter your email provider (like company.com)" };
    }

    if (domain === 'other' && customDomain && !customDomain.includes('.')) {
      return { isValid: false, message: "Email provider must include a dot (like company.com)" };
    }

    if (localPart && (domain !== 'other' || customDomain)) {
      return { isValid: true, message: "Looks good! ✅" };
    }

    return { isValid: true, message: '' };
  };

  // Helper function for address history
  const getCurrentAddressStartDate = (physicalSameCheck, duration) => {
    if (!duration) return '';

    const today = new Date();
    let yearsBack = 0;

    switch (duration) {
      case 'less-than-1-year': yearsBack = 0.5; break;
      case '1-2-years': yearsBack = 1.5; break;
      case '2-3-years': yearsBack = 2.5; break;
      case '3-4-years': yearsBack = 3.5; break;
      case '4-5-years': yearsBack = 4.5; break;
      case '5-plus-years': yearsBack = 5; break;
      default: return '';
    }

    const startDate = new Date(today);
    startDate.setFullYear(startDate.getFullYear() - yearsBack);
    return startDate.toISOString().split('T')[0];
  };

  // Define subsections for the sponsor section
const sponsorSubsections = [
    {
      id: '1.1-personal-info',
      title: '1.1 Personal Information',
      icon: User,
      description: 'Legal names, identification, and personal details',
      questionCount: 21,
      fields: [
        // Legal Name
        { id: 'sponsorLastName', label: 'Legal Last Name (Family Name)', type: 'text', required: true },
        { id: 'sponsorFirstName', label: 'Legal First Name (Given Name)', type: 'text', required: true },
        { id: 'sponsorMiddleName', label: 'Middle Name', type: 'text', required: false },
        
        // Other Names
        { id: 'sponsorOtherNames', label: 'Other Names Used (aliases, maiden name, nicknames)', type: 'other-names', required: false },
        
        // Basic Information
        { id: 'sponsorDOB', label: '[SponsorFirstName]\'s Date of Birth', type: 'date', required: true },
        { id: 'sponsorBirthLocation', label: 'Place of Birth', type: 'birth-location', required: true },
        { id: 'sponsorSex', label: 'Sex', type: 'select', options: ['Male', 'Female'], required: true },
        { id: 'sponsorSSN', label: 'Social Security Number', type: 'ssn', required: true },
        
        // Ethnicity and Race (NEW FIELDS)
        { id: 'sponsorEthnicity', label: 'Ethnicity', type: 'select', 
          options: ['Hispanic or Latino', 'Not Hispanic or Latino'], 
          required: true 
        },
        { id: 'sponsorRace', label: 'Race (Select all that apply)', type: 'multi-select', 
          options: ['American Indian or Alaska Native', 'Asian', 'Black or African American', 'Native Hawaiian or Other Pacific Islander', 'White'], 
          required: true 
        },
        
        // Physical Description
        { id: 'sponsorHeight', label: 'Height', type: 'height-converter', required: true },
        { id: 'sponsorWeight', label: 'Weight', type: 'weight', required: true },
        { id: 'sponsorEyeColor', label: 'Eye Color', type: 'select', 
          options: ['Black', 'Blue', 'Brown', 'Gray', 'Green', 'Hazel', 'Maroon', 'Pink', 'Unknown/Other'], 
          required: true 
        },
        { id: 'sponsorHairColor', label: 'Hair Color', type: 'select', 
          options: ['Bald (No hair)', 'Black', 'Blonde', 'Brown', 'Gray', 'Red', 'Sandy', 'White', 'Unknown/Other'], 
          required: true 
        },
        
        // Account Numbers
        { id: 'sponsorANumber', label: 'USCIS File Number (A-Number) if any', type: 'a-number', required: false },
        { id: 'sponsorUSCISAccount', label: 'USCIS Online Account Number (if any)', type: 'text', required: false },

        // Certificates
        // U.S. Citizenship Information
{ id: 'sponsorCitizenshipThrough', label: 'How did you obtain U.S. citizenship?', type: 'citizenship-method', required: true },

// Certificates
{ id: 'sponsorHasCertificate', label: 'Do you have a Certificate of Naturalization or Certificate of Citizenship?', type: 'cert-question', required: true },
        { id: 'sponsorCertNumber', label: 'Certificate Number', type: 'cert-number', required: true, conditional: true },
        { id: 'sponsorCertIssueDate', label: 'Date of Issuance', type: 'date', required: true, conditional: true },
        { id: 'sponsorCertIssuePlace', label: 'Place of Issuance', type: 'cert-place', required: true, conditional: true },
      ]
    },
    {
      id: '1.2-contact',
      title: '1.2 Contact Information',
      icon: Phone,
      description: 'Phone numbers, email, and contact preferences',
      questionCount: 4,
      fields: [
        { id: 'sponsorEmail', label: 'Email Address', type: 'smart-email', required: true },   
        { id: 'sponsorNewsletter', label: 'Keep me informed about immigration policy changes, news, and updates that may affect my case', type: 'checkbox', required: false, hideLabel: true },  
        { id: 'sponsorDaytimePhone', label: 'Daytime Phone Number', type: 'international-phone', required: true },
        { id: 'sponsorMobilePhone', label: 'Mobile Phone Number', type: 'international-phone', required: false }
      ]
    }
  ];

  const sponsorAddressSubsections = [
    {
      id: '1.3-addresses',
      title: '1.3 Complete Address History',
      icon: Home,
      description: 'Mailing, current, and previous addresses',
      questionCount: 8,
      fields: [
// Mailing Address (FIRST)
{ id: 'sponsorMailingAddress', label: 'Mailing Address', type: 'address-with-careof', required: true },

// Check if physical is different
{ id: 'sponsorMailingDifferent', label: 'Is your physical address different from your mailing address?', type: 'select', options: ['No', 'Yes'], required: true },

// Physical Address (conditional)
{ id: 'sponsorCurrentAddress', label: 'Current Physical Address', type: 'address', required: true, conditional: true },

// Move-in date (shows for mailing address if same, physical if different)
{ id: 'sponsorMoveInDate', label: 'Date moved to this address', type: 'date', required: true },

// Address History (if needed based on move-in date)
{ id: 'sponsorAddressHistory', label: 'Previous Addresses (Past 5 Years)', type: 'conditional-address-history', required: true },

// Places lived since age 18
{ id: 'sponsorPlacesResided', label: 'Places Lived Since Age 18', type: 'states-countries-list', required: true }
      ]
    }
  ];

  const sponsorMaritalSubsections = [
    {
      id: '1.4-marital',
      title: '1.4 Marital History',
      icon: Users,
      description: 'Current and previous marriages',
      questionCount: 4,
      fields: [
        { id: 'sponsorMaritalStatus', label: 'Current Marital Status', type: 'select', 
          options: ['Single', 'Divorced', 'Widowed', 'Married'], 
          required: true,
          helpText: 'Choose based on how your most recent marriage ended. For example, if you were widowed then remarried and divorced, select "Divorced".'
        },
        { id: 'marriedEligibilityCheck', type: 'married-eligibility-check', hideLabel: true, required: false, conditional: true },
        { id: 'sponsorStatusDate', label: 'Date', type: 'date', required: false, conditional: true },
        { id: 'sponsorPreviousMarriages', label: 'How many times has [SponsorFirstName] been previously married?', type: 'select', 
          options: ['0', '1', '2', '3', '4', '5+'], 
          required: true 
        },
        { id: 'sponsorMarriageHistory', label: 'Previous Marriage Details', type: 'marriage-history', required: false, conditional: true }
      ]
    }
  ];

  const sponsorFamilySubsections = [
    {
      id: '1.5-family',
      title: '1.5 Family Background',
      icon: Users,
      description: 'Information about your parents',
      questionCount: 18,
      fields: [
        // Father's Information
        { id: 'sponsorFatherLastName', label: "Father's Last Name at Birth", type: 'text', required: true },
        { id: 'sponsorFatherFirstName', label: "Father's First Name", type: 'text', required: true },
        { id: 'sponsorFatherMiddleName', label: "Father's Middle Name", type: 'text', required: false },
        { id: 'sponsorFatherDOB', label: "Father's Date of Birth", type: 'date', required: true },
        { id: 'sponsorFatherBirthCity', label: "Father's City of Birth", type: 'text', required: true },
        { id: 'sponsorFatherBirthCountry', label: "Father's Country of Birth", type: 'country', required: true },
        { id: 'sponsorFatherCurrentCity', label: "Father's Current City of Residence", type: 'text', required: true },
        { id: 'sponsorFatherCurrentCountry', label: "Father's Current Country of Residence", type: 'country', required: true },
        { id: 'sponsorFatherLiving', label: 'Is your father living?', type: 'select', options: ['Yes', 'No'], required: true },
        
        // Mother's Information
        { id: 'sponsorMotherMaidenName', label: "Mother's Last Name at Birth (Maiden Name)", type: 'text', required: true },
        { id: 'sponsorMotherFirstName', label: "Mother's First Name", type: 'text', required: true },
        { id: 'sponsorMotherMiddleName', label: "Mother's Middle Name", type: 'text', required: false },
        { id: 'sponsorMotherDOB', label: "Mother's Date of Birth", type: 'date', required: true },
        { id: 'sponsorMotherBirthCity', label: "Mother's City of Birth", type: 'text', required: true },
        { id: 'sponsorMotherBirthCountry', label: "Mother's Country of Birth", type: 'country', required: true },
        { id: 'sponsorMotherCurrentCity', label: "Mother's Current City of Residence", type: 'text', required: true },
        { id: 'sponsorMotherCurrentCountry', label: "Mother's Current Country of Residence", type: 'country', required: true },
        { id: 'sponsorMotherLiving', label: 'Is your mother living?', type: 'select', options: ['Yes', 'No'], required: true }
      ]
    }
  ];

  const sponsorEmploymentSubsections = [
    {
      id: '1.6-employment',
      title: '1.6 Employment & Work History',
      icon: FileText,
      description: 'Current and previous employment information',
      questionCount: 15,
      fields: [
        { id: 'sponsorEmploymentStatus', label: 'Current Employment Status', type: 'select', 
          options: ['Employed', 'Self-Employed', 'Retired', 'Unemployed', 'Student', 'Other'], 
          required: true 
        },
        
        // If Employed or Self-Employed (conditional fields)
        { id: 'sponsorEmployerName', label: 'Employer/Business Name', type: 'text', required: false, conditional: true },
        { id: 'sponsorEmployerAddress', label: 'Employer/Business Address', type: 'address', required: false, conditional: true },
        { id: 'sponsorEmployerPhone', label: 'Employer Phone Number', type: 'international-phone', required: false, conditional: true },
        { id: 'sponsorSupervisorName', label: 'Supervisor Name', type: 'text', required: false, conditional: true },
        { id: 'sponsorSupervisorTitle', label: 'Supervisor Title', type: 'text', required: false, conditional: true },
        { id: 'sponsorSupervisorPhone', label: 'Supervisor Phone', type: 'international-phone', required: false, conditional: true },
        { id: 'sponsorHRPhone', label: 'HR Department Phone', type: 'international-phone', required: false, conditional: true },
        { id: 'sponsorJobTitle', label: 'Your Job Title/Occupation', type: 'text', required: false, conditional: true },
        { id: 'sponsorBusinessType', label: 'Type of Business/Industry', type: 'text', required: false, conditional: true },
        { id: 'sponsorEmploymentStartDate', label: 'Date Employment Began', type: 'date', required: false, conditional: true },
        { id: 'sponsorAnnualSalary', label: 'Annual Salary (USD)', type: 'currency', required: false, conditional: true },
        { id: 'sponsorFullTime', label: 'Is this full-time employment?', type: 'select', options: ['Yes', 'No'], required: false, conditional: true },
        
        // Employment Duration - uses your existing dynamic-employment-duration
        { id: 'sponsorEmploymentDuration', label: 'Employment Duration', type: 'dynamic-employment-duration', required: false, conditional: true },
        
        // Employment History - uses your existing conditional-employment-history
        { id: 'sponsorEmploymentHistory', label: 'Previous Employment (Last 5 Years)', type: 'conditional-employment-history', required: true }
      ]
    }
  ];

  // Financial sections are large, so I'm breaking them into subsections
  const sponsorFinancialSubsections = [
    {
      id: '1.7-financial-income',
      title: '1.7 Financial Information - Income',
      icon: FileText,
      description: 'Current income and tax information',
      questionCount: 15,
      fields: [
        // This section would have income fields
        { id: 'sponsorCurrentlyEmployed', label: 'Are you currently employed?', type: 'select', options: ['Yes', 'No'], required: true },
        { id: 'sponsorActiveDuty', label: 'Are you currently on active duty in U.S. Armed Forces?', type: 'select', options: ['No', 'Yes'], required: true },
        // Add more income fields here...
      ]
    }
    // Add more financial subsections here...
  ];

  const sponsorPetitionsSubsections = [
    {
      id: '1.8-petitions',
      title: '1.8 Previous Petitions & Affidavits',
      icon: FileText,
      description: 'Previous I-129F petitions and support affidavits',
      questionCount: 6,
      fields: [
        { id: 'sponsorFiledI129FBefore', label: 'Have you filed Form I-129F before?', type: 'select', options: ['No', 'Yes'], required: true },
        { id: 'sponsorI129FCount', label: 'How many times?', type: 'number', required: false, conditional: true },
        // Add more fields...
      ]
    }
  ];

  const sponsorLegalSubsections = [
    {
      id: '1.9-legal',
      title: '1.9 Legal History',
      icon: FileText,
      description: 'Criminal history and legal matters',
      questionCount: 20,
      fields: [
        { id: 'sponsorEverArrested', label: 'Have you ever been arrested or convicted of any crime?', type: 'select', options: ['No', 'Yes'], required: true },
        // Add more legal fields...
      ]
    }
  ];

const sections = [
  {
    id: 'sponsor-section-1',
    title: 'Section 1: U.S. Citizen Sponsor - Complete Profile',
    subtitle: 'All sponsor information required for K-1 visa',
    questionCount: 150,
    role: 'sponsor',
    hasSubsections: true,
    subsections: [
      ...sponsorSubsections,
      ...sponsorAddressSubsections,
      ...sponsorMaritalSubsections,
      ...sponsorFamilySubsections,
      ...sponsorEmploymentSubsections,
      ...sponsorFinancialSubsections,
      ...sponsorPetitionsSubsections,
      ...sponsorLegalSubsections
    ]
  },
  {
    id: 'beneficiary-personal',
    title: 'Beneficiary Identity & Demographics',
    subtitle: 'Foreign fiancé(e) core identifying information',
    questionCount: 10,
    role: 'beneficiary',
    fields: [
      { id: 'beneficiaryLastName', label: 'Legal Last Name', type: 'text', required: true },
      { id: 'beneficiaryFirstName', label: 'Legal First Name', type: 'text', required: true },
      { id: 'beneficiaryMiddleName', label: 'Middle Name', type: 'text', required: false },
      { id: 'beneficiaryOtherNames', label: 'Other Names Used (aliases, maiden name, nicknames)', type: 'textarea', required: false },
      { id: 'beneficiaryDOB', label: '[BeneficiaryFirstName]\'s Date of Birth', type: 'date', required: true },
      { id: 'beneficiarySex', label: 'Sex', type: 'select', options: ['Male', 'Female'], required: true },
      { id: 'beneficiaryBirthCity', label: 'City/Town/Village of Birth', type: 'text', required: true },
      { id: 'beneficiaryBirthCountry', label: '[BeneficiaryFirstName]\'s Country of Birth', type: 'text', required: true },
      { id: 'beneficiaryCitizenship', label: 'Country of Citizenship or Nationality', type: 'text', required: true },
      { id: 'beneficiaryMaritalStatus', label: 'Marital Status', type: 'select', options: ['Single', 'Married', 'Divorced', 'Widowed', 'Legally Separated'], required: true }
    ]
  }
  // Add your other sections here if you have them
];

  const toggleSection = (index) => {
    setExpandedSections(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const toggleSubsection = (sectionIndex, subsectionId) => {
    const key = `${sectionIndex}-${subsectionId}`;
    setExpandedSubsections(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

const updateField = (field, value) => {
  setCurrentData(prev => ({
    ...prev,
    [field]: value
  }));
};
  
  const renderField = (field) => {
    const value = currentData[field.id] || '';

    switch (field.type) {

case 'states-countries-list':
  const sponsorDOBForList = currentData['sponsorDOB'] || '';
  
  // If no DOB provided, don't show anything
  if (!sponsorDOBForList) {
    return null;
  }
  
  // Calculate age
  let userAge = null;
  const today = new Date();
  const birthDate = new Date(sponsorDOBForList);
  userAge = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    userAge--;
  }
  
  // If 23 or younger, the 5-year history already covers since age 18
  if (userAge <= 23) {
    return (
      <div className="text-sm text-green-600 bg-green-50 border border-green-200 rounded p-3">
        <p className="font-medium">✅ Your 5-year address history already covers all places since age 18</p>
        <p className="text-xs mt-1">No additional information needed for this section.</p>
      </div>
    );
  }
  
// Auto-extract states/countries from existing address data
  const extractedPlaces = new Set();
  
  // From current physical address (could be mailing or separate physical)
  const physicalAddr = currentData['sponsorMailingDifferent'] === 'Yes' 
    ? (currentData['sponsorCurrentAddress'] || {})
    : (currentData['sponsorMailingAddress'] || {});
  
  if (physicalAddr.country === 'United States' && physicalAddr.state) {
    extractedPlaces.add(`${physicalAddr.state}, USA`);
  } else if (physicalAddr.country && physicalAddr.country !== 'United States') {
    extractedPlaces.add(physicalAddr.country);
  }
  
  // From address history
  const addrHistory = currentData['sponsorAddressHistory'] || [];
  addrHistory.forEach(addr => {
    if (addr.country === 'United States' && addr.state) {
      extractedPlaces.add(`${addr.state}, USA`);
    } else if (addr.country && addr.country !== 'United States') {
      extractedPlaces.add(addr.country);
    }
  });
  
  // From mailing address if different
  if (currentData['sponsorMailingDifferent'] === 'Yes') {
    const mailingAddr = currentData['sponsorMailingAddress'] || {};
    if (mailingAddr.country === 'United States' && mailingAddr.state) {
      extractedPlaces.add(`${mailingAddr.state}, USA`);
    } else if (mailingAddr.country && mailingAddr.country !== 'United States') {
      extractedPlaces.add(mailingAddr.country);
    }
  }
  
  // User's additional places (from before the 5-year period)
const additionalPlaces = currentData[field.id] || [];

// Track whether user needs to add earlier places
const showEarlierPlaces = currentData[`${field.id}_answer`] === 'yes';

// Calculate date ranges
const currentYear = today.getFullYear();
const currentMonth = today.getMonth() + 1;
const currentDay = today.getDate();

// Date when user turned 18
const turned18Date = new Date(birthDate);
turned18Date.setFullYear(birthDate.getFullYear() + 18);
const turned18DateStr = `${turned18Date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`;

// Date 5 years ago
const fiveYearsAgoDate = new Date(today);
fiveYearsAgoDate.setFullYear(currentYear - 5);
const fiveYearsAgoStr = `${fiveYearsAgoDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`;

// Current date string
const currentDateStr = `${today.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`;

return (
  <div className="space-y-4">
    {/* Show extracted places */}
    {extractedPlaces.size > 0 && (
      <div className="bg-green-50 border border-green-200 rounded p-3">
        <p className="text-sm font-medium text-green-800 mb-2">
          ✅ We have these locations from your addresses:
        </p>
        <div className="space-y-1">
          {Array.from(extractedPlaces).map((place, index) => (
            <div key={index} className="text-sm text-green-700">
              • {place} ({fiveYearsAgoStr} - {currentDateStr})
            </div>
          ))}
        </div>
      </div>
    )}
    
{/* Simple Yes/No Question */}
    <div className="space-y-3">
      <p className="text-sm font-medium text-gray-700">
        Did you live anywhere else between {turned18DateStr} - {fiveYearsAgoStr}?
      </p>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => {
            updateField(`${field.id}_answer`, 'yes');
          }}
          className={`px-4 py-2 rounded border transition-colors ${
            showEarlierPlaces 
              ? 'bg-blue-500 text-white border-blue-500' 
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          Yes
        </button>
        <button
          type="button"
          onClick={() => {
            updateField(`${field.id}_answer`, 'no');
            updateField(field.id, []); // Clear any added places
          }}
          className={`px-4 py-2 rounded border transition-colors ${
            !showEarlierPlaces && currentData[`${field.id}_answer`] === 'no'
              ? 'bg-blue-500 text-white border-blue-500' 
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          No - same places
        </button>
      </div>
    </div>
    
    {/* Only show fields if they answered Yes */}
    {showEarlierPlaces && (
      <div className="space-y-3 border-l-4 border-blue-400 pl-4">
        <p className="text-sm text-gray-600">
          Add all states and countries where you lived between {turned18DateStr} - {fiveYearsAgoStr}:
        </p>
        
        {additionalPlaces.map((place, index) => (
          <div key={index} className="flex items-center space-x-2">
            <select
              className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500"
              value={place.type || ''}
              onChange={(e) => {
                const newPlaces = [...additionalPlaces];
                newPlaces[index] = { ...place, type: e.target.value, location: '' };
                updateField(field.id, newPlaces);
              }}
            >
              <option value="">Select type...</option>
              <option value="us-state">U.S. State</option>
              <option value="foreign-country">Foreign Country</option>
            </select>
            
            {place.type === 'us-state' && (
              <select
                className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500"
                value={place.location || ''}
                onChange={(e) => {
                  const newPlaces = [...additionalPlaces];
                  newPlaces[index] = { ...place, location: e.target.value };
                  updateField(field.id, newPlaces);
                }}
              >
                <option value="">Select state...</option>
                {addressFormats['United States'].states.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            )}
            
            {place.type === 'foreign-country' && (
              <select
                className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500"
                value={place.location || ''}
                onChange={(e) => {
                  const newPlaces = [...additionalPlaces];
                  newPlaces[index] = { ...place, location: e.target.value };
                  updateField(field.id, newPlaces);
                }}
              >
                <option value="">Select country...</option>
                {phoneCountries.map(c => (
                  <option key={c.code} value={c.name}>
                    {c.flag} {c.name}
                  </option>
                ))}
              </select>
            )}
            
            <button
              type="button"
              onClick={() => {
                const newPlaces = additionalPlaces.filter((_, i) => i !== index);
                updateField(field.id, newPlaces);
              }}
              className="text-red-600 hover:text-red-800"
            >
              Remove
            </button>
          </div>
        ))}
        
        <button
          type="button"
          onClick={() => {
            updateField(field.id, [...additionalPlaces, { type: '', location: '' }]);
          }}
          className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-800 transition-colors"
        >
          + Add State or Country
        </button>
      </div>
    )}
  </div>
);

      case 'select':
  const isSelectFieldTouched = touchedFields && touchedFields[field.id];
  const showSelectError = isSelectFieldTouched && field.required && (!value || value === '');
  
  return (
    <div>
      <select
        className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 ${
          showSelectError ? 'border-red-500' : ''
        }`}
        value={value}
        onFocus={() => {
          setTouchedFields(prev => ({ ...prev, [field.id]: false }));
        }}
        onBlur={() => {
          setTouchedFields(prev => ({ ...prev, [field.id]: true }));
        }}
        onChange={(e) => updateField(field.id, e.target.value)}
      >
        <option value="">Select...</option>
        {field.options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      {showSelectError && (
        <div className="mt-1 text-sm text-red-600">
          ⚠️ Please select an option
        </div>
      )}
    </div>
  );

      case 'address-duration':
        return (
          <div className="space-y-2">
            <select
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              value={value}
              onChange={(e) => updateField(field.id, e.target.value)}
            >
              <option value="">Select duration...</option>
              <option value="less-than-1-year">Less than 1 year</option>
              <option value="1-2-years">1-2 years</option>
              <option value="2-3-years">2-3 years</option>
              <option value="3-4-years">3-4 years</option>
              <option value="4-5-years">4-5 years</option>
              <option value="5-plus-years">5+ years</option>
            </select>
          </div>
        );

      case 'conditional-address':
        const physicalSameValue = currentData['sponsorPhysicalSame'] || '';

        if (physicalSameValue !== 'No') {
          return null;
        }

        const conditionalAddressValue = currentData[field.id] || {};
        const {
          street: condStreet = '',
          city: condCity = '',
          state: condState = '',
          zipCode: condZipCode = '',
          country: condCountry = ''
        } = conditionalAddressValue;
        const condCountryFormat = addressFormats[condCountry] || addressFormats['United States'];

        return (
          <div className="space-y-3">
            <select
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              value={condCountry}
              onChange={(e) => {
                updateField(field.id, { ...conditionalAddressValue, country: e.target.value, state: '', zipCode: '' });
              }}
            >
              <option value="">Select country...</option>
              {phoneCountries.map(c => (
                <option key={c.code} value={c.name}>
                  {c.flag} {c.name}
                </option>
              ))}
            </select>

            {condCountry && (
              <>
                <input
                  type="text"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  value={condStreet}
                  onChange={(e) => updateField(field.id, { ...conditionalAddressValue, street: e.target.value })}
                  placeholder="Street Number and Name"
                />

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    className="p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    value={condCity}
                    onChange={(e) => updateField(field.id, { ...conditionalAddressValue, city: e.target.value })}
                    placeholder="City"
                  />
                  <div className="relative">
                    {condCountryFormat.states ? (
                      <select
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                        value={condState}
                        onChange={(e) => updateField(field.id, { ...conditionalAddressValue, state: e.target.value })}
                      >
                        <option value="">Select {condCountryFormat.stateLabel.toLowerCase()}...</option>
                        {condCountryFormat.states.map(stateOption => (
                          <option key={stateOption} value={stateOption}>{stateOption}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 ${condCountryFormat.stateRequired ? 'border-gray-300' : 'border-gray-200 bg-gray-50'
                          }`}
                        value={condState}
                        onChange={(e) => updateField(field.id, { ...conditionalAddressValue, state: e.target.value })}
                        placeholder={condCountryFormat.stateLabel}
                        disabled={!condCountryFormat.stateRequired && condCountry !== 'United States' && condCountry !== 'Canada'}
                      />
                    )}
                    {condCountryFormat.stateRequired && (
                      <span className="absolute right-2 top-2 text-red-500 text-sm">*</span>
                    )}
                  </div>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    value={condZipCode}
                    onChange={(e) => {
                      const formatted = formatPostalCode(e.target.value, condCountry);
                      updateField(field.id, { ...conditionalAddressValue, zipCode: formatted });
                    }}
                    placeholder={condCountryFormat.postalPlaceholder}
                  />
                  <label className="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-600">
                    {condCountryFormat.postalLabel} <span className="text-red-500">*</span>
                  </label>
                </div>

                {condZipCode && !condCountryFormat.postalFormat.test(condZipCode) && (
                  <div className="text-sm text-orange-600 flex items-center">
                    <span>Please enter a valid {condCountryFormat.postalLabel.toLowerCase()} for {condCountry}</span>
                  </div>
                )}
              </>
            )}
          </div>
        );

case 'conditional-address-history':
        const moveInDate = currentData['sponsorMoveInDate'] || '';
        
        // If no move-in date is entered yet, don't show anything
        if (!moveInDate) {
          return null;
        }
        
        // Check if address history is needed
        const fiveYearsAgo = new Date();
        fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);
        const needsAddressHistory = new Date(moveInDate) > fiveYearsAgo;
        
        if (!needsAddressHistory) {
          return (
            <div className="text-sm text-green-600 bg-green-50 border border-green-200 rounded p-3">
              <p className="font-medium">✅ No Address History Needed</p>
              <p>You've lived at your current address for 5+ years.</p>
            </div>
          );
        }
        
        const addressHistoryValue = currentData[field.id] || [];
        const fiveYearsAgoString = fiveYearsAgo.toISOString().split('T')[0];
        
        // Check if we have complete 5-year coverage
        const lastAddress = addressHistoryValue[addressHistoryValue.length - 1];
        const hasCompleteCoverage = lastAddress && lastAddress.dateFrom && 
          new Date(lastAddress.dateFrom) <= fiveYearsAgo;
        
        // Calculate coverage gap if any
        let coverageGap = null;
        if (addressHistoryValue.length > 0 && lastAddress && lastAddress.dateFrom) {
          const lastDate = new Date(lastAddress.dateFrom);
          if (lastDate > fiveYearsAgo) {
            const gapMonths = Math.ceil((lastDate - fiveYearsAgo) / (1000 * 60 * 60 * 24 * 30));
            coverageGap = gapMonths;
          }
        }
        
        return (
          <div className="space-y-4">
            <div className="text-sm text-gray-600 bg-blue-50 border border-blue-200 rounded p-3">
              <p className="font-medium text-blue-800 mb-1">📍 Address History Requirements</p>
              <p>You must provide all addresses where you've lived from <strong>{fiveYearsAgoString}</strong> to <strong>{moveInDate}</strong>.</p>
              <p className="text-xs mt-1">Each address must connect directly to the next with no gaps in dates.</p>
            </div>
            
            {addressHistoryValue.map((address, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-800">
                    Previous Address #{index + 1}
                    {index === 0 && <span className="text-xs text-gray-500 ml-2">(Most recent)</span>}
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      const newHistory = addressHistoryValue.filter((_, i) => i !== index);
                      updateField(field.id, newHistory);
                    }}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
                
                <div className="space-y-3">
                  {/* Date Range */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Date From
                        {index === addressHistoryValue.length - 1 && 
                          <span className="text-gray-500 ml-1">(oldest)</span>}
                      </label>
                      <input
                        type="date"
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                        value={address.dateFrom || ''}
                        max={index === 0 ? moveInDate : (addressHistoryValue[index - 1]?.dateFrom || moveInDate)}
                        min={fiveYearsAgoString}
                        onChange={(e) => {
                          const newHistory = [...addressHistoryValue];
                          newHistory[index] = { ...address, dateFrom: e.target.value };
                          
                          // Auto-update the previous address's dateTo
                          if (index < addressHistoryValue.length - 1) {
                            newHistory[index + 1].dateTo = e.target.value;
                          }
                          
                          updateField(field.id, newHistory);
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Date To
                        {index === 0 && <span className="text-gray-500 ml-1">(must match move-in date)</span>}
                      </label>
                      <input
                        type="date"
                        className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
                        value={address.dateTo || (index === 0 ? moveInDate : '')}
                        readOnly
                      />
                    </div>
                  </div>
                  
                  {/* Date validation messages */}
                  {address.dateFrom && address.dateTo && new Date(address.dateFrom) >= new Date(address.dateTo) && (
                    <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded p-2">
                      ⚠️ "Date From" must be before "Date To"
                    </div>
                  )}
                  
                  {/* Country Selection */}
                  <select
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    value={address.country || ''}
                    onChange={(e) => {
                      const newHistory = [...addressHistoryValue];
                      newHistory[index] = { ...address, country: e.target.value, state: '', zipCode: '' };
                      updateField(field.id, newHistory);
                    }}
                  >
                    <option value="">Select country...</option>
                    {phoneCountries.map(c => (
                      <option key={c.code} value={c.name}>
                        {c.flag} {c.name}
                      </option>
                    ))}
                  </select>
                  
                  {address.country && (
                    <>
                      {/* Street Address */}
                      <input
                        type="text"
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                        value={address.street || ''}
                        onChange={(e) => {
                          const newHistory = [...addressHistoryValue];
                          newHistory[index] = { ...address, street: e.target.value };
                          updateField(field.id, newHistory);
                        }}
                        placeholder="Street Number and Name"
                      />
                      
                      {/* City and State */}
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          className="p-2 border rounded focus:ring-2 focus:ring-blue-500"
                          value={address.city || ''}
                          onChange={(e) => {
                            const newHistory = [...addressHistoryValue];
                            newHistory[index] = { ...address, city: e.target.value };
                            updateField(field.id, newHistory);
                          }}
                          placeholder="City"
                        />
                        <div>
                          {(() => {
                            const countryFormat = addressFormats[address.country] || addressFormats['United States'];
                            return countryFormat.states ? (
                              <select
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                                value={address.state || ''}
                                onChange={(e) => {
                                  const newHistory = [...addressHistoryValue];
                                  newHistory[index] = { ...address, state: e.target.value };
                                  updateField(field.id, newHistory);
                                }}
                              >
                                <option value="">Select {countryFormat.stateLabel}...</option>
                                {countryFormat.states.map(stateOption => (
                                  <option key={stateOption} value={stateOption}>{stateOption}</option>
                                ))}
                              </select>
                            ) : (
                              <input
                                type="text"
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                                value={address.state || ''}
                                onChange={(e) => {
                                  const newHistory = [...addressHistoryValue];
                                  newHistory[index] = { ...address, state: e.target.value };
                                  updateField(field.id, newHistory);
                                }}
                                placeholder={countryFormat.stateLabel || 'State/Province'}
                              />
                            );
                          })()}
                        </div>
                      </div>
                      
                      {/* Postal Code */}
                      <input
                        type="text"
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                        value={address.zipCode || ''}
                        onChange={(e) => {
                          const newHistory = [...addressHistoryValue];
                          const formatted = formatPostalCode(e.target.value, address.country);
                          newHistory[index] = { ...address, zipCode: formatted };
                          updateField(field.id, newHistory);
                        }}
                        placeholder={(() => {
                          const countryFormat = addressFormats[address.country] || addressFormats['United States'];
                          return countryFormat.postalPlaceholder;
                        })()}
                      />
                    </>
                  )}
                </div>
              </div>
            ))}
            
            {/* Add Address Button - only show if history is incomplete */}
{!hasCompleteCoverage && (
  <button
    type="button"
    onClick={() => {
      const newAddress = {
        dateFrom: '',
        dateTo: addressHistoryValue.length === 0 ? moveInDate : (addressHistoryValue[addressHistoryValue.length - 1]?.dateFrom || ''),
        country: '',
        street: '',
        city: '',
        state: '',
        zipCode: ''
      };
      updateField(field.id, [...addressHistoryValue, newAddress]);
    }}
    className="w-full p-3 border-2 border-dashed border-blue-300 rounded-lg text-blue-600 hover:border-blue-400 hover:text-blue-800 transition-colors bg-blue-50 hover:bg-blue-100"
  >
    + Add Previous Address
  </button>
)}
            
            {/* Coverage Status Messages */}
            {!hasCompleteCoverage && addressHistoryValue.length > 0 && (
              <div className="text-sm text-orange-600 bg-orange-50 border border-orange-200 rounded p-3">
                <p className="font-medium">⚠️ Address History Incomplete</p>
                {coverageGap && (
                  <p>You need approximately {coverageGap} more months of address history to reach the 5-year requirement.</p>
                )}
                <p className="text-xs mt-1">Your oldest address must start on or before {fiveYearsAgoString}.</p>
              </div>
            )}
            
            {hasCompleteCoverage && (
              <div className="text-sm text-green-600 bg-green-50 border border-green-200 rounded p-3">
                <p className="font-medium">✅ 5-Year Address History Complete</p>
                <p>Your address history covers the full required period.</p>
              </div>
            )}
            
            {addressHistoryValue.length === 0 && (
              <p className="text-sm text-gray-500 italic text-center py-4">
                Click "Add Previous Address" to start adding your address history.
              </p>
            )}
          </div>
        );

      case 'height-converter':
        const heightConverterValue = currentData[field.id] || {};
        const { feet: heightFeet = '', inches: heightInches = '', unit: heightUnit = 'ft', cm: heightCm = '' } = heightConverterValue;

        const convertHeight = (inputValue, fromUnit) => {
          if (fromUnit === 'cm') {
            const totalCm = parseFloat(inputValue) || 0;
            const totalInches = totalCm / 2.54;
            const ft = Math.floor(totalInches / 12);
            const inch = Math.round(totalInches % 12);
            return { feet: ft.toString(), inches: inch.toString() };
          } else {
            const totalInches = (parseInt(heightFeet) || 0) * 12 + (parseInt(heightInches) || 0);
            const convertedCm = Math.round(totalInches * 2.54);
            return { cm: convertedCm.toString() };
          }
        };

        return (
          <div className="space-y-2">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-sm text-gray-600">Unit:</span>
              <button
                type="button"
                onClick={() => {
                  if (heightUnit === 'cm' && heightCm) {
                    const converted = convertHeight(heightCm, 'cm');
                    updateField(field.id, { ...converted, unit: 'ft', cm: '' });
                  } else {
                    updateField(field.id, { ...heightConverterValue, unit: 'ft' });
                  }
                }}
                className={`px-3 py-1 rounded text-xs ${heightUnit === 'ft'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
              >
                ft/in
              </button>
              <button
                type="button"
                onClick={() => {
                  if (heightUnit === 'ft' && (heightFeet || heightInches)) {
                    const converted = convertHeight('', 'ft');
                    updateField(field.id, { ...converted, unit: 'cm', feet: '', inches: '' });
                  } else {
                    updateField(field.id, { ...heightConverterValue, unit: 'cm' });
                  }
                }}
                className={`px-3 py-1 rounded text-xs ${heightUnit === 'cm'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
              >
                cm
              </button>
            </div>

            {heightUnit === 'ft' ? (
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  className="w-20 p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  value={heightFeet}
                  onChange={(e) => updateField(field.id, { ...heightConverterValue, feet: e.target.value })}
                  min="0"
                  max="8"
                  placeholder="5"
                />
                <span className="text-gray-500">ft</span>
                <input
                  type="number"
                  className="w-20 p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  value={heightInches}
                  onChange={(e) => updateField(field.id, { ...heightConverterValue, inches: e.target.value })}
                  min="0"
                  max="11"
                  placeholder="10"
                />
                <span className="text-gray-500">in</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  value={heightCm}
                  onChange={(e) => updateField(field.id, { ...heightConverterValue, cm: e.target.value })}
                  min="0"
                  step="0.1"
                  placeholder="175"
                />
                <span className="text-gray-500 font-medium">cm</span>
              </div>
            )}

            {((heightUnit === 'ft' && (heightFeet || heightInches)) || (heightUnit === 'cm' && heightCm)) && (
              <div className="text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded p-2">
                {heightUnit === 'cm'
                  ? `≈ ${convertHeight(heightCm, 'cm').feet}' ${convertHeight(heightCm, 'cm').inches}" (will be submitted to forms)`
                  : `≈ ${convertHeight('', 'ft').cm} cm`
                }
              </div>
            )}
          </div>
        );

      case 'weight':
        const weightValue = currentData[field.id] || {};
        const { pounds: weightPounds = '', unit: weightUnit = 'lbs' } = weightValue;

        const convertWeight = (inputValue, fromUnit) => {
          const numValue = parseFloat(inputValue) || 0;
          if (fromUnit === 'kg') {
            return Math.round(numValue * 2.20462);
          } else {
            return Math.round(numValue / 2.20462);
          }
        };

        return (
          <div className="space-y-2">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-sm text-gray-600">Unit:</span>
              <button
                type="button"
                onClick={() => {
                  const newUnit = weightUnit === 'lbs' ? 'kg' : 'lbs';
                  const currentValue = parseFloat(weightPounds) || 0;
                  const convertedValue = currentValue > 0 ? convertWeight(currentValue, weightUnit) : '';
                  updateField(field.id, { pounds: convertedValue.toString(), unit: newUnit });
                }}
                className={`px-3 py-1 rounded text-xs ${weightUnit === 'lbs'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
              >
                lbs
              </button>
              <button
                type="button"
                onClick={() => {
                  const newUnit = weightUnit === 'kg' ? 'lbs' : 'kg';
                  const currentValue = parseFloat(weightPounds) || 0;
                  const convertedValue = currentValue > 0 ? convertWeight(currentValue, weightUnit) : '';
                  updateField(field.id, { pounds: convertedValue.toString(), unit: newUnit });
                }}
                className={`px-3 py-1 rounded text-xs ${weightUnit === 'kg'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
              >
                kg
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="number"
                className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500"
                value={weightPounds}
                onChange={(e) => updateField(field.id, { ...weightValue, pounds: e.target.value })}
                min="0"
                step={weightUnit === 'kg' ? '0.1' : '1'}
                placeholder={weightUnit === 'kg' ? '70.5' : '155'}
              />
              <span className="text-gray-500 font-medium">{weightUnit}</span>
            </div>

            {weightPounds && (
              <div className="text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded p-2">
                {weightUnit === 'kg'
                  ? `≈ ${convertWeight(weightPounds, 'kg')} lbs (will be submitted to forms)`
                  : `≈ ${convertWeight(weightPounds, 'lbs')} kg`
                }
              </div>
            )}
          </div>
        );

      case 'cert-number':
        return (
          <div className="space-y-2">
            <input
              type="text"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              value={value}
              onChange={(e) => updateField(field.id, e.target.value)}
              placeholder="Enter certificate number"
            />
            <div className="text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded p-2">
              <p><strong>Where to find this:</strong></p>
              <p>• <strong>Certificate of Naturalization:</strong> Usually starts with letters (like "C" or "A") followed by numbers</p>
              <p>• <strong>Certificate of Citizenship:</strong> Format varies, may be all numbers or letter-number combination</p>
              <p>• Look for "Certificate Number" or "Number" on your certificate document</p>
            </div>
          </div>
        );

case 'citizenship-method':
  return (
    <div className="space-y-2">
      <select
        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
        value={value}
        onChange={(e) => updateField(field.id, e.target.value)}
      >
        <option value="">Select...</option>
        <option value="Birth in the United States">Birth in the United States</option>
        <option value="Naturalization">Naturalization</option>
        <option value="U.S. citizen parents">U.S. citizen parents</option>
      </select>
      
      <div className="text-xs text-gray-600 bg-blue-50 border border-blue-200 rounded p-2">
        <p className="font-medium mb-1">📝 Quick Guide:</p>
        <ul className="space-y-1 ml-2">
          <li><strong>Birth in the United States:</strong> You were born on U.S. soil</li>
          <li><strong>Naturalization:</strong> You personally applied for citizenship (Form N-400) and took the oath</li>
          <li><strong>U.S. citizen parents:</strong> You became a citizen through your parents. This means that either of the following applies:
  <ul className="ml-4 mt-1 text-xs">
    <li>• Born abroad to U.S. citizen parents, OR</li>
    <li>• Automatically became a citizen when your parents naturalized (and you were under 18)</li>
  </ul>
</li>
        </ul>
      </div>
    </div>
  );

      case 'cert-question':
        return (
          <div className="space-y-3">
            <select
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              value={value}
              onChange={(e) => updateField(field.id, e.target.value)}
            >
              <option value="">Select...</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="text-sm text-blue-800 space-y-2">
                <p><strong>📝 What this means:</strong></p>
                <ul className="list-disc ml-4 space-y-1">
                  <li><strong>"In your own name"</strong> means certificates issued directly to you (not through parents as a minor)</li>
                  <li><strong>Certificate of Naturalization:</strong> Given when you become a citizen through naturalization process</li>
                  <li><strong>Certificate of Citizenship:</strong> Can be obtained by those who became citizens through birth abroad to US parents, or other qualifying circumstances</li>
                </ul>

                <div className="mt-3 p-2 bg-green-100 border border-green-200 rounded">
                  <p className="font-medium text-green-800">✅ It's okay if you don't have these certificates!</p>
                  <p className="text-green-700 text-xs mt-1">Many US-born citizens do not have them. You can prove citizenship with your birth certificate, US passport, or other documents.</p>
                </div>

                <p className="text-xs mt-2"><strong>Note:</strong> If you answer "No", you'll need to provide other evidence of US citizenship with your application (like birth certificate or passport).</p>
              </div>
            </div>
          </div>
        );

      case 'birth-location':
        const birthLocationValue = currentData[field.id] || {};
        const { city: birthLocationCity = '', state: birthLocationState = '', country: birthLocationCountry = '' } = birthLocationValue;
        const isBirthLocationTouched = touchedFields && touchedFields[field.id];
        const showCityError = isBirthLocationTouched && field.required && birthLocationCountry && !birthLocationCity;
const countryFormat = addressFormats[birthLocationCountry] || { stateRequired: false };
const showStateError = isBirthLocationTouched && countryFormat.stateRequired && birthLocationCountry && !birthLocationState;
const showCountryError = isBirthLocationTouched && field.required && !birthLocationCountry;

return (
  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
    <h4 className="text-sm font-semibold text-gray-700 mb-3 border-b border-gray-300 pb-2">
      📍 Place of Birth Information
    </h4>
    <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country <span className="text-red-500">*</span>
              </label>
              <select
  className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 ${
    showCountryError ? 'border-red-500' : ''
  }`}
  value={birthLocationCountry}
  onFocus={() => {
    setTouchedFields(prev => ({ ...prev, [field.id]: false }));
  }}
  onBlur={() => {
    setTouchedFields(prev => ({ ...prev, [field.id]: true }));
  }}
  onChange={(e) => {
    updateField(field.id, { ...birthLocationValue, country: e.target.value, state: '' });
  }}
>
  <option value="">Select country...</option>
  {phoneCountries.map(c => (
    <option key={c.code} value={c.name}>
      {c.flag} {c.name}
    </option>
  ))}
</select>
  {showCountryError && (
  <div className="mt-1 text-sm text-red-600">
    ⚠️ Please select a country
  </div>
)}
            </div>

            {birthLocationCountry && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City/Town/Village <span className="text-red-500">*</span>
                  </label>
                  <input
  type="text"
  className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 ${
    showCityError ? 'border-red-500' : ''
  }`}
  value={birthLocationCity}
  onFocus={() => {
    setTouchedFields(prev => ({ ...prev, [field.id]: false }));
  }}
  onBlur={() => {
    setTouchedFields(prev => ({ ...prev, [field.id]: true }));
  }}
  onChange={(e) => updateField(field.id, { ...birthLocationValue, city: e.target.value })}
  placeholder="Enter city/town/village"
/>
{showCityError && (
  <div className="mt-1 text-sm text-red-600">
    ⚠️ City/Town/Village is required
  </div>
)}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {(() => {
  const countryFormat = addressFormats[birthLocationCountry] || { stateLabel: 'State/Province' };
  return (
    <>
      {countryFormat.stateLabel} {countryFormat.stateRequired && <span className="text-red-500">*</span>}
    </>
  );
})()}
                  </label>
{(() => {
  const countryFormat = addressFormats[birthLocationCountry] || { stateRequired: false, stateLabel: 'State' };
  
  if (birthLocationCountry === 'United States' || birthLocationCountry === 'Canada' || birthLocationCountry === 'Australia' || birthLocationCountry === 'Germany') {
    return (
      <select
        className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 ${
          showStateError ? 'border-red-500' : ''
        }`}
        value={birthLocationState}
        onFocus={() => {
          setTouchedFields(prev => ({ ...prev, [field.id]: false }));
        }}
        onBlur={() => {
          setTouchedFields(prev => ({ ...prev, [field.id]: true }));
        }}
        onChange={(e) => updateField(field.id, { ...birthLocationValue, state: e.target.value })}
      >
        <option value="">Select state...</option>
        {countryFormat.states && countryFormat.states.map(stateOption => (
          <option key={stateOption} value={stateOption}>{stateOption}</option>
        ))}
      </select>
    );
  } else {
    return (
      <input
        type="text"
        className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 ${
          showStateError ? 'border-red-500' : ''
        }`}
        value={birthLocationState}
        onFocus={() => {
          setTouchedFields(prev => ({ ...prev, [field.id]: false }));
        }}
        onBlur={() => {
          setTouchedFields(prev => ({ ...prev, [field.id]: true }));
        }}
        onChange={(e) => updateField(field.id, { ...birthLocationValue, state: e.target.value })}
        placeholder={`Enter ${countryFormat.stateLabel ? countryFormat.stateLabel.toLowerCase() : 'state/province'}`}
      />
    );
  }
})()}
                </div>
              </>
            )}
          </div>
          {showStateError && (
  <div className="mt-1 text-sm text-red-600">
    ⚠️ State is required
  </div>
)}
      </div>
    );

      case 'other-names':
        const otherNamesValue = currentData[field.id] || [];

        return (
          <div className="space-y-3">
            {otherNamesValue.map((nameEntry, index) => (
              <div key={index} className="border border-gray-200 rounded p-3 bg-gray-50">
                <div className="grid grid-cols-3 gap-2 mb-2">
                  <input
                    type="text"
                    className="p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    value={nameEntry.lastName || ''}
                    onChange={(e) => {
                      const newNames = [...otherNamesValue];
                      newNames[index] = { ...newNames[index], lastName: e.target.value };
                      updateField(field.id, newNames);
                    }}
                    placeholder="Last Name"
                  />
                  <input
                    type="text"
                    className="p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    value={nameEntry.firstName || ''}
                    onChange={(e) => {
                      const newNames = [...otherNamesValue];
                      newNames[index] = { ...newNames[index], firstName: e.target.value };
                      updateField(field.id, newNames);
                    }}
                    placeholder="First Name"
                  />
                  <input
                    type="text"
                    className="p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    value={nameEntry.middleName || ''}
                    onChange={(e) => {
                      const newNames = [...otherNamesValue];
                      newNames[index] = { ...newNames[index], middleName: e.target.value };
                      updateField(field.id, newNames);
                    }}
                    placeholder="Middle Name"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newNames = otherNamesValue.filter((_, i) => i !== index);
                    updateField(field.id, newNames);
                  }}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Remove this name
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={() => {
                const newNames = [...otherNamesValue, { lastName: '', firstName: '', middleName: '' }];
                updateField(field.id, newNames);
              }}
              className="w-full p-2 border-2 border-dashed border-gray-300 rounded text-gray-600 hover:border-gray-400 hover:text-gray-800 transition-colors"
            >
              + Add another name
            </button>

            {otherNamesValue.length === 0 && (
              <p className="text-sm text-gray-500 italic">
                Click "Add another name" to add maiden names, aliases, nicknames, etc.
              </p>
            )}
          </div>
        );

case 'address-with-careof':
  const mailingAddrValue = currentData[field.id] || {};
  const { 
    street: mailingStreet = '', 
    city: mailingCity = '', 
    state: mailingState = '', 
    zipCode: mailingZipCode = '', 
    country: mailingCountry = '',
    inCareOf: mailingInCareOf = ''
  } = mailingAddrValue;
  const mailingCountryFormat = addressFormats[mailingCountry] || addressFormats['United States'];

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Country <span className="text-red-500">*</span>
        </label>
        <select
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          value={mailingCountry}
          onChange={(e) => {
            updateField(field.id, { ...mailingAddrValue, country: e.target.value, state: '', zipCode: '' });
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

      {mailingCountry && (
        <>
          {/* In Care Of Name field */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              <span className="inline-flex items-center">
                In Care Of Name (if applicable)
                <button
                  type="button"
                  onClick={() => setShowInfoPanel(!showInfoPanel)}
                  className="ml-2 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2 py-0.5 rounded border border-blue-300 transition-colors"
                >
                  What's this?
                </button>
              </span>
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              value={mailingInCareOf}
              onChange={(e) => updateField(field.id, { ...mailingAddrValue, inCareOf: e.target.value })}
              placeholder="e.g., John Smith or ABC Company"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Street Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              value={mailingStreet}
              onChange={(e) => updateField(field.id, { ...mailingAddrValue, street: e.target.value })}
              placeholder="Street Number and Name"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="p-2 border rounded focus:ring-2 focus:ring-blue-500 w-full"
                value={mailingCity}
                onChange={(e) => updateField(field.id, { ...mailingAddrValue, city: e.target.value })}
                placeholder="City"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                {mailingCountryFormat.stateLabel || 'State'} 
                {mailingCountryFormat.stateRequired && <span className="text-red-500 ml-1">*</span>}
              </label>
              {mailingCountryFormat.states ? (
                <select
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  value={mailingState}
                  onChange={(e) => updateField(field.id, { ...mailingAddrValue, state: e.target.value })}
                >
                  <option value="">Select {mailingCountryFormat.stateLabel.toLowerCase()}...</option>
                  {mailingCountryFormat.states.map(stateOption => (
                    <option key={stateOption} value={stateOption}>{stateOption}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 ${
                    !mailingCountryFormat.stateRequired && mailingCountry !== 'United States' && mailingCountry !== 'Canada' ? 'bg-gray-50' : ''
                  }`}
                  value={mailingState}
                  onChange={(e) => updateField(field.id, { ...mailingAddrValue, state: e.target.value })}
                  placeholder={mailingCountryFormat.stateLabel}
                  disabled={!mailingCountryFormat.stateRequired && mailingCountry !== 'United States' && mailingCountry !== 'Canada'}
                />
              )}
            </div>
          </div>

          <div className="relative">
            <input
              type="text"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              value={mailingZipCode}
              onChange={(e) => {
                const formatted = formatPostalCode(e.target.value, mailingCountry);
                updateField(field.id, { ...mailingAddrValue, zipCode: formatted });
              }}
              placeholder={mailingCountryFormat.postalPlaceholder}
            />
            <label className="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-600">
              {mailingCountryFormat.postalLabel} <span className="text-red-500">*</span>
            </label>
          </div>

          {mailingZipCode && !mailingCountryFormat.postalFormat.test(mailingZipCode) && (
            <div className="text-sm text-orange-600 flex items-center">
              <span>Please enter a valid {mailingCountryFormat.postalLabel.toLowerCase()} for {mailingCountry}</span>
            </div>
          )}
        </>
      )}
    </div>
  );

case 'address':
        const mainAddressValue = currentData[field.id] || {};
        const { street: mainStreet = '', city: mainCity = '', state: mainState = '', zipCode: mainZipCode = '', country: mainCountry = '', inCareOf: mainInCareOf = '' } = mainAddressValue;
        const mainCountryFormat = addressFormats[mainCountry] || addressFormats['United States'];
        
        // Check if this is a required mailing address
        const isRequiredMailingAddress = field.id === 'sponsorMailingAddress' && field.required;

        return (
          <div className="space-y-3">
            <div>
              {isRequiredMailingAddress && (
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Country <span className="text-red-500">*</span>
                </label>
              )}
              <select
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                value={mainCountry}
                onChange={(e) => {
                  updateField(field.id, { ...mainAddressValue, country: e.target.value, state: '', zipCode: '' });
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

            {mainCountry && (
              <>
                {/* In Care Of Name field for mailing address */}
                {isRequiredMailingAddress && (
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      <span className="inline-flex items-center">
                        In Care Of Name (if applicable)
                        <button
                          type="button"
                          onClick={() => setShowInfoPanel(!showInfoPanel)}
                          className="ml-2 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2 py-0.5 rounded border border-blue-300 transition-colors"
                        >
                          What's this?
                        </button>
                      </span>
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                      value={mainInCareOf}
                      onChange={(e) => updateField(field.id, { ...mainAddressValue, inCareOf: e.target.value })}
                      placeholder="e.g., John Smith or ABC Company"
                    />
                  </div>
                )}

                <div>
                  {isRequiredMailingAddress && (
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Street Address <span className="text-red-500">*</span>
                    </label>
                  )}
                  <input
                    type="text"
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    value={mainStreet}
                    onChange={(e) => updateField(field.id, { ...mainAddressValue, street: e.target.value })}
                    placeholder="Street Number and Name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    {isRequiredMailingAddress && (
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        City <span className="text-red-500">*</span>
                      </label>
                    )}
                    <input
                      type="text"
                      className="p-2 border rounded focus:ring-2 focus:ring-blue-500 w-full"
                      value={mainCity}
                      onChange={(e) => updateField(field.id, { ...mainAddressValue, city: e.target.value })}
                      placeholder="City"
                    />
                  </div>
                  <div>
                    {isRequiredMailingAddress && (
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        {mainCountryFormat.stateLabel || 'State'} <span className="text-red-500">*</span>
                      </label>
                    )}
                    {mainCountryFormat.states ? (
                      <select
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                        value={mainState}
                        onChange={(e) => updateField(field.id, { ...mainAddressValue, state: e.target.value })}
                      >
                        <option value="">Select {mainCountryFormat.stateLabel.toLowerCase()}...</option>
                        {mainCountryFormat.states.map(stateOption => (
                          <option key={stateOption} value={stateOption}>{stateOption}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 ${
                          !mainCountryFormat.stateRequired && mainCountry !== 'United States' && mainCountry !== 'Canada' ? 'bg-gray-50' : ''
                        }`}
                        value={mainState}
                        onChange={(e) => updateField(field.id, { ...mainAddressValue, state: e.target.value })}
                        placeholder={mainCountryFormat.stateLabel}
                        disabled={!mainCountryFormat.stateRequired && mainCountry !== 'United States' && mainCountry !== 'Canada'}
                      />
                    )}
                  </div>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    value={mainZipCode}
                    onChange={(e) => {
                      const formatted = formatPostalCode(e.target.value, mainCountry);
                      updateField(field.id, { ...mainAddressValue, zipCode: formatted });
                    }}
                    placeholder={mainCountryFormat.postalPlaceholder}
                  />
                  <label className="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-600">
                    {mainCountryFormat.postalLabel} <span className="text-red-500">*</span>
                  </label>
                </div>

                {mainZipCode && !mainCountryFormat.postalFormat.test(mainZipCode) && (
                  <div className="text-sm text-orange-600 flex items-center">
                    <span>Please enter a valid {mainCountryFormat.postalLabel.toLowerCase()} for {mainCountry}</span>
                  </div>
                )}
              </>
            )}
          </div>
        );

case 'checkbox':
  return (
    <div className="flex items-start space-x-2">
      <input
        type="checkbox"
        id={field.id}
        className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        checked={value || false}
        onChange={(e) => updateField(field.id, e.target.checked)}
      />
      <label htmlFor={field.id} className="text-sm text-gray-700">
        {field.label}
      </label>
    </div>
  );

      case 'multi-select':
        const multiSelectValue = currentData[field.id] || [];

        return (
          <div className="space-y-2">
            {field.options.map(option => (
              <label key={option} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  checked={multiSelectValue.includes(option)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      updateField(field.id, [...multiSelectValue, option]);
                    } else {
                      updateField(field.id, multiSelectValue.filter(v => v !== option));
                    }
                  }}
                />
                <span className="text-sm text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );

case 'date':
  const isDateFieldTouched = touchedFields && touchedFields[field.id];
  const showDateError = isDateFieldTouched && field.required && (!value || value === '');
  
  return (
    <div>
      <input
        type="date"
        className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 ${
          showDateError ? 'border-red-500' : ''
        }`}
        value={value}
        onFocus={() => {
          setTouchedFields(prev => ({ ...prev, [field.id]: false }));
        }}
        onBlur={() => {
          setTouchedFields(prev => ({ ...prev, [field.id]: true }));
        }}
        onChange={(e) => updateField(field.id, e.target.value)}
      />
      {showDateError && (
        <div className="mt-1 text-sm text-red-600">
          ⚠️ Please select a date
        </div>
      )}
    </div>
  );

      case 'textarea':
        return (
          <textarea
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            rows="3"
            value={value}
            onChange={(e) => updateField(field.id, e.target.value)}
          />
        );

case 'ssn':
  // Remove the test line if you added it
  const ssnDigits = (value || '').replace(/\D/g, '');
  const isSSNFieldTouched = touchedFields && touchedFields[field.id];
  const showSSNError = isSSNFieldTouched && field.required && ssnDigits.length > 0 && ssnDigits.length < 9;
  
  return (
    <div>
      <input
        type="text"
        className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 ${
          showSSNError ? 'border-red-500' : ''
        }`}
        value={value}
        onFocus={() => {
          setTouchedFields(prev => ({ ...prev, [field.id]: false }));
        }}
        onBlur={() => {
          setTouchedFields(prev => ({ ...prev, [field.id]: true }));
        }}
        onChange={(e) => {
          let digits = e.target.value.replace(/\D/g, '');
          digits = digits.slice(0, 9);
          
          let formatted = '';
          if (digits.length > 0) {
            formatted = digits.slice(0, 3);
            if (digits.length > 3) {
              formatted += '-' + digits.slice(3, 5);
            }
            if (digits.length > 5) {
              formatted += '-' + digits.slice(5, 9);
            }
          }
          
          updateField(field.id, formatted);
        }}
        placeholder="XXX-XX-XXXX"
        maxLength="11"
      />
      {showSSNError && (
        <div className="mt-1 text-sm text-red-600">
          ⚠️ Please enter all 9 digits
        </div>
      )}
    </div>
  );

case 'international-phone':
  const intlPhoneValue = currentData[field.id] || {};
  const selectedPhoneCountry = intlPhoneValue.country || 'US';
  const phoneNumberValue = intlPhoneValue.number || '';
  
  // Check if field is touched for this specific phone field
  const isPhoneFieldTouched = touchedFields && touchedFields[field.id];
  const phoneDigits = phoneNumberValue.replace(/\D/g, '').length;
const minDigits = selectedPhoneCountry === 'US' || selectedPhoneCountry === 'CA' ? 10 : 7;
const showPhoneError = isPhoneFieldTouched && field.required && phoneNumberValue && phoneDigits < minDigits;

  return (
    <div className="space-y-2">
      <select
        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
        value={selectedPhoneCountry}
        onChange={(e) => {
          updateField(field.id, { ...intlPhoneValue, country: e.target.value, number: '' });
        }}
      >
        {phoneCountries.map(country => (
          <option key={country.code} value={country.code}>
            {country.flag} {country.name} ({country.dialCode})
          </option>
        ))}
      </select>
      <div className="flex">
        <span className="inline-flex items-center px-3 py-2 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm rounded-l">
          {phoneCountries.find(c => c.code === selectedPhoneCountry)?.dialCode}
        </span>
        <input
          type="tel"
          className={`flex-1 p-2 border rounded-r focus:ring-2 focus:ring-blue-500 ${
            showPhoneError ? 'border-red-500' : 'border-gray-300'
          }`}
          value={phoneNumberValue}
          onFocus={() => {
            setTouchedFields(prev => ({ ...prev, [field.id]: false }));
          }}
          onBlur={() => {
            setTouchedFields(prev => ({ ...prev, [field.id]: true }));
          }}
          onChange={(e) => {
            const formatted = formatPhoneByCountry(e.target.value, selectedPhoneCountry);
            updateField(field.id, { ...intlPhoneValue, number: formatted });
          }}
          placeholder={phoneCountries.find(c => c.code === selectedPhoneCountry)?.format.replace(/X/g, '0')}
        />
      </div>
      {showPhoneError && (
        <div className="text-sm text-red-600">
          ⚠️ Please enter a valid phone number
        </div>
      )}
    </div>
  );

      case 'smart-email':
        const smartEmailValue = currentData[field.id] || {};
        const emailValidationResult = validateEmail(smartEmailValue);
        const { localPart: emailLocalPart = '', domain: emailDomain = '', customDomain: emailCustomDomain = '' } = smartEmailValue;

        const popularEmailDomains = [
          { value: 'gmail.com', label: 'Gmail (gmail.com)' },
          { value: 'outlook.com', label: 'Outlook (outlook.com)' },
          { value: 'yahoo.com', label: 'Yahoo (yahoo.com)' },
          { value: 'hotmail.com', label: 'Hotmail (hotmail.com)' },
          { value: 'icloud.com', label: 'iCloud (icloud.com)' },
          { value: 'other', label: 'Other...' }
        ];

        const isEmailFieldTouched = touchedFields && touchedFields[field.id];
const showEmailError = isEmailFieldTouched && (emailLocalPart || emailDomain || emailCustomDomain) && !emailValidationResult.isValid;

        return (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                className="flex-1 p-2 border rounded-l focus:ring-2 focus:ring-blue-500"
                value={emailLocalPart}
                onFocus={() => {
  setTouchedFields(prev => ({ ...prev, [field.id]: false }));
}}
onBlur={() => {
  setTouchedFields(prev => ({ ...prev, [field.id]: true }));
}}
                onChange={(e) => {
                  const cleanValue = e.target.value.replace(/[^a-zA-Z0-9._-]/g, '');
                  const newValue = { ...smartEmailValue, localPart: cleanValue };
                  updateField(field.id, newValue);
                }}
                placeholder="yourname"
              />
              <span className="px-2 py-2 bg-gray-100 border-t border-b border-gray-300 text-gray-700 font-medium">
                @
              </span>
              <select
                className="flex-1 p-2 border rounded-r focus:ring-2 focus:ring-blue-500 min-w-0"
                value={emailDomain}
                onFocus={() => {
  setTouchedFields(prev => ({ ...prev, [field.id]: false }));
}}
onBlur={() => {
  setTouchedFields(prev => ({ ...prev, [field.id]: true }));
}}
                onChange={(e) => {
                  const newValue = { ...smartEmailValue, domain: e.target.value };
                  if (e.target.value !== 'other') {
                    newValue.customDomain = '';
                  }
                  updateField(field.id, newValue);
                }}
              >
                <option value="">Select provider...</option>
                {popularEmailDomains.map(provider => (
                  <option key={provider.value} value={provider.value}>
                    {provider.label}
                  </option>
                ))}
              </select>
            </div>

            {emailDomain === 'other' && (
              <input
                type="text"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                value={emailCustomDomain}
                onFocus={() => {
  setTouchedFields(prev => ({ ...prev, [field.id]: false }));
}}
onBlur={() => {
  setTouchedFields(prev => ({ ...prev, [field.id]: true }));
}}
                onChange={(e) => {
                  const cleanValue = e.target.value.replace(/[^a-zA-Z0-9.-]/g, '');
                  const newValue = { ...smartEmailValue, customDomain: cleanValue };
                  updateField(field.id, newValue);
                }}
                placeholder="company.com or school.edu"
              />
            )}

            {showEmailError && emailValidationResult.message && (
              <div className="text-sm flex items-center text-orange-600">
                <span className="mr-1">{emailValidationResult.message}</span>
              </div>
            )}
          </div>
        );

      case 'country':
        return (
          <select
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            value={value}
            onChange={(e) => updateField(field.id, e.target.value)}
          >
            <option value="">Select country...</option>
            {phoneCountries.map(country => (
              <option key={country.code} value={country.name}>
                {country.flag} {country.name}
              </option>
            ))}
          </select>
        );

      case 'number':
        return (
          <input
            type="number"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            value={value}
            onChange={(e) => updateField(field.id, e.target.value)}
            min="0"
          />
        );

      case 'dynamic-employment-duration':
        const empStatusForDuration = currentData['sponsorEmploymentStatus'] || '';

        if (!empStatusForDuration) {
          return null;
        }

        if (empStatusForDuration === 'Unemployed or Not Employed' || empStatusForDuration === 'Retired') {
          const statusWord = empStatusForDuration === 'Retired' ? 'retired' : 'unemployed';
          return (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Have you been {statusWord} for 5 years or more?
              </label>
              <select
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                value={value}
                onChange={(e) => updateField(field.id, e.target.value)}
              >
                <option value="">Select...</option>
                <option value="yes-5-plus-years">Yes, 5+ years</option>
                <option value="no-less-than-5-years">No, less than 5 years</option>
              </select>
            </div>
          );
        }

        if (empStatusForDuration.includes('Employed') || empStatusForDuration === 'Self-Employed') {
          return (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                How long have you been in your current employment?
              </label>
              <select
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                value={value}
                onChange={(e) => updateField(field.id, e.target.value)}
              >
                <option value="">Select duration...</option>
                <option value="less-than-1-year">Less than 1 year</option>
                <option value="1-2-years">1-2 years</option>
                <option value="2-3-years">2-3 years</option>
                <option value="3-4-years">3-4 years</option>
                <option value="4-5-years">4-5 years</option>
                <option value="5-plus-years">5+ years</option>
              </select>
            </div>
          );
        }

        return (
          <div className="text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded p-3">
            <p>Please provide more details about your employment situation in the employment history section below.</p>
          </div>
        );

      case 'employment-duration':
        // Keep this for backwards compatibility but it won't be used
        return null;

      case 'conditional-employment-history':
        const historyEmpStatus = currentData['sponsorEmploymentStatus'] || '';
        const historyEmpDuration = currentData['sponsorEmploymentDuration'] || '';

        if (!historyEmpStatus) {
          return null;
        }

        let needsEmploymentHistory = false;

        // For unemployed/retired: need history if NOT been that way for 5+ years
        if (historyEmpStatus === 'Unemployed or Not Employed' || historyEmpStatus === 'Retired') {
          needsEmploymentHistory = historyEmpDuration === 'no-less-than-5-years';
        }
        // For employed: need history if NOT been in current job for 5+ years
        else if (historyEmpStatus.includes('Employed') || historyEmpStatus === 'Self-Employed') {
          needsEmploymentHistory = historyEmpDuration && historyEmpDuration !== '5-plus-years';
        }
        // For "Other": always need history
        else {
          needsEmploymentHistory = true;
        }

        if (!needsEmploymentHistory) {
          if (historyEmpDuration === '5-plus-years' || historyEmpDuration === 'yes-5-plus-years') {
            const message = historyEmpDuration === 'yes-5-plus-years'
              ? `Since you've been ${historyEmpStatus.toLowerCase()} for 5+ years, the employment history requirement is satisfied.`
              : `Since you've been in your current employment for 5+ years, the employment history requirement is satisfied.`;

            return (
              <div className="text-sm text-green-600 bg-green-50 border border-green-200 rounded p-3">
                <p className="font-medium">✅ No Employment History Needed</p>
                <p>{message}</p>
              </div>
            );
          }

          if (!historyEmpDuration) {
            const message = (historyEmpStatus === 'Unemployed or Not Employed' || historyEmpStatus === 'Retired')
              ? `Please first indicate how long you've been ${historyEmpStatus.toLowerCase()}.`
              : 'Please first indicate how long you\'ve been in your current employment.';

            return (
              <div className="text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded p-3">
                <p>{message}</p>
              </div>
            );
          }

          if (!historyEmpDuration) {
            return (
              <div className="text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded p-3">
                <p>Please first indicate how long you've been in your current employment.</p>
              </div>
            );
          }

          return null;
        }

        const employmentHistoryValue = currentData[field.id] || [];

        return (
          <div className="space-y-4">
            <div className="text-sm text-gray-600 bg-blue-50 border border-blue-200 rounded p-3">
              <p className="font-medium text-blue-800 mb-1">💼 Employment History Requirements</p>
              <p>Provide your previous employment details to complete the <strong>5-year history requirement</strong>.</p>
            </div>

            {employmentHistoryValue.map((job, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-800">Previous Job #{index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => {
                      const newHistory = employmentHistoryValue.filter((_, i) => i !== index);
                      updateField(field.id, newHistory);
                    }}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Start Date</label>
                      <input
                        type="date"
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                        value={job.dateFrom || ''}
                        onChange={(e) => {
                          const newHistory = [...employmentHistoryValue];
                          newHistory[index] = { ...newHistory[index], dateFrom: e.target.value };
                          updateField(field.id, newHistory);
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">End Date</label>
                      <input
                        type="date"
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                        value={job.dateTo || ''}
                        onChange={(e) => {
                          const newHistory = [...employmentHistoryValue];
                          newHistory[index] = { ...newHistory[index], dateTo: e.target.value };
                          updateField(field.id, newHistory);
                        }}
                      />
                    </div>
                  </div>

                  <input
                    type="text"
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    value={job.employer || ''}
                    onChange={(e) => {
                      const newHistory = [...employmentHistoryValue];
                      newHistory[index] = { ...newHistory[index], employer: e.target.value };
                      updateField(field.id, newHistory);
                    }}
                    placeholder="Employer Name"
                  />

                  <input
                    type="text"
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    value={job.occupation || ''}
                    onChange={(e) => {
                      const newHistory = [...employmentHistoryValue];
                      newHistory[index] = { ...newHistory[index], occupation: e.target.value };
                      updateField(field.id, newHistory);
                    }}
                    placeholder="Job Title/Occupation"
                  />

                  <textarea
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    rows="2"
                    value={job.address || ''}
                    onChange={(e) => {
                      const newHistory = [...employmentHistoryValue];
                      newHistory[index] = { ...newHistory[index], address: e.target.value };
                      updateField(field.id, newHistory);
                    }}
                    placeholder="Employer Address"
                  />
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => {
                const newHistory = [...employmentHistoryValue];
                newHistory.push({
                  dateFrom: '', dateTo: '',
                  employer: '', occupation: '', address: ''
                });
                updateField(field.id, newHistory);
              }}
              className="w-full p-3 border-2 border-dashed border-blue-300 rounded-lg text-blue-600 hover:border-blue-400 hover:text-blue-800 transition-colors bg-blue-50 hover:bg-blue-100"
            >
              + Add Previous Job
            </button>
          </div>
        );

      case 'a-number':
        const displayValue = value.replace(/^A0*/, ''); // Remove A and leading zeros for display

        return (
          <div className="space-y-2">
            <div className="flex">
              <span className="inline-flex items-center px-3 py-2 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm rounded-l font-medium">
                A
              </span>
              <input
                type="text"
                className="flex-1 p-2 border border-gray-300 rounded-r focus:ring-2 focus:ring-blue-500"
                value={displayValue}
                onChange={(e) => {
                  let val = e.target.value.replace(/\D/g, '');
                  if (val.length > 9) val = val.slice(0, 9);

                  if (val) {
                    // Pad to 9 digits for storage but don't show padding to user
                    const paddedVal = val.padStart(9, '0');
                    updateField(field.id, `A${paddedVal}`);
                  } else {
                    updateField(field.id, '');
                  }
                }}
                placeholder="12345678 (7-9 digits)"
                maxLength="9"
              />
            </div>

            {displayValue && displayValue.length >= 7 && displayValue.length <= 9 && (
              <div className="text-sm text-green-600">
                ✅ Valid A-Number format
              </div>
            )}

            {displayValue && (displayValue.length < 7 || displayValue.length > 9) && (
              <div className="text-sm text-orange-600">
                A-Number should be 7-9 digits (e.g., A12345678)
              </div>
            )}

            {displayValue && displayValue.length < 9 && displayValue.length >= 7 && (
              <div className="text-sm text-blue-600 bg-blue-50 border border-blue-200 rounded p-2">
                <p className="text-xs">💡 Your A-Number will be automatically formatted to 9 digits for official forms (A{displayValue.padStart(9, '0')})</p>
              </div>
            )}
          </div>
        );

case 'country':
        return (
          <select
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            value={value}
            onChange={(e) => updateField(field.id, e.target.value)}
          >
            <option value="">Select country...</option>
            {phoneCountries.map(country => (
              <option key={country.code} value={country.name}>
                {country.flag} {country.name}
              </option>
            ))}
          </select>
        );

      case 'currency':
        return (
          <div className="relative">
            <span className="absolute left-3 top-2 text-gray-500">$</span>
            <input
              type="number"
              className="w-full pl-8 p-2 border rounded focus:ring-2 focus:ring-blue-500"
              value={value}
              onChange={(e) => updateField(field.id, e.target.value)}
              min="0"
              step="0.01"
              placeholder="0.00"
            />
          </div>
        );

      case 'foreign-residence':
        const foreignResValue = currentData[field.id] || {};
        const showForeignRes = currentData['sponsorLivedAbroad'] === 'Yes';
        
        if (!showForeignRes) return null;
        
        return (
          <div className="space-y-3">
            <input
              type="text"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              value={foreignResValue.country || ''}
              onChange={(e) => updateField(field.id, { ...foreignResValue, country: e.target.value })}
              placeholder="Country"
            />
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">From Date</label>
                <input
                  type="date"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  value={foreignResValue.fromDate || ''}
                  onChange={(e) => updateField(field.id, { ...foreignResValue, fromDate: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">To Date</label>
                <input
                  type="date"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  value={foreignResValue.toDate || ''}
                  onChange={(e) => updateField(field.id, { ...foreignResValue, toDate: e.target.value })}
                />
              </div>
            </div>
          </div>
        );

      case 'marriage-history':
        const previousMarriagesValue = currentData['sponsorPreviousMarriages'] || '0';
        let marriageCount = parseInt(previousMarriagesValue) || 0;
        
        // Handle "5+" option - start with 5 marriages and allow adding more
        if (previousMarriagesValue === '5+') {
          marriageCount = 5;
        }
        
        const marriageHistoryValue = currentData[field.id] || [];
        
        // If user selected "5+" but has more than 5 entries, show all entries
        const actualMarriageCount = previousMarriagesValue === '5+' 
          ? Math.max(5, marriageHistoryValue.length)
          : marriageCount;
        
        if (marriageCount === 0) return null;
        
        return (
          <div className="space-y-4">
            {[...Array(actualMarriageCount)].map((_, index) => {
              const marriage = marriageHistoryValue[index] || {};
              return (
                <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium text-gray-800">Marriage #{index + 1}</h4>
                    {/* Show remove button for "5+" scenario when there are more than 5 entries, or if it's beyond the base count */}
                    {(previousMarriagesValue === '5+' && marriageHistoryValue.length > 5) && (
                      <button
                        type="button"
                        onClick={() => {
                          const newHistory = marriageHistoryValue.filter((_, i) => i !== index);
                          updateField(field.id, newHistory);
                        }}
                        className="px-2 py-1 text-red-600 hover:bg-red-50 rounded text-sm font-medium"
                        title="Remove this marriage"
                      >
                        ✕ Remove
                      </button>
                    )}
                  </div>
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="text"
                        className="p-2 border rounded focus:ring-2 focus:ring-blue-500"
                        value={marriage.spouseLastName || ''}
                        onChange={(e) => {
                          const newHistory = [...marriageHistoryValue];
                          newHistory[index] = { ...marriage, spouseLastName: e.target.value };
                          updateField(field.id, newHistory);
                        }}
                        placeholder="Spouse Last Name"
                      />
                      <input
                        type="text"
                        className="p-2 border rounded focus:ring-2 focus:ring-blue-500"
                        value={marriage.spouseFirstName || ''}
                        onChange={(e) => {
                          const newHistory = [...marriageHistoryValue];
                          newHistory[index] = { ...marriage, spouseFirstName: e.target.value };
                          updateField(field.id, newHistory);
                        }}
                        placeholder="Spouse First Name"
                      />
                      <input
                        type="text"
                        className="p-2 border rounded focus:ring-2 focus:ring-blue-500"
                        value={marriage.spouseMiddleName || ''}
                        onChange={(e) => {
                          const newHistory = [...marriageHistoryValue];
                          newHistory[index] = { ...marriage, spouseMiddleName: e.target.value };
                          updateField(field.id, newHistory);
                        }}
                        placeholder="Middle Name"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Spouse's Date of Birth</label>
                        <input
                          type="date"
                          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                          value={marriage.spouseDOB || ''}
                          onChange={(e) => {
                            const newHistory = [...marriageHistoryValue];
                            newHistory[index] = { ...marriage, spouseDOB: e.target.value };
                            updateField(field.id, newHistory);
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Spouse's Country of Birth</label>
                        <select
                          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                          value={marriage.spouseBirthCountry || ''}
                          onChange={(e) => {
                            const newHistory = [...marriageHistoryValue];
                            newHistory[index] = { ...marriage, spouseBirthCountry: e.target.value };
                            updateField(field.id, newHistory);
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
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Date of Marriage</label>
                        <input
                          type="date"
                          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                          value={marriage.marriageDate || ''}
                          onChange={(e) => {
                            const newHistory = [...marriageHistoryValue];
                            const newStartDate = e.target.value;
                            const updatedMarriage = { ...marriage, marriageDate: newStartDate };
                            
                            // If new start date is after current end date, clear the end date
                            if (marriage.marriageEndDate && newStartDate > marriage.marriageEndDate) {
                              updatedMarriage.marriageEndDate = '';
                            }
                            
                            newHistory[index] = updatedMarriage;
                            updateField(field.id, newHistory);
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Date Marriage Ended</label>
                        <input
                          type="date"
                          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                          value={marriage.marriageEndDate || ''}
                          min={marriage.marriageDate || ''}
                          onChange={(e) => {
                            // Allow all changes during typing
                            const newHistory = [...marriageHistoryValue];
                            newHistory[index] = { ...marriage, marriageEndDate: e.target.value };
                            updateField(field.id, newHistory);
                          }}
                          onBlur={(e) => {
                            // Only validate when user finishes editing (loses focus)
                            const newEndDate = e.target.value;
                            if (marriage.marriageDate && newEndDate && newEndDate < marriage.marriageDate) {
                              // Clear invalid date
                              const newHistory = [...marriageHistoryValue];
                              newHistory[index] = { ...marriage, marriageEndDate: '' };
                              updateField(field.id, newHistory);
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {/* Date overlap validation warning */}
            {(() => {
              // Check for overlapping dates across marriages
              const marriages = marriageHistoryValue.filter(m => m.marriageDate && m.marriageEndDate);
              let hasOverlap = false;
              
              for (let i = 0; i < marriages.length; i++) {
                for (let j = i + 1; j < marriages.length; j++) {
                  const marriage1Start = new Date(marriages[i].marriageDate);
                  const marriage1End = new Date(marriages[i].marriageEndDate);
                  const marriage2Start = new Date(marriages[j].marriageDate);
                  const marriage2End = new Date(marriages[j].marriageEndDate);
                  
                  // Check if dates overlap
                  if ((marriage1Start <= marriage2End && marriage1End >= marriage2Start)) {
                    hasOverlap = true;
                    break;
                  }
                }
                if (hasOverlap) break;
              }
              
              if (hasOverlap) {
                return (
                  <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <span className="text-amber-600 text-lg">⚠️</span>
                      <div>
                        <h4 className="font-medium text-amber-800 mb-2">Overlapping Marriage Dates Detected</h4>
                        <p className="text-sm text-amber-700 mb-3">
                          We noticed some of your marriage dates overlap. Having multiple marriages at the same time can significantly impact your visa approval chances and may require additional explanation to USCIS.
                        </p>
                        <p className="text-sm text-amber-700 mb-3">
                          <strong>What to do:</strong> Please double-check your dates to ensure they're accurate. If the dates are correct and you have a unique situation, we recommend contacting our support team for guidance.
                        </p>
                        <button 
                          className="text-sm bg-amber-600 text-white px-3 py-1 rounded hover:bg-amber-700 transition-colors"
                          onClick={() => {
                            // TODO: Route to support
                            console.log('TODO: Route to support for overlapping marriage dates');
                          }}
                        >
                          Contact Support Team
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }
              
              return null;
            })()}
            
            {/* Add Another Marriage button - only show if user selected "5+" */}
            {previousMarriagesValue === '5+' && (
              <div className="text-center pt-4">
                <button
                  type="button"
                  onClick={() => {
                    // Add a new empty marriage entry
                    const newHistory = [...marriageHistoryValue];
                    newHistory.push({});
                    updateField(field.id, newHistory);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  + Add Another Previous Marriage
                </button>
              </div>
            )}
          </div>
        );

case 'cert-place':
  const certPlaceValue = currentData[field.id] || {};
  const { city: certCity = '', state: certState = '' } = certPlaceValue;
  const isCertPlaceTouched = touchedFields && touchedFields[field.id];
const showCertCityError = isCertPlaceTouched && field.required && !certCity;
const showCertStateError = isCertPlaceTouched && field.required && !certState;
  
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
      <h4 className="text-sm font-semibold text-gray-700 mb-3 border-b border-gray-300 pb-2">
        📍 Place of Issuance
      </h4>
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            City <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            value={certCity}
            onChange={(e) => updateField(field.id, { ...certPlaceValue, city: e.target.value })}
            placeholder="Enter city (e.g., Los Angeles, New York)"
          />
        </div>
        
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            State <span className="text-red-500">*</span>
          </label>
          <select
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            value={certState}
            onChange={(e) => updateField(field.id, { ...certPlaceValue, state: e.target.value })}
          >
            <option value="">Select state...</option>
            {addressFormats['United States'].states.map(stateOption => (
              <option key={stateOption} value={stateOption}>{stateOption}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );

      case 'married-eligibility-check':
        const maritalStatus = currentData['sponsorMaritalStatus'] || '';
        const sponsorFirstName = currentData['sponsorFirstName'] || '[SponsorFirstName]';
        const beneficiaryFirstName = currentData['beneficiaryFirstName'] || '[BeneficiaryFirstName]';
        const sponsorSex = currentData['sponsorSex'] || '';
        const sponsorPronoun = sponsorSex === 'Male' ? 'he' : sponsorSex === 'Female' ? 'she' : 'they';
        
        const marriedTo = currentData['marriedTo'] || '';
        const spouseLocation = currentData['spouseLocation'] || '';
        const preparingWhileDivorcing = currentData['preparingWhileDivorcing'] || false;
        
        // Show initial married eligibility check
        if (maritalStatus === 'Married' && !marriedTo) {
          return (
            <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center mb-3">
                <span className="text-orange-600 text-xl mr-2">⚠️</span>
                <h3 className="text-lg font-semibold text-orange-800">Important: K-1 Visa Eligibility Check</h3>
              </div>
              <p className="text-gray-700 mb-4">
                K-1 visas are only for engaged couples. We need to determine the right path for {sponsorFirstName}.
              </p>
              
              <div className="space-y-3">
                <p className="font-medium text-gray-800">Who is {sponsorFirstName} married to?</p>
                
                <div className="space-y-2">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="marriedTo"
                      value="sponsor"
                      checked={marriedTo === 'sponsor'}
                      onChange={(e) => updateField('marriedTo', e.target.value)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span>The person {sponsorFirstName} wants to sponsor ({beneficiaryFirstName})</span>
                  </label>
                  
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="marriedTo"
                      value="someone-else"
                      checked={marriedTo === 'someone-else'}
                      onChange={(e) => updateField('marriedTo', e.target.value)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span>Someone else</span>
                  </label>
                </div>
                
                <p className="text-xs text-gray-500 mt-3">
                  Note: If {beneficiaryFirstName} isn't the correct name, that's okay. We just need to know if {sponsorFirstName} is married to the person {sponsorPronoun} wants to sponsor. Names can be updated later.
                </p>
              </div>
            </div>
          );
        }
        
        // Show spouse location question after selecting "married to sponsor"
        if (maritalStatus === 'Married' && marriedTo === 'sponsor' && !spouseLocation) {
          return (
            <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center mb-3">
                <span className="text-orange-600 text-xl mr-2">⚠️</span>
                <h3 className="text-lg font-semibold text-orange-800">Important: K-1 Visa Eligibility Check</h3>
              </div>
              <p className="text-gray-700 mb-4">
                K-1 visas are only for engaged couples. We need to determine the right path for {sponsorFirstName}.
              </p>
              
              <div className="space-y-4">
                <div>
                  <p className="font-medium text-gray-800 mb-2">Who is {sponsorFirstName} married to?</p>
                  <p className="text-green-600 text-sm">✓ The person {sponsorFirstName} wants to sponsor ({beneficiaryFirstName})</p>
                </div>
                
                <div className="space-y-3">
                  <p className="font-medium text-gray-800">Where is {beneficiaryFirstName} currently?</p>
                  
                  <div className="space-y-2">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="spouseLocation"
                        value="in-us"
                        checked={spouseLocation === 'in-us'}
                        onChange={(e) => updateField('spouseLocation', e.target.value)}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span>In the United States</span>
                    </label>
                    
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="spouseLocation"
                        value="outside-us"
                        checked={spouseLocation === 'outside-us'}
                        onChange={(e) => updateField('spouseLocation', e.target.value)}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span>Outside the United States</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          );
        }
        
        // Path A: Married to sponsor + In US (AOS)
        if (maritalStatus === 'Married' && marriedTo === 'sponsor' && spouseLocation === 'in-us') {
          return (
            <div className="space-y-4">
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-center mb-3">
                  <span className="text-orange-600 text-xl mr-2">⚠️</span>
                  <h3 className="text-lg font-semibold text-orange-800">Important: K-1 Visa Eligibility Check</h3>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>✓ Married to: The person {sponsorFirstName} wants to sponsor ({beneficiaryFirstName})</p>
                  <p>✓ Location: In the United States</p>
                </div>
              </div>
              
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">
                  → Spousal Green Card: Adjustment of Status (AOS)
                </h3>
                <p className="text-gray-700 mb-4">
                  Being married means {beneficiaryFirstName} can directly apply for a green card - no need for the fiancé visa step, which eventually requires a separate green card application.
                </p>
                
                <details className="mb-4">
                  <summary className="cursor-pointer text-blue-600 font-medium hover:text-blue-800">
                    What is AOS? (click to expand)
                  </summary>
                  <div className="mt-2 pl-4 text-gray-600">
                    <p className="mb-2">Adjustment of Status is a spousal green card application that allows the spouse to become a permanent resident while staying in the US</p>
                    <p>Estimated timeline: 6-10 months for work/travel permit, 12-18 months for green card approval</p>
                  </div>
                </details>

                <div className="flex flex-col space-y-3">
                  <button 
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    onClick={() => {
                      // TODO: Route to AOS eligibility test
                      console.log('TODO: Route to AOS qualifying test');
                    }}
                  >
                    Continue to Spousal Green Card Application →
                  </button>
                  <button 
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    onClick={() => {
                      setCurrentData(prev => ({
                        ...prev,
                        sponsorMaritalStatus: '',
                        marriedTo: '',
                        spouseLocation: ''
                      }));
                    }}
                  >
                    ← Back to K-1 Form
                  </button>
                  <button 
                    className="text-sm text-blue-600 hover:text-blue-800"
                    onClick={() => {
                      // TODO: Route to support
                      console.log('TODO: Route to support for clarification/refund requests');
                    }}
                  >
                    Have questions? Contact support
                  </button>
                </div>
              </div>
            </div>
          );
        }
        
        // Path B: Married to sponsor + Outside US (Consular)
        if (maritalStatus === 'Married' && marriedTo === 'sponsor' && spouseLocation === 'outside-us') {
          return (
            <div className="space-y-4">
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-center mb-3">
                  <span className="text-orange-600 text-xl mr-2">⚠️</span>
                  <h3 className="text-lg font-semibold text-orange-800">Important: K-1 Visa Eligibility Check</h3>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>✓ Married to: The person {sponsorFirstName} wants to sponsor ({beneficiaryFirstName})</p>
                  <p>✓ Location: Outside the United States</p>
                </div>
              </div>
              
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">
                  → Spousal Green Card: Consular Processing
                </h3>
                <p className="text-gray-700 mb-4">
                  Being married means {beneficiaryFirstName} can directly apply for a green card - no need for the fiancé visa step, which eventually requires a separate green card application.
                </p>
                
                <details className="mb-4">
                  <summary className="cursor-pointer text-blue-600 font-medium hover:text-blue-800">
                    What is Consular Processing? (click to expand)
                  </summary>
                  <div className="mt-2 pl-4 text-gray-600 space-y-2">
                    <p>Consular Processing is when the spouse applies for their green card from outside the US and enters as a permanent resident</p>
                    <p><strong>Estimated timeline:</strong> 12-16 months until approval</p>
                    <div className="ml-4">
                      <p>• Month 1-12: Application processing ({beneficiaryFirstName} remains outside the US)</p>
                      <p>• Month 12-16: Interview at local U.S. Embassy or Consulate in {beneficiaryFirstName}'s country</p>
                      <p>• Note: If no U.S. Embassy/Consulate is available locally, interview may be scheduled in a neighboring country</p>
                      <p>• After approval: {beneficiaryFirstName} can enter US as permanent resident</p>
                      <p>• Physical green card arrives by mail within 30-60 days after entering the US</p>
                    </div>
                    <p className="mt-2 font-medium text-amber-600">
                      Important: Many temporary visas (tourist visas, ESTA, etc.) are often denied during green card processing due to immigration intent. {beneficiaryFirstName} should plan to remain outside the US until the process is complete.
                    </p>
                  </div>
                </details>

                <div className="flex flex-col space-y-3">
                  <button 
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    onClick={() => {
                      // TODO: Route to Consular eligibility test
                      console.log('TODO: Route to Consular qualifying test');
                    }}
                  >
                    Continue to Spousal Green Card Application →
                  </button>
                  <button 
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    onClick={() => {
                      setCurrentData(prev => ({
                        ...prev,
                        sponsorMaritalStatus: '',
                        marriedTo: '',
                        spouseLocation: ''
                      }));
                    }}
                  >
                    ← Back to K-1 Form
                  </button>
                  <button 
                    className="text-sm text-blue-600 hover:text-blue-800"
                    onClick={() => {
                      // TODO: Route to support
                      console.log('TODO: Route to support for clarification/refund requests');
                    }}
                  >
                    Have questions? Contact support
                  </button>
                </div>
              </div>
            </div>
          );
        }
        
        // Path C: Married to someone else
        if (maritalStatus === 'Married' && marriedTo === 'someone-else') {
          return (
            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <h3 className="text-lg font-semibold text-amber-800 mb-3">
                → Let's understand {sponsorFirstName}'s current marriage situation
              </h3>
              <p className="text-gray-700 mb-4">
                For a K-1 visa, both parties need to be legally free to marry. We understand divorces can be complex, and we're here to help {sponsorFirstName} prepare the visa application for when it's time to file.
              </p>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">{sponsorFirstName}'s options:</p>
                  {!preparingWhileDivorcing ? (
                    <button 
                      className="w-full px-6 py-4 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-left"
                      onClick={() => {
                        setCurrentData(prev => ({
                          ...prev,
                          preparingWhileDivorcing: true
                        }));
                      }}
                    >
                      <div className="font-medium">Continue preparing the application now and file when the divorce is finalized</div>
                      <div className="text-sm text-amber-100 mt-1">We'll help {sponsorFirstName} get everything ready to file as soon as possible</div>
                    </button>
                  ) : (
                    <div className="w-full px-6 py-4 bg-green-100 border border-green-300 rounded-lg text-left">
                      <div className="flex items-center">
                        <span className="text-green-600 text-xl mr-2">✓</span>
                        <div>
                          <div className="font-medium text-green-800">Great - let's keep going!</div>
                          <div className="text-sm text-green-600 mt-1">Form is now active and ready to continue</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <button 
                  className="text-sm text-amber-600 hover:text-amber-800"
                  onClick={() => {
                    // TODO: Route to support system with context
                    console.log('TODO: Route to support system with context for married to someone else scenario');
                  }}
                >
                  Need to discuss {sponsorFirstName}'s situation? Contact support
                </button>
              </div>
            </div>
          );
        }
        
        return null;

default:
  // This handles 'text', 'number', and any other basic input types
const isDefaultTouched = touchedFields && touchedFields[field.id];
const showError = isDefaultTouched && field.required && (!value || value === '');
  
  return (
    <div>
      <input
        type={field.type}
        className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 ${
          showError ? 'border-red-500' : ''
        }`}
        value={value}
        onFocus={() => {
          setTouchedFields(prev => ({ ...prev, [field.id]: false }));
        }}
        onBlur={() => {
          setTouchedFields(prev => ({ ...prev, [field.id]: true }));
        }}
        onChange={(e) => updateField(field.id, e.target.value)}
      />
      {showError && (
        <div className="mt-1 text-sm text-red-600">
          ⚠️ This field is required
        </div>
      )}
    </div>
  );
    }
  };

return (
    <>
      {/* Info Panel for In Care Of */}
      <div className={`fixed top-0 right-0 h-full w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
        showInfoPanel ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="h-full overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">What is "In Care Of"?</h3>
              <button
                type="button"
                onClick={() => setShowInfoPanel(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4 text-sm text-gray-700">
              <p className="text-gray-600">
                "In Care Of" (often abbreviated as "c/o") is used when mail for you is being sent to someone else's address. 
                It tells the postal service who should receive and hold your mail at that address.
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-3">Common Examples:</h4>
                
                <div className="space-y-3">
                  <div className="border-l-4 border-blue-400 pl-3">
                    <p className="font-medium text-blue-800">Living with someone temporarily:</p>
                    <p className="text-gray-600 text-xs mt-1">You're staying with your friend John Smith</p>
                    <div className="bg-white rounded p-2 mt-2 text-xs font-mono">
                      In Care Of: John Smith<br/>
                      123 Main Street<br/>
                      City, State ZIP
                    </div>
                  </div>
                  
                  <div className="border-l-4 border-blue-400 pl-3">
                    <p className="font-medium text-blue-800">Using a business address:</p>
                    <p className="text-gray-600 text-xs mt-1">You receive mail at your workplace</p>
                    <div className="bg-white rounded p-2 mt-2 text-xs font-mono">
                      In Care Of: ABC Company<br/>
                      456 Business Blvd
                    </div>
                  </div>
                  
                  <div className="border-l-4 border-blue-400 pl-3">
                    <p className="font-medium text-blue-800">Staying with family:</p>
                    <p className="text-gray-600 text-xs mt-1">Living with parents but mail comes in their name</p>
                    <div className="bg-white rounded p-2 mt-2 text-xs font-mono">
                      In Care Of: Mr. and Mrs. Johnson
                    </div>
                  </div>
                  
                  <div className="border-l-4 border-blue-400 pl-3">
                    <p className="font-medium text-blue-800">Using a mail service:</p>
                    <div className="bg-white rounded p-2 mt-2 text-xs font-mono">
                      In Care Of: UPS Store #1234<br/>
                      Or: Your Attorney's Name
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-900 mb-2">Why you might use it:</h4>
                <ul className="list-disc list-inside space-y-1 text-xs text-gray-600">
                  <li>Mail going to a relative's house while traveling</li>
                  <li>Using an attorney's office for important documents</li>
                  <li>Temporarily staying somewhere while maintaining a permanent address elsewhere</li>
                  <li>Having someone reliable receive time-sensitive USCIS mail</li>
                </ul>
              </div>
              
              <div className="bg-gray-100 rounded-lg p-3">
                <p className="font-semibold text-gray-800 text-sm">✨ Bottom line:</p>
                <p className="text-xs mt-1">
                  If mail comes directly to you at your own address, leave this blank. Only fill it in if someone 
                  else's name needs to be on the mail for it to be properly delivered to you.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Overlay when panel is open */}
      {showInfoPanel && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setShowInfoPanel(false)}
        />
      )}
      
      <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">K-1 Visa Application</h1>
        <p className="text-gray-600 mb-4">Complete form with organized subsections</p>
        <div className="bg-blue-50 border border-blue-200 rounded p-3">
          <p className="text-blue-800 text-sm">
            ✨ The "Sponsor Identity & Demographics" section now has clickable subsection ribbons to organize the questions!
          </p>
        </div>
      </div>

      {sections.map((section, index) => (
        <div key={section.id} className="bg-white rounded-lg shadow-lg mb-4">
          <div className="p-6 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => toggleSection(index)}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold">
                  {index + 1}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{section.title}</h3>
                  <p className="text-gray-600">{section.subtitle}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-sm text-blue-600 font-medium">
                      {section.questionCount} questions
                    </span>
                    <span className="text-sm text-gray-500">
                      {section.role === 'sponsor' ? '👤 Sponsor' : '💑 Beneficiary'}
                    </span>
                    {section.hasSubsections && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        Organized in subsections
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-gray-400">
                {expandedSections[index] ? <ChevronDown size={24} /> : <ChevronRight size={24} />}
              </div>
            </div>
          </div>

          {expandedSections[index] && (
            <div className="border-t border-gray-200">
              {section.hasSubsections ? (
                <div className="space-y-2 p-4">
                  {section.subsections.map((subsection) => {
                    const subsectionKey = `${index}-${subsection.id}`;
                    const isExpanded = expandedSubsections[subsectionKey];
                    const IconComponent = subsection.icon;

                    return (
                      <div key={subsection.id} className="border border-gray-200 rounded-lg overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 p-4 cursor-pointer hover:from-blue-100 hover:to-indigo-100 transition-all duration-200"
                          onClick={() => toggleSubsection(index, subsection.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="flex items-center justify-center w-10 h-10 bg-blue-100 text-blue-600 rounded-lg">
                                <IconComponent size={20} />
                              </div>
                              <div>
                                <h4 className="text-lg font-semibold text-gray-800">{subsection.title}</h4>
                                <p className="text-sm text-gray-600">{subsection.description}</p>
                                <span className="text-xs text-blue-600 font-medium">
                                  {subsection.questionCount} questions
                                </span>
                              </div>
                            </div>
                            <div className="text-gray-400">
                              {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                            </div>
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="p-6 bg-white">
                            <div className="space-y-6">
                              {subsection.fields.map((field) => {
                                // Check if form should be grayed out for marital section
                                const isMaritalSection = subsection.id === '1.4-marital';
                                const maritalStatus = currentData['sponsorMaritalStatus'] || '';
                                const marriedTo = currentData['marriedTo'] || '';
                                const preparingWhileDivorcing = currentData['preparingWhileDivorcing'] || false;
                                
                                // Gray out form except for marital status dropdown and married eligibility check questions
                                const shouldGrayField = isMaritalSection && 
                                  maritalStatus === 'Married' &&
                                  (marriedTo === 'sponsor' || (marriedTo === 'someone-else' && !preparingWhileDivorcing)) &&
                                  field.id !== 'sponsorMaritalStatus' && 
                                  field.id !== 'marriedEligibilityCheck';
                                
                                return (
                                <div key={field.id} className={shouldGrayField ? 'opacity-50 pointer-events-none' : ''}>
{!field.hideLabel ? (
  <label className="block text-sm font-medium text-gray-700 mb-2">
    <span className="inline-flex items-center">
      {(() => {
        // Dynamic label for sponsorStatusDate based on marital status
        if (field.id === 'sponsorStatusDate') {
          const maritalStatus = currentData['sponsorMaritalStatus'] || '';
          const sponsorFirstName = currentData['sponsorFirstName'] || '[SponsorFirstName]';
          if (maritalStatus === 'Divorced') {
            return `Date`;
          } else if (maritalStatus === 'Widowed') {
            return `When did ${sponsorFirstName}'s latest spouse pass away?`;
          }
          return field.label;
        }
        // Replace placeholder for other fields
        return field.label.replace('[SponsorFirstName]', currentData['sponsorFirstName'] || '[SponsorFirstName]');
      })()}
      {field.required && <span className="text-red-500 ml-1">*</span>}
      {field.hasInfo && field.id === 'sponsorInCareOf' && (
        <button
          type="button"
          onClick={() => setShowInfoPanel(!showInfoPanel)}
          className="ml-2 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2 py-0.5 rounded border border-blue-300 transition-colors"
        >
          What's this?
        </button>
      )}
    </span>
  </label>
) : null}

                                  {field.conditional ? (
                                    (() => {
                                      const hasCert = currentData['sponsorHasCertificate'] || '';
                                      const physicalSameCheck = currentData['sponsorPhysicalSame'] || '';
                                      const employmentStatus = currentData['sponsorEmploymentStatus'] || '';

                                      if (field.id.includes('Cert')) {
                                        if (hasCert === 'Yes') {
                                          return renderField(field);
                                        }
                                        return null;
                                      }

                                      if (field.id === 'sponsorPhysicalAddress') {
                                        if (physicalSameCheck === 'No') {
                                          return renderField(field);
                                        }
                                        return null;
                                      }

                                      if (field.id === 'sponsorAddressDuration') {
                                        if (physicalSameCheck === 'Yes') {
                                          return renderField(field);
                                        }
                                        return null;
                                      }

                                      if (field.id === 'sponsorOccupation' || field.id === 'sponsorEmployer' || field.id === 'sponsorEmployerAddress') {
                                        if (employmentStatus && (employmentStatus.includes('Employed') || employmentStatus === 'Self-Employed') && employmentStatus !== 'Unemployed or Not Employed') {
                                          return renderField(field);
                                        }
                                        return null;
                                      }

                                      // Handle marital status special cases
                                      if (field.id === 'sponsorStatusDate') {
                                        const maritalStatus = currentData['sponsorMaritalStatus'] || '';
                                        // Only show for widowed (not divorced, since divorce date is captured in marriage history)
                                        if (maritalStatus === 'Widowed') {
                                          return renderField(field);
                                        }
                                        return null;
                                      }

                                      if (field.id === 'marriedEligibilityCheck') {
                                        const maritalStatus = currentData['sponsorMaritalStatus'] || '';
                                        if (maritalStatus === 'Married') {
                                          return renderField(field);
                                        }
                                        return null;
                                      }

                                      if (field.id === 'sponsorPreviousMarriages') {
                                        const maritalStatus = currentData['sponsorMaritalStatus'] || '';
                                        // Show for all statuses except Married (since married people are in different flow)
                                        if (maritalStatus !== 'Married') {
                                          return renderField(field);
                                        }
                                        return null;
                                      }

                                      if (field.id === 'sponsorMarriageHistory') {
                                        const maritalStatus = currentData['sponsorMaritalStatus'] || '';
                                        const previousMarriages = parseInt(currentData['sponsorPreviousMarriages']) || 0;
                                        // Show marriage history for anyone with previous marriages (Single, Divorced, Widowed)
                                        if (maritalStatus !== 'Married' && previousMarriages > 0) {
                                          return renderField(field);
                                        }
                                        return null;
                                      }

                                      return renderField(field);
                                    })()
                                  ) : (
                                    <div>
                                      {renderField(field)}
                                      {/* Show help text if available */}
                                      {field.helpText && (
                                        <p className="mt-2 text-sm text-gray-600 bg-blue-50 border-l-4 border-blue-300 pl-3 py-2 rounded">
                                          💡 {field.helpText}
                                        </p>
                                      )}
                                    </div>
                                  )}
                                </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="px-6 pb-6">
                  <div className="space-y-6 mt-6">
                    {section.fields.map((field) => (
                      <div key={field.id}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {field.label}
                          {field.required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        {renderField(field)}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
    </>
  );
};

export default K1VisaQuestionnaire;