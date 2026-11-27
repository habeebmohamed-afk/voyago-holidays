import type { BookingRecord } from "@/types";

function escapePdfText(input: string): string {
  return input
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)")
    .replace(/₹/g, "INR ")
    .replace(/[^\x20-\x7E]/g, " ");
}

function formatInrAscii(amount: number): string {
  return `INR ${amount.toLocaleString("en-IN")}`;
}

/**
 * Generates a valid, dependency-free PDF 1.4 Tax Invoice (GST + Int'l TCS)
 * compatible with Vercel Serverless Functions without headless Chromium.
 */
export function generateGstInvoicePdf(booking: BookingRecord): Buffer {
  const lines: Array<{ text: string; size?: number; bold?: boolean; y: number }> = [
    { text: "VOYAGO HOLIDAYS — TAX INVOICE (GST / TCS)", size: 16, bold: true, y: 785 },
    { text: "Direct B2C & Corporate B2B Curated Travel Platform", size: 10, y: 767 },
    { text: "Office: Rameshwaram, Tamil Nadu, India | Support: voyagoholidays.support@gmail.com | Toll-Free: 1800-000-0000", size: 9, y: 752 },
    { text: "----------------------------------------------------------------------------------------------------", size: 9, y: 738 },
    { text: `Invoice / Booking Ref: ${booking.bookingRef}`, size: 11, bold: true, y: 718 },
    { text: `Issue Date: ${new Date(booking.createdAt).toLocaleDateString("en-IN")}    |    Customer Type: ${booking.customerType}`, size: 10, y: 702 },
    { text: `Booking Status: ${booking.bookingStatus}    |    Payment Mode: ${booking.paymentMethod}`, size: 10, y: 686 },
    { text: "BILL TO:", size: 11, bold: true, y: 658 },
    { text: `Name: ${booking.contactName}`, size: 10, y: 642 },
    { text: `Email: ${booking.contactEmail}    |    Phone: ${booking.contactPhone}`, size: 10, y: 626 },
  ];

  let cursorY = 610;
  if (booking.companyName) {
    lines.push({ text: `Company: ${booking.companyName}    |    GSTIN: ${booking.gstin || "N/A"}`, size: 10, y: cursorY });
    cursorY -= 16;
  }
  if (booking.panNumber) {
    lines.push({ text: `Traveler PAN (for Overseas TCS / Form 27D): ${booking.panNumber}`, size: 10, y: cursorY });
    cursorY -= 16;
  }

  cursorY -= 12;
  lines.push({ text: "TRIP & COHORT DETAILS:", size: 11, bold: true, y: cursorY });
  cursorY -= 18;
  lines.push({ text: `Package: ${booking.packageTitle}`, size: 10, y: cursorY });
  cursorY -= 16;
  lines.push({ text: `Scope: ${booking.scope}   |   Mindset Cohort: ${booking.cohort}   |   Departure: ${booking.departureDate}`, size: 10, y: cursorY });
  cursorY -= 16;
  lines.push({ text: `Total Travelers: ${booking.travelerCount}`, size: 10, y: cursorY });

  cursorY -= 26;
  lines.push({ text: "TAX & PAYMENT BREAKDOWN (INR):", size: 11, bold: true, y: cursorY });
  cursorY -= 14;
  lines.push({ text: "----------------------------------------------------------------------------------------------------", size: 9, y: cursorY });
  cursorY -= 18;
  lines.push({ text: `Base Package Fare (${booking.travelerCount} pax) :  ${formatInrAscii(booking.baseAmount)}`, size: 10, y: cursorY });
  cursorY -= 16;
  if (booking.b2bDiscount > 0) {
    lines.push({ text: `B2B Corporate Group Discount          : -${formatInrAscii(booking.b2bDiscount)}`, size: 10, y: cursorY });
    cursorY -= 16;
  }
  lines.push({ text: `Tour Operator GST (5%)                :  ${formatInrAscii(booking.gstAmount)}`, size: 10, y: cursorY });
  cursorY -= 16;
  if (booking.tcsAmount > 0) {
    lines.push({ text: `Overseas Tour TCS (5% - Form 27D)     :  ${formatInrAscii(booking.tcsAmount)}`, size: 10, y: cursorY });
    cursorY -= 16;
  }
  lines.push({ text: "----------------------------------------------------------------------------------------------------", size: 9, y: cursorY });
  cursorY -= 20;
  lines.push({ text: `GRAND TOTAL PAYABLE / PAID            :  ${formatInrAscii(booking.grandTotal)}`, size: 12, bold: true, y: cursorY });

  cursorY -= 36;
  lines.push({ text: "COMPLIANCE NOTES:", size: 10, bold: true, y: cursorY });
  cursorY -= 15;
  lines.push({ text: "1. Girls-only & Boys-only trips require Government ID verification within 24 hours of booking.", size: 9, y: cursorY });
  cursorY -= 14;
  lines.push({ text: "2. For B2B NEFT/RTGS bookings, final tax receipt activates upon bank settlement reconciliation.", size: 9, y: cursorY });
  cursorY -= 14;
  lines.push({ text: "3. This is a system-generated sandbox tax invoice. Note: Created for educational purposes only.", size: 9, y: cursorY });

  const streamOps = [
    "BT",
    ...lines.map((line) => {
      const font = line.bold ? "/F2" : "/F1";
      const size = line.size ?? 10;
      return `${font} ${size} Tf 1 0 0 1 48 ${line.y} Tm (${escapePdfText(line.text)}) Tj`;
    }),
    "ET",
  ].join("\n");

  const objects: string[] = [
    "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n",
    "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n",
    "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>\nendobj\n",
    "4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n",
    "5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n",
    `6 0 obj\n<< /Length ${Buffer.byteLength(streamOps, "utf8")} >>\nstream\n${streamOps}\nendstream\nendobj\n`,
  ];

  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [0];
  for (const obj of objects) {
    offsets.push(Buffer.byteLength(pdf, "utf8"));
    pdf += obj;
  }

  const xrefStart = Buffer.byteLength(pdf, "utf8");
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";
  for (let i = 1; i < offsets.length; i++) {
    pdf += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`;

  return Buffer.from(pdf, "utf8");
}
