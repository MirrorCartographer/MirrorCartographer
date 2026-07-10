import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const profileDir = path.resolve(process.env.CLOUDFLARE_PROFILE_DIR || ".operator/cloudflare-profile");
const artifactDir = path.resolve(process.env.CLOUDFLARE_ARTIFACT_DIR || "artifacts/cloudflare-bridge");
const repoSlug = process.env.CLOUDFLARE_REPOSITORY || "MirrorCartographer/MirrorCartographer";
const projectName = process.env.CLOUDFLARE_PROJECT_NAME || "mirror-cartographer";
const productionBranch = process.env.CLOUDFLARE_PRODUCTION_BRANCH || "main";
const buildCommand = process.env.CLOUDFLARE_BUILD_COMMAND || "";
const outputDirectory = process.env.CLOUDFLARE_OUTPUT_DIRECTORY || "cloudflare-static";

fs.mkdirSync(profileDir, { recursive: true });
fs.mkdirSync(artifactDir, { recursive: true });

function log(message) {
  console.log(`[cloudflare-bridge] ${message}`);
}

async function screenshot(page, name) {
  const file = path.join(artifactDir, `${Date.now()}-${name}.png`);
  await page.screenshot({ path: file, fullPage: true });
  log(`screenshot: ${file}`);
  return file;
}

async function clickAny(page, labels) {
  for (const label of labels) {
    const candidates = [
      page.getByRole("button", { name: label, exact: false }),
      page.getByRole("link", { name: label, exact: false }),
      page.getByText(label, { exact: false }),
    ];
    for (const candidate of candidates) {
      try {
        if (await candidate.first().isVisible({ timeout: 1200 })) {
          await candidate.first().click();
          return true;
        }
      } catch {}
    }
  }
  return false;
}

async function fillLabel(page, labels, value) {
  for (const label of labels) {
    try {
      const field = page.getByLabel(label, { exact: false }).first();
      if (await field.isVisible({ timeout: 1200 })) {
        await field.fill(value);
        return true;
      }
    } catch {}
  }
  return false;
}

async function waitForAuthenticatedDashboard(page) {
  await page.goto("https://dash.cloudflare.com/", { waitUntil: "domcontentloaded" });
  const deadline = Date.now() + 10 * 60 * 1000;

  while (Date.now() < deadline) {
    const url = page.url();
    const onDashboard = /dash\.cloudflare\.com/.test(url) && !/login|sign-in|oauth/.test(url);
    const hasDashboardText = await page.getByText(/Workers|Pages|Websites|Account Home/i).first().isVisible().catch(() => false);
    if (onDashboard && hasDashboardText) return;

    log("Log into Cloudflare in the opened browser. The bridge will continue automatically.");
    await page.waitForTimeout(2000);
  }

  throw new Error("Timed out waiting for authenticated Cloudflare dashboard.");
}

async function openWorkersAndPages(page) {
  if (await clickAny(page, ["Workers & Pages", "Workers and Pages"])) {
    await page.waitForLoadState("domcontentloaded").catch(() => {});
    return;
  }

  await page.goto("https://dash.cloudflare.com/?to=/:account/workers-and-pages", { waitUntil: "domcontentloaded" });
}

async function configureProject(page) {
  await openWorkersAndPages(page);
  await screenshot(page, "workers-pages");

  const existing = page.getByText(projectName, { exact: false }).first();
  if (await existing.isVisible().catch(() => false)) {
    log(`Existing Pages project found: ${projectName}`);
    await existing.click();
    return;
  }

  if (!(await clickAny(page, ["Create application", "Create", "Add application"]))) {
    throw new Error("Could not find Create application in Cloudflare dashboard.");
  }

  await page.waitForTimeout(900);
  await clickAny(page, ["Pages", "Connect to Git", "Import a repository"]);
  await page.waitForTimeout(1200);

  const repo = page.getByText(repoSlug, { exact: false }).first();
  if (await repo.isVisible().catch(() => false)) {
    await repo.click();
  } else {
    const repoName = repoSlug.split("/").at(-1);
    const fallback = page.getByText(repoName, { exact: false }).first();
    if (!(await fallback.isVisible().catch(() => false))) {
      await screenshot(page, "repo-not-found");
      throw new Error(`Repository not visible in Cloudflare Git picker: ${repoSlug}`);
    }
    await fallback.click();
  }

  await clickAny(page, ["Begin setup", "Set up", "Next"]);
  await page.waitForTimeout(1000);

  await fillLabel(page, ["Project name"], projectName);
  await fillLabel(page, ["Production branch"], productionBranch);
  await fillLabel(page, ["Build command"], buildCommand);
  await fillLabel(page, ["Build output directory", "Build output", "Output directory"], outputDirectory);

  await screenshot(page, "before-deploy");

  if (!(await clickAny(page, ["Save and Deploy", "Save and deploy", "Deploy site"]))) {
    throw new Error("Could not find Save and Deploy button.");
  }
}

async function waitForDeployment(page) {
  const deadline = Date.now() + 12 * 60 * 1000;
  while (Date.now() < deadline) {
    const body = await page.locator("body").innerText().catch(() => "");
    if (/Success|Deployment complete|Production deployment/i.test(body)) {
      const links = await page.locator('a[href*="pages.dev"]').evaluateAll((els) => els.map((el) => el.href));
      await screenshot(page, "deployment-success");
      return links[0] || null;
    }
    if (/Failed|Error|Deployment failed/i.test(body)) {
      await screenshot(page, "deployment-failed");
      throw new Error("Cloudflare deployment failed. Inspect bridge screenshot and dashboard logs.");
    }
    await page.waitForTimeout(2500);
  }
  throw new Error("Timed out waiting for Cloudflare deployment result.");
}

async function main() {
  const context = await chromium.launchPersistentContext(profileDir, {
    headless: false,
    viewport: { width: 1365, height: 900 },
  });

  const page = context.pages()[0] || await context.newPage();

  try {
    await waitForAuthenticatedDashboard(page);
    log("Authenticated Cloudflare session detected.");
    await configureProject(page);
    const url = await waitForDeployment(page);
    log(url ? `Live: ${url}` : "Deployment succeeded; no pages.dev URL was detected automatically.");
    if (url) log(`Generative page: ${url.replace(/\/$/, "")}/generative/`);
  } finally {
    log("Browser remains open for review. Close it manually when finished.");
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack || error.message : error);
  process.exitCode = 1;
});
