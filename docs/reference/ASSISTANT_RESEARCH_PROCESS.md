# Assistant Research Process

Revision note:

- Status: AI-organized process reference.
- Reason: created so other people can understand how information was found, challenged, organized, and converted into Mirror Cartographer product requirements.
- Source: long-form conversation, uploaded images, GitHub edits, critique passes, research-grounded safety framing, and project implementation work.
- Boundary: this describes a working method, not a claim that the assistant is independently authoritative or always correct.

## Core process

The process is not simply "ask AI for ideas."

The working loop is:

1. Collect raw signals.
2. Preserve the user's language.
3. Identify subject domains.
4. Separate metaphor from evidence.
5. Inspect relevant sources when needed.
6. Extract useful patterns.
7. Interrogate weak claims.
8. Convert findings into product requirements.
9. Add boundaries and failure modes.
10. Store the result in organized reference files.

## Raw signal types

Inputs may include:

- user questions
- uploaded screenshots
- articles
- poems
- images
- diagrams
- health concerns
- product ideas
- symbolic language
- coding errors
- career goals
- GitHub files
- deployment failures

The assistant treats these as signals, not automatic proof.

## Interpretation rules

### Rule 1: Preserve the original signal

Do not immediately make the input generic.

Example:

A prosthetic article is not only "technology."

It may also be about fit, control, maintenance, identity, independence, signal translation, and emotional adaptation.

### Rule 2: Convert metaphor into interface structure

A metaphor becomes useful when it produces a mechanism.

Example:

"Code is a prosthetic for thought" becomes:

thought -> input -> parser -> state -> logic -> output -> feedback -> correction

### Rule 3: Separate symbolic usefulness from factual authority

A symbolic insight can help organize attention.

It cannot diagnose, prove, predict, or replace evidence.

### Rule 4: Interrogate every attractive phrase

If a phrase sounds powerful, ask:

- What does it mean operationally?
- What input does it require?
- What output does it produce?
- What would prove it failed?
- What would make it unsafe?

### Rule 5: Convert research into product behavior

A source becomes useful when it changes the system.

Example:

Research about emotional adaptation after amputation becomes a design rule:

Do not assume distress is immediate or universal. Add delayed review and disruption-type classification.

## Claim status categories

Every interpretation should be classified as one of these:

- observation
- user report
- symbolic hypothesis
- evidence-based fact
- practical next step
- not enough information

## Source status categories

Every symbolic interpretation should show source status:

- Source-backed: tied to a defined source or symbol database.
- User-backed: based on the user's own stated associations.
- Speculative: possible meaning only.
- Not available: no source is connected yet.

## Hostile audit questions

For any project idea, ask:

- Where is this generic?
- Where is this inflated?
- Where is this pretending to be finished?
- Where is this unsafe?
- Where is this only aesthetic?
- Where is the feedback loop?
- What would a critic reject immediately?
- What proof would make the claim harder to dismiss?

## Research-to-build conversion template

Use this template for any topic.

### Source

What was the article, image, conversation, or file?

### Raw signal

What stood out?

### Hidden structure

What pattern or mechanism is underneath it?

### Product translation

How should this change the interface, engine, document, or evaluation?

### Boundary

What should not be claimed?

### Next build action

What file, feature, test, or artifact should be created?

## Example: prosthetics source

Source:

Prosthetics article and emotional-needs paper.

Raw signal:

Prosthetics restore control, but emotional adaptation varies by time, loss type, and person.

Hidden structure:

A tool must fit the user and be maintained over time.

Product translation:

Add fit feedback, disruption type, review date, exportable trace, and correction loop.

Boundary:

Do not make medical claims about amputees or use old source material as current clinical guidance.

Next build action:

Create `docs/PROSTHETIC_INTERFACE_AND_EMOTIONAL_ADAPTATION.md` and later implement disruption-type classifier.

## Example: coding source

Source:

Autobiography in Five Short Chapters poem and thought-controlled prosthetic article.

Raw signal:

Learning requires recognizing the repeated hole and building another route.

Hidden structure:

Code turns thought into action through input, parser, state, logic, output, feedback, correction.

Product translation:

Extract the mapping engine, add feedback controls, and create exportable session records.

Boundary:

Do not pretend symbolic reflection is proof.

Next build action:

Create `src/lib/mirrorMap.ts`, CI verification, and `docs/THOUGHT_TO_ACTION_INTERFACE.md`.

## Reuse for another project

Someone can use this process by asking:

1. What is my raw signal?
2. What am I trying to restore, explain, build, or protect?
3. What is the hidden structure underneath the signal?
4. What is the smallest useful product behavior that follows from it?
5. What should I not claim yet?
6. What proof would make the idea stronger?
7. What should be saved as a reference for future work?

## Final process rule

Do not worship the idea.

Interrogate it until it becomes useful.