import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

/**
 * Idempotent Razorpay / PayU Webhook Listener
 * Reconciles asynchronous payments & orphaned orders.
 */
export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-razorpay-signature") || "";
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (webhookSecret && !webhookSecret.includes("REPLACE_WITH")) {
      const expected = crypto
        .createHmac("sha256", webhookSecret)
        .update(rawBody)
        .digest("hex");
      if (signature && expected !== signature) {
        return NextResponse.json({ error: "Invalid webhook signature" }, { status: 401 });
      }
    }

    const payload = JSON.parse(rawBody || "{}");
    const bookingRef = payload?.payload?.payment?.entity?.notes?.booking_ref;

    const supabase = createSupabaseAdminClient();
    if (supabase && bookingRef) {
      await supabase
        .from("bookings")
        .update({ payment_status: "PAID", booking_status: "Confirmed" })
        .eq("booking_ref", bookingRef);
    }

    return NextResponse.json({ received: true, reconciled: Boolean(bookingRef) });
  } catch {
    return NextResponse.json({ error: "Malformed webhook payload" }, { status: 400 });
  }
}
