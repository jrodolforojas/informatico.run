import { Container } from "./Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Label } from "@/components/ui/Label";
import { Check } from "@/components/ui/Check";
import { Icon, type IconName } from "@/components/ui/Icon";
import { RunnerDots } from "@/components/ui/decorations";
import { C } from "@/lib/tokens";

function MedalEmblem({ size = 200 }: { size?: number }) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg viewBox="0 0 200 200" width={size} height={size} className="block">
        <defs>
          <path id="medalpath" d="M100,100 m0,-80 a80,80 0 1,1 -0.01,0" fill="none" />
        </defs>
        <circle cx="100" cy="100" r="96" fill={C.ink} stroke={C.teal} strokeWidth="3" />
        <circle
          cx="100"
          cy="100"
          r="62"
          fill="none"
          stroke={C.tealBright}
          strokeWidth="1.5"
          strokeDasharray="2 5"
          opacity="0.55"
        />
        <text
          className="font-mono"
          fontSize="9.4"
          letterSpacing="2"
          fill={C.teal}
          fontWeight="500"
        >
          <textPath href="#medalpath" startOffset="1%">
            INFORMÁTICO.RUN()  ·  FINISHER  ·  5ª EDICIÓN 2026  ·
          </textPath>
        </text>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <RunnerDots color={C.tealBright} size={size * 0.34} op={false} />
        <div
          className="font-mono font-bold leading-none text-white"
          style={{ fontSize: size * 0.13, letterSpacing: "-0.03em", marginTop: size * 0.02 }}
        >
          5K
        </div>
        <div
          className="font-mono text-teal-bright"
          style={{ fontSize: size * 0.045, letterSpacing: "0.18em", marginTop: size * 0.03 }}
        >
          SOULBOUND
        </div>
      </div>
    </div>
  );
}

const ROWS: { ic: IconName; t: string; d: string }[] = [
  { ic: "medal", t: "Medalla física", d: "Acabado metálico de la 5ª edición, en meta." },
  { ic: "shield", t: "NFT soulbound", d: "Token no transferible, ligado a tu identidad." },
  { ic: "spark", t: "Única por edición", d: "El arte de la medalla cambia cada año." },
];

export function MedalSection() {
  return (
    <section>
      <Container className="pt-16 pb-6">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-[52px]">
          <div>
            <Eyebrow>Medalla finisher · NFT</Eyebrow>
            <h2 className="mt-4 mb-3.5 font-display text-[28px] font-bold leading-[1.05] tracking-[-0.03em] lg:text-[38px]">
              Te llevás dos medallas.
              <br className="hidden lg:block" />
              {" "}Una <span className="text-teal">no se despega</span> de vos.
            </h2>
            <p className="max-w-[430px] font-display text-[15px] leading-[1.55] text-ink-80 lg:text-[16.5px]">
              La medalla física te la colgamos al cruzar la meta en San Carlos. Y
              a tu wallet se acuña una{" "}
              <b className="font-semibold text-ink">medalla NFT soulbound</b>: no
              se vende ni se transfiere — es la prueba, para siempre, de que la
              corriste vos.
            </p>
            <div className="mt-6 flex max-w-[420px] flex-col gap-3">
              {ROWS.map((r) => (
                <div
                  key={r.t}
                  className="flex items-center gap-[14px] rounded-[14px] border border-line bg-white px-4 py-[13px]"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-mint">
                    <Icon name={r.ic} size={20} color={C.tealDeep} />
                  </span>
                  <div>
                    <div className="font-display text-[15px] font-semibold">{r.t}</div>
                    <div className="mt-px font-display text-[13px] text-mut">{r.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center rounded-[22px] bg-navy px-5 py-7 shadow-[0_24px_60px_rgba(15,27,45,0.18)] lg:px-10 lg:py-11">
            <div className="flex w-full items-center justify-between">
              <Label light>FINISHER · 5ª EDICIÓN</Label>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-bright/40 bg-teal-bright/[0.13] px-[9px] py-1">
                <Check size={12} bg={C.tealBright} color={C.navy} />
                <span className="font-mono text-[9px] tracking-[0.08em] text-teal-bright">
                  SOULBOUND
                </span>
              </span>
            </div>
            <div className="my-6">
              <MedalEmblem size={200} />
            </div>
            <div className="flex w-full items-center justify-between border-t border-white/10 pt-[18px]">
              <div>
                <div className="font-mono text-[9px] tracking-[0.12em] text-[#7f8da0]">
                  ACUÑADA A
                </div>
                <div className="mt-[3px] font-mono text-[12px] text-white">GD4F…7QX2</div>
              </div>
              <span className="font-mono text-[10px] tracking-[0.04em] text-teal-bright">
                ver en explorer →
              </span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
