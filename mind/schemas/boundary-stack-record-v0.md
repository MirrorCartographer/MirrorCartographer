# Boundary Stack Record v0

Machine-readable record shape for public-safe MC artifacts that depend on private or mixed-context understanding.

## Required fields

- `record_type`: `boundary_stack_record`
- `record_version`: `0`
- `artifact_id`: stable identifier for the artifact being evaluated
- `boundary_stack_version`: current stack version string
- `source_status`: one of `public_repo`, `file_library_public_safe`, `private_context_abstracted`, `external_research`, `mixed`, `unknown`
- `claim_status`: one of `supported`, `partially_supported`, `design_inference`, `research_question`, `speculative`, `blocked`
- `privacy_status`: one of `public_safe`, `private_context_used_for_architecture_only`, `redacted`, `quarantined`, `blocked`
- `temporal_status`: one of `current`, `historical`, `superseded`, `contested`, `unknown_age`, `not_applicable`
- `release_scope`: one of `research_note`, `schema`, `product_requirement`, `evaluation`, `fixture`, `implementation_plan`, `public_index`, `blocked`
- `missingness`: list of known gaps
- `revision_reason`: reason this artifact exists or changed
- `gate_results`: ordered list of gate result objects
- `contestability_path`: how a reader or evaluator can challenge the claim
- `public_claim`: the publishable claim after private details are excluded

## Gate result object

Each `gate_results` entry should include:

- `gate_name`
- `verdict`: `pass`, `pass_with_label`, `quarantine`, `block`, or `not_applicable`
- `label`
- `reason`
- `downstream_constraint`

## Required gate order

1. Source Admission
2. Privacy Quarantine
3. Temporal Validity
4. Context Lineage
5. Evidence Before Belief
6. Operationalization Boundary
7. Release Scope
8. Public Proof Packet
9. Contestability Receipt
10. Compression Loss Ledger
11. Revision Provenance
12. Deployment Boundary

## Prohibited fields

Do not include raw transcripts, names of private people, household details, health details, animal-care details, financial facts, precise locations, relationship details, credentials, secrets, or private source excerpts.

## Minimal example

- `record_type`: `boundary_stack_record`
- `record_version`: `0`
- `artifact_id`: `public-safe-method-note-001`
- `boundary_stack_version`: `boundary-stack-v0`
- `source_status`: `mixed`
- `claim_status`: `design_inference`
- `privacy_status`: `private_context_used_for_architecture_only`
- `temporal_status`: `current`
- `release_scope`: `research_note`
- `missingness`: [`runtime wiring not verified`]
- `revision_reason`: `Needed to compose prior boundary modules into one order-of-operations manifest.`
- `contestability_path`: `Challenge the gate order, source class, or release scope without requiring private-source disclosure.`
- `public_claim`: `The system needs a public boundary-stack manifest before release artifacts can be compared consistently.`
