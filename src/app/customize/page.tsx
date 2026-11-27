"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PhoneCall, CheckCircle2, Clock, Lock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { trackEvent } from "@/lib/analytics";
import { CONTACT_INFO } from "@/lib/feature-flags";

function CustomizeFormContent() {
  const searchParams = useSearchParams();
  const { user, openAuthModal } = useAuth();

  const [travelerType, setTravelerType] = useState<"B2C" | "B2B">("B2C");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [destinations, setDestinations] = useState("");
  const [travelDates, setTravelDates] = useState("");
  const [travelerCount, setTravelerCount] = useState("4");
  const [budgetRange, setBudgetRange] = useState("₹50K–₹1.5L");
  const [cohort, setCohort] = useState("Couple-friendly");
  const [theme, setTheme] = useState("Sightseeing");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [refCode, setRefCode] = useState<string | null>(null);

  useEffect(() => {
    trackEvent("customization_form_started");
    if (searchParams.get("type") === "b2b") setTravelerType("B2B");
    if (searchParams.get("destination")) setDestinations(searchParams.get("destination") || "");
    if (searchParams.get("cohort")) setCohort(searchParams.get("cohort") || "Couple-friendly");
    if (searchParams.get("theme")) setTheme(searchParams.get("theme") || "Sightseeing");
  }, [searchParams]);

  useEffect(() => {
    if (user) {
      setFullName((prev) => prev || user.fullName);
      setEmail((prev) => prev || user.email);
      setPhone((prev) => prev || user.phone);
      if (user.role === "B2B") {
        setTravelerType("B2B");
        setCompanyName((prev) => prev || user.companyName || "");
      }
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      openAuthModal({
        mode: "signup",
        defaultRole: travelerType,
        reason: "Create a free Voyago account so we can save your custom quote and send your itinerary PDF.",
      });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/v1/customizations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          travelerType,
          fullName,
          phone,
          email,
          companyName: travelerType === "B2B" ? companyName : undefined,
          destinations,
          travelDates,
          travelerCount: Number(travelerCount) || 2,
          budgetRange,
          cohort,
          theme,
          notes,
        }),
      });
      const data = await res.json();
      setRefCode(data.referenceCode || `VH-CUST-${Math.floor(1000 + Math.random() * 9000)}`);
      trackEvent("customization_form_submitted", {
        user_type: travelerType,
        budget_tier: budgetRange,
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (refCode) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <div className="rounded-3xl border border-teal-brand/30 bg-white p-8 text-center shadow-md">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-teal-light text-teal-brand">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h1 className="mt-4 font-heading text-2xl font-extrabold text-navy">
            Customization Request Received!
          </h1>
          <p className="mt-3 text-sm text-gray-700 leading-relaxed">
            Thank you! Reference <strong className="text-coral">#{refCode}</strong> received.
            Expect a personal call from our human Travel Desk within{" "}
            <strong>2 business hours</strong> ({CONTACT_INFO.workingHours}), followed by a custom
            itinerary PDF and direct payment link via WhatsApp &amp; email.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-coral-light px-3 py-1 text-xs font-bold text-coral">
          <Clock className="h-3.5 w-3.5" />
          &lt; 2 Business Hours Human Callback SLA
        </span>
        <h1 className="mt-3 font-heading text-2xl sm:text-3xl font-extrabold text-navy">
          Customize Your Trip — Get a Travel Desk Callback in Under 2 Hours
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Want to adjust hotels, extend your itinerary, or plan a bespoke corporate offsite? Even
          if you don&apos;t know where to go yet, share your preferences and we&apos;ll build the
          complete plan for you.
        </p>
      </div>

      {!user && (
        <div className="mb-6 rounded-2xl border border-teal-brand/30 bg-teal-light p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-2.5 text-xs text-navy">
            <Lock className="h-4 w-4 text-teal-brand shrink-0 mt-0.5" />
            <span>
              <strong>Quick Tip:</strong> Sign in or create a free account to unlock saved custom
              quotes and auto-fill your contact details.
            </span>
          </div>
          <button
            type="button"
            onClick={() =>
              openAuthModal({
                mode: "signup",
                defaultRole: travelerType,
                reason: "Create a free account to unlock custom quotes and track callback status.",
              })
            }
            className="rounded-lg bg-navy px-3.5 py-2 text-xs font-bold text-white shrink-0"
          >
            Sign In / Sign Up
          </button>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm space-y-5"
      >
        <div className="grid grid-cols-2 gap-2 rounded-xl bg-surface p-1">
          <button
            type="button"
            onClick={() => setTravelerType("B2C")}
            className={`rounded-lg py-2 text-xs sm:text-sm font-bold transition ${
              travelerType === "B2C" ? "bg-navy text-white" : "text-gray-600"
            }`}
          >
            Individual / Family / Friends (B2C)
          </button>
          <button
            type="button"
            onClick={() => setTravelerType("B2B")}
            className={`rounded-lg py-2 text-xs sm:text-sm font-bold transition ${
              travelerType === "B2B" ? "bg-teal-brand text-white" : "text-gray-600"
            }`}
          >
            Corporate / Institutional Group (B2B)
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-navy mb-1">Full Name *</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your full name"
              className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-navy mb-1">
              Mobile Number (WhatsApp-enabled) *
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-navy mb-1">Email Address *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm"
            />
          </div>
          {travelerType === "B2B" && (
            <div>
              <label className="block text-xs font-bold text-navy mb-1">Company Name *</label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Company / Institution"
                className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm"
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-navy mb-1">
              Preferred Destination(s) *
            </label>
            <input
              type="text"
              required
              value={destinations}
              onChange={(e) => setDestinations(e.target.value)}
              placeholder="e.g. Kashmir, Bali, or 'Not sure—suggest for me!'"
              className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-navy mb-1">
              Preferred Travel Dates &amp; Flexibility *
            </label>
            <input
              type="text"
              required
              value={travelDates}
              onChange={(e) => setTravelDates(e.target.value)}
              placeholder="e.g. March 2027, ±3 days flexible"
              className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-navy mb-1">Travelers *</label>
            <input
              type="number"
              min={1}
              max={200}
              required
              value={travelerCount}
              onChange={(e) => setTravelerCount(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-navy mb-1">Budget Range</label>
            <select
              value={budgetRange}
              onChange={(e) => setBudgetRange(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm"
            >
              <option>₹10K–₹50K</option>
              <option>₹50K–₹1.5L</option>
              <option>₹1.5L–₹3L</option>
              <option>₹3L–₹5L+</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-navy mb-1">Mindset Cohort</label>
            <select
              value={cohort}
              onChange={(e) => setCohort(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm"
            >
              <option>Girls-only</option>
              <option>Boys-only</option>
              <option>Couple-friendly</option>
              <option>Family-friendly</option>
              <option>Bachelors-friendly</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-navy mb-1">Trip Theme</label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm"
            >
              <option>Staycation</option>
              <option>Adventurous</option>
              <option>Religious</option>
              <option>Sightseeing</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-navy mb-1">
            Special Requests / Notes
          </label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Hotel preferences, senior-friendly pace, dietary requests, conference rooms..."
            className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-xl bg-coral py-3.5 text-sm font-bold text-white hover:bg-coral-hover transition inline-flex items-center justify-center gap-2"
        >
          <PhoneCall className="h-4 w-4" />
          {submitting
            ? "Submitting Request..."
            : user
              ? "Request < 2 Hr Human Callback"
              : "Sign In & Unlock Custom Quote"}
        </button>
      </form>
    </div>
  );
}

export default function CustomizePage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-gray-500">Loading customization form...</div>}>
      <CustomizeFormContent />
    </Suspense>
  );
}
