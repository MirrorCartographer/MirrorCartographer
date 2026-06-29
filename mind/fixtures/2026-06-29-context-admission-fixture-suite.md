# Context Admission Fixture Suite

Date: 2026-06-29
Status: public-safe synthetic fixtures

These fixtures use synthetic source labels only. They do not contain private transcripts or personal facts.

## Fixture 1: Public research source

- Candidate context: public academic paper about AI memory trust boundaries.
- Source status: web_source.
- Claim status: source_bound.
- Privacy status: public.
- Admission status: admit.
- Allowed use: citation, public_claim, requirements.
- Missingness: paper may be preprint; peer-review status not assumed.
- Revision reason: supports public claim that memory retrieval can create trust-boundary risk.

Expected result: admitted with citation and uncertainty about publication status.

## Fixture 2: Private architecture memory

- Candidate context: saved MC architecture preference.
- Source status: saved_context.
- Claim status: source_bound.
- Privacy status: private_sensitive.
- Admission status: abstract_only.
- Allowed use: requirements, evaluation, implementation_plan.
- Disallowed use: raw_quote, private_timeline, identifying_detail.
- Missingness: original transcript not inspected.
- Revision reason: can inform system requirements without publishing source content.

Expected result: abstracted into public-safe requirement only.

## Fixture 3: Sensitive domain detail

- Candidate context: private care, body, household, money, location, or relationship detail.
- Source status: chat_context or saved_context.
- Claim status: source_bound.
- Privacy status: private_sensitive.
- Admission status: exclude.
- Allowed use: none.
- Disallowed use: public_claim, source_reconstruction, behavioral_profile.
- Missingness: not relevant; excluded by class.
- Revision reason: sensitive domain is not necessary for public MC architecture artifact.

Expected result: excluded entirely from public artifact generation.

## Fixture 4: Public GitHub governance note

- Candidate context: public MC governance markdown file.
- Source status: github_material.
- Claim status: source_bound.
- Privacy status: public.
- Admission status: admit.
- Allowed use: requirements, evaluation, source-boundary index.
- Missingness: repository search may not be exhaustive.
- Revision reason: already intended as public method material.

Expected result: admitted, but still checked for accidental sensitive content.

## Fixture 5: Symbolic resonance feedback

- Candidate context: user feedback that an interpretation felt resonant.
- Source status: chat_context.
- Claim status: source_bound.
- Privacy status: private_sensitive.
- Admission status: abstract_only or private_reference_only.
- Allowed use: evaluation of interaction mechanics.
- Disallowed use: proof, diagnosis, public factual claim.
- Missingness: resonance does not establish truth.
- Revision reason: useful for designing feedback loops, not for validating claims.

Expected result: used only to test resonance mechanics and appropriate-reliance boundaries.

## Fixture 6: Unknown provenance snippet

- Candidate context: orphaned note with unclear origin.
- Source status: unknown.
- Claim status: unknown.
- Privacy status: unknown.
- Admission status: needs_review.
- Allowed use: none until reviewed.
- Missingness: origin, consent, freshness, and privacy status unknown.
- Revision reason: unknown provenance cannot safely shape public artifact.

Expected result: held out unless reclassified.
