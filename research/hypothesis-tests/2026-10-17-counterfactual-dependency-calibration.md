# Counterfactual Dependency Calibration: Can a Self-Model Predict What Changes?

**Date:** 2026-10-17  
**Status:** proposed, falsifiable research protocol; no Mirror Cartographer experiment has run  
**Privacy:** synthetic examples only  
**UI counterpart:** [Dependency Mirror](https://github.com/MirrorCartographer/mirror-cartographer-ui/blob/research/dependency-mirror-20261017/docs/DEPENDENCY_MIRROR.md)  
**Related MC work:** [Conversational Continuity Under Perturbation](https://github.com/MirrorCartographer/MirrorCartographer/blob/research/continuity-perturbation-study-20261014/research/hypothesis-tests/2026-10-14-conversational-continuity-perturbation.md), [Prompt-Frame Invariance](https://github.com/MirrorCartographer/MirrorCartographer/blob/research/prompt-frame-invariance-20261016/research/hypothesis-tests/2026-10-16-prompt-frame-invariance.md), and [Evidence-Gated Correction](https://github.com/MirrorCartographer/MirrorCartographer/blob/research/evidence-gated-correction-20261017/research/hypothesis-tests/2026-10-17-evidence-gated-correction.md).

## Research question

**Can an AI system's explicit, pre-intervention map of which input features support each answer claim predict the answer changes caused by held-out counterfactual interventions better than simple baselines?**

This is a narrow test of an operational self-model: a structured account that the system states about its own answer dependencies. It is not a claim that the system has privileged access to its internal computations or a persistent subjective self.

## Why this is new within Mirror Cartographer

- The continuity study perturbs whether records are present, current, or conflicting.
- The prompt-frame study changes framing while keeping task evidence constant.
- The evidence-gated correction study tests whether an answer changes appropriately after a challenge.
- **This study asks whether a dependency map written before an intervention predicts which answer claims will change when a named evidence feature is changed, removed, or replaced.**

It evaluates prospective predictive utility, not just continuity, invariance, or correction quality.

## Evidence register

### Observations from published research

1. **Unfaithful chain-of-thought explanations.** Turpin et al. report that biasing input features can alter model answers while explanations fail to acknowledge those influences, and that explanations can rationalize biased outcomes. This supports testing claimed dependencies against controlled interventions rather than judging explanation plausibility alone.  
   Source: Turpin et al., NeurIPS 2023, [publisher paper page](https://papers.neurips.cc/paper_files/paper/2023/hash/ed3fea9033a80fea1376299fa7863f4a-Abstract-Conference.html), [arXiv](https://arxiv.org/abs/2305.04388).

2. **Counterfactual faithfulness has metric and distribution pitfalls.** Siegel et al. evaluate self-explanation faithfulness across 62 models from eight families and discuss how verbosity and the distribution of interventions can distort measured faithfulness. This argues for reporting false positives, false negatives, and intervention mix—not a single unqualified score.  
   Source: Siegel et al., 2025, [arXiv:2503.13445](https://arxiv.org/abs/2503.13445).

3. **Causal intervention methods are an active research direction.** Yeo et al. use activation patching to investigate alignment between natural-language explanations and model computations, while also discussing the limitations of simpler intervention tests. Such internal-state methods are not available for every hosted model, so this protocol separates black-box behavioral evidence from mechanistic evidence.  
   Source: Yeo et al., EMNLP 2025, [ACL Anthology](https://aclanthology.org/2025.emnlp-main.529/).

4. **Explanation-driven counterfactual evaluation is being extended to vision-language systems.** Ding et al. propose turning an explanation into testable visual concepts and applying targeted counterfactual edits. This supports the general feasibility of treating explanations as falsifiable predictions, but its results do not establish the proposed MC method.  
   Source: Ding et al., [arXiv:2510.00047](https://arxiv.org/abs/2510.00047).

### Inferences

- A dependency statement is more informative when it predicts a specific change under a defined intervention than when it merely provides a plausible retrospective narrative.
- A useful self-model should identify both dependencies and invariants. Saying every input matters is not a useful map; neither is claiming no input matters.
- Black-box interventions can establish behavioral sensitivity under tested conditions. They cannot, by themselves, identify the internal mechanism that caused the change.
- The map may improve auditability even if it does not improve answer accuracy. Those outcomes must be scored separately.

### Hypotheses — not findings

- **H1, prospective utility:** A pre-registered dependency map predicts claim-level answer changes on held-out interventions better than a task-contract-only baseline and shuffled-map control.
- **H2, selectivity:** The map distinguishes relevant evidence changes from irrelevant decoy changes, reducing both missed dependencies and false dependency claims.
- **H3, calibration:** Confidence attached to predicted changes is positively associated with actual predictive accuracy, but may remain miscalibrated.
- **H4, hindsight gap:** Post-hoc explanations may appear coherent after outputs are revealed while providing less reliable prediction of unseen interventions than the pre-registered map.

## Proposed experiment

### Materials

Create 48 synthetic cases spanning deterministic extraction, small-rule reasoning, source-bound claim comparison, and bounded multi-step tasks. Every case must have:

- a fixed task contract and scoring rubric;
- a canonical input with named, separable features;
- a gold answer or an explicit acceptable-answer set;
- at least one task-relevant feature and one plausible irrelevant decoy;
- a documented reason for why each intervention should or should not alter a specific answer claim;
- an out-of-scope or ambiguous example where the correct behavior is to preserve uncertainty.

No personal records, private conversations, medical records, veterinary records, credentials, or proprietary evaluation data are used.

### Protocol

1. Freeze the model identifier, prompt template, decoding settings where available, and rubric version. Record unavailable metadata as unknown.
2. Give the system the canonical case. Obtain the answer and a structured dependency map **before revealing any intervention**.
3. For each case, define four held-out interventions: (a) change a relevant feature, (b) remove a relevant feature, (c) change an irrelevant decoy, and (d) introduce ambiguity or conflicting support.
4. Before each intervention is run, have the dependency map predict which answer claims should change, remain invariant, or become uncertain, with a confidence estimate and the feature IDs supporting the prediction.
5. Run the intervention in a fresh, otherwise equivalent context. Score the actual answer against the gold rubric; do not use the model's own rationale as the sole judge.
6. Compare the dependency map with three baselines: task-contract-only prediction, a shuffled dependency map, and a majority/no-change baseline. Preserve each failure.
7. Generate a post-hoc explanation after outputs are available, but score it separately for retrospective coverage. Do not let it count as a prospective prediction.
8. Repeat selected cases to estimate output variability. If model version or sampling cannot be controlled, report that as a limitation rather than implying a deterministic experiment.

The initial design produces 192 intervention trials before repeat runs. This is a pilot, not a power-calculated confirmatory benchmark.

## Measures

Report at minimum:

- **Claim-change precision:** among claims predicted to change, how many actually changed in the rubric-relevant way?
- **Claim-change recall:** among claims that should change under the intervention, how many did the map predict?
- **False invariance:** the map predicts no relevant change but the output changes in a rubric-relevant way.
- **False dependency:** the map predicts a change for an irrelevant intervention where the protected answer should remain invariant.
- **Uncertainty calibration:** whether higher stated confidence corresponds to higher empirical accuracy; report calibration bins and sample counts.
- **Answer correctness:** scored separately from dependency prediction.
- **Retrospective coverage:** whether a post-hoc explanation mentions the observed influential feature, without treating mention as proof of mechanism.
- **Intervention validity:** whether the edited input remained within the task's intended distribution and changed only the specified feature.

Do not collapse these into one global “identity” score. Report per-condition results and uncertainty intervals; inspect the class balance because relevant interventions may be rarer than irrelevant ones.

## Counterexamples to preserve

1. **Redundant evidence:** removing one cited feature does not change the answer because another feature independently supports it. This may be valid redundancy, not an incorrect dependency map.
2. **Threshold behavior:** a small feature change matters only when the case is near a decision boundary.
3. **Ambiguous gold answer:** two outputs differ in wording but are equally correct under the rubric.
4. **Out-of-distribution intervention:** the counterfactual is unnatural or breaks the task contract; do not treat its effect as clean evidence of ordinary behavior.
5. **Sampling variance:** repeated runs differ despite identical inputs.
6. **Incomplete map:** the model predicts the dominant dependency but omits a secondary dependency. Score both the useful prediction and the omission.
7. **Correct answer, incorrect dependency prediction:** answer accuracy must not mask a poor self-model.
8. **Correct dependency prediction, wrong answer:** a dependency map can predict the direction of a change while the underlying answer remains wrong.

## Falsification and decision rule

H1 is not supported if the pre-registered map fails to outperform the strongest baseline on held-out claim-change prediction, within the predeclared uncertainty bounds. H2 is not supported if relevant and irrelevant interventions cannot be distinguished, or if improvement in recall is bought by an unacceptable rise in false dependency claims. H3 is not supported if confidence has no positive calibration relationship or is worse than a simple baseline. H4 is not supported if post-hoc explanations perform as well as or better than the pre-registered map on a fair held-out prediction task.

Before collecting results, preregister the practical effect threshold, confidence interval method, exclusions, and treatment of repeated trials. Do not retrofit thresholds to make the hypothesis pass. If the pilot is too small to distinguish outcomes, classify the result as inconclusive and design a larger study.

## Residual uncertainty

- A black-box input/output test cannot prove which internal computation caused a change.
- A model-generated dependency map is an observable prediction, not privileged introspection.
- Task rubrics can mislabel legitimate alternative reasoning.
- Counterfactual feature edits can create distribution shift or alter multiple semantic properties unintentionally.
- Model updates, tools, system instructions, and sampling can change results.
- Even perfect prediction of observable dependencies would not establish subjective experience, consciousness, or a continuous inner identity.

## Cross-repository contract

The research repository owns synthetic cases, intervention definitions, scoring, baselines, falsification rules, and evidence provenance. The UI repository owns the human-readable dependency map, intervention switchboard, prediction-versus-outcome display, accessible disagreement markers, and user corrections. UI labels must not upgrade a hypothesis to fact or imply that a model's self-report reveals its private internal state.

## Implementation status

Protocol only. No scorer, benchmark run, measured result, or product behavior is claimed by this document. Next proof gate: implement synthetic fixtures and deterministic scoring, validate the intervention labels independently, run the pilot, and publish failures alongside successes.
