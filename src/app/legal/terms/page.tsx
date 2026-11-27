import React from "react";
import { LegalPageLayout } from "@/components/LegalPageLayout";

export default function TermsPage() {
  return (
    <LegalPageLayout title="Terms of Service" lastUpdated="February 20, 2027">
      <p>
        Welcome to <strong>Voyago Holidays</strong> (headquartered in Rameshwaram, Tamil Nadu,
        India). By browsing our catalog, registering a B2C or B2B account, submitting a
        customization request, or completing Direct Checkout, you agree to these starter Terms of
        Service.
      </p>
      <h2 className="font-heading text-base font-bold text-navy pt-2">1. Direct B2C &amp; B2B Booking Model</h2>
      <p>
        Voyago Holidays operates strictly as a direct-to-traveler (B2C) and direct-to-corporate
        (B2B) tour operator. Third-party reselling, unauthorized sub-booking, or scraping of our
        Booking Heat Map data is prohibited.
      </p>
      <h2 className="font-heading text-base font-bold text-navy pt-2">2. Pricing, GST &amp; International TCS</h2>
      <p>
        All package prices are listed in Indian Rupees (INR). Tour Operator GST (5%) is itemized
        separately at checkout. For International packages, applicable Overseas Tour Program Package
        TCS under the Indian Income Tax Act requires a valid 10-character PAN for Form 27D
        reporting.
      </p>
      <h2 className="font-heading text-base font-bold text-navy pt-2">3. Seat Locking &amp; Payments</h2>
      <p>
        Initiating checkout reserves departure seats for 15 minutes. Bookings paid via Cards,
        NetBanking, or UPI (up to ₹1,00,000 per transaction) confirm immediately upon gateway
        settlement. B2B NEFT/RTGS bookings remain in <em>Reserved — Pending Bank Settlement</em>{" "}
        until reconciled by our Finance team.
      </p>
      <h2 className="font-heading text-base font-bold text-navy pt-2">4. Governing Law</h2>
      <p>
        These terms are governed by the laws of India, with exclusive jurisdiction in the courts of
        Tamil Nadu. <em>Note: Created for educational purposes only.</em>
      </p>
    </LegalPageLayout>
  );
}
