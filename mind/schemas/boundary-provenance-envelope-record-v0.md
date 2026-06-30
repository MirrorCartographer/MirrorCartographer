# Boundary Provenance Envelope Record v0

## Purpose
A public-safe schema for deciding whether an MC-derived reflection, index entry, research note, product requirement, or evaluation case may be exported.

## Record fields

| Field | Required | Allowed values / guidance |
|---|---:|---|
| `record_id` | yes | Stable slug or UUID. |
| `created_at` | yes | ISO date or datetime. |
| `artifact_type` | yes | reflection, index_row, evaluation_case, product_requirement, research_note, implementation_plan, public_summary. |
| `source_status` | yes | public_repo, private_context_abstracted, current_session_user_provided, generated, external_source, mixed, unknown. |
| `claim_status` | yes | symbolic, reflective_hypothesis, product_requirement, implementation_fact, evaluation_result, external_factual_claim, unsupported. |
| `privacy_status` | yes | public_safe, abstracted_private, sensitive_adjacent, private_do_not_export, redacted. |
| `domain_boundary` | yes | meaning, product, safety, implementation, research, health_adjacent, legal_financial_adjacent, mixed. |
| `evidence_boundary` | yes | Plain-language sentence naming what the source can and cannot prove. |
| `admission_decision` | yes | admit, admit_with_warning, quarantine, refuse_export, needs_more_proof. |
| `missingness` | yes | Known absent, stale, inaccessible, unverified, or inferred material. |
| `revision_reason` | yes | Why this record exists, changed, or supersedes prior material. |
| `next_verification_step` | yes | cite, inspect_repo, run_fixture, user_review, external_review, implementation_test, keep_private. |
| `redaction_notes` | yes | What was removed or abstracted, without naming private specifics. |

## Minimal JSON shape

{
  "record_id": "boundary-provenance-envelope-example",
  "created_at": "2026-06-30",
  "artifact_type": "research_note",
  "source_status": "mixed",
  "claim_status": "product_requirement",
  "privacy_status": "public_safe",
  "domain_boundary": "safety",
  "evidence_boundary": "This record supports interface requirements, not factual claims about a person or external event.",
  "admission_decision": "admit_with_warning",
  "missingness": "No production telemetry or reviewer study attached.",
  "revision_reason": "Consolidates prior source-boundary runs into one export wrapper.",
  "next_verification_step": "run_fixture",
  "redaction_notes": "Private examples were replaced with abstract boundary categories."
}

## Validation rule
A record fails if `privacy_status` is `private_do_not_export` and `admission_decision` is anything other than `refuse_export` or `quarantine`.

## Boundary law
No source is allowed to become evidence outside its lane without an explicit evidence-boundary sentence.
