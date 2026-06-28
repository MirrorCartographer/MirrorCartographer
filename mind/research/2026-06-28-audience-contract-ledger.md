# Audience Contract Ledger

## Summary

Mirror Cartographer needs an Audience Contract Ledger: a public-safe method for declaring the intended audience, allowed claim level, privacy boundary, evidence lane, review burden, and forbidden transformations before a reflective artifact is converted into a public, care-support, research, product, or income-facing view.

The prior architecture has focused on packets, compilers, gates, ViewDiff, scorecards, and release readiness. This pass compresses those concepts into one missing control surface: the audience contract.

## Source status

- Source status: public repository synthesis plus current external research.
- Repository source: README defines Mirror Cartographer as a bounded symbolic reflection interface with source status, claim status, audit label, health-adjacent boundary flag, evidence boundary, grounded next step, update hook, and feedback loop.
- External research sources:
  - Seeing to Think? How Source Transparency Design Shapes Interactive Information Seeking and Evaluation in Conversational AI, arXiv, 2026-01-21.
  - Beyond Tool Adoption: A Practical Five-Stage Developmental Continuum for AI Literacy in Higher Education, arXiv, 2026-04-28.
  - Label Over Logic? How Source Cues Bias Human Fallacy Judgments More Than LLMs, arXiv, 2026-05-28.
  - Reuters, Health care ambient scribes offer promise but create new legal frontiers, 2026-01-23.
  - Guardian Australia, Melbourne psychiatrist refuses new patients who do not consent to AI note-taking, 2026-05-18.

## Claim status

Architectural proposal. This is not a clinical, psychological, legal, financial, or diagnostic claim.

## Privacy status

Public-safe. This note contains no raw transcript, private household context, personal health detail, animal-care detail, financial detail, location detail, relationship detail, credential expansion beyond already-public README authorship, or private biographical material.

## Problem

A reflective system can preserve continuity yet still fail if it changes audience without changing burden.

A private symbolic reflection can tolerate ambiguity because its job is meaning-making. A public artifact cannot. A care-support packet cannot. A research claim cannot. An income-facing offer cannot.

The system therefore needs an explicit ledger entry before every outward transformation.

## Audience contract fields

Each transformed view should declare:

1. Audience type: private self, trusted collaborator, clinician or qualified support person, public reader, evaluator, customer, funder, builder, archive.
2. Allowed purpose: reflection, orientation, question-building, product demonstration, research question, evaluation fixture, audit trail, income offer, educational explanation.
3. Forbidden purpose: diagnosis, treatment directive, proof of causality, identity claim, sensitive disclosure, coercive advice, inflated capability claim.
4. Source visibility: raw, summarized, abstracted, synthetic, fictional fixture, public citation only.
5. Claim ceiling: symbol, observation, hypothesis, supported claim, tested claim, external authority claim.
6. Privacy ceiling: private, internal, shared-with-consent, publishable, public-safe synthetic.
7. Evidence lane: symbolic, experiential, product, HAI research, medical-support communication, legal-governance-adjacent, commercial.
8. Review burden: self-review, human reviewer, domain reviewer, clinical/legal review required, not releasable.
9. Transformation log: what was removed, abstracted, generalized, fictionalized, or downgraded.
10. Missingness: what cannot be known from the current source.
11. Revision reason: why the artifact changed.
12. Release decision: hold, revise, internal only, publish, publish with warning, publish as synthetic demo only.

## Fit with current MC architecture

The README already frames the system as bounded reflection, not a medical tool, oracle, source database, or objective truth engine. It also already contains public-facing labels that map cleanly into this ledger: source status, claim status, audit label, health-adjacent boundary flag, evidence boundary, grounded next step, update hook, and feedback loop.

The Audience Contract Ledger becomes the control layer above those labels.

## External research interpretation

Recent source-transparency work suggests that citation placement and evidence visibility alter user evaluation behavior. This supports making the audience contract visible rather than burying it as backend metadata.

AI literacy research emphasizes movement from uncritical use toward critical evaluation and improvement. This supports turning the audience contract into a teachable artifact, not only an internal safety check.

Source-label bias research suggests a label alone can distort human judgment. This supports richer transformation records rather than simple labels such as AI-generated or human-written.

Ambient clinical AI reporting shows why health-adjacent transformations need explicit consent, review, privacy, and error boundaries. This supports strict separation between care-support communication and clinical claims.

## Product requirement

Before any MC artifact is exported, rendered, published, or sold, the system should generate an Audience Contract Ledger entry.

No output should be considered public-ready unless the contract declares the audience, purpose, forbidden purpose, claim ceiling, privacy ceiling, evidence lane, review burden, missingness, revision reason, and release decision.

## Evaluation criteria

A transformed artifact passes only if:

- audience is explicit,
- claim ceiling is visible,
- privacy ceiling is visible,
- source visibility is declared,
- evidence lane is declared,
- forbidden uses are named,
- transformation changes are logged,
- missingness is explicit,
- review burden is appropriate,
- release decision is justified,
- the artifact does not expose private details.

## Missingness

- Existing repository contents beyond the README were not exhaustively inspected in this pass.
- The actual implemented UI may or may not already contain equivalent logic.
- This note does not prove user benefit, safety, usability, or commercial demand.
- External research supports the design direction but does not validate Mirror Cartographer specifically.

## Revision reason

Prior notes produced many gate-like concepts. This revision adds the missing upstream declaration: who the artifact is for and what it is allowed to become.

## Key phrase

A view is not safe because it is cleaner. It is safe only when its audience contract is visible.
