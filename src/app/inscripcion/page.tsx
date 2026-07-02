import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { InscripcionForm } from "@/components/inscripcion/InscripcionForm";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Inscripción — informático.run()",
};

export default async function Page() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();

  if (auth.user) {
    const { data: event } = await supabase
      .from("events")
      .select("id")
      .eq("registration_open", true)
      .order("edition", { ascending: false })
      .limit(1)
      .single();

    if (event) {
      const { data: existing } = await supabase
        .from("inscripciones")
        .select("status")
        .eq("user_id", auth.user.id)
        .eq("event_id", event.id)
        .maybeSingle();

      if (existing && existing.status !== "cancelled") redirect("/inscripcion/listo");
    }
  }

  return <InscripcionForm />;
}
