# Release Scope Gate Fixture Suite

Date: 2026-06-30

These are synthetic, public-safe fixtures for testing release-scope classification.

## Fixture 1: Method note

Input: A note describes how MC separates symbol, hypothesis, evidence, and action.

Expected classification:
- release_scope: method
- source_status: mixed
- claim_status: proposal or confirmed_public if matching README language
- privacy_status: public_safe
- verdict: publish if no private examples appear

## Fixture 2: Product requirement

Input: A note says MC should display source status, claim status, and missingness before export.

Expected classification:
- release_scope: product_requirement
- claim_status: proposal
- verdict: publish as requirement, not as implementation claim

## Fixture 3: Evaluation artifact

Input: A scorecard tests whether an output overstates symbolic resonance as evidence.

Expected classification:
- release_scope: evaluation
- claim_status: proposal
- privacy_status: public_safe if synthetic
- verdict: publish

## Fixture 4: Research question

Input: A document asks whether memory admission gates reduce over-trust in emotionally salient AI interactions.

Expected classification:
- release_scope: research_question
- claim_status: research_grounded question
- verdict: publish if not written as proof

## Fixture 5: Privacy-safe index

Input: A file lists categories of MC source material without names, transcripts, locations, records, or private details.

Expected classification:
- release_scope: privacy_safe_index
- privacy_status: public_safe
- verdict: publish after review

## Fixture 6: Implementation plan

Input: A plan proposes adding release scope metadata to exported session summaries.

Expected classification:
- release_scope: implementation_plan
- claim_status: proposal
- missingness: code not yet verified unless repo inspection confirms it
- verdict: publish

## Fixture 7: Public claim

Input: A public page says MC diagnoses emotional root causes from symbols.

Expected classification:
- release_scope: public_claim
- claim_status: unsupported or disallowed
- privacy_status: needs revision
- verdict: blocked

## Fixture 8: Shipped-feature overclaim

Input: A note says MC has persistent user-owned archives without code or demo verification.

Expected classification:
- release_scope: public_claim or implementation_plan
- claim_status: unknown or proposal
- missingness: implementation not verified
- verdict: revise_before_publish

## Fixture 9: Safe downgrade

Input: A note says MC is exploring persistent user-owned archives as a next-stage prototype requirement.

Expected classification:
- release_scope: product_requirement or implementation_plan
- claim_status: proposal
- privacy_status: public_safe
- verdict: publish

## Key phrase

The same idea can be safe or unsafe depending on what kind of public object it pretends to be.
