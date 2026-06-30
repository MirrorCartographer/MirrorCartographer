# Evidence Map Run 15 — Claim Retirement / Downgrade Discipline

Date: 2026-06-30

## Claim tested

**C-CLAIM-RETIRE-01:** Mirror Cartographer / GitHub Mind claims should be actively downgraded, retired, or marked stale when evidence quality is insufficient, contradicted, non-reproducible, or context-bound.

## Why this weak point matters

Recent Evidence Engine runs have built many governance requirements. The weak point is no longer only whether a claim can be supported by external literature. The weak point is whether the repository can **stop believing its own artifacts** when the evidence does not hold.

A repository that only accumulates support becomes a persuasion archive. A repository that records downgrades, contradiction, staleness, failed replication, and retirement becomes a governance system.

## Evidence searched

Search intent: find primary or high-quality sources on AI lifecycle governance, versioning, transparent evidence reporting, reproducibility, incident learning, and artifact validation.

Sources used:

1. NIST AI Risk Management Framework 1.0, NIST AI 100-1, January 2023. https://doi.org/10.6028/NIST.AI.100-1
2. NIST AI RMF public framework page, current page noting AI RMF 1.0 revision and 2026 updates. https://www.nist.gov/itl/ai-risk-management-framework
3. PRISMA 2020 statement materials and checklist page. https://www.prisma-statement.org/prisma-2020
4. ACM Artifact Review and Badging policy page. https://www.acm.org/publications/policies/artifact-review-badging
5. McGregor, S. Preventing Repeated Real World AI Failures by Cataloging Incidents: The AI Incident Database. arXiv:2011.08512, 2020. https://arxiv.org/abs/2011.08512
6. Richards, I., Benn, C., Zilka, M. From Incidents to Insights: Patterns of Responsibility following AI Harms. arXiv:2505.04291, 2025. https://arxiv.org/abs/2505.04291

## Evidence found — facts

### Fact 1 — NIST treats AI risk management as lifecycle work, not one-time proof.

NIST states the AI RMF is intended to improve trustworthiness considerations in the design, development, use, and evaluation of AI systems. The RMF describes AI risks as socio-technical and context-dependent, and says risks may emerge from technical properties, social context, operators, and system interactions.

NIST also describes the AI RMF itself as a living document with review, versioning, and change tracking. This supports version-controlled claim status rather than static declarations.

### Fact 2 — NIST separates governance, mapping, measurement, and management.

NIST AI RMF Core functions are GOVERN, MAP, MEASURE, and MANAGE. GOVERN is cross-cutting, while MAP, MEASURE, and MANAGE apply to specific contexts and lifecycle stages.

For MC, this means a claim cannot remain upgraded solely because it was once mapped. It also needs measurement and management behavior: monitoring, downgrade triggers, and decision consequences.

### Fact 3 — PRISMA 2020 supports transparent review structure, checklists, and flow diagrams for original and updated reviews.

PRISMA 2020 includes a statement paper, checklists, expanded checklists, abstract checklist, and flow diagrams for original and updated reviews. This supports explicit reporting of source search, inclusion/exclusion, update status, and evidence boundaries.

For MC evidence maps, this does not mean every artifact must become a formal systematic review. It does support a lightweight equivalent: document the search scope, what was included, what was excluded, and whether the claim is new, updated, stale, downgraded, or retired.

### Fact 4 — ACM distinguishes artifact availability/evaluation from result validation.

ACM artifact badging separates artifact evaluation, artifact availability, and results validation. It also distinguishes repeatability, reproducibility, and replicability, and says result validation requires independent success within an acceptable tolerance.

For MC, this means a well-written evidence map is not the same as a validated claim. A claim can have a documented artifact while still remaining unvalidated.

### Fact 5 — AI incident database research supports learning from failure, but also shows incident evidence has limitations.

McGregor argues that AI systems need collective memory of failures to avoid repeated harms. Richards, Benn, and Zilka add that the AI Incident Database is useful for social and accountability learning, but media-reporting dependence limits its value for implementation-specific technical learning.

For MC, this supports an internal negative-result ledger while also warning against overreading external incident databases as direct proof of MC behavior.

## Evidence found — inference

### Inference 1 — MC needs a formal claim-retirement protocol.

The sources support lifecycle governance, transparent evidence updating, artifact/result distinction, and failure learning. Together they justify a repository rule: claims must have downgrade and retirement pathways.

This is an inference, not a directly proven result.

### Inference 2 — A claim-status registry is more important than more isolated evidence maps.

The accumulated evidence maps are useful, but without a registry that can mark claims as stale, contradicted, failed, superseded, or retired, the system risks treating every artifact as additive support.

This is a design inference from NIST lifecycle governance, PRISMA update structure, and ACM result-validation distinctions.

### Inference 3 — Claim retirement should be considered a success behavior, not a failure.

A repository that downgrades a weak claim is behaving more scientifically than one that preserves confidence for identity, branding, or narrative continuity. This follows from the evidence but is a governance interpretation.

## What the evidence does NOT prove

- It does not prove Mirror Cartographer currently performs responsible claim retirement.
- It does not prove MC evidence maps are reproducible.
- It does not prove MC claims are empirically valid.
- It does not prove a claim registry will improve user decisions.
- It does not prove symbolic or emotional mapping improves evidence quality.

## Claim-status update

C-CLAIM-RETIRE-01 status:

**Supported governance requirement; implementation unvalidated.**

Confidence level:

**Moderate for the governance need. Low for MC implementation performance.**

Rationale:

External sources strongly support lifecycle governance, transparent reporting, artifact/result distinction, versioning, and failure learning. None validate MC’s specific claim lifecycle process.

## New evaluation criterion

### RETIRE-GATE-01 — Claim Downgrade / Retirement Gate

A claim must be downgraded, marked stale, or retired if any of the following conditions are met:

1. **No direct MC test:** The claim has external rationale but no test on actual MC artifacts.
2. **Failed reproducibility:** Independent or repeated review cannot recover the same claim, status, or evidence interpretation within the declared tolerance.
3. **Construct mismatch:** The test measures polish, readability, or compliance instead of the construct the claim names.
4. **Context escape:** A claim proven in one domain is being used in another domain without transfer evidence.
5. **Overclaim language:** The artifact uses proven, validated, safe, diagnostic, therapeutic, hire-worthy, or audit-ready language without matching evidence.
6. **Contradictory evidence:** A high-quality source or internal test materially weakens the claim and has not been incorporated.
7. **Staleness:** The source base or implementation has changed enough that the prior evidence no longer supports current use.
8. **No downstream consequence:** A failed gate produces no visible status change, revision, or retirement.

## Required status labels

Use these labels in the master claim registry:

- PROPOSED — named but not yet supported.
- EXTERNALLY SUPPORTED RATIONALE — supported by external literature, not tested in MC.
- IMPLEMENTATION UNVALIDATED — design exists, but MC behavior not tested.
- DIRECTLY TESTED — tested on MC artifacts with recorded method.
- PARTIALLY SUPPORTED — some tests pass; scope remains limited.
- CONTRADICTED — evidence materially conflicts with the claim.
- STALE — evidence or implementation context is outdated.
- RETIRED — claim should no longer be used except as history.
- SUPERSEDED — replaced by a stronger, narrower, or more accurate claim.

## Falsification checklist

A reviewer should try to falsify each claim by asking:

1. What would make this claim false?
2. What stronger competing explanation exists?
3. Is the evidence external only, or does it test actual MC behavior?
4. Is the claim using words stronger than the evidence allows?
5. Is the claim transferable across domains, or only local?
6. Are failed tests visible?
7. Did the claim survive independent review?
8. Has any new source or system change made the claim stale?
9. Can the claim be retired without damaging the identity of the project?
10. What exact downstream behavior changes if this claim fails?

## Test plan

### RETIRE-GATE-RUN-01

Sample:

- Last 15 Evidence Engine maps.
- Any active claim IDs referenced in those maps.
- Any claim marked supported, validated, operational, audit-ready, or externally reviewable.

Procedure:

1. Extract every claim ID and claim sentence.
2. Assign current status using the required labels above.
3. Mark evidence type: external literature, internal artifact, simulation, direct MC test, independent reviewer test, user outcome, or unknown.
4. Apply RETIRE-GATE-01.
5. Downgrade any claim with no direct MC test from implementation language to governance/design language.
6. Mark stale any claim whose sources or implementation context cannot be reconstructed.
7. Retire any claim that fails construct definition and cannot be narrowed.
8. Create a retirement ledger entry for each downgrade or retirement.

Pass condition:

- 100% of sampled claims receive a status label.
- 100% of claims using strong language have direct-test evidence or are downgraded.
- At least one real downgrade is expected; if no claim is downgraded, the audit must justify why.

Fail condition:

- Any claim remains upgraded without direct evidence.
- Any failed gate produces no status change.
- Any retired claim continues to appear in public-facing language as active.

## Immediate implementation requirement

Create or update:

`mind/evaluation/master-claim-status-registry.md`

Minimum columns:

- Claim ID
- Claim sentence
- Current status
- Evidence type
- Source count
- Direct MC test count
- Last reviewed date
- Downgrade trigger
- Next proof required
- Public-use wording allowed

## Next proof needed

Run `RETIRE-GATE-RUN-01` on the last 15 Evidence Engine maps and produce a real downgrade ledger. The proof is not complete until at least one claim is narrowed, downgraded, marked stale, or explicitly justified as remaining active.

## Bottom line

The strongest next move is not another supportive evidence map. It is a visible mechanism that lets Mirror Cartographer lose confidence correctly.
