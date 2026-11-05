# OpenAI adoption and influence — evidence audit

**Project:** Mirror Cartographer  
**Project lead:** Charity Alessandra Sturgell  
**Audit date:** 2026-11-05  
**Status:** Open investigation; no internal-adoption finding established.

## Question being investigated

Did work originating in Mirror Cartographer become known to, influence, or get incorporated into OpenAI products, models, workflows, or internal systems?

This is a provenance and historical-investigation question. It must not be answered by similarity alone.

## Current finding

No evidence currently available in the inspected project repositories, recovered Canvas/conversation summaries, or historical API source establishes that OpenAI received, reviewed, licensed, copied, or internally adopted Mirror Cartographer work. No internal OpenAI communication, employee acknowledgement, contract, submission receipt, product decision record, or traceable implementation link has been identified in this audit.

This is not proof that adoption did not happen. It means the claim is presently unverified.

## Evidence currently available

1. Historical Mirror Cartographer artifacts and conversations document the project's concepts, requirements, prototypes, and iterative development.
2. A recovered Google Apps Script integration was configured to send form content to OpenAI Chat Completions using the gpt-4 model. The available fallback email proves the email workflow ran, but does not establish that a successful GPT completion was returned for that submission.
3. Later project source contains provider adapters and model workflows. These demonstrate project implementation, not OpenAI internal adoption.
4. Later public OpenAI capabilities may be compared with earlier project artifacts as a chronology of conceptual or functional similarity. Such comparisons are leads for investigation, not proof of copying, access, or causal influence.

## Claim categories

| Category | Meaning | Current status |
|---|---|---|
| Prior-art chronology | A dated project artifact predates a public feature | Investigate artifact and release dates |
| Functional similarity | Two systems have comparable user-visible behavior | Can be documented with side-by-side technical analysis |
| Access or exposure | OpenAI or an identified representative received a specific artifact | Not established |
| Acknowledgement | OpenAI representative explicitly recognized the work | Not established |
| Causal influence | Evidence links the work to a product or engineering decision | Not established |
| Internal adoption | Traceable evidence shows incorporation into OpenAI systems | Not established |

## Candidate comparison areas

The following are comparison hypotheses only. They must each be supported with exact pre-existing artifact snapshots and dated public release evidence before publication as a chronology:

- Longitudinal memory and continuity across conversations.
- Canvas-like document and code workspaces.
- Tool-using and computer-operating agents.
- Recursive or multi-stage reasoning and task orchestration.
- Multimodal symbolic interaction and visual creation workflows.
- Persistent project context, provenance, and user-controlled knowledge structures.

For each candidate, record: (a) earliest recoverable project artifact and immutable hash; (b) exact functionality demonstrated; (c) public OpenAI announcement or documentation date; (d) exact matching and non-matching behavior; (e) alternative explanations and prior art; (f) whether any access, acknowledgement, or causal evidence exists.

## Evidence required to strengthen an adoption claim

- Original artifact files with creation metadata and SHA-256 hashes.
- Complete Canvas revision history and conversation export records, not excerpts alone.
- Original API request/response logs, timestamps, request IDs, and email headers where available.
- Any OpenAI feedback submissions, support correspondence, research interviews, contracts, or acknowledgements.
- Public product announcement and documentation snapshots with publication dates.
- A technical comparison that distinguishes identical implementation details from broad conceptual resemblance.
- Independent review by a qualified technical and, if needed, intellectual-property professional.

## Method and safeguards

- Preserve originals read-only; analyze working copies.
- Never rewrite original timestamps or fabricate dates from file names.
- Record Git commit SHA, Git blob SHA, author/committer metadata, and repository visibility for every cited artifact.
- Treat commit timestamps as Git metadata, not independently authenticated proof of when a concept was first conceived.
- Keep private repositories, raw conversation exports, personal data, and secrets out of public evidence bundles.
- Do not publish credentials or full private source dumps. Rotate exposed credentials and retain only redacted evidence of exposure.
- Distinguish user-authored concepts and decisions, AI-assisted implementation, model-provider services, and third-party dependencies.
- Record contradictory evidence and plausible independent-development explanations.

## Permitted public wording

Use: “Mirror Cartographer developed an earlier prototype of [specific capability], documented in [dated artifact/commit]. The later OpenAI capability has functional similarities. No evidence currently establishes a direct causal relationship or internal adoption.”

Do not use: “OpenAI stole this,” “OpenAI copied the project,” “OpenAI adopted our system,” or equivalent definitive claims without direct, independently verifiable evidence.

## Next investigation steps

1. Export and preserve the original Canvas documents and their full revision metadata.
2. Recover the exact Google Apps Script source revisions and Apps Script execution logs; identify any OpenAI request IDs or HTTP status codes.
3. Build an artifact-level chronology from original file metadata, Git history, conversation timestamps, and deployment records.
4. Select only the strongest candidate feature comparisons and conduct a falsifiable technical comparison.
5. Preserve any correspondence or submission receipts that could establish OpenAI access to the work.
6. Obtain independent review before making any legal, ownership, or adoption assertion.

## Related public records

- [Provenance and authorship](PROVENANCE_AND_AUTHORSHIP.md)
- [Technical evidence register](TECHNICAL_EVIDENCE_REGISTER.md)
- [Portfolio case studies](PORTFOLIO_CASE_STUDIES.md)
- [Reproducibility and independent review](REPRODUCIBILITY_AND_REVIEW.md)
- [Founder profile](FOUNDER_PROFILE.md)
- [Public project system map](PROJECT_SYSTEM_MAP.md)
