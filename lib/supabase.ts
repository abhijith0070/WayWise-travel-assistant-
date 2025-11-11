import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client (for API routes and server components)
export const createServerSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false, // Don't persist session on server
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
};
