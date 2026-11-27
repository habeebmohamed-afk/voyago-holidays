import { NextRequest, NextResponse } from "next/server";
import { getSeedHeatMapForMonth, SEED_PACKAGES } from "@/lib/seed-data";

/**
 * Strictly ZERO-PII endpoint returning anonymized daily counts & availability tiers.
 * Cached with Cache-Control s-maxage=3600 (1-hour TTL) on Vercel Edge.
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  const exists = SEED_PACKAGES.some((p) => p.slug === slug);
  if (!exists) {
    return NextResponse.json({ error: "Package not found" }, { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const monthParam = searchParams.get("month") || "2027-03";
  const [yStr, mStr] = monthParam.split("-");
  const year = Number(yStr) || 2027;
  const monthZero = Math.max(0, Math.min(11, (Number(mStr) || 3) - 1));

  const departures = getSeedHeatMapForMonth(slug, year, monthZero);

  return NextResponse.json(
    {
      packageSlug: slug,
      month: `${year}-${String(monthZero + 1).padStart(2, "0")}`,
      anonymized: true,
      departures,
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
      },
    }
  );
}
