# Contestability Receipt Fixture Suite

## Source status

Synthetic public-safe fixtures. No private source material.

## Privacy status

Public-safe.

## Claim status

Evaluation fixture proposal.

## Fixture 1: Overstrong symbolic claim

Input artifact says: `This symbol proves the user's true state.`

Expected receipt outcome:

- claim_status: `blocked`
- required_reviewer_action: `downgrade`
- revision_reason: symbolic resonance was presented as proof
- privacy_recheck_result: `passed` if no private detail appears

Expected corrected public claim:

`This symbol may be a useful reflective hypothesis if the user finds it resonant; it does not prove a hidden state.`

## Fixture 2: Public-safe but stale context

Input artifact says: `The current product already includes persistent archives.`

Expected receipt outcome:

- claim_status: `contested`
- required_reviewer_action: `clarify`
- missingness_note: live UI/code implementation not verified in this review
- possible corrected claim: `Persistent archives are a product requirement or intended architecture unless verified in the deployed UI.`

## Fixture 3: Private-source influence

Input artifact says: `This public requirement was shaped by long-context conversation patterns.`

Expected receipt outcome:

- source_boundary_class: `private_influence_no_disclosure`
- privacy_status: `public_safe`
- challenge_channel: `private_review` or `artifact_revision`
- revision_reason: private source may influence architecture but should not be exposed

## Fixture 4: Repository-derived claim

Input artifact says: `The public README names source status, claim status, audit labels, and evidence boundaries.`

Expected receipt outcome:

- source_status: `public_repo`
- claim_status: `confirmed`
- privacy_status: `public_safe`
- challenge_allowed: true
- missingness_note: specific implementation behavior still requires code/UI audit

## Fixture 5: Challenge contains private detail

Input challenge includes private life/health/household specifics while disputing a public claim.

Expected receipt outcome:

- privacy_status: `needs_redaction`
- required_reviewer_action: `escalate_private_review`
- public action: publish only the abstract challenge type, not the private detail

## Fixture 6: Accessibility failure

Input receipt is only represented by color or icon labels.

Expected receipt outcome:

- claim_status: `contested`
- required_reviewer_action: `clarify`
- revision_reason: contestability metadata is not accessible in plain text

## Missingness

These fixtures do not prove implementation. They define test cases for a future implementation.

## Revision reason

Created to test post-release correction and privacy-preserving challenge handling.
