import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PerfilView, type PerfilInscripcion } from "@/components/perfil/PerfilView";

export const metadata: Metadata = {
  title: "Mi perfil — informático.run()",
};

export default async function Page() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/conectar?next=%2Fperfil");

  const [{ data: profile }, { data: event }, { data: strava }] = await Promise.all([
    supabase
      .from("profiles")
      .select("full_name, email, cedula, phone, gender, birthdate, dominant_hand")
      .eq("id", auth.user.id)
      .single(),
    supabase
      .from("events")
      .select("id")
      .eq("registration_open", true)
      .order("edition", { ascending: false })
      .limit(1)
      .single(),
    supabase
      .from("strava_credentials")
      .select("athlete")
      .eq("user_id", auth.user.id)
      .maybeSingle(),
  ]);

  const meta = auth.user.user_metadata ?? {};
  const avatarUrl = (meta.avatar_url as string | undefined) ?? (meta.picture as string | undefined) ?? null;

  const athlete = (strava?.athlete ?? null) as { firstname?: string; lastname?: string } | null;
  const stravaConnected = athlete
    ? { name: [athlete.firstname, athlete.lastname].filter(Boolean).join(" ").trim() }
    : null;

  let inscripcion: PerfilInscripcion | null = null;
  if (event) {
    const { data: ins } = await supabase
      .from("inscripciones")
      .select("status, dorsal, distance, shirt_size, category, amount, beneficiario_nombre, beneficiario_parentesco")
      .eq("user_id", auth.user.id)
      .eq("event_id", event.id)
      .neq("status", "cancelled")
      .maybeSingle();
    if (ins) {
      inscripcion = {
        status: ins.status,
        dorsal: ins.dorsal,
        distance: ins.distance,
        shirtSize: ins.shirt_size ?? "",
        category: ins.category ?? "",
        amount: ins.amount,
        beneficiarioNombre: ins.beneficiario_nombre ?? "",
        beneficiarioParentesco: ins.beneficiario_parentesco ?? "",
      };
    }
  }

  return (
    <PerfilView
      profile={{
        fullName: profile?.full_name ?? "",
        email: profile?.email ?? "",
        cedula: profile?.cedula ?? "",
        phone: profile?.phone ?? "",
        gender: profile?.gender ?? "",
        birthdate: profile?.birthdate ?? "",
        dominantHand: profile?.dominant_hand ?? "",
      }}
      inscripcion={inscripcion}
      avatarUrl={avatarUrl}
      strava={stravaConnected}
    />
  );
}
