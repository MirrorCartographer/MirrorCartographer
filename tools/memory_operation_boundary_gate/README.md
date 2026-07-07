# Memory Operation Boundary Gate

## Frontier scan date
2026-07-07

## Source map

| Source | Status | Why it matters |
|---|---|---|
| Gottweis et al., `Accelerating scientific discovery with Co-Scientist`, Nature, 2026 | Peer-reviewed primary research | Shows frontier scientific AI moving toward tool-using, interactive hypothesis generation rather than static literature summaries. |
| Stanford HAI, `Advancing Responsible Healthcare AI with Longitudinal EHR Datasets`, 2025 | Research institution release for benchmark datasets | EHRSHOT, INSPECT, and MedAlign expose the need for longitudinal evaluation, de-identification, and reproducible healthcare-AI benchmarks. |
| Cornell CVM, `From Data to Animal Health: Building Benchmarks for AI-Driven Veterinary Innovation`, 2026 | Veterinary research institution award/program | States the veterinary AI infrastructure gap: standardized benchmark datasets are still missing across companion and production animal domains. |
| Wu et al., `Agent-Memory Protocol`, PMLR, 2026 | Peer-reviewed/proceedings primary research | Frames agent memory as a privacy-sensitive protocol problem, especially for medicine and finance, where longitudinal traces accumulate. |
| Xu, `Human-as-the-Unit Privacy Management with AI Agents`, USENIX PEPR / CHI 2026 | HCI/privacy research presentation | Supports treating privacy as a user-level and relationship-level management task, not merely per-field redaction. |
| Pati et al., `Privacy preservation for federated learning in health care`, Patterns, 2024 | Peer-reviewed review | Shows that privacy-preserving health AI must still model leakage from shared gradients, institutional heterogeneity, and low-trust federation. |

## Actionable design implication

MC needs a **Memory Operation Boundary Gate** before any scientific, medical, veterinary, longitudinal-health, or personal-research packet can be written into reusable memory or promoted into a discovery graph.

The gate treats memory as an operation, not a passive storage location. Every write, retrieval, reuse, export, or collaborator handoff must declare:

1. operation type;
2. source boundary;
3. subject boundary;
4. modality boundary;
5. species/context boundary;
6. privacy boundary;
7. allowed reuse scope;
8. missingness;
9. evidence strength;
10. falsification route;
11. next executable action.

## Hypothesis

If MC requires boundary-labeled memory operations before promotion, then curator review should show fewer unsupported cross-context jumps: fewer cases where a cohort claim becomes an individual claim, a human-medical source becomes a veterinary inference, a benchmark result becomes a cure claim, or a private trace becomes reusable research memory.

## Claim status

Discovery-infrastructure evaluation criterion. This is not medical or veterinary advice.

## Privacy status

Public-safe synthetic schema and fixtures only. No personal health, veterinary, or private user records are encoded.

## Missingness

The gate explicitly requires missingness fields for dataset, subject, modality, temporal, and privacy gaps.

## Revision reason

Earlier gates focused on claim quality, mechanism grounding, federation realism, or evidence-route portability. This gate adds the missing operation layer: whether a memory action itself is allowed, scoped, inspectable, and reversible.

## Implementation status

Implemented as schema, validator, fixtures, and regression tests in this folder.

## Evidence strength

Moderate. The design is supported by converging frontier work in co-scientists, longitudinal EHR benchmarks, veterinary benchmark infrastructure, privacy-preserving memory, HCI privacy management, and federated healthcare AI. It remains an engineering hypothesis until measured against curator review.

## Falsification route

Revise or reject this gate if a blinded curator study shows no reduction in unsupported memory promotions, cross-species/context drift, privacy leakage, or unreconstructable reuse decisions compared with ungated packets.

## Next executable action

Run:

`python tools/memory_operation_boundary_gate/test_validate_memory_operation_boundary_packet.py`
