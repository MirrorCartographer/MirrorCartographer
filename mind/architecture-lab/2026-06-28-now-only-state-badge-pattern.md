# Now-Only State Badge Pattern

Date: 2026-06-28
Status: proposed design pattern + prototype requirement
Public-safety note: this artifact abstracts personal/private examples into generic reflective-interface behavior.

## Architecture question

What visual form makes "use this now, do not let it shape later" feel safe and lightweight instead of like a consent banner?

## Short answer

Do not use a banner as the primary control. Use a persistent, low-friction state badge attached to each interpretation:

- Now-only
- Session memory
- Future lens
- Share/export

The badge should sit directly on the interpretation object, not in a separate settings panel. It should be reversible, explainable, and machine-actionable.

## Claim status

Partially supported by adjacent evidence. Not proven for Mirror Cartographer until prototype testing.

Supported:
- Consent banners and policy interfaces often create burden without reliable comprehension.
- Interface structure can guide attention, but comprehension depends on sustained attention, not layout alone.
- Privacy labels and standardized summaries can help when they are accurate, short, and generated from real system behavior rather than vague self-report.
- Dark-pattern research shows that obstruction, hidden choices, asymmetric friction, and delayed revocation undermine meaningful control.

Inference:
- MC should avoid repeating consent-banner mechanics and instead place influence controls at the object being interpreted.
- A visible interpretation-level state badge may preserve reflective flow better than modal consent.
- The right control target is future influence, not privacy alone.

Unknown:
- Whether users understand the badge vocabulary without training.
- Whether the badge reduces unsupported acceptance of interpretations.
- Whether users remember the difference between "now-only" and "future lens" after a session.

## Research basis

Primary/high-quality sources reviewed:

1. Wei Xiao, Mengke Wu, Yeeun Jo, "Designing for Understanding: How Interface-Level Consent Designs Shape Attention and Understanding in Privacy Disclosures" (2026). Eye-tracking study comparing scrolling, collapsible sections, and previews. Finding: guided layouts shape attention and engagement, but comprehension depends on sustained attention rather than interface type alone.
   URL: https://arxiv.org/abs/2603.13747

2. Haoze Guo, Ziqi Wei, "The Privacy Placebo: Diagnosing Consent Burden through Performative Scrolling" (2026). Proposes the Performative Scrolling Index to audit burden before meaningful non-accepting alternatives become visible and actionable. Useful concept: friction can become ritualized performance rather than understanding.
   URL: https://arxiv.org/abs/2604.17129

3. Paul Graßl, Hanna Schraffenberger, Frederik Zuiderveen Borgesius, Moniek Buijzen, "Dark and Bright Patterns in Cookie Consent Requests" (2025). Experiments on default, aesthetic manipulation, and obstruction in consent requests. Useful concept: nudges can move decisions, but perceived control can be misleading; meaningful choice requires more than a privacy-friendly visual nudge.
   URL: https://arxiv.org/abs/2509.18210

4. Nivedita Singh, Seyoung Jin, Hyoungshick Kim, "When the Abyss Looks Back: Unveiling Evolving Dark Patterns in Cookie Consent Banners" (2026). Large-scale detection of evolving dark patterns in consent flows. Useful concept: revocation barriers, fake opt-outs, and multi-step ambiguity are core failure modes.
   URL: https://arxiv.org/abs/2603.21515

5. Tianshi Li, Lorrie Faith Cranor, Yuvraj Agarwal, Jason I. Hong, "Matcha: An IDE Plugin for Creating Accurate Privacy Nutrition Labels" (2024). Developer tool for more accurate app privacy labels. Useful concept: labels should be grounded in system behavior and developer-verifiable implementation details.
   URL: https://arxiv.org/abs/2402.03582

6. Meixue Si et al., "Privacy Nutrition Labels for Open-source Generative AI-based Applications" (2024). Finds low privacy-policy coverage among examined open-source GAI apps and proposes GAI privacy labels. Useful concept: generative-AI transparency needs standardized, compact notices tied to code/system behavior.
   URL: https://arxiv.org/abs/2407.15407

## Extracted concepts for MC

### 1. Consent burden is not comprehension

A user can scroll, click, or confirm without forming a reliable model of future influence. MC should avoid making the user perform attention. The interface should make the state of an interpretation visible without forcing ritualized interaction.

Design rule: never require a long modal to protect future influence when a small reversible control can do the job.

### 2. Place control at the object of influence

The privacy-control target in MC is not only data. It is the interpretation: a generated meaning, label, metaphor, pattern, or hypothesis that could later shape retrieval or response.

Design rule: every interpretation object carries its own influence state.

### 3. Revocation must be as easy as granting influence

If an interpretation can become a future lens in one click, it must be demoted to now-only in one click. If it can be shared/exported, transmission must be separately visible and revocable where possible.

Design rule: influence escalation and influence rollback must have symmetric friction.

### 4. Labels must be implementation-grounded

A badge is only valuable if it maps to actual system behavior. "Now-only" must technically block profile write, future retrieval, cross-session inference, and export by default.

Design rule: every visible state must correspond to policy fields the system enforces.

### 5. Progressive disclosure should reveal consequences, not hide choices

A compact badge can show the current state. Expanding it should reveal consequences and controls, not bury the non-accepting option.

Design rule: collapsed view = state; expanded view = why, where it can influence, and how to change it.

## Proposed pattern

### Name

Now-Only State Badge

### Purpose

Let a user allow an interpretation to help in the current reflective moment while preventing it from becoming a persistent lens, profile fact, retrieval key, recommendation driver, or exported context.

### Visual behavior

Each interpretation card has a small state badge near the interpretation title or first line.

Recommended states:

1. Now-only
   Meaning: can be used in this moment; does not shape future sessions.

2. Session memory
   Meaning: can shape the current session until reset/end; not cross-session memory.

3. Future lens
   Meaning: may shape later interpretation, retrieval, and personalization.

4. Share/export
   Meaning: may be included in outgoing artifacts, summaries, or shared views.

### Interaction behavior

Default: Now-only for uncertain, sensitive, intimate, or newly generated interpretations.

Escalation: user can intentionally promote Now-only -> Session memory -> Future lens. Share/export is separate and never bundled into Future lens.

Demotion: user can demote Future lens -> Session memory -> Now-only with equal or lower friction than escalation.

Explain-back trigger: only required when escalating to Future lens or Share/export, or when the interpretation is high-impact, high-uncertainty, or concerns another person.

### Copy examples

Collapsed badge:
- Now-only
- Session
- Future lens
- Exportable

Expanded description:
- Use now: this can guide the current reflection only.
- Keep for session: this can guide the rest of this session.
- Future lens: this may shape later reflections.
- Exportable: this may appear in shared or downloadable artifacts.

Escape hatch:
- Not sure? Keep now-only.

## Machine-actionable schema

```json
{
  "interpretation_id": "string",
  "influence_state": "now_only | session_memory | future_lens | exportable",
  "allowed_operations": {
    "current_response_use": true,
    "session_retrieval": false,
    "cross_session_retrieval": false,
    "profile_write": false,
    "recommendation_influence": false,
    "external_transmission": false
  },
  "explain_back_required": false,
  "sensitivity_flags": [],
  "uncertainty_level": "low | medium | high",
  "created_from": ["user_input", "model_inference", "uploaded_artifact", "external_source"],
  "revocation_available": true,
  "revocation_effect": "future_use_blocked | profile_write_removed | export_blocked",
  "audit_event_required": true
}
```

## Requirements update

### R-INFLUENCE-04: Interpretation-level influence state

Every generated interpretation that can shape later system behavior must carry a visible influence state and an enforceable policy state.

Acceptance criteria:
- The UI shows the current state beside the interpretation.
- The backend policy prevents operations not allowed by that state.
- Now-only blocks profile write, cross-session retrieval, recommendation influence, and external transmission by default.

### R-INFLUENCE-05: Symmetric rollback

Users must be able to reduce an interpretation's future influence with no more friction than was required to grant it.

Acceptance criteria:
- Demotion from Future lens to Now-only is available wherever the interpretation appears.
- Revocation writes an audit event.
- The user is told what rollback can and cannot undo.

### R-INFLUENCE-06: Separate export from memory

Permission for future personalization must not imply permission for sharing, export, publication, or third-party visibility.

Acceptance criteria:
- Future lens and Exportable are separate states or separately visible toggles.
- Export requires a distinct confirmation for interpretations involving other people or high-sensitivity content.

## Prototype test plan

Compare five variants:

A. No badge; settings-only control.
B. Text label badge only.
C. Four-state badge with hover/tap explanation.
D. Four-state badge plus explain-back on escalation.
E. Timeline view showing how an interpretation can influence later sessions.

Primary measures:
- Can the user correctly state whether the interpretation will shape later sessions?
- Can the user find and use rollback within 10 seconds?
- Does the control interrupt reflective flow?
- Does the user mistakenly assume privacy/export permission from memory permission?
- Does the user feel coerced toward future memory?

Failure conditions:
- Users treat Now-only as meaningless decoration.
- Users cannot distinguish Session memory from Future lens.
- Users grant Future lens just to dismiss friction.
- Users assume Future lens also means Exportable.
- Rollback exists but is not discoverable.

## Implementation note

This pattern should be tested before becoming canonical. The current evidence supports the risk model and design direction, but not the exact badge vocabulary or visual form.

## Next research question

Can users accurately distinguish "session memory" from "future lens" in a reflective interface, or does MC need a different metaphor such as "campfire," "notebook," "map layer," and "message bottle"?
