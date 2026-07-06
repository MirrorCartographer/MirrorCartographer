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

This folder is research-organization infrastructure only. It is not medical advice, veterinary advice, diagnosis, treatment, dosage guidance, or emergency triage.
