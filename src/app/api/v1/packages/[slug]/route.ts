import { NextRequest, NextResponse } from "next/server";
import { SEED_PACKAGES } from "@/lib/seed-data";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  const pkg = SEED_PACKAGES.find((p) => p.slug === slug);
  if (!pkg) {
    return NextResponse.json({ error: "Package not found" }, { status: 404 });
  }
  return NextResponse.json({ package: pkg });
}
