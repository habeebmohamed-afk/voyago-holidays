"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, FileDown, Star, Clock } from "lucide-react";
import { formatINR } from "@/lib/tax-calculator";
import { trackEvent } from "@/lib/analytics";

function BookingConfirmedContent() {
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref") || "VH-2027-9001";
  const title = searchParams.get("title") || "Curated Holiday Package";
  const date = searchParams.get("date") || "2027-03-14";
  const total = Number(searchParams.get("total") || 30450);
  const status = searchParams.get("status") || "Confirmed";
  const method = searchParams.get("method") || "CARD";
  const name = searchParams.get("name") || "Traveler";
  const scope = searchParams.get("scope") || "Domestic";

  const [easeRating, setEaseRating] = useState<number>(5);
  const [heatmapUseful, setHeatmapUseful] = useState<
    "Yes, very helpful" | "Somewhat" | "Didn't use it"
  >("Yes, very helpful");
  const [surveySubmitted, setSurveySubmitted] = useState(false);

  const isPendingNeft = method === "NEFT_RTGS" || status.includes("Pending Bank");

  const handleSurvey = (e: React.FormEvent) => {
    e.preventDefault();
    trackEvent("post_checkout_survey_submitted", {
      ease_rating: easeRating,
      heatmap_useful: heatmapUseful,
    });
    setSurveySubmitted(true);
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 space-y-6">
      <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-md text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-teal-light text-teal-brand">
          {isPendingNeft ? <Clock className="h-8 w-8" /> : <CheckCircle2 className="h-8 w-8" />}
        </div>

        <span className="mt-4 inline-block rounded-full bg-surface px-3 py-1 text-xs font-bold text-navy">
          {status}
        </span>

        <h1 className="mt-2 font-heading text-2xl font-extrabold text-navy">
          {isPendingNeft
            ? "Seats Reserved — Pending NEFT Settlement"
            : "Booking Confirmed! Pack Your Bags."}
        </h1>

        <p className="mt-2 text-sm text-gray-600">
          Booking Reference: <strong className="text-coral">{ref}</strong> • Departure:{" "}
          <strong>{date}</strong>
        </p>

        <div className="mt-5 rounded-2xl bg-surface p-4 text-left text-xs sm:text-sm space-y-1.5">
          <p><strong>Package:</strong> {title}</p>
          <p><strong>Primary Traveler:</strong> {name}</p>
          <p><strong>Amount ({method}):</strong> {formatINR(total)}</p>
          {isPendingNeft && (
            <p className="pt-2 text-xs text-amber-800 font-medium">
              NEFT Virtual Account: VOYAGO-B2B-{ref.slice(-4)} • IFSC: HDFC0000001 (Demo). Your
              automated GSTIN invoice activates upon bank webhook reconciliation.
            </p>
          )}
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <a
            href={`/api/v1/invoices/${encodeURIComponent(ref)}?title=${encodeURIComponent(title)}&amount=${total}&name=${encodeURIComponent(name)}&scope=${scope}`}
            className="inline-flex items-center gap-2 rounded-xl bg-navy px-5 py-3 text-sm font-bold text-white hover:bg-coral transition"
          >
            <FileDown className="h-4 w-4" />
            Download GST / TCS Invoice (PDF)
          </a>
          <Link
            href="/account"
            className="rounded-xl border border-gray-300 px-5 py-3 text-sm font-bold text-navy hover:bg-surface"
          >
            Go to My Account
          </Link>
        </div>
      </div>

      {/* Embedded Post-Checkout Micro-Survey */}
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        {surveySubmitted ? (
          <p className="text-center text-sm font-bold text-teal-brand">
            Thank you for your feedback! It helps us improve Voyago Holidays for fellow travelers.
          </p>
        ) : (
          <form onSubmit={handleSurvey} className="space-y-4">
            <h2 className="font-heading text-base font-bold text-navy">
              Quick 10-Second Feedback
            </h2>
            <div>
              <p className="text-xs font-semibold text-gray-600 mb-2">
                1. How smooth was your checkout experience?
              </p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setEaseRating(n)}
                    className={`rounded-lg border px-3 py-1.5 text-xs font-bold inline-flex items-center gap-1 ${
                      easeRating >= n
                        ? "border-amber-warm bg-amber-50 text-navy"
                        : "border-gray-200 text-gray-400"
                    }`}
                  >
                    <Star className={`h-3.5 w-3.5 ${easeRating >= n ? "fill-amber-warm text-amber-warm" : ""}`} />
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-600 mb-2">
                2. Did the Booking Heat Map help you pick your travel dates?
              </p>
              <div className="flex flex-wrap gap-2">
                {(["Yes, very helpful", "Somewhat", "Didn't use it"] as const).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setHeatmapUseful(opt)}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold border ${
                      heatmapUseful === opt
                        ? "bg-teal-brand text-white border-teal-brand"
                        : "bg-surface text-navy border-gray-200"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="rounded-xl bg-navy px-4 py-2 text-xs font-bold text-white hover:bg-teal-brand"
            >
              Submit Feedback
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function BookingConfirmedPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-gray-500">Loading confirmation...</div>}>
      <BookingConfirmedContent />
    </Suspense>
  );
}
