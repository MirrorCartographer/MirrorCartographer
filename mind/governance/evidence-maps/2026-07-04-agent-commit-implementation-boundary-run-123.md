# Evidence map: Agent commits are not validated implementation

Date: 2026-07-04
Status: claim narrowed
Area: Mirror Cartographer / GitHub mind / AI-agent workflow governance

## Claim tested

Weak claim:

> If an AI agent writes an evidence map, checklist, or claim-status file into GitHub, the result has been implemented into the GitHub mind.

## Updated claim status

Narrowed claim:

> A committed file proves repository persistence and traceability of a proposed knowledge update. It does not, by itself, prove correctness, safety, integration, review, or operational adoption.

## Evidence found

### Fact: secure software practice is lifecycle-based, not commit-based

NIST SP 800-218, Secure Software Development Framework version 1.1, frames secure development as practices integrated into the software development life cycle. Its abstract says following the practices should help reduce vulnerabilities, mitigate impacts of undetected or unaddressed vulnerabilities, and address root causes to prevent recurrence. Source: https://csrc.nist.gov/pubs/sp/800/218/final

Relevance to MC:

A GitHub commit is one event in the lifecycle. It is not equivalent to lifecycle assurance.

### Fact: branch protection can require review and status checks before integration

GitHub documentation says protected branches can enforce requirements before pushing or merging changes, including pull request reviews, required status checks, conversation resolution, signed commits, linear history, deployment success, and restrictions on force-push/delete behavior. Source: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches

Relevance to MC:

The GitHub platform itself distinguishes “a change exists” from “a change passed repository integration controls.”

### Fact: OpenSSF Scorecard treats repository practices as measurable signals, but not complete proof

OpenSSF Scorecard includes checks such as Branch-Protection, Code-Review, Security-Policy, and CI-Tests. Source: https://github.com/ossf/scorecard/blob/main/docs/checks.md

A 2022 empirical study using OpenSSF Scorecard data found that Maintained, Code Review, Branch Protection, and Security Policy were influential predictors in models of vulnerability counts, but the models had low explanatory power, indicating that repository-practice scores alone do not fully explain security outcomes. Source: https://arxiv.org/abs/2210.14884

Relevance to MC:

Repository controls are useful evidence signals, not proof that the knowledge system is correct or safe.

## Inference

For the current GitHub mind, “implemented” must be split into at least four statuses:

1. Persisted: file exists in the repository.
2. Integrated: linked from an index, claim registry, roadmap, or evaluation harness.
3. Reviewed: checked against evidence, scope, safety boundaries, and conflicts with existing claims.
4. Verified: produced an observed improvement, caught a seeded failure, or changed an operational decision.

A direct agent-created file should default to Persisted unless the commit also updates indexes, tests, criteria, and review artifacts.

## Boundary update

Do not say:

> The GitHub mind now knows X.

Safer wording:

> The GitHub mind now contains a persisted evidence artifact proposing X, with stated evidence boundaries and a next proof requirement.

Do not say:

> Implemented means validated.

Safer wording:

> Implemented means written into the repository. Validated requires independent checks, traceability, and observed performance or review outcomes.

## Evaluation criterion added

### MC-GITHUB-IMPLEMENTATION-STATUS-01

Every AI-agent GitHub update must declare one implementation status:

| Status | Meaning | Minimum evidence |
| --- | --- | --- |
| Persisted | File committed | Commit SHA and path exist |
| Indexed | File is discoverable from registry/index | Link from relevant index or claim map |
| Reviewed | Human or independent model review completed | Reviewer, date, review findings, unresolved issues |
| Tested | A test/checklist/evaluation ran | Test input, expected output, observed output |
| Verified | Change reduced a defined failure mode | Before/after result or seeded-failure catch |
| Operational | Used in live workflow or decision | Concrete downstream use event |

Default rule:

If no higher evidence is present, classify as Persisted only.

## Falsification checklist

This claim is false or overstated if any of the following happen:

- An evidence map exists but cannot be found from any registry, index, or claim map.
- Two evidence maps contradict each other and no conflict is recorded.
- A checklist exists but has never been run against an artifact.
- A GitHub commit says “implemented” but no downstream workflow uses it.
- A claim-status update does not change future wording, tests, or decisions.
- A later artifact repeats the old overclaim after the boundary update.

## Test plan

### MC-GITHUB-IMPLEMENTATION-AUDIT-01

Sample 30 recent GitHub mind commits and classify each as Persisted, Indexed, Reviewed, Tested, Verified, or Operational.

For each commit, record:

- path
- commit SHA
- claim changed
- index linkage present or absent
- review evidence present or absent
- test evidence present or absent
- downstream use evidence present or absent
- contradiction check result
- final status

Pass threshold for stronger claim:

At least 80% of sampled evidence-engine updates must reach Indexed or Reviewed, and at least 25% must reach Tested or Verified.

Fail condition:

If most updates are only Persisted, MC must stop treating GitHub writes as implementation proof and call them repository deposits until the integration loop is built.

## Next proof needed

Run MC-GITHUB-IMPLEMENTATION-AUDIT-01 on the latest 30 evidence-engine commits, then update the claim registry with actual distribution across implementation statuses.
