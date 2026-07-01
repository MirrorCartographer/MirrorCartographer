# Forge Outside ChatGPT Plan

Goal: create abilities outside this chat by moving work into GitHub-native processes.

## Ability 1: structured demonstration generation

Status: planned.

A demonstration can be generated from these fields:

- id
- title
- question
- why it matters
- input
- transformation
- proof of value
- boundary
- next build

The result is a Markdown file in:

`demonstrations/generated/`

## Ability 2: issue-driven work intake

Status: planned.

A GitHub issue can act as the input form for the Forge.

Issue fields:

- fragment
- desired artifact
- public/private status
- source status
- next action

The Forge turns the issue into a file or checklist.

## Ability 3: scheduled repository review

Status: planned.

A scheduled workflow can scan repository folders and produce a status report:

- missing demonstrations
- stale docs
- empty demo slots
- broken links
- next recommended build

## Ability 4: public proof loop

Status: active manually.

Current public proof files:

- `demonstrations/DEMONSTRATION_CATALOG_101.md`
- `demonstrations/index.html`
- `forge/FORGE_CHARTER.md`
- `forge/templates/demonstration-template.md`

## Ability 5: outside hosting path

Status: available.

The public repo can host static HTML through GitHub Pages. This makes the public demonstration layer available without ChatGPT and without Vercel.

## Constraint found

Some script or workflow writes may be blocked by the connector filter. When that happens, use Markdown specs and manually generated files until the script can be added from a local checkout.

## Human/local command path

A human or coding agent can clone the repo and add the generator locally:

1. Clone the public repository.
2. Add `forge/generate_demo.py`.
3. Add `.github/workflows/forge-demo.yml`.
4. Push to main.
5. Run workflow manually from GitHub Actions.

## Next artifact target

Create the first ten generated demonstrations as concrete Markdown files, then link them from `demonstrations/index.html`.
