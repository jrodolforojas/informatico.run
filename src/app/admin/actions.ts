"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { enviarAprobada, enviarRechazada } from "@/lib/email/send";
import { issueFinisherCredential, issueInscripcionCredential } from "@/lib/acta/issue";
import { isActaConfigured } from "@/lib/acta/env";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";

export type AdminActionResult = {
  ok?: boolean;
  error?: string;
  dorsal?: number;
  /** Aviso no bloqueante: la inscripción se aprobó pero la constancia falló. */
  credentialWarning?: string;
};

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

  let credentialWarning: string | undefined;

  if (ins) {
    const [{ data: prof }, { data: ev }] = await Promise.all([
      supabase
        .from("profiles")
        .select("email, first_name, full_name")
        .eq("id", ins.user_id)
        .single(),
      supabase
        .from("events")
        .select("event_date, name, edition")
        .eq("id", ins.event_id)
        .single(),
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

    // La constancia de inscripción se ancla en Stellar. Va después del correo
    // y con su propio try: emitir cuesta tarifa on-chain y puede fallar por
    // saldo o red, y eso no debe deshacer una aprobación ya confirmada.
    credentialWarning = await emitirConstanciaInscripcion({
      userId: ins.user_id,
      eventId: ins.event_id,
      inscripcionId: id,
      nombre: prof?.full_name ?? prof?.first_name ?? "",
      dorsal: dorsal as number,
      distancia: ins.distance,
      categoria: ins.category,
      edicion: ev?.edition ?? null,
      eventoNombre: ev?.name ?? "informático.run()",
      fechaEvento: ev?.event_date ?? null,
    });
  }

  revalidatePath("/admin");
  revalidatePath("/mi-constancia");
  return { ok: true, dorsal: dorsal as number, credentialWarning };
}

/**
 * Emite la constancia de inscripción. Devuelve un aviso legible si falla,
 * `undefined` si salió bien o si ACTA no está configurado en este entorno.
 */
async function emitirConstanciaInscripcion(args: {
  userId: string;
  eventId: string;
  inscripcionId: string;
  nombre: string;
  dorsal: number;
  distancia: string;
  categoria: string | null;
  edicion: number | null;
  eventoNombre: string;
  fechaEvento: string | null;
}): Promise<string | undefined> {
  if (!isActaConfigured()) return undefined;

  try {
    const result = await issueInscripcionCredential({
      userId: args.userId,
      eventId: args.eventId,
      inscripcionId: args.inscripcionId,
      claims: {
        userId: args.userId,
        nombre: args.nombre,
        dorsal: args.dorsal,
        distancia: args.distancia,
        categoria: args.categoria,
        edicion: args.edicion,
        eventoNombre: args.eventoNombre,
        fechaEvento: args.fechaEvento,
      },
    });

    return result.ok ? undefined : `Constancia no emitida: ${result.error}`;
  } catch (err) {
    return `Constancia no emitida: ${err instanceof Error ? err.message : "error desconocido"}`;
  }
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

export type ResultadoInput = {
  inscripcionId: string;
  /** Tiempo oficial en mm:ss o hh:mm:ss. */
  tiempoOficial: string;
  ritmo?: string | null;
  posicionGeneral?: number | null;
  posicionCategoria?: number | null;
};

export type ResultadoResult = { ok?: boolean; error?: string; vcId?: string; txId?: string | null };

/**
 * Registra el tiempo oficial y ancla la constancia de finisher en Stellar.
 *
 * Este es el paso que convierte el estado 03 de /mi-constancia en real:
 * hasta que corre esto, la tarjeta muestra "pendiente de la carrera".
 */
export async function registrarResultado(input: ResultadoInput): Promise<ResultadoResult> {
  const supabase = await createClient();
  if (!(await requireAdmin(supabase))) return { error: "No autorizado." };

  if (!/^\d{1,2}:\d{2}(:\d{2})?$/.test(input.tiempoOficial.trim())) {
    return { error: "El tiempo debe venir como mm:ss o hh:mm:ss." };
  }

  const { data: ins } = await supabase
    .from("inscripciones")
    .select("user_id, distance, category, event_id, dorsal, status")
    .eq("id", input.inscripcionId)
    .single();

  if (!ins) return { error: "No encontramos la inscripción." };
  if (ins.status !== "paid") return { error: "La inscripción no está confirmada." };
  if (ins.dorsal == null) return { error: "La inscripción no tiene dorsal asignado." };

  const [{ data: prof }, { data: ev }] = await Promise.all([
    supabase.from("profiles").select("full_name, first_name").eq("id", ins.user_id).single(),
    supabase.from("events").select("name, edition, event_date").eq("id", ins.event_id).single(),
  ]);

  if (!isActaConfigured()) {
    return { error: "ACTA no está configurado en este entorno." };
  }

  try {
    const result = await issueFinisherCredential({
      userId: ins.user_id,
      eventId: ins.event_id,
      inscripcionId: input.inscripcionId,
      claims: {
        userId: ins.user_id,
        nombre: prof?.full_name ?? prof?.first_name ?? "",
        dorsal: ins.dorsal,
        distancia: ins.distance,
        categoria: ins.category,
        edicion: ev?.edition ?? null,
        eventoNombre: ev?.name ?? "informático.run()",
        fechaEvento: ev?.event_date ?? null,
        tiempoOficial: input.tiempoOficial.trim(),
        ritmo: input.ritmo?.trim() || null,
        posicion: input.posicionGeneral ?? null,
        posicionCategoria: input.posicionCategoria ?? null,
      },
    });

    if (!result.ok) return { error: result.error };

    revalidatePath("/admin");
    revalidatePath("/mi-constancia");
    return { ok: true, vcId: result.vcId, txId: result.txId };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "No pudimos emitir la constancia." };
  }
}
