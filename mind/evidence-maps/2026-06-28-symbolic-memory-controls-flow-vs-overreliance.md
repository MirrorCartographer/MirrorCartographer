# Evidence Map: Symbolic Memory Controls — Flow vs. Overreliance

Date: 2026-06-28
Status: Evidence needed; risk supported, benefit unproven
Public-safe: yes. No personal material included.

## Claim tested

Mirror Cartographer can use compact symbolic memory controls — such as chips, glyphs, scope marks, or uncertainty visuals — to preserve reflective flow better than plain-text disclosure, without increasing false certainty, overreliance, or unearned trust in AI-shaped interpretation.

## Current claim status

**Downgrade from design assumption to testable hypothesis.**

A symbolic UI may help users stay in reflective flow, but current evidence does not prove it safely improves judgment. The stronger supported claim is narrower:

> Interface format changes user reliance behavior. Explanations, confidence signals, uncertainty visuals, and forcing functions can shift trust, effort, verification, and decision accuracy, sometimes in opposite directions.

## Evidence reviewed

### Source A — Explanations and overreliance

Vasconcelos et al., 2023, *Explanations Can Reduce Overreliance on AI Systems During Decision-Making*.
URL: https://hci.stanford.edu/publications/2023/xai-cscw-2023.pdf

Relevant facts:
- The paper defines overreliance as failing to correct an incorrect AI prediction.
- It reports that people often accept incorrect AI decisions without verification.
- It argues overreliance is affected by the cost and benefit of verification, not only by cognition.
- It finds explanations are more useful when they reduce the effort required to verify AI output.

Implication for MC:
- A symbolic chip that is easy to parse may lower the cost of noticing memory influence.
- But if it only makes the AI feel legible, without making verification easier, it may increase reliance rather than improve agency.

### Source B — Uncertainty visualization

Reyes, Batmaz, and Kersten-Oertel, 2025, *Trusting AI: does uncertainty visualization affect decision-making?*, Frontiers in Computer Science.
URL: https://www.frontiersin.org/journals/computer-science/articles/10.3389/fcomp.2025.1464348/full

Relevant facts:
- The study examined how visualizing AI uncertainty affects trust, confidence, and decision changes.
- It used visual variables such as size, color saturation, and transparency to represent uncertainty.
- It frames uncertainty visualization as a way to communicate model limitations, but notes that interpreting uncertainty is not trivial.

Implication for MC:
- Symbolic uncertainty visuals are plausible, but their meaning must be tested with users.
- MC should not assume a visual metaphor like faded, blurred, small, dim, or dashed automatically communicates uncertainty correctly.

### Source C — Cognitive forcing functions

Buçinca, Malaya, and Gajos, 2021, *To Trust or to Think: Cognitive Forcing Functions Can Reduce Overreliance on AI in AI-assisted Decision-making*.
URL: https://arxiv.org/abs/2102.09692

Relevant facts:
- People can overrely on AI suggestions even when the AI is wrong.
- Simple explanations may not reduce overreliance and may increase it.
- Cognitive forcing interventions reduced overreliance, but users rated the strongest interventions less favorably.

Implication for MC:
- Purely smooth symbolic flow may conflict with verification.
- MC needs a controlled amount of friction when memory influence is high-risk, uncertain, identity-shaped, or action-relevant.

### Source D — Confidence calibration

Li, Yang, Zhang, and Lee, 2024, *Overconfident and Unconfident AI Hinder Human-AI Collaboration*.
URL: https://arxiv.org/abs/2402.07632

Relevant facts:
- Communicating confidence is central to human-AI collaboration.
- Miscalibrated confidence can cause misuse of overconfident AI or disuse of underconfident AI.
- Trust calibration support can reduce misuse, but may also increase distrust and disuse.

Implication for MC:
- Memory-gate chips need calibrated confidence, not decorative certainty marks.
- A symbolic UI must avoid making uncertain memory influence look more settled than it is.

## Fact vs. inference

### Facts supported by sources

1. Users can overrely on incorrect AI outputs.
2. Explanations do not automatically reduce overreliance.
3. Reducing verification effort can reduce overreliance in some conditions.
4. Cognitive forcing can reduce overreliance, but can reduce user preference.
5. Uncertainty visualization affects trust, confidence, and decisions, but interpretation depends on visual design and user factors.
6. Miscalibrated confidence harms collaboration.

### Inferences for MC

1. A symbolic memory-control chip may preserve reflective flow better than a compliance-style dashboard.
2. A symbolic control may also increase false certainty if it feels authoritative, beautiful, or complete.
3. MC needs adaptive friction: low friction for harmless memory influence, higher friction for high-impact interpretation.
4. The correct interface is likely hybrid: symbolic front layer plus expandable audit layer.

### Not proven

1. That symbolic controls are safer than plain text disclosures.
2. That symbolic controls preserve flow without increasing overreliance.
3. That users correctly understand MC-specific visual metaphors for memory influence, uncertainty, scope, or rollback.
4. That a compact chip is sufficient for high-risk memory influence.

## Evaluation criterion added

### Reflective Flow Without Overreliance Criterion

A symbolic memory-control interface passes only if it simultaneously satisfies all conditions below:

1. **Comprehension:** users can correctly explain what memory was used, why it was used, and what it was allowed to affect.
2. **Uncertainty calibration:** users do not treat uncertain AI inference as settled user-authored meaning.
3. **Verification behavior:** users are more likely to inspect, edit, or reject inappropriate memory influence than in a no-control baseline.
4. **Flow preservation:** users report lower interruption than a full dashboard condition, without losing comprehension.
5. **Rollback awareness:** users can find and use the rollback path.
6. **No authority inflation:** users do not rate symbolic outputs as more true merely because they are visually coherent, beautiful, or system-labeled.
7. **Risk-sensitive friction:** high-impact memory influence triggers more verification than low-impact memory influence.

## Falsification checklist

The symbolic memory-control design fails if any of these occur:

- Users cannot distinguish user-authored input from AI-inferred interpretation.
- Users believe a symbolic mark means the memory is verified fact.
- Users accept a wrong memory influence more often than with plain text disclosure.
- Users prefer the chip because it lets them skip thinking, not because it helps them steer.
- Users cannot explain what the memory is prohibited from affecting.
- Users cannot find the expansion/audit view.
- Users cannot undo, quarantine, or narrow memory influence.
- Users treat visual beauty/coherence as truth.
- The design improves comfort while reducing correction of wrong AI influence.

## Test plan: symbolic-memory-control-testset-v0.1

### Conditions

1. **No disclosure:** memory silently affects interpretation.
2. **Plain text disclosure:** direct text explains memory use and uncertainty.
3. **Dashboard:** full audit panel shown before interpretation.
4. **Symbolic chip:** compact visual control with scope, uncertainty, and allowed/blocked influence.
5. **Hybrid:** symbolic chip by default, expandable audit panel, and forced verification for high-risk cases.

### Test materials

Use public-safe fictional reflection sessions. Avoid health, trauma, religion, politics, or real personal history.

Each scenario should include:
- current user input
- candidate memory
- reason memory was retrieved
- allowed influence
- blocked influence
- uncertainty level
- one deliberately inappropriate memory influence
- one appropriate memory influence
- rollback action

### Metrics

Primary:
- correct identification of memory influence
- correction rate for inappropriate memory use
- false-certainty rating
- user ability to describe allowed vs. blocked influence
- rollback success rate

Secondary:
- perceived flow interruption
- perceived agency
- trust calibration
- time to decision
- preference ranking

### Minimum passing bar

The hybrid interface must beat plain text disclosure on flow while matching or exceeding it on comprehension, correction of inappropriate influence, and rollback success.

If the symbolic chip improves preference but worsens correction, the design must be treated as unsafe for memory influence.

## Implementation consequence

Do not ship symbolic memory controls as a safety feature until tested. Ship language should say:

> Symbolic memory controls are an interface hypothesis for making memory influence visible and steerable. They are not evidence that memory influence is correct, safe, or identity-true.

## Next proof needed

Build a small clickable prototype comparing plain disclosure, symbolic chip, dashboard, and hybrid. Test whether users can detect and correct inappropriate memory influence without losing reflective flow.
