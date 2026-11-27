"use client";

import React, { useState, useEffect } from "react";
import { X, User, Building2, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { isValidGSTIN } from "@/lib/tax-calculator";

export function AuthModal() {
  const { authModal, closeAuthModal, login, register, isLiveSupabase } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">(authModal.mode);
  const [role, setRole] = useState<"B2C" | "B2B">(authModal.defaultRole);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [gstin, setGstin] = useState("");
  const [dpdpConsent, setDpdpConsent] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setMode(authModal.mode);
    setRole(authModal.defaultRole);
    setError(null);
  }, [authModal.mode, authModal.defaultRole, authModal.open]);

  if (!authModal.open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === "signup") {
      if (!fullName.trim() || !phone.trim()) {
        setError("Please enter your full name and mobile number.");
        return;
      }
      if (!dpdpConsent) {
        setError("Please accept the India DPDP Privacy Policy to continue.");
        return;
      }
      if (role === "B2B") {
        if (!companyName.trim()) {
          setError("Please enter your Company / Organization Name.");
          return;
        }
        if (gstin.trim() && !isValidGSTIN(gstin)) {
          setError("Please enter a valid 15-character Indian GSTIN (e.g. 33AABCV1234F1Z5).");
          return;
        }
      }
    }

    setSubmitting(true);
    const res =
      mode === "login"
        ? await login(email, password, role)
        : await register({
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
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Voyago Holidays Account Access"
    >
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-gray-200 max-h-[92vh] overflow-y-auto">
        <button
          onClick={closeAuthModal}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-navy"
          aria-label="Close login modal"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-light px-3 py-1 text-xs font-semibold text-teal-brand">
            <ShieldCheck className="h-3.5 w-3.5" />
            {isLiveSupabase ? "Secured by Supabase Auth" : "Interactive Sandbox Mode"}
          </span>
          <h2 className="mt-2 font-heading text-xl font-bold text-navy">
            {mode === "signup" ? "Join Voyago Holidays" : "Welcome Back"}
          </h2>
          {authModal.reason && (
            <p className="mt-1 text-sm text-gray-600">{authModal.reason}</p>
          )}
        </div>

        {/* Role Switcher */}
        <div className="mb-4 grid grid-cols-2 gap-2 rounded-xl bg-surface p-1">
          <button
            type="button"
            onClick={() => setRole("B2C")}
            className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-semibold transition ${
              role === "B2C"
                ? "bg-navy text-white shadow-sm"
                : "text-gray-600 hover:text-navy"
            }`}
          >
            <User className="h-4 w-4" />
            Individual (B2C)
          </button>
          <button
            type="button"
            onClick={() => setRole("B2B")}
            className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-semibold transition ${
              role === "B2B"
                ? "bg-teal-brand text-white shadow-sm"
                : "text-gray-600 hover:text-navy"
            }`}
          >
            <Building2 className="h-4 w-4" />
            Company (B2B)
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === "signup" && (
            <>
              <div>
                <label className="block text-xs font-semibold text-navy mb-1">
                  {role === "B2B" ? "Contact Person Full Name *" : "Full Name *"}
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Aarav Kumar"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-teal-brand focus:outline-none"
                />
              </div>

              {role === "B2B" && (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-navy mb-1">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Acme Pvt Ltd"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-teal-brand focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-navy mb-1">
                      15-Digit GSTIN
                    </label>
                    <input
                      type="text"
                      maxLength={15}
                      value={gstin}
                      onChange={(e) => setGstin(e.target.value.toUpperCase())}
                      placeholder="33AABCV1234F1Z5"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm uppercase focus:border-teal-brand focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-navy mb-1">
                  Mobile Number (WhatsApp-enabled) *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-teal-brand focus:outline-none"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-navy mb-1">
              {role === "B2B" ? "Work Email *" : "Email Address *"}
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={role === "B2B" ? "hr@company.com" : "you@example.com"}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-teal-brand focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy mb-1">
              Password *
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-teal-brand focus:outline-none"
            />
          </div>

          {mode === "signup" && (
            <label className="flex items-start gap-2 text-xs text-gray-600 pt-1">
              <input
                type="checkbox"
                checked={dpdpConsent}
                onChange={(e) => setDpdpConsent(e.target.checked)}
                className="mt-0.5 rounded border-gray-300 text-teal-brand"
              />
              <span>
                I consent to Voyago Holidays storing my contact details for trip bookings &amp; Travel Desk callbacks under the India DPDP Act Privacy Policy.
              </span>
            </label>
          )}

          {error && (
            <div className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-coral py-2.5 text-sm font-bold text-white shadow-sm hover:bg-coral-hover transition disabled:opacity-60"
          >
            {submitting
              ? "Please wait..."
              : mode === "signup"
                ? `Create ${role} Account`
                : `Sign In as ${role}`}
          </button>
        </form>

        <div className="mt-4 text-center text-xs text-gray-600">
          {mode === "signup" ? (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setMode("login")}
                className="font-semibold text-navy underline"
              >
                Sign in
              </button>
            </>
          ) : (
            <>
              New to Voyago Holidays?{" "}
              <button
                type="button"
                onClick={() => setMode("signup")}
                className="font-semibold text-navy underline"
              >
                Create free account
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
