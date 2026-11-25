/**
 * Public Supabase settings (safe to expose: the anon key is protected by Row Level Security).
 *
 * Option A (local dev): put them in .env.local as NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY.
 * Option B (Embarko deploy): .env files are NOT uploaded, so paste the two values below.
 * NEVER put the service_role key here.
 */
export const SUPABASE_URL: string = process.env.NEXT_PUBLIC_SUPABASE_URL || "";       // or paste: "https://xxxx.supabase.co"
export const SUPABASE_ANON_KEY: string = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""; // or paste: "eyJ..."
