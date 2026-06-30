# Path Authority + Schema Registry Implementation

## Architecture question

How should MC implement `path-authority.mjs` and `schema-registry.mjs` as the first real runner support files, including minimal tests that prove absolute paths, URL inputs, and parent traversal are rejected before any validator runs?

## Public-safe answer

The agency validation runner now treats local path resolution as a trust boundary. Schema and fixture inputs are not passed directly to validators. They first pass through a small path authority that accepts only repository-relative, forward-slash paths resolving inside the repository root.

This keeps the runner deterministic, diffable, and safe for CI. Ajv and python-jsonschema remain evidence engines. They do not decide which files may be loaded.

## Source concepts extracted

### Node ESM path grounding

Node ESM exposes module-local location through `import.meta.dirname`, `import.meta.filename`, and `import.meta.url`. The runner should derive its repository root from the module location, not from the caller's current working directory. That prevents local runs and CI runs from resolving different files.

Implementation consequence: `path-authority.mjs` derives `REPO_ROOT` from its own module path, then resolves all requested paths under that root.

### Reject URL-shaped and absolute inputs

Node treats ESM modules as URLs and supports `file:`, `node:`, and `data:` URL schemes in its module-resolution model. For MC's validation runner, schema and fixture inputs should not be URL specifiers at all. They should be stable repo-relative display paths.

Implementation consequence: `path-authority.mjs` rejects URL-like schemes, drive-shaped paths, absolute paths, NUL bytes, Windows separators, and parent traversal that resolves outside the repository.

### Ajv local schema registration

Ajv supports `addSchema`, uses a provided key or schema `$id`, and allows added schemas to be referenced by later validations. This supports a deterministic in-memory registry built from `mind/schemas`.

Implementation consequence: `schema-registry.mjs` recursively loads local JSON schemas, requires each schema to declare a string `$id`, rejects duplicate `$id`s, and registers schemas in Ajv 2020 mode.

### Python parity requirement

python-jsonschema's current referencing model supports immutable in-memory registries. Its documentation recommends loading a fixed set of local schemas into memory for static schema sets instead of relying on live remote retrieval.

Implementation consequence: the JavaScript schema registry is now shaped so a later Python parity registry can mirror it: same repo-relative schema set, same `$id` requirement, same no-network behavior.

### CI security posture

GitHub's workflow security model depends on least privilege for the `GITHUB_TOKEN`; recent research also continues to show that coarse job-level permissions can increase blast radius. MC's validation runner should therefore stay read-only, no secrets, no network, no untrusted path input.

Implementation consequence: the current support files are pure local readers. The CI workflow should later use read-only permissions and pinned actions.

## Files added

- `tools/agency-validation/path-authority.mjs`
- `tools/agency-validation/schema-registry.mjs`
- `tools/agency-validation/path-authority.test.mjs`

## Durable pattern

Name: Path Authority Before Validation

Rule: all schema, fixture, expected-output, raw-capture, manifest, and report paths must be accepted by `path-authority.mjs` before read or write.

Forbidden inputs:

- absolute paths
- URL-shaped paths
- file URLs
- drive-shaped paths
- parent traversal outside the repository
- Windows separators in report-facing paths
- NUL bytes
- paths with the wrong required extension when an extension is specified

Allowed inputs:

- repo-relative POSIX-style paths that resolve inside the repository root

## What changed in understanding

Before this run, path handling looked like helper code.

After this run, path handling is the first validation gate. It protects the integrity of every later repair receipt and convergence report. If the runner can be tricked into reading the wrong file, then validator agreement is meaningless.

## Implementation notes

`path-authority.mjs` exports:

- `REPO_ROOT`
- `PathAuthorityError`
- `assertSafeRepoRelativePath(input, options)`
- `repoRelativeDisplayPath(absolutePath)`

`schema-registry.mjs` exports:

- `DEFAULT_SCHEMA_DIR`
- `loadJsonFile(repoRelativePath)`
- `loadSchemaRecords(schemaDir)`
- `buildAjvRegistry(schemaDir)`
- `getAjvSchema(schemaId, schemaDir)`

`path-authority.test.mjs` proves the first boundary cases:

- valid repo-relative JSON path accepted
- absolute path rejected
- file URL rejected
- HTTPS URL rejected
- parent traversal rejected
- Windows separators rejected
- display paths normalize to forward slashes

## Next research question

How should MC add the Python parity registry and the first end-to-end runner command so Node/Ajv and Python/jsonschema load the same local schema set, reject the same unsafe path classes, and write a convergence report without network access?
