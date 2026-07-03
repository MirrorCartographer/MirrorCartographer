# Agent Write Rules

Purpose: make the GitHub mind usable by agents without letting agents inflate confidence.

## Required before writing

Before adding an artifact, classify it as one of the following:

- evidence map;
- claim update;
- evaluation plan;
- executed evaluation;
- safety boundary;
- source-quality audit;
- opportunity artifact;
- public proof artifact;
- ledger entry;
- archive/historical context.

## Required fields for evidence artifacts

Every evidence artifact must include:

- claim tested;
- current claim ID or proposed claim ID;
- evidence found;
- fact vs inference;
- source role classification;
- source quality notes;
- contradiction search status;
- claim-status update;
- evaluation criterion;
- falsification checklist;
- next proof needed.

## Source classification rule

Do not write “source supports claim” unless the exact claim is directly supported.

Use one of these labels instead:

- direct support;
- partial support;
- indirect support;
- background/context only;
- navigation only;
- contradicts;
- not relevant after inspection.

## Confidence transition rule

A claim may not be upgraded because:

- the artifact is detailed;
- many citations exist;
- the source is prestigious but indirect;
- the output is emotionally resonant;
- a human or AI reviewer liked it;
- an LLM judge passed it;
- GitHub commit history exists.

A claim may be upgraded only when at least one of these improves:

- direct evidence;
- source independence;
- empirical validation;
- replication;
- reviewer agreement under a prespecified protocol;
- contradiction adjudication;
- provenance completeness;
- safety-boundary pass rate.

## Downgrade rule

If an artifact discovers an overclaim, create or update a ledger entry.

Use:

- `mind/ledgers/downgrade-ledger.md` for confidence reductions;
- `mind/ledgers/negative-result-ledger.md` for failed or inconclusive tests;
- `mind/ledgers/contradiction-ledger.md` for unresolved conflict;
- `mind/archive/` for retired or superseded artifacts.

## Folder routing

- Human-readable project state: `mind/human/`
- Agent instructions: `mind/agent/`
- Canonical claims: `mind/claims/`
- Evidence maps: `mind/evidence-maps/`
- Evidence reliability and source checks: `mind/evidence-quality/`
- Tests and pilots: `mind/evaluation/`
- Safety boundaries: `mind/safety-boundaries/`
- Product architecture: `mind/product/`
- Career / market / role work: `mind/opportunity/`
- Public-facing proof: `mind/public-proof/`
- Ledgers: `mind/ledgers/`
- Obsolete or superseded materials: `mind/archive/`

## Stop condition

If a proposed artifact would only restate a previous governance principle, do not create another evidence map. Instead, update the claim registry, evidence quality ledger, or next-proof audit queue.
