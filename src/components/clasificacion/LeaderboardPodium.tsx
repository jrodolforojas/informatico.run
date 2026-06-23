import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { TagVerified } from "@/components/ui/TagVerified";
import { LB_ROWS } from "./parts";
import { C } from "@/lib/tokens";

const MC: Record<number, string> = { 1: C.gold, 2: C.silver, 3: C.bronze };

export function LeaderboardPodium() {
  const podium = [LB_ROWS[1], LB_ROWS[0], LB_ROWS[2]];
  const heights = [96, 132, 78];

  return (
    <div className="overflow-hidden rounded-[22px] bg-navy px-6 py-10 text-white lg:px-10">
      <div className="flex items-center justify-between">
        <Eyebrow light>Podio · 5K</Eyebrow>
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-[7px]">
          <span className="h-2 w-2 rounded-full" style={{ background: "#FF5A4D" }} />
          <span className="font-mono text-[10.5px] tracking-[0.08em] text-white">EN VIVO</span>
        </div>
      </div>
      <h1 className="mt-3.5 font-display text-[28px] font-bold tracking-[-0.03em] lg:text-[32px]">
        Los más rápidos de hoy
      </h1>

      <div className="mt-9 flex items-end justify-center gap-3.5">
        {podium.map((r, i) => (
          <div key={r.p} className="flex max-w-[180px] flex-1 flex-col items-center">
            <span
              className="inline-flex h-8 w-8 items-center justify-center rounded-full font-mono text-[13px] font-bold text-white"
              style={{ background: MC[r.p] }}
            >
              {r.p}
            </span>
            <div className="mt-2.5 text-center font-display text-[14px] font-semibold leading-[1.2]">
              {r.n}
            </div>
            <div className="mt-1.5 font-mono text-[20px] font-bold text-teal-bright">{r.t}</div>
            <div className="mt-0.5 font-mono text-[10px] text-[#7f8da0]">{r.pace}/km</div>
            <div
              className="mt-3.5 w-full rounded-t-[10px] border border-b-0 border-white/10"
              style={{
                height: heights[i],
                background: `linear-gradient(180deg, ${MC[r.p]} 0%, rgba(255,255,255,0.04) 100%)`,
                opacity: 0.92,
              }}
            />
          </div>
        ))}
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-4 rounded-2xl border border-teal bg-teal/10 px-5 py-[18px]">
        <div className="font-mono text-[32px] font-bold tracking-[-0.03em] text-teal-bright">#42</div>
        <div className="min-w-[150px] flex-1">
          <div className="flex items-center gap-2">
            <span className="font-display text-[16px] font-bold">Andrés Morales V.</span>
            <span className="rounded-full border border-teal-bright/40 px-[7px] py-0.5 font-mono text-[9.5px] tracking-[0.1em] text-teal-bright">
              VOS
            </span>
          </div>
          <div className="mt-1 font-mono text-[11px] text-[#7f8da0]">OPEN M · 4:19/km</div>
        </div>
        <div className="text-right">
          <div className="font-mono text-[26px] font-bold">21:37</div>
          <div className="mt-1.5">
            <TagVerified light />
          </div>
        </div>
      </div>

      <div className="mt-[18px] flex justify-center">
        <Button variant="tealGhost">
          <Icon name="share" size={17} color={C.tealBright} />
          Compartir mi resultado
        </Button>
      </div>
    </div>
  );
}
