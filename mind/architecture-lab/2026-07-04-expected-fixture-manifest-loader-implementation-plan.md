# Expected fixture manifest loader implementation plan

Status: architecture note / prototype plan
Public safety: public-safe; no private user material, no absolute runtime paths, no secrets

## Architecture question

How should MC implement `tools/lib/expected-fixture-pair-manifest-loader.mjs` with injected reads, draft-2020-12 validation, registry checks, containment checks, and no absolute-path leakage?

## Research basis

Current source review produced five implementation constraints:

1. Ajv draft-2020-12 must be isolated from older JSON Schema drafts. Ajv documents draft-2020-12 as breaking and says draft-2020-12 cannot be mixed with previous JSON Schema versions in the same Ajv instance. The loader should therefore own a small validator factory dedicated to the `governance.expected-fixture-pairs.v1` schema.
2. JSON Schema is necessary but not sufficient. The manifest schema can constrain shape, public-safe relative path syntax, required fields, conditional fields, and constants, but it cannot prove repository-root containment after path resolution or verify that declared check codes exist in the append-only registry.
3. Node path handling should treat containment as a resolved-path relation, not a string prefix relation. The loader should normalize repository-relative input, resolve it against an injected `repoRoot`, then confirm that the resolved child remains inside the resolved root.
4. Filesystem access should be injectable. The first loader needs exactly two reads: one for the manifest JSON and one for the schema JSON. Fixture bytes must not be read by this loader. The later verifier owns byte comparison.
5. GitHub Actions output is an emission boundary. Any loader failure exported into summaries, annotations, or result files must use normalized checks and repository-relative locations only.

## Existing repository facts

The expected-fixture pair schema already requires a manifest id, generated and expected roots, reject-only unexpected output policy, verify-only update policy, and one or more declared fixture pairs. Each pair declares generated and expected paths, byte SHA-256 comparison, public API status, and check codes for match, drift, missing generated, and missing expected states.

The first manifest already declares three public API pairs for the dry-run artifact-manifest-helper path: `result.json`, `summary.md`, and `output-record.json`.

The check helper already contains the `GHF` expected-fixture prefix and expected-fixture check codes for schema-valid manifests, schema-invalid manifests, matched pairs, drifted pairs, missing generated files, missing expected files, and unlisted generated output.

## Loader boundary

The loader is not a comparer. It is a declaration-custody gate.

It should return one stable object:

- `manifest`: parsed manifest JSON after schema validation
- `pairs`: normalized pair declarations in manifest order
- `roots`: repository-relative generated and expected roots, plus internal resolved roots that are never emitted publicly
- `checks`: normalized governance checks created through `createReplayCheck()`

It should fail closed before any fixture read when:

- the manifest file cannot be read
- the schema file cannot be read
- manifest JSON is invalid
- schema validation fails
- any pair references an unknown check code
- any root or pair path escapes its declared root after resolution
- any generated or expected path is not contained by its declared root
- any public output would require an absolute runtime path

## Proposed module surface

`loadExpectedFixturePairManifest(options)`

Required options:

- `repoRoot`: absolute runtime root, used internally only
- `manifestPath`: repository-relative path to the manifest JSON
- `schemaPath`: repository-relative path to the schema JSON
- `readTextFile`: injected async or sync text reader; receives an absolute path but errors must be redacted before checks are emitted
- `pathApi`: optional injection for tests; defaults to Node `path`
- `Ajv2020`: injected constructor or imported dependency once the dependency decision is made

The public return object must not include absolute paths.

## Validation order

1. Validate `manifestPath` and `schemaPath` against the existing repository-relative path rule before resolving.
2. Resolve `repoRoot`, `manifestPath`, and `schemaPath`; assert both files are contained by `repoRoot`.
3. Read schema JSON.
4. Read manifest JSON.
5. Parse schema and manifest JSON with public-safe parse errors.
6. Compile with an isolated Ajv2020 instance.
7. Validate manifest against schema.
8. Validate declared check-code references against `CHECK_CODES`.
9. Resolve `generated_root` and `expected_root`; assert both are contained by `repoRoot`.
10. For each pair, resolve `generated_path` and `expected_path`; assert each stays inside its declared root.
11. Return normalized declarations and a `GHF_MANIFEST_SCHEMA_VALID` check.

Failure ordering matters: schema and declaration custody must complete before byte custody begins.

## Check emission pattern

Successful load:

- emit `GHF_MANIFEST_SCHEMA_VALID`
- location path: manifest path only
- safe details: manifest id, pair count, generated root, expected root

Schema or parse failure:

- emit `GHF_MANIFEST_SCHEMA_INVALID`
- location path: manifest path or schema path, whichever failed
- safe details: failure class, sanitized keyword or JSON pointer when available

Registry or containment failure:

- use `GHF_MANIFEST_SCHEMA_INVALID` for now, because the failure means the declaration is invalid before fixture comparison
- safe details should name only the pair id, field name, and repository-relative path; do not emit resolved absolute paths

## Dependency decision

The implementation should not silently assume Ajv is available. `package.json` currently does not declare `ajv`. The next implementation step should either:

1. add `ajv` as a dev dependency and implement the loader with `import Ajv2020 from 'ajv/dist/2020.js'`, or
2. inject the Ajv2020 constructor from the caller/test harness until the dependency is explicitly added.

Preferred path: add Ajv as a dev dependency when the executable loader lands. The schema already uses draft-2020-12, and custom partial validation would create a second, less trustworthy schema interpreter.

## Minimal tests

The first test set should prove only declaration custody:

1. valid manifest returns one `GHF_MANIFEST_SCHEMA_VALID` check and three normalized pairs
2. invalid JSON fails before schema validation details are emitted
3. missing required manifest field fails before any fixture path is touched
4. unknown check code fails before byte comparison
5. generated path outside `generated_root` fails closed
6. expected path outside `expected_root` fails closed
7. absolute host paths never appear in public checks
8. injected read calls are limited to schema and manifest files only

## Implementation invariant

The manifest loader may read schema and manifest declarations. It may not read generated fixtures, expected fixtures, artifact output records, or provenance subjects. That separation keeps declaration custody auditable before byte custody exists.

## Next architecture question

How should MC add Ajv as an explicit dev dependency and implement the first `tools/lib/expected-fixture-pair-manifest-loader.mjs` plus tests so the dependency boundary, injected reads, path containment, registry validation, and public-safe errors are executable in CI without changing the fixture comparison contract?
