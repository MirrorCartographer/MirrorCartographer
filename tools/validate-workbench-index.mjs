import fs from "node:fs";
import path from "node:path";
const root = process.cwd();
const workbenches = ["workbench.html", "site/workbench.html"];
const ignored = new Set([".git", "node_modules", ".next", "dist", "build", "coverage"]);
const actual = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const child = path.join(dir, entry.name);
    const relative = path.relative(root, child).split(path.sep).join("/");
    const isPublicCompanionArtifact = relative === "site/companion" || relative.startsWith("site/companion/");
    if (entry.isDirectory()) {
      if (!ignored.has(entry.name) && !isPublicCompanionArtifact) walk(child);
    } else if (entry.isFile() && /\.html?$/i.test(entry.name) && !isPublicCompanionArtifact) {
      actual.push(relative);
    }
  }
}
function indexed(file) {
  const source = fs.readFileSync(path.join(root, file), "utf8");
  const match = source.match(/const artifacts\s*=\s*\[([\s\S]*?)\]\s*;/);
  if (!match) throw new Error(file + ": artifact index not found");
  return JSON.parse("[" + match[1] + "]");
}
walk(root); actual.sort(); let failed = false;
for (const file of workbenches) {
  const entries = indexed(file); const sorted = entries.slice().sort();
  const missing = actual.filter(item => !sorted.includes(item));
  const stale = sorted.filter(item => !actual.includes(item));
  const duplicates = entries.filter((item, i) => entries.indexOf(item) !== i);
  const ok = !missing.length && !stale.length && !duplicates.length;
  console.log((ok ? "PASS " : "FAIL ") + file + ": " + entries.length + "/" + actual.length + " HTML files indexed");
  if (!ok) { if (missing.length) console.error("  Missing: " + missing.join(", ")); if (stale.length) console.error("  Stale: " + stale.join(", ")); if (duplicates.length) console.error("  Duplicates: " + duplicates.join(", ")); failed = true; }
}
if (failed) process.exitCode = 1;