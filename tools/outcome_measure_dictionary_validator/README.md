# Outcome Measure Dictionary Validator

Public-safe executable component for Mirror Cartographer.

## Purpose

Mirror Cartographer needs stable, comparable outcome measures before it can do longitudinal pattern tracking, effect-window comparison, falsification, or collaborator review. This component validates a dictionary of public-safe variables and rejects measures that are vague, unbounded, non-comparable, private, or framed as advice/cure proof.

## Cure / discovery connection

A cure/discovery system cannot compare change unless the measured thing is defined consistently. This validator makes variables explicit before they enter hypothesis generation or evidence routing.

## Routes

- `accepted_measure`: measure is bounded, public-safe, comparable, and review-ready.
- `needs_operational_definition`: variable lacks a clear scale, unit, bounds, or collection method.
- `privacy_blocked`: private residue or direct identifiers are present.
- `claim_blocked`: variable framing contains advice, diagnosis, treatment, cure certainty, or overclaim language.
- `missingness_blocked`: required fields or explicit missingness labels are absent.

## Input shape

JSON file containing an array of measure definitions:

```json
[
  {
    "measure_id": "measure.synthetic.001",
    "domain": "human_pattern|animal_care|literature|system_eval",
    "label": "synthetic gait steadiness score",
    "description": "Ordinal public-safe observation of steadiness during a synthetic check.",
    "unit": "ordinal_0_5",
    "scale_min": 0,
    "scale_max": 5,
    "directionality": "higher_is_more|higher_is_less|neutral",
    "collection_method": "public-safe observer rating protocol",
    "allowed_values": [],
    "source_status": "synthetic_fixture",
    "claim_status": "measurement_definition",
    "privacy_status": "public_safe",
    "missingness": []
  }
]
```

## Output shape

```json
{
  "component": "outcome_measure_dictionary_validator",
  "summary": {
    "accepted_measure": 1,
    "needs_operational_definition": 1,
    "privacy_blocked": 1,
    "claim_blocked": 1,
    "missingness_blocked": 1
  },
  "measure_routes": [
    {
      "measure_id": "measure.synthetic.001",
      "route": "accepted_measure",
      "blockers": [],
      "missingness": [],
      "revision_reason": "Measure has bounded scale, unit, directionality, collection method, and public-safe labels.",
      "next_executable_action": "Use as an allowed variable in observation streams and effect-window comparison."
    }
  ]
}
```

## CLI

```bash
python tools/outcome_measure_dictionary_validator/validate_outcome_measure_dictionary.py \
  tools/outcome_measure_dictionary_validator/fixtures.synthetic.json
```

Optional output file:

```bash
python tools/outcome_measure_dictionary_validator/validate_outcome_measure_dictionary.py \
  tools/outcome_measure_dictionary_validator/fixtures.synthetic.json \
  --output /tmp/outcome_measure_routes.json
```

## Acceptance criteria

1. Rejects non-array input.
2. Requires explicit `missingness` on every measure.
3. Blocks non-public-safe privacy states.
4. Blocks advice, treatment, diagnosis, cure, or certainty language.
5. Requires `measure_id`, `domain`, `label`, `unit`, `directionality`, `collection_method`, `source_status`, `claim_status`, and `privacy_status`.
6. Requires either numeric `scale_min` and `scale_max` or non-empty `allowed_values`.
7. Emits deterministic JSON with route labels and revision reasons.

## Public-safety note

All fixtures are synthetic. This tool performs measurement-definition validation only. It is not medical advice, veterinary advice, diagnosis, treatment guidance, or a cure claim.
