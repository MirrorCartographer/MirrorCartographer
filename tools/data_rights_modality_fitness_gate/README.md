# Data Rights Modality Fitness Gate

## Frontier scout implication

Scientific and medical AI infrastructure is shifting from final-answer accuracy toward realistic workflow evaluation, process traces, modality-specific benchmarks, and privacy-preserving longitudinal data access. That creates a failure mode for Mirror Cartographer: a research packet can look scientifically useful while being non-reusable because its data rights, consent scope, privacy boundary, or modality fitness are missing.

The actionable design implication is this gate:

> Before a health, animal-health, mechanistic-biology, neuroscience, or longitudinal discovery packet enters reusable MC discovery memory, require explicit data-rights status and modality-fit status.

This is research-organization infrastructure only. It is not medical or veterinary advice.

## Source map

| Source | Status | Why it matters |
|---|---|---|
| LABBench2, arXiv, May 5 2026 | Preprint / benchmark | Frames scientific appropriateness as both methodological scrutiny and relevance assessment. |
| Stanford HAI longitudinal EHR datasets, Feb 10 2025 | Institutional dataset infrastructure | Shows the need for de-identified longitudinal health benchmarks such as EHRSHOT, INSPECT, and MedAlign. |
| Cornell CVM animal-health benchmark award page | Institutional research infrastructure | States that veterinary medicine lacks standardized, high-quality datasets across companion and food-producing animals. |
| OpenAI LifeSciBench, Jun 17 2026 | Benchmark announcement | Emphasizes realistic life-science workflows rather than biology Q&A. |
| Nature Co-Scientist, 2026 | Peer-reviewed primary research | Uses tools, search, specialized models, and human steering to improve grounded hypothesis generation. |
| npj Digital Medicine privacy-enhancing medical AI discussion, 2026 | Peer-reviewed perspective/commentary | Highlights privacy-performance-fairness tradeoffs in clinical AI. |

## Required labels in each packet

- `source_status`
- `claim_status`
- `privacy_status`
- `data_rights_status`
- `modality_map`
- `task_fit`
- `missingness`
- `revision_reason`
- `implementation_status`
- `evidence_strength`
- `falsification_route`
- `next_executable_action`

## Admission rule

A packet must not be promoted as reusable discovery memory when any of the following are true:

1. Raw sensitive data is marked `public_safe`.
2. Consent is unknown or clinical-care-only while the packet is marked `public_safe`.
3. Redistribution is prohibited while the packet is marked `public_safe`.
4. Missingness blocks promotion but the packet is marked tested or CI-admissible.
5. Modality fitness is `not_fit` or `unknown` but the packet is not rejected or converted into a prototype requirement.

## Run locally

```bash
python tools/data_rights_modality_fitness_gate/validate_packet.py \
  tools/data_rights_modality_fitness_gate/fixtures/valid_public_benchmark_packet.json \
  tools/data_rights_modality_fitness_gate/fixtures/invalid_raw_sensitive_public_packet.json

python tools/data_rights_modality_fitness_gate/test_validate_packet.py
```

## Falsification route

Revise or remove this gate if curator-labeled review shows it does not reduce unsafe reuse, unsupported promotion, rights-confused memory packets, or modality-mismatched discovery claims.

## Next executable action

Wire this validator before discovery-memory promotion, after the animal-health evidence gate and before any public-safe source-map export.
