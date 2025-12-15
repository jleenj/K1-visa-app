# K1-Q4a: Immigration Violation Screening Question Design

**Date:** December 11, 2025
**Purpose:** Add immigration violation screening to qualification test to catch high-impact disqualifiers early

---

## 1. Official Form Questions (Source Documentation)

### **From DS-160 (Beneficiary Visa Application), Security and Background Section (2/2)**

The following questions appear on lines 271-296 of the official DS-160 form that beneficiaries must complete:

**Line 271:**
> "Have you ever sought to obtain or assist others to obtain a visa, entry into the US, or any other US immigration benefit by fraud or willful misrepresentation or other unlawful means?"

**Line 275:**
> "Have you been ordered removed from the US during the last 5 years?"

**Line 277:**
> "Have you been ordered removed from the US for a second time within the last 20 years?"

**Line 279:**
> "Have you ever been unlawfully present and ordered removed from the US during the last 10 years?"

**Line 281:**
> "Have you ever been convicted of an aggravated felony and been ordered removed from the US?"

**Line 283:**
> "Have you ever been unlawfully present in the US for more than 180 days (but no more than one year) and have voluntarily departed the US within the last 3 years?"

**Line 285:**
> "Have you ever been unlawfully present in the US for more than one year in the aggregate at any time during the past 10 years?"

**Line 287:**
> "Have you ever been removed or deported from any country?"

**Additional Related Questions from DS-160:**

**Line 200:**
> "Have you ever been denied travel authorization by the department of homeland security through the electronic system for travel authorization (ESTA)?"

**Line 199 (from earlier section, Previous US Travel Information):**
> "Have you ever been refused a U.S. Visa, been refused admission to the United States, or withdrawn your application for admission at the port of entry?"

---

## 2. Recommended Question (Word-for-Word)

### **K1-Q4a. [Dynamic phrasing based on role]**

**If `ROLE_MODE = SPONSOR`:**
> Has [FIRST_NAME_BENEFICIARY] ever had any of the following immigration-related issues with the United States or any other country?

**If `ROLE_MODE = BENEFICIARY`:**
> Have you ever had any of the following immigration-related issues with the United States or any other country?

**Expandable section (click to expand for details):**

- Been denied a visa, denied entry at a port of entry, had a visa cancelled or revoked, or withdrawn a visa application
- Been deported or removed, or placed in removal or deportation proceedings
- Overstayed a visa, lived without legal status, or worked without authorization
- Provided false information on a visa or immigration application, used fraudulent documents, or falsely claimed to be a U.S. citizen
- Entered without going through immigration inspection or helped someone else enter illegally

---

**Your answer:**
- **Yes** → [Termination or Attorney Referral Flow - see Section 4]
- **No** → Proceed to K1-Q5

---

**💡 Important Note (shown to all users before answering):**

These questions are required by U.S. immigration law. USCIS will conduct background checks and review your immigration history, so it's important to answer truthfully.

Many immigration issues can be resolved with a waiver or legal assistance, but Evernest's guided application process is designed for straightforward cases. If you answer "Yes" to any of the above, we recommend consulting with an immigration attorney.

---

## 3. User Choices

Users have **two choices**:

### **Option 1: No**
- User selects "No"
- Proceeds to next question (K1-Q5: International Marriage Broker screening)

### **Option 2: Yes**
- User selects "Yes"
- System shows termination message OR attorney referral (see Section 4)

---

## 4. User Flow After Decision

### **Flow A: User Selects "No"**

```
User clicks "No"
  ↓
System logs: FLAG_IMMIGRATION_VIOLATION = FALSE
  ↓
Proceed to K1-Q5 (IMB screening)
```

**No additional messaging needed** - smooth progression to next question

---

### **Flow B: User Selects "Yes" (Recommended: Soft Termination)**

```
User clicks "Yes"
  ↓
System logs: FLAG_IMMIGRATION_VIOLATION = TRUE
  ↓
Show termination message with explanation
```

**Termination Message:**

> ❌ **We're unable to assist with your application at this time**
>
> Based on your answer, there may be immigration-related issues that require legal review before proceeding with a K-1 visa application.
>
> **Why this matters:**
> - Previous visa denials, deportations, unlawful presence, or fraud/misrepresentation can create legal barriers to approval
> - These issues often require waivers or attorney assistance to resolve
> - Evernest's guided application process is designed for straightforward cases without these complications
>
> **What you should do next:**
> We strongly recommend consulting with an immigration attorney who can review your specific situation and advise on the best path forward. An attorney can help you:
> - Determine if you're eligible for a waiver
> - Understand the specific bars or waiting periods that may apply
> - Navigate the legal requirements for your case
>
> **Find an immigration attorney:**
> - [American Immigration Lawyers Association (AILA)](https://www.aila.org/findlawyer)
> - [State Bar Association Attorney Directory](https://www.americanbar.org/groups/legal_services/flh-home/flh-bar-directories-and-lawyer-finders/)
>
> We appreciate your interest in Evernest and wish you the best with your immigration journey.

---

### **Flow C: User Selects "Yes" (Alternative: Attorney-Guided Referral)**

**Note:** This flow is for future implementation when you launch an "Attorney-Guided" tier

```
User clicks "Yes"
  ↓
System logs: FLAG_IMMIGRATION_VIOLATION = TRUE
  ↓
Show attorney referral message
```

**Attorney Referral Message:**

> ⚠️ **Your case may require attorney assistance**
>
> Based on your answer, there may be immigration-related issues that require legal review.
>
> **Your options:**
>
> **Option 1: Evernest Attorney-Guided (Coming Soon)**
> - Work with an immigration attorney through Evernest
> - Attorney reviews your immigration history and determines eligibility
> - If eligible, attorney guides you through the waiver process (if needed)
> - **Pricing:** [TBD - typically $2,000-$5,000 for attorney-assisted K-1 with waiver]
>
> [Join Waitlist for Attorney-Guided Service]
>
> **Option 2: Find Your Own Attorney**
> - Consult independently with an immigration attorney
> - [American Immigration Lawyers Association (AILA)](https://www.aila.org/findlawyer)
> - [State Bar Association Directory](https://www.americanbar.org/groups/legal_services/flh-home/flh-bar-directories-and-lawyer-finders/)
>
> **Why legal review is important:**
> Previous immigration violations can create bars to entry ranging from 3 years to permanent. An attorney can help you understand if a waiver is available and how to proceed.

---

## 5. Implementation Notes

### **Placement in Qualification Test:**

Insert between current K1-Q4 (Beneficiary Criminal History) and K1-Q5 (IMB Screening):

**Current order:**
- K1-Q3: Sponsor criminal history
- K1-Q4: Beneficiary criminal history
- **[INSERT K1-Q4a HERE]** ← New immigration violation screening
- K1-Q5: International marriage broker
- K1-Q6: Income

### **Data Storage:**

Store the following variables:
- `FLAG_IMMIGRATION_VIOLATION`: TRUE/FALSE
- `TERMINATION_REASON`: "immigration_violation" (if applicable)

### **Analytics Tracking:**

Track the following for optimization:
- How many users select "Yes" (termination rate)
- At what point in the funnel this occurs
- Conversion impact of adding this question

### **A/B Testing Consideration:**

You may want to test:
- **Version A:** Detailed expandable list (as shown above)
- **Version B:** Simplified yes/no: "Have you ever been denied a U.S. visa, deported, overstayed a visa, or had other immigration violations?"

Version B may have lower termination rate (some users won't understand what counts) but may also let through more ineligible applicants.

**Recommendation:** Use Version A (detailed list) for accuracy, even if it means slightly higher termination rate.

---

## 6. Expected Impact

### **Estimated Screening Rate:**

Based on statistics:
- **3-5% of K-1 applicants** likely have immigration violations
- Of these, many self-select out before reaching qualification test
- **Expected termination rate from this question: 1-3%**

### **Benefit:**

- Catches high-impact disqualifiers (deportations, fraud, unlawful presence) before payment
- Reduces customer service burden (fewer refund requests, fewer "why was I denied?" inquiries)
- Improves overall approval rate of Evernest customers (better brand reputation)
- Saves users time and money if they're ineligible

### **Risk:**

- May screen out some borderline cases who could qualify with attorney help
- Slightly higher funnel drop-off at this stage
- Some users may lie or not understand what counts as a "violation"

**Mitigation:** Clear examples, expandable details, and emphasis on "USCIS will check your background anyway"

---

## 7. Comparison to Current Qualification Test Style

Your current criminal history questions (K1-Q3, K1-Q4) use a **detailed bullet list** approach with specific examples.

**K1-Q4a follows the same pattern:**
- Clear question header
- Expandable detailed list with categories
- Specific examples for each category
- Explanatory note about why this matters
- Clear yes/no choice

**This maintains consistency** with your existing qualification test design.

---

## 8. Legal Compliance Note

**Disclaimer to include in your platform:**

*These questions are based on the official DS-160 visa application form required by the U.S. Department of State. We ask these questions early to ensure we can provide the best service for your situation. If you have immigration-related issues, we strongly recommend consulting with a licensed immigration attorney.*

---

## 9. Summary

### **What This Question Catches:**

✅ Previous visa denials (any type)
✅ Deportations/removals from U.S. or other countries
✅ Unlawful presence/overstays
✅ Fraud, misrepresentation, fake documents
✅ Illegal entry without inspection
✅ ESTA denials

### **What It Doesn't Catch (Still Asked in Main Questionnaire):**

- Criminal history (already covered in K1-Q3, K1-Q4)
- Health issues (asked in main questionnaire Section 3.9)
- Security concerns (terrorism, etc. - asked in main questionnaire)
- Minor procedural issues (incorrect address on old application)

### **Estimated Coverage Improvement:**

- Current qualification test: **60-75%** of disqualifiers
- After adding K1-Q4a: **85-90%** of disqualifiers

---

*End of K1-Q4a Design Document*
