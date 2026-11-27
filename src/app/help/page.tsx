"use client";

import React, { useState } from "react";
import { Search, ChevronDown, ChevronUp, Phone, MessageCircle, Mail, CheckCircle2 } from "lucide-react";
import { SEED_FAQS } from "@/lib/seed-data";
import { CONTACT_INFO } from "@/lib/feature-flags";

export default function HelpPage() {
  const [query, setQuery] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [ticketName, setTicketName] = useState("");
  const [ticketEmail, setTicketEmail] = useState("");
  const [ticketMsg, setTicketMsg] = useState("");
  const [ticketRef, setTicketRef] = useState<string | null>(null);

  const filteredFaqs = SEED_FAQS.filter(
    (item) =>
      item.q.toLowerCase().includes(query.toLowerCase()) ||
      item.a.toLowerCase().includes(query.toLowerCase())
  );

  const handleTicket = (e: React.FormEvent) => {
    e.preventDefault();
    setTicketRef(`VH-TKT-${Math.floor(10000 + Math.random() * 89999)}`);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl mx-auto">
        <p className="text-xs font-bold uppercase tracking-wider text-teal-brand">
          100% Human Travel Support • Zero AI Chatbots
        </p>
        <h1 className="mt-2 font-heading text-3xl font-extrabold text-navy">
          Help Center &amp; Frequently Asked Questions
        </h1>
        <div className="relative mt-5">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Heat Map, Girls-only ID check, PAN/TCS, NEFT..."
            className="w-full rounded-xl border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-teal-brand focus:outline-none"
          />
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="mt-8 space-y-3">
        {filteredFaqs.map((item, idx) => {
          const open = openIndex === idx;
          return (
            <div
              key={item.q}
              className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(open ? null : idx)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <span className="font-heading text-sm sm:text-base font-bold text-navy">
                  {item.q}
                </span>
                {open ? (
                  <ChevronUp className="h-4 w-4 text-teal-brand shrink-0" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-400 shrink-0" />
                )}
              </button>
              {open && (
                <div className="border-t border-gray-100 px-5 py-4 text-sm text-gray-700 leading-relaxed">
                  {item.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Direct Human Support Channels + Ticket Desk */}
      <div
        id="support-ticket"
        className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
      >
        <div className="lg:col-span-5 rounded-2xl bg-navy p-6 text-white space-y-4">
          <h2 className="font-heading text-lg font-bold">Direct Human Travel Desk</h2>
          <p className="text-xs text-white/80 leading-relaxed">
            Speak directly with our team in {CONTACT_INFO.city}. Working hours:{" "}
            {CONTACT_INFO.workingHours}.
          </p>
          <div className="space-y-3 text-sm">
            <a
              href={`tel:${CONTACT_INFO.tollFree}`}
              className="flex items-center gap-3 rounded-xl bg-white/10 p-3 hover:bg-white/20 transition"
            >
              <Phone className="h-4 w-4 text-amber-warm" />
              <div>
                <p className="text-xs text-white/70">Toll-Free Phone Support</p>
                <p className="font-bold">{CONTACT_INFO.tollFree}</p>
              </div>
            </a>
            <a
              href={CONTACT_INFO.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl bg-teal-brand p-3 hover:bg-teal-brand/90 transition"
            >
              <MessageCircle className="h-4 w-4 text-white" />
              <div>
                <p className="text-xs text-white/80">WhatsApp Support</p>
                <p className="font-bold">{CONTACT_INFO.whatsappDisplay}</p>
              </div>
            </a>
            <a
              href={`mailto:${CONTACT_INFO.supportEmail}`}
              className="flex items-center gap-3 rounded-xl bg-white/10 p-3 hover:bg-white/20 transition"
            >
              <Mail className="h-4 w-4 text-coral" />
              <div>
                <p className="text-xs text-white/70">Support Email</p>
                <p className="font-bold break-all">{CONTACT_INFO.supportEmail}</p>
              </div>
            </a>
          </div>
        </div>

        <div className="lg:col-span-7 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="font-heading text-lg font-bold text-navy">Raise a Help Desk Ticket</h2>
          {ticketRef ? (
            <div className="mt-4 rounded-xl bg-teal-light p-4 text-sm text-navy flex items-start gap-2.5">
              <CheckCircle2 className="h-5 w-5 text-teal-brand shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Ticket #{ticketRef} logged!</p>
                <p className="text-xs text-gray-700 mt-1">
                  Our Travel Desk will reply to <strong>{ticketEmail}</strong> within 2 business
                  hours.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleTicket} className="mt-4 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  value={ticketName}
                  onChange={(e) => setTicketName(e.target.value)}
                  placeholder="Your Full Name *"
                  className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm"
                />
                <input
                  type="email"
                  required
                  value={ticketEmail}
                  onChange={(e) => setTicketEmail(e.target.value)}
                  placeholder="Email Address *"
                  className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm"
                />
              </div>
              <textarea
                rows={4}
                required
                value={ticketMsg}
                onChange={(e) => setTicketMsg(e.target.value)}
                placeholder="Describe your booking reference, invoice query, or trip question..."
                className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm"
              />
              <button
                type="submit"
                className="rounded-xl bg-coral px-5 py-2.5 text-sm font-bold text-white hover:bg-coral-hover transition"
              >
                Submit Support Ticket
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
