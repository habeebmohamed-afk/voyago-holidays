import React from "react";
import { LegalPageLayout } from "@/components/LegalPageLayout";

export default function PrivacyPage() {
  return (
    <LegalPageLayout title="Privacy Policy (India DPDP Act Compliant)" lastUpdated="February 20, 2027">
      <p>
        Voyago Holidays respects your digital privacy and processes personal data in alignment with
        India&apos;s Digital Personal Data Protection (DPDP) Act.
      </p>
      <h2 className="font-heading text-base font-bold text-navy pt-2">1. Data We Collect</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>Account details: Name, email, mobile number, and (for B2B) company name &amp; GSTIN.</li>
        <li>Travel compliance: Traveler names/ages, PAN (solely for International TCS Form 27D), and masked Government IDs for gender-restricted cohorts.</li>
        <li>Payment security: Processed via PCI-DSS compliant gateways (Razorpay/PayU). We never store raw card numbers or CVVs.</li>
      </ul>
      <h2 className="font-heading text-base font-bold text-navy pt-2">2. Zero-PII Booking Heat Map Guarantee</h2>
      <p>
        Our Live Booking Heat Map displays strictly anonymized aggregate counts and availability
        tiers. No personal names, phone numbers, genders, or emails of fellow travelers are ever
        exposed via our UI or API payloads.
      </p>
      <h2 className="font-heading text-base font-bold text-navy pt-2">3. Your Rights &amp; Self-Serve Account Deletion</h2>
      <p>
        You may access, correct, or permanently delete your account and associated profile records
        at any time from your <strong>Account Dashboard → Delete My Account</strong>, or by emailing{" "}
        <strong>voyagoholidays.support@gmail.com</strong>.
      </p>
    </LegalPageLayout>
  );
}
