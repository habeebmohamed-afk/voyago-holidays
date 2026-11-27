import React from "react";
import { LegalPageLayout } from "@/components/LegalPageLayout";

export default function VisaDisclaimerPage() {
  return (
    <LegalPageLayout title="International Visa & Insurance Disclaimer" lastUpdated="February 20, 2027">
      <p>
        For all International packages booked through Voyago Holidays, please review the following
        mandatory disclosures:
      </p>
      <ul className="list-disc pl-5 space-y-2">
        <li>
          <strong>No Visa Guarantee:</strong> Voyago Holidays provides curated visa documentation
          checklists, hotel vouchers, and filing facilitation where explicitly listed in package
          inclusions. Final visa approval, duration, or rejection rests strictly at the discretion
          of the respective Embassy, Consulate, or Immigration authority.
        </li>
        <li>
          <strong>Separate Visa Fees:</strong> Government embassy fees, VFS charges, and
          Visa-on-Arrival fees are itemized separately and are non-refundable once submitted.
        </li>
        <li>
          <strong>Travel Insurance:</strong> Comprehensive international travel and medical
          insurance (mandatory for Schengen and strongly advised for Southeast Asia/UAE) is the
          traveler&apos;s responsibility unless explicitly bundled in a custom B2B quote.
        </li>
        <li>
          <strong>Passport Validity:</strong> Travelers must hold a passport valid for at least 6
          months beyond the scheduled return date with at least two blank pages.
        </li>
      </ul>
    </LegalPageLayout>
  );
}
