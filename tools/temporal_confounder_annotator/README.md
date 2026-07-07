# Temporal Confounder Annotator

Executable Mirror Cartographer component for longitudinal pattern tracking and falsification readiness.

## Purpose

Repeated observations can look like a meaningful pattern when they are actually explained by travel, heat, medication changes, sleep disruption, stress, environment, measurement inconsistency, or missing baseline data. This component annotates synthetic longitudinal observation packets with potential temporal confounders before they are allowed to seed hypotheses or discovery claims.

It improves:

- longitudinal pattern tracking
- hypothesis generation
- falsification routing
- medical/scientific evidence organization
- animal-care evidence organization

This is not medical or veterinary advice. It is a public-safe research-organization gate.

## Executable interface

```bash
python tools/temporal_confounder_annotator/annotate_temporal_confounders.py \
  tools/temporal_confounder_annotator/fixtures.synthetic.json
```

Machine-readable output:

```bash
python tools/temporal_confounder_annotator/annotate_temporal_confounders.py \
  tools/temporal_confounder_annotator/fixtures.synthetic.json \
  --json
```

Regression test:

```bash
python tools/temporal_confounder_annotator/test_annotate_temporal_confounders.py
```

## Input shape

Each observation packet contains:

- `id`: stable packet identifier
- `domain`: `human_health`, `animal_care`, `environment`, or `general_research`
- `source_status`: source category
- `claim_status`: current claim stage
- `privacy_status`: public-safe state
- `observations`: list of dated observations
- `context_events`: list of dated contextual events
- `missingness`: explicit missingness list
- `expected_route`: synthetic fixture oracle for tests

Observation fields:

- `date`: ISO date
- `signal`: public-safe signal label
- `severity`: integer 0-10 or null
- `measurement_method`: public-safe measurement label

Context event fields:

- `date`: ISO date
- `event_type`: e.g. `travel`, `heat`, `medication_change`, `sleep_disruption`, `environment_change`, `measurement_change`
- `description`: public-safe description

## Output shape

The CLI emits packet decisions with confounder annotations:

- `allow_pattern_scan`: enough data and no major unresolved confounders
- `needs_review`: plausible pattern but confounders or missingness must be handled
- `block_pattern_claim`: insufficient observations, direct cure/advice claim, or unsafe privacy state

## Acceptance criteria

- Flags observations occurring near contextual events.
- Blocks pattern claims when fewer than three dated observations exist.
- Requires explicit missingness.
- Flags measurement-method changes as confounders.
- Blocks cure/advice claim statuses.
- Produces deterministic JSON output.

## Labels

- Source status: assistant-generated public-safe synthetic implementation.
- Claim status: executable longitudinal confounder gate, not a biomedical claim.
- Privacy status: synthetic/public-safe only.
- Missingness: explicit missingness required and routed.
- Revision reason: previous longitudinal gates detected gaps; this component annotates possible context-driven false patterns.
- Implementation status: README, fixtures, CLI annotator, and tests committed.
- Testability: run the regression test script or CLI against fixtures.
- Next executable action: connect this after observation gap detection and before signal triage, hypothesis generation, and contradiction ledger evaluation.
