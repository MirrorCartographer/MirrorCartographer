# Collaboration Readiness Contract

Executable Mirror Cartographer component for public-safe collaboration handoff.

## Purpose

Mirror Cartographer needs to separate private lived data, research hypotheses, and collaborator-facing artifacts. This component validates whether a proposed collaboration packet is safe and useful enough to share with an outside reviewer, developer, researcher, veterinarian, clinician, or funder.

It improves collaboration readiness by forcing each packet to declare:

- source status
- claim status
- privacy status
- missingness
- revision reason
- implementation status
- testability
- next executable action
- allowed collaborator role
- disallowed use
- evidence boundary
- deidentification status

This is not medical, veterinary, legal, or scientific advice. It is an engineering gate for public-safe research organization.

## Input

A JSON array of collaboration packets.

Required fields per packet:

- `packet_id`: stable public-safe identifier
- `title`: short public-safe label
- `domain`: one of `medical_research`, `animal_care_research`, `ai_systems`, `privacy_memory`, `hypothesis_testing`, `collaboration_ops`
- `source_status`: provenance summary
- `claim_status`: allowed claim boundary
- `privacy_status`: public/private/deidentified state
- `missingness`: known absent data
- `revision_reason`: why this packet exists or changed
- `implementation_status`: current build state
- `testability`: how a reviewer can test or inspect it
- `next_executable_action`: next concrete action
- `allowed_collaborator_roles`: list of allowed role labels
- `disallowed_uses`: list of prohibited interpretations/actions
- `evidence_boundary`: boundary between observation, inference, hypothesis, and advice
- `deidentification_status`: must be `synthetic`, `deidentified`, or `public_only`

## CLI

```bash
python tools/collaboration_readiness_contract/validate_collaboration_readiness_contract.py \
  tools/collaboration_readiness_contract/fixtures.synthetic.json
```

Expected behavior:

- exits `0` when all packets are collaboration-ready
- exits `1` when any packet fails
- prints JSON summary with `ready`, `blocked`, and per-packet reasons

## Acceptance criteria

A packet is ready only if:

1. No direct identifiers are present in public-facing fields.
2. Privacy status is compatible with collaborator export.
3. Claim status does not state cure, diagnosis, treatment, guaranteed discovery, or advice.
4. Missingness is explicit.
5. Testability names an executable, reviewable, or measurable check.
6. Next action is concrete and bounded.
7. At least one disallowed use is declared.
8. Evidence boundary explicitly separates observation/inference/hypothesis/advice.

## Public-safety rule

Fixtures are synthetic. This module must not contain real names, real addresses, exact private dates, patient records, veterinary records, or private transcripts.
