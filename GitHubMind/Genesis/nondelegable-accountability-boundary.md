# Nondelegable Accountability Boundary

Status: experimental
Attractor: contradiction
Created: 2026-06-29
Privacy: public-safe; contains no personal medical facts, private user data, PHI, credentials, or secrets.
Validation status: draft; requires use in real audit examples before promotion.
Revision: initial synthesis from Action Authority Ladder, Source-to-Action Pipeline, and fresh public AI assurance / healthcare governance sources.

## One-line definition

The Nondelegable Accountability Boundary marks the point where AI can assist a process, but responsibility for consequence-bearing interpretation, approval, or action must remain with an accountable human, organization, or licensed authority.

## Why this exists

The current GitHub Mind already contains strong continuity objects:

- Evidence Chain
- Evidence Readiness Gate
- Operational Evidence Density
- Claim Custody Chain
- Action Authority Ladder
- Source-to-Action Pipeline
- Assurance Bridge

These describe how a claim moves, matures, gains evidence, and receives permitted-use labels.

The missing contradiction is this:

A claim can be well-sourced, well-traced, and audit-ready while still being wrongly treated as if accountability moved from the human system to the AI system.

This artifact prevents that collapse.

## Core claim

AI may transform, summarize, retrieve, compare, draft, rank, or flag information.

AI should not be treated as the accountable holder of:

- clinical judgment,
- legal responsibility,
- fiduciary responsibility,
- safety-critical approval,
- professional sign-off,
- consent-bearing decisions,
- or institutional duty of care.

The responsible actor can use AI-generated evidence, but cannot hide behind it.

## Source labels

Source type: public research and news synthesis
Source freshness: 2024-2026, with 2026 sources prioritized

1. Financial Times, "You can't blame AI for mistakes, regulator tells auditors," 2026-03.
   Relevance: reports UK audit-regulator guidance emphasizing that audit firms remain accountable when using AI and cannot deflect blame onto AI systems.
   URL: https://www.ft.com/content/f39c0d8d-c15a-4143-9baf-464d7c5e5b01

2. arXiv 2601.15630, "Agentic AI Governance and Lifecycle Management in Healthcare," 2026-01-22.
   Relevance: proposes healthcare agent lifecycle governance with identity/persona registries, PHI-bounded memory, runtime policy enforcement, kill-switch triggers, credential revocation, and audit logging.
   URL: https://arxiv.org/abs/2601.15630

3. arXiv 2512.03180, "AGENTSAFE: A Unified Framework for Ethical Assurance and Governance in Agentic AI," 2025-12-02.
   Relevance: describes runtime governance, semantic telemetry, dynamic authorization, human oversight for high-impact actions, provenance, and accountability mechanisms.
   URL: https://arxiv.org/abs/2512.03180

4. arXiv 2605.23459, "AI Assurance: A Comprehensive Testing Strategy for Enterprise AI Systems," 2026-05-22.
   Relevance: argues enterprise AI assurance should focus on continuous risk reduction, evaluation-driven development, failure taxonomy, lifecycle management, and governance rather than classical correctness verification.
   URL: https://arxiv.org/abs/2605.23459

5. Financial News London, "Deloitte UK aims to move hundreds of juniors into AI audits," 2026-05.
   Relevance: indicates market demand for AI assurance as professional-services firms expand AI audit capacity.
   URL: https://www.fnlondon.com/articles/deloitte-uk-aims-to-move-hundreds-of-juniors-into-ai-audits-70eccfec

6. arXiv 2406.14243, "AuditMAI: Towards An Infrastructure for Continuous AI Auditing," 2024-06-20.
   Relevance: frames AI auditability as a responsible-AI requirement and proposes infrastructure for continuous AI auditing rather than one-off manual audits.
   URL: https://arxiv.org/abs/2406.14243

## Claim labels

### Claim 1

Evidence custody does not equal accountability custody.

Confidence: high
Reason: audit, enterprise assurance, and healthcare governance sources repeatedly separate traceability from responsibility, requiring human or institutional accountability even when AI assists.
Missingness: needs mapping against jurisdiction-specific legal standards and professional codes.

### Claim 2

Mirror Cartographer needs a label that says: this artifact may be useful, but it does not own the consequence.

Confidence: medium-high
Reason: existing GitHub Mind artifacts make evidence traceable; this new boundary prevents traceability from being mistaken for transferred responsibility.
Missingness: needs examples showing how the boundary changes actual decisions or review routing.

### Claim 3

The strongest commercial framing is not "AI says the answer," but "AI-assisted work remains inspectable and accountable."

Confidence: medium
Reason: AI assurance demand is visible in professional-services reporting and audit-governance research.
Missingness: needs a buyer-facing demo, pricing test, and first pilot.

### Claim 4

The safest medical/social-care lane is not AI-led intervention, but accountability-preserving documentation support.

Confidence: high
Reason: healthcare agent governance sources emphasize lifecycle controls, bounded context, monitoring, accountability, and audit logging.
Missingness: any real deployment would need privacy, consent, professional, and jurisdiction-specific review.

## Boundary rule

For every consequence-bearing artifact, add this question:

Who remains accountable if this is wrong, incomplete, over-applied, or acted on too soon?

If the answer is "the AI," the artifact is not ready.

## Boundary labels

Use one of these labels:

### Boundary 0: No consequence

Use case:

- private reflection
- brainstorming
- symbolic exploration
- low-risk draft language

Required label:

No consequence-bearing use authorized.

### Boundary 1: Human review required

Use case:

- appointment notes
- audit drafts
- research summaries
- care observations
- market claims

Required label:

AI-assisted artifact; requires accountable human review before use.

### Boundary 2: Professional review required

Use case:

- medical, legal, financial, safety, employment, or regulated-context claims

Required label:

AI-assisted artifact; professional review required before consequence-bearing use.

### Boundary 3: Institutional owner required

Use case:

- organization-wide policy
- compliance claim
- product release
- clinical workflow
- safety or risk controls

Required label:

AI-assisted artifact; institutional owner required for approval, monitoring, revision, and incident response.

### Boundary 4: Not delegable

Use case:

- diagnosis
- prescribing
- legal determination
- fiduciary decision
- safety-critical authorization
- consent-bearing action

Required label:

AI may support documentation or evidence organization only. Accountability cannot be delegated to the AI.

## Practical lane 1: income

Near-term offer:

AI Accountability Boundary Review

Deliverable:

- claim inventory
- source-to-action map
- action authority label
- accountability boundary label
- reviewer-needed label
- missingness map
- fluent ambiguity score
- allowed-use statement
- not-allowed-use statement

Likely first buyers:

- consultants using AI to prepare client-facing research
- founders writing investor or grant materials with AI assistance
- small teams publishing AI-assisted reports
- creators documenting provenance of novel claims
- healthcare-adjacent teams producing non-clinical coordination notes

Small first product:

A one-page AI-assisted artifact review that answers:

- What claims are present?
- What sources support them?
- What is missing?
- What can this artifact safely be used for?
- Who must review it before action?
- Who remains accountable?

## Practical lane 2: medical and social-care support

Safe contribution:

- preserve observations without turning them into diagnosis
- separate patient or caregiver report from interpretation
- route questions to the right reviewer
- keep uncertainty visible
- preserve revision history
- document who owns decisions

Not allowed:

- diagnose
- prescribe
- imply clinical certainty
- replace clinician judgment
- treat AI confidence as medical authority

## Museum decision

Do not promote.

Reason: the concept is structurally important, but it has not yet survived enough repeated use or contradiction testing.

## Relationship to existing artifacts

Action Authority Ladder asks:

What is this claim allowed to do?

Nondelegable Accountability Boundary asks:

Who remains responsible if it does harm?

Source-to-Action Pipeline asks:

Where is this claim in the path from observation to outcome?

Nondelegable Accountability Boundary asks:

At which point must responsibility be explicitly held by a human, professional, or institution?

## Revision target

Next revision should create a fictional public-safe example showing a care-summary note and a business memo before and after accountability-boundary labeling.

## Retirement condition

Retire or merge this artifact if repeated use shows it duplicates Action Authority Ladder without adding practical safety or buyer value.
