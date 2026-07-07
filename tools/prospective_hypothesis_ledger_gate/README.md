# Prospective Hypothesis Ledger Gate

## Purpose

This gate prevents a generated scientific or biomedical hypothesis from entering reusable Mirror Cartographer discovery memory unless it can be evaluated prospectively against evidence that appears after the claim window.

It is research-organization infrastructure only. It is not medical or veterinary advice.

## Frontier source map

| Source | Status | Why it matters | Claim status |
|---|---|---|---|
| Gottweis et al., Nature 2026, `Accelerating scientific discovery with Co-Scientist` | peer-reviewed primary research | Scientific agents are moving from answer generation toward tool-grounded hypothesis generation, ranking, review, and iterative scientist feedback. | supports workflow-grounded hypothesis infrastructure |
| Lin et al., arXiv 2026, `A Framework for Longitudinal Health AI Agents` | preprint / framework, caveat pending peer review | Longitudinal health agents need coherent temporal support, evolving priorities, trigger/symptom relationships, and assessment of past interventions. | supports temporal continuity and update accountability |
| Roohani et al., Cell 2025, `Virtual Cell Challenge` | peer-reviewed challenge paper | Perturbation prediction is becoming a benchmarked route toward mechanistic biology, but requires explicit context, validation, and blocked-inference boundaries. | supports prospective biological validation requirement |
| `Generating Scientific Hypotheses from Evolving Literature`, arXiv 2026 | preprint, caveat pending peer review | Continuous Knowledge Metabolism evaluates generated hypotheses against later papers after a generation window. | supports prospective claim ledger structure |
| Cornell CVM, `From Data to Animal Health: Building Benchmarks for AI-Driven Veterinary Innovation` | institutional award/program page | Veterinary AI lacks standardized high-quality datasets and benchmark infrastructure across companion and food-producing species. | supports species/domain missingness labeling |
| HeurekaBench, EPFL MLBio Lab | research benchmark/project page | AI co-scientist evaluation is shifting toward open-ended, data-driven, hypothesis-driven exploratory scientific workflows. | supports reconstructable exploratory workflow criteria |

## Actionable design implication

MC should add a **Prospective Hypothesis Ledger Gate** before promoting hypotheses into discovery memory.

A hypothesis is not reusable as a discovery object until it records:

- evidence cutoff date
- hypothesis generation context
- prediction target
- prospective validation window
- expected evidence type
- domain/species/modality boundary
- privacy status
- missingness
- revision reason
- implementation status
- evidence strength
- falsification route
- next executable action

## Labels required by the gate

- source_status
- claim_status
- privacy_status
- missingness
- revision_reason
- implementation_status
- evidence_strength
- falsification_route
- next_executable_action

## Evaluation criterion

A packet passes only if a reviewer can answer:

1. What did the system believe before the evidence cutoff?
2. What later evidence would confirm, weaken, or falsify it?
3. Which boundaries block translation into medical, veterinary, species-wide, or mechanistic claims?
4. What action can be executed next without asking for missing context?

## Falsification route

This gate should be revised or removed if prospective-ledger packets do not improve later curator reconstruction accuracy, stale-claim detection, or hypothesis update quality compared with ungated notes.

## Next executable action

Run:

`python tools/prospective_hypothesis_ledger_gate/test_validate_prospective_hypothesis_ledger_packet.py`
