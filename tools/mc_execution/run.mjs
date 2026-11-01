#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const queuePath = path.join(root, "execution", "queue.json");
const reportPath = path.join(root, "execution-report.md");
const now = new Date().toISOString();
const failures = [];
let queue;

function check(label, fn) {
  try {
    const detail = fn();
    console.log(`PASS: ${label}${detail ? " — " + detail : ""}`);
    return { label, status: "PASS", detail: detail ?? "" };
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    failures.push(label);
    console.error(`FAIL: ${label} — ${detail}`);
    return { label, status: "FAIL", detail };
  }
}

const results = [];
results.push(check("Execution queue exists", () => {
  if (!fs.existsSync(queuePath)) throw new Error("Missing execution/queue.json");
  return "execution/queue.json";
}));

if (fs.existsSync(queuePath)) {
  results.push(check("Execution queue is valid and internally consistent", () => {
    queue = JSON.parse(fs.readFileSync(queuePath, "utf8"));
    if (queue.schema_version !== 1) throw new Error("Unsupported schema_version");
    if (!Array.isArray(queue.tasks) || queue.tasks.length === 0) throw new Error("tasks must be a non-empty array");
    const ids = new Set();
    for (const task of queue.tasks) {
      if (!task.id || !task.title || !task.status || !Array.isArray(task.checks)) {
        throw new Error("Every task needs id, title, status, and checks[]");
      }
      if (ids.has(task.id)) throw new Error("Duplicate task id: " + task.id);
      ids.add(task.id);
      if (!["queued", "active", "blocked", "done"].includes(task.status)) {
        throw new Error("Unsupported status for " + task.id + ": " + task.status);
      }
    }
    return `${queue.tasks.length} tasks; ${queue.tasks.filter(t => t.status === "active").length} active`;
  }));
}

for (const relative of [
  "site/index.html",
  "site/validate-site.mjs",
  "site/generate-catalog.mjs",
  "site/validate-catalog.mjs",
  "tools/mc_gate_integration/run_gate_check.py"
]) {
  results.push(check(`Required project input: ${relative}`, () => {
    if (!fs.existsSync(path.join(root, relative))) throw new Error("File not found");
    return "present";
  }));
}

const summary = results.every(r => r.status === "PASS") ? "PASS" : "FAIL";
const tasks = queue?.tasks ?? [];
const lines = [
  "# Mirror Cartographer — Execution Report",
  "",
  `- **Run time (UTC):** ${now}`,
  `- **Overall status:** ${summary}`,
  `- **Checks passed:** ${results.filter(r => r.status === "PASS").length}/${results.length}`,
  `- **Queue items:** ${tasks.length}`,
  "",
  "## Verification results",
  "",
  "| Check | Status | Detail |",
  "|---|---|---|",
  ...results.map(r => `| ${r.label.replaceAll("|", "\\|")} | ${r.status} | ${r.detail.replaceAll("|", "\\|")} |`),
  "",
  "## Work queue",
  "",
  "| ID | Priority | Status | Task |",
  "|---|---:|---|---|",
  ...tasks.slice().sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99)).map(t =>
    `| ${t.id} | ${t.priority ?? "—"} | ${t.status} | ${t.title.replaceAll("|", "\\|")} |`
  ),
  "",
  "## Operating boundary",
  "",
  "This run verifies repository inputs and queue integrity. It does not claim that a website is deployed or that interactive routes work in a real browser. It does not modify production code or automatically mark tasks complete.",
  "",
  failures.length ? `## Failures\n\n${failures.map(f => "- " + f).join("\n")}` : "## Failures\n\nNone."
];
fs.writeFileSync(reportPath, lines.join("\n") + "\n", "utf8");
console.log(`Wrote ${reportPath} with overall status ${summary}`);
if (summary !== "PASS") process.exitCode = 1;
