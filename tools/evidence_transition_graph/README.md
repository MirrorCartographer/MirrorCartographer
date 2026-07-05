# Evidence Transition Graph Validator

Source status: assistant-generated public-safe implementation specification.
Claim status: executable discovery-infrastructure component; not a biomedical or veterinary claim.
Privacy status: public-safe abstractions only; no personal, household, clinical, animal, financial, location, relationship, credential, or raw transcript details.
Missingness: Python validator and synthetic fixture file are the next commits; this file defines the exact validation contract.
Revision reason: move MC's Evidence Transition Graph from a passive mechanistic model into an executable gate that can reject illegal evidence-state transitions.
Implementation status: implementation-ready component contract committed.
Testability: high; the validator can be tested with valid supported, valid contradicted, invalid support-without-test, and invalid missing-provenance fixtures.
Falsification route: if real public-safe discovery workflows need transitions that this state model rejects, add those transitions explicitly and update the tests rather than bypassing the gate.
Next executable action: add `validate_transition_graph.py`, `transition_fixtures.synthetic.json`, and `test_validate_transition_graph.py`.

## Weakest rung selected

Rung 6: evaluation/test harness.

MC already has hypothesis, prioritization, boundary, contradiction, and progressive-disclosure components. The weak point is automatic validation of evidence state transitions: a claim should not become `Supported` just because language sounds convincing.

## Component purpose

Reject discovery records that illegally promote claims across evidence states.

The validator must preserve the core invariant:

> Support requires a test-result transition with provenance, measurable variables, and a falsification route.

## Allowed states

- `Observation`
- `Candidate Hypothesis`
- `Mechanistic Model`
- `Prediction`
- `Test Result`
- `Supported`
- `Contradicted`
- `Inconclusive`

## Allowed transitions

- `Observation` -> `Candidate Hypothesis`
- `Candidate Hypothesis` -> `Mechanistic Model`
- `Candidate Hypothesis` -> `Prediction`
- `Candidate Hypothesis` -> `Inconclusive`
- `Mechanistic Model` -> `Prediction`
- `Prediction` -> `Test Result`
- `Test Result` -> `Supported`
- `Test Result` -> `Contradicted`
- `Test Result` -> `Inconclusive`
- `Inconclusive` -> `Candidate Hypothesis`
- `Inconclusive` -> `Mechanistic Model`
- `Inconclusive` -> `Prediction`

## Required transition fields

Each transition must contain:

- `from_state`
- `to_state`
- `source_status`
- `claim_status`
- `privacy_status`
- `evidence_strength`
- `measurable_variables`
- `falsification_route`
- `timestamp`
- `provenance`

`measurable_variables` must be a non-empty list.

`falsification_route` must be a non-empty string.

`provenance` must identify at least one artifact, source packet, fixture id, or trace id.

## Hard rejection rules

1. Reject any transition not listed in `Allowed transitions`.
2. Reject any transition missing required metadata.
3. Reject `Supported` unless at least one earlier or current transition enters `Test Result`.
4. Reject `Supported` when `evidence_strength` is `weak`.
5. Reject private or raw-source packets from public discovery memory.
6. Reject terminal claims that erase contradiction history.
7. Reject empty measurable-variable lists.
8. Reject empty falsification routes.

## Input interface

The validator should accept a JSON file shaped as:

```json
{
  "schema_version": "1.0",
  "records": [
    {
      "id": "example_record",
      "expected_valid": true,
      "transitions": [
        {
          "from_state": "Observation",
          "to_state": "Candidate Hypothesis",
          "source_status": "synthetic",
          "claim_status": "hypothesis_candidate",
          "privacy_status": "public_safe",
          "evidence_strength": "weak",
          "measurable_variables": [
            {"name": "signal_recurrence", "unit": "count", "expected_direction": "increase"}
          ],
          "falsification_route": "If recurrence is absent in repeated synthetic records, do not promote.",
          "timestamp": "2026-07-05T20:50:00Z",
          "provenance": {"artifact": "synthetic_fixture", "trace_id": "etg-001"}
        }
      ]
    }
  ]
}
```

## Output interface

The validator should emit JSON:

```json
{
  "ok": false,
  "record_results": [
    {
      "id": "example_record",
      "valid": false,
      "errors": ["Supported reached without Test Result"]
    }
  ]
}
```

Exit code rules:

- `0` when all records match `expected_valid` or when all records are valid in normal validation mode.
- `1` when validation fails or expected fixture outcomes are not matched.

## Required synthetic test cases

1. Valid supported path: `Observation -> Candidate Hypothesis -> Prediction -> Test Result -> Supported`.
2. Valid contradicted path: `Observation -> Candidate Hypothesis -> Prediction -> Test Result -> Contradicted`.
3. Invalid promotion: `Observation -> Candidate Hypothesis -> Prediction -> Supported`.
4. Invalid missing provenance: any transition with no `provenance` object.
5. Invalid weak support: `Test Result -> Supported` with `evidence_strength: weak`.
6. Valid inconclusive loop: `Test Result -> Inconclusive -> Prediction`.

## Acceptance criteria

- A claim cannot be promoted to `Supported` without a test-result path.
- Contradicted claims remain representable and do not disappear from memory.
- Inconclusive claims can re-enter hypothesis or prediction work without pretending to be supported.
- Every transition preserves provenance and falsification metadata.
- The validator is deterministic on synthetic fixtures.

## Cure/discovery relevance

Breakthrough infrastructure fails when plausible language outruns evidence. This component makes MC treat evidence transitions as a state machine instead of a vibe: observations can become hypotheses, hypotheses can become predictions, predictions can generate test results, and only test results can support or contradict a claim.
