# Section 1 (Personal Information) - Verification Checklist

## Purpose
Verify that ALL fields in Section 1 render IDENTICALLY to the original App.tsx implementation.
This ensures no functionality was lost during the FieldRenderer migration.

---

## Screen 1: NAME

### Fields to Verify (4 fields total):

#### 1. Legal Last Name (Family Name)
- [ ] **Type**: Text input
- [ ] **Label**: "Legal Last Name (Family Name)"
- [ ] **Required**: Yes (red asterisk shows)
- [ ] **Validation**: Shows error if empty when trying to proceed

#### 2. Legal First Name (Given Name)
- [ ] **Type**: Text input
- [ ] **Label**: "Legal First Name (Given Name)"
- [ ] **Required**: Yes (red asterisk shows)
- [ ] **Validation**: Shows error if empty when trying to proceed

#### 3. Middle Name
- [ ] **Type**: Text input
- [ ] **Label**: "Middle Name"
- [ ] **Required**: No (no asterisk)
- [ ] **Can be left empty**: Yes

#### 4. Other Names Used
- [ ] **Type**: `other-names` (dynamic list)
- [ ] **Label**: "Other Names Used (aliases, maiden name, nicknames)"
- [ ] **Features**:
  - [ ] Shows "+ Add another name" button
  - [ ] Each entry has 3 fields: Last Name, First Name, Middle Name
  - [ ] Each entry has "Remove this name" button
  - [ ] Can add multiple entries
  - [ ] Can remove any entry

---

## Screen 2: CONTACT INFO

### Fields to Verify (4 fields total):

#### 1. Email Address
- [ ] **Type**: `smart-email`
- [ ] **Label**: "Email Address"
- [ ] **Required**: Yes
- [ ] **Features**:
  - [ ] Shows "local part" input @ "domain" dropdown
  - [ ] Domain dropdown includes: gmail.com, yahoo.com, outlook.com, hotmail.com, icloud.com, Other
  - [ ] If "Other" selected, shows text input for custom domain
  - [ ] Email validation (shows error for invalid format)

#### 2. Newsletter Checkbox
- [ ] **Type**: `checkbox`
- [ ] **Text**: "Keep me informed about immigration policy changes, news, and updates that may affect my case"
- [ ] **Required**: No
- [ ] **Label hidden**: Yes (hideLabel: true)
- [ ] Can be checked/unchecked

#### 3. Daytime Phone Number
- [ ] **Type**: `international-phone`
- [ ] **Label**: "Daytime Phone Number"
- [ ] **Required**: Yes
- [ ] **Features**:
  - [ ] Country code dropdown with flags (🇺🇸 US, 🇨🇦 Canada, 🇬🇧 UK, etc.)
  - [ ] Phone number input with country-specific formatting
  - [ ] US format: (XXX) XXX-XXXX
  - [ ] Validation for phone number format

#### 4. Mobile Phone Number
- [ ] **Type**: `international-phone`
- [ ] **Label**: "Mobile Phone Number"
- [ ] **Required**: No
- [ ] **Features**: Same as Daytime Phone (country dropdown + formatting)

---

## Screen 3: BIRTHDATE

### Fields to Verify (2 fields total):

#### 1. Date of Birth
- [ ] **Type**: `date`
- [ ] **Label**: "[SponsorFirstName]'s Date of Birth" (dynamic with user's first name)
- [ ] **Required**: Yes
- [ ] **Features**:
  - [ ] Date picker input
  - [ ] "Unknown" checkbox option
  - [ ] When "Unknown" checked, date input disabled
  - [ ] Validation: Cannot be future date

#### 2. Place of Birth
- [ ] **Type**: `birth-location`
- [ ] **Label**: "Place of Birth"
- [ ] **Required**: Yes
- [ ] **Features**:
  - [ ] Country dropdown
  - [ ] City text input
  - [ ] State/Province dropdown (if applicable for selected country)
  - [ ] For US: Shows all 50 states + DC
  - [ ] For Canada: Shows all provinces/territories
  - [ ] For other countries: Shows appropriate provinces if defined
  - [ ] State label changes based on country ("State", "Province", "Region", etc.)

---

## Screen 4: CITIZENSHIP & IDENTIFICATION

### Fields to Verify (8 fields total, 3 conditional):

#### 1. Social Security Number
- [ ] **Type**: `ssn`
- [ ] **Label**: "Social Security Number"
- [ ] **Required**: Yes
- [ ] **Features**:
  - [ ] Auto-formats as XXX-XX-XXXX
  - [ ] Validation: Must be exactly 9 digits
  - [ ] Shows format example: "Format: XXX-XX-XXXX"
  - [ ] Only accepts numbers

#### 2. USCIS File Number (A-Number)
- [ ] **Type**: `a-number`
- [ ] **Label**: "USCIS File Number (A-Number) if any"
- [ ] **Required**: No
- [ ] **Features**:
  - [ ] Optional field
  - [ ] Has expandable help section (click to show more info)
  - [ ] Format guidance shown when expanded

#### 3. USCIS Online Account Number
- [ ] **Type**: `uscis-account`
- [ ] **Label**: "USCIS Online Account Number (if any)"
- [ ] **Required**: No
- [ ] **Features**:
  - [ ] Optional field
  - [ ] Has expandable help section

#### 4. How did you obtain U.S. citizenship?
- [ ] **Type**: `citizenship-method`
- [ ] **Label**: "How did you obtain U.S. citizenship?"
- [ ] **Required**: Yes
- [ ] **Options**:
  - [ ] Birth in the United States
  - [ ] Birth abroad to U.S. citizen parent(s)
  - [ ] Naturalization
  - [ ] Acquisition after birth through parents
- [ ] **Features**:
  - [ ] Dropdown select
  - [ ] May have help text/tooltips for each option

#### 5. Certificate Question
- [ ] **Type**: `cert-question`
- [ ] **Label**: "Do you have a Certificate of Naturalization or Certificate of Citizenship in your own name?"
- [ ] **Required**: Yes
- [ ] **Features**:
  - [ ] Radio buttons: Yes / No
  - [ ] Shows detailed help text explaining the question
  - [ ] When "Yes" selected → shows 3 additional fields below

#### 6. Certificate Number (conditional)
- [ ] **Type**: `cert-number`
- [ ] **Label**: "Certificate Number"
- [ ] **Required**: Yes (if certificate = Yes)
- [ ] **Shows only when**: sponsorHasCertificate === 'Yes'
- [ ] **Features**:
  - [ ] Text input
  - [ ] Has help text about where to find the number

#### 7. Date of Issuance (conditional)
- [ ] **Type**: `date`
- [ ] **Label**: "Date of Issuance"
- [ ] **Required**: Yes (if certificate = Yes)
- [ ] **Shows only when**: sponsorHasCertificate === 'Yes'
- [ ] **Features**: Same as DOB date picker

#### 8. Place of Issuance (conditional)
- [ ] **Type**: `cert-place`
- [ ] **Label**: "Place of Issuance"
- [ ] **Required**: Yes (if certificate = Yes)
- [ ] **Shows only when**: sponsorHasCertificate === 'Yes'
- [ ] **Features**:
  - [ ] City and State picker
  - [ ] US states dropdown

---

## Screen 5: BIOGRAPHIC & PHYSICAL INFORMATION

### Fields to Verify (7 fields total):

#### 1. Sex
- [ ] **Type**: `select`
- [ ] **Label**: "Sex"
- [ ] **Required**: Yes
- [ ] **Options**: Male, Female
- [ ] **Help text**: "Please note: Starting January 2025, USCIS made the decision to recognize only two biological sexes - male and female - on all immigration forms."
- [ ] **Features**:
  - [ ] Dropdown select
  - [ ] Help text displays below

#### 2. Ethnicity
- [ ] **Type**: `select`
- [ ] **Label**: "Ethnicity"
- [ ] **Required**: Yes
- [ ] **Options**:
  - [ ] Hispanic or Latino
  - [ ] Not Hispanic or Latino

#### 3. Race
- [ ] **Type**: `multi-select` ⚠️ THIS WAS THE BUG WE FIXED
- [ ] **Label**: "Race (Select all that apply)"
- [ ] **Required**: Yes
- [ ] **Features**:
  - [ ] Shows 5 CHECKBOXES (not text input!)
  - [ ] Options:
    - [ ] ☐ American Indian or Alaska Native
    - [ ] ☐ Asian
    - [ ] ☐ Black or African American
    - [ ] ☐ Native Hawaiian or Other Pacific Islander
    - [ ] ☐ White
  - [ ] Can select multiple checkboxes
  - [ ] Value stored as array

#### 4. Height
- [ ] **Type**: `height-converter`
- [ ] **Label**: "Height"
- [ ] **Required**: Yes
- [ ] **Features**:
  - [ ] Two input modes side-by-side:
    - [ ] Left: Feet (0-8) and Inches (0-11)
    - [ ] Right: Centimeters (0-300)
  - [ ] Bidirectional conversion (change feet/inches → updates cm, change cm → updates feet/inches)
  - [ ] Live conversion as you type
  - [ ] Both values stored

#### 5. Weight
- [ ] **Type**: `weight`
- [ ] **Label**: "Weight"
- [ ] **Required**: Yes
- [ ] **Features**:
  - [ ] Two input modes side-by-side:
    - [ ] Left: Pounds (lbs)
    - [ ] Right: Kilograms (kg)
  - [ ] Bidirectional conversion (change lbs → updates kg, change kg → updates lbs)
  - [ ] Live conversion as you type
  - [ ] Both values stored

#### 6. Eye Color
- [ ] **Type**: `select`
- [ ] **Label**: "Eye Color"
- [ ] **Required**: Yes
- [ ] **Options**:
  - [ ] Black
  - [ ] Blue
  - [ ] Brown
  - [ ] Gray
  - [ ] Green
  - [ ] Hazel
  - [ ] Maroon
  - [ ] Pink
  - [ ] Unknown/Other

#### 7. Hair Color
- [ ] **Type**: `select`
- [ ] **Label**: "Hair Color"
- [ ] **Required**: Yes
- [ ] **Options**:
  - [ ] Bald (No hair)
  - [ ] Black
  - [ ] Blonde
  - [ ] Brown
  - [ ] Gray
  - [ ] Red
  - [ ] Sandy
  - [ ] White
  - [ ] Unknown/Other

---

## Navigation & Validation

### Next Button Behavior:
- [ ] **NAME Screen**: Disabled until First Name AND Last Name filled
- [ ] **CONTACT INFO Screen**: Disabled until Email AND Daytime Phone filled
- [ ] **BIRTHDATE Screen**: Disabled until DOB AND Birth Location filled
- [ ] **CITIZENSHIP Screen**: Disabled until required fields filled (SSN, Citizenship Method, Certificate Question, and conditional cert fields if Yes)
- [ ] **BIOGRAPHIC Screen**: Disabled until all 7 fields filled

### Back Button:
- [ ] NAME screen: No back button (first screen)
- [ ] All other screens: Back button shows and works

### Navigation Flow:
- [ ] NAME → CONTACT INFO
- [ ] CONTACT INFO → BIRTHDATE
- [ ] BIRTHDATE → CITIZENSHIP
- [ ] CITIZENSHIP → BIOGRAPHIC
- [ ] BIOGRAPHIC → Partner's NAME (beneficiary section)

---

## Critical Differences from Old App.tsx

### What Changed:
1. **Labels rendered separately**: In the new system, labels are rendered by the screen component (outside FieldRenderer)
2. **Field types grouped**: All fields of same type now use identical rendering logic from FieldRenderer

### What Stayed the Same:
1. **All validation logic**: Exact same error messages and rules
2. **All field options**: Same dropdowns, same choices
3. **All help text**: Same tooltips and guidance
4. **All conditional logic**: showWhen functions work identically
5. **All formatting**: SSN, phone numbers, height/weight conversions all identical

---

## Testing Instructions

### For Each Screen:
1. **Navigate to the screen**
2. **Check every field exists** with correct label
3. **Check field type matches** (text input, dropdown, checkboxes, etc.)
4. **Try filling out the field** - verify it works
5. **Check validation** - leave required fields empty, try Next button
6. **Check special features**:
   - Dynamic lists (Other Names)
   - Conversions (Height/Weight)
   - Conditional fields (Certificate details)
   - Format validation (SSN, Email, Phone)
7. **Compare with original App.tsx** if you see anything suspicious

### Red Flags to Watch For:
- ⚠️ Field missing entirely
- ⚠️ Wrong field type (text instead of dropdown, dropdown instead of checkboxes)
- ⚠️ Missing options in dropdowns
- ⚠️ Missing help text or tooltips
- ⚠️ Validation not working
- ⚠️ Formatting not applying (SSN, phone)
- ⚠️ Conditional fields not showing/hiding
- ⚠️ Conversions not working (height/weight)

---

## Summary

**Total Fields in Section 1 (Sponsor)**: 25 fields
- NAME: 4 fields
- CONTACT INFO: 4 fields
- BIRTHDATE: 2 fields
- CITIZENSHIP: 8 fields (5 always shown, 3 conditional)
- BIOGRAPHIC: 7 fields

**Field Types Used**: 12 unique types
- text (3 fields)
- other-names (1 field)
- smart-email (1 field)
- checkbox (1 field)
- international-phone (2 fields)
- date (2 fields)
- birth-location (1 field)
- ssn (1 field)
- a-number (1 field)
- uscis-account (1 field)
- citizenship-method (1 field)
- cert-question (1 field)
- cert-number (1 field)
- cert-place (1 field)
- select (4 fields)
- multi-select (1 field) ← THE ONE WE FIXED
- height-converter (1 field)
- weight (1 field)

All these field types are now in FieldRenderer.jsx and should render identically to App.tsx.

---

## Status: Ready for Testing

✅ All field types copied to FieldRenderer
✅ All Section 1 screens using FieldRenderer
✅ Build successful with no errors
⏳ Awaiting user verification testing
