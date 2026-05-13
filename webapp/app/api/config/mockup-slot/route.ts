import { NextResponse } from "next/server";
import { DEFAULT_MOCKUP_SLOT, getMockupSlot, setMockupSlot, type MockupSlotRect } from "@/lib/config";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ slot: getMockupSlot(), default: DEFAULT_MOCKUP_SLOT });
}

export async function PUT(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { x, y, w, h } = body as Partial<MockupSlotRect>;
  for (const v of [x, y, w, h]) {
    if (typeof v !== "number" || !Number.isFinite(v)) {
      return NextResponse.json({ error: "x, y, w, h must all be finite numbers" }, { status: 400 });
    }
  }
  setMockupSlot({ x: x!, y: y!, w: w!, h: h! });
  return NextResponse.json({ slot: getMockupSlot() });
}
