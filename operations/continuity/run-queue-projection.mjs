import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { reconcileContinuityQueueProjection } from "./reconcile-queue-projection.mjs";

function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])]));
  }
  return value;
}

function digestText(text) {
  return crypto.createHash("sha256").update(text).digest("hex");
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

export function buildCommitBoundProjection({ canonicalQueuePath, additiveUpdatePaths, sourceCommit }) {
  if (!/^[0-9a-f]{40}$/i.test(sourceCommit)) throw new Error("sourceCommit must be a 40-character git SHA");
  const canonicalText = fs.readFileSync(canonicalQueuePath, "utf8");
  const canonicalQueue = JSON.parse(canonicalText);
  const additiveUpdates = [...additiveUpdatePaths].sort().map(readJson);
  const projection = reconcileContinuityQueueProjection({ canonicalQueue, additiveUpdates });

  return stable({
    schema_version: "1.0.0",
    generated_from_commit: sourceCommit.toLowerCase(),
    canonical_queue_path: canonicalQueuePath.replaceAll("\\", "/"),
    canonical_queue_file_sha256: digestText(canonicalText),
    additive_update_paths: [...additiveUpdatePaths].sort().map((item) => item.replaceAll("\\", "/")),
    projection,
    adoption: {
      canonical_queue_modified: false,
      automatic_adoption_permitted: false,
      review_required: true
    }
  });
}

function parseArgs(argv) {
  const options = { updates: [] };
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === "--canonical") options.canonical = argv[++index];
    else if (token === "--update") options.updates.push(argv[++index]);
    else if (token === "--commit") options.commit = argv[++index];
    else if (token === "--output") options.output = argv[++index];
    else throw new Error(`unknown argument: ${token}`);
  }
  if (!options.canonical || !options.commit || !options.output) throw new Error("--canonical, --commit, and --output are required");
  return options;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const options = parseArgs(process.argv.slice(2));
  const artifact = buildCommitBoundProjection({
    canonicalQueuePath: options.canonical,
    additiveUpdatePaths: options.updates,
    sourceCommit: options.commit
  });
  fs.mkdirSync(path.dirname(options.output), { recursive: true });
  fs.writeFileSync(options.output, `${JSON.stringify(artifact, null, 2)}\n`);
}
