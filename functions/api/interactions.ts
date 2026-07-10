type Env = {
  GITHUB_TOKEN?: string;
  GITHUB_OWNER?: string;
  GITHUB_REPO?: string;
  GITHUB_BRANCH?: string;
  GITHUB_EVENT_PATH?: string;
  MC_INGEST_SECRET?: string;
};

type InteractionPayload = {
  generation?: number;
  grammar?: Record<string, unknown>;
  selectedDeadEnd?: Record<string, unknown>;
  eventType?: string;
  sessionId?: string;
  clientTime?: string;
  path?: string;
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body, null, 2), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "POST, OPTIONS",
      "access-control-allow-headers": "content-type, x-mc-ingest-secret",
    },
  });

const cleanText = (value: unknown, fallback = "unknown") =>
  String(value ?? fallback)
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || fallback;

const encodeBase64 = (value: string) => btoa(unescape(encodeURIComponent(value)));

export const onRequestOptions: PagesFunction<Env> = async () => json({ ok: true });

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!env.GITHUB_TOKEN) return json({ ok: false, error: "missing GITHUB_TOKEN" }, 501);
  if (!env.GITHUB_OWNER || !env.GITHUB_REPO) return json({ ok: false, error: "missing GitHub repo env" }, 501);

  if (env.MC_INGEST_SECRET) {
    const supplied = request.headers.get("x-mc-ingest-secret");
    if (supplied !== env.MC_INGEST_SECRET) return json({ ok: false, error: "unauthorized" }, 401);
  }

  let payload: InteractionPayload;
  try {
    payload = await request.json();
  } catch {
    return json({ ok: false, error: "invalid JSON" }, 400);
  }

  const now = new Date().toISOString();
  const generation = Number.isFinite(Number(payload.generation)) ? Number(payload.generation) : 0;
  const eventType = cleanText(payload.eventType, "interaction");
  const sessionId = cleanText(payload.sessionId, "anonymous");
  const branch = env.GITHUB_BRANCH || "main";
  const root = env.GITHUB_EVENT_PATH || "data/public-interactions";
  const filePath = `${root}/${now.slice(0, 10)}/${now.replace(/[:.]/g, "-")}-${eventType}-${sessionId}.json`;

  const record = {
    schema: "mirror-cartographer.public-interaction.v1",
    receivedAt: now,
    eventType,
    sessionId,
    generation,
    sourcePath: payload.path || "/generative",
    clientTime: payload.clientTime || null,
    grammar: payload.grammar || null,
    selectedDeadEnd: payload.selectedDeadEnd || null,
    privacy: "public behavioral capsule; no raw chat; no personal identity required",
  };

  const response = await fetch(`https://api.github.com/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/contents/${filePath}`, {
    method: "PUT",
    headers: {
      authorization: `Bearer ${env.GITHUB_TOKEN}`,
      accept: "application/vnd.github+json",
      "content-type": "application/json",
      "user-agent": "mirror-cartographer-cloudflare-ingest",
    },
    body: JSON.stringify({
      message: `Record public generative interaction ${eventType}`,
      branch,
      content: encodeBase64(JSON.stringify(record, null, 2)),
    }),
  });

  const result = await response.json().catch(() => ({}));
  if (!response.ok) return json({ ok: false, status: response.status, result }, response.status);

  return json({ ok: true, path: filePath, commit: result?.commit?.sha || null });
};
