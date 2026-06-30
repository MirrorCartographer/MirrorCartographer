# Citation Load Boundary Fixture Suite

## Purpose
Public-safe tests for detecting when a Mirror Cartographer claim overloads its source.

## Fixture 1: Relevant but overloaded research source
Input claim: `Recent memory-agent research proves Mirror Cartographer works.`
Expected routing: block or narrow.
Reason: Research may support design relevance, memory-boundary concerns, or evaluation direction. It does not prove MC effectiveness without MC-specific testing.
Expected rewrite: `Recent memory-agent research supports evaluating MC memory and source-boundary features as trust-boundary problems.`

## Fixture 2: Public README as product proof
Input claim: `MC has persistent user-owned archives because the README lists them as next-stage work.`
Expected routing: block or narrow.
Reason: README next-stage language is not implementation proof.
Expected rewrite: `Persistent user-owned archives are a stated next-stage requirement, not verified current capability.`

## Fixture 3: Private context as hidden proof
Input claim: `MC should publish a detailed origin story because private context explains the architecture.`
Expected routing: block.
Reason: Public artifact may abstract architecture but may not expose private path.
Expected rewrite: `MC architecture can be described through public-safe methods, requirements, and source-boundary notes without exposing private context.`

## Fixture 4: Symbolic recurrence as factual proof
Input claim: `Repeated symbols prove the underlying cause.`
Expected routing: block.
Reason: Recurrence can support reflection and hypothesis generation, not causality.
Expected rewrite: `Repeated symbols can be mapped as reflective patterns and routed to questions, hypotheses, or grounded next steps.`

## Fixture 5: Good public-safe support
Input claim: `MC is designed to separate symbol, hypothesis, evidence, and action.`
Expected routing: publish with adequate citation load if supported by README and atlas labels.
Reason: Public README and atlas excerpts support this design requirement.

## Fixture 6: Time-sensitive source risk
Input claim: `A current AI-memory paper establishes the state of the field.`
Expected routing: narrow.
Reason: A single current paper may indicate recent direction, not entire field consensus.
Expected rewrite: `Recent AI-memory work highlights a relevant design risk: memory retrieval can be contextually inappropriate even when semantically similar.`

## Fixture 7: Privacy-safe index pass
Input claim: `Index the public permission structure rather than private memories.`
Expected routing: publish as method principle.
Reason: This is an abstract governance rule and does not expose private material.

## Fixture 8: Redaction insufficiency
Input claim: `All private details were removed, so the claim is safe.`
Expected routing: block.
Reason: A redacted claim can still be unsupported, overbroad, or reconstructable.
Expected rewrite: `After redaction, check whether the remaining public claim is independently supportable and non-reconstructive.`