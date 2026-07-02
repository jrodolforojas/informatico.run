import { Fragment } from "react";
import { Container } from "@/components/landing/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Check } from "@/components/ui/Check";
import { C } from "@/lib/tokens";

type Tone = "verified" | "pending" | "upcoming";

type State = {
  idx: string;
  badge: string;
  tone: Tone;
  hero: string;
  heroLabel: string;
  name: string;
  dorsalLine: string;
  body: string;
  active: boolean;
  locked: boolean;
  chain: boolean;
  footerText: string;
};

export type ConstanciaReal = {
  name: string;
  dorsal: number | null;
  status: "pending" | "paid";
};

const DEMO_NAME = "Andrés Morales Vargas";

const DEMO_STATES: State[] = [
  {
    idx: "01",
    badge: "INSCRITO",
    tone: "verified",
    hero: "#287",
    heroLabel: "LUGAR RESERVADO",
    name: DEMO_NAME,
    dorsalLine: "DORSAL #287 · 5K",
    body: "Tu inscripción quedó registrada. El dorsal #287 es tuyo para el 23 de agosto.",
    active: false,
    locked: false,
    chain: false,
    footerText: "Esperando el día de la carrera",
  },
  {
    idx: "02",
    badge: "CORRIDO",
    tone: "verified",
    hero: "21:37",
    heroLabel: "TIEMPO PRELIMINAR",
    name: DEMO_NAME,
    dorsalLine: "DORSAL #287 · 5K",
    body: "Cruzaste la meta. Tu tiempo y ritmo quedaron capturados por el chip, pendientes de firma on-chain.",
    active: false,
    locked: false,
    chain: false,
    footerText: "Firmando en Stellar…",
  },
  {
    idx: "03",
    badge: "VERIFICADO",
    tone: "verified",
    hero: "21:37",
    heroLabel: "TIEMPO OFICIAL",
    name: DEMO_NAME,
    dorsalLine: "DORSAL #287 · 5K",
    body: "Tu récord está firmado en Stellar: imposible de falsificar. Listo para descargar y compartir.",
    active: true,
    locked: false,
    chain: true,
    footerText: "",
  },
];

function buildRealStates(real: ConstanciaReal): State[] {
  const paid = real.status === "paid";
  const dorsalStr = real.dorsal != null ? `#${real.dorsal}` : "#--";
  const dorsalLine = real.dorsal != null ? `DORSAL ${dorsalStr}` : "DORSAL POR ASIGNAR";
  return [
    {
      idx: "01",
      badge: paid ? "INSCRITO" : "PENDIENTE",
      tone: paid ? "verified" : "pending",
      hero: dorsalStr,
      heroLabel: paid ? "LUGAR RESERVADO" : "VERIFICANDO PAGO",
      name: real.name,
      dorsalLine,
      body: paid
        ? "Tu inscripción quedó registrada. Tu dorsal es tuyo para el día de la carrera."
        : "Recibimos tu inscripción. Estamos verificando tu pago por SINPE.",
      active: true,
      locked: false,
      chain: false,
      footerText: paid ? "Esperando el día de la carrera" : "Te avisamos al confirmar el pago",
    },
    {
      idx: "02",
      badge: "CORRIDO",
      tone: "upcoming",
      hero: "--:--",
      heroLabel: "TIEMPO",
      name: real.name,
      dorsalLine,
      body: "El día de la carrera tu chip captura tu tiempo y ritmo automáticamente.",
      active: false,
      locked: true,
      chain: false,
      footerText: "Aún no corrés",
    },
    {
      idx: "03",
      badge: "VERIFICADO",
      tone: "upcoming",
      hero: "--:--",
      heroLabel: "TIEMPO OFICIAL",
      name: real.name,
      dorsalLine,
      body: "Tu récord se firmará en Stellar: imposible de falsificar, tuyo para siempre.",
      active: false,
      locked: true,
      chain: false,
      footerText: "Pendiente de la carrera",
    },
  ];
}

function BadgePill({ tone, label }: { tone: Tone; label: string }) {
  if (tone === "upcoming") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-paper px-2.5 py-1 font-mono text-[10px] font-medium tracking-[0.1em] text-mut">
        <span className="h-2 w-2 rounded-full bg-line" />
        {label}
      </span>
    );
  }
  if (tone === "pending") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 font-mono text-[10px] font-medium tracking-[0.1em] text-amber-700">
        {label}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-mint px-2.5 py-1 font-mono text-[10px] font-medium tracking-[0.1em] text-verified">
      <Check size={12} bg={C.verified} color="#ffffff" />
      {label}
    </span>
  );
}

function StateCard({ s }: { s: State }) {
  return (
    <div
      className={`flex flex-1 flex-col overflow-hidden rounded-[18px] border bg-white ${
        s.active
          ? "border-teal shadow-[0_16px_40px_rgba(15,27,45,0.12)]"
          : "border-line shadow-[0_1px_2px_rgba(15,27,45,0.06)]"
      } ${s.locked ? "opacity-60" : ""}`}
    >
      <div className="flex items-center justify-between border-b border-line px-5 py-[18px]">
        <span className="font-mono text-[10px] tracking-[0.12em] text-mut">ESTADO {s.idx}</span>
        <BadgePill tone={s.tone} label={s.badge} />
      </div>
      <div className="flex flex-1 flex-col px-5 py-[22px]">
        <div className="font-mono text-[10px] tracking-[0.14em] text-mut">{s.heroLabel}</div>
        <div
          className={`mt-1.5 font-mono font-bold leading-none tracking-[-0.04em] ${
            s.locked ? "text-mut" : s.active ? "text-teal-deep" : "text-ink"
          } ${s.hero.startsWith("#") ? "text-[52px]" : "text-[46px]"}`}
        >
          {s.hero}
        </div>
        <div className="mt-3 font-display text-[15px] font-semibold">{s.name}</div>
        <div className="mt-[3px] font-mono text-[10px] text-mut">{s.dorsalLine}</div>
        <p className="mt-3.5 font-display text-[13px] leading-[1.5] text-mut">{s.body}</p>
        <div className="mt-auto pt-4">
          {s.chain ? (
            <div className="rounded-xl bg-mint px-3.5 py-3">
              <div className="flex items-center gap-2">
                <Check size={16} bg={C.verified} color="#ffffff" />
                <span className="font-display text-[13px] font-semibold text-verified">
                  Verificado en Stellar
                </span>
              </div>
              <div className="mt-2 break-all font-mono text-[9.5px] leading-[1.6] text-teal-deep">
                TX 7a3f…d29c · LEDGER 51,204,883
                <br />+ MEDALLA NFT SOULBOUND ACUÑADA ·{" "}
                <span className="text-teal">ver en explorer →</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 font-mono text-[10px] text-mut opacity-70">
              <span className="h-2 w-2 rounded-full bg-line" />
              {s.footerText}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const STEPS = ["Inscrito", "Corrido", "Verificado"];

export function CredencialStates({ real }: { real?: ConstanciaReal | null }) {
  const states = real ? buildRealStates(real) : DEMO_STATES;
  const completedSteps = real ? (real.status === "paid" ? 1 : 0) : 2;

  const title = real
    ? real.status === "paid"
      ? "Tu lugar está reservado"
      : "Estamos verificando tu pago"
    : "Una credencial que evoluciona";
  const body = real
    ? "Tu constancia avanza con la carrera: de reservar tu lugar a tener tu récord firmado on-chain."
    : "De reservar tu lugar a tener tu récord firmado on-chain. La constancia pasa por tres estados.";

  return (
    <section>
      <Container className="pt-10 pb-6 lg:pt-12">
        <Eyebrow>Mi constancia · línea de tiempo</Eyebrow>
        <h1 className="mt-3.5 mb-1 font-display text-[28px] font-bold tracking-[-0.03em] lg:text-[32px]">
          {title}
        </h1>
        <p className="mb-7 max-w-[560px] font-display text-[15.5px] text-mut">{body}</p>

        <div className="mb-6 flex max-w-[520px] items-center">
          {STEPS.map((s, i) => {
            const done = i < completedSteps;
            const current = i === completedSteps;
            return (
              <Fragment key={s}>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex h-[22px] w-[22px] items-center justify-center rounded-full font-mono text-[11px] font-bold text-white ${
                      done ? "bg-verified" : current ? "bg-teal" : "bg-line text-mut"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span
                    className={`font-mono text-[11px] tracking-[0.08em] ${
                      done || current ? "text-ink" : "text-mut"
                    }`}
                  >
                    {s.toUpperCase()}
                  </span>
                </div>
                {i < 2 && (
                  <div className={`mx-3 h-0.5 flex-1 ${i < completedSteps ? "bg-teal" : "bg-line"}`} />
                )}
              </Fragment>
            );
          })}
        </div>

        <div className="flex flex-col gap-[18px] lg:flex-row lg:items-stretch">
          {states.map((s) => (
            <StateCard key={s.idx} s={s} />
          ))}
        </div>
      </Container>
    </section>
  );
}
