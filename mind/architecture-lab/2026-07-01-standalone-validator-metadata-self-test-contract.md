# Standalone Validator Metadata + Self-Test Contract

Date: 2026-07-01
Status: architecture requirement
Scope: public-safe MC agency validation / schema governance

## Architecture question

How should MC design the minimal `standalone-validator-metadata.v1.schema.json` and generated-validator self-test fixtures so validator freshness, ESM importability, and Ajv-runtime isolation are proven in CI without coupling to the full app build?

## Research summary

Ajv standalone validation has a two-step build/runtime shape: generate validation code during build time, then import the generated validation function at runtime. Ajv documents this as a way to avoid runtime schema compilation and reduce startup cost, while also noting that generated standalone modules may still depend on Ajv runtime helper code unless bundled into complete isolation.

Ajv's Draft 2020-12 support is dialect-specific: draft-2020-12 is not backwards compatible with earlier drafts and cannot be mixed with previous JSON Schema versions in the same Ajv instance. That means MC validator generation must record the dialect used and must not treat validator output as dialect-agnostic.

Node gives the required dependency-free primitives for the verification lane: `node:crypto` can compute SHA-256 digests for exact artifact bytes, and `node:test` can import generated ESM modules, run positive/negative fixtures, and assert metadata invariants without pulling in the Next.js app build.

## Useful concepts extracted

1. Generation artifact, not runtime feature

   The generated validator is a governance artifact created by a build-time generator. The runtime runner should not import Ajv or compile schemas.

2. Freshness by content hash

   Freshness should be proven by `schema_sha256` and `validator_sha256`, not by timestamps. `generated_at` is useful audit metadata, but it is not the trust anchor.

3. Dialect lock

   The metadata must declare `schema_dialect: draft-2020-12`. Any future migration to another dialect should be a versioned governance event.

4. ESM importability as a first-class test

   CI should dynamically import the generated `.mjs` validator and assert that its exported function validates known-good and known-bad fixtures.

5. Runtime dependency policy must be explicit

   Ajv standalone output may still import Ajv runtime helpers. MC should record whether a validator is:
   - `runtime-may-import-ajv-runtime-only`, or
   - `fully-bundled-no-ajv-imports`.

   This prevents false claims about complete dependency isolation.

6. Self-tests are semantic pins

   A validator that imports successfully but validates the wrong things is not trustworthy. Each generated validator needs at least one valid fixture and one invalid fixture.

## Decision

Add a minimal metadata schema that records:

- source schema identity and path,
- SHA-256 digest of source schema bytes,
- generated validator path,
- SHA-256 digest of generated validator bytes,
- generator name/version/entrypoint/options,
- module format,
- runtime dependency policy,
- fixture-based self-tests.

This keeps the dependency-free runner lane small while creating a separate governance lane that can prove schema-to-validator provenance.

## Added artifact

`mind/schemas/standalone-validator-metadata.v1.schema.json`

This schema defines the required governance metadata shape for generated validator artifacts.

## Prototype plan

### Paths

- Source schema:
  `mind/schemas/fixture-parity-failure-report.v1.schema.json`

- Generated validator:
  `mind/generated-validators/fixture-parity-failure-report.v1.validator.mjs`

- Metadata:
  `mind/generated-validators/fixture-parity-failure-report.v1.validator.metadata.json`

- Self-test fixtures:
  `mind/fixtures/validator-self-tests/fixture-parity-report.valid.cli-parse.json`
  `mind/fixtures/validator-self-tests/fixture-parity-report.invalid.missing-gates.json`

- Generator:
  `tools/agency-validation/generate-validators.mjs`

- Self-test harness:
  `tools/agency-validation/generated-validator-self-test.mjs`

### Generation flow

1. Read the source schema bytes.
2. Compute `schema_sha256`.
3. Compile a Draft 2020-12 validator with Ajv's 2020-specific class.
4. Emit ESM standalone validation code.
5. Write the generated validator module.
6. Compute `validator_sha256`.
7. Write metadata matching `standalone-validator-metadata.v1.schema.json`.
8. Run the self-test harness.

### CI checks

The governance CI lane should prove:

- metadata JSON matches the metadata schema,
- `schema_sha256` matches current source schema bytes,
- `validator_sha256` matches current validator bytes,
- generated validator is ESM-importable,
- valid fixture passes,
- invalid fixture fails,
- `run-fixture-parity.mjs` does not import Ajv.

## Requirements update

- The dependency-free agency runner may validate lightweight report invariants only.
- Full Draft 2020-12 validation belongs to governance generation/self-test tooling.
- Generated validator metadata is mandatory for every committed generated validator.
- Hash mismatches are governance failures, not runtime runner failures.
- Public CLI flags must not expose validator generation internals.

## Public-safety note

This artifact intentionally describes architecture, validation boundaries, and toolchain governance only. It contains no private user material, autobiographical content, or sensitive project data.

## Next architecture question

How should MC implement `tools/agency-validation/generate-validators.mjs` so it emits the first Draft 2020-12 ESM validator, writes matching metadata, and fails deterministically when schema bytes, validator bytes, or self-test fixtures drift?
