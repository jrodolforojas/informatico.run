"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Chip } from "@/components/ui/Chip";
import { Icon } from "@/components/ui/Icon";
import { C } from "@/lib/tokens";
import {
  aprobarInscripcion,
  rechazarInscripcion,
  getComprobanteUrl,
} from "@/app/admin/actions";

export type AdminRow = {
  id: string;
  dorsal: number | null;
  status: string;
  distance: string;
  category: string | null;
  shirtSize: string | null;
  amount: number | null;
  comprobantePath: string | null;
  fullName: string;
  email: string;
  cedula: string;
  phone: string;
};

type Filter = "all" | "pending" | "paid" | "cancelled";

const FILTERS: { k: Filter; label: string }[] = [
  { k: "all", label: "Todos" },
  { k: "pending", label: "Pendientes" },
  { k: "paid", label: "Pagados" },
  { k: "cancelled", label: "Cancelados" },
];

const COLS = "grid-cols-[64px_1.6fr_120px_64px_96px_104px_minmax(190px,auto)]";

const colones = (n: number | null) => (n == null ? "—" : `₡${n.toLocaleString("es-CR")}`);

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: "border-amber-300 bg-amber-50 text-amber-700",
    paid: "border-teal bg-mint-2 text-verified",
    cancelled: "border-line bg-white text-mut",
  };
  const label: Record<string, string> = {
    pending: "PENDIENTE",
    paid: "PAGADO",
    cancelled: "CANCELADO",
  };
  return (
    <span
      className={`inline-flex rounded-full border px-[9px] py-0.5 font-mono text-[10px] tracking-[0.1em] ${
        map[status] ?? "border-line bg-white text-mut"
      }`}
    >
      {label[status] ?? status.toUpperCase()}
    </span>
  );
}

export function InscripcionesTable({ rows }: { rows: AdminRow[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("pending");
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [rejectFor, setRejectFor] = useState<AdminRow | null>(null);
  const [reason, setReason] = useState("");
  const [, startTransition] = useTransition();

  const visible = filter === "all" ? rows : rows.filter((r) => r.status === filter);

  function run(id: string, fn: () => Promise<{ ok?: boolean; error?: string }>) {
    setError(null);
    setPendingId(id);
    startTransition(async () => {
      const res = await fn();
      setPendingId(null);
      if (res.error) {
        setError(res.error);
        return;
      }
      router.refresh();
    });
  }

  async function openComprobante(path: string) {
    setError(null);
    const res = await getComprobanteUrl(path);
    if (res.error || !res.url) {
      setError(res.error ?? "No pudimos abrir el comprobante.");
      return;
    }
    window.open(res.url, "_blank", "noopener,noreferrer");
  }

  function confirmReject() {
    if (!rejectFor) return;
    const id = rejectFor.id;
    const motivo = reason;
    setRejectFor(null);
    setReason("");
    run(id, () => rechazarInscripcion(id, motivo));
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        {FILTERS.map((f) => (
          <Chip key={f.k} active={filter === f.k} onClick={() => setFilter(f.k)}>
            {f.label}
          </Chip>
        ))}
        <span className="ml-1 font-mono text-[11px] text-mut">{visible.length} resultado{visible.length === 1 ? "" : "s"}</span>
      </div>

      {error && (
        <p className="mt-3 font-display text-[13px] text-danger">{error}</p>
      )}

      <div className="mt-4 overflow-x-auto rounded-2xl border border-line bg-white shadow-[0_8px_24px_rgba(15,27,45,0.08)]">
        <div className="min-w-[840px]">
          <div className={`grid ${COLS} gap-3 border-b border-line bg-mint-2 px-[18px] py-3 font-mono text-[11px] tracking-[0.12em] text-mut`}>
            <span>DORSAL</span>
            <span>ATLETA</span>
            <span>CARRERA</span>
            <span>TALLA</span>
            <span className="text-right">MONTO</span>
            <span>ESTADO</span>
            <span className="text-right">ACCIONES</span>
          </div>

          {visible.length === 0 && (
            <div className="px-[18px] py-10 text-center font-display text-[14px] text-mut">
              No hay inscripciones en este filtro.
            </div>
          )}

          {visible.map((r, i) => {
            const busy = pendingId === r.id;
            return (
              <div
                key={r.id}
                className={`grid ${COLS} items-center gap-3 px-[18px] py-3 ${
                  i < visible.length - 1 ? "border-b border-line" : ""
                }`}
              >
                <span className="font-mono text-[15px] font-bold text-ink">
                  {r.dorsal != null ? `#${r.dorsal}` : <span className="text-mut">#--</span>}
                </span>

                <span className="min-w-0">
                  <span className="block truncate font-display text-[14px] font-semibold text-ink">{r.fullName}</span>
                  <span className="block truncate font-mono text-[11px] text-mut">
                    {[r.cedula, r.email].filter(Boolean).join(" · ")}
                  </span>
                </span>

                <span className="font-mono text-[12px] text-mut">
                  {r.distance}
                  {r.category ? ` · ${r.category}` : ""}
                </span>

                <span className="font-mono text-[13px] text-ink">{r.shirtSize ?? "—"}</span>

                <span className="text-right font-mono text-[13px] text-ink">{colones(r.amount)}</span>

                <span><StatusPill status={r.status} /></span>

                <span className="flex flex-wrap items-center justify-end gap-1.5">
                  {r.comprobantePath && (
                    <button
                      type="button"
                      onClick={() => openComprobante(r.comprobantePath!)}
                      className="inline-flex items-center gap-1 rounded-full border border-line bg-white px-2.5 py-1.5 font-display text-[12px] font-semibold text-ink transition hover:border-teal hover:text-teal-deep"
                    >
                      <Icon name="download" size={13} color={C.ink} />
                      Ver
                    </button>
                  )}
                  {r.status !== "paid" && (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => run(r.id, () => aprobarInscripcion(r.id))}
                      className="rounded-full bg-teal px-3 py-1.5 font-display text-[12px] font-semibold text-white transition hover:bg-teal-deep disabled:opacity-50"
                    >
                      {busy ? "…" : "Aprobar"}
                    </button>
                  )}
                  {r.status !== "cancelled" && (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => {
                        setRejectFor(r);
                        setReason("");
                      }}
                      className="rounded-full border border-line bg-white px-3 py-1.5 font-display text-[12px] font-semibold text-danger transition hover:border-danger disabled:opacity-50"
                    >
                      Rechazar
                    </button>
                  )}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {rejectFor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-5" onClick={() => setRejectFor(null)}>
          <div
            className="w-full max-w-[420px] rounded-2xl border border-line bg-white p-6 shadow-[0_24px_60px_rgba(15,27,45,0.2)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-mut">{"/// Rechazar inscripción"}</div>
            <h3 className="mt-2 font-display text-[18px] font-bold text-ink">{rejectFor.fullName}</h3>
            <p className="mt-1 mb-3 font-display text-[13px] text-ink-80">
              Se marcará como cancelada y le llegará un correo. El motivo es opcional.
            </p>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              placeholder="Motivo (opcional). Ej: no encontramos el SINPE."
              className="block w-full resize-none rounded-xl border border-line bg-white px-[14px] py-3 font-display text-[14px] text-ink outline-none focus:border-teal"
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setRejectFor(null)}
                className="rounded-full border border-line bg-white px-4 py-2 font-display text-[13px] font-semibold text-ink transition hover:border-mut"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmReject}
                className="rounded-full bg-danger px-4 py-2 font-display text-[13px] font-semibold text-white transition hover:opacity-90"
              >
                Rechazar inscripción
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
