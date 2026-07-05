import Ajv2020 from 'ajv/dist/2020.js';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

export const EXPECTED_FIXTURE_PAIR_MANIFEST_SCHEMA_ID =
  'https://mirrorcartographer.dev/schemas/governance.expected-fixture-pair-manifest.v1.schema.json';

export const DEFAULT_EXPECTED_FIXTURE_PAIR_MANIFEST_SCHEMA_PATH =
  'mind/schemas/governance.expected-fixture-pair-manifest.v1.schema.json';

export const DEFAULT_KNOWN_GHF_CHECK_CODES = Object.freeze([
  'GHF_MANIFEST_SCHEMA_VALID',
  'GHF_MANIFEST_SCHEMA_INVALID',
  'GHF_PAIR_MATCHED',
  'GHF_PAIR_DRIFTED',
  'GHF_PAIR_GENERATED_MISSING',
  'GHF_PAIR_EXPECTED_MISSING',
  'GHF_UNLISTED_GENERATED_OUTPUT',
]);

const MAX_ERRORS = 20;

export function toPosixPath(value) {
  return String(value).split(path.sep).join('/');
}

export function isRepositoryRelativePath(value) {
  return (
    typeof value === 'string' &&
    value.length > 0 &&
    !path.isAbsolute(value) &&
    !value.startsWith('~') &&
    !/^[A-Za-z]:/.test(value) &&
    !value.includes('\\') &&
    !value.split('/').includes('..') &&
    !value.includes('//')
  );
}

export function safeManifestLoaderMessage(value) {
  return String(value || 'manifest validation failed')
    .replace(/ghp_[A-Za-z0-9_]+/g, '[redacted-token]')
    .replace(/github_pat_[A-Za-z0-9_]+/g, '[redacted-token]')
    .replace(/sk-[A-Za-z0-9]+/g, '[redacted-token]')
    .replace(/BEGIN [A-Z ]*PRIVATE KEY/g, '[redacted-private-key]')
    .replace(/password=/gi, 'password=[redacted]')
    .replace(/token=/gi, 'token=[redacted]')
    .replace(/[A-Za-z]:[\\/][^\s"']+/g, '[redacted-absolute-path]')
    .replace(/\/(?:tmp|var|home|Users|private)\/[^\s"']+/g, '[redacted-absolute-path]')
    .replace(/[\u0000-\u001f]/g, ' ')
    .slice(0, 200);
}

function publicError({ keyword, message, instancePath = '', schemaPath = '' }) {
  return {
    keyword: safeManifestLoaderMessage(keyword || 'manifest'),
    message: safeManifestLoaderMessage(message),
    instancePath: safeManifestLoaderMessage(instancePath),
    schemaPath: safeManifestLoaderMessage(schemaPath),
  };
}

function makeCheck({ code, state, publicMessage, severity = 'error', expectedness = 'unexpected', safeDetails }) {
  const check = {
    schema: 'governance.replay.check.v1',
    code,
    severity,
    category: 'expected_fixture.manifest',
    state,
    expectedness,
    publicMessage: safeManifestLoaderMessage(publicMessage),
    emission: {
      githubAnnotation: severity === 'error' || severity === 'blocked' ? 'error' : 'notice',
      summaryVisibility: 'include',
      dashboardVisibility: 'include',
    },
  };

  if (safeDetails && Object.keys(safeDetails).length > 0) {
    check.safeDetails = safeDetails;
  }

  return check;
}

function makeFailure({ manifestPath = 'unknown-manifest-path', errors = [] }) {
  return {
    state: 'failed_manifest_invalid',
    manifest_path: safeManifestLoaderMessage(toPosixPath(manifestPath)),
    checks: [
      makeCheck({
        code: 'GHF_MANIFEST_SCHEMA_INVALID',
        state: 'schema_invalid_observed',
        publicMessage: 'Expected-fixture pair manifest failed declaration-custody validation.',
      }),
    ],
    errors: errors.slice(0, MAX_ERRORS).map(publicError),
  };
}

export function assertContainedPath({ repoRoot, basePath = '', childPath }) {
  if (!isRepositoryRelativePath(childPath)) {
    throw new Error('Path is not repository-relative.');
  }

  if (basePath && !isRepositoryRelativePath(basePath)) {
    throw new Error('Base path is not repository-relative.');
  }

  const resolvedRoot = path.resolve(repoRoot);
  const resolvedBase = path.resolve(resolvedRoot, basePath || '.');
  const resolvedChild = path.resolve(resolvedRoot, childPath);
  const rootRelative = path.relative(resolvedRoot, resolvedChild);
  const baseRelative = path.relative(resolvedBase, resolvedChild);

  const insideRepo = rootRelative === '' || (!rootRelative.startsWith('..') && !path.isAbsolute(rootRelative));
  const insideBase = baseRelative === '' || (!baseRelative.startsWith('..') && !path.isAbsolute(baseRelative));

  if (!insideRepo || !insideBase) {
    throw new Error('Path escapes declared containment root.');
  }

  return {
    absolutePath: resolvedChild,
    relativePath: toPosixPath(rootRelative || path.basename(resolvedChild)),
  };
}

async function defaultReadTextFile(absolutePath) {
  return readFile(absolutePath, 'utf8');
}

async function readJsonWithRaw({ absolutePath, readTextFile }) {
  const raw = await readTextFile(absolutePath);
  return {
    raw,
    json: JSON.parse(raw),
    sha256: createHash('sha256').update(raw, 'utf8').digest('hex'),
  };
}

export async function createExpectedFixturePairManifestValidator({
  repoRoot = process.cwd(),
  schemaPath = DEFAULT_EXPECTED_FIXTURE_PAIR_MANIFEST_SCHEMA_PATH,
  readTextFile = defaultReadTextFile,
} = {}) {
  if (!isRepositoryRelativePath(schemaPath)) {
    throw new Error('Manifest schema path must be repository-relative.');
  }

  const schemaLocation = assertContainedPath({ repoRoot, childPath: schemaPath });
  const { json: schema } = await readJsonWithRaw({
    absolutePath: schemaLocation.absolutePath,
    readTextFile,
  });

  if (schema.$id !== EXPECTED_FIXTURE_PAIR_MANIFEST_SCHEMA_ID) {
    throw new Error('Manifest schema $id does not match expected schema identity.');
  }

  const ajv = new Ajv2020({
    allErrors: true,
    strict: false,
    validateFormats: false,
  });
  ajv.addSchema(schema, EXPECTED_FIXTURE_PAIR_MANIFEST_SCHEMA_ID);

  const validate = ajv.getSchema(EXPECTED_FIXTURE_PAIR_MANIFEST_SCHEMA_ID);
  if (!validate) {
    throw new Error('Expected-fixture pair manifest schema was not compiled.');
  }

  return validate;
}

function collectDeclaredCodes(manifest) {
  const declared = new Set(Object.values(manifest.checks || {}));
  for (const pair of manifest.pairs || []) {
    for (const code of Object.values(pair.checks || {})) {
      declared.add(code);
    }
  }
  return declared;
}

function normalizePair({ pair, generatedRoot, expectedRoot, repoRoot }) {
  const generated = assertContainedPath({
    repoRoot,
    basePath: generatedRoot,
    childPath: pair.generated_path,
  });
  const expected = assertContainedPath({
    repoRoot,
    basePath: expectedRoot,
    childPath: pair.expected_path,
  });

  return {
    id: pair.id,
    ...(pair.descriptor_id ? { descriptor_id: pair.descriptor_id } : {}),
    artifact_kind: pair.artifact_kind,
    generated_path: generated.relativePath,
    expected_path: expected.relativePath,
    comparison: pair.comparison,
    checks: pair.checks,
    internalResolvedPaths: {
      generated_absolute_path: generated.absolutePath,
      expected_absolute_path: expected.absolutePath,
    },
  };
}

export async function loadExpectedFixturePairManifest({
  repoRoot = process.cwd(),
  manifestPath,
  schemaPath = DEFAULT_EXPECTED_FIXTURE_PAIR_MANIFEST_SCHEMA_PATH,
  readTextFile = defaultReadTextFile,
  knownCheckCodes = DEFAULT_KNOWN_GHF_CHECK_CODES,
} = {}) {
  try {
    if (!isRepositoryRelativePath(manifestPath)) {
      return makeFailure({
        manifestPath,
        errors: [{ keyword: 'path', message: 'manifestPath must be repository-relative' }],
      });
    }

    const manifestLocation = assertContainedPath({ repoRoot, childPath: manifestPath });
    let manifestRaw;
    let manifest;
    let manifestSha256;

    try {
      const loaded = await readJsonWithRaw({
        absolutePath: manifestLocation.absolutePath,
        readTextFile,
      });
      manifestRaw = loaded.raw;
      manifest = loaded.json;
      manifestSha256 = loaded.sha256;
    } catch (error) {
      return makeFailure({
        manifestPath,
        errors: [{ keyword: 'json', message: error.message }],
      });
    }

    const validate = await createExpectedFixturePairManifestValidator({
      repoRoot,
      schemaPath,
      readTextFile,
    });

    if (!validate(manifest)) {
      return makeFailure({
        manifestPath,
        errors: validate.errors || [],
      });
    }

    const known = new Set(knownCheckCodes);
    const unknownCodes = [...collectDeclaredCodes(manifest)].filter((code) => !known.has(code));
    if (unknownCodes.length > 0) {
      return makeFailure({
        manifestPath,
        errors: unknownCodes.map((code) => ({
          keyword: 'check-code',
          message: `Unknown GHF check code: ${code}`,
        })),
      });
    }

    const generatedRoot = assertContainedPath({
      repoRoot,
      childPath: manifest.generated_root,
    });
    const expectedRoot = assertContainedPath({
      repoRoot,
      childPath: manifest.expected_root,
    });

    const pairs = manifest.pairs.map((pair) =>
      normalizePair({
        pair,
        generatedRoot: generatedRoot.relativePath,
        expectedRoot: expectedRoot.relativePath,
        repoRoot,
      }),
    );

    return {
      state: 'passed',
      manifest: {
        schema_version: manifest.schema_version,
        manifest_id: manifest.manifest_id,
        path: manifestLocation.relativePath,
        generated_root: generatedRoot.relativePath,
        expected_root: expectedRoot.relativePath,
        manifest_sha256: manifestSha256,
      },
      policies: manifest.comparison_policy,
      pairs,
      checks: [
        makeCheck({
          code: 'GHF_MANIFEST_SCHEMA_VALID',
          state: 'passed',
          severity: 'notice',
          expectedness: 'expected',
          publicMessage: 'Expected-fixture pair manifest passed declaration-custody validation.',
          safeDetails: {
            manifest_path: manifestLocation.relativePath,
            pair_count: pairs.length,
          },
        }),
      ],
      internalResolvedPaths: {
        manifest_absolute_path: manifestLocation.absolutePath,
        generated_root_absolute_path: generatedRoot.absolutePath,
        expected_root_absolute_path: expectedRoot.absolutePath,
        manifest_raw_size_bytes: Buffer.byteLength(manifestRaw, 'utf8'),
      },
    };
  } catch (error) {
    return makeFailure({
      manifestPath,
      errors: [{ keyword: 'manifest', message: error.message }],
    });
  }
}
