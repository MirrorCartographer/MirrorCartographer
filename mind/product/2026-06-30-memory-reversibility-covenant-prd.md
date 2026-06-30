# PRD: Memory Reversibility Covenant

## Product problem

Mirror Cartographer tracks repeated symbols, somatic words, metaphors, contradictions, and user feedback over time. Persistent continuity can improve reflection, but it can also make old, weak, private, or context-mismatched material feel more authoritative than it is.

The product needs a visible way to say: this memory was useful before, but it is no longer allowed to carry the same claim.

## Goal

Add a reversible memory-status layer that lets MC admit, limit, downgrade, quarantine, revoke, or expire remembered material without exposing private source content.

## Non-goals

- No diagnosis.
- No therapy replacement.
- No medical, veterinary, legal, financial, or credential claims.
- No raw transcript exposure.
- No public release of private context.
- No hidden escalation from symbolic resonance to factual proof.

## User-facing language

Preferred public copy:

- This memory is active for reflection.
- This memory is historical context only.
- This pattern is symbolic, not evidence.
- This source is too weak for that claim.
- This memory was downgraded because its context changed.
- This item is private-context only and cannot be published.

Avoid:

- The AI knows you.
- This proves the pattern.
- The system diagnosed the source.
- The archive says it is true.
- The memory is objective evidence.

## Functional requirements

1. Every memory-like object must carry status: active, limited, downgraded, quarantined, revoked, or expired.
2. Every status must include source status, claim status, privacy status, missingness, and revision reason.
3. The interface must separate symbolic continuity from evidentiary authority.
4. User correction must be able to lower or revoke memory authority.
5. External source conflict must trigger review instead of silent overwrite.
6. Health-adjacent or high-stakes interpretations must default to lower authority.
7. Mythopoetic mode may reuse symbolic texture only when labeled speculative/creative.
8. Canonical mode may use only source-grounded and currently admitted material.
9. Reflective mode may connect user-stated patterns, but must preserve uncertainty.

## Acceptance tests

- Given a remembered symbolic pattern, when the user says it no longer fits, then the record is downgraded or corrected and the prior reading no longer appears as active evidence.
- Given a source with weak provenance, when the output tries to make a strong claim, then the UI shows claim overload and blocks the claim.
- Given a private-context source, when generating public docs, then only abstract rule language appears.
- Given an old memory, when no review condition has been met, then it appears as historical context, not current truth.
- Given Mythopoetic mode, when symbolic material is reused, then the output labels it creative/speculative.

## Public-safe implementation plan

1. Add memory status enum.
2. Add revision reason field.
3. Add claim-lane validator.
4. Add user correction action.
5. Add expiry/review trigger.
6. Add public-safe export filter.
7. Add fixture suite for downgrade, revocation, expiry, contradiction, and privacy lock.

## Privacy status

Public-safe. This PRD contains no private transcript, household, health, animal-care, financial, location, relationship, credential, or raw personal details.
