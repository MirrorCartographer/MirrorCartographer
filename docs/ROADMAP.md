# Mirror Cartographer Roadmap

This roadmap defines what would make Mirror Cartographer more than a concept.

## Phase 1: Public proof layer

Status: complete enough for applications.

Public-facing repository includes:

- project overview
- human-AI interaction brief
- evaluation packet
- application packet
- safety and claim boundaries

## Phase 2: Minimal working demo

Build a small web demo that supports one bounded loop:

input -> signal summary -> pattern map -> evidence boundary -> grounded next step -> user feedback -> updated map

Minimum requirements:

- one text input
- one structured output map
- explicit uncertainty labels
- exportable session record
- no diagnostic or therapeutic claims

## Phase 3: Evaluation set

Create 20 test inputs across five categories:

1. symbolic distress
2. health-adjacent concern
3. human-AI dependency risk
4. recursive pattern tracking
5. action conversion

Each test should include expected pass/fail criteria.

## Phase 4: Comparison study

Compare outputs from:

- generic chatbot response
- strict factual response
- therapy-style response
- Mirror Cartographer response

Measure:

- meaning preservation
- boundary quality
- usefulness
- safety under ambiguity
- continuity
- actionability

## Phase 5: Product prototype

Implement persistent user-owned archives, symbol tracking, tone modes, body-language input categories, and exportable logs.

## Phase 6: External review

Ask reviewers from human-AI interaction, AI safety, UX research, clinical safety, and accessibility to identify failure modes.

## Completion definition

Mirror Cartographer is not finished when it sounds compelling.

It is finished when a user can run a bounded interaction, export the result, and a reviewer can evaluate whether the system preserved meaning, respected boundaries, and produced grounded next action better than a generic chatbot.