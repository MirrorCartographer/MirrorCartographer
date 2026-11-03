import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
const root = process.cwd();
const ignored = new Set([".git", "node_modules", ".next", "dist", "build", "coverage"]);
const files = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) { if (!ignored.has(entry.name)) walk(path.join(dir, entry.name)); }
    else if (entry.isFile() && /\.html?$/i.test(entry.name)) files.push(path.join(dir, entry.name));
  }
}
walk(root); let checked = 0; const failures = [];
for (const file of files) {
  const html = fs.readFileSync(file, "utf8");
  const blocks = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)];
  for (let i = 0; i < blocks.length; i++) {
    const attrs = blocks[i][1]; const source = blocks[i][2];
    if (/\bsrc\s*=/.test(attrs) || !source.trim()) continue;
    const type = (attrs.match(/\btype\s*=\s*["']?([^\s"'>]+)/i) || [])[1] || "";
    if (type && !/^(module|text\/javascript|application\/javascript|text\/ecmascript|application\/ecmascript)$/i.test(type)) continue;
    const args = type.toLowerCase() === "module" ? ["--check", "--input-type=module"] : ["--check"];
    const result = spawnSync(process.execPath, args, { input: source, encoding: "utf8" });
    checked++;
    if (result.status !== 0) failures.push({ file: path.relative(root, file), block: i + 1, error: (result.stderr || result.stdout || "syntax check failed").trim() });
  }
}
console.log("Checked " + checked + " inline JavaScript blocks across " + files.length + " HTML files.");
if (failures.length) { for (const item of failures) console.error("FAIL " + item.file + " script " + item.block + ": " + item.error); process.exitCode = 1; }
else console.log("PASS: every inline JavaScript block parses.");
