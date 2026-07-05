# Frontier Discovery Artifact: Federated Uncertainty Hypothesis Routing

Date: 2026-07-05

## Purpose

Convert current frontier work in medical AI, scientific AI, and privacy-preserving longitudinal data into one MC-buildable design implication: hypotheses should not be routed only by apparent relevance or novelty. They should be routed by uncertainty, evidence sufficiency, site/context heterogeneity, and executability.

This is not medical or veterinary advice. This artifact defines research-organization infrastructure for future hypothesis testing and question preparation.

## Frontier signal

Recent frontier signals point to a converging pattern:

1. Scientific AI workbenches are moving from chat-only assistance toward integrated research environments that combine literature review, code execution, data analysis, and reproducible history.
2. Biomedical agent benchmarks are beginning to score hypothesis validation, evidence-conclusion alignment, reasoning correctness, and executable analysis code rather than only answer fluency.
3. Privacy-preserving medical AI is moving toward federated, multimodal, site-aware, uncertainty-aware evaluation because healthcare data cannot usually be centralized and because real-world sites differ.

## Source map

| Source | Date/status | Relevant signal | MC extraction |
|---|---:|---|---|
| BioDSA-1K: Benchmarking Data Science Agents for Biomedical Research | 2025-05 preprint/benchmark | Hypothesis-centric biomedical tasks can be evaluated by decision accuracy, evidence alignment, reasoning correctness, and code executability. Includes insufficient-evidence cases. | MC hypothesis records need an explicit `evidence_sufficiency` field and should allow `not_verifiable_from_available_data`. |
| Med-MMFL: A Multimodal Federated Learning Benchmark in Healthcare | 2026-02 preprint/benchmark | Medical federated learning benchmarks need multimodal, heterogeneous, naturally federated, IID, and non-IID settings. | MC longitudinal/pet/human observations should support site/context partitions before any model training claim. |
| TrustFed: Enabling Trustworthy Medical AI under Data Privacy Constraints | 2026-03 preprint/framework | Federated medical AI needs uncertainty quantification under heterogeneity and imbalance; prediction sets should carry coverage guarantees. | MC should route uncertain claims to question-prep/test design, not conclusion synthesis. |
| Claude Science launch reporting | 2026-06 news/product signal | Domain-specific scientific workbenches emphasize tool integration, code, history, local infrastructure, and reproducibility. | MC should become an evidence/workflow engine, not a note archive. |

## MC-relevant hypothesis

If MC routes observations and hypotheses using uncertainty-aware, privacy-preserving, context-partitioned metadata, then it will produce more testable and safer research artifacts than a relevance-only or novelty-only routing system.

## Executable/semi-executable test

### Claim under test

A routing policy that includes uncertainty, evidence sufficiency, privacy level, context partition, and executability will select better next actions for cure/discovery infrastructure than a naive novelty/relevance policy.

### Null hypothesis

Adding uncertainty/context/privacy/executability fields does not improve selection quality compared with novelty/relevance scoring alone.

### Test design

Create a synthetic fixture of 30 to 100 MC-style hypothesis packets. Each packet should include only public-safe synthetic content.

Each packet includes:

- `hypothesis_id`
- `domain`: scientific_ai | medical_ai_research_org | nervous_system_model | animal_care_research_org | symbolic_operational_translation | privacy_memory
- `observation_summary`
- `symbolic_input`
- `operational_translation`
- `evidence_refs`
- `evidence_sufficiency`: sufficient | partial | insufficient | conflicting | absent
- `uncertainty_level`: low | medium | high | unknown
- `privacy_level`: public_synthetic | public_source | private_abstracted | private_sensitive_blocked
- `context_partition`: source_site, species_or_subject_class, modality, time_window, setting
- `measurable_variables`
- `candidate_next_actions`: literature_map | schema | fixture | validator | experiment_design | clinician_vet_question_prep | collaborator_search | stop_due_to_privacy | contradiction_ledger
- `executability_score`: 0.0 to 1.0
- `novelty_score`: 0.0 to 1.0
- `care_relevance_score`: 0.0 to 1.0
- `risk_score`: 0.0 to 1.0
- `expected_best_action`
- `rationale_gold`

### Routing policies to compare

Policy A: relevance/novelty only

`score = 0.5 * novelty_score + 0.5 * care_relevance_score`

Policy B: uncertainty-aware discovery routing

`score = 0.20 * novelty_score + 0.20 * care_relevance_score + 0.25 * executability_score + 0.20 * uncertainty_action_value + 0.15 * evidence_gap_value - privacy_penalty - risk_penalty`

Where:

- `uncertainty_action_value` is high when uncertainty is high but measurable variables exist.
- `evidence_gap_value` is high for partial/conflicting/insufficient evidence when the next action can reduce uncertainty.
- `privacy_penalty` blocks private-sensitive content from public artifacts.
- `risk_penalty` routes high-risk medical/veterinary content away from conclusions and toward research-question preparation.

### Evaluation metrics

- `action_match_rate`: selected action matches `expected_best_action`.
- `unsafe_conclusion_rate`: system produces conclusion when evidence is insufficient, conflicting, absent, private-sensitive, or high-risk.
- `testability_gain`: selected action increases measurable variables, schema completeness, fixture coverage, or falsification readiness.
- `privacy_violation_rate`: selected public action contains private-sensitive or raw personal/pet details.
- `contradiction_capture_rate`: conflicting evidence is routed to a contradiction ledger rather than smoothed into a single answer.
- `execution_readiness_score`: selected action can become a concrete GitHub artifact in one run.

### Passing criterion

Policy B should outperform Policy A by at least 20 percent on `action_match_rate`, reduce `unsafe_conclusion_rate` to zero on synthetic high-risk/insufficient-evidence cases, and improve `execution_readiness_score` without increasing privacy violations.

## Required labels

- Source status: current frontier scan; mix of preprint/benchmark/product-news signals; needs primary-source expansion before strong claims.
- Claim status: design hypothesis, unvalidated.
- Privacy status: public-safe synthetic infrastructure only.
- Missingness: no local fixture or validator yet; no empirical comparison run yet.
- Revision reason: convert frontier research into a buildable MC test rather than a summary.
- Implementation status: artifact created; fixture/schema/validator still pending.
- Evidence strength: moderate for the direction of travel; low for the specific MC routing claim until tested.
- Falsification route: implement Policy A and Policy B on synthetic packets; reject or revise the claim if Policy B does not improve action quality or safety metrics.
- Next executable action: create `schemas/hypothesis_packet.schema.json`, `fixtures/synthetic_hypothesis_packets.json`, and `tests/test_hypothesis_router.py`.

## Prototype requirement

Build `mc_hypothesis_router` as a small deterministic module before any model-based version.

Minimum functions:

1. `validate_packet(packet) -> ValidationResult`
2. `score_policy_a(packet) -> float`
3. `score_policy_b(packet) -> RoutingScore`
4. `select_next_action(packet, policy) -> ActionDecision`
5. `explain_decision(packet, decision) -> DecisionRecord`
6. `block_or_redirect_if_private_or_high_risk(packet) -> SafetyRoute`

The first version should be deterministic and auditable. Model-based hypothesis generation can be added later only after the routing/evaluation harness exists.
