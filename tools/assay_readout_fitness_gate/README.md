# Assay Readout Fitness Gate

## Frontier scan summary

This gate is a discovery-memory evaluation criterion for scientific, medical AI, mechanistic-biology, neuroscience, longitudinal health, animal-health, HCI, privacy-preserving memory, and hypothesis-generation packets.

Frontier systems increasingly emphasize not only whether a generated hypothesis is plausible, but whether the workflow, data boundary, tool use, benchmark, longitudinal structure, privacy model, and readout can support the specific claim being promoted. The missing design constraint is assay/readout fitness: a packet must show that its selected measurement can distinguish the claimed mechanism from a proxy signal, confounder, instrument artifact, or short-term endpoint.

## Source map

- Nature, 2026, `Accelerating scientific discovery with Co-Scientist` — source status: primary/peer-reviewed. Claim status: supports tool-grounded, hypothesis-oriented scientific workflows and human steering.
- EPFL MLBio Lab, `HeurekaBench` — source status: benchmark/project page. Claim status: supports evaluating AI co-scientists on open-ended, data-driven, hypothesis-driven exploratory analysis.
- Stanford HAI, 2025, `Advancing Responsible Healthcare AI with Longitudinal EHR Datasets` — source status: institutional dataset/benchmark announcement. Claim status: supports longitudinal benchmark infrastructure for rigorous healthcare AI evaluation.
- Cornell College of Veterinary Medicine, 2025-2026, `From Data to Animal Health: Building Benchmarks for AI-Driven Veterinary Innovation` — source status: institutional grant/project. Claim status: supports species-aware veterinary benchmark infrastructure.
- Patterns, 2024, `Privacy preservation for federated learning in health care` — source status: peer-reviewed review. Claim status: supports privacy threat modeling and privacy-utility tradeoff caution for health AI.
- arXiv, 2026, `Agentic AI Scientists Are Not Built For Autonomous Science` — source status: preprint; caveat: not peer-reviewed. Claim status: supports caution around autonomous scientific agents, diversity, and human/expert review.

## Actionable design implication

MC should block discovery-memory promotion unless every mechanism-level claim has a fit-for-purpose assay/readout packet. The packet must specify:

1. mechanism claim;
2. measurement modality;
3. sampling window;
4. unit or scale;
5. why the readout distinguishes mechanism from proxy;
6. specificity and sensitivity rationale;
7. temporal alignment;
8. confounders;
9. negative controls;
10. promote/hold/reject thresholds;
11. falsification route;
12. next executable action.

## Labels

- Source status: mixed public frontier scan plus synthetic implementation.
- Claim status: discovery-infrastructure evaluation criterion.
- Privacy status: public-safe synthetic fixtures only.
- Missingness: no production corpus, no curator labels, no CI wiring yet.
- Revision reason: prior gates did not explicitly require measurement fitness between mechanism and readout.
- Implementation status: schema, validator, and fixtures committed.
- Evidence strength: moderate.
- Falsification route: revise if reviewer testing shows no reduction in mechanism/proxy confusion or unsupported memory promotion.
- Next executable action: run `python tools/assay_readout_fitness_gate/validate_assay_readout_fitness_packet.py tools/assay_readout_fitness_gate/fixtures/valid_assay_readout_fitness_packet.json`.

## Expected validator behavior

Valid fixture:

```bash
python tools/assay_readout_fitness_gate/validate_assay_readout_fitness_packet.py tools/assay_readout_fitness_gate/fixtures/valid_assay_readout_fitness_packet.json
```

Invalid fixture:

```bash
python tools/assay_readout_fitness_gate/validate_assay_readout_fitness_packet.py tools/assay_readout_fitness_gate/fixtures/invalid_proxy_only_packet.json
```

The invalid fixture should fail because `readout_fitness.distinguishes_mechanism_from_proxy` is false.
