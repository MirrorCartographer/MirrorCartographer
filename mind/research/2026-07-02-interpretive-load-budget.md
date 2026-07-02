# Interpretive Load Budget

## Core finding

Mirror Cartographer needs an **Interpretive Load Budget**.

Operating line:

**A reflection should not carry more interpretation than its source boundary, consent layer, and evidence status can support.**

## Source status

- Source class: mixed-source architectural synthesis.
- Public-safe source anchors: public-facing MC descriptions, core specification summaries, continuity architecture summaries, and prior GitHub mind research notes.
- Private-context use: private and mixed material was used only to infer recurring architecture pressure, not to publish personal examples, raw transcripts, household details, health details, animal-care details, financial details, location details, relationship details, credential details, or identifying private payloads.
- GitHub material status: repository target is public; this note is intentionally abstracted.

## Claim status

- Claim type: product requirement / governance method.
- Claim strength: proposed design requirement, not validated implementation.
- Evidence status: pattern-derived from repeated MC requirements around symbolic reflection, continuity, consent, source boundaries, accessibility, and claim discipline.
- Not a claim that MC currently implements this correctly.
- Not a clinical, diagnostic, therapeutic, financial, or personal-history claim.

## Privacy status

- Public-safe: yes.
- Personal data included: no.
- Raw transcript included: no.
- Sensitive examples included: no.
- Re-identification risk: low, because the note describes a general method rather than source events.

## Missingness

- No live code audit was completed for whether the current interface enforces interpretive limits.
- No user study exists yet measuring whether reflections become too strong, too long, too symbolic, too clinical-sounding, or too directive.
- No automated classifier exists yet for assigning interpretation weight before a reflection is generated.
- No regression test suite currently proves that low-evidence symbolic material stays in low-authority language.

## Revision reason

Prior MC mind notes define source classification, consent gradients, authority routing, claim promotion, public-safe indexing, and revision reasons. The missing layer is not another source label; it is a runtime budget that limits how much interpretive force a reflection may carry.

Without this budget, a reflection can be formally labeled as speculative while still feeling emotionally, medically, spiritually, or operationally over-authoritative. The system needs to regulate not only what it claims, but how heavy the claim feels.

## Product requirement

Every generated reflection should carry an interpretive-load score before output.

The score should constrain:

1. **Depth** — how far the system may infer beyond user-provided symbols or evidence.
2. **Force** — how strongly the system may phrase a statement.
3. **Directive weight** — whether the output may suggest action, offer options, or only reflect back.
4. **Domain proximity** — whether the content approaches sensitive domains requiring neutral, bounded language.
5. **Persistence eligibility** — whether the interpretation may be saved, summarized, indexed, or must remain session-local.
6. **Export eligibility** — whether the interpretation may appear in a public-safe artifact.

## Proposed interpretive-load bands

### Band 0 — Echo

- Allowed behavior: restate, organize, mirror language.
- Claim language: none.
- Use when: source is private, ambiguous, emotionally intense, or low-evidence.
- Persistence: optional only with explicit consent.

### Band 1 — Pattern notice

- Allowed behavior: name visible recurrence or contrast.
- Claim language: tentative.
- Use when: multiple bounded signals point to a pattern, but no external validation exists.
- Persistence: save as pattern candidate, not fact.

### Band 2 — Structured hypothesis

- Allowed behavior: propose a model, requirement, or testable interpretation.
- Claim language: hypothesis / design need.
- Use when: pattern is repeated and source boundary is known.
- Persistence: allowed as a research question, evaluation criterion, or product requirement.

### Band 3 — Evidence-bound claim

- Allowed behavior: make a bounded claim tied to named evidence.
- Claim language: evidence-bound, scoped.
- Use when: sources are public, citeable, or internally auditable and non-sensitive.
- Persistence: allowed with evidence reference and revision path.

### Band 4 — Action guidance

- Allowed behavior: recommend implementation steps or operational changes.
- Claim language: bounded directive.
- Use when: domain is non-sensitive, evidence is adequate, and user consent permits action.
- Persistence: allowed as implementation plan or issue.

## Evaluation criteria

A reflection passes the Interpretive Load Budget if:

- The emotional force of the output matches its evidence authority.
- The system does not use poetic intensity to smuggle in unsupported certainty.
- Sensitive-domain content is routed toward neutral, bounded, non-diagnostic language.
- Public exports contain methods, requirements, criteria, or indexes rather than private payloads.
- Any saved interpretation records source status, claim status, privacy status, missingness, and revision reason.
- The user can later tell why the system was allowed to say that much and no more.

## Implementation plan

1. Add `interpretive_load_band` to reflection metadata.
2. Add `interpretive_load_reason` explaining the assigned band.
3. Add `max_allowed_claim_language` generated from the band.
4. Add `sensitive_domain_proximity` as a pre-output gate.
5. Add export checks so public artifacts reject Band 0 private payloads and convert Band 1-2 material into abstract requirements or research questions.
6. Add regression tests with paired examples: same symbol input, different source/privacy/evidence states, different permitted outputs.

## Public-safe index entry

- Node: Interpretive Load Budget
- Type: runtime governance requirement
- Connects to: Claim Promotion Ladder, Reflection Authority Router, Consent Gradient Export Protocol, Boundary-Preserving Memory Compiler, Public-Safe Trace Index
- Status: proposed
- Privacy: public-safe abstraction
- Next research question: how can MC measure perceived authority, not only textual certainty?
