# Citation Load Boundary

## Core finding
A cited source can still be asked to carry too much.

Mirror Cartographer should not treat citation, memory, or repository presence as automatic authority. Every claim needs a load check: what kind of claim is being made, what source supports it, what private material was excluded, what remains missing, and whether the public artifact can safely stand without private-context leakage.

## Source status
- Public repository README: public, directly inspectable project source.
- Uploaded Mirror Cartographer public-facing packets and atlas excerpts: private-uploaded artifacts used only for architecture understanding and abstractable requirements.
- Saved/private context: used only as non-public orientation material; no personal, household, health, animal-care, financial, location, relationship, credential, or raw transcript detail is included here.
- Fresh external research: public web/arXiv search results on long-term memory, temporal validity, trustworthy memory search, and privacy-preserving RAG.

## Claim status
- Confirmed from public repo: MC is bounded symbolic reflection, not therapy, diagnosis, oracle, source database, or objective truth engine.
- Confirmed from public repo: existing demo requirements include source status, claim status, audit labels, evidence boundaries, grounded next step, update hook, and user feedback loop.
- Confirmed from uploaded MC artifacts: the atlas already uses epistemic labels and treats traceability, modularity, and explicit epistemic status as design requirements.
- Inferred design requirement: source sufficiency must be checked separately from source presence.
- Bounded research hypothesis: MC should implement a citation-load evaluator before public release of proof packets, papers, claims, demos, or indexes.

## Privacy status
Public-safe. This note contains only abstract methods, requirements, source-boundary notes, evaluation logic, and implementation planning. It intentionally excludes private examples, raw transcript language, identities, household details, health/animal-care specifics, finances, location traces, relationship details, and credentials.

## Missingness
- No full repository-wide code audit was completed in this run.
- The current note does not verify every existing `docs/` artifact listed in the README.
- The note does not claim that MC currently has an implemented automated citation-load evaluator.
- External research was used directionally; primary implementation still requires local product testing.

## Revision reason
Prior mind entries established admission gates, release scope, claim routing, public indexes, and source survivability. The remaining gap is narrower: a source may be admissible and still insufficient for the weight of a specific claim. This entry adds the missing load-bearing layer.

## Rule
Do not only ask whether a source is real. Ask whether it can survive the claim placed on it.

## Citation-load dimensions
1. **Domain fit** — Does the source belong to the domain of the claim?
2. **Specificity fit** — Does the source support this exact claim or only a neighboring idea?
3. **Temporal fit** — Could the source be stale, superseded, or time-bound?
4. **Privacy fit** — Can the claim be published without exposing the private path that produced it?
5. **Authority fit** — Is the source authoritative enough for the claim's consequence level?
6. **Boundary fit** — Does the source preserve MC's boundary between symbol, hypothesis, evidence, and action?
7. **Missingness fit** — Does the output visibly state what has not been checked?
8. **Revision fit** — Does the artifact explain why the claim changed, tightened, softened, or was rejected?

## Product requirement
Any public MC artifact that uses citations or internal source references should include a `citation_load` field:

- `none`: no source support supplied; claim must remain framing, question, or hypothesis.
- `light`: source supports background or analogy only.
- `partial`: source supports one part of the claim but not the whole claim.
- `adequate`: source supports the claim at the intended level.
- `overloaded`: claim asks the source to carry more than it can justify.
- `blocked`: publication would require private, unsafe, missing, or non-consented source exposure.

## Evaluation criterion
A model response, repo artifact, or demo output fails the citation-load boundary if it:

- cites a source for a broader claim than the source supports;
- uses private context as invisible evidence for a public claim;
- hides missingness behind confident phrasing;
- turns symbolic recurrence into proof;
- treats repository presence as product implementation;
- treats research relevance as validation of MC effectiveness;
- cites current research but ignores temporal validity;
- removes private details while leaving a claim that can only be understood through them.

## Implementation plan
1. Add `citation_load` to MC artifact templates.
2. Add a pre-publication checklist for README updates, papers, proof packets, demo claims, and indexes.
3. Route overloaded claims to one of four outcomes: narrow, relabel, add source, or block.
4. Store revision reason whenever a claim is narrowed or blocked.
5. Add fixture tests with intentionally overloaded sources.
6. Display a public-safe missingness note when a private source shaped architecture but cannot be cited.

## Research questions
- Can users distinguish an adequate citation from an overloaded citation when labels are visible?
- Does citation-load labeling reduce overtrust without making the interface feel unusable?
- Which claims most often overload sources: safety, product maturity, research validation, symbolic interpretation, or user impact?
- Can automated checks detect when a claim uses private architecture memory as hidden public proof?

## Public-safe index tags
- source-boundary
- citation-load
- claim-routing
- public-proof
- privacy-safe-index
- temporal-validity
- memory-admission
- evidence-boundary

## Status
Public-safe research note. Not an implemented runtime feature yet.