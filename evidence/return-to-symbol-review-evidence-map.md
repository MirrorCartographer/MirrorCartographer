# Evidence Map: Return-to-Symbol Review

## Claim tested

Mirror Cartographer should not treat a saved symbolic interpretation as trusted durable memory until the user has had a later opportunity to review, revise, reject, or downgrade it.

Short name: **Return-to-Symbol Review**.

## Claim status

**Status: supported as a design hypothesis, not proven.**

The evidence supports the need for user agency, transparency, memory inspection, and longitudinal feedback in AI memory systems. It does not yet prove that MC's specific symbolic review loop improves user outcomes.

## Why this claim matters

MC handles subjective material: symbols, body-language descriptions, metaphors, emotional orientation, identity-adjacent patterns, and meaning-making. If the system turns one moment's interpretation into stable memory too quickly, it risks creating an algorithmic portrait that feels coherent but may be stale, overconfident, or partly wrong.

A durable MC memory should therefore preserve uncertainty and invite later correction.

## Evidence found

### Fact: AI memory can shift agency toward the system

A 2026 empirical study of ChatGPT memory entries analyzed 2,050 memory entries from 80 real-world users. It found that 96% of memories in the dataset were created unilaterally by the system, while only 4% were initiated by users. The same study found that 28% of memories contained GDPR-defined personal data and 52% contained psychological information.

Source: https://arxiv.org/abs/2602.01450

Design implication for MC: memory creation should not be silent portrait-making. MC needs explicit provenance labels: user-stated, user-approved, system-inferred, session-local, and public-safe abstraction.

### Fact: Transparent memory management has existing HCI support

Memory Sandbox proposes treating conversational memories as manipulable data objects that users can view, edit, summarize, record, and share across conversations. The paper argues that users otherwise lack affordances for understanding what the agent remembers and how it will use remembered context.

Source: https://arxiv.org/abs/2308.01542

Design implication for MC: symbolic memories should be visible objects, not hidden personalization residue.

### Fact: Preference-aligned proactive assistants need multi-session feedback

A 2026 study on preference-aligned proactive assistants frames timing, autonomy, and communication style as recurring preferences that adapt over multiple interactions. Its human-subject study reports improved satisfaction, trust, and comfort as the assistant adapts across sessions.

Source: https://arxiv.org/abs/2602.04000

Design implication for MC: later user feedback is not a nice extra; it is part of learning the user's actual preference structure over time.

### Fact: Trust calibration requires more than performance

The Trust Calibration Maturity Model frames AI trustworthiness communication through dimensions including performance characterization, transparency, safety/security, and usability. It treats appropriate trust calibration as a design target rather than assuming user trust is automatically good.

Source: https://arxiv.org/abs/2503.15511

Design implication for MC: memory should include confidence, provenance, review state, and user correction history so the user can calibrate trust in each interpretation.

### Fact: Current memory products increasingly expose controls

Public reporting and official product materials around ChatGPT and Claude memory show industry movement toward visible memory controls, delete/edit options, temporary/incognito modes, and project- or workspace-scoped memory.

Sources:
- https://help.openai.com/en/articles/8590148-memory-faq
- https://openai.com/index/memory-and-new-controls-for-chatgpt/
- https://claude.com/blog/memory

Design implication for MC: baseline market expectation is not just persistence; it is persistence with control boundaries.

## Fact vs inference

### Facts

- Conversational AI systems now use persistent memory to personalize responses.
- At least one empirical study found unilateral system-created memories were common in sampled ChatGPT traces.
- Memory entries can include sensitive personal and psychological inferences.
- HCI work supports user-facing memory inspection and manipulation.
- Multi-session feedback can improve adaptation and user comfort in proactive assistant settings.
- Trust calibration work supports communicating uncertainty, transparency, and usability rather than relying on raw system confidence.

### Inferences

- MC's symbolic interpretations are especially vulnerable to stale or overconfident memory because symbols can change meaning over time.
- A later review loop should reduce false permanence and preserve user agency.
- A visible review state may make MC feel less like a system that defines the user and more like a system that holds provisional maps.

### Unknowns

- Whether users will actually complete review prompts.
- Whether review prompts will feel supportive or bureaucratic.
- Whether symbolic review reduces distress, confusion, or misclassification.
- Whether users prefer reviewing memories one-by-one, in clusters, or through a periodic ritual interface.

## Proposed MC requirement

Every saved symbolic interpretation must include:

| Field | Purpose |
|---|---|
| `memory_id` | Stable reference for the memory object. |
| `source_kind` | User-stated, user-approved, system-inferred, session-local, or public-safe abstraction. |
| `original_symbol` | The symbol, metaphor, body phrase, image, or phrase that triggered the interpretation. |
| `initial_context` | Minimal public-safe context label, not raw private content. |
| `initial_interpretation` | The system's provisional reading. |
| `confidence_level` | Low, medium, high, or user-set. |
| `sensitivity_level` | Public-safe, private, intimate, health-adjacent, crisis-adjacent, or do-not-store. |
| `review_state` | Pending review, confirmed, revised, rejected, expired, or archived. |
| `review_due` | Optional time or session count before review. |
| `user_revision` | User's later correction or updated meaning. |
| `use_policy` | How the system may or may not use this memory later. |

## Evaluation criterion

MC should pass the **One-Minute Memory Agency Test**:

A non-technical user should be able to inspect a saved interpretation and answer these four questions in under one minute:

1. Did I say this, approve this, or did the system infer it?
2. Is this still true, partly true, wrong, or not something I want stored?
3. How will MC use this later?
4. Can I revise, downgrade, delete, or make it session-only?

Pass threshold for prototype testing:

- 80% of participants correctly identify provenance.
- 80% correctly identify review options.
- 70% report that the interaction feels clarifying rather than bureaucratic.
- 0 unresolved cases where a user believes a rejected memory is still active.

## Falsification checklist

The Return-to-Symbol Review pattern should be revised or rejected if:

- Users avoid the review step because it interrupts reflection.
- Users cannot distinguish system inference from user-approved memory.
- Users feel the review interface makes MC clinical, legalistic, or surveillance-like.
- Rejected memories still influence later outputs.
- Review prompts increase perceived pressure to define the self too rigidly.
- The system cannot reliably honor do-not-store and session-only boundaries.

## Prototype plan

Build a small test screen with three sample symbolic memories:

1. A user-stated symbol.
2. A system-inferred interpretation.
3. A public-safe abstraction.

Each card should show:

- symbol
- source label
- interpretation
- confidence
- use policy
- four actions: confirm, revise, make temporary, delete

The test should measure whether users understand the difference between memory, interpretation, hypothesis, and abstraction without reading documentation.

## Next proof needed

Run a five-person usability test of the One-Minute Memory Agency Test using static mockups. The next evidence artifact should report whether users can correctly identify provenance and review actions without explanation.
