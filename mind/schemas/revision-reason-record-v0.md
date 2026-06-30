# Revision Reason Record v0

Status: public-safe schema
Source status: derived from MC public-boundary requirements and current trust-boundary research
Claim status: implementation schema proposal
Privacy status: sanitized; contains no private source content
Missingness: not yet implemented in runtime; no validator committed in this file
Revision reason: new schema required to make future public-safe updates auditable without exposing private source paths

## Purpose

A Revision Reason Record explains why a Mirror Cartographer artifact changed while preventing reconstruction of private source material.

## Required fields

- `artifact_id`: stable public identifier
- `artifact_path`: repository path or public artifact location
- `artifact_type`: research_note | product_requirement | evaluation_scorecard | fixture_suite | schema | implementation_plan | index | force_attractor
- `created_or_revised_date`: ISO date
- `change_type`: created | updated | superseded | deprecated | narrowed | expanded | redacted | corrected
- `source_status`: public_repo | file_library_abstracted | private_context_abstracted | public_research | product_test | synthetic_fixture | missing_source
- `claim_status`: design_hypothesis | product_requirement | evaluation_criterion | research_question | measured_result | blocked_claim | superseded_claim
- `privacy_status`: public_safe | abstracted_from_private | needs_redaction_review | blocked_from_publication | synthetic_only
- `missingness_status`: complete_for_scope | incomplete_archive | no_runtime_test | no_external_review | no_telemetry | stale_source | unknown
- `revision_reason`: evidence_correction | scope_correction | privacy_correction | safety_correction | product_correction | terminology_correction | missingness_correction | supersession
- `source_boundary_note`: public-safe description of what source class was used, not raw content
- `blocked_public_details`: categories excluded from publication
- `depends_on`: optional list of public artifact ids or paths
- `supersedes`: optional list of public artifact ids or paths
- `review_required`: none | privacy | safety | evidence | implementation | external

## Non-storable fields

The record must not store:

- raw transcripts
- private names or household details
- health, animal-care, financial, location, relationship, credential, account, or secret details
- screenshots with secrets or account surfaces
- exact private source phrases that would make the source reconstructable
- private emotional episodes as public proof

## JSON shape

```json
{
  "artifact_id": "revision-reason-ledger-2026-06-30",
  "artifact_path": "mind/research/2026-06-30-revision-reason-ledger.md",
  "artifact_type": "research_note",
  "created_or_revised_date": "2026-06-30",
  "change_type": "created",
  "source_status": "file_library_abstracted + public_repo + public_research",
  "claim_status": "design_hypothesis",
  "privacy_status": "public_safe",
  "missingness_status": "no_runtime_test",
  "revision_reason": "missingness_correction",
  "source_boundary_note": "Uses private/file context only to identify architecture pressure; publishes no private source content.",
  "blocked_public_details": [
    "raw transcript details",
    "personal or household details",
    "health or animal-care details",
    "financial, location, relationship, credential, account, or secret details"
  ],
  "depends_on": [
    "README.md",
    "prior boundary-stack and claim-routing artifacts"
  ],
  "supersedes": [],
  "review_required": "privacy"
}
```

## Validation rule

A revision reason record passes only when the revision can be understood without exposing or implying the private source path.
