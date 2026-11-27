"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, X, PhoneCall, ArrowRight } from "lucide-react";
import { SEED_PACKAGES } from "@/lib/seed-data";
import { formatINR } from "@/lib/tax-calculator";
import { PackageCard } from "@/components/PackageCard";
import { trackEvent } from "@/lib/analytics";
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

const BUDGET_PRESETS = [
  { label: "Under ₹30K", min: 10000, max: 30000 },
  { label: "₹30K – ₹1L", min: 30000, max: 100000 },
  { label: "₹1L – ₹2.5L", min: 100000, max: 250000 },
  { label: "₹2.5L – ₹5L", min: 250000, max: 500000 },
];

function PackagesDiscoveryContent() {
  const searchParams = useSearchParams();
  const [scope, setScope] = useState<"All" | PackageScope>("All");
  const [minBudget, setMinBudget] = useState<number>(10000);
  const [maxBudget, setMaxBudget] = useState<number>(500000);
  const [cohorts, setCohorts] = useState<MindsetCohort[]>([]);
  const [themes, setThemes] = useState<TripTheme[]>([]);
  const [sortBy, setSortBy] = useState<
    "recommended" | "price_asc" | "price_desc" | "most_active"
  >("recommended");

  useEffect(() => {
    const spScope = searchParams.get("scope");
    if (spScope === "Domestic" || spScope === "International") setScope(spScope);
    const spCohort = searchParams.get("cohort") as MindsetCohort | null;
    if (spCohort && COHORTS.includes(spCohort)) setCohorts([spCohort]);
    const spTheme = searchParams.get("theme") as TripTheme | null;
    if (spTheme && THEMES.includes(spTheme)) setThemes([spTheme]);
    const spMax = Number(searchParams.get("maxBudget"));
    if (spMax >= 10000 && spMax <= 500000) setMaxBudget(spMax);
  }, [searchParams]);

  const toggleCohort = (c: MindsetCohort) => {
    setCohorts((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));
  };

  const toggleTheme = (t: TripTheme) => {
    setThemes((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  };

  const clearAll = () => {
    setScope("All");
    setMinBudget(10000);
    setMaxBudget(500000);
    setCohorts([]);
    setThemes([]);
    setSortBy("recommended");
  };

  const filtered = useMemo(() => {
    const list = SEED_PACKAGES.filter((pkg) => {
      if (scope !== "All" && pkg.scope !== scope) return false;
      if (pkg.priceInr < minBudget || pkg.priceInr > maxBudget) return false;
      if (cohorts.length > 0 && !cohorts.includes(pkg.cohort)) return false;
      if (themes.length > 0 && !themes.includes(pkg.theme)) return false;
      return true;
    });

    if (sortBy === "price_asc") return [...list].sort((a, b) => a.priceInr - b.priceInr);
    if (sortBy === "price_desc") return [...list].sort((a, b) => b.priceInr - a.priceInr);
    if (sortBy === "most_active")
      return [...list].sort((a, b) => b.bookedPreview - a.bookedPreview);
    return list;
  }, [scope, minBudget, maxBudget, cohorts, themes, sortBy]);

  useEffect(() => {
    trackEvent("package_filter_applied", {
      scope,
      cohorts,
      themes,
      budget_min: minBudget,
      budget_max: maxBudget,
      result_count: filtered.length,
    });
  }, [scope, cohorts, themes, minBudget, maxBudget, filtered.length]);

  const customizeQuery = new URLSearchParams({
    ...(scope !== "All" ? { scope } : {}),
    ...(cohorts[0] ? { cohort: cohorts[0] } : {}),
    ...(themes[0] ? { theme: themes[0] } : {}),
    budget: `${formatINR(minBudget)} - ${formatINR(maxBudget)}`,
  }).toString();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-teal-brand">
            Direct B2C &amp; B2B Catalog
          </p>
          <h1 className="mt-1 font-heading text-2xl sm:text-3xl font-extrabold text-navy">
            Explore Curated Holiday Packages
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-xs font-semibold text-gray-500">
            Sort By:
          </label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-navy"
          >
            <option value="recommended">Recommended</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="most_active">Most Active (Heat Map)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Filter Sidebar */}
        <aside className="lg:col-span-3 space-y-6 rounded-2xl border border-gray-200 bg-white p-5 h-fit shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-heading text-sm font-bold text-navy">
              <SlidersHorizontal className="h-4 w-4 text-teal-brand" />
              Filter Packages
            </h2>
            <button
              type="button"
              onClick={clearAll}
              className="text-xs font-semibold text-coral hover:underline"
            >
              Clear All
            </button>
          </div>

          {/* Scope */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">
              Scope
            </p>
            <div className="grid grid-cols-3 gap-1.5">
              {(["All", "Domestic", "International"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setScope(s)}
                  className={`rounded-lg py-1.5 text-xs font-semibold border transition ${
                    scope === s
                      ? "bg-navy text-white border-navy"
                      : "bg-surface text-navy border-gray-200 hover:border-navy"
                  }`}
                >
                  {s === "International" ? "Int'l" : s}
                </button>
              ))}
            </div>
          </div>

          {/* Budget Range */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">
              <span>Budget (INR)</span>
              <span className="text-teal-brand tabular-nums">
                {formatINR(minBudget)} – {formatINR(maxBudget)}
              </span>
            </div>
            <div className="space-y-2">
              <input
                type="range"
                min={10000}
                max={500000}
                step={5000}
                value={minBudget}
                onChange={(e) => setMinBudget(Math.min(Number(e.target.value), maxBudget - 5000))}
                aria-label="Minimum budget"
                className="w-full accent-teal-brand"
              />
              <input
                type="range"
                min={10000}
                max={500000}
                step={5000}
                value={maxBudget}
                onChange={(e) => setMaxBudget(Math.max(Number(e.target.value), minBudget + 5000))}
                aria-label="Maximum budget"
                className="w-full accent-coral"
              />
            </div>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {BUDGET_PRESETS.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => {
                    setMinBudget(p.min);
                    setMaxBudget(p.max);
                  }}
                  className="rounded-md bg-surface px-2 py-1 text-[11px] font-semibold text-navy hover:bg-teal-light hover:text-teal-brand"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mindset Cohorts */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">
              Mindset Cohort
            </p>
            <div className="space-y-2">
              {COHORTS.map((c) => (
                <label key={c} className="flex items-center gap-2 text-xs font-medium text-navy cursor-pointer">
                  <input
                    type="checkbox"
                    checked={cohorts.includes(c)}
                    onChange={() => toggleCohort(c)}
                    className="rounded border-gray-300 text-teal-brand"
                  />
                  {c}
                </label>
              ))}
            </div>
          </div>

          {/* Trip Theme */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">
              Trip Theme
            </p>
            <div className="space-y-2">
              {THEMES.map((t) => (
                <label key={t} className="flex items-center gap-2 text-xs font-medium text-navy cursor-pointer">
                  <input
                    type="checkbox"
                    checked={themes.includes(t)}
                    onChange={() => toggleTheme(t)}
                    className="rounded border-gray-300 text-coral"
                  />
                  {t}
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Results Grid */}
        <div className="lg:col-span-9">
          {/* Active Filter Chips */}
          {(scope !== "All" || cohorts.length > 0 || themes.length > 0 || minBudget > 10000 || maxBudget < 500000) && (
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {scope !== "All" && (
                <button
                  onClick={() => setScope("All")}
                  className="inline-flex items-center gap-1 rounded-full bg-navy px-3 py-1 text-xs font-semibold text-white"
                >
                  {scope} <X className="h-3 w-3" />
                </button>
              )}
              {cohorts.map((c) => (
                <button
                  key={c}
                  onClick={() => toggleCohort(c)}
                  className="inline-flex items-center gap-1 rounded-full bg-teal-light px-3 py-1 text-xs font-semibold text-teal-brand"
                >
                  {c} <X className="h-3 w-3" />
                </button>
              ))}
              {themes.map((t) => (
                <button
                  key={t}
                  onClick={() => toggleTheme(t)}
                  className="inline-flex items-center gap-1 rounded-full bg-coral-light px-3 py-1 text-xs font-semibold text-coral"
                >
                  {t} <X className="h-3 w-3" />
                </button>
              ))}
            </div>
          )}

          <p className="mb-4 text-xs font-semibold text-gray-500">
            Showing {filtered.length} of {SEED_PACKAGES.length} curated packages
          </p>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((pkg) => (
                <PackageCard key={pkg.slug} pkg={pkg} />
              ))}
            </div>
          ) : (
            /* Mandatory Zero-Result State */
            <div className="rounded-3xl border border-dashed border-teal-brand/40 bg-white p-10 text-center shadow-sm">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-coral-light text-coral">
                <PhoneCall className="h-6 w-6" />
              </div>
              <h2 className="mt-4 font-heading text-xl font-extrabold text-navy">
                No exact pre-planned match—let our Travel Desk build it for you!
              </h2>
              <p className="mt-2 max-w-md mx-auto text-sm text-gray-600">
                We can customize this exact trip for your group and call you back in under 2
                business hours.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link
                  href={`/customize?${customizeQuery}`}
                  onClick={() =>
                    trackEvent("zero_result_customize_clicked", {
                      scope,
                      cohorts,
                      themes,
                    })
                  }
                  className="inline-flex items-center gap-2 rounded-xl bg-coral px-5 py-3 text-sm font-bold text-white hover:bg-coral-hover transition"
                >
                  Customize This Trip
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <button
                  type="button"
                  onClick={clearAll}
                  className="rounded-xl border border-gray-300 px-5 py-3 text-sm font-bold text-navy hover:bg-surface"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PackagesPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-gray-500">Loading packages...</div>}>
      <PackagesDiscoveryContent />
    </Suspense>
  );
}
