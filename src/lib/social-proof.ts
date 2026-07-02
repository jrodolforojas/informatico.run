import { createClient } from "@supabase/supabase-js";
import { unstable_cache } from "next/cache";
import type { Database } from "@/lib/database.types";

export type SocialProof = {
  registered: number;
  capacity: number | null;
  eventDate: string | null;
};

export const getSocialProof = unstable_cache(
  async (): Promise<SocialProof | null> => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    if (!url || !key) return null;

    try {
      const supabase = createClient<Database>(url, key, { auth: { persistSession: false } });
      const { data, error } = await supabase.rpc("event_social_proof");
      if (error || !data || data.length === 0) return null;
      const row = data[0];
      return {
        registered: row.registered,
        capacity: row.capacity ?? null,
        eventDate: row.event_date ?? null,
      };
    } catch {
      return null;
    }
  },
  ["social-proof"],
  { revalidate: 60, tags: ["social-proof"] },
);
