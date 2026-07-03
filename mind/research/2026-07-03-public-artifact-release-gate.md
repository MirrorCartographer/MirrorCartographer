# Public Artifact Release Gate

Date: 2026-07-03
Status: public-safe research note
Repository zone: `mind/research`

## Core finding

Mirror Cartographer needs a **Public Artifact Release Gate**: a decision protocol that prevents a privacy-safe research note from being mistaken for a validated public demo, product claim, documentation page, grant/funding claim, or evaluation result.

Operating line:

> A public artifact is not ready because it is safe; it is ready when its safety, evidence, purpose, and destination agree.

## Why this exists

Recent MC research notes have built a strong boundary stack: publication boundary linting, claim lifecycle tracking, missingness labeling, synthetic example generation, biography-free extraction, mode-claim separation, provenance-risk mapping, evidence-tier routing, and return-artifact redaction.

Those controls make publication safer, but they do not by themselves answer the next release question:

**What is this public-safe artifact allowed to become?**

A note can be safe to publish as an internal method requirement while still being unsafe or unsupported as:

- a product guarantee,
- a medical, legal, financial, or therapeutic claim,
- a validated research result,
- a public demo using private-derived examples,
- a marketing statement,
- a user-facing interface behavior,
- an evaluation benchmark,
- a grant or partner claim.

The release gate exists so MC can publish architectural understanding without accidentally upgrading abstraction into evidence.

## Source status

- Source classes reviewed: saved MC architecture context, file-library architectural packets, public-boundary research notes already present in the repository, and repository file patterns.
- Raw transcript status: not quoted, copied, summarized, or published.
- Personal-context status: used only to infer architecture needs; not exposed.
- File status: consulted only for abstract architectural patterns such as mode layers, symbolic-to-operational translation, export artifacts, consent boundaries, interface build plans, and claim/evidence discipline.
- GitHub status: this note is written to the public repository as a release-control method requirement.

## Claim status

This note makes a product-governance and information-architecture claim.

Allowed claim:

- MC needs a release gate that assigns every public-safe artifact an allowed destination before it is reused outside the research-note layer.

Not claimed:

- That any specific private person, session, household, health matter, animal-care matter, financial matter, location, relationship, credential, or raw transcript caused this requirement.
- That the release gate is already implemented in code.
- That a public-safe note is automatically empirically validated.
- That publication safety is equivalent to scientific, clinical, commercial, or legal readiness.

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
- Private symbolic sequences
- Rare phrasing traceable to private interaction

Allowed content classes:

- Release criteria
- Product governance method
- Source-boundary notes
- Evaluation criteria
- Research questions
- Implementation plans
- Public-safe artifact routing
- Claim-status discipline

## Release problem

MC currently has multiple public-safe artifact types, but public-safety alone is too coarse.

A public-safe artifact may be:

1. **Publishable as a method note** but not as a product feature.
2. **Useful as a product requirement** but not as a tested implementation.
3. **Safe as a synthetic demo plan** but not as a live demo.
4. **Acceptable as a research question** but not as a claim.
5. **Strong as internal architecture** but too speculative for public marketing.
6. **Clear as symbolic language** but not evidential enough for high-stakes domains.

The missing layer is a destination-specific readiness check.

## Artifact release classes

### R0 — Hold / not released

The artifact should remain internal or private-return-only.

Use when:

- The artifact contains source residue.
- The artifact lacks claim labels.
- The artifact lacks missingness notes.
- The artifact depends on private chronology or sensitive context.
- The artifact is emotionally recognizable as private material.

Allowed destination: none public.

### R1 — Public research note

The artifact is safe to publish as an abstract method, requirement, question, or evaluation concept.

Use when:

- The source has been abstracted.
- Private content has been removed.
- Claim status is labeled.
- Missingness is labeled.
- The artifact does not assert empirical validation.

Allowed destination: `mind/research`, architecture docs, internal public roadmap.

### R2 — Documentation candidate

The artifact may become user-facing documentation after simplification and product alignment.

Use when:

- The method is stable enough to explain to users.
- The artifact has no private source residue.
- The language avoids overclaiming.
- The feature or workflow exists or is clearly marked planned.

Allowed destination: docs draft, public explainer, onboarding copy.

### R3 — Product requirement

The artifact is ready to become a build requirement, issue, schema field, lint rule, interface rule, or test criterion.

Use when:

- The requirement is operationalized.
- Inputs, outputs, states, and failure cases are named.
- The requirement can be tested.
- It does not depend on private examples.

Allowed destination: product spec, GitHub issue, schema proposal, implementation plan.

### R4 — Synthetic demo candidate

The artifact can be demonstrated only through public or fictional input.

Use when:

- A demo would help explain the method.
- Real examples would risk re-identification or high-context leakage.
- Synthetic data can preserve the structure without preserving private source content.

Allowed destination: demo fixture, test suite, public example, workshop exercise.

### R5 — Evidence-bearing claim candidate

The artifact may support a stronger claim only after external or reproducible evidence is attached.

Use when:

- The artifact makes or implies a performance, outcome, therapeutic, safety, accuracy, or research claim.
- The claim can be tested against explicit criteria.
- The evidence artifact can be inspected without private source exposure.

Allowed destination: benchmark report, study plan, validated result note, grant appendix.

### R6 — Blocked from public use

The artifact must not be released publicly.

Use when:

- Redaction would destroy the artifact's meaning.
- The artifact contains sensitive private information.
- The artifact creates a reasonable re-identification path.
- The artifact depends on personal, health, animal-care, financial, location, relationship, credential, or raw transcript content.

Allowed destination: none public. Replace with synthetic or boundary-class method note if needed.

## Release gate schema

Every artifact proposed for public use should carry this block:

```yaml
release_gate:
  release_class: R0 | R1 | R2 | R3 | R4 | R5 | R6
  source_status: public | synthetic | private_inspired_public_abstracted | private_derived_internal | private_direct | mixed | unknown
  claim_status: method_requirement | research_question | product_requirement | evaluation_criterion | implementation_plan | hypothesis | evidence_bearing_claim | symbolic_interpretation | speculation
  privacy_status: public_safe | public_safe_with_limits | internal_only | private_return_only | blocked
  evidence_status: none_required | conceptual_only | synthetic_only | implementation_pending | externally_unverified | reproducible_artifact_required | validated
  destination_status: research_note | docs_candidate | product_spec | demo_fixture | evaluation_suite | marketing_blocked | public_blocked
  missingness: what is withheld, abstracted, unknown, untested, or unverifiable
  revision_reason: why this artifact changed before release
  next_action: hold | publish_note | rewrite_docs | create_issue | build_synthetic_demo | attach_evidence | block
```

## Release gate checklist

An artifact may move beyond `mind/research` only if it passes all relevant checks:

1. **Source boundary check** — the artifact is reversible only to a source class, not a private source.
2. **Claim boundary check** — the artifact's truth status is labeled and not silently upgraded by polished language.
3. **Privacy boundary check** — no personal, household, health, animal-care, financial, location, relationship, credential, or transcript residue remains.
4. **Destination check** — the intended public destination is named.
5. **Evidence check** — any performance, safety, wellness, therapeutic, or empirical claim has evidence or is downgraded.
6. **Mode check** — symbolic, reflective, mythopoetic, canonical, and scientific language are not collapsed into one truth status.
7. **Synthetic demo check** — examples are fictional or public unless explicit consent and a separate release path exist.
8. **Missingness check** — withheld, abstracted, unverified, or unavailable material is labeled.
9. **Revision check** — the reason for changes before publication is recorded.
10. **Allowed-use check** — downstream reuse is constrained to the release class.

## Product requirement

Add `release_gate` metadata to all MC artifacts that may leave private session context or internal research context.

Minimum required fields:

- `release_class`
- `source_status`
- `claim_status`
- `privacy_status`
- `evidence_status`
- `destination_status`
- `missingness`
- `revision_reason`
- `next_action`

## Evaluation criteria

A release gate passes if:

1. A reader can tell what the artifact is allowed to be used for.
2. The artifact does not expose private source material.
3. The artifact does not imply evidence it does not have.
4. The artifact has an explicit destination.
5. Missingness and revision reasons are labeled.
6. High-stakes claims are blocked, downgraded, or routed to external evidence.
7. Demos use public or synthetic inputs by default.
8. Product requirements are testable.

A release gate fails if:

1. The artifact is safe but destination-ambiguous.
2. The artifact moves from research note to product/docs/demo without a release class.
3. Symbolic resonance is treated as empirical support.
4. Private-derived examples are used because they are more emotionally vivid.
5. Missingness is hidden to make the artifact feel stronger.
6. The artifact's polished form makes it sound more proven than it is.
7. It contains no downstream allowed-use limit.

## Research questions

- Can release classes R0–R6 be assigned automatically by lint rules?
- What language patterns make a method note sound like a validated claim?
- Should all MC public demos default to R4 unless evidence is explicitly attached?
- How should MC represent a claim that is useful for design but not yet validated?
- What is the smallest metadata block that prevents artifact overuse without making the system unreadable?
- Can the release gate integrate with GitHub checks, export schemas, and UI copy?

## Implementation plan

1. Add `release_gate` to the artifact metadata schema.
2. Default private-session artifacts to R0 until classified.
3. Default public-safe research notes to R1 unless a stronger destination is justified.
4. Require R3 classification before converting a research note into a product issue or implementation task.
5. Require R4 classification before publishing demos or examples.
6. Require R5 classification and attached evidence before performance, outcome, or empirical claims.
7. Block R6 artifacts from public destinations.
8. Add a GitHub lint rule that rejects public artifact files missing source, claim, privacy, evidence, destination, missingness, and revision labels.
9. Add a docs preflight step: no documentation page can publish unless every claim has a release class.
10. Add a UI/export preflight step: exports are private-return-only unless explicitly classified for public reuse.

## Missingness

This note does not audit every existing MC artifact or classify every file already in the repository. It defines the missing release-control layer that should govern future movement from research notes into documentation, demos, product specs, evaluations, or public claims.

External validation is not performed here. Any empirical, therapeutic, safety, or performance claim must be routed to a separate evidence-bearing process before release.

## Meaningful revision reason

Prior notes established strong source, privacy, claim, missingness, and redaction boundaries. This revision adds the downstream release decision: after an artifact is public-safe, MC still needs to know whether it is only a research note, a docs candidate, a product requirement, a synthetic demo candidate, an evidence-bearing claim candidate, or blocked from public use.
