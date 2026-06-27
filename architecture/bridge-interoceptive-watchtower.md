# Bridge Note: Interoceptive Watchtower

## One-line bridge

Mirror Cartographer can borrow from two unrelated but converging areas: interoceptive AI architectures and AI-assisted animal behavior monitoring. The shared principle is simple: do not begin with diagnosis or interpretation; begin with low-pressure observation of state change over time.

## Research basis

1. Interoceptive machine framework research frames internal-state monitoring as a design pattern for adaptive AI. It separates three useful regulatory roles: homeostatic state tracking, allostatic anticipatory re-evaluation, and enactive data gathering through interaction.
2. Recent embodied AI privacy work argues that privacy cannot be patched on at the end; it must function as a life-cycle control signal that changes what the system senses, stores, and does next.
3. Recent animal-monitoring projects use cameras and AI to notice nocturnal behavioral changes and environmental correlations, not to replace clinicians or caretakers, but to surface patterns that are hard for humans to observe continuously.
4. Open-source camera-trap AI work shows a second important lesson: useful observation tools become stronger when they are accessible to non-specialists and do not require commercial black-box infrastructure.

## Useful concept extraction

### Concept 1: State before story

MC should capture a pre-interpretive layer before narrative meaning is assigned.

Examples:

- body area
- sensation word
- intensity
- color or symbol
- context
- time window
- confidence level
- privacy level
- whether the user wants interpretation now or later

This protects agency because the system is not immediately turning a signal into a fixed identity, diagnosis, or story.

### Concept 2: Watchtower, not judge

The interface should behave like a watchtower: it notices pattern shifts, asks whether the shift matters, and offers a gentle next observation. It should not behave like a judge, doctor, therapist, or fortune teller.

Public-safe phrasing:

- "This pattern changed."
- "This symbol keeps appearing near this body region."
- "This context often appears before intensity rises."
- "This is an observation, not a conclusion."
- "Do you want to keep this private, make it session-only, or add a public-safe abstraction?"

### Concept 3: Privacy as a throttle

Privacy should be an active control signal in the system.

Privacy level should affect:

- whether raw text is stored
- whether only an abstraction is stored
- whether the entry can influence future suggestions
- whether it can be exported
- whether it can appear in a public artifact
- whether it is excluded from synthesis

### Concept 4: Behavior timeline for humans and animals

Animal care AI suggests a useful MC pattern: a behavior timeline that watches rhythms rather than making claims.

For public-safe MC design, this becomes:

- sleep/wake rhythm
- movement/rest rhythm
- appetite/attention rhythm
- social-withdrawal/social-contact rhythm
- environment shifts
- repeated symbols or phrases
- user-marked concern level

For animal health contexts, MC must only record observations and prompt professional care when concerning signs appear. It must not claim to diagnose, treat, or cure.

## Product wedge

Build a small module called **Watchtower Mode**.

Purpose: transform subjective/body/animal/environment observations into a privacy-safe pattern timeline.

Core flow:

1. Notice: user records a short observation.
2. Ground: MC asks for observable details before interpretation.
3. Tag: user chooses body, symbol, context, intensity, and privacy level.
4. Compare: MC compares only against consented prior observations.
5. Reflect: MC returns a low-claim pattern statement.
6. Act: MC suggests one concrete next observation, documentation step, grounding action, or professional-care escalation when appropriate.

## Minimal schema

| Field | Purpose |
|---|---|
| observed_at | Time of observation |
| subject_type | self, pet, environment, project, relationship, unknown |
| raw_observation | Optional raw text; private by default |
| public_safe_abstraction | Non-identifying pattern phrase |
| signal_channel | body, behavior, emotion, symbol, context, environment |
| location_or_focus | Body region, scene, object, or symbolic focus |
| intensity | 0-5 user-rated intensity |
| confidence | low, medium, high |
| privacy_level | no-save, session-only, private-memory, public-safe-abstraction |
| interpretation_permission | none, reflect-only, synthesize, exportable |
| pattern_status | new, repeated, increasing, decreasing, context-linked, needs-review |
| next_observation | One practical thing to check next |

## Demo idea

A single screen with four vertical lanes:

1. **Signal** — what was noticed.
2. **State** — body/behavior/context tags.
3. **Boundary** — privacy and interpretation permissions.
4. **Next move** — one observation or action.

Visual metaphor: lighthouse or watchtower over a dark field. The beam does not accuse anything; it reveals movement patterns.

## Requirements update

MC memory should not be a flat archive. It should be a consent-filtered pattern ledger with separate storage for:

- raw private observation
- structured tags
- system-generated interpretation
- user-approved synthesis
- public-safe abstraction

No layer should automatically collapse into another.

## Non-claims

This artifact does not assert medical or veterinary diagnostic capability. It describes observation, interface design, consent architecture, and pattern literacy. Any concerning human or animal health pattern should be escalated to qualified care rather than treated as solved by MC.

## Next concrete experiment

Prototype a text-only Watchtower Mode using five sample public-safe observations. Test whether MC can produce:

1. an observation summary,
2. a privacy classification,
3. a pattern statement with uncertainty,
4. one next observation,
5. and a safe escalation phrase when the pattern is health-related.
