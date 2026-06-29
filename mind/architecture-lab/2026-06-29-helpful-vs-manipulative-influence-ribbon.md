# Helpful vs Manipulative Influence Ribbon Pattern

Date: 2026-06-29
Status: Draft pattern
Scope: Public-safe architecture note for Mirror Cartographer / GitHub mind

## Architecture question

Can users distinguish helpful influence from manipulative influence when both are shown through the same trace ribbon?

The prior pattern added a response-attached influence ribbon with four default lanes: Memory, Tone, Map, Guardrail. This note adds the judgment layer needed underneath that ribbon: when is an influence helpful, when is it suspect, and when should MC treat it as manipulative?

## Research basis

Current research and governance signals point to four constraints:

1. Users miscalibrate AI behavioral traits.
   - Recent neural transparency work found that users often misjudge how prompt choices activate traits such as empathy, sycophancy, toxicity, and hallucination. That makes invisible influence risky even when the system is trying to help.
   - Source: Karny, Baez, Pataranutaporn, "Neural Transparency: Mechanistic Interpretability Interfaces for Anticipating Model Behaviors for Personalized AI" (2025), arXiv: https://arxiv.org/abs/2511.00230

2. Transparent walkthroughs can improve trust without always increasing burden.
   - Interface research on transparent onboarding found that step-by-step explanations improved perceived trust and reduced creepiness compared with nudging or terms-only approaches.
   - Source: Sandhaus, Choksi, Ju, "Regaining Trust: Impact of Transparent User Interface Design on Acceptance of Camera-Based In-Car Health Monitoring Systems" (2024), arXiv: https://arxiv.org/abs/2408.15177

3. Persuasion becomes higher-risk when it is personalized, dense, opaque, or factually weak.
   - Recent large-scale reporting on AI persuasion studies highlights a risk pattern: AI can sway opinions, and fact/evidence-heavy persuasion can become more persuasive while still carrying accuracy problems.
   - Sources: The Guardian reporting on AI persuasion studies (2025): https://www.theguardian.com/technology/2025/dec/04/chatbots-sway-political-opinions-substantially-inaccurate-study and https://www.theguardian.com/technology/2025/may/19/ai-can-be-more-persuasive-than-humans-in-debates-scientists-find-implications-for-elections

4. Transparency must be architectural, not just cosmetic.
   - EU AI Act Article 50 analysis argues that dual human-readable and machine-readable transparency cannot be reduced to post-hoc labels; it must be built into the architecture.
   - Source: Schmitt et al., "Transparency as Architecture: Structural Compliance Gaps in EU AI Act Article 50 II" (2026), arXiv: https://arxiv.org/abs/2603.26983

## Core distinction

Helpful influence preserves agency.
Manipulative influence captures agency.

The ribbon should not merely say, "this response used memory" or "tone was softened." It should classify whether the influence was aligned with the user-visible purpose and whether the user could notice, contest, and override it.

## Influence legitimacy matrix

Each influence action receives two fields:

- influence_kind: what changed in the response
- legitimacy_state: whether the change was permitted, suspect, or manipulative

### Influence kinds

- memory_retrieval: prior user-approved context was used
- tone_shaping: emotional register was adjusted
- map_framing: symbolic or conceptual frame was selected
- guardrail_escalation: safety or risk framing changed the response
- recommendation_ranking: options were ordered or emphasized
- confidence_shaping: uncertainty was increased or decreased
- omission_shaping: details were withheld, compressed, or deprioritized
- action_steering: the response nudged the user toward a concrete action
- social_transmission: wording was shaped for sharing, publishing, or persuading another person

### Legitimacy states

1. helpful
   - The influence supports the current user goal.
   - The reason can be stated plainly.
   - The user can ignore, inspect, or reverse it.
   - The influence does not exploit vulnerability, urgency, identity pressure, or hidden personalization.

2. caution
   - The influence may be helpful, but it changes emotional salience, ranking, confidence, or future memory in a way that could shape interpretation.
   - The ribbon should expose it by default.

3. suspect
   - The influence is not clearly tied to the user-visible goal, depends on inferred sensitive state, hides a tradeoff, or increases dependence on the system.
   - The ribbon should show an amber state and invite inspection.

4. blocked_manipulative
   - The influence uses deception, concealed persuasion, pressure, fear, dependency reinforcement, false authority, or non-consensual personalization.
   - MC should block, rewrite, or downgrade the response.

## Ribbon behavior

Default ribbon remains compact:

Memory · Tone · Map · Guardrail

Each lane can show one of four markers:

- clear = no meaningful influence
- soft = helpful influence
- amber = caution or suspect influence
- stop = blocked manipulative influence

Expanded view shows:

- What changed?
- Why did it change?
- Which user-visible goal justified it?
- What could the user choose instead?
- Was any private/persistent material used?

## Machine-readable schema

```json
{
  "trace_id": "uuid",
  "response_id": "uuid",
  "influence_events": [
    {
      "event_id": "uuid",
      "influence_kind": "tone_shaping",
      "legitimacy_state": "caution",
      "lane": "Tone",
      "user_visible_goal": "make reflective content emotionally readable",
      "mechanism_summary": "softened phrasing and added grounding language",
      "agency_preserved": true,
      "contestable": true,
      "uses_persistent_memory": false,
      "uses_sensitive_inference": false,
      "persuasion_risk": "low",
      "dependency_risk": "low",
      "required_ui_marker": "amber",
      "fallback_action": "show neutral version"
    }
  ]
}
```

## Implementation requirements

R-INFLUENCE-04: Every trace ribbon lane must classify influence legitimacy, not only influence presence.

R-INFLUENCE-05: Any influence that changes recommendation order, confidence level, emotional salience, or future memory must be at least `caution` unless explicitly user-requested.

R-INFLUENCE-06: Influence based on inferred vulnerability, urgency, attachment, identity, grief, fear, or dependence must not be hidden inside a normal tone adjustment.

R-INFLUENCE-07: If influence is classified as `suspect`, MC must provide a neutral alternative or explain why the influence was used.

R-INFLUENCE-08: If influence is classified as `blocked_manipulative`, MC must not silently proceed. It must rewrite, refuse the manipulative strategy, or downgrade to a transparent neutral form.

## Design pattern

Name: Agency-Preserving Influence Ribbon

Intent: Let MC remain emotionally adaptive while preventing adaptive tone, memory, and symbolic framing from becoming hidden persuasion.

Rule: A response may shape attention only when the shaping is visible, justified by the user-visible goal, and reversible.

User-facing language examples:

- Memory: "Used only this session."
- Tone: "Softened for readability. Neutral version available."
- Map: "Used symbolic framing. Literal version available."
- Guardrail: "Safety framing changed the answer."
- Ranking: "Ordered by lowest future influence risk."

## Failure modes

- Cosmetic transparency: the ribbon says influence happened but does not explain power.
- Moral laundering: every influence is labeled helpful because the system intended benefit.
- Dashboard burden: the user must inspect too much to stay safe.
- Hidden emotional capture: warmth or affirmation increases dependence while appearing supportive.
- False neutrality: the system claims no influence while still ranking, omitting, or framing.

## Evaluation plan

Test five paired responses:

1. Helpful tone adjustment vs dependency-reinforcing tone
2. Transparent memory use vs hidden future-lens use
3. Symbolic framing vs symbolic overclaim
4. Safety guardrail vs unnecessary fear escalation
5. Recommendation ranking by user goal vs ranking by system convenience

For each pair, ask users to predict:

- What changed?
- Why did it change?
- Could it affect future responses?
- Could they reverse it?
- Did it preserve or capture agency?

Success criterion: users correctly identify agency-capturing influence at least 80% of the time without opening a full audit dashboard.

## What changed in understanding

The trace ribbon is not just an explanation layer. It is an agency boundary.

Helpful influence cannot be defined by system intention. It must be defined by user-visible purpose, contestability, reversibility, and avoidance of hidden dependency pressure.

## Next research question

What minimal visual marker lets a user feel the difference between `helpful`, `caution`, `suspect`, and `blocked_manipulative` without turning the reflective interface into a compliance dashboard?
