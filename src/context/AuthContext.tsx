"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { BookingRecord, UserProfile, UserRole } from "@/types";
import { createSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { trackEvent } from "@/lib/analytics";

interface AuthModalState {
  open: boolean;
  mode: "login" | "signup";
  defaultRole: "B2C" | "B2B";
  reason?: string;
}

interface RegisterInput {
  role: "B2C" | "B2B";
  fullName: string;
  email: string;
  phone: string;
  password: string;
  companyName?: string;
  gstin?: string;
}

interface AuthContextValue {
  user: UserProfile | null;
  loading: boolean;
  isLiveSupabase: boolean;
  savedSlugs: string[];
  bookings: BookingRecord[];
  authModal: AuthModalState;
  openAuthModal: (opts?: Partial<Omit<AuthModalState, "open">>) => void;
  closeAuthModal: () => void;
  login: (email: string, password: string, roleHint?: "B2C" | "B2B") => Promise<{ error?: string }>;
  register: (input: RegisterInput) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  toggleSavedTrip: (slug: string) => void;
  addBooking: (booking: BookingRecord) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const LOCAL_USER_KEY = "voyago_sandbox_user_v1";
const LOCAL_SAVED_KEY = "voyago_saved_trips_v1";
const LOCAL_BOOKINGS_KEY = "voyago_bookings_v1";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [savedSlugs, setSavedSlugs] = useState<string[]>([]);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [authModal, setAuthModal] = useState<AuthModalState>({
    open: false,
    mode: "signup",
    defaultRole: "B2C",
  });

  const isLiveSupabase = isSupabaseConfigured();

  useEffect(() => {
    // Load local state first for instant hydration
    try {
      const storedSaved = localStorage.getItem(LOCAL_SAVED_KEY);
      if (storedSaved) setSavedSlugs(JSON.parse(storedSaved));
      const storedBookings = localStorage.getItem(LOCAL_BOOKINGS_KEY);
      if (storedBookings) setBookings(JSON.parse(storedBookings));
    } catch {
      // ignore storage errors
    }

    const init = async () => {
      const supabase = createSupabaseBrowserClient();
      if (supabase) {
        const { data } = await supabase.auth.getUser();
        if (data.user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", data.user.id)
            .single();
          if (profile) {
            setUser({
              id: profile.id,
              role: profile.role as UserRole,
              fullName: profile.full_name,
              email: profile.email,
              phone: profile.phone,
              companyName: profile.company_name ?? undefined,
              gstin: profile.gstin ?? undefined,
              kycStatus: profile.kyc_status,
              createdAt: profile.created_at,
            });
          } else {
            const meta = data.user.user_metadata || {};
            setUser({
              id: data.user.id,
              role: (meta.role as UserRole) || "B2C",
              fullName: meta.full_name || data.user.email?.split("@")[0] || "Traveler",
              email: data.user.email || "",
              phone: meta.phone || "",
              companyName: meta.company_name,
              gstin: meta.gstin,
              kycStatus: meta.role === "B2B" ? "PENDING" : "NOT_REQUIRED",
              createdAt: data.user.created_at,
            });
          }
        }
      } else {
        try {
          const storedUser = localStorage.getItem(LOCAL_USER_KEY);
          if (storedUser) setUser(JSON.parse(storedUser));
        } catch {
          // ignore
        }
      }
      setLoading(false);
    };

    init();
  }, []);

  const openAuthModal = useCallback(
    (opts?: Partial<Omit<AuthModalState, "open">>) => {
      setAuthModal({
        open: true,
        mode: opts?.mode ?? "signup",
        defaultRole: opts?.defaultRole ?? "B2C",
        reason: opts?.reason,
      });
    },
    []
  );

  const closeAuthModal = useCallback(() => {
    setAuthModal((prev) => ({ ...prev, open: false }));
  }, []);

  const register = useCallback(
    async (input: RegisterInput): Promise<{ error?: string }> => {
      const supabase = createSupabaseBrowserClient();
      if (supabase) {
        const { data, error } = await supabase.auth.signUp({
          email: input.email,
          password: input.password,
          options: {
            data: {
              role: input.role,
              full_name: input.fullName,
              phone: input.phone,
              company_name: input.companyName || null,
              gstin: input.gstin || null,
            },
          },
        });
        if (error) return { error: error.message };
        if (data.user) {
          const newProfile: UserProfile = {
            id: data.user.id,
            role: input.role,
            fullName: input.fullName,
            email: input.email,
            phone: input.phone,
            companyName: input.companyName,
            gstin: input.gstin,
            kycStatus: input.role === "B2B" ? "PENDING" : "NOT_REQUIRED",
            createdAt: new Date().toISOString(),
          };
          setUser(newProfile);
          trackEvent("role_login_completed", { role: input.role, mode: "signup" });
          closeAuthModal();
        }
        return {};
      }

      // Sandbox fallback when Supabase env vars are not yet configured
      const sandboxProfile: UserProfile = {
        id: `sandbox-${Date.now()}`,
        role: input.role,
        fullName: input.fullName,
        email: input.email,
        phone: input.phone,
        companyName: input.companyName,
        gstin: input.gstin,
        kycStatus: input.role === "B2B" ? "PENDING" : "NOT_REQUIRED",
        createdAt: new Date().toISOString(),
      };
      setUser(sandboxProfile);
      try {
        localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(sandboxProfile));
      } catch {
        // ignore
      }
      trackEvent("role_login_completed", { role: input.role, mode: "signup" });
      closeAuthModal();
      return {};
    },
    [closeAuthModal]
  );

  const login = useCallback(
    async (
      email: string,
      password: string,
      roleHint: "B2C" | "B2B" = "B2C"
    ): Promise<{ error?: string }> => {
      const supabase = createSupabaseBrowserClient();
      if (supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) return { error: error.message };
        if (data.user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", data.user.id)
            .single();
          const role = (profile?.role as UserRole) || roleHint;
          setUser({
            id: data.user.id,
            role,
            fullName: profile?.full_name || data.user.email?.split("@")[0] || "Traveler",
            email: data.user.email || email,
            phone: profile?.phone || "",
            companyName: profile?.company_name ?? undefined,
            gstin: profile?.gstin ?? undefined,
            kycStatus: profile?.kyc_status ?? "NOT_REQUIRED",
            createdAt: profile?.created_at || new Date().toISOString(),
          });
          trackEvent("role_login_completed", { role, mode: "login" });
          closeAuthModal();
        }
        return {};
      }

      // Sandbox fallback login
      const sandboxProfile: UserProfile = {
        id: `sandbox-${Date.now()}`,
        role: roleHint,
        fullName: email.split("@")[0].replace(/[._-]/g, " "),
        email,
        phone: "+91 98765 00000",
        companyName: roleHint === "B2B" ? "Demo Corporate Org" : undefined,
        gstin: roleHint === "B2B" ? "33AABCV1234F1Z5" : undefined,
        kycStatus: roleHint === "B2B" ? "VERIFIED" : "NOT_REQUIRED",
        createdAt: new Date().toISOString(),
      };
      setUser(sandboxProfile);
      try {
        localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(sandboxProfile));
      } catch {
        // ignore
      }
      trackEvent("role_login_completed", { role: roleHint, mode: "login" });
      closeAuthModal();
      return {};
    },
    [closeAuthModal]
  );

  const logout = useCallback(async () => {
    const supabase = createSupabaseBrowserClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    try {
      localStorage.removeItem(LOCAL_USER_KEY);
    } catch {
      // ignore
    }
  }, []);

  const deleteAccount = useCallback(async () => {
    await fetch("/api/v1/account", { method: "DELETE" }).catch(() => {});
    await logout();
    setSavedSlugs([]);
    setBookings([]);
    try {
      localStorage.removeItem(LOCAL_SAVED_KEY);
      localStorage.removeItem(LOCAL_BOOKINGS_KEY);
    } catch {
      // ignore
    }
  }, [logout]);

  const toggleSavedTrip = useCallback(
    (slug: string) => {
      if (!user) {
        openAuthModal({
          mode: "signup",
          reason: "Create a free Voyago account to save trips and access them across devices.",
        });
        return;
      }
      setSavedSlugs((prev) => {
        const next = prev.includes(slug)
          ? prev.filter((s) => s !== slug)
          : [...prev, slug];
        try {
          localStorage.setItem(LOCAL_SAVED_KEY, JSON.stringify(next));
        } catch {
          // ignore
        }
        return next;
      });
    },
    [user, openAuthModal]
  );

  const addBooking = useCallback((booking: BookingRecord) => {
    setBookings((prev) => {
      const next = [booking, ...prev];
      try {
        localStorage.setItem(LOCAL_BOOKINGS_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isLiveSupabase,
        savedSlugs,
        bookings,
        authModal,
        openAuthModal,
        closeAuthModal,
        login,
        register,
        logout,
        deleteAccount,
        toggleSavedTrip,
        addBooking,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
