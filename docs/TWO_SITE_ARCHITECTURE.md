# Two-site architecture

Mirror Cartographer has two public surfaces with different responsibilities.

## Current free-hosting map

Both public surfaces use free GitHub Pages only. The former Vercel reference below describes the atmosphere's design role, not a current deployment target.

- Atmosphere: the companion application's wordless root route at `https://mirrorcartographer.github.io/mirror-cartographer-ui/`.
- Artist field / Living Atlas: the core site at `https://mirrorcartographer.github.io/MirrorCartographer/`, with the companion atlas at `https://mirrorcartographer.github.io/mirror-cartographer-ui/atlas/`.
- The Between: the companion research instrument at `https://mirrorcartographer.github.io/mirror-cartographer-ui/research-atlas/`.

Vercel and Netlify configuration retained in either repository is historical material. The core repository still has a manually dispatchable Cloudflare research deployment workflow; it is not part of the approved release and must not be used under the Pages-only policy. Retiring it requires a coordinated update to its dependent workflow-contract and evidence tests. The approved two-site release path uses free GitHub Pages only.


## 1. The atmosphere

The companion application's GitHub Pages root route is the living encounter.

It should remain:

- wordless or nearly wordless
- tap-to-start
- weather-coupled
- musically and visually generative
- responsive to the participant without exposing internal interpretation
- lightweight enough for stable phone use

Its purpose is not to explain Mirror Cartographer. Its purpose is to let someone enter it.

## 2. The artist field

The core GitHub Pages Living Atlas, together with the companion application's `/atlas/` route, is the usable creative substrate.

It should expose:

- field-state schemas
- replayable encounter fixtures
- composition decisions and constraints
- visual, musical, movement, lighting, and installation mappings
- examples made by artists from the same field state
- provenance, authorship, licensing, and reuse boundaries

Its purpose is not to duplicate the atmosphere. Its purpose is to make the underlying field interpretable and reusable across media.

## Shared contract

Both sites should derive from the same encounter model:

`what exists + what could exist + participant interaction -> selected next field state`

The atmosphere renders the selected state.

The artist field exposes the state and its available interpretations.

The two sites should share schemas and replay fixtures, but they should not share the same interface or emotional role.
