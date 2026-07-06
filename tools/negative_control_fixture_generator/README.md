# Negative Control Fixture Generator

Mirror Cartographer discovery work needs supportive observations, but it also needs deliberate non-matches and counterexamples. This component generates public-safe synthetic negative-control packets for hypothesis testing.

## Purpose

The generator turns bounded hypothesis specs into synthetic fixtures that should *not* satisfy the hypothesis. These controls are used to test whether MC promotion, evidence review, and falsification gates are over-permissive.

## Input shape

A JSON file with this shape:

```json
{
  "hypotheses": [
    {
      "hypothesis_id": "H-SYN-001",
      "domain": "animal_care",
      "claim": "Synthetic claim text only.",
      "required_variables": ["signal_a", "signal_b"],
      "support_pattern": {
        "signal_a": "present",
        "signal_b": "increased"
      },
      "privacy_status": "synthetic_public_safe",
      "claim_status": "research_organization_only"
    }
  ]
}
```

## Output shape

A JSON array of generated packets. Each packet includes:

- `control_id`
- `hypothesis_id`
- `control_type`
- `domain`
- `observed_variables`
- `expected_route`
- `reason`
- `source_status`
- `claim_status`
- `privacy_status`
- `testability`

## Acceptance criteria

1. Generator rejects non-synthetic or private inputs.
2. Every generated control is public-safe and deidentified.
3. At least three control types are generated per hypothesis: missing variable, inverted signal, and unrelated-domain distractor.
4. Controls must route to `falsification_or_reject`, not promotion.
5. Tests execute without third-party dependencies.

## Run

```bash
python tools/negative_control_fixture_generator/generate_negative_controls.py \
  tools/negative_control_fixture_generator/hypotheses.synthetic.json
```

## Test

```bash
python tools/negative_control_fixture_generator/test_generate_negative_controls.py
```
