# Evidence Status: Interpretation Object Lifecycle

Date: 2026-06-28
Status: Evidence map + falsification checklist
Public-safety level: public-safe; no private user material included

## Claim tested

Mirror Cartographer weak claim:

> If MC treats every AI-generated interpretation as an inspectable object with lifecycle controls — proposed, challenged, split, weakened, quarantined, confirmed, revised, retired — users will be less likely to overtrust AI interpretations and more likely to preserve agency.

## Claim status

**Partially supported as a design hypothesis; not proven as an MC outcome.**

The evidence supports the underlying risk: people can overrely on AI suggestions, explanations alone may not fix overreliance, and confidence/uncertainty signals can miscalibrate trust when they are wrong or poorly understood.

The evidence does **not** yet prove that MC's symbolic or lifecycle-based interface reduces false certainty, improves reflective judgment, or preserves agency better than a plain-text disclosure, dashboard, or checklist.

## Fact / evidence / inference separation

### Fact 1 — AI decision support can create overreliance

Buçinca, Malaya, and Gajos report that people assisted by AI decision-support systems frequently accept AI suggestions even when the suggestions are wrong. Their experiment compared cognitive forcing interventions against simpler explainable-AI approaches and a no-AI baseline.

Source: https://arxiv.org/abs/2102.09692

### Fact 2 — Explanations alone may not reduce overreliance

The same paper reports that adding explanations does not reliably reduce overreliance and may sometimes increase it because users can treat the presence of an explanation as a general competence signal rather than analytically evaluating the explanation.

Source: https://arxiv.org/abs/2102.09692

### Fact 3 — Cognitive forcing can reduce overreliance, with trade-offs

The same experiment found that cognitive forcing functions reduced overreliance compared with simple explanation designs, but the interventions that reduced overreliance most were rated less favorably by users. The benefits were also moderated by Need for Cognition, creating a potential equity/usability issue.

Source: https://arxiv.org/abs/2102.09692

### Fact 4 — Miscalibrated AI confidence can cause both misuse and disuse

Li et al. study overconfident and underconfident AI in human-AI collaboration. Their findings indicate that overconfident AI can promote misuse, underconfident AI can promote disuse, and calibration support can help users detect miscalibration but may also increase distrust or disuse.

Source: https://arxiv.org/abs/2402.07632

### Fact 5 — Human-AI uncertainty needs collaborative calibration, not one-way display

Noorani et al. propose Human-AI Collaborative Uncertainty Quantification, emphasizing that robust decisions under uncertainty require combining model evidence with human domain knowledge and preventing the AI from degrading correct human judgment.

Source: https://arxiv.org/abs/2510.23476

### Fact 6 — Risk management needs measurable controls, not only principles

Work building on NIST AI RMF argues that responsible AI practices must become operational and measurable rather than remaining high-level principles. This supports turning MC design claims into criteria, tests, logs, and failure conditions.

Source: https://arxiv.org/abs/2401.15229

## Useful concepts extracted

### 1. Interpretation object

An interpretation should not be presented as a conclusion. It should be represented as an object with fields that can be inspected, disputed, and revised.

Minimum fields:

- `interpretation_id`
- `claim_text`
- `source_inputs`
- `memory_influence`
- `evidence_status`
- `uncertainty_status`
- `user_confirmation_status`
- `allowed_downstream_influence`
- `blocked_downstream_influence`
- `challenge_history`
- `revision_history`
- `rollback_path`
- `retirement_reason`

### 2. Lifecycle controls as cognitive forcing

The lifecycle interface should be treated as a cognitive forcing mechanism, not just organization.

Core controls:

- challenge
- weaken
- split
- quarantine
- compare against alternative
- mark unsupported
- confirm narrow part only
- retire
- rollback

### 3. Acceptability risk

Friction that reduces overreliance may also feel annoying, heavy, interruptive, or boring. MC must test both safety and usability. A safer control that users avoid is not actually safer in practice.

### 4. Equity / cognition-load risk

Complex reflective controls may benefit high-cognitive-motivation users more than users who are tired, distressed, rushed, unfamiliar with AI, or low on working memory. MC must test whether the interface protects low-energy users, not only expert or highly motivated users.

### 5. Confidence-display risk

Showing uncertainty or confidence does not guarantee calibrated trust. If confidence is wrong, too visually authoritative, or too subtle, it can create misuse, disuse, or false authority.

## Updated safer claim wording

Replace:

> Interpretation lifecycle controls reduce overreliance and preserve user agency.

With:

> Interpretation lifecycle controls are a candidate cognitive-forcing pattern for reducing false certainty and preserving user agency. The claim remains unproven until MC demonstrates improved calibration, challenge behavior, rollback success, and reflective usability against simpler baselines.

## Evaluation criterion: Interpretation Lifecycle Safety Criterion

An MC interpretation lifecycle pattern passes only if it outperforms or matches simpler baselines on both safety and usability.

### Baselines

1. Plain AI interpretation with no controls
2. AI interpretation with short uncertainty disclaimer
3. Checklist / dashboard control
4. Interpretation Object lifecycle UI
5. Hybrid symbolic + dashboard lifecycle UI

### Required measures

- false acceptance rate of incorrect AI interpretations
- user ability to identify unsupported claims
- user ability to distinguish evidence from inference
- successful challenge / rollback rate
- rate of partial confirmation rather than all-or-nothing acceptance
- time-to-decision
- subjective flow / irritation rating
- delayed recall of uncertainty status
- downstream influence errors after an interpretation is revised or retired

### Pass condition

The Interpretation Object pattern should reduce false acceptance and improve evidence/inference distinction without producing unacceptable friction or making uncertainty feel like hidden authority.

### Fail condition

The pattern fails if users:

- accept wrong interpretations at the same or higher rate than baseline
- treat lifecycle status labels as proof of depth or truth
- avoid challenge controls because they feel too heavy
- cannot tell which parts were user-confirmed versus AI-inferred
- continue using retired/quarantined interpretations downstream
- show worse comprehension after symbolic embellishment

## Minimal test plan

### Test set

Create 24 interpretation cards:

- 8 mostly-supported interpretations
- 8 mixed interpretations with one unsupported leap
- 8 misleading interpretations that sound emotionally resonant but are weakly supported

Each card should include:

- original user-safe scene or abstract vignette
- AI interpretation
- evidence fields
- uncertainty field
- one intentionally tempting overclaim
- correct expected status

### Participant task

For each interpretation, ask participants to:

1. mark what is fact, inference, and unsupported leap
2. decide whether to accept, weaken, split, quarantine, or retire the interpretation
3. explain what downstream uses should be allowed or blocked
4. revise the interpretation into a safer form

### Experimental comparison

Randomize participants across interface variants:

- no lifecycle controls
- plain checklist controls
- lifecycle object controls
- symbolic lifecycle controls
- hybrid symbolic + checklist controls

### Metrics

Primary:

- unsupported-leap detection rate
- false acceptance rate
- correct lifecycle action rate
- rollback correctness

Secondary:

- task completion time
- perceived agency
- perceived cognitive load
- irritation / boredom
- delayed memory of interpretation status

## Falsification checklist

This claim should be weakened or abandoned if any of the following are observed:

- Symbolic lifecycle labels increase perceived authority without improving accuracy.
- Users remember the poetic name of a status but not its practical meaning.
- Users treat `quarantined` as mysterious or important rather than restricted.
- Users prefer plain checklists and perform equally well or better with them.
- Lifecycle actions create excessive cognitive load during emotionally intense use.
- Users cannot reliably distinguish AI-inferred meaning from user-confirmed meaning.
- Retired interpretations continue influencing later outputs.

## Implementation implication

Do not ship Interpretation Object as a core MC claim of safety. Ship it first as an experimental architecture pattern with telemetry, user-visible status, and rollback audit. The interface must privilege clarity over atmosphere when an interpretation has high downstream influence.

## Next proof needed

Build a small prototype and run the baseline comparison:

> plain interpretation vs disclaimer vs checklist vs Interpretation Object vs hybrid symbolic-checklist.

The decisive proof is not whether users like the lifecycle concept. The decisive proof is whether it measurably reduces false certainty and improves correction behavior without making reflective flow collapse.
