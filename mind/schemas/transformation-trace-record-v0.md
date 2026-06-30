# Transformation Trace Record v0

Status: public-safe schema
Privacy status: contains no private source content
Claim status: implementation schema
Revision reason: added to support safe conversion of private-context architecture pressure into public artifacts without source leakage

## Purpose

This schema records how a restricted source shaped a public-safe Mirror Cartographer artifact without exposing the restricted source itself.

## Required fields

- `trace_id`: stable identifier for this trace.
- `artifact_path`: public artifact path created or revised.
- `created_at`: ISO date.
- `source_status`: one of `public_repo`, `file_library`, `saved_context`, `private_chat_architecture`, `public_research`, `mixed`, `unknown`.
- `privacy_status`: one of `public_safe`, `restricted_source_abstracted`, `blocked`, `needs_review`.
- `claim_status`: one of `method`, `requirement`, `evaluation`, `research_question`, `implementation_plan`, `privacy_safe_index`, `missingness`, `revision_reason`.
- `source_boundary`: what must not be exposed.
- `transformation_rule`: how the source pressure became public method.
- `redaction_rule`: what was removed before publication.
- `admissible_public_output`: what the artifact is allowed to say.
- `missingness`: unavailable, partial, stale, or unverified source conditions.
- `revision_reason`: why this artifact exists or changed.
- `reviewer_question`: the question a reviewer should ask before accepting publication.

## Optional fields

- `related_artifacts`
- `fresh_research_refs`
- `blocked_details_summary`
- `supersedes`
- `superseded_by`
- `test_fixture_ids`

## Valid source-boundary examples

- `Private context may define a need class but may not be quoted.`
- `File-library chunk may support architecture shape but not exhaustive archive claims.`
- `Public repo may support product-status claims only where directly present.`
- `Fresh research may support external alignment but not private efficacy claims.`

## Invalid source-boundary examples

- `User said X in private, so publish X.`
- `Pattern repeated privately, therefore the public claim is true.`
- `A symbolic association confirms a factual diagnosis.`
- `A cited paper validates a private identity, health, financial, or household claim.`

## Minimal JSON shape

{
  "trace_id": "tt-YYYYMMDD-slug-001",
  "artifact_path": "mind/research/example.md",
  "created_at": "YYYY-MM-DD",
  "source_status": "mixed",
  "privacy_status": "restricted_source_abstracted",
  "claim_status": "method",
  "source_boundary": "Private material may shape the method but may not be exposed.",
  "transformation_rule": "Convert repeated private pressure into a general product requirement.",
  "redaction_rule": "Remove names, events, locations, health, animal-care, finances, relationships, credentials, and transcript details.",
  "admissible_public_output": "A reusable public-safe requirement or evaluation criterion.",
  "missingness": "No exhaustive private archive available.",
  "revision_reason": "Needed to make privacy-preserving public research auditable.",
  "reviewer_question": "Can the source be reconstructed from this artifact?"
}
