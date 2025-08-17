import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Check, Info, User, Users, FileText, Home, Phone, MapPin } from 'lucide-react';

const K1VisaQuestionnaire = () => {
  const [expandedSections, setExpandedSections] = useState({ 0: true });
  const [expandedSubsections, setExpandedSubsections] = useState({});
  const [currentData, setCurrentData] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  
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
      questionCount: 18,
      fields: [
        // Legal Name
        { id: 'sponsorLastName', label: 'Legal Last Name (Family Name)', type: 'text', required: true },
        { id: 'sponsorFirstName', label: 'Legal First Name (Given Name)', type: 'text', required: true },
        { id: 'sponsorMiddleName', label: 'Middle Name', type: 'text', required: false },
        
        // Other Names
        { id: 'sponsorOtherNames', label: 'Other Names Used (aliases, maiden name, nicknames)', type: 'other-names', required: false },
        
        // Basic Information
        { id: 'sponsorDOB', label: 'Date of Birth', type: 'date', required: true },
        { id: 'sponsorBirthLocation', label: 'Place of Birth', type: 'birth-location', required: true },
        { id: 'sponsorSex', label: 'Sex', type: 'select', options: ['Male', 'Female'], required: true },
        { id: 'sponsorSSN', label: 'Social Security Number', type: 'ssn', required: true },
        
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
        { id: 'sponsorHasCertificate', label: 'Do you have a Certificate of Naturalization or Certificate of Citizenship?', type: 'cert-question', required: true },
{ id: 'sponsorCertNumber', label: 'Certificate Number', type: 'cert-number', required: false, conditional: true },
{ id: 'sponsorCertIssueDate', label: 'Date of Issuance', type: 'date', required: false, conditional: true },
{ id: 'sponsorCertIssuePlace', label: 'Place of Issuance', type: 'cert-place', required: false, conditional: true },
      ]
    },
    {
      id: '1.2-contact',
      title: '1.2 Contact Information',
      icon: Phone,
      description: 'Phone numbers, email, and contact preferences',
      questionCount: 7,
      fields: [
        { id: 'sponsorEmail', label: 'Email Address', type: 'smart-email', required: true },
        { id: 'sponsorEmailContact', label: 'Can we contact you by email about this case?', type: 'select', options: ['Yes', 'No'], required: true },
        { id: 'sponsorTextContact', label: 'Can we contact you by text about this case?', type: 'select', options: ['Yes', 'No'], required: true },
        
        { id: 'sponsorDaytimePhone', label: 'Daytime Phone Number', type: 'international-phone', required: true },
        { id: 'sponsorMobilePhone', label: 'Mobile Phone Number', type: 'international-phone', required: false },
        { id: 'sponsorWorkPhone', label: 'Work Phone Number', type: 'international-phone', required: false },
        
        { id: 'sponsorSafeToContact', label: 'Is it safe to communicate about this case at these numbers?', type: 'select', 
          options: ['Yes', 'No'], 
          required: true 
        }
      ]
    }
  ];

  const sponsorAddressSubsections = [
    {
      id: '1.3-addresses',
      title: '1.3 Complete Address History',
      icon: Home,
      description: 'Current and previous addresses',
      questionCount: 10,
      fields: [
        // Current Physical Address
        { id: 'sponsorCurrentAddress', label: 'Current Physical Address', type: 'address', required: true },
        { id: 'sponsorMoveInDate', label: 'Date moved to this address', type: 'date', required: true },
        { id: 'sponsorSafeAddress', label: 'Is this a Safe Mailing Address/DV Shelter?', type: 'select', options: ['No', 'Yes'], required: true },
        
        // Mailing Address
        { id: 'sponsorMailingDifferent', label: 'Is your mailing address different from your physical address?', type: 'select', options: ['No', 'Yes'], required: true },
        { id: 'sponsorMailingAddress', label: 'Mailing Address', type: 'address', required: false, conditional: true },
        { id: 'sponsorInCareOf', label: 'In Care Of Name (if applicable)', type: 'text', required: false, conditional: true },
        
        // Address Duration
        { id: 'sponsorAddressDuration', label: 'How long have you lived at your current address?', type: 'address-duration', required: true },
        
        // Address History (calculated based on age)
        { id: 'sponsorAddressHistory', label: 'Previous Addresses', type: 'conditional-address-history', required: true },
        
        // Foreign Residence
        { id: 'sponsorLivedAbroad', label: 'Have you ever lived outside the U.S. for more than 1 year?', type: 'select', options: ['No', 'Yes'], required: true },
        { id: 'sponsorForeignResidence', label: 'Last Foreign Residence Details', type: 'foreign-residence', required: false, conditional: true },
        
        // Places resided (this will use your existing places-resided field type)
        { id: 'sponsorPlacesResided', label: 'Places You Have Resided Since Age 18', type: 'places-resided', required: true }
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
          options: ['Single, never married', 'Divorced', 'Widowed'], 
          required: true 
        },
        { id: 'sponsorStatusDate', label: 'Date you became single/divorced/widowed', type: 'date', required: false, conditional: true },
        { id: 'sponsorPreviousMarriages', label: 'How many times have you been previously married?', type: 'select', 
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
      { id: 'beneficiaryDOB', label: 'Date of Birth', type: 'date', required: true },
      { id: 'beneficiarySex', label: 'Sex', type: 'select', options: ['Male', 'Female'], required: true },
      { id: 'beneficiaryBirthCity', label: 'City/Town/Village of Birth', type: 'text', required: true },
      { id: 'beneficiaryBirthCountry', label: 'Country of Birth', type: 'text', required: true },
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
        const historyPhysicalSame = currentData['sponsorPhysicalSame'] || '';
        const historyAddressDuration = currentData['sponsorAddressDuration'] || '';

        const needsAddressHistory = historyPhysicalSame === 'No' ||
          (historyPhysicalSame === 'Yes' && historyAddressDuration && historyAddressDuration !== '5-plus-years');

        if (!needsAddressHistory) {
          if (historyPhysicalSame === 'Yes' && historyAddressDuration === '5-plus-years') {
            return (
              <div className="text-sm text-green-600 bg-green-50 border border-green-200 rounded p-3">
                <p className="font-medium">✅ No Address History Needed</p>
                <p>Since you've lived at the same address for 5+ years, the address history requirement is satisfied.</p>
              </div>
            );
          }

          if (historyPhysicalSame === 'Yes' && !historyAddressDuration) {
            return (
              <div className="text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded p-3">
                <p>Please first indicate how long you've lived at your current address.</p>
              </div>
            );
          }

          return null;
        }

        const addressHistoryValue = currentData[field.id] || [];
        const fiveYearsAgo = new Date();
        fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);
        const fiveYearsAgoString = fiveYearsAgo.toISOString().split('T')[0];

        const lastAddress = addressHistoryValue[addressHistoryValue.length - 1];
        const fiveYearRequirementMet = lastAddress && lastAddress.dateFrom &&
          new Date(lastAddress.dateFrom) <= new Date(fiveYearsAgoString);

        return (
          <div className="space-y-4">
            <div className="text-sm text-gray-600 bg-blue-50 border border-blue-200 rounded p-3">
              <p className="font-medium text-blue-800 mb-1">📍 Address History Requirements</p>
              <p>Provide your previous physical addresses to complete the <strong>5-year history requirement</strong>.</p>
            </div>

            {addressHistoryValue.map((address, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-800">Previous Address #{index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => {
                      const newHistory = addressHistoryValue.filter((_, i) => i !== index);
                      const updatedHistory = newHistory.map((addr, idx) => {
                        if (idx === 0) {
                          const currentAddressStart = getCurrentAddressStartDate(historyPhysicalSame, historyAddressDuration);
                          return { ...addr, dateTo: currentAddressStart };
                        } else {
                          const prevAddress = newHistory[idx - 1];
                          if (prevAddress && prevAddress.dateFrom) {
                            const prevDate = new Date(prevAddress.dateFrom);
                            prevDate.setDate(prevDate.getDate() - 1);
                            return { ...addr, dateTo: prevDate.toISOString().split('T')[0] };
                          }
                          return addr;
                        }
                      });
                      updateField(field.id, updatedHistory);
                    }}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Date From</label>
                      <input
                        type="date"
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                        value={address.dateFrom || ''}
                        max={fiveYearsAgoString}
                        onChange={(e) => {
                          const newHistory = [...addressHistoryValue];
                          newHistory[index] = { ...newHistory[index], dateFrom: e.target.value };

                          if (index < newHistory.length - 1) {
                            const nextDate = new Date(e.target.value);
                            nextDate.setDate(nextDate.getDate() - 1);
                            newHistory[index + 1] = {
                              ...newHistory[index + 1],
                              dateTo: nextDate.toISOString().split('T')[0]
                            };
                          }

                          updateField(field.id, newHistory);
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Date To {index === 0 && '(When current address started)'}
                      </label>
                      <input
                        type="date"
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                        value={address.dateTo || (index === 0 ? getCurrentAddressStartDate(historyPhysicalSame, historyAddressDuration) : '')}
                        readOnly={index === 0}
                        onChange={(e) => {
                          if (index !== 0) {
                            const newHistory = [...addressHistoryValue];
                            newHistory[index] = { ...newHistory[index], dateTo: e.target.value };

                            if (index > 0) {
                              const prevDate = new Date(e.target.value);
                              prevDate.setDate(prevDate.getDate() + 1);
                              newHistory[index - 1] = {
                                ...newHistory[index - 1],
                                dateFrom: prevDate.toISOString().split('T')[0]
                              };
                            }

                            updateField(field.id, newHistory);
                          }
                        }}
                      />
                    </div>
                  </div>

                  <select
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    value={address.country || ''}
                    onChange={(e) => {
                      const newHistory = [...addressHistoryValue];
                      newHistory[index] = { ...newHistory[index], country: e.target.value, state: '', zipCode: '' };
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
                      <input
                        type="text"
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                        value={address.street || ''}
                        onChange={(e) => {
                          const newHistory = [...addressHistoryValue];
                          newHistory[index] = { ...newHistory[index], street: e.target.value };
                          updateField(field.id, newHistory);
                        }}
                        placeholder="Street Number and Name"
                      />

                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          className="p-2 border rounded focus:ring-2 focus:ring-blue-500"
                          value={address.city || ''}
                          onChange={(e) => {
                            const newHistory = [...addressHistoryValue];
                            newHistory[index] = { ...newHistory[index], city: e.target.value };
                            updateField(field.id, newHistory);
                          }}
                          placeholder="City"
                        />
                        <div>
                          {(() => {
                            const historyCountryFormat = addressFormats[address.country] || addressFormats['United States'];
                            return historyCountryFormat.states ? (
                              <select
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                                value={address.state || ''}
                                onChange={(e) => {
                                  const newHistory = [...addressHistoryValue];
                                  newHistory[index] = { ...newHistory[index], state: e.target.value };
                                  updateField(field.id, newHistory);
                                }}
                              >
                                <option value="">Select {historyCountryFormat.stateLabel.toLowerCase()}...</option>
                                {historyCountryFormat.states.map(stateOption => (
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
                                  newHistory[index] = { ...newHistory[index], state: e.target.value };
                                  updateField(field.id, newHistory);
                                }}
                                placeholder={historyCountryFormat.stateLabel}
                              />
                            );
                          })()}
                        </div>
                      </div>

                      <input
                        type="text"
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                        value={address.zipCode || ''}
                        onChange={(e) => {
                          const newHistory = [...addressHistoryValue];
                          const formatted = formatPostalCode(e.target.value, address.country);
                          newHistory[index] = { ...newHistory[index], zipCode: formatted };
                          updateField(field.id, newHistory);
                        }}
                        placeholder={(() => {
                          const historyCountryFormat = addressFormats[address.country] || addressFormats['United States'];
                          return historyCountryFormat.postalPlaceholder;
                        })()}
                      />
                    </>
                  )}
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => {
                const newHistory = [...addressHistoryValue];
                const lastAddr = newHistory[newHistory.length - 1];
                let newDateTo = '';

                if (lastAddr && lastAddr.dateFrom) {
                  const lastDate = new Date(lastAddr.dateFrom);
                  lastDate.setDate(lastDate.getDate() - 1);
                  newDateTo = lastDate.toISOString().split('T')[0];
                } else if (newHistory.length === 0) {
                  newDateTo = getCurrentAddressStartDate(historyPhysicalSame, historyAddressDuration);
                }

                newHistory.push({
                  dateFrom: '', dateTo: newDateTo,
                  country: '', street: '', city: '', state: '', zipCode: ''
                });

                updateField(field.id, newHistory);
              }}
              className="w-full p-3 border-2 border-dashed border-blue-300 rounded-lg text-blue-600 hover:border-blue-400 hover:text-blue-800 transition-colors bg-blue-50 hover:bg-blue-100"
            >
              + Add Previous Address
            </button>

            {!fiveYearRequirementMet && addressHistoryValue.length > 0 && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-3">
                <p className="font-medium">❌ 5-Year Requirement Not Met</p>
                <p>You must provide addresses going back at least 5 years (to {fiveYearsAgoString}). Please add more addresses or extend the date range.</p>
              </div>
            )}

            {fiveYearRequirementMet && (
              <div className="text-sm text-green-600 bg-green-50 border border-green-200 rounded p-3">
                <p className="font-medium">✅ 5-Year Address History Complete</p>
                <p>Your address history covers the required 5-year period.</p>
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
        const birthLocationCountryFormat = addressFormats[birthLocationCountry] || addressFormats['United States'];

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
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                value={birthLocationCountry}
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
            </div>

            {birthLocationCountry && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City/Town/Village <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    value={birthLocationCity}
                    onChange={(e) => updateField(field.id, { ...birthLocationValue, city: e.target.value })}
                    placeholder="Enter city/town/village"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {birthLocationCountryFormat.stateLabel} {birthLocationCountryFormat.stateRequired && <span className="text-red-500">*</span>}
                  </label>
                  {birthLocationCountryFormat.states ? (
                    <select
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                      value={birthLocationState}
                      onChange={(e) => updateField(field.id, { ...birthLocationValue, state: e.target.value })}
                    >
                      <option value="">Select {birthLocationCountryFormat.stateLabel.toLowerCase()}...</option>
                      {birthLocationCountryFormat.states.map(stateOption => (
                        <option key={stateOption} value={stateOption}>{stateOption}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 ${!birthLocationCountryFormat.stateRequired ? 'bg-gray-50' : ''
                        }`}
                      value={birthLocationState}
                      onChange={(e) => updateField(field.id, { ...birthLocationValue, state: e.target.value })}
                      placeholder={birthLocationCountryFormat.stateRequired ? 'Required' : 'Optional'}
                    />
                  )}
                </div>
              </>
            )}
          </div>
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

      case 'address':
        const mainAddressValue = currentData[field.id] || {};
        const { street: mainStreet = '', city: mainCity = '', state: mainState = '', zipCode: mainZipCode = '', country: mainCountry = '' } = mainAddressValue;
        const mainCountryFormat = addressFormats[mainCountry] || addressFormats['United States'];

        return (
          <div className="space-y-3">
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

            {mainCountry && (
              <>
                <input
                  type="text"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  value={mainStreet}
                  onChange={(e) => updateField(field.id, { ...mainAddressValue, street: e.target.value })}
                  placeholder="Street Number and Name"
                />

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    className="p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    value={mainCity}
                    onChange={(e) => updateField(field.id, { ...mainAddressValue, city: e.target.value })}
                    placeholder="City"
                  />
                  <div className="relative">
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
                        className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 ${mainCountryFormat.stateRequired ? 'border-gray-300' : 'border-gray-200 bg-gray-50'
                          }`}
                        value={mainState}
                        onChange={(e) => updateField(field.id, { ...mainAddressValue, state: e.target.value })}
                        placeholder={mainCountryFormat.stateLabel}
                        disabled={!mainCountryFormat.stateRequired && mainCountry !== 'United States' && mainCountry !== 'Canada'}
                      />
                    )}
                    {mainCountryFormat.stateRequired && (
                      <span className="absolute right-2 top-2 text-red-500 text-sm">*</span>
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
                className="flex-1 p-2 border border-gray-300 rounded-r focus:ring-2 focus:ring-blue-500"
                value={phoneNumberValue}
                onChange={(e) => {
                  const formatted = formatPhoneByCountry(e.target.value, selectedPhoneCountry);
                  updateField(field.id, { ...intlPhoneValue, number: formatted });
                }}
                placeholder={phoneCountries.find(c => c.code === selectedPhoneCountry)?.format.replace(/X/g, '0')}
              />
            </div>
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

        const showEmailError = (emailLocalPart || emailDomain || emailCustomDomain) && !emailValidationResult.isValid;

        return (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                className="flex-1 p-2 border rounded-l focus:ring-2 focus:ring-blue-500"
                value={emailLocalPart}
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

            {emailValidationResult.isValid && emailValidationResult.message && (
              <div className="text-sm flex items-center text-green-600">
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

      case 'places-resided':
        const sponsorDOB = currentData['sponsorDOB'] || '';

        // DEVELOPER NOTE: I-129F requires "places resided since age 18" 
        // For users 23 or younger: their 5-year address history already covers everything since age 18
        // For users 24+: they need to provide additional places from age 18 until (current age - 5)
        // We auto-extract from existing address data and only ask for additional places if needed

        let currentAge = null;
        if (sponsorDOB) {
          const today = new Date();
          const birthDate = new Date(sponsorDOB);
          currentAge = today.getFullYear() - birthDate.getFullYear();
          const monthDiff = today.getMonth() - birthDate.getMonth();
          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            currentAge--;
          }
        }

        // Hide this field entirely if address history covers everything since 18
        const addressHistoryCoversAll = currentAge && currentAge <= 23;
        if (addressHistoryCoversAll) {
          return null;
        }

        // If no DOB provided, show message to complete demographics first
        if (!sponsorDOB) {
          return (
            <div className="text-sm text-orange-600 bg-orange-50 border border-orange-200 rounded p-3">
              <p>Please fill in your date of birth in the demographics section first.</p>
            </div>
          );
        }

        const placesResidedValue = currentData[field.id] || [];
        const addressHistory = currentData['sponsorAddressHistory'] || [];
        const currentMailingAddress = currentData['sponsorMailingAddress'] || {};
        const currentPhysicalAddress = currentData['sponsorPhysicalAddress'] || {};
        const physicalSame = currentData['sponsorPhysicalSame'] || '';

        // Auto-extract places from existing address data
        const extractedPlaces = [];

        if (currentMailingAddress.country) {
          extractedPlaces.push({
            country: currentMailingAddress.country,
            state: currentMailingAddress.country === 'United States' ? currentMailingAddress.state : '',
            source: 'current-mailing'
          });
        }

        if (physicalSame === 'No' && currentPhysicalAddress.country &&
          currentPhysicalAddress.country !== currentMailingAddress.country) {
          extractedPlaces.push({
            country: currentPhysicalAddress.country,
            state: currentPhysicalAddress.country === 'United States' ? currentPhysicalAddress.state : '',
            source: 'current-physical'
          });
        }

        addressHistory.forEach(addr => {
          if (addr.country && !extractedPlaces.some(p =>
            p.country === addr.country && p.state === (addr.state || ''))) {
            extractedPlaces.push({
              country: addr.country,
              state: addr.country === 'United States' ? addr.state : '',
              source: 'address-history'
            });
          }
        });

        const gapYearsStart = 18;
        const gapYearsEnd = Math.max(18, currentAge - 5);

        return (
          <div className="space-y-4">
            <div className="text-sm text-gray-600 bg-blue-50 border border-blue-200 rounded p-3">
              <p className="font-medium text-blue-800 mb-1">📍 Additional Places of Residence</p>
              <p>Add any places you lived from age {gapYearsStart} to {gapYearsEnd} (before your recent address history period).</p>
            </div>

            {extractedPlaces.length > 0 && (
              <div className="bg-green-50 border border-green-200 rounded p-3">
                <p className="text-sm font-medium text-green-800 mb-2">✅ Recent places (auto-detected):</p>
                <div className="space-y-1">
                  {extractedPlaces.map((place, index) => (
                    <div key={index} className="text-sm text-green-700">
                      • {place.state ? `${place.state}, ` : ''}{place.country}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {placesResidedValue.map((place, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-800">Additional Place #{index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => {
                      const newPlaces = placesResidedValue.filter((_, i) => i !== index);
                      updateField(field.id, newPlaces);
                    }}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Country</label>
                    <select
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                      value={place.country || ''}
                      onChange={(e) => {
                        const newPlaces = [...placesResidedValue];
                        newPlaces[index] = { ...newPlaces[index], country: e.target.value, state: '' };
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
                  </div>

                  {place.country === 'United States' && (
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">State</label>
                      <select
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                        value={place.state || ''}
                        onChange={(e) => {
                          const newPlaces = [...placesResidedValue];
                          newPlaces[index] = { ...newPlaces[index], state: e.target.value };
                          updateField(field.id, newPlaces);
                        }}
                      >
                        <option value="">Select state...</option>
                        {addressFormats['United States'].states.map(state => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => {
                const newPlaces = [...placesResidedValue];
                newPlaces.push({
                  country: '',
                  state: ''
                });
                updateField(field.id, newPlaces);
              }}
              className="w-full p-3 border-2 border-dashed border-blue-300 rounded-lg text-blue-600 hover:border-blue-400 hover:text-blue-800 transition-colors bg-blue-50 hover:bg-blue-100"
            >
              + Add Place of Residence
            </button>

            {placesResidedValue.length === 0 && (
              <p className="text-sm text-gray-500 italic text-center py-4">
                No additional places needed, or click above to add places from age {gapYearsStart}-{gapYearsEnd}.
              </p>
            )}
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
            <input
              type="text"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              value={foreignResValue.city || ''}
              onChange={(e) => updateField(field.id, { ...foreignResValue, city: e.target.value })}
              placeholder="City"
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
        const marriageCount = parseInt(currentData['sponsorPreviousMarriages']) || 0;
        const marriageHistoryValue = currentData[field.id] || [];
        
        if (marriageCount === 0) return null;
        
        return (
          <div className="space-y-4">
            {[...Array(marriageCount)].map((_, index) => {
              const marriage = marriageHistoryValue[index] || {};
              return (
                <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <h4 className="font-medium text-gray-800 mb-3">Marriage #{index + 1}</h4>
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
                        <label className="block text-xs font-medium text-gray-700 mb-1">Date of Birth</label>
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
                        <label className="block text-xs font-medium text-gray-700 mb-1">Country of Birth</label>
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
                            newHistory[index] = { ...marriage, marriageDate: e.target.value };
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
                          onChange={(e) => {
                            const newHistory = [...marriageHistoryValue];
                            newHistory[index] = { ...marriage, marriageEndDate: e.target.value };
                            updateField(field.id, newHistory);
                          }}
                        />
                      </div>
                    </div>
                    
                    <select
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                      value={marriage.howEnded || ''}
                      onChange={(e) => {
                        const newHistory = [...marriageHistoryValue];
                        newHistory[index] = { ...marriage, howEnded: e.target.value };
                        updateField(field.id, newHistory);
                      }}
                    >
                      <option value="">How did marriage end?</option>
                      <option value="Divorce">Divorce</option>
                      <option value="Death">Death</option>
                      <option value="Annulment">Annulment</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              );
            })}
          </div>
        );

case 'cert-place':
  const certPlaceValue = currentData[field.id] || {};
  const { city: certCity = '', state: certState = '' } = certPlaceValue;
  
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
                              {subsection.fields.map((field) => (
                                <div key={field.id}>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {field.label}
                                    {field.required && <span className="text-red-500 ml-1">*</span>}
                                  </label>

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
// Add these conditions to your existing conditional logic:

// For certificate fields
if (field.id === 'sponsorCertNumber' || field.id === 'sponsorCertIssueDate' || field.id === 'sponsorCertIssuePlace') {
  if (currentData['sponsorHasCertificate'] === 'Yes') {
    return renderField(field);
  }
  return null;
}

// For mailing address
if (field.id === 'sponsorMailingAddress' || field.id === 'sponsorInCareOf') {
  if (currentData['sponsorMailingDifferent'] === 'Yes') {
    return renderField(field);
  }
  return null;
}

// For marital status date
if (field.id === 'sponsorStatusDate') {
  if (currentData['sponsorMaritalStatus'] === 'Divorced' || currentData['sponsorMaritalStatus'] === 'Widowed') {
    return renderField(field);
  }
  return null;
}

// For employment fields
if (field.id.includes('sponsorEmployer') || field.id.includes('sponsorSupervisor') || 
    field.id.includes('sponsorHR') || field.id === 'sponsorJobTitle' || 
    field.id === 'sponsorBusinessType' || field.id === 'sponsorEmploymentStartDate' ||
    field.id === 'sponsorAnnualSalary' || field.id === 'sponsorFullTime') {
  const empStatus = currentData['sponsorEmploymentStatus'];
  if (empStatus === 'Employed' || empStatus === 'Self-Employed') {
    return renderField(field);
  }
  return null;
}

                                      return renderField(field);
                                    })()
                                  ) : (
                                    renderField(field)
                                  )}
                                </div>
                              ))}
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
  );
};

export default K1VisaQuestionnaire;