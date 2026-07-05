# Public-Safe Demo State Separation Protocol

## Core finding

Mirror Cartographer needs a public-safe demo state separation protocol: a rule set that keeps demonstrations, screenshots, sample sessions, seed data, and evaluation fixtures structurally useful while preventing them from becoming disguised exports of private-context state.

Operating line: **A demo is not public-safe because it contains fictional content; it is public-safe only when its state model, sequence, labels, symbols, failures, and success criteria are generated independently from private source topology.**

## Source status

- Private-context material: used only as architectural orientation.
- File-library material: public-facing and implementation-oriented MC artifacts indicate that the system includes modes, symbolic state objects, session memory, reflection generation, exportable artifacts, contradiction tracking, resonance feedback, privacy boundaries, and evaluation scaffolds.
- GitHub material: recent public-safe research commits show an expanding boundary architecture around traceability, assumption expiry, mode boundaries, interface contracts, fixture safety, inference quarantine, abstraction drift, evaluation coverage, dependency graphs, publication readiness, and composition risk.
- Public web material: not required for this pass because the finding concerns internal architecture and publication hygiene rather than a current external factual claim.
- Raw transcript status: excluded.

## Claim status

- Type: product architecture and evaluation requirement.
- Strength: design recommendation, not empirical claim.
- Evidence class: repository-pattern observation plus product-shape synthesis from public-safe MC specification materials.
- Testability: high. A demo can be audited by checking whether each visible state object, transition, label, sample symbol, feedback action, and evaluation result can be justified without relying on private source chronology or private examples.

## Privacy status

- Public-safe: yes.
- Personal details: none included.
- Household, health, animal-care, financial, location, relationship, credential, and raw transcript details: excluded.
- Rehydration risk: medium unless sample states are deliberately synthetic, independently generated, and tested for shape leakage.
- Required privacy control: every public demo must declare whether its data is synthetic, composite, benchmark-derived, user-consented, or placeholder-only.

## Missingness

- No formal separation currently guarantees that demo states are independent from private-context state topology.
- No demo-data manifest distinguishes synthetic examples from transformed private examples.
- No rule requires sample sessions to avoid private-like chronology, motif clustering, symbolic ordering, or interaction pressure.
- No evaluation checklist currently asks whether a demo can be understood without hidden private context.
- No explicit failure mode marks a demo as unsafe because its fictionalized variables preserve too much original relational structure.

## Product requirement

Every public-facing MC demo, screenshot, sample export, video script, fixture, seed dataset, test session, or benchmark scenario should include a `demo_state_status` block with these fields:

1. **State origin**: synthetic, public-source-derived, benchmark-derived, consented, placeholder, or unknown.
2. **Private-context independence**: independent, partially abstracted, unverified, or unsafe.
3. **Topology risk**: none, low, medium, high, or blocked.
4. **Visible state classes**: symbol, atmosphere, somatic placeholder, contradiction, trajectory node, resonance feedback, mode switch, export artifact, or evaluation event.
5. **Allowed use**: product demo, unit test, evaluation fixture, design mock, documentation example, or internal-only.
6. **Revision trigger**: what would require removal, regeneration, demotion, or re-audit.

## Evaluation criteria

A demo state passes if:

- It contains no private source content.
- It does not encode private chronology, household structure, medical specifics, animal-care specifics, financial data, location data, relationship data, credentials, or raw transcript shape.
- Its symbolic sequence is generated from a neutral scenario template rather than private motif order.
- Its failure cases are generic product failures, not private-context failures with renamed labels.
- Its screenshots and exports reveal only synthetic or explicitly public-safe states.
- Its evaluation claims can be verified from the visible demo alone.
- Its source boundary is readable by a maintainer without needing access to private chats.

## Implementation plan

1. Add a repository folder for public-safe demo governance, such as `mind/demo-safety/`.
2. Create `mind/demo-safety/demo-state-status-template.md` with the fields above.
3. Require every future public demo artifact to include a source-boundary note.
4. Create synthetic scenario generators that use neutral domains: navigation task, fictional research notebook, generic creative planning session, or abstract signal-mapping exercise.
5. Add a reviewer checklist: reject any demo where private-context structure is necessary to understand why the sequence, symbols, failures, or evaluation criteria were chosen.
6. Later convert demo manifests into machine-readable JSON so CI or review scripts can detect missing `demo_state_status` blocks.

## Research questions

- How synthetic must a symbolic state be before it stops preserving private-context topology?
- Should MC maintain a fixed library of neutral demo scenarios, or generate new synthetic scenarios for each public artifact?
- Can a demo preserve the product’s emotional-symbolic depth without borrowing private motifs?
- What automated checks can detect shape leakage in fictionalized examples?
- Should public demo artifacts be versioned separately from research notes to prevent accidental dependency on private-oriented architecture work?

## Dependency status

- Upstream safe artifacts: public-safe fixture boundary protocol; public-safe inference quarantine protocol; public-safe composition risk auditor; mode boundary evaluation matrix; public-safe evaluation coverage map.
- Downstream affected artifacts: demo scripts, screenshots, landing pages, sample exports, test fixtures, public case studies, benchmark packs, and product walkthroughs.
- Dependency type: privacy, evaluation, implementation, product documentation.
- Invalidation trigger: any discovery that a public demo’s structure, motif ordering, failure mode, or success criterion can be mapped back to private-context shape.

## Revision reason

Added because the prior public-safe research set strongly protects notes, claims, fixtures, and composition, but public product adoption will also require demos. Demos are higher-risk than notes because they make state visible. MC therefore needs an explicit separation layer between private architectural learning and public demonstration state.