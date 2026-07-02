# Evidence Map: GitHub Commit History vs. Audit Trail Boundary

Date: 2026-07-02
Run: Evidence Engine / run 66
Status: claim narrowed; implementation unvalidated

## Claim tested

C-GITHUB-AUDIT-TRAIL-01: "Because Mirror Cartographer evidence maps are committed to GitHub, the GitHub mind has a sufficient audit trail."

## Why this is a weak point

The current GitHub mind is increasingly using evidence maps, claim-status updates, and test plans as if they form a governance record. That is useful, but it creates a risk of overclaiming. A Git commit records a file change in a repository. It does not, by itself, prove that the evidence was independently reviewed, that the cited sources directly support the claim, that the authoring process was accurate, that old evidence was retained, or that no sensitive/private data entered the record.

## Evidence found

### Source 1: NIST AI Risk Management Framework

Source: NIST, AI Risk Management Framework page, current page accessed 2026-07-02.
URL: https://www.nist.gov/itl/ai-risk-management-framework

Relevant finding: NIST describes the AI RMF as a framework for incorporating trustworthiness considerations into the design, development, use, and evaluation of AI products, services, and systems. NIST frames AI risk management as governance, mapping, measurement, and management activity rather than simple documentation accumulation.

Interpretation for MC: A GitHub evidence map can support governance documentation, but it is not equivalent to measured trustworthiness or validated evidence.

### Source 2: NIST AI 600-1, Generative AI Profile

Source: NIST AI 600-1, Artificial Intelligence Risk Management Framework: Generative Artificial Intelligence Profile, July 2024.
URL: https://doi.org/10.6028/NIST.AI.600-1

Relevant finding: NIST identifies Governance, Content Provenance, Pre-deployment Testing, and Incident Disclosure as primary generative-AI considerations. It also describes risks including confabulation, information integrity, data privacy, human-AI configuration, and value-chain/component integration. The profile states that GAI risks can arise across lifecycle stages and that some risks are speculative or uncertain while others have empirical evidence.

Interpretation for MC: A GitHub record should separate claim status, provenance, pre-deployment test status, and incident/failure records. A commit is not enough unless these fields are represented and maintained.

### Source 3: NIST SP 800-218 Secure Software Development Framework

Source: NIST SP 800-218, Secure Software Development Framework Version 1.1, February 2022.
URL: https://csrc.nist.gov/pubs/sp/800/218/final

Relevant finding: NIST SSDF recommends a core set of secure software development practices integrated across the software development lifecycle. It emphasizes reducing vulnerabilities, mitigating impact of unresolved vulnerabilities, addressing root causes, and providing a common vocabulary for software producers and consumers.

Interpretation for MC: Repository records should connect evidence claims to software/security practices: review, vulnerability/failure tracking, root-cause updates, and consumer-readable status. A stored markdown file is not enough without lifecycle controls.

### Source 4: SLSA provenance specification

Source: Supply-chain Levels for Software Artifacts (SLSA), provenance specification and producing artifacts requirements, version 1.0.
URLs: https://slsa.dev/spec/v1.0/provenance and https://slsa.dev/spec/v1.0/requirements

Relevant finding: SLSA treats provenance as structured metadata about how artifacts were built, where they came from, and what process produced them. The point is not merely that an artifact exists; the point is that the production path can be evaluated.

Interpretation for MC: MC evidence maps need provenance for the evidence map itself: source inputs, authoring agent, toolchain, assumptions, review status, and change history. Git commit metadata is one provenance component, not the full provenance package.

## Fact vs. inference

### Supported by evidence

- GitHub commits can help preserve a change history for repository files.
- NIST AI RMF and NIST AI 600-1 emphasize lifecycle risk management, governance, measurement, provenance, testing, and incident disclosure.
- NIST SSDF supports lifecycle-oriented secure software practices rather than documentation alone.
- SLSA provenance treats artifact trust as a structured record of production process, not artifact existence alone.

### Inference, not yet demonstrated for Mirror Cartographer

- The current GitHub mind has complete evidence provenance for every evidence map.
- Each claim-status update is traceable to source support, review actor, and test outcome.
- Repository history is complete, durable, and protected enough for external audit use.
- Commit history alone would satisfy a buyer, evaluator, grant reviewer, employer, or safety reviewer.

## Claim-status update

C-GITHUB-AUDIT-TRAIL-01 is retired and replaced by:

C-GITHUB-AUDIT-TRAIL-PROVENANCE-01R:

"GitHub commits provide useful change history, but they do not by themselves establish a sufficient audit trail for Mirror Cartographer. A claim becomes audit-ready only when the evidence map includes source-to-claim provenance, authoring/toolchain metadata, review status, test status, failure/incident handling, retention assumptions, and falsification conditions. Current MC implementation remains unvalidated."

Confidence: moderate for the boundary claim; low for current implementation completeness until audited.

## Evaluation criterion added

### MC Audit-Trail Sufficiency Gate

Every evidence-map or claim-status file must include:

1. Claim identifier.
2. Plain-language claim tested.
3. Source list with primary/high-quality source classification.
4. Source-to-claim support type: direct, partial, indirect, conflicting, or background only.
5. Fact/inference separation.
6. Authoring agent: user, assistant, external source, script, or mixed.
7. Toolchain used: web, GitHub connector, file search, local script, manual review, etc.
8. Commit SHA and repository path.
9. Review status: unreviewed, self-reviewed, independently reviewed, superseded, retired.
10. Test status: untested, pilot planned, pilot complete, failed, passed with limits, inconclusive.
11. Falsification condition.
12. Retention/privacy note.
13. Known missing evidence.
14. Next proof needed.

A file cannot be labeled audit-ready if any of these fields are absent or materially ambiguous.

## Falsification checklist

The claim that GitHub evidence maps create a sufficient audit trail fails if:

- A claim cannot be traced from source evidence to final wording.
- A source is cited but does not directly support the claim it is attached to.
- A commit exists but the authoring process, toolchain, or review state is unknown.
- A claim has no falsification condition.
- A claim has no test status.
- A repository file omits whether it is source-grounded, assistant-inferred, symbolic, or speculative.
- Sensitive or private data enters the record without a retention/privacy decision.
- Superseded claims remain active without retirement markers.

## Test plan

Test ID: MC-AUDIT-TRAIL-SUFFICIENCY-AUDIT-01

Sample:
- 25 most recent evidence maps.
- 25 oldest evidence maps.
- 25 claim-status files if available.
- Any evidence maps tied to health, privacy, safety, job opportunity, or commercial value claims.

Procedure:
1. Extract all claim identifiers and claim text.
2. For each claim, classify source support as direct, partial, indirect, conflicting, or absent.
3. Check whether fact/inference separation exists.
4. Check whether the toolchain and authoring agent are named.
5. Check whether test status and falsification conditions are explicit.
6. Check whether superseded claims are visibly retired.
7. Check whether private/sensitive data is present and whether retention rationale exists.
8. Publish a ledger with pass/fail per field.

Passing threshold:
- 95% of sampled files include all required audit-trail fields.
- 0 active high-risk claims lack falsification conditions.
- 0 active high-risk claims rely only on commit existence as evidence.
- 100% of retired/superseded claims are visibly marked.

Failure response:
- Downgrade affected claims to "documentation exists; audit readiness unvalidated."
- Add missing provenance fields before using the claim for public, commercial, safety, or health-adjacent representation.

## Next proof needed

Run MC-AUDIT-TRAIL-SUFFICIENCY-AUDIT-01 across the GitHub mind and publish an audit-readiness ledger showing:

- percentage of evidence maps with complete provenance,
- percentage with direct source-to-claim support,
- percentage with named author/toolchain metadata,
- percentage with explicit test status,
- percentage with falsification conditions,
- percentage independently reviewed,
- and every high-risk claim that is documented but not audit-ready.
