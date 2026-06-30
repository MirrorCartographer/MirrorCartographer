# Python path authority and schema registry

Date: 2026-06-30

## Architecture question

How should MC add the Python path authority and schema registry files so the raw-error serializer can run end-to-end against the three seed fixtures with the same no-network, repo-relative trust boundary already created for Node/Ajv?

## Short answer

Implement Python parity as a second enforcement layer, not a helper wrapper.

The Python runner must reject unsafe paths before validation, load every schema from the repo-local `mind/schemas` inventory, register schemas by `$id`, and run `jsonschema` with an in-memory `referencing.Registry`. Network retrieval should remain absent by default.

## Current sources checked

- `python-jsonschema` 4.26.0 documents the modern `referencing.Registry` path: create a registry, add `Resource` objects, and pass that registry into `Draft202012Validator`.
- The same documentation says in-memory schemas are the preferred path when the schema set is fixed/static, and warns that custom retrieval must be treated as a security-sensitive decision.
- Python `pathlib` gives canonical path resolution primitives needed to enforce an in-repository boundary.
- JSON Schema structuring guidance treats `$id` as the canonical schema identifier used for reference resolution.
- OWASP path-handling guidance reinforces the same shape of rule: canonicalize, allowlist, reject traversal and attacker-controlled location choices before opening files.

## What changed in understanding

Python parity is not just about making `jsonschema` work. It closes a second trust boundary.

Before this update, Node/Ajv had repo-relative path authority and deterministic local schema registration. Python serialization existed, but the Python side had no durable equivalent for:

1. rejecting URL-shaped, absolute, Windows-drive, backslash, NUL, extension-mismatch, and repo-escape paths;
2. loading schemas from the same local inventory used by Node;
3. refusing duplicate `$id` values;
4. refusing unregistered remote references by construction;
5. returning a validator that is wired to an explicit offline registry.

The architecture changed from "Python can serialize errors" to "Python can participate in the same offline evidence harness as Node."

## GitHub implementation added

### `tools/agency-validation/python_path_authority.py`

Adds a Python trust-boundary module equivalent to `path-authority.mjs`:

- `REPO_ROOT`
- `PathAuthorityError`
- `assert_safe_repo_relative_path(input_value, must_end_with=None)`
- `repo_relative_display_path(absolute_path)`

Rejected path classes:

- empty values;
- NUL bytes;
- URL-shaped paths;
- Windows drive paths;
- absolute POSIX paths;
- Windows separators;
- required-extension mismatches;
- `../` repository escapes;
- display paths outside the repository root.

### `tools/agency-validation/python_schema_registry.py`

Adds a Python schema registry module equivalent to the Node/Ajv loader:

- `DEFAULT_SCHEMA_DIR = "mind/schemas"`
- `SchemaRecord`
- `load_json_file(repo_relative_path)`
- `load_schema_records(schema_dir=DEFAULT_SCHEMA_DIR)`
- `build_python_registry(schema_dir=DEFAULT_SCHEMA_DIR)`
- `get_python_validator(schema_id, schema_dir=DEFAULT_SCHEMA_DIR)`

Core behavior:

- uses the Python path authority for all file loads;
- recursively loads `.json` schemas from `mind/schemas`;
- requires every schema to define a string `$id`;
- rejects duplicate `$id` values;
- builds an immutable in-memory `referencing.Registry` using Draft 2020-12 resources;
- returns `Draft202012Validator` instances bound to that registry;
- does not configure filesystem or HTTP retrieval.

### `tools/agency-validation/python_path_authority.test.py`

Adds tests proving safe repo-relative paths are accepted and unsafe path classes are rejected before validation.

### `tools/agency-validation/python_schema_registry.test.py`

Adds tests proving schema records load with unique IDs, the registry contains MC schema IDs, unknown remote IDs are not retrievable, registered validators run, and unknown schema IDs fail explicitly.

## Durable requirement update

MC validation infrastructure now has this requirement:

> Every validator runtime must pass through a local path authority and local schema registry before validation. No runner may load schemas from arbitrary absolute paths, URLs, drive paths, unchecked relative paths, or implicit network resolution. `$id` is the registry key; raw file path is only provenance.

## Public-safety boundary

The artifact is public-safe. It stores only validation infrastructure rules, schema paths, and generic error classes. It does not include private prompts, personal data, fixture bodies beyond existing public-safe seed files, or user-specific symbolic material.

## Implementation notes

This does not yet execute the full paired runner. It establishes the Python-side boundary needed for that runner.

The next implementation should join these pieces:

1. load a seed fixture through `python_schema_registry.load_json_file`;
2. validate it with `get_python_validator(schema_id)`;
3. serialize errors through `python_raw_error_serializer.build_python_raw_error_capture`;
4. write the raw capture into the paired runner output directory;
5. compare canonical repair receipts against the Ajv side.

## Next research question

How should MC implement the first Python end-to-end fixture validation command that loads the three seed fixtures through `python_path_authority.py`, validates them through `python_schema_registry.py`, serializes errors through `python_raw_error_serializer.py`, and writes byte-stable raw captures ready for the paired convergence report?
