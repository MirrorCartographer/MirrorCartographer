# Longitudinal Window Validator

Executable Mirror Cartographer component for validating public-safe longitudinal observation windows before pattern tracking, hypothesis generation, or evidence review.

## Purpose

The component prevents a single observation or sparse synthetic timeline from being promoted into a pattern. It checks whether a longitudinal packet has enough dated observations, baseline context, missingness labels, privacy status, measurement units, and falsification-ready comparison windows.

This supports the cure/discovery ambition by making repeated observations auditable without turning them into medical, veterinary, or scientific claims prematurely.

## Public-safety boundary

Use synthetic or deidentified packets only. Do not include names, exact addresses, account identifiers, medical record numbers, private notes, raw messages, or clinician/veterinarian instructions.

This tool is for research organization and engineering validation only. It is not medical or veterinary advice.

## Input shape

JSON array of packets:

```json
[
  {
    "packet_id": "lw-001",
    "domain": "animal_care",
    "claim_status": "observation_window",
    "privacy_status": "synthetic_public_safe",
    "source_status": "synthetic_fixture",
    "revision_reason": "test longitudinal signal readiness",
    "subject_scope": "single_deidentified_subject",
    "variable": "resting_behavior_minutes",
    "unit": "minutes",
    "expected_direction": "decrease",
    "baseline_window": {
      "start_date": "2026-01-01",
      "end_date": "2026-01-07",
      "observation_count": 7
    },
    "comparison_window": {
      "start_date": "2026-01-08",
      "end_date": "2026-01-14",
      "observation_count": 7
    },
    "missingness": {
      "status": "explicit",
      "missing_count": 0,
      "reason": "none"
    },
    "observations": [
      {"date": "2026-01-01", "value": 42, "source_kind": "owner_log"}
    ],
    "falsification_route": "compare baseline median against comparison median after excluding missing entries",
    "next_executable_action": "send to signal triage matrix"
  }
]
```

## Validation rules

A packet passes only when:

1. Required labels are present: source status, claim status, privacy status, missingness, revision reason, implementation status, testability, and next executable action.
2. Privacy status is public-safe.
3. Claim status is `observation_window`, `candidate_signal`, or `needs_more_data`; not a diagnosis, cure claim, or advice claim.
4. Baseline and comparison windows have valid ISO dates and do not overlap.
5. Each window has at least three expected observations.
6. Missingness is explicit and bounded.
7. Observations have date, numeric value, source kind, and no private residue fields.
8. At least one falsification route is present.

## CLI

```bash
python tools/longitudinal_window_validator/validate_longitudinal_windows.py \
  tools/longitudinal_window_validator/fixtures.synthetic.json
```

The CLI exits with status `0` when all packets pass and `1` when any packet fails.

## Acceptance criteria

- Valid synthetic packets return `PASS`.
- Packets with cure claims, advice claims, private residue, overlapping windows, vague missingness, or insufficient observations return `FAIL`.
- Output is deterministic JSON so it can be used in CI.

## Testability

Run:

```bash
python tools/longitudinal_window_validator/test_validate_longitudinal_windows.py
```

## Next executable action

Connect this validator before signal triage, contradiction ledger evaluation, and claim promotion so longitudinal packets cannot become patterns without explicit missingness and falsification routing.
