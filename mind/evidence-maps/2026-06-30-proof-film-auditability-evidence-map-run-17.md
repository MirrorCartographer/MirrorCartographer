# Evidence Map Run 17 — Proof Film Auditability Boundary

Date: 2026-06-30
Claim ID: C-PROOF-FILM-01
Status before: proposed demonstration artifact / rhetorically promising, implementation unvalidated
Status after: supported audit-interface design requirement; evidentiary value unvalidated until review gates pass

## Claim tested

Mirror Cartographer's proposed "proof film" can function as audit evidence for MC claims rather than merely as a persuasive story about MC.

## Conservative finding

A proof film can be useful as an audit interface only when it binds claim, source, artifact, provenance, scoring rule, uncertainty, negative evidence, and independent review path into one inspectable object. A proof film does not become evidence merely because it is emotionally compelling, visually coherent, or narratively satisfying.

## Source corpus

Primary / high-quality sources reviewed:

1. NIST AI Risk Management Framework page, retrieved 2026-06-30. URL: https://www.nist.gov/itl/ai-risk-management-framework
2. W3C PROV-Overview, Working Group Note, 2013-04-30. URL: https://www.w3.org/TR/prov-overview/
3. ACM Artifact Review and Badging policy, current version. URL: https://www.acm.org/publications/policies/artifact-review-and-badging-current
4. PRISMA 2020 statement page. URL: https://www.prisma-statement.org/prisma-2020
5. Barnett, Griffiths, and Hawkins, "A pragmatic account of the weak evidence effect," 2021 preprint, used only as cautionary support for persuasive-goal effects, not as a governance standard. URL: https://arxiv.org/abs/2112.03799

## Facts from sources

### NIST AI RMF

NIST describes the AI RMF as a framework to manage AI risks to individuals, organizations, and society and to improve the incorporation of trustworthiness considerations into AI system design, development, use, and evaluation. This supports treating MC proof artifacts as lifecycle risk/evaluation objects, not as one-time promotional claims.

### W3C PROV

W3C defines provenance as information about entities, activities, and people involved in producing a thing, usable for assessments of quality, reliability, and trustworthiness. PROV also emphasizes identifying objects, attribution, processing steps, provenance of provenance, reproducibility, versioning, procedures, and derivation. This supports requiring proof-film segments to expose source lineage and transformation steps.

### ACM artifact badging

ACM separates artifact availability, artifact evaluation, and results validation. It states that artifacts can be available without being formally evaluated, and that results validation requires main results to be obtained by people or teams other than the authors. This directly argues against treating a published proof film as validation by itself.

### PRISMA 2020

PRISMA is a reporting guideline for transparent evidence synthesis. Its relevance here is structural: a reviewable evidence product should state search/reporting methods, inclusion/exclusion logic, and limitations. It does not prove MC, but supports making evidence collection visible and repeatable.

### Persuasive-goal caution

Research on weak evidence and persuasive contexts suggests that audiences may reason differently when they believe a communicator is trying to persuade them. This is weaker support than the governance standards above, but it reinforces the need to distinguish audit evidence from advocacy.

## Fact / inference separation

Facts:

- Provenance standards exist for representing entities, activities, agents, derivation, versioning, and reproducibility.
- ACM distinguishes artifact existence/availability from artifact evaluation and results validation.
- NIST supports lifecycle risk management and evaluation of AI systems.
- PRISMA supports transparent reporting structure for evidence synthesis.

Inferences applied to MC:

- A proof film should be treated as an evidence-navigation layer, not as proof by itself.
- MC should require a proof film to expose enough provenance and scoring detail that an outside reviewer can re-check the claim path.
- MC should not upgrade a claim solely because the proof film is clear, moving, beautiful, or convincing.
- MC proof films need anti-persuasion controls because the format is likely to make weak evidence feel stronger than it is.

Unsupported / not yet proven:

- That MC's proof-film format improves reviewer understanding.
- That MC proof films improve reviewer agreement.
- That MC proof films reduce overclaiming.
- That viewers can distinguish evidence strength from narrative force after viewing one.

## Claim status update

C-PROOF-FILM-01 should be rewritten:

Old claim:
"The proof film can prove MC's architecture and value."

Replacement claim:
"A proof film can serve as a structured audit interface for MC claims if it preserves provenance, separates fact from inference, exposes scoring criteria, includes negative evidence, and links to independent review paths. It should not be treated as validation until external reviewers reproduce or confirm the relevant results."

New status:
Supported audit-interface design requirement; implementation unvalidated.

## Evaluation criterion: PROOF-FILM-GATE-01

A proof film passes only if all required fields are present and reviewable.

Required fields:

1. Claim text is frozen before film construction.
2. Claim status before and after the film is explicit.
3. Every factual assertion links to a source or repository artifact.
4. Each inference is marked as inference, not fact.
5. The artifact lineage is visible: source input, transformation, output, editor/model role, timestamp, and version.
6. The scoring rubric is visible before the viewer reaches the conclusion.
7. Negative evidence and alternative explanations are shown before the final status label.
8. The proof film states what result would downgrade or retire the claim.
9. The film distinguishes artifact availability from artifact evaluation and result validation.
10. At least one reviewer can reproduce the claim-status decision from linked materials without relying on the film's emotional/narrative framing.

Pass threshold:
- 10/10 required fields present.
- 2 independent reviewers can identify the claim, evidence, inference, limitation, and downgrade condition with at least 80% agreement.

Automatic fail conditions:

- Uses cinematic/emotional force as evidence strength.
- Upgrades claim status without an explicit scoring rule.
- Omits negative evidence or alternative explanations.
- Hides source lineage behind summary language.
- Presents artifact existence as validation.
- Uses AI-generated synthesis without provenance disclosure.

## Falsification checklist

The proof-film concept should be downgraded if:

- Reviewers remember the story but cannot reconstruct the evidence chain.
- Reviewers overestimate claim strength compared with the underlying evidence map.
- Reviewers disagree on which claim was tested.
- Reviewers cannot tell what was fact, inference, symbol, or hypothesis.
- The same evidence map leads to a different status decision when viewed outside the film.
- The film causes stronger belief without improved source recall or criterion accuracy.

## Next proof needed

Run PROOF-FILM-GATE-01 on one existing MC claim using two formats:

A. evidence map only
B. proof film plus evidence map

Measure:

- claim identification accuracy
- fact/inference separation accuracy
- source recall
- reviewer agreement on claim status
- ability to name downgrade conditions
- overconfidence delta before vs after viewing

Minimum useful sample:
- 3 reviewers
- 1 claim
- 2 formats

Do not upgrade C-PROOF-FILM-01 beyond design requirement until the proof-film condition improves audit accuracy without increasing unsupported confidence.
