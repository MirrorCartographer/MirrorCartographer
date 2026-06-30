# Deterministic local path resolution pattern

Date: 2026-06-30
Status: implementation pattern
Scope: public-safe MC architecture lab

## Architecture question

How should MC write the actual `run-agency-validation.mjs` and `py_validate_fixture.py` implementations so local validation resolves schemas and fixture paths deterministically without network access or brittle absolute paths?

## Research basis

Current sources checked:

- Node.js ECMAScript Modules documentation: https://nodejs.org/api/esm.html
- JSON Schema modular structuring and compound schema document guidance: https://json-schema.org/understanding-json-schema/structuring
- Ajv combining schemas and reference resolution guidance: https://ajv.js.org/guide/combining-schemas.html
- python-jsonschema 4.26.0 referencing documentation: https://python-jsonschema.readthedocs.io/en/stable/referencing/
- Recent JSON Schema reasoning research: https://arxiv.org/abs/2603.25306

## Useful concepts extracted

1. Module-relative loading is stable when the module owns its own anchor.
   - Node ESM exposes `import.meta.url` as the absolute file URL of the current module.
   - Node supports relative file loading from `new URL('./path', import.meta.url)`.
   - `.mjs` files explicitly declare ESM behavior and avoid ambiguity with CommonJS.

2. Repository-relative paths should be normalized once at the boundary.
   - The runner should accept repo-relative input paths such as `mind/fixtures/...`.
   - It should discover the repository root by walking upward from `tools/agency-validation/run-agency-validation.mjs` until it finds a repo sentinel such as `.git`, `mind/`, and `tools/`.
   - After discovery, every input path becomes an absolute path under that root.
   - The runner must reject paths that escape the repository root after normalization.

3. JSON Schema URI identity is not file-system identity.
   - Ajv states that `$ref` resolution uses URI references and schema `$id`; the physical file location is not used for reference resolution.
   - Therefore MC should register schemas by their `$id` and, when necessary, by an explicit local alias.
   - File paths are used for loading bytes; `$id` values are used for schema identity.

4. Offline validation should pre-load schema resources.
   - Ajv can receive all known schemas through the `schemas` option or `addSchema` before compilation.
   - python-jsonschema / referencing can use an in-memory `Registry` with resources, and its docs recommend reading fixed local schema files into memory for static schema sets.
   - MC should prefer pre-loaded in-memory registries over dynamic filesystem callbacks for the first runner.

5. Dynamic file resolution is a second-phase feature.
   - python-jsonschema supports filesystem-backed retrieval for dynamic reference resolution, but that adds another trust boundary.
   - First runner should fail closed on unknown schema IDs rather than read arbitrary files during validation.

6. Schema complexity argues for explicit boundaries.
   - Current JSON Schema research continues to show that schema reasoning and inclusion can become complex.
   - MC should avoid clever implicit discovery during validation and make the path/schema map inspectable.

## Changed understanding

The path resolver is part of the security and reproducibility layer, not a helper detail.

The runner needs two separate maps:

1. `path_map`: repo-relative path -> absolute local path under repo root.
2. `schema_registry`: schema `$id` or local alias -> in-memory schema resource.

Those maps must be created before validation. Validator code should not decide where files come from after validation starts.

## Durable design pattern

Name: `RepoRootPathAndSchemaRegistry.v1`

### Boundary rule

All command-line path inputs must be repo-relative unless explicitly marked as generated output roots. Absolute input paths are rejected by default.

Allowed inputs:

- `--pack mind/fixtures/agency-near-miss/v1/expected-output-pack.seed-001-003.json`
- `--out mind/reports/agency-validation/runs/local-latest`

Rejected inputs:

- `/tmp/pack.json`
- `../../private-chat-export.json`
- `https://example.com/schema.json`
- `file:///tmp/schema.json`

### Root discovery rule

The Node runner should:

1. Resolve its own directory from `import.meta.url`.
2. Walk upward until it finds repository sentinels.
3. Prefer the first directory containing all of:
   - `mind/`
   - `tools/agency-validation/`
4. Optionally accept `--repo-root` only for tests, still requiring the sentinel check.
5. Store the discovered root in `manifest.json` as a relative marker, not as a private absolute path.

### Safe path join rule

Implement one path authority function:

- `resolveRepoPath(repoRoot, repoRelativePath, role)`

It must:

1. Reject empty paths.
2. Reject URL-like inputs.
3. Reject absolute paths.
4. Normalize separators.
5. Resolve against repo root.
6. Verify the resolved path remains inside repo root.
7. Verify existence for read roles.
8. Create parent directories only for write roles.
9. Return both repo-relative and absolute forms.

### Schema registry rule

Implement one schema preload function:

- `loadSchemaRegistry(repoRoot)`

It should load only an allowlist, initially:

- `mind/schemas/agency-near-miss-fixture.v1.schema.json`
- `mind/schemas/agency-validator-expected-output-pack.v1.schema.json`
- `mind/schemas/raw-validator-error-capture.v1.schema.json`
- `mind/schemas/canonical-validation-error.v1.schema.json`
- `mind/schemas/agency-validation-run-manifest.v1.schema.json`
- `mind/schemas/agency-convergence-report.v1.schema.json`
- `mind/schemas/repair-category-map.v1.schema.json`

For each schema:

1. Load from repo-relative allowlisted path.
2. Parse JSON.
3. Require `$schema` when the schema is meant to declare its dialect.
4. Require `$id` when the schema is meant to be referenced by ID.
5. Register by `$id`.
6. Register a local alias such as `mc://schema/<filename>` only if `$id` is absent or unstable.
7. Fail on duplicate `$id` or duplicate alias.

### Ajv implementation rule

Ajv should be initialized with explicit schemas already loaded.

Expected pattern:

- create Ajv instance with deterministic options,
- add all allowlisted schemas,
- compile the target fixture schema by known `$id` or local alias,
- validate each fixture,
- capture raw errors without using raw message text as CI truth.

The runner should not use Ajv async compilation for the first implementation because async loading can blur the no-network boundary.

### Python implementation rule

`py_validate_fixture.py` should receive absolute paths only from the trusted Node wrapper, not from user-facing CLI inputs.

The Python helper should:

1. Load the fixture from the absolute path provided by Node.
2. Load the same allowlisted schema files from absolute paths provided by Node or a generated schema manifest.
3. Create an in-memory `referencing.Registry`.
4. Use `Draft202012Validator` with the registry.
5. Emit raw structured errors as JSON to stdout.
6. Never fetch remote schemas.
7. Never read paths that were not passed by the Node wrapper.

### Report rule

Reports should store repo-relative paths, not machine-private absolute paths.

Allowed report fields:

- `fixture_path: mind/fixtures/...`
- `schema_path: mind/schemas/...`
- `runner_path: tools/agency-validation/run-agency-validation.mjs`

Disallowed report fields:

- full home directory paths,
- temp directories containing user names,
- local clone absolute paths,
- environment variable dumps.

## Prototype plan

### File to add first

`tools/agency-validation/lib/path-authority.mjs`

Responsibilities:

- `findRepoRoot(startUrlOrPath)`
- `resolveRepoPath(repoRoot, repoRelativePath, role)`
- `assertInsideRepo(repoRoot, absolutePath)`
- `toRepoRelative(repoRoot, absolutePath)`
- `rejectUrlOrAbsoluteInput(input)`

### File to add second

`tools/agency-validation/lib/schema-registry.mjs`

Responsibilities:

- `SCHEMA_ALLOWLIST`
- `loadSchemaRegistry(repoRoot)`
- `loadSchemaByRepoPath(repoRoot, repoPath)`
- `schemaIdOrAlias(schema, repoPath)`
- `assertNoDuplicateSchemaIds(entries)`

### File to add third

`tools/agency-validation/schema-manifest.generated.json`

Generated or maintained shape:

```json
{
  "schemas": [
    {
      "repo_path": "mind/schemas/agency-near-miss-fixture.v1.schema.json",
      "schema_id": "<read-from-$id>",
      "alias": "mc://schema/agency-near-miss-fixture.v1"
    }
  ]
}
```

This manifest lets the Python helper receive a finite schema set without rediscovering files.

## Acceptance criteria

The next implementation passes this pattern when:

1. Running from repo root works.
2. Running from `tools/agency-validation/` works.
3. Running from another current working directory works if the script path is explicit.
4. Absolute `--pack` is rejected.
5. `../` escape in `--pack` is rejected.
6. Unknown schema `$ref` fails closed.
7. Reports contain repo-relative paths only.
8. No network call is needed for schema resolution.
9. Ajv and python-jsonschema receive the same schema allowlist.
10. Private/personal paths are not written into artifacts.

## Durable decision

MC runner pathing must be repository-rooted, allowlist-driven, and schema-ID-aware. File paths load local bytes. Schema IDs define validation identity. Reports expose repo-relative evidence only.

## Next research question

How should MC implement `path-authority.mjs` and `schema-registry.mjs` as the first real code files, including minimal tests that prove absolute paths, URL inputs, and `../` escapes are rejected before any validator runs?
