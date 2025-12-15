# K-1 Visa Questionnaire - Complete Section Structure

**Created:** December 12, 2025
**Last Updated:** December 12, 2025
**Status:** Approved Structure - Ready for Implementation

---

## UI/UX Rules

### **Default Behavior for All Sections (Except Section 2):**
1. **User's profile appears ON TOP** (User = whoever is filling out the questionnaire, identified in qualification test)
2. **User's profile is EXPANDED by default** when landing on that section
3. **Partner's profile appears BELOW**
4. **Partner's profile is COLLAPSED by default**
5. **When user clicks partner's profile** → User's profile collapses, partner's expands
6. **Default landing screen** → First subsection of user's profile (e.g., "NAME" under user's Personal Information)

### **Section 2 (Your Relationship) Exception:**
- No sponsor/beneficiary split
- Questions apply to both people
- No collapsible profiles

---

## SECTION 1: PERSONAL INFORMATION

### **👤 [User]'s Profile** [EXPANDED BY DEFAULT, ON TOP]

#### **NAME**
- Legal Last Name (Family Name) - **BOTH**
- Legal First Name (Given Name) - **BOTH**
- Middle Name - **BOTH**
- Other Names Used (aliases, maiden name, nicknames) - **BOTH**
- Name in Native Alphabet - Last Name (if applicable) - **BENEFICIARY ONLY**
- Name in Native Alphabet - First Name (if applicable) - **BENEFICIARY ONLY**
- Name in Native Alphabet - Middle Name (if applicable) - **BENEFICIARY ONLY**

#### **CONTACT INFO**
- Email Address - **BOTH**
- Daytime Phone Number - **BOTH**
- Mobile Phone Number (optional) - **BOTH**

#### **BIRTHDATE**
- Date of Birth - **BOTH**
- Place of Birth:
  - City - **BOTH**
  - Province/State/Territory - **BOTH**
  - Country - **BOTH**

#### **CITIZENSHIP & IDENTIFICATION**
- Country of Citizenship or Nationality - **BENEFICIARY ONLY**
- How did you obtain U.S. citizenship? - **SPONSOR ONLY**
  - Do you have a Certificate of Naturalization or Certificate of Citizenship in your own name? (conditional: if obtained through Naturalization or Citizenship through parents) - **SPONSOR ONLY**
    - Certificate Number (conditional: if answer is "Yes") - **SPONSOR ONLY**
    - Certificate Date of Issuance (conditional: if answer is "Yes") - **SPONSOR ONLY**
    - Certificate Place of Issuance - City (conditional: if answer is "Yes") - **SPONSOR ONLY**
    - Certificate Place of Issuance - State (conditional: if answer is "Yes") - **SPONSOR ONLY**
    - Certificate Place of Issuance - Country (conditional: if answer is "Yes") - **SPONSOR ONLY**
- Social Security Number - **Required for SPONSOR, Optional for BENEFICIARY**
- USCIS File Number (A-Number) if any - **BOTH**
- USCIS Online Account Number (if any) - **SPONSOR ONLY**

#### **BIOGRAPHIC & PHYSICAL INFORMATION**
- Sex - **BOTH**
- Ethnicity - **SPONSOR ONLY**
- Race - **SPONSOR ONLY**
- Height - **SPONSOR ONLY**
- Weight - **SPONSOR ONLY**
- Eye Color - **SPONSOR ONLY**
- Hair Color - **SPONSOR ONLY**

---

### **👤 [Partner]'s Profile** [COLLAPSED BY DEFAULT, BELOW]

*(Same structure as above, with SPONSOR/BENEFICIARY fields reversed)*
*When user clicks partner's section → User's section collapses, partner's expands (and vice versa)*

---

## SECTION 2: YOUR RELATIONSHIP

**No sponsor/beneficiary split - applies to both people**

> **⚠️ IMPLEMENTATION NOTE (Task 2):**
> Unlike Section 1 where each subsection is a separate screen, Section 2 uses a **one-question-per-screen format** with "Back" and "Next" buttons. Each individual question below should be its own screen. Left-hand navigation remains visible throughout.
> **Exception:** Conditional questions (marked as "conditional") should appear on the SAME screen as their parent question and show/hide dynamically based on the parent answer.
> **Rationale:** These are largely unrelated questions (eligibility checks, disclosures, plans), so showing them one-by-one reduces cognitive load and feels more conversational.

### **MARRIAGE PLANS**
*Tell us about your plans to marry in the United States*

- Which U.S. state do you plan to marry in? - **BOTH**
- Do you and [BeneficiaryFirstName] intend to marry each other within 90 days of [his/her/their] arrival in the United States? - **BOTH**

### **VISA REQUIREMENTS**
*These are the legal requirements you must meet to qualify for a K-1 visa*

- Are both [SponsorFirstName] and [BeneficiaryFirstName] legally free to marry under U.S. law? - **BOTH**
- Have you and [BeneficiaryFirstName] physically met in person (in the same place at the same time) within the past 2 years? - **BOTH**
  - When do you plan to meet [BeneficiaryFirstName] in person? (conditional: if answer is "No") - **BOTH**
- Did you meet [BeneficiaryFirstName] through an International Marriage Broker or marriage agency? - **BOTH**
- Are you and [BeneficiaryFirstName] currently related to each other in any way (by blood, adoption, or marriage)? - **BOTH**
  - How are you related? (conditional: if answer is "Yes") - **BOTH**
    - What is your blood relationship? (conditional: if "How are you related?" = "Related by blood") - **BOTH**
    - What is your relationship? (conditional: if "How are you related?" = "Related through adoption") - **BOTH**
    - What is your relationship? (conditional: if "How are you related?" = "Related through marriage") - **BOTH**
- Describe the circumstances of your in-person meeting with [BeneficiaryFirstName] - **BOTH**

---

## SECTION 3: COMPLETE ADDRESS HISTORY

### **👤 [User]'s Addresses** [EXPANDED BY DEFAULT, ON TOP]

#### **CURRENT ADDRESSES**
- Mailing Address (complete with street, city, state/province, postal code, country) - **BOTH**
  - In Care Of Name (optional) - **BOTH**
- Is physical address different from mailing address? - **BOTH**
  - Current Physical Address (conditional: if answer is "Yes", complete with street, city, state/province, postal code, country) - **BOTH**
  - Physical Address - In Care Of Name (conditional: if answer is "Yes", optional) - **BOTH**
- Address in Native Alphabet (if applicable) - **BENEFICIARY ONLY**
  - **Usernote:** This refers to the current physical address (or mailing address if same as physical) written in native script
- Date moved to current physical address (or mailing address if same as physical) - **BOTH**

#### **ADDRESS HISTORY**

> **⚠️ IMPLEMENTATION NOTE (Task 2):**
> **Visual Dual Timeline Component Required (SPONSOR ONLY)**
>
> The address history section for sponsors requires **TWO overlapping timelines** displayed simultaneously:
> 1. **5-Year Address History** (required for both sponsor and beneficiary)
> 2. **States/Countries Since Age 18** (sponsor only)
>
> These timelines overlap because the "since age 18" period includes the 5-year history. Both must be shown on the **same screen** for sponsors.
>
> **Location & Visibility:**
> - Display in the **left panel below the navigation** (always visible while in this subsection)
> - Show **two stacked timeline bars**:
>   - **Top bar:** "Since Age 18" (longer timeline, shows only states/countries as segments)
>   - **Bottom bar:** "Past 5 Years" (shorter timeline, shows full addresses with street details)
> - Update in real-time as users add/edit address periods
>
> **Visual Design:**
> - **Top Timeline (Since Age 18):**
>   - Horizontal timeline from age 18 → today
>   - Segments labeled with state/country only (e.g., "California, USA" or "United Kingdom")
>   - Green filled segments = covered, red gaps = needs filling
>   - Date markers showing key milestones (e.g., "Age 18: Jan 2005", "5 Years Ago: Dec 2019", "Today: Dec 2024")
>   - Hover tooltips: "California, USA (Jan 2005 - Dec 2010)"
>
> - **Bottom Timeline (Past 5 Years):**
>   - Horizontal timeline from 5 years ago → today
>   - Segments showing full address coverage with street-level detail
>   - Green filled segments = covered, red gaps = needs filling
>   - Date markers showing year boundaries
>   - Hover tooltips: "123 Main St, San Francisco, CA (Jan 2022 - Present)"
>
> - **Visual Connection:**
>   - Align the "Past 5 Years" portion of both timelines vertically
>   - Use subtle visual indicator (dotted line or shading) showing overlap zone
>   - Show coverage percentage for each timeline separately
>
> **Gap Detection:**
> - Label gaps with human-readable format: "Gap 1: Jan 15, 2015 → Mar 3, 2017 (2 years 1 month)"
> - Show which timeline has the gap (5-year or since-18)
> - Display separate coverage percentages:
>   - "5-Year Coverage: 100% ✅"
>   - "Since Age 18 Coverage: 87%"
>
> **User Guidance:**
> - "💡 The 5-year address history requires complete street addresses"
> - "💡 Since age 18 only requires states/countries (not full addresses)"
> - When gaps exist: "Add address periods to cover these gaps"
> - When complete: "✅ Your address history is complete!"
>
> **For Beneficiaries:**
> - Show only the **single 5-year timeline** (no "since age 18" requirement)
> - Simpler single-bar visualization

- Previous Addresses (Past 5 Years) - List with start/end dates (conditional: if current address < 5 years) - **BOTH**
- Places Lived Since Age 18 - States and countries list with date ranges - **SPONSOR ONLY**

#### **FUTURE U.S. ADDRESS** - **BENEFICIARY ONLY**
- Address in the United States Where [BeneficiaryFirstName] Intends to Live - **BENEFICIARY ONLY**

---

### **👤 [Partner]'s Addresses** [COLLAPSED BY DEFAULT, BELOW]

*(Same structure as above, with SPONSOR/BENEFICIARY fields reversed)*
*When user clicks partner's section → User's section collapses, partner's expands (and vice versa)*

---

## SECTION 4: FAMILY BACKGROUND

### **👤 [User]'s Family Background** [EXPANDED BY DEFAULT, ON TOP]

#### **MARRIAGE**
- Current Marital Status - **BOTH**
- How many times has [Name] been previously married? (conditional: if Divorced or Widowed) - **BOTH**
  - Previous Marriage #[N] - Former spouse last name (conditional: if 1 or more previous marriages) - **BOTH**
  - Previous Marriage #[N] - Former spouse first name (conditional: if 1 or more previous marriages) - **BOTH**
  - Previous Marriage #[N] - Former spouse middle name (conditional: if 1 or more previous marriages) - **BOTH**
  - Previous Marriage #[N] - Spouse's Date of Birth (conditional: if 1 or more previous marriages) - **BENEFICIARY ONLY**
  - Previous Marriage #[N] - Spouse's Country of Birth (conditional: if 1 or more previous marriages) - **BENEFICIARY ONLY**
  - Previous Marriage #[N] - Date of marriage (conditional: if 1 or more previous marriages) - **BENEFICIARY ONLY**
  - Previous Marriage #[N] - Date marriage ended (conditional: if 1 or more previous marriages) - **BOTH**

#### **PARENTS**

**First Parent:**
- First Name - **BOTH**
- Middle Name - **BOTH**
- Last Name - **BOTH**
- Date of Birth - **BOTH**
- Sex - **BOTH**
- Country of Birth - **BOTH**
- Country of Residence - **BOTH**
- City/Town/Village of Residence - **BOTH**

**Second Parent:**
- First Name - **BOTH**
- Middle Name - **BOTH**
- Last Name - **BOTH**
- Date of Birth - **BOTH**
- Sex - **BOTH**
- Country of Birth - **BOTH**
- Country of Residence - **BOTH**
- City/Town/Village of Residence - **BOTH**

#### **CHILDREN** - **BENEFICIARY ONLY**
- Does [BeneficiaryFirstName] have any children? - **BENEFICIARY ONLY**
  - Child - Last Name (conditional: if answer is "Yes") - **BENEFICIARY ONLY**
  - Child - First Name (conditional: if answer is "Yes") - **BENEFICIARY ONLY**
  - Child - Middle Name (conditional: if answer is "Yes") - **BENEFICIARY ONLY**
  - Child - Date of Birth (conditional: if answer is "Yes") - **BENEFICIARY ONLY**
  - Child - Country of Birth (conditional: if answer is "Yes") - **BENEFICIARY ONLY**
  - Child - Does child reside with beneficiary? (conditional: if answer is "Yes") - **BENEFICIARY ONLY**
    - Child - Physical Address (conditional: if answer is "No") - **BENEFICIARY ONLY**

---

### **👤 [Partner]'s Family Background** [COLLAPSED BY DEFAULT, BELOW]

*(Same structure as above, with SPONSOR/BENEFICIARY fields reversed)*
*When user clicks partner's section → User's section collapses, partner's expands (and vice versa)*

---

## SECTION 5: EMPLOYMENT HISTORY

> **⚠️ IMPLEMENTATION NOTE (Task 2):**
> **Visual Timeline Component Required**
>
> **Note:** This section has **NO subsection groupings** in the navigation panel (unlike other sections that have subsections like MARRIAGE, PARENTS, etc.). The only split is User vs Partner profiles.
>
> The employment history section requires a **persistent visual timeline** that helps users understand their 5-year coverage at a glance. This timeline should:
>
> **Location & Visibility:**
> - Display in the **left panel below the navigation** (always visible while in this section)
> - Remain visible as users scroll through employment entry fields
> - Update in real-time as users add/edit employment periods
>
> **Visual Design:**
> - **Horizontal timeline bar** representing 5 years (today → 5 years ago)
> - **Filled segments** for employment periods (green = covered)
> - **Gap segments** for uncovered periods (red = needs filling)
> - **Date markers** showing year boundaries (e.g., 2020, 2021, 2022, 2023, 2024, 2025)
> - **Hover tooltips** showing exact dates and employer names for each segment
>
> **Gap Detection:**
> - Clearly label gaps with human-readable format: "Gap 1: Dec 14, 2020 → Dec 30, 2024 (3 years 11 months)"
> - Not "Gap 1: 2020-12-14 to 2024-12-30 (1478 days)"
> - Show visual indicator (red segment on timeline) for each gap
> - Display total coverage percentage (e.g., "Coverage: 87% complete")
>
> **User Guidance:**
> - When gaps exist: "💡 Add work periods, education, or other activities to cover these gaps"
> - When complete: "✅ Your 5-year timeline is complete!"
> - Link gaps to "Add Employment Period" action

### **👤 [User]'s Employment History** [EXPANDED BY DEFAULT, ON TOP]

- 5-Year Employment Timeline - List of employment periods with:
  - Employer name - **BOTH**
  - Job title - **BOTH**
  - Start date - **BOTH**
  - End date (or "Current") - **BOTH**
  - Employment type (Full-time, Part-time, Self-employed, Unemployed, Student, Retired, etc.) - **BOTH**
  - Address of employer (city, state/province, country) - **BOTH**

---

### **👤 [Partner]'s Employment History** [COLLAPSED BY DEFAULT, BELOW]

*(Same structure as above, with SPONSOR/BENEFICIARY fields reversed)*
*When user clicks partner's section → User's section collapses, partner's expands (and vice versa)*

---

## SECTION 6: LEGAL & SECURITY HISTORY

### **👤 [User]'s Legal & Security History** [EXPANDED BY DEFAULT, ON TOP]

#### **U.S. TRAVEL HISTORY** - **BENEFICIARY ONLY**
- Has [Name] ever been in the United States? - **BENEFICIARY ONLY**
  - Is [Name] currently in the United States? (conditional: if answer is "Yes") - **BENEFICIARY ONLY**

#### **CRIMINAL HISTORY - SPONSOR**
- Protection or restraining orders - **SPONSOR ONLY**
- Domestic violence, dating violence, or stalking - **SPONSOR ONLY**
- Violent crimes (homicide, rape, kidnapping, assault, etc.) - **SPONSOR ONLY**
- Multiple drug or alcohol-related offenses (3+) - **SPONSOR ONLY**
- Other crimes (fraud, theft, prostitution, etc.) - **SPONSOR ONLY**

#### **CRIMINAL HISTORY - BENEFICIARY**
- Criminal History & Legal Background (comprehensive screening covering all crime categories) - **BENEFICIARY ONLY**

#### **IMMIGRATION ISSUES** - **BENEFICIARY ONLY**
- Immigration violations (visa denials, deportations, unlawful presence, fraud) - **BENEFICIARY ONLY**

#### **HEALTH & VACCINATIONS** - **BENEFICIARY ONLY**
- Communicable diseases - **BENEFICIARY ONLY**
- Mental or physical disorder with harmful behavior - **BENEFICIARY ONLY**
- Drug abuse or addiction (current or past) - **BENEFICIARY ONLY**
- Lack of vaccination documentation - **BENEFICIARY ONLY**

#### **SECURITY & HUMAN RIGHTS** - **BENEFICIARY ONLY**
- Terrorism, espionage, sabotage - **BENEFICIARY ONLY**
- Genocide, torture, war crimes - **BENEFICIARY ONLY**
- Human trafficking - **BENEFICIARY ONLY**
- Child soldiers recruitment - **BENEFICIARY ONLY**
- Religious freedom violations (as government official) - **BENEFICIARY ONLY**
- Forced abortion/sterilization programs - **BENEFICIARY ONLY**
- Coercive organ transplantation - **BENEFICIARY ONLY**
- Communist or totalitarian party membership - **BENEFICIARY ONLY**
- Benefited from family trafficking/terrorism (past 5 years) - **BENEFICIARY ONLY**

---

### **👤 [Partner]'s Legal & Security History** [COLLAPSED BY DEFAULT, BELOW]

*(Same structure as above, with SPONSOR/BENEFICIARY fields reversed)*
*When user clicks partner's section → User's section collapses, partner's expands (and vice versa)*

---

## SECTION 7: PREVIOUS PETITIONS & AFFIDAVITS

**SPONSOR ONLY** (No beneficiary subsection)

#### **PREVIOUS SPONSORSHIPS**
- Have you ever filed Form I-129F for any other beneficiary? - **SPONSOR ONLY**
  - How many times have you filed Form I-129F for other beneficiaries? (conditional: if answer is "Yes") - **SPONSOR ONLY**
  - For each previous petition (conditional: if 1 or more petitions):
    - Beneficiary first name - **SPONSOR ONLY**
    - Beneficiary middle name - **SPONSOR ONLY**
    - Beneficiary last name - **SPONSOR ONLY**
    - Beneficiary A-Number - **SPONSOR ONLY**
    - Date of filing - **SPONSOR ONLY**
    - USCIS action (Approved, Denied, Revoked, Withdrawn, Other) - **SPONSOR ONLY**
    - Do you currently have an active Form I-134 filed for this beneficiary? (conditional: if USCIS action = "Approved") - **SPONSOR ONLY**
      - Relationship to beneficiary (conditional: if active I-134 = "Yes") - **SPONSOR ONLY**
      - Beneficiary date of birth (conditional: if active I-134 = "Yes") - **SPONSOR ONLY**
      - I-134 receipt number (conditional: if active I-134 = "Yes") - **SPONSOR ONLY**

#### **OTHER OBLIGATIONS**
- Have you previously sponsored anyone ELSE using an immigration form where you're still financially responsible? - **SPONSOR ONLY**
  - How many people are you still financially obligated to support? (conditional: if answer is "Yes") - **SPONSOR ONLY**
  - For each other obligation (conditional: if 1 or more people):
    - Form type (I-134A, I-864, I-864EZ, I-864A) - **SPONSOR ONLY**
    - Person's first name - **SPONSOR ONLY**
    - Person's middle name - **SPONSOR ONLY**
    - Person's last name - **SPONSOR ONLY**
    - Date of filing - **SPONSOR ONLY**
    - Relationship to you - **SPONSOR ONLY**
    - Receipt number - **SPONSOR ONLY**

#### **HOUSEHOLD MEMBERS**
- Do you have any children under 18 years of age? - **SPONSOR ONLY**
  - How many children under 18 do you have? (conditional: if answer is "Yes") - **SPONSOR ONLY**
  - For each child (conditional: if 1 or more children):
    - First name - **SPONSOR ONLY**
    - Middle name - **SPONSOR ONLY**
    - Last name - **SPONSOR ONLY**
    - Date of birth - **SPONSOR ONLY**
    - A-Number (if any) - **SPONSOR ONLY**
    - Does this child meet I-134 criteria? (checkbox: claimed as dependent OR lived with you 6+ months) - **SPONSOR ONLY**
- How many other dependents did you claim on your most recent Federal income tax return? - **SPONSOR ONLY**
  - For each other dependent (conditional: if 1 or more dependents):
    - First name - **SPONSOR ONLY**
    - Middle name - **SPONSOR ONLY**
    - Last name - **SPONSOR ONLY**
    - Date of birth - **SPONSOR ONLY**
    - Relationship to you - **SPONSOR ONLY**
    - A-Number (if any) - **SPONSOR ONLY**
    - Receipt number (if any) - **SPONSOR ONLY**

---

## SECTION 8: FINANCIAL INFORMATION

**SPONSOR ONLY** (No beneficiary subsection)

#### **INCOME DOCUMENTATION**
- Income proof method (IRS Tax Return Transcript or Manual entry) - **SPONSOR ONLY**
- Selected tax year - **SPONSOR ONLY**
  - IRS Tax Return Transcript upload (conditional: if method = "IRS Tax Return Transcript") - **SPONSOR ONLY**

#### **INCOME SOURCES (Manual entry method)**
- For each income source (conditional: if method = "Manual entry"):
  - Income type (Wages/Salary, Self-employment, Rental income, Interest/Dividends, Retirement, Social Security, Unemployment, Child support/Alimony, Other) - **SPONSOR ONLY**
  - Amount (annual) - **SPONSOR ONLY**
  - Currency - **SPONSOR ONLY**
  - Description/notes - **SPONSOR ONLY**
- Total annual income (auto-calculated) - **SPONSOR ONLY**
- Income gap vs. requirement (auto-calculated) - **SPONSOR ONLY**

#### **ASSETS**
- For each asset (conditional: if income gap exists):
  - Asset type (Savings, Checking, Money Market, Certificate of Deposit, Stocks/Bonds/Mutual Funds, Real Estate, Vehicle, Retirement Account, Other) - **SPONSOR ONLY**
  - Description - **SPONSOR ONLY**
  - Current value - **SPONSOR ONLY**
  - Currency - **SPONSOR ONLY**
  - Owner (Sponsor, Beneficiary, Joint) - **SPONSOR ONLY**
  - Is asset available for beneficiary's support? - **SPONSOR ONLY**
- Total asset value (auto-calculated) - **SPONSOR ONLY**
- Asset value as income equivalent (auto-calculated, assets ÷ 5 for K-1) - **SPONSOR ONLY**
- Asset surplus/shortfall (auto-calculated) - **SPONSOR ONLY**

#### **CONTRIBUTIONS TO BENEFICIARY**
- Do you provide financial contributions to beneficiary? - **SPONSOR ONLY**
  - For each contribution type (conditional: if answer is "Yes"):
    - Contribution category (Living expenses, Housing, Education, Healthcare, Travel, Gifts, Loans, Other) - **SPONSOR ONLY**
    - Monthly amount - **SPONSOR ONLY**
    - Currency - **SPONSOR ONLY**
    - Description - **SPONSOR ONLY**
  - Total monthly contributions (auto-calculated) - **SPONSOR ONLY**
  - Total annual contributions (auto-calculated) - **SPONSOR ONLY**

---

## Section Order Summary

1. **Personal Information** (Sponsor + Beneficiary)
2. **Your Relationship** (Both - no split)
3. **Complete Address History** (Sponsor + Beneficiary)
4. **Family Background** (Sponsor + Beneficiary, includes Marriage, Parents, and Children)
5. **Employment History** (Sponsor + Beneficiary)
6. **Legal & Security History** (Sponsor + Beneficiary)
7. **Previous Petitions & Affidavits** (Sponsor only)
8. **Financial Information** (Sponsor only)

---

## Transition Points

### **After Section 6 (Legal & Security History):**
> "That's all for [BeneficiaryFirstName]! We're almost there - now let's go through [SponsorFirstName]'s previous USCIS petitions and financials"

*(This transition appears because Sections 7-8 are sponsor-only, marking the shift from shared sections to sponsor-specific sections)*

### **After Section 7 (Previous Petitions & Affidavits) → Before Section 8 (Financial Information):**
> **Household Size Summary Screen**
>
> Display a transition screen showing:
> - **Total household size** (auto-calculated from Section 7)
> - **Minimum annual income required** (based on 2025 Federal Poverty Guidelines)
> - Transition message: "Now let's document [SponsorFirstName]'s income and assets to show financial ability to support [BeneficiaryFirstName]"
>
> *(This is NOT a subsection - it's a standalone transition screen between Sections 7 and 8)*

---

## Field Legend

- **BOTH** = Asked for both sponsor and beneficiary
- **SPONSOR ONLY** = Asked only for sponsor
- **BENEFICIARY ONLY** = Asked only for beneficiary
- **(conditional)** = Field appears based on answer to previous question
- **(optional)** = Field is not required

---

## Changes Log

### December 12, 2025 - Session 2
- **Completed full field extraction for all sections**
- Section 2 (Your Relationship): Added all 12 relationship fields including meeting history, IMB questions, marriage plans; Reordered to Marriage Plans first, then Visa Requirements
- Section 3 (Complete Address History): Added all 10 address fields; Corrected SPONSOR/BENEFICIARY designations (Intended US Address and Native Alphabet = Beneficiary only; Places Lived Since 18 = Sponsor only)
- Section 4 (Marital History): Added all 15 marital history fields; Corrected SPONSOR/BENEFICIARY designations (Date status obtained = Sponsor only; Former spouse DOB, nationality, birth location = Beneficiary only)
- Section 7 (Employment): Added all 7 employment timeline fields with employer details, dates, and gap checking
- Section 8 (Previous Petitions): Added detailed breakdown of Parts A, B, C with 40+ fields covering petitions, obligations, children, dependents, household size
- Section 9 (Financial Information): Added detailed breakdown of income documentation, income sources, assets, and contributions fields (35+ fields total)
- **All conditional fields converted to sub-bullets** under parent questions with explicit conditional logic (e.g., "conditional: if answer is 'Yes'")
- **Fixed UI/UX labels** for Sections 3-7: User's section = EXPANDED BY DEFAULT, ON TOP; Partner's section = COLLAPSED BY DEFAULT, BELOW
- **Verified all SPONSOR/BENEFICIARY/BOTH designations** against official forms (I-129F, DS-160) and codebase
- All sections now document actual field names from codebase with exact question wording, not selection options or descriptions

### December 12, 2025 - Session 1
- Initial structure created
- Moved Sex from "Citizenship & Identification" to "Biographic & Physical Information"
- Added all missing fields for Section 1 (Personal Information) - NAME, CONTACT INFO, BIRTHDATE, CITIZENSHIP & IDENTIFICATION, BIOGRAPHIC & PHYSICAL INFORMATION
- Added all missing fields for Section 5 (Family Background) - Parent information (18 fields), Children information (8 fields)
- Added all missing fields for Section 6 (Legal & Security History) - U.S. Travel, Criminal History (Sponsor & Beneficiary), Immigration Issues, Health & Vaccinations, Security & Human Rights
- Confirmed section order with Section 7-8 swap (Employment before Petitions)
- Documented UI/UX rules for collapsible profiles
- Added Mobile Phone Number (optional) for beneficiary in CONTACT INFO section

---

*End of Section Structure Documentation*
