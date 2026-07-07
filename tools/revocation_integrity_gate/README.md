# Revocation Integrity Gate

## Purpose

The Revocation Integrity Gate prevents longitudinal health, veterinary, scientific, or personal-memory claims from becoming durable reusable memory unless the system can show how the memory can be revoked, redacted, downgraded, or re-scoped without corrupting downstream hypotheses.

## Frontier scan source map

| Source | Source status | Claim status | Design extraction |
|---|---|---|---|
| Co-Scientist, Nature 2026 | peer-reviewed primary research | supports tool-grounded hypothesis workflows, not autonomous truth | Scientific AI needs preserved workflow state and user-steerable revision paths. |
| MemPrivacy, arXiv 2026 | preprint; caveat: not clinical validation | supports privacy-aware span detection / transformation for agent memory | Memory writes should expose privacy-sensitive spans and redaction behavior before reuse. |
| Agent-Memory Protocol, PMLR 2026 | peer-reviewed workshop/proceedings | supports protocol-level privacy controls for LLM agent memory | Memory systems need operation boundaries, not only semantic retrieval. |
| Stanford HAI longitudinal EHR benchmark datasets, 2025 | research-institution benchmark report | supports rigorous evaluation of longitudinal healthcare AI | Longitudinal claims need update/revocation handling because evidence windows change. |
| Veterinary AI infrastructure reports / livestock early-warning work, 2026 | institutional/news-supported; caveat: heterogeneous validation | supports need for animal-health data pipelines | Cross-species or animal-health memories need explicit rollback when sensor or species assumptions fail. |

## Actionable design implication

Any reusable claim packet must carry a revocation integrity section: deletion route, redaction route, downgrade route, downstream dependency list, revalidation trigger, privacy impact after removal, missingness, evidence strength, falsification route, and next executable action.

## Labels

- Source status: public frontier scan; mixed primary, preprint, institutional, and infrastructure signals.
- Claim status: architecture/evaluation criterion, not medical or veterinary advice.
- Privacy status: synthetic/public-safe implementation only; no personal health data stored.
- Missingness: required field; must identify unknown dependencies, hidden caches, unverifiable downstream reuse, or untracked copies.
- Revision reason: prior gates control promotion; this gate controls safe removal and claim degradation after memory changes.
- Implementation status: schema, validator, fixtures, and regression tests added.
- Evidence strength: moderate; strong conceptual convergence, limited direct benchmark standardization for revocation-integrity scoring.
- Falsification route: if revoked memories leave no measurable downstream claim changes, stale dependency alerts, or privacy-risk reduction, the gate fails and must be redesigned.
- Next executable action: run `python tools/revocation_integrity_gate/test_validate_revocation_integrity_packet.py`.

## Non-advice boundary

Medical and veterinary examples are treated only as research-organization and data-governance scenarios. This tool does not diagnose, treat, or recommend care.
