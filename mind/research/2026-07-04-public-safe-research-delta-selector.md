# Public-Safe Research Delta Selector

Date: 2026-07-04
Status: public-safe abstract research note

## Core finding

Mirror Cartographer needs a **Public-Safe Research Delta Selector**: a method for deciding what the next GitHub-mind research pass should add when the repository already contains many adjacent governance notes.

Operating line: **A research loop should not become more intelligent by repeating itself; it should become more intelligent by proving what new boundary, test, or implementation path it adds.**

## Source status

- **Private-context source status:** Used only as architectural orientation. No raw transcript details, personal facts, household facts, health facts, animal-care facts, financial facts, location facts, relationship facts, credentials, or private identifiers are included here.
- **File-library source status:** Public-safe synthesis used from uploaded MC materials describing MC as a symbolic cognition / reflection system with modes, consent, accessibility, source-boundary needs, ghost/gremlin concepts, and evidence gates. Specific private examples were excluded.
- **GitHub source status:** Existing repository commit history shows multiple already-added public-safe governance artifacts, including public-safe lineage, interpretation-budget, fixture, evidence-boundary, demo-disclosure, and personalization-boundary notes. This note therefore adds a selector layer rather than another single-purpose ledger.
- **External-web source status:** Not used in this pass; the finding is internal architecture/governance design, not a time-sensitive external factual claim.

## Claim status

| Claim | Status | Basis | Required next proof |
|---|---|---|---|
| MC already has multiple public-safe governance notes. | Source-bound | GitHub commit search results from connected repository. | Periodic repository index generation. |
| MC needs a way to choose non-duplicative next research units. | Inferred requirement | Recurring research loop plus dense existing governance-note trail. | Add a machine-readable selector schema and run it against prior notes. |
| Public-safe publishing requires delta reasoning, not only redaction. | Design claim | Boundary-safe method: avoid exposing private source material and avoid repeating known abstractions. | Test with synthetic examples of duplicate vs novel findings. |
| The selector should label source, claim, privacy, missingness, and revision reason before a note is publishable. | Product requirement | User-specified publishing constraints plus existing evidence-gate pattern. | Implement as checklist/template in repo. |

## Privacy status

- **Privacy classification:** Public-safe.
- **Included:** Abstract methods, source-boundary logic, product requirement, evaluation criteria, implementation plan.
- **Excluded:** Personal, household, health, animal-care, financial, location, relationship, credential, and raw transcript details.
- **Composite reconstruction risk:** Low in this note because it describes process mechanics rather than unique life content.
- **Boundary rule:** The selector may reference private-context existence as source class only; it must not quote or summarize the private content itself.

## Missingness

The current research loop is missing a formal way to answer these questions before each new GitHub note is created:

1. **What is new here?**
   - New label?
   - New evaluation criterion?
   - New implementation path?
   - New failure mode?
   - New schema field?
   - New relationship among existing notes?

2. **What prior note does it overlap?**
   - If overlap is high, update an index or create a synthesis instead of creating a near-duplicate note.

3. **What boundary did the idea cross?**
   - Chat context to public artifact.
   - File-library synthesis to public method.
   - Private memory to abstract requirement.
   - GitHub history to next implementation plan.

4. **What proof type is required next?**
   - Schema.
   - Fixture.
   - Test.
   - UI requirement.
   - Documentation index.
   - Human review checklist.

## Proposed selector schema

Each candidate research note should be scored before publication:

| Field | Values | Purpose |
|---|---|---|
| `candidate_title` | short title | Names the proposed note. |
| `delta_type` | new / synthesis / revision / implementation / fixture / index | Prevents vague accumulation. |
| `nearest_existing_artifact` | path or commit message | Forces overlap awareness. |
| `novelty_claim` | one sentence | States what this adds. |
| `source_classes_used` | private-context / file-library / repo / web / synthetic | Keeps source boundaries explicit. |
| `privacy_status` | public-safe / blocked / needs redaction / synthetic-only | Prevents accidental leakage. |
| `claim_status` | source-bound / inferred / speculative / requirement / testable | Prevents coherence from masquerading as proof. |
| `missingness` | list | States what is not known yet. |
| `revision_reason` | new gap / duplicate avoided / prior note corrected / implementation unlocked | Explains why this artifact exists. |
| `next_artifact` | schema / test / fixture / UI spec / index / research note | Converts research into build path. |

## Evaluation criteria

A future MC research pass should only publish a new note when at least one is true:

1. **Boundary gain:** It improves privacy, consent, source, or claim-boundary handling.
2. **Implementation gain:** It converts a prior abstraction into a buildable schema, fixture, UI requirement, or test.
3. **Index gain:** It reduces ghost-state accumulation by linking existing notes into a navigable map.
4. **Evidence gain:** It defines a clearer proof standard or failure condition.
5. **Revision gain:** It corrects or narrows a prior artifact because the old version was incomplete, overbroad, stale, or ambiguous.

A future pass should avoid publishing when:

- The new note only renames an existing ledger.
- The note depends on private examples that cannot be safely abstracted.
- The claim would become stronger in public than its source status allows.
- The artifact creates more taxonomy without giving a next implementation action.

## Product requirement

Add a lightweight `research_delta_selector` step before each GitHub-mind write:

1. Search recent MC research commits.
2. Compare proposed finding against nearest existing artifacts.
3. Assign delta type and claim status.
4. Block or revise if privacy or duplication risk is high.
5. Publish only if the note adds a boundary, implementation, index, evidence, or revision gain.

## Implementation plan

Recommended next GitHub artifacts:

1. `mind/schema/research_delta_selector.schema.json`
2. `mind/fixtures/research_delta_selector/passing_new_boundary_gain.json`
3. `mind/fixtures/research_delta_selector/blocked_duplicate_taxonomy.json`
4. `mind/fixtures/research_delta_selector/needs_redaction_private_example.json`
5. `mind/indexes/public_safe_research_map.md`

## Meaningful revision reason

This note exists because the repository has accumulated many valid public-safe governance fragments. The next improvement is not another isolated boundary phrase; it is a selection mechanism that makes future research runs less repetitive, more testable, and more implementation-directed.
