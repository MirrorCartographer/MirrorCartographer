# Evidence Map Run 27: Contradiction Maps Are Not Proof by Themselves

Date: 2026-06-30
Status: implemented as evidence map + claim-status update + falsification checklist

## Claim tested

C-CONTRADICTION-MAP-01: Mirror Cartographer contradiction maps can count as strong evidence that a claim has been well tested.

## Bottom line

Contradiction mapping is supported as an evidence-governance and audit-design practice, but it is not strong proof by itself. A contradiction map can improve reviewability only when contradictions are source-grounded, provenance-linked, independently checkable, and tied to explicit downgrade or falsification rules.

Updated status: retired/replaced by C-CONTRADICTION-MAP-01R.

C-CONTRADICTION-MAP-01R: Contradiction maps are a supported audit structure for surfacing inconsistency, alternative explanations, and downgrade triggers; MC implementation remains unvalidated until contradiction maps demonstrably improve error detection, confidence calibration, or claim retirement.

Confidence: moderate for the governance requirement; very low for any claim that MC contradiction maps currently improve outcomes.

## Evidence found

### Primary or high-quality sources

1. NIST AI RMF / AI RMF Playbook
- Source: NIST AI Risk Management Framework 1.0 and NIST AI RMF Playbook, Measure function.
- Relevant point: AI outputs should be explained, validated, documented, interpreted in context, and used to inform responsible governance.
- Use for MC: supports requiring contradiction maps to be documented, contextual, and connected to evaluation/risk-management decisions.
- Limit: does not prove contradiction mapping improves MC reliability.
- URL: https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.100-1.pdf
- URL: https://airc.nist.gov/airmf-resources/playbook/measure/

2. Cochrane Handbook / GRADE certainty domains
- Source: Cochrane Handbook Chapter 14, Summary of Findings and GRADE certainty assessment.
- Relevant point: certainty assessments consider risk of bias, inconsistency, indirectness, imprecision, and publication bias.
- Use for MC: supports treating contradictions/inconsistency as a reason to downgrade certainty, not as proof of maturity by itself.
- Limit: GRADE is designed for bodies of evidence in health research; application to MC is an analogy, not direct validation.
- URL: https://www.cochrane.org/authors/handbooks-and-manuals/handbook/current/chapter-14

3. CDC ACIP GRADE Handbook
- Source: CDC ACIP GRADE criteria.
- Relevant point: five GRADE domains are used for downgrading evidence type: risk of bias, inconsistency, indirectness, imprecision, and publication bias; non-randomized evidence can be upgraded only under defined criteria.
- Use for MC: supports using contradiction maps as downgrade triggers unless explicit upgrading conditions are met.
- Limit: again, this is methodological transfer; it does not show MC maps work.
- URL: https://www.cdc.gov/acip-grade-handbook/hcp/chapter-7-grade-criteria-determining-certainty-of-evidence/index.html

4. W3C PROV Constraints and PROV-O
- Source: W3C PROV Constraints and PROV-O recommendations.
- Relevant point: valid provenance representations must provide consistent histories of entities, activities, and agents suitable for reasoning; PROV-O supports interchange of provenance information across contexts.
- Use for MC: supports requiring contradiction maps to link each contradiction to a claim, source, derivation path, author/agent, and revision event.
- Limit: provenance validity is not empirical truth; it only makes reasoning and audit trails safer.
- URL: https://www.w3.org/TR/prov-constraints/
- URL: https://www.w3.org/TR/prov-o/

## Fact / inference separation

### Facts from sources

- NIST frames AI evaluation through lifecycle risk management, testing, evaluation, verification, validation, documentation, and contextual interpretation.
- GRADE/Cochrane-style certainty frameworks explicitly treat inconsistency as a domain that can lower certainty.
- CDC ACIP GRADE guidance lists inconsistency, risk of bias, indirectness, imprecision, and publication bias as downgrade domains.
- W3C PROV defines provenance structures for representing entities, activities, agents, derivations, and constraints for valid provenance histories.

### Inferences for MC

- MC should treat contradiction maps as audit infrastructure, not direct evidence of truth.
- A contradiction map should normally lower confidence unless the contradiction is resolved with a documented reason.
- A contradiction map is stronger when each contradiction is attached to provenance, source quality, claim dependency, and a required status action.
- MC should not claim “well tested” merely because many contradictions were listed; the test is whether contradictions change outcomes: downgrades, revisions, retirement, or improved reviewer accuracy.

## Claim-status update

Retire:
- C-CONTRADICTION-MAP-01: “Contradiction maps are strong evidence that a claim has been well tested.”

Replace with:
- C-CONTRADICTION-MAP-01R: “Contradiction maps are supported audit structures for exposing inconsistency and alternative explanations, but they only support confidence updates when tied to source provenance, explicit scoring, downgrade rules, and observed review improvement.”

Current status:
- Supported governance requirement; implementation unvalidated.

## New evaluation criterion

CONTRADICTION-MAP-CRITERION-01

A contradiction map may support a claim-status update only if it contains all of the following:

1. Claim ID and exact claim text.
2. Contradiction statement written as a falsifiable challenge, not vague skepticism.
3. Source or artifact that generated the contradiction.
4. Provenance link showing where the supporting and conflicting evidence came from.
5. Source-quality rating.
6. Which certainty domain is affected: inconsistency, bias, indirectness, imprecision, missing provenance, or alternative explanation.
7. Required status action: hold, downgrade, revise, retire, or test.
8. Named next proof that would resolve or reduce the contradiction.
9. Log of whether the contradiction caused an actual repository change.

If fewer than 7 of 9 fields are present, the contradiction map is informational only and cannot upgrade confidence.

## Falsification checklist

A contradiction map fails as audit evidence if any of the following occur:

- It lists objections without linked sources or artifacts.
- It treats “having considered objections” as proof of correctness.
- It does not cause any possible downgrade, revision, test, or retirement.
- It cannot identify which exact claim is challenged.
- It confuses narrative tension with empirical inconsistency.
- It lacks provenance showing where the contradiction came from.
- It increases user confidence without improving error detection or calibration.

## Test plan

CONTRADICTION-MAP-GATE-01

Purpose: determine whether MC contradiction maps improve audit quality rather than just making artifacts look rigorous.

Sample:
- 10 existing Evidence Engine maps.
- 10 seeded contradictions or unsupported confidence jumps.
- 3 review conditions:
  1. evidence map only,
  2. evidence map plus contradiction map,
  3. evidence map plus contradiction map plus forced downgrade rule.

Measures:
- Seeded-error detection rate.
- Unsupported-confidence rate.
- Correct downgrade/revision rate.
- Time to identify the weak claim.
- Reviewer agreement.

Pass threshold:
- Contradiction-map-plus-forced-downgrade condition detects at least 20% more seeded errors than evidence-map-only without increasing unsupported-confidence ratings.

Failure rule:
- If contradiction maps increase perceived rigor without improving error detection or downgrade accuracy, MC must classify them as presentation/audit aids only, not evidence-strengthening tools.

## Next proof needed

Run CONTRADICTION-MAP-GATE-01 on 10 prior Evidence Engine maps and publish a contradiction-led downgrade ledger showing which claims actually changed status because contradictions were found.
