# \# K-1 Visa Application System

# 

# \## Project Overview

# Comprehensive questionnaire system for K-1 visa applications covering Forms I-129F, I-134, and DS-160.

# 

# \## Target Users

# \- U.S. citizens filing K-1 petitions for their foreign fiancé(e)s (Form I-129F)

# \- Foreign fiancé(e)s of U.S. citizens completing their visa application (Form DS-160)

# \- Excludes: LPRs (cannot file K-1), married couples (need different visa)

# 

# \## Technology Stack

# \- React with functional components and hooks

# \- State: useState with currentData object

# \- Styling: Tailwind CSS utility classes only

# \- Icons: Lucide React

# \- No localStorage/sessionStorage (not supported)

# 

# \## State Management Pattern

# ```javascript

# const \[currentData, setCurrentData] = useState({});

# const \[fieldErrors, setFieldErrors] = useState({});

# const \[touchedFields, setTouchedFields] = useState({});

# 

# const updateField = (field, value) => {

# &nbsp; setCurrentData(prev => ({

# &nbsp;   ...prev,

# &nbsp;   \[field]: value

# &nbsp; }));

# };

# ```

# 

# \## Smart Fields (DO NOT RECREATE)

# \- `ssn` - Social Security with XXX-XX-XXXX formatting

# \- `international-phone` - Country selection + formatted phone

# \- `smart-email` - Email with provider dropdown

# \- `address` - Country-specific formatting and validation

# \- `height-converter` - ft/in ↔ cm conversion

# \- `weight` - lbs ↔ kg conversion

# \- `conditional-address-history` - 5-year requirement with gap detection

# \- `states-countries-list` - Places lived since 18 with date ranges

# \- And 10+ more (see code for complete list)

# 

# \*\*Before creating any new field type, always check what already exists by scanning the renderField() switch statement.\*\*

# 

# \## CRITICAL DEVELOPMENT RULES

# 

# \### Variable Naming - NEVER VIOLATE

# \- NEVER reuse generic variable names like `isFieldTouched`

# \- Always use unique prefixes: `isSSNTouched`, `isDateTouched`, `isPhoneTouched`

# \- Test variable uniqueness across all case statements

# 

# \### Code Quality Standards

# 1\. \*\*Check existing code first\*\* - Never assume what exists, always verify

# 2\. \*\*Unique variable names\*\* - Use prefixes, never generic names

# 3\. \*\*Form accuracy\*\* - Only include fields actually on official forms

# 4\. \*\*No duplicate logic\*\* - Reuse existing smart fields, don't recreate

# 

# \### Validation Patterns

# \- `onFocus`: Hide errors (allows user to type)

# \- `onBlur`: Show errors (when leaving field)

# \- Each field handles its own validation

# \- Support international formats (phone, address, postal codes)

# \- Provide helpful user guidance and format examples

# \- Use prefixes like `isSSNTouched`, `isDateTouched` (never generic names)

# 

# \## CRITICAL: Variable Naming Rules

# NEVER reuse generic variable names. Always use unique prefixes:

# ```javascript

# // ❌ BAD - Conflicts across components

# const isFieldTouched = touchedFields\[field.id];

# 

# // ✅ GOOD - Unique per field type  

# const isSSNTouched = touchedFields\[field.id];

# const isDateTouched = touchedFields\[field.id];

# ```

# 

# \## Smart Field Implementation

# Each field type in renderField() switch statement:

# ```javascript

# case 'ssn':

# &nbsp; const ssnDigits = (value || '').replace(/\\D/g, '');

# &nbsp; const isSSNTouched = touchedFields\[field.id];

# &nbsp; // ... implementation

# &nbsp; 

# case 'international-phone':

# &nbsp; const phoneValue = currentData\[field.id] || {};

# &nbsp; const isPhoneTouched = touchedFields\[field.id];

# &nbsp; // ... implementation

# ```

# 

# \## Smart Field Guidelines

# \- Each field type handles its own validation

# \- Use `onFocus`/`onBlur` pattern for error display

# \- Support international formats (phone, address, postal codes)

# \- Provide helpful user guidance and format examples

# 

# \## ERROR HANDLING APPROACH

# \- Show validation errors only onBlur (not while typing)

# \- Use clear, user-friendly error messages (not technical jargon)

# \- Provide specific guidance ("Please enter all 9 digits" vs "Invalid format")

# \- Show examples BEFORE users make mistakes ("Format: XXX-XX-XXXX" for SSN)

# \- Use positive messaging when possible ("✅ Looks good!" vs just showing red errors)

# \- Don't overwhelm users with multiple errors at once - prioritize required field errors over format errors

# \- For country-specific fields (phone, address), show format examples that match selected country

# \- Include "Why we need this" explanations for sensitive fields using info panels or help text

# \- Provide escape hatches for edge cases ("Can't find your situation? Contact support")

# \- Auto-fix common input issues when possible (remove extra spaces, format postal codes automatically)

# \- Use both visual indicators (red borders) AND text messages for accessibility

# 

# \## BUSINESS LOGIC PRIORITIES

# 1\. \*\*User experience\*\* - Clear, helpful error messages

# 2\. \*\*Form compliance\*\* - Match official USCIS requirements exactly

# 3\. \*\*International support\*\* - Handle multiple countries properly

# 4\. \*\*Smart defaults\*\* - Auto-populate when possible (address history, etc.)

# 

# \## FORM ACCURACY REQUIREMENTS

# \- Only include fields that appear on official forms

# \- Reference specific form sections (e.g., "Form I-129F, Page 3, Item 23")

# \- Remove any "nice to have" fields not required by USCIS

# 

# \## NEVER IMPLEMENT

# \- Generic variable names that could conflict

# \- Fields not on official forms

# \- localStorage/sessionStorage (not supported in Claude artifacts)

# \- Duplicate smart field logic

# 

# \## DEVELOPMENT PROCESS

# 1\. \*\*Always scan existing smart fields\*\* before creating new ones

# 2\. \*\*Test variable uniqueness\*\* across all case statements

# 3\. \*\*Reference official forms\*\* for field requirements

# 4\. \*\*Maintain consistent patterns\*\* with existing implementations

# 

# \## Key Commands

# \- npm run dev - Start development server

# \- npm run build - Build for production

# \- npm run lint - Run linting

