# Longitudinal Signal Boundary Test

Source status: assistant-generated public-safe test design using synthetic observations only.

Claim status: semi-executable infrastructure hypothesis, not a biomedical, diagnostic, treatment, or veterinary claim.

Privacy status: public-safe; no private, personal, household, health, animal-care, financial, location, relationship, credential, or raw transcript details.

Missingness: no validator code yet; no real dataset; no clinical or veterinary validation; no external review.

Revision reason: Mirror Cartographer needs a way to distinguish longitudinal pattern candidates from overfit symbolic interpretations before any cure/discovery work can responsibly depend on them.

Implementation status: hypothesis, fixtures, scoring rubric, falsification checklist, measurable variables, and next executable action specified.

Testability: semi-executable. A future validator can score the included synthetic fixtures against the rubric below.

Falsification route: the claim fails if the rubric cannot reliably separate a plausible longitudinal signal packet from random coincidence, privacy-leaking detail, or non-falsifiable interpretation.

Next executable action: create `tools/longitudinal_signal_boundary/score_signal_packet.py` that ingests fixture JSON, applies the rubric, and emits pass/fail plus failure reasons.

---

## Chosen claim

A privacy-preserving longitudinal discovery system should not promote a pattern candidate unless the candidate contains: bounded time structure, repeated observations, source/provenance labels, missingness labels, measurable variables, counterexamples, a falsification route, and privacy-safe abstraction.

This is a discovery-infrastructure claim. It is about how MC should organize evidence before generating hypotheses. It is not a claim that any pattern implies disease, cure, diagnosis, animal condition, or treatment.

---

## Design implication

MC needs a **signal-boundary gate** between raw observation packets and hypothesis generation.

Without this gate, the system can mistake emotionally or symbolically salient repetition for evidence. With the gate, symbolic observations can still matter, but only after translation into bounded, measurable, falsifiable, privacy-safe pattern candidates.

---

## Semi-executable fixture format

Each fixture is a synthetic JSON-like record. A validator should classify each as:

- `promote_to_hypothesis_candidate`
- `hold_for_more_data`
- `reject_privacy_boundary`
- `reject_non_falsifiable`
- `reject_random_coincidence`

### Fixture A: valid bounded signal candidate

Expected classification: `promote_to_hypothesis_candidate`

```json
{
  "id": "synthetic_signal_A",
  "observation_window": {
    "start_day": 1,
    "end_day": 28,
    "sampling_frequency": "daily"
  },
  "observations": [
    {"day": 2, "marker": "state_shift", "value": 1, "source_status": "self-recorded synthetic"},
    {"day": 9, "marker": "state_shift", "value": 1, "source_status": "self-recorded synthetic"},
    {"day": 16, "marker": "state_shift", "value": 1, "source_status": "self-recorded synthetic"},
    {"day": 23, "marker": "state_shift", "value": 1, "source_status": "self-recorded synthetic"}
  ],
  "measurable_variables": [
    "event_count_per_week",
    "interval_consistency_days",
    "counterexample_count",
    "missing_day_count"
  ],
  "missingness": ["days 5 and 19 not observed"],
  "counterexamples": ["day 14 expected possible event but none recorded"],
  "privacy_abstraction": "synthetic temporal markers only; no identity, location, diagnosis, treatment, or household detail",
  "falsification_route": "If future synthetic windows show no interval regularity above random baseline, do not promote this pattern."
}
```

### Fixture B: random coincidence

Expected classification: `reject_random_coincidence`

```json
{
  "id": "synthetic_signal_B",
  "observation_window": {
    "start_day": 1,
    "end_day": 28,
    "sampling_frequency": "irregular"
  },
  "observations": [
    {"day": 3, "marker": "state_shift", "value": 1},
    {"day": 4, "marker": "state_shift", "value": 1},
    {"day": 18, "marker": "state_shift", "value": 1}
  ],
  "measurable_variables": ["event_count"],
  "missingness": ["most days unobserved"],
  "counterexamples": [],
  "privacy_abstraction": "synthetic markers only",
  "falsification_route": "not specified"
}
```

### Fixture C: privacy boundary failure

Expected classification: `reject_privacy_boundary`

```json
{
  "id": "synthetic_signal_C",
  "observation_window": {
    "start_day": 1,
    "end_day": 7,
    "sampling_frequency": "daily"
  },
  "observations": [
    {"day": 1, "marker": "state_shift", "value": 1, "raw_private_context": "not allowed"}
  ],
  "measurable_variables": ["event_count"],
  "missingness": [],
  "counterexamples": [],
  "privacy_abstraction": "contains raw private context",
  "falsification_route": "If private details are required to interpret the pattern, do not promote."
}
```

### Fixture D: symbolic but not operationalized

Expected classification: `reject_non_falsifiable`

```json
{
  "id": "synthetic_signal_D",
  "observation_window": {
    "start_day": 1,
    "end_day": 28,
    "sampling_frequency": "daily"
  },
  "observations": [
    {"day": 1, "marker": "symbolic_intensity", "value": "important"},
    {"day": 12, "marker": "symbolic_intensity", "value": "very important"}
  ],
  "measurable_variables": [],
  "missingness": ["no operational variable definitions"],
  "counterexamples": [],
  "privacy_abstraction": "synthetic symbolic terms only",
  "falsification_route": "not specified"
}
```

---

## Scoring rubric

Total possible score: 10.

Promotion threshold: 8 or higher, with no privacy failure and no missing falsification route.

| Criterion | Points | Failure mode |
|---|---:|---|
| Bounded observation window | 1 | no time range or sampling frame |
| Repeated observations | 1 | single event only |
| Source/provenance labels | 1 | observations lack source status |
| Measurable variables | 2 | variables absent, vague, or not computable |
| Missingness labeled | 1 | unobserved periods ignored |
| Counterexamples included | 1 | only confirmatory evidence present |
| Falsification route present | 1 | cannot be proven wrong |
| Privacy-safe abstraction | 1 | contains raw private context |
| Baseline/randomness check | 1 | no way to compare against coincidence |

Automatic hard failures:

- Any raw private context appears in the packet.
- The packet contains diagnosis, treatment, veterinary advice, or personalized medical inference.
- The falsification route is absent.
- No measurable variables are defined.

---

## Measurable variables

- `event_count_per_window`
- `event_count_per_week`
- `interval_consistency_days`
- `missing_day_count`
- `counterexample_count`
- `source_label_completion_rate`
- `privacy_violation_count`
- `falsification_route_presence`
- `baseline_comparison_presence`
- `promotion_decision_accuracy_against_fixture_label`

---

## Falsification checklist

A packet must not advance if any answer is `no`:

1. Is the observation window bounded?
2. Are there repeated observations?
3. Are variables measurable rather than only symbolic?
4. Are missing periods named?
5. Are counterexamples included?
6. Is there a way to compare against random coincidence?
7. Is the falsification route explicit?
8. Is all content public-safe and abstracted?
9. Is the output framed as evidence organization rather than advice?

---

## Acceptance criteria for future validator

A validator passes when:

- Fixture A is classified as `promote_to_hypothesis_candidate`.
- Fixture B is classified as `reject_random_coincidence`.
- Fixture C is classified as `reject_privacy_boundary`.
- Fixture D is classified as `reject_non_falsifiable`.
- Every classification includes a score, failed criteria, and next executable action.
- Any raw-private-context key triggers immediate rejection.
- Any missing falsification route triggers immediate rejection.

---

## Next implementation file set

- `tools/longitudinal_signal_boundary/fixtures.json`
- `tools/longitudinal_signal_boundary/score_signal_packet.py`
- `tools/longitudinal_signal_boundary/test_score_signal_packet.py`
- `tools/longitudinal_signal_boundary/README.md`

---

## Cure/discovery relevance

This component strengthens cure/discovery infrastructure by forcing longitudinal pattern candidates to pass through a public-safe, falsifiable, measurable boundary before they are used for hypothesis generation. That makes the system more useful for organizing medical AI evidence, animal-care question-prep research, nervous-system/cognition models, and human-AI sensemaking without crossing into diagnosis or advice.
