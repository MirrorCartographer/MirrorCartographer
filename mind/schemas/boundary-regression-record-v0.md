# BoundaryRegressionRecord v0

## Source Status
- Schema source: public-safe synthesis.
- Private-context source: not included.
- External-source dependency: none required to instantiate.

## Claim Status
This is a proposed schema, not an implemented production contract.

## Privacy Status
Public-safe. Contains no private user data or raw transcript material.

## Missingness
Field names may change after implementation testing.

## Revision Reason
Added to support repeatable testing of public-safety regressions across Mirror Cartographer artifacts.

## Schema Fields

### identity
- `record_id`: stable identifier
- `artifact_path`: public artifact path
- `artifact_type`: research | schema | product | evaluation | fixture | force | genesis | museum | index | other
- `artifact_version`: string
- `reviewed_at`: ISO-8601 datetime
- `reviewer_mode`: automated | human | hybrid

### source_boundary
- `source_classes_admitted`: public_web | public_repo | private_repo_context | file_library_public_safe | saved_context_abstracted | synthetic_fixture | none
- `source_classes_excluded`: private_transcript | health | animal_care | household | financial | location | relationship | credential | raw_identity | other
- `source_status_label_present`: boolean
- `source_boundary_summary`: string

### claim_boundary
- `claim_modes_present`: fact | inference | symbolic_interpretation | speculation | product_requirement | research_question | evaluation_criterion
- `unsupported_certainty_detected`: boolean
- `authority_domain_risk`: none | low | medium | high | blocker
- `authority_domain_notes`: string

### privacy_boundary
- `protected_detail_detected`: boolean
- `protected_detail_class`: none | personal | household | health | animal_care | financial | location | relationship | credential | raw_transcript | other
- `redaction_required`: boolean
- `redaction_notes`: string

### influence_boundary
- `private_context_influence_disclosed_as_abstract`: boolean
- `influence_overclaims_access`: boolean
- `influence_notes`: string

### missingness_boundary
- `missingness_label_present`: boolean
- `known_missing_inputs`: string[]
- `uncertainty_notes`: string

### contestability_boundary
- `user_contestability_preserved`: boolean
- `resonance_presented_as_proof`: boolean
- `alternative_interpretations_allowed`: boolean

### representational_fidelity
- `structure_preserved`: none | weak | adequate | strong
- `flattening_risk`: none | low | medium | high
- `fidelity_notes`: string

### verdict
- `regression_verdict`: pass | pass_with_warning | revise_before_release | block_release
- `blocking_reasons`: string[]
- `required_revision_reason`: string
- `next_action`: publish | revise | quarantine | discard | needs_human_review

## Minimum Passing Rule
A record cannot pass if any of the following is true:

- protected detail is detected;
- source-status label is absent;
- claim-status label is absent;
- privacy-status label is absent;
- missingness label is absent;
- resonance is presented as proof;
- authority-domain risk is high or blocker;
- private context influence is hidden or overstated.
