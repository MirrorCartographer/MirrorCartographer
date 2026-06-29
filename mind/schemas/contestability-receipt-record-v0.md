# ContestabilityReceiptRecord v0

## Purpose

A public-safe schema for making Mirror Cartographer claims correctable after generation, export, or release without exposing private source material.

## Privacy status

Public-safe schema. Contains no private examples.

## Record fields

| Field | Required | Type | Notes |
|---|---:|---|---|
| `receipt_id` | yes | string | Stable identifier. |
| `artifact_id` | yes | string | Public-safe artifact identifier. |
| `claim_id` | yes | string | Stable claim identifier. |
| `claim_summary_public` | yes | string | Short public-safe summary; no private source detail. |
| `claim_mode` | yes | enum | `fact`, `inference`, `symbolic_interpretation`, `speculation`, `product_requirement`, `research_question`, `evaluation_criterion`, `implementation_plan`. |
| `source_status` | yes | enum | `public_repo`, `file_library_public_safe`, `private_context_informed`, `external_research`, `synthetic_fixture`, `unknown_or_unindexed`. |
| `source_boundary_class` | yes | enum | `public`, `public_safe_abstraction`, `private_influence_no_disclosure`, `external_citable`, `synthetic`. |
| `privacy_status` | yes | enum | `public_safe`, `needs_redaction`, `blocked_private`, `unknown_recheck_required`. |
| `claim_status` | yes | enum | `confirmed`, `bounded_inference`, `hypothesis`, `design_proposal`, `contested`, `superseded`, `retired`, `blocked`. |
| `release_status` | yes | enum | `draft`, `reviewable`, `public_safe`, `released`, `retired`, `blocked`. |
| `challenge_allowed` | yes | boolean | False only for malformed/private-only records that cannot be public-reviewed. |
| `allowed_challenge_types` | yes | list | See below. |
| `challenge_channel` | yes | enum | `repo_issue`, `private_review`, `artifact_revision`, `maintainer_note`, `not_publicly_challengeable_private_route`. |
| `required_reviewer_action` | yes | enum | `preserve`, `clarify`, `downgrade`, `split`, `redact`, `retire`, `supersede`, `delete_public_copy`, `escalate_private_review`. |
| `missingness_note` | yes | string | What is unknown, unavailable, unindexed, or not checked. |
| `revision_reason` | yes | string | Why the receipt or claim changed. |
| `privacy_recheck_result` | yes | enum | `passed`, `failed`, `not_checked`, `requires_private_route`. |
| `last_reviewed_at` | yes | string | ISO date or version marker. |

## Allowed challenge types

- `incorrect`
- `overstrong`
- `under_sourced`
- `stale`
- `privacy_risk`
- `wrong_mode_label`
- `symbolic_overreach`
- `authority_overreach`
- `missing_context`
- `accessibility_issue`
- `public_language_too_private`
- `duplicate_or_superseded`

## Minimal valid record

- Must include source status, claim status, privacy status, missingness, and revision reason.
- Must not include raw transcript excerpts or private-source quotations.
- Must make correction possible even when the source cannot be public.

## Revision reason

Created to support durable correction, review, and claim downgrading after MC artifacts are generated or released.
