# Afterimage

Afterimage is an independent, self-contained generative web piece. It is not a Mirror Cartographer surface, research interface, operational dashboard, or conversion funnel.

## Identity law

- The world changes only through explicit visitor action.
- Identical scene seeds and viewport dimensions produce identical geometry.
- Sound is optional, quiet, synthesized locally, and starts only after a direct gesture.
- No account, analytics, network dependency, external asset, or persistent personal state is used.
- Motion stops under `prefers-reduced-motion`.
- The visual system remains bounded between 18 and 72 forms for predictable mobile cost.

## Run

Serve this directory over HTTP so the ES module can load:

```bash
python3 -m http.server 8080 --directory independent/afterimage
```

Then open `http://localhost:8080`.

## Verify

```bash
node --test independent/afterimage/world.test.mjs
```
