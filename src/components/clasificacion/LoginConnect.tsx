"use client";

import { useState } from "react";
import { Mark } from "@/components/ui/Mark";
import { Icon } from "@/components/ui/Icon";
import { GoogleG, StravaMark } from "@/components/ui/BrandMarks";
import { C } from "@/lib/tokens";
import {
  signInWithGoogle,
  signInWithEmail,
  connectStravaUrl,
} from "@/lib/supabase/auth-actions";

function safeNext(next?: string) {
  if (next && next.startsWith("/") && !next.startsWith("//")) return next;
  return "/clasificacion";
}

export function LoginConnect({ next }: { next?: string }) {
  const dest = safeNext(next);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  async function onEmail(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setBusy(true);
    const { error } = await signInWithEmail(email, dest);
    setBusy(false);
    if (!error) setSent(true);
  }

  return (
    <div className="mx-auto flex max-w-[560px] flex-col items-center px-5 py-16 text-center lg:px-10">
      <Mark size={56} />
      <div className="mt-5 font-mono text-[11px] tracking-[0.16em] text-teal-deep">
        {"/// CLASIFICACIÓN EN VIVO"}
      </div>
      <h1 className="mt-3 mb-2 font-display text-[30px] font-bold tracking-[-0.03em]">
        Conectá tu actividad
      </h1>
      <p className="mb-7 max-w-[380px] font-display text-[15.5px] leading-[1.5] text-ink-80">
        Entrá con tu cuenta para ver tu posición en vivo y vincular tu carrera. Tu
        tiempo del chip se cruza con tu actividad para verificarlo on-chain.
      </p>

      <div className="flex w-full max-w-[360px] flex-col gap-3">
        <button
          type="button"
          onClick={() => signInWithGoogle(dest)}
          className="flex items-center justify-center gap-3 rounded-full border border-line bg-white px-5 py-3.5 font-display text-[15px] font-semibold text-ink transition hover:border-mut"
        >
          <GoogleG size={19} />
          Continuar con Google
        </button>
        <a
          href={connectStravaUrl("/conectar")}
          className="flex items-center justify-center gap-3 rounded-full px-5 py-3.5 font-display text-[15px] font-semibold text-white transition hover:opacity-90"
          style={{ background: "#FC4C02" }}
        >
          <StravaMark size={20} />
          Conectar con Strava
        </a>

        <div className="my-1 flex items-center gap-3">
          <div className="h-px flex-1 bg-line" />
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-mut">
            o con tu correo
          </span>
          <div className="h-px flex-1 bg-line" />
        </div>

        {sent ? (
          <p className="font-display text-[14px] text-teal-deep">
            Te enviamos un enlace a {email}. Abrilo para entrar.
          </p>
        ) : (
          <form onSubmit={onEmail} className="flex flex-col gap-2.5">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              className="w-full rounded-full border border-line bg-white px-5 py-3.5 font-display text-[15px] text-ink outline-none focus:border-teal"
            />
            <button
              type="submit"
              disabled={busy}
              className="rounded-full bg-ink px-5 py-3.5 font-display text-[15px] font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
            >
              {busy ? "Enviando…" : "Enviarme un enlace"}
            </button>
          </form>
        )}
      </div>

      <div className="mt-6 flex items-center gap-2 font-mono text-[10.5px] tracking-[0.06em] text-mut">
        <Icon name="shield" size={15} color={C.verified} />
        Solo leemos tu actividad de la carrera · nada más
      </div>
    </div>
  );
}
