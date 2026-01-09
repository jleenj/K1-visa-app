# K-1 Visa Application - Comprehensive Audit Findings
**Date:** December 24, 2024
**Scope:** All 7 sections (Personal Information, Relationship, Address History, Family Background, Employment History, Legal & Security, Previous Petitions & Affidavits)
**Coverage:** Both Sponsor and Beneficiary paths

---

## EXECUTIVE SUMMARY

**Total Issues Found:** 70 issues across all sections
- **Critical:** 11 active issues (must fix before launch)
- **High:** 8 active issues (fix this sprint)
- **Medium:** 23 active issues (next sprint)
- **Low:** 8 active issues (tech debt backlog)
- **Resolved/Invalid:** 6 issues
- **Out of Scope:** 14 issues (Financial section not being worked on)

**Most Critical Findings:**
1. Required field validation gaps - users can skip SSN, phone, email, address fields
2. Phone country support limited to 5 countries - blocks most K-1 beneficiaries
3. Standalone disqualification screens needed - users waste time on invalid applications
4. useEffect infinite loop risk in Section 7 - could freeze browser

---

## 🔴 CRITICAL ISSUES (Must Fix Before Launch)

### Issue #23 & #44: Missing Standalone Disqualification Screens
**Status:** NOT STARTED
**Priority:** CRITICAL
**Sections Affected:** Section 2 (Relationship), Section 6 (Criminal History), Section 7 (Previous Petitions)

**Problem:**
Currently, disqualifying answers show inline red warning boxes. Users might miss warnings and continue through questionnaire, wasting time on applications that cannot be submitted.

**User Requirements (Discussed in Detail):**
- When user selects disqualifying answer → navigate to standalone screen
- Standalone screen has NO navigation panels (top or side)
- Only TWO options available:
  1. **"Go Back" button** - clears that specific answer AND returns to exact question screen
  2. **"Contact Support" button** - provides email/phone contact info
- "Contact Support" should NOT be visible elsewhere in the app
- NO option to continue for informational purposes
- NO worlds where users can proceed after disqualification

**Disqualifying Questions:**
- Section 2: "Legally free to marry?" → No
- Section 2: "Met in person?" → No + "Not in next 3 months"
- Section 7: "How many I-129F petitions filed?" → 2 or more
- Section 6: Any "Yes" answer to criminal history questions

**Implementation Steps:**
1. Create `<DisqualificationStandaloneScreen>` component
2. Add routing/navigation logic
3. Update all affected sections
4. Test back button clears only disqualifying answer
5. Verify no escape routes exist

---

### Issue #20: useEffect Infinite Loop Risk in Section 7
**Status:** NOT STARTED
**Priority:** CRITICAL
**Files:** Section 7 subsection screens (PreviousSponsorshipsScreen, OtherObligationsScreen, HouseholdMembersScreen)

**Problem:**
useEffect syncs local state to parent with array dependencies. Arrays get new references every render, could trigger infinite re-render loop and freeze browser.

**Solution Chosen:** Option C - Controlled Component Pattern
- Move ALL state management to parent (Section1_7.jsx)
- Child components become "dumb" display components
- No useEffect syncing needed
- Parent owns single source of truth

**Benefits:**
- Clean architecture
- No sync issues
- Prevents all race conditions
- Best long-term solution

**Files to Refactor:**
- `src/components/screens/section7/PreviousSponsorshipsScreen.jsx`
- `src/components/screens/section7/OtherObligationsScreen.jsx`
- `src/components/screens/section7/HouseholdMembersScreen.jsx`
- `src/components/sections/Section1_7.jsx` (parent)

---

### Issue #51: SSN Field - No Validation for Empty Required Fields
**Status:** NOT STARTED
**Priority:** CRITICAL
**Location:** `FieldRenderer.jsx` lines 1206-1250
**Section:** Section 1 (Personal Information)

**Problem:**
SSN field only validates partial entries (1-8 digits), not empty fields. Required SSN can be completely blank without error.

**Code Issue:**
```javascript
// Current - WRONG
const showSSNError = isSSNFieldTouched && field.required &&
  ssnDigits.length > 0 && ssnDigits.length < 9;
// Only errors if user typed 1-8 digits, NOT if empty
```

**Fix:**
```javascript
const showSSNError = isSSNFieldTouched && field.required && (
  ssnDigits.length === 0 || // NEW: Catch empty required fields
  (ssnDigits.length > 0 && ssnDigits.length < 9)
);
```

**Impact:** Required sponsor SSN could be missing, violating USCIS Form I-129F requirements.

---

### Issue #52: Phone Field - Required Field Validation Gap
**Status:** NOT STARTED
**Priority:** CRITICAL
**Location:** `FieldRenderer.jsx` lines 1150-1204
**Section:** Section 1 (Personal Information)

**Problem:**
Phone validation only triggers when user enters SOME number. Empty required phone fields show no error.

**Fix:**
```javascript
const showPhoneError = isPhoneFieldTouched && field.required && (
  !phoneNumberValue || // NEW: Catch empty required fields
  phoneDigits < minDigits
);
```

**Impact:** Missing required contact info could delay USCIS processing or result in RFE.

---

### Issue #53: Email Field - Incomplete Validation for Required Fields
**Status:** NOT STARTED
**Priority:** CRITICAL
**Location:** `FieldRenderer.jsx` lines 1056-1148
**Section:** Section 1 (Personal Information)

**Problem:**
`validateEmail()` returns `{ isValid: true }` when email object is completely empty. Required email fields can be blank.

**Fix:**
```javascript
const validateEmail = (emailObj, isRequired = false) => {
  if (!emailObj || (!emailObj.localPart && !emailObj.domain)) {
    return isRequired
      ? { isValid: false, message: '⚠️ Email address is required' }
      : { isValid: true, message: '' };
  }
  // ... rest of validation
}
```

**Impact:** Missing sponsor email means USCIS cannot contact petitioner.

---

### Issue #54: Address Field - Missing Required Field Validation
**STATUS:** NOT STARTED
**Priority:** CRITICAL
**Location:** `FieldRenderer.jsx` lines 1729-1912
**Section:** Section 3 (Address History)

**Problem:**
Address field has NO validation to check if required fields (country, street, city, state, zipCode) are filled. No onBlur validation or error messaging exists.

**Impact:**
- Missing address = USCIS cannot send official notices
- Legal requirement violation
- Potential petition rejection

**Fix:**
Add comprehensive validation for all required address subfields with touched state tracking and error displays.

---

### Issue #55: States-Countries-List Hardcoded for Sponsor Only
**Status:** NOT STARTED (Currently Not Broken)
**Priority:** CRITICAL (Future Bug)
**Location:** `FieldRenderer.jsx` lines 2936-3150
**Section:** Section 3 (Address History)

**Problem:**
The `states-countries-list` field is hardcoded to only check `sponsorDOB` and sponsor-specific fields. Will fail when used for beneficiary.

**Current Status:**
Not broken because `sectionStructure.js` doesn't use this for beneficiary yet. However, it's marked as a reusable smart field.

**Fix:**
Make field dynamic based on field.id to detect sponsor vs beneficiary and use appropriate field names.

---

### Issue #63: Phone Validation - Only 5 Countries Supported
**Status:** NOT STARTED
**Priority:** CRITICAL (Blocks Most Beneficiaries)
**Location:** `App.tsx` lines 66-84, `FieldRenderer.jsx` lines 78-84
**Section:** Section 1 (Personal Information)

**Problem:**
Phone countries array only includes: US, CA, GB, AU, DE. Most K-1 beneficiaries are from Philippines, India, Mexico, Brazil, Vietnam, etc.

**User Impact:**
Beneficiaries cannot enter their phone numbers properly. Must select wrong country, enter number in wrong format.

**Fix:**
Install `libphonenumber-js` and use comprehensive country list with proper validation.

```bash
npm install libphonenumber-js
```

---

### Issue #68: Blood/Adoption Relationship Warnings Missing Without State
**Status:** NOT STARTED
**Priority:** CRITICAL
**Location:** `Section1.jsx` lines 67-103 (checkBloodRelationship, checkAdoptionRelationship functions)
**Section:** Section 2 (Relationship)
**Discovered:** December 24, 2024 during Issue #23 implementation

**Problem:**
Users can select universally illegal relationships (siblings, parent-child, aunt/nephew) WITHOUT selecting a marriage state first. No validation or warning appears because validation checks only run when `marriageState` exists.

**Code Issue:**
```javascript
// Line 69 - PROBLEM
const checkBloodRelationship = () => {
  if (!marriageState || !bloodRelationship) return { allowed: true };
  // Returns true if no state selected - WRONG for universal prohibitions
```

**User Scenario:**
1. User skips Q5 "Which U.S. state do you plan to marry in?"
2. User goes to Q6 "Are you related?"
3. User selects "Yes" → "Related by blood" → "Siblings"
4. NO WARNING appears (validation requires marriageState)
5. User continues, unaware sibling marriage is illegal everywhere

**Impact:**
- Users with universally illegal relationships don't see disqualification
- Could submit invalid applications
- Wastes user time and creates false expectations

**Fix:**
Update validation to check universal prohibitions WITHOUT requiring state:
```javascript
const checkBloodRelationship = () => {
  if (!bloodRelationship) return { allowed: true };

  // Universal disqualifications (illegal everywhere)
  if (bloodRelationship === 'closer-than-first-cousins' ||
      bloodRelationship === 'aunt-uncle-niece-nephew') {
    return { allowed: false, requiresStop: true };
  }

  // State-specific rules (only if state selected)
  if (marriageState && (bloodRelationship === 'first-cousins' ||
                        bloodRelationship === 'first-cousins-once-removed')) {
    const allowed = canFirstCousinsMarry(marriageState);
    return { allowed, requiresStop: false, stateName: stateMarriageLaws[marriageState]?.name };
  }

  return { allowed: true };
};
```

**Related:** Ties into Issue #23 (standalone disqualification screens)

---

### Issue #69: Yellow Warnings Don't Disable "Next" Button
**Status:** NOT STARTED
**Priority:** CRITICAL
**Location:** `Section1.jsx` lines 497-503, 703-709, 781-787
**Section:** Section 2 (Relationship)
**Discovered:** December 24, 2024 during Issue #23 implementation

**Problem:**
Yellow warning boxes (age requirements, first cousin state restrictions, adopted sibling restrictions) allow users to click "Next" and proceed with invalid state selections.

**User Scenario:**
1. User age 17, selects Nebraska (minimum age 19)
2. Yellow warning appears: "In Nebraska, the minimum age to marry is 19..."
3. User ignores warning
4. User clicks "Next" button
5. Invalid state selection submitted to backend

**Current Warnings That Don't Block:**
- Age requirement not met for selected state
- First cousin marriage not allowed in selected state
- Adopted sibling marriage not allowed in selected state
- Word count warning (300+ words) - this one is informational only

**Impact:**
- Users submit applications with invalid state selections
- USCIS will reject or request evidence
- Damages user trust in platform

**Fix Options:**

**Option A: Disable Next Button (Recommended)**
Add validation that blocks navigation:
```javascript
const hasYellowWarnings =
  (marriageState && !ageCheck.met) ||
  (bloodRelationship && !bloodCheck.allowed && !bloodCheck.requiresStop) ||
  (adoptionRelationship === 'adopted-siblings' && !adoptionCheck.allowed);

// Pass to parent via onValidationChange prop
useEffect(() => {
  if (onValidationChange) {
    onValidationChange(!hasYellowWarnings);
  }
}, [hasYellowWarnings]);
```

**Option B: Use Standalone Screens**
Treat yellow warnings as disqualifications with "Change State" guidance.

**Decision Needed:** User to choose Option A or B

---

### Issue #70: Opacity Cascade Creates Confusing Disabled Questions
**Status:** NOT STARTED
**Priority:** HIGH
**Location:** `Section1.jsx` lines 262, 372, 426, 472, 507, 842
**Section:** Section 2 (Relationship)
**Discovered:** December 24, 2024 during Issue #23 implementation

**Problem:**
When user triggers disqualification, subsequent questions are grayed out (opacity-50 pointer-events-none) but still visible. Creates confusing UI where users see disabled questions they can't interact with.

**Current Behavior:**
- User answers "No" to legally free to marry
- Red disqualification box appears
- ALL subsequent questions (Q2-Q7) turn gray with opacity-50
- User can see questions but can't click anything
- Questions take up visual space for no reason

**Impact:**
- Confusing UX - why show questions user can't answer?
- Creates visual clutter
- Makes page feel broken

**Fix:**
Remove opacity-cascade pattern when implementing standalone disqualification screens (Issue #23). Standalone screens completely hide questionnaire, making cascade unnecessary.

**Code to Delete:**
```javascript
// Line 262 - Delete this className condition
${legallyFree === 'no' ? 'opacity-50 pointer-events-none' : ''}

// Lines 372, 426, 472, 507, 842 - Delete similar conditions
```

**Related:** Will be fixed automatically when Issue #23 is implemented

---

## ⚠️ HIGH PRIORITY ISSUES (Fix This Sprint)

### Issue #10: Opacity Cascade Makes Form Flow Unclear
**Status:** NOT STARTED
**Priority:** HIGH
**File:** `Section1.jsx` (Lines 262, 372, 426, 472, 507, 842)
**Section:** Section 2 (Relationship)

**Problem:**
Multiple questions use `opacity-50 pointer-events-none` to disable subsequent questions. Creates cascading disabled state - users can't see full form or which answer unlocks form.

**Solution Options:**
1. Replace with standalone disqualification screens (ties into Issue #23)
2. Show all questions as read-only with explanation
3. Use stepper UI hiding future questions

---

### Issue #11: Marriage State Selection Requires Guessing
**Status:** NOT STARTED
**Priority:** HIGH
**File:** `Section1.jsx` (Lines 483-494)
**Section:** Section 2 (Relationship)

**Problem:**
User must guess which states allow marriage at their age. After selecting incompatible state, yellow warning appears. Requires trial-and-error.

**Solution Options:**
1. Filter dropdown to only show compatible states
2. Add inline helper showing requirements
3. Add search/filter by age requirement

---

### Issue #5: Age Validation Doesn't Auto-Update
**Status:** NOT STARTED
**Priority:** HIGH
**File:** `Section1.jsx` (Lines 49-65, 496-503)
**Section:** Section 2 (Relationship)

**Problem:**
User enters DOB, selects compatible state, then changes DOB to younger age. Validation doesn't re-run automatically. Shows outdated compatibility.

**Fix:**
Add DOB to validation dependencies, recalculate when DOB changes.

---

### Issue #58: Province Validation Inconsistency
**Status:** NOT STARTED
**Priority:** HIGH
**Location:** `FieldRenderer.jsx` lines 3360-3425
**Section:** Section 3 (Address History)

**Problem:**
Validation logic and UI rendering use different logic for determining which countries require provinces. Can show province field without requiring it.

**Fix:**
Align validation and UI logic to use same conditions.

---

### Issue #59: Timeline Overlap Detection Missing
**Status:** NOT STARTED
**Priority:** HIGH
**Location:** `FieldRenderer.jsx` lines 4103-5572
**Section:** Section 5 (Employment History)

**Problem:**
Timeline allows overlapping employment periods without validation during entry. User only sees overlap indicator in summary section.

**Impact:**
USCIS could question accuracy if overlaps aren't explained.

**Fix:**
Add real-time overlap detection with blue border and info message during entry.

---

### Issue #61: Yup Schema Built But Never Used
**Status:** NOT STARTED
**Priority:** HIGH
**Location:** `App.tsx` lines 12-54 (schema), `FieldRenderer.jsx` lines 3507-3780 (implementation)
**Section:** Section 4 (Family Background)

**Problem:**
Comprehensive `marriageHistorySchema` using Yup validation is defined but NEVER USED. Manual validation is less robust.

**Impact:**
- Incomplete marriage history data (missing names, dates)
- Violates USCIS form requirements
- Wasted engineering effort

**Fix:**
Either integrate Yup schema with react-hook-form OR remove unused schema.

---

### Issue #56: Height Converter - Confusing Unit Toggle Logic
**Status:** NOT STARTED
**Priority:** MEDIUM (bumped from audit's HIGH due to working correctly)
**Location:** `FieldRenderer.jsx` lines 1549-1655
**Section:** Section 1 (Personal Information)

**Problem:**
Code uses closure variables implicitly. Works correctly but very confusing for maintenance.

**Fix:**
Make conversion explicit with actual values passed to functions.

---

## 📋 MEDIUM PRIORITY ISSUES

### Issue #2: State Age Validation Shows But Doesn't Block
**Status:** NOT STARTED
**Priority:** MEDIUM
**File:** `Section1.jsx`
**Section:** Section 2 (Relationship)

**Problem:**
Yellow warning shows when state age requirement not met, but user can still click "Next" and proceed.

**Fix:**
Disable "Next" button when validation fails OR make error red/blocking.

---

### Issue #4: Future Meeting Date Allowed
**Status:** NOT STARTED
**Priority:** MEDIUM
**File:** `Section1.jsx`
**Section:** Section 2 (Relationship)

**Problem:**
User can select future meeting date (up to 3 months out). At submission, might not have actually met yet → USCIS rejects.

**Fix:**
Add validation at submission checking meeting date has passed OR disable future dates OR add clearer warning.

---

### Issue #12: Meeting Date Picker Too Restrictive
**Status:** NOT STARTED
**Priority:** MEDIUM
**File:** `Section1.jsx` (Lines 349-351)
**Section:** Section 2 (Relationship)

**Problem:**
Max date is 3 months from today. User with trip booked 4 months out can't select date, forced to choose "not in next 3 months" → gets disqualified.

**Fix:**
Allow wider date range (6-12 months) with adjusted messaging.

---

### Issue #18: Data Loss When Reducing Count
**Status:** PARTIALLY ADDRESSED
**Priority:** MEDIUM
**Files:** Section 7 subsections

**Problem:**
User selects "3 petitions", fills details, accidentally clicks "2" → third petition data deleted without warning.

**Fix:**
Add confirmation dialog showing which items will be deleted.

**Note:** Might be resolved by Issue #20 refactoring.

---

### Issue #22: Count vs Array Length Desync
**Status:** NOT STARTED
**Priority:** MEDIUM
**Files:** Section 7 subsections

**Problem:**
Two sources of truth: count state AND array.length. Can get out of sync, causes buttons to show/hide inconsistently.

**Fix:**
Use array.length as single source of truth OR ensure they always stay in sync.

**Note:** Likely resolved by Issue #20 refactoring.

---

### Issue #27: A-Number Validation Too Lenient
**Status:** NOT STARTED
**Priority:** MEDIUM
**Files:** Section 7, any A-Number fields

**Problem:**
Accepts any 7-9 digit number starting with "A". Doesn't validate actual A-Number format.

**Fix:**
Research valid A-Number prefixes/patterns, add regex validation.

---

### Issue #28: Children Checkbox Criteria Ambiguous
**Status:** NOT STARTED
**Priority:** MEDIUM
**File:** `HouseholdMembersScreen.jsx` (Lines 1343-1360)
**Section:** Section 7

**Problem:**
"Lived with me for at least 6 months" - unclear if CONTINUOUSLY or CUMULATIVELY.

**Fix:**
Add clarifying text: "(continuously for the past 6 months)".

---

### Issue #30: Receipt Number Format Not Validated
**Status:** NOT STARTED
**Priority:** MEDIUM
**File:** Section 7 (Lines 771-815)

**Problem:**
Accepts ANY 13-character alphanumeric. USCIS receipt numbers have specific prefixes (MSC, EAC, WAC, LIN, SRC).

**Fix:**
Add dropdown for service center prefix, validate format.

---

### Issue #46: "Worldwide Criminal History" Not Emphasized
**Status:** NOT STARTED
**Priority:** MEDIUM
**File:** `Section1_9.jsx`
**Section:** Section 6 (Criminal History)

**Problem:**
Intro mentions "any country" but it's buried. Users might think "US only".

**Fix:**
Add inline reminder on EACH question: "Remember: This includes incidents in ANY country".

---

### Issue #26: Current Spouse Warning Doesn't Block
**Status:** NOT STARTED
**Priority:** MEDIUM
**File:** Section 7 (Lines 725-747)

**Problem:**
Red warning shows if sponsored person is current spouse (can't sponsor fiancé while married), but user can still continue.

**Fix:**
Disable "Next" button OR treat as disqualifying (Issue #23).

---

### Issue #14: Switching Relationship Type Loses Data
**Status:** NOT STARTED
**Priority:** MEDIUM
**File:** `Section1.jsx` (Lines 564-605)
**Section:** Section 2 (Relationship)

**Problem:**
User selects "Blood relationship", fills details, accidentally clicks "Adoption" → all data vanishes without warning.

**Fix:**
Add confirmation dialog: "Switching will clear previous answers. Continue?"

---

### Issue #6: Bulk State Updates Could Lose Data
**Status:** NOT STARTED
**Priority:** MEDIUM
**File:** `Section1.jsx` (Lines 104-128)
**Section:** Section 2 (Relationship)

**Problem:**
Object.keys iteration calling updateField multiple times rapidly. Race conditions possible.

**Fix:**
Batch updates into single atomic call OR use functional state updates.

---

### Issue #7: No State Cleanup on Conditional Logic
**Status:** NOT STARTED
**Priority:** MEDIUM
**File:** `Section1.jsx` (Lines 537-543, 564-600)
**Section:** Section 2 (Relationship)

**Problem:**
When `areRelated` changes to "no", child fields reset but values might not persist to parent immediately.

**Fix:**
Ensure cleanup happens in same render cycle using callback pattern.

---

### Issue #57: Weight Converter - Duplicate Toggle Logic
**Status:** NOT STARTED
**Priority:** MEDIUM
**Location:** `FieldRenderer.jsx` lines 1656-1727
**Section:** Section 1 (Personal Information)

**Problem:**
Both lbs and kg buttons have identical toggle logic. Confusing code duplication, potential race condition.

**Fix:**
Create single toggle handler, simplify button onClick.

---

### Issue #62: Postal Code Validation Too Permissive
**Status:** NOT STARTED
**Priority:** MEDIUM
**Location:** `FieldRenderer.jsx` lines 1903-1907
**Section:** Section 3 (Address History)

**Problem:**
Shows orange warning for invalid format but doesn't block submission.

**Fix:**
Change to red error, add to required field validation.

---

### Issue #64: Auto-Add Entry State Update in Render
**Status:** NOT STARTED
**Priority:** MEDIUM
**Location:** `FieldRenderer.jsx` lines 3024-3028
**Section:** Section 3 (Address History)

**Problem:**
State update happens in render function (React anti-pattern). Could cause issues in React 18 Concurrent Mode.

**Fix:**
Move auto-add logic to "Yes" button click handler.

---

## ℹ️ LOW PRIORITY ISSUES (Tech Debt)

### Issue #47: No Global Error Boundary
**Status:** NOT STARTED
**Priority:** LOW

**Problem:**
No React Error Boundary. If any component throws error → white screen crash.

**Fix:**
Create `<ErrorBoundary>` component at App.tsx level showing friendly message.

---

### Issue #3: Second Cousin State Laws Not Checked
**Status:** NOT STARTED
**Priority:** LOW
**File:** `Section1.jsx` (Lines 695-709)

**Problem:**
"Second cousins or more" always returns allowed without checking state-specific restrictions.

**Fix:**
Research all 50 state laws, add to validation.

---

### Issue #13: Meeting Description Word Count Warning Unclear
**Status:** NOT STARTED
**Priority:** LOW
**File:** `Section1.jsx` (Lines 908-912)

**Problem:**
Warning at 300+ words says "consider shortening" but no explanation why.

**Fix:**
Add character limit OR clarify consequences.

---

### Issue #15: Help Text Expansion Not Persisted
**Status:** NOT STARTED
**Priority:** LOW
**File:** `Section1.jsx` (Lines 377-384)

**Problem:**
User expands "What is IMBRA?" → navigates away → comes back → collapsed again.

**Fix:**
Persist expansion state in currentData (very minor).

---

### Issue #29: Poverty Guidelines Hardcoded for 2025
**Status:** NOT STARTED
**Priority:** LOW (becomes MEDIUM in Jan 2026)
**File:** `HouseholdMembersScreen.jsx` (Lines 60-68)

**Problem:**
2025 poverty guidelines hardcoded, needs manual update annually.

**Fix:**
Add admin panel OR disclaimer showing year, set reminder for Jan 2026.

---

### Issue #45: Definition Panel Toggle Resets
**Status:** NOT STARTED
**Priority:** LOW
**File:** `Section1_9.jsx`

**Problem:** Same as Issue #15, minor UX annoyance.

---

### Issue #8: Too Many useEffect Dependencies
**Status:** NOT STARTED
**Priority:** LOW
**File:** `Section1.jsx` (Lines 104-128)

**Problem:**
17 dependencies in one useEffect makes debugging difficult.

**Fix:**
Split into multiple useEffects OR use useReducer.

---

### Issue #60: Timeline Coverage Edge Case Documentation
**Status:** NOT STARTED
**Priority:** LOW
**Location:** `FieldRenderer.jsx` lines 688-756

**Problem:**
Gap detection algorithm is mathematically sound but code complexity makes it hard to verify.

**Fix:**
Add extensive comments explaining the math.

---

### Issue #66: Marriage Schema Sponsor/Beneficiary Mismatch
**Status:** NOT STARTED
**Priority:** LOW
**Location:** `FieldRenderer.jsx` lines 3605-3645, `App.tsx` lines 18-19

**Problem:**
Yup schema requires spouse DOB/birth country for ALL marriages, but USCIS only requires this for beneficiary.

**Fix:**
Create separate schemas for sponsor vs beneficiary.

**Note:** Currently no impact since Yup schema unused (Issue #61).

---

### Issue #67: Timeline Entry Type Labels Inconsistent
**Status:** NOT STARTED
**Priority:** LOW
**Location:** `FieldRenderer.jsx` lines 4300-4314

**Problem:**
Labels like "Working Period" vs "Retired" have inconsistent structure.

**Fix:**
Standardize labels: "Employment", "Education", "Retired", etc.

---

## ❌ RESOLVED/INVALID ISSUES

### Issue #9: Disqualification with No Recovery - INVALID
**Status:** CLOSED
**Reason:** Users CAN change answers. Radio buttons not inside disabled area. Opacity only affects subsequent questions.

---

### Issue #16: IMBRA Waiver Logic Flaw - INVALID
**Status:** CLOSED
**Reason:** Current implementation is CORRECT. IMBRA applies to "filed 2+ petitions" regardless of active/expired status. User's logic is accurate.

---

### Issue #17: Household Size Calculation Wrong - INVALID
**Status:** CLOSED
**Reason:** Current implementation is CORRECT. I-134 only counts children who meet criteria (claimed on taxes OR lived with 6+ months). User's logic is accurate.

---

### Issue #19: "Add Another" Button Visibility - FIXED
**Status:** CLOSED
**Reason:** Already fixed in previous session. Condition changed from `=== 5` to `>= 5`.

---

### Issue #21: Remove Button Count Bug - FIXED
**Status:** CLOSED
**Reason:** Already fixed. Remove functions correctly don't update count in "5+" mode.

---

### Issue #42: Criminal History Performance - INVALID
**Status:** CLOSED
**Reason:** No text inputs exist, only yes/no radio buttons. No typing = no performance concern.

---

### Issue #65: Generic Variable Names - COMPLIANT
**Status:** CLOSED
**Reason:** All variable names use unique prefixes (isSSNTouched, isPhoneFieldTouched, etc.). CLAUDE.md rules followed correctly.

---

## 🚧 OUT OF SCOPE (Financial Section - Not Being Worked On)

**Issues #31-#41 deferred until Financial section work begins:**
- #31: localStorage usage
- #32: Exchange rate API failure fallback
- #33: Tax year calculation edge case
- #34: Asset type not required
- #35: Currency conversion race condition
- #36: Questionnaire history array growth
- #37: Negative home equity allowed
- #38: Reset confirmation broken
- #39: Switching modes deletes data
- #40: Asset currency display confusing
- #41: Retirement account type not enforced

---

## 🔍 ITEMS REQUIRING DECISION

### Issue #1: useEffect Dependency Warning
**Status:** NOT STARTED
**Priority:** MEDIUM
**File:** `Section1.jsx` (Lines 104-128)

**Problem:**
Missing `updateField` in dependencies OR needs useCallback wrapper.

**Action Needed:** Research if parent memoizes updateField.

---

### Issue #48: No State Persistence Strategy
**Status:** DEFERRED (OK for testing)
**Priority:** HIGH (before production)

**Current Status:** Data lost on page refresh - acceptable for testing.

**Before Production:**
- Add browser warning on page close
- Consider database auto-save

**User Decision:** Leave as-is for now, address before production.

---

## 📊 STATISTICS

**By Priority:**
- Critical: 9 active
- High: 7 active
- Medium: 23 active
- Low: 8 active
- Resolved/Invalid: 7
- Out of Scope: 14

**By Section:**
- Section 1 (Personal Info): 10 issues
- Section 2 (Relationship): 11 issues
- Section 3 (Address History): 8 issues
- Section 4 (Family Background): 3 issues
- Section 5 (Employment History): 3 issues
- Section 6 (Legal & Security): 2 issues
- Section 7 (Previous Petitions): 11 issues
- Section 8 (Financial): 14 issues (deferred)
- Cross-cutting: 5 issues

---

## 📝 HANDOFF NOTES

**Critical Context:**
1. User saved this audit in `documentation/dec24 audit findings.docx`
2. Persistent to-do list at `documentation/PERSISTENT_TODO_LIST.md`
3. Issue #23/#44 solution discussed in detail - user very clear about requirements
4. Issue #20 Option C chosen after full discussion
5. User wants ALL issues tracked, even low priority
6. Fix critical bugs FIRST across all sections before systematic fixes

**For Future Claude:**
1. Read this file FIRST when continuing work
2. Do NOT assume issues resolved unless marked "CLOSED"
3. Update this file as work progresses
4. Reference issue numbers when discussing fixes
5. This is the SINGLE SOURCE OF TRUTH for all audit findings

---

**END OF COMPREHENSIVE AUDIT**
