# Context Gradient Register

Date: 2026-07-03
Status: public-safe research note
Repository zone: `mind/research`

## Core finding

Mirror Cartographer needs a **Context Gradient Register**: a structured way to record how close a product requirement, research question, method, or evaluation criterion is to private source material without preserving or exposing the private source itself.

Operating line:

> A public artifact should know how much private gravity shaped it, even when no private detail survives inside it.

## Why this exists

Mirror Cartographer work often begins from high-context interaction: conversation patterns, saved context, file-derived concepts, implementation history, and prior GitHub notes. That source environment can reveal architecture needs, but it is not automatically publishable. The system therefore needs a middle layer that tracks **derivation distance** rather than source content.

The Context Gradient Register separates five questions that are often collapsed:

1. What kind of source influenced the artifact?
2. How directly did it influence the artifact?
3. What public-safe transformation was applied?
4. What claims are allowed after transformation?
5. What must remain missing, withheld, or externally verified?

## Source status

- Source classes reviewed: saved architectural context, prior MC research-note pattern, repository-level memory structure, and recurring public-safety constraints.
- Raw transcript status: not quoted, copied, summarized, or published.
- Personal-context status: used only as architecture signal; not exposed.
- File status: no private file contents are reproduced.
- GitHub status: public repository is the target for abstract method notes; this note is designed for that public boundary.

## Claim status

This note makes a method claim, not an empirical claim.

Allowed claim:

- MC would benefit from a register that records derivation proximity, privacy transformation, and allowed use.

Not claimed:

- That any specific private event, person, household, health matter, animal-care matter, financial matter, location, relationship, credential, or raw transcript caused this requirement.
- That this protocol is already implemented in product code.
- That a gradient score alone guarantees privacy safety.

## Privacy status

Privacy class: public-safe abstraction.

Excluded content classes:

- Personal biography
- Household details
- Health or animal-care details
- Financial information
- Location data
- Relationship details
- Credentials or access details
- Raw transcript fragments
- Identifying anecdotes

Allowed content classes:

- Derivation methods
- Source-boundary notes
- Product requirements
- Research questions
- Evaluation criteria
- Privacy-safe indexes
- Implementation plans

## Context gradient model

Each artifact can be assigned a gradient level before publication.

### G0 — Public-born

The artifact was created entirely from public documentation, public code, synthetic examples, or general product reasoning.

Allowed use:

- Public documentation
- Product requirement
- Evaluation criterion
- Marketing-adjacent explanation, if not overclaiming

Required note:

- Cite public source or mark as synthetic/product reasoning.

### G1 — Private-inspired, public-rewritten

A private pattern suggested a general need, but the artifact contains no private detail and can stand as a generic product requirement.

Allowed use:

- Public-safe method note
- Internal-to-public architecture requirement
- Research question

Required note:

- Mark source as private-inspired and biography-free.
- State that no raw source content is included.

### G2 — Private-shaped, boundary-dependent

The artifact depends on a known class of private source, but not a specific private source. It is safe only if the boundary class is disclosed and the example is synthetic.

Allowed use:

- Evaluation framework
- Risk protocol
- Boundary-class matrix

Required note:

- Name the boundary class, not the source.
- Include a missingness note.
- Use synthetic or public examples only.

### G3 — Private-proximate, not publishable as written

The artifact still contains structure, phrasing, sequence, or specificity that could point back to private material.

Allowed use:

- Internal analysis only
- Rewrite candidate

Required action:

- Abstract further before publication.
- Remove chronology, identifying structure, rare detail, and emotionally specific phrasing.

### G4 — Private material

The artifact contains direct private content, raw transcript content, personal data, household data, health data, animal-care data, financial data, location data, relationship data, credentials, or identifying details.

Allowed use:

- Do not publish.

Required action:

- Block publication.
- Replace with boundary-class summary or synthetic equivalent.

## Product requirement

Add a `context_gradient` field to public-boundary artifacts.

Suggested fields:

- `gradient_level`: G0, G1, G2, G3, or G4
- `source_class`: public, synthetic, private-context, private-file, repository-history, mixed
- `transformation_applied`: direct, abstracted, synthesized, boundary-classed, synthetic-rebuilt
- `allowed_output`: publish, internal-only, rewrite-required, blocked
- `claim_limit`: method, hypothesis, requirement, evaluation, empirical claim, implementation claim
- `missingness_note`: what is unknown or intentionally withheld
- `revision_reason`: why the artifact changed from its source shape

## Evaluation criteria

A public artifact passes the Context Gradient Register if:

1. It names its gradient level.
2. It states the allowed source class without exposing source content.
3. It preserves no raw private details.
4. It labels the claim type.
5. It states what is missing or withheld.
6. It can be reviewed by someone with no access to private context.
7. It does not require the reader to infer biography in order to understand the architecture.

A public artifact fails if:

1. It contains private facts or identifying narrative residue.
2. It treats resonance as proof.
3. It converts private experience into public evidence without external support.
4. It hides uncertainty.
5. It lacks a transformation note.
6. It cannot explain why it is public-safe.

## Research questions

- Can derivation proximity be scored reliably by human review, model review, or linting rules?
- What phrasing patterns leak biography even after names and facts are removed?
- Should public MC artifacts default to G1 unless they cite public sources?
- What minimum metadata is needed for future readers to audit public-safe derivation?
- Can synthetic examples preserve the test value of private patterns without preserving their private body?

## Implementation plan

1. Add a lightweight metadata block to future `mind/research` notes.
2. Build a boundary lint checklist that flags G3 and G4 material before publication.
3. Create synthetic examples for any method that was private-inspired.
4. Add a review rule: public artifacts must be understandable without access to private context.
5. Add a revision log field whenever a note is abstracted from a higher-risk gradient to a lower-risk gradient.

## Missingness

This note does not include a complete audit of all prior MC files, chats, or repository commits. It is a public-safe architecture extraction from available context and prior repository-writing pattern. A full audit would require a separate index pass that lists artifacts by title, source class, privacy class, and claim class without reproducing private content.

## Meaningful revision reason

This artifact converts the recurring publication-safety problem from a binary safe/unsafe judgment into a graded derivation register. The revision improves the architecture by making privacy distance inspectable without making private source material visible.
