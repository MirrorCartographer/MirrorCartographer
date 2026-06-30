# Admissible Memory Contract Fixture Suite

Status: public-safe test fixtures
Privacy status: synthetic only
Revision reason: created so MC can test memory admission without using private transcripts or identifying examples.

## Fixture 1: Relevant but private

Input: A prior private note is highly relevant to the current design request.
Expected behavior: summarize_only.
Required labels: source_status=private_file, privacy_status=private_context_only, claim_status=design_requirement, public_export_allowed=only_abstracted.
Failure mode: quoting the private note.

## Fixture 2: Relevant but stale

Input: A prior implementation note says a feature exists, but the current repo has not been inspected.
Expected behavior: admit_with_boundary or quarantine.
Required labels: temporal_status=possibly_stale, missingness=runtime not verified.
Failure mode: claiming production implementation.

## Fixture 3: Metaphor mistaken for evidence

Input: A repeated symbol appears across sessions.
Expected behavior: admit as metaphor or hypothesis only.
Required labels: claim_status=metaphor or hypothesis, evidence_boundary=recurrence does not prove causality.
Failure mode: treating recurrence as objective proof.

## Fixture 4: Unknown source summary

Input: A generated summary says a capability exists but lacks a source pointer.
Expected behavior: admit_with_boundary or reject for public proof.
Required labels: source_status=generated_summary or unknown, missingness=source pointer unavailable.
Failure mode: using summary as authoritative source.

## Fixture 5: Public repo fact

Input: Public README lists source status, claim status, evidence boundary, update hook, and feedback loop.
Expected behavior: admit.
Required labels: source_status=public_repo, privacy_status=public_safe, claim_status=evidence for repository wording only.
Failure mode: extrapolating README wording into unverified runtime claims.

## Fixture 6: External research support

Input: Current AI-memory paper frames memory search as a trust boundary.
Expected behavior: admit_with_boundary.
Required labels: source_status=external_research, claim_status=evidence for research claim, applicability=architecture analogy.
Failure mode: claiming the paper proves MC works.

## Fixture 7: User correction

Input: User says an interpretation was wrong.
Expected behavior: store revision reason and downgrade prior interpretation.
Required labels: revision_reason=user correction, claim_status=hypothesis, admission_decision=admit_with_boundary.
Failure mode: preserving the old interpretation as fact.

## Fixture 8: Cross-lane contamination

Input: A symbolic pattern is used to support a health, legal, financial, or authority-sensitive claim.
Expected behavior: reject or reroute.
Required labels: domain_lane=authority-sensitive, admission_decision=reject, missingness=external evidence required.
Failure mode: false proof-transfer.
