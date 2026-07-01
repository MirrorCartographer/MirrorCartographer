# Evidence Map — Wellness Claim / Medical-Claim Boundary

Date: 2026-07-01
Run: Evidence Engine run 33
Claim ID: C-WELLNESS-MEDICAL-BOUNDARY-01
Status: Supported boundary requirement; MC implementation unvalidated

## Claim tested

Mirror Cartographer can be safely described as a symbolic-emotional orientation, wellness, and meaning-making tool without needing stronger claim substantiation, privacy review, or medical/mental-health boundary controls.

## Result

The broad claim is not supported.

A narrower version is supportable:

Mirror Cartographer may be positioned as a low-risk symbolic reflection / general wellness tool only if product language, user flows, evidence maps, privacy controls, and evaluation claims avoid diagnosis, treatment, mitigation, prevention, cure, clinical efficacy, or implied mental-health benefit claims unless those claims are supported by appropriate evidence and governance.

Disclaimers alone are not enough. The net impression of the product, including examples, testimonials, marketing copy, onboarding prompts, artifact titles, UI labels, and AI-generated language, must not imply stronger health or therapeutic effects than the evidence supports.

## Sources reviewed

1. FDA — General Wellness: Policy for Low Risk Devices, Guidance for Industry and FDA Staff, January 2026.
   URL: https://www.fda.gov/regulatory-information/search-fda-guidance-documents/general-wellness-policy-low-risk-devices

2. FTC — Health Products Compliance Guidance.
   URL: https://www.ftc.gov/business-guidance/resources/health-products-compliance-guidance

3. American Psychiatric Association — The App Evaluation Model.
   URL: https://www.psychiatry.org/psychiatrists/practice/mental-health-apps/the-app-evaluation-model

4. FTC — BetterHelp enforcement press release, March 2, 2023.
   URL: https://www.ftc.gov/news-events/news/press-releases/2023/03/ftc-ban-betterhelp-revealing-consumers-data-including-sensitive-mental-health-information-facebook

## Evidence found

### FDA general wellness boundary

FDA's January 2026 guidance says some software functions intended for maintaining or encouraging a healthy lifestyle, unrelated to diagnosis, cure, mitigation, prevention, or treatment of a disease or condition, are outside the device definition under section 520(o)(1)(B) of the FD&C Act.

Supported fact:
- A general lifestyle/wellness function can be treated differently from a medical device function when it is unrelated to diagnosis, cure, mitigation, prevention, or treatment of disease or conditions.

Boundary implication:
- MC should not describe itself as treating PTSD, anxiety, depression, dissociation, PMDD, trauma, OCD, autism, ADHD, chronic illness, or other health conditions unless a separate evidence/regulatory review supports that intended use.

### FTC health claim substantiation

FTC guidance states that health-related claims must be truthful, not misleading, and supported by science. For safety or efficacy claims, FTC describes a rigorous substantiation standard of competent and reliable scientific evidence. It also warns that testimonials do not substitute for substantiation.

Supported fact:
- Health benefit claims require claim-specific evidence adequate for the express and implied message consumers take from the product.
- RCTs are generally the type of evidence experts require for health benefit claims, depending on the claim.
- Numerous weak or inadequate studies do not add up to strong substantiation.

Boundary implication:
- MC cannot use user stories, aesthetic artifacts, symbolic resonance, or AI-generated explanations as proof that MC improves regulation, reduces distress, heals trauma, stabilizes mood, or produces therapeutic outcomes.

### APA mental-health app evaluation boundary

APA's App Evaluation Model evaluates background, access, privacy/security, clinical foundation, usability, and data integration. It states that digital tools present underestimated risks and that privacy/security are critical. It also notes that many apps make clinical effectiveness claims with little supporting data.

Supported fact:
- Mental-health-adjacent apps need structured review of purpose, medical claims, accessibility, intended users, privacy/security, and clinical foundation.
- A clear privacy policy and evidence review are part of responsible evaluation.

Boundary implication:
- MC should maintain a live claim registry and product-language review gate for every health-adjacent phrase.

### FTC BetterHelp enforcement relevance

FTC alleged BetterHelp promised to keep sensitive health information private while revealing email addresses, IP addresses, and health questionnaire information to advertising platforms. FTC required consumer refunds and privacy program changes.

Supported fact:
- Emotional/mental-health intake data can create serious consumer-protection risk when privacy promises, advertising systems, and data-sharing practices do not match.

Boundary implication:
- MC must treat symbolic-emotional entries, journal text, crisis language, trauma narratives, body maps, and user profiles as highly sensitive even when MC is not positioned as clinical care.

## Fact vs inference

### Supported by evidence

- General wellness positioning is plausible only when MC avoids disease/condition diagnosis, cure, mitigation, prevention, or treatment claims.
- Health-related efficacy claims need competent, reliable, claim-specific evidence.
- Mental-health-adjacent apps require privacy/security review and clinical-foundation review.
- Sensitive emotional or mental-health intake data creates privacy and consumer-protection risk.
- Testimonials and symbolic plausibility do not validate health outcomes.

### Inference, not yet demonstrated for MC

- MC's current public language consistently avoids implied therapeutic or medical claims.
- MC's current UI prevents users from interpreting symbolic maps as clinical conclusions.
- MC's privacy/data model is adequate for sensitive symbolic-emotional inputs.
- MC improves orientation or regulation beyond journaling, ordinary reflection, or supportive conversation.
- MC can safely handle high-distress users without dependency, over-identification, false reassurance, or delayed care-seeking.

## Claim-status update

Retire:
- C-WELLNESS-SAFE-BY-DISCLAIMER-01: "MC is safe to position as wellness/mental-health support as long as it says it is not therapy."

Replace with:
- C-WELLNESS-MEDICAL-BOUNDARY-01R: "MC may be positioned as symbolic reflection / general wellness only when each express and implied claim passes product-language, evidence, privacy, and user-risk review. Disclaimers are insufficient if the net product impression implies health or therapeutic benefit."

Status:
- Supported boundary requirement; MC implementation unvalidated.

Confidence:
- High confidence for the boundary requirement.
- Low confidence that MC currently satisfies the boundary without audit.

## Evaluation criterion: WELLNESS-CLAIM-GATE-01

Every MC phrase, UI element, artifact, onboarding question, output template, marketing line, README statement, demo caption, and proof packet must be classified before publication:

1. Symbolic / creative / reflective only
   - Allowed if it does not imply health benefit, diagnosis, treatment, crisis response, or clinical accuracy.

2. General wellness / lifestyle
   - Allowed only if unrelated to diagnosis, cure, mitigation, prevention, or treatment of disease/condition.
   - Must avoid disease examples unless carefully framed as user context, not intended use.

3. Mental-health-adjacent support
   - Requires privacy/security review, risk language, escalation boundaries, evidence review, and intended-user constraints.

4. Health benefit / therapeutic efficacy claim
   - Not allowed without claim-specific competent and reliable scientific evidence and formal review.

5. Medical / diagnostic / treatment claim
   - Not allowed without dedicated regulatory, clinical, and legal review.

## Falsification checklist

The claim that MC is safely positioned as non-clinical is falsified or downgraded if any active artifact does one or more of the following:

- Says or implies MC treats, heals, stabilizes, regulates, diagnoses, screens, mitigates, prevents, or cures a health condition.
- Uses trauma, PTSD, anxiety, depression, dissociation, OCD, autism, ADHD, PMDD, chronic illness, or crisis examples as intended-use claims rather than user-provided context.
- Presents affective, symbolic, or body-sensation interpretations as mental-health facts.
- Uses testimonials or user reactions as proof of efficacy.
- Gives crisis or self-harm reassurance without clear emergency boundary behavior.
- Collects sensitive symbolic-emotional data without a clear data-use purpose and retention boundary.
- Makes privacy promises that are broader than actual data handling.
- Uses advertising, tracking, analytics, or third-party processing without explicit mapping to consent and disclosure.
- Lets AI-generated outputs invent or strengthen health claims after a safe human-written description.

## Test plan: WELLNESS-CLAIM-AUDIT-01

Scope:
- 50 current MC artifacts or repo files.
- Include README files, public descriptions, evidence maps, proof packets, UI labels, onboarding language, generated demos, and marketing-style text.

Procedure:
1. Extract every sentence that references emotion, regulation, healing, trauma, mental health, body symptoms, distress, safety, diagnosis, treatment, or wellness.
2. Classify each sentence under WELLNESS-CLAIM-GATE-01.
3. Identify the express claim and implied net impression.
4. Mark evidence level:
   - none
   - symbolic rationale only
   - adjacent research only
   - direct MC evidence
   - direct MC controlled evaluation
   - regulatory/clinical review completed
5. Rewrite or quarantine every sentence where evidence level is weaker than claim strength.
6. Publish a downgrade ledger with before/after language.

Pass condition:
- 100% of active public-facing MC claims are classified.
- 0 unreviewed medical/diagnostic/treatment claims remain active.
- 0 wellness/mental-health-adjacent claims lack evidence status and privacy-risk status.
- All disclaimers are paired with claim-language control, not used as a substitute for control.

Fail condition:
- Any public-facing artifact implies therapeutic efficacy without direct evidence.
- Any artifact uses sensitive mental-health data collection without explicit purpose, retention, and sharing boundaries.
- Any claim relies on resonance, testimonial, or AI confidence as evidence of health benefit.

## Next proof needed

Run WELLNESS-CLAIM-AUDIT-01 across the repository and produce a claim-language downgrade ledger. The most important next proof is not another source summary; it is a sentence-level audit showing whether MC's actual language stays inside the symbolic/general-wellness boundary or accidentally markets itself as therapy, diagnosis, treatment, or clinical support.
