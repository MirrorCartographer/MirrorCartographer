# PRD: Temporal Validity Context Ledger

## Summary

Mirror Cartographer needs a product layer that prevents stale, superseded, or unknown-age context from silently shaping current reflections, implementation plans, public artifacts, or evaluation claims.

## Source status

- Public repo context: MC already exposes source status, claim status, evidence boundary, grounded next step, overreach checks, and user feedback loop.
- File Library context: MC implementation materials define Entry → Field → Reflection → Resonance → Return, mode rules, contradiction logs, trajectory nodes, and false-progress checks.
- External research context: current memory-agent/RAG research identifies memory retrieval as a trust boundary and stale-fact error as a structural risk.

## Claim status

Product requirement proposal. Ready for prototype design. Not yet validated by user study or production telemetry.

## Privacy status

Public-safe. No personal, household, health, animal-care, financial, location, relationship, credential, or raw transcript details are included.

## Problem

A continuity system can become unsafe or misleading when it treats all remembered context as equally alive. MC is explicitly designed to preserve continuity, but continuity without temporal governance can create drift:

- old user feedback may override newer correction;
- symbolic recurrence may be treated as current truth;
- requirements may persist after design revision;
- private context may keep shaping public artifacts after it should be retired;
- stale claims may be cited because they are semantically close.

## Product goal

Before a retrieved context item can influence output, MC should decide whether it is temporally valid for the present task.

## User-facing behavior

When relevant, the interface should display short labels such as:

- `Current context`
- `Historical only`
- `Superseded by newer correction`
- `Unresolved conflict`
- `Age unknown`
- `Private source: abstracted only`

The user should be able to mark an interpretation as:

- still true
- partly true
- old but useful
- no longer true
- too private for reuse
- wrong / remove influence

## System behavior

1. Retrieve candidate context.
2. Classify source boundary and privacy status.
3. Check timestamp, confirmation, contradiction, and revision metadata.
4. Assign temporal-validity status.
5. Block or downgrade stale/superseded context.
6. Carry the status into claim transport and release readiness.
7. Update the ledger after user feedback.

## Acceptance criteria

The layer passes if:

- semantically relevant but stale material is not treated as current;
- unknown-age context triggers a missingness label;
- superseded context is visible as lineage but blocked from present authority;
- user correction can retire a context item;
- public artifacts can describe revision lineage without exposing private source details;
- each influenced claim carries source status, claim status, privacy status, missingness, and revision reason.

## Non-goals

- No diagnosis, therapy, medical/veterinary advice, legal/financial advice, or objective truth determination.
- No raw transcript publication.
- No private identity reconstruction.
- No claim that temporal validity equals factual correctness.

## Release gate

Do not ship as public-facing behavior until the following fixture classes pass:

1. Old symbolic association, still meaningful but not current.
2. New correction contradicts old interpretation.
3. Unknown timestamp but high semantic similarity.
4. Private context useful for architecture but blocked for public artifact.
5. External source superseded by newer external source.
6. User explicitly retires a recurring motif.

## Boundary phrase

**The map should remember the old road without routing the user onto it by default.**
