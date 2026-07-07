# Experimental Action Unit Gate

## Purpose

The Experimental Action Unit Gate prevents a scientific, biomedical, veterinary, mechanistic, or longitudinal-health hypothesis from being promoted into reusable discovery memory unless the claim is tied to an executable unit of action.

A claim is not considered implementation-ready merely because it has sources, benchmark performance, or plausible reasoning. It must expose what would actually be done next, by whom or what system, on what substrate/data/species/modality, under what privacy boundary, and how failure would be observed.

## Frontier source map

| Source | Source status | Claim status | Design implication extracted |
| --- | --- | --- | --- |
| OpenAI LifeSciBench, 2026-06-17 | Primary benchmark announcement | Public benchmark taxonomy for realistic life-science workflows | Gate claims by workflow phase, not by final answer quality alone: evidence handling, analysis, design/optimization, reasoning, validation/operations, translation, communication. |
| Roberts et al., OpenScientist medRxiv 2026 | Preprint; not peer reviewed | Open, auditable agentic co-scientist for clinical research hypothesis generation | Require audit trace from hypothesis to research action and validation step. |
| Cornell CVM, `From Data to Animal Health`, 2026 | Primary research award/program page | Veterinary AI lacks standardized high-quality benchmark datasets across domains | Animal-health claims must label species/domain/data gap before reuse. |
| Zitnik Lab ToolUniverse / AI agents for science and medicine, 2025-2026 | Lab ecosystem / open tooling claim | AI scientists need tool-grounded reproducible workflows | Require tool/data/action provenance rather than only prose explanation. |
| Qi et al., Artificial Intelligence agents for biological research, 2026 | Peer-reviewed survey in PMC | Biological agents span clinical analytics, literature mining, molecular design, workflow automation | Treat each biological-agent claim as a bounded action unit with substrate and endpoint. |
| Goh, Rethinking bioinformatics expertise, npj Digital Medicine 2026 | Peer-reviewed perspective | AI accelerates bioinformatics but cannot independently verify biological meaning or validity | Require human/expert review class and blocked-inference labels for biological interpretation. |

## Actionable design implication

Mirror Cartographer needs an **Experimental Action Unit Gate** before discovery-memory promotion. Every frontier-science or health-research claim must declare:

1. the hypothesis or claim,
2. the smallest executable action unit,
3. the substrate/data/species/modality involved,
4. the workflow phase,
5. the privacy boundary,
6. what is missing,
7. the falsification route,
8. the next executable action,
9. blocked inferences that must not be reused as fact.

## Required labels

- `source_status`
- `claim_status`
- `privacy_status`
- `missingness`
- `revision_reason`
- `implementation_status`
- `evidence_strength`
- `falsification_route`
- `next_executable_action`

## Evidence strength

Moderate. The design is supported by converging frontier work on realistic life-science workflow benchmarks, open auditable co-scientist systems, veterinary benchmark gaps, biological-agent surveys, and expert-governance arguments. It is not yet validated inside Mirror Cartographer.

## Falsification route

The gate should be revised or rejected if packets that pass it do not improve independent reviewer reconstruction of:

- what action was proposed,
- what evidence supported it,
- what boundary limited it,
- what would falsify it,
- what should happen next.

## Privacy status

Public-safe synthetic implementation only. No personal medical or veterinary advice, no patient record data, no animal-specific treatment claims.

## Implementation status

Implemented as JSON schema, validation CLI, valid fixture, invalid fixture, and regression tests.

## Next executable action

Run:

`python tools/experimental_action_unit_gate/test_validate_experimental_action_unit_packet.py`
