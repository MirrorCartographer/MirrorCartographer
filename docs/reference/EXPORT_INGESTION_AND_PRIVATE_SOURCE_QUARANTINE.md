# Export Ingestion and Private Source Quarantine

Revision note:

- Status: public-safe data-handling protocol.
- Reason: created after the user uploaded account/user metadata and conversation export files and clarified that private material can be researched but should not be exposed through GitHub.
- Source: latest upload batch, chat research protocol, public/private boundary work, missing archive boundary, and extraction pipeline.
- Boundary: this protocol does not publish raw export data. It defines how raw exports should be handled before public abstraction.

## Core rule

Raw exports are private-source material.

Do not publish raw exports to GitHub.

Use them to understand architecture, then publish only public-safe abstractions.

## Why quarantine matters

Raw exports may contain:

- account metadata
- private conversations
- images or attachments
- health or body observations
- animal-care details
- relationship context
- location clues
- credentials or tokens
- assistant mistakes
- emotionally intense material

Even when these details are useful for understanding the project, they are not automatically public-safe.

## Ingestion stages

### Stage 1: Quarantine

Store the raw export outside the public repo.

Mark it:

private-source / do-not-publish-raw

### Stage 2: Inventory

Identify file type and purpose:

- account metadata
- conversation export
- artifact index
- code file
- spreadsheet
- image
- PDF
- symbolic worksheet

### Stage 3: Risk scan

Check for:

- identifiers
- secrets
- private timelines
- health/body specifics
- household specifics
- raw emotional logs
- platform metadata
- copyrighted or third-party content

### Stage 4: Architecture extraction

Extract public-safe value:

- old names
- modes
- correction patterns
- drift events
- feature requirements
- source gaps
- evaluation needs
- privacy boundaries
- implementation clues

### Stage 5: Label source status

Use:

- raw export available privately
- source-derived but redacted
- partial source
- memory-backed
- unavailable source
- placeholder-only source

### Stage 6: Publish abstraction

Only publish:

- method
- schema
- public-safe finding
- product requirement
- evaluation question
- proof-gap note
- source-boundary entry

## Conversation export extraction targets

When reading conversation exports, prioritize:

- user corrections
- repeated commands
- mode mismatch
- assistant drift
- old subsystem names
- visual-symbolic threads
- cognitive profile evolution
- accessibility failures
- implementation attempts
- privacy boundary changes
- public proof attempts

## What not to publish

Do not publish:

- raw exported conversations
- account metadata
- full private timelines
- private health/body records
- household or animal-care case specifics
- raw emotional logs
- exposed secrets
- private images or attachments
- exact identifiers not needed for public proof

## Product requirement

Mirror Cartographer should eventually include an export-ingestion tool with:

- private-source quarantine
- metadata stripping
- secret scanning
- conversation sequence parser
- correction detector
- assistant drift detector
- source-status labeler
- privacy-risk classifier
- public-safe abstraction generator
- GitHub-ready output preview

## Research question

Can long-context exported chat data improve AI-assisted research without turning private life into public dataset material?

## Search terms

export ingestion, private source quarantine, conversation export, user metadata, raw export, public-safe abstraction, source-derived redacted, correction detector, assistant drift detector, Mirror Cartographer.