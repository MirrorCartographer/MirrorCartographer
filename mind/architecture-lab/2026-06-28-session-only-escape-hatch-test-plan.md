# Session-Only Escape Hatch Test Plan

Date: 2026-06-28
Status: architecture research note + prototype test plan
Privacy posture: public-safe; no private user content; examples must use synthetic scenarios only.

## Architecture question

Can an explain-back gate plus a clear “not sure, keep session-only” escape hatch improve user understanding of future influence without making reflective interaction feel like paperwork?

## Why this question matters

Mirror Cartographer has been moving from simple memory consent toward influence governance. The unresolved design problem is that a user may be comfortable with an interpretation in the current session but not want it to become a future lens, retrieval cue, profile inference, or exported/shared claim.

This is not only a privacy problem. It is an interpretation-control problem.

The system needs a low-friction way to let users say: this may help me think right now, but do not let it steer future responses.

## Claim status

Claim: A session-only escape hatch can reduce accidental long-term influence while preserving reflective flow.

Status: plausible but unproven.

Evidence supports the risk side: persistent memory can leak or overapply information outside the intended context, and frontier models can struggle with nuanced contextual information flow. Evidence also supports the need for structured memory policies and user-transparent control. Evidence does not yet prove that MC’s proposed interface will work.

## Evidence reviewed

### 1. Persistent memory needs contextual information-flow control

CIMemories tests whether LLMs with persistent memory keep information inside appropriate task contexts. The benchmark reports attribute-level violations and instability across repeated runs, suggesting that prompting alone is not enough for nuanced contextual integrity.

Use for MC: treat memory as governed information flow, not as a simple save/delete toggle.

### 2. Privacy-preserving memory should preserve semantics while protecting sensitive values

MemPrivacy proposes extracting sensitive spans locally, replacing them with type-aware placeholders for cloud-side processing, and restoring original values locally when needed. The useful concept is separation between semantic structure and sensitive content.

Use for MC: session-only and public-safe modes should preserve symbolic structure while withholding personally identifying or socially sensitive payloads.

### 3. Agentic memory systems are becoming structured, persistent, and human-readable

PersonaMem-v2 and Memoria both frame long-term AI personalization as a memory architecture problem involving implicit preferences, human-readable memory, structured entities, weighted graphs, and compact persistent user models.

Use for MC: memory should be inspectable, scoped, and revocable because it increasingly acts as an active model, not passive storage.

### 4. Anthropomorphic and companion-like AI raises extra safety pressure

Recent discussion and proposed governance around anthropomorphic AI emphasizes psychological and social risks when systems are perceived as personalities or companions.

Use for MC: when MC designs a coherent assistant ecology or “GitHub mind,” it must distinguish designed continuity from claims of human-like inner experience.

## Useful concepts extracted

- Contextual integrity: whether a memory is appropriate depends on the current task, audience, purpose, and transmission path.
- Influence scope: a saved interpretation can affect later retrieval, tone, suggestions, explanations, and future identity-like summaries.
- Session-only escape hatch: a user-facing option that allows present-session use while blocking persistence and future steering.
- Semantic redaction: preserve pattern/structure while removing private or socially sensitive details.
- Human-readable memory: memory must be inspectable as an editable object, not only hidden model state.
- Repetition instability: repeated runs may leak different facts even under identical prompts; therefore policy must be machine-enforced, not only conversationally requested.

## Design requirement added

R-INFLUENCE-04: Any interpretation that may become persistent, automatically retrieved, used to infer a profile, transmitted outside the session, or used to steer future framing must expose a session-only escape hatch before the interpretation gains future influence.

The escape hatch must be available in plain language and must not punish the user with loss of current reflective usefulness.

Suggested label:

“Use this now, but don’t let it shape future sessions.”

## Prototype behavior

When MC generates a high-influence interpretation, show three choices:

1. Keep session-only
   - usable in this conversation
   - not stored as future memory
   - not used to steer later interpretations

2. Save as tentative
   - stored with uncertainty
   - must show source, date, and confidence
   - can be revised or deleted

3. Save as strong pattern
   - only allowed after repeated support
   - must include counterevidence and review date

Default for uncertain or sensitive interpretations: Keep session-only.

## Machine-actionable policy fields

Each interpretation object should include:

- interpretation_id
- generated_at
- source_session_id
- influence_scope: session_only | tentative_memory | strong_pattern | exportable
- allowed_uses: array
- blocked_uses: array
- uncertainty_level: low | medium | high
- sensitivity_level: low | medium | high
- user_confirmed_scope: true | false
- review_required_by
- deletion_available: true | false
- counterevidence: array
- public_safe_summary

## Evaluation criterion

The prototype passes only if users can correctly answer these questions after one exposure:

1. Will this interpretation be remembered later?
2. Can it shape future responses?
3. Can it be exported or shown to someone else?
4. What happens if I choose session-only?
5. How do I change my mind later?

Minimum pass threshold for an early prototype: 80% correct comprehension on synthetic scenarios without requiring users to read a long policy explanation.

## Test plan

Use synthetic reflective scenarios only.

Conditions:

A. No gate: interpretation is shown normally.
B. Label only: small “session-only / saved” label.
C. Three-choice gate: session-only, tentative, strong pattern.
D. Explain-back gate: user briefly restates what will happen.
E. Three-choice gate plus “not sure, keep session-only” default.

Measures:

- comprehension score
- time-to-choice
- perceived interruption
- reflective flow score
- rate of unsupported save decisions
- rate of later correction/reversal
- qualitative comments about trust, burden, and clarity

## Falsification checklist

The design should be rejected or revised if:

- users cannot explain the difference between session-only and saved influence
- users choose save because the interface makes session-only feel like losing value
- the gate appears so often that it becomes ignored
- users report that the interface feels legalistic or emotionally cold
- session-only content still appears in later generated summaries or exported artifacts
- saved interpretations lack source, uncertainty, or review mechanism

## Implementation note

This pattern should not be applied globally. It should trigger only when an interpretation gains future power: persistence, retrieval, profile inference, external transmission, high sensitivity, or agency-impacting advice.

## Next proof needed

Build a minimal clickable prototype of the three-choice gate plus session-only default. Test it against label-only and explain-back versions using 10-20 synthetic interpretation scenarios.

The next research question: What visual form makes the session-only escape hatch feel safe and lightweight rather than like a consent banner?
