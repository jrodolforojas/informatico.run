import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { InscripcionForm } from "@/components/inscripcion/InscripcionForm";
import { createClient } from "@/lib/supabase/server";
import { buildInscripcionValues } from "@/lib/inscripcion-defaults";

export const metadata: Metadata = {
  title: "Inscripción — informático.run()",
};

export default async function Page() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();

  if (!auth.user) return <InscripcionForm initial={{ loggedIn: false }} />;

  const { data: event } = await supabase
    .from("events")
    .select("id, price_colones, sinpe_phone, sinpe_name")
    .eq("registration_open", true)
    .order("edition", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (event) {
    const { data: existing } = await supabase
      .from("inscripciones")
      .select("status")
      .eq("user_id", auth.user.id)
      .eq("event_id", event.id)
      .maybeSingle();

    if (existing && existing.status !== "cancelled") redirect("/inscripcion/listo");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name, last_name, full_name, email, phone, cedula, gender, birthdate, dominant_hand")
    .eq("id", auth.user.id)
    .maybeSingle();

  const values = buildInscripcionValues(
    auth.user.email,
    auth.user.user_metadata,
    profile,
  );

  return (
    <InscripcionForm
      initial={{
        loggedIn: true,
        values,
        price: event?.price_colones ?? 12000,
        sinpe: {
          phone: event?.sinpe_phone ?? "8671 7767",
          name: event?.sinpe_name ?? "",
        },
      }}
    />
  );
}
