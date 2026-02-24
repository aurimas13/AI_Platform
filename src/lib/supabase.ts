import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isConfigured = Boolean(supabaseUrl && supabaseAnonKey);

const noopResult = Promise.resolve({ data: null, error: null });

const chainProxy: ProxyHandler<object> = {
  get: (_target, prop) => {
    if (prop === 'then') return undefined;
    return (..._args: unknown[]) => new Proxy(noopResult, chainProxy);
  },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const supabase = (isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : new Proxy({}, chainProxy)) as SupabaseClient;

export { isConfigured as supabaseConfigured };
