const AUTHORIZE_URL = "https://www.strava.com/oauth/authorize";
const TOKEN_URL = "https://www.strava.com/oauth/token";

export const STRAVA_SCOPE = "read,activity:read_all";

export function buildAuthorizeUrl(redirectUri: string, state: string) {
  const params = new URLSearchParams({
    client_id: process.env.STRAVA_CLIENT_ID!,
    redirect_uri: redirectUri,
    response_type: "code",
    approval_prompt: "auto",
    scope: STRAVA_SCOPE,
    state,
  });
  return `${AUTHORIZE_URL}?${params}`;
}

type StravaTokenResponse = {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  athlete: { id: number; [k: string]: unknown };
};

export async function exchangeCodeForToken(code: string) {
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      code,
      grant_type: "authorization_code",
    }),
  });

  if (!res.ok) {
    throw new Error(`strava token exchange failed: ${res.status} ${await res.text()}`);
  }

  return (await res.json()) as StravaTokenResponse;
}

export async function getAthleteActivities(
  accessToken: string,
  params: { per_page?: number; page?: number; after?: number; before?: number } = {},
) {
  const query = new URLSearchParams(
    Object.entries(params).map(([k, v]) => [k, String(v)]),
  );
  const res = await fetch(`https://www.strava.com/api/v3/athlete/activities?${query}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    throw new Error(`strava activities failed: ${res.status} ${await res.text()}`);
  }

  return (await res.json()) as Array<Record<string, unknown>>;
}

export async function refreshAccessToken(refreshToken: string) {
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  if (!res.ok) {
    throw new Error(`strava token refresh failed: ${res.status} ${await res.text()}`);
  }

  return (await res.json()) as Omit<StravaTokenResponse, "athlete">;
}
