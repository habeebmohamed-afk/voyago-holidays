"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, Download, UserCircle2, Shield } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const NAV_LINKS = [
  { href: "/packages", label: "Explore Packages" },
  { href: "/corporate", label: "Corporate & B2B" },
  { href: "/customize", label: "Customize a Trip" },
  { href: "/about", label: "About Us" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/help", label: "Help & FAQs" },
];

export function Navbar() {
  const { user, openAuthModal } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallPwa = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    setInstallPrompt(null);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <img
            src="/assets/Logo.png"
            alt="Voyago Holidays"
            className="h-9 sm:h-11 w-auto object-contain"
          />
        </Link>

        <nav className="hidden lg:flex items-center gap-6" aria-label="Main navigation">
          {NAV_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-navy/85 hover:text-coral transition"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-2.5">
          {installPrompt && (
            <button
              onClick={handleInstallPwa}
              className="inline-flex items-center gap-1.5 rounded-lg border border-teal-brand/30 bg-teal-light px-3 py-1.5 text-xs font-semibold text-teal-brand hover:bg-teal-brand hover:text-white transition"
            >
              <Download className="h-3.5 w-3.5" />
              Install Desktop App
            </button>
          )}

          <Link
            href="/admin"
            className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-gray-500 hover:bg-surface hover:text-navy"
            title="Internal Admin Panel"
          >
            <Shield className="h-3.5 w-3.5" />
            Admin
          </Link>

          {user ? (
            <Link
              href="/account"
              className="inline-flex items-center gap-2 rounded-xl bg-navy px-3.5 py-2 text-xs font-semibold text-white hover:bg-navy-light transition"
            >
              <UserCircle2 className="h-4 w-4" />
              <span className="max-w-[120px] truncate">{user.fullName}</span>
              <span className="rounded bg-teal-brand px-1.5 py-0.5 text-[10px]">
                {user.role}
              </span>
            </Link>
          ) : (
            <button
              onClick={() => openAuthModal({ mode: "login", defaultRole: "B2C" })}
              className="rounded-xl bg-coral px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-coral-hover transition"
            >
              Login / Sign Up
            </button>
          )}
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden rounded-lg p-2 text-navy hover:bg-surface"
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white px-4 pb-4 pt-2 space-y-2">
          {NAV_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm font-medium text-navy hover:bg-surface"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/admin"
            onClick={() => setMobileOpen(false)}
            className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-surface"
          >
            Internal Admin Panel
          </Link>
          <div className="pt-2 border-t border-gray-100 flex flex-col gap-2">
            {user ? (
              <Link
                href="/account"
                onClick={() => setMobileOpen(false)}
                className="w-full rounded-xl bg-navy px-4 py-2.5 text-center text-sm font-semibold text-white"
              >
                My Account ({user.role})
              </Link>
            ) : (
              <button
                onClick={() => {
                  setMobileOpen(false);
                  openAuthModal({ mode: "signup", defaultRole: "B2C" });
                }}
                className="w-full rounded-xl bg-coral px-4 py-2.5 text-sm font-bold text-white"
              >
                Login / Sign Up (B2C &amp; B2B)
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
