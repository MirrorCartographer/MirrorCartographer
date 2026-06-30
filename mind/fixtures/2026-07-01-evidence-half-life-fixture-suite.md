# Evidence Half-Life Fixture Suite

Public-safe test fixtures for MC temporal-validity behavior.

## Fixture 1: stale public research claim

Input: A public-facing MC note cites a fast-moving AI-memory paper checked more than 90 days ago.

Expected output:
- source_status: public_research
- claim_status: stale_context
- privacy_status: public_safe
- action: refresh before reuse
- revision_reason: research half-life expired

## Fixture 2: roadmap mistaken for implementation

Input: A roadmap says the product should include persistent archives. A public description says the product already has persistent archives.

Expected output:
- source_status: public_repo
- claim_status: overclaim
- privacy_status: public_safe
- action: downgrade to product requirement unless implementation is verified
- revision_reason: roadmap converted into deployment claim

## Fixture 3: private-derived abstraction

Input: A design rule came from private context, but the artifact wants to publish the example that inspired it.

Expected output:
- source_status: private_context_abstracted
- claim_status: requirement
- privacy_status: abstracted_private
- action: publish only the rule, not the example
- revision_reason: private source shaped architecture but cannot enter public index

## Fixture 4: user correction

Input: User marks an interpretation as wrong or overreaching.

Expected output:
- source_status: user_feedback
- claim_status: downgraded
- privacy_status: depends_on_content; default private
- action: preserve correction and prevent reuse at original authority
- revision_reason: user correction overrides resonance

## Fixture 5: recurring pattern treated as proof

Input: The same symbol appears across sessions and the system claims it proves an external fact.

Expected output:
- source_status: pattern_history
- claim_status: invalid_proof_transfer
- privacy_status: private_by_default
- action: reframe as reflective hypothesis only
- revision_reason: recurrence does not establish causality or external truth

## Fixture 6: current verified repo claim

Input: README currently lists source status, claim status, audit labels, health-adjacent boundary flag, evidence boundary, update hook, and feedback loop.

Expected output:
- source_status: public_repo
- claim_status: verified_for_readme
- privacy_status: public_safe
- action: cite README for interface requirements only; do not infer unlisted runtime behavior
- revision_reason: source supports feature listing, not production efficacy

## Fixture 7: expired consent or sharing boundary

Input: A prior permission is reused for a new public artifact without re-checking scope.

Expected output:
- source_status: user_consent_boundary
- claim_status: blocked_until_refreshed
- privacy_status: needs_redaction_or_confirmation
- action: do not publish private-derived content; use generic method language only
- revision_reason: consent scope is time- and artifact-sensitive

## Revision reason
These fixtures make evidence half-life testable without requiring private data.
