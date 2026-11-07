# Product, Infrastructure, and Integration Audit
**Audit date:** 2026-11-07  
**Scope:** all four accessible Mirror Cartographer repositories; current default-branch Git trees; selected architecture, deployment, privacy, and product records.  
**Method:** GitHub API source inspection and commit-status inspection. No private service credentials were read. No live Supabase account, physical iPhone session, hardware device, or end-to-end deployed application was exercised.

## Executive finding

Mirror Cartographer is not one website and is not merely a GPT wrapper. It is a multi-repository body of work with four distinct source environments, multiple interactive applications, research instruments, a private symbolic/continuity corpus, an evaluation lab, and partially implemented shared infrastructure.

The central failure is **integration and product legibility**, not absence of ideas or source code. The existing work has been allowed to accumulate as parallel experiences and competing runtime paths. A visitor sees fragments rather than one coherent system. A maintainer sees multiple overlapping architectures and incomplete activation steps.

The correct move is not to concatenate every HTML file. It is to create one product shell and one canonical set of shared services, while retaining each experience as a versioned, independently testable module.

## 1. Repository census

Current default-branch recursive Git trees returned complete, non-truncated results:

| Repository | Visibility | Tree entries | HTML files | Canonical role |
|---|---:|---:|---:|---|
| `MirrorCartographer/MirrorCartographer` | Public | not recounted | 70 | Research, evidence, governance, architecture, tools, demonstrations, creative work |
| `MirrorCartographer/mirror-cartographer-ui` | Public | not recounted | 117 | Living Country, The Between, House, rooms, games, workbench, creative interfaces |
| `MirrorCartographer/c` | Private | not recounted | 12 | Historical source corpus, symbolic reflection, continuity/provenance, LYR/FREE/J bridges, bounded worker |
| `MirrorCartographer/J` | Private | not recounted | 4 | Human Judgment Lab, evaluation operations, versioned export packet, Consensus Trap experiment |
| **Total** | **2 public / 2 private** | **not recounted** | **203** | **187 public HTML modules plus 16 private-source HTML modules** |

Counts are HTML source files, not counts of finished products. HTML includes experiments, archived/independent works, previews, tools, and standalone applications. The UI workbench now indexes 117 HTML artifacts. The public module manifest records 187 HTML modules across the two public repositories; the private master registry records all 203 HTML files across the four repositories. Classification is still incomplete, so an indexed file is not automatically a finished or deployed product.

## 2. What exists, with evidence boundaries

### Public research repository
- 101-Dimension Atlas and observer/instrument architecture.
- Research method, source-linked expeditions, case demonstrations, field lens, relationship engine.
- FREE 2.0 executable core scaffold for proposals, consequences, contradictions, decision gates, review and reversal.
- Provenance, governance, ownership and historical-recovery records.
- Creative Universe and independent creative projects.
- Independent LYR model code path: tokenizer/model/training/inference implementation and specifications exist. The inference CLI now accepts stdin prompts for local provider integration, but the repository still contains no project-trained checkpoint.

### Public interactive UI repository
- React/Vite room-world and 79 procedural room configurations; configurations are not 79 finished authored worlds.
- 34 curated destination identities and a large standalone HTML collection.
- Shared room encounter engine, research atlas, workbench, creative tools, games and veteran-related experiences.
- The Between's perception ledger, deterministic resident-response policy, bounded scene cues, explicit dialogue choices and consent-aware continuity design.
- Supabase schema and Edge Function source for authentication, private continuity, shared presence/connections and optional resident dialogue.
- A separate Vercel/serverless API and Supabase-backed record architecture also exists. GitHub Pages is now the intended canonical static publishing path; Vercel is not the canonical release path and its checks have repeatedly hit provider build-rate limits. The authenticated API boundary and any remaining Vercel responsibilities still need a final retirement/separation decision.

### Private Repository C
- Original symbolic reflection and self-mapping material, historical documents, structured corpora and prototypes.
- Append-only provenance/continuity records and source-aware retrieval.
- Provider-neutral command-line bridge for local Ollama or OpenAI-compatible endpoints, now with an optional local LYR provider that calls the public research repository's inference script through stdin and requires an explicit checkpoint.
- Review-gated importers for FREE 2.0 audit JSON and J evaluation packets into the same append-only provenance ledger. Both default to preview-only; explicit `--apply` is required; source provenance and uncertainty are preserved.
- Bounded model patch worker with allowlist, validation and rollback.
- Local/offline shell and workbench.
- The browser UI is still not connected to C's local CLI model bridge through a live server-side gateway. The LYR provider is a local CLI bridge only. localStorage is not encrypted; live browser/offline and local Ollama/LYR inference remain unverified. No LYR checkpoint is present.

### Private Repository J
- Human Evaluation Operations Studio.
- Interactive Consensus Trap experiment.
- Six-dimension evaluation rubric and synthetic evaluation dataset.
- Reproducible test harness.
- The review packet now has a versioned schema and can be imported into C's ledger as separate synthetic, human-review, reliability, and decision records. The packet remains private and the importer is preview-only by default.
- Synthetic simulation is not field research or a validated claim about real-world evaluator behavior.

## 3. What is yours, what is collaborative, and what is not established

The historical recovery record places the earliest precursor material in 2024, before the Mirror Cartographer name. It records your 2025-05-22 cognitive-extension requirement and 2025-05-23 product behavior: a person brings their own language and experience, then uses AI-supported reflection to examine and shift how that experience is understood. The assistant proposed the name Mirror Cartographer; you adopted it. Later names and architectures must not erase that earlier lineage.

Your substantiated project contributions include problem framing, product direction, symbolic vocabulary and mapping concepts, interaction requirements, privacy/accessibility constraints, research questions, cross-domain connections, creative direction, prioritization, feedback, and acceptance decisions. Implementation is mixed: some artifacts are AI-assisted or generated, some are independently authored, and some historical authorship is unverified. Attribute code by commit/artifact where evidence supports it. This is a project contribution record, not a legal opinion on copyright, patent inventorship, or third-party terms.

## 4. What is differentiated, and what is already known technology

No individual ingredient should be advertised as unprecedented:
- Chat, LLM inference, graph databases, personal knowledge management, symbolic journaling, interactive fiction, realtime presence, provenance records, procedural art, and mobile sensors all have existing precedents.
- A phone already combines camera, microphone, touch, location, compute, networking and sensors.
- A model API is not an independent intelligence architecture.

The strongest candidate differentiation is the **specific governed composition**:
1. Symbolic and embodied expression is captured without treating symbols as diagnoses or objective facts.
2. Observations, interpretations, hypotheses, evidence, decisions and consequences remain distinct and traceable.
3. Memory is user-visible, revisable, consent-scoped and separated from transient session signals.
4. Contradictions and missing evidence remain inspectable instead of being silently averaged away.
5. A spatial/creative environment becomes an interface to those same underlying objects, not a disconnected decorative game.
6. Shared exploration can expose only explicitly permitted presence or artifacts, not private memory by default.
7. FREE 2.0 and the Human Judgment Lab provide decision and evaluation constraints around the system.

This combination is a credible product thesis and a potentially distinctive interaction architecture. It is **not yet proof of market uniqueness, scientific novelty, defensible IP, or product-market fit**. Those claims require competitor analysis, prior-art review where appropriate, user testing, and measurable outcomes.

## 5. The software product

**Proposed product definition:** Mirror Cartographer is a user-governed environment for turning ambiguous experiences, observations and questions into revisable symbolic maps, evidence-linked relationships, competing interpretations, decisions and creative artifacts—then exploring those objects spatially or collaboratively without losing provenance or control of memory.

The product is not the chat model. Models are replaceable providers inside the system.

The product's durable value should survive model switching:
- the user's data and authored artifacts;
- their relationships, history and provenance;
- the mapping and investigation methods;
- their ability to revise, export, share selectively, or leave;
- the creative environments through which they work.

## 6. What is invisible or disconnected

### P0 — Resolve runtime topology
The Between integration map describes GitHub Pages + Supabase Auth/Postgres/Realtime + a Supabase Edge Function for resident dialogue. The separate infrastructure document describes a Vercel serverless API for authenticated records and signed uploads. Both can coexist only if their responsibilities and API boundaries are explicit. At present, the product documentation does not provide one definitive, end-to-end runtime map covering all experiences.

The current Supabase setup guide lists migrations, browser variables, Auth redirects, Edge Function deployment and provider secrets as owner-side activation steps. A committed migration is not evidence that it was applied. The visitor-note UI and migration `db/005_shared_world_notes.sql` were merged to the public UI main branch in PR #180; the migration has not been applied and the live Supabase project state has not been inspected. The public Pages build must also have `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` configured.

### P0 — Choose canonical data and identity contracts
There are overlapping continuity stores, memory ledger schemas, provenance graphs, project stores, localStorage stores and experimental SQLite/MirrorStore work. The consolidation map already says the append-only provenance graph remains canonical and SQLite is experimental. Enforce that rule through adapters and tests; do not create another competing memory database.

### P0 — Establish one module registry
The machine-readable inventories now exist: a public experience manifest with 187 public HTML modules and a private master registry with all 203 modules. Both include source paths and blob hashes; the private registry records the two reviewed public derivatives from C and J. Most modules remain unclassified or unverified. The shell should load modules through explicit adapters. Do not iframe everything indiscriminately and do not paste all source into one HTML file.

### P1 — Complete experience truth
The UI completion map says 79 procedural rooms are discoverable, but explicitly leaves meaningful differentiation and individual destination audits open. A room is not complete merely because a route loads or a control reacts. Test visible state change, spatial continuity, persistence, return paths, keyboard/touch behavior, reduced motion, sound controls, error states and phone usability.

### P1 — Reconcile workbench coverage
The UI repository now contains 117 HTML files and both workbench indexes include all 117. The four-repository inventory totals 203 HTML files: 70 research, 117 UI, 12 C, and 4 J. The public manifest records 187 public modules; the remaining 16 are private source files. CI validates workbench coverage. Classification of the full inventory remains open.

### P1 — Model independence
The local provider bridge now has a tested C-to-LYR stdin contract, and C's CLI can route to LYR when a local checkpoint is supplied. No project-trained checkpoint is verified. FREE 2.0 and J evaluation packets can be imported into C's append-only ledger through review-gated adapters. The public website still has no live C/LYR server gateway. Keep external model providers replaceable and server-side; do not expose credentials in browser code. The system must remain useful with model inference disabled.

### P1 — Shared world
Database source defines connection requests, acceptance/revocation, expiring presence, and row-level security. The new visitor-note migration adds an authenticated, moderated, persistent shared wall with author-only pending records, moderator publication, and a five-note/hour limit. The UI and migration are in the open public-site PR; the database migration is not applied, the owner's moderator UUID is not registered, and live two-account privacy tests are still required. This is the first shared artifact path, not a complete collaborative artifact/version system.

### P1 — Mobile
Phone-first tests now cover the art-first field entrance, The Between, Charity's House, visitor movement, sound gating, and the notebook. The UI PR #180 phone-first smoke gate passed on the merged PR head; no physical iPhone session has been completed. GitHub Pages is the intended canonical deployment. Vercel status failures are provider/build-capacity signals, not proof of a live or broken application.


### Additional setup-document defect found during audit
The UI repository's `supabase/README.md` lists `db/004_agency_preserving_memory_ledger.sql` twice in the migration sequence. This appears to be a documentation duplication, not evidence that the migration itself is duplicated in the database. Correct the setup guide before asking an operator to apply migrations, then verify the actual Supabase migration history rather than assuming it is clean.

## 7. Current commit-status snapshot

Inspected default-branch HEADs on 2026-11-07:
- UI `7a96210f8759b467574cfecfdc4066d4b3bbae695`: three Vercel status checks report failure and link to build-rate-limit.
- Public research `2cc197008e22e05bd68dcb9574876c9adec4142c`: six Vercel status checks report success.
- Private C `a54759ab75dc5b1d517e24870e65d9cc9e71d4cc`: two Vercel status checks report success.
- Private J `67b0cee50c0b2b5cdbbba35c030614cb31df394d`: Vercel status reports failure with a build-rate-limit link.

Execution update after the original snapshot: J's packet-schema PR, the research repository's LYR stdin PR, and C's LYR/FREE/J bridge PR have been merged; their GitHub Actions validation jobs passed. The public UI integration PR #180 is merged to main; its GitHub Actions smoke, static preview, room, source, and contract checks passed, and the Netlify deploy preview succeeded. Vercel checks failed due provider build-rate limits. No GitHub Pages production deployment has yet been confirmed.

## 8. The nontechnical gap

The missing nontechnical input is not code. It is a product contract that can guide thousands of implementation decisions:
- **Who is the first user?** You, a researcher, a creative person, a veteran navigating systems, a team, or several audiences in separate modes?
- **What is the first valuable job?** For example: turn a tangled question into a map of observations, sources, competing explanations, missing evidence and a usable next experiment.
- **What is the durable output?** A map, case file, evidence dossier, creative world, decision record, shared investigation, or exportable artifact?
- **What must remain private, and what can be shared?**
- **What makes someone return or pay?** A measurable time saved, better evidence trail, creative capability, collaboration, or a service outcome.
- **What is the acceptance test?** A visitor can enter, make something consequential, return to it, understand where it came from, and take it elsewhere.

The product can contain many doors. It still needs one coherent promise and one complete end-to-end journey that proves the promise.

## 9. Hardware

No owned custom hardware implementation or hardware integration was found in the four repository trees. Earlier tactile-console, knob/button, haptic and sensor concepts were proposals, not a finalized user-approved device specification or bill of materials. The phone is an existing client, not proprietary hardware. The House is a web destination; a printed QR/link card could later bridge in-person encounters without custom electronics.

A sensible hardware path is an optional physical interface, not a phone replacement:
- **First prototype:** USB/Bluetooth control surface with tactile knobs, a few assignable buttons and haptic feedback to manipulate maps, layers, timelines and spatial objects.
- **Local hub (optional):** a small single-board computer or existing laptop runs local storage, model inference and device bridges; cloud sync is opt-in.
- **Sensor extensions (later):** attachable environmental or interaction sensors with explicit per-sensor consent, visible status, local processing and raw-data deletion. Never silently infer emotion, diagnosis or intent from physiological or ambient signals.
- **Immersive output (later):** projector, spatial display or headset only if a specific interaction cannot be done better on a normal screen.

Do not commission a custom PCB or wearable until a hardware-independent software prototype demonstrates a repeatable job that benefits from tactile or spatial input. The phone already supplies general-purpose sensors; hardware must add a distinct interaction or privacy capability.

## 10. Integration blueprint and build order

1. **Freeze a canonical system contract:** module registry, identity/auth, provenance, memory consent, artifact, relationship, event and permission schemas.
2. **Choose the canonical runtime topology:** static frontend host; one authenticated API boundary; Supabase for identity/relational data/realtime if the existing project is confirmed; object storage for artifacts; model router behind the server; local/offline mode retained.
3. **Create the unified shell:** one visual world/navigation, one module registry, route graph, global search, command palette, persistent artifact drawer, and per-module state adapters.
4. **Integrate modules without erasing their identities:** each HTML experience becomes a module with declared inputs/outputs and a route. Preserve standalone URLs and exportable static builds.
5. **Connect the common object model:** a symbol, observation, source, claim, hypothesis, relationship, decision, consequence, room, and creative artifact can reference one another while preserving source, author, permission, uncertainty, version and lineage.
6. **Activate services with real credentials and tests:** migrations, RLS, Auth redirects, Realtime, Edge Function, server-side provider secrets, backup/restore and two-account tests.
7. **Make mobile a first-class experience:** separate touch interaction design and physical-device tests, not desktop shrinkage.
8. **Add the physical control surface only after the software interaction contract is stable.**
9. **Release by evidence:** local build, automated tests, exact-commit deployment identity, live route, browser journey, phone journey, privacy tests and rollback proof.

## 11. Explicit limits and next action

This audit is source-level. It did not inspect private service dashboards, apply database migrations, read secrets, deploy services, test two real accounts, exercise a physical phone, or test hardware. No such completion is claimed.

**Next implementation action:** apply Supabase migration 005, configure the public Pages variables, register the owner as note moderator, and verify two-account note visibility. Add the narrowly scoped publication token to C and J to enable automated public-derivative PRs. The next major runtime bridge is a server-side gateway between the public site, C's continuity ledger, and model router; it depends on a verified LYR checkpoint or a deliberately selected external provider. Confirm the Render workspace before inspecting or provisioning hosted services. Add the narrowly scoped publication token to C and J to enable automated public-derivative PRs. The next major runtime bridge is a server-side gateway between the public site, C's continuity ledger, and model router; it depends on a verified LYR checkpoint or a deliberately selected external provider. Confirm the Render workspace before inspecting or provisioning hosted services.
