import { Container } from "./Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { Slashes } from "@/components/ui/decorations";
import { C } from "@/lib/tokens";

type HeroProps = {
  registered?: number | null;
  capacity?: number | null;
  eventDate?: string | null;
  daysLeft?: number | null;
};

const MONTHS = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];

function formatDate(iso?: string | null) {
  if (!iso) return "23·AGO";
  const [, m, d] = iso.split("-").map((n) => parseInt(n, 10));
  if (!m || !d) return "23·AGO";
  return `${d}·${MONTHS[m - 1] ?? ""}`;
}

export function Hero({ registered, capacity, eventDate, daysLeft }: HeroProps) {
  const hasCapacity = capacity != null && capacity > 0;
  const cuposValue = hasCapacity
    ? `${registered ?? 0}/${capacity}`
    : registered != null
      ? String(registered)
      : "—";
  const cuposLabel = hasCapacity ? "CUPOS" : "CORREDORES";
  const remaining = hasCapacity ? Math.max(capacity - (registered ?? 0), 0) : null;
  const pct = hasCapacity ? Math.min(Math.round(((registered ?? 0) / capacity) * 100), 100) : 0;

  const stats: { v: string; l: string; accent?: boolean }[] = [
    { v: formatDate(eventDate), l: "FECHA" },
    { v: "5K · 10K", l: "DISTANCIAS" },
    { v: "06:00", l: "SALIDA" },
    { v: cuposValue, l: cuposLabel, accent: true },
  ];

  return (
    <section>
      <Container className="relative pt-8 pb-8 lg:pt-[76px] lg:pb-[30px]">
        <div className="pointer-events-none absolute right-10 top-[88px] hidden lg:block">
          <Slashes color={C.mint} n={3} w={10} h={120} gap={12} skew={-16} />
        </div>
        <Eyebrow>5ª edición · 2026 · TEC San Carlos</Eyebrow>
        <h1 className="mt-[22px] max-w-[840px] font-display text-[42px] font-bold leading-[0.98] tracking-[-0.035em] md:text-[64px] lg:text-[84px]">
          Presioná Run.
          <br />
          <span className="text-teal">Corré</span> tu carrera.
        </h1>
        <p className="mt-6 max-w-[600px] font-display text-[15.5px] leading-[1.5] text-ink-80 lg:text-[19px]">
          <span className="font-mono font-medium text-ink">informático.run()</span>{" "}
          — la carrera de la comunidad informática. 5K y 10K por San Carlos, con
          tu tiempo{" "}
          <b className="font-semibold text-ink">verificado en Stellar</b> y listo
          para compartir, como un récord de Strava.
        </p>
        <div className="mt-7 flex flex-col gap-3 lg:flex-row">
          <Button href="/inscripcion" size="lg" className="w-full lg:w-auto">
            Inscribite — ₡12.000
          </Button>
          <Button
            href="/clasificacion"
            variant="ghost"
            size="lg"
            className="w-full lg:w-auto"
          >
            Ver clasificación
          </Button>
        </div>

        <div className="mt-10 overflow-hidden rounded-2xl border border-line lg:mt-[52px]">
          <div className="grid grid-cols-2 gap-px bg-line lg:grid-cols-4">
            {stats.map((s) => (
              <div
                key={s.l}
                className="bg-white px-[18px] py-4 lg:px-[26px] lg:py-[22px]"
              >
                <div
                  className={`font-mono text-[22px] font-bold tracking-[-0.02em] lg:text-[26px] ${
                    s.accent ? "text-teal-deep" : "text-ink"
                  }`}
                >
                  {s.v}
                </div>
                <div className="mt-1.5 font-mono text-[9.5px] tracking-[0.12em] text-mut lg:text-[10px]">
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </div>
        {(remaining != null || (daysLeft != null && daysLeft > 0)) && (
          <div className="mt-3 flex flex-col gap-2 lg:mt-3.5 lg:flex-row lg:items-center lg:gap-2.5">
            {remaining != null && (
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-mint lg:max-w-[280px] lg:flex-1">
                <div className="h-full rounded-full bg-teal" style={{ width: `${pct}%` }} />
              </div>
            )}
            <span className="font-mono text-[11px] tracking-[0.06em] text-mut">
              {daysLeft != null && daysLeft > 0 && (
                <span className="font-semibold text-teal-deep">FALTAN {daysLeft} DÍAS</span>
              )}
              {daysLeft != null && daysLeft > 0 && remaining != null && " · "}
              {remaining != null && `QUEDAN ${remaining} DORSALES`}
            </span>
          </div>
        )}
      </Container>
    </section>
  );
}
