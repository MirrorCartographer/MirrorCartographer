# Public-Safe Mirror Cartographer Research Note: Boundary Debt Register

Date: 2026-07-01

## Status labels

- Source status: synthesized from available Mirror Cartographer File Library materials, saved architecture context, and visible GitHub commit history.
- Claim status: architecture finding, product requirement, and evaluation criterion; not a claim of clinical efficacy, diagnosis, therapy, personal truth, or objective symbolic authority.
- Privacy status: public-safe abstraction. Personal, household, health, animal-care, financial, location, relationship, credential, and raw transcript details are intentionally excluded.
- Missingness: no production telemetry, no external audit, no longitudinal validation cohort, no formal threat model, and no user-study evidence yet.
- Revision reason: prior GitHub mind passes established source boundaries, provenance gates, continuity containers, evidence routing, abstraction audits, and private-to-public ledgers. This pass adds the missing operational layer: tracking boundary failures as debt until they are resolved.

## Public-safe finding

Mirror Cartographer needs a **Boundary Debt Register**.

Boundary debt is any unresolved place where a reflection, artifact, schema, UI element, export, or memory object does not yet clearly say what kind of claim it is, where it came from, what it may influence, what it cannot prove, what is missing, and whether it is safe to persist or publish.

The project already treats cognition as structured evolving state rather than disposable text. The risk is that state can accumulate faster than its evidence, privacy, and safety labels. When that happens, the system becomes more continuous but not necessarily more trustworthy.

The register makes that mismatch visible.

## Why this is different from a normal bug list

A bug list says: something is broken.

A boundary debt register says: something may still function, but its claim boundary is under-specified.

Examples of public-safe boundary debt categories:

| Debt category | Meaning | Resolution target |
|---|---|---|
| Source debt | The artifact does not identify whether a claim came from user input, model inference, public source, symbolic tradition, or creative synthesis. | Add source status before reuse. |
| Claim debt | The artifact blurs fact, inference, interpretation, speculation, requirement, or research question. | Add claim status and downgrade unsupported claims. |
| Privacy debt | The artifact is abstracted but not proven public-safe. | Run abstraction audit before publication. |
| Missingness debt | The artifact sounds complete but does not state what evidence is absent. | Add explicit missingness field. |
| Revision debt | The artifact changed without saying why. | Add revision reason. |
| Mode debt | Canonical, Reflective, and Mythopoetic material are mixed without visible boundaries. | Route through mode labels. |
| Evaluation debt | The artifact describes a capability but has no test. | Add synthetic fixture, rubric, or benchmark criterion. |
| Continuity debt | A repeated pattern is treated as stronger than it is. | Mark recurrence as signal, not proof. |

## Product requirement

Add a register file or table that every durable MC artifact can append to when a boundary is uncertain.

Minimum fields:

1. `artifact_id`
2. `artifact_path_or_context`
3. `debt_category`
4. `source_status`
5. `claim_status`
6. `privacy_status`
7. `missingness`
8. `risk_if_unresolved`
9. `resolution_action`
10. `revision_reason`
11. `owner_or_runtime_component`
12. `status`: open, downgraded, resolved, excluded, or needs review

## Evaluation criterion

A reflection system should not pass evaluation only because its outputs are resonant, beautiful, or coherent.

It should also pass a boundary debt check:

- Does every durable claim have a source status?
- Does every interpretation have a claim status?
- Does every export have a privacy status?
- Does every incomplete artifact state what is missing?
- Does every revision say why it changed?
- Does every public artifact survive without private context?
- Does every user-confirmed pattern remain separate from external proof?

## Public-safe implementation plan

1. Create `mind/registers/boundary-debt-register.md` as the standing ledger.
2. Add a template row for each debt category.
3. Add an `OPEN_BOUNDARY_DEBT` section to future research notes when uncertainty remains.
4. Add a rule: any public-facing MC artifact with open privacy debt cannot be published until resolved, downgraded, or excluded.
5. Add a rule: any capability claim with open evaluation debt must be labeled as an implementation plan or research question, not as a proven feature.
6. Add a periodic review pass that converts repeated debt into product requirements.

## Privacy-safe index entry

- Index label: `boundary-debt-register`
- Public summary: Tracks unresolved source, claim, privacy, missingness, revision, mode, evaluation, and continuity boundary problems.
- Private-source dependency: none required for public use.
- Publishability: public-safe.
- Evidence level: architecture rationale + internal consistency with existing MC source-boundary work.

## Operating line

**Continuity without boundary review becomes debt. MC should carry the debt visibly until it is resolved, downgraded, or excluded.**
