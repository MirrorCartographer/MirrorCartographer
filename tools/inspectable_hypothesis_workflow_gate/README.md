# Inspectable Hypothesis Workflow Gate

## Purpose

Prevent scientific, medical, veterinary, mechanistic-biology, neuroscience, or longitudinal-health claims from entering reusable discovery memory unless the packet exposes an inspectable workflow route rather than only a plausible final hypothesis.

This is research organization infrastructure only. It is not medical or veterinary advice.

## Frontier signal

Recent frontier work points toward AI co-scientist systems that must be evaluated as workflows:

1. **HeurekaBench** proposes benchmark construction from real scientific studies, datasets, and code repositories, emphasizing end-to-end exploratory research workflows rather than isolated Q&A.
2. **CoDHy** frames biomedical hypothesis generation as human-in-the-loop, evidence-retrievable, graph-grounded, and inspectable through a web interface.
3. **BioVerge** studies biomedical hypothesis-generation agents with generation and evaluation modules, showing the need to track exploration diversity, structured/textual sources, novelty, and relevance.
4. **Deep Research / interactive multi-agent scientific workflows** emphasizes specialized agents, persistent world state, human checkpoints, and novelty detection.
5. **MedPriv-Bench and related medical privacy work** show that clinical utility must be evaluated alongside contextual privacy leakage risk, especially for retrieval-grounded systems.

## Actionable design implication

MC should require an **Inspectable Hypothesis Workflow Packet** before discovery-memory promotion.

A packet must include:

- source map with source status and claim status;
- dataset, code, literature, and tool boundaries;
- graph/structured evidence route when applicable;
- generation route and critique route as workflow artifacts, not hidden chain-of-thought;
- novelty/relevance scoring route;
- privacy leakage route;
- human checkpoint or collaborator role boundary;
- missingness statement;
- falsification route;
- next executable action.

## Required labels

- `source_status`
- `claim_status`
- `privacy_status`
- `missingness`
- `revision_reason`
- `implementation_status`
- `evidence_strength`
- `falsification_route`
- `next_executable_action`

## Evidence strength

Moderate.

The cited work is mostly preprint/frontier-system infrastructure, not clinical validation. The implementation is synthetic and validates packet structure only.

## Falsification route

Revise or retire this gate if curator review shows that inspectable workflow packets do not improve reviewer agreement, reduce unsupported discovery-memory promotion, or improve reproducibility of hypothesis triage.

## Next executable action

Run:

`python tools/inspectable_hypothesis_workflow_gate/test_validate_inspectable_hypothesis_packet.py`
