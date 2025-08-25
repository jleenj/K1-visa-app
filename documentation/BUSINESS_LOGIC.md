# K-1 Visa Product Logic & Requirements

## Target Users
- U.S. citizens filing K-1 petitions for their foreign fiancé(e)s
- Excludes: LPRs (cannot file K-1), married couples (need different visa)

## Form Requirements by Section

### Section 1: U.S. Citizen Sponsor (Form I-129F)
**1.1 Personal Information** ✅ Complete
- Legal names, DOB, place of birth, physical description
- SSN, A-Number, USCIS account number
- U.S. citizenship acquisition method
- Certificates of naturalization/citizenship (if applicable)

**1.2 Contact Information** ✅ Complete  
- Email, phone numbers (international support)
- Newsletter opt-in (business feature)

**1.3 Address History** ✅ Complete
- Mailing address (with "In Care Of" option)
- Physical address (if different)
- 5-year address history with smart gap detection
- Places lived since age 18

**1.4 Marital History** (Partial)
- Current status: Single/Divorced/Widowed only (K-1 requirement)
- Previous marriage details if applicable

**1.5-1.9** (To be implemented)
- Family background, employment, financial info, legal history

### Marital Status Logic - CRITICAL BUSINESS RULE
IF user selects "Married":
Ask: "Who are you married to?"
├─ Fiancé(e) → Ask location
│   ├─ In US → Route to AOS (I-485)
│   └─ Outside US → Route to CR-1/IR-1
└─ Someone else → Divorce requirement warning

## Smart Field Types (DO NOT RECREATE)
- `ssn` - Social Security with XXX-XX-XXXX formatting
- `international-phone` - Country selection + formatted phone
- `smart-email` - Email with provider dropdown
- `address` - Country-specific formatting and validation
- `height-converter` - ft/in ↔ cm conversion
- `weight` - lbs ↔ kg conversion
- `conditional-address-history` - 5-year requirement with gap detection
- `states-countries-list` - Places lived since 18 with date ranges
- And 10+ more (see code for complete list)

## Validation Patterns
Each field handles its own validation with unique variable names:
- `onFocus`: Hide errors (allows user to type)
- `onBlur`: Show errors (when leaving field)
- Use prefixes like `isSSNTouched`, `isDateTouched` (never generic names)