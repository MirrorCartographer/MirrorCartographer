# Public-Safe Contradiction Reconciliation Ledger

Date: 2026-07-04
Status: research finding
Privacy class: public-safe architecture note

## Core finding

Mirror Cartographer needs a **Public-Safe Contradiction Reconciliation Ledger**.

Operating line: **A public-safe system should not erase contradictions when it sanitizes them; it should preserve the fact that a contradiction exists, what boundary it touches, and what kind of resolution is still missing.**

## Why this exists

Prior public-safe research notes have strengthened claim gates, maturity ladders, redaction tests, demo disclosure, backlog indexing, and mode transitions. Those controls reduce leakage and overclaiming, but they create a secondary risk: public artifacts can become internally inconsistent without a visible reconciliation layer.

Examples of contradiction types that can remain public-safe when abstracted:

- one artifact frames a capability as a requirement while another frames it as already implemented;
- one artifact permits public demo language while another requires stronger disclosure;
- one artifact treats a concept as product architecture while another treats it as research speculation;
- one artifact demotes a claim for privacy reasons while another later reintroduces the same claim through safer-sounding language;
- one artifact records a boundary, but a later implementation plan creates a path that would cross it.

The ledger does not expose raw source material. It records the public-safe shape of disagreement so future work can resolve, preserve, or explicitly defer it.

## Source status

- Source class: mixed private-context synthesis plus GitHub knowledge-structure inspection.
- Private context use: architecture understanding only.
- Publishable source material: abstracted method, source-boundary note, product requirement, evaluation criterion, and implementation plan.
- Non-publishable source material: personal, household, health, animal-care, financial, location, relationship, credential, and raw transcript details.
- GitHub status: repository access available; file added as a public-safe research note inside the private project repository.

## Claim status

- Confirmed: Mirror Cartographer already uses explicit boundary language around source status, epistemic status, privacy status, and claim gating.
- Inferred: as the public-safe research corpus grows, contradictions between artifacts become likely unless tracked as first-class objects.
- Proposed: add a ledger schema and review workflow before turning research notes into public copy, product requirements, demos, grant language, or implementation tickets.
- Not claimed: this note does not claim that a contradiction has caused harm, that current artifacts are invalid, or that any private source should be exposed to resolve conflicts.

## Privacy status

- Public-safe: yes, if kept at architecture/method level.
- Raw transcript safe: no.
- Personal detail safe: no.
- Health/animal/household/financial/location/relationship/credential safe: no.
- Reidentification risk: low when contradiction entries use abstract artifact IDs and public-safe summaries only.
- Required guard: never use a contradiction ledger as a shortcut to restate the private material that created the contradiction.

## Missingness

- Missing inventory: a complete machine-readable index of all existing MC research notes and implementation files.
- Missing links: stable IDs connecting research notes, backlog items, demo components, and public language drafts.
- Missing policy: a required reconciliation step before promotion from research note to public artifact.
- Missing test: automated detection of status drift, such as “implemented” language appearing near items previously labeled speculative.
- Missing owner: no explicit maintainer role for contradiction triage.

## Proposed ledger schema

Each contradiction entry should contain:

1. `contradiction_id`
2. `detected_date`
3. `source_artifact_a`
4. `source_artifact_b`
5. `public_safe_summary`
6. `source_status_a`
7. `source_status_b`
8. `claim_status_a`
9. `claim_status_b`
10. `privacy_status`
11. `boundary_touched`
12. `risk_if_unresolved`
13. `allowed_resolution_modes`
14. `selected_resolution_mode`
15. `revision_reason`
16. `remaining_missingness`
17. `review_status`

## Allowed resolution modes

- **Preserve:** keep both versions because they describe different modes, audiences, or maturity levels.
- **Demote:** lower one or both claims to research/speculation/requirement status.
- **Split:** separate product, research, interface, demo, and mythopoetic language into different artifacts.
- **Retire:** mark a stale statement as superseded without deleting its lineage.
- **Escalate:** require human review because the conflict touches privacy, safety, consent, or public claims.
- **Defer:** leave unresolved but record what evidence or implementation proof is missing.

## Evaluation criteria

The ledger is working if:

- public artifacts can disagree without hiding the disagreement;
- newer files cannot silently overwrite older boundary decisions;
- every contradiction has a source status, claim status, privacy status, missingness note, and revision reason;
- promotion from research to product/demo/public language requires checking open contradictions;
- contradiction summaries remain useful without exposing private source material;
- reviewers can distinguish unresolved architecture tension from implementation failure.

## Implementation plan

1. Create `mind/indexes/public-safe-artifact-index.md` if it does not already exist.
2. Add stable IDs for research notes, public copy drafts, requirement files, interface specs, and demo plans.
3. Create `mind/governance/contradiction-reconciliation-ledger.md` as the live ledger.
4. Add a lightweight contradiction review checklist to the claim gate workflow.
5. Add automated text checks for drift terms: `implemented`, `proven`, `canonical`, `public`, `diagnostic`, `therapeutic`, `safe`, `private`, `redacted`, `synthetic`, and `speculative`.
6. Require a revision reason whenever a public-safe artifact changes the maturity, privacy, source, or claim status of a prior idea.

## Meaningful revision reason

This finding extends the existing public-safe research sequence from **claim gating and redaction safety** into **conflict governance**. The revision is meaningful because a growing public-safe architecture can become inaccurate not only by leaking private material or overclaiming evidence, but also by allowing sanitized artifacts to contradict one another without a visible reconciliation path.
