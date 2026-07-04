import { NextResponse } from "next/server";
import { listStoredHtmlArtifacts, storeHtmlArtifact } from "@/lib/htmlArchive";

export const dynamic = "force-dynamic";

export async function GET() {
  const result = await listStoredHtmlArtifacts();

  if (!result.ok) {
    return NextResponse.json(
      {
        configured: result.configured,
        artifacts: [],
        error: result.error,
      },
      { status: result.configured ? result.status : 200 },
    );
  }

  return NextResponse.json({
    configured: true,
    artifacts: result.value,
  });
}

export async function POST(request: Request) {
  let file: File | null = null;

  try {
    const form = await request.formData();
    const value = form.get("file");
    if (value && typeof value !== "string") {
      file = value;
    }
  } catch {
    return NextResponse.json({ error: "Upload must be multipart form data with a file field." }, { status: 400 });
  }

  if (!file) {
    return NextResponse.json({ error: "No HTML file was provided." }, { status: 400 });
  }

  const result = await storeHtmlArtifact(file);

  if (!result.ok) {
    return NextResponse.json(
      {
        configured: result.configured,
        error: result.error,
      },
      { status: result.status },
    );
  }

  return NextResponse.json(
    {
      configured: true,
      artifact: result.value,
    },
    { status: 201 },
  );
}
