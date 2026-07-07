# Observation Gap Detector

Executable Mirror Cartographer component for longitudinal pattern tracking and falsification readiness.

## Purpose

Mirror Cartographer needs to avoid treating sparse, uneven, or biased observations as stable patterns. This tool reads public-safe synthetic observation streams and emits explicit gap packets before any signal is promoted into hypothesis generation, contradiction review, or collaborator handoff.

This is research organization infrastructure only. It is not medical advice, veterinary advice, diagnosis, treatment, or proof of a cure.

## Input shape

JSON file containing an array of observation streams:

- `stream_id`: stable public-safe identifier.
- `domain`: one of `human_research`, `animal_care`, `literature`, `environment`, `behavioral`.
- `subject_class`: public-safe class label, never a direct personal identifier.
- `observations`: array of timestamped observation objects.
- `required_fields`: fields that must be present in each observation before pattern promotion.
- `minimum_observation_count`: minimum number of observations needed for candidate pattern routing.
- `maximum_gap_days`: largest acceptable gap between observations.
- `source_status`: source label.
- `privacy_status`: privacy label.
- `claim_status`: claim label.

Each observation contains:

- `observed_at`: ISO date string, `YYYY-MM-DD`.
- `values`: object of measured or categorized variables.
- `missingness`: object mapping field names to missingness reasons.

## Output shape

JSON object:

- `component`: `observation_gap_detector`.
- `summary`: aggregate counts.
- `gap_packets`: array of public-safe gap packets.

Each gap packet contains:

- `stream_id`
- `route`: `hold_for_more_data`, `repair_missing_fields`, `review_temporal_gap`, or `eligible_for_signal_triage`
- `missing_fields`
- `observation_count`
- `largest_gap_days`
- `gap_dates`
- `source_status`
- `claim_status`
- `privacy_status`
- `missingness`
- `revision_reason`
- `implementation_status`
- `testability`
- `next_executable_action`

## CLI

Run:

`python tools/observation_gap_detector/detect_observation_gaps.py tools/observation_gap_detector/fixtures.synthetic.json`

Optional output file:

`python tools/observation_gap_detector/detect_observation_gaps.py tools/observation_gap_detector/fixtures.synthetic.json --output /tmp/gap_packets.json`

## Acceptance criteria

1. Rejects non-array input.
2. Rejects direct identifiers in `subject_class`.
3. Detects missing required fields even when observations exist.
4. Detects temporal gaps larger than `maximum_gap_days`.
5. Holds streams below `minimum_observation_count`.
6. Marks sufficiently complete streams as `eligible_for_signal_triage`.
7. Emits public-safe labels for source status, claim status, privacy status, missingness, revision reason, implementation status, testability, and next executable action.

## Test

Run:

`python tools/observation_gap_detector/test_detect_observation_gaps.py`
