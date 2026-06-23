import { Container } from "./Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { Check } from "@/components/ui/Check";
import { C } from "@/lib/tokens";

const FEATS = [
  "Camiseta oficial 5ª ed.",
  "Chip de cronometraje",
  "Medalla física + NFT soulbound",
  "Constancia verificable on-chain",
];

const CARDS = [
  {
    d: "5K",
    tag: "Recreativo",
    desc: "Para tu primera carrera o para volar buscando PR.",
    price: "₡12.000",
    variant: "primary" as const,
  },
  {
    d: "10K",
    tag: "Competitivo",
    desc: "Para los que ya tienen ritmo y quieren el reto completo.",
    price: "₡12.000",
    variant: "dark" as const,
  },
];

export function Distances() {
  return (
    <section id="distancias">
      <Container className="pt-10 pb-6">
        <Eyebrow>Elegí tu distancia</Eyebrow>
        <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
          {CARDS.map((c) => (
            <div
              key={c.d}
              className="flex flex-col rounded-2xl border border-line bg-white p-5 shadow-[0_1px_2px_rgba(15,27,45,0.06)] lg:p-[30px]"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-display text-[40px] font-bold leading-none tracking-[-0.04em] text-ink lg:text-[54px]">
                    {c.d}
                  </div>
                  <div className="mt-2 font-mono text-[11px] tracking-[0.14em] text-mut">
                    {c.tag.toUpperCase()}
                  </div>
                </div>
                <div className="font-mono text-[19px] font-bold text-teal-deep lg:text-[22px]">
                  {c.price}
                </div>
              </div>
              <p className="mt-4 mb-[18px] font-display text-[15px] leading-[1.5] text-ink-80 lg:mb-5">
                {c.desc}
              </p>
              <div className="mb-6 flex flex-col gap-[11px]">
                {FEATS.map((f) => (
                  <div
                    key={f}
                    className="flex items-center gap-2.5 font-display text-[14px] text-ink"
                  >
                    <Check size={16} bg={C.mint} color={C.verified} />
                    {f}
                  </div>
                ))}
              </div>
              <Button
                href="/inscripcion"
                variant={c.variant}
                className="mt-auto w-full"
              >
                Inscribirme en {c.d}
              </Button>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
