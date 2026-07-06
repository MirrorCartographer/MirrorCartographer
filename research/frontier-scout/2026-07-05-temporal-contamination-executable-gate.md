# Frontier Scout: Temporal Contamination Executable Gate

## Public-safe frontier signal

Recent scientific-AI systems and benchmarks increasingly evaluate whether an AI system can support realistic research workflows instead of merely answering static biology questions. Relevant signals include life-science workflow benchmarks, AI co-scientist systems, evolving-literature hypothesis generation, open agentic clinical-research systems, and privacy-preserving/federated medical-AI evaluation. These sources point to one practical risk for Mirror Cartographer: a generated hypothesis can look novel if the evaluator accidentally includes sources published after the hypothesis-generation window.

## Actionable design implication

Mirror Cartographer discovery memory needs a temporal-contamination gate. A discovery packet must separate:

1. generation date,
2. allowed context cutoff,
3. pre-generation evidence,
4. post-generation validation evidence,
5. excluded future-leakage evidence.

The system should not score late recall as discovery. It should only score a hypothesis as validated-after-window when validation evidence appears after generation and was not part of the allowed context window.

## Implemented component

Created executable tool:

- `tools/temporal_contamination_gate/temporal_packet_schema.json`
- `tools/temporal_contamination_gate/fixtures.synthetic.json`
- `tools/temporal_contamination_gate/validate_temporal_packets.py`
- `tools/temporal_contamination_gate/test_validate_temporal_packets.py`

## Acceptance criteria

A packet passes only when:

- privacy status is public-safe, synthetic, or deidentified-public;
- allowed context sources are not dated after the allowed source cutoff;
- validation targets are dated after generation;
- `validated_after_window` packets include at least one post-generation validation target;
- measurable variables are present;
- falsification route is explicit.

A packet fails when:

- future evidence is used as allowed context;
- a validated claim has no post-window validation target;
- private/raw status is present;
- dates are inconsistent;
- falsification route or measurable variables are missing.

## Labels

- Source status: Public frontier scan plus assistant-generated public-safe implementation.
- Claim status: Discovery-infrastructure claim; not a medical, veterinary, or treatment claim.
- Privacy status: Public-safe abstraction only; synthetic fixtures only.
- Missingness: The validator is not yet wired into CI or connected to existing MC hypothesis/evidence gates.
- Revision reason: Convert the temporal-contamination scout finding into executable admission logic.
- Implementation status: Schema, fixtures, validator, and regression tests committed.
- Evidence strength: Moderate. The frontier sources converge on realistic workflow evaluation, tool-grounded scientific AI, and temporally separated discovery evaluation, but MC-specific thresholds remain synthetic until tested on public corpora.
- Falsification route: The gate should be revised if legitimate discovery workflows require validation evidence inside the allowed context window, or if human reviewers consistently judge rejected packets as valid discovery records.
- Next executable action: Add CI wiring and route candidate hypothesis packets through this validator before progressive-disclosure scoring or evidence-transition promotion.
