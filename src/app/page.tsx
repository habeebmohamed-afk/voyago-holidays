"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Users,
  CalendarDays,
  CreditCard,
  PhoneCall,
  Building2,
  ArrowRight,
  CheckCircle2,
  Compass,
  Sparkles,
} from "lucide-react";
import { SEED_PACKAGES } from "@/lib/seed-data";
import { formatINR } from "@/lib/tax-calculator";
import { PackageCard } from "@/components/PackageCard";
import { BookingHeatMap } from "@/components/BookingHeatMap";
import type { MindsetCohort, PackageScope, TripTheme } from "@/types";

const COHORTS: MindsetCohort[] = [
  "Girls-only",
  "Boys-only",
  "Couple-friendly",
  "Family-friendly",
  "Bachelors-friendly",
];

const THEMES: TripTheme[] = [
  "Staycation",
  "Adventurous",
  "Religious",
  "Sightseeing",
];

export default function HomePage() {
  const router = useRouter();
  const [scope, setScope] = useState<"All" | PackageScope>("All");
  const [cohort, setCohort] = useState<string>("All");
  const [theme, setTheme] = useState<string>("All");
  const [maxBudget, setMaxBudget] = useState<number>(250000);

  const handleQuickExplore = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (scope !== "All") params.set("scope", scope);
    if (cohort !== "All") params.set("cohort", cohort);
    if (theme !== "All") params.set("theme", theme);
    params.set("maxBudget", String(maxBudget));
    router.push(`/packages?${params.toString()}`);
  };

  return (
    <div>
      {/* A. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-navy via-[#18316B] to-[#132352] text-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-amber-warm backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" />
              Launching Feb 20, 2027 • Direct B2C &amp; Corporate B2B Travel
            </span>
            <h1 className="mt-5 font-heading text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Travel With Your Tribe. See Real Demand Before You Book.
            </h1>
            <p className="mt-4 text-base sm:text-lg text-white/85 leading-relaxed">
              Curated domestic and international holidays (₹10,000 – ₹5,00,000) matched by mindset
              cohorts, backed by our live Booking Heat Map—book online in minutes or customize by
              phone in under 2 hours.
            </p>
          </div>

          {/* Interactive Quick-Filter Bar */}
          <form
            onSubmit={handleQuickExplore}
            className="mt-8 rounded-2xl bg-white p-4 sm:p-5 text-navy shadow-xl"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 items-end">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5">
                  Destination Type
                </label>
                <div className="grid grid-cols-3 gap-1 rounded-xl bg-surface p-1">
                  {(["All", "Domestic", "International"] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setScope(s)}
                      className={`rounded-lg py-1.5 text-xs font-semibold transition ${
                        scope === s
                          ? "bg-navy text-white"
                          : "text-gray-600 hover:text-navy"
                      }`}
                    >
                      {s === "International" ? "Int'l" : s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5">
                  Mindset Cohort
                </label>
                <select
                  value={cohort}
                  onChange={(e) => setCohort(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm font-medium focus:border-teal-brand focus:outline-none"
                >
                  <option value="All">All Cohorts</option>
                  {COHORTS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5">
                  Trip Theme
                </label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm font-medium focus:border-teal-brand focus:outline-none"
                >
                  <option value="All">All Themes</option>
                  {THEMES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5">
                  <span>Max Budget</span>
                  <span className="text-teal-brand tabular-nums">{formatINR(maxBudget)}</span>
                </div>
                <input
                  type="range"
                  min={10000}
                  max={500000}
                  step={5000}
                  value={maxBudget}
                  onChange={(e) => setMaxBudget(Number(e.target.value))}
                  className="w-full accent-coral cursor-pointer"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-coral py-2.5 px-4 text-sm font-bold text-white shadow-sm hover:bg-coral-hover transition flex items-center justify-center gap-1.5"
              >
                Explore Packages
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-600">
              <span>Zero third-party resellers • Direct GST &amp; TCS invoicing</span>
              <Link
                href="/customize"
                className="font-semibold text-teal-brand hover:underline"
              >
                Planning a custom or office trip? Request a &lt; 2 hr callback →
              </Link>
            </div>
          </form>
        </div>
      </section>

      {/* B. Why Voyago Holidays? */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-wider text-teal-brand">
            Built From Real Road-Trip Experience
          </p>
          <h2 className="mt-2 font-heading text-2xl sm:text-3xl font-extrabold text-navy">
            Why Voyago Holidays?
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: Users,
              title: "Zero Awkward Group Mixes",
              desc: "Filter every departure by Girls-only, Boys-only, Couples, Family, or Bachelors. Gender-restricted trips include mandatory 24-hour government ID verification and a strict Code of Conduct.",
            },
            {
              icon: CalendarDays,
              title: "Live Booking Heat Map",
              desc: "Stop guessing whether a departure is lively or overcrowded. Inspect anonymized, date-wise booking volume and real-time spot availability right on the package calendar.",
            },
            {
              icon: CreditCard,
              title: "3-Step Direct Checkout",
              desc: "Transparent pricing with exact GST & International TCS breakdowns, instant online payment (Cards, NetBanking, UPI, B2B NEFT), and automated PDF invoices.",
            },
            {
              icon: PhoneCall,
              title: "Human Telephonic Customization",
              desc: "Need to tweak hotels, pace, or plan for 50 employees? Submit a 60-second form and get a personal Travel Desk callback in under 2 business hours.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-teal-light text-teal-brand">
                <item.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-heading text-base font-bold text-navy">
                {item.title}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-gray-600 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* C. Featured Packages Grid */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-coral">
              Curated Launch Catalog
            </p>
            <h2 className="mt-1 font-heading text-2xl sm:text-3xl font-extrabold text-navy">
              Featured Domestic &amp; International Trips
            </h2>
          </div>
          <Link
            href="/packages"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-teal-brand hover:underline"
          >
            View all {SEED_PACKAGES.length} packages
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SEED_PACKAGES.slice(0, 6).map((pkg) => (
            <PackageCard key={pkg.slug} pkg={pkg} />
          ))}
        </div>
      </section>

      {/* D. Interactive Booking Heat Map Spotlight */}
      <section className="bg-white border-y border-gray-200 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 gap-10 lg:grid-cols-2 items-center">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-coral-light px-3 py-1 text-xs font-bold text-coral">
              Signature Transparency Feature
            </span>
            <h2 className="mt-3 font-heading text-2xl sm:text-3xl font-extrabold text-navy">
              Pick Your Perfect Date With Our Live Booking Heat Map
            </h2>
            <p className="mt-3 text-sm sm:text-base text-gray-600 leading-relaxed">
              Want the energy of a buzzing group departure—or prefer quieter, low-crowd dates?
              Hover or tap any date to view anonymized booking counts and departure fill status
              before you pay.
            </p>
            <ul className="mt-5 space-y-2.5 text-sm text-navy">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-teal-brand shrink-0" />
                Color-blind-safe demand tiers paired with exact numeric tooltips
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-teal-brand shrink-0" />
                100% anonymized—zero personal details of other travelers ever exposed
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-teal-brand shrink-0" />
                Click any date on a package page to lock seats for 15 minutes
              </li>
            </ul>
            <Link
              href="/packages/rishikesh-rafting-girls-escape"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-navy px-5 py-3 text-sm font-bold text-white hover:bg-coral transition"
            >
              Try It on a Live Package
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <BookingHeatMap packageSlug="rishikesh-rafting-girls-escape" />
        </div>
      </section>

      {/* E. Corporate & B2B Banner */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-navy to-[#1B4A6E] p-8 sm:p-12 text-white shadow-lg flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-amber-warm">
              <Building2 className="h-3.5 w-3.5" />
              Direct B2B Corporate Engine
            </span>
            <h2 className="mt-3 font-heading text-2xl sm:text-3xl font-extrabold">
              Stress-Free Corporate Offsites &amp; Institutional Group Trips
            </h2>
            <p className="mt-3 text-sm sm:text-base text-white/85 leading-relaxed">
              Built for HR leads, admin teams, alumni clubs, and affinity groups (10–100+
              travelers). Compare itineraries side-by-side on our Desktop App, get automated GSTIN
              company invoices, upload employee rosters, and pay via NEFT or 30%/70% milestone
              payment links.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto shrink-0">
            <Link
              href="/corporate"
              className="rounded-xl bg-coral px-6 py-3 text-center text-sm font-bold text-white hover:bg-coral-hover transition"
            >
              Open Corporate Portal
            </Link>
            <Link
              href="/customize?type=b2b"
              className="rounded-xl border border-white/30 bg-white/10 px-6 py-3 text-center text-sm font-bold text-white hover:bg-white/20 transition"
            >
              Request Custom B2B Quote
            </Link>
          </div>
        </div>
      </section>

      {/* F. How It Works */}
      <section id="how-it-works" className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-wider text-teal-brand">
            Simple From First Click To Takeoff
          </p>
          <h2 className="mt-1 font-heading text-2xl sm:text-3xl font-extrabold text-navy">
            How Voyago Holidays Works
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              step: "01",
              title: "Filter Your Vibe",
              desc: "Choose budget, mindset cohort, and trip theme across vetted domestic & international packages.",
            },
            {
              step: "02",
              title: "Check the Heat Map",
              desc: "Compare date-wise booking demand to join active groups or choose peaceful dates.",
            },
            {
              step: "03",
              title: "Book Direct or Customize",
              desc: "Checkout online in 3 steps, or request a bespoke itinerary with a < 2 hr Travel Desk callback.",
            },
            {
              step: "04",
              title: "Travel With Confidence",
              desc: "Receive pre-trip packing/visa checklists, WhatsApp reminders, and dedicated human support.",
            },
          ].map((s) => (
            <div
              key={s.step}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <span className="font-heading text-3xl font-extrabold text-coral/30">
                {s.step}
              </span>
              <h3 className="mt-2 font-heading text-base font-bold text-navy">{s.title}</h3>
              <p className="mt-2 text-xs sm:text-sm text-gray-600 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* G. Founder Story Preview */}
      <section className="bg-white border-t border-gray-200 py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-gray-200 bg-surface p-6 sm:p-10 flex flex-col md:flex-row items-center gap-8">
            <img
              src="/assets/Founder.jpg"
              alt="Habeeb Mohamed Easa Mohideen — Founder of Voyago Holidays"
              className="h-36 w-36 sm:h-44 sm:w-44 rounded-2xl object-cover object-top shadow-md shrink-0 border-4 border-white"
            />
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-brand">
                <Compass className="h-4 w-4" />
                A Note From Our Founder
              </span>
              <h2 className="mt-1 font-heading text-2xl font-extrabold text-navy">
                Built by a Traveler Who Drove From Rameshwaram to Kashmir
              </h2>
              <p className="mt-3 text-sm text-gray-700 leading-relaxed">
                &ldquo;After self-driving across India—from Rameshwaram to Delhi, Shimla, Manali,
                Atal Tunnel, and Kashmir—and exploring Dubai, Saudi Arabia, and Malaysia, I saw how
                often great trips get spoiled by overcrowded spots or mismatched tour groups. I
                started Voyago Holidays so every rupee you spend buys clarity, comfort, and the
                best memories of your life.&rdquo;
              </p>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="font-heading text-sm font-bold text-navy">
                    Habeeb Mohamed Easa Mohideen
                  </p>
                  <p className="text-xs text-gray-500">
                    Founder, Voyago Holidays • MBA (Business Analytics &amp; AI)
                  </p>
                </div>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-navy px-4 py-2 text-xs font-bold text-white hover:bg-coral transition"
                >
                  Read Our Full Story
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
