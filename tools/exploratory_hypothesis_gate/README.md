# Exploratory Hypothesis Gate

## Purpose

Mirror Cartographer should not promote a plausible answer into discovery memory unless the packet exposes an exploratory-analysis trail: dataset boundary, measurable variables, staged exploration, hypothesis updates, validation plan, and falsification route.

This component converts frontier scientific-AI evaluation signals into an executable admission gate for cure/discovery infrastructure. It is for research organization only, not medical or veterinary advice.

## Frontier source map

- HeurekaBench: frames AI co-scientists around open-ended, data-driven scientific questions, hypothesis-driven exploratory analysis, and iterative reasoning.
- LABBench2: moves biology-agent evaluation toward practical day-to-day research tasks rather than textbook recall.
- Co-Scientist: emphasizes tool-grounded hypothesis generation and scientist steerability.
- Intentmaking and Sensemaking: highlights the need to evaluate how humans define intent and interpret agentic outputs.
- Privacy-preserving federated health AI work: reinforces explicit dataset boundaries and privacy constraints for health-adjacent longitudinal systems.

## Design implication

MC discovery memory should require exploratory structure before promotion:

1. Define allowed and excluded inputs.
2. Identify measurable variables.
3. Require at least three exploratory steps.
4. Require staged hypothesis updates.
5. Reject immediate promotion without earlier hold, revise, or reject stage.
6. Require validation and falsification routes.

## Files

- `exploratory_packet_schema.json` — implementation contract.
- `fixtures.synthetic.json` — public-safe pass/fail fixtures.
- `validate_exploratory_packet.py` — CLI validator.
- `test_validate_exploratory_packet.py` — regression tests.

## Acceptance criteria

- `valid_packet` passes validation.
- `invalid_packet_missing_updates` fails validation.
- A packet with immediate `promote` and no earlier nonfinal stage fails validation.
- No raw sensitive data is required to test the component.

## Run

`python tools/exploratory_hypothesis_gate/test_validate_exploratory_packet.py`

## Labels

Source status: public frontier scan plus assistant-generated synthetic implementation.
Claim status: discovery-infrastructure criterion, not medical or veterinary advice.
Privacy status: public-safe synthetic only.
Missingness: no production corpus, curator labels, or CI wiring yet.
Revision reason: open-ended scientific discovery needs exploratory traces, not static plausible claims.
Implementation status: schema, fixtures, validator, tests, and source map committed.
Evidence strength: moderate.
Falsification route: revise if curator agreement and unsupported-promotion rates do not improve after the gate is applied.
Next executable action: wire this gate before evidence-transition promotion and run it beside progressive-disclosure and temporal-contamination gates.
