import { spawnSync } from "node:child_process";
import process from "node:process";

const required = ["CLOUDFLARE_API_TOKEN", "CLOUDFLARE_ACCOUNT_ID"];
const missing = required.filter((name) => !process.env[name]);
if (missing.length) {
  console.error(`Missing required environment variables: ${missing.join(", ")}`);
  process.exit(1);
}

const token = process.env.CLOUDFLARE_API_TOKEN;
const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const projectName = process.env.CLOUDFLARE_PROJECT_NAME || "mirror-cartographer";
const productionBranch = process.env.CLOUDFLARE_PRODUCTION_BRANCH || "main";
const outputDir = process.env.CLOUDFLARE_OUTPUT_DIR || "out";

async function api(path, options = {}) {
  const response = await fetch(`https://api.cloudflare.com/client/v4${path}`, {
    ...options,
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
      ...(options.headers || {}),
    },
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok || body?.success === false) {
    throw new Error(`Cloudflare API ${response.status}: ${JSON.stringify(body)}`);
  }
  return body;
}

function run(command, args, extraEnv = {}) {
  const result = spawnSync(command, args, {
    stdio: "inherit",
    shell: process.platform === "win32",
    env: { ...process.env, ...extraEnv },
  });
  if (result.status !== 0) process.exit(result.status || 1);
}

async function ensureProject() {
  try {
    const existing = await api(`/accounts/${accountId}/pages/projects/${projectName}`);
    console.log(`Cloudflare Pages project exists: ${existing?.result?.subdomain || projectName}`);
    return existing.result;
  } catch (error) {
    if (!String(error).includes("404")) throw error;
  }

  const created = await api(`/accounts/${accountId}/pages/projects`, {
    method: "POST",
    body: JSON.stringify({ name: projectName, production_branch: productionBranch }),
  });
  console.log(`Created Cloudflare Pages project: ${created?.result?.subdomain || projectName}`);
  return created.result;
}

async function main() {
  await api("/user/tokens/verify");
  console.log("Cloudflare token verified.");
  const project = await ensureProject();

  run("npm", ["run", "build:cloudflare"]);
  run("npx", ["--yes", "wrangler@latest", "pages", "deploy", outputDir, "--project-name", projectName, "--branch", productionBranch], {
    CLOUDFLARE_API_TOKEN: token,
    CLOUDFLARE_ACCOUNT_ID: accountId,
  });

  const url = project?.subdomain ? `https://${project.subdomain}` : `https://${projectName}.pages.dev`;
  console.log(`Deployment requested. Public URL: ${url}`);
  console.log(`Generative page: ${url}/generative`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
