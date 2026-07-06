# Provenance Packet Builder

Executable Mirror Cartographer component for converting bounded synthetic observations and evidence notes into auditable provenance packets.

## Cure/discovery function

This improves evidence-boundary routing, hypothesis generation, falsification readiness, animal-care evidence organization, and collaboration readiness by forcing every packet to carry explicit source status, claim status, privacy status, missingness, revision reason, implementation status, testability, and next executable action.

## Public-safe boundary

The component is designed for synthetic or deidentified public-safe data only. It rejects packets marked raw_private, contains_identifier, unknown, or unreviewed. It does not produce medical or veterinary advice.

## Interfaces

Input: JSON list of bounded observation or evidence-note objects.

Required input fields:

- id
- source_kind
- source_status
- privacy_status
- claim_text
- claim_status
- observed_variables
- evidence_refs
- missingness
- revision_reason
- next_executable_action

Output: JSON object with packet_count, ready_count, reject_count, and packet records. Ready packets route to ready_for_evidence_review. Invalid packets route to reject with errors.

## Commands

Run fixture build:

python tools/provenance_packet_builder.py tools/provenance_packet_builder_fixtures.synthetic.json --output /tmp/provenance_packets.generated.json

Run tests:

python tools/test_provenance_packet_builder.py

## Acceptance criteria

- Accepts only bounded, public-safe, non-advice packet candidates.
- Rejects private, unreviewed, diagnostic, or under-specified candidates.
- Produces deterministic packet IDs from stable source content.
- Preserves missingness and next executable action.
- Routes usable packets to evidence review before claim promotion.

## Next integration point

Connect after signal triage / open question register and before literature evidence mapping, hypothesis falsification, claim promotion, and collaborator export.
