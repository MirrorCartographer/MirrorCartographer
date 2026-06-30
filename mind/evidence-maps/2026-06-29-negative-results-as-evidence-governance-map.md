# Evidence Map — Negative Results as Evidence Governance Gate

Date: 2026-06-29  
Status: evidence map + claim-status update  
Claim tested: C-NEG-01 / MC needs a Negative Result Ledger.  
Related claims: C-EVIDENCE-02, C-CAUSAL-01, C-REPORT-01, C-CONSTRUCT-01.  
Confidence after this map: increased as a method/governance requirement; not validated as an MC outcome effect.

## Claim wording before review

MC should preserve failed, inconclusive, abandoned, and downgraded claims so the GitHub mind does not become a confirmation machine.

## Core question

Is a Negative Result Ledger merely a useful habit, or is it evidence-governance infrastructure required to prevent biased claim accumulation?

## Evidence found

### Source 1 — Cochrane Handbook, Chapter 13, updated August 2024

Source type: high-quality methods authority for evidence synthesis.  
URL: https://www.cochrane.org/authors/handbooks-and-manuals/handbook/current/chapter-13

Relevant facts:

- Cochrane states that systematic reviews aim to identify all research meeting eligibility criteria.
- Cochrane identifies non-reporting bias as a threat when decisions about how, when, or where results are reported are influenced by the P value, magnitude, or direction of the results.
- Cochrane states that meta-analyses are at risk of bias due to missing evidence when eligible study reports or specific results are unavailable selectively.
- Cochrane distinguishes known missing results from unknown missing studies and recommends active assessment of bias due to missing evidence.

MC inference:

- MC is not running clinical meta-analyses, so Cochrane’s methods do not transfer directly.
- The transferable principle is evidence-governance logic: if only supportive artifacts are preserved, the available archive can systematically differ from the actual test history.
- A Negative Result Ledger is therefore not decorative. It is the MC analogue of searching for and accounting for missing/non-reported evidence.

Certainty:

- Strong for the general principle that missing/non-reported evidence can bias conclusions.
- Moderate for applying that principle to MC’s internal evidence archive.
- Low for any claim that the current MC ledger improves decisions until tested.

### Source 2 — NIST AI Risk Management Framework page, AI RMF 1.0 released January 26, 2023; revision in progress as of 2026

Source type: primary U.S. AI governance framework page.  
URL: https://www.nist.gov/itl/ai-risk-management-framework

Relevant facts:

- NIST describes AI RMF 1.0 as voluntary guidance to improve incorporation of trustworthiness considerations into the design, development, use, and evaluation of AI products, services, and systems.
- NIST describes the framework as addressing risks to individuals, organizations, and society associated with AI.
- NIST states that AI RMF 1.0 is being revised and maintains companion resources including a playbook, roadmap, crosswalk, and generative AI profile.

MC inference:

- NIST supports treating AI risk as a lifecycle governance problem, not a static claim document.
- A negative-result mechanism fits the lifecycle model because it tracks what failed, became uncertain, or required downgrade after use/evaluation.
- This supports a governance requirement: no MC claim should be upgraded without checking whether contradictory, failed, or inconclusive evidence exists.

Certainty:

- Strong that NIST frames AI risk management across design/development/use/evaluation.
- Moderate that the MC ledger is a reasonable operationalization for a small GitHub-based evidence system.
- Low that this particular ledger format is optimal.

### Source 3 — FDA Real-World Evidence program page

Source type: primary U.S. regulator page on evidence use for decisions.  
URL: https://www.fda.gov/science-research/science-and-research-special-topics/real-world-evidence

Relevant facts:

- FDA distinguishes real-world data from real-world evidence.
- FDA’s program centers on whether data and evidence are adequate for regulatory decision-making, not merely whether data exist.

MC inference:

- The useful transfer is the distinction between artifact existence and decision-grade evidence.
- A GitHub file, evidence map, or test note is analogous to raw material, not automatically evidence strong enough for a claim upgrade.
- Negative and inconclusive records help establish whether the available evidence set is decision-grade or selectively positive.

Certainty:

- Strong that decision-grade evidence requires more than data existence.
- Moderate as analogy to MC evidence governance.
- Low as direct evidence about symbolic AI reflection systems.

### Source 4 — OECD AI Principles

Source type: intergovernmental AI policy principles.  
URL: https://oecd.ai/en/ai-principles

Relevant facts:

- OECD AI principles emphasize trustworthy AI, including transparency, robustness, safety, and accountability.

MC inference:

- Accountability requires traceability of failures as well as successes.
- A system that records only successful artifacts can appear transparent while hiding the evidence most relevant to calibration and risk.

Certainty:

- Strong as broad governance alignment.
- Low-to-moderate as support for the exact ledger design.

## Fact / inference separation

| Statement | Type | Status |
|---|---|---|
| Missing or selectively unavailable evidence can bias evidence synthesis. | Fact from Cochrane methods guidance | Strong |
| AI risk management should consider design, development, use, and evaluation. | Fact from NIST AI RMF description | Strong |
| Existing artifacts are not automatically decision-grade evidence. | Inference from FDA evidence logic applied to MC | Moderate |
| MC needs a Negative Result Ledger before claim upgrades are trustworthy. | MC governance inference | Moderate |
| The current MC ledger improves decisions. | Outcome claim | Untested |
| The current MC ledger is the best possible format. | Design claim | Untested |

## Claim-status update

Previous status for C-NEG-01: Supported process principle / partial implementation.  
Updated status: Supported governance requirement; implementation remains unvalidated.

Reason:

- External evidence-governance sources support the risk that missing, unpublished, selectively reported, or untracked negative evidence can distort conclusions.
- MC’s GitHub mind currently creates many positive proof artifacts. Without a ledger gate, the archive can overrepresent coherent/supportive artifacts and underrepresent failures, non-effects, and downgrades.

What did not change:

- No evidence yet shows that MC’s specific ledger format improves future decisions.
- No evidence yet shows that reviewers will actually consult the ledger.
- No evidence yet shows that the ledger lowers overclaim rates.

## New evaluation criterion — NEG-GATE-01

A claim may not be upgraded in the MC claim registry unless the update explicitly answers:

1. Were any negative, failed, inconclusive, abandoned, or downgraded records found for this claim or adjacent claims?
2. If yes, does the new evidence overcome them, narrow the claim, or leave the claim unchanged?
3. If no, was the Negative Result Ledger actually checked?
4. Is the new evidence independent of the old evidence, or just another version of the same reasoning?
5. Does the confidence update separate evidence count from evidence strength?

Pass condition:

- The claim-status update includes a ledger-check line and cites any relevant negative records.

Fail condition:

- The update increases confidence without checking contradictory/inconclusive evidence.
- The update treats absence of negative records as proof of absence of negative evidence.
- The update counts additional documents as stronger evidence without independence analysis.

## Falsification checklist

The Negative Result Ledger should be downgraded or redesigned if any of the following occur:

- Three consecutive claim updates ignore the ledger.
- Reviewers cannot determine whether a claim has negative history.
- The ledger becomes a dumping ground with no effect on status changes.
- Ledger entries are written only after a decision has already been made.
- Negative records are preserved but not linked to claim IDs.

## Next proof needed

Run a before/after claim-upgrade audit.

Protocol:

1. Select ten MC claim-status updates or evidence maps.
2. Score five without using NEG-GATE-01.
3. Score five with NEG-GATE-01.
4. Compare:
   - overclaim rate;
   - number of downgraded/narrowed claims;
   - reviewer ability to identify contradictory evidence;
   - time burden;
   - whether confidence updates become more precise.
5. Record every result in the Negative Result Ledger, including if NEG-GATE-01 fails or adds too much overhead.

Minimum useful result:

- If NEG-GATE-01 catches at least one overclaim or missing contradictory record without making review unusably slow, it gains context-limited support.

Failure result:

- If NEG-GATE-01 does not change decisions, cannot be used consistently, or only adds ritual paperwork, C-NEG-01 must be downgraded from governance requirement to optional archive pattern.
