# Beneficiary Section 6 Implementation Plan
**Date:** January 6, 2026
**Scope:** Implement DQ infrastructure for beneficiary Section 6 (Legal & Security)

---

## Current Problems

### 1. US Travel History Subsection
**Issue:** User sees warning when beneficiary is currently in US, but can continue questionnaire via:
- Click "Next" button
- Click left navigation to another subsection
- Click top navigation to another section

**Root Cause:**
- No conditional follow-up question to determine if beneficiary will leave US before filing
- No standalone DQ screen
- No navigation blocking

### 2. Other Subsections (Criminal History, Immigration Issues, Health, Security)
**Issue:**
- "Next" button is disabled when certain answers selected
- BUT user can still navigate via left/top navigation panels
- No standalone DQ screens
- No DQ tracking or navigation blocking

### 3. TOC-Style Left Navigation
**Issue:**
- No visual indicator (red dot) when subsection has DQ answer
- Unlike sponsor Section 6 which uses `oneQuestionPerScreen: true` with dot indicators
- Beneficiary Section 6 uses traditional TOC navigation with subsection titles

---

## Legal Requirements (Fact-Checked)

### From I-129F Form (Official PDF):
> "If your beneficiary is currently in the United States, complete Item Numbers 38.a. - 38.h."

This section asks for:
- Entry type (visitor, student, etc.)
- I-94 number
- Date of arrival
- Date authorized stay expired
- Passport info

### Key Legal Principle (Web Search + I-129F):
1. **Filing I-129F:** Can be filed while beneficiary is in US (form has section for this)
2. **Consular Processing:** Beneficiary MUST leave US to complete K-1 visa process at embassy/consulate abroad
3. **No Adjustment of Status on K-1:** Cannot "switch" to K-1 while in US - must enter on K-1 visa
4. **Alternative:** If beneficiary is in US, couple should consider marriage + I-130/I-485 (adjustment of status) instead

### Disqualification Trigger:
**If beneficiary is currently in US AND will still be in US when filing I-129F**, they likely need different visa path (not K-1).

---

## Implementation Plan

### TASK 1: Fix US Travel History Subsection

#### 1.1 Add Conditional Question
**Current flow:**
```
Q1: Has [beneficiary] ever been to the United States?
  → Yes/No

Q2: Is [beneficiary] currently in the United States?
  → Yes/No
  → If Yes: Show red warning box (but allow continuation)
```

**New flow:**
```
Q1: Has [beneficiary] ever been to the United States?
  → Yes/No

Q2: Is [beneficiary] currently in the United States?
  → Yes/No

  Q2a (CONDITIONAL - only if Q2 = Yes): Will [beneficiary] still be in the United States when you file this petition?
    → Yes → STANDALONE DQ SCREEN
    → No → Show blue info box, allow continuation
    → Unsure → Show blue info box with "Contact Customer Service", allow continuation
```

#### 1.2 Update Warning Messages

**When Q2 = "Yes" (inline warning):**
```
ℹ️ Important: K-1 Visa Processing Requirement

The K-1 fiancé(e) visa requires consular processing at a U.S. embassy or consulate abroad.
This means [beneficiary] will need to leave the United States to complete the visa application
process, even if you file the I-129F petition while they are in the U.S.
```

**When Q2a = "Yes" (standalone DQ screen):**
```
⚠️ K-1 Visa May Not Be the Right Option

Based on your answers, the K-1 fiancé(e) visa may not be the best option for your situation.

Why this matters:
• The K-1 visa requires [beneficiary] to apply for the visa at a U.S. embassy or consulate
  in their home country
• [Beneficiary] cannot "switch" to K-1 status while already in the United States
• If [beneficiary] will still be in the U.S. when you're ready to file, you may want to
  consider alternative options such as getting married and filing for adjustment of status
  (Form I-130/I-485) instead

What you should do:
This situation requires personalized legal guidance to determine the best visa pathway
for your circumstances.

[Contact Customer Service Button]
[Go Back Button]
```

**When Q2a = "No" (inline blue info box):**
```
✓ Good to know

You can file your I-129F petition while [beneficiary] is in the United States, as long as
[beneficiary] returns to their home country before the visa interview. Make sure to plan
for [beneficiary] to be abroad when the U.S. embassy or consulate is ready to schedule
the visa appointment.
```

**When Q2a = "Unsure" (inline blue info box with action):**
```
ℹ️ Need help deciding?

The K-1 visa process requires careful timing. If you're unsure whether [beneficiary] will
still be in the U.S. when you file your petition, our support team can help you understand
your options.

[Contact Customer Service Button] [Continue Anyway Button]
```

#### 1.3 Field Names
```javascript
'beneficiaryEverInUS' // Q1
'beneficiaryCurrentlyInUS' // Q2
'beneficiaryWillBeInUSWhenFiling' // Q2a (NEW)
'section6_beneficiary_currentlyInUS_DQ' // DQ flag (NEW)
```

---

### TASK 2: Implement DQ Screens for Other Subsections

#### 2.1 Criminal History
**Current:** Single field `beneficiaryCriminalHistory`
**Change to:** Multiple questions like sponsor side

**Questions needed (match DS-160):**
1. Protection orders/restraining orders
2. Arrests, convictions, citations
3. Drug violations
4. Prostitution or human trafficking
5. Money laundering
6. Controlled substance trafficking

**DQ Flags:**
```javascript
'section6_beneficiary_criminalHistory_DQ'
```

#### 2.2 Immigration Issues
**Current:** Single field `beneficiaryImmigrationIssues`
**Questions needed (match DS-160):**
1. Ever been denied US visa
2. Ever overstayed US visa
3. Ever violated US immigration law
4. Ever been deported/removed
5. Ever worked without authorization in US

**DQ Flags:**
```javascript
'section6_beneficiary_immigrationIssues_DQ'
```

#### 2.3 Health & Vaccinations
**Current:** Single field `beneficiaryHealthConcerns`
**Questions needed:**
1. Communicable diseases (TB, etc.)
2. Mental health disorders with harmful behavior
3. Drug abuse/addiction

**DQ Flags:**
```javascript
'section6_beneficiary_health_DQ'
```

#### 2.4 Security & Human Rights
**Current:** Single field `beneficiarySecurityViolations`
**Questions needed (match DS-160):**
1. Terrorist activities
2. Genocide, torture, extrajudicial killings
3. Nazi persecution
4. Totalitarian party membership
5. Child soldiers

**DQ Flags:**
```javascript
'section6_beneficiary_security_DQ'
```

---

### TASK 3: TOC Navigation DQ Indicators

#### Problem
Sponsor Section 6 uses `oneQuestionPerScreen: true` → shows progress dots
Beneficiary Section 6 uses traditional subsection list → no DQ indicators

#### Solution Options

**Option A: Red Dot Badge (Recommended)**
```
┌─────────────────────────────┐
│ PARTNER'S PROFILE           │
│ (BENEFICIARY)         ▼     │
├─────────────────────────────┤
│ U.S. TRAVEL HISTORY    🔴   │ ← Red dot when DQ present
│ CRIMINAL HISTORY            │
│ IMMIGRATION ISSUES          │
│ HEALTH & VACCINATIONS       │
│ SECURITY & HUMAN RIGHTS     │
└─────────────────────────────┘
```

**Option B: Red Background**
```
┌─────────────────────────────┐
│ U.S. TRAVEL HISTORY         │
│ ┌─────────────────────────┐ │
│ │ CRIMINAL HISTORY        │ │ ← Red background when DQ
│ └─────────────────────────┘ │
│ IMMIGRATION ISSUES          │
└─────────────────────────────┘
```

**Option C: Icon + Color**
```
┌─────────────────────────────┐
│ ⚠️ U.S. TRAVEL HISTORY      │ ← Warning icon + red text
│ CRIMINAL HISTORY            │
│ IMMIGRATION ISSUES          │
└─────────────────────────────┘
```

**Option D: Inline Status Badge**
```
┌─────────────────────────────┐
│ U.S. TRAVEL HISTORY         │
│   [⚠️ Needs Review]          │ ← Badge below title
│ CRIMINAL HISTORY            │
│ IMMIGRATION ISSUES          │
└─────────────────────────────┘
```

#### Recommended: Option A (Red Dot Badge)
**Pros:**
- Matches sponsor Section 6 visual language (dots = status)
- Subtle but visible
- Doesn't break layout
- Clear semantic meaning

**Implementation in NavigationPanel.jsx:**
```javascript
// In renderSubsections() function (around line 400+)
// Add DQ check for beneficiary Section 6 subsections

const beneficiarySection6DQMap = {
  'us-travel': 'section6_beneficiary_currentlyInUS_DQ',
  'criminal-history': 'section6_beneficiary_criminalHistory_DQ',
  'immigration-issues': 'section6_beneficiary_immigrationIssues_DQ',
  'health-vaccinations': 'section6_beneficiary_health_DQ',
  'security-human-rights': 'section6_beneficiary_security_DQ'
};

const hasDQ = beneficiarySection6DQMap[subsection.id] &&
              currentData[beneficiarySection6DQMap[subsection.id]];

// Then render red dot if hasDQ
{hasDQ && (
  <span className="ml-2 inline-block w-2 h-2 bg-red-500 rounded-full"></span>
)}
```

---

## File Changes Required

### New Files to Create:
1. `src/components/screens/section6/beneficiary/USTravelHistoryScreen.jsx` (replace existing)
2. `src/components/screens/section6/beneficiary/CriminalHistoryIntroScreen.jsx` (NEW)
3. `src/components/screens/section6/beneficiary/ProtectionOrdersScreen.jsx` (NEW)
4. `src/components/screens/section6/beneficiary/ArrestsConvictionsScreen.jsx` (NEW)
5. ...more criminal history screens
6. `src/components/screens/section6/beneficiary/ImmigrationIssuesIntroScreen.jsx` (NEW)
7. ...immigration issues screens
8. `src/components/screens/section6/beneficiary/HealthConcernsIntroScreen.jsx` (NEW)
9. ...health screens
10. `src/components/screens/section6/beneficiary/SecurityViolationsIntroScreen.jsx` (NEW)
11. ...security screens

### Files to Modify:
1. `src/data/sectionStructure.js` - Update beneficiary Section 6 structure
2. `src/QuestionnaireRouter.jsx` - Add new routes
3. `src/components/NavigationPanel.jsx` - Add DQ indicators for TOC navigation
4. `src/components/SectionTimeline.jsx` - Add beneficiary Section 6 DQ checking

---

## Questions for User

1. **TOC Navigation Indicator:** Which option do you prefer (A/B/C/D)?

2. **Criminal History Questions:** Should we match DS-160 exactly, or simplify into fewer questions?

3. **Standalone DQ for all?** Some beneficiary questions are less severe (e.g., "ever had flu"). Should ALL "yes" answers trigger standalone DQ, or only serious issues?

4. **Wording for Q2a:**
   - Option A: "Will [beneficiary] still be in the United States when you file this petition?"
   - Option B: "Will [beneficiary] be able to leave the U.S. before the visa interview?"
   - Option C: "Is [beneficiary] planning to return to their home country before applying for the visa?"

5. **"Unsure" option:** Should we allow users to select "I'm not sure" for Q2a, or force Yes/No?

---

## Implementation Order (Recommended)

1. ✅ **Phase 1:** US Travel History subsection (highest priority, user reported)
   - Add Q2a conditional question
   - Add DQ tracking
   - Add standalone DQ screen
   - Add navigation blocking

2. **Phase 2:** TOC navigation DQ indicators (affects all subsections)
   - Choose design option
   - Implement in NavigationPanel.jsx
   - Test with US Travel History

3. **Phase 3:** Criminal History subsection
   - Break into multiple screens
   - Add DQ tracking for each
   - Add standalone DQ screens
   - Test navigation blocking

4. **Phase 4:** Immigration Issues subsection (similar to criminal history)

5. **Phase 5:** Health & Security subsections

---

## Next Steps

**User needs to decide:**
1. TOC indicator design (A/B/C/D)
2. Q2a wording preference
3. "Unsure" option - yes or no?
4. Approval to proceed with Phase 1

Once approved, I'll implement Phase 1 (US Travel History) first, then iterate on remaining subsections.
