import fs from 'node:fs/promises';
import assert from 'node:assert/strict';

const source = await fs.readFile(new URL('./index.html', import.meta.url), 'utf8');

const checks = [
  ['mobile viewport includes viewport-fit=cover', /<meta\s+name="viewport"[^>]*viewport-fit=cover/i],
  ['safe-area insets are used for top and bottom controls', /env\(safe-area-inset-top\)/i.test(source) && /env\(safe-area-inset-bottom\)/i.test(source)],
  ['interactive controls meet 44px minimum target', /\.controls button\{[^}]*min-height:44px/i],
  ['keyboard focus is visibly styled', /:focus-visible\{[^}]*outline:/i],
  ['reduced-motion preference is honored', /@media\(prefers-reduced-motion:reduce\)/i],
  ['status changes use a polite live region', /aria-live="polite"/i],
  ['canvas is hidden from assistive technology', /<canvas[^>]*aria-hidden="true"/i],
  ['pointer interactions use Pointer Events', /addEventListener\('pointerdown'/i.test(source) && /addEventListener\('pointermove'/i.test(source)],
  ['audio starts only from an explicit control gesture', /querySelector\('#sound'\)\.onclick=async/i],
  ['device pixel ratio is capped', /Math\.min\(devicePixelRatio\|\|1,2\)/i],
  ['runtime has no external script, stylesheet, font, image, or fetch dependency', !/(?:<script[^>]+src=|<link[^>]+rel=["']stylesheet|https?:\/\/|fetch\s*\()/i.test(source)],
  ['new organisms alter nearby organisms through a bounded radius', /function disturb\(px,py,hue\)/i.test(source) && /dist<180/i.test(source)],
  ['alteration changes direction, hue, and lifetime', /s\.lean\+=/i.test(source) && /s\.hue=/i.test(source) && /s\.life\+=/i.test(source)],
  ['reciprocal changes are exposed through the polite status text', /changed direction/i.test(source) && /altered/i.test(source)],
  ['visual echoes are temporary and cleared with the field', /const echoes=\[\]/i.test(source) && /echoes\.splice/i.test(source) && /echoes\.length=0/i.test(source)],
];

for (const [name, result] of checks) {
  assert.equal(result instanceof RegExp ? result.test(source) : result, true, name);
  console.log(`PASS ${name}`);
}

console.log(`PASS ${checks.length} mobile, accessibility, performance, dependency, and reciprocal-world contracts`);