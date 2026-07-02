import { createClient } from "@/lib/supabase/client";

function callbackUrl(next: string) {
  return `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;
}

export async function signInWithGoogle(next = "/") {
  const supabase = createClient();
  return supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: callbackUrl(next) },
  });
}

export async function signInWithEmail(email: string, next = "/") {
  const supabase = createClient();
  return supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: callbackUrl(next) },
  });
}

export function connectStravaUrl(next: string) {
  return `/api/strava/connect?next=${encodeURIComponent(next)}`;
}

export async function signOut() {
  const supabase = createClient();
  return supabase.auth.signOut();
}
