# The Orchard That Remembers Rain

## Creative premise

An impossible orchard grows from the visitor's weather. Each rain gesture becomes a tree at the place where the drop reaches the ground. The work treats interaction as climate and memory as landscape.

## Visual law

- Night orchard, parchment light, mineral greens, no glossy product UI.
- Fine lines, grain, restrained glow, and slow accumulation.
- Typography behaves like a literary title page rather than an application shell.
- The screen should feel inhabited before it feels explained.

## Behavioral law

- Touching or dragging the sky makes rain.
- Rain is not decorative: every surviving drop eventually becomes a tree.
- A storm creates a bounded burst of weather.
- Sound is opt-in and generated locally with Web Audio; newly planted trees emit short tones only after activation.
- Forgetting is explicit and reversible within the current session.

## Independence boundary

This work is not a Mirror Cartographer explanation page, research portal, worker dashboard, health interface, evidence system, or product funnel. It contains no diagnosis, treatment, personal data, payment logic, conversion logic, or dependency on the Mirror Cartographer application.

## Accessibility and performance

- Pointer, touch, and keyboard storm interaction.
- Minimum 44px controls.
- Live-region announcements for storm, sound, and reset actions.
- Reduced-motion-aware growth speed.
- No external runtime dependencies, fonts, images, analytics, or network requests.
- Canvas pixel ratio capped at 2 and rain/tree collections bounded.

## Acceptance contract

The artifact is accepted as source-complete when:

1. the HTML is self-contained;
2. it includes touch/drag rain, storm, reset, and opt-in sound controls;
3. rain deterministically plants trees on ground contact;
4. accessibility labels, live announcements, keyboard input, safe-area layout, and reduced-motion handling are present;
5. no Mirror Cartographer, payment, medical, analytics, or external-resource language appears in the runtime source;
6. a static contract test passes.

Public deployment and real-device visual proof remain separate acceptance boundaries.