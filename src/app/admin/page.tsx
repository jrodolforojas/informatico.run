import type { Metadata } from "next";
import { Container } from "@/components/landing/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { createClient } from "@/lib/supabase/server";
import { SHIRTS } from "@/app/inscripcion/schema";
import { InscripcionesTable, type AdminRow } from "@/components/admin/InscripcionesTable";

export const metadata: Metadata = {
  title: "Admin — informático.run()",
};

function StatCard({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-5 shadow-[0_1px_2px_rgba(15,27,45,0.06)]">
      <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-mut">{label}</div>
      <div className="mt-2 font-mono text-[28px] font-bold leading-none tracking-[-0.02em] text-ink">{value}</div>
      {hint && <div className="mt-1.5 font-mono text-[11px] text-mut">{hint}</div>}
    </div>
  );
}

export default async function Page() {
  const supabase = await createClient();

  const { data: event } = await supabase
    .from("events")
    .select("id, name, edition, event_date, capacity, next_dorsal")
    .eq("registration_open", true)
    .order("edition", { ascending: false })
    .limit(1)
    .single();

  if (!event) {
    return (
      <Container className="py-12">
        <Eyebrow>Panel admin</Eyebrow>
        <h1 className="mt-4 font-display text-[28px] font-bold tracking-[-0.03em] lg:text-[34px]">
          No hay un evento con inscripciones abiertas.
        </h1>
      </Container>
    );
  }

  const { data: inscripciones } = await supabase
    .from("inscripciones")
    .select("id, user_id, dorsal, status, distance, category, shirt_size, amount, comprobante_path, created_at")
    .eq("event_id", event.id)
    .order("created_at", { ascending: true });

  const list = inscripciones ?? [];
  const userIds = [...new Set(list.map((i) => i.user_id))];
  const { data: profiles } = userIds.length
    ? await supabase
        .from("profiles")
        .select("id, full_name, first_name, last_name, email, cedula, phone")
        .in("id", userIds)
    : { data: [] };
  const profById = new Map((profiles ?? []).map((p) => [p.id, p]));

  const rows: AdminRow[] = list.map((i) => {
    const p = profById.get(i.user_id);
    const fullName =
      p?.full_name?.trim() ||
      [p?.first_name, p?.last_name].filter(Boolean).join(" ").trim() ||
      "—";
    return {
      id: i.id,
      dorsal: i.dorsal,
      status: i.status,
      distance: i.distance,
      category: i.category,
      shirtSize: i.shirt_size,
      amount: i.amount,
      comprobantePath: i.comprobante_path,
      fullName,
      email: p?.email ?? "",
      cedula: p?.cedula ?? "",
      phone: p?.phone ?? "",
    };
  });

  const paid = rows.filter((r) => r.status === "paid");
  const pending = rows.filter((r) => r.status === "pending");
  const dorsalesUsados = paid.filter((r) => r.dorsal != null).length;
  const shirtCounts = SHIRTS.map((s) => `${s} ${paid.filter((r) => r.shirtSize === s).length}`).join(" · ");

  const cupos = event.capacity ? `${paid.length} / ${event.capacity}` : String(paid.length);
  const cuposHint = event.capacity
    ? `${Math.max(event.capacity - paid.length, 0)} disponibles`
    : "sin tope definido";

  return (
    <Container className="py-10 lg:py-12">
      <Eyebrow>Panel admin</Eyebrow>
      <div className="mt-4 flex flex-wrap items-baseline gap-3">
        <h1 className="font-display text-[28px] font-bold tracking-[-0.03em] lg:text-[34px]">
          {event.name}
        </h1>
        {event.edition && (
          <span className="font-mono text-[12px] tracking-[0.1em] text-mut">{event.edition}ª ED</span>
        )}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Cupos pagados" value={cupos} hint={cuposHint} />
        <StatCard label="Pendientes" value={String(pending.length)} hint={`${rows.length} en total`} />
        <StatCard label="Dorsales usados" value={String(dorsalesUsados)} hint={`próximo: #${event.next_dorsal}`} />
        <StatCard label="Camisetas (pagadas)" value={String(paid.length)} hint={shirtCounts} />
      </div>

      <div className="mt-10">
        <InscripcionesTable rows={rows} />
      </div>
    </Container>
  );
}
