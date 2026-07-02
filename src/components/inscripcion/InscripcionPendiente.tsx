import { Wordmark } from "@/components/ui/Wordmark";
import { Icon } from "@/components/ui/Icon";

type InscripcionPendienteProps = {
  fullName: string;
  distance: string;
  shirtSize: string;
  category: string;
  sinpePhone: string;
  sinpeName: string;
  amount: number;
};

export function InscripcionPendiente({
  fullName,
  distance,
  shirtSize,
  category,
  sinpePhone,
  sinpeName,
  amount,
}: InscripcionPendienteProps) {
  const details: [string, string][] = [
    [distance, "DISTANCIA"],
    [shirtSize, "TALLA"],
    [category, "CATEGORÍA"],
  ];

  return (
    <div className="mx-auto flex max-w-[720px] flex-col items-center px-5 py-12 text-center lg:px-10">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-100">
        <Icon name="clock" size={26} color="#b45309" />
      </div>
      <div className="mt-3 font-mono text-[11px] tracking-[0.16em] text-teal-deep">
        {"/// INSCRIPCIÓN RECIBIDA"}
      </div>
      <h1 className="mt-3 mb-2 font-display text-[30px] font-bold tracking-[-0.03em] lg:text-[32px]">
        Estamos verificando tu pago.
      </h1>
      <p className="mb-7 max-w-[420px] font-display text-[16px] leading-[1.5] text-ink-80">
        Recibimos tu inscripción, {fullName.split(" ")[0]}. En cuanto confirmemos el
        SINPE te asignamos el dorsal y te llega el comprobante al correo.
      </p>

      <div className="w-full max-w-[420px] overflow-hidden rounded-[22px] border border-line bg-white shadow-[0_24px_60px_rgba(15,27,45,0.14)]">
        <div className="flex items-center justify-between bg-ink px-6 py-5">
          <Wordmark size={14} light />
          <span className="font-mono text-[10px] tracking-[0.1em] text-[#7f8da0]">
            EN VERIFICACIÓN
          </span>
        </div>
        <div className="px-6 pb-6 pt-7 text-left">
          <div className="font-mono text-[11px] tracking-[0.16em] text-mut">TU DORSAL</div>
          <div className="mt-1 font-mono text-[56px] font-bold leading-none tracking-[-0.04em] text-mut">
            #--
          </div>
          <div className="mt-2.5 font-display text-[18px] font-semibold">{fullName}</div>
        </div>
        <div className="grid grid-cols-3 border-t border-line">
          {details.map(([v, l], i) => (
            <div key={l} className={`py-4 text-center ${i < 2 ? "border-r border-line" : ""}`}>
              <div className="font-mono text-[16px] font-bold">{v}</div>
              <div className="mt-1 font-mono text-[9px] tracking-[0.1em] text-mut">{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 w-full max-w-[420px] rounded-xl border border-line bg-paper/60 p-4 text-left">
        <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-mut">
          ¿No transferiste aún?
        </div>
        <p className="mt-1.5 font-display text-[14px] text-ink-80">
          SINPE móvil ₡{amount.toLocaleString("es-CR")} al{" "}
          <span className="font-mono font-semibold text-ink">{sinpePhone}</span>
          {sinpeName ? ` · ${sinpeName}` : ""}.
        </p>
      </div>
    </div>
  );
}
