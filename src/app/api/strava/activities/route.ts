import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getValidStravaToken } from "@/lib/strava-credentials";
import { getAthleteActivities } from "@/lib/strava";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const perPage = Number(searchParams.get("per_page") ?? 30);

  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) {
    return NextResponse.json({ error: "not authenticated" }, { status: 401 });
  }

  const token = await getValidStravaToken(supabase, data.user.id);
  if (!token) {
    return NextResponse.json({ error: "strava not connected" }, { status: 400 });
  }

  try {
    const activities = await getAthleteActivities(token, { per_page: perPage });
    return NextResponse.json(activities);
  } catch {
    return NextResponse.json({ error: "could not fetch activities" }, { status: 502 });
  }
}
