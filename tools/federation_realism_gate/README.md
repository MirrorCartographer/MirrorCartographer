# Federation Realism Gate

## Purpose

This gate prevents health, animal-health, mechanistic-biology, or longitudinal discovery packets from being promoted into reusable MC memory when the packet assumes an unrealistic data federation.

A packet must make explicit whether a multi-site claim preserves institutional boundaries, heterogeneity, missingness, privacy budget, adversarial threat assumptions, and privacy-utility tradeoffs.

## Frontier source map

| Source | Status | Useful claim | Caveat |
|---|---|---|---|
| Hoang, `Federated Learning for Privacy-Preserving Medical AI`, arXiv 2603.15901, 2026-03-16 | preprint/dissertation; source status: public preprint | Site-aware partitioning is needed because random splits often overstate real-world medical FL performance; adaptive local DP may improve privacy-utility tradeoff versus fixed noise in ADNI MRI experiments. | Not a deployed clinical standard; results are task/dataset-specific. |
| Pati et al., `Privacy preservation for federated learning in health care`, 2024 | peer-reviewed review | FL can support multi-institutional health AI without centralizing patient data, but model updates can still leak information and trust assumptions matter. | Review-level guidance; implementation details vary by federation. |
| Stanford HAI, `EHRSHOT`, `INSPECT`, `MedAlign`, 2025 | institutional benchmark infrastructure | Longitudinal EHR AI needs de-identified benchmark datasets because clinical evaluation has an evaluation gap. | Non-commercial/research access; human medical data only, not veterinary. |
| Roberts et al., `OpenScientist`, medRxiv 2026 | preprint | Agentic biomedical systems can formulate hypotheses, execute computational analyses, and extract findings. | Preprint; biomedical-agent validity requires independent reproduction and domain review. |
| Hao et al., `Beyond human-in-the-loop`, 2025 | peer-reviewed HCI/sensemaking study | Human-AI workflows should capture sensemaking across pre-development, deployment, and post-development phases. | Organizational HCI study; not a biomedical validation benchmark. |

## Design implication

MC should reject any reusable discovery-memory packet that treats privacy-preserving federation as a magic boundary. The packet must declare realistic federation assumptions: who holds the data, whether clients correspond to actual sites/species/instruments, how missingness differs by site, what leaves the site, what privacy budget or sanitization applies, and what evidence would falsify the claim.

## Packet labels required

- `source_status`
- `claim_status`
- `privacy_status`
- `missingness`
- `revision_reason`
- `implementation_status`
- `evidence_strength`
- `falsification_route`
- `next_executable_action`

## Evaluation rule

A packet passes only if it includes:

1. `site_boundary_model`: named data holders or simulated holders.
2. `partition_realism`: why the split reflects real institutional, species, instrument, clinic, or longitudinal boundaries.
3. `missingness_model`: site-specific missingness, sampling cadence, dropout, and measurement absence.
4. `privacy_mechanism`: none, de-identification, local DP, secure aggregation, federated updates, synthetic-only, or local-only restoration.
5. `privacy_utility_tradeoff`: expected performance loss, stability risk, and what utility metric must survive.
6. `leakage_threat_model`: membership inference, gradient inversion, reconstruction, cross-context leakage, or tool-action leakage.
7. `falsification_route`: the observation that would demote or revise the claim.
8. `next_executable_action`: one concrete run, review, test, or dataset mapping step.

## Implementation status

Implemented as a JSON schema, synthetic fixtures, validation CLI, and regression tests in this directory.

## Next executable action

Run:

`python tools/federation_realism_gate/test_validate_federation_realism_packet.py`
