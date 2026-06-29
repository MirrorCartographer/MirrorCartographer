# Exit Authority

## Core claim

A governed AI-assisted system must define not only who can approve use, but who can stop, reverse, decommission, or escalate use when evidence, risk, context, or human welfare changes.

## Why this exists

Recent repository concepts have focused on trace quality, action authority, accountability boundaries, and intervention boundaries. The missing governance primitive is exit authority: the power to interrupt continuation.

A system can have strong evidence and still become unsafe if nobody has a clear right or duty to stop it.

## Relation to existing GitHub Mind artifacts

- Evidence Chain asks: what supports the claim?
- Claim Custody Chain asks: where has the claim traveled?
- Action Authority Ladder asks: what may this claim do?
- Intervention Boundary Matrix asks: what kind of intervention is permitted?
- Trace Sufficiency Test asks: is the trace strong enough for the requested action?
- Exit Authority asks: who can stop, reverse, decommission, or escalate this action path?

## Minimal structure

Each consequential artifact should include:

1. Stop condition
2. Human override path
3. Escalation owner
4. Reversal condition
5. Decommission condition
6. Audit record requirement
7. Revision trigger

## Public-safe example

Claim: AI-generated care documentation can help reduce administrative load.

Exit authority fields:

- Stop condition: outputs contain fabricated, contradictory, or unsupported details.
- Human override path: trained human reviewer rejects or rewrites the generated record.
- Escalation owner: responsible professional or institution, not the AI system.
- Reversal condition: evidence shows downstream harm, overreliance, or systematic inaccuracy.
- Decommission condition: repeated unsafe documentation failures or inability to audit errors.
- Audit record requirement: original input, AI draft, human edits, reviewer identity/role, timestamp, and final record.
- Revision trigger: new safety guidance, incident report, regulatory update, or domain-specific failure pattern.

## Source labels

- Source: Multi-source synthesis from current AI governance, healthcare-agent lifecycle management, financial AI risk governance, AI assurance, and social-care documentation reporting.
- Claim: Exit authority is a required governance primitive for public-safe AI-assisted reasoning systems.
- Privacy: Public-safe. No personal data. No private medical facts. No confidential repository data.
- Missingness: Needs implementation testing across actual Mirror Cartographer artifacts and non-healthcare domains.
- Revision: Initial version.
- Confidence: Medium-high.
- Evidence maturity: Draft / use as governance primitive with review.
- Action authority: Documentation and design review only; not clinical, legal, or regulatory advice.

## Fresh public sources

- Reuters, June 24 2026: RBI proposed AI/ML risk-management rules for banks requiring ongoing risk assessment, independent validation, human oversight for automated decisions, corrective controls, limits, or decommissioning when excessive risk is detected.
- Chandra Prakash, Mary Lind, Avneesh Sisodia, January 22 2026: Agentic AI Governance and Lifecycle Management in Healthcare proposes layers including identity registry, PHI-bounded context, runtime policy enforcement, kill-switch triggers, lifecycle management, decommissioning, credential revocation, and audit logging.
- Guardian, February 11 2026: reporting on Ada Lovelace Institute findings that AI social-work transcription and summarization tools can create harmful errors in official care records, requiring stronger training, checking, and oversight.
- Tom Bisson et al., March 14 2026: Six Interventions for Responsible and Ethical Implementation of Medical AI Agents proposes explicit human override conditions and oversight tools.
- Chitra Badagi et al., May 22 2026: AI Assurance testing strategy frames enterprise AI assurance as continuous risk reduction rather than strict correctness verification.

## Decision reversal threshold

Revise this artifact if future evidence shows that exit authority is already fully covered by an existing MC primitive without loss, or if implementation reveals that exit authority should be split into separate stop, reversal, and decommission primitives.
