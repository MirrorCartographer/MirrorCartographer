# Benchmark Provenance Gap Gate

## Actionable design implication

Mirror Cartographer should not promote benchmark-derived claims into discovery memory unless the benchmark's provenance, scope, transfer boundary, and gap model are explicit. Frontier scientific AI work is increasingly benchmark-driven, but benchmark success can collapse into overclaiming when dataset origin, assay class, cohort/site, species, task definition, metric, and missingness are not preserved.

## Source map

| Source | Status | Relevant signal | Design translation |
|---|---|---|---|
| AssayBench, arXiv 2026 | preprint; clear caveat | Phenotypic screen prediction is benchmarked at assay level across 1,920 public CRISPR screens with adjusted nDCG. | Treat assay class and metric as non-portable claim boundaries. |
| Framework for Longitudinal Health AI Agents, arXiv 2026 | preprint; conceptual/research framework | Longitudinal health agents require evolving priorities, trigger-symptom relations, past interventions, and coherent continuity over time. | Require temporal provenance and missingness before longitudinal memory reuse. |
| Cornell CVM veterinary AI benchmark award page | institutional research award/page | Veterinary medicine lacks standardized high-quality datasets across domains. | Animal-health claims must expose species/domain benchmark gaps. |
| Stanford HAI EHRSHOT/INSPECT/MedAlign article | institutional research publication summary | Longitudinal EHR datasets are meant to address healthcare AI evaluation gaps. | Claims must identify whether benchmark task actually evaluates the claimed clinical behavior. |
| Virtual Cell / AI cell-model frontier work | peer-reviewed review + 2026 preprint ecosystem | Virtual-cell predictions depend on perturbation, cell context, omics modality, and biological-fidelity validation. | Mechanistic transfer from benchmark score to biological discovery must remain blocked until validation route is declared. |

## Gate purpose

This gate validates a `benchmark_provenance_gap_packet` before a benchmark result can be used as evidence for a discovery, cure, mechanism, longitudinal-health, veterinary, HCI, or memory-system claim.

It requires:

- benchmark identity and status
- dataset provenance
- task and metric binding
- claim being supported
- transfer boundary
- known benchmark gaps
- privacy status
- missingness
- revision reason
- evidence strength
- falsification route
- next executable action

## Labels

- Source status: public frontier scan + synthetic implementation.
- Claim status: discovery-memory evaluation criterion.
- Privacy status: public-safe synthetic only.
- Missingness: required explicit field.
- Revision reason: prevent benchmark score from becoming an unsupported discovery claim.
- Implementation status: schema, validator, fixtures, and tests added.
- Evidence strength: moderate; supported by convergent frontier benchmark design, not clinical proof.
- Falsification route: revise if curator review shows the gate does not improve reconstruction of benchmark scope and transfer limits.
- Next executable action: run `python tools/benchmark_provenance_gap_gate/test_validate_benchmark_provenance_gap_packet.py`.
