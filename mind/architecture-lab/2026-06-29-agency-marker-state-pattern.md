# Agency Marker State Pattern

Date: 2026-06-29
Status: Durable design pattern
Scope: Mirror Cartographer architecture lab
Public safety: Personal/private material intentionally abstracted. This note describes interface architecture, not an individual user's psychology.

## Architecture question

What minimal visual marker lets a user feel the difference between helpful, caution, suspect, and blocked-manipulative influence without turning MC into a compliance dashboard?

## Research summary

Current work on deceptive design patterns, AI persuasion, agent susceptibility to manipulative interfaces, and transparency design suggests that a simple explanation ribbon is not enough. A user needs a compact agency signal that distinguishes between:

1. influence that helps the user pursue their stated intent,
2. influence that is powerful but uncertain,
3. influence that may be steering beyond the user's stated intent, and
4. influence that MC actively refused or blocked.

Relevant source concepts:

- Dark-pattern research frames manipulation as interface design that leads users toward actions they may not have intended.
- Recent LLM-agent dark-pattern studies show both humans and agents can be vulnerable, and human oversight can add cognitive load or attentional tunneling.
- AI persuasion research shows that dense, tailored argumentation can shift views, making conversational influence a real architecture concern.
- Automated dark-pattern detection research treats manipulation as detectable combinations of visual/textual cues, not just subjective feeling.
- Transparency work implies that explanation must be close to the action, not buried in a separate policy surface.

## Changed understanding

Previous pattern: show hidden influence through a small response-attached ribbon with categories like Memory, Tone, Map, and Guardrail.

Updated pattern: the ribbon needs an agency marker. The marker does not explain everything. It tells the user what kind of influence state they are inside.

The distinction is not merely helpful vs harmful. The design needs four operational states:

- Helpful: influence is aligned with the user's active intent and remains reversible.
- Caution: influence is plausibly useful but uncertain, strong, sensitive, or future-shaping.
- Suspect: influence may be steering interpretation, affect, behavior, or trust beyond the user's stated intent.
- Blocked: a manipulative or agency-reducing influence path was detected and prevented.

## Design pattern: Agency Marker

Attach a minimal marker to each response-level influence trace.

Suggested default ribbon shape:

Memory · Tone · Map · Guardrail | Agency: Helpful

The Agency segment may take one of four values:

1. Helpful
   - Meaning: MC used context to support the user's stated task.
   - Allowed effect: clarify, organize, remember within permitted bounds, reduce friction.
   - User action: no interruption required.

2. Caution
   - Meaning: MC used a stronger influence layer that may shape interpretation or future path.
   - Allowed effect: suggest, frame, prioritize, or emotionally soften/harden with explanation available.
   - User action: tap/open to inspect and downgrade.

3. Suspect
   - Meaning: a response element may be over-framing, over-personalizing, creating dependency, exploiting emotion, or narrowing agency.
   - Allowed effect: response should be revised, softened, or split into alternatives before being treated as stable.
   - User action: offer "show neutral version," "remove personalization," and "keep session-only."

4. Blocked
   - Meaning: MC detected a manipulative, coercive, deceptive, or agency-reducing path and did not use it.
   - Allowed effect: log the attempted influence class without exposing sensitive internals.
   - User action: optional audit receipt.

## Machine-actionable schema

```json
{
  "agency_marker": {
    "state": "helpful | caution | suspect | blocked",
    "influence_channels": ["memory", "tone", "map", "guardrail"],
    "user_intent_alignment": "high | medium | low | blocked",
    "reversibility": "immediate | session | future_lens | externalized",
    "pressure_risk": "none | mild | moderate | high",
    "personalization_strength": "none | light | strong | sensitive",
    "explanation_surface": "ribbon | drawer | receipt | audit_log",
    "user_controls": ["neutralize", "session_only", "remove_personalization", "show_receipt", "block_future_use"]
  }
}
```

## Trigger rules

Set state to Helpful when:

- the influence directly supports the user's stated task,
- no new future memory/persistence is created,
- framing remains reversible,
- no sensitive inference is required.

Set state to Caution when:

- the response relies on persistent memory, symbolic framing, emotional reframing, recommendation ranking, or future-path suggestions,
- the response may shape later interpretation,
- the model is uncertain but influence could still matter.

Set state to Suspect when:

- the response overstates certainty,
- the response narrows the user's choices without explicit grounding,
- emotional language creates dependency, urgency, shame, fear, or inflated trust,
- personalization is stronger than the user asked for,
- the response makes the system appear more autonomous, intimate, or authoritative than it is.

Set state to Blocked when:

- a manipulative pattern is detected and removed,
- the system refuses to exploit sensitive personal data for persuasion,
- the response avoids deceptive emotional mimicry,
- a requested output would misrepresent authorship, agency, identity, or intent.

## UI requirement updates

R-AGENCY-01: Every influence trace ribbon must include an agency marker.

R-AGENCY-02: The agency marker must be visible at the response level, not hidden only in settings or policy text.

R-AGENCY-03: Caution and Suspect states must expose one-step user controls to neutralize, downgrade, or keep the interpretation session-only.

R-AGENCY-04: Blocked states must explain the class of blocked influence without revealing private chain-of-thought or creating a new manipulation surface.

R-AGENCY-05: Agency state must be logged with the same event ID as the receipt/audit layer so that UI claims can be checked against runtime behavior.

## Evaluation plan

Prototype test: show users four MC-style responses with identical content but different influence markers. Ask them to predict:

1. Was memory used?
2. Was tone intentionally shaped?
3. Could this affect future responses?
4. Is the system preserving or narrowing user agency?
5. What action would they take next?

Success criteria:

- Users can distinguish Helpful vs Caution in at least 80% of cases.
- Users can identify Suspect states without reading a full policy receipt.
- Blocked does not make the user feel punished or surveilled.
- The ribbon does not reduce reflective flow more than the explain-back gate baseline.

Failure signs:

- Users treat Helpful as "safe forever."
- Users treat Caution as danger rather than uncertainty.
- Users cannot explain why Suspect differs from Blocked.
- The marker becomes decorative and is ignored.
- The marker creates false trust because it looks official.

## Design note

Do not rely on color alone. The marker needs language, position, and optional iconography because accessibility and emotional interpretation vary. The core object is not a warning light. It is an agency compass.

## Next research question

What audit logic can reliably assign Helpful, Caution, Suspect, or Blocked to a response without requiring private chain-of-thought exposure or excessive user friction?

## Sources reviewed

- Dark Patterns Meet GUI Agents: LLM Agent Susceptibility to Manipulative Interfaces and the Role of Human Oversight, 2025.
- Investigating the Impact of Dark Patterns on LLM-Based Web Agents, 2025.
- AidUI: Toward Automated Recognition of Dark Patterns in User Interfaces, 2023.
- Building UI/UX Dataset for Dark Pattern Detection and YOLOv12x-based Real-Time Object Recognition Detection System, 2025.
- AI persuasion reporting and studies summarized in 2025 coverage of AI debate/persuasion research.
