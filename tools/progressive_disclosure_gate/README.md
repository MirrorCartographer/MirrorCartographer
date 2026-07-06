# Progressive Disclosure Hypothesis Gate

## Frontier signal

Recent scientific-AI work is moving away from final-answer scoring and toward workflow-grounded evaluation: staged access to research context, tool-supported hypothesis generation, construct-valid benchmarks, and explicit separation between early inference and post-disclosure recall.

Public sources used for this implementation note include:

- Google / Nature Co-Scientist work on tool-grounded hypothesis generation and scientist-in-the-loop steering.
- 2026 critiques of autonomous scientific-discovery benchmarks emphasizing construct validity.
- 2026 progressive-disclosure evaluation work for scientific hypothesis generation under constrained context.
- 2026 biological-agent and scientific-discovery benchmark collections emphasizing workflow realism.

## Design implication

Mirror Cartographer should evaluate whether a hypothesis improves as evidence is disclosed stepwise. A candidate should not be promoted simply because it matches a final conclusion after that conclusion has been revealed.

## Component

This directory contains a semi-executable gate:

- `progressive_disclosure_packet_schema.json` — packet schema for staged hypothesis-evaluation records.
- `fixtures.synthetic.json` — public-safe synthetic fixtures covering early useful inference, late recall, unsupported novelty, and health-adjacent question preparation.
- `score_progressive_disclosure_packets.py` — CLI scorer.
- `test_score_progressive_disclosure_packets.py` — regression tests.

## Run

```bash
python tools/progressive_disclosure_gate/score_progressive_disclosure_packets.py
python tools/progressive_disclosure_gate/test_score_progressive_disclosure_packets.py
```

## Acceptance criteria

The gate passes when it:

1. Promotes an early, grounded, measurable hypothesis produced before full conclusion disclosure.
2. Demotes exact or near-exact conclusion copying after full disclosure.
3. Rejects unsupported causal, cure, diagnosis, or treatment overclaims.
4. Allows health-adjacent or animal-care-adjacent material only as research organization, missingness analysis, or question-prep infrastructure.

## Labels

- Source status: public frontier scan plus assistant-generated synthetic implementation.
- Claim status: discovery-infrastructure hypothesis and executable evaluation gate.
- Privacy status: public-safe; synthetic fixtures only.
- Missingness: no real benchmark corpus, curator labels, or CI integration yet.
- Revision reason: add staged-evidence scoring so MC can distinguish useful early inference from late recall.
- Implementation status: schema, fixture file, CLI scorer, and regression tests committed.
- Evidence strength: moderate; aligned with current frontier direction but not yet validated on MC production traces.
- Falsification route: revise or remove if staged-evidence scoring does not reduce unsupported discovery-memory promotions compared with final-answer-only scoring.
- Next executable action: wire this scorer before evidence-transition promotion and run it against future public-safe benchmark packets.
