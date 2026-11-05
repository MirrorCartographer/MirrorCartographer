# OpenAI feature chronology — comparison against recovered Mirror Cartographer evidence

**Audit date:** 2026-11-05  
**Purpose:** test chronology and similarity hypotheses without inferring internal access or adoption.

## Method

Compare (1) the earliest recoverable dated Mirror Cartographer artifact, (2) the exact demonstrated capability in that artifact, (3) OpenAI's independently published release date and description, and (4) plausible independent-development explanations. A feature released later is not evidence that OpenAI saw or adopted this project. A later artifact cannot establish prior art for an earlier product.

## Comparison table

| OpenAI capability | OpenAI public date | Recovered project evidence | Assessment |
|---|---|---|---|
| ChatGPT Memory | Feb 13, 2024 test announcement; wider rollouts followed | Recovered project material discusses persistent symbolic/session memory and continuity; current inspected archive contains detailed design documents but the earliest pre-Feb-2024 dated source has not been authenticated in this audit | Similar problem space; chronological priority not established |
| Canvas | Oct 3, 2024 beta announcement | RTF export contains 28 text-document creation events; the IDs appear to encode UTC Unix timestamps from May–Aug 2025. This proves later Canvas use and extensive document work, not pre-launch invention of Canvas | No adoption inference; artifact dates are after launch |
| ChatGPT Projects | Dec 2024 rollout (date to be verified against official release notes before stronger use) | Project organization, master maps, cross-document continuity, and repository structure appear in later project records | Broad workflow similarity; not enough for technical equivalence or influence |
| Operator / browser-use agent | Jan 23, 2025 research preview | Mirror Cartographer project daemon and automation concepts exist in project documentation; no evidence of an independently implemented general browser operator predating Operator in this audit | Not equivalent on current evidence |
| Codex | May 16, 2025 research preview | Historical conversations show AI-assisted code generation and debugging before Codex. This is consistent with general-purpose LLM coding capability, not evidence of an independently built Codex-like agent | Important distinction: coding with a model is not the same as a coding agent product |
| ChatGPT agent | Jul 17, 2025 | Project daemons, orchestration plans, and bounded model-worker concepts appear in private project records; exact dates and runnable capabilities must be checked per commit | Conceptual overlap; no causal link established |

## Source-backed OpenAI release dates

- **Memory:** OpenAI announced a test on Feb 13, 2024. The post describes cross-chat memory and user controls. Source: https://openai.com/index/memory-and-new-controls-for-chatgpt/
- **Canvas:** OpenAI announced Canvas on Oct 3, 2024 as a separate workspace for writing and coding collaboration. Source: https://openai.com/index/introducing-canvas/
- **Operator:** OpenAI announced the browser-operating agent on Jan 23, 2025. Source: https://openai.com/index/introducing-operator/
- **Codex:** OpenAI announced its cloud software-engineering agent on May 16, 2025. Source: https://openai.com/index/introducing-codex/
- **ChatGPT agent:** OpenAI announced the agentic system on Jul 17, 2025. Source: https://openai.com/index/introducing-chatgpt-agent/

## Important historical correction

The recovered Canvas text-document identifiers in the inspected RTF appear to encode Unix timestamps in their first eight hexadecimal characters. For example, `6851d10e` decodes to 2025-06-17 20:33:18 UTC, and `688ebdd2` decodes to 2025-08-03 01:39:30 UTC. The observed pattern is consistent across the 28 creation records, but the identifier format is not independently documented here as a guaranteed timestamp contract. These are therefore labeled **decoded identifier times**, not authenticated original creation metadata.

Because OpenAI Canvas launched in October 2024, the recovered Canvas documents from June–August 2025 cannot demonstrate that Mirror Cartographer originated the Canvas interface. They do demonstrate substantial use of Canvas for project design and document development after launch.

## What the chronology does support

1. Mirror Cartographer has a substantial design and prototype history, including symbolic reflection, continuity, provenance, research, and AI-assisted development.
2. The available historical project archive includes an Apps Script test procedure configured to call the GPT-4 Chat Completions API; the actual successful execution is not proven by the available logs.
3. The RTF contains many Canvas document events in 2025, with project-related documents on tone UI, repository setup, assistant setup, system merge, migration, symbolic pipeline, and presence/relational mapping.
4. Similarities between project concepts and later public AI product capabilities are valid subjects for technical comparison, but are not evidence of OpenAI internal access or adoption.

## Alternative explanations that must be tested

- Common user needs may independently produce similar product concepts.
- Public research, open-source projects, and established HCI/software patterns may explain overlap.
- The project may have used OpenAI's own APIs and products, so some capabilities were provided by OpenAI rather than independently implemented.
- Later project documents may have been influenced by already-released OpenAI features.
- A concept may be similar at the product level while the architecture, implementation, and data flow differ substantially.

## Next evidentiary threshold

To upgrade a candidate from similarity to influence, find a contemporaneous record that an OpenAI representative or internal process received a specific artifact, then connect that receipt to a product or engineering decision. Useful records include submission receipts, emails, support tickets, research participation, contracts, explicit acknowledgement, or a documented internal implementation reference.

Until then, use the wording: “The project explored a related problem or interaction pattern; a later public OpenAI capability has similarities. Direct influence is not established.”

