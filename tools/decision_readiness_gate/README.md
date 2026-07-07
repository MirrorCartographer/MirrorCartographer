# Decision Readiness Gate

## Frontier scout finding

Current scientific-AI work is converging on a harder requirement than plausible hypothesis generation: the system must expose whether a result is decision-ready, what ambiguity remains, and what consequence class follows if the claim is wrong.

## Source map

| Source | Status | Relevant signal |
|---|---|---|
| OpenAI GeneBench-Pro, 2026-06-30 | Primary benchmark announcement; paper linked as preprint | Measures whether AI agents navigate ambiguity and make consequential judgments in computational biology. |
| LABBench2, arXiv 2026-04 / FutureHouse dataset + public harness | Preprint plus reproducible benchmark assets | Pushes biology-agent evaluation toward harder, practical research tasks instead of saturated/simple tasks. |
| Nature Co-Scientist, 2026 | Peer-reviewed research article | Uses tool grounding, hypothesis generation, reflection, ranking, evolution, scientist-in-the-loop steering, and experimental validation. |
| Cornell VETNET benchmark initiative, 2025-2026 | Institutional grant/project page | Veterinary AI requires live benchmarks that respect species diversity, varied modalities, ethics, law, and updatable interfaces. |
| npj Digital Medicine synthetic/privacy-preserving clinical data collection, open through 2027-06-03 | Journal collection / call for research | Emphasizes longitudinal trajectories, multimodal data, privacy-preserving infrastructure, utility/privacy evaluation, provenance, and real-world validation. |

## Actionable MC design implication

Mirror Cartographer should not promote a health, biology, neuroscience, animal-health, or scientific-AI claim from exploratory memory into reusable discovery memory merely because it is plausible. A claim becomes decision-ready only when it exposes:

1. the human decision being requested,
2. the consequence class if the claim is wrong,
3. the ambiguity register,
4. at least two bounded decision options,
5. measurable variables,
6. evidence that would make the claim decision-ready,
7. evidence that would block or downgrade the claim,
8. provenance chain,
9. uncertainty summary,
10. falsification route,
11. public-safe privacy status,
12. next executable action.

## Component

This directory implements a public-safe **Decision Readiness Gate**:

- `decision_readiness_packet_schema.json` defines the packet contract.
- `fixtures.synthetic.json` contains pass/fail synthetic examples.
- `validate_decision_readiness.py` validates a packet or fixture list.
- `test_validate_decision_readiness.py` runs regression tests without external dependencies.

## Acceptance criteria

A packet passes only if it is public-safe or synthetic, names the collaborator decision surface, includes consequence class, ambiguity register, readiness evidence, blocking evidence, at least two decision options with tradeoffs and acceptance criteria, at least two measurable variables, provenance, uncertainty, and falsification routing.

## Test command

`python tools/decision_readiness_gate/test_validate_decision_readiness.py`

## Boundary

This is discovery-infrastructure tooling only. It does not provide diagnosis, treatment, veterinary advice, or personal data interpretation.

## Labels

- Source status: public frontier scan; primary/institutional/preprint sources preferred.
- Claim status: discovery-infrastructure criterion, not medical or veterinary advice.
- Privacy status: public-safe synthetic schema only; no personal or clinical data included.
- Missingness: required field in schema and fixture.
- Revision reason: frontier benchmarks increasingly evaluate ambiguity handling, consequential judgment, workflow validity, and knowing when a result is decision-ready.
- Implementation status: schema, validator, fixtures, tests, and source map updated.
- Evidence strength: moderate; benchmark/infrastructure convergence is clear, but MC-specific impact still requires evaluation.
- Falsification route: reject or revise if applying the gate does not reduce unsupported promotion of ambiguous claims during curator review.
- Next executable action: run `python tools/decision_readiness_gate/test_validate_decision_readiness.py`.
