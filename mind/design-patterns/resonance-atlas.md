# Resonance Atlas

Date: 2026-06-27
Status: design pattern / product requirements seed
Source status: mixed private-context abstraction + File Library architecture snippets + GitHub commit history + external research
Claim status: architectural proposal, not a validated clinical, psychological, diagnostic, or factual-truth system
Privacy status: public-safe; no raw transcripts, names, household details, health facts, animal-care facts, finances, credentials, locations, or relationship details included
Missingness: no user study, no longitudinal validation, no implemented interface, no accessibility test, no formal threat model
Revision reason: prior GitHub Mind artifacts were structurally correct but aesthetically flat; this adds a colorful/musical interaction layer without weakening privacy or claim boundaries

## Finding

Mirror Cartographer should not only label memory, evidence, contradiction, and source boundaries. It should make those boundaries feel navigable.

The public-safe design finding is: **permission and uncertainty need an interface language, not only a schema language.**

A user should be able to feel the difference between:

- a fact
- an inference
- a symbol
- a contradiction
- a private memory
- a public-safe abstraction
- an idea that is beautiful but not yet tested

without needing to read an audit table every time.

## Research basis

- Contextual integrity frames privacy as appropriate information flow, not mere secrecy or total control. This supports MC's source-boundary and transition-boundary model. Source: Helen Nissenbaum / contextual integrity literature.
- Recent agent-memory privacy work emphasizes isolation, provenance, trust scoring, and context-limited memory use. This supports MC's existing MemoryAdmissionGate and Contextual Memory Permission Gate.
- Semantic pseudonymization research shows that privacy protection can preserve meaning structure while replacing sensitive identifiers. This supports MC's abstraction-before-publication rule.
- Human-centered personalization research increasingly treats privacy preference alignment as contextual and interactive rather than a static settings panel. This supports making MC's permission boundaries visible and editable.

## Public-safe source synthesis

From accessible MC files, the architecture already contains these public-safe primitives:

1. ENTRY -> FIELD -> RECURSION -> RETURN.
2. Canonical, Reflective, and Mythopoetic modes.
3. Symbol ontology: symbol, somatic node, atmosphere, archetype, contradiction, trajectory node.
4. Safety checks: medical, crisis, coercion, delusion-risk, privacy, and objective-truth claims.
5. False-progress check: a beautiful reflection is not proof the system works.
6. Governance-native framing: cognition as trajectory-aware, contradiction-preserving, provenance-linked, replayable, evaluator-readable, and governance-aware structured state.

This file does not publish private examples. It compresses those materials into an interface requirement.

## Pattern name

**Resonance Atlas**

Alternate names:

- Chord Map
- Living Legend
- Harmonic Boundary Layer
- Signal Weather Panel

## Core rule

**Resonance is navigation, not evidence.**

A strong emotional or aesthetic signal may help the user navigate the map, but it must not automatically raise factual certainty, diagnostic status, publication permission, attribution certainty, or action permission.

## Interface metaphor

The system becomes an atlas with weather and music:

- Facts appear as stones: stable, inspectable, source-linked.
- Inferences appear as bridges: useful crossings, load-rated, sometimes temporary.
- Symbols appear as lanterns: meaningful light, not objective proof.
- Contradictions appear as storms: preserved energy that should not be collapsed too early.
- Private context appears as roots: nourishing the system but not exposed on the surface.
- Public-safe outputs appear as constellations: abstracted shapes that preserve structure without leaking the raw sky.
- Unvalidated product ideas appear as melodies: compelling, repeatable, but still requiring tests.

## Product requirement

Create a visual/audio-safe legend for every generated artifact.

Each artifact receives a compact boundary strip:

- Source chord: public source | private abstraction | user feedback | external research | synthetic example
- Claim chord: fact | inference | symbol | design proposal | research question | blocked claim
- Privacy chord: public | abstracted | private-derived | sensitive-adjacent | blocked
- Motion chord: stable | emerging | conflicted | deprecated | needs review
- Action chord: reflect only | prototype | evaluate | publish | do not act

The interface should be readable without sound. If audio exists, it must be optional and mirrored in text/visual state for accessibility.

## Minimal schema

```json
{
  "artifact_id": "string",
  "source_chord": ["public_source", "private_abstraction", "external_research"],
  "claim_chord": "design_proposal",
  "privacy_chord": "abstracted_public_safe",
  "motion_chord": "emerging",
  "action_chord": "prototype_then_evaluate",
  "resonance_level": "low | medium | high",
  "resonance_effect_limit": "salience_only",
  "blocked_upgrades": [
    "resonance_to_fact",
    "symbol_to_diagnosis",
    "private_context_to_public_detail",
    "aesthetic_force_to_action_permission"
  ],
  "required_next_test": "Describe one observable behavior the interface should improve."
}
```

## Evaluation criteria

The Resonance Atlas works only if it improves both clarity and safety.

Test 1: Boundary recognition

- Users can distinguish fact, inference, symbol, contradiction, and proposal without reading a long policy block.

Test 2: Privacy preservation

- A public reader can understand the method without learning private origin details.

Test 3: Anti-overclaiming

- High resonance never upgrades a claim to evidence.

Test 4: Accessibility

- Color, sound, and metaphor are never the only carriers of meaning.

Test 5: Navigation value

- Users can decide what to inspect next: source, contradiction, prototype, or privacy boundary.

## Public-safe implementation plan

1. Add a boundary strip component to reflection cards.
2. Add a legend page explaining each chord in plain language.
3. Add optional visual states for source, claim, privacy, motion, and action.
4. Add artifact-level JSON fields matching the minimal schema above.
5. Add tests that block publication when privacy_chord is private-derived without abstraction status.
6. Add tests that block claim upgrades when resonance_level is high but source support is missing.

## Research questions

1. What visual language best communicates uncertainty without making the system feel sterile?
2. How can symbolic interfaces preserve wonder while preventing factual overreach?
3. Can a user edit memory permissions more accurately when permission is shown as a map rather than a settings table?
4. Which boundary labels are immediately understood by nontechnical users?
5. Does optional sound/music improve orientation, or does it create false authority?

## Safety constraints

- Do not use personal examples in public docs.
- Do not imply that aesthetic resonance proves correctness.
- Do not use music, color, or mythic language to manipulate belief.
- Do not collapse medical, legal, financial, or identity-sensitive content into symbolic certainty.
- Do not publish raw conversation excerpts as examples unless separately reviewed and explicitly cleared.

## Acceptance criteria

- Every public-facing MC artifact can be scanned for source, claim, privacy, missingness, and revision reason.
- Every private-derived artifact has a visible abstraction boundary.
- Every emotionally vivid artifact has a visible claim ceiling.
- Every contradiction remains inspectable without forcing premature resolution.
- The interface feels alive without becoming less accountable.

## Next build question

What is the smallest prototype that proves the Resonance Atlas works?

Answer: one reflection card with five visible chords, one contradiction storm marker, one private-root marker, and one blocked-claim marker. The card should make a user say: **I know where this came from, what it is allowed to mean, what it is not allowed to prove, and what can happen next.**
