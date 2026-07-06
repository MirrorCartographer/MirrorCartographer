# Research Claim Boundary Normalizer

Executable Mirror Cartographer component for turning public scientific, medical, veterinary, mechanistic-biology, AI, HCI, or privacy-memory notes into bounded claim packets.

## Purpose

Mirror Cartographer should not ingest a paper, abstract, benchmark result, institution page, open-source tool note, or model output as a usable discovery claim until the claim is normalized into:

- source status
- claim status
- privacy status
- measurable variables
- evidence strength
- missingness
- falsification route
- prohibited advice/cure-overclaim flags
- next executable action

This component is research organization only. It does not provide medical or veterinary advice.

## Input shape

A JSON file containing either a single packet object or a list of packet objects.

Required packet fields:

- `packet_id`: stable public-safe ID
- `domain`: one of `human_health_research`, `animal_health_research`, `mechanistic_biology`, `neuroscience`, `scientific_ai`, `hci`, `privacy_memory`, `hypothesis_systems`
- `source_status`: one of `primary_source`, `clinical_institution`, `preprint_caveated`, `benchmark_dataset`, `open_source_tool`, `secondary_summary`, `synthetic_fixture`
- `claim_status`: one of `observation`, `hypothesis`, `association`, `mechanistic_claim`, `benchmark_result`, `prototype_requirement`
- `privacy_status`: must be `public_safe`
- `source_refs`: non-empty list of public-safe references or fixture IDs
- `claim_text`: bounded claim text
- `measurable_variables`: non-empty list of variable names
- `missingness`: list of missing details, may be empty only when `evidence_strength` is `strong`
- `evidence_strength`: one of `weak`, `moderate`, `strong`
- `falsification_route`: concrete test, dataset check, replication route, or contradiction query
- `next_executable_action`: concrete implementation/research action
- `advice_boundary`: must be `research_organization_only`
- `contains_personal_data`: must be false
- `contains_cure_claim`: must be false

Optional fields:

- `revision_reason`
- `notes`

## CLI

Run:

`python tools/research_claim_boundary_normalizer/normalize_research_claim_packets.py tools/research_claim_boundary_normalizer/fixtures.synthetic.json`

The CLI prints normalized routing records and exits non-zero if any packet is blocked.

## Acceptance criteria

A packet passes only when:

1. it is public-safe;
2. it has at least one source reference;
3. it does not contain personal data;
4. it does not make cure/advice claims;
5. it has measurable variables;
6. it has a falsification route;
7. it has a next executable action;
8. weak evidence preserves missingness;
9. preprints are caveated through source status or missingness.

## Cure/discovery tie

This normalizer improves MC's cure/discovery ambition by preventing raw enthusiasm, generic summaries, or advice leakage from entering research memory. It converts frontier material into testable, falsifiable, privacy-safe work units.