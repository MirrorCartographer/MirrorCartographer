# Claim Influence Gap

## Public-safe finding
Mirror Cartographer needs to distinguish three things that are often collapsed in AI outputs:

1. a source being available,
2. a source being cited or named,
3. a source actually influencing a public claim.

The public-safe artifact should not reveal private source material. It should reveal the claim-level influence boundary: what kind of source shaped the claim, what kind of transformation occurred, and what proof standard applies.

## Source status
- Private-context source: available only as architectural signal; not quoted, exposed, or published.
- File-library source: partial and citation-bound; used only to confirm existing MC architecture.
- GitHub source: public repository materials and recent commit pattern.
- Fresh public research: current external research on memory gates, privacy-preserving memory, provenance-native answer traces, and claim-level tool provenance.

## Claim status
- Supported: MC already requires fact / inference / symbolic interpretation / speculation separation, uncertainty labels, contradiction preservation, and public compression before release.
- Supported: Current provenance research identifies a gap between cited sources and behaviorally influential sources.
- Inference: MC should track influence at claim level, not just artifact level.
- Speculation: A mature MC system could expose a public influence ledger without revealing raw private memory.

## Privacy status
Public-safe. This note contains no personal, household, health, animal-care, financial, location, relationship, credential, or raw transcript details.

## Missingness
- No full private chat export was used.
- File-library retrieval is partial.
- GitHub code search indexing appears unavailable for the target repository, so recent commit search was used for continuity.
- No runtime app audit was performed in this pass.

## Revision reason
Prior MC runs established source boundary, redaction fidelity, claim transport, and release readiness. This run tightens the system around the provenance-influence gap: a claim can be public-safe but still poorly governed if the artifact cannot show what kind of influence shaped it.

## Design implication
Every public MC artifact should carry a small claim-influence table:

| Field | Purpose |
| --- | --- |
| Claim | The public-safe statement being released. |
| Claim mode | Fact, inference, symbolic interpretation, speculative design, product requirement, or research question. |
| Influence class | Public source, private abstracted source, file-derived source, GitHub-derived source, model synthesis, or user-confirmed pattern. |
| Transformation | Quote, compression, abstraction, analogy, synthesis, or implementation plan. |
| Evidence boundary | What the source can and cannot prove. |
| Privacy boundary | Why raw source does not travel. |
| Missingness | What is unknown or unverified. |
| Revision reason | Why this version exists now. |

## Key phrase
A citation says where the claim points. An influence ledger says what actually shaped it.
