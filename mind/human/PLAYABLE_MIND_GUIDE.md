# The Playable Mind

The public experience lives at [The Mind](../../site/mind/index.html) and is published at:

https://mirrorcartographer.github.io/MirrorCartographer/mind/

It is an interactive entrance into the research and thinking methods inside `mind/`. It is not a replacement for the underlying evidence, claim records, evaluation protocols, or agent rules.

## Experience structure

### The first expedition: The Signal in the Glasshouse

A six-scene, fictional research mystery teaches the visitor to:

1. Separate an observation from its interpretation.
2. Compare competing explanations by their predictions.
3. Treat missing baselines as a limit, not an invitation to invent data.
4. Use contradictory measurements to guide investigation.
5. Design a discriminating test before seeing the result.
6. Update the conclusion without claiming more than the evidence supports.

Choices provide explanatory feedback. The purpose is to practice investigation, not to grade the visitor or imply there is only one correct way to think.

### Seven rooms

| Room | Instrument | Core practice |
|---|---|---|
| The Observatory | Evidence | Separate observations, provenance, conditions, and interpretation |
| The Greenhouse | Hypotheses | Grow competing explanations and compare predictions |
| The Funhouse | Contradictions | Search for counterexamples, confounders, and boundary conditions |
| The Workshop | Experiments | Define measurements, comparisons, and falsification criteria |
| The Ghost Room | Missingness | Inspect unmeasured variables, absent baselines, and invisible failure |
| The Bridge | Translation | Transfer structural questions across domains without treating analogy as proof |
| The Mirror | Reflection | Examine framing, perspective, and the need to revise |

The connection map is an open navigation surface: its lines mean that a relationship is worth exploring, not that causation has been demonstrated.

## Notebook and privacy

- Notes, visited rooms, and expedition progress are stored in the visitor's browser using local storage.
- Notes are not sent to a server by the Mind interface.
- Visitors can export their notes as JSON or Markdown.
- Clearing site data or switching browsers/devices may remove access to the local notebook; export important work.
- The public Mind is not designed for private medical, financial, identifying, or raw conversation records. Keep sensitive personal material out of public repositories.

## Interaction and accessibility

The experience uses native HTML buttons, headings, forms, visible focusable controls, status announcements, responsive layout, and a reduced-motion preference. The expedition can be restarted; the map can be explored without completing it; local notes can be exported or deleted; progress can be reset independently of notes.

## Verification

Run:

```sh
node tools/mc_execution/validate-mind.mjs
node site/validate-site.mjs
```

The Mind validator checks required interface systems, unique IDs, in-page anchors, inline JavaScript syntax, room definitions, the homepage entry point, and the absence of network-transmission APIs in the local notebook script.

These checks do not replace a real browser test. The next verification layer should exercise touch/mobile layouts, keyboard navigation, storage/export behavior, and the deployed GitHub Pages URL in a browser.

## Design principle

**Make the method discoverable through play.** A visitor should leave with a stronger question, a more explicit uncertainty, a testable alternative, or a useful connection—not merely a page that says the project is interesting.
