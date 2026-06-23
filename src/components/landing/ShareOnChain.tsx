import { Container } from "./Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Label } from "@/components/ui/Label";
import { Check } from "@/components/ui/Check";
import { TagVerified } from "@/components/ui/TagVerified";
import { C } from "@/lib/tokens";

export function ShareOnChain() {
  return (
    <section className="mt-6 bg-navy text-white">
      <Container className="grid grid-cols-1 items-center gap-10 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:py-[76px]">
        <div>
          <Eyebrow light>Tu récord, on-chain</Eyebrow>
          <h2 className="mt-[18px] mb-4 font-display text-[30px] font-bold leading-[1.04] tracking-[-0.03em] lg:text-[42px]">
            Cruzás la meta.
            <br className="hidden lg:block" />
            {" "}El tiempo queda{" "}
            <span className="text-teal-bright">verificado</span>.
          </h2>
          <p className="max-w-[440px] font-display text-[15px] leading-[1.5] text-[#aeb9cb] lg:text-[17px] lg:leading-[1.55]">
            Cada resultado se registra en Stellar: imposible de falsificar, tuyo
            para siempre. Descargá tu constancia, personalizala y compartila en
            una historia con un toque.
          </p>
          <div className="mt-6 flex flex-wrap gap-2.5">
            <TagVerified light />
            <span className="inline-flex items-center font-mono text-[10px] tracking-[0.1em] text-[#7f8da0]">
              #YoCorríInformático
            </span>
          </div>
        </div>

        <div className="rounded-[20px] border border-white/10 bg-ink p-6 shadow-[0_24px_60px_rgba(0,0,0,0.4)] lg:p-[30px]">
          <div className="flex items-center justify-between">
            <Label light>MI TIEMPO OFICIAL · 5K</Label>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-bright/40 bg-teal-bright/[0.13] px-[9px] py-1">
              <Check size={12} bg={C.tealBright} color={C.navy} />
              <span className="font-mono text-[9px] tracking-[0.08em] text-teal-bright">
                VERIFICADO
              </span>
            </span>
          </div>
          <div className="mt-3 font-mono text-[64px] font-bold leading-[0.92] tracking-[-0.05em] lg:text-[76px]">
            21<span className="text-teal-bright">:</span>37
          </div>
          <div className="mt-4 flex gap-7 lg:mt-[18px]">
            <div>
              <div className="font-mono text-[22px] font-bold">
                4:19<span className="text-[12px] text-[#7f8da0]">/km</span>
              </div>
              <div className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.16em] text-[#7f8da0]">
                RITMO
              </div>
            </div>
            <div>
              <div className="font-mono text-[22px] font-bold text-teal-bright">#42</div>
              <div className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.16em] text-[#7f8da0]">
                POSICIÓN
              </div>
            </div>
            <div>
              <div className="font-mono text-[22px] font-bold">5K</div>
              <div className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.16em] text-[#7f8da0]">
                DISTANCIA
              </div>
            </div>
          </div>
          <div className="my-[22px] h-px bg-white/10" />
          <div className="font-mono text-[10px] leading-[1.7] text-[#7f8da0]">
            TX 7a3f…d29c · LEDGER 51,204,883
            <br />
            powered by <b className="text-white">Stellar</b>
          </div>
        </div>
      </Container>
    </section>
  );
}
