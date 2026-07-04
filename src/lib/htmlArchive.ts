export type HtmlArchiveArtifact = {
  id: string;
  name: string;
  filename: string;
  path: string;
  rawUrl: string;
  size: number;
  sha?: string;
  uploadedAt: string | null;
  source: "github";
};

type ArchiveConfig = {
  repository: string;
  branch: string;
  directory: string;
  token: string;
};

type GithubContentItem = {
  name: string;
  path: string;
  type: string;
  size?: number;
  sha?: string;
};

type GithubWriteResponse = {
  content?: {
    name?: string;
    path?: string;
    sha?: string;
    size?: number;
  };
};

type ArchiveResult<T> =
  | { ok: true; value: T; configured: true }
  | { ok: false; status: number; error: string; configured: boolean };

const defaultRepository = "MirrorCartographer/MirrorCartographer";
const defaultBranch = "main";
const defaultDirectory = "public/html-artifacts";
const maxHtmlBytes = 5 * 1024 * 1024;

export function getHtmlArchiveConfig(): ArchiveConfig {
  return {
    repository: process.env.HTML_ARCHIVE_GITHUB_REPO || defaultRepository,
    branch: process.env.HTML_ARCHIVE_GITHUB_BRANCH || defaultBranch,
    directory: stripSlashes(process.env.HTML_ARCHIVE_GITHUB_DIR || defaultDirectory),
    token: process.env.HTML_ARCHIVE_GITHUB_TOKEN || process.env.GITHUB_TOKEN || "",
  };
}

export function isHtmlArchiveConfigured() {
  return Boolean(getHtmlArchiveConfig().token);
}

export async function listStoredHtmlArtifacts(): Promise<ArchiveResult<HtmlArchiveArtifact[]>> {
  const config = getHtmlArchiveConfig();

  if (!config.token) {
    return notConfigured();
  }

  const response = await fetch(githubContentsUrl(config, config.directory), {
    headers: githubHeaders(config.token),
    cache: "no-store",
  });

  if (response.status === 404) {
    return { ok: true, configured: true, value: [] };
  }

  if (!response.ok) {
    return githubFailure(response.status, await safeGithubError(response), "Could not list stored HTML artifacts.");
  }

  const data = (await response.json()) as GithubContentItem[] | GithubContentItem;
  const items = Array.isArray(data) ? data : [data];
  const artifacts = items
    .filter((item) => item.type === "file" && /\.html?$/i.test(item.name))
    .map((item) => toArtifact(item))
    .sort((a, b) => b.filename.localeCompare(a.filename));

  return { ok: true, configured: true, value: artifacts };
}

export async function storeHtmlArtifact(file: File): Promise<ArchiveResult<HtmlArchiveArtifact>> {
  const config = getHtmlArchiveConfig();

  if (!config.token) {
    return notConfigured();
  }

  if (file.size > maxHtmlBytes) {
    return {
      ok: false,
      configured: true,
      status: 413,
      error: "HTML file is larger than the 5 MB archive limit.",
    };
  }

  const originalName = file.name || "artifact.html";
  if (!/\.html?$/i.test(originalName)) {
    return {
      ok: false,
      configured: true,
      status: 415,
      error: "Only .html or .htm files can be stored in the HTML archive.",
    };
  }

  const html = await file.text();
  if (!html.trim()) {
    return {
      ok: false,
      configured: true,
      status: 400,
      error: "The HTML file is empty.",
    };
  }

  const filename = `${timestampPrefix()}-${sanitizeHtmlFilename(originalName)}`;
  const path = `${config.directory}/${filename}`;

  const response = await fetch(githubContentsUrl(config, path), {
    method: "PUT",
    headers: githubHeaders(config.token),
    body: JSON.stringify({
      message: `Store HTML artifact ${filename}`,
      content: Buffer.from(html, "utf8").toString("base64"),
      branch: config.branch,
    }),
  });

  if (!response.ok) {
    return githubFailure(response.status, await safeGithubError(response), "Could not store HTML artifact.");
  }

  const data = (await response.json()) as GithubWriteResponse;
  const storedItem: GithubContentItem = {
    name: data.content?.name || filename,
    path: data.content?.path || path,
    type: "file",
    size: data.content?.size || file.size,
    sha: data.content?.sha,
  };

  return { ok: true, configured: true, value: toArtifact(storedItem) };
}

export async function readStoredHtmlArtifact(path: string): Promise<ArchiveResult<string>> {
  const config = getHtmlArchiveConfig();
  const normalizedPath = normalizeArtifactPath(path, config.directory);

  if (!normalizedPath) {
    return {
      ok: false,
      configured: Boolean(config.token),
      status: 400,
      error: "Invalid HTML artifact path.",
    };
  }

  if (!config.token) {
    return notConfigured();
  }

  const response = await fetch(githubContentsUrl(config, normalizedPath), {
    headers: {
      ...githubHeaders(config.token),
      Accept: "application/vnd.github.raw",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    return githubFailure(response.status, await safeGithubError(response), "Could not read HTML artifact.");
  }

  return { ok: true, configured: true, value: await response.text() };
}

function toArtifact(item: GithubContentItem): HtmlArchiveArtifact {
  return {
    id: item.path,
    name: displayName(item.name),
    filename: item.name,
    path: item.path,
    rawUrl: `/api/html-artifacts/raw?path=${encodeURIComponent(item.path)}`,
    size: item.size || 0,
    sha: item.sha,
    uploadedAt: extractTimestamp(item.name),
    source: "github",
  };
}

function displayName(filename: string) {
  return filename
    .replace(/^\d{8}T\d{9}Z-/, "")
    .replace(/\.html?$/i, "")
    .replace(/[-_]+/g, " ")
    .trim() || "HTML artifact";
}

function extractTimestamp(filename: string) {
  const match = filename.match(/^(\d{8})T(\d{6})(\d{3})Z-/);
  if (!match) return null;
  const [, date, time, millis] = match;
  return `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}T${time.slice(0, 2)}:${time.slice(2, 4)}:${time.slice(4, 6)}.${millis}Z`;
}

function sanitizeHtmlFilename(filename: string) {
  const leaf = filename.split(/[\\/]/).pop() || "artifact.html";
  const withoutExtension = leaf.replace(/\.html?$/i, "");
  const safeBase = withoutExtension
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._ -]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 90);

  return `${safeBase || "artifact"}.html`;
}

function normalizeArtifactPath(path: string, directory: string) {
  const decoded = decodeURIComponent(path || "").replace(/^\/+/, "");
  const normalizedDirectory = stripSlashes(directory);

  if (decoded.includes("..")) return null;
  if (!decoded.startsWith(`${normalizedDirectory}/`)) return null;
  if (!/\.html?$/i.test(decoded)) return null;

  return decoded;
}

function timestampPrefix() {
  return new Date().toISOString().replace(/[-:.]/g, "");
}

function stripSlashes(value: string) {
  return value.replace(/^\/+|\/+$/g, "");
}

function githubContentsUrl(config: ArchiveConfig, path: string) {
  const encodedPath = stripSlashes(path).split("/").map(encodeURIComponent).join("/");
  return `https://api.github.com/repos/${config.repository}/contents/${encodedPath}?ref=${encodeURIComponent(config.branch)}`;
}

function githubHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "Content-Type": "application/json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

async function safeGithubError(response: Response) {
  try {
    const data = (await response.json()) as { message?: string };
    return data.message || response.statusText;
  } catch {
    return response.statusText;
  }
}

function githubFailure(status: number, detail: string, fallback: string): ArchiveResult<never> {
  return {
    ok: false,
    configured: true,
    status,
    error: detail ? `${fallback} GitHub said: ${detail}` : fallback,
  };
}

function notConfigured(): ArchiveResult<never> {
  return {
    ok: false,
    configured: false,
    status: 501,
    error: "Persistent public storage is not configured. Add HTML_ARCHIVE_GITHUB_TOKEN to the Vercel project environment to enable public saves.",
  };
}
