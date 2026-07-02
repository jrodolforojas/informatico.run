import { Resend } from "resend";

let client: Resend | null = null;

export function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  if (!client) client = new Resend(key);
  return client;
}

export const FROM = process.env.RESEND_FROM ?? "informático.run <onboarding@resend.dev>";
