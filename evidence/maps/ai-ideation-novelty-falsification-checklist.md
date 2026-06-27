# AI Ideation Novelty Falsification Checklist

Public-safe evidence artifact for Mirror Cartographer.

## Claim tested

**Claim:** More AI ideation automatically strengthens novelty, originality, and opportunity discovery.

## Claim status

**Status: weakened / requires controls.**

The evidence does not support treating AI-generated idea volume as a reliable proxy for novelty. Current evidence suggests AI can improve local elaboration and sometimes group-level creative search, but it can also concentrate exploration around seed material, increase similarity, and produce recombinative rather than question-changing novelty.

## Evidence map

| Source | Type | Fact supported | Design implication |
|---|---|---|---|
| https://arxiv.org/abs/2605.27905 | 2026 research paper | Across four AI research-agent frameworks, six LLMs, and 37,802 generated scientific ideas, AI ideas were more concentrated than human-authored papers, closer to seed literature, and mainly recombined existing technical methods. | MC should not reward idea count alone. It needs an anti-convergence gate. |
| https://arxiv.org/abs/2602.10001 | 2026 research paper | Human-AI hybrid groups achieved high performance while preserving diversity in a controlled collective creativity task. | MC should preserve the human weirdness lane rather than replacing it with AI-only generation. |
| https://arxiv.org/abs/2502.17962 | 2025 research paper | In creative social networks, hybrid human-AI systems became more diverse over time than AI-only networks, while human-only networks preserved continuity better. | MC should track both diversity and continuity, not one generic creativity score. |
| https://arxiv.org/abs/2401.13481 | 2024 research paper | High exposure to AI-generated examples changed collective diversity but did not improve individual creativity; AI made ideas different, not necessarily better. | MC needs usefulness, distance, and continuity tests before calling an idea strong. |

## Fact vs inference

### Facts

- Current AI research agents can generate large numbers of research ideas from seed literature.
- In one 2026 study, those AI-generated ideas clustered more tightly than human-authored work from the same research areas.
- Human-AI hybrid creative systems can preserve diversity under some task conditions.
- AI influence can alter collective idea diversity without necessarily improving individual creativity.

### Inferences for MC

- MC should treat AI as a **local elaboration engine** by default, not as automatic novelty proof.
- MC should protect a separate **wild bridge lane** for distant analogies, contradiction, sensory metaphors, animal/body/context signals, and user-originated weirdness.
- Opportunity work should not count a generated list as evidence. It should test whether ideas are distant, useful, source-grounded, and non-generic.

## New evaluation criterion

A Mirror Cartographer idea only counts as **novel enough to preserve** if it passes at least three of five gates:

1. **Distance gate:** The idea crosses at least two unrelated domains without collapsing into a cliché.
2. **Question-change gate:** It changes the question being asked, not only the method used.
3. **Continuity gate:** It keeps the user's original symbolic or practical intent visible.
4. **Usefulness gate:** It yields a concrete product move, demo, artifact, or test.
5. **Anti-convergence gate:** It is not a near-duplicate of recent AI-generated ideas in the same repo, chat, or source cluster.

## Falsification checklist

Reject or downgrade the claim that an MC output is meaningfully novel if:

- It mainly rephrases the source paper or previous MC artifact.
- It adds more labels without changing the architecture, interface, proof path, or experiment.
- It uses vague bridge language without a concrete test.
- It repeats memory/privacy/context-ring patterns without a new constraint.
- It could be generated from the same seed source by asking for ten variations.
- It has no failure condition.
- A nontechnical reader cannot say what changed after 30 seconds.

## Design pattern added

### Novelty Stress Gate

Before storing a new MC bridge, product wedge, or opportunity claim, run this mini-test:

- **Seed:** What source or previous idea did this come from?
- **Drift:** How far did it move from the seed?
- **Break:** What assumption did it break?
- **Body/world anchor:** What real signal, behavior, interface, or constraint does it touch?
- **Proof:** What would make it fail?
- **Artifact:** What durable thing changed in GitHub?

## Product implication

Add a small field to future MC cards:

**Novelty status:** local elaboration / recombination / distant bridge / question-changing / unproven.

Default status should be **local elaboration** unless evidence or testing upgrades it.

## Next proof needed

Build a 20-card MC idea set:

- 5 AI-only ideas from the same seed source.
- 5 human-symbolic prompts expanded by AI.
- 5 cross-domain forced-bridge ideas.
- 5 contradiction-first ideas.

Score each card for distance, usefulness, continuity, and non-duplication. The test passes only if the forced-bridge or contradiction-first lanes produce more durable, less generic GitHub artifacts than AI-only ideation.
