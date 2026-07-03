# External Verification Handoff Protocol

## Core finding

Mirror Cartographer needs an **External Verification Handoff Protocol**: a method for turning reflective, symbolic, or archive-derived outputs into clearly bounded artifacts that can be reviewed by an outside domain expert without exposing private source material or overstating certainty.

## Operating line

**A reflection becomes actionable only when it can hand its uncertainty to the right external test.**

## Why this exists

Mirror Cartographer can preserve relationships between fragments, surface patterns, and generate structured hypotheses. That does not make the system a truth authority. The next integrity layer is a handoff mechanism: when an output approaches a domain boundary, the system should package the claim, uncertainty, source boundary, missing evidence, and verification route in a public-safe or expert-safe format.

This protects three things at once:

1. **Usefulness** — insights do not stay vague or purely symbolic.
2. **Safety** — the system does not convert resonance, recurrence, or interpretive confidence into factual certainty.
3. **Privacy** — private context can inform structure without being exported as raw evidence.

## Source status

- **Private conversation context:** Used only as architectural orientation. No raw transcript content, personal facts, household facts, health details, animal-care details, financial details, relationship details, location details, credentials, or identifying private material are included here.
- **Saved context:** Used only to infer recurring product requirements around continuity, public/private separation, claim labeling, and non-diagnostic framing.
- **GitHub public repository:** README-level project claims and public lanes were used to align this protocol with existing public positioning.
- **External sources:** Not used in this note. This is a product-method derivation, not a literature review.

## Claim status

- **Claim type:** Product architecture requirement.
- **Evidence level:** Derived from repeated project constraints and public repository positioning.
- **Confidence:** Medium-high for product usefulness; not an empirical claim.
- **Verification needed:** Prototype against multiple output types and test whether reviewers can understand the handoff without private source access.

## Privacy status

- **Public-safe:** Yes.
- **Private payload removed:** Yes.
- **Identity-linked detail removed:** Yes.
- **Sensitive domains excluded:** Yes.
- **Reusable outside the originating case:** Yes.

## Missingness

The current system still needs:

- a formal list of domain boundaries that trigger handoff;
- a template for expert-safe summaries;
- a standard uncertainty vocabulary;
- a way to distinguish symbolic usefulness from factual support;
- a review log showing whether external verification confirmed, rejected, reframed, or left unresolved a claim;
- a private-to-public redaction pass before any handoff artifact is exported.

## Proposed handoff packet

Each handoff should include:

1. **Question** — what needs external review?
2. **Output summary** — what did MC produce, in non-private terms?
3. **Source boundary** — what kinds of sources informed it?
4. **Claim status** — observation, pattern, hypothesis, recommendation, decision, or unresolved question.
5. **Confidence status** — low, medium, high, or not applicable.
6. **Missing evidence** — what would change the answer?
7. **Risk boundary** — what should not be inferred from the packet?
8. **Recommended reviewer** — clinician, veterinarian, engineer, researcher, designer, lawyer, accountant, collaborator, or user-only review.
9. **Privacy tier** — public-safe, expert-safe, private-only, or blocked.
10. **Revision reason** — why this packet exists now.

## Evaluation criteria

A successful External Verification Handoff Protocol should pass these tests:

- A reviewer can understand the claim without needing the private transcript.
- The packet does not imply diagnostic, legal, financial, or factual authority beyond its evidence.
- The handoff states what would falsify or weaken the claim.
- The system records the result of external review.
- The system can preserve the learning from review without importing private payload into public memory.
- The packet remains useful even if the original symbolic language is removed.

## Implementation plan

1. Add a `verification_handoff` schema to MC outputs.
2. Add handoff triggers for high-stakes domains and public-facing claims.
3. Add a privacy tier selector before export.
4. Add a claim lifecycle link so externally reviewed claims can move from hypothesis to revised, rejected, supported, or unresolved.
5. Add a public-safe index of handoff patterns, not source cases.
6. Add a lint step that blocks handoff packets containing private payload or unsupported certainty.

## Meaningful revision reason

Previous MC research notes established boundaries for missingness, evidence envelopes, origin classification, role separation, context minimization, and claim lifecycle tracking. This note extends that chain by asking what happens after MC produces a bounded claim: the system needs a path to external review that keeps uncertainty alive instead of pretending the internal map is enough.
