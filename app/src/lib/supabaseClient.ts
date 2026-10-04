import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'demo-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function signInWithGoogle() {
  const isLocalSupabase = supabaseUrl.includes('127.0.0.1') || supabaseUrl.includes('localhost');
  const isRemoteHost = typeof window !== 'undefined' && !window.location.hostname.includes('localhost') && !window.location.hostname.includes('127.0.0.1');

  // If live on production (e.g. Vercel) and Supabase points to local 127.0.0.1, 
  // prevent redirecting user browser to unreachable local 127.0.0.1:54321
  if (isLocalSupabase && isRemoteHost) {
    return {
      data: { provider: 'google', url: null, isDemoRedirect: true },
      error: null,
    };
  }

  const redirectToUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/login`
    : 'https://ednova-lake.vercel.app/login';

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectToUrl,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  return { data, error };
}
