"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Building2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [role, setRole] = useState<"B2C" | "B2B">("B2C");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const res = await login(email, password, role);
    setSubmitting(false);
    if (res.error) {
      setError(res.error);
    } else {
      router.push("/account");
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-14">
      <div className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm">
        <h1 className="font-heading text-2xl font-extrabold text-navy">Sign In to Voyago</h1>
        <p className="mt-1 text-xs text-gray-600">
          Access saved trips, full day-by-day itineraries, GST/TCS invoices, and bookings.
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

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
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
          {error && <p className="text-xs text-red-600 font-semibold">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-coral py-3 text-sm font-bold text-white hover:bg-coral-hover"
          >
            {submitting ? "Signing in..." : `Sign In as ${role}`}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-gray-600">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-bold text-navy underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
