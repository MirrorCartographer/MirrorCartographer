# Evidence Map — Memory Continuity Is Not Provenance

Date: 2026-07-04
Run: Evidence Engine 120
Area: Mirror Cartographer / GitHub mind / continuity architecture
Status: Claim narrowed; stronger evidence required before stronger claims.

## Claim tested

Mirror Cartographer and the current GitHub mind implicitly assume that persistent memory/context preserves continuity of understanding across sessions, account deletion, exports, rebuilds, and future AI interactions.

## Updated claim status

**Previous weak form:** Persistent memory/context preserves continuity.

**Updated bounded form:** Persistent memory/context can improve continuity and reduce repetition, but it does not by itself prove accuracy, provenance, authorship, completeness, or trustworthiness. Continuity claims require source-linked provenance, version history, user-correction traces, uncertainty labels, and reconstruction tests.

## Evidence found

### Fact — ChatGPT memory is a synthesized personalization layer, not a complete source archive

OpenAI's Memory FAQ says memory can use chats, files, and connected apps to personalize responses, and that users can control memory settings. It also states that the memory summary may not include everything remembered, sources may not show every factor shaping an answer, and full deletion may require deleting relevant chats, files, memories, and connected-app sources.

Source: OpenAI Help Center, "Memory FAQ," updated 2026-06-24.
https://help.openai.com/en/articles/8590148-memory-faq

### Fact — Provenance is specifically about the entities, activities, and people involved in producing data

W3C PROV defines provenance as information about entities, activities, and people involved in producing a thing or piece of data, usable for assessments of quality, reliability, and trustworthiness. That is a stronger standard than merely retaining or summarizing content.

Source: W3C, "PROV-Overview," 2013-04-30.
https://www.w3.org/TR/prov-overview/

### Fact — Trustworthy AI governance requires transparency, accountability, robustness, safety, privacy, and lifecycle framing

The OECD AI Principles frame trustworthy AI around human rights, privacy, transparency, explainability, robustness, safety, security, and accountability. They define an AI system as generating outputs that may influence physical or virtual environments, with varying autonomy and adaptiveness after deployment.

Source: OECD.AI, "AI Principles overview," updated principles adopted May 2024.
https://oecd.ai/en/ai-principles

### Fact — NIST AI RMF is a lifecycle risk-management framework

NIST presents the AI Risk Management Framework as a resource for managing AI risks. The implication for MC is that memory and continuity should be treated as lifecycle-governance concerns, not just convenience features.

Source: NIST, "AI Risk Management Framework."
https://www.nist.gov/itl/ai-risk-management-framework

## Inference

Memory can make MC feel continuous, but feeling continuous is not the same as preserving the epistemic chain. A synthesized memory may omit, compress, reframe, or prioritize information in ways that are useful but not independently auditable.

Therefore, MC should not treat memory as proof that the system "knows" what happened before. It should treat memory as a working hypothesis cache that must be checked against sources when claims matter.

## Boundary rule added

**MC-MEMORY-PROVENANCE-BOUNDARY-01**

Any MC or GitHub-mind claim that depends on prior user history must be classified into one of four statuses:

1. **Sourced:** linked to an original chat, file, email, commit, issue, or user-provided artifact.
2. **Synthesized:** derived from memory or summary, useful but not source-complete.
3. **Inferred:** reasoned from available material but not directly stated by the user or source.
4. **Unverified:** plausible but lacking enough source evidence to use as a stable premise.

Only **Sourced** claims can be used as high-confidence continuity evidence.

## Evaluation criterion added

**MC-CONTINUITY-PROVENANCE-01**

For every major continuity claim in MC, score:

- Source link present: yes / no
- Original wording preserved where needed: yes / no
- Authorship labeled: user / assistant / co-created / unknown
- Version timestamp present: yes / no
- Memory-vs-source distinction visible: yes / no
- User-correction path available: yes / no
- Uncertainty status present: sourced / synthesized / inferred / unverified
- Reconstruction test passed: yes / no

A claim fails this criterion if it cannot be traced back to at least one source or if it presents synthesized memory as direct fact.

## Falsification checklist

The claim "MC preserves continuity" should be downgraded if any of the following occur:

- A later MC output cannot identify where an important claim came from.
- A user correction is not reflected in later outputs.
- Two memories conflict without a conflict flag.
- A co-created artifact is described as purely user-authored or purely AI-authored when the record shows mixed authorship.
- A memory-derived claim changes behavior in a health, crisis, financial, career, or legal context without source verification.
- Deleting or editing a memory does not update downstream artifacts or status labels.

## Test plan

**MC-CONTINUITY-RECONSTRUCTION-PILOT-01**

Select 25 important MC claims across these categories:

- origin story
- user goals
- animal-health goals
- career/opportunity goals
- safety boundaries
- authorship/co-creation
- symbolic glossary
- GitHub architecture decisions

For each claim:

1. Locate the earliest source.
2. Identify whether it came from the user, assistant, co-created artifact, external source, or inference.
3. Compare the current memory version against the original source.
4. Label drift as none, compression, omission, contradiction, overclaim, authorship error, or useful abstraction.
5. Update the claim status.
6. Add a correction path if needed.

## Next proof needed

Run **MC-CONTINUITY-RECONSTRUCTION-PILOT-01** and measure:

- percent of claims with source traceability,
- percent of memory summaries that match the original meaning,
- number of authorship errors,
- number of overconfident synthesized claims,
- and whether user corrections propagate into later GitHub artifacts.

Until that pilot is complete, MC continuity should be described as a useful working layer, not a verified knowledge-preservation system.
