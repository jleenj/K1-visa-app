**Evernest Marriage-Based + Fiancé(e) Visa Qualifying Questionnaire**

Version: Phase 1 Complete — Includes Shared Flow + Results Page Logic\
Updated: June 25, 2025

---

🗓️ **PHASE 1: Shared Qualifying Questions**

**Q1. Are you a U.S. citizen?**

- Yes  → `USER_STATUS = US_CITIZEN`, `ROLE_MODE = SPONSOR` → Q2
- No  → Q1a

**Q1a. Are you a green card holder (lawful permanent resident)?**

- Yes  → `USER_STATUS = LPR`, `ROLE_MODE = SPONSOR` → Q2
- No  → `ROLE_MODE = BENEFICIARY` → Q1b

**Q1b. It looks like you’ll be the ***beneficiary***, and your partner will be the ***sponsor*** for this visa. What is your partner’s current immigration status?**

- U.S. citizen → `USER_STATUS = US_CITIZEN` → Q2
- Green card holder (lawful permanent resident) → `USER_STATUS = LPR` → Q2
- None of these → ❌ Terminate\
  *“One person in the couple must be a U.S. citizen or a green card holder (lawful permanent resident) in order to sponsor the other for a visa.”*

**Q2. How would you describe your current relationship with your partner?**

- We're married  → `RELATIONSHIP = MARRIED` → Q3
- We're engaged or planning to get married  → `RELATIONSHIP = PLANNING_TO_MARRY` →
  - If `USER_STATUS = LPR` → Q2a
  - If not → Q3
- None of these  → ❌ Terminate\
  *"To qualify for a family-based visa, couples must either be married or planning to get married."*

**Q2a. [Dynamic phrasing based on role]**

❗ If `ROLE_MODE = SPONSOR`: “Do you plan to get married before your future spouse moves to the U.S.?”

❗ If `ROLE_MODE = BENEFICIARY`: “Do you and your future spouse plan to get married before you move to the U.S.?”

To qualify for a family-based visa, lawful permanent residents (green card holders) must be married to the person they are sponsoring. The marriage can have taken place in any country, as long as it is legally valid where it occurred.

- Yes → Update `RELATIONSHIP from PLANNING_TO_MARRY → MARRIED` and `FLAG_PLANNING_TO_MARRY = TRUE` → Q3
- No → ❌ Terminate

🛠️ **Dev Note:** `FLAG_PLANNING_TO_MARRY` is a separate variable from `RELATIONSHIP` — we'll use this later on to ask questions around the wedding date and filing date (former cannot be later than latter, so we will check that).

**Q3. [Dynamic phrasing based on role + relationship]**

- If sponsor + married: “Where is your spouse currently located?”
- If sponsor + planning to marry: “Where is your future spouse currently located?”
- If beneficiary: “Where are you currently located?”

**Answer options:**

- Inside the U.S. → `LOCATION = INSIDE_US`
  - If `RELATIONSHIP = PLANNING_TO_MARRY` and `USER_STATUS = US_CITIZEN` → Flag `FLOW_TYPE = AOS` → Show user note → Q4
  - If `RELATIONSHIP = MARRIED` → Flag `FLOW_TYPE = AOS` → Q4

💬 *User Note [Show only to users planning to marry + inside U.S.]:* To apply while inside the U.S., you must be legally married before filing. In the meantime, Evernest can help prepare your package and walk you through the entire process!

- Outside the U.S. → `LOCATION = OUTSIDE_US`
  - If `USER_STATUS = US_CITIZEN` and `RELATIONSHIP = PLANNING_TO_MARRY` → `FLOW_TYPE = K1`
  - Otherwise → `FLOW_TYPE = CONSULAR` → Q4

🛠️ **Dev Note: Q1–Q3 Flow Table**

| USER\_STATUS | RELATIONSHIP        | LOCATION    | FLOW\_TYPE  | Notes                                                           |
| ------------ | ------------------- | ----------- | ----------- | --------------------------------------------------------------- |
| US\_CITIZEN  | MARRIED             | INSIDE\_US  | AOS         |                                                                 |
| US\_CITIZEN  | MARRIED             | OUTSIDE\_US | CONSULAR    |                                                                 |
| US\_CITIZEN  | PLANNING\_TO\_MARRY | INSIDE\_US  | AOS         | Must marry before filing; applies via marriage-based adjustment |
| US\_CITIZEN  | PLANNING\_TO\_MARRY | OUTSIDE\_US | K1          | Eligible for fiancé(e) visa (K-1)                               |
| LPR          | MARRIED             | INSIDE\_US  | AOS         |                                                                 |
| LPR          | MARRIED             | OUTSIDE\_US | CONSULAR    |                                                                 |
| LPR          | PLANNING\_TO\_MARRY | INSIDE\_US  | ❌ Terminate | Not allowed — must be married                                   |
| LPR          | PLANNING\_TO\_MARRY | OUTSIDE\_US | ❌ Terminate | Not allowed — must be married                                   |

**Q4. What are your first names?**
We’ll use the first names to avoid confusion on who we’re referring to. You’ll be able to change these later.

- Your first name: [Text input for your first name] → `USER_FIRST_NAME`
- Your partner's first name: [Text input for your spouse or future spouse’s first name] → `PARTNER_FIRST_NAME`

Dev logic:

- If `ROLE_MODE = SPONSOR`, then `FIRST_NAME_SPONSOR = USER_FIRST_NAME`, `FIRST_NAME_BENEFICIARY = PARTNER_FIRST_NAME`
- If `ROLE_MODE = BENEFICIARY`, then `FIRST_NAME_BENEFICIARY = USER_FIRST_NAME`, `FIRST_NAME_SPONSOR = PARTNER_FIRST_NAME`


→ If `FLOW_TYPE = K1`, Proceed to Q5

→ Otherwise, Proceed to MP-Q1

**Q5. It looks like [if `ROLE_MODE = BENEFICIARY`: "you"; else: [PARTNER_FIRST_NAME]] may be eligible for either a *Fiancé(e) Visa (K-1)* or a *Marriage-Based Visa*. Typically, this choice comes down to your priorities - let us know which visa path works for you and [PARTNER_FIRST_NAME] best.**

| ⚖️ Your Priority         | 💍 Fiancé(e) Visa (K-1)           | 📜 Marriage Visa         |
| ----------------------------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------ |
| Want to be together ASAP | *Faster*: 6–9 months to enter U.S. | *Slower*: 9–13+ months to enter U.S.   |
| Need to apply around marriage location & timing | Couple must marry in the U.S. *after* arriving on Fiancé(e) visa         | Couple must be married (U.S. or abroad) *before* applying for visa |
| Want to work in the U.S. ASAP<sup>1</sup>                   | *Slower*: 15–20 months after filing                          | *Faster*: 12–14 months after filing                    |
| Want to travel in and out of U.S. ASAP<sup>1</sup>          | *Slower*: 15–20 months after filing                          | *Faster*: 12–14 months after filing                    |
| Want to minimize total cost to permanent residence<sup>2</sup> | *Higher*: [[$2,380](#k1-fee-breakdown-popup)] (K-1 visa + green card after marriage, for one adult) | *Lower*: [[$1,340](#Consular-fee-breakdown-popup)] (One application grants conditional green card, for one adult)|

1. These timelines assume typical USCIS processing speeds in 2025, and that applicants act promptly at each stage (e.g., marrying shortly after foreigner fiancé(e) enters U.S. & filing for conditional green card soon after marriage). Evernest can help reduce these types of delays by sending you reminders on the next steps, every step of the way.
2. These fees exclude medical exam costs (\$200-\$500) and fee for removing conditions on 2-year green cards (~\$750). Both are required later for K-1 and marriage visa paths.

**Which path would [if `ROLE_MODE = BENEFICIARY`: "you"; else: [PARTNER_FIRST_NAME]] prefer to take?**

- Fiancé(e) Visa (K-1) → Proceed to K1-Q1
- Marriage Visa → Update `FLOW_TYPE from K-1 → CONSULAR` and `FLAG_PLANNING_TO_MARRY = TRUE` → Proceed to MP-Q1

💬 User note [Show user only if they choose marriage visa]: If you’d like to go the marriage route, you will need to get legally married before applying. In the meantime, Evernest will help walk you through the required steps.

<!-- Developer Note:
When the user clicks on "$2,380" in the table above, open a modal or popup window displaying the attached fee breakdown for K-1 path:

#K1-fee-breakdown-popup
| Fee Item                        | Amount  | Required/Optional |
|----------------------------------|---------|-------------------|
| I-129F (K-1 petition)            | $675    | Required          |
| DS-160 (K-1 visa interview)      | $265    | Required          |
| I-485 (AOS after marriage)       | $1,440  | Required          |
| I-765 (work permit)              | $260    | Optional          |
| I-131 (travel permit)            | $630    | Optional          |

| **Total Required**               | $2,380  |                   |
| **Total Optional**               | $890    |                   |

When the user cllicks on "$1,340" in the table above, open a modal or popup window displaying the attached fee breakdown for Consular path:

#Consular-fee-breakdown-popup
| Item                                      | Fee    | Required/Optional               |  
|-------------------------------------------|--------|---------------------------------|  
| I-130 (Petition for alien relative)       | $675   | Required                        |  
| I-864 (Affidavit of Support Fee)          | $120   | Required                        |  
| DS-260 (Immigrant visa application)       | $325   | Required                        |  
| USCIS Immigrant Fee (Green card issuance) | $220   | Required                        |  

| **Total**                                 | $1,340 | 

- The popup should be accessible and closeable.
- Use a tooltip or modal component as appropriate for your frontend framework.
-->

---

## 2. K-1 Fiancé(e) Visa Userflow

// Show this section only if `FLOW_TYPE = K1`

---

### Email Capture (K-1 Path)

> ## Enter your email to see your visa match results.
>
> [Email address input]
>
> [ ] Send me important tips and updates about immigration.
>
> **Talk with an immigration assistant**  
> [Phone number input (optional)]
>
> _By submitting my phone number, I agree that Evernest may call me to offer visa support._  
> _By continuing, I agree to the Evernest Privacy Policy and Terms of Use._
>
> [Back] [Next]

// After user submits, proceed to K1-Q1

---

**K1-Q1. How long has it been since you and your fiancé(e) last saw each other in person?**

- 0–12 months ago → K1-Q2
- 12–21 months ago → K1-Q2
- More than 21 months ago → K1-Q1a

**K1-Q1a. Are you planning to see your fiancé(e) in person within the next 90 days?**

- Yes → K1-Q2
- No → ❌ Terminate (Unfortunately, to qualify for a K-1 visa, couples must have met in person within the last 2 years. You can restart the process after you meet in person.)

**K1-Q2. [If ROLE_MODE = SPONSOR: "Have you"; else: "Has [PARTNER_FIRST_NAME]"] ever filed two or more Fiancé(e) visa petitions in the past, *or* had a Fiancé(e) visa petition approved in the last 2 years?**  
*(This does not apply to most people but USCIS requires us to ask.)*

- Yes → ❌ Terminate
- No → K1-Q3

**K1-Q3. [If ROLE_MODE = SPONSOR: "Have you"; else: "Has [PARTNER_FIRST_NAME]"] ever been arrested, charged, indicted, or convicted of any of the following crimes?**
*USCIS may screen for crimes from any country (U.S. or otherwise) and records that have been sealed, expunged, dismissed, or pardoned. This does not apply to most people but USCIS requires us to ask.*  

**Crimes involving abuse, sexual misconduct, or minors:**
- Sexual offenses, including sexual assault or exploitation
- Crimes involving minors, such as child abuse, neglect, or endangerment
- Domestic violence, dating violence, or stalking involving a current or former partner
- Protection or restraining orders issued by a court, even if temporary or later dismissed

**Other violent or high-risk criminal history:**
- Homicide, rape, incest
- Kidnapping or false imprisonment
- Trafficking, torture, involuntary servitude
- Multiple alcohol or drug-related offenses (Please only answer "Yes" if there were 3+ distinct events involving this type of offense)

**Your answer:**
- Yes → ❌ Terminate
- No → Proceed to K1-Q4

⚠️ Note: While you're not required to disclose arrests that did not lead to a conviction, USCIS may still view your full criminal background as part of their review. If you've had past legal issues — especially involving minors — consider consulting an immigration attorney.

**K1-Q4. Has the beneficiary ever been arrested or convicted of any crime involving drugs, violence, prostitution, sexual offenses, kidnapping, human trafficking, money laundering, or abuse of others' human rights — such as religious persecution, torture, or forced labor?**
*USCIS may screen for crimes from any country (U.S. or otherwise) and records that have been sealed, expunged, dismissed, or pardoned. This does not apply to most people but USCIS requires us to ask.*

- Yes → ❌ Terminate
- No → K1-Q5

**K1-Q5. [If ROLE_MODE = SPONSOR: "Has [FIRST_NAME_BENEFICIARY]"; else: "Have you"] ever had any of the following immigration-related issues with the United States or any other country?**

*This does not apply to most people but USCIS requires us to ask.*

- Been denied a visa, denied entry at a port of entry, had a visa cancelled or revoked, or withdrawn a visa application?
- Been deported, removed, or placed in removal or deportation proceedings?
- Overstayed a visa or stayed in the U.S. beyond the authorized period?

**Your answer:**
- Yes → ❌ Terminate
- No → K1-Q6

**K1-Q6. Did you and [PARTNER_FIRST_NAME] meet through a paid international marriage broker (IMB)?**

*(An IMB is **a business that charges a fee to introduce U.S. citizens and green card holders to foreign nationals for the purpose of dating or marriage.** This does not include general dating apps like Tinder.)*

- Yes → ❌ Terminate
- No → K1-Q7

**K1-Q7. [If ROLE_MODE = SPONSOR: "What is your annual income?"; else: "What is [FIRST_NAME_SPONSOR]'s annual income?"]**
(Select the range that best describes [if ROLE_MODE = SPONSOR: "your"; else: "[FIRST_NAME_SPONSOR]'s"] total income. This helps us guide you on next steps and eligibility.)

- Less than $18,310 → K1-Q8, set `FLAG_UNDER_INCOME_CONFIRMED = TRUE`
- $18,310 – $40,000 → K1 results page
- $40,000 – $80,000 → K1 results page
- $80,000 – $120,000 → K1 results page
- More than $120,000 → K1 results page

*Don't worry — many people qualify even if their income does not meet USCIS' minimum requirements. We'll help you explore your options based on your answer.*

**K1-Q8. Is there someone who may be willing to help as a joint sponsor?**

A joint sponsor must:
- Be a U.S. citizen or green card holder
- Be at least 18 years old
- Live in the U.S.
- Have income at least 100% of the federal poverty line ([see official guidelines](https://www.uscis.gov/i-864p)) for their household size
- Be willing to legally support your application if needed

**Answer options:**
- Yes → `JOINT_SPONSOR = TRUE` → K1 results page
- No → ❌ Terminate

---

## 3. Marriage Visa Userflow

// Show this section only if `FLOW_TYPE = AOS` or `FLOW_TYPE = CONSULAR`

---

### Email Capture (Marriage Visa Path)

> ## Enter your email to see your visa match results.
>
> [Email address input]
>
> [ ] Send me important tips and updates about immigration.
>
> **Talk with an immigration assistant**  
> [Phone number input (optional)]
>
> _By submitting my phone number, I agree that Evernest may call me to offer visa support._  
> _By continuing, I agree to the Evernest Privacy Policy and Terms of Use._
>
> [Back] [Next]

// After user submits, proceed to MP-Q1

---

**MP-Q1. [Criminal history question (role-specific phrasing)]**

- If `ROLE_MODE = SPONSOR`: “Has [FIRST_NAME_BENEFICIARY] ever been arrested, charged, detained, or convicted of a crime — anywhere in the world?”
- If `ROLE_MODE = BENEFICIARY`: “Have you ever been arrested, charged, detained, or convicted of a crime — anywhere in the world?”

This includes being handcuffed, detained, or held by law enforcement. Excludes minor traffic violations under $500. *USCIS may screen for crimes from any country (U.S. or otherwise) and records that have been sealed, expunged, dismissed, or pardoned. This does not apply to most people but USCIS requires us to ask.*

**Answer options:**

- Yes → `FLAG_CRIMINAL_HISTORY = TRUE` → ❌ Terminate
- No → MP-Q2

**MP-Q2. [Immigration history & manner of entry (role-specific phrasing)]**

- If `ROLE_MODE = SPONSOR`: “Has [FIRST_NAME_BENEFICIARY] ever had any difficulties or special situations with U.S. immigration, such as being denied a visa, overstaying, or being asked to leave the country?”
- If `ROLE_MODE = BENEFICIARY`: “Have you ever had any difficulties or special situations with U.S. immigration, such as being denied a visa, overstaying, or being asked to leave the country?”

This includes (but is not limited to):

- Being denied a U.S. visa or entry at the border
- Overstaying a visa or staying in the U.S. longer than allowed
- Entering the U.S. without inspection (crossing the border without seeing an officer)
- Using false documents or giving untrue information to immigration officials
- Being placed in removal, deportation, or exclusion proceedings (even if you were not ordered removed)
- Ever being ordered removed, deported, or excluded from the U.S.

**Answer options:**

- Yes → `FLAG_PRIOR_IMMIGRATION_ISSUE = TRUE` → ❌ Terminate or flag for legal review
- No → MP-Q3

**MP-Q3. [Household information (affidavit logic)]** Please fill out the table below to help us estimate your household size. This will help us understand your income requirements based on USCIS criteria.

| Category                                                | [FIRST_NAME_SPONSOR]                       | [FIRST_NAME_BENEFICIARY]                                              |
| ------------------------------------------------------- | -------------------------------------------- | ----------------------------------------------------------------------- |
| **Row A**: Number of unmarried children under 21            | [ ] Only include children who live with you. | [ ] Only include children who will be included in this visa application |
| **Row B**: Number of people claimed as dependents on taxes  | [ ] Exclude children from Row A.             | [ ] Exclude children from Row A.                                        |
| **Row C**: Number of immigrants you’ve previously sponsored | [ ]                                          | N/A                                                                     |

*For Row C, only count prior sponsorships where your financial support was officially accepted.*

<!--
Developer Note:

- Users should type in number for each cell where they need to provide input — all inputs should be required before moving on to MP-Q4 and restricted to number format only
- `additional_household_size = sum of all inputs`
- `num_applying_children = Row A, Column "[FIRST_NAME_BENEFICIARY]"`

-->

→ Proceed to MP-Q4 once empty fields have been filled

**MP-Q4. What is your combined U.S. annual income (including both you and [PARTNER_FIRST_NAME])?**

- Less than $[MIN_INCOME]
- At least $[MIN_INCOME]

🛠️ **Dev Note:**

- `TOTAL_HOUSEHOLD_SIZE = 2 + additional_household_size`
- `MIN_INCOME = 125% × [poverty threshold for TOTAL_HOUSEHOLD_SIZE]`

2025 USCIS Form I-864P Guidelines (Updated annually):

| Household Size         | 125% Poverty Line |
| ---------------------- | ----------------- |
| 2                      | $26,437          |
| 3                      | $33,312          |
| 4                      | $40,187          |
| 5                      | $47,062          |
| 6                      | $53,937          |
| 7                      | $60,812          |
| 8                      | $67,687          |
| Each additional person | +$6,875          |

- If income ≥ `MIN_INCOME` → Results page
- If income < `MIN_INCOME` → `FLAG_UNDER_INCOME_CONFIRMED = TRUE` → MP-Q5

**MP-Q5. Is there someone who may be willing to help as a joint sponsor?**

A joint sponsor must:

- Be a U.S. citizen or green card holder
- Be at least 18 years old
- Live in the U.S.
- Have income at least 125% of the federal poverty line ([see official guidelines](https://www.uscis.gov/i-864p))
- Be willing to legally support your application if needed

**Answer options:**

- Yes → `JOINT_SPONSOR = TRUE` → Results page
- No → MP-Q6

**MP-Q6. Do you have financial assets that could help support your application?**

💡 **What counts as assets:**

- Cash savings
- Stocks, bonds, mutual funds
- Retirement accounts (e.g., IRA, 401(k))
- Real estate equity (must be documented and accessible)
- A second vehicle (if not your primary car)

🚫 **What doesn’t count:**

- Your primary vehicle
- Jewelry, electronics, or personal property that can’t be easily converted to cash

💬 *User Note:*

- If `USER_STATUS = US_CITIZEN`, show: “If your income falls short, you may be able to use financial assets to qualify. These assets must be worth at least **3× the income gap** between your household income and the minimum required for your household size. Don’t worry if this is confusing now — we’ll guide you step-by-step for the exact calculations later.”
- If `USER_STATUS = LPR`, show: “If your income falls short, you may be able to use financial assets to qualify. These assets must be worth at least **5× the income gap** between your household income and the minimum required for your household size. Don’t worry if this is confusing now — we’ll guide you step-by-step for the exact calculations later.”

**Answer options:**

- Yes → `ASSET_BACKUP = TRUE` → Results page
- No → ❌ Terminate

---

🌍 **RESULTS PAGE**

### 🎉 Great news! Here’s your visa match:

- If `FLOW_TYPE = AOS`: **👍 You're eligible to apply for a Marriage-Based Green Card (Adjustment of Status)**
- If `FLOW_TYPE = CONSULAR`: **👍 You're eligible to apply for a Marriage-Based Green Card (Consular Processing)**
- If `FLOW_TYPE = K1`: **👍 You're eligible to apply for a Fiancé(e) Visa (K-1)**

---

## 🚀 What you get with Evernest

- **Complete, accurate USCIS applications:** We guide you step-by-step and fill out all forms for you.
- **Extensive Expert review:** Every application is manually reviewed by our immigration experts, trained by a former USCIS officer.
- **All at a more affordable price:** Our services are more affordable than traditional law firms and most of our competitors.
- **With money-back guarantee:** If your application is denied due to our error, you get a full refund.

[Apply with Evernest](#)  

---

## 📋 What happens next?

1. **Answer simple questions** _(1-2 hours)_  
   We’ll guide you through each step of the application.
2. **Collect required documents with help from our live support team** _(1-4 weeks, depending on your situation and local government processing times)_  
   We’ll email you a personalized checklist based on your situation.
3. **Consult with an immigration lawyer** _(Premium)_ _(3-5 days)_  
   With Evernest Premium, you’ll get a consultation with an immigration lawyer.
4. **We review your application multiple times** _(3-5 days)_  
   All applications are reviewed by our team of immigration experts.
5. **An immigration lawyer conducts a final review** _(Premium)_ _(1–2 days)_  
   Final check to make sure your application is ready.
6. **We assemble your application and send it directly to USCIS** _(1-2 days)_  
   We use the exact format USCIS prefers, so you can avoid delays, rejections, or follow-up requests.
7. **Prepare for your interview, with lawyer support** _(Premium)_  
   One of the lawyers from our network will explain the process, so you know exactly what to expect.

---

## 💰 Pricing

|                        | Amount                                              |
|------------------------|----------------------------------------------------|
| **Evernest Fee**       | [If `FLOW_TYPE = K1`: **\$[EvernestK1]** or pay in installments of **\$[BNPL_EVERNEST_K1]** per month; if `FLOW_TYPE = CONSULAR`: **\$[EvernestConsular]** or pay in installments of **\$[BNPL_EVERNEST_Consular]** per month; if `FLOW_TYPE = AOS`: **\$[EvernestAOS]** or pay in installments of **\$[BNPL_EVERNEST_AOS]** per month] |
| **USCIS Filing Fees**  | [If `FLOW_TYPE = K1`: **[K-1_USCIS_FEES]**; if `FLOW_TYPE = CONSULAR`: **[CONSULAR_USCIS_FEES]**; if `FLOW_TYPE = AOS`: **[AOS_USCIS_FEES]**                                               |

<!--
Developer Note:
- - Formula for total USCIS fee:
    - [K-1_USCIS_FEES]: $940 + ($265 × [num_applying_children])
    - [CONSULAR_USCIS_FEES]: IF `JOINT_SPONSOR` is not `TRUE`: $1,340 + ($1,220 × [num_applying_children]); IF `JOINT_SPONSOR` is `TRUE`: $1,340 + ($1,340 × [num_applying_children])
    - [AOS_USCIS_FEES]: $2,115 + ([child_fee] × [num_applying_children]), where [child_fee] = $1,625 if child <14, $2,115 if child ≥14.
    - If multiple children, show a price range: lower end assumes all children are under 14, higher end assumes all are 14 or older.
  - Formula for total Evernest fee:
    - [EvernestK1]: TBD
    - [BNPL_EVERNEST_K1]: TBD
    - [EvernestConsular]: TBD
    - [BNPL_EVERNEST_Consular]: TBD
    - [EvernestAOS]: TBD
    - [BNPL_Evernest_AOS]: TBD

- Display the fee structure below for the user's visa path (AOS vs. Consular vs. K-1): This should be a window that pops up when the user clicks on the $$ figure shown in the pricing table.
  
- For **Marriage Green Card (Consular Processing)**: `USCIS Filing Fee = [CONSULAR_USCIS_FEES]`
  - [Formula for [CONSULAR_USCIS_FEES] = [IF `JOINT_SPONSOR = TRUE`: [CONSULAR_USCIS_FEES] = $1,340 + ([num_applying_children] * $1,340); else: $1,340 + ([num_applying_children] * $1,220)']
  - For [FIRST_NAME_BENEFICIARY]: $1,340
    - I-130: $675; This form helps [FIRST_NAME_SPONSOR] petition to the U.S. to establish family relations with [FIRST_NAME_BENEFICIARY]
    - DS-260: $325; Main visa application used by foreign nationals outside the U.S.
    - I-864: $120; Proves that [FIRST_NAME_SPONSOR] has sufficient income or assets to financially support [FIRST_NAME_BENEFICIARY]
    - USCIS Immigrant Fee: $220; Fee to produce immigrant visa packet & Green Card
  - If [num_applying_children] = 0, do not show children costs; else: Show user the text - "For each child below 21: [if `JOINT_SPONSOR = TRUE`: "$1,340"; else: "$1,220"]" AND show below sub-bullets of price breakdown
    - Form I-130: $675
    - DS-260: $325
    - [Show only if `JOINT_SPONSOR = TRUE`] I-864 (National Visa Center fees): $120
    - Immigrant visa packet & Green Card production fee (Also known as USCIS Immigrant Fee): $220
    - This fee does not include cost of medical exams, which typically cost around $200-$500 depending on the provider
  
- For **Marriage Green Card (Adjustment of Status)**: `USCIS Filing Fee = [AOS_USCIS_FEES]`  
  - [Formula for [AOS_USCIS_FEES]: Show a range - lower end assumes all children are under 14, higher end assumes all are 14 or older]
    - Low end: $2,115 + ($1,625 × [num_applying_children])
    - High end: $2,115 + ($2,115 × [num_applying_children])
  - For **[FIRST_NAME_BENEFICIARY]**: $2,115
    - I-130: $675; This form helps [FIRST_NAME_SPONSOR] petition to the U.S. to establish family relations with [FIRST_NAME_BENEFICIARY]  
    - I-485: $1,440; Main green card application for [FIRST_NAME_BENEFICIARY]  
  - If `[num_applying_children] = 0`, do not show children costs; else: Show the text – "For each child: $1,625 ~ $2,115" and show below sub-bullets:  
    - I-130: $675  
    - I-485: $950 (if under 14), or $1,440 (if 14 or older)  
    - This fee does not include cost of medical exams, which typically cost around $200-$500 depending on the provider

- For **Fiancé(e) Visa (K-1)**: `USCIS Filing Fee = [K-1_USCIS_FEES]`  
  - [Formula for [K-1_USCIS_FEES]: $940]
  - For **[FIRST_NAME_BENEFICIARY]**: $940
    - I-129F: $675; This form helps [FIRST_NAME_SPONSOR] request permission for [FIRST_NAME_BENEFICIARY] to come to the U.S. as a fiancé(e)
    - DS-160: $265; Main visa application for [FIRST_NAME_BENEFICIARY]'s K-1 visa.
  - For each child under 21: $265 (DS-160)
  - This fee does not include cost of medical exams, which typically cost around $200-$500 depending on the provider

-->

*USCIS fees are paid directly to the government as part of your official application*

Want to make things easier? You can choose to pay the Evernest fee in simple monthly installments.


---

**Ready to get started?**

[Apply with Evernest](#)



