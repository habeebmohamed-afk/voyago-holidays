import { NextRequest, NextResponse } from "next/server";
import { generateGstInvoicePdf } from "@/lib/pdf-invoice";
import type { BookingRecord, PackageScope } from "@/types";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ bookingId: string }> }
) {
  const { bookingId } = await context.params;
  const { searchParams } = new URL(request.url);

  const scope = (searchParams.get("scope") === "International"
    ? "International"
    : "Domestic") as PackageScope;
  const grandTotal = Math.max(1000, Number(searchParams.get("amount") || 30450));
  const gstAmount = Math.round(grandTotal * 0.05);
  const tcsAmount = scope === "International" ? Math.round(grandTotal * 0.05) : 0;
  const baseAmount = grandTotal - gstAmount - tcsAmount;

  const booking: BookingRecord = {
    bookingRef: bookingId,
    customerType: "B2C",
    packageSlug: "voyago-package",
    packageTitle: searchParams.get("title") || "Voyago Holidays Curated Package",
    scope,
    cohort: "Couple-friendly",
    departureDate: "2027-03-14",
    travelerCount: 2,
    travelers: [],
    contactName: searchParams.get("name") || "Voyago Traveler",
    contactEmail: "traveler@example.com",
    contactPhone: "+91 98765 00000",
    baseAmount,
    b2bDiscount: 0,
    gstAmount,
    tcsAmount,
    grandTotal,
    paymentMethod: "CARD",
    paymentStatus: "PAID",
    bookingStatus: "Confirmed",
    createdAt: new Date().toISOString(),
  };

  const pdfBuffer = generateGstInvoicePdf(booking);

  return new NextResponse(new Uint8Array(pdfBuffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="Voyago-Invoice-${bookingId}.pdf"`,
    },
  });
}
