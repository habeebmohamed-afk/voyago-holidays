"use client";

import React from "react";
import Link from "next/link";
import { Heart, MapPin, Clock, Flame, Users } from "lucide-react";
import type { TravelPackage } from "@/types";
import { formatINR } from "@/lib/tax-calculator";
import { useAuth } from "@/context/AuthContext";

export function PackageCard({ pkg }: { pkg: TravelPackage }) {
  const { savedSlugs, toggleSavedTrip } = useAuth();
  const isSaved = savedSlugs.includes(pkg.slug);

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition">
      {/* Visual Cover Banner */}
      <div className={`relative h-44 bg-gradient-to-br ${pkg.gradient} p-4 text-white flex flex-col justify-between`}>
        <div className="flex items-start justify-between gap-2">
          <span className="rounded-full bg-white/20 backdrop-blur px-2.5 py-1 text-[11px] font-semibold">
            {pkg.scope}
          </span>
          <button
            type="button"
            onClick={() => toggleSavedTrip(pkg.slug)}
            aria-label={isSaved ? "Remove saved trip" : "Save trip"}
            className="rounded-full bg-white/20 p-1.5 backdrop-blur hover:bg-white/30 transition"
          >
            <Heart
              className={`h-4 w-4 ${isSaved ? "fill-coral text-coral" : "text-white"}`}
            />
          </button>
        </div>

        <div>
          <div className="flex flex-wrap gap-1.5 mb-2">
            <span className="inline-flex items-center gap-1 rounded-md bg-navy/80 px-2 py-0.5 text-[11px] font-semibold text-white">
              <Users className="h-3 w-3 text-amber-warm" />
              {pkg.cohort}
            </span>
            <span className="rounded-md bg-white/90 px-2 py-0.5 text-[11px] font-semibold text-navy">
              {pkg.theme}
            </span>
          </div>
          <p className="flex items-center gap-1 text-xs text-white/90">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            {pkg.location}
          </p>
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-heading text-base font-bold text-navy group-hover:text-coral transition line-clamp-2">
          {pkg.title}
        </h3>
        <p className="mt-1.5 text-xs text-gray-600 line-clamp-2 leading-relaxed">
          {pkg.summary}
        </p>

        <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
          <span className="inline-flex items-center gap-1 font-medium">
            <Clock className="h-3.5 w-3.5 text-teal-brand" />
            {pkg.duration}
          </span>
          <span className="inline-flex items-center gap-1 font-semibold text-coral">
            <Flame className="h-3.5 w-3.5" />
            {pkg.heatMapSummary}
          </span>
        </div>

        <div className="mt-4 pt-3 border-t border-gray-100 flex items-end justify-between gap-2">
          <div>
            <p className="text-[11px] text-gray-500">Starting from</p>
            <p className="font-heading text-lg font-extrabold text-navy tabular-nums">
              {formatINR(pkg.priceInr)}
              <span className="text-xs font-normal text-gray-500"> / pax</span>
            </p>
          </div>
          <Link
            href={`/packages/${pkg.slug}`}
            className="rounded-xl bg-navy px-3.5 py-2 text-xs font-bold text-white hover:bg-coral transition"
          >
            View Itinerary
          </Link>
        </div>
      </div>
    </article>
  );
}
