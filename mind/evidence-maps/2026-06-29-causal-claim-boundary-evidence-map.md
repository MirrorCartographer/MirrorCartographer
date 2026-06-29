# Evidence Map: Causal Claim Boundary for MC Evidence Upgrades

Date: 2026-06-29
Status: Methodological risk identified; supported as a design-control principle, not yet validated inside MC.

## Claim tested

The current GitHub mind risks upgrading architectural claims from correlation / plausibility / design rationale into causal claims without enough evidence.

Short form: MC needs a first-class causal claim boundary before claim-status upgrades.

## Why this matters

Many MC evidence maps correctly separate fact from inference, but the status language can still drift:

- from “this source supports the design direction”
- to “this MC feature will improve reasoning / trust / decision quality”

Those are not the same claim. The first is a plausibility claim. The second is a causal effect claim and needs stronger evidence.

## Evidence found

### High-quality / primary sources

1. NIST AI Risk Management Framework, AI RMF 1.0
   - Source: https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.100-1.pdf
   - Relevant point: NIST frames trustworthy AI work around lifecycle test, evaluation, verification, and validation. Evaluation must be tied to context, task, outputs, and risk rather than treated as a generic confidence signal.
   - Use in MC: Supports the need for explicit validation before upgrading a design rationale into a stronger system-performance claim.

2. Pearl, “An Introduction to Causal Inference”
   - Source: https://pmc.ncbi.nlm.nih.gov/articles/PMC2836213/
   - Relevant point: Causal inference requires assumptions and formal reasoning beyond ordinary statistical association.
   - Use in MC: Supports separating observed association, intervention effect, and counterfactual claims.

3. Pearl, “The Three Layer Causal Hierarchy”
   - Source: https://web.cs.ucla.edu/~kaoru/3-layer-causal-hierarchy.pdf
   - Relevant point: Association, intervention, and counterfactual reasoning are different levels of causal claim.
   - Use in MC: Provides a simple classification structure for MC claim-status updates.

4. CDC ACIP GRADE Handbook, Chapter 7
   - Source: https://www.cdc.gov/acip-grade-handbook/hcp/chapter-7-grade-criteria-determining-certainty-of-evidence/index.html
   - Relevant point: Certainty of evidence is assessed across a body of evidence for a defined outcome; study design and risk of bias matter.
   - Use in MC: Supports downgrading causal confidence when evidence is indirect, observational, imprecise, or biased.

5. Dahabreh et al., “Causal Inference About the Effects of Interventions From Observational Studies in Medical Journals”
   - Source: https://jamanetwork.com/journals/jama/fullarticle/2818746
   - Relevant point: Observational studies can inform causal questions only when the causal question, target trial logic, assumptions, and bias controls are explicit.
   - Use in MC: Supports requiring a target-test plan before claiming an MC feature causes an improvement.

## Fact / inference split

### Facts

- NIST AI RMF treats AI evaluation as lifecycle TEVV tied to use context, system task, and risks.
- Causal inference literature distinguishes association from intervention and counterfactual reasoning.
- GRADE-style evidence assessment treats certainty as outcome-specific and sensitive to study design, bias, inconsistency, indirectness, imprecision, and publication bias.
- Observational evidence can support causal reasoning only with explicit assumptions and bias analysis.

### Inferences for MC

- MC evidence maps should not upgrade a feature to “causally improves X” based only on external literature showing that related concepts matter.
- MC should label claims by causal strength, not only by design confidence.
- A claim can be a supported design principle while still having unknown causal effect inside MC.

## Claim-status update

Previous implicit state:

- Evidence maps could accumulate support and move feature claims toward stronger confidence without explicitly stating whether the claim was causal.

Updated state:

- Causal effect claims require separate status labels and stronger evidence than design rationale claims.

New status class:

- Design rationale supported: external literature supports the design direction.
- Mechanism plausible: there is a plausible causal pathway, but not demonstrated in MC.
- Causal effect untested: no direct MC test shows the feature changes the intended outcome.
- Causal effect partially supported: an MC test shows directional improvement, with limitations.
- Causal effect refuted / mixed: evidence fails to support the claimed effect or is inconsistent.

## Requirement: R-CAUSAL-01

Every MC evidence map that implies an outcome improvement must declare the causal level of the claim:

1. Association / relevance
   - Evidence shows the concept is related to the outcome.

2. Design rationale
   - Evidence supports why the feature is reasonable to build.

3. Mechanism hypothesis
   - A proposed pathway explains how the feature might cause the outcome.

4. Intervention effect
   - Direct testing shows the feature changes the outcome compared with a baseline.

5. Counterfactual claim
   - Evidence supports what would likely have happened without the feature.

No claim may be promoted to intervention-effect status without a baseline comparison or equivalent causal design.

## Evaluation criterion: CAUSAL-01

For every claim-status upgrade, an independent reviewer should be able to answer:

1. What outcome is claimed to improve?
2. Is the evidence about MC directly, or only about a related concept?
3. Is the claim associational, mechanistic, interventional, or counterfactual?
4. What is the comparison condition?
5. What plausible alternative explanations remain?
6. What evidence would lower confidence?

Success condition:

- The reviewer can identify the causal strength of the claim without reading hidden conversation context.

Failure condition:

- The same evidence could justify a much weaker claim, but the repository labels it as stronger.

## Minimal test plan

Use 10 existing evidence maps and classify every major claim into one of four bins:

- Design rationale only
- Mechanism plausible
- Direct causal evidence inside MC
- Overstated / needs downgrade

For each map, record:

- claimed feature
- claimed outcome
- evidence type
- missing comparison condition
- required next test

Then downgrade or split any claim that mixes design support with causal effect support.

## Falsification checklist

Revise or reject R-CAUSAL-01 if:

- reviewers cannot reliably distinguish causal levels using the schema;
- the schema creates paperwork without changing any claim statuses;
- most MC claims are purely descriptive and do not need causal boundaries;
- causal labels reduce clarity rather than improving it;
- claim downgrades become performative and do not affect future test design.

## Current certainty

Moderate confidence that MC needs the causal boundary as a methodology safeguard.

Low confidence that this exact schema is the best implementation.

No direct evidence yet that adding this boundary improves the GitHub mind’s accuracy.

## Next proof needed

Audit 10 existing evidence maps using CAUSAL-01. The key proof is whether the audit reveals at least one meaningful downgrade, split claim, or more precise test plan that was not obvious before.

If the audit changes nothing, the boundary may be unnecessary or poorly designed.
