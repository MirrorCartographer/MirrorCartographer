# Composite Reconstruction Risk Ledger

## Core finding

Mirror Cartographer needs a **Composite Reconstruction Risk Ledger**.

## Operating line

**A fragment can be public-safe alone and still become private when joined with other fragments.**

## Why this exists

Existing MC governance work separates source boundaries, claim status, release gates, mode/claim separation, context gradients, redaction, interpretation budgets, and artifact release readiness. The remaining gap is combinatorial privacy: independent abstractions may be harmless one at a time, but repeated publication can let an observer reconstruct private biography, household context, health context, care context, financial pressure, location traces, relationship context, credentials, or raw conversation identity.

This ledger treats privacy as an aggregation property, not only a per-file property.

## Source status

- **Private-context-informed:** yes, only at the architectural pattern level.
- **File-backed:** yes, from public-safe MC implementation and atlas materials describing uncertainty boundaries, mode rules, local-first privacy, claim/evidence rules, and source limitation notes.
- **GitHub-reviewed:** partial; repository visibility and target repo were checked before write. Full code search indexing was not available for the installed repos, so duplicate detection is best-effort.
- **External-web-backed:** no. This is a product governance requirement derived from available MC materials, not an external factual claim.

## Claim status

- **Claim type:** product governance requirement.
- **Truth strength:** bounded design inference.
- **Not claiming:** that an actual privacy leak occurred; that prior artifacts are unsafe; that this fully solves privacy risk.
- **Claim boundary:** MC should evaluate whether multiple public-safe artifacts, indexes, examples, diagrams, release notes, and research logs create a combined re-identification or biography-reconstruction path.

## Privacy status

- **Public-safe:** yes.
- **Contains personal details:** no.
- **Contains household details:** no.
- **Contains health or animal-care details:** no.
- **Contains financial, location, relationship, credential, or raw transcript details:** no.
- **Allowed publication class:** abstracted method / evaluation criterion / implementation plan.

## Missingness

- No automated scanner currently calculates composite reconstruction risk across the repository.
- No manifest currently maps every public artifact to redaction class, source boundary, and reconstruction adjacency.
- No test harness currently attempts adversarial reconstruction from public-only materials.
- No release gate currently blocks publication because of aggregate risk across previously safe artifacts.

## Revision reason

Prior MC gates evaluate whether an artifact is safe, grounded, claim-bounded, and release-ready. This addition evaluates whether the *set* of artifacts is still safe after accumulation.

## Ledger fields

Each public artifact should eventually carry these fields:

| Field | Purpose |
|---|---|
| artifact_id | Stable file/path identifier. |
| source_boundary_class | Public, private-context-informed, file-backed, generated, external-cited, or mixed. |
| privacy_class | Public-safe, internal-only, user-return-only, or blocked. |
| claim_class | Fact, design inference, speculative frame, requirement, test, or research question. |
| reconstruction_keys | Abstract categories that could help reconstruct private source context if repeated. |
| adjacency_risk | Whether this artifact becomes riskier when paired with other artifacts. |
| cumulative_exposure_score | Low / medium / high aggregate exposure estimate. |
| release_decision | Publish, revise, hold, user-only, or block. |
| revision_reason | Why the artifact changed, was held, or was allowed. |

## Evaluation criteria

A public artifact fails this ledger if any of the following are true:

1. It does not contain private details directly, but points strongly to a private source when combined with prior artifacts.
2. It repeats the same abstracted source shape often enough to reveal a hidden biography pattern.
3. It exposes a sequence of decisions that could identify the private origin of a method.
4. It uses synthetic examples that are too structurally close to private events.
5. It publishes source-boundary notes that accidentally reveal more than the artifact itself.
6. It lets a reader infer sensitive domains through absence, sequence, timing, or unusually specific category combinations.

## Implementation plan

1. Add a `public_artifact_manifest.md` or machine-readable manifest under `mind/indexes/`.
2. Backfill all `mind/research/` entries with source boundary, claim class, privacy class, and reconstruction adjacency.
3. Add a pre-publication checklist: direct privacy, indirect privacy, composite privacy, claim status, evidence status, and destination fit.
4. Create synthetic adversarial review prompts that attempt to reconstruct private origin from public artifacts only.
5. Treat failures as revision triggers, not shame events: revise, abstract further, merge categories, remove sequencing, or hold.

## Research questions

- What minimum metadata lets MC preserve provenance without exposing provenance?
- When does repetition of public-safe abstractions become identifying?
- How should MC distinguish useful continuity from cumulative leakage?
- Can synthetic examples be tested for structural distance from private source patterns?
- Should public indexes intentionally coarsen dates, order, and category names to reduce reconstruction risk?

## Public-safe index tag

`privacy-governance/composite-risk/public-artifact-manifest/reconstruction-resistance`
