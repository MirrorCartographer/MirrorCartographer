# Read-Aloud Artifact Linter

Executable component for Mirror Cartographer.

Purpose: enforce accessibility for MC build artifacts so critical implementation details are not trapped inside code fences, tables, screenshots, or unlabeled blobs that read-aloud tools may skip or flatten.

This supports cure/discovery infrastructure by making longitudinal tracking, evidence boundaries, hypotheses, falsification tasks, animal-care evidence, and collaborator handoffs auditable through speech output as well as visual reading.

This is not medical or veterinary advice. It is an accessibility and collaboration-readiness gate.

## Input shape

A JSON file containing either a list of artifact packets or an object with `artifacts`.

Required fields per artifact:

- `artifact_id`: stable string identifier.
- `artifact_type`: one of `readme`, `cli_output`, `schema`, `test_report`, `provenance_packet`, `ui_contract`, `handoff_note`.
- `source_status`: one of `assistant_generated`, `public_source`, `synthetic_fixture`, `unknown`.
- `claim_status`: one of `engineering_contract`, `research_organization`, `medical_claim`, `veterinary_claim`, `unknown`.
- `privacy_status`: one of `public_safe`, `redacted`, `contains_private_residue`, `unknown`.
- `content`: complete text content to lint.
- `critical_terms`: list of terms that must appear outside code fences.
- `revision_reason`: why this artifact exists.
- `next_action`: concrete next executable action.

## Output shape

The CLI prints JSON with:

- `accepted`: artifacts safe for read-aloud handoff.
- `needs_revision`: artifacts requiring accessible text changes.
- `blocked`: artifacts blocked for privacy or claim-boundary reasons.
- `summary`: count by route.

## Checks

Accepted artifacts must:

1. contain a plain-language purpose line outside code fences;
2. expose critical terms outside code fences;
3. avoid code-fence-only deliverables;
4. avoid table-only status reporting;
5. include source, claim, privacy, missingness, revision reason, implementation status, testability, and next executable action labels in normal prose;
6. avoid private residue and medical/veterinary cure claims.

## CLI

Run:

`python tools/read_aloud_artifact_linter/lint_read_aloud_artifacts.py tools/read_aloud_artifact_linter/fixtures.synthetic.json`

## Tests

Run:

`python tools/read_aloud_artifact_linter/test_lint_read_aloud_artifacts.py`

## Public-safety note

Fixtures are synthetic and public-safe.
