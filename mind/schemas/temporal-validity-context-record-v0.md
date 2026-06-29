# TemporalValidityContextRecord v0

## Purpose

A public-safe record format for tracking whether context is allowed to influence a Mirror Cartographer artifact now.

## Source status

Architecture schema. Derived from public-safe MC requirements, File Library implementation packets, public GitHub README boundaries, and current AI-memory research. No private source details are embedded.

## Claim status

Proposed schema. Not yet implemented in production.

## Privacy status

Public-safe. Abstract method only.

## Record fields

| Field | Required | Meaning |
|---|---:|---|
| `record_id` | yes | Stable identifier for this temporal-validity decision. |
| `context_id` | yes | Identifier for the source item, memory, trajectory node, artifact, or requirement. |
| `source_boundary_class` | yes | Public, private, mixed, external, generated, inferred, or unknown. |
| `source_status` | yes | Direct source, indirect source, user-confirmed, model-inferred, external-cited, or unknown. |
| `claim_status` | yes | Fact, inference, symbolic interpretation, speculation, requirement, question, or rejected claim. |
| `privacy_status` | yes | Public-safe, private-source/abstractable, blocked, needs review, or unknown. |
| `first_seen_at` | recommended | When the context first entered the system. |
| `last_confirmed_at` | recommended | Last explicit confirmation or validation. |
| `expires_at` | optional | Explicit expiration date if known. |
| `superseded_by` | optional | Newer context item or record that replaces this one. |
| `contradicted_by` | optional | Context item that conflicts without fully replacing it. |
| `temporal_validity_status` | yes | Current, historical, superseded, contested, unknown_age, retired_private. |
| `allowed_use_now` | yes | None, lineage_only, interpretation_only, current_output, release_candidate. |
| `revision_reason` | yes | Why this status was assigned or changed. |
| `missingness_note` | yes | What is unknown, unavailable, or not yet verified. |
| `contestability_path` | recommended | How a user, reviewer, or maintainer can challenge the record. |

## Allowed temporal validity statuses

- `current`: acceptable for present interpretation or product behavior.
- `historical`: useful for lineage, but not current authority.
- `superseded`: replaced by newer source or correction.
- `contested`: conflicting signals remain unresolved.
- `unknown_age`: source exists but time validity cannot be determined.
- `retired_private`: should not influence public artifact generation except as redaction lineage.

## Required labels on outputs influenced by this record

Every output influenced by temporal context should surface:

- source status
- claim status
- privacy status
- missingness
- revision reason when context has been changed, retired, or superseded

## Non-goals

This schema does not expose raw transcripts, personal records, medical/veterinary details, location data, relationship details, financial data, or credentials. It also does not determine objective truth; it determines whether a context item is eligible to shape an output.

## Boundary phrase

**A remembered signal must carry its timestamp into the mirror.**
