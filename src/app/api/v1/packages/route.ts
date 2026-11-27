import { NextRequest, NextResponse } from "next/server";
import { SEED_PACKAGES } from "@/lib/seed-data";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const scope = searchParams.get("scope");
  const cohort = searchParams.get("cohort");
  const theme = searchParams.get("theme");
  const minBudget = Number(searchParams.get("minBudget") || 10000);
  const maxBudget = Number(searchParams.get("maxBudget") || 500000);
  const sort = searchParams.get("sort") || "recommended";

  let list = SEED_PACKAGES.filter((p) => {
    if (scope && scope !== "All" && p.scope !== scope) return false;
    if (cohort && p.cohort !== cohort) return false;
    if (theme && p.theme !== theme) return false;
    if (p.priceInr < minBudget || p.priceInr > maxBudget) return false;
    return true;
  });

  if (sort === "price_asc") list = [...list].sort((a, b) => a.priceInr - b.priceInr);
  if (sort === "price_desc") list = [...list].sort((a, b) => b.priceInr - a.priceInr);
  if (sort === "most_active") list = [...list].sort((a, b) => b.bookedPreview - a.bookedPreview);

  return NextResponse.json({ count: list.length, packages: list });
}
