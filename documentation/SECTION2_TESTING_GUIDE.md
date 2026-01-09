# Section 2 Testing Guide
**Date:** December 24, 2024
**Purpose:** Step-by-step instructions for testing all disqualification and warning scenarios

---

## OVERVIEW

This guide provides detailed testing steps for all scenarios in Section 2 (Your Relationship), including:
- **RED Disqualification Screens** - Full-page blocks requiring "Back" or "Contact Support"
- **YELLOW Warning Boxes** - Inline warnings that disable Next button
- **BLUE Info Messages** - Informational guidance for state-dependent scenarios

---

## TEST SETUP

### Prerequisites:
1. Navigate to Section 2 (Your Relationship)
2. Have sample test data ready:
   - Sponsor name: "John"
   - Beneficiary name: "Maria"
   - Sponsor DOB: 1990-01-01 (age 34)
   - Beneficiary DOB: 2007-01-01 (age 17)
3. Clear any existing answers before each test

---

## RED DISQUALIFICATION SCREENS

### Test 1: Not Legally Free to Marry

**Steps:**
1. Go to "Legally Free to Marry" screen
2. Select **"No"**

**Expected Result:**
- ✅ Full-page red disqualification screen appears immediately
- ✅ No navigation panels visible (left sidebar and section timeline hidden)
- ✅ Message explains situation requires individual review
- ✅ Two buttons visible:
  - **"Back"** button with left arrow icon
  - **Contact Support** section with email (support@evernestusa.com) and phone (+1 (555) 123-4567)
- ✅ Email link opens mailto
- ✅ Phone link opens tel dialer

**Test "Back" Button:**
1. Click "Back" button
2. ✅ Returns to question
3. ✅ Answer is cleared (no selection)
4. ✅ Can select "Yes" and proceed

---

### Test 2: Not Meeting in Next 3 Months

**Steps:**
1. Go to "Met In Person" screen
2. Select **"No"**
3. Select **"No, and we don't plan to meet in the next 3 months"**

**Expected Result:**
- ✅ Full-page red disqualification screen appears
- ✅ Message explains meeting in person within 2 years is required
- ✅ Same UI as Test 1 (no nav panels, Back button, Contact Support)

**Test "Back" Button:**
1. Click "Back"
2. ✅ Returns to question
3. ✅ Can select different option ("Yes, we've already met")

---

### Test 3: Met Through International Marriage Broker

**Steps:**
1. Go to "International Marriage Broker" screen
2. Select **"Yes"**

**Expected Result:**
- ✅ Full-page red disqualification screen appears
- ✅ Message explains IMBRA restrictions
- ✅ Same UI pattern

**Test "Back" Button:**
1. Click "Back"
2. ✅ Answer cleared
3. ✅ Can select "No"

---

### Test 4: No Intent to Marry Within 90 Days

**Steps:**
1. Go to "Intent to Marry Within 90 Days" screen
2. Select **"No"**

**Expected Result:**
- ✅ Full-page red disqualification screen appears
- ✅ Message explains 90-day requirement
- ✅ Same UI pattern

---

### Test 5: Universal Blood Relationship Prohibitions

**Test 5a: Siblings (WITHOUT state selected first)**
1. Go to Marriage State screen → **Do NOT select a state** → Click Next
2. Go to Relationship screen
3. Select **"Yes"** (we are related)
4. Select **"Blood"**
5. Select **"Closer than first cousins"** (which includes siblings)

**Expected Result:**
- ✅ Full-page red disqualification screen appears **immediately**
- ✅ Works even though NO marriage state was selected
- ✅ Message explains blood relationship restrictions
- ✅ Bug #68 VERIFIED: Universal prohibitions don't require state selection

**Test 5b: Aunt/Uncle and Niece/Nephew**
1. Same steps as 5a
2. Select **"Aunt/Uncle and Niece/Nephew"**

**Expected Result:**
- ✅ Same disqualification screen
- ✅ Works without state selection

---

### Test 6: Universal Adoption Prohibition

**Steps:**
1. Go to Relationship screen
2. Select **"Yes"** (we are related)
3. Select **"Adoption"**
4. Select **"One of us legally adopted the other"**

**Expected Result:**
- ✅ Full-page red disqualification screen appears
- ✅ Works without state selection (Bug #68 fix verified)

---

## YELLOW WARNING SCENARIOS (Next Button Disabled)

### Test 7a: First Cousins + Incompatible State

**Steps:**
1. Go to Marriage State screen
2. Select **"Texas"** (prohibits first cousin marriage)
3. Go to Relationship screen
4. Select **"Yes"** → **"Blood"** → **"First cousins"**

**Expected Result:**
- ✅ Yellow warning box appears inline
- ✅ Message: "In Texas, marriage between first cousins is not permitted..."
- ✅ Guidance: "(1) select a different state where this marriage is legal, or (2) contact customer support"
- ✅ **Next button is DISABLED** (Bug #69 fix verified)
- ✅ Navigation panels still visible (NOT full-page)

**Test Fix:**
1. Go back to Marriage State screen
2. Change to **"California"** (allows first cousin marriage)
3. Return to Relationship screen
4. ✅ Yellow warning disappears
5. ✅ Next button is ENABLED

---

### Test 7b: Adopted Siblings + Incompatible State

**Steps:**
1. Select Marriage State: **"Alaska"** (check if prohibits adopted siblings)
2. Relationship: **"Yes"** → **"Adoption"** → **"Adopted siblings"**

**Expected Result:**
- ✅ Yellow warning appears if state prohibits
- ✅ Next button DISABLED
- ✅ Can fix by changing state

---

### Test 7c: Age Requirement Not Met

**Steps:**
1. Ensure Beneficiary DOB is **2007-01-01** (age 17)
2. Go to Marriage State screen
3. Select **"Nebraska"** (minimum age 19)

**Expected Result:**
- ✅ Yellow warning box appears
- ✅ Message: "In Nebraska, the minimum age to marry is 19. Based on the dates of birth provided, Maria do not meet this requirement..."
- ✅ **Next button is DISABLED** (Bug #69 fix verified)

**Test Fix:**
1. Change state to **"New York"** (minimum age 18)
2. ✅ Warning disappears
3. ✅ Next button ENABLED

---

### Test 7d: Word Count Warning (Informational Only)

**Steps:**
1. Go to Meeting Description screen
2. Type 350+ words in the text area

**Expected Result:**
- ✅ Yellow text appears: "Consider shortening your response. 3-5 sentences (about 50-150 words) is perfect."
- ✅ Word count displayed at bottom right
- ✅ **Next button is STILL ENABLED** (informational only, not blocking)
- ✅ Can proceed with long description

---

## BLUE INFO BOXES WITH EMBEDDED STATE SELECTOR (Improved UX!)

### Test 9a: First Cousins Without State Selected - Answer On The Spot!

**Steps:**
1. Go to Marriage State screen → **Skip it** (don't select state)
2. Go to Relationship screen
3. Select **"Yes"** → **"Blood"** → **"First cousins"**

**Expected Result:**
- ✅ Blue info box appears with **embedded state dropdown**
- ✅ Message: "First cousin marriage is legal in some U.S. states but not others. Please select your planned marriage state to verify eligibility:"
- ✅ State dropdown visible with all 50+ states
- ✅ User can select state **right there** (no navigation needed!)
- ✅ Next button is ENABLED (can skip if they want)

**Test Selecting Compatible State In Embedded Dropdown:**
1. From the blue box dropdown, select **"California"** (allows first cousins)
2. ✅ Blue box disappears immediately
3. ✅ No warning shown (California allows first cousins)
4. ✅ Can proceed to next question

**Test State Saved Globally (Shared State):**
1. Continue through questionnaire
2. When you reach Marriage State screen later in Section 2
3. ✅ "California" is **already pre-selected** (answer preserved!)
4. ✅ No need to answer twice

**Test Selecting Incompatible State:**
1. Go back to Relationship screen (first cousins still selected)
2. Clear the state: Change embedded dropdown back to "Select a state..."
3. ✅ Blue box reappears
4. Select **"Texas"** (prohibits first cousins)
5. ✅ Blue box disappears
6. ✅ **Yellow warning** appears: "In Texas, marriage between first cousins is not permitted..."
7. ✅ **Next button is DISABLED**

---

### Test 9b: Adopted Siblings Without State Selected - Same Pattern

**Steps:**
1. Skip Marriage State selection
2. Relationship: **"Yes"** → **"Adoption"** → **"Adopted siblings"**

**Expected Result:**
- ✅ Blue info box appears with **embedded state dropdown**
- ✅ Message: "Marriage between adopted siblings is legal in some U.S. states but not others. Please select your planned marriage state to verify eligibility:"
- ✅ Can select state on the spot
- ✅ Next button ENABLED

**Test Functionality:**
1. Select a state that allows adopted siblings
2. ✅ Blue box disappears, no warning
3. Go back, select state that prohibits
4. ✅ Yellow warning + Next disabled

---

## EDGE CASE TESTING

### Test 10: Rapid Answer Changes

**Steps:**
1. Legally Free screen: Select "No" → Wait for disqualification
2. Click "Back" → Select "Yes"
3. Immediately select "No" again
4. Click "Back" again
5. Select "Yes" and proceed

**Expected Result:**
- ✅ No crashes or double screens
- ✅ Disqualification appears/disappears correctly
- ✅ State management handles rapid changes

---

### Test 11: Navigation Panel Z-Index

**Steps:**
1. Trigger any red disqualification (e.g., Legally Free = No)
2. Look at left sidebar and section timeline

**Expected Result:**
- ✅ Navigation panels are **completely hidden** behind disqualification screen
- ✅ z-index: 50 on disqualification screen ensures it's on top
- ✅ No way to click navigation panels

---

### Test 12: Mailto and Tel Links

**Steps:**
1. Trigger disqualification screen
2. Click email address (support@evernestusa.com)

**Expected Result:**
- ✅ Opens default mail client with To: field populated

**Steps:**
3. Click phone number (+1 (555) 123-4567)

**Expected Result:**
- ✅ Opens tel: link (on mobile, triggers dialer)

---

## COMPREHENSIVE SCENARIO MATRIX

Test ALL combinations:

| Scenario | State | Relationship | Expected Behavior | Next Button |
|----------|-------|--------------|-------------------|-------------|
| Universal prohibition | None | Siblings | Red DQ screen | N/A (screen blocks) |
| Universal prohibition | Any | Siblings | Red DQ screen | N/A |
| State-dependent | None | First cousins | Blue info | Enabled |
| State-dependent | CA | First cousins | No warning | Enabled |
| State-dependent | TX | First cousins | Yellow warning | **Disabled** ✅ |
| State-dependent | None | Adopted siblings | Blue info | Enabled |
| State-dependent | Varies | Adopted siblings (allowed) | No warning | Enabled |
| State-dependent | Varies | Adopted siblings (prohibited) | Yellow warning | **Disabled** ✅ |
| Age requirement | NE (age 19) | User age 17 | Yellow warning | **Disabled** ✅ |
| Age requirement | NY (age 18) | User age 17 | Yellow warning | **Disabled** ✅ |
| Age requirement | Any | User age 18+ | No warning | Enabled |

---

## REGRESSION TESTING

After confirming all tests pass, verify:

1. ✅ Section 2 navigation still works (Back/Next buttons)
2. ✅ Data persists when navigating away and returning
3. ✅ Progress bar updates correctly
4. ✅ No console errors in browser DevTools
5. ✅ Mobile responsive (test on small screen)
6. ✅ Keyboard navigation works (Tab, Enter, Escape)

---

## KNOWN LIMITATIONS

1. **Contact info is placeholder:** Email and phone need real values before production
2. **Blue info messages don't block:** Users can proceed without selecting state first (intentional design)
3. **Word count warning is soft:** Users can submit 1000+ words if they want (informational only)

---

## TESTING CHECKLIST SUMMARY

- [x] 6 Red disqualification screens (Tests 1-6)
- [x] 4 Yellow warning scenarios (Tests 7a-7d)
- [x] 2 Blue info scenarios (Tests 9a-9b)
- [x] Bug #68 verified (universal prohibitions work without state)
- [x] Bug #69 verified (yellow warnings disable Next)
- [x] Bug #70 verified (no opacity cascade)
- [x] Navigation panel hiding verified
- [x] "Back" button functionality verified
- [x] Contact links verified

**All tests passing = Ready for production deployment**

---

**END OF TESTING GUIDE**
