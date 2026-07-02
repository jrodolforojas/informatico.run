import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { exchangeCodeForToken } from "@/lib/strava";
import type { Json } from "@/lib/database.types";

function fail(origin: string, reason: string) {
  return NextResponse.redirect(`${origin}/auth/error?reason=${encodeURIComponent(reason)}`);
}

export async function GET(request: NextRequest) {
  const { origin, searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const scope = searchParams.get("scope");
  const error = searchParams.get("error");
  const state = searchParams.get("state");

  const cookieState = request.cookies.get("strava_oauth_state")?.value;
  const next = request.cookies.get("strava_oauth_next")?.value ?? "/inscripcion";

  if (error) return fail(origin, `strava ${error}`);
  if (!code) return fail(origin, "strava missing code");
  if (!state || state !== cookieState) return fail(origin, "strava bad state");

  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return fail(origin, "not authenticated");

  let token;
  try {
    token = await exchangeCodeForToken(code);
  } catch {
    return fail(origin, "strava token exchange failed");
  }

  const { error: upsertError } = await supabase.from("strava_credentials").upsert({
    user_id: data.user.id,
    athlete_id: token.athlete.id,
    access_token: token.access_token,
    refresh_token: token.refresh_token,
    expires_at: new Date(token.expires_at * 1000).toISOString(),
    scope,
    athlete: token.athlete as unknown as Json,
    updated_at: new Date().toISOString(),
  });

  if (upsertError) return fail(origin, "could not save strava credentials");

  const response = NextResponse.redirect(`${origin}${next}`);
  response.cookies.delete("strava_oauth_state");
  response.cookies.delete("strava_oauth_next");
  return response;
}
