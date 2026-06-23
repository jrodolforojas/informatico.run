import { Eyebrow } from "@/components/ui/Eyebrow";
import { Label } from "@/components/ui/Label";
import { Field } from "@/components/ui/Field";
import { Chip } from "@/components/ui/Chip";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { GoogleG, StravaMark } from "@/components/ui/BrandMarks";

const TALLAS: [string, number][] = [
  ["S", 12],
  ["M", 48],
  ["L", 61],
  ["XL", 9],
];

export function InscripcionForm() {
  return (
    <div className="mx-auto max-w-[720px] px-5 py-10 lg:px-10 lg:py-12">
      <Eyebrow>Inscripción · 5ª edición</Eyebrow>
      <h1 className="mt-4 mb-1.5 font-display text-[28px] font-bold tracking-[-0.03em] lg:text-[34px]">
        Asegurá tu dorsal
      </h1>
      <p className="mb-6 font-display text-[15.5px] text-mut">
        Entrá con tu cuenta o llená tus datos. Te llega el comprobante y tu dorsal
        al correo.
      </p>

      <div className="flex flex-col gap-5 rounded-2xl border border-line bg-white p-6 shadow-[0_1px_2px_rgba(15,27,45,0.06)] lg:p-7">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            className="flex items-center justify-center gap-2.5 rounded-full border border-line bg-white px-5 py-3 font-display text-[14px] font-semibold text-ink transition hover:border-mut"
          >
            <GoogleG size={18} />
            Continuar con Google
          </button>
          <button
            type="button"
            className="flex items-center justify-center gap-2.5 rounded-full px-5 py-3 font-display text-[14px] font-semibold text-white transition hover:opacity-90"
            style={{ background: "#FC4C02" }}
          >
            <StravaMark size={19} />
            Conectar con Strava
          </button>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-line" />
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-mut">
            o con tu correo
          </span>
          <div className="h-px flex-1 bg-line" />
        </div>
        <Field label="Nombre completo" value="Andrés Morales Vargas" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Correo" value="andres@golabs.io" type="email" />
          <Field label="Cédula" value="2 0734 0512" />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <Label>Distancia</Label>
            <div className="mt-2.5 flex gap-2.5">
              <Chip active>5K</Chip>
              <Chip>10K</Chip>
            </div>
          </div>
          <div>
            <Label>Categoría</Label>
            <div className="mt-2.5 flex flex-wrap gap-2">
              <Chip active>Open M</Chip>
              <Chip>Open F</Chip>
              <Chip>Master</Chip>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-baseline justify-between">
            <Label>Talla camiseta</Label>
            <span className="font-mono text-[10px] tracking-[0.08em] text-danger">
              S CASI AGOTADA
            </span>
          </div>
          <div className="mt-2.5 flex gap-2.5">
            {TALLAS.map(([t, stock], i) => {
              const active = i === 1;
              const low = stock < 15;
              return (
                <div
                  key={t}
                  className={`flex-1 rounded-xl border py-3 text-center ${
                    active ? "border-ink bg-ink" : "border-line bg-white"
                  }`}
                >
                  <div
                    className={`font-display text-[16px] font-bold ${
                      active ? "text-white" : "text-ink"
                    }`}
                  >
                    {t}
                  </div>
                  <div
                    className={`mt-1 font-mono text-[9px] tracking-[0.06em] ${
                      active ? "text-white/70" : low ? "text-danger" : "text-mut"
                    }`}
                  >
                    {stock} LIBRES
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="h-px bg-line" />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Label>Total</Label>
            <div className="mt-1 font-mono text-[28px] font-bold text-ink">₡12.000</div>
          </div>
          <Button href="/inscripcion/listo" size="lg" className="w-full sm:w-auto">
            <Icon name="bolt" size={18} color="#ffffff" />
            Pagar e inscribirme
          </Button>
        </div>
      </div>
    </div>
  );
}
