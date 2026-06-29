# Evidence Chain

Status: Experimental
Attractor: Continuity
Privacy: Public-safe
Created: 2026-06-29

## Purpose

Mirror Cartographer should not treat a Transformation Record as an isolated artifact. The stronger knowledge object is the chain that links source, transformation, consequence, revision, and later validation.

A single record answers:

What changed here?

An Evidence Chain answers:

What changed across time, what did that change affect, and what later evidence confirmed, weakened, or revised it?

## Core claim

The durable unit of auditability is not the AI output and not even the first audit record. It is the continuity structure connecting records across time.

## Source signals

1. Trace-based agent assurance research describes Message-Action Traces, step contracts, trace contracts, deterministic replay, runtime governance, and action mediation as tools for evaluating agentic AI behavior across long-horizon interaction and external side effects.
Source: https://arxiv.org/abs/2603.18096

2. AGENTSAFE describes lifecycle governance for agentic systems using design, runtime, and audit controls, including semantic telemetry, dynamic authorization, anomaly detection, interruptibility, provenance, accountability, and auditable assurance.
Source: https://arxiv.org/abs/2512.03180

3. Audit Trails for Accountability in Large Language Models frames audit trails as chronological, tamper-evident, context-rich ledgers that link technical provenance with governance records so organizations can reconstruct what changed, when, and who authorized it.
Source: https://arxiv.org/abs/2601.20727

4. Healthcare AI liability reporting shows that clinicians and health systems may face liability when AI tools influence diagnosis or treatment errors, increasing the practical need for accountable records of AI-supported decisions.
Source: https://www.theguardian.com/society/2026/jun/09/doctors-nhs-could-be-sued-mistakes-ai-tools-medical-protection-society-report

## Operating schema

Each Evidence Chain entry should preserve these fields:

- Chain ID
- Artifact ID
- Source
- Claim
- Transformation
- Evidence used
- Evidence not used
- Missingness
- Privacy status
- Consequence surface
- Liability surface
- Care or support surface
- Revision trigger
- Revision made
- Confidence before revision
- Confidence after revision
- Human review status
- Downstream action
- Later validation
- Later contradiction

## Relationship to existing GitHub Mind concepts

### Transformation Record

A Transformation Record captures what changed in one artifact.

### Transformation-Liability-Care Loop

The loop adds the consequence question: who carries the result when the change becomes action?

### Fluent Ambiguity

Fluent Ambiguity detects outputs that sound coherent while hiding weak evidence, missing source links, softened uncertainty, or consequence-bearing inference.

### Evidence Chain

Evidence Chain connects all of the above across time. It prevents the system from treating a clean one-time audit as sufficient.

## Practical lane: income

Evidence Chain can become the premium layer of a Transformation Audit service.

Basic offer:

- one artifact audit
- source, claim, evidence, missingness, and risk labels

Higher-value offer:

- evidence chain across multiple AI outputs, revisions, decisions, and downstream consequences

Potential buyer language:

Mirror Cartographer creates reviewable evidence chains for AI-assisted work so teams can see what changed, why it changed, what evidence supported it, what remained missing, and where human accountability is still required.

## Practical lane: medical and social care

Evidence Chain should not diagnose, treat, or replace clinicians.

Its useful care role is coordination and continuity:

- preserve what was observed
- separate direct observation from inference
- track what changed between visits or documents
- show missing information
- prepare clearer questions for qualified professionals
- reduce the chance that important uncertainty is lost in fluent summaries

## Claims and confidence

Claim: Agentic AI governance is moving toward trace, telemetry, provenance, runtime control, and audit evidence.
Confidence: High
Reason: Multiple recent sources independently point in this direction.

Claim: Mirror Cartographer's Source to Claim to Missingness to Revision structure aligns with this direction.
Confidence: Medium
Reason: Conceptual alignment is clear, but practical value still requires validation through real audits.

Claim: Evidence Chain could be commercially stronger than a single audit template.
Confidence: Medium
Reason: It maps better to enterprise accountability needs, but demand must be tested with real buyers.

## Missingness

- Need direct buyer interviews.
- Need examples using real but anonymized workflows.
- Need comparison against existing governance, GRC, QA, and audit tools.
- Need validation that users can understand and use the chain without excessive cognitive load.
- Need pricing tests for single audit versus ongoing evidence-chain maintenance.

## Revision label

Revision from prior GitHub Mind direction:

Transformation Record remains useful, but the repository should now treat longitudinal evidence continuity as the stronger organizing principle.
