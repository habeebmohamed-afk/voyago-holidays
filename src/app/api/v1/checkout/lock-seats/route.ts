import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { packageSlug, departureDate, seats } = body;
    if (!packageSlug || !departureDate || !seats) {
      return NextResponse.json({ error: "Missing seat lock parameters" }, { status: 400 });
    }

    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();
    const supabase = createSupabaseAdminClient();
    if (supabase) {
      await supabase.from("seat_locks").insert({
        package_slug: packageSlug,
        departure_date: departureDate,
        seats_locked: Number(seats),
        expires_at: expiresAt,
      });
    }

    return NextResponse.json({
      locked: true,
      packageSlug,
      departureDate,
      seatsLocked: Number(seats),
      expiresAt,
    });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
