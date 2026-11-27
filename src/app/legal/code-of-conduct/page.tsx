import React from "react";
import { LegalPageLayout } from "@/components/LegalPageLayout";

export default function CodeOfConductPage() {
  return (
    <LegalPageLayout title="Mindset Cohort Traveler Code of Conduct" lastUpdated="February 20, 2027">
      <p>
        Voyago Holidays curates trips around compatible Mindset Cohorts (Girls-only, Boys-only,
        Couple-friendly, Family-friendly, and Bachelors-friendly). To preserve a safe, respectful,
        and joyful environment for everyone:
      </p>
      <ul className="list-disc pl-5 space-y-2">
        <li>
          <strong>Mandatory 24-Hour ID Verification:</strong> Travelers booking Girls-only or
          Boys-only departures must upload a valid Government ID (masked Aadhaar, Passport, or
          Driving License) within 24 hours of booking.
        </li>
        <li>
          <strong>Zero Harassment Policy:</strong> Harassment, discrimination, intimidation, or
          disruptive intoxication toward fellow travelers, trip captains, or local hosts will result
          in immediate removal from the tour without refund.
        </li>
        <li>
          <strong>Respect Local Culture &amp; Timings:</strong> Follow safety briefings during
          adventure activities (rafting, high-altitude drives) and respect group departure timings.
        </li>
        <li>
          <strong>24/7 Human Escalation:</strong> Any concern during a trip can be escalated
          immediately to our human Travel Desk via Toll-Free <strong>1800-000-0000</strong> or{" "}
          <strong>voyagoholidays.support@gmail.com</strong>.
        </li>
      </ul>
    </LegalPageLayout>
  );
}
