import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { buildAuthorizeUrl } from "@/lib/strava";

export async function GET(request: NextRequest) {
  const { origin, searchParams } = new URL(request.url);
  const next = searchParams.get("next") ?? "/inscripcion";

  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    return NextResponse.redirect(
      `${origin}/conectar?next=${encodeURIComponent(`/api/strava/connect?next=${next}`)}`,
    );
  }

  const state = crypto.randomUUID();
  const redirectUri = `${origin}/api/strava/callback`;

  const response = NextResponse.redirect(buildAuthorizeUrl(redirectUri, state));
  response.cookies.set("strava_oauth_state", state, {
    httpOnly: true,
    sameSite: "lax",
    secure: origin.startsWith("https"),
    maxAge: 600,
    path: "/",
  });
  response.cookies.set("strava_oauth_next", next, {
    httpOnly: true,
    sameSite: "lax",
    secure: origin.startsWith("https"),
    maxAge: 600,
    path: "/",
  });
  return response;
}
