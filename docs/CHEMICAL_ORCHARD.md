# The Chemical Orchard — Instrument / v1

**Purpose:** The Living Country has a room whose substance changes through a real, discrete nonlinear reaction–diffusion simulation. A visitor's touch introduces reagent B; growth emerges from the state equations, not a prerecorded animation. The room may feel surprising without claiming to interpret psychology or diagnose emotion.

## Actual machinery

Grid: 178 × 126. Each cell contains concentration A and B, each clamped to [0, 1]. Nine-point weighted Laplacian approximates diffusion:

ΔA = -A + 0.2·(orthogonal neighbors) + 0.05·(diagonal neighbors)

and similarly for B. Each simulation step applies:

- dA = 1.0 ΔA − A B² + F(1 − A)
- dB = 0.5 ΔB + A B² − (k + F) B

Three published (feed F, kill k) pairs:

- LACE (0.0367, 0.0649)
- FERAL (0.0300, 0.0620)
- BLOOM (0.0545, 0.0620)

These are parameterized Gray–Scott *art* models, not a validated wet-lab experiment. Each touch adds B locally and removes some A; dragging adds a path of injections. Changing recipes changes the ongoing reaction, rather than merely swapping color. The branch to Wordless Sky becomes available if the actual field complexity crosses that recipe's threshold after the reaction develops. Switching/seed are deterministic. The gallery screenshot is not independent confirmation of Safari hardware behavior.

## Art direction

Not a descriptive museum: a single giant glass specimen under crooked enamel borders, field notes, stained paper, corrosive lime, fuchsia and mineral mint. Three touchable reagent shapes; few readable words. The area of active growth is the composition. No external images, fonts, tracker, model, sound source or API key. No interpretation of a visitor's psychological state.

## Actual controls and limits

- Pointer/touch: introduce chemistry (tap), stroke to create a path; keyboard arrows position the injection point, Space/Enter introduces.
- Three recipes are accessible buttons with pressed state.
- Local synthesized triangle/low-pass audio is opt-in, and stops on document hide.
- Android browser vibration is requested and throttled; a directly tapped native WebKit switch may provide a system iPhone haptic, but this is **not** programmable iOS vibration and not device-verified.
- A two-action reset protects the growing state from a casual mis-tap.
- Visitor can export the visible experiment as a PNG. No information is transmitted; no cross-device persistence is claimed.
- Motion is throttled for reduced-motion users, rather than treating audio or full-speed animation as required.
- The labyrinth's generated portal system has a new 13th reachable location, and an always accessible index link. Previous 12 destinations are retained.

## Evidence and test boundaries

- `node --test tests/chemical-orchard.test.mjs` passed 6/6 in local Node.js test environment, including numerical boundedness, deterministic replay, intervention effects, interface controls, and no network/model dependencies.
- Headless Chromium via Playwright tested desktop 1366×768 and phone 390×844 using a same-source inline harness because direct browser navigation was administratively blocked. Both showed actual simulation advance, clickable reagent changes, touch/mouse injection, browser-initiated audio running, and no page errors.
- No test establishes iPhone physical haptics, sound audibility, universal hardware support, or real-world psychological benefit.
- GitHub Pages CI/publication success and independent public HTTP verification must be recorded separately.
- All private conversation/medical files remain off the public site.

## Next proof gate

Use a real iPhone to test haptic tick and gesture co-existence; measure frame rate and audible behavior, and confirm the emergent portal can be reached without relying on hidden wording. Improve physics rendering and device energy consumption based on actual evidence, not solely screenshots.
