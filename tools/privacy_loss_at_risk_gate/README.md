# Privacy Loss at Risk Gate

## Frontier scout finding

Frontier medical AI and longitudinal health-data work is moving beyond static de-identification. Repeated retrieval, cohort comparison, and open-ended medical QA can leak identity or sensitive context through rare feature combinations even when direct identifiers are absent.

## Actionable design implication

Mirror Cartographer discovery memory needs a **Privacy Loss at Risk Gate** before health, animal-health, neuroscience, HCI, or mechanistic-biology packets are promoted into reusable memory.

The gate requires every packet to declare:

- source status
- claim status
- privacy status
- missingness
- revision reason
- implementation status
- evidence strength
- falsification route
- next executable action
- data context
- query context
- cumulative privacy-risk model
- final memory-write decision

## Source map

| Source | Status | Design relevance |
| --- | --- | --- |
| `SoK: Privacy-aware LLM in Healthcare` / arXiv 2601.10004 | 2026 preprint | Phase-aware threat models for healthcare LLMs across preprocessing, fine-tuning, and inference. |
| `Privacy-Preserving Cohort Analytics for Personalized Health Platforms` / arXiv 2601.12105 | 2026 preprint | Introduces cumulative, stochastic privacy-risk framing and Privacy Loss at Risk style reasoning for longitudinal cohort analytics. |
| `MedPriv-Bench` / arXiv 2603.14265 | 2026 preprint / benchmark | Shows contextual leakage in medical open-ended QA and evaluates privacy-utility tradeoffs. |
| `Benchmarking Foundation Models with Multimodal Public EHRs` / arXiv 2507.14824 | 2025 preprint / reproducible benchmark | Establishes reproducible multimodal EHR benchmark context where privacy and modality boundaries must be explicit. |

## Gate hypothesis

If discovery-memory admission models cumulative privacy risk instead of relying only on static de-identification labels, then reviewers should observe fewer unsafe memory promotions involving rare longitudinal feature combinations while preserving useful coarsened cohort-level reasoning.

## Falsification route

Reject or revise this gate if repeated-query simulation and curator review show no reduction in contextual leakage risk, or if useful cohort-level comparison utility collapses after coarsening.

## Run

```bash
python tools/privacy_loss_at_risk_gate/validate_privacy_loss_at_risk_packet.py tools/privacy_loss_at_risk_gate/fixtures/valid_privacy_loss_at_risk_packet.json
python tools/privacy_loss_at_risk_gate/test_validate_privacy_loss_at_risk_packet.py
```

## Implementation status

Implemented as schema, validation CLI, valid/invalid fixtures, and regression tests. Needs CI wiring and curator-labeled production packets.
