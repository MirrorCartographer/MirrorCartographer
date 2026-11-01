import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright";

const root = process.cwd();
const siteRoot = path.join(root, "site");
const mime = { ".html": "text/html; charset=utf-8", ".json": "application/json; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".svg": "image/svg+xml" };
const failures = [];
const checks = [];
function assert(condition, message) {
  if (!condition) throw new Error(message);
}
async function test(name, fn) {
  try {
    await fn();
    checks.push({ name, status: "PASS" });
    console.log("PASS: " + name);
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    failures.push({ name, detail });
    checks.push({ name, status: "FAIL", detail });
    console.error("FAIL: " + name + " — " + detail);
  }
}
const server = http.createServer((req, res) => {
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname); }
  catch { res.writeHead(400).end("Bad request"); return; }
  let file = path.resolve(siteRoot, "." + pathname);
  if (!file.startsWith(siteRoot + path.sep) && file !== siteRoot) { res.writeHead(403).end("Forbidden"); return; }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) { res.writeHead(404).end("Not found"); return; }
  res.writeHead(200, { "content-type": mime[path.extname(file)] || "application/octet-stream" });
  fs.createReadStream(file).pipe(res);
});
await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
const base = "http://127.0.0.1:" + server.address().port;
let browser;
try {
  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ acceptDownloads: true, viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  const pageErrors = [];
  page.on("pageerror", error => pageErrors.push(error.message));

  await test("Living Atlas loads and links to the Mind", async () => {
    const response = await page.goto(base + "/");
    assert(response?.ok(), "Homepage did not return HTTP success");
    assert(await page.getByRole("link", { name: /The Mind/ }).count() > 0, "Mind link not found in navigation");
    assert(await page.locator('a[href="./mind/"]').count() > 0, "No direct Mind entry point");
  });

  await test("Mind opens with expedition, map, rooms, and notebook", async () => {
    const response = await page.goto(base + "/mind/");
    assert(response?.ok(), "Mind did not return HTTP success");
    for (const id of ["expedition", "map", "rooms", "notebook"]) {
      assert(await page.locator("#" + id).count() === 1, "Missing #" + id);
    }
    assert(await page.locator("[data-enter]").count() >= 7, "Expected seven room controls");\n    assert(await page.locator("[data-node]").count() >= 8, "Expected the center and all seven room nodes on the map");
  });

  await test("Expedition answers and advances", async () => {
    await page.goto(base + "/mind/");
    const before = await page.locator("#scene-title").textContent();
    await page.locator("#options .option").first().click();
    assert((await page.locator("#feedback").textContent()).includes("Good."), "Expected feedback for first choice");
    await page.locator("#next-scene").click();
    const after = await page.locator("#scene-title").textContent();
    assert(before !== after, "Scene did not advance");
    assert((await page.locator("#progress-label").textContent()).includes("1 / 6"), "Progress was not updated");
  });

  await test("Room selection updates the map and records exploration", async () => {
    await page.goto(base + "/mind/");
    await page.locator('[data-enter="missing"]').click();
    assert((await page.locator("#map-title").textContent()).includes("Ghost Room"), "Wrong room detail");
    assert((await page.locator("#rooms-count").textContent()).includes("1 / 7"), "Room visit was not counted");
  });

  await test("Notebook saves a thread and exports JSON", async () => {
    await page.goto(base + "/mind/");
    await page.locator("#note-title").fill("Browser smoke test thread");
    await page.locator("#note-body").fill("A synthetic test note; not personal data.");
    await page.locator('#note-form button[type="submit"]').click();
    assert((await page.locator("#notebook-count").textContent()).includes("1 SAVED"), "Notebook did not save note");
    assert(await page.getByText("Browser smoke test thread", { exact: true }).count() === 1, "Saved note not rendered");
    const downloadPromise = page.waitForEvent("download");
    await page.locator("#export-notes").click();
    const download = await downloadPromise;
    assert(download.suggestedFilename().endsWith(".json"), "JSON export filename missing");
  });

  await test("Mobile layout remains usable", async () => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(base + "/mind/");
    assert(await page.locator("#expedition").isVisible(), "Expedition is not visible at mobile width");
    const size = await page.locator("body").evaluate(el => ({ scroll: el.scrollWidth, client: document.documentElement.clientWidth }));
    assert(size.scroll <= size.client + 2, "Unexpected horizontal overflow: " + JSON.stringify(size));
  });

  await test("No uncaught browser JavaScript errors", async () => {
    assert(pageErrors.length === 0, pageErrors.join("; "));
  });

  await context.close();
} finally {
  if (browser) await browser.close();
  await new Promise(resolve => server.close(resolve));
}
console.log(JSON.stringify({ result: failures.length ? "FAIL" : "PASS", passed: checks.filter(c => c.status === "PASS").length, total: checks.length, failures }, null, 2));
if (failures.length) process.exitCode = 1;
