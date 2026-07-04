# Redaction Regression Test Harness

## Core finding

Mirror Cartographer needs a **Redaction Regression Test Harness**: a repeatable test layer that checks whether public artifacts remain public-safe after edits, exports, demos, summaries, diagrams, interface changes, or later recombination with other public-safe fragments.

## Operating line

> A redaction is not finished when private material is removed; it is finished when later system changes cannot accidentally reconstruct, imply, or reattach it.

## Source status

- Source class: private-context-informed architecture synthesis.
- Source boundary: derived from available Mirror Cartographer conversation patterns, saved architectural context, and GitHub-oriented research continuity.
- Public-source dependency: none required for this note.
- Raw source exposure: prohibited.
- Included source material: only abstracted architecture, process requirements, and evaluation criteria.

## Claim status

- Claim type: product/process requirement.
- Evidence level: architecture-derived working requirement, not empirical validation.
- Confidence: medium-high for system design relevance; unvalidated for implementation effectiveness.
- Demotion rule: if future testing shows the privacy model is sufficiently covered by existing gates, demote this from standalone protocol to a checklist section under the public-safe claim or release process.

## Privacy status

- Public-safe: yes.
- Personal detail exposure: none.
- Household, health, animal-care, financial, location, relationship, credential, or raw transcript exposure: none.
- Reconstruction risk: low in isolation; medium if linked to private examples, so examples must be synthetic.
- Required fixture policy: use invented users, invented artifacts, invented transcripts, and invented symbolic material only.

## Missingness

- No repository-wide file inventory was available from code search during this run.
- No existing CI/privacy test suite was verified.
- No current schema for public/private claim labels was fetched.
- No automated redaction classifier has been implemented here.
- No empirical false-positive or false-negative rates exist yet.

## Revision reason

Prior public-safe MC findings establish gates, maturity ladders, claim patterns, synthetic fixtures, demo disclosures, mode transitions, and boundary-aware backlog handling. The missing layer is **regression**: once a public-safe artifact is changed, moved, summarized, or recombined, the system needs proof that the safety boundary still holds.

## Problem

Manual redaction is brittle because Mirror Cartographer artifacts move across forms:

- notes become product requirements;
- requirements become UI behavior;
- UI behavior becomes screenshots or demos;
- demos become public summaries;
- summaries become pitch material;
- pitch material becomes repository documentation;
- repository documentation becomes future model context.

Each conversion can preserve the visible boundary while weakening the hidden one. A test harness gives maintainers a repeatable way to catch boundary drift before publication.

## Product requirement

Every public-facing MC artifact should be eligible for a redaction regression check before release.

Minimum check dimensions:

1. **Direct exposure check** — verifies no private or disallowed detail appears literally.
2. **Near-identifier check** — detects paraphrased details that still identify a private source, person, household, event, condition, location, or credential.
3. **Composite reconstruction check** — checks whether separate safe fragments become unsafe when read together.
4. **Mode-transfer check** — checks whether text moved into UI, diagram, export, demo, or research language changes privacy or evidence status.
5. **Claim-strength check** — checks whether redaction accidentally makes a weaker claim sound more proven.
6. **Synthetic-fixture check** — requires public examples to use invented data unless explicitly approved otherwise.
7. **Label-integrity check** — verifies source status, claim status, privacy status, missingness, and revision reason remain visible.
8. **Release-blocker check** — marks artifacts unsafe when any unresolved private reference is required for comprehension.

## Implementation plan

### 1. Define a public artifact manifest

Each candidate artifact should carry a compact manifest:

- artifact id;
- artifact type;
- intended audience;
- source class;
- privacy status;
- claim status;
- maturity level;
- synthetic fixture status;
- revision reason;
- reviewer or automation status;
- publication decision.

### 2. Create synthetic redaction fixtures

Build test cases using invented material only:

- invented private transcript fragment;
- abstracted public-safe rewrite;
- unsafe rewrite with direct leakage;
- unsafe rewrite with composite leakage;
- unsafe rewrite with overstated claim;
- unsafe interface label;
- safe interface label;
- safe research note.

### 3. Build checklist-first tests

Start with deterministic checklist validation before using classifiers:

- required labels present;
- prohibited category markers absent;
- no raw transcript markers;
- no real identifiers;
- no unbounded claims;
- no public demo without disclosure strip;
- no private-derived example unless syntheticized.

### 4. Add model-assisted review later

A model-assisted pass can flag subtle issues, but should not be the only gate. The output should be treated as review evidence, not final authority.

### 5. Store failures as regression cases

When a public-safe artifact fails review, convert the failure pattern into a synthetic regression fixture. The system should learn the pattern without storing the private material that caused the failure.

## Evaluation criteria

A redaction regression test harness succeeds when it can:

- reject artifacts with direct private leakage;
- reject artifacts with indirect reconstruction risk;
- reject artifacts that lose source/claim/privacy/missingness labels;
- reject artifacts that become misleading after mode transition;
- preserve useful abstract product knowledge without flattening it into generic privacy policy;
- create reusable synthetic tests from failure patterns;
- distinguish safe abstraction from unsafe anonymization theater.

## Research questions

1. What is the smallest manifest that reliably preserves public-safe boundaries across text, UI, diagram, export, and demo surfaces?
2. Which reconstruction risks are detectable by rules, and which require human or model-assisted review?
3. How should MC score a fragment that is safe alone but unsafe in a bundle?
4. What revision threshold should trigger mandatory re-review?
5. Can synthetic fixtures preserve enough structure to test the architecture without copying private signal?
6. How should the system record privacy failures without storing the failure content?

## Public-safe index entry

- Index label: Redaction Regression Test Harness.
- Category: privacy-safe release engineering.
- Related concepts: composite reconstruction risk, public-safe claim gate, synthetic fixture library, interface evidence parity, mode transition audit trail, demo disclosure boundary strip.
- Allowed publication form: abstract method, checklist, synthetic tests, release gate plan.
- Disallowed publication form: private examples, raw source snippets, identity-preserving anecdotes, health/household/location/financial/relationship/credential details.

## Boundary note

This note intentionally avoids proving MC through private examples. Its value is procedural: it defines how public-safe outputs can remain useful while preventing private context from becoming part of the public artifact supply chain.
