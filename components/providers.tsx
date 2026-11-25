"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { MotionConfig } from "framer-motion";
import { CheckCircle2, X } from "lucide-react";
import type { ApplicationStatus, Language, Profile } from "@/lib/types";
import { translations } from "@/lib/i18n";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

interface StoredData {
  profile: Profile | null;
  saved: string[];
  checked: string[];
  searches: string[];
  submitted: string[];
  applicationStatuses: Record<string, ApplicationStatus>;
  language: Language;
  dark: boolean;
}

const initial: StoredData = { profile: null, saved: [], checked: [], searches: [], submitted: [], applicationStatuses: {}, language: "en", dark: false };
interface AppContext extends StoredData {
  ready: boolean;
  setProfile: (profile: Profile) => void;
  toggleSave: (id: string) => void;
  toggleDocument: (document: string) => void;
  toggleSubmitted: (id: string) => void;
  setApplicationStatus: (id: string, status: ApplicationStatus) => void;
  addSearch: (query: string) => void;
  setLanguage: (language: Language) => void;
  toggleTheme: () => void;
  notify: (message: string) => void;
  reset: () => void;
  t: typeof translations.en;
  cloudEnabled: boolean;
  user: User | null;
  syncStatus: string;
  signIn: (email: string) => Promise<string | null>;
  signOut: () => Promise<void>;
  deleteCloud: () => Promise<void>;
}

const Context = createContext<AppContext | null>(null);
const toggle = (items: string[], item: string) => items.includes(item) ? items.filter(value => value !== item) : [...items, item];

function validProfile(value: unknown): value is Profile {
  if (!value || typeof value !== "object") return false;
  const profile = value as Record<string, unknown>;
  return typeof profile.name === "string" && typeof profile.age === "number" && profile.age >= 1 && profile.age <= 120 && typeof profile.income === "number" && profile.income >= 0
    && (profile.incomeMin === undefined || (typeof profile.incomeMin === "number" && profile.incomeMin >= 0))
    && (profile.incomeMax === undefined || profile.incomeMax === null || (typeof profile.incomeMax === "number" && profile.incomeMax >= 0))
    && ["gender", "state", "district", "profession", "education", "employment"].every(key => typeof profile[key] === "string")
    && ["student", "farmer", "senior", "disability"].every(key => typeof profile[key] === "boolean");
}

const APP_STATUSES = ["discovered","saved","eligibility_checking","preparing_documents","ready_to_apply","submitted","awaiting_response","received","rejected","requires_correction"];
function parseStored(raw: unknown): StoredData | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const strings = (value: unknown) => Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
  return {
    profile: validProfile(r.profile) ? r.profile : null, saved: strings(r.saved), checked: strings(r.checked), searches: strings(r.searches), submitted: strings(r.submitted),
    applicationStatuses: r.applicationStatuses && typeof r.applicationStatuses === "object" ? Object.fromEntries(Object.entries(r.applicationStatuses as Record<string, unknown>).filter((entry): entry is [string, ApplicationStatus] => typeof entry[0] === "string" && APP_STATUSES.includes(String(entry[1])))) : {},
    language: (["en", "hi", "te"] as string[]).includes(String(r.language)) ? (r.language as Language) : "en", dark: r.dark === true
  };
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<StoredData>(initial);
  const [ready, setReady] = useState(false);
  const [toast, setToast] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [syncStatus, setSyncStatus] = useState("");
  const cloudLoaded = useRef(false);

  useEffect(() => {
    try {
      const parsed = parseStored(JSON.parse(localStorage.getItem("smart-citizen-v1") || "null"));
      if (parsed) setData(parsed);
    } catch { setToast("Saved data could not be loaded. You can start a new profile."); }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem("smart-citizen-v1", JSON.stringify(data)); }
    catch { setToast("Browser storage is unavailable. Changes will last for this visit only."); }
    document.documentElement.dataset.theme = data.dark ? "dark" : "light";
    document.documentElement.lang = data.language;
  }, [data, ready]);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data: result }) => setUser(result.session?.user ?? null)).catch(() => undefined);
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => { if (!session) cloudLoaded.current = false; setUser(session?.user ?? null); });
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!supabase || !user || !ready || cloudLoaded.current) return;
    const client = supabase;
    (async () => {
      try {
        const { data: row, error } = await client.from("citizen_state").select("data").eq("user_id", user.id).maybeSingle();
        if (error) throw error;
        const cloud = row ? parseStored(row.data) : null;
        if (cloud && (cloud.profile || cloud.saved.length)) setData(cloud);
        cloudLoaded.current = true;
        setSyncStatus("Synced to your account");
      } catch { setSyncStatus("Cloud sync unavailable. Saved on this device."); }
    })();
  }, [user, ready]);

  useEffect(() => {
    if (!supabase || !user || !ready || !cloudLoaded.current) return;
    const client = supabase;
    const timer = setTimeout(async () => {
      try {
        const { error } = await client.from("citizen_state").upsert({ user_id: user.id, data, updated_at: new Date().toISOString() });
        if (error) throw error;
        setSyncStatus("Synced to your account");
      } catch { setSyncStatus("Cloud sync failed. Saved on this device."); }
    }, 800);
    return () => clearTimeout(timer);
  }, [data, user, ready]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 5000);
    return () => clearTimeout(timer);
  }, [toast]);

  const value: AppContext = {
    ...data, ready, t: translations[data.language], notify: setToast,
    setProfile: profile => setData(previous => ({ ...previous, profile })),
    toggleSave: id => setData(previous => { const saved = toggle(previous.saved, id); return { ...previous, saved, applicationStatuses: { ...previous.applicationStatuses, [id]: saved.includes(id) ? "saved" : (previous.applicationStatuses[id] === "saved" ? "discovered" : previous.applicationStatuses[id] || "discovered") } }; }),
    toggleDocument: document => setData(previous => ({ ...previous, checked: toggle(previous.checked, document) })),
    toggleSubmitted: id => setData(previous => { const submitted = toggle(previous.submitted, id); return { ...previous, submitted, applicationStatuses: { ...previous.applicationStatuses, [id]: submitted.includes(id) ? "submitted" : "preparing_documents" } }; }),
    setApplicationStatus: (id, status) => setData(previous => ({ ...previous, applicationStatuses: { ...previous.applicationStatuses, [id]: status }, submitted: status === "submitted" ? [...new Set([...previous.submitted, id])] : previous.submitted.filter(value => value !== id) })),
    addSearch: query => { if (query.trim()) setData(previous => ({ ...previous, searches: [query.trim(), ...previous.searches.filter(value => value !== query.trim())].slice(0, 5) })); },
    setLanguage: language => setData(previous => ({ ...previous, language })),
    toggleTheme: () => setData(previous => ({ ...previous, dark: !previous.dark })),
    cloudEnabled: !!supabase, user, syncStatus,
    signIn: async (email: string) => {
      if (!supabase) return "Supabase is not configured.";
      const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: window.location.origin + "/dashboard" } });
      return error ? error.message : null;
    },
    signOut: async () => { if (supabase) await supabase.auth.signOut(); cloudLoaded.current = false; setUser(null); },
    deleteCloud: async () => { if (supabase && user) { const { error } = await supabase.from("citizen_state").delete().eq("user_id", user.id); setToast(error ? "Could not delete cloud data." : "Your cloud copy has been deleted."); } },
    reset: () => { setData(initial); setToast("Your profile and saved activity have been removed from this browser."); }
  };

  return <MotionConfig reducedMotion="user"><Context.Provider value={value}><a className="skip-link" href="#main">Skip to content</a>{children}{toast && <div role="status" className="toast"><CheckCircle2 size={20} /><span>{toast}</span><button aria-label="Dismiss notification" onClick={() => setToast("")}><X size={18} /></button></div>}</Context.Provider></MotionConfig>;
}

export function useCitizen() {
  const context = useContext(Context);
  if (!context) throw new Error("useCitizen must be used within Providers");
  return context;
}