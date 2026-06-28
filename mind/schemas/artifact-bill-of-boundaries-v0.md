# Artifact Bill of Boundaries Schema v0

## Purpose

A portable metadata object for public-safe Mirror Cartographer artifacts.

## Required fields

| Field | Required | Allowed values / notes |
|---|---:|---|
| artifact_id | yes | stable local identifier |
| artifact_title | yes | public-safe title |
| artifact_path | yes | repository path or planned path |
| source_status | yes | public_source, private_context_abstracted, synthetic_fixture, mixed_public_private_abstracted, unknown |
| claim_status | yes | descriptive_synthesis, architectural_proposal, implementation_requirement, research_question, evaluation_criterion, commercial_hypothesis, care_support_boundary, non_diagnostic |
| privacy_status | yes | public_safe, internal_only, blocked, requires_review |
| private_exclusion_categories | yes | categories intentionally not exposed |
| audience_contract | yes | intended audience and prohibited audiences |
| evidence_lane | yes | symbolic, operational, product, research, care_support, governance, evaluation |
| transformation_summary | yes | short description of how input became public artifact |
| viewdiff_required | yes | true / false |
| fixture_required | yes | true / false |
| oracle_required | yes | true / false |
| review_status | yes | unchecked, self_reviewed, peer_review_needed, domain_expert_needed, blocked |
| missingness | yes | known unknowns |
| revision_reason | yes | why created or changed |
| release_state | yes | private, internal_review, public_safe_draft, public_release |

## Minimal YAML shape

artifact_id: ""
artifact_title: ""
artifact_path: ""
source_status: ""
claim_status: ""
privacy_status: ""
private_exclusion_categories: []
audience_contract:
  intended: []
  excluded: []
evidence_lane: ""
transformation_summary: ""
viewdiff_required: true
fixture_required: true
oracle_required: false
review_status: ""
missingness: []
revision_reason: ""
release_state: ""

## Pass rule

An artifact cannot be marked public_release unless:

1. privacy_status is public_safe,
2. private_exclusion_categories are explicit,
3. claim_status is non-diagnostic or otherwise bounded,
4. missingness is present even if empty,
5. revision_reason is present,
6. audience_contract is present,
7. review_status is at least self_reviewed.

## Fail rule

An artifact must be blocked if it contains or reconstructs private personal, household, health, animal-care, financial, location, relationship, credential, or raw transcript detail.

## Source status

Schema derived from public-safe architecture synthesis.

## Claim status

Implementation requirement.

## Privacy status

Public-safe schema. No private content.

## Missingness

Needs implementation fixtures and automated validation.

## Revision reason

Create a reusable boundary-bill schema for every future public-safe artifact.
