# Evidence map: GitHub mind provenance/integrity boundary

Date: 2026-07-05
Area: Mirror Cartographer / GitHub mind / evidence governance
Status: claim narrowed; not verified as audit-grade

## Claim tested

The GitHub mind can function as an evidence/audit trail because updates are stored in GitHub.

## Updated claim status

Previous implicit claim:

> Repository persistence makes the GitHub mind an evidence trail.

Updated claim:

> Repository persistence supports traceability, but audit-grade evidence requires explicit provenance, integrity controls, review status, source links, reproducibility, and change-control metadata.

Confidence: medium for the boundary statement; low for any claim that the current repository already satisfies it.

## Fact / inference separation

### Facts from primary or high-quality sources

1. NIST SSDF SP 800-218 defines artifacts as records/evidence of secure software development practices, but frames them as part of a broader secure development lifecycle rather than proof by themselves.
2. NIST SSDF includes practices for protecting source, artifacts, and releases from tampering, and for verifying integrity/provenance of reused software components.
3. SLSA describes supply-chain security as a framework/checklist of standards and controls intended to prevent tampering, improve artifact integrity, and secure packages/infrastructure.
4. OpenSSF Scorecard describes automated checks as heuristics/signals that help identify security posture and risk areas. Its branch-protection check specifically treats protected branches as a control for enforcing workflows such as required review, passing checks, and preventing history rewriting.

### Inferences for Mirror Cartographer

1. A GitHub commit is useful evidence that content was persisted at a time and changed under a particular account/workflow, but it is not sufficient evidence that the claim inside the file is true.
2. A repository can serve as a stronger evidence trail only if each entry records: source provenance, evidence quality, author/agent role, review state, test state, falsification conditions, and downstream integration status.
3. Without branch protection, required review, source-link validation, and periodic audits, the GitHub mind should be treated as a working knowledge base, not an audit-grade evidence system.

## Evidence quality notes

- NIST SSDF is a primary U.S. government framework for secure software development practice.
- SLSA is a primary supply-chain integrity framework associated with OpenSSF.
- OpenSSF Scorecard is a high-quality open-source project/tool for automated security health heuristics.
- These sources are about software security and supply-chain assurance. Applying them to a personal/AI knowledge repository is an inference, not a direct empirical validation of Mirror Cartographer.

## Evaluation criterion added

### MC-PROVENANCE-INTEGRITY-01

Each evidence-map or claim-status update should be classified on six independent dimensions:

| Dimension | Pass condition | Fail condition |
|---|---|---|
| Source provenance | Primary/high-quality sources are cited with stable links, dates when relevant, and clear claim linkage. | Sources are missing, vague, low-quality, or only generally related. |
| Claim traceability | The exact claim tested is stated before evidence is interpreted. | The update improves a topic without naming the tested claim. |
| Integrity control | File path, commit SHA, author/agent role, and change date are recorded. | Content exists but cannot be tied to a specific change record. |
| Review state | Status is labeled as unreviewed, self-reviewed, externally reviewed, or replicated. | Reader cannot tell whether anyone validated it. |
| Test/falsification state | Conditions that would weaken or falsify the claim are explicit. | The update only supports the claim and does not say what would disconfirm it. |
| Integration state | Downstream use is marked as persisted, indexed, evaluated, operational, or deprecated. | Repository storage is treated as implementation by itself. |

Passing all six dimensions supports the label **structured evidence record**.
Failing any dimension limits the label to **working note** or **provisional evidence map**.

## Falsification checklist

This claim should be downgraded further if any of the following are true:

- Evidence maps cannot be traced to source URLs or documents.
- Claims are updated without recording what changed and why.
- Commit history is mutable or lacks branch/change protections.
- Files are created but never indexed, reviewed, tested, or used by later workflows.
- The same claim appears in conflicting statuses without reconciliation.
- A reviewer cannot reconstruct the claim boundary from the file alone.

## Test plan

### MC-GITHUB-PROVENANCE-INTEGRITY-AUDIT-01

Sample: 30 recent GitHub mind updates, including at least 10 evidence-engine runs.

Procedure:

1. Extract claim tested, source list, fact/inference separation, commit SHA, and next proof from each file.
2. Score each file against MC-PROVENANCE-INTEGRITY-01.
3. Check whether source links directly support the specific claim, not just the general topic.
4. Classify each record as working note, provisional evidence map, structured evidence record, or audit-grade evidence record.
5. Identify missing repo-level controls: branch protection, required review, signed commits/releases, automated link checks, source freshness checks, and claim-conflict detection.
6. Produce a remediation list ordered by evidence-risk severity.

## Next proof needed

Run MC-GITHUB-PROVENANCE-INTEGRITY-AUDIT-01 and produce a table showing how many existing evidence maps meet each dimension. Until then, the GitHub mind should not be described as audit-grade; it should be described as a structured, evolving evidence workspace.

## Practical implementation update

Default language for future MC/GitHub mind reports:

- Use: "GitHub update made" to mean the file was persisted.
- Do not use: "implemented" unless the update is indexed, reviewed, tested, or used by an operational workflow.
- Use: "evidence map added" for unreviewed claim-boundary work.
- Use: "verified criterion" only after a repeatable audit or external review.
