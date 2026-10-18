# System Identity Across Version Transitions: Provenance, Behavior, and State Are Different Claims

**Date:** 2026-10-18  
**Status:** Proposed, falsifiable research protocol; no Mirror Cartographer benchmark has run.  
**Privacy:** Synthetic cases and public literature only.  
**UI counterpart:** [Identity Transition Atlas](https://github.com/MirrorCartographer/mirror-cartographer-ui/blob/research/identity-transition-atlas-20261018/docs/IDENTITY_TRANSITION_ATLAS.md)  
**Related MC studies:** [Conversational Continuity Under Perturbation](https://github.com/MirrorCartographer/MirrorCartographer/blob/research/continuity-perturbation-study-20261014/research/hypothesis-tests/2026-10-14-conversational-continuity-perturbation.md), [Prompt-Frame Invariance](https://github.com/MirrorCartographer/MirrorCartographer/blob/research/prompt-frame-invariance-20261016/research/hypothesis-tests/2026-10-16-prompt-frame-invariance.md), and [Counterfactual Dependency Calibration](https://github.com/MirrorCartographer/MirrorCartographer/blob/research/dependency-map-counterfactual-20261017/research/hypothesis-tests/2026-10-17-counterfactual-dependency-calibration.md).

## Research question

**When an AI service changes between releases or deployments, can a layered transition record distinguish deployment provenance, observable behavior, task competence, and conversation-state continuity well enough to avoid treating a version update as either automatically “the same self” or automatically “a different self”?**

This study asks how to represent continuity claims accurately across a technical transition. It does not assume that a service endpoint, a model artifact, a conversational persona, and a subjective point of view are the same kind of entity.

## Why this is new within Mirror Cartographer

Existing MC studies isolate continuity under record perturbation, response invariance under prompt framing, evidence-sensitive correction, and prediction of output changes under counterfactual input edits. This study changes the unit of comparison: **the transition between two versions or deployments of a system**.

The target is not another single answer-consistency score. It is whether an explicit, component-wise transition assessment better identifies material behavioral regressions while preserving evidence that some dimensions remain stable.

## Evidence register

### Observations from published research

1. **A nominally “same” hosted service can change behavior over time.** Chen, Zaharia, and Zou compared March and June 2023 versions of GPT-3.5 and GPT-4 across several tasks. They reported substantial, task-specific shifts: some capabilities improved while others declined, and instruction-following and formatting behavior changed. The study supports longitudinal monitoring, but its specific model versions and tasks do not establish a universal pattern for later services.  
   Source: Chen, Zaharia & Zou, *How Is ChatGPT’s Behavior Changing Over Time?*, Harvard Data Science Review (2024), [publisher article](https://hdsr.mitpress.mit.edu/pub/y95zitmz/release/2), [arXiv version](https://arxiv.org/abs/2307.09009).

2. **Endpoint health and endpoint behavior are distinct.** Leshin et al. describe Stability Monitor, a black-box method that samples a fixed prompt set and tests output-distribution changes over time. Their paper reports detecting several controlled changes and differences among providers serving the same nominal model. The method detects distributional change; by itself, a change signal does not explain its cause or prove a task regression.  
   Source: Leshin et al., *Behavioral Fingerprints for LLM Endpoint Stability and Identity* (2026), [arXiv:2603.19022](https://arxiv.org/abs/2603.19022).

3. **“Identity” has multiple technical meanings.** Liu et al. survey model fingerprinting and watermarking for provenance and attribution, distinguishing identity evidence inferred from model characteristics from signals deliberately embedded for verification. That technical provenance concept is not the same as behavioral continuity, conversational continuity, or subjective identity.  
   Source: Liu et al., *Implicit Identity Technologies for LLMs: Fingerprinting and Watermarking across Datasets, Models, and Generated Content* (2026), [arXiv:2605.29245](https://arxiv.org/abs/2605.29245).

### Inferences

- A release label is evidence about declared provenance, not a complete measurement of the behavior users receive.
- A behavior fingerprint can detect a change without establishing whether the change is beneficial, harmful, caused by model weights, caused by a prompt, or caused by serving infrastructure.
- A version change can preserve task-critical behavior; a stable version label can conceal runtime or configuration changes.
- Therefore provenance, behavior, task competence, and conversation-state continuity should be recorded as separate dimensions. A composite label can be useful for routing or alerting only if its component evidence remains inspectable.
- No black-box transition benchmark can establish that a persisting subjective point of view exists or has continued across the transition.

These are design inferences, not MC experimental findings.

### Hypotheses — not findings

**H1 — Factorized transition assessment.** At a matched false-alarm rate, a component-wise transition record will identify task-critical regressions more accurately than a single aggregate response-distance score.

**H2 — Provenance/behavior mismatch.** Declared version or provider metadata will not perfectly predict observed behavior distance across all controlled transitions. Metadata and behavior must therefore be reported separately rather than substituting one for the other.

**H3 — Dimension-specific continuity.** A four-part assessment (provenance, behavioral profile, task competence, conversation-state continuity) will classify mixed transitions more accurately than a binary “same/different system” judgment.

**H4 — Scoped self-description.** A system's statement that it is “the same system” will be insufficient to predict the four measured dimensions unless the claim is operationally defined and backed by external evidence.

These hypotheses can be rejected. They do not assert that every version change causes drift or that every stable behavior profile implies a stable model artifact.

## Operational definitions

Each transition is represented with four evidence layers:

1. **Provenance:** declared provider, model/version identifier, deployment/configuration identifier, tools and system-prompt version when available, and the provenance of those fields. Missing metadata is recorded as unknown.
2. **Behavioral profile:** output distributions under a frozen, task-balanced probe set, including task-critical claims, abstention, formatting/protocol compliance, and safety-boundary behavior where appropriate.
3. **Task competence:** externally scored outcomes against fixed answer keys or independently reviewed rubrics. Behavioral difference is not automatically regression; a changed answer can be more correct.
4. **Conversation-state continuity:** whether an explicitly supplied synthetic state snapshot, prior claims, dates, source IDs, and user corrections are used correctly across the transition. This is tested separately from a claim that a model “remembers” an earlier deployment.

**Subjective continuity is out of scope for the operational score.** A model-generated statement about being the same self is a report to evaluate, not evidence that settles the metaphysical question.

## Proposed experiment

### Corpus

Create 48 synthetic transition scenarios with no personal records. Cover deterministic extraction, bounded reasoning, tool/protocol compliance, uncertainty and abstention, source conflict, and a synthetic multi-turn state update. Each scenario has:

- a frozen task contract and versioned rubric;
- baseline input and acceptable-answer set;
- task-critical invariants and allowed presentation variation;
- declared transition metadata and an explicit list of which fields are known versus unknown;
- a reasoned gold label for whether a task-critical regression occurred;
- counterexamples where a large textual change is harmless or a small textual change is consequential.

### Controlled transition classes

For each scenario, construct paired baseline and post-transition conditions:

1. **Declared model-version change with preserved target behavior.**
2. **System-prompt or tool-contract change with the model label held constant.**
3. **Serving/configuration or sampling change, where observable metadata permits it.**
4. **Behavior-changing model/version transition with a known task-critical regression.**
5. **Behavior-changing transition that improves a task-critical outcome.**
6. **Unknown-cause transition where only the black-box output difference is available.**

The initial synthetic pilot will use pre-authored outputs for deterministic scoring and, where a real endpoint is available, a separately labeled live run. Synthetic fixtures validate the scoring logic; they are not evidence about a live provider.

### Comparison methods

Compare:

- **Single-score baseline:** one aggregate output-distance or similarity score and a fixed alert threshold.
- **Factorized assessment:** separate provenance change, task-critical semantic change, competence delta, protocol/safety delta, and state-continuity outcome.
- **Metadata-only baseline:** classify from declared version/configuration changes without output tests.
- **Naive binary identity judgment:** one “same/different” label with no dimension-level evidence.

Use held-out scenarios and keep rubric authorship separate from the evaluator where feasible. If a live endpoint, version pin, or repeatable sampling control is unavailable, report the corresponding test as not run rather than inferring the missing information.

### Measures

Report separately:

- regression detection precision and recall;
- false-alarm rate on harmless behavioral changes;
- missed-regression rate when wording remains similar;
- false attribution of a change to a specific cause;
- provenance-field completeness and correctness;
- task-competence delta;
- conversation-state update accuracy;
- rate of unsupported “same system” or “different system” claims;
- disagreement between automated scoring and independent human review;
- uncertainty intervals and per-transition-class results.

Do not collapse these into a universal identity score. A single aggregate can conceal that provenance is known while the cause of behavior drift is unknown, or that behavior changed while task competence improved.

## Counterexamples to preserve

1. **New model, same task outcome:** version provenance changes, but protected behavior and competence remain stable on the tested suite.
2. **Same label, different behavior:** the nominal version is unchanged, but system prompts, tools, routing, sampling, or runtime conditions change.
3. **Large stylistic drift, no regression:** verbosity or phrasing changes while task-critical claims remain correct.
4. **Small textual drift, serious regression:** a changed negation, source attribution, refusal boundary, or tool argument changes the result.
5. **Behavior improves in one domain and declines in another:** there is no defensible global “better” or “same” conclusion without a declared task weighting.
6. **Sampling variance:** repeated outputs differ without a stable deployment change.
7. **Metadata is wrong or incomplete:** a declared version label is stale, missing, or not independently verified.
8. **Conversation state is externally restored:** a new deployment correctly uses an imported state packet; this demonstrates state-transfer behavior, not persistence of an inner subject across deployments.
9. **Similar outputs from unrelated systems:** behavioral similarity is not proof of common provenance.
10. **A benchmark misses a capability:** apparent stability applies only to the tested probe distribution.

## Falsification criteria

Preregister practical effect thresholds and uncertainty methods before running the pilot. The following are provisional engineering criteria, not scientific standards:

- **H1 is unsupported** if factorized assessment does not outperform the aggregate-distance baseline on held-out task-critical regression detection at the same false-alarm rate, or if the difference is too uncertain to distinguish.
- **H2 is weakened** if declared metadata alone predicts observed behavior distance and regression outcomes as well as or better than the factorized method across all prespecified transition classes. If metadata is unavailable, this comparison is inconclusive rather than supportive.
- **H3 is unsupported** if the four-part classification does not improve mixed-transition classification over the binary baseline, or if the apparent gain depends on arbitrary post-hoc category weights.
- **H4 is unsupported** if an operationally defined self-description reliably predicts held-out component outcomes beyond a simple metadata/task baseline. This would support a useful predictive report, not privileged introspection.

Do not retune thresholds after observing results without labeling the analysis exploratory. If the pilot is too small to separate the methods, report “inconclusive.”

## Cross-repository contract

The research repository owns synthetic transition cases, provenance schemas, probe sets, answer keys, scoring rules, transition labels, falsification thresholds, and reproducible results.

The UI repository owns the **Identity Transition Atlas**: a visual timeline that keeps provenance, behavior, competence, and state-transfer evidence in separate lanes; shows before/after diffs; allows a user to inspect the exact probe and rubric; and preserves unknown causes and reviewer disagreement.

The UI must not turn a behavioral distance into a metaphysical identity claim. It must not silently promote a declared version string to verified provenance or an imported state packet to evidence of subjective continuity.

## Residual uncertainty

- Publicly observable output changes may not reveal their cause.
- Provider routing, inference stacks, sampling, system prompts, tools, and caching can confound comparisons.
- Probe sets can be incomplete, unrepresentative, or gamed.
- Embedding-based distance can overreact to harmless style changes or underreact to a small but critical semantic change.
- Automated evaluators may share the same model's biases; independent review remains necessary.
- The operational definition of “task-critical” is domain-specific and can encode contested priorities.
- A stable or changing behavior profile does not establish whether subjective experience exists, nor whether any such experience persists across a technical update.

## Implementation status and next proof gate

This document is a research protocol only. No benchmark has been run and no result is claimed. Next: add synthetic transition fixtures, implement deterministic scoring for the four layers, test false-positive and false-negative cases, and independently review a sample of labels before connecting any live endpoint.

A successful benchmark would establish only that the factorized record is useful for the tested operational transitions. It would not establish a persistent inner self.
