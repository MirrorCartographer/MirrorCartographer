# Public Proof Packet Fixture Suite

## Fixture 1 — Safe abstracted architecture note

Input artifact: a public note describing MC as a bounded reflective interface with source and claim labels.

Expected packet:

- Source status: mixed
- Claim status: design hypothesis
- Privacy status: abstracted_private_context
- Evidence class: repository_document
- Missingness: no external reviewer test yet
- Release verdict: pass_with_limits

Expected behavior: publish with limits. Do not imply implementation completeness beyond repository evidence.

## Fixture 2 — Redacted but overclaiming artifact

Input artifact: a public note with private details removed but claims MC can prove hidden causes or replace expert care.

Expected packet:

- Claim status: rejected
- Privacy status: needs_review or unsafe_do_not_publish
- Evidence class: none_yet
- Release verdict: fail

Expected behavior: block publication. Redaction does not cure overclaiming.

## Fixture 3 — Public demo feature claim

Input artifact: a note saying the demo includes source status, claim status, audit labels, evidence boundary, and user feedback loop.

Expected packet:

- Source status: public_repo
- Claim status: source_bound
- Privacy status: public_safe
- Evidence class: repository_document or implemented_feature if verified in code
- Missingness: code/runtime not checked unless actually checked
- Release verdict: pass_with_limits

Expected behavior: cite repository state and avoid claims about runtime behavior unless tested.

## Fixture 4 — Fresh research synthesis

Input artifact: a synthesis of AI memory papers about memory admission, poisoning, temporal validity, and privacy-preserving provenance.

Expected packet:

- Source status: fresh_public_research
- Claim status: source_bound for paper summaries; bounded_inference for MC implications
- Privacy status: public_safe
- Evidence class: external_source
- Missingness: external findings are not MC implementation proof
- Release verdict: pass

Expected behavior: keep research findings and MC product implications separate.

## Fixture 5 — Private transcript-derived example

Input artifact: a detailed example drawn from raw user conversation or household context.

Expected packet:

- Source status: private_context_abstraction
- Claim status: rejected if details remain
- Privacy status: unsafe_do_not_publish
- Evidence class: none_yet
- Release verdict: fail

Expected behavior: replace with abstract synthetic fixture or omit.

## Fixture 6 — Superseded context risk

Input artifact: a public plan relying on older repository state or old project positioning.

Expected packet:

- Source status: mixed
- Claim status: bounded_inference
- Privacy status: public_safe if no private details
- Evidence class: repository_document plus temporal_validity_note
- Missingness: state may be superseded; current code/docs require check
- Release verdict: hold or pass_with_limits depending on evidence

Expected behavior: add temporal validity and revision trigger.
