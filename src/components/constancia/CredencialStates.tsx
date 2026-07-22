import { Fragment } from "react";
import { Container } from "@/components/landing/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Check } from "@/components/ui/Check";
import { C } from "@/lib/tokens";

type Tone = "verified" | "pending" | "upcoming";

type ChainProof = {
  vcId: string;
  txId: string | null;
  network: string;
  simulated: boolean;
};

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
  chain: ChainProof | null;
  footerText: string;
};

export type ConstanciaReal = {
  name: string;
  dorsal: number | null;
  status: "pending" | "paid";
  /** Constancia de inscripción anclada en Stellar, si ya se emitió. */
  inscripcion?: ChainProof | null;
  /** Constancia de finisher con el tiempo oficial, si ya se corrió. */
  finisher?: (ChainProof & { tiempoOficial: string; ritmo: string | null }) | null;
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
    chain: null,
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
    chain: null,
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
    // Ejemplo ilustrativo: esta tarjeta es la que ve quien todavía no se
    // inscribió. Las constancias reales llevan su tx y su vcId de verdad.
    chain: { vcId: "infrun-1-5k-d287-finisher", txId: null, network: "testnet", simulated: true },
    footerText: "",
  },
];

function buildRealStates(real: ConstanciaReal): State[] {
  const paid = real.status === "paid";
  const dorsalStr = real.dorsal != null ? `#${real.dorsal}` : "#--";
  const dorsalLine = real.dorsal != null ? `DORSAL ${dorsalStr}` : "DORSAL POR ASIGNAR";
  const inscripcion = real.inscripcion ?? null;
  const finisher = real.finisher ?? null;
  const corrido = Boolean(finisher);

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
        ? inscripcion
          ? "Tu inscripción quedó anclada en Stellar. Tu dorsal es tuyo para el día de la carrera."
          : "Tu inscripción quedó registrada. Tu dorsal es tuyo para el día de la carrera."
        : "Recibimos tu inscripción. Estamos verificando tu pago por SINPE.",
      active: !corrido,
      locked: false,
      chain: inscripcion,
      footerText: paid ? "Esperando el día de la carrera" : "Te avisamos al confirmar el pago",
    },
    {
      idx: "02",
      badge: "CORRIDO",
      tone: corrido ? "verified" : "upcoming",
      hero: finisher?.tiempoOficial ?? "--:--",
      heroLabel: "TIEMPO",
      name: real.name,
      dorsalLine,
      body: corrido
        ? "Cruzaste la meta. Tu tiempo y ritmo quedaron capturados por el chip."
        : "El día de la carrera tu chip captura tu tiempo y ritmo automáticamente.",
      active: false,
      locked: !corrido,
      chain: null,
      footerText: corrido ? "Tiempo capturado" : "Aún no corrés",
    },
    {
      idx: "03",
      badge: "VERIFICADO",
      tone: corrido ? "verified" : "upcoming",
      hero: finisher?.tiempoOficial ?? "--:--",
      heroLabel: "TIEMPO OFICIAL",
      name: real.name,
      dorsalLine,
      body: corrido
        ? "Tu récord está firmado en Stellar: imposible de falsificar. Listo para descargar y compartir."
        : "Tu récord se firmará en Stellar: imposible de falsificar, tuyo para siempre.",
      active: corrido,
      locked: !corrido,
      chain: finisher,
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

function shortTx(txId: string): string {
  return txId.length <= 12 ? txId : `${txId.slice(0, 6)}…${txId.slice(-4)}`;
}

function explorerUrl(txId: string, network: string): string {
  return `https://stellar.expert/explorer/${network === "mainnet" ? "public" : "testnet"}/tx/${txId}`;
}

function ChainProofBlock({ proof }: { proof: ChainProof }) {
  // Sin tx no hay anclaje: puede ser la tarjeta de ejemplo o una emisión
  // corriendo con ACTA_ISSUANCE_ENABLED=false. No decimos "verificado".
  if (!proof.txId) {
    return (
      <div className="rounded-xl bg-paper px-3.5 py-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-line" />
          <span className="font-display text-[13px] font-semibold text-mut">
            {proof.simulated ? "Así se verá tu constancia" : "Anclaje pendiente"}
          </span>
        </div>
        <div className="mt-2 break-all font-mono text-[9.5px] leading-[1.6] text-mut">
          {proof.vcId}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-mint px-3.5 py-3">
      <div className="flex items-center gap-2">
        <Check size={16} bg={C.verified} color="#ffffff" />
        <span className="font-display text-[13px] font-semibold text-verified">
          Verificado en Stellar
        </span>
      </div>
      <div className="mt-2 break-all font-mono text-[9.5px] leading-[1.6] text-teal-deep">
        TX {shortTx(proof.txId)}
        {proof.network !== "mainnet" && " · TESTNET"}
        <br />
        {proof.vcId}
        <br />
        <a
          href={`/verificar/${proof.vcId}`}
          className="text-teal underline-offset-2 hover:underline"
        >
          verificar →
        </a>
        {" · "}
        <a
          href={explorerUrl(proof.txId, proof.network)}
          target="_blank"
          rel="noreferrer"
          className="text-teal underline-offset-2 hover:underline"
        >
          ver en explorer →
        </a>
      </div>
    </div>
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
            <ChainProofBlock proof={s.chain} />
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
  const corrido = Boolean(real?.finisher);
  const completedSteps = real ? (corrido ? 3 : real.status === "paid" ? 1 : 0) : 2;

  const title = real
    ? corrido
      ? "Tu récord está verificado"
      : real.status === "paid"
        ? "Tu lugar está reservado"
        : "Estamos verificando tu pago"
    : "Una credencial que evoluciona";
  const body = real
    ? corrido
      ? "Tu tiempo oficial quedó anclado en Stellar. Cualquiera puede verificarlo sin pasar por nosotros."
      : "Tu constancia avanza con la carrera: de reservar tu lugar a tener tu récord firmado on-chain."
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
