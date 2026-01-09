# Section 2 (Your Relationship) - Disqualification Implementation Plan

**Date:** December 24, 2024
**File:** `src/components/sections/Section1.jsx`
**Status:** AWAITING APPROVAL

---

## CURRENT STATE ANALYSIS

### What Exists Now (7 Complete Disqualifications):

**Type A - Red DisqualificationMessage boxes:**
1. Not legally free to marry
2. Not meeting in next 3 months
3. Met through International Marriage Broker
4. No intent to marry within 90 days
5. Blood relationship - closer than first cousins
6. Blood relationship - aunt/uncle & niece/nephew
7. Adoption - one adopted the other

**Current Behavior Problems:**
- ❌ Shows inline red box with "Contact Customer Service" button
- ❌ Cascades opacity-50 to disable subsequent questions
- ❌ Does NOT block "Next" button
- ❌ User can still navigate away while "disqualified"
- ❌ Navigation panels still visible
- ❌ No "Go Back" option to change answer

---

## BUGS DISCOVERED

### Bug #68: Blood/Adoption Relationship Warnings Missing Without State Selection
**Severity:** CRITICAL
**Problem:** Users can select problematic relationships (siblings, aunt/nephew, etc.) WITHOUT selecting a marriage state first. No validation or warning appears because checks only run when `marriageState` exists.

**User Scenario:**
1. User skips Q5 (Marriage State)
2. User goes to Q6 (Are you related?)
3. User selects "Yes" → "Related by blood" → "Siblings"
4. NO WARNING appears (because validation requires marriageState)
5. User continues, unaware this is universally illegal

**Current Code (lines 69-80):**
```javascript
const checkBloodRelationship = () => {
  if (!marriageState || !bloodRelationship) return { allowed: true }; // PROBLEM: returns true if no state

  if (bloodRelationship === 'closer-than-first-cousins' || bloodRelationship === 'aunt-uncle-niece-nephew') {
    return { allowed: false, requiresStop: true };
  }
  // ...
}
```

**Fix Required:**
- Add validation that does NOT require marriageState for universally illegal relationships
- Show disqualification for siblings/parent-child even without state selected
- Only check state-specific rules (first cousins, adopted siblings) when state is selected

---

### Bug #69: Yellow Warnings Don't Disable "Next" Button
**Severity:** HIGH
**Problem:** Yellow warning boxes (age requirements, first cousin restrictions, adopted sibling restrictions) allow users to click "Next" and proceed with invalid state selections.

**Example:**
1. User age 17, selects Nebraska (min age 19)
2. Yellow warning appears
3. User ignores warning, clicks "Next"
4. Invalid state selection submitted

**Fix Required:**
- Decide: Should yellow warnings use standalone DQ screens? OR just disable Next button?

---

### Bug #70: Opacity Cascade Still Visible
**Severity:** MEDIUM
**Problem:** When disqualified, subsequent questions are grayed out (opacity-50) but still visible. Creates confusing UI where users see disabled questions they can't interact with.

**Fix Required:**
- Remove opacity-cascade pattern entirely when using standalone DQ screens
- Questions should either be fully visible/interactive OR completely hidden

---

## PROPOSED SOLUTION

### Implementation Strategy

**Use Standalone Disqualification Screens for Type A scenarios ONLY**

#### Type A: Complete Disqualifications → Standalone Screen
All 7 current red DisqualificationMessage scenarios become standalone screens:
- Full-screen takeover (no navigation panels)
- Only 2 options:
  1. **"Go Back and Change Answer"** - clears the disqualifying answer, returns to question
  2. **"Contact Support"** - shows email + phone with mailto/tel links
- NO ability to continue
- NO other navigation visible

#### Type B: Yellow Warnings → Disable Next Button
Yellow warnings remain inline but disable navigation:
- Keep yellow warning box with guidance
- Add validation check that disables "Next" button
- Allow user to change state selection
- Do NOT use standalone screen (not true disqualifications)

#### Type C: Blue Info → No Change
Blue InfoMessage stays as-is:
- Informational only
- "I understand - let's continue" button works
- No blocking behavior

---

## DETAILED IMPLEMENTATION PLAN

### STEP 1: Create DisqualificationStandaloneScreen Component

**File:** `src/components/DisqualificationStandaloneScreen.jsx`

**Props:**
```javascript
{
  reason: string,           // Custom message explaining disqualification
  onGoBack: function,       // Callback to clear answer and return
  supportEmail: string,     // Email address
  supportPhone: string      // Phone number
}
```

**Design:**
- Full-screen gradient background (red-50 to orange-50)
- Large alert icon
- Clear explanation
- Prominent "Go Back" button (blue, primary action)
- Contact support section below (email + phone with icons)
- NO escape routes (no navigation, no close button)

---

### STEP 2: Update Section1.jsx State Management

**Add state variables:**
```javascript
const [showDisqualificationScreen, setShowDisqualificationScreen] = useState(false);
const [disqualificationReason, setDisqualificationReason] = useState('');
const [disqualificationField, setDisqualificationField] = useState(null);
```

**Add helper functions:**
```javascript
const triggerDisqualification = (reason, field) => {
  setDisqualificationReason(reason);
  setDisqualificationField(field);
  setShowDisqualificationScreen(true);
};

const handleGoBack = () => {
  // Clear ONLY the disqualifying answer based on field
  switch (disqualificationField) {
    case 'legallyFree':
      setLegallyFree(null);
      updateField('legallyFreeToMarry', null);
      break;
    case 'plannedMeeting':
      setPlannedMeetingOption(null);
      updateField('plannedMeetingOption', null);
      break;
    // ... etc for all 7 scenarios
  }
  // Return to questionnaire
  setShowDisqualificationScreen(false);
  setDisqualificationReason('');
  setDisqualificationField(null);
};
```

---

### STEP 3: Add useEffect Hooks to Trigger Standalone Screens

**For each Type A disqualification, add a useEffect:**

```javascript
// A1: Not legally free
useEffect(() => {
  if (legallyFree === 'no') {
    triggerDisqualification(
      "Your situation is complex and needs individual review. Our team can help determine if there are any exceptions or alternative pathways available for your specific case.",
      'legallyFree'
    );
  }
}, [legallyFree]);

// A2: Not meeting in next 3 months
useEffect(() => {
  if (plannedMeetingOption === 'not-next-3-months') {
    triggerDisqualification(
      "Unfortunately, meeting in person within the past 2 years is a required eligibility criterion for K-1 visas. Since you do not plan to meet within the next 3 months, we cannot proceed with your application at this time.",
      'plannedMeeting'
    );
  }
}, [plannedMeetingOption]);

// ... repeat for all 7 Type A scenarios
```

---

### STEP 4: Add Conditional Rendering at Return Statement

```javascript
// At top of return statement
if (showDisqualificationScreen) {
  return (
    <DisqualificationStandaloneScreen
      reason={disqualificationReason}
      onGoBack={handleGoBack}
      supportEmail="support@evernestusa.com"
      supportPhone="+1 (555) 123-4567"
    />
  );
}

// Regular questionnaire below
return (
  <div className="space-y-8">
    {/* All questions */}
  </div>
);
```

---

### STEP 5: Remove Old Inline DisqualificationMessage Components

**Delete 7 inline DisqualificationMessage JSX blocks:**
- Lines 253-258 (legallyFree)
- Lines 361-366 (plannedMeeting)
- Lines 417-422 (metThroughIMB)
- Lines 463-468 (intendToMarry90Days)
- Lines 696-700 (bloodRelationship requiresStop)
- Lines 774-778 (adoptionRelationship one-adopted-other)

**Delete the DisqualificationMessage component definition** (lines 136-157)

**KEEP:**
- Yellow warning boxes (lines 497-503, 703-709, 781-787)
- Blue InfoMessage component and usage
- Inline "Contact Customer Service" buttons for "Other" options

---

### STEP 6: Remove Opacity-Cascade Logic

**Delete all `opacity-50 pointer-events-none` conditions:**
- Line 262: `${legallyFree === 'no' ? 'opacity-50 pointer-events-none' : ''}`
- Line 372: Compound condition
- Line 426: Compound condition
- Line 472: Compound condition
- Line 507: Compound condition
- Line 842: Compound condition

**Rationale:** Standalone screens completely hide questionnaire, so cascading is unnecessary.

---

### STEP 7: Fix Bug #68 - Relationship Validation Without State

**Update checkBloodRelationship() function (lines 67-81):**

```javascript
const checkBloodRelationship = () => {
  if (!bloodRelationship) return { allowed: true };

  // Universal disqualifications (illegal everywhere - don't need state)
  if (bloodRelationship === 'closer-than-first-cousins' || bloodRelationship === 'aunt-uncle-niece-nephew') {
    return { allowed: false, requiresStop: true };
  }

  // State-specific rules (only check if state is selected)
  if (marriageState && (bloodRelationship === 'first-cousins' || bloodRelationship === 'first-cousins-once-removed')) {
    const allowed = canFirstCousinsMarry(marriageState);
    return { allowed, requiresStop: false, stateName: stateMarriageLaws[marriageState]?.name };
  }

  // Second cousins+ always allowed
  return { allowed: true };
};
```

**Update checkAdoptionRelationship() function (lines 83-103):**

```javascript
const checkAdoptionRelationship = () => {
  if (!adoptionRelationship) return { allowed: true };

  // Universal disqualification (illegal everywhere)
  if (adoptionRelationship === 'one-adopted-other') {
    return { allowed: false, requiresStop: true };
  }

  // State-specific rules (only check if state is selected)
  if (marriageState && adoptionRelationship === 'adopted-siblings') {
    const allowed = canAdoptedSiblingsMarry(marriageState);
    return { allowed, requiresStop: false, stateName: stateMarriageLaws[marriageState]?.name };
  }

  return { allowed: true };
};
```

**Impact:** Now sibling/parent-child relationships will trigger disqualification even without state selection.

---

### STEP 8: Fix Bug #69 - Disable Next Button for Yellow Warnings

**Option A: Add validation prop to parent component**
If Section1.jsx receives an `onValidationChange` prop from parent:

```javascript
// Calculate if there are any yellow warnings
const hasYellowWarnings =
  (marriageState && !ageCheck.met) ||
  (bloodRelationship && !bloodCheck.allowed && !bloodCheck.requiresStop) ||
  (adoptionRelationship === 'adopted-siblings' && !adoptionCheck.allowed);

// Notify parent
useEffect(() => {
  if (onValidationChange) {
    onValidationChange(!hasYellowWarnings); // true if valid, false if warnings exist
  }
}, [hasYellowWarnings, onValidationChange]);
```

**Option B: Add visual indicator in yellow boxes**
If parent doesn't support validation callback, add clear messaging:

```javascript
// In yellow warning boxes, add:
<p className="text-sm font-semibold text-yellow-900 mt-3">
  ⚠️ You must resolve this issue before proceeding to the next section.
</p>
```

**Recommendation:** Implement Option A for proper validation, Option B as fallback.

---

## TESTING CHECKLIST

After implementation, test ALL scenarios:

### Type A - Standalone Disqualification Screens
- [ ] A1: Select "No" to legally free → see standalone screen → click "Go Back" → answer cleared, back to question
- [ ] A2: Select "No" to met in person → "Not in next 3 months" → standalone screen → Go Back works
- [ ] A3: Select "Yes" to International Marriage Broker → standalone screen → Go Back works
- [ ] A4: Select "No" to intent to marry 90 days → standalone screen → Go Back works
- [ ] A5: Select "Closer than first cousins" → standalone screen → Go Back works
- [ ] A6: Select "Aunt/Uncle & Niece/Nephew" → standalone screen → Go Back works
- [ ] A7: Select "One adopted the other" → standalone screen → Go Back works
- [ ] All standalone screens: Email link opens mailto
- [ ] All standalone screens: Phone link opens tel dialer
- [ ] All standalone screens: NO navigation panels visible
- [ ] All standalone screens: NO way to proceed without clicking "Go Back"

### Type B - Yellow Warnings
- [ ] B1: Age 17, select Nebraska → yellow warning → Next button disabled (if Option A implemented)
- [ ] B2: Select first cousins, select state that prohibits → yellow warning → change state works
- [ ] B3: Select adopted siblings, select state that prohibits → yellow warning → change state works
- [ ] B4: Type 500 words → yellow warning → can still proceed (informational only)

### Type C - Blue Info
- [ ] C1: Haven't met, plan to meet in 2 months, select date → blue info → "I understand" works

### Bug Fixes
- [ ] Bug #68: Select sibling relationship WITHOUT selecting state → disqualification triggers
- [ ] Bug #68: Select aunt/nephew relationship WITHOUT selecting state → disqualification triggers
- [ ] Bug #68: Select "one adopted other" WITHOUT selecting state → disqualification triggers
- [ ] Bug #69: Yellow warnings disable Next button (if implemented)
- [ ] Bug #70: No opacity-cascade grayed out questions when disqualified

### Edge Cases
- [ ] Rapidly change answers → no double disqualification screens
- [ ] Click "Go Back" → answer actually clears
- [ ] Click "Go Back" → updateField called to persist null value
- [ ] Navigate to different section → return to Section 2 → state persists correctly
- [ ] Select disqualifying answer → reload page → disqualification screen shows again (if answer persisted)

---

## QUESTIONS FOR APPROVAL

1. **Should yellow warnings (Type B) use standalone screens too?**
   - Current plan: NO, just disable Next button
   - Alternative: YES, but with different messaging (e.g., "Change your state selection")

2. **Should blue info (Type C) change at all?**
   - Current plan: NO, leave as-is
   - Alternative: Could use standalone screen format for consistency

3. **Contact support email/phone - what are real values?**
   - Current placeholder: support@evernestusa.com, +1 (555) 123-4567
   - Need actual values before deployment

4. **Should "Go Back" button return to EXACT question or top of section?**
   - Current plan: Returns to same spot (question still visible)
   - Alternative: Scroll to top of section after clearing

5. **Should we add analytics tracking when users hit disqualification screens?**
   - Could track which scenarios trigger most often
   - Could track "Go Back" vs "Contact Support" button clicks

---

## NEXT STEPS AFTER APPROVAL

1. Implement DisqualificationStandaloneScreen component
2. Update Section1.jsx with all changes
3. Test all 21 checklist items
4. Update Bug #68 and #69 in COMPREHENSIVE_AUDIT_FINDINGS.md
5. Mark Issue #23 & #44 as COMPLETED in PERSISTENT_TODO_LIST.md
6. Move to Section 7 and Section 6 implementations

---

**AWAITING USER APPROVAL TO PROCEED**
