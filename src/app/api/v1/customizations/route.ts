import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const referenceCode = `VH-CUST-${Math.floor(1000 + Math.random() * 9000)}`;

    const supabase = createSupabaseAdminClient();
    if (supabase) {
      await supabase.from("customizations").insert({
        reference_code: referenceCode,
        traveler_type: body.travelerType || "B2C",
        full_name: body.fullName,
        phone: body.phone,
        email: body.email,
        company_name: body.companyName || null,
        destinations: body.destinations,
        travel_dates: body.travelDates,
        traveler_count: Number(body.travelerCount) || 2,
        budget_range: body.budgetRange,
        cohort: body.cohort || null,
        theme: body.theme || null,
        notes: body.notes || null,
      });
    }

    // Optional lightweight webhook to Zoho CRM / HubSpot Starter (no Salesforce)
    if (process.env.CRM_WEBHOOK_URL) {
      fetch(process.env.CRM_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ referenceCode, ...body }),
      }).catch(() => {});
    }

    return NextResponse.json({
      success: true,
      referenceCode,
      sla: "Under 2 business hours",
    });
  } catch {
    return NextResponse.json({ error: "Failed to log customization lead" }, { status: 400 });
  }
}
