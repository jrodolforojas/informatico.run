import { Wordmark } from "@/components/ui/Wordmark";
import { Check } from "@/components/ui/Check";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { C } from "@/lib/tokens";

type DorsalRevealProps = {
  dorsal: number;
  fullName: string;
  distance: string;
  shirtSize: string;
  category: string;
  edition: number | null;
};

export function DorsalReveal({
  dorsal,
  fullName,
  distance,
  shirtSize,
  category,
  edition,
}: DorsalRevealProps) {
  const details: [string, string][] = [
    [distance, "DISTANCIA"],
    [shirtSize, "TALLA"],
    [category, "CATEGORÍA"],
  ];

  return (
    <div className="mx-auto flex max-w-[720px] flex-col items-center px-5 py-12 text-center lg:px-10">
      <Check size={56} bg={C.mint} color={C.verified} />
      <div className="mt-3 font-mono text-[11px] tracking-[0.16em] text-teal-deep">
        {"/// ESTÁS DENTRO"}
      </div>
      <h1 className="mt-3 mb-2 font-display text-[30px] font-bold tracking-[-0.03em] lg:text-[32px]">
        Le diste a Run.
      </h1>
      <p className="mb-7 max-w-[380px] font-display text-[16px] leading-[1.5] text-ink-80">
        Te enviamos el comprobante a tu correo. Este es tu dorsal para el 23 de
        agosto.
      </p>

      <div className="w-full max-w-[420px] overflow-hidden rounded-[22px] border border-line bg-white shadow-[0_24px_60px_rgba(15,27,45,0.14)]">
        <div className="flex items-center justify-between bg-ink px-6 py-5">
          <Wordmark size={14} light />
          <span className="font-mono text-[10px] tracking-[0.1em] text-[#7f8da0]">
            {edition ? `${edition}ª ED` : "ED"} · 2026
          </span>
        </div>
        <div className="px-6 pb-6 pt-7 text-left">
          <div className="font-mono text-[11px] tracking-[0.16em] text-mut">
            TU DORSAL
          </div>
          <div className="mt-1 font-mono text-[72px] font-bold leading-none tracking-[-0.04em] text-ink lg:text-[88px]">
            #{dorsal}
          </div>
          <div className="mt-2.5 font-display text-[18px] font-semibold">
            {fullName}
          </div>
        </div>
        <div className="grid grid-cols-3 border-t border-line">
          {details.map(([v, l], i) => (
            <div
              key={l}
              className={`py-4 text-center ${i < 2 ? "border-r border-line" : ""}`}
            >
              <div className="font-mono text-[16px] font-bold">{v}</div>
              <div className="mt-1 font-mono text-[9px] tracking-[0.1em] text-mut">
                {l}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-7 flex flex-col flex-wrap justify-center gap-3 sm:flex-row">
        <Button variant="primary">
          <Icon name="share" size={18} color="#ffffff" />
          Compartir que me inscribí
        </Button>
        <Button variant="ghost">
          <Icon name="users" size={18} color={C.ink} />
          Retar a un colega
        </Button>
      </div>
    </div>
  );
}
