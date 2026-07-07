# Virtual Cell Fidelity Gate

## Purpose

The Virtual Cell Fidelity Gate prevents in-silico perturbation predictions from being promoted into Mirror Cartographer discovery memory unless the packet preserves the boundary between:

- transcriptional or representation-level prediction,
- biologically faithful perturbation effect recovery,
- mechanistic explanation,
- wet/experimental validation,
- clinical or veterinary transfer.

This gate is research-infrastructure only. It is not medical or veterinary advice.

## Frontier scan source map

| Source | Status | Relevant frontier signal | Implementation implication |
|---|---|---|---|
| LABBench2, 2026 preprint and public dataset/eval harness | preprint + open benchmark | Biology-agent evaluation is moving toward realistic scientific work rather than simple knowledge recall. | Require workflow/task boundary and benchmark status before reuse. |
| HeurekaBench, 2026 preprint | preprint benchmark framework | End-to-end co-scientist evaluation should be grounded in real studies, code repositories, and verified workflows. | Require source workflow, code/data boundary, and critique/falsification route. |
| SC-Arena, 2026 preprint | preprint benchmark | Single-cell evaluation needs virtual-cell abstractions plus knowledge-augmented biological correctness rather than brittle string matching. | Require biological-fidelity metric and ontology/literature grounding status. |
| HarmonyCell, 2026 preprint | preprint agent framework | Perturbation modeling fails under semantic metadata heterogeneity and distribution shift unless explicitly handled. | Require semantic harmonization and distribution-shift declarations. |
| SCALE, 2026 preprint | preprint model | Virtual-cell perturbation prediction should prioritize biologically meaningful metrics, such as perturbation-direction correlation and differential-expression overlap, not reconstruction alone. | Block promotion when only reconstruction-like metrics are supplied. |
| OCOO-T, 2026 preprint | preprint model | Scalable perturbation-response models can cover genetic, chemical, and cytokine perturbations, but validation remains benchmark/task-specific. | Require perturbation type, cell context, benchmark, and validation status. |
| ABC-Bench, 2026 preprint | preprint + dual-use benchmark | Agentic biology capability evaluation includes dual-use-sensitive tasks and some wet-lab validation. | Require dual-use flag and explicit experimental-validation status. |

## Design implication

Virtual-cell outputs should enter reusable memory only as bounded research objects. A packet must say what was perturbed, in which cell context, under which semantic mapping, under which distribution shift, by which metrics, with what missingness, and whether any experimental validation exists. It must also say what cannot be inferred.

## Required labels

- source_status
- claim_status
- privacy_status
- missingness
- revision_reason
- implementation_status
- evidence_strength
- falsification_route
- next_executable_action

## Promotion rule

Promote only if:

1. `claim_status` is not `clinical_or_veterinary_action`.
2. At least one biological-fidelity metric is present.
3. Reconstruction-only evaluation is not the sole support.
4. Semantic harmonization is declared.
5. Distribution shift is declared.
6. Missingness and blocked inferences are explicit.
7. Falsification route is executable.

## Privacy note

Fixtures are synthetic and contain no patient, owner, animal, clinic, or sequencing-subject data.
