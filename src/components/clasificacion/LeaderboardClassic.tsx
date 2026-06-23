import { Eyebrow } from "@/components/ui/Eyebrow";
import { Chip } from "@/components/ui/Chip";
import { LB_ROWS, Medal } from "./parts";
import { C } from "@/lib/tokens";

export function LeaderboardClassic() {
  return (
    <div>
      <div className="flex items-start justify-between">
        <div>
          <Eyebrow>Resultados oficiales</Eyebrow>
          <div className="mt-4 flex flex-wrap items-baseline gap-3.5">
            <h1 className="font-display text-[28px] font-bold tracking-[-0.03em] lg:text-[34px]">
              Clasificación
            </h1>
            <div className="flex gap-2">
              <Chip active>5K</Chip>
              <Chip>10K</Chip>
              <Chip>General</Chip>
            </div>
          </div>
        </div>
        <div className="hidden items-center gap-2 rounded-full border border-line bg-white px-3 py-[7px] sm:flex">
          <span className="h-2 w-2 rounded-full bg-danger" />
          <span className="font-mono text-[10.5px] tracking-[0.08em] text-ink">EN VIVO · 07:42</span>
        </div>
      </div>

      <div className="mt-[22px] overflow-hidden rounded-2xl border border-line bg-white shadow-[0_8px_24px_rgba(15,27,45,0.08)]">
        <div className="hidden grid-cols-[52px_1fr_110px_86px_90px] gap-3 border-b border-line bg-mint-2 px-[18px] py-3 font-mono text-[11px] tracking-[0.12em] text-mut sm:grid">
          <span>POS</span>
          <span>ATLETA</span>
          <span>CATEGORÍA</span>
          <span className="text-right">RITMO</span>
          <span className="text-right">TIEMPO</span>
        </div>
        {LB_ROWS.map((r, i) => (
          <div
            key={r.p}
            className={`grid grid-cols-[44px_1fr_auto] items-center gap-3 px-[18px] py-[13px] sm:grid-cols-[52px_1fr_110px_86px_90px] ${
              r.you ? "bg-mint" : "bg-white"
            } ${i < LB_ROWS.length - 1 ? "border-b border-line" : ""}`}
            style={{ borderLeft: r.you ? `3px solid ${C.teal}` : "3px solid transparent" }}
          >
            <Medal p={r.p} />
            <span
              className={`flex items-center gap-2 font-display text-[15px] ${
                r.you ? "font-bold" : "font-medium"
              }`}
            >
              {r.n}
              {r.you && (
                <span className="rounded-full border border-teal bg-white px-[7px] py-0.5 font-mono text-[10px] tracking-[0.1em] text-teal-deep">
                  VOS
                </span>
              )}
            </span>
            <span className="hidden font-mono text-[12px] text-mut sm:block">{r.c}</span>
            <span className="hidden text-right font-mono text-[13px] text-mut sm:block">
              {r.pace}
              <span className="text-[10px]">/km</span>
            </span>
            <span
              className={`text-right font-mono text-[16px] font-bold ${
                r.you ? "text-teal-deep" : "text-ink"
              }`}
            >
              {r.t}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-2 font-mono text-[11px] text-mut">
        <span className="h-2 w-2 rounded-full bg-verified" />
        Resultados verificados en Stellar · actualizado 07:42
      </div>
    </div>
  );
}
