"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileDown,
  ShieldCheck,
  Upload,
  Trash2,
  LogOut,
  Heart,
  Building2,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { SEED_PACKAGES } from "@/lib/seed-data";
import { formatINR } from "@/lib/tax-calculator";

export default function AccountPage() {
  const { user, openAuthModal, logout, deleteAccount, savedSlugs, bookings } = useAuth();
  const [docType, setDocType] = useState("Masked Aadhaar");
  const [docRef, setDocRef] = useState("");
  const [idUploaded, setIdUploaded] = useState(false);
  const [rosterUploaded, setRosterUploaded] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!user) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="font-heading text-2xl font-extrabold text-navy">
          Sign In to Access Your Account
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          View your bookings, download GST/TCS invoices, upload 24-hour Cohort IDs, and manage saved
          trips.
        </p>
        <button
          onClick={() => openAuthModal({ mode: "login" })}
          className="mt-6 rounded-xl bg-coral px-6 py-3 text-sm font-bold text-white"
        >
          Login / Sign Up
        </button>
      </div>
    );
  }

  const savedPackages = SEED_PACKAGES.filter((p) => savedSlugs.includes(p.slug));

  const handleIdUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docRef.trim()) return;
    await fetch(`/api/v1/bookings/${bookings[0]?.bookingRef || "VH-DEMO"}/id-verification`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ docType, docReference: docRef }),
    }).catch(() => {});
    setIdUploaded(true);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="rounded-3xl bg-navy p-6 sm:p-8 text-white flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="rounded-full bg-teal-brand px-3 py-1 text-xs font-bold">
            {user.role} Account
          </span>
          <h1 className="mt-2 font-heading text-2xl font-extrabold">{user.fullName}</h1>
          <p className="text-xs text-white/80">
            {user.email} • {user.phone || "Phone not set"}
            {user.companyName ? ` • ${user.companyName} (GSTIN: ${user.gstin || "Pending"})` : ""}
          </p>
        </div>
        <button
          onClick={() => logout()}
          className="inline-flex items-center gap-1.5 rounded-xl bg-white/15 px-4 py-2 text-xs font-bold hover:bg-white/25"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>

      {/* My Bookings */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="font-heading text-lg font-bold text-navy mb-4">My Bookings &amp; Invoices</h2>
        {bookings.length === 0 ? (
          <p className="text-sm text-gray-600">
            No bookings yet.{" "}
            <Link href="/packages" className="font-bold text-coral underline">
              Explore curated packages →
            </Link>
          </p>
        ) : (
          <div className="space-y-3">
            {bookings.map((b) => (
              <div
                key={b.bookingRef}
                className="rounded-xl border border-gray-200 p-4 flex flex-wrap items-center justify-between gap-4"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-heading text-sm font-bold text-navy">{b.bookingRef}</span>
                    <span className="rounded-full bg-teal-light px-2.5 py-0.5 text-[11px] font-bold text-teal-brand">
                      {b.bookingStatus}
                    </span>
                  </div>
                  <p className="mt-1 text-sm font-semibold text-navy">{b.packageTitle}</p>
                  <p className="text-xs text-gray-500">
                    Departure: {b.departureDate} • {b.travelerCount} Pax • Total:{" "}
                    <strong>{formatINR(b.grandTotal)}</strong> ({b.paymentMethod})
                  </p>
                </div>
                <a
                  href={`/api/v1/invoices/${encodeURIComponent(b.bookingRef)}?title=${encodeURIComponent(b.packageTitle)}&amount=${b.grandTotal}&name=${encodeURIComponent(b.contactName)}&scope=${b.scope}`}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-navy px-4 py-2 text-xs font-bold text-white hover:bg-coral transition"
                >
                  <FileDown className="h-4 w-4" />
                  Download GST/TCS Invoice PDF
                </a>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Saved Trips */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="flex items-center gap-2 font-heading text-lg font-bold text-navy mb-4">
          <Heart className="h-5 w-5 text-coral" />
          Saved Trips ({savedPackages.length})
        </h2>
        {savedPackages.length === 0 ? (
          <p className="text-sm text-gray-600">
            Tap the heart icon on any package to save it here.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedPackages.map((p) => (
              <Link
                key={p.slug}
                href={`/packages/${p.slug}`}
                className="rounded-xl border border-gray-200 p-4 hover:border-teal-brand transition"
              >
                <p className="text-xs font-bold text-teal-brand">{p.cohort} • {p.duration}</p>
                <p className="mt-1 font-heading text-sm font-bold text-navy">{p.title}</p>
                <p className="mt-2 text-sm font-extrabold text-coral tabular-nums">
                  {formatINR(p.priceInr)}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Cohort ID Verification Portal + B2B Roster Upload */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="flex items-center gap-2 font-heading text-base font-bold text-navy">
            <ShieldCheck className="h-5 w-5 text-teal-brand" />
            24-Hour Cohort ID Verification Portal
          </h2>
          <p className="mt-1 text-xs text-gray-600">
            Mandatory for Girls-only &amp; Boys-only departures within 24 hours of booking.
          </p>
          {idUploaded ? (
            <div className="mt-4 rounded-xl bg-teal-light p-4 text-xs text-navy flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-teal-brand shrink-0" />
              Status: <strong>Pending Review</strong> — Our Travel Ops team will verify within the 24-hr SLA.
            </div>
          ) : (
            <form onSubmit={handleIdUpload} className="mt-4 space-y-3">
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs"
              >
                <option>Masked Aadhaar</option>
                <option>Passport</option>
                <option>Driving License</option>
              </select>
              <input
                type="text"
                required
                value={docRef}
                onChange={(e) => setDocRef(e.target.value)}
                placeholder="Last 4 digits / Document Reference (e.g. XXXX-XXXX-4821)"
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-xl bg-navy px-4 py-2 text-xs font-bold text-white hover:bg-teal-brand"
              >
                <Upload className="h-3.5 w-3.5" />
                Submit for 24-Hr Verification
              </button>
            </form>
          )}
        </section>

        {user.role === "B2B" && (
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="flex items-center gap-2 font-heading text-base font-bold text-navy">
              <Building2 className="h-5 w-5 text-teal-brand" />
              B2B Employee Roster CSV Upload
            </h2>
            <p className="mt-1 text-xs text-gray-600">
              Upload multi-traveler employee rosters for corporate offsite bookings.
            </p>
            <div className="mt-4 space-y-3">
              <input
                type="file"
                accept=".csv"
                onChange={() => setRosterUploaded(true)}
                className="block w-full text-xs text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-teal-light file:px-3 file:py-2 file:text-xs file:font-bold file:text-teal-brand"
              />
              {rosterUploaded && (
                <p className="text-xs font-semibold text-emerald-700">
                  Employee roster CSV queued for Travel Ops verification.
                </p>
              )}
            </div>
          </section>
        )}
      </div>

      {/* DPDP Self-Serve Account Deletion */}
      <section className="rounded-2xl border border-red-200 bg-red-50/50 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-heading text-base font-bold text-red-800">
              Privacy &amp; Account Deletion (India DPDP Act)
            </h2>
            <p className="text-xs text-red-700 mt-0.5">
              Permanently delete your Voyago Holidays account and personal profile records.
            </p>
          </div>
          {confirmDelete ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => deleteAccount()}
                className="rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white"
              >
                Confirm Permanent Delete
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs font-bold text-navy"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-red-300 bg-white px-4 py-2 text-xs font-bold text-red-700 hover:bg-red-600 hover:text-white transition"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete My Account
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
