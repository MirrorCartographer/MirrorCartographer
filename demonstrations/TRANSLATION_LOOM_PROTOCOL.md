# Translation Loom: Research Protocol

Interactive specimen: https://github.com/MirrorCartographer/mirror-cartographer-ui/blob/creative/translation-loom-proof-20261018/public/translation-loom.html

Testable model: https://github.com/MirrorCartographer/mirror-cartographer-ui/blob/creative/translation-loom-proof-20261018/public/translation-loom-core.mjs

Test: https://github.com/MirrorCartographer/mirror-cartographer-ui/blob/creative/translation-loom-proof-20261018/tests/translation-loom-core.test.mjs

Related concept: Meaning Without Flattening in the Project 101 demonstration catalog. Governing review: https://github.com/MirrorCartographer/MirrorCartographer/blob/main/architecture/ADVERSARIAL_REVIEW_PROTOCOL.md

## Question
Can a visitor observe how a fictional metaphor changes across symbolic, neutral, and research registers while keeping the source, author-selected semantic anchors, and unknowns distinct?

## Synthetic source
“A greenhouse at midnight; every leaf is thinking.”

The demo author proposes three anchors: evening context; multiplicity of thoughts; difficulty distinguishing individual thoughts. Each anchor has a different phrase in each register. These alignments are hypotheses, not proven equivalences.

## Mechanism
Visitors select a register and choose which anchors to carry forward. The source remains unchanged. The page renders only selected fragments; an empty selection stays empty. The count describes selected demo anchors only, not semantic quality.

## Claim boundary
The demo shows alternative representations and exposes the author's chosen alignment. It does not prove equivalence, psychological truth, diagnosis, cause, or improved comprehension. Research-style wording is not a measurement.

## Reproducible test
From the UI repository root run: node --test tests/translation-loom-core.test.mjs

The tests cover stable anchor IDs, changed wording, removal of an anchor, empty selection, invalid modes, count handling, and non-diagnostic phrasing. Passing unit tests do not validate the translation or the human experience.

## Review gates
Before merge, test keyboard and screen-reader use, narrow viewports, and reduced-motion preferences. Confirm no persistence or external requests. Ask independent, consented readers what they think stayed the same, what changed, and what remains unknown. Preserve disagreements.

## Cross-repository boundary
The UI repository owns the interaction. This repository owns the protocol and evidence boundary. The next evidence gate is a clean-checkout test and a small consented comprehension review.
