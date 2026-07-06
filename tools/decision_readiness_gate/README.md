# Decision Readiness Gate

## Frontier signal

Current frontier scientific-AI work is shifting from isolated answer correctness toward workflow-valid, tool-grounded, human-steerable discovery systems. Co-Scientist emphasizes natural-language steering, tool use, and grounded hypothesis generation. Recent AI-agent scientific benchmark work separates challenges into data analysis, optimization, discovery, and validity. Sensemaking-AI work frames AI as part of evolving human-AI meaning-making networks rather than a passive output generator.

## Actionable MC design implication

Mirror Cartographer should not promote a generated discovery claim to human collaborator review merely because it is plausible. A claim becomes review-ready only when it exposes:

1. the human decision being requested,
2. at least two bounded decision options,
3. measurable variables,
4. provenance chain,
5. uncertainty summary,
6. falsification route,
7. public-safe privacy status,
8. next executable action.

## Component

This directory implements a public-safe **Decision Readiness Gate**:

- `decision_readiness_packet_schema.json` defines the packet contract.
- `fixtures.synthetic.json` contains pass/fail synthetic examples.
- `validate_decision_readiness.py` validates a packet or fixture list.
- `test_validate_decision_readiness.py` runs regression tests without external dependencies.

## Acceptance criteria

A packet passes only if it is public-safe or synthetic, names the collaborator decision surface, includes at least two decision options with tradeoffs and acceptance criteria, specifies at least two measurable variables, and provides provenance plus falsification routing.

## Test command

`python tools/decision_readiness_gate/test_validate_decision_readiness.py`

## Boundary

This is discovery-infrastructure tooling only. It does not provide diagnosis, treatment, veterinary advice, or personal data interpretation.
