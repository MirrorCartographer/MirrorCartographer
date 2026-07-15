import fs from 'node:fs';

const FORBIDDEN_KEY_PATTERN = /(^|_)(authorization|cookie|secret|token|api[_-]?key|client[_-]?secret|private[_-]?key|message|stack)(_|$)/i;
const SECRET_VALUE_PATTERNS = [
  /\bBearer\s+[A-Za-z0-9._~+/=-]{12,}\b/i,
  /\b(?:CF|CLOUDFLARE)[_-]?(?:API[_-]?)?TOKEN\b/i,
  /\bgh[pousr]_[A-Za-z0-9]{20,}\b/,
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/
];

function walk(value, path, violations) {
  if (Array.isArray(value)) {
    value.forEach((entry, index) => walk(entry, `${path}[${index}]`, violations));
    return;
  }
  if (value && typeof value === 'object') {
    for (const [key, entry] of Object.entries(value)) {
      const next = path ? `${path}.${key}` : key;
      if (FORBIDDEN_KEY_PATTERN.test(key)) {
        violations.push({ path: next, reason: 'forbidden-key' });
      }
      walk(entry, next, violations);
    }
    return;
  }
  if (typeof value === 'string') {
    for (const pattern of SECRET_VALUE_PATTERNS) {
      if (pattern.test(value)) {
        violations.push({ path, reason: 'secret-shaped-value' });
        break;
      }
    }
  }
}

export function inspectEvidenceArtifact(value) {
  const violations = [];
  walk(value, '$', violations);
  return {
    ok: violations.length === 0,
    violations
  };
}

export function validateEvidenceFiles(paths) {
  if (!Array.isArray(paths) || paths.length === 0) {
    throw new Error('at-least-one-evidence-file-required');
  }
  const files = [];
  for (const path of paths) {
    let parsed;
    try {
      parsed = JSON.parse(fs.readFileSync(path, 'utf8'));
    } catch {
      files.push({ path, ok: false, violations: [{ path: '$', reason: 'invalid-or-missing-json' }] });
      continue;
    }
    files.push({ path, ...inspectEvidenceArtifact(parsed) });
  }
  return {
    schemaVersion: '1.0.0',
    status: files.every((file) => file.ok) ? 'accepted' : 'rejected',
    files
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const outputPath = process.argv[2];
  const inputPaths = process.argv.slice(3);
  if (!outputPath || inputPaths.length === 0) {
    console.error('usage: node validate-evidence-bundle-privacy.mjs OUTPUT.json INPUT.json [...]');
    process.exit(2);
  }
  const result = validateEvidenceFiles(inputPaths);
  fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`);
  process.stdout.write(`${JSON.stringify({ status: result.status, files: result.files.length })}\n`);
  if (result.status !== 'accepted') process.exit(1);
}
