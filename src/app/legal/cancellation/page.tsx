import React from "react";
import { LegalPageLayout } from "@/components/LegalPageLayout";

export default function CancellationPage() {
  return (
    <LegalPageLayout title="Cancellation & Refund Policy" lastUpdated="February 20, 2027">
      <p>
        We keep cancellation slabs transparent before you pay so there are no surprises if plans
        change.
      </p>
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="bg-surface border-b border-gray-200 text-navy">
              <th className="p-3 font-bold">Time Before Departure</th>
              <th className="p-3 font-bold">Refund Amount</th>
              <th className="p-3 font-bold">Processing Timeline</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <tr>
              <td className="p-3">30+ days prior to departure</td>
              <td className="p-3 font-semibold text-emerald-700">90% of package fare</td>
              <td className="p-3">5–7 business days to original source</td>
            </tr>
            <tr>
              <td className="p-3">15 to 29 days prior to departure</td>
              <td className="p-3 font-semibold text-amber-700">50% of package fare</td>
              <td className="p-3">5–7 business days to original source</td>
            </tr>
            <tr>
              <td className="p-3">Less than 15 days prior to departure</td>
              <td className="p-3 font-semibold text-red-600">Non-refundable</td>
              <td className="p-3">Credit shell subject to hotel/partner approval</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        <strong>Cohort ID Verification Refunds:</strong> Bookings on Girls-only or Boys-only trips
        that fail mandatory 24-hour ID verification are either reassigned to an open cohort or
        refunded net of non-recoverable payment gateway charges.
      </p>
    </LegalPageLayout>
  );
}
