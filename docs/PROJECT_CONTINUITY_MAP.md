# Mirror Cartographer continuity map

Last evidence pass: 2026-07-11

This file is the public-safe continuity spine for the Mirror Cartographer project.

## 0. Project boundary

Mirror Cartographer is not limited to either repository or either website.

The project corpus includes every relevant:

- chat and conversation branch
- uploaded file, image, video, audio artifact, document, spreadsheet, and code sample
- GitHub commit, issue, branch, test, deployment note, failure, and repair
- symbolic association, phrase, nickname, visual motif, and contextual meaning
- health, pet, career, housing, media, relationship, and life-planning thread when it influenced the system's concepts or design
- product experiment, discarded idea, aesthetic rejection, and unrealized possibility
- automation output and handoff
- external page, connected tool, operator workflow, and deployment surface

The repositories are durable implementation surfaces inside that larger corpus. They are not the whole project.

Private, medical, intimate, or identifying source material must not be copied into the public repository. Public continuity records should preserve structure, decisions, meanings, provenance categories, and links to private evidence stores without exposing sensitive content.

## 1. Current implemented system shape

Mirror Cartographer currently has two distinct public surfaces joined by one encounter model.

### Atmosphere

Repository: `MirrorCartographer/mirror-cartographer-ui`

Primary role: a phone-first, nearly wordless living encounter.

Operational constraints:

- tap-to-start; no autoplay
- weather may bias state but must not determine the whole state
- musical and visual generation should remain lightweight on phones
- participant response is sensed through interaction without displaying speculative interpretation as fact
- hidden tabs must stop animation scheduling and restore exactly one loop
- reduced-motion behavior and tap safety are part of the product contract

### Artist field

Repository: `MirrorCartographer/MirrorCartographer`

Primary role: the interpretable and reusable creative substrate behind the encounter.

It should expose:

- field-state schemas
- replay fixtures
- composition decisions and constraints
- mappings into visual, musical, movement, lighting, installation, and other media
- provenance, authorship, licensing, and reuse boundaries
- infrastructure that can support edge/state behavior, including the Cloudflare browser bridge

### Shared encounter contract

`what exists + what could exist + participant interaction -> selected next field state`

The atmosphere renders the selected state. The artist field exposes the state and its possible interpretations. The interfaces should not collapse into one another.

## 2. Meaning and language lexicon

These terms are operational, not decorative.

- **field**: the active set of conditions, constraints, memories, pressures, and possibilities from which a next state can be selected
- **state**: a temporary configuration of the field, not a fixed claim about a person
- **encounter**: a participant-system event that changes what can happen next
- **possibility field**: a nonverbal representation of available but unrealized next states
- **composition frame**: a structured snapshot used to select or render a response
- **context**: the active interpretive frame that determines which meanings and relations are available
- **context switch**: an explicit change of frame that must reveal new inference, not merely relabel existing content
- **symbol**: a context-sensitive carrier that may hold literal, emotional, spatial, historical, relational, and operational meanings at once
- **mirror**: not simple reflection; a transformation that returns structure, difference, and previously unavailable relation
- **cartography**: mapping relations and transitions rather than claiming a final territory
- **memory**: durable evidence and state continuity across chats, files, systems, and time—not mere conversational recall

## 3. Decision ledger

### Confirmed

1. The project is a full-corpus system, not a website-only project.
2. The two public sites have different emotional and operational roles.
3. The atmosphere should remain nearly wordless and experiential.
4. The artist field should make the underlying state reusable and inspectable.
5. Symbolic language must map to behavior or state change; decorative symbolism alone is insufficient.
6. Context switching should produce traceable new inference.
7. Phone stability, reduced motion, no autoplay, and tap safety are product requirements.
8. Public continuity artifacts must be privacy-safe.
9. Missing capability should be treated as an engineering gap before being treated as a hard boundary.

### Rejected or superseded

- Generic explanatory landing pages as the primary experience
- Decorative layers that do not alter state or inference
- Treating every new chat as a clean restart
- Collapsing the two sites into one interface
- Equating repository contents with the whole project memory

## 4. Evolution timeline

- Early phase: symbolic and emotional mapping, body/world relation, language as active structure
- Architecture phase: contexts represented as structured objects; switches explain why they occurred and what became inferable
- Interface phase: phone-first, generative, hand-drawn/carnival and other aesthetic experiments; multiple concepts rejected when interaction or meaning was weak
- Persistence phase: concept graph, decision log, evidence graph, symbol graph, project graph, and evolution timeline identified as required substrate
- Two-site phase: atmosphere separated from artist field; shared encounter contract documented
- Reliability phase: phone contracts, deterministic replay fixtures, hidden-tab loop ownership, deployment gates
- Infrastructure phase: Vercel, GitHub Pages fallback, Cloudflare static output and authenticated browser bridge
- Current phase: unify the full corpus without leaking private material; make every automation inherit prior evidence rather than reconstructing from fragments

## 5. Evidence classes

Continuity work should distinguish:

- **public implementation evidence**: commits, tests, docs, deploy configs, public pages
- **private source evidence**: chats, uploads, health/pet records, personal associations, unpublished drafts
- **derived public-safe knowledge**: abstractions, decisions, schemas, lexicon entries, and provenance references that reveal no sensitive source content
- **uncertain inference**: hypotheses that must remain explicitly marked until confirmed

## 6. Automation handoff protocol

Every continuity cycle should record:

1. Evidence inspected
2. Prior work incorporated
3. What genuinely changed since the last cycle
4. Artifact or repository state changed
5. New understanding
6. Unresolved contradiction
7. Ranked next executable action
8. Privacy classification of any source used

Automations must not claim comprehensive continuity unless they have checked both repositories and the available private corpus indices.

## 7. Ranked next-action queue

1. Create a private corpus index that inventories chats, files, images, videos, and generated artifacts without copying sensitive content into public GitHub.
2. Add stable identifiers and provenance links between private corpus items and public-safe concepts, decisions, symbols, and implementation artifacts.
3. Build a machine-readable continuity manifest shared by both repositories.
4. Repair and verify the hidden-tab single-loop contract in `mirror-cartographer-ui` if it is not already complete.
5. Connect the existing field-encounter selector to visual pressure only after reliability gates pass.
6. Establish a cross-repository handoff file that records current deployment topology and active work ownership.

## 8. Current unresolved contradiction

The project requires total continuity across all material, while much of that material is private, fragmented across chats and uploaded artifacts, and not safely publishable. The correct architecture is therefore not to place everything in GitHub. It is to maintain a private indexed evidence layer plus a public-safe derived continuity layer with explicit provenance boundaries.
