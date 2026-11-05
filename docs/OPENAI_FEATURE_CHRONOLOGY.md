# OpenAI feature chronology — comparison against recovered Mirror Cartographer evidence

**Audit date:** 2026-11-05  
**Purpose:** test chronology and similarity hypotheses without inferring internal access or adoption.

## Method

Compare (1) the earliest recoverable dated Mirror Cartographer artifact, (2) the exact demonstrated capability in that artifact, (3) OpenAI's independently published release date and description, and (4) plausible independent-development explanations. A feature released later is not evidence that OpenAI saw or adopted this project. A later artifact cannot establish prior art for an earlier product.

## Comparison table

| OpenAI capability | OpenAI public date | Recovered project evidence | Assessment |
|---|---|---|---|
| ChatGPT Memory | Feb 13, 2024 test announcement; wider rollouts followed | Recovered project material discusses persistent symbolic/session memory and continuity; current inspected archive contains detailed design documents but the earliest pre-Feb-2024 dated source has not been authenticated in this audit | Similar problem space; chronological priority not established |
| Canvas | Oct 3, 2024 beta announcement | The bounded JSON export contains 39 unique Canvas textdoc IDs, 695 metadata events, and 133 distinct `(textdoc_id, version)` pairs; the separate RTF export contains 28 creation markers. The observed identifier pattern points to June–August 2025 project Canvas records. This proves later Canvas use and extensive document work, not pre-launch invention of Canvas | No adoption inference; artifact dates are after launch |
| ChatGPT Projects | Dec 13, 2024 (official release notes) | Project organization, master maps, cross-document continuity, and repository structure appear in later project records | Broad workflow similarity; not enough for technical equivalence or influence |
| Operator / browser-use agent | Jan 23, 2025 research preview | Mirror Cartographer project daemon and automation concepts exist in project documentation; no evidence of an independently implemented general browser operator predating Operator in this audit | Not equivalent on current evidence |
| Codex | May 16, 2025 research preview | The bounded export contains general coding conversations before Codex, but its first explicit Mirror Cartographer project record is May 22, 2025, after Codex's May 16 announcement. No pre-Codex Mirror Cartographer code artifact has been authenticated in this export. This is consistent with general-purpose LLM coding capability, not evidence of an independently built Codex-like agent | Important distinction: coding with a model is not the same as a coding agent product |
| ChatGPT agent | Jul 17, 2025 | Project daemons, orchestration plans, and bounded model-worker concepts appear in private project records; exact dates and runnable capabilities must be checked per commit | Conceptual overlap; no causal link established |

## Source-backed OpenAI release dates

- **Memory:** OpenAI announced a test on Feb 13, 2024. The post describes cross-chat memory and user controls. Source: https://openai.com/index/memory-and-new-controls-for-chatgpt/
- **Canvas:** OpenAI announced Canvas on Oct 3, 2024 as a separate workspace for writing and coding collaboration. On Dec 10, 2024, release notes added Python execution in Canvas; on Jan 15, 2025, they added import-from-chat into Canvas. Sources: https://openai.com/index/introducing-canvas/ and https://help.openai.com/en/articles/6825453-chatgpt-release-notes
- **Projects:** OpenAI release notes date Projects in ChatGPT to Dec 13, 2024, describing grouped chats/files with shared context and custom instructions. Source: https://help.openai.com/en/articles/6825453-chatgpt-release-notes
- **Operator:** OpenAI announced the browser-operating agent on Jan 23, 2025. Source: https://openai.com/index/introducing-operator/
- **Codex:** OpenAI announced its cloud software-engineering agent on May 16, 2025. Source: https://openai.com/index/introducing-codex/
- **ChatGPT agent:** OpenAI announced the agentic system on Jul 17, 2025. Source: https://openai.com/index/introducing-chatgpt-agent/

## Important historical correction

The recovered Canvas text-document identifiers in the inspected conversation JSON appear to encode Unix timestamps in their first eight hexadecimal characters. For example, `6851d10e` decodes to 2025-06-17 20:33:18 UTC, and `688ebdd2` decodes to 2025-08-03 01:39:30 UTC. The observed pattern is consistent with Canvas metadata message timestamps, but the identifier format is not independently documented here as a guaranteed timestamp contract. These are therefore labeled **decoded identifier times**, not authenticated original creation metadata.

Because OpenAI Canvas launched in October 2024, the recovered Canvas documents from June–August 2025 cannot demonstrate that Mirror Cartographer originated the Canvas interface. They do demonstrate substantial use of Canvas for project design and document development after launch.

## What the chronology does support

1. Mirror Cartographer has a substantial design and prototype history, including symbolic reflection, continuity, provenance, research, and AI-assisted development.
2. The available historical project archive includes an Apps Script test procedure configured to call the GPT-4 Chat Completions API; the actual successful execution is not proven by the available logs.
3. The JSON conversation export contains 39 Canvas IDs and 133 distinct observed version identifiers in 2025. Project-related records cover tone UI, repository setup, assistant setup, system merge, migration, symbolic pipeline, and presence/relational mapping.
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


## What the recovered conversation export can and cannot date

The inspected `conversations.json` is a bounded export of 337 conversations from 2024-08-22 through 2025-08-12 UTC. Within it, 49 conversations predate the Oct 3, 2024 Canvas launch; none contains the exact project name `Mirror Cartographer`. The first conversation with explicit Mirror Cartographer project content in this export is dated May 22, 2025. The first Canvas document creation whose title is clearly project-specific is `Mirror Sentience Stack`, with a decoded identifier time of 2025-06-10 UTC. The project-specific Canvas document series then expands from June through August 2025.

This means the current recovered export documents substantial Mirror Cartographer work and Canvas use after OpenAI's public Canvas launch. It does not establish pre-launch invention of Canvas, ChatGPT Memory, Projects, Codex, or agent mode. It also cannot disprove earlier work that may exist in other conversations, local files, or archives outside this bounded export.

Model metadata in the same export records 13,513 message entries labeled `gpt-4o`, 25 labeled `gpt-4`, 61 labeled `gpt-4o-mini`, 103 labeled `gpt-5`, 8 labeled `o3-mini`, 3 labeled `gpt-5-thinking`, and 161 labeled `research`. These are exported ChatGPT message metadata counts, not counts of external API requests and not evidence of internal OpenAI adoption.

