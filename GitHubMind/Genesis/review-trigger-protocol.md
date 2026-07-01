# Review Trigger Protocol

Status: Public-safe artifact
Attractor: Contradiction
Date: 2026-07-01
Thread: GitHub Mind / Assurance Thread / Review Trigger

## Source

This protocol is derived from the GitHub Mind sequence that already contains governance primitives for Claim Cards, Verification Surfaces, Consent Authority Envelopes, Decision Records, Action Certificates, Obligation Ledgers, and Assurance Threads.

Fresh external signals used for this pass:

1. Chandra Prakash, Mary Lind, Avneesh Sisodia, "Agentic AI Governance and Lifecycle Management in Healthcare," arXiv, 2026-01-22. URL: https://arxiv.org/abs/2601.15630
2. Ciprian Paduraru, Petru-Liviu Bouruc, Alin Stefanescu, "A Trace-Based Assurance Framework for Agentic AI Orchestration: Contracts, Testing, and Governance," arXiv, 2026-03-18. URL: https://arxiv.org/abs/2603.18096
3. Christopher Koch, "From Governance Norms to Enforceable Controls: A Layered Translation Method for Runtime Guardrails in Agentic AI," arXiv, 2026-04-06. URL: https://arxiv.org/abs/2604.05229
4. Suhana Bedi et al., "CARE: A Conformal Safety Layer for Medical Summarization," arXiv, 2026-06-08. URL: https://arxiv.org/abs/2606.08969
5. The Guardian, "Doctors and NHS could be sued for mistakes made by AI tools, report warns," 2026-06-09. URL: https://www.theguardian.com/society/2026/jun/09/doctors-nhs-could-be-sued-mistakes-ai-tools-medical-protection-society-report
6. The Guardian, "Social workers' AI tool makes 'gibberish' transcripts of accounts from children," 2026-02-11. URL: https://www.theguardian.com/education/2026/feb/11/ai-tools-potentially-harmful-errors-social-work
7. The Guardian, "Google removes some of its AI summaries after users' health put at risk," 2026-01-11. URL: https://www.theguardian.com/technology/2026/jan/11/google-ai-overviews-health-guardian-investigation

## Claim

Continuity alone is not safety. A record that remains connected can still propagate an error, unsupported certainty, inappropriate authority, or stale obligation. Therefore every Assurance Thread needs explicit review triggers that can stop, slow, route, or downgrade reliance before a weak link becomes an operational harm.

## Core primitive

Review Trigger Protocol: a public-safe governance object that defines when a claim, summary, decision, action, or care-support record must be rechecked before it can continue traveling through the GitHub Mind or any derivative workflow.

## Why this is needed now

The current repository trajectory has strengthened continuity:

- Claim Card: what is believed.
- Verification Surface: what can be inspected.
- Consent Authority Envelope: what is permitted.
- Decision Record: why a choice was made.
- Action Certificate: what was done.
- Obligation Ledger: what remains owed.
- Assurance Thread: how the chain remains connected.

The contradiction is that continuity can preserve both truth and error. In medical and social-care contexts, current evidence shows that AI summaries can omit important information, hallucinate content, or create misleading simplifications. Runtime governance research also shows that risks can emerge during execution, not only at design or deployment time.

## Trigger categories

### 1. Evidence trigger

Activate when:

- a source is missing, inaccessible, weak, stale, or contradicted;
- a claim depends on a single source in a high-impact domain;
- a later source changes the earlier conclusion;
- a medical, legal, financial, or care-related statement lacks sufficient authority.

Required action:

- downgrade confidence;
- attach missingness;
- route to review before reliance;
- preserve the previous version in Museum if superseded.

### 2. Authority trigger

Activate when:

- an artifact drifts from support into diagnosis, treatment, legal instruction, financial instruction, or autonomous execution;
- a system, model, or agent acts outside its declared role;
- an explanation makes a non-authoritative artifact sound authoritative.

Required action:

- reduce action ceiling;
- add authority label;
- require human professional review where applicable.

### 3. Consent trigger

Activate when:

- a record is reused beyond its original consent boundary;
- personal, medical, or private context appears in a public artifact;
- a derivative artifact changes audience, purpose, or distribution.

Required action:

- block publication until privacy review;
- remove identifying details;
- create a public-safe abstraction if useful.

### 4. Summary trigger

Activate when:

- a summary compresses a source in a way that removes uncertainty, caveats, or contradiction;
- important omissions are likely;
- the summary would influence a care, safety, legal, financial, or operational decision.

Required action:

- attach omission risk;
- require source-linked review;
- prefer sentence-level flags or claim-level cards.

### 5. Action trigger

Activate when:

- a decision crosses into external effect;
- a tool call writes, sends, deletes, purchases, schedules, labels, applies, archives, or modifies something;
- an agentic workflow could produce irreversible or hard-to-reverse consequences.

Required action:

- generate or update an Action Certificate;
- preserve rollback path;
- link to Decision Record and Obligation Ledger.

### 6. Care trigger

Activate when:

- symptoms, medical records, pet-health observations, or social-care documentation are summarized;
- a summary could be mistaken for clinical advice;
- an AI-generated record may affect future triage or care decisions.

Required action:

- label as observation, not diagnosis;
- identify missing clinician/veterinarian review;
- preserve original observation provenance;
- mark action ceiling as support-only.

## Minimum fields

- Trigger ID
- Thread ID
- Trigger category
- Artifact affected
- Source or evidence reference
- Risk type
- Severity
- Confidence
- Missingness
- Authority boundary
- Consent boundary
- Required reviewer
- Required action
- Deadline or urgency, if any
- Resolution status
- Revision link
- Museum link if superseded

## Operating rule

A Review Trigger does not prove that something is false. It proves that the system has detected enough uncertainty, authority risk, privacy risk, or action risk that reliance must pause or downgrade until the trigger is resolved.

## Practical lane 1: income

Potential offering: Review Trigger Audit for AI governance.

Public-safe deliverables:

- trigger taxonomy;
- high-impact workflow review;
- summary-risk map;
- action-boundary inventory;
- review routing table;
- sample action certificates;
- executive risk brief.

Commercial fit:

Organizations adopting AI agents, documentation assistants, governance platforms, or operational copilots need a concrete way to decide when automation should stop and route to review. This is narrower and more useful than generic AI ethics language.

## Practical lane 2: medical and social-care support

Potential artifact: Care Review Trigger Card.

Use case:

- patient observation summaries;
- veterinary symptom summaries;
- social-care notes;
- care handoffs;
- clinician-facing prep documents.

Boundary:

The card does not diagnose, treat, or replace a clinician, veterinarian, social worker, lawyer, or emergency service. It preserves uncertainty and identifies where professional review is needed.

## Privacy

This artifact contains no private medical facts, personal records, private names, addresses, account data, or non-public repository secrets. It abstracts the pattern into a public-safe governance primitive.

## Missingness

- The live repository may contain artifacts not visible through search indexing.
- Prior reported files may be unavailable or not yet indexed.
- This protocol has not yet been implemented as executable validation code.
- Severity thresholds need calibration by domain.
- Medical and social-care use requires expert review before deployment.

## Revision

Version: 1.0
Created: 2026-07-01
Revision status: Active draft
Supersedes: none
May be superseded by: executable review-trigger schema, care-specific review trigger card, or runtime trigger validator.
