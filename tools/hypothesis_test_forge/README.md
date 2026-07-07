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

### Scientific reasoning falsification checklist

Artifact:

`tools/hypothesis_test_forge/scientific_reasoning_falsification_checklist.json`

Tests whether MC-style hypothesis packets become more scientifically useful when every inference is paired with measurable variables, explicit disconfirmation routes, source boundaries, missingness handling, and claim-strength calibration before promotion into memory, public research, or action planning.

### Human-AI context switch scoring rubric

Artifact:

`tools/hypothesis_test_forge/human_ai_context_switch_scoring_rubric.json`

Tests whether context-switch explanations in human-AI sensemaking become more useful when they preserve the prior context, name the switch trigger, identify new inferences, maintain uncertainty boundaries, reject hidden-reasoning dependency, and end in an executable next action.

### Cure/discovery claim promotion experiment

Artifact:

`tools/hypothesis_test_forge/cure_discovery_claim_promotion_experiment.json`

Tests whether aspirational cure/discovery language can be routed through evidence-stage, mechanism, measurement, missingness, privacy, and falsification gates before being promoted into research memory or public-facing claims. Passing outputs remain research questions, measurement plans, experiment plans, literature summaries, or contradiction-ledger entries rather than diagnosis, treatment, veterinary advice, cure certainty, or discovery proof.

### Medical AI evidence organization table

Artifact:

`tools/hypothesis_test_forge/medical_ai_evidence_organization_table.json`

Tests whether health-related AI inferences become safer and more scientifically useful when organized as evidence rows with source boundaries, missingness states, privacy state, measurable variables, falsification routes, blocked-class scans, and clinician/veterinarian question-prep outputs. This artifact is a semi-executable evidence table and scoring contract; it does not provide diagnosis, treatment, dosage guidance, emergency triage, or veterinary advice.

### Nervous-system context-switch simulated dataset

Artifact:

`tools/hypothesis_test_forge/nervous_system_context_switch_simulated_dataset.json`

Tests whether nervous-system/cognition context-switch observations can be represented as measurable transition records that preserve subjective experience, uncertainty, and question-prep utility without becoming diagnosis, treatment, urgency, or causality claims.

### Evidence routing fixture

Run:

`python tools/hypothesis_test_forge/validate_evidence_routing_fixture.py`

Tests whether MC claims can be routed by evidence status into research questions, longitudinal observations, contradiction-ledger entries, or blocked packets. The validator rejects unsafe promotion, private leakage, unsupported causality, missingness collapse, diagnosis/treatment/veterinary/dosage/urgency claims, and discovery-proof claims.

### Contradiction ledger fixture

Run:

`python tools/hypothesis_test_forge/validate_contradiction_ledger_fixture.py`

Tests whether MC hypothesis packets become more scientifically useful when contradictions are preserved as ledger entries with both sides, source boundaries, missingness state, measurable variables, falsification routes, and safe next actions. The validator rejects premature certainty, unsafe route promotion, diagnosis/treatment/veterinary/dosage/urgency classes, cure certainty, discovery proof, unsupported causality, symbolic certainty, private identifier retention, and missingness-as-absence.

### Variable drift fixture

Run:

`python tools/hypothesis_test_forge/validate_variable_drift_fixture.py`

Tests whether longitudinal MC records become more scientifically useful when variable names, meanings, units, and measurement contexts are checked for drift before cross-session comparison. The validator rejects unsafe comparison, private identifier retention, diagnosis/treatment/veterinary/dosage/urgency claims, cure certainty, discovery-proof claims, unsupported causality, and missingness-as-absence.

This folder is research-organization infrastructure only. It is not medical advice, veterinary advice, diagnosis, treatment, dosage guidance, or emergency triage.
