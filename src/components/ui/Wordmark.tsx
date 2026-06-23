import { C } from "@/lib/tokens";
import { Mark } from "./Mark";

type WordmarkProps = {
  size?: number;
  light?: boolean;
  sub?: boolean;
  mark?: boolean;
};

export function Wordmark({
  size = 22,
  light = false,
  sub = true,
  mark = true,
}: WordmarkProps) {
  const teal = light ? C.tealBright : C.teal;
  return (
    <div className="flex items-center" style={{ gap: size * 0.55 }}>
      {mark && <Mark size={size * 2} light={light} />}
      <div style={{ lineHeight: 0.9 }}>
        <div
          className="whitespace-nowrap font-display font-bold tracking-[-0.035em]"
          style={{ fontSize: size, color: light ? C.white : C.ink }}
        >
          informático<span style={{ color: teal }}>.run()</span>
        </div>
        {sub && (
          <div
            className="font-mono tracking-[0.1em]"
            style={{
              fontSize: size * 0.38,
              marginTop: size * 0.22,
              color: light ? C.mutDark : C.mut,
            }}
          >
            CARRERA DEL INFORMÁTICO
          </div>
        )}
      </div>
    </div>
  );
}
