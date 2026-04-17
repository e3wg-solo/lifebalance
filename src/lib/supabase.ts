// Supabase client stub — ready for real credentials
// To activate: add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local

export const supabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
};

export const isSupabaseConfigured =
  !!supabaseConfig.url && !!supabaseConfig.anonKey;

// Placeholder type for future Supabase client
export type SupabaseClient = unknown;

// When ready, replace with:
// import { createClient } from "@supabase/supabase-js";
// export const supabase = createClient(supabaseConfig.url, supabaseConfig.anonKey);

export const supabase: SupabaseClient = null;
