# Signal Triage Matrix

Executable Mirror Cartographer component for routing candidate signals before they become hypotheses, advice, collaborator claims, or public memory.

## Purpose

Discovery systems fail when repeated observations are treated as patterns too early. The Signal Triage Matrix forces every candidate signal to carry boundary labels, measurable variables, missingness, evidence references, a false-pattern risk rating, a falsification route, and a next executable action.

This supports the cure/discovery ambition by improving longitudinal pattern tracking while blocking premature cure claims, medical/veterinary advice leakage, and private residue.

## Input shape

JSON object with a `packets` array:

```json
{
  "packets": [
    {
      "packet_id": "stm_synthetic_001",
      "domain": "longitudinal_pattern_tracking",
      "signal_label": "posture_eye_strain_timing",
      "observation_summary": "Synthetic weekly logs show eye-strain score rising near posture-score changes, but screen exposure is not controlled.",
      "source_status": "synthetic_fixture",
      "claim_status": "candidate_signal_not_conclusion",
      "privacy_status": "public_safe_synthetic",
      "missingness": ["screen_exposure_minutes"],
      "variables": ["eye_strain_score", "posture_score"],
      "evidence_refs": ["synthetic_weekly_log_a"],
      "risk_of_false_pattern": "high",
      "triage_route": "hold_for_controls",
      "falsification_route": "Compare against matched control windows.",
      "next_executable_action": "Generate paired control fixtures before hypothesis promotion."
    }
  ]
}
```

## Usage

```bash
python tools/signal_triage_matrix/triage_signal_packets.py tools/signal_triage_matrix/fixtures.synthetic.json
```

Expected result: prints a JSON summary and exits with status code `0` when every packet passes validation.

## Test

```bash
python tools/signal_triage_matrix/test_triage_signal_packets.py
```

## Acceptance criteria

A packet passes only when it:

1. includes all required boundary labels,
2. uses an allowed Mirror Cartographer domain,
3. has a public-safe or synthetic privacy status,
4. contains at least one missingness item,
5. contains at least two measurable variables,
6. contains at least one evidence reference,
7. uses an allowed triage route,
8. includes a falsification route,
9. includes an implementation-ready next executable action,
10. avoids direct advice, diagnostic language, cure certainty, and proof overclaims.

## Allowed triage routes

- `hold_for_controls`
- `route_to_animal_evidence_router`
- `route_to_literature_mapper`
- `route_to_falsification_runner`
- `export_as_uncertainty_only`
- `block_promotion`
- `candidate_for_hypothesis_generation`

## Public-safety constraints

This component uses synthetic fixtures only. It does not provide medical or veterinary advice. It is a routing validator for research-memory hygiene, not a treatment system.
