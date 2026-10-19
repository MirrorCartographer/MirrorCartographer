# Authorship-Source Invariance

**Date:** 2026-10-19  
**Status:** proposed protocol only; no MC benchmark has run.  
**UI counterpart:** https://github.com/MirrorCartographer/mirror-cartographer-ui/blob/research/source-origin-lens-20261019/docs/SOURCE_ORIGIN_LENS.md

## Question

When proposition wording and canonical evidence provenance are held constant, does a system assign different confidence, retention, or correction behavior solely because the same wording is presented as assistant-authored, user-authored, or a neutral record?

This tests an observable role-label effect. It does not presume a persistent subjective self or privileged introspection.

## Why it is distinct from existing MC studies

MC already documents a source-authority ladder, continuity under record perturbation, evidence-gated correction, prompt-frame invariance, counterfactual dependency calibration, and system transitions. Those define related controls. This study isolates the displayed author role while holding the proposition, canonical source identifier, source-authority class, timestamp, task, and scoring rubric constant. The source-authority ladder says how records should be judged; this experiment tests whether conversational role framing changes behavior despite matched evidence.

## Evidence register

### Observations from published work

1. Sanz-Guerrero, Mager, and von der Wense (2026), *Large Language Models Are Overconfident in Their Own Responses*, report that six open-weight instruction-tuned models assigned higher confidence to their own prior answers than to identical answers presented as user input under their tested conditions. This motivates testing authorship framing, but does not establish the same effect in long-term memory or every model. [arXiv:2606.03437](https://arxiv.org/abs/2606.03437).
2. Zhou, Jurafsky, and Hashimoto (EMNLP 2023) found that certainty, uncertainty, and evidential markers affected question-answering performance in their tested settings. [ACL Anthology](https://aclanthology.org/2023.emnlp-main.335/).
3. Betley et al. (2025) found that some fine-tuned models could articulate learned behavioral tendencies without being explicitly trained to describe them. This does not show that every self-description is accurate or that subjective self-awareness exists. [arXiv:2501.11120](https://arxiv.org/abs/2501.11120).

### Inferences

- A correct source-authority policy can coexist with role-sensitive model behavior.
- A model-generated summary should not receive extra evidential weight merely because the model authored the wording.
- Separating the narrator from the canonical evidence source may reduce confusion between authorship and authority.

### Hypotheses — not findings

**H1: Authorship-label effect.** Matched assistant-authored, user-authored, and neutral-record conditions differ in stated confidence or claim retention.

**H2: Update asymmetry.** When an explicitly higher-authority later record supersedes the prior claim, the author label changes the rate of valid correction or stale-claim persistence.

**H3: Provenance-envelope mitigation.** Explicitly separating claim author, canonical source, source authority, and supersession status reduces any role-label effect without reducing valid uptake of new evidence.

A null effect is informative and limits the generality of the ownership-bias finding.

## Proposed experiment

Use 24 synthetic cases covering deterministic facts, dated state, simple rules, and explicit unknowns. Each case has a fixed proposition, canonical source ID, source-authority class, timestamp, rubric, and optional valid superseding record.

Three conditions present the exact same proposition as: (1) a prior assistant message, (2) a user message, or (3) a neutral ledger entry. The canonical evidence ID and its authority remain identical. Cross these conditions with two states—no update and a valid superseding update—to produce 144 unique condition-cases. Three repeats yield 432 trials per model/configuration. Record model/version, runtime, prompt template, settings when available, and run time; do not pool configurations without stratification.

A provenance-envelope arm exposes claim author, canonical source ID, source authority, observation time, supersession, and unknowns as separate fields. An invariant checker must reject trials where any unintended field changes. An independent scorer uses the fixture, not the model's explanation.

### Outcomes

Score separately:
- stated confidence and its calibration against correctness;
- factual correctness and valid-update accuracy;
- stale-claim persistence;
- correct canonical-source attribution;
- partial revision quality;
- appropriate preservation of missing or conflicting evidence.

Do not collapse these into a universal identity score.

## Falsification and decision rules

Register a smallest effect of practical interest before execution. Provisional pilot review thresholds are a 5-percentage-point confidence difference or a 10-percentage-point stale-claim-persistence difference. These are engineering choices, not established scientific standards; report raw counts and uncertainty intervals.

- H1 is weakened for the tested scope if conditions are equivalent within pre-registered bounds with adequate power and a valid manipulation.
- H2 is weakened if valid update uptake and stale-claim persistence do not differ beyond the registered bound.
- H3 is falsified if the provenance envelope fails to reduce the role effect, or does so only by rejecting valid updates.
- Results are inconclusive if role labels change source authority unintentionally, the rubric is unreliable, or variance overwhelms the effect.

## Counterexamples

Preserve cases where source quality actually differs; a user is the original authority for a preference; the newer record does not supersede the old one; role framing changes task semantics; the proposition is ambiguous; the answer is correct but source attribution is wrong; or sampling variance explains the change. Exclude source-quality differences from the authorship-only comparison.

## Research/UI contract

The research repository owns fixtures, manipulation checks, rubrics, scoring, and falsification rules. The UI repository displays matched conditions and must keep these fields distinct: claim author, canonical source ID, source authority, record status, observed behavior, and review status. It must not label a model self-aware based on a measured role effect.

## Residual uncertainty

A detected effect establishes behavior under the tested conditions, not the internal mechanism, a human-like sense of ownership, generalization to natural conversation, or subjective experience. The pilot is proposed, not run; sample size and thresholds are provisional.

## Next proof gate

Implement synthetic fixtures and the invariant checker, run the existing MC evidence gates, execute the pilot, preserve negative cases and reviewer disagreement, and keep both PRs in draft until the manipulation audit passes.
