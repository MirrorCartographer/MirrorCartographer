# Evidence Map: User Resonance Is Not Validation

Date: 2026-07-01
Status: active evidence map
Claim ID: C-USER-RESONANCE-VALIDATION-01R
Run: Evidence Engine run 34

## Claim tested

Mirror Cartographer can treat user resonance, felt accuracy, or subjective "that lands" feedback as strong evidence that a symbolic-emotional map is true, beneficial, or valid.

## Bottom line

Not supported as stated.

User resonance is useful as first-person feedback and product/usability signal. It is not enough to validate causality, therapeutic benefit, diagnostic accuracy, emotional-state inference, or broad system capability.

Revised claim:

Mirror Cartographer may use user resonance as low-strength, first-person acceptability and meaning-fit evidence only when it is labeled as subjective feedback and separated from factual, causal, clinical, and outcome claims.

## Evidence reviewed

1. FDA, "Patient-Reported Outcome Measures: Use in Medical Product Development to Support Labeling Claims" (2009; content current 2019).
   - Source: https://www.fda.gov/regulatory-information/search-fda-guidance-documents/patient-reported-outcome-measures-use-medical-product-development-support-labeling-claims
   - Relevance: Patient-reported data can support claims only through defined instruments, documentation, and clinical-trial context. A user's report is data, but the instrument and intended claim need validation.

2. FTC, "Health Products Compliance Guidance" (2022).
   - Source: https://www.ftc.gov/business-guidance/resources/health-products-compliance-guidance
   - Relevance: Health-related claims must be truthful, not misleading, and supported by competent and reliable scientific evidence. The net impression of claims matters, including implied claims.

3. AERA / APA / NCME, "Standards for Educational and Psychological Testing" open-access page for the 2014 Standards.
   - Source: https://www.testingstandards.net/open-access-files.html
   - Relevance: Psychological measurement requires validity evidence, reliability, fairness, scoring/use boundaries, and intended-use justification. A positive response from a user is not, by itself, validity evidence for the construct being measured.

4. Nisbett & Wilson, "Telling more than we can know: Verbal reports on mental processes" (Psychological Review, 1977), DOI 10.1037/0033-295X.84.3.231.
   - Source landing/search context: https://doi.org/10.1037/0033-295X.84.3.231
   - Relevance: Self-report and introspection can be informative about conscious contents, but reports about underlying mental processes and causes can be unreliable or confabulated. This creates a boundary around treating resonance as causal proof.

## Fact vs inference

### Supported by evidence

- Patient-reported experience can be valuable evidence when captured through a defined, documented, purpose-fit instrument.
- Health, benefit, safety, efficacy, and improvement claims require stronger substantiation than user satisfaction or subjective fit.
- Implied claims count. A symbolic output that makes the user feel seen may still imply therapeutic, diagnostic, or causal authority if the surrounding language suggests it.
- Psychological-test style claims need construct definition, intended-use boundaries, scoring logic, reliability checks, and validity evidence.
- Introspective reports can be useful but are limited, especially for claims about hidden causes, mechanisms, and mental processes.

### Inference for MC, not yet demonstrated

- MC resonance scores predict improved orientation, reduced distress, better decision-making, or durable user benefit.
- A symbolic map that feels accurate is more accurate than a neutral reflection baseline.
- Felt accuracy reduces harm risk.
- User agreement can safely substitute for external review or outcome tracking.

## Claim-status update

Retire the stronger implied claim:

C-USER-RESONANCE-VALIDATION-01: "User resonance validates MC maps."

Replace with:

C-USER-RESONANCE-VALIDATION-01R: "User resonance is low-strength first-person acceptability evidence. It can support design iteration, but cannot validate truth, mechanism, therapeutic benefit, or safety without independent outcome and harm checks."

Status: supported boundary requirement; MC implementation unvalidated.

Confidence: medium for the boundary; low for any MC-specific benefit claim.

## Evaluation criterion

Any MC artifact that uses user resonance as evidence must include all of the following fields:

1. Resonance type
   - meaning-fit
   - emotional salience
   - aesthetic fit
   - usability clarity
   - perceived helpfulness
   - other, explicitly described

2. Claim class
   - subjective preference
   - product usability
   - psychological construct
   - health/wellness benefit
   - causal mechanism
   - safety claim

3. Allowed confidence update
   - subjective preference: may increase confidence in preference fit
   - product usability: may increase confidence only with repeated structured feedback
   - psychological construct: no confidence increase without validated construct/instrument
   - health/wellness benefit: no confidence increase without appropriate outcome evidence
   - causal mechanism: no confidence increase from resonance alone
   - safety claim: no confidence increase from resonance alone

4. Required separation language
   - "This matched the user's experience" is allowed.
   - "This explains the user's real cause" is not allowed without independent evidence.
   - "This helped the user feel oriented in-session" is allowed if directly reported.
   - "This improves regulation" is not allowed without outcome measurement.

## Test plan: RESONANCE-VALIDATION-GATE-01

Sample:
- 30 MC outputs containing phrases such as "that lands," "resonates," "felt true," "map," "signal," "orientation," "body," "truth," "regulation," or "healing."

Procedure:
1. Extract every sentence that turns user resonance into a stronger claim.
2. Classify each sentence into subjective, usability, psychological, health/wellness, causal, or safety claim.
3. Mark whether evidence exceeds resonance.
4. Downgrade unsupported claims.
5. Rewrite overclaims into bounded language.
6. Record whether the artifact preserves meaning without inflating certainty.

Pass condition:
- 95% or more of resonance references are correctly bounded.
- 0 clinical, causal, or safety claims rely on resonance alone.
- Every confidence increase cites evidence appropriate to the claim class.

Fail condition:
- Any sentence treats felt accuracy as proof of truth, cause, therapy, diagnosis, safety, or system capability.

## Falsification checklist

A claim must be downgraded if any answer is yes:

- Does the artifact say or imply that resonance proves truth?
- Does the artifact treat user agreement as validation of an emotional-state inference?
- Does the artifact use symbolic fit as evidence of a causal mechanism?
- Does the artifact imply regulation, healing, treatment, or clinical benefit without outcome data?
- Does the artifact omit the difference between subjective meaning and objective accuracy?
- Does the artifact raise confidence without a defined measurement construct?
- Does the artifact use aesthetic force, mythic language, or intensity to create a misleading net impression of proof?

## Next proof needed

Run RESONANCE-VALIDATION-GATE-01 on 30 prior MC outputs and publish a resonance-overclaim ledger with:

- original sentence
- claim class
- evidence type used
- whether resonance was overstated
- downgraded replacement sentence
- whether the artifact still works after removing overclaim

The next meaningful evidence would be a small comparative study: MC symbolic mapping vs neutral reflection vs ordinary journaling, measuring immediate orientation, delayed usefulness, distress amplification, dependency cues, and false-certainty increase.