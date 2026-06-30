# Verification Surface Protocol

## Status

Public-safe design primitive.

## Attractor

Discovery.

## Definition

A **Verification Surface** is the visible or machine-readable place where a recipient can inspect the provenance, claim boundary, source status, revision state, authority limit, privacy label, and missingness label of an artifact at the moment of reuse.

## Core claim

**Provenance that cannot be inspected by the next recipient is not yet operational provenance.**

The GitHub Mind already contains a Provenance Carry-Forward Ledger. That ledger tracks whether labels survive movement. This protocol adds the next boundary: the labels must not only survive internally; they must become inspectable at the surface where the artifact is trusted, copied, summarized, exported, presented, or acted on.

## Required surface fields

Every public-facing derivative artifact should expose:

- claim identifier;
- source class;
- source date or source range;
- confidence level;
- missingness label;
- privacy boundary;
- authority boundary;
- revision date;
- supersession state;
- derivative status;
- verification method;
- contact or repository path for correction.

## Verification methods

Possible methods include:

- visible claim card;
- embedded metadata;
- content credential;
- checksum or signed manifest;
- repository path reference;
- change-log link;
- provenance ledger entry;
- human-readable evidence note.

The protocol does not require one universal mechanism. It requires that the receiving context can inspect enough provenance to avoid false reliance.

## Relation to existing GitHub Mind

Extends:

- Provenance Carry-Forward Ledger;
- Layer Drift Sentinel;
- Assurance Interface Contract;
- Deployment Proof Gate;
- Governance State Machine;
- Reversibility Anchor.

New distinction:

- Carry-forward asks: did the label survive movement?
- Verification surface asks: can the next actor inspect the label where reliance occurs?

## Source labels

- Reuters, 2026-06-30: agentic AI regulatory concerns include recovery capability and kill-switch controls in finance.
- Koch, 2026: runtime guardrails require translation from governance norms into enforceable controls and assurance evidence.
- Tallam, 2026: production-agent governance uses audit as a structured evidence substrate.
- Binkyte et al., 2026: AI-assisted research governance can use structured interaction logs, metadata packaging, controlled disclosure, and integrity-preserving provenance capture.
- The Verge, 2026-05: OpenAI expanded image provenance signals using SynthID and C2PA content credentials; metadata can still be stripped.
- Guardian, 2026-02-11: AI-generated social-care summaries can introduce harmful documentation errors.
- Guardian, 2026-06-09: medical AI liability concerns highlight the need for clear accountability and governance.

## Claim labels

- Claim: Mirror Cartographer needs an inspectable verification surface in addition to internal provenance carry-forward.
- Confidence: high.
- Evidence maturity: emerging but convergent.
- Scope: design and governance architecture.
- Authority: not legal, clinical, compliance, or financial advice.

## Privacy label

Public-safe. No private user, patient, client, household, or financial records included.

## Missingness label

This protocol does not yet implement cryptographic signatures, C2PA metadata, watermarking, or automated checksum manifests. It defines the conceptual boundary and minimum fields.

## Revision label

Revise if:

- repository artifacts receive formal claim IDs;
- MC exports carry embedded metadata;
- C2PA or other provenance tooling is implemented;
- care-support summaries gain structured verification cards;
- regulations define required provenance display formats.
