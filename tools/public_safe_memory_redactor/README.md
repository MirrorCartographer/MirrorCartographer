# Public-Safe Memory Redactor

Purpose: convert Mirror Cartographer research-memory packets into public-safe records by validating that raw private residue is absent before sharing, collaborator export, or public artifact generation.

This is not a medical or veterinary diagnostic component. It is research-organization infrastructure for privacy-preserving longitudinal pattern tracking and collaboration readiness.

## Packet contract

Input is a JSON array of memory packets. Each packet must include:

- `packet_id`: stable public-safe identifier.
- `source_status`: `synthetic`, `public`, `deidentified_private_summary`, or `mixed`.
- `claim_status`: `observation`, `hypothesis`, `question`, `evidence_summary`, or `prototype_requirement`.
- `privacy_status`: `public_safe`, `needs_redaction`, or `blocked_private`.
- `missingness`: array of missing or uncertain fields.
- `revision_reason`: why the packet exists or changed.
- `implementation_status`: `draft`, `validated`, `blocked`, or `ready_for_export`.
- `testability`: concrete test path or measurable check.
- `next_executable_action`: next action that does not require private disclosure.
- `body`: public-safe summary text.
- `variables`: array of measurable variables, each with `name`, `unit_or_scale`, and `collection_mode`.
- `redaction`: object with booleans for `contains_raw_transcript`, `contains_direct_identifier`, `contains_exact_timestamp`, `contains_location_detail`, `contains_diagnosis_or_treatment_instruction`, and `contains_animal_care_advice`.

## Acceptance criteria

A packet passes only when:

1. It is explicitly marked `public_safe`.
2. It contains no raw transcript, direct identifiers, exact timestamps, location detail, diagnosis/treatment instruction, or animal-care advice.
3. It preserves research usefulness through at least one measurable variable.
4. It has a falsifiable/testable next action.
5. Its claim status remains bounded; no cure, diagnosis, or treatment claim is admitted.

## CLI

Run:

`python tools/public_safe_memory_redactor/validate_public_safe_memory_packets.py tools/public_safe_memory_redactor/fixtures.synthetic.json`

Expected result: exit code 0 and JSON output with per-packet decisions.