# Release Scope Gate

Date: 2026-06-30

## Core finding

A release is not just a redacted artifact. It is a scoped artifact.

Mirror Cartographer needs an explicit Release Scope Gate before any private-context-informed material becomes public. The gate decides not only what must be removed, but what kind of public object is allowed to exist: method, requirement, evaluation, research question, index, implementation plan, or claim.

## Source status

- File Library / saved-context status: private-context material was used only as architecture input and pattern background. No personal, household, health, animal-care, financial, location, relationship, credential, or raw transcript detail is included here.
- GitHub status: public repository README was directly inspected. It already frames MC as a bounded symbolic reflection interface, not therapy, diagnosis, medical tooling, oracle, source database, or objective truth engine.
- Web research status: current memory-agent and RAG literature was used to support the architectural need for memory admission, schema grounding, temporal validity, and ground-truth preservation.

## Claim status

- Confirmed from public GitHub: MC already includes source status, claim status, audit labels, health-adjacent boundary flag, evidence boundary, grounded next step, update hook, and user feedback loop in the demo description.
- Confirmed from public GitHub: MC already asks whether AI can help map body sensation, metaphor, symbol, and recurring emotional patterns while preserving the boundary between symbol and evidence.
- Research-grounded inference: release review should classify the output type before redaction, because a method note, product requirement, evaluation fixture, and public claim have different proof burdens.
- Design proposal: add a Release Scope Gate to the MC publication pipeline.

## Privacy status

Public-safe. This note contains only abstracted architecture, source-boundary logic, evaluation needs, and implementation planning.

## Missingness

- No raw chat transcript was reviewed or published.
- File Library search is chunk-based and may not represent every MC artifact.
- GitHub code search is unavailable for this repository because the connector reports the repositories as not code-search indexed.
- This note does not claim that the gate is implemented in production.

## Revision reason

Prior MC mind runs built gates for context admission, quarantine, lineage, contestability, temporal validity, compression loss, and revision provenance. The missing layer is release-type classification: what public form is allowed before any content is polished, summarized, or published.

## Release Scope Gate

Every public artifact should receive exactly one primary release scope:

1. Method release — describes how MC handles interpretation, evidence, uncertainty, or privacy.
2. Product requirement release — defines expected behavior without claiming implementation.
3. Evaluation release — defines tests, scorecards, fixtures, or failure cases.
4. Research question release — names what still needs investigation.
5. Privacy-safe index release — lists public-safe categories, not private contents.
6. Implementation plan release — proposes build steps with non-sensitive acceptance criteria.
7. Public claim release — states what the system is or does, requiring the highest proof burden.

## Why this matters

Redaction answers: what must not appear?

Release scope answers: what is this artifact allowed to be?

Without release scope, a private-context-informed insight can accidentally harden into an overbroad public claim. With release scope, MC can publish the method without laundering the private source into public authority.

## Research fit

Recent work on trustworthy memory search frames long-term memory as a trust boundary because semantically related memories can still be contextually inappropriate. Temporal-validity work shows that retrieval systems need explicit status for current versus superseded information. Schema-grounded memory work argues that memory must behave like a verified system of record for exact facts, updates, deletions, relations, and unknowns. Ground-truth-preserving memory work supports preserving episodes while limiting lossy extraction.

## MC fit

MC already contains the ingredients: source labels, claim labels, evidence boundaries, audit flags, user correction, and overreach checks. Release Scope Gate turns those labels into a publication decision rather than a decorative footer.

## Key phrase

Do not only ask what was removed. Ask what the remainder is allowed to become.
