# Mirror Cartographer

> **[Open the Living Atlas](https://mirrorcartographer.github.io/MirrorCartographer/)** · [Core repository](https://github.com/MirrorCartographer/MirrorCartographer) · [Interactive application](https://mirrorcartographer.github.io/mirror-cartographer-ui/) · [Continue in ChatGPT](https://chatgpt.com/)

Mirror Cartographer is an open, evidence-aware environment for exploring how observations, relationships, hypotheses, contradictions, experiments, and outcomes fit together without erasing uncertainty.

## Start here
- **Living Atlas:** free static website, repository search, relationship explorer, research and creative entry points.
- **Core repository:** source of truth for research, architecture, methods, demonstrations, creative work, evidence, and tools.
- **Interactive application:** companion interface, published separately through GitHub Pages.
- **ChatGPT:** general continuation link. It does not expose private conversations or embed a live ChatGPT session.

## Repository map
| Area | Contents |
|---|---|
| `research/`, `evidence/` | Source-linked claims, research methods, literature, protocols |
| `architecture/`, `foundation/` | System architecture and design decisions |
| `mind/`, `GitHubMind/` | Hypotheses, field notes, experiments, evaluation |
| `demonstrations/`, `open-mic/` | Public demonstrations and interactive proofs |
| `tools/`, `forge/`, `functions/` | Executable tools, validators, research infrastructure |
| `art/`, `music/`, `Creative_Universe/` | Creative artifacts |
| `independent-web/`, `independent-creative-web/`, `independent/` | Standalone interactive worlds |
| `docs/`, `schemas/`, `governance/`, `ledgers/` | Documentation, data contracts, governance, traceability |

## Free hosting
The canonical website is a static GitHub Pages site built from `site/` by `.github/workflows/publish-mc-atlas.yml`. It requires no Cloudflare account, paid host, server, database, or API key. Search catalog generation happens during the build. See [site operations](docs/SITE_OPERATIONS.md).

The companion Vite application is published from the `mirror-cartographer-ui` repository using its own GitHub Pages workflow. Both are public-repository Pages deployments.

## Evidence and safety
A visible connection is not automatically causal. MC separates observations, interpretations, hypotheses, and established claims; preserves provenance; and makes uncertainty inspectable. It is not a medical, veterinary, legal, or diagnostic authority. Sensitive records and raw private conversations do not belong in public repositories.

---

Mirror Cartographer is a public experiment in preserving and improving understanding across fragmented experience.

It began as a symbolic reflection interface. It is now becoming a broader continuity atlas: a place where conversations, symbols, records, body signals, animal-care history, research questions, creative work, tool failures, and future goals can be mapped without flattening the life that produced them.

The direct question:

**What if the information survived, but the understanding did not?**

Mirror Cartographer exists to rebuild the understanding.

## Project 101: public demonstrations

The next public proof layer is **Project 101**: one hundred and one demonstrations that show what Mirror Cartographer does instead of only explaining it.

- `demonstrations/DEMONSTRATION_CATALOG_101.md`
- `demonstrations/index.html`

The 101st demonstration is the **Comedy Club**: an open-mic room for testing assumptions through humor, timing, reversals, contradiction, and social truth.

## Executable evidence gates

The integrated hypothesis-gate suite lives at:

- `tools/mc_gate_integration/gate_registry.json`
- `tools/mc_gate_integration/fixtures.synthetic.json`
- `tools/mc_gate_integration/validate_gate_packets.py`
- `tools/mc_gate_integration/run_gate_check.py`

Run:

`python tools/mc_gate_integration/run_gate_check.py`

This layer prevents MC packets from entering longitudinal memory, public research maps, question-prep, or discovery routes when provenance, privacy, missingness, actionability, temporality, controls, or operational variables are collapsed.

## Conversation Parallax

The public repository now contains a concrete proof layer for plural conversation reading:

- `tools/conversation_parallax/community_protocol.json`
- `tools/conversation_parallax/validate_community_log.py`
- `tools/conversation_parallax/runs/0000-bootstrap.json`

One reader follows a conversation chronologically. Another reads the same corpus semantically. They compare interpretations, preserve disagreement, and join a cumulative community of prior views. Raw private chats remain private; the public layer contains schemas, synthetic fixtures, redacted receipts, continuity digests, and validators.

## Core idea

Most tools preserve fragments:

- notes
- transcripts
- records
- code
- research
- images
- timelines
- conversations

Mirror Cartographer asks whether the relationships between those fragments can also be preserved, inspected, challenged, and improved.

The target is not only better answers.

The target is a better quality of experience: more coherence, more agency, more contact with reality, more ability to act, and less loss of meaning between systems.

## What the system is designed to track

- recurring language patterns
- repeated symbols and metaphors
- user-stated goals and constraints
- emotional and somatic descriptions
- contradictions and unresolved loops
- shifts in interpretation over time
- evidence boundaries
- source status
- claim status
- user correction
- grounded next steps
- outcome feedback
- public/private boundaries

## Public lanes

### Understanding

How a fragment becomes a field. How directness changes the map. How each interaction shows what changed.

### Memory and continuity

How archives become terrain rather than piles of transcripts.

### Body

How body signals become structured language and clinician-facing questions without becoming diagnosis claims.

### Animals

How animal-care history becomes timeline, advocacy, clearer communication, and better preparation.

### Research

How unknown spaces become roadmaps with evidence boundaries, experiments, and proof thresholds.

### Symbols

How symbols, images, metaphors, colors, names, and repeated phrases become navigational data.

### Human-AI co-discovery

How corrections, tool failures, AI model drift, and co-authorship become inspectable.

### Creative world

How music, film, visual identity, weather, home, animals, and humor carry structure and feeling.

### Value

How public proof, barter, support, paid packets, and complexity reduction become visible.

### Future

How worlds, invariants, interaction locations, and returning visitors test whether the atlas is alive.

## What this is not

Mirror Cartographer is not a therapy product, diagnostic authority, medical tool, veterinary tool, oracle, or objective truth engine.

It is a reflective and research-oriented interface for mapping fragments into reviewable structure with explicit uncertainty.

## Allowed claims

- The project explores reflective human-AI interaction.
- The framework can structure user reflection and pattern tracking.
- The system can help generate hypotheses, questions, summaries, maps, and next-step structures.
- Outputs require human judgment and external verification.
- Symbolic output can support language-building and self-reflection.

## Not allowed claims

- The system diagnoses medical or psychological conditions.
- The system replaces therapy, medical care, veterinary care, legal advice, or emergency support.
- Symbolic resonance proves factual truth.
- Recurrence alone proves causality.
- AI interpretation is automatically more accurate than human interpretation.

## Public value

Mirror Cartographer is for people whose information is not merely scattered, but whose understanding has become fragmented across tools, time, records, conversations, and contexts.

The public offer is continuity work:

- archive maps
- research maps
- symbolic atlases
- evidence maps
- record-organization structures
- next-action maps
- public-facing concept artifacts

Paid work, sponsorship, collaboration, barter, technical help, research review, introductions, hosting help, and public feedback are all valid forms of value exchange.

## GitHub music player

A persistent soundtrack for exploring repositories, issues, pull requests, and code is available as a small Chrome/Chromium extension. GitHub profile READMEs cannot run a persistent audio player directly, so the profile links to the extension instead.

- [Open the GitHub Music Player source and installation guide](browser-extension/github-music-player/README.md)
- [View the extension files](browser-extension/github-music-player/)

Playback is started by the user and continues across GitHub page navigation in desktop Chrome/Chromium after the extension is installed. This first version accepts a direct audio-file URL; it does not embed or bypass Spotify/YouTube playback.

## Author

Charity Sturgell

U.S. Navy nuclear-trained machinist mate, independent human-AI interaction researcher, and creator of Mirror Cartographer.

## Research method and claim register

The research layer now records source-linked claims, explicit limits, and next tests rather than treating project intent as proof.

- [Research method and evidence boundaries](research/METHOD.md)
- [Initial source-linked claim register](research/claim-register.json)
- [Claim record schema](research/claim-record.schema.json)
- [Register integrity validator](research/validate_claim_register.py)
- [Explore The Between — interactive relationship instrument](https://mirrorcartographer.github.io/mirror-cartographer-ui/research-atlas/)

Run `python research/validate_claim_register.py` from the repository root. This checks internal references and required fields; it does not verify source accuracy or URL availability.
