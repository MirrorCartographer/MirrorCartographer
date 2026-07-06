# Interpretation Provenance Gate

Frontier discovery scan date: 2026-07-06

## Design implication

Mirror Cartographer should not promote biological, medical, veterinary, neuroscience, or scientific-AI claims into reusable discovery memory unless the packet separates observation, measurement, model inference, human interpretation, and action implications.

The gate is aimed at the current frontier pattern: AI systems are becoming tool-using co-scientists, but the hard failure mode is not only hallucination. It is provenance collapse: measured data, derived features, model explanations, literature priors, and human sensemaking get stored as if they had the same epistemic status.

## Source map

| Source | Status | Claim extracted | Evidence strength | Caveat |
|---|---|---|---|---|
| Stanford HAI longitudinal EHR benchmarks: EHRSHOT, INSPECT, MedAlign | Institutional research infrastructure | Responsible medical AI needs longitudinal, de-identified benchmark datasets and evaluation beyond static prediction | Strong for evaluation infrastructure | Human healthcare only; non-commercial access limits may apply |
| Cornell CVM veterinary AI benchmark award | Veterinary research institution | Veterinary AI lacks standardized, high-quality benchmark datasets across species and domains | Strong for animal-health infrastructure gap | Benchmark is an award/project signal, not a completed universal dataset |
| Frontiers 2026 longitudinal multimodal livestock infrastructure | Peer-reviewed research article | Multimodal animal-health/agriculture data needs temporal-scale-aware workflows and reproducible infrastructure | Moderate-to-strong | Livestock domain may not transfer directly to companion animals |
| SecureBio Predictive Bio Benchmark collaborator call | Research/safeguards program | AI biological prediction and hypothesis generation need held-out, unpublished benchmark tasks and safeguards | Moderate | Program/call; details may remain confidential |
| Sensemaking AI research agenda | HCI research article | AI should support evolving human-AI sensemaking rather than only optimize measurable objectives | Moderate | Conceptual/design agenda rather than clinical validation |

## Gate labels

- Source status: public frontier scan plus synthetic implementation.
- Claim status: discovery-infrastructure criterion, not medical or veterinary advice.
- Privacy status: public-safe synthetic fixtures only; no raw private clinical or animal-care records.
- Missingness: explicitly required at observation, modality, timestamp, and provenance levels.
- Revision reason: prevent provenance collapse when longitudinal observations, model outputs, literature priors, and human interpretations are mixed.
- Implementation status: schema, fixtures, validator, and regression tests committed.
- Evidence strength: moderate.
- Falsification route: revise if curator review shows the gate fails to reduce unsupported memory promotion or blocks well-grounded packets.
- Next executable action: run `python tools/interpretation_provenance_gate/test_validate_interpretation_provenance_packet.py`.

## Required packet logic

A packet passes only when it contains:

1. A bounded research context.
2. At least one raw observation or measurement.
3. A clear derivation chain from observation to interpretation.
4. Explicit separation between human interpretation, model inference, and literature prior.
5. Privacy and data-rights status.
6. Missingness declaration.
7. Falsification route.
8. Next executable action.
