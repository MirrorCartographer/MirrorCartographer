# Literature Evidence Mapper

Executable Mirror Cartographer component for public-safe medical/scientific literature organization.

## Purpose

The mapper converts deidentified literature-note packets into bounded evidence map entries. It does not provide medical or veterinary advice. It preserves the difference between mechanistic claim, observation, intervention, population, evidence level, contradiction, and next falsification action.

## Cure/discovery tie

Discovery work fails when papers become vibes. This component forces each literature note to state:

- what claim is being extracted;
- what population or organism it applies to;
- what measurable variables exist;
- what evidence level supports it;
- what would falsify or downgrade it;
- whether it is safe for public/collaboration memory.

## Input shape

Each packet is a JSON object with:

- `id`: stable packet id.
- `source_status`: `public_literature`, `synthetic_fixture`, or `repo_internal_note`.
- `privacy_status`: must be `public_safe` or `synthetic_public_safe`.
- `claim_text`: concise bounded claim.
- `claim_type`: `mechanism`, `association`, `intervention`, `observation`, or `diagnostic_boundary`.
- `organism_scope`: `human`, `dog`, `cat`, `multi_species`, or `general_biology`.
- `evidence_level`: `review`, `trial`, `cohort`, `case_series`, `case_report`, `mechanistic_model`, or `unknown`.
- `variables`: non-empty list of measurable variables.
- `boundary_notes`: limitations or scope restrictions.
- `contradiction_notes`: known contradiction, uncertainty, or empty string.
- `falsification_route`: concrete test, observation, or evidence class that could weaken the claim.
- `next_action`: executable next step.

## Output

The CLI emits JSON containing accepted entries, rejected entries, and routed queues:

- `map_ready`
- `needs_normalization`
- `needs_falsification`
- `blocked_privacy`
- `blocked_overclaim`

## Acceptance criteria

A packet is accepted only when it is public-safe, bounded, measurable, source-labeled, and falsifiable. Cure claims, treatment commands, private identifiers, raw transcripts, and unsupported certainty language are blocked.

## Run

`python tools/literature_evidence_mapper/map_literature_evidence.py tools/literature_evidence_mapper/fixtures.synthetic.json`

## Test

`python tools/literature_evidence_mapper/test_map_literature_evidence.py`
