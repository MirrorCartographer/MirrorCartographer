# Return Artifact Redaction Contract

Date: 2026-07-03
Status: public-safe research note
Repository zone: `mind/research`

## Core finding

Mirror Cartographer needs a **Return Artifact Redaction Contract**: a protocol that separates a useful private session artifact from a publishable artifact. Exportability is not the same as public safety.

Operating line:

> A reflection may be ready to return to the user before it is safe to leave the room.

## Why this exists

Mirror Cartographer has an established pattern of producing return artifacts: reflection cards, session summaries, maps, prompts, exports, and trajectory nodes. Those artifacts can be valuable because they preserve continuity, contradiction, symbolic state, mode selection, uncertainty labels, and resonance feedback.

The risk is that a well-structured artifact can feel publication-ready while still carrying private residue. Structure can make private material look cleaner without making it public-safe. MC therefore needs a formal boundary between:

1. **Private return artifact** — useful for the originating user or session.
2. **Internal architecture artifact** — useful for system development, debugging, and future design.
3. **Public research artifact** — safe to publish as method, requirement, question, evaluation, or implementation plan.
4. **Synthetic demonstration artifact** — rebuilt from public or synthetic material to show the method without exposing private origin.

## Source status

- Source classes reviewed: saved architectural context, file-library specifications, prior MC public-boundary notes, and repository research-note pattern.
- Raw transcript status: not quoted, copied, summarized, or published.
- Personal-context status: used only to infer architecture requirements; not exposed.
- File status: private file contents were consulted only at the level of abstract architecture features such as modes, uncertainty labels, resonance feedback, session memory, contradiction logs, and exportable artifacts.
- GitHub status: this note is written to the public repository as a method requirement, not as a disclosure of private source material.

## Claim status

This note makes a product-safety and information-architecture claim.

Allowed claim:

- MC needs a redaction contract before any private return artifact is converted into public documentation, demos, examples, training material, marketing material, or research notes.

Not claimed:

- That any specific private session, person, household, health matter, animal-care matter, financial matter, location, relationship, credential, or raw transcript caused this requirement.
- That all prior exports are unsafe.
- That redaction alone is sufficient for publication.
- That the protocol is already implemented in product code.

## Privacy status

Privacy class: public-safe abstraction.

Excluded content classes:

- Personal biography
- Household details
- Health details
- Animal-care details
- Financial information
- Location data
- Relationship details
- Credentials or access details
- Raw transcript fragments
- Identifying anecdotes
- Session-specific chronology
- Rare phrasing that could point back to a private interaction

Allowed content classes:

- Artifact boundary methods
- Product requirements
- Source-boundary notes
- Evaluation criteria
- Research questions
- Redaction checklists
- Synthetic example plans
- Implementation plans

## Artifact classes

### A0 — Synthetic public artifact

Created from public or synthetic input. Contains no private source residue.

Allowed use:

- Public demo
- Documentation
- Test fixture
- Evaluation example

Required label:

- `source_status: synthetic_or_public`
- `privacy_status: public-safe`
- `claim_status: method_demo_or_test_fixture`

### A1 — Public-safe derived method artifact

Inspired by private context but rewritten as general method, requirement, evaluation criterion, or implementation plan.

Allowed use:

- Public research note
- Product requirement
- Evaluation rubric
- Architecture plan

Required label:

- `source_status: private-inspired_public-abstracted`
- `privacy_status: public-safe_abstraction`
- `claim_status: method_requirement_or_hypothesis`
- `missingness: private source withheld; external validation pending if empirical`

### A2 — Internal development artifact

Useful for system building but still too close to private source patterns, chronology, or phrasing.

Allowed use:

- Internal analysis
- Rewrite input
- Debugging
- Non-public design notes

Required action:

- Do not publish.
- Convert to A1 or A0 before public use.
- Remove private sequence, specificity, and voice residue.

### A3 — Private return artifact

Created for a specific session/user/context. It may contain high-context meaning, emotionally specific phrasing, private symbols, raw input, or sensitive inference.

Allowed use:

- Return to originating user only, according to consent settings.
- Store only under the selected persistence/privacy mode.

Required action:

- Do not publish.
- Do not use as demo material.
- Do not convert into training or marketing material without explicit boundary transformation.

### A4 — Blocked artifact

Contains direct private data, sensitive content, identifying details, credentials, raw transcript material, or material that creates a reasonable re-identification path.

Allowed use:

- None for public output.

Required action:

- Block publication.
- Replace with synthetic equivalent or boundary-class method note.

## Redaction contract

Before any return artifact leaves private use, it must pass these checks:

1. **Identity removal is not enough.** Remove names, but also remove rare sequence, relationship structure, location hints, health or animal-care references, financial traces, credential traces, and private chronology.
2. **Mode must stay attached.** Canonical, Reflective, Mythopoetic, or other modes must remain visible so tone does not masquerade as truth.
3. **Claim type must stay attached.** Fact, inference, symbolic interpretation, speculation, user-confirmed pattern, and product requirement must remain separate.
4. **Resonance must not become evidence.** A user response may validate usefulness for that user, but not objective truth or general population validity.
5. **Contradiction must be preserved abstractly.** Public artifacts can state that contradiction preservation is required, but should not expose the private contradiction that produced the requirement.
6. **Missingness must be named.** Redacted artifacts must state what was withheld, abstracted, or not externally verified.
7. **Synthetic replacement is preferred.** If an example is needed, rebuild the example from public or fictional input rather than sanitizing a private session.
8. **Publication purpose must be explicit.** A redacted artifact must declare whether it is documentation, research, demo, evaluation, implementation planning, or marketing-adjacent explanation.

## Product requirement

Add an `artifact_publication_status` block to every exported artifact.

Suggested fields:

- `artifact_class`: A0, A1, A2, A3, or A4
- `source_status`: public, synthetic, private-inspired, private-derived, private-direct, mixed
- `claim_status`: fact, inference, symbolic_interpretation, speculation, user_confirmed, product_requirement, evaluation_criterion, implementation_plan
- `privacy_status`: public_safe, internal_only, private_return_only, blocked
- `mode_status`: canonical, reflective, mythopoetic, mixed, unknown
- `redaction_status`: none_needed, abstracted, synthetic_rebuilt, rewrite_required, blocked
- `missingness_note`: what was removed, withheld, unknown, or unverifiable
- `revision_reason`: why the artifact changed before publication
- `allowed_destination`: user_return, internal_memory, public_repo, demo, documentation, evaluation_suite

## Evaluation criteria

A return artifact is public-safe only if:

1. It can be understood without access to private context.
2. It contains no private facts or identifying structure.
3. It labels source status, claim status, privacy status, missingness, and revision reason.
4. It separates symbolic usefulness from empirical truth.
5. It preserves mode boundaries.
6. It uses synthetic examples when demonstration is needed.
7. It has an explicit allowed destination.
8. It does not imply that private resonance validates public claims.

A return artifact fails if:

1. It contains sensitive source residue.
2. It exposes raw input, private symbols, or private chronology.
3. It converts user-specific meaning into general truth.
4. It treats an export as automatically publishable.
5. It has no missingness note.
6. It has no revision reason.
7. It is emotionally recognizable as a private session even after names are removed.

## Research questions

- What features make a private reflection identifiable even after obvious personal details are removed?
- Can MC automatically classify artifacts into A0–A4 before export?
- Should public examples always be synthetic by default?
- What minimum metadata is needed for a reader to trust a public artifact without seeing its private source?
- How can contradiction, resonance, and mode labels survive redaction without exposing private content?

## Implementation plan

1. Add `artifact_publication_status` to the export schema.
2. Default all session return artifacts to A3 unless explicitly transformed.
3. Add a redaction step before any artifact is routed to GitHub, docs, demos, research notes, or public pages.
4. Build a synthetic example generator for demos and test fixtures.
5. Add a lint rule that blocks A2, A3, and A4 artifacts from public destinations.
6. Store revision reasons whenever an artifact is abstracted, rewritten, or synthetic-rebuilt.
7. Add review copy to the UI: “This artifact is for private return unless marked public-safe.”

## Missingness

This note does not perform a full audit of every prior MC export, file, chat, or repository note. It extracts one public-safe product requirement from available architecture material. A complete audit would require a separate privacy-safe artifact index that classifies each existing artifact by source status, claim status, privacy status, missingness, and allowed destination without reproducing private material.

## Meaningful revision reason

The architecture already values return artifacts, session memory, resonance feedback, contradiction logs, and exportable summaries. This revision adds the missing publication boundary: an artifact can be useful, beautiful, structured, and still private. The improvement is to make public routing a separate inspected step rather than an assumed consequence of export.