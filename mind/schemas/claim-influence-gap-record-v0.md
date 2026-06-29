# ClaimInfluenceGapRecord v0

## Purpose
A public-safe schema for showing which kinds of context shaped each released Mirror Cartographer claim without exposing protected sources.

## Record fields

| Field | Type | Required | Public-safe rule |
| --- | --- | --- | --- |
| record_id | string | yes | Use non-identifying slug. |
| artifact_id | string | yes | Public artifact path or title only. |
| claim_text | string | yes | Must be public-safe and non-identifying. |
| claim_mode | enum | yes | fact, inference, symbolic_interpretation, speculation, product_requirement, research_question, evaluation_criterion, implementation_plan. |
| source_status | enum[] | yes | public_web, file_library_partial, github_public, github_private_metadata, private_context_abstracted, model_synthesis. |
| influence_status | enum | yes | direct_support, compression, abstraction, analogy, synthesis, weak_influence, unknown_influence. |
| citation_status | enum | yes | cited_publicly, cited_file, uncited_private_boundary, uncited_synthesis, unavailable. |
| privacy_status | enum | yes | public_safe, private_source_abstracted, blocked_sensitive, release_not_allowed. |
| transformation_route | enum[] | yes | quote, paraphrase, compression, abstraction, claim_split, boundary_labeling, product_translation, evaluation_translation. |
| evidence_boundary | string | yes | Plain statement of what the source can and cannot prove. |
| missingness | string | yes | Known gaps, unavailable materials, or uncertainty. |
| revision_reason | string | yes | Why the record or claim changed. |
| release_decision | enum | yes | release, hold, revise, reject. |
| reviewer_notes | string | no | Public-safe notes only. |

## Validation rules
1. A private source may influence the claim only through abstraction, compression, or product/evaluation translation.
2. A private source must never appear in claim_text, reviewer_notes, or any public citation field.
3. If source_status includes private_context_abstracted, privacy_status must be private_source_abstracted or blocked_sensitive.
4. If influence_status is unknown_influence, release_decision must be hold or revise unless the claim is explicitly labeled as speculation.
5. If claim_mode is fact, source_status must include public_web, file_library_partial, or github_public.
6. Symbolic interpretation and speculation cannot be promoted into fact without a revision reason and stronger evidence boundary.
7. Missingness is mandatory even when the record passes.

## Minimal example

| Field | Example |
| --- | --- |
| claim_text | MC should preserve contradiction rather than erase it. |
| claim_mode | product_requirement |
| source_status | file_library_partial, model_synthesis |
| influence_status | synthesis |
| citation_status | cited_file |
| privacy_status | public_safe |
| transformation_route | abstraction, product_translation |
| evidence_boundary | Existing MC materials support the design requirement; they do not prove product efficacy. |
| missingness | No live app telemetry reviewed. |
| revision_reason | Converted architectural theme into testable product rule. |
| release_decision | release |

## Key phrase
Do not just ask whether a source is cited. Ask whether the claim can explain how it was shaped.
