import { Container } from "./Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Icon, type IconName } from "@/components/ui/Icon";
import { C } from "@/lib/tokens";

const STEPS: { ic: IconName; k: string; t: string; d: string }[] = [
  {
    ic: "pencil",
    k: "01",
    t: "Inscribite",
    d: "Elegí 5K o 10K, tu talla y tu equipo. Pagás y quedás dentro.",
  },
  {
    ic: "flag",
    k: "02",
    t: "Corré",
    d: "23 de agosto, 07:00. El chip mide tu tiempo y tu ritmo, kilómetro a kilómetro.",
  },
  {
    ic: "shield",
    k: "03",
    t: "Verificá",
    d: "Tu resultado se firma en Stellar: imposible de falsificar, tuyo para siempre.",
  },
  {
    ic: "share",
    k: "04",
    t: "Compartí",
    d: "Personalizá tu constancia y publicala. Cada récord reta al siguiente.",
  },
];

export function HowItWorks() {
  return (
    <section id="como-funciona">
      <Container className="py-12">
        <Eyebrow>Cómo funciona</Eyebrow>
        <h2 className="mt-4 max-w-[620px] font-display text-[28px] font-bold tracking-[-0.03em] lg:text-[38px]">
          De la inscripción al récord compartido.
        </h2>
        <div className="mt-5 grid grid-cols-1 gap-3 lg:mt-[34px] lg:grid-cols-4 lg:gap-[18px]">
          {STEPS.map((s) => (
            <div
              key={s.k}
              className="flex gap-[14px] rounded-2xl border border-line bg-white p-4 lg:flex-col lg:gap-0 lg:p-6"
            >
              <div className="flex shrink-0 items-center justify-between lg:w-full">
                <span className="flex h-[42px] w-[42px] items-center justify-center rounded-xl bg-mint lg:h-11 lg:w-11">
                  <Icon name={s.ic} size={21} color={C.tealDeep} />
                </span>
                <span className="hidden font-mono text-[13px] font-bold text-line lg:block">
                  {s.k}
                </span>
              </div>
              <div className="flex-1 lg:mt-[18px]">
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-[17px] font-bold tracking-[-0.02em] lg:text-xl">
                    {s.t}
                  </span>
                  <span className="font-mono text-[11px] font-bold text-line lg:hidden">
                    {s.k}
                  </span>
                </div>
                <p className="mt-1 font-display text-[13px] leading-[1.5] text-mut lg:mt-2 lg:text-[13.5px]">
                  {s.d}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
