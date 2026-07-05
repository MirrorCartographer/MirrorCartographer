#!/usr/bin/env node
import Ajv2020 from 'ajv/dist/2020.js';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const COMPARE_RESULT_SCHEMA_ID =
  'https://mirrorcartographer.dev/schemas/governance.expected-fixture-compare.result.v1.schema.json';

export const REPLAY_CHECK_SCHEMA_ID =
  'https://mirrorcartographer.dev/schemas/governance.replay.check.v1.schema.json';

export const DEFAULT_SCHEMA_BUNDLE = Object.freeze({
  [COMPARE_RESULT_SCHEMA_ID]: 'mind/schemas/governance.expected-fixture-compare.result.v1.schema.json',
  [REPLAY_CHECK_SCHEMA_ID]: 'mind/schemas/governance.replay.check.v1.schema.json',
});

const REPORT_SCHEMA = 'governance.compare-result-validation.report.v1';
const MAX_ERRORS = 20;

function toPosixPath(value) {
  return value.split(path.sep).join('/');
}

function isRepositoryRelativePath(value) {
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

function assertWithinRepo(repoRoot, candidatePath) {
  const resolvedRoot = path.resolve(repoRoot);
  const resolvedCandidate = path.resolve(resolvedRoot, candidatePath);
  const relative = path.relative(resolvedRoot, resolvedCandidate);

  if (relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative))) {
    return { absolutePath: resolvedCandidate, relativePath: toPosixPath(relative || path.basename(resolvedCandidate)) };
  }

  throw new Error('Path escapes repository root.');
}

function safeMessage(message) {
  const text = String(message || 'schema validation failed')
    .replace(/ghp_[A-Za-z0-9_]+/g, '[redacted-token]')
    .replace(/github_pat_[A-Za-z0-9_]+/g, '[redacted-token]')
    .replace(/sk-[A-Za-z0-9]+/g, '[redacted-token]')
    .replace(/BEGIN [A-Z ]*PRIVATE KEY/g, '[redacted-private-key]')
    .replace(/password=/gi, 'password=[redacted]')
    .replace(/token=/gi, 'token=[redacted]')
    .replace(/[A-Za-z]:[\\/][^\s"']+/g, '[redacted-absolute-path]')
    .replace(/\/(?:tmp|var|home|Users|private)\/[^\s"']+/g, '[redacted-absolute-path]')
    .replace(/[\u0000-\u001f]/g, ' ');

  return text.slice(0, 200);
}

function makeReport({ state, schemaId = COMPARE_RESULT_SCHEMA_ID, resultPath, errors = [] }) {
  const boundedErrors = errors.slice(0, MAX_ERRORS).map((error) => ({
    instancePath: safeMessage(error.instancePath || ''),
    schemaPath: safeMessage(error.schemaPath || ''),
    keyword: safeMessage(error.keyword || 'unknown'),
    message: safeMessage(error.message || 'schema validation failed'),
  }));

  return {
    schema: REPORT_SCHEMA,
    state,
    schema_id: schemaId,
    result_path: resultPath,
    error_count: errors.length,
    errors: boundedErrors,
  };
}

async function readJsonFile(absolutePath) {
  const raw = await readFile(absolutePath, 'utf8');
  return JSON.parse(raw);
}

export async function createCompareResultValidator({
  repoRoot = process.cwd(),
  schemaBundle = DEFAULT_SCHEMA_BUNDLE,
} = {}) {
  const ajv = new Ajv2020({
    allErrors: true,
    strict: false,
    validateFormats: false,
  });

  for (const [schemaId, schemaPath] of Object.entries(schemaBundle)) {
    if (!isRepositoryRelativePath(schemaPath)) {
      throw new Error(`Schema bundle path is not repository-relative: ${schemaId}`);
    }

    const { absolutePath } = assertWithinRepo(repoRoot, schemaPath);
    const schema = await readJsonFile(absolutePath);

    if (schema.$id !== schemaId) {
      throw new Error(`Schema bundle id mismatch for ${schemaId}`);
    }

    ajv.addSchema(schema, schemaId);
  }

  const validate = ajv.getSchema(COMPARE_RESULT_SCHEMA_ID);
  if (!validate) {
    throw new Error('Compare-result schema was not compiled.');
  }

  return validate;
}

export async function validateCompareResult({
  repoRoot = process.cwd(),
  resultPath,
  schemaBundle = DEFAULT_SCHEMA_BUNDLE,
} = {}) {
  let publicResultPath = typeof resultPath === 'string' ? toPosixPath(resultPath) : 'unknown-result-path';

  try {
    if (!isRepositoryRelativePath(resultPath)) {
      return makeReport({
        state: 'failed_internal_error',
        resultPath: safeMessage(publicResultPath),
        errors: [{ keyword: 'path', message: 'resultPath must be repository-relative' }],
      });
    }

    const { absolutePath, relativePath } = assertWithinRepo(repoRoot, resultPath);
    publicResultPath = relativePath;

    const validate = await createCompareResultValidator({ repoRoot, schemaBundle });
    let document;

    try {
      document = await readJsonFile(absolutePath);
    } catch (error) {
      return makeReport({
        state: 'failed_json_parse',
        resultPath: publicResultPath,
        errors: [{ keyword: 'json', message: error.message }],
      });
    }

    const passed = validate(document);
    if (passed) {
      return makeReport({ state: 'passed', resultPath: publicResultPath });
    }

    return makeReport({
      state: 'failed_schema_validation',
      resultPath: publicResultPath,
      errors: validate.errors || [],
    });
  } catch (error) {
    return makeReport({
      state: 'failed_schema_load',
      resultPath: safeMessage(publicResultPath),
      errors: [{ keyword: 'schema', message: error.message }],
    });
  }
}

async function runCli() {
  const [, , resultPath] = process.argv;
  const report = await validateCompareResult({ resultPath });
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  process.exitCode = report.state === 'passed' ? 0 : 1;
}

const isCli = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);
if (isCli) {
  runCli().catch((error) => {
    const report = makeReport({
      state: 'failed_internal_error',
      resultPath: 'unknown-result-path',
      errors: [{ keyword: 'internal', message: error.message }],
    });
    process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
    process.exitCode = 1;
  });
}
