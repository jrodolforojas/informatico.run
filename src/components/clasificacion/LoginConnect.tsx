import Link from "next/link";
import { Mark } from "@/components/ui/Mark";
import { Icon } from "@/components/ui/Icon";
import { GoogleG, StravaMark } from "@/components/ui/BrandMarks";
import { C } from "@/lib/tokens";

export function LoginConnect() {
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
        <Link
          href="/clasificacion"
          className="flex items-center justify-center gap-3 rounded-full border border-line bg-white px-5 py-3.5 font-display text-[15px] font-semibold text-ink transition hover:border-mut"
        >
          <GoogleG size={19} />
          Continuar con Google
        </Link>
        <Link
          href="/clasificacion"
          className="flex items-center justify-center gap-3 rounded-full px-5 py-3.5 font-display text-[15px] font-semibold text-white transition hover:opacity-90"
          style={{ background: "#FC4C02" }}
        >
          <StravaMark size={20} />
          Conectar con Strava
        </Link>
      </div>

      <div className="mt-6 flex items-center gap-2 font-mono text-[10.5px] tracking-[0.06em] text-mut">
        <Icon name="shield" size={15} color={C.verified} />
        Solo leemos tu actividad de la carrera · nada más
      </div>
    </div>
  );
}
