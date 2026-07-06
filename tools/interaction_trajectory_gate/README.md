# Interaction Trajectory Gate

## Frontier signal

Current scientific-AI and HCI frontier work is shifting evaluation away from isolated final answers and toward auditable scientific workflows, tool-grounded hypotheses, interaction trajectories, and sensemaking quality over time.

Relevant public signals:

- Co-Scientist: tool-grounded hypothesis generation with scientist steering and feedback.
- Biomedical AI-agent benchmarks: domain tasks across drug discovery, omics, EHR modeling, genetics, and validity categories.
- Sensemaking AI / interaction-centered intelligence: interaction trajectories and interpretive flexibility as units of analysis.
- NeuroAI and neuroscience benchmarks: grounded analysis of real data rather than fact recall.

## MC design implication

Mirror Cartographer should score not only whether a generated research claim sounds plausible, but whether the human-AI interaction moved a claim into a better research state:

1. more measurable,
2. more falsifiable,
3. more evidence-bounded,
4. less private,
5. less drift-prone,
6. less likely to promote unsupported claims.

This gate treats interaction as a longitudinal research object. It is designed for cure/discovery infrastructure, not medical or veterinary advice.

## Component

Files:

- `trajectory_packet_schema.json` — public-safe packet shape.
- `fixtures.synthetic.json` — pass/fail examples.
- `validate_interaction_trajectory.py` — CLI validator.
- `test_validate_interaction_trajectory.py` — regression tests.

## Acceptance criteria

A packet passes only when:

- it uses public-safe or deidentified data;
- the post-interaction state contains measurable variables;
- falsification is explicit;
- privacy risk does not increase;
- unsupported promotion count is zero;
- verified evidence boundaries require checked source or test events;
- at least one sensemaking event explains the state transition.

## Test command

```bash
python tools/interaction_trajectory_gate/test_validate_interaction_trajectory.py
```

## Falsification route

Revise or reject this gate if curator agreement, unsupported-promotion rate, or downstream evidence-transition quality does not improve when interaction trajectory packets are required before discovery-memory admission.
