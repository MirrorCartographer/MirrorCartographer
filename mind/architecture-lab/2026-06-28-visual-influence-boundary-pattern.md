# Visual Influence Boundary Pattern

Date: 2026-06-28
Status: architecture pattern / prototype plan
Privacy posture: public-safe; no personal examples; no private user material

## Architecture question

What visual form makes an MC interpretation's allowed influence instantly understandable without turning reflection into paperwork?

This extends the earlier Influence Scope Card and Risk-Bounded Interpretation work. The question is not only whether a user consents to storage. The question is whether a user can quickly understand what an interpretation is allowed to affect later.

## Working answer

Use a small, always-visible **Influence Boundary Strip** attached to each Interpretation Object.

The strip should show four permissions as compact symbols plus one-line readable labels:

1. **Store** — may this interpretation be saved?
2. **Retrieve** — may it be brought back in later sessions?
3. **Influence** — may it shape future interpretations, suggestions, or summaries?
4. **Transmit** — may it appear in exports, shared artifacts, public notes, or cross-user contexts?

This is not a generic privacy control. It is a boundary around future cognitive effect.

## Why this changed the architecture

Earlier MC framing treated privacy mostly as memory permission: remember, forget, export, or delete.

Current evidence suggests that is too shallow. Consent interfaces often fail when they rely on long text, legal framing, or broad defaults. For MC, the more important risk is invisible downstream influence: an interpretation may not be sensitive as stored text, but may become powerful if it silently shapes later meaning-making.

Therefore MC needs a visual boundary that separates:

- storage permission
- retrieval permission
- influence permission
- transmission permission

These should not collapse into one switch.

## Evidence basis

### 1. Interface layout affects attention but does not guarantee comprehension

A 2026 eye-tracking study on privacy disclosures found that interface structure shaped attention and navigation, but comprehension depended strongly on sustained attention rather than layout alone. This means MC cannot rely on a prettier policy card as proof of understanding.

Source: Xiao, Wu, Jo, "Designing for Understanding: How Interface-Level Consent Designs Shape Attention and Understanding in Privacy Disclosures" (2026), https://arxiv.org/abs/2603.13747

### 2. Transparent walkthroughs can improve trust without necessarily adding large time cost

A 2024 prototype study of camera-based in-car health monitoring found that a transparent walkthrough improved trust-related measures compared with conventional terms and nudge designs. This supports stepwise explanation, but only as a design lead, not as proof that MC's card will work.

Source: Sandhaus, Choksi, Ju, "Regaining Trust: Impact of Transparent User Interface Design on Acceptance of Camera-Based In-Car Health Monitoring Systems" (2024), https://arxiv.org/abs/2408.15177

### 3. Consent UIs can preserve the feeling of control while failing meaningful agency

Recent work on cookie consent patterns shows that defaults, obstruction, and aesthetic manipulation can shape choices and that perceived control can be misleading. MC should measure actual comprehension and revision behavior, not just whether the user feels in control.

Sources:
- Graßl et al., "Dark and Bright Patterns in Cookie Consent Requests" (2025), https://arxiv.org/abs/2509.18210
- Singh, Jin, Kim, "When the Abyss Looks Back: Unveiling Evolving Dark Patterns in Cookie Consent Banners" (2026), https://arxiv.org/abs/2603.21515

### 4. Consent records should be machine-readable, not merely decorative

ISO/IEC TS 27560:2023 focuses on consent records and receipts as machine-readable structures. For MC, the visual card should be backed by structured metadata so that the interface and the system behavior remain aligned.

Source: Pandit, Lindquist, Krog, "Implementing ISO/IEC TS 27560:2023 Consent Records and Receipts for GDPR and DGA" (2024), https://arxiv.org/abs/2405.04528

### 5. AI overreliance research supports friction, but friction has tradeoffs

Cognitive forcing functions can reduce overreliance on AI, but studies also show usability and subjective-rating tradeoffs. MC's visual boundary should be light by default and escalate only when influence becomes high-stakes, persistent, or externally visible.

Source: Buçinca, Malaya, Gajos, "To Trust or to Think: Cognitive Forcing Functions Can Reduce Overreliance on AI in AI-assisted Decision-making" (2021), https://arxiv.org/abs/2102.09692

## Fact / inference split

### Supported facts

- Interface structure can shape attention and navigation in privacy disclosures.
- Transparent stepwise explanations can improve trust measures in at least some sensitive sensing contexts.
- Consent interfaces can manipulate choices and perceived control.
- Machine-readable consent receipts are an active standards direction.
- Cognitive forcing can reduce AI overreliance, but with usability tradeoffs.

### MC-specific inferences

- MC should separate storage, retrieval, influence, and transmission permissions.
- A compact visual boundary may preserve reflective flow better than a long checklist.
- Influence permission is a distinct design layer because stored interpretations can shape later reasoning without being explicitly re-shown.
- Visual controls must be backed by machine-readable metadata or they become performative decoration.

### Not yet proven

- Users will understand the four-permission model quickly.
- The boundary strip will reduce unwanted downstream influence.
- The boundary strip will preserve symbolic/reflection flow better than a card, slider, receipt, or timeline.
- The pattern will work for low-literacy, screen-reader, mobile, stressed, or emotionally activated use cases.

## Design pattern: Influence Boundary Strip

Attach this to every Interpretation Object:

```yaml
influence_boundary:
  store: deny | session_only | persistent
  retrieve: deny | user_requested | contextual | automatic
  influence: none | local_session | future_reflection | profile_level | public_artifact
  transmit: none | private_export | collaborator_visible | public_safe
  friction_level: none | glance | confirm | explain_back | blocked
  expiration: ISO-8601 timestamp | null
  changed_by: user | system_default | facilitator | policy
  last_reviewed: ISO-8601 timestamp
```

## UI requirement

R-VIB-01: Every Interpretation Object must expose its allowed future influence as a glanceable boundary, not only as hidden settings.

R-VIB-02: The visual state must map to machine-readable metadata.

R-VIB-03: Defaults must be conservative for transmission and profile-level influence.

R-VIB-04: The interface must distinguish "saved" from "allowed to shape future interpretations."

R-VIB-05: When influence scope increases, MC must require active confirmation or explain-back.

R-VIB-06: The boundary must be accessible without relying only on color.

## Prototype variants to compare

1. **Tiny label**: one line under each interpretation.
2. **Four-icon strip**: Store / Retrieve / Influence / Transmit.
3. **Permission receipt**: expandable card with full metadata.
4. **Timeline boundary**: shows where the interpretation can travel next.
5. **Explain-back gate**: user must restate what future influence they are allowing.

## Evaluation criterion

A visual influence control succeeds only if users can accurately answer these four questions after using it:

1. Will this be saved?
2. Can it come back later without me asking?
3. Can it shape future interpretations?
4. Can it leave this private context?

Passing threshold for first prototype: at least 80% correct answers across all four questions in a small usability test, without materially reducing task completion or reflective flow.

## Falsification checklist

Reject or redesign this pattern if:

- users confuse storage with influence more than 20% of the time;
- users can identify the icon state but cannot explain its consequence;
- the strip increases blind acceptance because it looks official;
- the visual design works only for sighted users;
- users ignore the strip during emotionally meaningful moments;
- changing settings is easier than understanding what changed;
- metadata and displayed state drift apart;
- the system cannot enforce the boundary in retrieval and generation.

## Next proof needed

Build a clickable prototype with the five variants above and test the same Interpretation Object moving through three contexts:

1. private one-session reflection;
2. persistent personal memory;
3. public-safe exported artifact.

Measure comprehension, recall after delay, revision behavior, screen-reader usability, and whether users can distinguish "remembered" from "allowed to influence."
