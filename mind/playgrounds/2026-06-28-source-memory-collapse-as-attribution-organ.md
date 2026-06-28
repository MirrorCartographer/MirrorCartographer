# Source-Memory Collapse as an Attribution Organ

Date: 2026-06-28
Status: playground note / evidence-informed design seed
Public-safety level: abstracted; no private user material

## Finding scanned

A recent HCI / human-AI co-creation result reports that people can misremember whether ideas or text came from themselves, from AI, or from mixed human-AI workflows after a delay. The important concept is not just disclosure; it is delayed source memory failure.

Source:
- Zindulka et al., "Users Misremember What They Created With AI or Without," arXiv 2509.11851, first posted 2025-09-15, surfaced in 2026 coverage. https://arxiv.org/abs/2509.11851
- TechXplore summary, 2026-05-11: https://techxplore.com/news/2026-05-people-struggle-recall-content-ai.html

## What changed in understanding

Mirror Cartographer has been treating attribution as a label attached to finished artifacts.

This finding suggests attribution should instead behave like a cognitive support organ: something that stays visible across time, because memory of origin degrades after the interaction ends.

A one-time label is probably insufficient. The system needs persistent, inspectable source traces that preserve the difference between:

- user-originated idea
- AI-originated wording
- AI-originated conceptual suggestion
- mixed transformation
- user-approved revision
- later reinterpretation
- memory-influenced retrieval

## Useful concept extracted

### Attribution Organ

An Attribution Organ is a durable interface layer that helps a user preserve authorship, origin, and transformation history across human-AI co-creation.

It should not say "the AI made this" or "the human made this" too simplistically. It should show how a thought changed hands.

## Design pattern

Each interpretation, note, claim, image prompt, plan, or symbolic map gets an attribution trace:

```text
origin_event:
  type: user | ai | mixed | external_source | memory_retrieval
  timestamp: ISO-8601
  input_snapshot: optional redacted summary
  generated_output: summary
  transformation_role: proposed | expanded | compressed | reframed | contradicted | styled | remembered | retrieved
  confidence: low | medium | high
  user_confirmed: true | false | partial
  later_memory_risk: low | medium | high
```

## MC implication

MC should not merely help users interpret symbols. It should help users remember which parts of an interpretation belonged to them, which parts came from the model, and which parts emerged through interaction.

This strengthens:

- interpretation object lifecycle
- memory trust gate
- authorship truth layer
- co-creation provenance
- public-safe artifact claims
- rollback and revision history

## Claim status

Claim: A persistent attribution trace will reduce confusion about whether symbolic interpretations or artifact ideas came from the user, AI, or a mixed process.

Evidence status: plausible but unproven for MC.

Supported facts:

- Human-AI co-creation can impair later source attribution.
- Mixed workflows appear especially vulnerable to origin confusion.
- Disclosure alone may not solve delayed memory confusion.

Inference:

- MC needs attribution as a recurring interaction layer, not a static label.

## Falsification checklist

The pattern is weakened if testing shows:

- users ignore attribution traces after first exposure
- attribution traces interrupt reflective flow enough to reduce use
- users still misremember source even with persistent traces
- symbolic labels increase authority confusion
- users prefer simple chronological history over structured attribution

## Prototype test

Build four variants of one co-created symbolic map:

1. no attribution trace
2. simple AI/user labels
3. timeline provenance
4. Attribution Organ with transformation role and memory-risk marker

After immediate use and after a delay, test whether users can accurately answer:

- Who introduced this idea?
- Who changed this wording?
- Which part was inferred by AI?
- Which part did the user explicitly confirm?
- Which part should not be treated as identity truth?

## Next move

Prototype a minimal Attribution Organ for one interpretation object.

Do not start with the whole MC system. Start with one thought moving through three transformations:

user phrase -> AI interpretation -> user correction -> revised artifact

The test is whether the origin stays legible without making the interface feel bureaucratic.
