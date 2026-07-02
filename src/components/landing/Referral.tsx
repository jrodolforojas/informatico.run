"use client";

import { useState } from "react";
import { Container } from "./Container";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { RunnerDots } from "@/components/ui/decorations";
import { C } from "@/lib/tokens";

export function Referral() {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = `${window.location.origin}/inscripcion`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "informático.run()",
          text: "Corré conmigo la carrera del informático 🏃",
          url,
        });
        return;
      } catch {
        return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard no disponible */
    }
  }

  return (
    <section>
      <Container className="py-10">
        <div className="flex flex-col flex-wrap items-start gap-6 rounded-[22px] border border-line bg-white p-6 lg:flex-row lg:items-center lg:justify-between lg:gap-8 lg:p-[44px]">
          <div className="max-w-[540px]">
            <div className="mb-2.5 flex items-center gap-2.5 lg:mb-3.5">
              <RunnerDots color={C.teal} size={36} op={false} />
              <span className="font-mono text-[10.5px] tracking-[0.14em] text-teal-deep lg:text-[11px] lg:tracking-[0.16em]">
                {"/// RETÁ A UN COLEGA"}
              </span>
            </div>
            <h2 className="mb-2 font-display text-[23px] font-bold tracking-[-0.03em] lg:text-[30px]">
              ¿Y vos? Retá a un colega.
            </h2>
            <p className="font-display text-[13.5px] leading-[1.5] text-ink-80 lg:text-[15.5px]">
              Compartí la carrera con tus colegas. Mientras más informáticos en la
              línea de salida, mejor.
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 lg:w-auto lg:min-w-[280px]">
            <div className="flex items-center gap-2.5 rounded-xl border border-line bg-paper px-4 py-3">
              <Icon name="link" size={18} color={C.mut} />
              <span className="font-mono text-[13px] text-ink">
                informatico.run/inscripcion
              </span>
            </div>
            <Button variant="primary" className="justify-center" onClick={share}>
              <Icon name="share" size={18} color="#ffffff" />
              {copied ? "¡Link copiado!" : "Compartir invitación"}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
