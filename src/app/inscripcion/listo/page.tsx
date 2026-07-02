import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { DorsalReveal } from "@/components/inscripcion/DorsalReveal";
import { InscripcionPendiente } from "@/components/inscripcion/InscripcionPendiente";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "¡Estás dentro! — informático.run()",
};

export default async function Page() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/conectar?next=%2Finscripcion%2Flisto");

  const { data: inscripcion } = await supabase
    .from("inscripciones")
    .select("dorsal, status, distance, shirt_size, category, amount, events(edition, sinpe_phone, sinpe_name)")
    .eq("user_id", auth.user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (!inscripcion) redirect("/inscripcion");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", auth.user.id)
    .single();

  const fullName = profile?.full_name ?? "";

  if (inscripcion.status === "paid" && inscripcion.dorsal) {
    return (
      <DorsalReveal
        dorsal={inscripcion.dorsal}
        fullName={fullName}
        distance={inscripcion.distance}
        shirtSize={inscripcion.shirt_size ?? ""}
        category={inscripcion.category ?? ""}
        edition={inscripcion.events?.edition ?? null}
      />
    );
  }

  return (
    <InscripcionPendiente
      fullName={fullName}
      distance={inscripcion.distance}
      shirtSize={inscripcion.shirt_size ?? ""}
      category={inscripcion.category ?? ""}
      sinpePhone={inscripcion.events?.sinpe_phone ?? "8671 7767"}
      sinpeName={inscripcion.events?.sinpe_name ?? ""}
      amount={inscripcion.amount ?? 12000}
    />
  );
}
