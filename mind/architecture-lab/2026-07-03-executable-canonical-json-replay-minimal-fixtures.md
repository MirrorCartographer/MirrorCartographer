# Executable canonical JSON replay with minimal fixtures

Public-safe: this note contains only abstract governance/toolchain architecture. It contains no private user material.

## Architecture question researched

How should MC define the first executable `tools/replay-governance-canonical-json-fixtures.mjs` implementation and minimal fixture set so the tool can run locally and in GitHub Actions without adding unnecessary workflow complexity or weakening public-safety guarantees?

## Sources checked

- Node.js test runner documentation, especially the existence of built-in snapshot and reporter facilities.
- GitHub Actions workflow command documentation for annotations and job summaries.
- RFC 8785 / JSON Canonicalization Scheme for canonical JSON and hash stability boundaries.
- Ajv JSON Schema documentation for Draft 2020-12 validation context.
- 2026 GitHub Actions reliability research showing that workflow complexity correlates with maintainability/reliability risk.

## Updated understanding

The canonical JSON replay layer should not begin as a complex test framework. For MC governance, the first executable layer should be a small compiler-style CLI that produces durable artifacts:

1. a canonical JSON replay result envelope,
2. a Markdown summary for human maintainers,
3. GitHub annotation lines for failed checks,
4. stable process exit behavior.

Node's test runner and snapshot support are useful later, but the first replay tool should avoid depending on runner-specific snapshot formats. The governance artifact itself should be the source of truth; test runners and CI summaries are only presentation surfaces.

GitHub Actions annotations and job summaries are appropriate output channels, but they must be generated from normalized check objects rather than handcrafted strings. This avoids drift between machine-readable and human-readable failure channels.

RFC 8785/JCS reinforces that hashing must operate on canonical UTF-8 JSON bytes, not arbitrary `JSON.stringify()` output. MC already has a shared helper, so replay should import that helper instead of reimplementing canonicalization.

Recent GitHub Actions reliability research supports a minimal workflow strategy: add the smallest possible executable boundary first, then expand only after stable artifacts exist.

## Implemented result

### Added executable

`tools/replay-governance-canonical-json-fixtures.mjs`

Behavior:

- reads JSON fixtures from `mind/fixtures/governance.canonical-json.v1` by default,
- imports `tools/lib/governance-canonical-json.mjs`,
- computes canonical JSON and SHA-256 for each fixture input,
- compares actual outputs against fixture expectations,
- writes canonical JSON result envelope to `artifacts/governance/canonical-json-replay-result.json`,
- writes Markdown summary to `artifacts/governance/canonical-json-replay-summary.md`,
- appends Markdown to `GITHUB_STEP_SUMMARY` when running in GitHub Actions,
- emits GitHub annotation commands for failed checks,
- exits `0` only when every check passes; otherwise exits `1`.

### Added minimal fixture corpus

`mind/fixtures/governance.canonical-json.v1/pass-empty-object.json`

- proves the known canonical form `{}`
- proves the SHA-256 hash `44136fa355b3678a1146ad16f7e8649e94fb4fc21fe77e8310c060f61caaff8a`

`mind/fixtures/governance.canonical-json.v1/fail-hash-mismatch.json`

- intentionally expects the wrong hash for `{}`
- proves the replay tool can report a stable hash mismatch check

## Design pattern added

### Compiler replay over ad hoc tests

Canonical JSON fixture replay is now modeled as a governance compiler pass:

```text
fixture corpus
  -> shared canonical JSON helper
  -> replay checks
  -> canonical replay result JSON
  -> generated Markdown summary
  -> optional CI annotations
  -> stable exit code
```

The key rule is: **the normalized replay result is the authoritative artifact; Markdown and annotations are generated views.**

## Requirements added

- Replay fixtures must remain public-safe and must not encode private/personal data.
- Replay output must be deterministic across local and CI environments.
- The tool must not depend on network calls.
- The tool must not use mutable timestamps in the replay envelope.
- Failed checks must include stable check codes.
- Human-readable summaries must be generated from the same checks used in machine-readable JSON.
- Workflow integration should remain minimal until the replay artifact format is stable.

## Known limitation

This first executable does not yet validate fixture files against a JSON Schema before replay. That should be added after the replay result envelope and fixture schema are confirmed stable.

## Next architecture question

How should MC define the GitHub Actions workflow for canonical JSON replay so it runs this tool with least privilege, uploads or preserves replay artifacts, avoids workflow complexity traps, and blocks governance changes only on stable check failures?
