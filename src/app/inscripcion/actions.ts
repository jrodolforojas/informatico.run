"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { inscripcionSchema } from "@/app/inscripcion/schema";
import { enviarRecibida } from "@/lib/email/send";

export type InscripcionState = { error?: string; ok?: boolean };

const MAX_FILE = 10 * 1024 * 1024;
const OK_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "application/pdf"];

export async function crearInscripcion(
  _prev: InscripcionState,
  formData: FormData,
): Promise<InscripcionState> {
  const parsed = inscripcionSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Revisá los datos del formulario." };
  }
  const data = parsed.data;

  const comprobante = formData.get("comprobante") as File | null;
  if (!comprobante || comprobante.size === 0) return { error: "Adjuntá el comprobante de pago." };
  if (comprobante.size > MAX_FILE) return { error: "El comprobante supera los 10 MB." };
  if (!OK_TYPES.includes(comprobante.type)) return { error: "El comprobante debe ser imagen o PDF." };

  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/conectar?next=%2Finscripcion");

  const { data: event } = await supabase
    .from("events")
    .select("id, price_colones, sinpe_phone, sinpe_name")
    .eq("registration_open", true)
    .order("edition", { ascending: false })
    .limit(1)
    .single();
  if (!event) return { error: "No hay un evento con inscripciones abiertas." };

  const { data: existing } = await supabase
    .from("inscripciones")
    .select("id, status")
    .eq("user_id", auth.user.id)
    .eq("event_id", event.id)
    .maybeSingle();

  if (existing && existing.status !== "cancelled") return { ok: true };

  await supabase
    .from("profiles")
    .update({
      first_name: data.first_name,
      last_name: data.last_name,
      full_name: `${data.first_name} ${data.last_name}`.trim(),
      gender: data.gender,
      birthdate: data.birthdate,
      cedula: data.cedula,
      dominant_hand: data.dominant_hand,
      phone: data.phone,
      email: data.email,
      updated_at: new Date().toISOString(),
    })
    .eq("id", auth.user.id);

  const ext = comprobante.name.split(".").pop()?.toLowerCase() || "bin";
  const path = `${auth.user.id}/${crypto.randomUUID()}.${ext}`;
  const { error: uploadError } = await supabase.storage
    .from("comprobantes")
    .upload(path, comprobante, { contentType: comprobante.type });
  if (uploadError) return { error: "No pudimos subir el comprobante." };

  const payload = {
    distance: data.distance,
    category: data.category,
    shirt_size: data.shirt_size,
    beneficiario_nombre: data.beneficiario_nombre,
    beneficiario_parentesco: data.beneficiario_parentesco,
    comprobante_path: path,
    amount: event.price_colones,
    payment_method: "sinpe_manual",
  };

  if (existing) {
    const { error: updateError } = await supabase
      .from("inscripciones")
      .update({ ...payload, status: "pending", dorsal: null, updated_at: new Date().toISOString() })
      .eq("id", existing.id);
    if (updateError) return { error: "No pudimos reactivar tu inscripción." };
  }

  if (!existing) {
    const { error: insertError } = await supabase.from("inscripciones").insert({
      user_id: auth.user.id,
      event_id: event.id,
      ...payload,
    });
    if (insertError && insertError.code !== "23505") {
      return { error: "No pudimos crear la inscripción." };
    }
  }

  await enviarRecibida(data.email, {
    firstName: data.first_name,
    distance: data.distance,
    shirtSize: data.shirt_size,
    category: data.category,
    amount: event.price_colones,
    sinpePhone: event.sinpe_phone ?? "",
    sinpeName: event.sinpe_name ?? "",
  });

  return { ok: true };
}
