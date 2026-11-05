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


## Evidence corrections and hardened archive tooling

| Artifact | Latest relevant commit | Git blob SHA |
|---|---|---|
| [Historical archive recovery audit](HISTORICAL_ARCHIVE_RECOVERY_AUDIT.md) | [83fc21d](https://github.com/MirrorCartographer/MirrorCartographer/commit/83fc21d168ad26e40cb017c5468042a011fadf20) | `15e16dbc6217b4c6f8f99230eca5f4ef50c1763d` |
| [Technical evidence register](TECHNICAL_EVIDENCE_REGISTER.md) | [320f219](https://github.com/MirrorCartographer/MirrorCartographer/commit/320f219754c1513cc5c22ed09d488519098870a7) | `5ca94d648b3c9cc8a1bb36f937d18e3a24dac215` |
| [Public project system map](PROJECT_SYSTEM_MAP.md) | [76ebdb5](https://github.com/MirrorCartographer/MirrorCartographer/commit/76ebdb56b2eef5d706dd3c4dad98771692201ba0) | `0aa3d501bf5893809a8aff3b94d6808d4a317848` |
| [Archive manifest generator](../tools/build_archive_manifest.py) | [3096626](https://github.com/MirrorCartographer/MirrorCartographer/commit/30966267b3ec520cac5e5d3d06dc216769f5e13d) | `b24be5e0fbeb0632b08f2e7852fcf5fbfcca610b` |
| [Archive manifest tests](../tests/test_archive_manifest.py) | [28423de](https://github.com/MirrorCartographer/MirrorCartographer/commit/28423deb06eb9fd1e54c03f3528d0944936a6170) | `f288d4ef5c8d235dd260a02b9c13607c69028553` |

These revisions correct the earlier overstatement that 129 text-document references were 129 snapshots. The recovered JSON export supports 38 distinct document-creation events; 129 is a broader textual match count, not a verified revision count. The archive-manifest tool also now excludes more raw conversation export filenames by default.


## Canvas revision index and recovered design artifacts

| Artifact | Commit | Git blob SHA | Original source SHA-256 (when available) |
|---|---|---|---|
| [Canvas document index](../evidence/canvas/document-index.json) | [37b50c6](https://github.com/MirrorCartographer/MirrorCartographer/commit/37b50c667fff4aad2f777f5a510a34ec7ffdcde4) | `1096027a16766c1a06b6ddc46bda119135be1d97` | Derived from private conversation export `conversations.json` |
| [Full Core Specification v1](../evidence/historical/core-specification-v1-full.md) | [33609bf](https://github.com/MirrorCartographer/MirrorCartographer/commit/33609bfe7e7dd085367f200100f5eae4187ec84d) | `1f22d02a1187044857137d7d3ef71f06628e35d7` | `6458832010065789bd02130acde1bb965456c81390a95ef789532469305cd782` |
| [Access Implementation Pack v2](../evidence/historical/access-implementation-pack-v2.md) | [e3627ba](https://github.com/MirrorCartographer/MirrorCartographer/commit/e3627baf1e5c377a9651f1d715977063ca9d02d0) | `e08c52896885117cf0a3ac91adcdcde6e3e4a04e` | `87bbb5fda05005abc4e2924fb0f6b197ae21b8335df078ef5287e03dcdfd61f6` |
| [Collapse Codex v1](../evidence/historical/collapse-codex-v1.md) | [9d62dca](https://github.com/MirrorCartographer/MirrorCartographer/commit/9d62dca77ba7ab65ff5e3606cb8e46328da731c0) | `0db4e8ee7d470aa6398572a39f8cbbc54842c130` | `7338f0528beaeb294d1ff1e9c888251fa7a981b5c54d920969cfad694828848c` |
| [Historical archive audit — current revision](HISTORICAL_ARCHIVE_RECOVERY_AUDIT.md) | [aac802d](https://github.com/MirrorCartographer/MirrorCartographer/commit/aac802d9062cc74be2e98c17b40bce2ab57627ef) | `502a0ea401dae20a91465ea61c455243cefe5bbc` | — |
| [OpenAI feature chronology — current revision](OPENAI_FEATURE_CHRONOLOGY.md) | [cd1e73f](https://github.com/MirrorCartographer/MirrorCartographer/commit/cd1e73fffc0726ce68d8c21e0fda83f6d9a78982) | `f81dab4ef7acc2c607d69252b52f833ce43de08d` | — |
| [Technical evidence register — current revision](TECHNICAL_EVIDENCE_REGISTER.md) | [93d193b](https://github.com/MirrorCartographer/MirrorCartographer/commit/93d193b784107a99ef5f2dec525e22a8c36c0d32) | `7e48e4fc89b3319ae8799f30fceb0502453832e4` | — |
| [Public project system map — current revision](PROJECT_SYSTEM_MAP.md) | [553be51](https://github.com/MirrorCartographer/MirrorCartographer/commit/553be512a0f13ee11a059027e822accee33c814b) | `f7c14be415b11032ab0f9ea79f78b26cb3ee79ce` | — |
| [Main README — current evidence index](../README.md) | [945037e](https://github.com/MirrorCartographer/MirrorCartographer/commit/945037ec9ab4e919893dab5534022352e4884011) | `6a557b273731e3b0038f07499f5bb57ff74f62c8` | — |

## Unified Execution Hub publication

- [Static local-first Hub source](https://github.com/MirrorCartographer/mirror-cartographer-ui/blob/main/execution-hub.html): commit [832bdac](https://github.com/MirrorCartographer/mirror-cartographer-ui/commit/832bdac1ec41c0d22acd06805f59f36eb8053d4f), Git blob SHA `9f7271ff114eaf6b11fba9797bf4a1442fc3ce31`.
- [UI repository README link](https://github.com/MirrorCartographer/mirror-cartographer-ui/commit/6529c6afedab8e0f58927b619b6acc1b0d998fa0): commit `6529c6afedab8e0f58927b619b6acc1b0d998fa0`, blob SHA `8fb98dfaa56732d73307d329ec93ae80163fac5f`.
- The expected GitHub Pages URL is `https://mirrorcartographer.github.io/mirror-cartographer-ui/execution-hub.html`; live availability was not verified by the current web inspection.


## Recovered prototype source and local-first tools

| Artifact | Commit | Git blob SHA | Original source SHA-256 |
|---|---|---|---|
| [Implementation Pack v1](../evidence/historical/implementation-pack-v1.md) | [1c83c13](https://github.com/MirrorCartographer/MirrorCartographer/commit/1c83c13eaff7f939c263b8c2d5511a1729b37ec5) | `7832a878babb2faeaf46b326e555763d1546a2f6` | `dd5e0131599ebb00d854eb423db0e1fad2bfee52f32d020b27c99df46ac10044` |
| [Creation Portal v1 HTML](../evidence/historical/creation-portal-v1.html) | [7255424](https://github.com/MirrorCartographer/MirrorCartographer/commit/7255424077fa70afb7ea3c68b7bce14747bad757) | `f9cf7c411afb0b309be3b7e978fc0e1547497cd3` | `d1fba1c518babbbfdec808e3442583b3fb338f122d2615118e0acde3615a5817` |
| [One-page project brief](../evidence/historical/one-page-project-brief-v1.md) | [8982b10](https://github.com/MirrorCartographer/MirrorCartographer/commit/8982b1004634bc4590f4055c088c961d45ca4e58) | `22d5523e70df44fa051a3f1f176d0b7f051160a0` | `982a6ba438dde6c37d0e67c5094f621833353c4e1457e15651623a92a6713886` |
| [Canvas index — current revision](../evidence/canvas/document-index.json) | [9584cb0](https://github.com/MirrorCartographer/MirrorCartographer/commit/9584cb0b49e19cfee2bf323fb6f6230c12feb1d3) | `7131f8a70d80001a99161642d83bd7b2d907fcdb` | Derived from private conversation export |
| [Archive recovery audit — current revision](HISTORICAL_ARCHIVE_RECOVERY_AUDIT.md) | [14e0e10](https://github.com/MirrorCartographer/MirrorCartographer/commit/14e0e10becee4ecc8740d0c97156a382a927fb80) | `d151e9d205f6eaf727cbe83bbcdadd3bc9e21b11` | — |
| [Technical evidence register — current revision](TECHNICAL_EVIDENCE_REGISTER.md) | [df1a4d1](https://github.com/MirrorCartographer/MirrorCartographer/commit/df1a4d13fe5dffc0f7a9e34836dc4a09b07d7dfe) | `d745fb29d05ffea768eae93d714a3824c78abb16` | — |
| [Portfolio case studies — current revision](PORTFOLIO_CASE_STUDIES.md) | [55aef79](https://github.com/MirrorCartographer/MirrorCartographer/commit/55aef79c2007130b2aeb8acae85e617a45bd0a3d) | `902779090400b46d3fd0d739b7a787558c17e5a5` | — |
| [README — current evidence index](../README.md) | [f867179](https://github.com/MirrorCartographer/MirrorCartographer/commit/f8671799ee00058ad625620ee7ceee9f0a1f4fcb) | `${readmeBlob}` | — |

## UI repository static prototype delivery

| Artifact | Commit | Git blob SHA |
|---|---|---|
| [Unified Execution Hub root source](https://github.com/MirrorCartographer/mirror-cartographer-ui/blob/main/execution-hub.html) | [832bdac](https://github.com/MirrorCartographer/mirror-cartographer-ui/commit/832bdac1ec41c0d22acd06805f59f36eb8053d4f) | `9f7271ff114eaf6b11fba9797bf4a1442fc3ce31` |
| [Unified Execution Hub Vite public copy](https://github.com/MirrorCartographer/mirror-cartographer-ui/blob/main/public/execution-hub.html) | [8b7290a](https://github.com/MirrorCartographer/mirror-cartographer-ui/commit/8b7290acab5c130590cb053060b10358b45f332e) | `9f7271ff114eaf6b11fba9797bf4a1442fc3ce31` |
| [Creation Portal Vite public copy](https://github.com/MirrorCartographer/mirror-cartographer-ui/blob/main/public/creation-portal-v1.html) | [c396bb3](https://github.com/MirrorCartographer/mirror-cartographer-ui/commit/c396bb3c067051998f5befcdeb4f6ef260adab0c) | `f9cf7c411afb0b309be3b7e978fc0e1547497cd3` |
| [Execution Hub contract test](https://github.com/MirrorCartographer/mirror-cartographer-ui/blob/main/scripts/execution-hub-contract-check.mjs) | [33c3d0f](https://github.com/MirrorCartographer/mirror-cartographer-ui/commit/33c3d0fc73748c1653b479db0670e6016cdaaec5) | `2cfef28baccdee626d4803e197681c9f9ac083ca` |
| [Execution Hub Actions workflow](https://github.com/MirrorCartographer/mirror-cartographer-ui/blob/main/.github/workflows/execution-hub-contract.yml) | [e227f5f](https://github.com/MirrorCartographer/mirror-cartographer-ui/commit/e227f5f97993d2f5a3fc92d3adad7385172eb613) | `be1f5eade6319c9bfced94227ccf84ce668b22f5` |
| [UI package script update](https://github.com/MirrorCartographer/mirror-cartographer-ui/blob/main/package.json) | [0dccf58](https://github.com/MirrorCartographer/mirror-cartographer-ui/commit/0dccf5827badcb6a71ff420dadcf82831aa58e54) | `f6f2a30c8026b859ca48aaa2d599b0db17edeff4` |

These UI artifacts are source-published. The Pages URL is expected from the repository's Vite Pages configuration, but live route availability and the new GitHub Actions workflow have not yet been verified by a successful run.


## Background verification workers and current UI copies

| Artifact | Commit | Git blob SHA |
|---|---|---|
| [Public branch census script](../scripts/public-branch-census.mjs) | [b5f4f86](https://github.com/MirrorCartographer/MirrorCartographer/commit/b5f4f86c4cc4d4a44beaa53970fd46e72581e0b8) | `592afa559e02e153f7938df23bf10e697692790b` |
| [Weekly public evidence census workflow](../.github/workflows/weekly-public-evidence-census.yml) | [16ae19e](https://github.com/MirrorCartographer/MirrorCartographer/commit/16ae19ea3186af82eb5d268fe851e8fc5005f49c) | `8abd19082a71a72ec682d2be750e70d4dd1918e4` |
| [Weekly archive test workflow](../.github/workflows/archive-manifest-tests.yml) | [b100cf5](https://github.com/MirrorCartographer/MirrorCartographer/commit/b100cf53ad919f7c4024bbcc73b8df924d70569a) | `d589f99216961091a26fb85c90068c3014645657` |
| [Repository branch/deployment audit — current](REPOSITORY_BRANCH_AND_DEPLOYMENT_AUDIT.md) | [854a37d](https://github.com/MirrorCartographer/MirrorCartographer/commit/854a37d4cd0b3751fe66e1386862f4299be82a8b) | `efdd61bab225f8992e3e1400f6fc44c6729772e8` |
| [Technical evidence register — current](TECHNICAL_EVIDENCE_REGISTER.md) | [2219d64](https://github.com/MirrorCartographer/MirrorCartographer/commit/2219d649c5eb8ce99b4f69b0acbb124deea471ed) | `1650fc069d0e725edf75bf3ad87dbaa142d984d2` |
| [Project system map — current](PROJECT_SYSTEM_MAP.md) | [c95bd69](https://github.com/MirrorCartographer/MirrorCartographer/commit/c95bd69601d6f5315a88eba20e4999f79fb2812e) | `1e64c9917e727d6593f04290ee92ed951e1bcbc1` |
| [README — current](../README.md) | [c72d525](https://github.com/MirrorCartographer/MirrorCartographer/commit/c72d5256f956909e054b1d4dee9e876e5e3d8e41) | `06c8c7d7e5d39ba294eeb3e8c244efcb5fbac85b` |
| [Historical archive audit — current](HISTORICAL_ARCHIVE_RECOVERY_AUDIT.md) | [5a87b27](https://github.com/MirrorCartographer/MirrorCartographer/commit/5a87b27fe2fe43e6daec12f5cdf8d43d3c9c07b8) | `0d0883862f1509a310a7f48e9c135c95940633df` |

## UI repository current code and workflow

| Artifact | Commit | Git blob SHA |
|---|---|---|
| [Unified Execution Hub root](https://github.com/MirrorCartographer/mirror-cartographer-ui/blob/main/execution-hub.html) | [06e68c0](https://github.com/MirrorCartographer/mirror-cartographer-ui/commit/06e68c01a0cf0e90a76c55fb1ab7100b30ba7db1) | `e6d94e2290317650af6c9ac82149f2f15edc1de2` |
| [Unified Execution Hub Vite copy](https://github.com/MirrorCartographer/mirror-cartographer-ui/blob/main/public/execution-hub.html) | [ac70c81](https://github.com/MirrorCartographer/mirror-cartographer-ui/commit/ac70c81fe70a1f4cfc330486b2798d0ebe1d1924) | `e6d94e2290317650af6c9ac82149f2f15edc1de2` |
| [Creation Portal Vite copy](https://github.com/MirrorCartographer/mirror-cartographer-ui/blob/main/public/creation-portal-v1.html) | [c396bb3](https://github.com/MirrorCartographer/mirror-cartographer-ui/commit/c396bb3c067051998f5befcdeb4f6ef260adab0c) | `f9cf7c411afb0b309be3b7e978fc0e1547497cd3` |
| [Execution Hub + Portal contract test](https://github.com/MirrorCartographer/mirror-cartographer-ui/blob/main/scripts/execution-hub-contract-check.mjs) | [9ff8558](https://github.com/MirrorCartographer/mirror-cartographer-ui/commit/9ff855860c9ea7398838e1a3a1881386b4413ccf) | `db4a2010f5aa6edae695009c391349eb4bfa4931` |
| [Weekly UI contract workflow](https://github.com/MirrorCartographer/mirror-cartographer-ui/blob/main/.github/workflows/execution-hub-contract.yml) | [584ab9d](https://github.com/MirrorCartographer/mirror-cartographer-ui/commit/584ab9dbb296d89394ebdb8276f712605ffef575) | `20b58890063b9b9a826a9994ce75dc285fbd01fd` |

All three scheduled workflows are configured but no successful Actions run was visible during this audit. The UI Hub root and Vite public copies were fetched and confirmed byte-identical. The Pages URL remains an expected route, not a verified live deployment.


## Initial branch inventory and final index updates

| Artifact | Commit | Git blob SHA |
|---|---|---|
| [Initial public branch-name census](../evidence/branch-census/initial-names-only-2026-11-05.json) | [0ea114f](https://github.com/MirrorCartographer/MirrorCartographer/commit/0ea114f08f3ecce95ea1142e3bc41b59d7569e49) | `a02adf0565de373dda5d712485960dd290a46eca` |
| [Branch/deployment audit — current](REPOSITORY_BRANCH_AND_DEPLOYMENT_AUDIT.md) | [c2e2cab](https://github.com/MirrorCartographer/MirrorCartographer/commit/c2e2cab764e3aac0f04c0a282611d50066477f0b) | `5aecb75a73a971c30fe29850460a12cae99f8d10` |
| [README — current](../README.md) | [3502b23](https://github.com/MirrorCartographer/MirrorCartographer/commit/3502b23ac6baa2c46ef304610d70dc79d74d0cb8) | `b39c8fc882ac602ea6079e8454252dce67b91bfe` |


## FIA branch-family analysis and final Hub revision

| Artifact | Commit | Git blob SHA |
|---|---|---|
| [Initial branch census with prefix/FIA family counts](../evidence/branch-census/initial-names-only-2026-11-05.json) | [a2d2388](https://github.com/MirrorCartographer/MirrorCartographer/commit/a2d23880f751f3fe8ee198194af81617f0a19171) | `89e0ffd425e5a83ebfac5dc8552dfdf13cbe6361` |
| [Branch/deployment audit with FIA analysis](REPOSITORY_BRANCH_AND_DEPLOYMENT_AUDIT.md) | [ec0b6b7](https://github.com/MirrorCartographer/MirrorCartographer/commit/ec0b6b73334bfb088062cbe720b6c86e674252ae) | `9a69c4874dd10e19b63e55305e82699937a78564` |
| [Branch census worker with family counts](../scripts/public-branch-census.mjs) | [f8839e7](https://github.com/MirrorCartographer/MirrorCartographer/commit/f8839e77c4a439138ef4f5910bb2656fde9d0e33) | `fa145515d2dfbadf1454c797f99f82303e80b934` |
| [Weekly census workflow with read permissions](../.github/workflows/weekly-public-evidence-census.yml) | [16ae19e](https://github.com/MirrorCartographer/MirrorCartographer/commit/16ae19ea3186af82eb5d268fe851e8fc5005f49c) | `8abd19082a71a72ec682d2be750e70d4dd1918e4` |
| [Execution Hub — final root source](https://github.com/MirrorCartographer/mirror-cartographer-ui/blob/main/execution-hub.html) | [f79c221](https://github.com/MirrorCartographer/mirror-cartographer-ui/commit/f79c221ebbe1a483aefe8b4327052297545997b9) | `a695c6ce7682f86aae3813ca7c1b630577a6fb5e` |
| [Execution Hub — final Vite public copy](https://github.com/MirrorCartographer/mirror-cartographer-ui/blob/main/public/execution-hub.html) | [df8ece2](https://github.com/MirrorCartographer/mirror-cartographer-ui/commit/df8ece267f317e752eed5186c0770f72dcd3f366) | `a695c6ce7682f86aae3813ca7c1b630577a6fb5e` |
| [Execution Hub contract test — final](https://github.com/MirrorCartographer/mirror-cartographer-ui/blob/main/scripts/execution-hub-contract-check.mjs) | [2972eda](https://github.com/MirrorCartographer/mirror-cartographer-ui/commit/2972eda556d2902d7f854cec03578e6c17f8352c) | `328b9e3493870d8f8dfd001518cbb9afca1d629f` |


## Final repository visibility and FIA branch-family reconciliation

| Artifact | Commit | Git blob SHA |
|---|---|---|
| [Branch/deployment audit — final current revision](REPOSITORY_BRANCH_AND_DEPLOYMENT_AUDIT.md) | [c1f8e3d](https://github.com/MirrorCartographer/MirrorCartographer/commit/c1f8e3daae65688bedcda6e1a7baee419b13ab9f) | `e77ad336207df116020f1156e301eab8c828fa3a` |
| [Initial branch census — final family summary](../evidence/branch-census/initial-names-only-2026-11-05.json) | [a2d2388](https://github.com/MirrorCartographer/MirrorCartographer/commit/a2d23880f751f3fe8ee198194af81617f0a19171) | `89e0ffd425e5a83ebfac5dc8552dfdf13cbe6361` |
| [Public branch census worker — final family summary](../scripts/public-branch-census.mjs) | [f8839e7](https://github.com/MirrorCartographer/MirrorCartographer/commit/f8839e77c4a439138ef4f5910bb2656fde9d0e33) | `fa145515d2dfbadf1454c797f99f82303e80b934` |

