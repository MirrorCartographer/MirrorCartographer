import { NextRequest, NextResponse } from "next/server";
import { reflect } from "../../../../lib/reflect";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = reflect(body);

    if (!result.ok) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: "Invalid reflection request."
      },
      { status: 400 }
    );
  }
}
