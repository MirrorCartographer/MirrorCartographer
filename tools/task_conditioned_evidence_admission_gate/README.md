# Task Conditioned Evidence Admission Gate

## Purpose

This gate prevents a health, veterinary, neuroscience, mechanistic-biology, or scientific-AI memory from entering a current research workflow merely because it is semantically similar. Admission requires task fit, evidence fit, privacy fit, provenance fit, transfer-boundary fit, and falsification fit.

## Frontier source map

| Source | Status | Claim used | Caveat |
|---|---|---|---|
| Beyond Similarity: Trustworthy Memory Search for Personal AI Agents, arXiv 2606.06054 | preprint, June 2026 | similarity-only memory retrieval can cause cross-domain leakage, sycophancy, tool-call drift, and memory-induced jailbreaks; MemGate adds query-conditioned admission | not clinical validation; personal-agent benchmark setting |
| Deployment-Time Memorization in Foundation-Model Agents, arXiv 2606.10062 | preprint, June 2026 | persistent agent memory creates privacy-utility-deletion tradeoffs; deletion must check derived memory residue | not specific to biomedical/veterinary workflows |
| MemPrivacy, arXiv 2605.09530 | preprint, May 2026 | type-aware placeholders can preserve memory utility while reducing sensitive span exposure | edge-cloud agent framing; benchmark claims need external replication |
| ProAgentBench, arXiv 2602.04482 | preprint, Feb 2026 | real continuous workflows reveal assistance timing signals missed by isolated/synthetic tasks | workplace HCI benchmark, not biomedical outcome benchmark |
| Synthetic Data for Veterinary EHR De-identification, arXiv 2601.09756 | preprint, Jan 2026 | synthetic vEHR notes help as augmentation but are unsafe as full substitute for real supervision under de-identification safety metrics | single study; veterinary de-identification, not diagnosis or treatment |

## Design implication

MC should add a task-conditioned evidence admission layer before reusable discovery-memory or longitudinal health/veterinary memory can influence a hypothesis, prototype requirement, collaborator target, or evaluation claim.

A candidate memory/evidence packet is blocked unless it declares:

1. current task intent,
2. why the evidence is task-relevant beyond semantic similarity,
3. source/provenance status,
4. privacy transformation status,
5. species/domain/modality transfer boundaries,
6. missingness and synthetic-real mismatch,
7. blocked inferences,
8. falsification route,
9. next executable action.

## Labels

- Source status: public frontier scan; mostly preprints; no personal medical/veterinary data used.
- Claim status: infrastructure/evaluation criterion, not medical advice.
- Privacy status: public-safe synthetic schema and fixtures only.
- Missingness: explicit required field; includes absent labels, redactions, synthetic-real mismatch, and incomplete longitudinal windows.
- Revision reason: prior gates captured provenance, revocation, workflow, and null evidence, but not the task-conditioned admission decision itself.
- Implementation status: schema, validator, valid fixture, invalid fixture, and regression test.
- Evidence strength: moderate for memory/privacy-agent infrastructure; exploratory for veterinary EHR transfer.
- Falsification route: compare curator/reviewer error, leakage, and inappropriate cross-domain reuse with and without this gate.
- Next executable action: run `python tools/task_conditioned_evidence_admission_gate/test_validate_task_conditioned_evidence_admission_packet.py`.

## Admission rule

A packet passes only if all required labels are present and:

- task fit is not `semantic_similarity_only`,
- privacy status is not `undeclared`,
- source status is not `unknown`,
- missingness is non-empty,
- blocked inferences are non-empty,
- falsification route is executable,
- next action is concrete.
