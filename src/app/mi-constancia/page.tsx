import type { Metadata } from "next";
import { Container } from "@/components/landing/Container";
import { Button } from "@/components/ui/Button";
import { CredencialStates, type ConstanciaReal } from "@/components/constancia/CredencialStates";
import { Customizer } from "@/components/constancia/Customizer";
import { SocialProof } from "@/components/shared/SocialProof";
import { createClient } from "@/lib/supabase/server";
import { getSocialProof } from "@/lib/social-proof";

export const metadata: Metadata = {
  title: "Mi constancia — informático.run()",
};

export default async function Page() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  const sp = await getSocialProof();

  let real: ConstanciaReal | null = null;
  if (auth.user) {
    const { data: event } = await supabase
      .from("events")
      .select("id")
      .eq("registration_open", true)
      .order("edition", { ascending: false })
      .limit(1)
      .single();

    if (event) {
      const { data: ins } = await supabase
        .from("inscripciones")
        .select("dorsal, status")
        .eq("user_id", auth.user.id)
        .eq("event_id", event.id)
        .neq("status", "cancelled")
        .maybeSingle();

      if (ins) {
        const { data: prof } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", auth.user.id)
          .single();
        real = {
          name: prof?.full_name ?? "",
          dorsal: ins.dorsal,
          status: ins.status as "pending" | "paid",
        };
      }
    }
  }

  return (
    <>
      {(sp || !real) && (
        <Container className="flex flex-col gap-4 pt-8 lg:pt-10">
          {sp && <SocialProof registered={sp.registered} capacity={sp.capacity} />}
          {!real && (
            <div className="flex flex-col items-start justify-between gap-3 rounded-2xl border border-line bg-mint-2 p-5 sm:flex-row sm:items-center">
              <p className="font-display text-[14.5px] text-ink-80">
                Todavía no estás inscrito. Así se verá tu constancia cuando lo estés.
              </p>
              <Button href="/inscripcion" size="sm">
                Inscribite
              </Button>
            </div>
          )}
        </Container>
      )}
      <CredencialStates real={real} />
      <Customizer initialDorsal={real?.dorsal ?? undefined} />
    </>
  );
}
