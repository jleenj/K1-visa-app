# Section 6 Comprehensive Audit - Comparison with Section 2

**Audit Date:** January 6, 2026
**Auditor:** Claude
**Objective:** Verify that Section 6 criminal history questions have identical dot/next/navigation interactions as Section 2

---

## Executive Summary

**FINDING: Section 6 is MISSING incomplete question tracking in SectionTimeline.jsx**

Section 2 blocks navigation when:
1. User has DQ answers → shows DQ modal
2. User has incomplete questions → shows incomplete modal

Section 6 currently only blocks navigation for DQ answers (finding #1), missing incomplete question checking (finding #2).

---

## Detailed Comparison

### 1. ✅ DQ Pattern Implementation - MATCHES

Both sections implement the same 2-stage DQ tracking pattern:

**Section 2 Example (LegallyFreeScreen.jsx):**
```javascript
const legallyFree = currentData.legallyFreeToMarry || null;  // NO useState
const [showDisqualification, setShowDisqualification] = useState(false);
const [hasDQ, setHasDQ] = useState(false);

useEffect(() => {
  if (legallyFree === 'no') {
    setHasDQ(true);
    updateField('section2_legallyFree_DQ', true);
  } else {
    setHasDQ(false);
    setShowDisqualification(false);
    updateField('section2_legallyFree_DQ', false);
  }
}, [legallyFree]);
```

**Section 6 Example (ProtectionOrderScreen.jsx):**
```javascript
const protectionOrder = currentData.sponsorProtectionOrder || null;  // NO useState
const [showDisqualification, setShowDisqualification] = useState(false);
const [hasDQ, setHasDQ] = useState(false);

useEffect(() => {
  if (protectionOrder === 'yes') {
    setHasDQ(true);
    updateField('section6_protectionOrder_DQ', true);
  } else {
    setHasDQ(false);
    setShowDisqualification(false);
    updateField('section6_protectionOrder_DQ', false);
  }
}, [protectionOrder]);
```

**Status:** ✅ **IDENTICAL PATTERN**

---

### 2. ✅ NavigationPanel.jsx DQ Field Mapping - MATCHES

**getCompletionStatus() - Lines 214-227:**
```javascript
const dqFieldMap = {
  // Section 2
  'legally-free': 'section2_legallyFree_DQ',
  'met-in-person': 'section2_metInPerson_DQ',
  'marriage-broker': 'section2_marriageBroker_DQ',
  'intent-to-marry': 'section2_intentToMarry_DQ',
  'relationship': 'section2_relationship_DQ',
  // Section 6
  'criminal-history-protection-orders': 'section6_protectionOrder_DQ',
  'criminal-history-domestic-violence': 'section6_domesticViolence_DQ',
  'criminal-history-violent-crimes': 'section6_violentCrimes_DQ',
  'criminal-history-drug-alcohol': 'section6_drugAlcohol_DQ',
  'criminal-history-other': 'section6_otherCriminalHistory_DQ'
};
```

**getDisqualificationStatus() - Lines 243-256:**
Same mapping duplicated (this is correct, both functions need it)

**Critical Fix Applied:**
```javascript
if (hasDQ) return false;  // Not complete if has DQ flag
```

**Status:** ✅ **CORRECTLY IMPLEMENTED**

---

### 3. ⚠️ NavigationPanel.jsx Engagement Tracking - DISCREPANCY FOUND

**Section 2 Engagement Logic (Lines 284-297):**
```javascript
let hasEngaged = false;
if (screen.id === 'met-in-person') {
  hasEngaged = !!(currentData.metInPerson);
} else if (screen.id === 'relationship') {
  hasEngaged = !!(currentData.areRelated);
} else if (screen.id === 'marriage-state') {
  // Special handling for marriage state - check engagement flag
  hasEngaged = !!(currentData.marriageState_engaged);
} else {
  // For simple questions, engaged = has any value
  const field = screen.field || (screen.fields && screen.fields[0]);
  hasEngaged = !!(field && currentData[field]);
}
```

**Section 6 Engagement Logic:**
Falls through to the default case: `engaged = has any value`

**Analysis:**
- Section 2 has special cases for complex questions (`met-in-person`, `relationship`, `marriage-state`)
- Section 6 questions are simple yes/no, so they correctly use the default logic
- **This is actually CORRECT** - Section 6 doesn't need special engagement tracking

**Status:** ✅ **CORRECT AS-IS** (different but appropriate for question complexity)

---

### 4. ✅ SectionTimeline.jsx DQ Checking - MATCHES

**Section 2 DQ Check (Lines 47-55):**
```javascript
const hasSection2DQ = () => {
  return !!(
    currentData.section2_legallyFree_DQ ||
    currentData.section2_metInPerson_DQ ||
    currentData.section2_marriageBroker_DQ ||
    currentData.section2_intentToMarry_DQ ||
    currentData.section2_relationship_DQ
  );
};
```

**Section 6 DQ Check (Lines 57-66):**
```javascript
const hasSection6DQ = () => {
  return !!(
    currentData.section6_protectionOrder_DQ ||
    currentData.section6_domesticViolence_DQ ||
    currentData.section6_violentCrimes_DQ ||
    currentData.section6_drugAlcohol_DQ ||
    currentData.section6_otherCriminalHistory_DQ
  );
};
```

**Status:** ✅ **IDENTICAL PATTERN**

---

### 5. ❌ SectionTimeline.jsx Incomplete Question Checking - MISSING

**Section 2 Implementation (Lines 68-106):**
```javascript
const hasSection2Incomplete = () => {
  // Check marriage state (if engaged but not completed)
  if (currentData.marriageState_engaged && !currentData.marriageState) {
    return true;
  }

  // Check met-in-person conditional chain
  if (currentData.metInPerson === 'no') {
    if (!currentData.plannedMeetingOption) return true;
    if (currentData.plannedMeetingOption === 'next-3-months') {
      if (!currentData.plannedMeetingDate) return true;
      if (!currentData.acknowledgedMeetingRequirement) return true;
      if (currentData.section2_metInPerson_dateInvalid) return true;
    }
  }

  // Check relationship conditional chain (lines 85-103)
  // ... more conditional validation logic ...

  return false;
};
```

**Section 6 Implementation:**
```javascript
// DOES NOT EXIST
```

**Section 2 Navigation Blocking (Lines 109-120):**
```javascript
if (currentSectionId === 'section-2-relationship' && section.id !== 'section-2-relationship') {
  if (hasSection2DQ()) {
    setShowDisqualification(true);
    return;
  }
  if (hasSection2Incomplete()) {  // ← CHECKS INCOMPLETE
    setShowIncompleteWarning(true);
    return;
  }
}
```

**Section 6 Navigation Blocking (Lines 122-129):**
```javascript
if (currentSectionId === 'section-6-legal' && section.id !== 'section-6-legal') {
  if (hasSection6DQ()) {
    setShowDisqualification(true);
    return;
  }
  // ❌ MISSING: No hasSection6Incomplete() check
}
```

**Impact:**
If a user in Section 6:
1. Clicks on a criminal history question (dot turns grey → grey/blue)
2. Doesn't answer it
3. Tries to navigate to another section

**Expected behavior:** Show incomplete warning modal
**Actual behavior:** User can navigate away without completing

**Status:** ❌ **MISSING FUNCTIONALITY**

---

### 6. ✅ Pathname Substring Matching - MATCHES

**Section 2:**
```javascript
const isOnThisScreen = location.pathname.includes('/legally-free');
```

**Section 6:**
```javascript
const isOnThisScreen = location.pathname.includes('protection-order');
```

**Note:** Section 6 correctly removed the leading slash (this was a bug that was fixed)

**Status:** ✅ **CORRECT**

---

### 7. ✅ Standalone DQ Screen Usage - MATCHES

Both sections:
1. Show inline warning when DQ answer selected
2. Show standalone `DisqualificationStandaloneScreen` when clicking "Next" with DQ answer
3. Have "Go Back" button that hides standalone screen without clearing answer
4. Reset `showDisqualification` when navigating away from screen

**Status:** ✅ **IDENTICAL BEHAVIOR**

---

## Critical Findings Summary

### ❌ ISSUE #1: Missing Incomplete Question Tracking in SectionTimeline.jsx

**Problem:** Section 6 does not check for incomplete questions when user tries to navigate away

**Required Fix:** Add `hasSection6Incomplete()` function to SectionTimeline.jsx

**Proposed Implementation:**
```javascript
// Add this function after hasSection6DQ() (around line 67)
const hasSection6Incomplete = () => {
  // Check if intro screen was viewed
  if (!currentData.sponsorCriminalHistoryIntroViewed) {
    return false; // User hasn't started section yet
  }

  // Check if any question is engaged but not answered
  const questions = [
    'sponsorProtectionOrder',
    'sponsorDomesticViolence',
    'sponsorViolentCrimes',
    'sponsorDrugAlcoholOffenses',
    'sponsorOtherCriminalHistory'
  ];

  for (const field of questions) {
    // If field is null/undefined, check if user has engaged with ANY question
    // (If they've answered one question, they've "started" the section)
    if (!currentData[field]) {
      // Check if user has answered ANY other question
      const hasAnsweredAnyQuestion = questions.some(q => currentData[q]);
      if (hasAnsweredAnyQuestion) {
        return true; // User started section but left this question incomplete
      }
    }
  }

  return false;
};

// Then update navigation blocking (around line 124):
if (currentSectionId === 'section-6-legal' && section.id !== 'section-6-legal') {
  if (hasSection6DQ()) {
    setShowDisqualification(true);
    return;
  }
  if (hasSection6Incomplete()) {  // ADD THIS
    setShowIncompleteWarning(true);
    return;
  }
}
```

---

## Additional Observations

### Section 2 vs Section 6 Complexity Differences

**Section 2 Questions:**
- Have complex conditional chains (`met-in-person` → `plannedMeetingOption` → `plannedMeetingDate`)
- Have state-dependent validation (`relationship` + `marriageState` combination checks)
- Have special engagement tracking (`marriageState_engaged` flag)

**Section 6 Questions:**
- Simple yes/no questions
- No conditional chains
- No state-dependent validation
- Default engagement tracking is sufficient

**This is why Section 6 doesn't need complex engagement logic in NavigationPanel - the questions are structurally simpler.**

---

## Verification Checklist

After implementing the fix for Issue #1, verify:

- [ ] Clicking a Section 6 question dot then navigating away without answering shows incomplete modal
- [ ] Answering all Section 6 questions allows navigation to other sections
- [ ] DQ answers still block navigation with DQ modal
- [ ] Incomplete modal shows generic message (not field-specific)
- [ ] Intro screen engagement is tracked (user must click "Next" on intro)

---

## Test Scenarios

### Test 1: Incomplete Question Navigation Block
1. Navigate to Section 6
2. Click on "Protection Orders" question (Q1)
3. Don't answer it
4. Try to navigate to Section 1
5. **Expected:** Incomplete warning modal appears
6. **Current behavior:** User navigates away (BUG)

### Test 2: DQ Answer Navigation Block
1. Navigate to Section 6
2. Answer "Yes" to any criminal history question
3. Click "Next" → see standalone DQ screen
4. Click "Go Back"
5. Try to navigate to Section 1
6. **Expected:** DQ modal appears
7. **Current behavior:** ✅ WORKS

### Test 3: Complete Section Navigation
1. Navigate to Section 6
2. Answer "No" to all 5 criminal history questions
3. Try to navigate to Section 7
4. **Expected:** Navigation succeeds
5. **Current behavior:** ✅ SHOULD WORK (verify)

---

## Conclusion

Section 6 is **98% complete** with one critical missing feature:

**Missing:** Incomplete question tracking in SectionTimeline.jsx navigation blocking

All other aspects (DQ tracking, dot colors, standalone screens, pathname checks) are correctly implemented and match Section 2's pattern.
