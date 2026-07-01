# Claim Card Schema

## Status

Public-safe design primitive.

## Attractor

Compression.

## Definition

A **Claim Card** is the smallest reusable verification unit attached to an artifact, paragraph, summary, export, interface panel, care-support note, or governance decision.

It compresses provenance, authority, uncertainty, privacy, revision, missingness, and correction into a visible card that can travel with the claim.

## Core claim

**A claim that cannot carry its minimum verification boundary should not be allowed to travel alone.**

## Why this is needed

The GitHub Mind already contains:

- Provenance Carry-Forward Ledger;
- Verification Surface Protocol;
- Layer Drift Sentinel;
- Assurance Interface Contract;
- Deployment Proof Gate;
- Governance State Machine;
- Reversibility Anchor.

These define the need for provenance, visibility, correction, and state management. The missing compression layer is the reusable unit that makes those requirements portable.

## Required fields

Every Claim Card should contain:

1. Claim ID
2. Claim text
3. Source class
4. Source date or source range
5. Evidence maturity
6. Confidence level
7. Authority boundary
8. Privacy boundary
9. Missingness label
10. Revision date
11. Supersession state
12. Derivative status
13. Verification method
14. Correction path
15. Action ceiling

## Optional fields

Optional fields may include:

- linked source path;
- audit path;
- checksum or manifest reference;
- layer identifier;
- governance state;
- reviewer role;
- expiration date;
- care-context review state.

## Minimum valid card

A minimum valid Claim Card must answer:

- What is being claimed?
- Where did the claim come from?
- How mature is the evidence?
- What is missing?
- Who or what has authority to act?
- What should not be inferred?
- How can the claim be corrected or superseded?

## Runtime behavior

When a claim is copied, summarized, exported, converted into a plan, translated into another explanation layer, or placed into a care-support context, the Claim Card should either:

- travel with the claim;
- be embedded in the receiving surface;
- be referenced by stable repository path;
- or trigger a missing-card warning.

## Practical lane 1: income

Commercial offer:

**Claim Card Implementation Review**

Potential buyers:

- small AI product teams;
- AI governance teams;
- healthcare documentation vendors;
- legal operations teams;
- research organizations;
- content or knowledge-base teams using AI summaries.

Deliverables:

- claim inventory;
- reusable claim-card template;
- export and handoff risk map;
- missing-card register;
- correction workflow;
- implementation roadmap.

## Practical lane 2: medical and social-care

Care-support artifact:

**Care Claim Card**

Purpose:

Preserve source, review status, uncertainty, authority boundary, privacy boundary, missingness, and correction path for care-related summaries, observations, referrals, caregiver notes, and administrative handoffs.

Boundary:

This supports communication, continuity, review, and correction. It does not diagnose, treat, triage, prescribe, or replace clinician or qualified care-professional judgment.

## Source labels

- Prakash, Lind, and Sisodia, 2026: healthcare agent lifecycle governance needs identity, PHI-bounded memory, runtime policy, kill-switch triggers, decommissioning, and audit logging.
- Koch, 2026: governance norms need translation into runtime-enforceable controls and assurance evidence.
- Khan, Joyce, and Habiba, 2025: agentic governance requires design, runtime, audit controls, semantic telemetry, dynamic authorization, interruptibility, and provenance.
- Paduraru, Bouruc, and Stefanescu, 2026: trace-based assurance records message-action traces, contracts, fault injection, containment, and governance outcomes.
- Guardian, 2026-02-11: AI-generated social-care summaries can introduce harmful errors into official records.
- EU AI Act transparency obligations become fully applicable in 2026 for machine-readable marking of AI-generated or manipulated content.

## Claim labels

- Claim: Mirror Cartographer needs a portable Claim Card unit so verification surfaces can be implemented consistently.
- Confidence: high.
- Evidence maturity: emerging but convergent across governance, runtime assurance, provenance, and care-documentation risk.
- Scope: design and governance architecture.
- Authority: not legal, clinical, compliance, financial, or regulatory advice.

## Privacy label

Public-safe. No private health, household, financial, client, patient, or personal records included.

## Missingness label

This schema does not yet implement automated validation, cryptographic signing, C2PA metadata, repository-wide claim IDs, or export tooling. It defines the minimum portable verification unit.

## Revision label

Revise if:

- formal claim IDs are introduced repository-wide;
- MC exports receive embedded provenance metadata;
- legal or regulatory requirements define mandatory provenance display formats;
- care-support summaries gain structured review workflows;
- automated validation tooling is added.
