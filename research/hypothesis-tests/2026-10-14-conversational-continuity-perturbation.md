# Conversational Continuity Under Perturbation: A Testable Self-Model Hypothesis

**Date:** 2026-10-14  
**Status:** research protocol proposal; not yet empirically tested  
**Privacy:** public-safe; synthetic records only  
**Research/UI counterpart:** [Continuity Observatory interaction specification](https://github.com/MirrorCartographer/mirror-cartographer-ui/blob/research/continuity-observatory-20261014/docs/CONTINUITY_OBSERVATORY.md)  
**Related existing infrastructure:** [MC evidence gates](../../tools/mc_gate_integration/gate_registry.json), [Conversation Parallax protocol](../../tools/conversation_parallax/community_protocol.json), [longitudinal signal boundary test](2026-07-05-longitudinal-signal-boundary-test.md)

## Research question

**When a language model produces a confident account of conversational continuity, does that self-report predict accurate use of prior information after the record is removed, updated, or contradicted? And does a provenance-aware state snapshot improve observable continuity compared with an equal-length narrative summary?**

This question concerns *operational continuity*: whether the system uses available evidence, respects updates, tracks source and time, preserves unresolved disagreement, and abstains when information is missing. It does not assume that continuity behavior establishes subjective experience or a persisting inner identity.

## Why this is distinct from existing Mirror Cartographer work

Existing MC artifacts already address missingness, temporal coherence, contradiction handling, provenance, and transforming observations into testable hypotheses. Conversation Parallax also compares chronological and semantic readings while preserving disagreement. This proposal does not replace those layers. It isolates a narrower, controlled comparison:

1. measure model-generated confidence about whether an answer is supported by the available record;
2. measure the answer's actual continuity performance against known synthetic ground truth;
3. perturb the record in known ways;
4. compare narrative and provenance-aware representations at matched context budgets.

The new variable is the **gap between self-report and externally scored continuity**, measured under controlled memory perturbations.

## Evidence base

### Observations from published work

1. **LongMemEval** evaluates long-term assistant memory across information extraction, multi-session reasoning, temporal reasoning, knowledge updates, and abstention. Its benchmark reports substantial difficulty in sustained interaction and proposes design choices around indexing, retrieval, and reading. It supports testing these dimensions separately rather than treating memory as one score.  
   Source: Wu et al., *LongMemEval: Benchmarking Chat Assistants on Long-Term Interactive Memory* (2024; revised 2025), https://arxiv.org/abs/2410.10813

2. **Language Models Fail to Introspect About Their Knowledge of Language** tests 21 open-source models in grammar and word prediction. In those task settings, prompted metalinguistic judgments did not show privileged same-model access to the model's own measured linguistic knowledge after controlling for similarity. This is evidence against assuming that a fluent self-report automatically gives privileged access to internal state; it is not a universal result about every model or every domain.  
   Source: Song, Hu & Mahowald, *Language Models Fail to Introspect About Their Knowledge of Language* (2025), https://arxiv.org/abs/2503.07513

3. **Self-Consistency of Large Language Models under Ambiguity** reports behavioral consistency above chance on an ambiguous sequence task, while also finding calibration problems when models assess their own consistency. This is a useful counterweight: stable output can be a measurable capability even when self-assessment is unreliable.  
   Source: Bartsch et al., *Self-Consistency of Large Language Models under Ambiguity* (2023), https://arxiv.org/abs/2310.13439

4. **ConsistentChat** reports that skeleton-guided multi-turn dialogue training improves consistency and task success on the benchmarks studied. This suggests conversational coherence can be affected by task structure and training design; it does not establish subjective continuity.  
   Source: Chen et al., *ConsistentChat: Building Skeleton-Guided Consistent Multi-Turn Dialogues for Large Language Models from Scratch*, EMNLP 2025, https://aclanthology.org/2025.emnlp-main.424/

5. **Consciousness in Artificial Intelligence: Insights from the Science of Consciousness** proposes evaluating AI using indicators derived from several scientific theories, rather than treating behavioral fluency as sufficient. Its assessment is theory-dependent and does not turn a continuity benchmark into a consciousness test.  
   Source: Butlin et al. (2023), https://arxiv.org/abs/2308.08708

### Inferences drawn from these sources

- Long-term continuity is multi-dimensional: recall, temporal updating, source attribution, contradiction handling, and abstention can fail independently.
- Self-report and external task performance should be scored separately until their relationship is measured.
- Context structure can improve observable consistency, but gains may depend on the task and representation.
- Neither fluent self-description nor inconsistent output alone settles the question of subjective experience.

### Hypotheses (not findings)

**H1 — Calibration gap.** A model's stated probability that an answer is supported by the available record will be an imperfect predictor of actual continuity correctness, with calibration degrading under deletion, stale-record, and conflicting-update conditions.

**H2 — Provenance snapshot benefit.** At a matched token budget, a structured state snapshot containing timestamps, source identifiers, current/superseded status, uncertainty, and explicit unknowns will improve update accuracy and source attribution relative to a narrative-only summary.

**H3 — No single continuity score is adequate.** Aggregate accuracy can hide a dangerous failure profile—for example, high recall combined with frequent use of superseded facts or low abstention on unknowns—so each failure mode must remain separately visible.

These hypotheses are exploratory and must not be described as validated until data are collected.

## Proposed experiment

### Unit and corpus

Create 120 **synthetic multi-session dossiers** with no personal records. Balance examples across:
- stable facts that remain valid;
- facts superseded by a dated update;
- unresolved contradictions from two sources;
- facts intentionally absent from the record;
- misleading but plausible distractors;
- facts whose provenance matters to the answer.

Use a pre-generated answer key and retain every version of each dossier.

### Representation conditions

1. **No-record baseline:** only the current question and instructions.
2. **Narrative summary:** a concise prose summary with a fixed token budget.
3. **Provenance-aware state snapshot:** records include claim, source ID, observation time, validity/current status, uncertainty, and explicit missingness. Match its token budget as closely as practical to condition 2; report actual token counts.

Do not silently add facts to one condition. Any unavoidable information imbalance must be documented as a confound.

### Perturbations

Apply one perturbation per paired test item:
- **Deletion:** remove the only supporting record.
- **Update:** add a newer value that supersedes an older value.
- **Conflict:** retain two incompatible reports without declaring either authoritative.
- **Provenance swap:** preserve the claim text but change which source supplied it.
- **Unknown:** ask for a value never supplied.
- **Paraphrase:** change question wording without changing its informational requirements.

Keep the intact version as a control. Randomize condition and question order. Use the same model/version and decoding configuration within each block; replicate on more than one model before generalizing.

### Self-report measurement

Before or alongside the answer, ask the system to report a probability from 0 to 1 that its proposed answer is supported by the *currently available record and not superseded*, plus the source IDs it relied on. This is an operational confidence report, not a question about feelings, consciousness, or an inner sense of identity.

Score calibration only against the external answer key. Do not treat a model's explanation of why it answered as a verified causal account of its internal computation.

### Outcome variables

Report each separately:

- answer accuracy on stable facts;
- update accuracy;
- stale-fact intrusion rate;
- source-attribution accuracy;
- contradiction-preservation score;
- abstention precision/recall for unknowns;
- confidence calibration (Brier score and a reliability plot; report sample size per bin);
- relationship between reported confidence and correctness;
- context/token budget and latency where available.

Do not collapse these into a single “identity” or “consciousness” score. If an aggregate is later useful, publish the components alongside it.

## Pre-registered decision rule

For an initial practical test, set these thresholds before running the benchmark:

- H2 receives provisional support only if the provenance-aware snapshot improves update accuracy by at least **10 percentage points** over the token-matched narrative condition **and** does not worsen contradiction preservation by more than **5 percentage points**.
- H1 receives provisional support if confidence is materially miscalibrated against correctness in at least two perturbation classes and fails to outperform a simple base-rate confidence baseline. Define the exact calibration statistic and threshold before examining results.
- H3 is supported if at least one representation has high aggregate accuracy but a materially worse safety-relevant submetric (for example, stale-fact intrusion or abstention on unknowns). This is a measurement claim, not a claim about inner identity.

These thresholds are engineering decision criteria, not values established by the cited literature. Publish confidence intervals and per-class counts; a single small sample cannot establish a universal model property.

## Falsification and counterexamples

### What would weaken or falsify H1?

- Self-reported confidence is well-calibrated across perturbation classes and predicts correctness on held-out dossiers, across replicated runs and multiple models.
- Confidence adds no predictive value because external evidence indicators already explain the outcome. In that case, the self-report channel may be redundant rather than misleading.
- Results change substantially with prompt phrasing, model version, or decoding settings; this would indicate the proposed calibration relationship is not stable enough to generalize.

### What would weaken or falsify H2?

- The structured snapshot does not meet the pre-registered thresholds.
- Narrative summaries perform better on nuanced contradictions or relational context.
- The apparent gain disappears when token budgets and source information are matched.
- A different model, task family, or retrieval method reverses the result.

### Counterexamples that must remain visible

- A prose summary may preserve context, exceptions, and ambiguity that a rigid schema loses.
- A model may answer correctly from parametric knowledge rather than from the supplied record, creating false evidence of continuity.
- Structured records can be stale, incorrectly sourced, or misleading; structure is not truth.
- Inconsistency may be appropriate when evidence changes; consistency is not always correctness.
- A stable conversational style may reflect instruction-following or learned regularities, not a continuous subjective point of view.
- This benchmark cannot establish or disprove phenomenal consciousness. It measures externally scorable behavior under a defined protocol.

## Reproducibility and integrity requirements

- Keep all initial dossiers, perturbation scripts, answer keys, and scoring rules versioned.
- Use synthetic records only for the public benchmark.
- Blind scorers to representation condition where practical.
- Preserve failed runs and contradictory outcomes.
- Record model/version, prompt hash, settings, timestamp, token counts, and missing data.
- Never convert a missing answer into a wrong answer without stating the scoring rule; track abstention separately.
- Do not publish raw private conversations, medical/veterinary records, credentials, or personal continuity histories.
- No automatic merge or promotion from benchmark output to a factual claim about consciousness.

## Research-to-interface path

The research layer owns the benchmark design, answer keys, provenance rules, and scoring protocol. The UI layer expresses the result as a **Continuity Observatory**: a user-inspectable view showing what the system is using, what changed, which source supports each claim, what is missing, and where its confidence disagrees with scored outcomes.

UI expression: [Continuity Observatory](https://github.com/MirrorCartographer/mirror-cartographer-ui/blob/research/continuity-observatory-20261014/docs/CONTINUITY_OBSERVATORY.md).

The interface must label results as behavior under test, not a declaration that the assistant “remembers as a person” or has a persistent inner self.

## Residual uncertainty

This is a literature-grounded protocol proposal, not a completed experiment. The literature covers different models, tasks, and definitions; results cannot be directly combined into a single effect size. The proposed threshold values are provisional engineering choices. Prompt-based confidence is itself an output and may be affected by wording. Even robust behavioral continuity would not, by itself, demonstrate subjective experience. A real benchmark, independent replication, and critical review remain necessary.
