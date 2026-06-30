# Evidence Map — Construct Validity for MC Evaluation Gates

Date: 2026-06-30  
Run: Evidence Engine 07  
Status: evidence map + evaluation criterion + falsification checklist  
Claim ID: C-CONSTRUCT-02

## Claim tested

Mirror Cartographer evaluation gates must test the intended construct, not only whether an artifact looks organized, persuasive, complete, or aesthetically coherent.

Examples of at-risk constructs:

- reviewability;
- human agency protection;
- calibrated trust;
- provenance reconstruction;
- symbolic safety;
- opportunity proof.

## Why this claim needed stronger evidence

Many current MC gates require structured documentation, labels, reviewer agreement, or proof packets. That structure can improve auditability, but it can also create false confidence if the measured proxy is not the real construct.

Weak assumption being tested:

> If an MC artifact has a clear evidence map, review card, confidence label, or proof packet, then the underlying capability is being validly evaluated.

That assumption is not safe without construct-validity controls.

## Evidence reviewed

### Source 1 — Cronbach and Meehl construct validity tradition

Source type: foundational psychometric theory / primary scholarly source tradition.  
Evidence strength for MC: strong conceptual support, indirect implementation support.

Relevant fact:

Construct validity concerns whether a test or measure supports the interpretation being made from it. Cronbach and Meehl’s construct-validity framework treats constructs as theory-linked, not directly observed, and emphasizes networks of relations among constructs and observations.

MC implication:

If MC says a gate measures “agency protection,” “reviewability,” or “calibrated trust,” the gate must define the construct and show why the observations are valid indicators of that construct.

Not proven:

This does not prove any specific MC gate is valid.

### Source 2 — AERA / APA / NCME Standards for Educational and Psychological Testing

Source type: high-quality professional standards.  
Evidence strength for MC: strong general validity standard, indirect domain support.

Relevant fact:

Modern testing standards treat validity as evidence supporting intended interpretations and uses of scores, not as a property automatically possessed by an instrument. Validity evidence must be tied to the inference and action being made from the result.

MC implication:

MC cannot say “reviewer agreement = valid reviewability” unless the agreement result supports the intended use. Reviewers agreeing on labels may show surface consistency, but not necessarily real safety, agency protection, or decision improvement.

Not proven:

The standards do not evaluate MC and do not guarantee that MC’s reviewer protocols are sufficient.

### Source 3 — Measuring what Matters: Construct Validity in Large Language Model Benchmarks

Source type: recent LLM evaluation research / systematic benchmark review.  
Evidence strength for MC: strong cautionary support for AI evaluation design; not direct validation.

Relevant fact:

The paper reports that LLM benchmarks often make claims about complex phenomena such as safety or robustness through measures that may not validly represent those constructs.

MC implication:

MC’s constructs are also complex and abstract. A neat score may become a false proof if the metric measures output polish, length, or reviewer preference rather than the intended construct.

Not proven:

This does not show MC currently fails. It shows the failure mode is credible and should be guarded against.

### Source 4 — Demographic Probing of Large Language Models Lacks Construct Validity

Source type: recent LLM evaluation research.  
Evidence strength for MC: strong example of construct-validity failure in AI evaluation; indirect to MC.

Relevant fact:

The paper finds that different cues intended to represent the same demographic construct can produce unstable and partially overlapping model behaviors, making broad claims unreliable.

MC implication:

MC should not assume one prompt type, one artifact type, or one reviewer group represents a whole construct. For example, one symbolic artifact cannot validate symbolic safety in general.

Not proven:

This is not a direct test of MC symbolic prompts.

## Fact / inference separation

### Facts supported by sources

1. Construct validity concerns whether evidence supports the intended interpretation and use of a measure.
2. Complex constructs need explicit definitions and multiple forms of evidence.
3. LLM evaluations can overclaim when benchmarks do not validly represent the construct being claimed.
4. A metric can be consistent or easy to score while still failing to measure the intended construct.

### MC-specific inferences

1. MC gates are vulnerable to construct drift because many target constructs are abstract: agency, trust, reviewability, symbolic safety.
2. Reviewer agreement is necessary but not sufficient for validating MC reviewability or safety.
3. Proof packets may measure presentation quality unless they include job-relevant task evidence.
4. Confidence labels may measure perceived clarity unless they test actual reliance behavior.

### Unsupported claims rejected

- “MC evaluation gates are construct-valid.” Not established.
- “A completed evidence map proves the claim.” False.
- “Reviewer agreement alone proves safety.” False.
- “A polished proof packet proves role readiness.” False.

## Claim-status update

C-CONSTRUCT-02: MC evaluation gates require construct-validity controls.

Previous status: implied method concern / under-specified.  
Updated status: supported evaluation-design requirement; MC implementation unvalidated.

Confidence: moderate-high that construct-validity controls are necessary; low that current MC gates are sufficient.

Reason for confidence split:

- External evidence strongly supports the general requirement.
- Direct MC-specific validation has not been run.

## New evaluation criterion

Criterion ID: CONSTRUCT-GATE-01  
Name: Intended Construct Match Gate  
Applies to: all MC test plans, evidence maps, review cards, proof packets, and lifecycle upgrades.

A claim may not be upgraded unless the evaluation artifact answers all of the following:

1. Construct definition  
   What exact construct is being evaluated?

2. Intended inference  
   What conclusion will be drawn if the artifact passes?

3. Intended use  
   What decision or action will this result support?

4. Observable indicators  
   What is being measured or reviewed?

5. Proxy-risk check  
   Could the indicator be measuring polish, length, compliance, emotional resonance, reviewer preference, or documentation density instead?

6. Convergent evidence  
   What other evidence should move in the same direction if the construct is truly present?

7. Discriminant evidence  
   What should not move in the same direction if the construct is being measured correctly?

8. Failure interpretation  
   If the gate fails, what exactly failed: the artifact, the metric, the construct definition, the reviewer instructions, or the claim?

9. Scope boundary  
   What domain, user type, artifact type, or situation does this result not generalize to?

10. Upgrade limit  
   What is the strongest claim status this evidence can justify?

## Falsification checklist

An MC evaluation gate fails construct validity if any of the following occur:

- The construct is named but not defined.
- The metric rewards completion without testing the intended effect.
- Reviewers agree because the labels are obvious, not because the artifact is actually safer or more reviewable.
- The same score could be achieved by a longer, prettier, or more bureaucratic artifact with no real improvement.
- The test cannot distinguish between “looks careful” and “supports better judgment.”
- The result is used outside the tested domain.
- A proxy result is treated as a causal or outcome result.
- Negative or contradictory evidence cannot change the claim status.

## Immediate architectural implication

Every future MC evidence-engine run should include a one-line construct-validity check:

> This artifact measures [construct] using [indicator], and the strongest justified inference is [bounded claim].

If that sentence cannot be written clearly, the artifact is not ready for claim upgrade.

## Next proof needed

Run CONSTRUCT-GATE-01 on ten existing MC artifacts:

1. Confidence Label / calibrated trust map.
2. Human Agency Boundary evidence map.
3. Symbolic Reviewability documentation map.
4. Negative Result Ledger evidence map.
5. External Validity evidence map.
6. Opportunity Proof Packet validity map.
7. Attribution Organ.
8. Discovery Object format.
9. Fossil Record format.
10. AI Self State Ledger.

Pass threshold:

- At least 8 of 10 artifacts must clearly define the construct, indicator, intended inference, proxy-risk, scope boundary, and upgrade limit.
- Any artifact that cannot pass must be downgraded to “documentation scaffold; construct not yet validated.”

## Bottom line

The evidence supports making construct-validity review mandatory before MC claim upgrades. It does not prove that current MC evaluations are valid. The current safe claim is narrower:

> MC now has a construct-validity gate designed to prevent proxy metrics from becoming false proof.

The gate itself still needs testing against existing MC artifacts.
