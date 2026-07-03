# Mirror Cartographer GitHub Mind

This repository is organized as a human-readable and agent-operable knowledge system.

The purpose is not to accumulate documents. The purpose is to maintain claims, evidence, boundaries, tests, downgrades, and public proof artifacts in a way that can be audited.

## Core lanes

### 1. Human lane

Path: `mind/human/`

Purpose: plain-language orientation for people reading the project.

Use for:

- project overview;
- current state summaries;
- public-safe explanations;
- reader guides;
- glossary of terms;
- “what this means” pages.

Rule: humans should not need to read every evidence map to understand the current state.

### 2. Agent lane

Path: `mind/agent/`

Purpose: operational instructions for AI agents working in the repo.

Use for:

- write rules;
- source-classification rules;
- claim-status transition rules;
- folder routing rules;
- audit procedures;
- anti-overclaim constraints.

Rule: agents should know where to write, how to classify evidence, and when to downgrade claims.

### 3. Claim lane

Path: `mind/claims/`

Purpose: canonical claims and their current status.

Use for:

- claim registry;
- claim graph;
- active claims;
- retired claims;
- superseded claims;
- contradiction map;
- confidence history.

Rule: evidence maps should support claims, not replace the claim registry.

### 4. Evidence lane

Path: `mind/evidence-maps/`

Purpose: individual evidence reviews.

Use for:

- researched evidence maps;
- fact/inference separation;
- source review;
- claim-status update proposals;
- evaluation criteria;
- falsification checklists.

Rule: an evidence map is not validation by itself.

### 5. Evidence quality lane

Path: `mind/evidence-quality/`

Purpose: source reliability, citation verification, and evidence weighting.

Use for:

- source reliability matrix;
- Evidence Reliability Score architecture;
- source-to-claim support ledgers;
- citation audits;
- freshness audits;
- evidence-weight audits.

Rule: citation count does not equal confidence.

### 6. Evaluation lane

Path: `mind/evaluation/`

Purpose: tests, gates, scoring sheets, pilots, and validation attempts.

Use for:

- prespecified proof gates;
- pilot designs;
- reviewer scorecards;
- reproducibility tests;
- construct-validity audits;
- red-team tests.

Rule: this is where claims become tested or fail.

### 7. Safety boundary lane

Path: `mind/safety-boundaries/`

Purpose: hard boundaries for health, memory, crisis, relational risk, privacy, and agency.

Use for:

- clinical boundary;
- memory reconstruction boundary;
- emotional dependency boundary;
- crisis handoff boundary;
- privacy/no-save boundary;
- accessibility boundary.

Rule: aesthetic or symbolic value cannot override safety boundaries.

### 8. Product lane

Path: `mind/product/`

Purpose: MC feature architecture and product decisions.

Use for:

- feature specs;
- UX flows;
- tone paths;
- symbolic map design;
- glossary design;
- accessibility implementation;
- proof-film interface design.

Rule: product claims must link back to claim and evaluation lanes.

### 9. Opportunity lane

Path: `mind/opportunity/`

Purpose: career, money, market, and role-fit work.

Use for:

- opportunity proof packets;
- role-fit ledgers;
- salary-source ledgers;
- job-posting validation;
- portfolio proof;
- market validation.

Rule: role fit is not application readiness, and salary is not opportunity proof.

### 10. Public proof lane

Path: `mind/public-proof/`

Purpose: artifacts that outside readers can inspect quickly.

Use for:

- proof packets;
- proof film;
- public summaries;
- buyer/employer-facing evidence;
- one-page demos;
- audit snapshots.

Rule: public proof must preserve uncertainty and must not overclaim.

### 11. Ledgers lane

Path: `mind/ledgers/`

Purpose: structured change history.

Use for:

- negative results;
- downgrade ledger;
- contradiction ledger;
- retirement ledger;
- source-support ledger;
- incident/near-miss ledger.

Rule: failed or weakened claims are evidence, not embarrassment.

### 12. Archive lane

Path: `mind/archive/`

Purpose: historical artifacts no longer serving as current guidance.

Use for:

- obsolete drafts;
- superseded evidence maps;
- retired claims;
- deprecated schemas;
- historical context.

Rule: archive preserves memory without letting obsolete claims drive confidence.

## Routing rules

When creating a new artifact:

1. If it changes what is believed, update `mind/claims/`.
2. If it reviews sources, place it in `mind/evidence-maps/` or `mind/evidence-quality/`.
3. If it defines a test, place it in `mind/evaluation/`.
4. If it records failure, contradiction, or downgrade, place it in `mind/ledgers/`.
5. If it explains the project to humans, place it in `mind/human/`.
6. If it tells agents how to work, place it in `mind/agent/`.
7. If it is for outside readers, place it in `mind/public-proof/`.
8. If it is no longer active, move or copy its status into `mind/archive/`.

## Current highest-priority work

The repo now needs fewer new evidence maps and more executed audits:

- ERS-AUDIT-01: evidence reliability scoring across recent maps.
- MC-CLAIM-SUPPORT-AUDIT-01: source-to-claim verification.
- MC-EVIDENCE-DRIFT-AUDIT-01: freshness and drift review.
- MC-ACCESSIBILITY-VALIDATION-PILOT-01: accessibility evidence.
- MC-SOMATIC-BOUNDARY-VALIDATION-PILOT-01: body-map safety leakage.
- MC-MIRROR-SAFETY-DIFFERENTIAL-PILOT-01: mirroring benefit versus epistemic risk.

## Global rule

No artifact is allowed to upgrade confidence merely because it is detailed, beautiful, cited, structured, or emotionally resonant.

Confidence changes only when evidence quality, direct support, independent corroboration, empirical validation, or successful falsification attempts improve.
