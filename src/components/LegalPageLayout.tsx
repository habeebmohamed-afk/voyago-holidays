import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function LegalPageLayout({
  title,
  lastUpdated,
  children,
}: {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-brand hover:underline mb-6"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Voyago Holidays
      </Link>
      <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-10 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-coral">
          Voyago Holidays Legal &amp; Compliance
        </p>
        <h1 className="mt-1 font-heading text-2xl sm:text-3xl font-extrabold text-navy">
          {title}
        </h1>
        <p className="mt-2 text-xs text-gray-500">
          Effective Date: {lastUpdated} • Jurisdiction: Rameshwaram, Tamil Nadu, India
        </p>
        <div className="mt-6 space-y-5 text-sm text-gray-700 leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
}
