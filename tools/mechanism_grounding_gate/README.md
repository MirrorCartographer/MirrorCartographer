# Mechanism Grounding Gate

## Frontier scan anchor

Recent scientific-AI evaluation work is shifting from answer plausibility toward mechanism-grounded problem-to-hypothesis reasoning. The most directly useful source for this gate is **Matter to Mechanism: A Benchmark for AI Co-Scientists in Materials and Battery Research** (arXiv, June 2026), which structures hypothesis evaluation around problem statement, candidate hypothesis, reasoning trace, material system, component, failure mode, intervention, mechanism, target property, and claimed outcome. The same design pattern transfers to biomedical, veterinary, longitudinal-health, and mechanistic-biology research organization if kept as research infrastructure rather than advice.

Supporting sources also include HeurekaBench for end-to-end scientific workflow evaluation, LABBench2 for realistic biology-research task evaluation, and SuperLocalMemory for local-first memory with provenance/trust separation.

## Actionable design implication

Mirror Cartographer should not promote a discovery packet to reusable memory merely because it is cited, plausible, or emotionally coherent. It should require an explicit **mechanism chain**:

`problem_context -> observed_failure_or_gap -> proposed_intervention_or_variable -> proposed_mechanism -> target_endpoint -> expected_direction -> validation_method -> falsification_route`

For medical or veterinary areas, this chain is only a research-organization artifact. It must not store diagnosis, treatment, or care instructions as promoted claims.

## Gate purpose

The Mechanism Grounding Gate validates whether a generated hypothesis packet contains enough mechanistic structure to be reviewed, tested, revised, or rejected.

It rejects packets that:

- state outcomes without mechanism;
- confuse proxy observations with durable endpoints;
- omit failure mode or knowledge gap;
- lack measurable target variables;
- lack source status or privacy status;
- present medical/veterinary content as advice;
- cannot name a falsification route.

## Required labels

Each packet must label:

- `source_status`
- `claim_status`
- `privacy_status`
- `missingness`
- `revision_reason`
- `implementation_status`
- `evidence_strength`
- `falsification_route`
- `next_executable_action`

## Implementation status

Implemented as schema, CLI validator, fixtures, and regression tests under `tools/mechanism_grounding_gate/`.

## Falsification route for the gate itself

Revise or remove this gate if curator review shows that mechanism-chain requirements do not improve reviewer agreement, do not reduce unsupported memory promotion, or systematically reject useful early-stage exploratory hypotheses.

## Next executable action

Run:

`python tools/mechanism_grounding_gate/test_validate_mechanism_grounding_packet.py`
