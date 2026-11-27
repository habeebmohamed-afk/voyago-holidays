"use client";

import React, { useState } from "react";
import {
  Package,
  CreditCard,
  ShieldCheck,
  PhoneCall,
  Download,
  CheckCircle2,
  XCircle,
  Link2,
} from "lucide-react";
import {
  SEED_ADMIN_BOOKINGS,
  SEED_ADMIN_LEADS,
  SEED_ADMIN_VERIFICATIONS,
  SEED_PACKAGES,
} from "@/lib/seed-data";
import { formatINR } from "@/lib/tax-calculator";
import type { BookingRecord, CustomizationLead, IdVerificationItem } from "@/types";

type AdminRole = "Super Admin" | "Travel Ops" | "Finance" | "Sales";
type AdminModule = "packages" | "bookings" | "verifications" | "leads";

export default function AdminPanelPage() {
  const [role, setRole] = useState<AdminRole>("Super Admin");
  const [moduleTab, setModuleTab] = useState<AdminModule>("bookings");

  const [bookings, setBookings] = useState<BookingRecord[]>(SEED_ADMIN_BOOKINGS);
  const [verifications, setVerifications] = useState<IdVerificationItem[]>(
    SEED_ADMIN_VERIFICATIONS
  );
  const [leads, setLeads] = useState<CustomizationLead[]>(SEED_ADMIN_LEADS);
  const [packages, setPackages] = useState(SEED_PACKAGES);
  const [newPkgTitle, setNewPkgTitle] = useState("");
  const [newPkgPrice, setNewPkgPrice] = useState("35000");

  const reconcileNeft = (bookingRef: string) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.bookingRef === bookingRef
          ? { ...b, paymentStatus: "PAID", bookingStatus: "Confirmed" }
          : b
      )
    );
  };

  const reviewVerification = (id: string, nextStatus: "Verified" | "Action Required") => {
    setVerifications((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status: nextStatus } : v))
    );
  };

  const generatePaymentLink = (referenceCode: string, split: string) => {
    const url = `https://rzp.io/i/voyago-${referenceCode.toLowerCase()}`;
    setLeads((prev) =>
      prev.map((l) =>
        l.referenceCode === referenceCode
          ? { ...l, status: "Payment Link Sent", paymentLinkUrl: url, milestoneSplit: split }
          : l
      )
    );
  };

  const exportGstCsv = () => {
    const header = "BookingRef,CustomerType,Package,Scope,GSTIN,PAN,BaseINR,GST_INR,TCS_INR,GrandTotal,Status\n";
    const rows = bookings
      .map(
        (b) =>
          `${b.bookingRef},${b.customerType},"${b.packageTitle}",${b.scope},${b.gstin || ""},${b.panNumber || ""},${b.baseAmount},${b.gstAmount},${b.tcsAmount},${b.grandTotal},"${b.bookingStatus}"`
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "voyago-gst-tcs-ledger.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const addDraftPackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPkgTitle.trim()) return;
    const slug = newPkgTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    setPackages((prev) => [
      {
        ...SEED_PACKAGES[0],
        slug,
        title: newPkgTitle,
        priceInr: Number(newPkgPrice) || 35000,
        heatMapSummary: "Available (0 booked)",
      },
      ...prev,
    ]);
    setNewPkgTitle("");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Header + RBAC Switcher */}
      <div className="rounded-3xl bg-navy p-6 text-white flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-amber-warm">
            Voyago Holidays Internal Ops (RBAC Sandbox)
          </p>
          <h1 className="mt-1 font-heading text-2xl font-extrabold">
            Custom Internal Admin Panel
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/75">Active RBAC Role:</span>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as AdminRole)}
            className="rounded-xl bg-white/15 px-3 py-2 text-xs font-bold text-white border border-white/20"
          >
            <option className="text-navy">Super Admin</option>
            <option className="text-navy">Travel Ops</option>
            <option className="text-navy">Finance</option>
            <option className="text-navy">Sales</option>
          </select>
        </div>
      </div>

      {/* 4 Launch-Essential Module Tabs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { id: "packages", label: "1. Package & Departure CMS", icon: Package },
          { id: "bookings", label: "2. Bookings & NEFT / GST", icon: CreditCard },
          { id: "verifications", label: "3. Cohort ID & B2B KYC", icon: ShieldCheck },
          { id: "leads", label: "4. Customization Leads & Links", icon: PhoneCall },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setModuleTab(tab.id as AdminModule)}
            className={`flex items-center gap-2 rounded-2xl border p-3.5 text-left text-xs font-bold transition ${
              moduleTab === tab.id
                ? "bg-teal-brand text-white border-teal-brand shadow-sm"
                : "bg-white text-navy border-gray-200 hover:border-navy"
            }`}
          >
            <tab.icon className="h-4 w-4 shrink-0" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* MODULE 1: Package CMS */}
      {moduleTab === "packages" && (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="font-heading text-lg font-bold text-navy">
              Package, Itinerary &amp; Departure CMS ({packages.length} active)
            </h2>
            <form onSubmit={addDraftPackage} className="flex flex-wrap gap-2">
              <input
                type="text"
                value={newPkgTitle}
                onChange={(e) => setNewPkgTitle(e.target.value)}
                placeholder="New package title..."
                className="rounded-xl border border-gray-300 px-3 py-1.5 text-xs"
              />
              <input
                type="number"
                value={newPkgPrice}
                onChange={(e) => setNewPkgPrice(e.target.value)}
                className="w-28 rounded-xl border border-gray-300 px-3 py-1.5 text-xs"
              />
              <button
                type="submit"
                className="rounded-xl bg-coral px-3.5 py-1.5 text-xs font-bold text-white"
              >
                + Add Package
              </button>
            </form>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-surface text-navy">
                  <th className="p-3">Title</th>
                  <th className="p-3">Scope</th>
                  <th className="p-3">Cohort</th>
                  <th className="p-3">Theme</th>
                  <th className="p-3">Price (INR)</th>
                  <th className="p-3">Heat Map Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {packages.map((p) => (
                  <tr key={p.slug}>
                    <td className="p-3 font-bold text-navy">{p.title}</td>
                    <td className="p-3">{p.scope}</td>
                    <td className="p-3">{p.cohort}</td>
                    <td className="p-3">{p.theme}</td>
                    <td className="p-3 font-bold tabular-nums">{formatINR(p.priceInr)}</td>
                    <td className="p-3 text-teal-brand font-semibold">{p.heatMapSummary}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODULE 2: Bookings & B2B Financial Ops */}
      {moduleTab === "bookings" && (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="font-heading text-lg font-bold text-navy">
              Bookings &amp; B2B NEFT / GST / TCS Ledger
            </h2>
            <button
              onClick={exportGstCsv}
              className="inline-flex items-center gap-1.5 rounded-xl bg-navy px-4 py-2 text-xs font-bold text-white hover:bg-teal-brand"
            >
              <Download className="h-3.5 w-3.5" />
              Export GST &amp; TCS CSV (Zoho Books / Tally)
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-surface text-navy">
                  <th className="p-3">Ref</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Customer / GSTIN / PAN</th>
                  <th className="p-3">Package</th>
                  <th className="p-3">Total (INR)</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Finance Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bookings.map((b) => (
                  <tr key={b.bookingRef}>
                    <td className="p-3 font-bold text-navy">{b.bookingRef}</td>
                    <td className="p-3">
                      <span className="rounded bg-surface px-2 py-0.5 font-bold">{b.customerType}</span>
                    </td>
                    <td className="p-3">
                      <p className="font-semibold text-navy">{b.contactName}</p>
                      <p className="text-[11px] text-gray-500">
                        {b.gstin ? `GSTIN: ${b.gstin}` : b.panNumber ? `PAN: ${b.panNumber}` : b.contactEmail}
                      </p>
                    </td>
                    <td className="p-3">{b.packageTitle}</td>
                    <td className="p-3 font-bold tabular-nums">{formatINR(b.grandTotal)}</td>
                    <td className="p-3 font-semibold text-teal-brand">{b.bookingStatus}</td>
                    <td className="p-3">
                      {b.paymentStatus === "PENDING_NEFT" ? (
                        <button
                          onClick={() => reconcileNeft(b.bookingRef)}
                          className="rounded-lg bg-coral px-3 py-1.5 text-[11px] font-bold text-white"
                        >
                          Mark NEFT Settled &amp; Issue GST
                        </button>
                      ) : (
                        <span className="text-[11px] text-emerald-700 font-semibold">Reconciled</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODULE 3: Cohort Safety & Corporate KYC Queue */}
      {moduleTab === "verifications" && (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
          <h2 className="font-heading text-lg font-bold text-navy">
            Cohort Safety ID Queue (24-Hour SLA) &amp; B2B KYC
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-surface text-navy">
                  <th className="p-3">Booking Ref</th>
                  <th className="p-3">Traveler</th>
                  <th className="p-3">Cohort</th>
                  <th className="p-3">Document</th>
                  <th className="p-3">SLA Remaining</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Ops Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {verifications.map((v) => (
                  <tr key={v.id}>
                    <td className="p-3 font-bold text-navy">{v.bookingRef}</td>
                    <td className="p-3 font-semibold">{v.travelerName}</td>
                    <td className="p-3">{v.cohort}</td>
                    <td className="p-3">
                      {v.docType} ({v.docReference})
                    </td>
                    <td className="p-3 font-bold text-coral">{v.slaHoursLeft} hrs left</td>
                    <td className="p-3 font-semibold">{v.status}</td>
                    <td className="p-3 flex gap-2">
                      <button
                        onClick={() => reviewVerification(v.id, "Verified")}
                        className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white"
                      >
                        <CheckCircle2 className="h-3 w-3" />
                        Approve
                      </button>
                      <button
                        onClick={() => reviewVerification(v.id, "Action Required")}
                        className="inline-flex items-center gap-1 rounded-lg bg-red-600 px-2.5 py-1 text-[11px] font-bold text-white"
                      >
                        <XCircle className="h-3 w-3" />
                        Reject &amp; Refund
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODULE 4: Customization Leads & Payment Link Generator */}
      {moduleTab === "leads" && (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
          <h2 className="font-heading text-lg font-bold text-navy">
            Customization Leads (&lt; 2 Hr Callback SLA) &amp; Custom Payment Links
          </h2>
          <div className="space-y-3">
            {leads.map((l) => (
              <div
                key={l.referenceCode}
                className="rounded-xl border border-gray-200 p-4 flex flex-wrap items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-heading text-sm font-bold text-navy">{l.referenceCode}</span>
                    <span className="rounded bg-teal-light px-2 py-0.5 text-[11px] font-bold text-teal-brand">
                      {l.travelerType}
                    </span>
                    <span className="rounded bg-coral-light px-2 py-0.5 text-[11px] font-bold text-coral">
                      SLA: {l.slaMinutesLeft} mins left
                    </span>
                    <span className="text-xs font-semibold text-gray-500">Status: {l.status}</span>
                  </div>
                  <p className="text-xs font-semibold text-navy">
                    {l.fullName} {l.companyName ? `(${l.companyName})` : ""} • {l.phone} • {l.email}
                  </p>
                  <p className="text-xs text-gray-600">
                    <strong>{l.destinations}</strong> • {l.travelerCount} Pax • {l.budgetRange} • {l.travelDates}
                  </p>
                  {l.paymentLinkUrl && (
                    <p className="text-xs font-semibold text-emerald-700">
                      Payment Link ({l.milestoneSplit}): {l.paymentLinkUrl}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => generatePaymentLink(l.referenceCode, "30% Advance / 70% Balance")}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-navy px-3.5 py-2 text-xs font-bold text-white hover:bg-coral transition"
                  >
                    <Link2 className="h-3.5 w-3.5" />
                    Generate 30%/70% Milestone Link
                  </button>
                  <button
                    onClick={() => generatePaymentLink(l.referenceCode, "100% Full Payment")}
                    className="rounded-xl border border-gray-300 px-3 py-2 text-xs font-bold text-navy hover:bg-surface"
                  >
                    Full Link
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
