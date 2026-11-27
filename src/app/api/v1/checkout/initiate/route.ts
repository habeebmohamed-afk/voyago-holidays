import { NextRequest, NextResponse } from "next/server";
import { SEED_PACKAGES } from "@/lib/seed-data";
import {
  calculatePriceBreakdown,
  isValidPAN,
  UPI_TRANSACTION_CAP_INR,
} from "@/lib/tax-calculator";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { BookingRecord } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const pkg = SEED_PACKAGES.find((p) => p.slug === body.packageSlug);
    if (!pkg) {
      return NextResponse.json({ error: "Invalid package" }, { status: 404 });
    }

    const customerType: "B2C" | "B2B" = body.customerType === "B2B" ? "B2B" : "B2C";
    const pax = Math.max(1, Number(body.travelerCount) || 1);
    const pricing = calculatePriceBreakdown(pkg.priceInr, pax, pkg.scope, customerType);

    if (pkg.scope === "International" && (!body.panNumber || !isValidPAN(body.panNumber))) {
      return NextResponse.json(
        { error: "Valid 10-character PAN is required for International TCS (Form 27D)." },
        { status: 400 }
      );
    }

    if (body.paymentMethod === "UPI" && pricing.grandTotal > UPI_TRANSACTION_CAP_INR) {
      return NextResponse.json(
        { error: "UPI is capped at ₹1,00,000 per transaction." },
        { status: 400 }
      );
    }

    const bookingRef = `VH-2027-${Math.floor(1000 + Math.random() * 9000)}`;
    const isNeft = body.paymentMethod === "NEFT_RTGS";
    const isCallback = body.paymentMethod === "CALLBACK_FALLBACK";
    const isGenderRestricted = pkg.cohort === "Girls-only" || pkg.cohort === "Boys-only";

    const booking: BookingRecord = {
      bookingRef,
      customerType,
      packageSlug: pkg.slug,
      packageTitle: pkg.title,
      scope: pkg.scope,
      cohort: pkg.cohort,
      departureDate: body.departureDate || "2027-03-14",
      travelerCount: pax,
      travelers: [{ name: body.contactName, age: 28, gender: "Other" }],
      contactName: body.contactName,
      contactEmail: body.contactEmail,
      contactPhone: body.contactPhone,
      companyName: body.companyName,
      gstin: body.gstin,
      panNumber: body.panNumber,
      baseAmount: pricing.baseAmount,
      b2bDiscount: pricing.b2bDiscount,
      gstAmount: pricing.gstAmount,
      tcsAmount: pricing.tcsAmount,
      grandTotal: pricing.grandTotal,
      paymentMethod: body.paymentMethod,
      paymentStatus: isNeft || isCallback ? "PENDING_NEFT" : "PAID",
      bookingStatus: isNeft || isCallback
        ? "Reserved — Pending Bank Settlement"
        : isGenderRestricted
          ? "ID Verification Pending"
          : "Confirmed",
      createdAt: new Date().toISOString(),
    };

    const supabase = createSupabaseAdminClient();
    if (supabase) {
      await supabase.from("bookings").insert({
        booking_ref: booking.bookingRef,
        customer_type: booking.customerType,
        package_slug: booking.packageSlug,
        package_title: booking.packageTitle,
        scope: booking.scope,
        cohort: booking.cohort,
        departure_date: booking.departureDate,
        traveler_count: booking.travelerCount,
        travelers: booking.travelers,
        contact_name: booking.contactName,
        contact_email: booking.contactEmail,
        contact_phone: booking.contactPhone,
        company_name: booking.companyName || null,
        gstin: booking.gstin || null,
        pan_number: booking.panNumber || null,
        base_amount: booking.baseAmount,
        b2b_discount: booking.b2bDiscount,
        gst_amount: booking.gstAmount,
        tcs_amount: booking.tcsAmount,
        grand_total: booking.grandTotal,
        payment_method: booking.paymentMethod,
        payment_status: booking.paymentStatus,
        booking_status: booking.bookingStatus,
      });
    }

    return NextResponse.json({
      gateway: process.env.PAYMENT_GATEWAY_PROVIDER || "razorpay-sandbox",
      orderId: `order_sandbox_${bookingRef}`,
      booking,
    });
  } catch {
    return NextResponse.json({ error: "Unable to initiate checkout" }, { status: 500 });
  }
}
