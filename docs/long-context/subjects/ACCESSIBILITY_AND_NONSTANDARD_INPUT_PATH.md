# Accessibility and Nonstandard Input Path

Revision note:

- Status: public-safe subject path from old project files and user preferences.
- Reason: created to preserve accessibility, voice-reader, typo-signal, nonstandard language, and interface-friction work as core Mirror Cartographer architecture.
- Source: prior conversations about read-aloud problems, code blocks, typo/language disruption, dialect, compressed phrasing, and accessible interface design.
- Boundary: this file is an accessibility and design reference, not a universal accessibility standard.

## Why this belongs in Mirror Cartographer

Mirror Cartographer depends on preserving signals that ordinary interfaces often erase.

That includes:

- typos
- fragments
- slang
- dialect
- compressed phrasing
- voice-reader constraints
- image-first thinking
- body-first language
- nonlinear explanation

The system should not punish a user for not communicating in polished academic prose.

## Voice-reader lesson

Old accessibility notes identified that dense code blocks, giant tables, and file-heavy responses can fail when read aloud.

Public-facing MC docs and assistant responses should:

- put critical instructions in normal prose first
- avoid making code blocks the only source of essential information
- provide plain-language summaries before links or files
- keep navigation simple
- use headings and search terms

## Nonstandard language lesson

Nonstandard input can be signal, identity, speed, or access need.

The system should ask:

- Should this be preserved exactly?
- Should it be corrected?
- Should it be mapped as possible signal?
- Is this dialect, speed, typo, compression, or intentional style?

## Product translation

Mirror Cartographer should support:

- raw input preservation
- corrected version shown separately
- typo-signal weighting
- simple mode
- symbolic mode
- voice-reader friendly outputs
- exportable text
- alt descriptions for visual artifacts
- no essential information trapped only in images

## Research value

This path may interest researchers studying:

- accessible AI interfaces
- neurodivergent-friendly design
- voice-reader UX
- dialect preservation
- human-AI communication repair
- linguistic justice in AI systems
- nonstandard input handling

## Search terms

accessibility, voice reader, read aloud, code blocks, typo signal, nonstandard input, dialect, slang, compressed phrasing, alt text, neurodivergent interface, user language preservation.