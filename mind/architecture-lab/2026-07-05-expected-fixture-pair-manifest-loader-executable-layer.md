# Expected fixture pair manifest loader executable layer

Date: 2026-07-05
Status: implemented prototype / declaration-custody layer
Public-safety level: public-safe; private material abstracted

## Architecture question

How should MC implement `tools/lib/expected-fixture-pair-manifest-loader.mjs` and its synthetic tests in the smallest commit that proves manifest SHA-256 ownership, Ajv2020 validation, registry-backed `GHF_*` checks, and root containment without touching generated or expected fixture bytes?

## What changed in understanding

The expected-fixture chain needed one missing surface before byte verification: a manifest schema plus a loader that owns declaration custody. The loader is now explicitly separate from:

- byte comparison;
- compare-result schema validation;
- fixture blessing or update behavior;
- SLSA-style provenance;
- GitHub Actions Markdown summary emission.

The byte verifier can now consume a normalized manifest object instead of reimplementing schema identity checks, manifest hashing, path containment, or check-code normalization.

## Research basis

- Node path behavior is OS-sensitive, so path containment must use resolved paths plus `path.relative(...)`, not simple string prefix checks.
- Ajv draft-2020-12 validation must use the Ajv2020 class, and local `$id` values must be added explicitly rather than treated as network-fetch instructions.
- GitHub Actions secure-use guidance treats workflow context and derived text as potentially untrusted, so manifest contents must be validated before they become control input.
- GitHub job summaries persist as Markdown output surfaces, so loader diagnostics must remain bounded and public-safe even before a summary emitter exists.
- 2026 agentic workflow-injection research shows that agent-consumed repository text and derived outputs can become security-sensitive workflow inputs; MC should treat manifest files as custody surfaces, not passive configuration.

## Implemented artifacts

### Schema

`mind/schemas/governance.expected-fixture-pair-manifest.v1.schema.json`

Defines the manifest declaration shape:

- schema identity: `governance.expected-fixture-pairs.v1`;
- generated and expected fixture roots;
- verify-only byte-SHA256 policy;
- canonical manifest and pair-level `GHF_*` check codes;
- pair declarations with generated/expected repository-relative paths.

### Loader

`tools/lib/expected-fixture-pair-manifest-loader.mjs`

The loader now:

1. rejects non-repository-relative manifest and schema paths;
2. reads only the schema file and manifest file;
3. computes `manifest_sha256` from raw manifest bytes before parsing;
4. validates schema `$id` against the expected manifest schema identity;
5. compiles the manifest schema with isolated Ajv2020;
6. validates manifest shape;
7. validates declared `GHF_*` codes against a known canonical set supplied by default or injection;
8. resolves generated and expected roots;
9. validates every pair path is contained under the declared root;
10. returns normalized public paths plus internal absolute paths under `internalResolvedPaths` only.

### Tests

`tools/lib/expected-fixture-pair-manifest-loader.test.mjs`

Synthetic tests cover:

- valid manifest normalization;
- manifest SHA-256 shape;
- success check emission;
- proof that only schema and manifest files are read;
- schema `$id` mismatch failure;
- malformed JSON public-safe failure;
- schema-invalid manifest failure;
- unknown `GHF_*` failure;
- generated-root escape rejection;
- repository-relative path guard behavior.

### Script update

`package.json`

`test:governance` now includes both governance-validation tests and `tools/lib/*.test.mjs`, making the loader part of the executable governance validation lane.

## Boundary decisions

- The manifest loader may use Ajv2020. The byte verifier should not.
- The loader owns manifest SHA-256 because it reads raw manifest bytes first.
- The loader may return internal absolute paths for later byte reading, but result writers and summary emitters must never serialize `internalResolvedPaths`.
- The loader currently uses a canonical default `GHF_*` set with injection support. A later registry file can replace the default without changing the byte verifier contract.
- The loader intentionally does not validate compare-result JSON. That remains the validator's job.

## Added commits

- `11e7a60f701f4657c02b5a82a1013e2030bdf4e9` — add expected-fixture pair manifest schema.
- `7a99179c4b9df3dce8064120f7ee56c570d2c2ae` — add expected-fixture pair manifest loader.
- `19efec485102ec5fa098ebd8862debe9b89d1f8f` — add synthetic loader tests.
- `66960c45da6c7d79401116ded8ced7d8272974c2` — include lib tests in `test:governance`.

## Known limitation

The GitHub connector write path does not execute the repository test suite. The implementation is committed, but CI/local execution should still run:

`npm run test:governance`

## Next architecture question

How should MC implement the byte verifier now that the manifest loader exists, so it consumes normalized declarations, computes generated/expected SHA-256 digests, calls the compare-result validator as a postwrite gate, rejects unlisted generated outputs, and emits deterministic result JSON plus Markdown summary without serializing `internalResolvedPaths`?

## Source links

- Node path documentation: https://nodejs.org/api/path.html
- Ajv JSON Schema draft-2020-12 documentation: https://ajv.js.org/json-schema.html
- Ajv schema management documentation: https://ajv.js.org/guide/managing-schemas.html
- GitHub Actions secure-use reference: https://docs.github.com/en/actions/reference/security/secure-use
- GitHub Actions workflow commands / job summaries: https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-commands
- Agentic Workflow Injection paper: https://arxiv.org/abs/2605.07135
