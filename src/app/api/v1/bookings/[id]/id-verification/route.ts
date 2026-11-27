import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const supabase = createSupabaseAdminClient();

    if (supabase) {
      await supabase.from("id_verifications").insert({
        booking_ref: id,
        traveler_name: body.travelerName || "Traveler",
        cohort: body.cohort || "Girls-only",
        doc_type: body.docType || "Masked Aadhaar",
        doc_reference: body.docReference || "MASKED",
        status: "Pending Review",
      });
    }

    return NextResponse.json({
      bookingRef: id,
      status: "Pending Review",
      slaHours: 24,
    });
  } catch {
    return NextResponse.json({ error: "ID upload failed" }, { status: 400 });
  }
}
