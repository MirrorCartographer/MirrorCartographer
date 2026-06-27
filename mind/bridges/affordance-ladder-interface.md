# Affordance Ladder Interface

Status: public-safe concept node / demo wedge
Date: 2026-06-27

## Bridge

Mirror Cartographer can borrow a pattern from comparative cognition, animal-computer interaction, embodied co-creation, and interoception research:

**Do not ask a signal to become meaning immediately. First show what actions the signal affords.**

This becomes the **Affordance Ladder Interface**: a reflection card that moves from raw signal to possible affordance, then to cautious interpretation, then to memory or action only if the evidence and risk level justify it.

## Why this is surprising

The bridge is not “animals are like AI” or “body signals diagnose things.” The bridge is architectural:

- Comparative cognition uses tasks, objects, rewards, barriers, and action constraints to test what an agent can actually do.
- Animal-computer interaction asks how animals interact with technology in their normal contexts, without assuming human-style verbal intention.
- Embodied creative AI systems show that physical action can become a controllable creative input.
- Interoception research links bodily awareness with time-orientation and self-regulation, but does not make the signal automatically true.

MC can convert that into interface design: every symbol, body cue, pet observation, or creative impulse is first treated as an **affordance field**, not a verdict.

## Research basis

### Source-grounded facts

1. The 2025 Animal-AI Environment paper describes a virtual platform for collaboration between AI and comparative cognition research, with tasks inspired by animal cognition, including spatial reasoning, object permanence, tool use, and goal-directed navigation. It emphasizes realistic task environments, procedural variation, and comparing computational models with human or non-human cognition-inspired tasks.

2. Clara Mancini’s Animal-Computer Interaction framing defines ACI as understanding animal-technology interaction in animals’ habitual contexts and designing animal-centered technologies that support welfare, activities, and interspecies relationships.

3. A 2025 embodied co-creation study describes a real-time generative AI art installation where physical action becomes generative control; the study analyzed 334 interaction events and framed the system as an embodied, context-aware co-creation loop.

4. A 2026 interoception/time-perspective study found, in a non-clinical adult sample, associations between interoceptive awareness, temporal orientation, and self-rated somatic indicators such as sleep and digestion. The authors describe this as preliminary support for an embodied feedback loop, while calling for future multimodal and longitudinal research.

5. A 2026 MojiKit preprint built structured reference cards for animal-inspired robot affect by analyzing human-pet interaction videos, literature, and interviews. Useful MC extraction: affective behavior can be represented as reference cards instead of vague mood labels.

## Fact vs inference

### Facts

- Comparative cognition can be operationalized as task batteries and constrained environments.
- ACI emphasizes animal-centered interaction in normal living/social contexts.
- Embodied creative systems can map physical action into AI-mediated creative output.
- Interoception research supports studying bodily awareness as part of regulation, but current cited evidence is not a diagnostic or treatment proof.
- Card-based design can structure affective interaction patterns.

### Inferences for MC

- MC should represent uncertain body, animal, symbolic, and creative signals as **affordance cards** before interpreting them.
- A signal’s first question should be: “What can safely be done with this?” not “What does this definitely mean?”
- The interface should separate observation, affordance, interpretation, memory, and action into visible rungs.
- Pet-related observations should stay in an observation/support lane and avoid diagnosis claims unless tied to veterinary evidence.

### Not claimed

- This does not claim MC can diagnose medical or veterinary conditions.
- This does not claim animal behavior proves intention, consent, or emotion.
- This does not claim interoceptive awareness causes health improvement.
- This does not claim AI has embodied experience.

## Product pattern: Affordance Ladder Card

Each MC card should include these rungs:

1. **Raw Signal**
   - What was noticed?
   - Source: user report, observation, image, paper, interface event, GitHub artifact, etc.

2. **Context Ring**
   - Body / animal / room / time / task / relationship / tool context.
   - Public/private boundary.

3. **Affordance Field**
   - What actions does this signal invite?
   - Options: observe, compare, document, ask expert, rest, prototype, research, ignore, archive, share, test.

4. **Constraint Gate**
   - What should not be inferred?
   - What would make this unsafe, misleading, or overreaching?

5. **Interpretation Layer**
   - Symbolic reading.
   - Practical reading.
   - Scientific/source-grounded reading.
   - Each labeled separately.

6. **Memory Decision**
   - Do not save.
   - Save as temporary context.
   - Save as project pattern.
   - Save as public-safe abstracted artifact.

7. **Next Safe Move**
   - One concrete action that does not overclaim.

## Demo idea

Build a static MC prototype called **Affordance Ladder / Lantern Mode**.

It should show five cards:

1. A body-sensation card.
2. A pet-observation card.
3. A creative-symbol card.
4. A research-source card.
5. A GitHub/action card.

Each card must visibly separate:

- observed signal
- context
- possible affordances
- blocked inferences
- claim status
- memory scope
- safe next action

## Evaluation criterion

A viewer passes the demo if, within 30 seconds per card, they can answer:

1. What was actually observed?
2. What is interpretation rather than fact?
3. What is the safe next action?
4. What is blocked or not claimed?
5. Whether the card is private, temporary, project-memory, or public-safe.

## Falsification checklist

The pattern fails if:

- Users treat interpretations as facts.
- Pet or body cards imply diagnosis or treatment without evidence.
- The memory decision is unclear.
- The card feels like bureaucracy instead of orientation.
- The interface cannot distinguish “observe longer” from “take action now.”
- The same card can be used to justify mutually incompatible actions without showing uncertainty.

## Next concrete experiment

Create five low-fidelity static cards and run a 30-second comprehension test. The first implementation can be plain Markdown, Figma, or a single React page. No backend is required.

Pass threshold: at least 4/5 cards are correctly understood by a nontechnical viewer for observation, inference, privacy, and next safe move.

## Sources

- Voudouris et al. (2025), *The Animal-AI Environment: A virtual laboratory for comparative cognition and artificial intelligence research*, Behavior Research Methods. https://link.springer.com/article/10.3758/s13428-025-02616-3
- Mancini (2021), *Animal-Computer Interaction: towards technologically mediated multispeciesity*. https://oro.open.ac.uk/79980/1/Navigationen-ACI-Mancini-English.pdf
- Nimi (2025), *Embodied Co-Creation with Real-Time Generative AI: An Ukiyo-E Interactive Art Installation*. https://www.mdpi.com/2673-6470/5/4/61
- Klamut & Weissenberger (2026), *Bridging interoception and time perspective: toward an embodied model of consciousness*. https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2026.1725236/full
- Zhang et al. (2026), *From Pets to Robots: MojiKit as a Data-Informed Toolkit for Affective HRI Design*. https://arxiv.org/html/2603.11632v1
