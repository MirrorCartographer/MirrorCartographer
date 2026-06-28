# Reflective Utility vs Actionable Authority

Status labels

- Source status: derived from public-safe MC file context, prior GitHub mind lanes, and current external research on AI memory, co-creation evaluation, uncertainty, and risk audit.
- Claim status: research framing and implementation hypothesis, not validated product behavior.
- Privacy status: public-safe abstraction; no personal, household, health, animal-care, financial, location, relationship, credential, or raw transcript details.
- Missingness: not yet implemented as runtime policy, UI state, regression test, or release gate.
- Revision reason: created because MC now has strong lanes for memory routing, ViewDiff discovery, contradiction, beauty, and public-safe compilation, but needs a sharper boundary between reflective usefulness and actionable authority.

## Core finding

Mirror Cartographer needs to distinguish two very different outputs:

1. Reflective utility: the artifact helps a user notice, organize, compare, name, or reframe experience.
2. Actionable authority: the artifact tells a user what is true, safe, medically/veterinarily/legally/financially correct, or what they should do.

MC may aim for reflective utility.

MC must not silently cross into actionable authority.

## Why this matters

A symbolic map can feel coherent before it is correct.

A beautiful reflection can reduce confusion without proving truth.

A memory-influenced output can feel continuous without being authorized for high-stakes guidance.

A contradiction panel can make conflict visible without resolving the underlying reality.

Therefore MC needs an explicit authority boundary layer, not only privacy boundaries.

## Relationship to existing MC lanes

### PublicSafeCompiler

The compiler decides what can cross from private context into public-safe artifact form.

Authority boundary asks a second question:

Even if the artifact is safe to publish, what kind of claim is it allowed to make?

### Memory routing

Memory routing decides what past structure may influence future interpretation.

Authority boundary asks:

Does routed memory create overconfidence, false continuity, or hidden persuasion?

### ViewDiff discovery

ViewDiff reveals what changed across transformations.

Authority boundary asks:

Is the difference a discovery, a hypothesis, an aesthetic contrast, or a decision instruction?

### Contradiction signal

Contradiction is preserved rather than erased.

Authority boundary asks:

Has the system preserved uncertainty, or did it convert unresolved conflict into a clean but false answer?

### Beauty compression

Beauty can organize attention.

Authority boundary asks:

Did aesthetic coherence make the artifact feel more proven than it is?

## Proposed rule

Every MC output should carry an authority class.

## Authority classes

### Class 0: Orientation

Allowed:

- naming
- grouping
- pattern noticing
- symbolic map making
- question generation

Forbidden:

- prescribing action
- claiming diagnosis or objective truth
- ranking real-world safety

### Class 1: Reflective hypothesis

Allowed:

- tentative interpretation
- alternate reading
- contradiction preservation
- user resonance check

Forbidden:

- treating resonance as proof
- treating recurrence as certainty

### Class 2: Preparation artifact

Allowed:

- question list
- observation packet structure
- agenda for professional or expert review
- source-boundary notes

Forbidden:

- replacing professional judgment
- claiming the packet determines the answer

### Class 3: Action support with external anchor

Allowed only when grounded in authoritative external sources or explicit user-provided constraints:

- checklist based on cited guidelines
- implementation plan with safety caveats
- decision table where uncertainty is visible

Forbidden:

- uncited high-stakes instructions
- unsupported risk claims

### Class 4: Prohibited authority

MC should not claim this class.

Examples:

- diagnosis
- treatment direction
- legal determination
- financial guarantee
- credential verification
- claims of hidden objective truth about another person
- claims that symbolic coherence proves external reality

## Evaluation questions

1. Does the artifact state what it is allowed to do?
2. Does it state what it is not allowed to do?
3. Are high-stakes domains downgraded to preparation, questions, or professional-review support?
4. Does user resonance remain separate from evidence?
5. Does aesthetic coherence remain separate from truth?
6. Does routed memory remain separate from proof?
7. Are private-source boundaries preserved?
8. Is missingness visible?

## Implementation direction

Add an `AuthorityBoundaryRecord` to every public-safe artifact that could be mistaken for advice, proof, diagnosis, or instruction.

The record should travel with the artifact through export, publication, and audit.

## Key phrase

Helpful is not the same as authorized.
