# Private source, public release artifacts

Mirror Cartographer's source workspaces may remain private without making the public website dependent on private-repository access.

## Boundary

- `MirrorCartographer/mirror-cartographer-ui` is a private application/source workspace.
- `MirrorCartographer/c` contains private research and authoring tools, including the canonical Character Engine.
- `MirrorCartographer/MirrorCartographer` is the public website repository. Its `site/` tree contains only reviewed, publishable artifacts.

The public Pages build runs entirely from the public website repository. It must not clone, download, or otherwise require read access to either private source repository. The companion room pages are committed public artifacts, not a runtime dependency on the private source tree.

## Publication flow

1. Keep canonical source and working files in the private repository.
2. Review the proposed public derivative against the source repository's `public-world-publication.json` allowlist.
3. Copy only the approved derivative and required static assets into `site/companion/atlas/rooms/`.
4. Update the canonical public room identity manifest and the room-directory card.
5. Run `site/validate-public-routes.mjs` and the relevant room tests.
6. Merge the public artifact change into this repository. GitHub Pages then builds and publishes from `site/`.

Character Atelier follows this flow. Its engine is a public-safe derivative; its canonical source remains private. The visitor profile is local to the browser and is not synchronized to the Network.

## Current room inventory

- 40 named room destinations, each with explicit implementation, interaction, and memory status.
- 21 additional exhibits and annexes.
- The public site validates all 40 identity records against the room directory and destination files.

A room's presence in the directory means its route is published. It does not imply every interaction has passed a full usability audit; entries marked `existing-destination-needs-audit` remain explicitly marked until that work is done.

## Separate runtime boundary

The shared-world Network is a separate first-party service. Its API and D1 schema are project-owned; the current deployment adapter is Cloudflare Pages Functions + D1. Static room publication does not require that API to be live. Conversely, publishing the static site does not prove the Network API is deployed or that account isolation has passed production acceptance.

This separation is intentional: private authoring repositories, public static artifacts, and the first-party shared-world runtime are three distinct release surfaces.
