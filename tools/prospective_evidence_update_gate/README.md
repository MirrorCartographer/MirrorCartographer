# Prospective Evidence Update Gate

Purpose: prevent scientific, medical-AI, mechanistic-biology, neuroscience, longitudinal-health, veterinary, HCI, or privacy-memory hypotheses from becoming reusable discovery memory unless they declare how future evidence will update, weaken, retire, or falsify the claim.

## Frontier scan date

2026-07-07

## Design implication

Frontier scientific AI is moving from one-shot hypothesis generation toward continuous, auditable knowledge metabolism: systems generate hypotheses from an evidence window, then grade or revise them against later evidence, benchmark tasks, workflow traces, or human review. Mirror Cartographer should therefore promote no research hypothesis into reusable memory unless the claim records its evidence cutoff, update trigger, post-window validation route, stale-claim behavior, privacy boundary, missingness, evidence strength, falsification route, and next executable action.

## Source map

| Source | Status | Frontier signal | Implementation implication |
|---|---|---|---|
| Continuous Knowledge Metabolism, arXiv 2604.12243v2, 2026-07-02 revision | preprint; caveat: not peer reviewed | Turns evolving literature into ranked hypotheses and grades against papers published after the generation window | Require evidence window and post-window validation signal before memory promotion |
| LifeBench, arXiv 2603.03781v1, 2026-03-04 | preprint; caveat: simulated benchmark | Tests long-horizon multi-source memory reasoning over temporally extended events | Require temporal scope, missingness, and update behavior for longitudinal memory |
| Agent-Memory Protocol, PMLR 2026 | conference/proceedings | Defines privacy-focused memory operations: redact at rest, pack for purpose, hydrate on return | Require privacy boundary and allowed reuse scope for every updateable memory claim |
| HeurekaBench, EPFL MLBio Lab | benchmark/project page | Evaluates AI co-scientists on open-ended, data-driven scientific questions with iterative reasoning | Require workflow evidence and reconstruction-ready update criteria |
| Anthropic Science: agents in biology, 2026-06-08 | institutional research post; caveat: vendor source | Shows biology agents fail at reliable dataset construction even with strong models | Require source retrieval quality and dataset-construction failure modes |
| Cornell CVM: From Data to Animal Health, Aug 2025-May 2026 | clinical/research institution award page | Builds benchmarks for AI-driven veterinary innovation because animal-health data infrastructure lags | Require species/site/task boundaries before translating human-medical claims to veterinary research infrastructure |
| Virtual Cell Challenge, Cell 2025 | peer-reviewed challenge article | Frames perturbation prediction as a benchmarkable virtual-cell task | Require perturbation validation signals and blocked inference labels for mechanistic biology claims |

## Required labels per packet

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

1. What evidence window produced this hypothesis?
2. What later evidence would update or retire it?
3. What privacy or consent boundary prevents unsafe reuse?
4. What missingness prevents overclaiming?
5. What concrete falsification route exists?
6. What executable action happens next?

## Falsification route for this gate

If prospective-update packets do not improve curator reconstruction accuracy, stale-claim detection, or safe retirement of obsolete hypotheses compared with ordinary source summaries, revise or retire this gate.

## Next executable action

Run:

`python tools/prospective_evidence_update_gate/test_validate_prospective_evidence_update_packet.py`
