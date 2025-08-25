When User Selects "Married"
What they see:
A prominent orange/red warning box appears immediately below the dropdown with:

⚠️ Warning icon
Headline: "Important: K-1 Visa Eligibility Check"
Text: "K-1 visas are only for engaged couples. We need to determine the right path for [SponsorFirstName]."
A new question appears: "Who is [SponsorFirstName] married to?"

Radio button: "The person [SponsorFirstName] wants to sponsor ([BeneficiaryFirstName])"
Radio button: "Someone else"


User note (small text below): "Note: If [BeneficiaryFirstName] isn't the correct name, that's okay. We just need to know if [SponsorFirstName] is married to the person [he/she - dynamic based on Sex field from 1.1] wants to sponsor. Names can be updated later."

Form behavior:

When user clicks outside the dropdown (blur event), the rest of the form GRAYS OUT - visually disabled but still visible
BUT the marital status dropdown AND the warning box questions remain clickable/editable - user can change selections at any time
If user changes from "Married" to something else, warning box disappears and form un-grays immediately


When User Selects "Married to the person [SponsorFirstName] wants to sponsor ([BeneficiaryFirstName])"
What they see:
The warning box expands/updates with:

Previous question stays visible (showing selection)
NEW question appears: "Where is [BeneficiaryFirstName] currently?"

Radio button: "In the United States"
Radio button: "Outside the United States"

Path A: "Spouse in US" (Married → To Sponsor → In US)
What they see:
The form below remains GRAYED OUT (except marital status dropdown and warning box questions). A blue information box appears with:
Step 1 - Explanation Screen:

"→ Spousal Green Card: Adjustment of Status (AOS)"
Clear explanation: "Being married means [BeneficiaryFirstName] can directly apply for a green card - no need for the fiancé visa step, which eventually requires a separate green card application."
What is AOS? (expandable section):

"Adjustment of Status is a spousal green card application that allows the spouse to become a permanent resident while staying in the US"
"Estimated timeline: 6-10 months for work/travel permit, 12-18 months for green card approval"

Three buttons:

Primary: "Continue to Spousal Green Card Application →"
Secondary: "← Back to K-1 Form"
Tertiary (smaller): "Have questions? Contact support" [TODO: Route to support]

If "← Back to K-1 Form" is clicked:

Returns to marital status dropdown
Dropdown resets to "Select..."
Form un-grays/becomes active
Warning box disappears
User can select a different option

Step 2 - After clicking Continue:
New screen/modal appears:

"Switching to Spousal Green Card Application"
Reassuring message: "Evernest offers comprehensive guidance for spousal green card applications too! We'll help [SponsorFirstName] through the entire process."
Important next step: "First, we need to verify eligibility for the spousal green card process."
Button: "Take Spousal Green Card Eligibility Test →" [TODO: Route to AOS qualifying test]
Secondary button: "← Back"

[TODO: Handle eligibility test failure - If user fails the AOS eligibility test OR returns from test with conflicting marital status (e.g., now says "not married"), route to support page with message: "It looks like we need to review [SponsorFirstName]'s specific situation to find the best path forward. Our team can help determine the right visa option and process any necessary adjustments to your order." Include "Contact Support Team" button]
Step 3 - After passing eligibility test:
New screen appears:

Value-focused introduction: "Perfect! [SponsorFirstName] qualifies for the spousal green card, which actually saves time and money compared to the K-1 path. Here's what makes this the better option:"

"✓ One application instead of two (skip the separate green card filing)"
"✓ Lower total USCIS fees"
"✓ [BeneficiaryFirstName] gets green card faster overall"
"✓ All information you've entered transfers to your new application"


Transition message: "Here's your updated order:"
Fee breakdown table:
K-1 Fiancé Visa:
  Service fee:           $
  USCIS fees (later):    $
  Total:                 $

Spousal Green Card (AOS):
  Service fee:           $
  USCIS fees (later):    $
  Total:                 $

Additional fee due now:    $
USCIS fees due later:      $

Note: "💡 The total USCIS fees for spousal green card are lower than the K-1 + green card application"
Button: "Proceed to Payment →" [TODO: Route to payment page, then to AOS product after payment]
Secondary button: "← Back"


Path B: "Spouse Outside US" (Married → To Sponsor → Outside US)
What they see:
The form below remains GRAYED OUT (except marital status dropdown and warning box questions). A blue information box appears with:
Step 1 - Explanation Screen:

"→ Spousal Green Card: Consular Processing"
Clear explanation: "Being married means [BeneficiaryFirstName] can directly apply for a green card - no need for the fiancé visa step, which eventually requires a separate green card application."
What is Consular Processing? (expandable section):

"Consular Processing is when the spouse applies for their green card from outside the US and enters as a permanent resident"
"Estimated timeline: 12-16 months until approval"
Process overview:

"Month 1-12: Application processing ([BeneficiaryFirstName] remains outside the US)"
"Month 12-16: Interview at local U.S. Embassy or Consulate in [BeneficiaryFirstName]'s country"
"Note: If no U.S. Embassy/Consulate is available locally, interview may be scheduled in a neighboring country"
"After approval: [BeneficiaryFirstName] can enter US as permanent resident"
"Physical green card arrives by mail within 30-60 days after entering the US"


"Important: Many temporary visas (tourist visas, ESTA, etc.) are often denied during green card processing due to immigration intent. [BeneficiaryFirstName] should plan to remain outside the US until the process is complete."



Three buttons:

Primary: "Continue to Spousal Green Card Application →"
Secondary: "← Back to K-1 Form"
Tertiary (smaller): "Have questions? Contact support" [TODO: Route to support]

If "← Back to K-1 Form" is clicked:

Returns to marital status dropdown
Dropdown resets to "Select..."
Form un-grays/becomes active
Warning box disappears
User can select a different option

Step 2 - After clicking Continue:
New screen/modal appears:

"Switching to Spousal Green Card Application"
Reassuring message: "Evernest offers comprehensive guidance for spousal green card applications too! We'll help [SponsorFirstName] through the entire process."
Important next step: "First, we need to verify eligibility for the spousal green card process."
Button: "Take Spousal Green Card Eligibility Test →" [TODO: Route to Consular qualifying test]
Secondary button: "← Back"

[TODO: Handle eligibility test failure - If user fails the Consular eligibility test OR returns from test with conflicting marital status (e.g., now says "not married"), route to support page with message: "It looks like we need to review [SponsorFirstName]'s specific situation to find the best path forward. Our team can help determine the right visa option and process any necessary adjustments to your order." Include "Contact Support Team" button]
Step 3 - After passing eligibility test:
New screen appears:

Value-focused introduction: "Perfect! [SponsorFirstName] qualifies for the spousal green card, which actually saves time and money compared to the K-1 path. Here's what makes this the better option:"

"✓ One application instead of two (skip the separate green card filing)"
"✓ Lower total USCIS fees"
"✓ [BeneficiaryFirstName] enters US as permanent resident"
"✓ All information you've entered transfers to your new application"


Transition message: "Here's your updated order:"
Fee breakdown table:
K-1 Fiancé Visa:
  Service fee:           $
  USCIS fees (later):    $
  Total:                 $

Spousal Green Card (Consular):
  Service fee:           $
  USCIS fees (later):    $
  Total:                 $

Additional fee due now:    $
USCIS fees due later:      $

Note: "💡 The total USCIS fees for spousal green card are lower than the K-1 + green card application"
Button: "Proceed to Payment →" [TODO: Route to payment page, then to Consular product after payment]
Secondary button: "← Back"


Path C: "Married to Someone Else"
What they see:
The form below GRAYS OUT (except marital status dropdown). A yellow/amber warning box appears with:

"→ Let's understand [SponsorFirstName]'s current marriage situation"
Compassionate explanation: "For a K-1 visa, both parties need to be legally free to marry. We understand divorces can be complex, and we're here to help [SponsorFirstName] prepare the visa application for when it's time to file."
[SponsorFirstName]'s options:

Primary path (most visible):

Large button: "Continue preparing the application now and file when the divorce is finalized"
Subtext: "We'll help [SponsorFirstName] get everything ready to file as soon as possible"

Secondary option (smaller, below):

Link text: "Need to discuss [SponsorFirstName]'s situation? Contact support" [TODO: Route to support]

If they click "Continue preparing":

The button transforms into a green checkmark
Text appears: "Great - let's keep going!"
Form becomes ACTIVE again (un-grays)


Developer TODOs:

Dynamic [he/she]: Pull from Sex field in Section 1.1 (Male → he, Female → she)
Path A/B "Take Spousal Green Card Eligibility Test": Route to appropriate qualifying test (AOS vs Consular)
Path A/B eligibility test failure handling:

Condition 1: User fails the spousal green card eligibility test
Condition 2: User returns from test with conflicting marital status (e.g., now says "not married" when they previously said "married")
Action: Route to support page with soft message and "Contact Support Team" button


Path A/B Step 1 "Have questions? Contact support": Route to support for clarification/refund requests
Path A/B "Proceed to Payment": Route to payment page, then to appropriate spousal product after payment
Path C "Contact support": Route to support system with context
Back button logic: Reset marital status to "Select..." when returning to K-1 form

Key Updates:

✅ Clarified specific conditions for support routing (test failure OR conflicting info)
✅ Added third "Contact support" button in Step 1 for both paths A and B