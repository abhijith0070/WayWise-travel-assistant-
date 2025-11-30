import { createClient } from '@supabase/supabase-js';

// Client-side Supabase client (for browser usage)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true, // Persist session in localStorage
    autoRefreshToken: true, // Auto refresh token before expiry
    detectSessionInUrl: true, // Detect auth redirects
  },
});
