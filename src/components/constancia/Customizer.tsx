"use client";

import { useState } from "react";
import { Container } from "@/components/landing/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Check } from "@/components/ui/Check";
import { ShareCard } from "./ShareCard";
import { C } from "@/lib/tokens";

type Template = "dark" | "light" | "block";

const TEMPLATES: { k: Template; name: string; bg: string }[] = [
  { k: "dark", name: "Terminal", bg: C.navy },
  { k: "light", name: "Pista", bg: C.paper },
  { k: "block", name: "Bloque", bg: C.teal },
];

const ACCENTS = [C.teal, C.tealBright, C.gold, C.ink];

export function Customizer({ initialDorsal }: { initialDorsal?: number | null }) {
  const [template, setTemplate] = useState<Template>("dark");
  const [accent, setAccent] = useState<string>(C.teal);
  const [dorsal, setDorsal] = useState(initialDorsal ?? 42);
  const [phrase, setPhrase] = useState("Mi primer 5K, verificado.");

  return (
    <section>
      <Container className="pt-6 pb-12 lg:pt-10">
        <Eyebrow>Personalizá tu constancia</Eyebrow>
        <h1 className="mt-3.5 mb-1 font-display text-[26px] font-bold tracking-[-0.03em] lg:text-[32px]">
          Hacela tuya antes de compartir
        </h1>
        <p className="mb-7 max-w-[560px] font-display text-[15.5px] text-mut">
          Elegí la plantilla, el acento y tu frase. Cada constancia se ve distinta
          — así el feed no se llena de la misma tarjeta.
        </p>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
          <div className="order-2 flex flex-col gap-6 lg:order-1">
            <div>
              <Label className="mb-3">Plantilla / layout</Label>
              <div className="grid grid-cols-3 gap-3">
                {TEMPLATES.map((t) => {
                  const sel = template === t.k;
                  return (
                    <button
                      key={t.k}
                      type="button"
                      onClick={() => setTemplate(t.k)}
                      className={`overflow-hidden rounded-xl border bg-white text-left transition ${
                        sel
                          ? "border-teal shadow-[0_4px_16px_rgba(15,179,163,0.18)]"
                          : "border-line"
                      }`}
                    >
                      <div className="flex h-16 items-end p-2" style={{ background: t.bg }}>
                        <span
                          className="font-mono text-[15px] font-bold"
                          style={{ color: t.k === "light" ? C.ink : t.k === "block" ? C.navy : "#fff" }}
                        >
                          21
                          <span
                            style={{ color: t.k === "dark" ? C.tealBright : t.k === "block" ? C.navy : C.teal }}
                          >
                            :
                          </span>
                          37
                        </span>
                      </div>
                      <div className="flex items-center justify-between px-2.5 py-2">
                        <span className="font-display text-[12px] font-semibold text-ink">{t.name}</span>
                        {sel && <Check size={14} bg={C.teal} color="#ffffff" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <Label className="mb-3">Color del acento</Label>
              <div className="flex gap-3">
                {ACCENTS.map((a) => {
                  const sel = accent === a;
                  return (
                    <button
                      key={a}
                      type="button"
                      aria-label={`Acento ${a}`}
                      onClick={() => setAccent(a)}
                      className="h-11 w-11 rounded-full border-[3px] border-white"
                      style={{ background: a, boxShadow: sel ? `0 0 0 2px ${C.ink}` : `0 0 0 1px ${C.line}` }}
                    />
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-[140px_1fr]">
              <div>
                <Label className="mb-2.5">Número / dorsal</Label>
                <div className="flex items-center overflow-hidden rounded-xl border border-line bg-white">
                  <span className="px-3.5 py-3 font-mono text-[16px] font-bold text-ink">#{dorsal}</span>
                  <div className="ml-auto flex flex-col border-l border-line">
                    <button
                      type="button"
                      aria-label="Subir dorsal"
                      onClick={() => setDorsal((n) => n + 1)}
                      className="border-b border-line px-3 py-0.5 font-mono text-[12px] text-mut hover:text-ink"
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      aria-label="Bajar dorsal"
                      onClick={() => setDorsal((n) => Math.max(1, n - 1))}
                      className="px-3 py-0.5 font-mono text-[12px] text-mut hover:text-ink"
                    >
                      ▼
                    </button>
                  </div>
                </div>
              </div>
              <div>
                <Label className="mb-2.5">Tu frase</Label>
                <input
                  value={phrase}
                  maxLength={42}
                  onChange={(e) => setPhrase(e.target.value)}
                  className="w-full rounded-xl border border-teal bg-white px-3.5 py-3 font-display text-[14px] text-ink outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button variant="primary">
                <Icon name="download" size={18} color="#ffffff" />
                Descargar constancia
              </Button>
              <Button variant="ghost">
                <Icon name="share" size={18} color={C.ink} />
                Compartir
              </Button>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <Label className="mb-3">Vista previa · historia 9:16</Label>
            <div
              className="mx-auto w-full max-w-[280px] overflow-hidden rounded-[20px] border border-line shadow-[0_24px_60px_rgba(15,27,45,0.18)] lg:max-w-none"
              style={{ aspectRatio: "9 / 16" }}
            >
              <ShareCard
                template={template}
                accent={accent}
                dorsal={`#${dorsal}`}
                phrase={phrase}
                ratio="story"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
