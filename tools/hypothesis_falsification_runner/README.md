# Hypothesis Falsification Runner

Executable Mirror Cartographer component for converting research hypotheses into ranked falsification tasks before they are promoted into discovery memory.

## Purpose

Mirror Cartographer should not only collect promising cure/discovery ideas. It needs a reproducible way to ask: **what observation would make this hypothesis weaker, narrower, or false?**

This runner scores synthetic/public-safe hypothesis packets and routes them into one of five queues:

- `ready_for_test_plan`: concrete, measurable, bounded, falsifiable.
- `needs_operationalization`: interesting but missing variables, measurement, or comparison design.
- `needs_evidence`: lacks source mapping or independent support.
- `privacy_hold`: contains private/raw context or inadequate privacy boundary.
- `reject_overclaim`: contains cure/proof/certainty language without bounded evidence.

## Input contract

The CLI accepts a JSON array of packets. Each packet must include:

```json
{
  "id": "HYP-SYN-001",
  "domain": "mechanistic_biology | neuroscience | medical_ai | animal_health_research | longitudinal_health | hci | privacy_preserving_memory | scientific_ai",
  "hypothesis": "bounded public-safe hypothesis text",
  "claim_status": "hypothesis | preliminary | replicated | contradicted | overclaim",
  "source_status": "primary_source | preprint | benchmark | dataset | institution | synthetic_fixture | unsourced",
  "privacy_status": "public_safe | deidentified | private_or_raw",
  "variables": ["measurable variable name"],
  "measurement_plan": "how the variables would be measured",
  "falsification_route": "specific observation that would weaken or falsify the hypothesis",
  "comparison_design": "baseline, control, counterfactual, or negative control",
  "evidence_refs": ["stable source/ref id or synthetic fixture id"],
  "missingness": ["known gap"],
  "next_executable_action": "one concrete next action"
}
```

## Output contract

The CLI prints JSON with per-packet routing decisions:

```json
{
  "summary": {"ready_for_test_plan": 1, "needs_operationalization": 1},
  "results": [
    {
      "id": "HYP-SYN-001",
      "route": "ready_for_test_plan",
      "score": 9,
      "reasons": ["has_variables", "has_falsification_route"],
      "next_executable_action": "..."
    }
  ]
}
```

## Acceptance criteria

1. A packet with measurable variables, measurement plan, comparison design, falsification route, evidence refs, missingness, and public-safe privacy status routes to `ready_for_test_plan`.
2. A packet with symbolic or vague observations but no variables routes to `needs_operationalization`.
3. A packet with no evidence refs routes to `needs_evidence` unless a stronger blocker applies.
4. A packet marked `private_or_raw` routes to `privacy_hold`.
5. A packet with `claim_status: overclaim` or cure/proof certainty language routes to `reject_overclaim`.

## Testability

Run:

```bash
python tools/hypothesis_falsification_runner/test_route_hypothesis_falsification_packets.py
```

## Public-safety boundary

Fixtures are synthetic and do not include patient, veterinary-client, or private longitudinal data. This component organizes research hypotheses only. It does not provide medical or veterinary advice.
