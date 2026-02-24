import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : (new Proxy({} as SupabaseClient, {
      get: () => () => ({
        upsert: () => Promise.resolve({ data: null, error: null }),
        update: () => ({
          eq: () => Promise.resolve({ data: null, error: null }),
        }),
        select: () => ({
          eq: () => ({
            maybeSingle: () => Promise.resolve({ data: null, error: null }),
          }),
        }),
      }),
    }));

export { isConfigured as supabaseConfigured };
