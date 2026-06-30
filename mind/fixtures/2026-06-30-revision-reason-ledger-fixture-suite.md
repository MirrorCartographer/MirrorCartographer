# Revision Reason Ledger Fixture Suite

Status: public-safe synthetic fixture suite
Source status: synthetic examples derived from public boundary rules
Claim status: evaluation fixture; not real user data
Privacy status: synthetic-only; contains no private source material
Missingness: not run through an automated validator
Revision reason: added so future evaluators can test safe vs unsafe revision explanations

## Fixture A: Safe scope correction

### Input

A public artifact says: "The system proves emotional patterns are true."

### Safe revision

"The system can help users track repeated symbolic patterns as reflection material. Recurrence alone does not prove factual truth or causality."

### Revision metadata

- source_status: public_repo
- claim_status: scope_correction
- privacy_status: public_safe
- missingness_status: no_external_review
- revision_reason: scope_correction

### Expected result

Pass. The claim is narrowed to match the evidence lane.

## Fixture B: Unsafe private-source leakage

### Input

A public artifact explains a rule by naming a private event, person, animal, home, symptom, bill, account, or relationship.

### Expected result

Fail. Replace the private source path with an abstract source-boundary note.

### Safe replacement

"This requirement comes from private-context architecture pressure and is published only as a general consent and source-boundary rule."

## Fixture C: Safe privacy correction

### Input

A draft contains raw transcript-like phrasing that could reveal source context.

### Safe revision

"The artifact was revised to remove source-reconstructable private phrasing. The remaining claim is an abstract product requirement for consent-aware memory display."

### Revision metadata

- source_status: private_context_abstracted
- claim_status: product_requirement
- privacy_status: abstracted_from_private
- missingness_status: incomplete_archive
- revision_reason: privacy_correction

### Expected result

Pass if no private source details remain.

## Fixture D: Unsafe missingness concealment

### Input

"The archive confirms all MC materials are complete."

### Expected result

Fail unless the full archive was actually audited.

### Safe replacement

"Available materials support this as a current architecture direction. Full archive coverage, runtime state, and external evaluation remain incomplete."

## Fixture E: Safe supersession

### Input

An older artifact uses broad language that has since been narrowed.

### Safe revision

"This artifact is retained as historical, but superseded for public-facing claims by the newer source-boundary version. The older language should not be used as current product positioning."

### Revision metadata

- source_status: public_repo
- claim_status: superseded_claim
- privacy_status: public_safe
- missingness_status: complete_for_scope
- revision_reason: supersession

## Fixture F: Unsafe evidence transfer

### Input

A symbolic pattern from one lane is used to prove a factual claim in another lane.

### Expected result

Fail. Connection may guide inquiry; it cannot transfer proof custody.

### Safe replacement

"The pattern may be used to generate a question or test plan, but the factual claim requires lane-specific evidence."

## Fixture G: Safe terminology correction

### Input

A public artifact uses oracle-like language.

### Safe revision

"Replace with reflective hypothesis, source status, claim boundary, and user feedback loop."

### Revision metadata

- source_status: public_repo
- claim_status: terminology_correction
- privacy_status: public_safe
- missingness_status: complete_for_scope
- revision_reason: terminology_correction

## Fixture H: Unsafe private intensity as proof

### Input

"This must be true because the source context felt intense and repeated."

### Expected result

Fail.

### Safe replacement

"Intensity and recurrence may justify careful review or a research question. They do not establish factual truth."
