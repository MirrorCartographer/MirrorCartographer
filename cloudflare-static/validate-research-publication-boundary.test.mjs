import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { validateResearchPublicationBoundary } from './validate-research-publication-boundary.mjs';

const safe = `
  <main>
    <h1>Evidence laboratory</h1>
    <p>Scientific uncertainty remains explicit.</p>
    <p>Every theory needs a falsification route.</p>
    <p>Organize clinician-facing questions without turning uncertainty into diagnosis.</p>
  </main>`;

test('accepts the committed research surface', () => {
  const html = fs.readFileSync(new URL('./index.html', import.meta.url), 'utf8');
  const result = validateResearchPublicationBoundary(html, { source: 'index.html' });
  assert.equal(result.accepted, true);
  assert.deepEqual(result.errors, []);
});

test('rejects direct diagnosis language', () => {
  const result = validateResearchPublicationBoundary(`${safe}<p>You have a neurological disease.</p>`);
  assert.equal(result.accepted, false);
  assert.equal(result.errors.some((error) => error.code === 'direct-diagnosis-claim'), true);
});

test('rejects direct treatment instructions', () => {
  const result = validateResearchPublicationBoundary(`${safe}<p>You should stop your medication immediately.</p>`);
  assert.equal(result.accepted, false);
  assert.equal(result.errors.some((error) => error.code === 'direct-treatment-instruction'), true);
});

test('rejects payment and conversion logic', () => {
  const result = validateResearchPublicationBoundary(`${safe}<a href="https://stripe.com/checkout">Buy now</a>`);
  assert.equal(result.accepted, false);
  assert.equal(result.errors.some((error) => error.code === 'payment-or-conversion-logic'), true);
});

test('rejects missing epistemic markers', () => {
  const result = validateResearchPublicationBoundary('<main><p>Interesting ideas.</p></main>');
  assert.equal(result.accepted, false);
  assert.equal(result.errors.filter((error) => error.code === 'missing-epistemic-marker').length, 4);
});

test('does not treat CSS or scripts as published prose', () => {
  const result = validateResearchPublicationBoundary(`${safe}<style>.payment{display:none}</style><script>const diagnosis='x'</script>`);
  assert.equal(result.accepted, true);
});
