import type { SupabaseClient } from "@supabase/supabase-js";
import { refreshAccessToken } from "@/lib/strava";

const EXPIRY_SKEW_MS = 60_000;

export async function getValidStravaToken(
  supabase: SupabaseClient,
  userId: string,
): Promise<string | null> {
  const { data: cred } = await supabase
    .from("strava_credentials")
    .select("access_token, refresh_token, expires_at")
    .eq("user_id", userId)
    .single();

  if (!cred) return null;

  const stillValid =
    new Date(cred.expires_at).getTime() > Date.now() + EXPIRY_SKEW_MS;
  if (stillValid) return cred.access_token;

  const refreshed = await refreshAccessToken(cred.refresh_token);

  await supabase
    .from("strava_credentials")
    .update({
      access_token: refreshed.access_token,
      refresh_token: refreshed.refresh_token,
      expires_at: new Date(refreshed.expires_at * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId);

  return refreshed.access_token;
}
