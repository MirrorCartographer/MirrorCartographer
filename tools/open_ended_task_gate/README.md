# Open-Ended Scientific Task Gate

## Design implication

Mirror Cartographer should not treat a plausible answer as a discovery task. A candidate discovery task should enter research memory only when it is decomposed into measurable variables, exploratory steps, a dataset boundary, validation logic, and a falsification route.

## Frontier basis

Recent scientific-AI evaluation work is moving away from isolated answer correctness and toward realistic scientific workflows, open-ended data-driven inquiry, evidence handling, validation, and human-AI sensemaking. This gate turns that frontier signal into an executable admission check for MC discovery memory.

## Public-safe scope

This component is for research organization only. It does not provide medical, veterinary, diagnostic, or treatment advice. Fixtures are synthetic. Raw private data is explicitly rejected.

## Interface

Validate one packet or a fixture file:

`python tools/open_ended_task_gate/validate_open_ended_task_packet.py tools/open_ended_task_gate/fixtures.synthetic.json`

Run regression tests:

`python tools/open_ended_task_gate/test_validate_open_ended_task_packet.py`

## Acceptance criteria

A packet passes only if it includes:

- source status
- claim status
- privacy status
- dataset boundary with raw private data disallowed
- at least two measurable variables
- at least two hypothesis-decomposition items
- at least two exploratory steps
- validation plan
- falsification route
- missingness
- revision reason
- implementation status
- next executable action

## Labels

Source status: public frontier scan plus assistant-generated synthetic implementation.

Claim status: discovery-infrastructure claim, not medical or veterinary advice.

Privacy status: public-safe; synthetic fixtures only; raw private data rejected.

Missingness: not wired into CI or the discovery-memory router.

Revision reason: frontier work indicates scientific AI should be evaluated through realistic, open-ended, artifact-grounded workflows rather than final-answer quality alone.

Implementation status: schema, fixtures, validator, regression tests, and README committed.

Evidence strength: moderate. The pattern is supported across frontier benchmark and HCI work, but the exact MC gate remains an infrastructure hypothesis.

Falsification route: revise if curator agreement, unsupported-promotion rate, or open-ended task quality does not improve after routing candidate tasks through this gate.

Next executable action: wire this gate before discovery-memory admission and after temporal-contamination/provenance checks.
