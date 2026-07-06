# Workflow Reconstruction Gate

## Frontier scout implication

Current scientific-AI work is moving from isolated answer scoring toward auditable research-workflow reconstruction: systems are expected to connect a research question, dataset boundary, code/procedure trace, hypothesis update, validation result, and falsification route before a claim can be treated as discovery-relevant.

This gate prevents Mirror Cartographer discovery memory from storing a scientific or medical-adjacent claim unless the packet can reconstruct how the claim was produced and how it could be checked again.

## Source map

| Source | Status | Relevant signal | Use in this gate |
|---|---|---|---|
| HeurekaBench, arXiv 2026 | Preprint / benchmark framework | Open-ended scientific questions grounded in study + code repository; verifies candidate workflows against reported findings | Requires study anchor, code/procedure trace, workflow steps, and validation alignment |
| LABBench2, arXiv 2026 | Preprint / benchmark | Tests scientific appropriateness, including methodological scrutiny and relevance assessment | Requires appropriateness rationale and method-fit fields |
| Google / Nature AI Co-Scientist 2026 | Peer-reviewed article + institutional system | Tool-grounded hypothesis generation with scientist feedback and specialized models | Requires hypothesis update trail and human/AI role boundary |
| Stanford HAI longitudinal EHR benchmark datasets 2025 | Institutional dataset infrastructure | EHRSHOT, INSPECT, and MedAlign address evaluation gaps in longitudinal healthcare AI | Requires longitudinal boundary, missingness label, and privacy status |
| Cornell veterinary benchmark project 2025-2026 | Institutional grant/project | Building benchmarks for AI-driven veterinary innovation | Requires species/context boundary and blocks advice-like animal-health claims |

## Packet labels required

- source_status
- claim_status
- privacy_status
- missingness
- revision_reason
- implementation_status
- evidence_strength
- falsification_route
- next_executable_action

## Admission rule

A packet passes only if it contains:

1. A bounded research question.
2. Source anchors and source status labels.
3. Dataset / cohort / species / modality boundaries.
4. A reproducible workflow trace.
5. At least one hypothesis update caused by evidence.
6. Method-fit and limitation notes.
7. Validation and falsification routes.
8. Privacy and missingness handling.
9. A concrete next executable action.

## Implementation status

Implemented as schema, validator, synthetic valid/invalid fixtures, and regression tests. Public-safe synthetic data only.

## Falsification route

Revise this gate if curator review shows that workflow reconstruction does not reduce unsupported discovery-memory promotions, or if it blocks clearly useful research packets that have adequate evidence but non-code procedures.

## Next executable action

Run:

`python tools/workflow_reconstruction_gate/test_validate_workflow_reconstruction_packet.py`
