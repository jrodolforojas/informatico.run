import { C } from "@/lib/tokens";

export type LbRow = {
  p: number;
  n: string;
  team: string;
  c: string;
  pace: string;
  t: string;
  you?: boolean;
};

export const LB_ROWS: LbRow[] = [
  { p: 1, n: "Kevin Sánchez Rojas", team: "golabs", c: "Open M", pace: "3:38", t: "18:12" },
  { p: 2, n: "María Fernanda Cruz", team: "Coopenae", c: "Open F", pace: "3:51", t: "19:14" },
  { p: 3, n: "Diego Alvarado Mora", team: "TEC", c: "Sub-23 M", pace: "3:58", t: "19:48" },
  { p: 4, n: "Josué Ramírez Vega", team: "CPIC", c: "Open M", pace: "4:02", t: "20:09" },
  { p: 5, n: "Laura Jiménez Soto", team: "golabs", c: "Open F", pace: "4:07", t: "20:33" },
  { p: 6, n: "Andrés Castro Pérez", team: "Coopelesca", c: "Master M", pace: "4:11", t: "20:55" },
  { p: 42, n: "Andrés Morales V.", team: "golabs", c: "Open M", pace: "4:19", t: "21:37", you: true },
];

const MEDAL_COLORS: Record<number, string> = { 1: C.gold, 2: C.silver, 3: C.bronze };

export function Medal({ p }: { p: number }) {
  const c = MEDAL_COLORS[p];
  if (c) {
    return (
      <span
        className="inline-flex h-[30px] w-[30px] items-center justify-center rounded-full font-mono text-[13px] font-bold text-white"
        style={{ background: c }}
      >
        {p}
      </span>
    );
  }
  return (
    <span className="inline-flex h-[30px] w-[30px] items-center justify-center font-mono text-[14px] font-bold text-mut">
      {p}
    </span>
  );
}
