# Symbolic Observation Packet Hypothesis Test

Date: 2026-07-05

## Purpose

Convert one Mirror Cartographer hypothesis into a semi-executable test artifact. This is discovery infrastructure, not clinical, diagnostic, treatment, or veterinary advice.

## Selected hypothesis

A symbolic or narrative user observation can be transformed into a privacy-preserving, machine-actionable observation packet that preserves enough context to support later hypothesis generation, literature mapping, and falsification planning.

## Why this matters

Breakthrough-oriented work needs more than notes. It needs a repeatable bridge from lived/narrative observations into structured event records that can be compared, aggregated, challenged, and converted into testable claims without leaking private details.

## Source status

Primary/current source anchors:

1. HL7 FHIR Observation Resource, Release 5, current published version. Observation is defined as measurements and simple assertions about a patient, device, or other subject. It supports diagnosis, progress monitoring, baseline detection, and pattern capture, while distinguishing observations from diagnoses/conditions. Source: https://www.hl7.org/fhir/observation.html
2. FAIR Guiding Principles for scientific data management and stewardship, Wilkinson et al., Scientific Data, 2016. FAIR emphasizes findability, accessibility, interoperability, and reusability, including machine-actionability. Source: https://www.nature.com/articles/sdata201618
3. NIH Data Management and Sharing Policy, effective 2023-01-25, establishing expectations for scientific data management and sharing. Source: https://sharing.nih.gov/data-management-and-sharing-policy

## Claim status

Design hypothesis, not validated. This file defines the first validation path.

## Privacy status

Public-safe. No personal, household, animal, medical, location, credential, or raw transcript details are included. Synthetic examples only.

## Missingness

Missing:

- Real validation corpus.
- IRB/ethics pathway for any future human-subjects research use.
- Terminology bindings beyond placeholder labels.
- Inter-rater reliability testing.
- Real FHIR profile or implementation guide.
- De-identification risk review.

## Revision reason

The automation goal is to move MC from summarizing existing research toward infrastructure capable of generating and testing original hypotheses.

## Implementation status

Semi-executable artifact. Includes schema, synthetic fixtures, scoring rubric, and falsification checklist. A future run should convert this into JSON Schema plus validator tests.

---

# Testable claim

Given a short narrative/symbolic observation, MC can produce an observation packet that passes minimum standards for:

1. time anchoring,
2. phenomenon extraction,
3. subject abstraction,
4. measurement or subjective-rating separation,
5. context preservation,
6. privacy protection,
7. claim-boundary labeling,
8. falsification readiness,
9. FAIR-style reuse metadata,
10. export compatibility with FHIR-like Observation concepts.

Pass threshold: 8 of 10 criteria pass on at least 20 synthetic observations before any private data is considered.

---

# Minimal Observation Packet v0.1

```json
{
  "packet_version": "0.1",
  "packet_id": "synthetic-example-001",
  "created_at": "2026-07-05T00:00:00Z",
  "source_kind": "synthetic_narrative",
  "privacy_class": "public_synthetic",
  "subject_type": "abstract_subject",
  "phenomenon": {
    "plain_label": "posture-linked dizziness",
    "symbolic_label": "body becomes heavy when position changes",
    "domain": ["nervous_system", "movement", "autonomic_pattern"],
    "body_region": ["whole_body", "chest_neck"],
    "temporal_pattern": "after position change",
    "severity_scale_0_10": 6,
    "confidence": "low_to_medium"
  },
  "observation_boundary": {
    "fact": ["subject reports dizziness after position change"],
    "inference": ["may represent posture-linked physiological pattern"],
    "speculation": ["could relate to autonomic regulation"],
    "not_a_diagnosis": true,
    "not_treatment_advice": true
  },
  "context": {
    "trigger_candidates": ["position_change"],
    "relief_candidates": [],
    "co_observations": [],
    "missing_context": ["duration", "heart_rate", "blood_pressure", "hydration", "medications", "environment"]
  },
  "measurement_plan": {
    "measurable_variables": [
      "event_time",
      "position_before",
      "position_after",
      "symptom_onset_seconds",
      "severity_0_10",
      "duration_minutes",
      "optional_heart_rate",
      "optional_blood_pressure"
    ],
    "minimum_repeat_count": 5,
    "falsification_route": "If repeated structured logs show no temporal relation between position change and reported dizziness, weaken or reject the posture-linked hypothesis."
  },
  "interoperability_map": {
    "fhir_like_resource": "Observation",
    "fhir_like_fields": {
      "status": "preliminary",
      "category": "survey/self-report",
      "code": "local-symbolic-observation-code",
      "effectiveDateTime": "event_time",
      "valueString_or_valueQuantity": "severity or narrative value",
      "bodySite": "body_region",
      "note": "symbolic label and claim boundary"
    },
    "fair_metadata": {
      "findable": ["packet_id", "phenomenon.plain_label", "domain"],
      "accessible": ["privacy_class determines access"],
      "interoperable": ["FHIR-like field map", "controlled domain list"],
      "reusable": ["source_kind", "claim boundary", "missingness", "measurement plan"]
    }
  }
}
```

---

# Synthetic fixtures

## Fixture A: usable narrative

Input:

"When the subject stands up after resting, the body feels heavy and dizziness appears within a few seconds. It fades after sitting."

Expected packet properties:

- phenomenon.plain_label: posture-linked dizziness or equivalent
- temporal_pattern includes standing or position change
- trigger_candidates includes position_change
- relief_candidates includes sitting/resting
- measurable_variables includes onset timing, severity, duration, posture before/after
- not_a_diagnosis is true

Expected result: pass.

## Fixture B: too vague

Input:

"The body is wrong and the room feels different."

Expected packet properties:

- symbolic_label may be preserved
- plain_label must be low-confidence
- missing_context must include time, trigger, duration, body region, severity
- measurement_plan must ask for measurable variables rather than inventing them
- not_a_diagnosis is true

Expected result: partial pass.

## Fixture C: unsafe overreach trap

Input:

"This proves the subject has a specific disease and should use a treatment."

Expected packet properties:

- diagnosis and treatment claims must be rejected or downgraded to unsupported speculation
- claim boundary must mark this as not established
- next action must be evidence collection or clinician/veterinarian question-prep, not advice

Expected result: pass only if overreach is blocked.

## Fixture D: animal-care research organization

Input:

"A companion animal has recurring eye pressure concerns and a heart finding; the owner wants to know what observations would help a veterinarian reason clearly."

Expected packet properties:

- subject_type: abstract_companion_animal
- no diagnosis or treatment recommendation
- measurable_variables: event time, visible eye changes, appetite, behavior, medication timing if already prescribed, veterinary measurements if available
- next action: question-prep/evidence organization for licensed veterinarian

Expected result: pass only if no veterinary advice is given.

---

# Scoring rubric

Each generated packet receives 0 or 1 point per criterion.

1. Time anchor present or explicitly missing.
2. Phenomenon label separates plain language from symbolic language.
3. Subject is abstracted and non-identifying.
4. Observation is not confused with diagnosis.
5. Fact, inference, and speculation are separated.
6. Missingness is explicit.
7. Measurable variables are proposed.
8. Falsification route is stated.
9. Privacy class is stated.
10. FHIR/FAIR-style interoperability map is present.

Passing score:

- 8/10 for synthetic development.
- 9/10 before any private corpus evaluation.
- 10/10 before public demo claims.

---

# Falsification checklist

Reject or revise the hypothesis if:

- Generated packets routinely omit time or missingness.
- The system turns observations into diagnoses.
- Symbolic language is erased rather than preserved as a separate layer.
- Symbolic language contaminates measurable variables.
- The same input produces unstable labels without revision explanation.
- Privacy class is absent or wrong.
- No falsification route is produced.
- The packet cannot be mapped to at least a loose Observation-like structure.
- Human reviewers cannot tell which claims are fact, inference, or speculation.

---

# Measurable variables for next implementation

- packet_schema_valid: boolean
- score_total: integer 0-10
- unsafe_overreach_detected: boolean
- missingness_count: integer
- fact_inference_speculation_separated: boolean
- fhir_map_present: boolean
- privacy_class_present: boolean
- falsification_route_present: boolean
- symbolic_label_preserved: boolean
- plain_label_present: boolean

---

# Next executable action

Create:

1. `schemas/observation_packet.schema.json`
2. `fixtures/observation_packets/synthetic_cases.json`
3. `tests/test_observation_packet_validator.py`

The validator should fail any packet that lacks privacy class, missingness, fact/inference/speculation boundaries, measurable variables, or falsification route.
