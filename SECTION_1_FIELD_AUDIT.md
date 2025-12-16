# Section 1 Field Audit - Sponsor vs Beneficiary

## Purpose
Audit Section 1 fields against the authoritative QUESTIONNAIRE_SECTION_STRUCTURE.md to ensure:
- Sponsor-only fields are NOT shown to beneficiary
- Beneficiary-only fields are NOT shown to sponsor
- Shared fields appear for both

**Source Document**: `documentation/QUESTIONNAIRE_SECTION_STRUCTURE.md` lines 26-72

---

## Screen 1: NAME

| Field | Sponsor | Beneficiary | Status |
|-------|---------|-------------|--------|
| Legal Last Name | ✅ Yes | ✅ Yes | BOTH |
| Legal First Name | ✅ Yes | ✅ Yes | BOTH |
| Middle Name | ✅ Yes | ✅ Yes | BOTH |
| Other Names Used | ✅ Yes | ✅ Yes | BOTH |
| Native Alphabet - Last Name | ❌ No | ✅ Yes | BENEFICIARY ONLY |
| Native Alphabet - First Name | ❌ No | ✅ Yes | BENEFICIARY ONLY |
| Native Alphabet - Middle Name | ❌ No | ✅ Yes | BENEFICIARY ONLY |

**Current Implementation**: ✅ CORRECT
- NameScreen properly handles native alphabet fields with beneficiary check

---

## Screen 2: CONTACT INFO

| Field | Sponsor | Beneficiary | Status |
|-------|---------|-------------|--------|
| Email Address | ✅ Yes | ✅ Yes | BOTH |
| Newsletter Checkbox | ✅ Yes | ✅ Yes | BOTH (optional) |
| Daytime Phone | ✅ Yes | ✅ Yes | BOTH |
| Mobile Phone | ✅ Yes | ✅ Yes | BOTH |

**Current Implementation**: ✅ CORRECT
- All fields shown for both

---

## Screen 3: BIRTHDATE

| Field | Sponsor | Beneficiary | Status |
|-------|---------|-------------|--------|
| Date of Birth | ✅ Yes | ✅ Yes | BOTH |
| Place of Birth - City | ✅ Yes | ✅ Yes | BOTH |
| Place of Birth - State/Province | ✅ Yes | ✅ Yes | BOTH |
| Place of Birth - Country | ✅ Yes | ✅ Yes | BOTH |

**Current Implementation**: ✅ CORRECT
- BirthdateScreen uses `birth-location` which handles all three fields

---

## Screen 4: CITIZENSHIP & IDENTIFICATION

| Field | Sponsor | Beneficiary | Status |
|-------|---------|-------------|--------|
| Country of Citizenship | ❌ No | ✅ Yes | BENEFICIARY ONLY |
| How did you obtain US citizenship? | ✅ Yes | ❌ No | SPONSOR ONLY |
| Certificate Question | ✅ Yes | ❌ No | SPONSOR ONLY |
| Certificate Number | ✅ Yes (cond) | ❌ No | SPONSOR ONLY |
| Certificate Issue Date | ✅ Yes (cond) | ❌ No | SPONSOR ONLY |
| Certificate Issue Place | ✅ Yes (cond) | ❌ No | SPONSOR ONLY |
| Social Security Number | ✅ Required | ⚠️ Optional | REQUIRED SPONSOR, OPTIONAL BENEFICIARY |
| A-Number | ✅ Yes | ✅ Yes | BOTH (optional) |
| USCIS Online Account | ✅ Yes | ❌ No | SPONSOR ONLY |

**Current Implementation Status**:
- ✅ Sponsor fields correct
- ⚠️ **ISSUE**: Beneficiary implementation needs review
  - Should show: Country of Citizenship, SSN (optional), A-Number
  - Should NOT show: Citizenship method, Certificate fields, USCIS Account

---

## Screen 5: BIOGRAPHIC & PHYSICAL INFORMATION

| Field | Sponsor | Beneficiary | Status |
|-------|---------|-------------|--------|
| Sex | ✅ Yes | ✅ Yes | BOTH |
| Ethnicity | ✅ Yes | ❌ No | **SPONSOR ONLY** ⚠️ |
| Race | ✅ Yes | ❌ No | **SPONSOR ONLY** ⚠️ |
| Height | ✅ Yes | ❌ No | **SPONSOR ONLY** ⚠️ |
| Weight | ✅ Yes | ❌ No | **SPONSOR ONLY** ⚠️ |
| Eye Color | ✅ Yes | ❌ No | **SPONSOR ONLY** ⚠️ |
| Hair Color | ✅ Yes | ❌ No | **SPONSOR ONLY** ⚠️ |

**Current Implementation Status**:
- ❌ **CRITICAL ISSUE**: All 7 fields showing for beneficiary
- ✅ Should show for beneficiary: **ONLY Sex**
- ❌ Should NOT show for beneficiary: Ethnicity, Race, Height, Weight, Eye Color, Hair Color

**Per QUESTIONNAIRE_SECTION_STRUCTURE.md lines 66-71**:
```
- Sex - **BOTH**
- Ethnicity - **SPONSOR ONLY**
- Race - **SPONSOR ONLY**
- Height - **SPONSOR ONLY**
- Weight - **SPONSOR ONLY**
- Eye Color - **SPONSOR ONLY**
- Hair Color - **SPONSOR ONLY**
```

---

## Summary of Issues Found

### 🔴 CRITICAL - Must Fix:

1. **PhysicalDescriptionScreen** (Screen 5)
   - **Problem**: Showing all 7 fields for beneficiary
   - **Fix**: Only show "Sex" field for beneficiary
   - **Impact**: 6 fields incorrectly shown to beneficiary

2. **CitizenshipScreen** (Screen 4)
   - **Problem**: Beneficiary fields not properly implemented
   - **Fix**:
     - Show: Country of Citizenship, SSN (optional), A-Number
     - Hide: Citizenship method, Certificates, USCIS Account
   - **Impact**: Wrong fields shown

---

## Action Items

### Immediate Fixes Required:

1. **Update PhysicalDescriptionScreen.jsx**
   ```javascript
   const physicalFields = isSponsor ? [
     // All 7 fields for sponsor
   ] : [
     // ONLY Sex field for beneficiary
     { id: 'beneficiarySex', label: 'Sex', type: 'select', options: ['Male', 'Female'], required: true }
   ];
   ```

2. **Update CitizenshipScreen.jsx**
   - Verify beneficiary fields match spec
   - Ensure sponsor fields are hidden from beneficiary

3. **Update sectionStructure.js**
   - Ensure beneficiary field definitions match spec
   - Remove sponsor-only fields from beneficiary section

---

## Reference: Official USCIS Forms

### I-129F (Petition for Fiancé) - Sponsor Completes:
- ALL fields in Section 1 for sponsor
- Ethnicity, Race, Height, Weight, Eye/Hair Color required

### DS-160 (Nonimmigrant Visa Application) - Beneficiary Completes:
- Basic info (name, DOB, citizenship)
- Sex only (not ethnicity/race/height/weight)
- Contact info

This explains why physical description fields are sponsor-only - they're for the I-129F form, not DS-160.

---

## Verification After Fixes

After fixes applied, verify:
- [ ] Sponsor BIOGRAPHIC screen shows all 7 fields
- [ ] Beneficiary BIOGRAPHIC screen shows ONLY Sex field
- [ ] Sponsor CITIZENSHIP shows all sponsor fields
- [ ] Beneficiary CITIZENSHIP shows: Country, SSN (optional), A-Number only
- [ ] No beneficiary can access sponsor-only fields
- [ ] No sponsor missing required fields

---

**Status**: Issues identified, ready for fixes
**Priority**: HIGH - Collecting wrong data from users
**Impact**: Could cause form submission errors or incorrect data collection
