# Falsification Task Queue Builder

Executable Mirror Cartographer component for turning candidate hypotheses into testable falsification tasks before they can be promoted, shared, or treated as discovery evidence.

## Purpose

Mirror Cartographer needs cure/discovery ambition without premature certainty. This component accepts public-safe hypothesis packets and emits a prioritized task queue that asks: what observation, counterexample, missing datum, literature check, or collaborator review would weaken or falsify this hypothesis?

It improves:

- hypothesis generation
- falsification
- evidence-boundary routing
- collaboration readiness
- longitudinal pattern tracking

## Public-safe rule

Fixtures are synthetic. No patient, animal, household, location, clinician, account, or private identifiers are required or allowed.

## Input shape

Each packet must include:

- `hypothesis_id`: stable string identifier
- `domain`: one of `medical_literature`, `animal_care`, `longitudinal_pattern`, `system_evaluation`, `collaboration`
- `claim_text`: bounded claim text
- `claim_status`: one of `candidate`, `needs_review`, `falsification_ready`, `blocked`
- `evidence_refs`: array of public-safe source IDs or synthetic refs
- `missingness`: array describing absent evidence, measurements, dates, controls, or counterexamples
- `risk_level`: one of `low`, `medium`, `high`
- `proposed_test`: public-safe test idea or review action
- `privacy_status`: must be `public_safe_synthetic` or `public_safe_redacted`

## Output shape

The CLI emits JSON with:

- `queue`: ordered falsification tasks
- `blocked`: packets that cannot be queued safely
- `summary`: counts by route and risk

Each task includes:

- `task_id`
- `hypothesis_id`
- `route`
- `priority`
- `falsification_question`
- `required_inputs`
- `stop_condition`
- `review_required`

## Run

```bash
python tools/falsification_task_queue_builder/build_falsification_task_queue.py \
  tools/falsification_task_queue_builder/fixtures.synthetic.json
```

## Test

```bash
python tools/falsification_task_queue_builder/test_build_falsification_task_queue.py
```

## Acceptance criteria

1. Blocks packets with unsafe privacy status.
2. Blocks packets with no missingness and no proposed falsification test.
3. Prioritizes high-risk medical or animal-care claims above low-risk system claims.
4. Requires review for high-risk domains.
5. Emits deterministic JSON for regression testing.

## Claim boundary

This is not medical or veterinary advice. It is a falsification-routing gate for research memory and collaborator handoff.
