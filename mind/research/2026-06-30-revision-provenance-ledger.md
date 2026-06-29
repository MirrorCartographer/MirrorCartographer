# Revision Provenance Ledger

Date: 2026-06-30
Status: public-safe research note
Privacy status: safe-to-publish abstraction
Revision reason: added after repeated public-safe MC research passes identified a missing distinction between a claim boundary and the later record of why that claim changed.

## Core finding

A public-safe claim does not only need a source boundary. It needs a revision boundary.

If Mirror Cartographer changes a public claim because of private context, updated research, implementation evidence, user correction, or contradiction review, the public artifact should not expose the sensitive source. It should expose the type of revision pressure that acted on the claim.

Key phrase:

**Do not expose the private correction. Expose that correction had custody.**

## Source status

- Public repository source: inspected public README.md in MirrorCartographer/MirrorCartographer.
- File-library source: available MC docs and prompt-contract snippets used only to understand existing architecture.
- Private/saved context: used only as architectural orientation, not copied into this file.
- Web research source: current public research on personal-agent memory gates, temporal-validity memory, continuum memory, and appropriate reliance.
- GitHub code-search status: repository search/indexing may be incomplete; this file does not claim runtime implementation.

## Claim status

- Confirmed public repo claim: MC is framed as bounded symbolic reflection, not therapy, diagnosis, oracle, source database, or objective truth engine.
- Confirmed public repo claim: MC already names source status, claim status, evidence boundary, overreach check, update hook, and user feedback loop as demo/product elements.
- Inference: those elements imply an auditable claim lifecycle, but they do not fully specify a revision-provenance layer.
- Proposed requirement: add a revision ledger that records the reason class for public claim changes without revealing protected source content.
- Not claimed: that this layer is implemented in the live demo.

## Privacy status

Safe-to-publish:

- revision reason classes
- claim lifecycle states
- source-boundary labels
- evaluation criteria
- missingness notes
- implementation plan

Not safe-to-publish:

- raw transcripts
- personal, household, health, animal-care, financial, location, relationship, credential, or private identity details
- private examples that would let a reader infer the sensitive source
- exact private correction text when the correction source is not public

## Missingness

- No direct runtime audit log was inspected in this pass.
- Public repo search/index availability was limited.
- The live deployment was not tested here.
- Existing `mind/` artifacts from earlier runs were not fetchable by direct path in this pass, so this file avoids asserting their repository state.

## Revision pressure classes

A public MC claim should be revised only with a visible reason class:

1. `public_source_update` — a public source changed or became newly available.
2. `private_context_correction` — private context contradicted or narrowed the claim, but the private content is withheld.
3. `implementation_evidence_change` — code, demo, test, or deployment evidence changed the implementation status.
4. `claim_overreach_downgrade` — a prior claim was too broad, too certain, too diagnostic, too authority-like, or too product-complete.
5. `scope_boundary_change` — the claim moved between concept, prototype, demo, research plan, product requirement, or implemented feature.
6. `temporal_validity_change` — the claim became stale, superseded, retired, unknown-age, or historically true but no longer current.
7. `privacy_redaction_change` — the claim was compressed, generalized, or removed to protect sensitive context.
8. `evaluation_failure` — a test, scorecard, reviewer note, or contradiction pass found that the claim failed a boundary condition.
9. `user_feedback_change` — user correction changed resonance, usefulness, confusion, or overreach status.
10. `unknown_revision_pressure` — the claim changed, but the reason is not yet adequately known.

## Claim lifecycle states

- `drafted`
- `public_safe_pending_review`
- `published_bounded`
- `published_with_missingness`
- `revised_public_safe`
- `downgraded`
- `superseded`
- `retired_private`
- `contested`
- `requires_external_evidence`

## Product requirement

Every public-facing MC claim should carry:

- claim id
- current wording
- claim type: fact, implementation status, research question, product requirement, evaluation criterion, design principle, symbolic framing, or speculation
- source status
- privacy status
- claim status
- temporal status
- last revision reason class
- previous public wording, if safe
- withheld-source note, if private context influenced the change
- missingness note
- next evidence needed

## Evaluation criteria

A revision-provenance layer passes when:

- private material can change a public claim without being exposed
- readers can see that a claim changed and why, at the reason-class level
- implementation-status claims are downgraded when code or deployment evidence is missing
- symbolic claims cannot silently become factual claims
- health/legal/financial/therapeutic authority claims are blocked or downgraded
- stale context is labeled rather than silently reused
- uncertainty is preserved after compression
- the system can explain loss: what detail was removed, generalized, or withheld

## Research fit

Current AI-memory research supports this layer because memory retrieval is increasingly treated as a trust boundary, not a passive lookup. Semantically relevant memory can be contextually inappropriate; stale facts can persist unless validity and supersession are tracked; long-horizon agents need persistent, selective, temporally aware memory; and human-AI systems should target appropriate reliance rather than raw trust.

## Implementation plan

1. Define a `revision_provenance_record` schema.
2. Attach one record to each public-facing claim block.
3. Add a release gate that requires revision reason, source status, privacy status, missingness, and claim status before publishing.
4. Add a diff-safe mode that stores previous public wording but never stores private source text.
5. Add a scorecard that tests whether revision history improves accountability without leaking protected context.
6. Add fixtures for safe public source updates, private correction without exposure, implementation downgrade, temporal supersession, and symbolic-overreach correction.

## Boundary statement

Revision provenance is not a confession layer and not a transcript layer. It is a public accountability layer for showing how a claim changed without moving protected context into public view.
