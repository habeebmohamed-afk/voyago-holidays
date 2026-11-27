import React from "react";
import Link from "next/link";
import { Compass, MapPin, HeartHandshake, Sparkles, ArrowRight, Globe2 } from "lucide-react";

const DOMESTIC_JOURNEY = [
  "Rameshwaram",
  "Delhi",
  "Agra",
  "Jaipur",
  "Shimla",
  "Manali",
  "Atal Tunnel",
  "Srinagar",
  "Gulmarg",
  "Sonmarg",
  "Mussoorie",
  "Rishikesh",
  "Dehradun",
];

const INTL_JOURNEY = ["Dubai (UAE)", "Saudi Arabia", "Malaysia"];

export default function AboutPage() {
  return (
    <div className="pb-16">
      {/* Header Banner */}
      <section className="bg-navy text-white py-14 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-amber-warm">
            <Compass className="h-3.5 w-3.5" />
            About Voyago Holidays • Rameshwaram, Tamil Nadu
          </span>
          <h1 className="mt-4 font-heading text-3xl sm:text-4xl font-extrabold leading-tight">
            Every Rupee Should Buy the Best Moments of Your Life—Never Crowds or Guesswork.
          </h1>
          <p className="mt-4 max-w-3xl text-sm sm:text-base text-white/85 leading-relaxed">
            Voyago Holidays is a direct B2C and corporate B2B travel company built for travelers who
            want transparent demand, like-minded companions, and complete freedom from planning
            confusion.
          </p>
        </div>
      </section>

      {/* Founder's Column */}
      <section className="mx-auto max-w-5xl px-4 -mt-8 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-10 shadow-md grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Photo + Quick Bio Card */}
          <div className="lg:col-span-4 flex flex-col items-center text-center">
            <img
              src="/assets/Founder.jpg"
              alt="Habeeb Mohamed Easa Mohideen — Founder of Voyago Holidays"
              className="w-56 h-64 rounded-2xl object-cover object-top shadow-md border-4 border-surface"
            />
            <h2 className="mt-4 font-heading text-lg font-extrabold text-navy">
              Habeeb Mohamed Easa Mohideen
            </h2>
            <p className="text-xs font-semibold text-teal-brand">
              Founder, Voyago Holidays
            </p>
            <p className="mt-2 text-xs text-gray-600 leading-relaxed">
              MBA Graduate — Business Analytics integrated with AI • Self-Drive Explorer • Based in
              Rameshwaram, Tamil Nadu
            </p>
          </div>

          {/* Direct Founder-to-Traveler Letter */}
          <div className="lg:col-span-8 space-y-4 text-sm sm:text-base text-gray-700 leading-relaxed">
            <p className="text-xs font-bold uppercase tracking-wider text-coral">
              Founder&apos;s Note — Directly to You
            </p>
            <h3 className="font-heading text-2xl font-extrabold text-navy">
              Why I Started Voyago Holidays
            </h3>
            <p>
              Hi, I&apos;m <strong>Habeeb Mohamed Easa Mohideen</strong>. Alongside completing my
              MBA in Business Analytics integrated with AI, travel has been the greatest classroom
              of my life. Most of my journeys have been self-drive road trips—including driving all
              the way from my hometown of <strong>Rameshwaram to Delhi</strong>, and continuing
              through the mountains and heritage routes of <strong>Shimla, Manali, Atal Tunnel,
              Jammu &amp; Kashmir (Srinagar, Gulmarg, Sonmarg), Agra, Jaipur, Mussoorie, Rishikesh,
              and Dehradun</strong>, along with international travels across <strong>Dubai, Saudi
              Arabia, and Malaysia</strong>.
            </p>
            <p>
              Across all those kilometers—both solo and with conventional package operators—I kept
              running into the same two frustrations. Either a dream destination turned out to be
              unexpectedly overcrowded on the dates I booked, or I ended up grouped with fellow
              travelers whose pace and mindset didn&apos;t match mine at all.
            </p>
            <p>
              That&apos;s why I combined my analytics background with real on-road travel experience
              to build <strong>Voyago Holidays</strong>:
            </p>
            <ul className="space-y-2 pl-1 text-sm text-navy">
              <li className="flex items-start gap-2">
                <Sparkles className="h-4 w-4 text-coral mt-0.5 shrink-0" />
                <span>
                  <strong>Mindset Cohorts</strong> so you always travel with people who match your
                  vibe—whether Girls-only, Boys-only, Couples, Families, or Bachelors.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Sparkles className="h-4 w-4 text-teal-brand mt-0.5 shrink-0" />
                <span>
                  <strong>Our Live Booking Heat Map</strong> so you can see real, anonymized date-wise
                  demand before you pay—choosing buzzing group energy or quiet low-crowd dates on
                  your own terms.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Sparkles className="h-4 w-4 text-amber-warm mt-0.5 shrink-0" />
                <span>
                  <strong>Complete Clarity From Day One:</strong> Even if you arrive with a blank
                  slate—knowing only that you need a break, with no idea where to go or how to plan
                  it—our human Travel Desk will call you within 2 business hours and turn that
                  confusion into a seamless, tailor-made holiday.
                </span>
              </li>
            </ul>
            <p className="font-medium text-navy pt-2">
              My promise to you is simple: every single rupee you spend with Voyago Holidays should
              feel worth it—zero inconvenience, transparent pricing, and memories you&apos;ll talk
              about for years.
            </p>
          </div>
        </div>
      </section>

      {/* Road-Tested Miles Section */}
      <section className="mx-auto max-w-5xl px-4 mt-12 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 text-teal-brand font-bold text-xs uppercase tracking-wider">
            <MapPin className="h-4 w-4" />
            Domestic Self-Drive &amp; Road-Tested Routes
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {DOMESTIC_JOURNEY.map((place) => (
              <span
                key={place}
                className="rounded-full bg-surface border border-gray-200 px-3 py-1 text-xs font-semibold text-navy"
              >
                {place}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 text-coral font-bold text-xs uppercase tracking-wider">
            <Globe2 className="h-4 w-4" />
            International Travel Footprint
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {INTL_JOURNEY.map((place) => (
              <span
                key={place}
                className="rounded-full bg-coral-light border border-coral/20 px-3 py-1 text-xs font-semibold text-navy"
              >
                {place}
              </span>
            ))}
          </div>
          <p className="mt-4 text-xs text-gray-600 leading-relaxed">
            Every domestic and international package on Voyago Holidays is curated with realistic
            pacing, transparent GST/TCS invoicing, and zero middlemen.
          </p>
        </div>
      </section>

      {/* Our Promise CTA */}
      <section className="mx-auto max-w-5xl px-4 mt-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-teal-light border border-teal-brand/20 p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-brand uppercase">
              <HeartHandshake className="h-4 w-4" />
              Not Sure Where To Start?
            </div>
            <h3 className="mt-1 font-heading text-xl font-extrabold text-navy">
              Tell us your budget &amp; vibe—we&apos;ll solve the rest.
            </h3>
            <p className="mt-1 text-sm text-gray-700">
              Explore vetted packages with live demand counts, or book a free &lt; 2 hour callback
              with our human Travel Desk.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Link
              href="/packages"
              className="rounded-xl bg-navy px-5 py-2.5 text-sm font-bold text-white hover:bg-coral transition inline-flex items-center gap-1.5"
            >
              Explore Packages
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/customize"
              className="rounded-xl bg-white border border-navy/20 px-5 py-2.5 text-sm font-bold text-navy hover:bg-navy hover:text-white transition"
            >
              Customize a Trip
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
