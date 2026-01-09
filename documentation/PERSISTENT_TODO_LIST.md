# K-1 Visa Application - Persistent To-Do List
**Last Updated:** December 24, 2024

---

## 🔴 CRITICAL PRIORITY (Must Fix Before Launch)

### Issue #23 & #44: Implement Standalone Disqualification Screens
**Status:** NOT STARTED
**Priority:** CRITICAL
**Affected Sections:** All sections with disqualifying questions (Section 2, Section 7, Section 6)

**Problem:**
- Currently, disqualifying answers show red warning boxes inline
- Users might miss warnings and continue wasting time
- Grayed-out cascading questions create confusing UX

**Solution Chosen:**
- Create standalone disqualification screen component
- When user selects disqualifying answer → navigate to standalone screen
- Standalone screen has:
  - ✅ NO navigation panels (top or side)
  - ✅ TWO options only:
    1. **"Go Back"** button - clears THAT answer AND returns to exact question screen
    2. **"Contact Support"** button - shows email/phone contact info
  - ✅ This "Contact Support" option should NOT be visible elsewhere
  - ✅ NO option to continue for informational purposes
  - ✅ Applies to ALL disqualifying questions across all sections

**Disqualifying Questions to Update:**
1. Section 2 (Relationship):
   - "Legally free to marry?" → No
   - "Met in person?" → No + "Not in next 3 months"
   - Any other disqualifying combinations

2. Section 7 (Previous Petitions):
   - "How many I-129F petitions filed?" → 2 or more

3. Section 6 (Criminal History):
   - Any "Yes" answer to criminal questions

**Implementation Steps:**
1. Create `<DisqualificationStandaloneScreen>` component
2. Add routing/navigation logic to redirect on disqualifying answers
3. Update all affected sections to use new component
4. Test back button clears only the disqualifying answer
5. Verify no navigation escape routes exist

**Notes from Discussion:**
- User was very clear: only TWO options (back or contact support)
- No worlds where users can continue after disqualification
- Contact support should ONLY appear on standalone screen

---

### Issue #20: useEffect Infinite Loop Risk in Section1_7.jsx
**Status:** NOT STARTED
**Priority:** CRITICAL (Technical Debt - Could Cause App Freeze)
**File:** `C:\Users\vnix8\Documents\k1-visa-app\src\components\screens\section7\*.jsx`

**Problem:**
- In all Section 7 subsection files (PreviousSponsorshipsScreen, OtherObligationsScreen, HouseholdMembersScreen)
- useEffect syncs local state to parent with array dependencies
- Arrays get new references every render → could trigger infinite re-render loop
- Example location: Section1_7.jsx lines 109-135

**Code Example of Problem:**
```javascript
useEffect(() => {
  updateField('previousPetitions', previousPetitions);
  updateField('otherObligations', otherObligations);
  updateField('children', childrenDetails);
}, [previousPetitions, otherObligations, childrenDetails, updateField]);
// Arrays are new references every render → infinite loop risk
```

**Why This Happens:**
1. User types in petition #1 name
2. `previousPetitions` array updates → useEffect fires
3. Calls `updateField` → parent updates
4. Parent re-renders this component
5. Creates new arrays (new references)
6. useEffect sees "different array" → fires again
7. Loop continues infinitely → browser freezes

**Solutions Discussed:**

**Option A: Deep comparison**
```javascript
useEffect(() => {
  updateField('previousPetitions', previousPetitions);
}, [JSON.stringify(previousPetitions)]);
```
- Pros: Prevents loop, only fires on actual content changes
- Cons: Slight performance cost for stringifying
- Verdict: Quick fix

**Option B: Remove arrays from dependencies**
```javascript
useEffect(() => {
  updateField('previousPetitions', previousPetitions);
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);
```
- Pros: No loop
- Cons: Won't sync changes to parent automatically
- Verdict: Not viable

**Option C: Controlled Component Pattern (CHOSEN SOLUTION)**
- Move ALL state management to parent (App.tsx or Section1_7.jsx)
- Child components become "dumb" display components
- No useEffect syncing needed
- Parent owns single source of truth
- Pros: Clean architecture, no sync issues, prevents all race conditions
- Cons: Requires refactoring all Section 7 subsections
- Verdict: **USER CHOSE THIS - Best long-term solution**

**Implementation Steps for Option C:**
1. Identify all state in PreviousSponsorshipsScreen, OtherObligationsScreen, HouseholdMembersScreen
2. Move state up to Section1_7.jsx parent
3. Pass state + update functions as props to children
4. Remove all useEffect syncing logic
5. Remove local useState declarations from children
6. Test all functionality still works
7. Verify no infinite loops with rapid typing

**Files to Refactor:**
- `src/components/screens/section7/PreviousSponsorshipsScreen.jsx`
- `src/components/screens/section7/OtherObligationsScreen.jsx`
- `src/components/screens/section7/HouseholdMembersScreen.jsx`
- `src/components/sections/Section1_7.jsx` (parent)

**Testing Checklist:**
- [ ] Rapid typing in petition fields doesn't freeze
- [ ] Add/remove items works correctly
- [ ] Count selection (1-5+) syncs properly
- [ ] Navigation between subsections preserves data
- [ ] Parent receives all updates correctly

---

## ⚠️ HIGH PRIORITY

### Issue #10: Opacity Cascade Makes Form Flow Unclear
**Status:** NOT STARTED
**Priority:** HIGH
**File:** `src/components/sections/Section1.jsx`

**Problem:**
- Multiple questions use `opacity-50 pointer-events-none` to disable subsequent questions
- Creates cascading disabled state - users can't see full form
- Unclear which answer needs to change to unlock form
- Example: Lines 262, 372, 426, 472, 507, 842

**User Impact:**
- Answers 3 questions, now 4 questions grayed out
- Can't tell which answer blocks which
- Trial-and-error to proceed

**Solution Options:**
1. Replace with standalone disqualification screens (ties into Issue #23)
2. Show all questions as read-only with "Complete previous questions" note
3. Use stepper UI that hides future questions entirely

**Decision Needed:** User to decide approach

---

### Issue #11: Marriage State Selection Requires Guessing
**Status:** NOT STARTED
**Priority:** HIGH
**File:** `src/components/sections/Section1.jsx` (Lines 483-494)

**Problem:**
- User must guess which states allow marriage at their age
- After selecting incompatible state (e.g., age 17 selecting Nebraska min age 19), yellow warning appears
- User tries multiple states via trial-and-error

**Solution Options:**
1. Filter state dropdown to only show compatible states based on DOB
2. Add inline helper text showing state requirements before selection
3. Add search/filter by age requirement

**Decision Needed:** User to decide approach

---

### Issue #5: Age Validation Doesn't Auto-Update
**Status:** NOT STARTED
**Priority:** MEDIUM (bumping to HIGH if causes confusion)
**File:** `src/components/sections/Section1.jsx` (Lines 49-65, 496-503)

**Problem:**
- User enters DOB, selects compatible marriage state
- User changes DOB to younger age
- Validation doesn't re-run automatically
- Sees outdated "compatible" message when now incompatible

**Solution:**
- Add DOB to validation dependencies
- Recalculate age check when DOB changes

---

## 📋 MEDIUM PRIORITY

### Issue #2: State Age Validation Shows But Doesn't Block
**Status:** NOT STARTED
**Priority:** MEDIUM
**File:** `src/components/sections/Section1.jsx`

**Problem:**
- Yellow warning shows when state age requirement not met
- User can still click "Next" and proceed
- Might submit invalid state choice

**Solution:**
- Disable "Next" button when validation fails
- OR make validation error red/blocking instead of yellow warning

---

### Issue #4: Future Meeting Date Allowed
**Status:** NOT STARTED
**Priority:** MEDIUM
**File:** `src/components/sections/Section1.jsx`

**Problem:**
- User can select future meeting date (up to 3 months out)
- Warning shows but allows proceeding
- At submission time, might not have actually met yet → USCIS rejects

**Solution:**
- Add validation at final submission checking meeting date has passed
- OR disable future dates entirely in date picker
- OR add clearer warning that petition cannot be submitted until after meeting

---

### Issue #12: Meeting Date Picker Too Restrictive (3 Month Limit)
**Status:** NOT STARTED
**Priority:** MEDIUM
**File:** `src/components/sections/Section1.jsx` (Lines 349-351)

**Problem:**
- Max date is 3 months from today
- User with trip booked 4 months out can't select date
- Forced to choose "not in next 3 months" → gets disqualified

**Solution:**
- Allow wider date range (e.g., 6-12 months)
- Adjust messaging based on selected date
- If >3 months, show: "You can begin application preparation but cannot submit until after meeting"

---

### Issue #18: Data Loss When Reducing Count (Petitions/Obligations/Children)
**Status:** PARTIALLY ADDRESSED
**Priority:** MEDIUM
**Files:** All Section 7 subsections

**Problem:**
- User selects "3 petitions", fills details
- Accidentally clicks "2 petitions" → third petition data instantly deleted
- No warning given

**Current Status:**
- We fixed some logic but didn't add confirmation dialogs

**Solution:**
- Add confirmation dialog: "Reducing count will remove data for items #X. Continue?"
- Show which items will be deleted

**Note:** Might be resolved by Issue #20 refactoring

---

### Issue #19: "Add Another" Button Visibility Logic
**Status:** FIXED (verify in testing)
**Priority:** LOW (verify fix worked)
**File:** `src/components/screens/section7/OtherObligationsScreen.jsx`

**Status:** We changed condition from `=== 5` to `>= 5` in previous session. Verify this works correctly in testing.

---

### Issue #22: Count vs Array Length Desync
**Status:** NOT STARTED
**Priority:** MEDIUM (Technical Debt)
**Files:** Section 7 subsections

**Problem:**
- Two sources of truth: `childrenCount` state AND `childrenDetails.length`
- Can get out of sync
- Causes buttons to show/hide inconsistently

**Solution:**
- Use array.length as single source of truth
- Remove separate count state
- OR ensure they always stay in sync with validation

**Note:** Likely resolved by Issue #20 Option C refactoring

---

### Issue #27: A-Number Validation Too Lenient
**Status:** NOT STARTED
**Priority:** MEDIUM
**Files:** Section 7, any A-Number input fields

**Problem:**
- Accepts any 7-9 digit number starting with "A"
- Doesn't validate actual A-Number format (prefixes, check digits)
- Example: "A000000001" shows as valid but isn't real format

**Solution:**
- Add regex validation for proper A-Number format
- Research valid A-Number prefixes and patterns
- Add validation for check digits if applicable

---

### Issue #28: Children Checkbox Criteria Ambiguous
**Status:** NOT STARTED
**Priority:** MEDIUM
**File:** `src/components/screens/section7/HouseholdMembersScreen.jsx` (Lines 1343-1360)

**Problem:**
- Checkbox says "lived with me for at least 6 months"
- Unclear if CONTINUOUSLY or CUMULATIVELY
- Example: Child lived Jan-Mar (3 mo) + July-Oct (4 mo) = 7 total but not continuous

**Solution:**
- Add clarifying text: "(continuously for the past 6 months)"
- OR change to accept cumulative with date range inputs

---

### Issue #30: Receipt Number Format Not Validated
**Status:** NOT STARTED
**Priority:** MEDIUM
**File:** Section 7 (Lines 771-815)

**Problem:**
- Accepts ANY 13-character alphanumeric string
- USCIS receipt numbers have specific prefixes (MSC, EAC, WAC, LIN, SRC)

**Solution:**
- Add dropdown for service center prefix
- Validate format: [PREFIX][YEAR][DAY][SEQUENCE]
- Show examples based on selected service center

---

### Issue #46: "Worldwide Criminal History" Not Emphasized
**Status:** NOT STARTED
**Priority:** MEDIUM
**File:** `src/components/sections/Section1_9.jsx`

**Problem:**
- Intro mentions "any country" but it's buried
- Users might think "US only"
- Example: User arrested in Mexico 2010, answers "No" → USCIS discovers → denial

**Solution:**
- Add inline reminder on EACH question: "Remember: This includes incidents in ANY country"
- Make "worldwide" more prominent in intro
- Consider checkbox: "I understand this includes all countries" before questions

---

### Issue #26: Current Spouse Warning Doesn't Block
**Status:** NOT STARTED
**Priority:** MEDIUM
**File:** Section 7 (Lines 725-747)

**Problem:**
- Red warning shows if sponsored person is current spouse
- User can still continue (red flag - can't sponsor fiancé while married)

**Solution:**
- Disable "Next" button when this validation fails
- OR treat as disqualifying and use standalone screen (Issue #23)

---

### Issue #14: Switching Relationship Type Loses Data
**Status:** NOT STARTED
**Priority:** MEDIUM
**File:** `src/components/sections/Section1.jsx` (Lines 564-605)

**Problem:**
- User selects "Blood relationship", fills details
- Accidentally clicks "Adoption" → all blood data vanishes
- No warning

**Solution:**
- Add confirmation dialog: "Switching relationship type will clear your previous answers. Continue?"

---

### Issue #6: Bulk State Updates Could Lose Data (Technical)
**Status:** NOT STARTED
**Priority:** MEDIUM
**File:** `src/components/sections/Section1.jsx` (Lines 104-128)

**Problem:**
- Object.keys iteration calling updateField multiple times rapidly
- Race conditions possible with fast typing

**Solution:**
- Batch updates into single atomic updateField call
- OR use functional state updates throughout

---

### Issue #7: No State Cleanup on Conditional Logic
**Status:** NOT STARTED
**Priority:** MEDIUM
**File:** `src/components/sections/Section1.jsx` (Lines 537-543, 564-600)

**Problem:**
- When `areRelated` changes to "no", child fields reset
- Reset values might not persist to parent immediately

**Solution:**
- Ensure cleanup happens in same render cycle
- Use callback pattern for sequential updates

---

### Issue #33: Tax Year Calculation Doesn't Account for Extensions
**Status:** OUT OF SCOPE (Financial Section)
**Priority:** MEDIUM (when working on financials)
**File:** `src/components/sections/Section1_8.jsx`

**Problem:**
- Assumes April tax deadline
- Users with extensions have different "most recent tax year"

**Solution:** (Defer until working on Financial section)

---

### Issue #34: Asset Type Not Required
**Status:** OUT OF SCOPE (Financial Section)
**Priority:** MEDIUM (when working on financials)
**File:** `src/components/sections/Section1_8.jsx`

---

### Issue #40: Asset Currency Display Confusing
**Status:** OUT OF SCOPE (Financial Section)
**Priority:** MEDIUM (when working on financials)

---

### Issue #41: Retirement Account Type Not Enforced
**Status:** OUT OF SCOPE (Financial Section)
**Priority:** MEDIUM (when working on financials)

---

## ℹ️ LOW PRIORITY

### Issue #47: No Global Error Boundary
**Status:** NOT STARTED
**Priority:** LOW (Insurance against future bugs)

**Problem:**
- No React Error Boundary component
- If any component throws unhandled error → white screen crash
- Example: `new Date(null)` could crash entire app

**Solution:**
- Create `<ErrorBoundary>` component at App.tsx level
- Shows friendly "Something went wrong, please refresh" message
- Logs errors for debugging

**Implementation:**
```javascript
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong. Please refresh the page.</div>;
    }
    return this.props.children;
  }
}
```

---

### Issue #3: Second Cousin State Laws Not Checked
**Status:** NOT STARTED
**Priority:** LOW
**File:** `src/components/sections/Section1.jsx` (Lines 695-709)

**Problem:**
- "Second cousins or more" always returns `{ allowed: true }`
- Doesn't check state-specific restrictions for distant cousins
- Risk is low (very few states ban second cousin marriage)

**Solution:**
- Research all 50 state laws for second cousin restrictions
- Add to state marriage law data
- Update validation logic

---

### Issue #13: Meeting Description Word Count Warning Unclear
**Status:** NOT STARTED
**Priority:** LOW
**File:** `src/components/sections/Section1.jsx` (Lines 908-912)

**Problem:**
- Warning at 300+ words: "consider shortening"
- No explanation why or what happens if too long

**Solution:**
- Add character limit OR clarify consequences
- Example: "Responses over 300 words may delay processing"

---

### Issue #15: Help Text Expansion State Not Persisted
**Status:** NOT STARTED
**Priority:** LOW
**File:** `src/components/sections/Section1.jsx` (Lines 377-384)

**Problem:**
- User expands "What is IMBRA?" definition
- Navigates away and back → collapsed again
- Minor UX annoyance

**Solution:**
- Persist expansion state in currentData
- OR ignore as very minor issue

---

### Issue #29: Poverty Guidelines Hardcoded for 2025
**Status:** NOT STARTED
**Priority:** LOW (becomes MEDIUM in Jan 2026)
**File:** `src/components/screens/section7/HouseholdMembersScreen.jsx` (Lines 60-68)

**Problem:**
- 2025 poverty guidelines are hardcoded
- Needs manual update annually

**Solution:**
- Add admin panel for updating guidelines
- OR add disclaimer showing year: "Based on 2025 Federal Poverty Guidelines"
- Set reminder to update in January 2026

---

### Issue #45: Definition Panel Toggle Resets
**Status:** NOT STARTED
**Priority:** LOW
**File:** `src/components/sections/Section1_9.jsx`

**Problem:** Same as Issue #15, minor UX annoyance

---

### Issue #8: Too Many useEffect Dependencies (Technical Debt)
**Status:** NOT STARTED
**Priority:** LOW
**File:** `src/components/sections/Section1.jsx` (Lines 104-128)

**Problem:**
- 17 dependencies in one useEffect
- Makes debugging difficult
- Could cause unnecessary re-renders

**Solution:**
- Split into multiple useEffects by logical grouping
- OR use useReducer for complex state management

---

### Issue #36: Questionnaire History Array Grows Forever (Technical)
**Status:** OUT OF SCOPE (Financial Section)
**Priority:** LOW

---

### Issue #50: Inconsistent Variable Naming (Code Quality)
**Status:** NOT STARTED
**Priority:** LOW (Technical Debt)
**Files:** Multiple sections

**Problem:**
- CLAUDE.md warns against generic variable names like `isFieldTouched`
- Audit needed across all renderField() switch cases in App.tsx

**Solution:**
- Scan all sections for variable naming
- Ensure unique prefixes (e.g., `isSSNTouched`, `isDateTouched`)

---

## 🔍 ITEMS REQUIRING RESEARCH/DECISION

### Issue #1: useEffect Dependency Warning
**Status:** NOT STARTED
**Priority:** MEDIUM
**File:** `src/components/sections/Section1.jsx` (Lines 104-128)

**Problem:**
- Missing `updateField` in dependencies OR needs useCallback wrapper

**Decision Needed:** Research if parent memoizes updateField

---

### Issue #48: No State Persistence Strategy
**Status:** DEFERRED (OK for testing phase)
**Priority:** HIGH (before production)

**Current Status:** Data lost on page refresh - acceptable for testing

**Before Production:**
- Add browser warning on page close if data exists
- Consider database auto-save (industry standard for long forms)

**User Decision:** Leave as-is for now, address before production

---

## ❌ INVALID/RESOLVED ISSUES (From Dec 24 Audit)

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

### Issue #21: Remove Button Count Bug - RESOLVED
**Status:** CLOSED
**Reason:** Already fixed in previous session. Code correctly doesn't update count in "5+" mode.

---

### Issue #42: Criminal History Performance - INVALID
**Status:** CLOSED
**Reason:** No text inputs exist in Section1_9.jsx, only yes/no radio buttons. No typing = no performance concern.

---

### Issues #31, #32, #35, #37, #38, #39: Financial Section - OUT OF SCOPE
**Status:** DEFERRED
**Reason:** User not working on Financial section yet. Defer until Section 8 work begins.

---

## 🚧 PENDING: COMPLETE AUDIT OF MISSING SECTIONS

**User Request:** Complete comprehensive audit of sections missed in first pass

**Sections Needing Full Audit:**
1. ✅ Section 1 (Personal Information) - Sponsor & Beneficiary
2. ⏸️ Section 2 (Your Relationship) - AUDITED (Section1.jsx)
3. ✅ Section 3 (Address History) - Sponsor & Beneficiary
4. ✅ Section 4 (Family Background) - Sponsor & Beneficiary
5. ✅ Section 5 (Employment History) - Sponsor & Beneficiary
6. ⏸️ Section 6 (Legal & Security) - PARTIALLY AUDITED (only sponsor criminal history)
   - Need to audit beneficiary subsections: US Travel, Criminal, Immigration, Health, Security
7. ⏸️ Section 7 (Previous Petitions) - AUDITED

**Next Action:** Launch comprehensive audit agent for Sections 1, 3, 4, 5, and Section 6 beneficiary portions

---

## 📊 ISSUE STATISTICS

| Priority Level | Count | Status |
|----------------|-------|--------|
| Critical | 2 | Not Started |
| High | 3 | Not Started |
| Medium | 18 | Not Started |
| Low | 7 | Not Started |
| **Total Active** | **30** | |
| Invalid/Resolved | 6 | Closed |
| Out of Scope | 6 | Deferred |
| Pending Audit | 5 sections | Next Step |

---

## 📝 NOTES FOR CONTEXT CONTINUITY

**Critical Context from User:**
1. User wants ALL issues tracked, even low priority ones
2. Do NOT lose this list across context switches
3. User saved audit findings in `documentation/dec24 audit findings.docx`
4. This file must be referenced in future continuations
5. Issue #23/#44 solution was discussed in detail - user was VERY clear about requirements
6. Issue #20 Option C was chosen after full discussion of pros/cons
7. User wants to fix critical bugs FIRST across all sections before systematic fixes

**Handoff Instructions for Future Claude:**
1. Read this file FIRST when continuing work
2. Read `documentation/dec24 audit findings.docx` for full context
3. Do NOT assume issues are resolved unless marked "CLOSED" or "RESOLVED"
4. When user says "let's work on issue #X", find it in this file for full context
5. Update this file as work progresses - do NOT create separate tracking files
6. If context runs out, include this file path in summary for next instance

---

**END OF PERSISTENT TO-DO LIST**
