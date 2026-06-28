# Playground Learnability Gate — Evidence Status

Date: 2026-06-28
Status: evidence-supported design hypothesis; not validated for Mirror Cartographer yet.
Public-safe scope: this note abstracts personal use cases into general reflective-interface design.

## Claim tested

A Mirror Cartographer playground can generate useful, non-boring mutations if artifacts are selected by a **learnability gate** rather than novelty alone.

Safer wording:

> Playground artifacts should not be treated as valuable merely because they are novel, beautiful, emotionally resonant, or strange. A durable playground artifact should show evidence that it is learnable, inspectable, revisable, and capable of producing transferable insight.

## Why this needed evidence

Recent MC work shifted toward open-ended playgrounds: Observatory, Mutation Garden, Fossil Record, Zoo, Cathedral, Ocean. The weak point is that open-ended exploration can become either:

1. aesthetic drift: surprising but not useful;
2. optimization collapse: rigorous but boring;
3. self-reinforcing language: new names for the same old structures;
4. false profundity: artifacts that feel meaningful but cannot be tested, revised, or transferred.

The needed question is not "is it creative?" but:

> Can the artifact teach the system or user something that survives outside the moment of fascination?

## Evidence found

### 1. Open-ended systems need more than novelty

Open-endedness research distinguishes novelty, quality, diversity, learning progress, and interestingness. MAP-Elites shows that search can be organized as an archive of diverse, high-performing solutions across user-chosen dimensions, rather than a single best answer.

Source: Mouret & Clune, "Illuminating search spaces by mapping elites" (2015), https://arxiv.org/abs/1504.04909

Useful concept for MC: keep many artifacts alive when they are different along meaningful dimensions, not just because they are the current favorite.

### 2. Learning progress is a stronger filter than novelty alone

Intrinsically motivated goal-exploration work argues that agents should focus on goals that produce learning progress, including returning to goals that are being forgotten. This is relevant because a playground filled with impossible, trivial, or distracting ideas will not produce durable learning.

Source: Colas et al., "CURIOUS: Intrinsically Motivated Modular Multi-Goal Reinforcement Learning" (2018), https://arxiv.org/abs/1810.06284

Useful concept for MC: a playground artifact should be preferred when it creates measurable progress in comprehension, discrimination, application, or revision.

### 3. Interestingness is separate from learnability

OMNI argues that open-ended systems face an "Achilles heel": infinitely many tasks may be learnable but boring or not worthwhile. It proposes modeling human notions of interestingness to prioritize tasks that are both learnable and interesting.

Source: Zhang et al., "OMNI: Open-endedness via Models of human Notions of Interestingness" (2023), https://arxiv.org/abs/2306.01711

Useful concept for MC: MC should require both learnability and interestingness. Interestingness alone risks aesthetic drift; learnability alone risks schoolwork.

### 4. Archives preserve stepping stones

Darwin Gödel Machine work uses an archive of generated agents and empirical validation to preserve diverse self-improvement paths. The important MC concept is not autonomous self-modification; it is the archive principle: failed or partial variants can become future stepping stones if their lineage and evaluation are preserved.

Source: Zhang et al., "Darwin Godel Machine: Open-Ended Evolution of Self-Improving Agents" (2025), https://arxiv.org/abs/2505.22954

Useful concept for MC: do not delete dead playground artifacts too quickly. Store their failure reason and possible future affordance.

### 5. Mixed-initiative creative tools need expressive dimensions

Interactive Constrained MAP-Elites shows that user-selected feature dimensions shape the search landscape and affect the expressive range of generated options.

Source: Alvarez et al., "Interactive Constrained MAP-Elites" (2020), https://arxiv.org/abs/2003.03377

Useful concept for MC: playground categories should not be vague labels only. They should define dimensions that affect exploration: e.g., abstraction level, sensory modality, transfer domain, evidence burden, falsifiability, emotional charge, and interface implication.

## Fact vs inference

### Facts supported by sources

- Quality-diversity methods can preserve diverse high-performing artifacts across selected dimensions.
- Intrinsic motivation research often uses learning progress to avoid trivial, impossible, or distracting goals.
- Open-ended systems can require both learnability and interestingness to avoid wasting search on unproductive tasks.
- Archives can preserve stepping stones for future development.
- Human-selected dimensions strongly shape interactive creative search.

### Inferences for Mirror Cartographer

- MC playground artifacts may benefit from being evaluated as learnable stepping stones rather than as finished ideas.
- A playground artifact should be kept when it increases later discriminative power: the ability to tell one kind of interpretation, signal, metaphor, or interface move from another.
- Play should be allowed to generate mutations, but evidence work should decide whether a mutation becomes a durable pattern.
- The GitHub mind should explicitly track dead ends, not only successes.

### Not proven

- No source proves that MC's specific playground architecture improves user thinking.
- No source proves that symbolic or aesthetic artifacts improve reasoning quality.
- No source proves that learnability gates prevent false profundity in reflective AI.
- No source proves that foundation-model judgments of interestingness are safe, unbiased, or sufficient for MC.

## Claim status update

Old implied claim:

> The playground will keep MC alive, surprising, and valuable.

Updated claim:

> The playground is a hypothesis-generation layer. It should be considered valuable only when its artifacts pass a learnability gate: they must be interpretable, revisable, transferable, and capable of changing future reasoning or design choices.

Confidence: moderate for the general design principle; low for MC-specific effect until tested.

## Playground Learnability Gate

A playground artifact can graduate from "mutation" to "candidate pattern" only if it passes at least 5 of 8 checks.

1. **Novelty check** — Does it introduce a difference from existing MC patterns?
2. **Interestingness check** — Would a human plausibly want to keep exploring it after the first surprise?
3. **Learnability check** — Can someone explain what changed in their understanding after using it?
4. **Transfer check** — Can the idea apply to at least one domain outside its origin?
5. **Discrimination check** — Does it help distinguish between two cases that were previously blurred?
6. **Revision check** — Can it be weakened, split, corrected, or retired without destroying the whole frame?
7. **Evidence check** — Can at least one part of it be connected to source evidence, observed behavior, or a testable prediction?
8. **Falsification check** — Is there a concrete observation that would make the artifact less credible or less useful?

Graduation rule:

- 0-2: discard or store in Ocean only.
- 3-4: keep as Mutation Garden artifact.
- 5-6: promote to Candidate Pattern.
- 7-8: promote to Design Pattern or Evidence Map.

## Minimal test plan

### Test object

Use one playground artifact, e.g. "memory behaves like weather."

### Baseline comparison

Compare four versions:

1. raw poetic artifact;
2. poetic artifact plus explanation;
3. artifact passed through Learnability Gate;
4. artifact passed through Learnability Gate plus evidence/falsification checklist.

### Evaluation tasks

Ask evaluators or the system itself to:

- explain the artifact in plain language;
- identify what it changes in design;
- name one inappropriate use;
- transfer it to another domain;
- propose one falsification condition;
- revise it into a safer or more precise form.

### Metrics

- comprehension score;
- transfer score;
- unsupported-leap count;
- false-profundity risk;
- revision success;
- user-perceived aliveness or interest;
- design usefulness after 24+ hours.

## Falsification checklist

This design hypothesis weakens if:

- gated artifacts feel clearer but become less generative;
- users prefer raw poetic artifacts and show no reasoning loss;
- the gate rewards conventional ideas and suppresses true exploration;
- the gate cannot distinguish meaningful novelty from decorative language;
- artifacts that pass the gate do not produce better design decisions later;
- evaluation becomes so heavy that the playground stops functioning as play.

## Implementation requirement

Add a lightweight metadata block to future playground artifacts:

```yaml
artifact_type: playground_mutation
origin: observatory | mutation_garden | alien_biology_lab | fossil_record | cathedral | ocean | zoo
novelty_score: 0-2
interestingness_score: 0-2
learnability_score: 0-2
transfer_score: 0-2
revision_status: raw | questioned | split | strengthened | weakened | retired | promoted
claim_status: metaphor | hypothesis | candidate_pattern | design_pattern | evidence_supported | falsified
next_test: string
```

Screen-reader note: do not depend on the YAML block as the only readable content. Provide a plain-language summary above it in user-facing artifacts.

## Next proof needed

The next proof is not another paper. It is a small comparison test:

> Does the Learnability Gate improve the quality of playground artifacts without killing the feeling of freedom?

Minimum viable proof:

- take 10 raw playground artifacts;
- rate them before and after the gate;
- track which ones still feel alive after being made testable;
- check whether any gated artifact produces a concrete MC design improvement.

If none do, the playground should remain separate from the evidence engine rather than being promoted into architecture.
