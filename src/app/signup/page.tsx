"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Building2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { isValidGSTIN } from "@/lib/tax-calculator";

export default function SignupPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [role, setRole] = useState<"B2C" | "B2B">("B2C");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [gstin, setGstin] = useState("");
  const [dpdpConsent, setDpdpConsent] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!dpdpConsent) {
      setError("Please accept the India DPDP Privacy Policy.");
      return;
    }
    if (role === "B2B" && gstin.trim() && !isValidGSTIN(gstin)) {
      setError("Invalid 15-character GSTIN format.");
      return;
    }

    setSubmitting(true);
    const res = await register({
      role,
      fullName,
      email,
      phone,
      password,
      companyName: role === "B2B" ? companyName : undefined,
      gstin: role === "B2B" ? gstin.toUpperCase() : undefined,
    });
    setSubmitting(false);
    if (res.error) setError(res.error);
    else router.push("/account");
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-14">
      <div className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm">
        <h1 className="font-heading text-2xl font-extrabold text-navy">
          Create Your Voyago Account
        </h1>
        <p className="mt-1 text-xs text-gray-600">
          Unlock full itineraries, save favorite packages, request custom quotes, and book directly.
        </p>

        <div className="mt-5 grid grid-cols-2 gap-2 rounded-xl bg-surface p-1">
          <button
            type="button"
            onClick={() => setRole("B2C")}
            className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold ${
              role === "B2C" ? "bg-navy text-white" : "text-gray-600"
            }`}
          >
            <User className="h-3.5 w-3.5" />
            Individual (B2C)
          </button>
          <button
            type="button"
            onClick={() => setRole("B2B")}
            className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold ${
              role === "B2B" ? "bg-teal-brand text-white" : "text-gray-600"
            }`}
          >
            <Building2 className="h-3.5 w-3.5" />
            Company (B2B)
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-navy mb-1">Full Name *</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm"
            />
          </div>

          {role === "B2B" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-navy mb-1">Company Name *</label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-navy mb-1">15-Digit GSTIN</label>
                <input
                  type="text"
                  maxLength={15}
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value.toUpperCase())}
                  placeholder="33AABCV1234F1Z5"
                  className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm uppercase"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-navy mb-1">Email *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-navy mb-1">Mobile Number *</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-navy mb-1">Password *</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm"
            />
          </div>

          <label className="flex items-start gap-2 text-xs text-gray-600">
            <input
              type="checkbox"
              checked={dpdpConsent}
              onChange={(e) => setDpdpConsent(e.target.checked)}
              className="mt-0.5 rounded"
            />
            <span>
              I accept the{" "}
              <Link href="/legal/privacy" className="underline text-navy">
                India DPDP Privacy Policy
              </Link>{" "}
              and consent to Voyago Holidays storing my details for bookings and callbacks.
            </span>
          </label>

          {error && <p className="text-xs text-red-600 font-semibold">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-coral py-3 text-sm font-bold text-white hover:bg-coral-hover"
          >
            {submitting ? "Creating account..." : `Create ${role} Account`}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-gray-600">
          Already registered?{" "}
          <Link href="/login" className="font-bold text-navy underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
