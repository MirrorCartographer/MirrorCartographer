# Contradiction Ledger Evaluator

Public-safe executable component for Mirror Cartographer.

## Purpose

Mirror Cartographer needs a strict way to prevent repeated observations, symbolic interpretations, literature notes, or animal-care records from becoming discovery claims when there is unresolved contradictory evidence.

This component evaluates public-safe contradiction ledger packets and routes each packet into one of four queues:

- `ready_for_falsification`: contradiction is bounded, measurable, sourced, and has a testable next action.
- `needs_evidence`: contradiction is plausible but lacks source coverage, measurement detail, or comparison design.
- `needs_normalization`: contradiction contains vague constructs, mixed domains, or unclear variable definitions.
- `blocked_public_export`: packet contains private residue, advice leakage, cure certainty, direct identifiers, or unsafe claim framing.

## Cure / discovery connection

Discovery requires contradiction handling. A cure-oriented system cannot only collect confirming signals. It must preserve disconfirming observations, route them into falsification, and block premature certainty. This component makes contradiction review executable before claim promotion.

## Input shape

A JSON file containing an array of packets:

```json
[
  {
    "id": "contradiction.synthetic.001",
    "domain": "human_pattern|animal_care|literature|system_eval",
    "claim_under_review": "public-safe claim text",
    "supporting_signal": "bounded signal text",
    "contradicting_signal": "bounded contradiction text",
    "measurable_variables": ["variable_a", "variable_b"],
    "source_refs": ["synthetic_fixture:001"],
    "comparison_design": "within-subject|between-source|time-window|negative-control|other",
    "falsification_action": "specific next test/review action",
    "privacy_status": "public_safe|contains_private_residue",
    "claim_status": "hypothesis|observation|advice|cure_claim|uncertain",
    "missingness": ["none"]
  }
]
```

## CLI

Run:

`python tools/contradiction_ledger_evaluator/evaluate_contradiction_ledger.py tools/contradiction_ledger_evaluator/fixtures.synthetic.json`

Optional JSON output:

`python tools/contradiction_ledger_evaluator/evaluate_contradiction_ledger.py tools/contradiction_ledger_evaluator/fixtures.synthetic.json --json`

## Acceptance criteria

A packet is routed to `ready_for_falsification` only if it has:

1. Public-safe privacy status.
2. Non-advice, non-cure claim status.
3. A claim under review, supporting signal, and contradicting signal.
4. At least two measurable variables.
5. At least one source reference.
6. A comparison design.
7. A concrete falsification action.
8. No direct identifier pattern or unsafe advice/cure wording.

## Test cases

The test harness verifies:

- A well-formed contradiction packet routes to `ready_for_falsification`.
- Missing variables route to `needs_normalization` or `needs_evidence`.
- Missing sources route to `needs_evidence`.
- Advice/cure/private-residue packets route to `blocked_public_export`.
- CLI JSON output is parseable and contains counts plus per-packet routing.

## Public-safety note

All fixtures are synthetic. This tool performs research organization only. It is not medical or veterinary advice.
