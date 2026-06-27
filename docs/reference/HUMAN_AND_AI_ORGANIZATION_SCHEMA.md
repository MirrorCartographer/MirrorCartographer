# Human and AI Organization Schema

Revision note:

- Status: public-safe organization schema.
- Reason: created to make the repository easier for both humans and AI assistants to navigate, extend, and audit.
- Source: project-management instruction to organize the work for humans and AI while protecting private information.
- Boundary: this is an information architecture guide, not a complete ontology.

## Purpose

Mirror Cartographer needs two readers:

1. A human reader who wants to understand quickly.
2. An AI assistant that needs to route future work safely and accurately.

This schema gives both a shared navigation pattern.

## Folder roles

### `/docs/reference/`

Use for stable reusable guides:

- policies
- methods
- indexes
- research process
- revision rules
- typo-signal logic
- authorship boundaries

Human question:

How do I understand or reuse this system?

AI question:

What rules should I follow before adding or revising material?

### `/docs/research/`

Use for hypotheses, provocations, concept models, and research questions.

Human question:

What is interesting enough to study?

AI question:

What ideas are speculative and need testing?

### `/docs/education/`

Use for school subjects and learning frameworks.

Human question:

How does this apply outside the original project?

AI question:

What subject path should this material be routed into?

### `/docs/privacy/`

Use for public/private boundaries and redaction policy.

Human question:

What should not be public?

AI question:

What must I abstract before committing to GitHub?

### `/docs/long-context/`

Use for old chats, source registers, project history, and subject paths.

Human question:

Where did this idea come from?

AI question:

What older thread does this connect to?

### `/src/`

Use for actual implementation.

Human question:

What has been built?

AI question:

What code behavior should change next?

## Metadata pattern for future files

Every important new file should begin with a revision note:

- Status:
- Reason:
- Source:
- Boundary:

## Routing questions

Before adding a file, ask:

1. Is this a stable reference rule?
2. Is this a research hypothesis?
3. Is this education-facing?
4. Is this privacy-related?
5. Is this long-context history?
6. Is this actual product code?
7. Does it contain private detail that can be abstracted?

## Claim labels

When writing about an idea, use one of these labels:

- Observation
- User report
- Source-derived synthesis
- Symbolic hypothesis
- Product requirement
- Research provocation
- Implementation status
- Boundary / non-claim

## Source labels

When writing about origin, use one of these labels:

- Current GitHub file
- Uploaded source
- Library file
- Prior conversation memory
- User-provided statement
- Public source
- AI synthesis
- Implementation result

## Privacy labels

When privacy matters, use one of these labels:

- Public-safe
- Public-safe after abstraction
- Private by default
- Do not publish raw
- Requires explicit user approval

## The AI assistant rule

Do not collapse everything into a pretty summary.

Route it.

Label it.

Protect private specifics.

Make the next action visible.