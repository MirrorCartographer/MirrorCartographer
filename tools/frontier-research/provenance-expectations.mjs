const OBJECT = (value) => value && typeof value === 'object' && !Array.isArray(value);

function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (!OBJECT(value)) return value;
  return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonical(value[key])]));
}

function equalJson(left, right) {
  return JSON.stringify(canonical(left)) === JSON.stringify(canonical(right));
}

export function createProvenanceExpectations({ buildType, externalParameters }) {
  if (typeof buildType !== 'string' || buildType.length === 0) throw new TypeError('buildType-required');
  if (!OBJECT(externalParameters)) throw new TypeError('externalParameters-object-required');
  return Object.freeze({
    schemaVersion: '1.0.0',
    mode: 'exact-external-parameters',
    buildType,
    externalParameters: Object.freeze(canonical(externalParameters))
  });
}

export function evaluateProvenanceExpectations(statement, expectations) {
  const reasons = [];
  if (!OBJECT(statement)) return Object.freeze({ accepted: false, reasons: ['statement-object-required'] });
  if (!OBJECT(expectations) || expectations.mode !== 'exact-external-parameters') {
    return Object.freeze({ accepted: false, reasons: ['expectations-policy-required'] });
  }

  const definition = statement.predicate?.buildDefinition;
  if (!OBJECT(definition)) reasons.push('predicate.buildDefinition');
  if (definition?.buildType !== expectations.buildType) reasons.push('buildType');

  const actual = definition?.externalParameters;
  if (!OBJECT(actual)) reasons.push('externalParameters');
  else {
    const expectedKeys = Object.keys(expectations.externalParameters).sort();
    const actualKeys = Object.keys(actual).sort();
    const unknown = actualKeys.filter((key) => !expectedKeys.includes(key));
    const missing = expectedKeys.filter((key) => !actualKeys.includes(key));
    if (unknown.length) reasons.push(`externalParameters.unknown:${unknown.join(',')}`);
    if (missing.length) reasons.push(`externalParameters.missing:${missing.join(',')}`);
    for (const key of expectedKeys.filter((key) => actualKeys.includes(key))) {
      if (!equalJson(actual[key], expectations.externalParameters[key])) reasons.push(`externalParameters.value:${key}`);
    }
  }

  return Object.freeze({ accepted: reasons.length === 0, reasons: Object.freeze(reasons) });
}
