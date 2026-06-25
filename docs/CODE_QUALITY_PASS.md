# Code Quality Pass

This document records the coding discipline changes made after the instruction: learn to code.

## What changed

### 1. Verification scripts added

`package.json` now includes:

- `typecheck`: runs TypeScript without emitting files
- `verify`: runs typecheck and build together

This creates a local verification path before deployment.

### 2. GitHub Actions CI added

A GitHub Actions workflow now runs on pushes and pull requests to `main`.

The workflow:

1. checks out the repository
2. sets up Node 20
3. installs dependencies with `npm ci`
4. runs TypeScript typecheck
5. runs the Next.js build

This gives the project a validation path outside Vercel, which is currently blocked by build-rate limits.

### 3. Mapping logic extracted

The Mirror Cartographer mapping logic was moved into:

`src/lib/mirrorMap.ts`

This file now contains:

- public types for modes, feedback, source status, claim status, map input, and map result
- example prompts
- mode options
- feedback options
- the core `createMap` function
- the `feedbackMeaning` function

This makes the logic reusable and testable instead of burying it inside the page component.

### 4. Page component simplified

`src/app/page.tsx` now imports the mapping engine and focuses on UI state and rendering.

The page still handles:

- body area input
- color input
- texture input
- symbol input
- narrative input
- mode toggle
- memory toggle
- user feedback
- correction / manual override
- exportable session record

## Why this matters

Before this pass, the project had too much logic tangled in the page. That made it harder to verify, test, reuse, or evolve.

After this pass, the project has:

- a clearer engine / UI split
- a CI verification path
- typed symbolic mapping outputs
- a first exportable session trace
- a concrete route toward tests and reviewer scoring

## Remaining code work

Next coding targets:

1. Add actual automated tests for `createMap`.
2. Add downloadable export file instead of only copyable JSON.
3. Add clickable body-map anatomy.
4. Add a real symbol table.
5. Add source-cluster lookup.
6. Add reviewer scoring UI.
7. Add persistent archive after data ownership/deletion rules are implemented.

## Current boundary

This pass improves code structure and verification, but it does not prove the product works. It makes the next proof possible.