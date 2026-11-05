# Public evidence publication manifest

**Repository:** https://github.com/MirrorCartographer/MirrorCartographer  
**Branch:** main  
**Publication audit:** 2026-11-05

This manifest identifies the public provenance and portfolio records added during the publication pass. Git commit URLs are the authoritative references for GitHub's commit metadata and server-visible history. Blob SHAs identify the exact file contents. Commit SHA and blob SHA are different identifiers.

| Artifact | Git commit | Git blob SHA |
|---|---|---|
| [Provenance and authorship](docs/PROVENANCE_AND_AUTHORSHIP.md) | [22fb88c](https://github.com/MirrorCartographer/MirrorCartographer/commit/22fb88c883eccd8fdf607b40a7b9e1ce942df47a) | `938a49a9b0c019bc60e55f2a9a8124d2a2d08c5d` |
| [Technical evidence register](docs/TECHNICAL_EVIDENCE_REGISTER.md) | [4ab3b50](https://github.com/MirrorCartographer/MirrorCartographer/commit/4ab3b50b2232edeb050bad652aef4b52d713de34) | `ab3e85dbfd5e43dd1c745e1a5634c2b4ef64f8cb` |
| [Portfolio case studies](docs/PORTFOLIO_CASE_STUDIES.md) | [56c11aef](https://github.com/MirrorCartographer/MirrorCartographer/commit/56c11aef6d0847f00467c4f794f13516f54ac223) | `ca8e5603593a4a21413a32ce08893be3721bfbd8` |
| [Reproducibility and independent review](docs/REPRODUCIBILITY_AND_REVIEW.md) | [1d9882b](https://github.com/MirrorCartographer/MirrorCartographer/commit/1d9882b7c7e26d4322303a0b74f2b49c38f82426) | `2ea2e8c79a97ad46ef0fdf26b482187cc9af4075` |
| [Founder profile](docs/FOUNDER_PROFILE.md) | [04bc406](https://github.com/MirrorCartographer/MirrorCartographer/commit/04bc4067396f33182f0b34833247bc96e616a2c9) | `0e29c72a2defdb295a12dfbac5b9d780f8d03525` |
| [Public system map](docs/PROJECT_SYSTEM_MAP.md) | [4dc7cfd](https://github.com/MirrorCartographer/MirrorCartographer/commit/4dc7cfd979016e739dc8291fd600fb162013acf2) | `77d6fc0a916912cf5ba01bcda792d9f744c726b7` |
| [OpenAI adoption evidence audit](docs/OPENAI_ADOPTION_EVIDENCE_AUDIT.md) | [a4ad0069](https://github.com/MirrorCartographer/MirrorCartographer/commit/a4ad0069ef0948f9f1a7f4e8e40c2969767dc91a) | `f3c68da3c912e05fbfd08745359459a0ded2f3bb` |
| [README publication index](../README.md) | [83e0c7e8](https://github.com/MirrorCartographer/MirrorCartographer/commit/83e0c7e8a33c1557bcacf57da703b0db9625daa2) | Retrieved separately from GitHub |

## Integrity and interpretation

- These SHAs identify content and commits as returned by GitHub; they are not cryptographic signatures by the project lead.
- GitHub commit metadata is useful chronology evidence but does not independently authenticate the date a concept was first conceived.
- The records are newly published documentation, not retroactive proof that every historical artifact has been recovered.
- Historical Canvas and conversation exports require a separate file-level hash manifest before their dates and integrity can be independently audited.
- Private repositories and private source artifacts are not mirrored here. Their existence and contents must not be represented as publicly inspectable.
- No OpenAI internal adoption or causal influence claim is established by this publication.

## Current publication scope

Seven public evidence/profile documents and the README index are published in the public research repository. This pass did not publish raw Canvas exports, private repository contents, credentials, or personal records.

## Historical recovery and reproducibility additions

| Artifact | Commit | Blob SHA |
|---|---|---|
| [Historical archive recovery audit](HISTORICAL_ARCHIVE_RECOVERY_AUDIT.md) | [3457823](https://github.com/MirrorCartographer/MirrorCartographer/commit/34578234edebceb2169812e7b0ab548987b6c70f) | `01a9614be3d5543b0499bfe58d53897126042866` |
| [OpenAI feature chronology](OPENAI_FEATURE_CHRONOLOGY.md) | [5f4cd7b](https://github.com/MirrorCartographer/MirrorCartographer/commit/5f4cd7b321002bc1be2d2e87680b0324c234c98e) | `03f4af87addd76c1010f4c2db625584913a3e111` |
| [Repository branch and deployment audit](REPOSITORY_BRANCH_AND_DEPLOYMENT_AUDIT.md) | [dd00fbd](https://github.com/MirrorCartographer/MirrorCartographer/commit/dd00fbd341db9e2231cc718d577ad13298ec75a0) | `aaaa10bd5fdba1f0840c6d20b73620ddebbd35fa` |
| [Independent review request](INDEPENDENT_REVIEW_REQUEST.md) | [e352627](https://github.com/MirrorCartographer/MirrorCartographer/commit/e35262757228d54e1b18b6710f7b4a28516c553a) | `6baaa0c91b7e9aeda7c8a83996a148f4ee0a6913` |
| [Archive manifest generator](../tools/build_archive_manifest.py) | [01029ee](https://github.com/MirrorCartographer/MirrorCartographer/commit/01029eec9023086dacfc7945c9a2bc28b6216d28) | `97ab717b89e965f587f9a365ef2c5a6ac3b8f5ee` |
| [Archive manifest unit tests](../tests/test_archive_manifest.py) | [17b6946](https://github.com/MirrorCartographer/MirrorCartographer/commit/17b6946757ed2af1a92ca7299b90479018e675fb) | `f3be6a2279980d1f23af76b84aeacc5fcde3f7ac` |
| [Archive manifest GitHub Actions workflow](../.github/workflows/archive-manifest-tests.yml) | [977f411](https://github.com/MirrorCartographer/MirrorCartographer/commit/977f4118d3a6fd7652a106e6fced18896293a7a3) | `464e56bcc3f1726a80d99b8712e66f3706e08a7b` |
| [README index update](../README.md) | [8fcb046](https://github.com/MirrorCartographer/MirrorCartographer/commit/8fcb046c382d1a8698bab1d92fa6a34f34512231) | `ad1954bbdddb1757406c4a3573daa0575c90897f` |

## Independent review invitation

An open request for an independent review was published as [GitHub issue #23](https://github.com/MirrorCartographer/MirrorCartographer/issues/23). This is a request for review, not evidence that a reviewer has accepted or completed one.

## Operational status at audit time

- The archive-manifest test workflow is committed and configured; a passing Actions run has not yet been verified.
- The inspected public repository commits had Vercel status checks failing with a build-rate-limit target. This is recorded separately in the repository branch and deployment audit.
- The connected Render service listing returned null; no Render service was verified.


## Historical source snapshot

| Artifact | Commit | Git blob SHA | Original file SHA-256 |
|---|---|---|---|
| [Recovered Core Specification v1](../evidence/historical/core-spec-v1-recovered.md) | [39d94a6](https://github.com/MirrorCartographer/MirrorCartographer/commit/39d94a604db63d9c4704b2c871e6805bf88c297f) | `f6d5833e81c813be3d3e098ccf867874a3e2b852` | `a3c94e5829a05ad4bc673eb366c756d7d4d3f587803500b21464effd7bc2290f` |

Latest historical archive audit revision: [deea4e7](https://github.com/MirrorCartographer/MirrorCartographer/commit/deea4e7aefb4214f46a4a3959e092f93bf96507b), Git blob SHA `ac2a76ce3d75a5a7ba59627c8351d35544a99c09`.

