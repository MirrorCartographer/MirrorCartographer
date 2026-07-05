# Evidence Map: Memory Summaries Are Not Source-Grade Evidence

Date: 2026-07-05
Run: 127
Area: Mirror Cartographer / GitHub mind / memory provenance
Status: Claim downgraded

## Claim tested

Mirror Cartographer and the GitHub mind can treat AI-generated memory summaries, prior-chat summaries, and reconstructed context as sufficiently reliable evidence for claims about the user, the project, or project progress.

## Claim-status update

Previous implicit claim:

> AI memory/context preserves enough continuity to function as project evidence.

Updated claim:

> AI memory/context can support continuity and retrieval, but it is not source-grade evidence unless each claim is linked to original source material, authorship, timestamp, transformation history, and current verification status.

## Why this needed stronger evidence

Mirror Cartographer depends on continuity across conversations, deleted-account fragments, GitHub commits, automation outputs, resumes, project claims, animal-health threads, and symbolic/cognitive maps. If compressed memory is treated as evidence, the system may accidentally:

- convert inference into biography;
- flatten uncertainty into fact;
- preserve outdated claims after later correction;
- blur user-authored, AI-authored, and co-authored material;
- make career, health, safety, or project claims without source-grade support.

## Evidence found

### Primary / high-quality sources

1. W3C PROV Overview defines provenance as information about entities, activities, and people involved in producing data or things, useful for assessing quality, reliability, or trustworthiness. PROV also emphasizes identifying objects, attribution, processing steps, access, reproducibility, versioning, procedures, and derivation.
   - Source: W3C PROV-Overview, 2013-04-30.
   - URL: https://www.w3.org/TR/prov-overview/

2. NIST AI RMF 1.0 requires documentation of AI-system knowledge limits, intended usage, oversight, scientific integrity, TEVV considerations, data collection/selection, system trustworthiness, construct validation, metrics, uncertainty, benchmarks, independent review, and limitations of generalizability.
   - Source: NIST AI 100-1, Artificial Intelligence Risk Management Framework 1.0, January 2023.
   - URL: https://doi.org/10.6028/NIST.AI.100-1

3. NIST AI RMF notes that AI trustworthiness can be affected by data-quality issues and that ground truth may not exist or may not be available for the intended context.
   - Source: NIST AI 100-1, Appendix B / AI risks.
   - URL: https://doi.org/10.6028/NIST.AI.100-1

4. Memory Sandbox research argues that conversational agents need better affordances for users to view and control what the agent remembers because limited or opaque memory can distract, distort the agent's context, and create poor user mental models.
   - Source: Huang, Gutierrez, Kamana, MacNeil. Memory Sandbox: Transparent and Interactive Memory Management for Conversational Agents. arXiv:2308.01542.
   - URL: https://arxiv.org/abs/2308.01542

5. A 2026 empirical study of ChatGPT memory entries reports that memory improves coherent personalization but raises questions about opacity, sensitivity, agency, and fidelity. The authors distinguish user-context grounding from stronger forms of source-grade provenance.
   - Source: Dash et al. The Algorithmic Self-Portrait: Deconstructing Memory in ChatGPT. arXiv:2602.01450.
   - URL: https://arxiv.org/abs/2602.01450

6. Agentic provenance research argues that AI-agent workflows need fine-grained provenance because hallucinations and incorrect reasoning can propagate downstream when one agent output feeds another agent input.
   - Source: Souza et al. PROV-AGENT: Unified Provenance for Tracking AI Agent Interactions in Agentic Workflows. arXiv:2508.02866.
   - URL: https://arxiv.org/abs/2508.02866

## Fact / inference separation

### Facts supported by sources

- Provenance is not merely memory; it records entities, activities, agents, derivations, attribution, and processing steps.
- NIST treats trustworthy AI as a lifecycle measurement and documentation problem, including knowledge limits, TEVV, uncertainty, benchmarks, and generalizability limits.
- AI memory systems can improve continuity while remaining opaque or difficult for users to inspect and control.
- Agentic workflows need fine-grained provenance because errors can propagate through downstream artifacts.

### Inferences for Mirror Cartographer

- A memory summary should be treated as a pointer, index, or hypothesis generator, not as evidence by itself.
- A GitHub artifact based only on memory should be marked `memory-derived / unverified` until it is traced to source material.
- Claims about the user's skills, health history, animal care history, authorship, symbolic system, or project progress require stronger provenance than conversational memory.
- The GitHub mind needs a specific status class for memory-derived claims because ordinary commit persistence can make weak evidence look more official than it is.

## Boundary rule

Memory-derived claims may be used for continuity, retrieval, and hypothesis generation.

Memory-derived claims may not be used as proof of:

- factual biography;
- medical or veterinary history;
- project completion;
- authorship or ownership;
- career qualifications;
- safety/effectiveness;
- system performance;
- discovery or novelty.

## Claim-status taxonomy added

Add these statuses to claim records:

1. `source-attested`
   - Directly supported by original document, raw chat, uploaded file, email, code, or primary record.

2. `memory-derived`
   - Comes from saved memory, summary, reconstructed context, or assistant recollection. Useful but not proof.

3. `memory-derived-with-partial-support`
   - Memory claim has at least one matching source, but source coverage is incomplete.

4. `coauthorship-unclear`
   - Claim or artifact may be user-authored, AI-authored, or co-authored, but attribution has not been resolved.

5. `stale-or-drift-risk`
   - Claim may have changed after the source or memory was created.

6. `verified-current`
   - Claim has been checked against current source material or real-world outcome.

7. `falsified-or-replaced`
   - Claim has been contradicted, superseded, or intentionally retired.

## Evaluation criterion added

### MC-MEMORY-PROVENANCE-01

Any MC output that uses remembered context must pass all applicable checks:

| Dimension | Pass condition | Fail condition |
|---|---|---|
| Source trace | Claim links to original source, not only memory | Only assistant memory or summary supports it |
| Transformation chain | Shows raw source -> summary -> claim -> artifact | Compression steps are hidden |
| Authorship | Separates user-authored, AI-authored, and co-authored material | Artifact is framed as purely user-authored when uncertain |
| Timestamp | Indicates when source was created and when claim was last checked | Timeless wording hides drift risk |
| Currentness | Flags whether the claim may have changed | Old memory is presented as current fact |
| Sensitivity | Health, trauma, finances, identity, and animal-care claims require stricter support | Sensitive memory becomes unverified assertion |
| Correction path | User or evidence can revise the claim | Memory repeats despite correction |

## Falsification checklist

A memory-derived claim must be downgraded if any are true:

- No raw source can be located.
- The only support is a summary, memory, or previous assistant conclusion.
- Later evidence contradicts the memory.
- The claim has high consequence and lacks primary records.
- The claim uses diagnostic, qualification, authorship, or completion language without source proof.
- The claim's wording became stronger after summarization.
- The claim cannot distinguish fact from interpretation.

## Test plan

### MC-MEMORY-PROVENANCE-AUDIT-01

Audit 40 existing GitHub-mind claims and label each one:

- source-attested;
- memory-derived;
- memory-derived-with-partial-support;
- coauthorship-unclear;
- stale-or-drift-risk;
- verified-current;
- falsified-or-replaced.

For each claim, record:

1. Claim text.
2. Source type: raw chat, uploaded file, email, GitHub commit, web source, memory summary, assistant reconstruction.
3. Evidence link/path.
4. Author/agent if known.
5. Date of source.
6. Date last verified.
7. Confidence category: unsupported, weak, moderate, strong, verified.
8. What would falsify or downgrade it.

## Operational update for GitHub mind

From this point, any new evidence-engine artifact that relies on remembered project context should include one of these labels:

- `Context basis: source-attested`
- `Context basis: memory-derived`
- `Context basis: memory-derived-with-partial-support`
- `Context basis: reconstructed / unverified`

Default status for remembered-only context: `memory-derived / unverified`.

## Next proof needed

Run `MC-MEMORY-PROVENANCE-AUDIT-01` against 40 high-impact MC claims, especially:

- career-fit claims;
- resume skill claims;
- animal-health history summaries;
- health/nervous-system theories;
- project-completion claims;
- authorship and coauthorship claims;
- claims about what MC can do.

The proof needed is not more memory. The proof needed is source reconstruction: raw source, transformation chain, attribution, timestamp, and verification state.
