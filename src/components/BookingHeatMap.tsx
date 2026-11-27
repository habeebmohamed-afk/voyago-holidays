"use client";

import React, { useMemo, useState } from "react";
import { Calendar, ChevronLeft, ChevronRight, ShieldCheck } from "lucide-react";
import { getSeedHeatMapForMonth } from "@/lib/seed-data";
import { FEATURE_FLAGS } from "@/lib/feature-flags";
import { trackEvent } from "@/lib/analytics";
import type { HeatMapDeparture, HeatMapTier } from "@/types";

interface BookingHeatMapProps {
  packageSlug: string;
  selectedDate?: string;
  onSelectDate?: (departure: HeatMapDeparture) => void;
  compact?: boolean;
}

const TIER_STYLES: Record<
  HeatMapTier,
  { bg: string; border: string; text: string; dot: string; label: string }
> = {
  "Low Demand": {
    bg: "bg-slate-100 hover:bg-slate-200",
    border: "border-slate-300",
    text: "text-slate-800",
    dot: "bg-slate-400",
    label: "Low Demand (0–3 booked)",
  },
  Active: {
    bg: "bg-teal-light hover:bg-[#cdebed]",
    border: "border-teal-brand/50",
    text: "text-navy",
    dot: "bg-teal-brand",
    label: "Active (4–8 booked)",
  },
  Trending: {
    bg: "bg-amber-100 hover:bg-amber-200",
    border: "border-amber-warm",
    text: "text-navy",
    dot: "bg-amber-warm",
    label: "Trending (9–14 booked)",
  },
  "Almost Full": {
    bg: "bg-coral-light hover:bg-[#ffd8ce]",
    border: "border-coral",
    text: "text-navy",
    dot: "bg-coral",
    label: "Almost Full (15+ / Last Spots)",
  },
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function BookingHeatMap({
  packageSlug,
  selectedDate,
  onSelectDate,
  compact = false,
}: BookingHeatMapProps) {
  // Default launch calendar starts March 2027 (post Feb 20, 2027 launch)
  const [year, setYear] = useState(2027);
  const [month, setMonth] = useState(2); // 0-indexed -> March
  const [hovered, setHovered] = useState<HeatMapDeparture | null>(null);

  const departures = useMemo(
    () => getSeedHeatMapForMonth(packageSlug, year, month),
    [packageSlug, year, month]
  );

  const departureMap = useMemo(() => {
    const map = new Map<string, HeatMapDeparture>();
    departures.forEach((d) => map.set(d.date, d));
    return map;
  }, [departures]);

  // Graceful fallback if ENABLE_BOOKING_HEATMAP is disabled
  if (!FEATURE_FLAGS.ENABLE_BOOKING_HEATMAP) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        <label className="block text-sm font-bold text-navy mb-2">
          Select Departure Date
        </label>
        <select
          value={selectedDate || ""}
          onChange={(e) => {
            const dep = departureMap.get(e.target.value);
            if (dep && onSelectDate) onSelectDate(dep);
          }}
          className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm"
        >
          <option value="">Choose a departure date</option>
          {departures.map((d) => (
            <option key={d.date} value={d.date}>
              {d.date} — {d.spotsLeft} spots available
            </option>
          ))}
        </select>
      </div>
    );
  }

  const firstDayOffset = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthLabel = new Date(year, month, 1).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

  const shiftMonth = (delta: number) => {
    const next = new Date(year, month + delta, 1);
    setYear(next.getFullYear());
    setMonth(next.getMonth());
    setHovered(null);
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-teal-brand" />
          <h3 className="font-heading text-base sm:text-lg font-bold text-navy">
            Live Booking Heat Map
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => shiftMonth(-1)}
            className="rounded-lg border border-gray-200 p-1.5 text-navy hover:bg-surface"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="min-w-[125px] text-center text-sm font-bold text-navy">
            {monthLabel}
          </span>
          <button
            type="button"
            onClick={() => shiftMonth(1)}
            className="rounded-lg border border-gray-200 p-1.5 text-navy hover:bg-surface"
            aria-label="Next month"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1.5 text-center text-[11px] font-semibold uppercase tracking-wide text-gray-500 mb-1.5">
        {WEEKDAYS.map((d) => (
          <div key={d} className="py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar cells */}
      <div className="grid grid-cols-7 gap-1.5">
        {Array.from({ length: firstDayOffset }).map((_, i) => (
          <div key={`empty-${i}`} className="h-11 sm:h-12" />
        ))}

        {Array.from({ length: daysInMonth }).map((_, idx) => {
          const dayNum = idx + 1;
          const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
            dayNum
          ).padStart(2, "0")}`;
          const dep = departureMap.get(dateStr);

          if (!dep) {
            return (
              <div
                key={dateStr}
                className="flex h-11 sm:h-12 items-center justify-center rounded-xl text-xs text-gray-300"
              >
                {dayNum}
              </div>
            );
          }

          const style = TIER_STYLES[dep.tier];
          const isSelected = selectedDate === dateStr;

          return (
            <button
              key={dateStr}
              type="button"
              onMouseEnter={() => {
                setHovered(dep);
                trackEvent("heatmap_date_hovered", {
                  package_slug: packageSlug,
                  date: dep.date,
                  demand_tier: dep.tier,
                });
              }}
              onFocus={() => setHovered(dep)}
              onClick={() => {
                setHovered(dep);
                trackEvent("heatmap_date_selected", {
                  package_slug: packageSlug,
                  date: dep.date,
                  demand_tier: dep.tier,
                });
                onSelectDate?.(dep);
              }}
              aria-label={`${dep.date} — ${dep.bookedCount} travelers booked, ${dep.tier}, ${dep.spotsLeft} spots left`}
              className={`relative flex h-11 sm:h-12 flex-col items-center justify-center rounded-xl border text-xs font-bold transition tabular-nums ${
                style.bg
              } ${style.border} ${style.text} ${
                isSelected ? "ring-2 ring-navy ring-offset-1" : ""
              }`}
            >
              <span>{dayNum}</span>
              <span className="text-[10px] font-medium opacity-80">
                {dep.bookedCount} bkd
              </span>
            </button>
          );
        })}
      </div>

      {/* Live Numeric Tooltip Bar */}
      <div className="mt-4 rounded-xl bg-surface px-3.5 py-2.5 text-xs text-navy flex flex-wrap items-center justify-between gap-2">
        {hovered ? (
          <span>
            <strong>{hovered.date}</strong> —{" "}
            <strong className="tabular-nums">{hovered.bookedCount} travelers booked</strong> •{" "}
            <span className="font-semibold text-teal-brand">{hovered.tier}</span> •{" "}
            <span className="tabular-nums">{hovered.spotsLeft} spots left</span>
          </span>
        ) : (
          <span className="text-gray-600">
            Hover or tap any shaded departure date to inspect anonymized booking demand.
          </span>
        )}
      </div>

      {/* Color-blind-safe Legend */}
      {!compact && (
        <div className="mt-4 flex flex-wrap gap-3 text-[11px] text-gray-600">
          {(Object.keys(TIER_STYLES) as HeatMapTier[]).map((tier) => (
            <span key={tier} className="inline-flex items-center gap-1.5">
              <span className={`h-2.5 w-2.5 rounded-full ${TIER_STYLES[tier].dot}`} />
              {TIER_STYLES[tier].label}
            </span>
          ))}
        </div>
      )}

      <p className="mt-3 flex items-center gap-1.5 text-[11px] text-gray-500">
        <ShieldCheck className="h-3.5 w-3.5 text-teal-brand shrink-0" />
        100% anonymized booking counts &amp; verified availability status. Zero traveler personal data exposed.
      </p>
    </div>
  );
}
