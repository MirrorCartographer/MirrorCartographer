# Evidence Map — Reviewer Reproducibility Boundary

Date: 2026-06-30  
Run: Evidence Engine 13  
Claim ID: C-REPRO-01  
Status before: implicit weak point / untested assumption  
Status after: supported evidence-governance requirement; MC implementation unvalidated

## Claim tested

Mirror Cartographer evidence maps are stronger when an outside reviewer can reconstruct the search path, inclusion/exclusion decisions, evidence-to-inference chain, uncertainty, and claim-status change without relying on chat history or author memory.

## Why this weak point matters

Previous Evidence Engine maps cite high-quality sources and define evaluation gates. That is useful, but it does not by itself prove reproducibility. A document can look rigorous while still hiding:

- why those sources were selected;
- what was searched but not used;
- whether contradictory evidence was excluded;
- where the AI inferred beyond the source;
- what would downgrade the claim;
- whether another reviewer could reach the same status decision.

This creates a specific failure mode: persuasive evidence maps that cannot be independently reconstructed.

## High-quality source evidence

### 1. NIST AI RMF

Fact: NIST describes the AI RMF as a framework for improving the ability to incorporate trustworthiness considerations into the design, development, use, and evaluation of AI products, services, and systems. It was released January 26, 2023 through a public, consensus-driven process and has companion implementation resources.

Source: NIST AI Risk Management Framework page, accessed 2026-06-30.

Relevant support: MC evidence maps should treat trustworthiness as a lifecycle evaluation problem, not a one-time prose claim.

Limit: NIST does not specify MC's evidence-map format and does not validate MC's GitHub mind.

### 2. Cochrane Handbook — searching, study selection, and documentation

Fact: Cochrane requires review authors to document search processes in enough detail that they can be correctly reported and reproduced where possible, including sources searched, dates, search terms, and decisions. Cochrane also recommends documenting decisions for identified records, tracking flow from search to inclusion, and using at least two independent people for final eligibility decisions.

Source: Cochrane Handbook, Chapter 4, current online version, accessed 2026-06-30.

Relevant support: MC evidence maps need a search log, inclusion/exclusion logic, and reviewer reconstruction path, especially when sources are found through web search or AI-assisted search.

Limit: Cochrane guidance is for systematic reviews, especially health interventions. MC evidence maps are not full systematic reviews unless explicitly scoped that way.

### 3. PRISMA 2020

Fact: PRISMA 2020 provides a checklist and expanded checklist for reporting systematic reviews, with item/sub-item reporting recommendations.

Source: PRISMA 2020 checklist page, accessed 2026-06-30.

Relevant support: MC can borrow the principle of explicit reporting structure: methods, search, selection, results, limitations, and funding/conflict disclosures where relevant.

Limit: PRISMA is not evidence that MC claims are true; it is a reporting discipline for transparent review.

### 4. ACM Artifact Review and Badging

Fact: ACM artifact review distinguishes artifact availability, artifact evaluation, and result validation. For the functional artifact badge, artifacts should be documented, consistent, complete, exercisable, and include appropriate evidence of verification and validation. Reusable artifacts require stronger documentation and structure that facilitate reuse or repurposing.

Source: ACM Artifact Review and Badging policy, current version, accessed 2026-06-30.

Relevant support: MC evidence artifacts should not claim validated status merely because they exist in GitHub. They need enough structure for external exercise, audit, and, eventually, independent reproduction.

Limit: ACM badging is designed for computing research artifacts, not symbolic-cognitive reflection artifacts. It provides a transferable audit concept, not direct validation.

## Fact / inference separation

| Item | Classification | Confidence | Notes |
|---|---|---:|---|
| NIST AI RMF supports lifecycle AI risk evaluation | Fact | High | Public NIST framework page. |
| Cochrane requires detailed search documentation for reproducibility where possible | Fact | High | Handbook language is direct. |
| PRISMA 2020 provides structured reporting checklists | Fact | High | Official PRISMA page. |
| ACM distinguishes artifact evaluation from result validation | Fact | High | Policy explicitly separates badges. |
| MC evidence maps should log search path and exclusion decisions | Inference | Medium-high | Strongly supported by evidence-synthesis practice, adapted to MC. |
| MC GitHub artifacts are currently externally reproducible | Unsupported claim | Low | Not yet tested with reviewers. |
| A reproducibility checklist will improve MC decisions | Hypothesis | Medium | Plausible but needs empirical review test. |

## Claim-status update

C-REPRO-01: Outside-reviewer reproducibility is necessary before MC evidence maps can support upgraded claim status.

New status: supported evidence-governance requirement; implementation unvalidated.

Upgrade allowed:

- from: implicit weak point / untested assumption
- to: supported requirement for evidence-map quality

Upgrade not allowed:

- not to: validated MC capability
- not to: evidence maps are reproducible
- not to: MC claims are scientifically proven

## New evaluation criterion: REPRO-GATE-01

An MC evidence map passes REPRO-GATE-01 only if an outside reviewer can reconstruct the evidence path without chat history.

### Required fields

1. Claim tested
2. Claim status before review
3. Search date
4. Search locations / databases / sites
5. Search terms or discovery path
6. Inclusion criteria
7. Exclusion criteria
8. Included sources with source type
9. Excluded-but-plausible sources with reason for exclusion
10. Fact / inference / hypothesis separation
11. Contradictory or limiting evidence
12. What would downgrade the claim
13. What would upgrade the claim
14. Reviewer reconstruction notes
15. Final claim-status decision

### Pass condition

A reviewer who did not participate in the original chat must be able to answer all five questions:

1. What exact claim was tested?
2. How were the sources found?
3. Why were the included sources considered relevant?
4. What did the AI infer beyond the sources?
5. What evidence would change the claim status?

### Fail condition

Any of the following fails the gate:

- citations are present but search method is absent;
- source inclusion is unexplained;
- no plausible excluded sources are named;
- fact and inference are merged;
- claim status changes without an explicit upgrade/downgrade rule;
- the reviewer must rely on memory of the conversation to understand the artifact.

## Falsification checklist

C-REPRO-01 should be downgraded if any of the following occur during review:

- 3 independent reviewers cannot reconstruct the same claim-status decision from the artifact.
- Reviewers disagree on whether the artifact's central claim was supported, inferred, or merely proposed.
- Excluded-source reasoning cannot be recovered.
- Search terms or discovery path cannot be reconstructed.
- The evidence map cannot distinguish external evidence from MC-internal design preference.
- Adding the reproducibility fields does not improve reviewer agreement across at least 10 artifacts.

## Immediate retrofit target

Apply REPRO-GATE-01 to the last 12 Evidence Engine maps:

1. Negative results as evidence governance
2. Human agency boundary
3. Symbolic reviewability documentation
4. External validity/generalization boundary
5. Confidence labels and overreliance
6. Opportunity proof packet validity
7. Construct validity gates
8. Discovery/Fossil learning loop
9. Incident/near-miss reporting
10. Synthetic provenance disclosure
11. Untrusted input/tool-use boundary
12. Data-quality/source-coverage boundary

## Next proof needed

Run a blinded reconstruction test:

- Select 6 existing Evidence Engine maps.
- Give them to 3 reviewers without chat history.
- Ask each reviewer to identify claim tested, source path, fact/inference split, status decision, and next proof.
- Passing threshold: at least 80% agreement on claim tested and status decision, plus no more than one reviewer requiring chat history to reconstruct the source path.
- If the threshold fails, downgrade MC evidence maps from "audit-ready" language to "internally structured but externally unreproduced."

## Bottom line

The evidence supports a stricter reproducibility boundary for MC evidence maps. It does not prove MC has achieved reproducibility yet. The GitHub mind should treat reproducibility as a tested reviewer behavior, not as a property granted by citations or repository storage.
