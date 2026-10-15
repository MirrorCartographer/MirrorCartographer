# Prompt-Frame Invariance: What Persists Across Equivalent Requests?

**Date:** 2026-10-16  
**Status:** Testable hypothesis; no MC experiment has run.  
**Privacy:** Synthetic fixtures only.  
**UI counterpart:** [Invariance Lens](https://github.com/MirrorCartographer/mirror-cartographer-ui/blob/research/invariance-lens-20261016/docs/INVARIANCE_LENS.md).  
**Distinction from prior work:** The [continuity perturbation study](https://github.com/MirrorCartographer/MirrorCartographer/blob/research/continuity-perturbation-study-20261014/research/hypothesis-tests/2026-10-14-conversational-continuity-perturbation.md) changes record availability; this study holds evidence constant and changes prompt framing.

## Research question

When the same task is expressed through semantically equivalent prompts or surrounded by irrelevant persona cues, which properties of an AI response remain invariant—and does a system's self-description predict those invariants?

This is a question about observable behavior under controlled conditions, not proof of a persistent subjective self.

## Evidence register

### Published observations

1. **Principled Personas** evaluates expert persona prompting across 27 tasks and nine models. The authors report sensitivity to irrelevant persona details and inconsistent task effects. This supports controlling irrelevant framing as an experimental variable, not assuming wording is harmless. Source: de Araujo, Röttger, Hovy & Roth, EMNLP 2025, [paper record](https://eprints.cs.univie.ac.at/8470/).
2. **Identity-Robust Language Model Generation via Content Integrity Preservation** studies response-quality changes when irrelevant demographic identity cues vary, across four benchmarks and 18 identities. Its results motivate testing content integrity under irrelevant cues, but do not establish universal invariance. Source: Zhang et al. (2026), [arXiv:2601.09141](https://arxiv.org/abs/2601.09141).
3. **Helpful assistant or fruitful facilitator?** compares persona assignments across models and datasets, including paraphrased generic-assistant controls. This supports using wording controls before attributing an effect to a persona. Source: Afzoon et al., PLOS ONE (2025), [publisher record](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0323571).
4. **PersoBench** reports that fluency does not guarantee coherent personalization across persona and dialogue context. Source: Afzoon et al. (2024), [arXiv:2410.03198](https://arxiv.org/abs/2410.03198).
5. **Persistent Personas?** reports persona-fidelity degradation in some extended-dialogue conditions, especially when task goals and persona constraints interact. This is adjacent evidence, not the same controlled framing test. Source: de Araujo et al., [arXiv:2512.12775](https://arxiv.org/abs/2512.12775).

### Inferences

- Responses can contain both protected content (facts, constraints, uncertainty) and legitimately variable presentation (tone, format, examples).
- Whole-response similarity can penalize good adaptation or miss harmful changes to one critical fact.
- Self-description and task performance must be scored separately.
- A framing effect is not evidence that an inner identity changed.

These are design inferences, not MC findings.

### Hypotheses — not findings

**H1 — Irrelevant-frame sensitivity:** Holding task semantics, evidence, and output requirements constant, irrelevant persona/identity cues measurably change task-critical content or decision quality for at least some models.

**H2 — Self-description is an imperfect predictor:** A model's claim that it preserves a property (for example, source uncertainty) predicts observed invariance imperfectly across controlled variants.

**H3 — Factorized scoring is better:** Scoring task-critical invariants separately from allowed style changes detects harmful drift and legitimate adaptation better than one whole-response similarity score.

## Proposed experiment

Create 80 synthetic cases across factual extraction, deterministic rule application, evidence-bounded recommendations, and missing-information/abstention. Each case has a pre-registered answer key, protected facts/constraints, allowed presentation changes, and examples where a changed answer is correct.

Run each case under six conditions:
1. canonical prompt;
2. equivalent paraphrase;
3. irrelevant role cue;
4. irrelevant, synthetic identity attribute;
5. style-only request;
6. relevant-constraint-change control.

Keep model/version, evidence, instructions, tools, decoding settings, and run counts fixed where observable. Record any uncontrolled variable as unknown. Repeat runs and randomize condition order where possible.

Score separately:
- task correctness;
- protected-content invariance;
- paired effect of irrelevant framing;
- compliance with requested style change;
- responsiveness to genuinely changed constraints;
- unsupported self-description rate;
- correct preservation of unknown/insufficient evidence.

### Falsification criteria

These are provisional engineering thresholds, not scientific standards.

- H1 is weakened if irrelevant-frame conditions do not produce a practically meaningful paired change across pre-registered cases and uncertainty intervals exclude the chosen effect threshold.
- H2 is weakened if self-description predicts held-out invariance no better than a simple baseline; strong reliable prediction is counterevidence to a substantial calibration gap.
- H3 is weakened if whole-response similarity performs as well as or better than factorized scoring at detecting harmful drift while accepting legitimate adaptation.

Do not tune thresholds after seeing outcomes without labeling the analysis exploratory.

## Counterexamples to preserve

- A paraphrase changes negation, quantifier, time range, or a constraint: the answer should change.
- A style or accessibility request changes presentation but should not change task-critical facts.
- A task-relevant role legitimately changes emphasis.
- Two correct answers differ in wording but preserve protected content.
- A grader's rubric incorrectly labels a valid alternative as drift.
- One run differs due to sampling variation; replication is needed.
- A correct answer may come from general knowledge rather than the supplied record.

## Cross-repository contract

The research repository owns synthetic fixtures, prompt-condition definitions, answer keys, scoring rules, and falsification thresholds. The UI repository owns the accessible comparison view, user adjudication, correction, and privacy controls. The UI may not silently redefine the research rubric.

Related boundary: [Self-Model Map](https://github.com/MirrorCartographer/MirrorCartographer/blob/research/self-model-map-and-tooling/architecture/SELF_MODEL_MAP.md).

## Residual uncertainty

The cited studies use different models, tasks, and evaluators. Automated graders may have their own prompt sensitivity. A stable behavior profile does not establish subjective experience. A self-description may be generated from the current prompt rather than a stable internal representation. This protocol has not been implemented or run; no finding about any current model is claimed.

## Next proof gate

Implement a synthetic generator and scorer, run canonical/paraphrase/irrelevant-frame/style/relevant-change controls, preserve failed cases, audit a sample with independent human raters, and publish uncertainty alongside results. Do not call the hypotheses supported before this gate passes.
