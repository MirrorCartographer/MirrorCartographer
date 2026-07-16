#!/usr/bin/env node
import fs from 'node:fs';
import { buildEnvironmentConfigurationRequest } from './build-environment-configuration-request.mjs';
import { validateEnvironmentConfigurationRequest } from './validate-environment-configuration-request.mjs';

function writeJson(path, value) {
  fs.writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`, { mode: 0o600 });
}

export function buildEnvironmentConfigurationArtifacts(blocker, options = {}) {
  const request = buildEnvironmentConfigurationRequest(blocker, options);
  const validation = validateEnvironmentConfigurationRequest(request);
  if (!validation.valid) {
    const error = new Error(`environment configuration request failed validation: ${validation.errors.join('; ')}`);
    error.validation = validation;
    throw error;
  }
  return { request, validation };
}

function main() {
  const blockerPath = process.argv[2] || 'cloudflare-deployment-blocker.json';
  const requestPath = process.argv[3] || 'cloudflare-environment-configuration-request.json';
  const validationPath = process.argv[4] || 'cloudflare-environment-configuration-request.validation.json';
  const blocker = JSON.parse(fs.readFileSync(blockerPath, 'utf8'));
  const { request, validation } = buildEnvironmentConfigurationArtifacts(blocker);
  writeJson(requestPath, request);
  writeJson(validationPath, validation);
  process.stdout.write(`${JSON.stringify({ status: request.status, valid: validation.valid, request: requestPath, validation: validationPath })}\n`);
}

if (import.meta.url === `file://${process.argv[1]}`) main();
