# Python parity registry and offline runner boundary

Date: 2026-06-30

## Architecture question

How should MC add the Python parity registry and first end-to-end runner command so Node/Ajv and Python/jsonschema load the same local schema set, reject the same unsafe path classes, and write a convergence report without network access?

## Short answer

Treat Python parity as a second implementation of the same trust boundary, not as a second interpretation layer.

The runner should have one repository path authority, one local schema inventory, two validator adapters, and one convergence target:

1. **Path authority first**: reject unsafe path inputs before reading files or constructing validators.
2. **Schema inventory second**: load every local JSON schema from `mind/schemas`, require string `$id`, reject duplicate `$id`, and keep a deterministic sorted inventory.
3. **Validator adapters third**: pass the same inventory into Ajv and python-jsonschema using each library's native registry mechanism.
4. **Report writer last**: write raw captures, canonical repair receipts, run manifest, convergence JSON, and reviewer Markdown.

Validator agreement means: both adapters map a fixture to the same governed repair category. It does not mean that MC has established symbolic truth.

## Current repo state this extends

Existing Node files already establish the first half of the boundary:

- `tools/agency-validation/path-authority.mjs`
- `tools/agency-validation/schema-registry.mjs`
- `tools/agency-validation/path-authority.test.mjs`

The next implementation should add Python parity without weakening that boundary.

## Useful concepts extracted from current sources

### Python/jsonschema

The modern `jsonschema` path for custom reference resolution is the `referencing` library. A `Registry` is an immutable set of schema resources, and validators accept that registry at construction time. `Resource.from_contents` can inspect `$schema`; `DRAFT202012.create_resource` can force Draft 2020-12 where needed.

The documentation specifically distinguishes fixed in-memory schemas from dynamic filesystem retrieval. For MC, fixed in-memory loading is the safer default: read local schemas through MC path authority, then create the registry. Avoid a dynamic filesystem `retrieve` callable until a specific use case requires it.

The same documentation warns that automatic network retrieval has security implications and that legacy `RefResolver` behavior is deprecated. MC should not rely on implicit remote resolution.

### Ajv

Ajv supports local schema combination through `$id` / `$ref` and explicit schema registration. MC should keep using explicit registration through the local schema inventory rather than allowing validator-specific discovery.

### Node / filesystem boundary

Node path APIs are string transformation utilities, not a complete security boundary on their own. MC already wraps them with explicit rejection of URL-shaped inputs, absolute paths, Windows separators, NUL bytes, and repo escapes. Python parity should mirror those rejection classes instead of inventing new names.

### Supply-chain / execution boundary

Recent Node supply-chain security research keeps pointing at the same principle: reduce runtime capability and make allowed resources explicit. MC's runner should therefore stay narrow: no network access, no secrets, no arbitrary path reads, and no plugin-style validator discovery.

## Design decision

Create a Python module with the same conceptual exports as the Node side:

- `REPO_ROOT`
- `PathAuthorityError`
- `assert_safe_repo_relative_path(input, must_end_with=None)`
- `repo_relative_display_path(absolute_path)`
- `load_json_file(repo_relative_path)`
- `load_schema_records(schema_dir="mind/schemas")`
- `build_jsonschema_registry(schema_dir="mind/schemas")`
- `get_jsonschema_validator(schema_id, schema_dir="mind/schemas")`

The Python registry builder should:

1. resolve `schema_dir` through path authority;
2. recursively list only `.json` files;
3. parse JSON as UTF-8;
4. require each schema to have a string `$id`;
5. reject duplicate `$id` values;
6. construct `referencing.Registry().with_resources(...)` from in-memory `Resource` objects;
7. return both the registry and deterministic schema records.

## Required rejection parity

The Python tests should prove the same unsafe classes are rejected before validation:

- empty path;
- NUL byte;
- URL-shaped path including `file://`, `http://`, and `https://`;
- absolute POSIX path;
- Windows absolute drive path;
- Windows backslash separator;
- parent traversal outside repo;
- wrong extension when `must_end_with` is set.

The exact exception text may differ. The stable comparison target is the error `code`.

## Runner boundary pattern

The first end-to-end command should be deterministic and local:

`node tools/agency-validation/run-agency-validation.mjs --fixture-pack mind/fixtures/agency-near-miss/v1/expected-output-pack.seed-001-003.json --out .mc-validation-runs/seed-001-003`

The Node runner may call Python as a subprocess only after path authority has accepted the fixture pack and output directory. Python should receive only repo-relative paths already accepted by the same policy, then independently re-check them.

This double-check is intentional. Node and Python are separate execution surfaces, so each surface must enforce the boundary before file access.

## Output contract

The first command should write:

- `manifest.json`: self-validating run manifest;
- `raw/ajv/*.json`: raw Ajv captures;
- `raw/python-jsonschema/*.json`: raw python-jsonschema captures;
- `canonical/*.json`: normalized repair receipts;
- `convergence-report.json`: machine-readable convergence result;
- `convergence-report.md`: reviewer-readable explanation.

Only canonical repair receipts and the convergence report decide CI status. Raw captures are evidence for debugging.

## Minimal implementation order

1. Add `tools/agency-validation/path_authority.py`.
2. Add `tools/agency-validation/schema_registry.py`.
3. Add Python parity tests for unsafe path classes and duplicate `$id` rejection.
4. Add a minimal Python validator probe that loads one fixture and returns raw validation errors as JSON.
5. Add the Node orchestrator that runs Ajv and Python probes against the three seed fixtures.
6. Validate manifest and convergence report against MC schemas before CI reads status.

## Public-safe constraint

Fixtures and reports must stay abstract. They may describe agency-preserving validation behavior, caution, missing evidence, and format boundaries. They must not include private personal material, medical details, relationship history, or raw chat excerpts.

## Durable requirement update

MC validation infrastructure now has this requirement:

> Every validator implementation must prove local schema resolution through the same governed path classes before it may produce raw captures or canonical repair receipts. No validator adapter may fetch schemas from the network, read arbitrary filesystem paths, or treat raw validator wording as CI truth.

## Next research question

How should MC define the Python raw-error serializer for `jsonschema.ValidationError` so it preserves enough debugging evidence (`message`, `validator`, `validator_value`, `path`, `schema_path`, `context`) while producing stable canonical repair receipts that do not depend on message wording or error ordering?

## Sources consulted

- Python jsonschema documentation: JSON Schema referencing, `referencing.Registry`, `Resource`, in-memory resources, filesystem retrieval, HTTP retrieval warning, and migration away from `RefResolver`.
- Ajv documentation: schema combination and explicit schema registration using `$id` / `$ref`.
- Node.js documentation: ESM `import.meta.dirname` and path utilities.
- Recent Node supply-chain/security research on limiting runtime capability and dependency attack surface.
