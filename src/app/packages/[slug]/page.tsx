"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  MapPin,
  Clock,
  Users,
  CheckCircle2,
  XCircle,
  Lock,
  ChevronDown,
  ChevronUp,
  Heart,
  ShieldAlert,
  ArrowLeft,
} from "lucide-react";
import { SEED_PACKAGES, getSeedHeatMapForMonth } from "@/lib/seed-data";
import { calculatePriceBreakdown, formatINR } from "@/lib/tax-calculator";
import { BookingHeatMap } from "@/components/BookingHeatMap";
import { useAuth } from "@/context/AuthContext";
import type { HeatMapDeparture } from "@/types";

export default function PackageDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = String(params?.slug || "");
  const pkg = SEED_PACKAGES.find((p) => p.slug === slug);

  const { user, openAuthModal, savedSlugs, toggleSavedTrip } = useAuth();

  const defaultDepartures = useMemo(
    () => (pkg ? getSeedHeatMapForMonth(pkg.slug, 2027, 2) : []),
    [pkg]
  );

  const [selectedDep, setSelectedDep] = useState<HeatMapDeparture | null>(
    defaultDepartures[0] || null
  );
  const [travelerCount, setTravelerCount] = useState<number>(2);
  const [openDay, setOpenDay] = useState<number>(1);
  const [policyTab, setPolicyTab] = useState<"safety" | "cancellation" | "visa">("safety");

  if (!pkg) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="font-heading text-2xl font-bold text-navy">Package Not Found</h1>
        <Link href="/packages" className="mt-4 inline-block text-sm font-semibold text-coral underline">
          Return to all packages
        </Link>
      </div>
    );
  }

  const customerType = user?.role === "B2B" ? "B2B" : "B2C";
  const pricing = calculatePriceBreakdown(
    pkg.priceInr,
    travelerCount,
    pkg.scope,
    customerType
  );
  const isSaved = savedSlugs.includes(pkg.slug);

  const handleCheckoutClick = () => {
    const depDate = selectedDep?.date || "2027-03-14";
    if (!user) {
      openAuthModal({
        mode: "signup",
        reason: "Sign in or create a free account to lock your seats and proceed to 3-step Direct Checkout.",
      });
      return;
    }
    router.push(
      `/checkout?slug=${pkg.slug}&date=${depDate}&pax=${travelerCount}`
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/packages"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-brand hover:underline mb-4"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Packages
      </Link>

      {/* Header Banner */}
      <div className={`rounded-3xl bg-gradient-to-br ${pkg.gradient} p-6 sm:p-10 text-white shadow-md`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
              {pkg.scope}
            </span>
            <span className="rounded-full bg-navy/80 px-3 py-1 text-xs font-semibold">
              {pkg.cohort}
            </span>
            <span className="rounded-full bg-white text-navy px-3 py-1 text-xs font-bold">
              {pkg.theme}
            </span>
          </div>
          <button
            type="button"
            onClick={() => toggleSavedTrip(pkg.slug)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-white/15 px-3.5 py-2 text-xs font-semibold hover:bg-white/25 transition"
          >
            <Heart className={`h-4 w-4 ${isSaved ? "fill-coral text-coral" : "text-white"}`} />
            {isSaved ? "Saved" : "Save Trip"}
          </button>
        </div>

        <h1 className="mt-4 font-heading text-2xl sm:text-4xl font-extrabold">{pkg.title}</h1>
        <div className="mt-3 flex flex-wrap items-center gap-5 text-xs sm:text-sm text-white/90">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-amber-warm" />
            {pkg.location}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-amber-warm" />
            {pkg.duration}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Users className="h-4 w-4 text-amber-warm" />
            {pkg.heatMapSummary}
          </span>
        </div>
      </div>

      {/* Main 2-Column Layout */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-8">
          {/* Overview & Highlights */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="font-heading text-lg font-bold text-navy">Trip Overview</h2>
            <p className="mt-2 text-sm text-gray-700 leading-relaxed">{pkg.summary}</p>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {pkg.highlights.map((h) => (
                <div key={h} className="flex items-start gap-2 text-xs sm:text-sm text-navy">
                  <CheckCircle2 className="h-4 w-4 text-teal-brand mt-0.5 shrink-0" />
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Signature Component: Booking Heat Map */}
          <section>
            <BookingHeatMap
              packageSlug={pkg.slug}
              selectedDate={selectedDep?.date}
              onSelectDate={(dep) => setSelectedDep(dep)}
            />
          </section>

          {/* Day-by-Day Itinerary (Early Auth Prompt for Full Itinerary) */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <h2 className="font-heading text-lg font-bold text-navy">
                Day-by-Day Itinerary ({pkg.duration})
              </h2>
              {!user && (
                <span className="inline-flex items-center gap-1 rounded-full bg-coral-light px-3 py-1 text-[11px] font-bold text-coral">
                  <Lock className="h-3 w-3" />
                  Day 1 Preview • Free Sign-Up Unlocks Full Plan
                </span>
              )}
            </div>

            <div className="space-y-3">
              {pkg.itinerary.map((day) => {
                const locked = !user && day.day > 1;
                const expanded = openDay === day.day && !locked;

                return (
                  <div
                    key={day.day}
                    className={`rounded-xl border ${
                      locked ? "border-gray-200 bg-surface/60" : "border-gray-200 bg-white"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        if (locked) {
                          openAuthModal({
                            mode: "signup",
                            reason: `Create a free Voyago account to unlock the complete ${pkg.duration} day-by-day itinerary and save this trip.`,
                          });
                        } else {
                          setOpenDay(expanded ? 0 : day.day);
                        }
                      }}
                      className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left"
                    >
                      <div className="flex items-center gap-3">
                        <span className="rounded-lg bg-navy px-2.5 py-1 text-xs font-bold text-white">
                          Day {day.day}
                        </span>
                        <span className="text-sm font-bold text-navy">
                          {locked ? `Day ${day.day} Detailed Plan (Sign in to view)` : day.title}
                        </span>
                      </div>
                      {locked ? (
                        <Lock className="h-4 w-4 text-coral shrink-0" />
                      ) : expanded ? (
                        <ChevronUp className="h-4 w-4 text-gray-500 shrink-0" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-gray-500 shrink-0" />
                      )}
                    </button>

                    {expanded && (
                      <div className="border-t border-gray-100 px-4 py-3.5 text-xs sm:text-sm text-gray-700 space-y-2">
                        <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                          <span><strong>Stay:</strong> {day.stay}</span>
                          <span><strong>Meals:</strong> {day.meals}</span>
                          <span><strong>Transport:</strong> {day.transport}</span>
                        </div>
                        <ul className="list-disc pl-5 space-y-1 pt-1">
                          {day.activities.map((a) => (
                            <li key={a}>{a}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {!user && (
              <div className="mt-4 rounded-xl bg-navy p-4 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <p className="text-xs sm:text-sm">
                  Unlock all {pkg.itinerary.length} days, hotel details, and save trips to your account in 20 seconds.
                </p>
                <button
                  type="button"
                  onClick={() =>
                    openAuthModal({
                      mode: "signup",
                      reason: "Create your free Voyago account to view full itineraries and unlock custom quotes.",
                    })
                  }
                  className="rounded-lg bg-coral px-4 py-2 text-xs font-bold text-white hover:bg-coral-hover shrink-0"
                >
                  Unlock Full Itinerary
                </button>
              </div>
            )}
          </section>

          {/* Inclusions & Exclusions */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="font-heading text-base font-bold text-navy mb-3">Inclusions</h3>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
                {pkg.inclusions.map((inc) => (
                  <li key={inc} className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span>{inc}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="font-heading text-base font-bold text-navy mb-3">Exclusions</h3>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
                {pkg.exclusions.map((exc) => (
                  <li key={exc} className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                    <span>{exc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Policy & Compliance Tabs */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-3">
              <button
                type="button"
                onClick={() => setPolicyTab("safety")}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold ${
                  policyTab === "safety" ? "bg-navy text-white" : "text-gray-600 hover:bg-surface"
                }`}
              >
                Cohort Safety Policy
              </button>
              <button
                type="button"
                onClick={() => setPolicyTab("cancellation")}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold ${
                  policyTab === "cancellation" ? "bg-navy text-white" : "text-gray-600 hover:bg-surface"
                }`}
              >
                Cancellation &amp; Refund Slabs
              </button>
              {pkg.scope === "International" && (
                <button
                  type="button"
                  onClick={() => setPolicyTab("visa")}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold ${
                    policyTab === "visa" ? "bg-navy text-white" : "text-gray-600 hover:bg-surface"
                  }`}
                >
                  Visa &amp; Insurance Disclaimer
                </button>
              )}
            </div>

            <div className="mt-4 text-xs sm:text-sm text-gray-700 leading-relaxed">
              {policyTab === "safety" && (
                <p>
                  All travelers agree to the Voyago Holidays Traveler Code of Conduct at checkout.
                  For <strong>Girls-only</strong> and <strong>Boys-only</strong> departures,
                  mandatory government ID verification (masked Aadhaar, Passport, or Driving
                  License) must be uploaded within <strong>24 hours</strong> of booking to confirm
                  cohort eligibility.
                </p>
              )}
              {policyTab === "cancellation" && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-gray-200 text-navy">
                        <th className="py-2 pr-4">Cancellation Window</th>
                        <th className="py-2">Refund Eligibility</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr>
                        <td className="py-2 pr-4">30+ days before departure</td>
                        <td className="py-2 font-semibold text-emerald-700">90% refund</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4">15 – 29 days before departure</td>
                        <td className="py-2 font-semibold text-amber-700">50% refund</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4">Under 15 days before departure</td>
                        <td className="py-2 font-semibold text-red-600">Non-refundable</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
              {policyTab === "visa" && (
                <div className="flex items-start gap-2.5">
                  <ShieldAlert className="h-5 w-5 text-amber-warm shrink-0 mt-0.5" />
                  <p>
                    {pkg.visaNote ||
                      "Visa facilitation is included where specified, visa fees are itemized separately, and final approval rests strictly with the respective embassy or consulate."}
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Sticky Booking Card */}
        <aside className="lg:col-span-4">
          <div className="sticky top-24 rounded-2xl border border-gray-200 bg-white p-6 shadow-md space-y-5">
            <div>
              <p className="text-xs text-gray-500">Per Traveler (Direct Price)</p>
              <p className="font-heading text-3xl font-extrabold text-navy tabular-nums">
                {formatINR(pkg.priceInr)}
              </p>
            </div>

            <div className="space-y-3 border-t border-gray-100 pt-4">
              <div>
                <label className="block text-xs font-bold text-navy mb-1">
                  Selected Departure Date
                </label>
                <div className="rounded-xl bg-surface px-3.5 py-2.5 text-sm font-bold text-navy flex items-center justify-between">
                  <span>{selectedDep?.date || "Pick from Heat Map"}</span>
                  {selectedDep && (
                    <span className="text-xs font-semibold text-teal-brand">
                      {selectedDep.spotsLeft} spots left
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-navy mb-1">
                  Travelers ({customerType === "B2B" ? "10–100 Corporate" : "1–20 Individual"})
                </label>
                <input
                  type="number"
                  min={1}
                  max={customerType === "B2B" ? 100 : 20}
                  value={travelerCount}
                  onChange={(e) => setTravelerCount(Math.max(1, Number(e.target.value)))}
                  className="w-full rounded-xl border border-gray-300 px-3.5 py-2 text-sm font-bold text-navy tabular-nums"
                />
              </div>
            </div>

            {/* Transparent Tax Summary */}
            <div className="space-y-2 border-t border-gray-100 pt-4 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Base Fare ({travelerCount} pax)</span>
                <span className="font-semibold text-navy tabular-nums">
                  {formatINR(pricing.baseAmount)}
                </span>
              </div>
              {pricing.b2bDiscount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>B2B Group Discount ({Math.round(pricing.b2bDiscountRate * 100)}%)</span>
                  <span className="font-semibold tabular-nums">-{formatINR(pricing.b2bDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>Estimated GST (5%)</span>
                <span className="font-semibold text-navy tabular-nums">
                  {formatINR(pricing.gstAmount)}
                </span>
              </div>
              {pkg.scope === "International" && (
                <div className="flex justify-between text-gray-600">
                  <span>Overseas Tour TCS (5% • PAN req.)</span>
                  <span className="font-semibold text-navy tabular-nums">
                    {formatINR(pricing.tcsAmount)}
                  </span>
                </div>
              )}
              <div className="flex justify-between border-t border-gray-200 pt-2 text-sm font-extrabold text-navy">
                <span>Estimated Total</span>
                <span className="tabular-nums">{formatINR(pricing.grandTotal)}</span>
              </div>
            </div>

            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={handleCheckoutClick}
                className="w-full rounded-xl bg-coral py-3 text-sm font-bold text-white shadow-sm hover:bg-coral-hover transition"
              >
                Proceed to Direct Checkout
              </button>
              <Link
                href={`/customize?destination=${encodeURIComponent(pkg.title)}&cohort=${encodeURIComponent(pkg.cohort)}&theme=${encodeURIComponent(pkg.theme)}`}
                className="block w-full rounded-xl border-2 border-navy py-2.5 text-center text-xs font-bold text-navy hover:bg-navy hover:text-white transition"
              >
                Customize This Package (&lt; 2 Hr Callback)
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
