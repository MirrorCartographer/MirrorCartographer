import { readStoredHtmlArtifact } from "@/lib/htmlArchive";

export const dynamic = "force-dynamic";

const previewCsp = [
  "sandbox allow-scripts allow-forms allow-popups allow-modals",
  "default-src 'self' data: blob: https: http:",
  "script-src 'unsafe-inline' 'unsafe-eval' data: blob: https: http:",
  "style-src 'unsafe-inline' data: https: http:",
  "img-src 'self' data: blob: https: http:",
  "font-src 'self' data: https: http:",
  "connect-src 'self' data: blob: https: http:",
  "media-src 'self' data: blob: https: http:",
].join("; ");

export async function GET(request: Request) {
  const url = new URL(request.url);
  const path = url.searchParams.get("path") || "";
  const result = await readStoredHtmlArtifact(path);

  if (!result.ok) {
    return new Response(result.error, {
      status: result.status,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  }

  return new Response(result.value, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "Content-Security-Policy": previewCsp,
      "X-Content-Type-Options": "nosniff",
    },
  });
}
