# ContextAdmissionRecord v0

Status: public-safe schema
Date: 2026-06-29

## Purpose

A ContextAdmissionRecord documents whether a candidate source item is allowed to influence a Mirror Cartographer artifact before generation begins.

This schema protects against the failure mode where private context is not quoted, but still silently shapes public claims beyond its authorized boundary.

## Record fields

- `record_id`: stable identifier for this admission decision.
- `artifact_id`: artifact or run this decision supports.
- `candidate_context_label`: public-safe label for the context item; do not include private content.
- `source_status`: file | saved_context | chat_context | github_material | web_source | synthetic_fixture | unknown.
- `claim_status`: confirmed | source_bound | inferred | speculative | synthetic | deprecated | missing | unknown.
- `privacy_status`: public | public_safe_abstracted | private_sensitive | restricted | unknown.
- `domain_sensitivity`: general | identity | health | animal_care | financial | location | relationship | credential | household | legal | other_sensitive.
- `admission_status`: admit | abstract_only | private_reference_only | exclude | needs_review.
- `allowed_use`: architecture | requirements | evaluation | threat_model | index | implementation_plan | public_claim | citation | none.
- `disallowed_use`: raw_quote | identifying_detail | diagnosis | authority_claim | source_reconstruction | behavioral_profile | private_timeline | other.
- `missingness_note`: what is absent, stale, ambiguous, or unverified.
- `revision_reason`: why the status was assigned or changed.
- `downstream_obligations`: labels that must follow the item if admitted.
- `review_trigger`: condition that requires human review or stronger consent.

## Admission logic

1. Public web sources may be admitted for source-bound public claims if they are current, relevant, and cited.
2. Public GitHub materials may be admitted if they contain no restricted content and the repository is meant to be public.
3. Private chat, saved context, or sensitive file material may be abstract-only at most unless explicit release permission exists.
4. Health, animal-care, financial, location, relationship, credential, and household material defaults to exclude for public artifacts.
5. Any item that materially changes an interpretation but cannot be described publicly receives an influence-ledger entry.

## Minimal valid example

- `candidate_context_label`: prior MC product decision memory
- `source_status`: saved_context
- `claim_status`: source_bound
- `privacy_status`: private_sensitive
- `domain_sensitivity`: other_sensitive
- `admission_status`: abstract_only
- `allowed_use`: requirements
- `disallowed_use`: raw_quote, identifying_detail, private_timeline
- `missingness_note`: original transcript not inspected
- `revision_reason`: usable only to understand persistent architecture requirements
- `downstream_obligations`: source-boundary label, influence label, missingness label
- `review_trigger`: any attempt to publish concrete source detail

## Non-goals

This schema does not replace release readiness, redaction fidelity, claim transport, source-boundary BOM, or authority-boundary checks. It feeds them.
