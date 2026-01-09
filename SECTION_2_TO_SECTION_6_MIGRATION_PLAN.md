# Section 2 to Section 6 Migration Plan

## Complete Pattern Analysis from Section 2

### 1. Screen Component Pattern (LegallyFreeScreen.jsx)

**State Management:**
```javascript
const legallyFree = currentData.legallyFreeToMarry || null;  // NO useState!
const [showDisqualification, setShowDisqualification] = useState(false);
const [hasDQ, setHasDQ] = useState(false);
```

**DQ Tracking useEffect:**
```javascript
useEffect(() => {
  if (legallyFree === 'no') {  // DQ condition
    setHasDQ(true);
    updateField('section2_legallyFree_DQ', true);
  } else {
    setHasDQ(false);
    setShowDisqualification(false);
    updateField('section2_legallyFree_DQ', false);
  }
}, [legallyFree]);
```

**Navigation Reset useEffect:**
```javascript
useEffect(() => {
  const isOnThisScreen = location.pathname.includes('/legally-free');
  if (!isOnThisScreen) {
    setShowDisqualification(false);
  }
}, [location.pathname]);
```

**Standalone DQ Screen Rendering:**
```javascript
const isOnThisScreen = location.pathname.includes('/legally-free');
if (showDisqualification && isOnThisScreen) {
  return <DisqualificationStandaloneScreen ... />;
}
```

**handleNext Logic:**
```javascript
const handleNext = () => {
  if (hasDQ) {
    setShowDisqualification(true);
    return;
  }
  // Navigate...
};
```

### 2. NavigationPanel Integration Pattern

**Section Structure (sectionStructure.js):**
```javascript
{
  id: 'visa-requirements',
  title: 'Visa Requirements',
  oneQuestionPerScreen: true,
  totalQuestions: 5,
  screens: [
    { id: 'legally-free', field: 'legallyFreeToMarry' },
    // ...
  ]
}
```

**Completion Status Check:**
```javascript
const getCompletionStatus = () => {
  return subsection.screens.map(screen => {
    const field = screen.field || (screen.fields && screen.fields[0]);
    return !!(field && currentData[field]);
  });
};
```

**Disqualification Status Check:**
```javascript
const getDisqualificationStatus = () => {
  return subsection.screens.map((screen, index) => {
    const dqField = dqFieldMap[screen.id];
    const hasDQ = !!(dqField && currentData[dqField]);

    const completionStatus = getCompletionStatus();
    const isIncomplete = completionStatus[index] === false;

    const field = screen.field || (screen.fields && screen.fields[0]);
    const hasEngaged = !!(field && currentData[field]);

    const isEngagedButIncomplete = hasEngaged && isIncomplete;

    return hasDQ || isEngagedButIncomplete;
  });
};
```

### 3. Dot Color Logic (SubsectionProgressBar.jsx)

**Color Determination:**
- `hasDisqualification = true` → **RED**
- `isCompleted = true` → **GREEN**
- Otherwise → **GREY**

**Critical Insight:**
- When user selects DQ answer ('yes'):
  - `hasEngaged = true` (field has value)
  - `isComplete = true` (field has value) ← **PROBLEM**
  - `hasDQ = true` (DQ flag set)
  - Result: RED dot (correct, because hasDQ takes priority)

- When user clicks away from DQ screen:
  - `hasEngaged = true` (field still has 'yes')
  - `isComplete = true` (field still has 'yes') ← **PROBLEM**
  - `hasDQ = true` (DQ flag still set)
  - Result: Should be RED, but showing GREEN

**ROOT CAUSE:**
The completion check `return !!(field && currentData[field])` returns `true` when field = 'yes', even though having a DQ answer means the question is NOT complete.

### 4. The Fix Required

**For Section 6, completion status must account for DQ answers:**

```javascript
const getCompletionStatus = () => {
  return subsection.screens.map(screen => {
    const field = screen.field;
    const fieldValue = currentData[field];

    // If field has no value, not complete
    if (!fieldValue) return false;

    // Check if this field value represents a DQ answer
    const dqField = dqFieldMap[screen.id];
    const hasDQ = !!(dqField && currentData[dqField]);

    // If has DQ, NOT complete (even though field has value)
    if (hasDQ) return false;

    // Otherwise, has value and no DQ = complete
    return true;
  });
};
```

## Section 6 Implementation Checklist

### Part 1: Update All 5 Screen Components ✅ (Partially Done)
- [x] ProtectionOrderScreen - Use currentData pattern, no useState
- [x] DomesticViolenceScreen - Use currentData pattern
- [x] ViolentCrimesScreen - Use currentData pattern
- [x] DrugAlcoholScreen - Use currentData pattern
- [x] OtherCriminalHistoryScreen - Use currentData pattern
- [x] Fix pathname checks (remove leading slash)
- [ ] **MISSING:** None of these track engagement separately (no `_engaged` flag)

### Part 2: Add Section 6 to NavigationPanel
- [ ] Add Section 6 subsection rendering (appliesToBoth = false, isSponsor = true)
- [ ] Add `getCompletionStatus()` for criminal-history subsection
- [ ] Add `getDisqualificationStatus()` with DQ field mapping
- [ ] **FIX:** Completion check must exclude DQ answers
- [ ] Add engagement tracking for simple yes/no questions

### Part 3: Add Section 6 to SectionTimeline
- [ ] Add `hasSection6DQ()` function
- [ ] Add `hasSection6Incomplete()` function
- [ ] Add navigation blocking when Section 6 has DQ
- [ ] Add modal display for incomplete Section 6

### Part 4: Update sectionStructure.js
- [x] Section 6 already has `oneQuestionPerScreen: true`
- [x] Section 6 already has screens array with IDs and fields
- [ ] Verify field names match what screens use

## Field Name Verification

**Section 6 sectionStructure.js:**
- `sponsorProtectionOrder`
- `sponsorDomesticViolence`
- `sponsorViolentCrimes`
- `sponsorDrugAlcoholOffenses` ← **MISMATCH?**
- `sponsorOtherCriminalHistory`

**Section 6 Screen Components:**
- ProtectionOrderScreen: `sponsorProtectionOrder` ✅
- DomesticViolenceScreen: `sponsorDomesticViolence` ✅
- ViolentCrimesScreen: `sponsorViolentCrimes` ✅
- DrugAlcoholScreen: `sponsorDrugAlcohol` ❌ **MISMATCH!**
- OtherCriminalHistoryScreen: `sponsorOtherCriminalHistory` ✅

**FIX NEEDED:** DrugAlcoholScreen uses `sponsorDrugAlcohol` but sectionStructure has `sponsorDrugAlcoholOffenses`

## Implementation Order

1. Fix field name mismatch in DrugAlcoholScreen
2. Add Section 6 completion/DQ logic to NavigationPanel (with DQ-aware completion check)
3. Add Section 6 navigation blocking to SectionTimeline
4. Test complete flow matches Section 2 behavior
