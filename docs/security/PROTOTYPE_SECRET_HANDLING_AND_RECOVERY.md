# Prototype Secret Handling and Recovery

Revision note:

- Status: public-safe security and implementation note.
- Reason: created after prototype code uploads showed implementation value but also unsafe secret-handling patterns.
- Source: current upload batch containing reflection engine and Streamlit UI prototype files.
- Boundary: this file does not include or repeat any secret values. It only documents the recovery policy.

## Core finding

The prototype code is valuable.

It shows real implementation movement toward:

- symbol input
- emotional context input
- mirror / contrast reflections
- tone choice
- journal entry
- memory logging
- tone preference weights
- past-reflection display
- pattern matrix
- PDF export experiments

But some uploaded prototype files contained hardcoded API secrets.

Those files must not be copied into the public repository as-is.

## Security rule

Never commit secrets.

Never paste secrets into docs.

Never preserve exposed secrets for historical completeness.

If a secret appeared in an uploaded file, treat it as compromised.

## Required recovery steps

1. Rotate or revoke the exposed key.
2. Remove the secret from local files.
3. Replace direct secret assignment with environment-variable loading.
4. Create `.env.example` with placeholder names only.
5. Add `.env` to `.gitignore`.
6. Add a pre-commit or CI secret scan before public commits.
7. Preserve only public-safe architecture notes in GitHub.

## Safe prototype recovery path

Recover features, not unsafe files.

### Recoverable feature: reflection generation

Keep:

- symbol input
- emotion/context input
- mirror response
- contrast response

Do not keep:

- hardcoded credentials
- private logs
- unredacted user data

### Recoverable feature: memory log

Keep:

- timestamp
- symbol
- emotion label
- selected tone
- optional journal text

Add:

- privacy status
- export permission
- deletion option
- source status

### Recoverable feature: tone preference weights

Keep:

- Mirror / Contrast / Both / Neither counts

Add:

- user correction history
- mode switching record
- confidence label

### Recoverable feature: pattern matrix

Keep:

- symbol-to-tone count
- repeated emotional labels
- trend view

Add:

- not-proof warning
- user confirmation flag
- evidence/source status

### Recoverable feature: PDF export

Keep:

- exportable reflection record

Add:

- privacy warning
- claim/source status
- public/private toggle

## Current prototype status labels

Use:

- implemented in old prototype
- needs security cleanup
- needs port to current repo
- needs tests
- not production-ready
- public-safe feature only

## What not to do

Do not upload the old prototype files directly into GitHub.

Do not preserve secret-bearing code for proof.

Do not treat prototype existence as production readiness.

Do not treat generated reflections as validated interpretations.

## Product requirement

Create a clean `src` implementation inspired by the old prototype, not copied from it.

Minimum safe fields:

- symbol
- emotional context
- mode
- mirror output
- contrast output
- tone selected
- correction option
- privacy status
- source status
- claim status
- export option

## Research question

Can early prototype artifacts be recovered as public-safe architecture without importing their unsafe implementation patterns?

## Search terms

prototype secret handling, hardcoded secret, environment variables, secret rotation, reflection engine recovery, Streamlit prototype, tone preference weights, pattern matrix, Mirror Cartographer security.