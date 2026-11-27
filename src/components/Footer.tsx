import React from "react";
import Link from "next/link";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { CONTACT_INFO } from "@/lib/feature-flags";

export function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: Brand */}
          <div className="space-y-4">
            <div className="inline-block rounded-xl bg-white p-2">
              <img
                src="/assets/Logo.png"
                alt="Voyago Holidays Logo"
                className="h-10 w-auto object-contain"
              />
            </div>
            <p className="text-sm text-white/80 leading-relaxed">
              Travel with your tribe. See real booking demand before you book.
            </p>
            <div className="space-y-2 text-xs text-white/80">
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-coral shrink-0" />
                {CONTACT_INFO.city}
              </p>
              <a
                href={`tel:${CONTACT_INFO.tollFree}`}
                className="flex items-center gap-2 hover:text-coral transition"
              >
                <Phone className="h-4 w-4 text-coral shrink-0" />
                Toll-Free: {CONTACT_INFO.tollFree}
              </a>
              <a
                href={`mailto:${CONTACT_INFO.supportEmail}`}
                className="flex items-center gap-2 hover:text-coral transition"
              >
                <Mail className="h-4 w-4 text-coral shrink-0" />
                {CONTACT_INFO.supportEmail}
              </a>
              <a
                href={CONTACT_INFO.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-teal-brand px-3 py-1.5 text-xs font-semibold text-white hover:bg-teal-brand/90 transition mt-1"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                WhatsApp Travel Desk (Human Support)
              </a>
            </div>
          </div>

          {/* Column 2: Explore */}
          <div>
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-amber-warm">
              Explore
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-white/80">
              <li>
                <Link href="/packages?scope=Domestic" className="hover:text-white">
                  Domestic Packages
                </Link>
              </li>
              <li>
                <Link href="/packages?scope=International" className="hover:text-white">
                  International Packages
                </Link>
              </li>
              <li>
                <Link href="/packages?cohort=Girls-only" className="hover:text-white">
                  Girls-Only Trips
                </Link>
              </li>
              <li>
                <Link href="/packages?cohort=Couple-friendly" className="hover:text-white">
                  Couple Getaways
                </Link>
              </li>
              <li>
                <Link href="/packages?cohort=Family-friendly" className="hover:text-white">
                  Family Holidays
                </Link>
              </li>
              <li>
                <Link href="/corporate" className="hover:text-white">
                  Corporate Offsites (B2B)
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Company & Support */}
          <div>
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-amber-warm">
              Company &amp; Support
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-white/80">
              <li>
                <Link href="/about" className="hover:text-white">
                  About Us &amp; Founder&apos;s Note
                </Link>
              </li>
              <li>
                <Link href="/customize" className="hover:text-white">
                  Customize a Package (&lt; 2 Hr Callback)
                </Link>
              </li>
              <li>
                <Link href="/help" className="hover:text-white">
                  Help Center &amp; FAQs
                </Link>
              </li>
              <li>
                <Link href="/help#support-ticket" className="hover:text-white">
                  Raise a Support Ticket
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-white">
                  Customer &amp; B2B Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal & Compliance */}
          <div>
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-amber-warm">
              Legal &amp; Compliance
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-white/80">
              <li>
                <Link href="/legal/terms" className="hover:text-white">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/legal/privacy" className="hover:text-white">
                  Privacy Policy (India DPDP Act)
                </Link>
              </li>
              <li>
                <Link href="/legal/cancellation" className="hover:text-white">
                  Cancellation &amp; Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/legal/visa-disclaimer" className="hover:text-white">
                  International Visa &amp; Insurance Disclaimer
                </Link>
              </li>
              <li>
                <Link href="/legal/code-of-conduct" className="hover:text-white">
                  Traveler Code of Conduct
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/15 pt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-xs text-white/70">
          <p>&copy; 2027 Voyago Holidays. All rights reserved. Headquartered in {CONTACT_INFO.city}.</p>
          <p className="font-semibold text-amber-warm">
            {CONTACT_INFO.educationalNotice}
          </p>
        </div>
      </div>
    </footer>
  );
}
