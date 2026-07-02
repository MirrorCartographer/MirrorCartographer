# Audience Partition Protocol

## Core finding

Mirror Cartographer needs an Audience Partition Protocol.

Operating line:

**A reflection must know who it is for before it is allowed to decide what it can carry.**

## Source status

- Source class: mixed public-safe synthesis from available Mirror Cartographer files, saved architectural context, and existing GitHub mind direction.
- File-library anchors: the core specification defines Mirror Cartographer as a recursive symbolic cognition interface with ENTRY -> FIELD -> RECURSION -> RETURN, three modes, session memory, and exportable artifacts. The public one-page description frames MC as a human-centered AI reflection system for symbolic emotional mapping, psychological orientation, and meaningful interaction in AI-mediated environments. The intro packet describes symbolic emotional mapping, reflective AI dialogue, adaptive tone layers, accessible interface concepts, and future immersive interaction design. Timeline/proof materials describe separate private, companion, and public-facing components and a public Field Companion with non-therapeutic, trauma-aware symbolic self-mapping boundaries.
- GitHub status: written as a new public repository research note, not as a claim that the runtime already enforces audience partitioning.
- Private-context use: used only to understand repeated architecture pressure around public/private separation, group sharing, source boundaries, export safety, and consent. No private facts or raw transcript material are reproduced here.

## Claim status

- Confirmed: MC has been described as having public-facing, private, companion, and group/shared interaction surfaces.
- Confirmed: MC includes memory, export, symbolic reflection, tone/mode choices, and accessibility requirements.
- Inferred: when the same system supports private reflection, public onboarding, companion experiences, group rituals, and exportable artifacts, it needs explicit audience partitioning so content authorized for one audience cannot leak into another.
- Bounded speculation: future implementations may represent audience as a schema field, UI badge, access policy, export gate, route-level middleware, or audit log dimension.

## Privacy status

Public-safe.

This note contains only abstract system architecture, governance requirements, evaluation criteria, and implementation planning. It excludes personal, household, health, animal-care, financial, location, relationship, credential, and raw transcript details.

## Missingness

- No direct code audit was completed in this run.
- No current runtime behavior was tested.
- No exhaustive repository inventory was completed.
- The available source set includes repeated draft and timeline materials; these were used only to infer requirements, not to publish private source content.
- Existing GitHub research notes already cover source boundaries, memory gates, export consent, origin classification, and runtime mode integrity; this entry isolates the separate failure mode of audience bleed.

## Revision reason

Prior public-safe research notes established what a claim is allowed to be, where it came from, whether it can become memory, and whether it can be exported. The next missing governance layer is who the reflection is allowed to address. MC cannot safely support private, companion, public, and shared modes unless audience is treated as a first-class boundary condition.

## Requirement

Every MC reflection, memory object, artifact, export, and UI surface should declare an audience partition before content is generated, stored, or shared.

Minimum partition fields:

1. `audience`: Self, Private Companion, Shared Pair, Group, Public, Developer/Internal, or Unknown.
2. `audience_permission`: what this audience is allowed to see.
3. `source_permission`: which source classes may influence this audience surface.
4. `memory_permission`: whether private memory, shared memory, or no memory may be used.
5. `export_permission`: whether output may leave the session, enter a shared artifact, or remain private-only.
6. `redaction_required`: whether content must be abstracted before presentation.
7. `revision_trigger`: what would require audience reclassification.

## Audience partition sketch

### Self

Allowed posture: private reflective continuity.

May use:

- User-authorized session memory.
- User-authorized symbolic history.
- Private reflection state that remains non-exported unless explicitly promoted.

Must not:

- Treat private reflection as public proof.
- Convert sensitive context into public language without distillation.

### Private Companion

Allowed posture: bounded relationship-specific adaptation.

May use:

- Only material explicitly assigned to that companion context.
- Companion-specific tone, ritual, or symbolic interface settings.

Must not:

- Carry one person's private material into another person's companion surface.
- Present companion symbolism as factual identity knowledge.

### Shared Pair

Allowed posture: explicitly consented mutual surface.

May use:

- Shared inputs from both participants.
- Reflections marked for joint visibility.

Must not:

- Reveal one participant's private memory to the other.
- Infer consent from thematic similarity.

### Group

Allowed posture: common-field facilitation.

May use:

- Group-submitted symbols.
- Aggregated or anonymized pattern language.

Must not:

- Attribute a sensitive pattern to a specific person without explicit permission.
- Store group dynamics as individual memory without review.

### Public

Allowed posture: product-facing, non-private, non-diagnostic, source-bounded.

May use:

- Public-safe explanations.
- Abstracted methods.
- Product requirements.
- Evaluation criteria.
- Research questions.

Must not:

- Expose private transcripts, health details, household details, financial details, relationship details, credentials, location details, or personal identifiers.
- Claim clinical, diagnostic, or evidentiary authority beyond documented scope.

### Developer/Internal

Allowed posture: implementation and test planning.

May use:

- Redacted fixtures.
- Synthetic examples.
- Boundary test cases.
- Architecture notes.

Must not:

- Use raw private data as fixtures.
- Let debug logs become a shadow archive of sensitive content.

### Unknown

Allowed posture: locked until classified.

May use:

- No private memory.
- No export.
- No audience-specific inference.

Must not:

- Generate personalized reflection.
- Save memory.
- Publish an artifact.

## Evaluation criteria

A runtime output passes the Audience Partition Protocol if:

1. The intended audience is declared before output generation.
2. The output uses only source classes permitted for that audience.
3. Private context is either excluded or abstracted into public-safe requirements.
4. Shared outputs show the sharing boundary.
5. Public outputs contain no private payload.
6. Unknown-audience outputs default to the most restrictive state.
7. Export status is explicit.
8. Revision reasons are logged when an audience changes.

A runtime output fails if:

1. It gives a public user a private-context reflection.
2. It moves one person's symbolic history into another person's companion.
3. It treats group pattern language as individual fact.
4. It exports reflective content without audience and consent labels.
5. It hides audience uncertainty behind polished prose.

## Implementation plan

1. Add an `audience_partition` object to the MC response and memory schemas.
2. Require route-level audience classification before reflection generation.
3. Add a pre-memory gate that rejects writes when `audience` is Unknown.
4. Add a pre-export gate that blocks public export unless `audience=Public` and `privacy_status=Public-safe`.
5. Add synthetic tests for audience bleed across Self, Companion, Shared Pair, Group, and Public surfaces.
6. Add UI badges for audience state and export state.
7. Add a redaction pipeline that converts private reflection material into requirements, evaluation criteria, or research questions before public use.
8. Add log entries when content changes audience class.

## Research questions

- What audience labels are simple enough for users while precise enough for runtime governance?
- How should MC handle mixed-audience artifacts, such as a shared ritual that later becomes a public template?
- What visual language makes audience boundaries feel protective rather than sterile?
- Can audience partitioning be tested automatically with synthetic fixtures?
- When should a public artifact require human review even if the system marks it public-safe?

## Public-safe index tags

- audience-partition
- privacy-boundary
- export-safety
- companion-surface
- group-reflection
- public-safe-methods
- access-governance
- symbolic-reflection

## Next link in the mind graph

This protocol should connect to:

- Source Boundary Matrix
- Consent Gradient Export Protocol
- Boundary-Preserving Memory Compiler
- Runtime Mode Integrity Contract
- Public-Safe Trace Index
- Reflection Authority Router
- Withheld Evidence State Protocol

Together these define who a reflection is for, what it may carry, and where it is allowed to go.
