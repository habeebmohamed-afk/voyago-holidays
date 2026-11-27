"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Building2, FileSpreadsheet, CheckCircle2, Download, ShieldCheck } from "lucide-react";
import { SEED_PACKAGES } from "@/lib/seed-data";
import { formatINR } from "@/lib/tax-calculator";
import { useAuth } from "@/context/AuthContext";

export default function CorporatePage() {
  const { user, openAuthModal } = useAuth();
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([
    SEED_PACKAGES[1].slug,
    SEED_PACKAGES[2].slug,
    SEED_PACKAGES[5].slug,
  ]);
  const [companyName, setCompanyName] = useState("");
  const [workEmail, setWorkEmail] = useState("");
  const [teamSize, setTeamSize] = useState("26–50 Pax");
  const [lookbookDownloaded, setLookbookDownloaded] = useState(false);

  const compared = SEED_PACKAGES.filter((p) => selectedSlugs.includes(p.slug)).slice(0, 3);

  const toggleCompare = (slug: string) => {
    setSelectedSlugs((prev) => {
      if (prev.includes(slug)) return prev.filter((s) => s !== slug);
      if (prev.length >= 3) return [...prev.slice(1), slug];
      return [...prev, slug];
    });
  };

  const handleLookbookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !workEmail.trim()) return;
    setLookbookDownloaded(true);
  };

  return (
    <div className="pb-16">
      <section className="bg-navy text-white py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-amber-warm">
            <Building2 className="h-3.5 w-3.5" />
            Direct B2B Corporate &amp; Institutional Portal
          </span>
          <h1 className="mt-4 font-heading text-3xl sm:text-4xl font-extrabold max-w-3xl">
            Corporate Offsites &amp; Group Retreats, Engineered for Zero HR Headaches
          </h1>
          <p className="mt-3 max-w-2xl text-sm sm:text-base text-white/85">
            Compare packages side-by-side on Desktop, unlock volume discount slabs, generate
            automated GSTIN company invoices, upload employee rosters via CSV, and pay via NEFT or
            30%/70% milestone links.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {!user || user.role !== "B2B" ? (
              <button
                type="button"
                onClick={() =>
                  openAuthModal({
                    mode: "signup",
                    defaultRole: "B2B",
                    reason: "Register your Company (B2B) account to unlock corporate GSTIN billing and employee roster uploads.",
                  })
                }
                className="rounded-xl bg-coral px-5 py-3 text-sm font-bold text-white hover:bg-coral-hover"
              >
                Company (B2B) Login / Sign Up
              </button>
            ) : (
              <Link
                href="/account"
                className="rounded-xl bg-teal-brand px-5 py-3 text-sm font-bold text-white"
              >
                Open Company Dashboard ({user.companyName || "B2B"})
              </Link>
            )}
            <Link
              href="/customize?type=b2b"
              className="rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-bold text-white hover:bg-white/20"
            >
              Request Custom B2B Quote (&lt; 2 Hr Callback)
            </Link>
          </div>
        </div>
      </section>

      {/* Discount Slabs & Milestone Billing */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {[
            { slab: "10 – 25 Pax", discount: "5% Off", note: "Instant slab at checkout + GSTIN invoice" },
            { slab: "26 – 50 Pax", discount: "8% Off", note: "Includes dedicated trip manager + NEFT" },
            { slab: "51 – 100+ Pax", discount: "12% Off", note: "Custom charter, 30%/70% milestone billing" },
          ].map((item) => (
            <div
              key={item.slab}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <p className="text-xs font-bold uppercase tracking-wider text-teal-brand">
                {item.slab}
              </p>
              <p className="mt-1 font-heading text-3xl font-extrabold text-navy">
                {item.discount}
              </p>
              <p className="mt-2 text-xs text-gray-600">{item.note}</p>
            </div>
          ))}
        </div>

        {/* Desktop 3-Package Comparison Table */}
        <div className="mt-12 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="font-heading text-xl font-extrabold text-navy">
                Side-by-Side Corporate Itinerary Comparison (Pick up to 3)
              </h2>
              <p className="text-xs text-gray-500">
                Select any 3 packages below to compare cost per employee, inclusions, and GST.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-light px-3 py-1 text-xs font-semibold text-teal-brand">
              <FileSpreadsheet className="h-3.5 w-3.5" />
              30% Advance / 70% Pre-Departure Milestone Billing
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {SEED_PACKAGES.map((p) => {
              const active = selectedSlugs.includes(p.slug);
              return (
                <button
                  key={p.slug}
                  type="button"
                  onClick={() => toggleCompare(p.slug)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold border transition ${
                    active
                      ? "bg-navy text-white border-navy"
                      : "bg-surface text-navy border-gray-200 hover:border-navy"
                  }`}
                >
                  {p.title.split(" ").slice(0, 3).join(" ")}
                </button>
              );
            })}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-surface text-navy">
                  <th className="p-3 font-bold">Attribute</th>
                  {compared.map((p) => (
                    <th key={p.slug} className="p-3 font-bold">
                      {p.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="p-3 font-semibold text-gray-500">Scope &amp; Duration</td>
                  {compared.map((p) => (
                    <td key={p.slug} className="p-3 font-medium">
                      {p.scope} • {p.duration}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-gray-500">Base Cost / Employee</td>
                  {compared.map((p) => (
                    <td key={p.slug} className="p-3 font-bold text-navy tabular-nums">
                      {formatINR(p.priceInr)}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-gray-500">Est. 25 Pax (5% B2B Off + 5% GST)</td>
                  {compared.map((p) => {
                    const est = Math.round(p.priceInr * 25 * 0.95 * 1.05);
                    return (
                      <td key={p.slug} className="p-3 font-bold text-teal-brand tabular-nums">
                        {formatINR(est)}
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-gray-500">Key Inclusions</td>
                  {compared.map((p) => (
                    <td key={p.slug} className="p-3 text-xs text-gray-600">
                      {p.inclusions.slice(0, 2).join(" • ")}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-gray-500">Action</td>
                  {compared.map((p) => (
                    <td key={p.slug} className="p-3">
                      <Link
                        href={`/packages/${p.slug}`}
                        className="inline-block rounded-lg bg-coral px-3 py-1.5 text-xs font-bold text-white hover:bg-coral-hover"
                      >
                        Inspect &amp; Book
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Downloadable Lead Magnet: 2027 Corporate Offsite Lookbook */}
        <div className="mt-10 rounded-3xl bg-white border border-gray-200 p-6 sm:p-8 shadow-sm grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-coral">
              <Download className="h-4 w-4" />
              Free HR Planning Resource
            </span>
            <h3 className="mt-2 font-heading text-2xl font-extrabold text-navy">
              Download the 2027 Corporate Offsite Lookbook (PDF)
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Includes venue capacity charts, sample 3N/4D team-building agendas, GST input credit
              checklists, and budget benchmarks for 10 to 100+ employees.
            </p>
          </div>

          {lookbookDownloaded ? (
            <div className="rounded-2xl bg-teal-light p-6 text-navy space-y-2">
              <div className="flex items-center gap-2 font-bold text-teal-brand">
                <CheckCircle2 className="h-5 w-5" />
                Lookbook Ready for {companyName}
              </div>
              <p className="text-xs text-gray-700">
                We&apos;ve registered <strong>{workEmail}</strong> in our B2B Travel Desk queue.
                Your corporate lookbook summary is unlocked and our B2B specialist can follow up on
                request.
              </p>
            </div>
          ) : (
            <form onSubmit={handleLookbookSubmit} className="space-y-3">
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Company / Organization Name *"
                className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="email"
                  required
                  value={workEmail}
                  onChange={(e) => setWorkEmail(e.target.value)}
                  placeholder="Work Email *"
                  className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm"
                />
                <select
                  value={teamSize}
                  onChange={(e) => setTeamSize(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm"
                >
                  <option>10–25 Pax</option>
                  <option>26–50 Pax</option>
                  <option>51–100+ Pax</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full rounded-xl bg-navy py-3 text-sm font-bold text-white hover:bg-coral transition inline-flex items-center justify-center gap-2"
              >
                <ShieldCheck className="h-4 w-4" />
                Unlock 2027 Corporate Offsite Lookbook
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
