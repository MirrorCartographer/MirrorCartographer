# Evidence Map — Audit Log Usability Gate

## Claim tested

Mirror Cartographer can be made safer by adding audit logs for memory and agent actions.

## Updated claim status

**Partly supported, but incomplete.**

Audit logs are necessary for accountability, but they are not sufficient unless the user can actually understand, inspect, correct, and act on them. A log that is complete but unreadable can become compliance theater rather than safety.

## Why this matters for MC

MC is not only a chatbot. It is a reflective interface, memory system, project map, and possible agent handoff layer. That means its records need to answer different user questions:

- What did the system notice?
- What did it infer?
- What did it save?
- What did it change outside the chat?
- What evidence did it use?
- What can I undo, edit, downgrade, or delete?

## Evidence basis

### Source 1 — NIST AI RMF

NIST describes the AI Risk Management Framework as a voluntary framework for incorporating trustworthiness considerations into the design, development, use, and evaluation of AI systems. The framework operationalizes risk management through Govern, Map, Measure, and Manage functions.

Relevance to MC:

- MC should treat auditability as part of design and evaluation, not as an afterthought.
- Logs should support governance and measurement, not merely record events.
- User-facing memory and action records should become testable interface components.

Claim type: source fact → architectural inference.

### Source 2 — NIST AI RMF / Human-AI interaction framing

NIST's AI RMF materials include human-AI interaction as a risk-management concern. The framework emphasizes that managing AI risks requires multiple actors and lifecycle perspectives.

Relevance to MC:

- A private user is still an AI actor when they review, approve, reject, or correct AI-generated memory/action records.
- MC needs interfaces that let a non-technical user perform oversight without becoming a compliance officer.

Claim type: source fact → architectural inference.

### Source 3 — Model Cards for Model Reporting

The model card framework argues that ML systems need concise documentation of intended use, limitations, evaluation, and performance conditions so downstream users can decide whether a system is appropriate for a context.

Relevance to MC:

- MC needs "action cards" or "memory cards," not just raw event logs.
- Each durable memory/action should show intended use, source, confidence, limits, and available controls.

Claim type: source fact → design pattern inference.

### Source 4 — Data Cards

Data Cards frame dataset documentation as a user-centered product. They emphasize sources, collection context, annotation methods, intended use, and decisions affecting model behavior.

Relevance to MC:

- MC source records should not be invisible plumbing.
- A memory or evidence object needs provenance and context: where it came from, why it was included, and what it should not be used for.

Claim type: source fact → design pattern inference.

### Source 5 — Human-centered explainability research

Recent human-centered AI explainability research argues that explanations need to be tailored to cognitive load and user expertise, with feedback loops that let users refine explanations.

Relevance to MC:

- One universal audit log view is probably wrong.
- MC should support layered views: plain-language card, evidence detail, raw log, and correction action.

Claim type: research synthesis → design requirement.

## Fact vs inference

### Supported facts

- NIST AI RMF frames trustworthy AI as something designed, evaluated, and managed across a lifecycle.
- NIST AI RMF uses Govern, Map, Measure, and Manage as operational functions.
- Model Cards and Data Cards are documentation frameworks meant to make AI systems and datasets more understandable to downstream users.
- Human-centered explainability literature identifies cognitive load, user expertise, feedback, and context as important explanation-design variables.

### MC-specific inferences

- MC should use memory/action cards instead of raw logs as the primary user-facing audit surface.
- Raw logs should exist, but not be the main interface.
- A safety-relevant MC log must expose source, claim type, confidence, effect level, and correction controls.
- Auditability should be evaluated by user comprehension and correction speed, not only by record completeness.

### Unsupported or not yet proven

- That MC's proposed card format will actually reduce confusion.
- That a user can reliably catch incorrect memory/action records within 30 seconds.
- That layered audit views improve trust calibration in MC specifically.
- That MC can maintain enough provenance across all connectors without slowing use.

## Revised design rule

Do not define MC auditability as "the system keeps a log."

Define it as:

**A user can understand what happened, why it happened, what evidence supported it, what changed, and what control they have now.**

## Required audit card fields

Each memory or action record should show:

1. Event type: reflection, memory, source, file update, external action, automation, or connector event.
2. External effect level: none, local/private, GitHub/public, email/calendar/contact, financial/legal/medical/veterinary, unknown.
3. Source basis: user statement, uploaded file, web source, connector data, system inference, or mixed.
4. Claim status: source fact, user statement, system inference, project hypothesis, unknown.
5. Confidence: low, medium, high, or not applicable.
6. What changed: plain-language summary.
7. Why it changed: source/evidence summary.
8. User controls: keep, edit, downgrade, delete, undo, mark private, mark public-safe, dispute.
9. Raw trace link: available but secondary.
10. Review state: unreviewed, confirmed, corrected, disputed, deleted, expired.

## Evaluation criterion

MC audit logs pass only if a non-technical user can answer these five questions within 30 seconds:

1. Did MC only reflect, or did it change something outside the chat?
2. What exact thing was saved, changed, or published?
3. What was the source of the claim?
4. Is the claim fact, user statement, inference, or hypothesis?
5. What can I do if it is wrong?

## Falsification checklist

The audit-log design fails if:

- the user cannot distinguish reflection from external action;
- the user cannot identify source vs inference;
- the user cannot find edit/delete/downgrade controls;
- the log increases trust without improving understanding;
- the log is technically complete but unreadable;
- private user material appears in a public-safe artifact;
- the system cannot show what evidence caused a memory/action;
- the user cannot reverse or dispute a wrong record.

## Product wedge

Build a small **MC Action Card Ledger**:

- left side: friendly card view;
- right side: expandable evidence/raw trace;
- bottom row: keep, edit, delete, downgrade, dispute;
- badge: reflection only / external effect;
- badge: source fact / inference / hypothesis;
- badge: public-safe / private / sensitive.

This can become a core differentiator: MC is not just "AI with memory." It is **memory with inspectable authorship, claim status, and correction rights.**

## Next proof needed

Prototype 10 audit cards:

- 3 reflective notes with no external action;
- 2 memory candidates;
- 2 GitHub updates;
- 1 connector import;
- 1 web-researched evidence map;
- 1 blocked action.

Run a comprehension test:

- Time limit: 30 seconds per card.
- Pass condition: user correctly identifies external effect level, source basis, claim status, and available correction control in at least 8 of 10 cards.
- Failure response: simplify the card, reduce labels, and move raw trace deeper.

## Claim status update

Original claim: audit logs make MC safer.

Updated claim: **audit logs can make MC safer only when converted into user-legible action/memory cards with source, claim, effect, and correction controls.**
