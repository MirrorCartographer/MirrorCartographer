# Hypothesis Test Forge

Executable and semi-executable tests for Mirror Cartographer claims.

Each artifact must label:

- source_status
- claim_status
- privacy_status
- missingness
- revision_reason
- implementation_status
- testability
- falsification_route
- measurable_variables
- next_executable_action

## Current artifacts

### Symbolic-to-operational translation

Run:

`python tools/hypothesis_test_forge/validate_symbolic_operational_fixture.py`

Tests whether symbolic language can be translated into measurable variables without being promoted into factual proof, diagnosis, treatment, veterinary advice, or supernatural certainty.

### Privacy-preserving longitudinal dataset

Run:

`python tools/hypothesis_test_forge/validate_privacy_longitudinal_fixture.py`

Tests whether longitudinal continuity records can retain useful MC signals while rejecting private identifiers, unsafe clinical/veterinary directives, and missingness collapse.

### Nervous-system/cognition evidence organization rubric

Artifact:

`tools/hypothesis_test_forge/nervous_system_cognition_scoring_rubric.json`

Tests whether subjective nervous-system/cognition observations can be scored for evidence-map readiness while staying inside research organization and clinician-facing question prep. It rejects diagnosis, treatment, dosage, emergency triage, unsupported causality, symbolic certainty, missingness-as-absence, and private identifier retention.

### Animal-care evidence map

Run:

`python tools/hypothesis_test_forge/validate_animal_care_evidence_map.py`

Tests whether animal-care observations can be organized into veterinarian-facing question-prep evidence maps while rejecting diagnosis, treatment, cure claims, dosage guidance, emergency triage, unsupported causality, private identifiers, and missingness-as-absence.

This folder is research-organization infrastructure only. It is not medical advice, veterinary advice, diagnosis, treatment, dosage guidance, or emergency triage.
