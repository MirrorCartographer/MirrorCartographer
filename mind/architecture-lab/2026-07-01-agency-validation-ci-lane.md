# Agency Validation CI Lane

## Architecture question

How should MC wire the dependency-free fixture parity runner harness into repository verification and CI without forcing the full Next.js build path or hiding parity failures behind unrelated app failures?

## Research snapshot

Current public platform guidance supports a separate workflow lane rather than burying the runner inside the app verification path:

- GitHub workflow files live under `.github/workflows` and are YAML workflow definitions.
- GitHub Actions path filters allow push and pull request workflows to run only when selected file paths change.
- When branch filters and path filters are both present, both must be satisfied before the workflow runs.
- npm package scripts are a stable command surface for local and CI execution from the package root.
- Node's built-in test runner runs `.test.mjs` files through `node --test` with no third-party test dependency.
- GitHub workflow artifacts preserve generated data after a job completes, which makes the fixture parity report inspectable even when console output is compact.

## Useful concepts extracted

### 1. Validation lane, not app gate

The fixture parity runner is evidence infrastructure. It should not wait behind `next build`, TypeScript compile, or UI concerns. App verification can still exist as `npm run verify`; agency validation now has its own command surface: `npm run verify:agency`.

### 2. Script first, workflow second

The durable boundary is the package script, not the GitHub Actions YAML. Local developers, CI, and later repair agents should all call the same script name.

Command surface:

- `npm run test:agency` runs dependency-free Node tests for the agency validation harness.
- `npm run fixture-parity:smoke` invokes the runner shell and writes a JSON evidence report.
- `npm run verify:agency` composes the two without invoking the Next.js application build.

### 3. Path-scoped CI trigger

The workflow should run when the agency validation surface changes, not for every UI-only edit. Current trigger scope:

- `tools/agency-validation/**`
- `mind/schemas/**`
- `mind/requirements/**`
- `package.json`
- `.github/workflows/agency-validation.yml`

This keeps the lane cheap while still catching schema, requirement, runner, and command-surface drift.

### 4. Evidence artifact over console dependence

The workflow uploads `artifacts/agency-validation/fixture-parity-report.json` as an artifact. Console output remains a short human summary; durable evidence remains JSON.

### 5. Minimal permissions

The workflow uses read-only repository contents permission. It does not need write permissions, secrets, deployments, issue access, or package publishing.

## Implementation completed

### Updated package scripts

`package.json` now includes agency-only verification scripts:

- `test:agency`
- `fixture-parity:smoke`
- `verify:agency`

### Added workflow

Added `.github/workflows/agency-validation.yml` with:

- push and pull request path filters
- manual dispatch
- Node 22 setup
- `npm run verify:agency`
- artifact upload for the fixture parity report
- read-only contents permission
- five-minute timeout

## Public-safe requirement update

MC validation checks must remain public-safe and artifact-oriented:

1. Validation evidence must not depend on private chat/person data.
2. CI output must expose only abstract fixture/report paths and compact status text.
3. Full evidence should live in JSON artifacts, not in long console logs.
4. The agency validation lane must be callable locally and in CI through the same npm script.
5. App build failures must not mask fixture parity runner failures.

## Acceptance criteria

A valid implementation satisfies all of the following:

- Running `npm run verify:agency` does not invoke `next build`.
- Parser and runner shell tests execute through Node's built-in test runner.
- The smoke runner writes `artifacts/agency-validation/fixture-parity-report.json`.
- GitHub Actions uploads the report artifact when present.
- CI triggers only for agency validation, schema, requirement, package script, or workflow changes.
- Workflow permissions are read-only.

## Changed understanding

Before this pass, repository verification was one broad concept: prove the repo by running the app-oriented verification path. The better architecture is a two-lane verification model:

- **Application lane:** proves the user-facing Next.js app can typecheck/build.
- **Agency validation lane:** proves MC's evidence machinery, schemas, runner shell, and failure-report contract without requiring the application to build.

That separation makes the architecture more legible to humans, CI, and later repair agents.

## Next research question

How should MC validate the generated `fixture-parity-report.json` against `mind/schemas/fixture-parity-failure-report.v1.schema.json` inside the dependency-free runner lane without introducing Ajv or weakening the schema contract?
