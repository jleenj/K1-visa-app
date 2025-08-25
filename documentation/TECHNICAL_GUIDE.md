# Technical Implementation Guide

## State Management Pattern
```javascript
const [currentData, setCurrentData] = useState({});
const [fieldErrors, setFieldErrors] = useState({});
const [touchedFields, setTouchedFields] = useState({});

const updateField = (field, value) => {
  setCurrentData(prev => ({
    ...prev,
    [field]: value
  }));
};
CRITICAL: Variable Naming Rules
NEVER reuse generic variable names. Always use unique prefixes:
javascript// ❌ BAD - Conflicts across components
const isFieldTouched = touchedFields[field.id];

// ✅ GOOD - Unique per field type  
const isSSNTouched = touchedFields[field.id];
const isDateTouched = touchedFields[field.id];
Smart Field Implementation
Each field type in renderField() switch statement:
javascriptcase 'ssn':
  const ssnDigits = (value || '').replace(/\D/g, '');
  const isSSNTouched = touchedFields[field.id];
  // ... implementation
  
case 'international-phone':
  const phoneValue = currentData[field.id] || {};
  const isPhoneTouched = touchedFields[field.id];
  // ... implementation
Address Formatting Constants
javascriptconst addressFormats = {
  'United States': {
    stateRequired: true,
    postalFormat: /^\d{5}(-\d{4})?$/,
    states: [/* all US states */]
  },
  'Canada': {
    postalFormat: /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/,
    // ... format rules
  }
}
Form Accuracy Requirements

Only include fields that appear on official forms
Reference specific form sections (e.g., "Form I-129F, Page 3, Item 23")
Remove any "nice to have" fields not required by USCIS