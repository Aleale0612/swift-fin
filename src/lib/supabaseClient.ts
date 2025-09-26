import { createClient } from "@supabase/supabase-js";

// Ambil env variable
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

// Validasi env biar nggak silent error
if (!supabaseUrl) {
  throw new Error("Missing env: VITE_SUPABASE_URL");
}
if (!supabaseAnonKey) {
  throw new Error("Missing env: VITE_SUPABASE_PUBLISHABLE_KEY");
}

// Create supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
