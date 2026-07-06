# Collaboration Role Boundary Gate

## Purpose

Mirror Cartographer uses this gate to prevent scientific, medical-adjacent, animal-health, or longitudinal pattern hypotheses from entering discovery memory without explicit human/AI responsibility boundaries.

The gate is public-safe infrastructure. It does not diagnose, treat, triage, or recommend clinical/veterinary action.

## Frontier source map

| Source | Status | Relevant signal | Design implication |
|---|---|---|---|
| Co-Scientist, Nature 2026 | peer-reviewed primary research | Tool-grounded AI can generate and refine research hypotheses with scientist feedback and external tools. | Generated hypotheses need explicit tool/source handoffs before promotion. |
| Human-supervised agentic AI for biomedical hypothesis generation, bioRxiv 2026 | preprint; caveat required | Biomedical agents can retrieve and synthesize live sources for human-supervised hypothesis generation. | MC must separate AI ideation from human review and verification responsibility. |
| Survey of Human-AI Collaboration for Scientific Discovery, 2026 | survey/preprint | Scientific discovery collaboration includes roles such as AI-informer and human-explorer across observation, hypothesis, experimentation, and validation stages. | MC packets should record collaboration roles, not only final claims. |
| Privacy preservation for federated learning in health care, 2024 | peer-reviewed review | Healthcare FL reduces raw data sharing but still has leakage/trust risks. | MC must keep private health/veterinary data out of public discovery artifacts and require explicit privacy boundaries. |
| LABBench2, arXiv 2026 | preprint/benchmark | Scientific appropriateness requires methodological scrutiny and relevance assessment, not just answer correctness. | Role-boundary validation should block plausibility-only promotion. |

## Packet contract

A valid packet must include:

- observer, ideator, verifier, and curator roles;
- actor type for each role;
- artifact and handoff responsibility;
- allowed and disallowed source boundaries;
- privacy boundary;
- claim boundary;
- review decision;
- labels for source status, claim status, privacy status, missingness, revision reason, implementation status, evidence strength, falsification route.

## Usage

Run against fixtures:

```bash
python tools/collaboration_role_boundary_gate/test_validate_role_boundary_packet.py
```

Validate a packet or fixture file:

```bash
python tools/collaboration_role_boundary_gate/validate_role_boundary_packet.py path/to/packet.json --expect-valid
```

## Acceptance criteria

1. Valid synthetic packets pass without semantic errors.
2. Packets missing observer, ideator, verifier, or curator roles fail.
3. Packets that promote private or medical/veterinary-advice-risk content fail.
4. Packets using plausibility as evidence fail.
5. Packets without falsification routes or concrete next action fail.

## Labels

Source status: public frontier scan plus assistant-generated synthetic implementation.

Claim status: discovery-infrastructure evaluation criterion, not medical/veterinary advice.

Privacy status: public-safe; synthetic fixtures only.

Missingness: no production corpus, curator labels, or CI wiring yet.

Revision reason: current frontier scientific AI points toward collaborative, tool-grounded workbenches where the role/handoff chain is part of validity.

Implementation status: schema, fixtures, validator, tests, and README committed.

Evidence strength: moderate.

Falsification route: revise if explicit role-boundary packets fail to improve reviewer agreement, reduce unsupported memory promotion, or clarify audit trails.

Next executable action: wire this validator before evidence-transition promotion and run it beside temporal-contamination, workflow-provenance, and decision-readiness gates.
