"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { enviarAprobada, enviarRechazada } from "@/lib/email/send";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";

export type AdminActionResult = { ok?: boolean; error?: string; dorsal?: number };

async function requireAdmin(supabase: SupabaseClient<Database>): Promise<boolean> {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return false;
  const { data: prof } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", auth.user.id)
    .single();
  return Boolean(prof?.is_admin);
}

export async function aprobarInscripcion(id: string): Promise<AdminActionResult> {
  const supabase = await createClient();
  if (!(await requireAdmin(supabase))) return { error: "No autorizado." };

  const { data: dorsal, error } = await supabase.rpc("verify_inscripcion", { p_id: id });
  if (error) return { error: "No pudimos aprobar la inscripción." };

  const { data: ins } = await supabase
    .from("inscripciones")
    .select("user_id, distance, shirt_size, category, event_id")
    .eq("id", id)
    .single();
  if (ins) {
    const [{ data: prof }, { data: ev }] = await Promise.all([
      supabase.from("profiles").select("email, first_name").eq("id", ins.user_id).single(),
      supabase.from("events").select("event_date").eq("id", ins.event_id).single(),
    ]);
    if (prof?.email) {
      await enviarAprobada(prof.email, {
        firstName: prof.first_name ?? "",
        dorsal: dorsal as number,
        distance: ins.distance,
        shirtSize: ins.shirt_size ?? "",
        category: ins.category ?? "",
        eventDate: ev?.event_date ?? null,
      });
    }
  }

  revalidatePath("/admin");
  return { ok: true, dorsal: dorsal as number };
}

export async function rechazarInscripcion(id: string, reason: string): Promise<AdminActionResult> {
  const supabase = await createClient();
  if (!(await requireAdmin(supabase))) return { error: "No autorizado." };

  const motivo = reason.trim() || null;

  const { data: ins } = await supabase
    .from("inscripciones")
    .select("user_id, amount, event_id")
    .eq("id", id)
    .single();

  const { error } = await supabase.rpc("reject_inscripcion", { p_id: id, p_reason: motivo ?? undefined });
  if (error) return { error: "No pudimos rechazar la inscripción." };

  if (ins) {
    const [{ data: prof }, { data: ev }] = await Promise.all([
      supabase.from("profiles").select("email, first_name").eq("id", ins.user_id).single(),
      supabase.from("events").select("sinpe_phone, sinpe_name").eq("id", ins.event_id).single(),
    ]);
    if (prof?.email) {
      await enviarRechazada(prof.email, {
        firstName: prof.first_name ?? "",
        motivo,
        amount: ins.amount ?? 0,
        sinpePhone: ev?.sinpe_phone ?? "",
        sinpeName: ev?.sinpe_name ?? "",
      });
    }
  }

  revalidatePath("/admin");
  return { ok: true };
}

export async function getComprobanteUrl(path: string): Promise<{ url?: string; error?: string }> {
  const supabase = await createClient();
  if (!(await requireAdmin(supabase))) return { error: "No autorizado." };

  const { data, error } = await supabase.storage.from("comprobantes").createSignedUrl(path, 60);
  if (error || !data) return { error: "No pudimos abrir el comprobante." };
  return { url: data.signedUrl };
}
