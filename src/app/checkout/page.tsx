"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Timer,
  AlertTriangle,
  ShieldCheck,
  CreditCard,
  Building2,
  PhoneCall,
} from "lucide-react";
import { SEED_PACKAGES } from "@/lib/seed-data";
import {
  calculatePriceBreakdown,
  formatINR,
  isValidGSTIN,
  isValidPAN,
  UPI_TRANSACTION_CAP_INR,
} from "@/lib/tax-calculator";
import { useAuth } from "@/context/AuthContext";
import { trackEvent } from "@/lib/analytics";
import type { BookingRecord } from "@/types";

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, openAuthModal, addBooking } = useAuth();

  const slug = searchParams.get("slug") || SEED_PACKAGES[0].slug;
  const departureDate = searchParams.get("date") || "2027-03-14";
  const initialPax = Math.max(1, Number(searchParams.get("pax") || 2));

  const pkg = SEED_PACKAGES.find((p) => p.slug === slug) || SEED_PACKAGES[0];
  const customerType: "B2C" | "B2B" = user?.role === "B2B" ? "B2B" : "B2C";

  // 15-minute atomic seat reservation countdown
  const [secondsLeft, setSecondsLeft] = useState(15 * 60);
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [pax, setPax] = useState(initialPax);
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [gstin, setGstin] = useState("");
  const [pan, setPan] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreeConduct, setAgreeConduct] = useState(false);
  const [agreeIdCheck, setAgreeIdCheck] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState<
    "CARD" | "NETBANKING" | "UPI" | "NEFT_RTGS"
  >("CARD");
  const [simulateOutage, setSimulateOutage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const isGenderCohort = pkg.cohort === "Girls-only" || pkg.cohort === "Boys-only";
  const pricing = calculatePriceBreakdown(pkg.priceInr, pax, pkg.scope, customerType);

  useEffect(() => {
    // Atomic seat lock API call
    fetch("/api/v1/checkout/lock-seats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ packageSlug: pkg.slug, departureDate, seats: pax }),
    }).catch(() => {});
  }, [pkg.slug, departureDate, pax]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (user) {
      setContactName((p) => p || user.fullName);
      setContactEmail((p) => p || user.email);
      setContactPhone((p) => p || user.phone);
      if (user.role === "B2B") {
        setCompanyName((p) => p || user.companyName || "");
        setGstin((p) => p || user.gstin || "");
      }
    }
  }, [user]);

  useEffect(() => {
    if (!pricing.upiAllowed && paymentMethod === "UPI") {
      setPaymentMethod("CARD");
    }
  }, [pricing.upiAllowed, paymentMethod]);

  const mins = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const secs = String(secondsLeft % 60).padStart(2, "0");

  const validateStep1 = () => {
    setError(null);
    if (!contactName.trim() || !contactEmail.trim() || !contactPhone.trim()) {
      setError("Please fill in your primary contact details.");
      return;
    }
    if (customerType === "B2B" && gstin.trim() && !isValidGSTIN(gstin)) {
      setError("Please enter a valid 15-character GSTIN.");
      return;
    }
    if (pkg.scope === "International" && !isValidPAN(pan)) {
      setError(
        "A valid 10-character PAN (e.g. ABCDE1234F) is mandatory for International Tour TCS (Form 27D)."
      );
      return;
    }
    if (!agreeTerms || !agreeConduct) {
      setError("Please accept the Terms of Service and Mindset Cohort Code of Conduct.");
      return;
    }
    if (isGenderCohort && !agreeIdCheck) {
      setError("Please confirm the mandatory 24-hour Government ID verification policy.");
      return;
    }

    trackEvent("checkout_step_completed", {
      step: 1,
      total_inr: pricing.grandTotal,
      is_international: pkg.scope === "International",
    });
    setStep(2);
  };

  const executePayment = async (fallbackCallback = false) => {
    setError(null);
    setProcessing(true);

    if (fallbackCallback) {
      trackEvent("checkout_fallback_triggered", {
        package_slug: pkg.slug,
        total_inr: pricing.grandTotal,
      });
    }

    try {
      const chosenMethod = fallbackCallback ? "CALLBACK_FALLBACK" : paymentMethod;
      const res = await fetch("/api/v1/checkout/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageSlug: pkg.slug,
          packageTitle: pkg.title,
          scope: pkg.scope,
          cohort: pkg.cohort,
          departureDate,
          travelerCount: pax,
          customerType,
          contactName,
          contactEmail,
          contactPhone,
          companyName: customerType === "B2B" ? companyName : undefined,
          gstin: customerType === "B2B" ? gstin.toUpperCase() : undefined,
          panNumber: pkg.scope === "International" ? pan.toUpperCase() : undefined,
          paymentMethod: chosenMethod,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Checkout failed. Please try again or use Telephonic Fallback.");
        setProcessing(false);
        return;
      }

      const booking: BookingRecord = data.booking;
      addBooking(booking);

      trackEvent("checkout_step_completed", {
        step: 3,
        payment_method: chosenMethod,
        total_inr: booking.grandTotal,
        is_international: pkg.scope === "International",
      });

      const q = new URLSearchParams({
        ref: booking.bookingRef,
        title: booking.packageTitle,
        date: booking.departureDate,
        total: String(booking.grandTotal),
        status: booking.bookingStatus,
        method: booking.paymentMethod,
        name: booking.contactName,
        scope: booking.scope,
      });
      router.push(`/booking-confirmed?${q.toString()}`);
    } catch {
      setSimulateOutage(true);
      setProcessing(false);
    }
  };

  if (!user) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="font-heading text-2xl font-extrabold text-navy">
          Sign In to Complete Direct Checkout
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Your account ensures instant GST/TCS invoicing and 15-minute atomic seat reservation.
        </p>
        <button
          onClick={() =>
            openAuthModal({
              mode: "signup",
              reason: "Sign in or register to lock your seats for 15 minutes and complete checkout.",
            })
          }
          className="mt-6 rounded-xl bg-coral px-6 py-3 text-sm font-bold text-white"
        >
          Login / Sign Up to Checkout
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      {/* 15-Minute Seat Reservation Timer */}
      <div className="mb-6 rounded-2xl bg-navy px-5 py-3.5 text-white flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Timer className="h-5 w-5 text-amber-warm" />
          <span>
            Your spots for <strong>{pkg.title}</strong> ({departureDate}) are reserved for{" "}
            <strong className="text-amber-warm tabular-nums">
              {mins}:{secs}
            </strong>
          </span>
        </div>
        <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold">
          Step {step} of 3
        </span>
      </div>

      {/* Stepper */}
      <div className="mb-6 grid grid-cols-3 gap-2 text-center text-xs font-bold">
        {[
          { n: 1, label: "1. Traveler & Compliance" },
          { n: 2, label: "2. Price, GST & TCS" },
          { n: 3, label: "3. Payment (Sandbox)" },
        ].map((s) => (
          <div
            key={s.n}
            className={`rounded-xl py-2.5 border ${
              step === s.n
                ? "bg-teal-brand text-white border-teal-brand"
                : step > s.n
                  ? "bg-teal-light text-teal-brand border-teal-brand/30"
                  : "bg-white text-gray-500 border-gray-200"
            }`}
          >
            {s.label}
          </div>
        ))}
      </div>

      <div className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
        {/* STEP 1 */}
        {step === 1 && (
          <div className="space-y-4">
            <h1 className="font-heading text-xl font-extrabold text-navy">
              Step 1: Traveler &amp; Indian Tax Compliance Details
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-navy mb-1">Primary Contact Name *</label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-navy mb-1">Email Address *</label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-navy mb-1">Mobile Number *</label>
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-navy mb-1">Number of Travelers *</label>
                <input
                  type="number"
                  min={1}
                  max={customerType === "B2B" ? 100 : 20}
                  value={pax}
                  onChange={(e) => setPax(Math.max(1, Number(e.target.value)))}
                  className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm"
                />
              </div>
            </div>

            {customerType === "B2B" && (
              <div className="rounded-2xl bg-teal-light/60 p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 border border-teal-brand/20">
                <div>
                  <label className="block text-xs font-bold text-navy mb-1">Company Name</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-navy mb-1">15-Character GSTIN</label>
                  <input
                    type="text"
                    maxLength={15}
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value.toUpperCase())}
                    placeholder="33AABCV1234F1Z5"
                    className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2 text-sm uppercase"
                  />
                </div>
              </div>
            )}

            {pkg.scope === "International" && (
              <div className="rounded-2xl bg-amber-50 p-4 border border-amber-200">
                <label className="block text-xs font-bold text-navy mb-1">
                  Mandatory 10-Character PAN (International Package TCS) *
                </label>
                <input
                  type="text"
                  maxLength={10}
                  value={pan}
                  onChange={(e) => setPan(e.target.value.toUpperCase())}
                  placeholder="ABCDE1234F"
                  className="w-full sm:w-64 rounded-xl border border-gray-300 bg-white px-3.5 py-2 text-sm uppercase font-mono"
                />
                <p className="mt-1.5 text-xs text-gray-600">
                  Required under Indian Income Tax rules for Overseas Tour Program Package TCS
                  (Form 27D).
                </p>
              </div>
            )}

            <div className="space-y-2.5 pt-2 text-xs text-gray-700">
              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 rounded"
                />
                <span>
                  I agree to the Voyago Holidays Terms of Service, Cancellation Slabs, and DPDP
                  Privacy Policy.
                </span>
              </label>
              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={agreeConduct}
                  onChange={(e) => setAgreeConduct(e.target.checked)}
                  className="mt-0.5 rounded"
                />
                <span>I agree to abide by the Mindset Cohort Traveler Code of Conduct.</span>
              </label>
              {isGenderCohort && (
                <label className="flex items-start gap-2 text-navy font-semibold">
                  <input
                    type="checkbox"
                    checked={agreeIdCheck}
                    onChange={(e) => setAgreeIdCheck(e.target.checked)}
                    className="mt-0.5 rounded"
                  />
                  <span>
                    I understand that government ID verification must be completed within 24 hours
                    of booking to confirm {pkg.cohort} eligibility.
                  </span>
                </label>
              )}
            </div>

            {error && <p className="text-xs font-bold text-red-600">{error}</p>}

            <button
              type="button"
              onClick={validateStep1}
              className="w-full rounded-xl bg-coral py-3 text-sm font-bold text-white hover:bg-coral-hover"
            >
              Continue to Tax Breakdown →
            </button>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="space-y-5">
            <h2 className="font-heading text-xl font-extrabold text-navy">
              Step 2: Transparent Price, GST &amp; TCS Breakdown
            </h2>
            <div className="rounded-2xl bg-surface p-5 space-y-2.5 text-sm">
              <div className="flex justify-between">
                <span>
                  {pkg.title} ({pax} × {formatINR(pkg.priceInr)})
                </span>
                <span className="font-bold tabular-nums">{formatINR(pricing.baseAmount)}</span>
              </div>
              {pricing.b2bDiscount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>B2B Corporate Group Discount ({Math.round(pricing.b2bDiscountRate * 100)}%)</span>
                  <span className="font-bold tabular-nums">-{formatINR(pricing.b2bDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Tour Operator GST (5%)</span>
                <span className="font-bold tabular-nums">{formatINR(pricing.gstAmount)}</span>
              </div>
              {pkg.scope === "International" && (
                <div className="flex justify-between">
                  <span>Overseas Tour TCS (5% • PAN: {pan})</span>
                  <span className="font-bold tabular-nums">{formatINR(pricing.tcsAmount)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-gray-300 pt-3 text-lg font-extrabold text-navy">
                <span>Grand Total (INR)</span>
                <span className="tabular-nums">{formatINR(pricing.grandTotal)}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="rounded-xl border border-gray-300 px-5 py-3 text-sm font-bold text-navy"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={() => {
                  trackEvent("checkout_step_completed", {
                    step: 2,
                    total_inr: pricing.grandTotal,
                    is_international: pkg.scope === "International",
                  });
                  setStep(3);
                }}
                className="flex-1 rounded-xl bg-coral py-3 text-sm font-bold text-white hover:bg-coral-hover"
              >
                Proceed to Payment →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-heading text-xl font-extrabold text-navy">
                Step 3: Payment Execution (Razorpay / PayU Sandbox)
              </h2>
              <button
                type="button"
                onClick={() => setSimulateOutage(!simulateOutage)}
                className="text-[11px] font-semibold text-gray-500 underline"
              >
                {simulateOutage ? "Hide Outage Fallback Demo" : "Test Gateway Outage Fallback"}
              </button>
            </div>

            {/* Gateway Outage Fallback Banner */}
            {simulateOutage && (
              <div className="rounded-2xl border border-coral bg-coral-light p-4 space-y-3">
                <div className="flex items-start gap-2.5 text-sm text-navy">
                  <AlertTriangle className="h-5 w-5 text-coral shrink-0 mt-0.5" />
                  <p>
                    <strong>Experiencing bank/gateway downtime?</strong> Reserve your spot now via
                    Telephonic Callback &amp; Direct Payment Link — zero booking loss.
                  </p>
                </div>
                <button
                  type="button"
                  disabled={processing}
                  onClick={() => executePayment(true)}
                  className="inline-flex items-center gap-2 rounded-xl bg-navy px-4 py-2.5 text-xs font-bold text-white"
                >
                  <PhoneCall className="h-4 w-4" />
                  Reserve Spot via Telephonic Callback Fallback
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(
                [
                  { id: "CARD", label: "Credit / Debit Card (Razorpay Sandbox)", icon: CreditCard, disabled: false },
                  { id: "NETBANKING", label: "NetBanking (All Major Indian Banks)", icon: ShieldCheck, disabled: false },
                  {
                    id: "UPI",
                    label: pricing.upiAllowed
                      ? "UPI (GPay / PhonePe / BHIM)"
                      : `UPI Unavailable (Capped at ${formatINR(UPI_TRANSACTION_CAP_INR)})`,
                    icon: ShieldCheck,
                    disabled: !pricing.upiAllowed,
                  },
                  { id: "NEFT_RTGS", label: "B2B NEFT / RTGS (Async Bank Settlement)", icon: Building2, disabled: false },
                ] as const
              ).map((m) => (
                <button
                  key={m.id}
                  type="button"
                  disabled={m.disabled}
                  title={
                    m.disabled
                      ? "UPI is capped at ₹1,00,000 per transaction"
                      : undefined
                  }
                  onClick={() => setPaymentMethod(m.id)}
                  className={`flex items-center gap-3 rounded-2xl border p-4 text-left text-xs sm:text-sm font-bold transition ${
                    m.disabled
                      ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
                      : paymentMethod === m.id
                        ? "border-teal-brand bg-teal-light text-navy ring-1 ring-teal-brand"
                        : "border-gray-200 bg-white text-navy hover:border-navy"
                  }`}
                >
                  <m.icon className="h-5 w-5 shrink-0 text-teal-brand" />
                  <span>{m.label}</span>
                </button>
              ))}
            </div>

            {error && <p className="text-xs font-bold text-red-600">{error}</p>}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="rounded-xl border border-gray-300 px-5 py-3 text-sm font-bold text-navy"
              >
                ← Back
              </button>
              <button
                type="button"
                disabled={processing}
                onClick={() => executePayment(false)}
                className="flex-1 rounded-xl bg-coral py-3.5 text-sm font-bold text-white hover:bg-coral-hover disabled:opacity-60"
              >
                {processing
                  ? "Processing Sandbox Payment..."
                  : paymentMethod === "NEFT_RTGS"
                    ? `Reserve Seats & Generate NEFT Instructions (${formatINR(pricing.grandTotal)})`
                    : `Pay ${formatINR(pricing.grandTotal)} via Sandbox Gateway`}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-gray-500">Loading checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
