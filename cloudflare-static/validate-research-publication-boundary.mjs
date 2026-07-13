import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const DIRECT_DIAGNOSIS_PATTERNS = [
  /\byou (?:have|definitely have|are suffering from)\b/i,
  /\bthis (?:proves|confirms|means) (?:you|the patient) (?:have|has)\b/i,
  /\bdiagnosis:\s*[^<\n]+/i
];

const DIRECT_TREATMENT_PATTERNS = [
  /\b(?:start|stop|take|increase|decrease|double|discontinue) (?:your |the )?(?:medication|dose|prescription|treatment)\b/i,
  /\byou should (?:take|stop|start|increase|decrease|double|discontinue)\b/i,
  /\b(?:cures?|heals?|reverses?)\b[^.<]{0,80}\b(?:disease|condition|symptoms?)\b/i
];

const PAYMENT_PATTERNS = [
  /\b(?:buy now|checkout|add to cart|subscribe now|purchase|payment|billing)\b/i,
  /(?:stripe|paypal|checkout\.com|paddle)\.com/i,
  /<form[^>]+(?:payment|checkout|purchase)/i
];

const REQUIRED_EPISTEMIC_MARKERS = [
  /falsifi/i,
  /uncertaint/i,
  /evidence/i,
  /without turning uncertainty into diagnosis/i
];

function stripExecutableNoise(html) {
  return String(html)
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<!--([\s\S]*?)-->/g, ' ')
    .replace(/\s+/g, ' ');
}

function matches(patterns, text) {
  return patterns.flatMap((pattern) => {
    const match = text.match(pattern);
    return match ? [{ pattern: pattern.source, excerpt: match[0].slice(0, 160) }] : [];
  });
}

export function validateResearchPublicationBoundary(html, { source = 'unknown' } = {}) {
  const text = stripExecutableNoise(html);
  const diagnosis = matches(DIRECT_DIAGNOSIS_PATTERNS, text);
  const treatment = matches(DIRECT_TREATMENT_PATTERNS, text);
  const payment = matches(PAYMENT_PATTERNS, text);
  const missingMarkers = REQUIRED_EPISTEMIC_MARKERS
    .filter((pattern) => !pattern.test(text))
    .map((pattern) => pattern.source);

  const errors = [
    ...diagnosis.map((item) => ({ code: 'direct-diagnosis-claim', ...item })),
    ...treatment.map((item) => ({ code: 'direct-treatment-instruction', ...item })),
    ...payment.map((item) => ({ code: 'payment-or-conversion-logic', ...item })),
    ...missingMarkers.map((pattern) => ({ code: 'missing-epistemic-marker', pattern }))
  ];

  return {
    schema_version: '1.0.0',
    source,
    accepted: errors.length === 0,
    checks: {
      direct_diagnosis_claims: diagnosis.length === 0 ? 'clear' : 'rejected',
      direct_treatment_instructions: treatment.length === 0 ? 'clear' : 'rejected',
      payment_or_conversion_logic: payment.length === 0 ? 'clear' : 'rejected',
      epistemic_markers: missingMarkers.length === 0 ? 'present' : 'incomplete'
    },
    errors,
    limits: [
      'This is a deterministic publication-policy check, not medical review.',
      'Passing does not establish scientific truth, clinical safety, or regulatory compliance.',
      'Novel phrasing can evade pattern checks and still requires human evidence review.'
    ]
  };
}

function main() {
  const [input = 'cloudflare-static/index.html', output] = process.argv.slice(2);
  const html = fs.readFileSync(input, 'utf8');
  const result = validateResearchPublicationBoundary(html, { source: input });
  const serialized = `${JSON.stringify(result, null, 2)}\n`;
  if (output) fs.writeFileSync(output, serialized, { flag: 'wx' });
  else process.stdout.write(serialized);
  if (!result.accepted) process.exitCode = 1;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
