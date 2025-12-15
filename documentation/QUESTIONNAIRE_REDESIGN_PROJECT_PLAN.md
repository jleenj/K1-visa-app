# K-1 Visa Questionnaire Redesign - Complete Project Plan

**Created:** December 11, 2025
**Status:** In Progress
**Current Phase:** Planning & Reorganization

---

## Project Overview

Transform the K-1 visa questionnaire from a technical form into a user-friendly, conversational experience that guides applicants through the process with clear explanations and logical flow.

---

## What We're Actually Doing (No Tech Speak)

Think of your questionnaire like a book. Right now, it's organized like a reference manual - everything is there, but it jumps around and uses technical language. We want to reorganize it like a conversation with a helpful friend.

---

## THE 4 BIG CHANGES WE'RE MAKING

### 1. Add "Breathing Room" Between Topics

**What this means:** Like Boundless does, we'll add screens that say things like "Great! Now let's talk about your background" between major topic switches. Right now your questionnaire just jumps from one question to the next without pausing.

**Example:**
- **Right now:** Question about your name → immediately asks about your income
- **After we fix it:** Question about your name → Screen that says "Now that we know who you are, let's talk about your relationship" → Questions about your relationship

---

### 2. Ask Questions Like a Human Would

**What this means:** Instead of form labels like "Legal First Name" and "Date of Marriage", we'll ask full questions like "What is your full name?" and "When and where did you and Sarah get married?"

We'll also group related questions together (like Boundless does with marriage date + location in one question).

---

### 3. Add Helpful Explanations for Every Question

**What this means:** For every question, we'll add a clickable "About this question" section (like Boundless has) that tells people:

- Where to find this information (which document to look at)
- What format to use (should dates be MM/DD/YYYY?)
- Which documents this needs to match (your answer should match your passport)
- Common mistakes to avoid

---

### 4. Put Questions in a Smarter Order

**What this means:** Right now, questions are organized by government form sections. We'll reorganize them in an order that makes sense for the user:

- Start with easy stuff (names, email, phone)
- Build trust before asking sensitive questions
- Build on the qualification test (users already passed screening before paying)
- Group questions by which document they'll use to answer

**Important Context:** Users complete a qualification test BEFORE paying to access this questionnaire. The qualification test already weeds out ineligible users through easy, high-impact questions. So this questionnaire can focus on collecting complete, accurate data rather than screening eligibility.

---

## HOW WE'LL WORK TOGETHER

Here's the good news: You don't need to code anything. I'll do all the technical work.

### STEP 1: Planning (You + Me Together)

**What YOU'LL do:**

1. **Answer my questions** - I'll ask you things like:
   - "When someone fills this out, what document are they looking at?"
   - "Should we ask this question to sponsors first or beneficiaries first?"
   - "What's a friendly way to phrase this question?"

2. **Make decisions** - I'll give you options and you pick:
   - "Should we ask 'When did you get married?' or 'When and where did you and [name] get married?' - which feels better?"
   - "Should we ask about criminal history before or after family background?"

3. **Write the friendly text** - I'll give you templates, you fill in the words:
   - Transition screens: "Now let's talk about..."
   - Question text: "When did you..."
   - Help text: "You can find this on your..."

**What I'LL do:**

- Ask you the right questions to get the information I need
- Show you examples and options
- Write all the code to make it work
- Test it and show you what it looks like

---

### STEP 2: Making It Happen (Mostly Me)

**What YOU'LL do:**

- Review what I build and tell me if it looks good
- Test it out by pretending to fill out the questionnaire
- Tell me what feels confusing or weird
- Approve changes before I move to the next part

**What I'LL do:**

- Build all the new screens (transition screens, help sections, etc.)
- Reorganize all the questions in the right order
- Rewrite the technical labels into friendly questions
- Add all the helpful guidance text
- Make sure sponsor questions look different from beneficiary questions (maybe different colors or icons)
- Test that everything still works correctly

---

### STEP 3: Polishing (You + Me Together)

**What YOU'LL do:**

- Click through the entire questionnaire as if you're a real user
- Tell me what feels good and what feels confusing
- Suggest improvements to the wording
- Check that the questions are in a logical order

**What I'LL do:**

- Fix anything that's confusing
- Adjust the order if needed
- Make the wording clearer
- Add any missing help text

---

## HOW TO WORK WITH ME (PRACTICAL STEPS)

### We'll Work in Conversations Like This One

Here's how each conversation will go:

1. **Me:** "Let's work on [specific section]. I'm going to ask you about the marriage questions."

2. **Me:** "Right now we ask 'Marriage Date' - how should we ask this in a friendly way? Here are some options:
   - When did you get married?
   - What date did you and [beneficiary name] get married?
   - When was your wedding?"

3. **You:** Pick the one you like or suggest a different one.

4. **Me:** "Great! Now, what document will they use to answer this?"

5. **You:** "Marriage certificate"

6. **Me:** "Perfect. What should the help text say?"

7. **You:** "Look at your marriage certificate - use the date shown in the 'Date of Marriage' field"

8. **Me:** I write all the code and show you the result

9. **You:** "Looks good!" or "Can we change..."

---

## THE ACTUAL WORK PLAN (BROKEN INTO BITE-SIZED PIECES)

I'll break this into small tasks that we do one at a time. Each task = one conversation.

---

### **PHASE 1: Reorganization (Week 1-2)**

**⚠️ CRITICAL: This must be done FIRST before any other tasks**

The transition points and transition text will differ based on the reorganized sections, so we cannot add transitions until we've reorganized everything.

#### **Task 0: Review Qualification Test (PREREQUISITE)**
- **What we'll do:** Look at the existing qualification test to understand what users already answered before paying
- **Your role:** Show me the qualification test questions
- **My role:** Analyze what's already covered, identify what can be referenced vs. what needs to be asked fresh
- **Deliverable:** Documentation of qualification test coverage and how it relates to the main questionnaire
- **Why this matters:** The questionnaire reorganization needs to build on what users already told us in the qualification test, creating a cohesive experience

#### **Task 1: Map Out the New Question Order**
- **What we'll do:** Look at all current questions and decide the new logical order
- **Your role:** Make decisions about:
  - Which questions should come first (easy vs. hard)
  - How to build on trust/momentum from qualification test
  - How to group questions by source document
  - Whether to group by person (all sponsor, then all beneficiary) or by topic (both people's personal info, then both people's addresses)
  - What should be referenced from qualification test vs. asked again
- **My role:** Show you the current structure, present options, implement your decisions
- **Deliverable:** A new question order document that works in tandem with the qualification test

#### **Task 2: Reorganize All Questions**
- **What we'll do:** Move all questions into the new order
- **Your role:** Review and test the new flow
- **My role:** Reorganize all the code, update section numbering, test that everything works
- **Deliverable:** Questionnaire in new order (still using technical labels for now)

---

### **PHASE 2: Add Transitions & Visual Design (Week 2-3)**

**Note:** Can only start after Phase 1 is complete

#### **Task 3: Create Transition Screen Template**
- **What we'll do:** Design what a "breathing room" screen looks like
- **Your role:** Pick which design you like from options I show you
- **My role:** Create design options, build the template
- **Deliverable:** A transition screen template ready to use

#### **Task 4: Write Transition Text**
- **What we'll do:** Write the friendly text for each transition screen
- **Your role:** Write or approve the text for each transition (e.g., "Great! Now let's talk about your background")
- **My role:** Show you where transitions are needed, implement your text
- **Deliverable:** All transition screens with friendly text

#### **Task 5: Design Question Appearance**
- **What we'll do:** Make sponsor questions look different from beneficiary questions
- **Your role:** Pick which design you like (colors, icons, visual styling)
- **My role:** Show design options, implement your choice
- **Deliverable:** Visual distinction between sponsor/beneficiary questions

---

### **PHASE 3: Rewrite Questions (Week 3-5)**

**Note:** We'll do one section per conversation

For each section, we'll go through every question and you'll tell me:
1. How to ask it in a friendly way
2. What document people use to answer it
3. What the help text should say

#### **Task 6: Personal Information Questions**
- Sponsor name, DOB, citizenship
- Beneficiary name, DOB, nationality
- **Deliverable:** Personal info questions in conversational format

#### **Task 7: Relationship Questions**
- How you met, relationship history
- Plans to marry
- **Deliverable:** Relationship questions in conversational format

#### **Task 8: Contact Information Questions**
- Email, phone, mailing address
- **Deliverable:** Contact questions in conversational format

#### **Task 9: Address History Questions**
- Current and previous addresses for both people
- **Deliverable:** Address questions in conversational format

#### **Task 10: Marital History Questions**
- Previous marriages, divorce details
- **Deliverable:** Marital history in conversational format

#### **Task 11: Family Background Questions**
- Parent information for both people
- **Deliverable:** Family questions in conversational format

#### **Task 12: Employment Questions**
- 5-year work history for both people
- **Deliverable:** Employment questions in conversational format

#### **Task 13: Financial Questions**
- Income, assets, support obligations
- **Deliverable:** Financial questions in conversational format

#### **Task 14: Legal History Questions**
- Criminal history, immigration violations
- **Deliverable:** Legal screening in conversational format

---

### **PHASE 4: Add Comprehensive Guidance (Week 6-7)**

**Note:** This happens alongside Phase 3 for each section

For every question, add an "About this question" expandable section that includes:

#### **Task 15-23: Add Help Text for Each Section**
- Where to find the information
- What format to use
- Which documents it should match
- Common mistakes to avoid
- Examples of correct answers

We'll do this section by section as we rewrite questions (Tasks 6-14).

**Deliverable:** Every question has helpful guidance

---

### **PHASE 5: Testing & Polish (Week 7-8)**

#### **Task 24: Full User Testing**
- **What we'll do:** You click through the entire questionnaire as a real user
- **Your role:**
  - Fill out the questionnaire from start to finish
  - Note anything confusing or awkward
  - Check that questions flow logically
  - Verify help text is accurate and helpful
- **My role:** Fix issues you find
- **Deliverable:** List of issues to fix

#### **Task 25: Fix Issues from Testing**
- **What we'll do:** Address all confusing or broken parts
- **Your role:** Verify fixes work
- **My role:** Implement all fixes
- **Deliverable:** Fixed questionnaire

#### **Task 26: Final Wording Review**
- **What we'll do:** Read through all questions and help text one more time
- **Your role:** Make final wording improvements
- **My role:** Implement changes
- **Deliverable:** Final polished text

#### **Task 27: Final Technical Testing**
- **What we'll do:** Test edge cases and complex scenarios
- **Your role:** Try unusual answer combinations
- **My role:** Fix any bugs, ensure validation works
- **Deliverable:** Fully tested questionnaire

#### **Task 28: Launch!**
- **What we'll do:** Deploy the new questionnaire
- **Your role:** Final approval
- **My role:** Deploy and monitor
- **Deliverable:** Live redesigned questionnaire

---

## CURRENT QUESTIONNAIRE STRUCTURE (BEFORE REORGANIZATION)

### **Section 1: Your Relationship** (9 questions)
- K-1 visa eligibility requirements for your relationship

### **Section 2: U.S. Citizen Sponsor - Complete Profile** (150 questions)

- **2.1 Personal Information** (21 questions) - Legal names, identification, and personal details
- **2.2 Contact Information** - Contact details
- **2.3 Complete Address History** (8 questions) - Mailing, current, and previous addresses
- **2.4 Marital History** (4 questions) - Current and previous marriages
- **2.5 Family Background** (17 questions) - Information about sponsor's parents
- **2.6 Employment & Work History** (8 questions) - 5-year work history
- **2.7 Previous Petitions & Affidavits** (6 questions) - Previous I-129F petitions and support affidavits
- **2.8 Financial Information** (20 questions) - Income, assets, and contributions to beneficiary
- **2.9 Legal History** (5 questions) - Required background check information

### **Section 3: Beneficiary - Complete Profile** (50 questions)

- **3.1 Personal Information** (12 questions) - Legal names, identification, and personal details
- **3.2 Contact Information** - Contact details
- **3.3 Complete Address History** (10 questions) - Mailing, current, and previous addresses
- **3.4 Marital History** (4 questions) - Current and previous marriages
- **3.5 Family Background** (17 questions) - Information about beneficiary's parents
- **3.6 Employment & Work History** (2 questions) - 5-year employment history
- **3.7 Children Information** (2 questions) - Information about beneficiary's children
- **3.8 U.S. Travel History** (2 questions) - U.S. visit history
- **3.9 Legal & Security History** (5 questions) - Required background check and eligibility screening

---

## NEW QUESTIONNAIRE STRUCTURE (AFTER REORGANIZATION)

**Note:** This will be determined in Task 0-1 based on qualification test review and user decisions

Principles for reorganization:
1. **Easy → Hard**: Start with simple questions (names, contact) before complex ones (employment history, legal screening)
2. **Useful data first**: Collect basic identifying information that helps personalize later questions
3. **Build on qualification test**: Users already passed eligibility screening - questionnaire builds on that trust and momentum
4. **Logical grouping**: Group by source document, by person, and by topic
5. **Cohesive experience**: Questionnaire and qualification test work together seamlessly (no jarring repetition, smooth transitions)

---

## HOW TO GET STARTED

**To begin:** Just say "Let's start with Task 0" and we'll review the qualification test first.

**Or:** If you want to skip ahead to reorganization without reviewing the qualification test, say "Let's start with Task 1" and we'll begin mapping out the new question order.

**Or:** If you want to start with a different task, tell me which task number and we'll start there.

---

## PROGRESS TRACKING

### ✅ Completed Tasks
- None yet - project starting now

### 🔄 Current Task
- **Task 0:** Review Qualification Test (PREREQUISITE)

### ⏳ Upcoming Tasks
- All tasks listed above (Tasks 1-28)

---

## IMPORTANT NOTES

### Critical Task Order
**⚠️ Task 0 (Qualification Test Review) should be completed before Task 1 (Reorganization)**

Reason: We need to understand what users already answered in the qualification test so the questionnaire can build on that foundation seamlessly.

**⚠️ Task 1-2 (Reorganization) MUST be completed before Task 3-4 (Transitions)**

Reason: The transition points and transition text will differ based on the reorganized sections. We cannot add transitions until we know the final question order.

### Working Together
- You make decisions and write friendly text
- I do all the coding
- We review together
- One task at a time, one conversation per task

### Reference This Document
If context runs out, you can ask: "Please read the project plan in documentation/QUESTIONNAIRE_REDESIGN_PROJECT_PLAN.md and continue where we left off"

---

## VERSION HISTORY

- **v1.0** (Dec 11, 2025) - Initial project plan created
- Project status: Planning phase, starting with reorganization

---

*End of Project Plan*
