import { Fragment } from "react";
import { Container } from "@/components/landing/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Check } from "@/components/ui/Check";
import { C } from "@/lib/tokens";

type State = {
  idx: string;
  badge: string;
  hero: string;
  heroLabel: string;
  dorsal: string;
  title: string;
  body: string;
  active: boolean;
  chain: boolean;
};

const STATES: State[] = [
  {
    idx: "01",
    badge: "INSCRITO",
    hero: "#287",
    heroLabel: "LUGAR RESERVADO",
    dorsal: "#287",
    title: "Esperando el día de la carrera",
    body: "Tu inscripción quedó registrada. El dorsal #287 es tuyo para el 23 de agosto.",
    active: false,
    chain: false,
  },
  {
    idx: "02",
    badge: "CORRIDO",
    hero: "21:37",
    heroLabel: "TIEMPO PRELIMINAR",
    dorsal: "#287",
    title: "Firmando en Stellar…",
    body: "Cruzaste la meta. Tu tiempo y ritmo quedaron capturados por el chip, pendientes de firma on-chain.",
    active: false,
    chain: false,
  },
  {
    idx: "03",
    badge: "VERIFICADO",
    hero: "21:37",
    heroLabel: "TIEMPO OFICIAL",
    dorsal: "#287",
    title: "",
    body: "Tu récord está firmado en Stellar: imposible de falsificar. Listo para descargar y compartir.",
    active: true,
    chain: true,
  },
];

function StateCard({ s }: { s: State }) {
  return (
    <div
      className={`flex flex-1 flex-col overflow-hidden rounded-[18px] border bg-white ${
        s.active
          ? "border-teal shadow-[0_16px_40px_rgba(15,27,45,0.12)]"
          : "border-line shadow-[0_1px_2px_rgba(15,27,45,0.06)]"
      }`}
    >
      <div className="flex items-center justify-between border-b border-line px-5 py-[18px]">
        <span className="font-mono text-[10px] tracking-[0.12em] text-mut">ESTADO {s.idx}</span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-mint px-2.5 py-1 font-mono text-[10px] font-medium tracking-[0.1em] text-verified">
          <Check size={12} bg={C.verified} color="#ffffff" />
          {s.badge}
        </span>
      </div>
      <div className="flex flex-1 flex-col px-5 py-[22px]">
        <div className="font-mono text-[10px] tracking-[0.14em] text-mut">{s.heroLabel}</div>
        <div
          className={`mt-1.5 font-mono font-bold leading-none tracking-[-0.04em] ${
            s.active ? "text-teal-deep" : "text-ink"
          } ${s.hero === "#287" ? "text-[52px]" : "text-[46px]"}`}
        >
          {s.hero}
        </div>
        <div className="mt-3 font-display text-[15px] font-semibold">Andrés Morales Vargas</div>
        <div className="mt-[3px] font-mono text-[10px] text-mut">DORSAL {s.dorsal} · 5K</div>
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
              {s.title}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const STEPS = ["Inscrito", "Corrido", "Verificado"];

export function CredencialStates() {
  return (
    <section>
      <Container className="pt-10 pb-6 lg:pt-12">
        <Eyebrow>Mi constancia · línea de tiempo</Eyebrow>
        <h1 className="mt-3.5 mb-1 font-display text-[28px] font-bold tracking-[-0.03em] lg:text-[32px]">
          Una credencial que evoluciona
        </h1>
        <p className="mb-7 max-w-[560px] font-display text-[15.5px] text-mut">
          De reservar tu lugar a tener tu récord firmado on-chain. La constancia
          pasa por tres estados.
        </p>

        <div className="mb-6 flex max-w-[520px] items-center">
          {STEPS.map((s, i) => (
            <Fragment key={s}>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex h-[22px] w-[22px] items-center justify-center rounded-full font-mono text-[11px] font-bold text-white ${
                    i < 2 ? "bg-verified" : "bg-teal"
                  }`}
                >
                  {i + 1}
                </span>
                <span className="font-mono text-[11px] tracking-[0.08em] text-ink">
                  {s.toUpperCase()}
                </span>
              </div>
              {i < 2 && <div className="mx-3 h-0.5 flex-1 bg-teal" />}
            </Fragment>
          ))}
        </div>

        <div className="flex flex-col gap-[18px] lg:flex-row lg:items-stretch">
          {STATES.map((s) => (
            <StateCard key={s.idx} s={s} />
          ))}
        </div>
      </Container>
    </section>
  );
}
