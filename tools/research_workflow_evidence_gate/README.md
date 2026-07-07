# Research Workflow Evidence Gate

## Purpose

The Research Workflow Evidence Gate is a discovery-memory promotion gate for scientific AI, medical AI, mechanistic biology, neuroscience, longitudinal health data, animal-health research infrastructure, HCI, privacy-preserving memory, and hypothesis-generation systems.

It blocks a hypothesis, benchmark result, model output, or research note from being promoted into reusable memory unless the workflow evidence is inspectable.

## Actionable design implication

Frontier scientific-AI evaluation is shifting from isolated answer correctness toward realistic research workflow support: evidence handling, analysis, design, scientific reasoning, validation, translation, communication, provenance, and tool/resource integration. Mirror Cartographer should therefore require every reusable research-memory claim to carry a workflow evidence packet, not just a conclusion.

## Source map

| Source | Status | Relevant signal | Claim status |
|---|---|---|---|
| OpenAI LifeSciBench, published 2026-06-17, https://openai.com/index/introducing-life-sci-bench/ | Primary benchmark announcement | Defines realistic life-science workflows across evidence handling, analysis, design/optimization, reasoning, validation/operations, translation, and scientific communication | Strong for workflow-centered evaluation direction |
| LABBench2, arXiv 2604.09554v2, 2026-05-05, https://arxiv.org/html/2604.09554v2 | Preprint / benchmark | Expands biology-agent tasks toward more realistic contexts | Moderate; preprint caveat |
| Artificial Intelligence agents for biological research: a survey, 2026, https://pmc.ncbi.nlm.nih.gov/articles/PMC12936789/ | Peer-reviewed / indexed survey | Organizes biological AI agents by task domains, architecture, evaluation, interaction, and resource integration | Moderate-to-strong survey evidence |
| A Framework for Longitudinal Health AI Agents, arXiv 2604.12019, 2026, https://arxiv.org/pdf/2604.12019 | Preprint / framework | Defines continuity, coherence, adaptation, and agency across repeated health interactions | Moderate; preprint caveat |
| Cornell: From Data to Animal Health: Building Benchmarks for AI-Driven Veterinary Innovation, project period Aug 2025-May 2026, https://www.vet.cornell.edu/research/awards/data-animal-health-building-benchmarks-ai-driven-veterinary-innovation | Research institution project | Shows animal-health AI infrastructure needs benchmark construction, not only model deployment | Strong for veterinary infrastructure gap; project output may still be incomplete |
| Virtual Cells Need Context, bioRxiv 2026-02-09, https://www.biorxiv.org/content/10.64898/2026.02.04.703804v1.full-text | Preprint | Argues virtual-cell utility depends on biological context, not only scale | Moderate; preprint caveat |
| ppAIsec privacy-preserving AI models in healthcare, preprint 2026, https://www.preprints.org/manuscript/202601.0250 | Preprint survey | Maps federated learning, differential privacy, homomorphic encryption, and secure collaborative AI concerns | Weak-to-moderate; preprint caveat |

## Gate rule

A research-memory candidate passes only if it declares:

1. source status
2. claim status
3. privacy status
4. missingness
5. revision reason
6. implementation status
7. evidence strength
8. falsification route
9. next executable action
10. workflow stage coverage
11. translation boundary
12. validation route
13. blocked inferences
14. provenance route

## Privacy status

This artifact is public-safe and synthetic. It does not encode private medical, veterinary, or identity data. It is a research-organization tool, not medical or veterinary advice.

## Missingness

The gate explicitly records missing workflow stages, unvalidated translation steps, absent datasets, unresolved privacy risk, unavailable animal-health benchmark outputs, and untested clinical/veterinary applicability.

## Falsification route

The gate should be revised or rejected if curator testing shows that required packets do not improve reconstruction accuracy, blocked-inference detection, privacy-boundary detection, or next-action clarity compared with ordinary research notes.

## Next executable action

Run:

```bash
python tools/research_workflow_evidence_gate/test_validate_research_workflow_evidence_packet.py
```
