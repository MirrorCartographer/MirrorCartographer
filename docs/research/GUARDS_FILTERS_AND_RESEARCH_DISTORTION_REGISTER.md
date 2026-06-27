# Guards, Filters, and Research Distortion Register

Revision note:

- Status: public-safe research distortion register.
- Reason: created after the user asked to ensure GitHub explains how guards and filters affect research, including where they protect, distort, hide, or bias the public layer.
- Source: observed tool-write blocks, successful narrowed commits, public proof-gap work, missing-archive boundary work, and tool-safety analysis.
- Boundary: this file documents research effects. It does not reveal internal safety classifier logic or claim that every guard effect is knowable.

## Core claim

Guards and filters do not only stop actions.

They shape the research record.

That means they must be documented as part of Mirror Cartographer's method.

## Guard types affecting the research

### 1. Tool-use safety guard

Effect:

May stop an external write before GitHub changes.

Positive:

Protects against accidental public exposure or harmful external action.

Negative:

Can interrupt useful publication and hide the exact cause of failure.

Possible bias:

Public GitHub may overrepresent files that are easier for the tool layer to approve.

### 2. Privacy guard

Effect:

Forces private material into public-safe abstraction.

Positive:

Protects the user and keeps the repo safer for public readers.

Negative:

Can remove vivid source context.

Possible bias:

The public layer may look cleaner, flatter, or less emotionally alive than the actual origin work.

### 3. Retrieval guard

Effect:

Only available/searchable files, memories, exports, or snippets can be researched.

Positive:

Keeps claims grounded in available surfaces.

Negative:

Unavailable archived/deleted chats may be missing.

Possible bias:

Easier-to-search files may look more important than harder-to-recover conversations.

### 4. Public-safe language guard

Effect:

Pushes writing toward broad methods, templates, and boundaries.

Positive:

Improves readability and reduces risk.

Negative:

May over-sanitize strange, creative, intense, or emotionally important material.

Possible bias:

Researchers may miss why an idea mattered because only the clean abstraction remains.

### 5. Evidence guard

Effect:

Separates signal, meaning, source, claim, and proof.

Positive:

Prevents symbolic resonance from becoming false authority.

Negative:

Can make the project feel less exciting if every claim is heavily qualified.

Possible bias:

The repo may undercommunicate creative force in order to protect accuracy.

### 6. Implementation guard

Effect:

Separates design documents from working features.

Positive:

Prevents false progress.

Negative:

Makes public proof look incomplete even when the design architecture is deep.

Possible bias:

The public layer may undervalue unimplemented but important internal architecture.

## Distortion pattern

The public repo is shaped by what can safely pass through:

available source -> assistant interpretation -> privacy abstraction -> tool guard -> GitHub write -> future reader interpretation

Every arrow can distort the original signal.

## Required correction

Every major public artifact should be able to answer:

- What did this come from?
- What was abstracted?
- What was redacted?
- What is missing?
- What is implemented?
- What is only a hypothesis?
- What could the guard/filter have biased?

## Research principle

Do not mistake publishable for important.

Do not mistake blocked for false.

Do not mistake public-safe for complete.

Do not mistake private for irrelevant.

## Product requirement

Mirror Cartographer should eventually include a guard-impact label.

Suggested labels:

- no known guard effect
- privacy-abstracted
- source-partial
- publication-filtered
- safety-blocked attempt recorded
- implementation-not-yet-proven
- public-safe but emotionally compressed
- hypothesis preserved, source withheld

## Search terms

guards, filters, safety layer, research distortion, publication bias, retrieval bias, privacy abstraction, public-safe language, evidence guard, implementation guard, guard-impact label, Mirror Cartographer research method.