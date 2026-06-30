import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import Ajv2020 from "ajv/dist/2020.js";
import { assertSafeRepoRelativePath, repoRelativeDisplayPath } from "./path-authority.mjs";

export const DEFAULT_SCHEMA_DIR = "mind/schemas";

function listJsonFiles(directory) {
  const entries = readdirSync(directory, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const child = path.join(directory, entry.name);
    if (entry.isDirectory()) return listJsonFiles(child);
    return entry.isFile() && entry.name.endsWith(".json") ? [child] : [];
  }).sort();
}

export function loadJsonFile(repoRelativePath) {
  const absolutePath = assertSafeRepoRelativePath(repoRelativePath, { mustEndWith: ".json" });
  return JSON.parse(readFileSync(absolutePath, "utf8"));
}

export function loadSchemaRecords(schemaDir = DEFAULT_SCHEMA_DIR) {
  const schemaRoot = assertSafeRepoRelativePath(schemaDir);
  return listJsonFiles(schemaRoot).map((absolutePath) => {
    const repoPath = repoRelativeDisplayPath(absolutePath);
    const schema = JSON.parse(readFileSync(absolutePath, "utf8"));
    if (!schema.$id || typeof schema.$id !== "string") {
      throw new Error(`Schema ${repoPath} must define a string $id for deterministic registration.`);
    }
    return { repoPath, id: schema.$id, schema };
  });
}

export function buildAjvRegistry(schemaDir = DEFAULT_SCHEMA_DIR) {
  const ajv = new Ajv2020({ allErrors: true, strict: true, validateSchema: true });
  const records = loadSchemaRecords(schemaDir);
  const seen = new Set();

  for (const record of records) {
    if (seen.has(record.id)) throw new Error(`Duplicate schema $id: ${record.id}`);
    seen.add(record.id);
    ajv.addSchema(record.schema, record.id);
  }

  return { ajv, records };
}

export function getAjvSchema(schemaId, schemaDir = DEFAULT_SCHEMA_DIR) {
  const { ajv } = buildAjvRegistry(schemaDir);
  const validate = ajv.getSchema(schemaId);
  if (!validate) throw new Error(`Schema not registered: ${schemaId}`);
  return validate;
}
