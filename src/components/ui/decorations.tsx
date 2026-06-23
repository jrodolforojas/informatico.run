import { C } from "@/lib/tokens";

const DOTS: [number, number][] = [
  [7, 1], [8, 2], [7, 2], [6, 3], [7, 3], [5, 4], [6, 4], [7, 4], [4, 5], [5, 5],
  [6, 5], [8, 5], [9, 5], [3, 6], [5, 6], [6, 6], [7, 6], [10, 6], [4, 7], [6, 7],
  [7, 7], [5, 8], [7, 8], [3, 8], [4, 9], [8, 9], [3, 10], [9, 10], [2, 10], [10, 11],
];

type RunnerDotsProps = {
  color?: string;
  size?: number;
  op?: boolean;
};

export function RunnerDots({ color = C.teal, size = 64, op = true }: RunnerDotsProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" className="block">
      {DOTS.map(([x, y], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r={0.42}
          fill={color}
          opacity={op ? 0.55 + (i % 3) * 0.15 : 1}
        />
      ))}
    </svg>
  );
}

type SlashesProps = {
  color?: string;
  n?: number;
  w?: number;
  h?: number;
  gap?: number;
  skew?: number;
};

export function Slashes({
  color = C.teal,
  n = 3,
  w = 4,
  h = 22,
  gap = 5,
  skew = -18,
}: SlashesProps) {
  return (
    <div className="flex" style={{ gap, transform: `skewX(${skew}deg)` }}>
      {Array.from({ length: n }).map((_, i) => (
        <span
          key={i}
          style={{
            width: w,
            height: h,
            background: color,
            borderRadius: 2,
            opacity: 0.55 + i * 0.22,
          }}
        />
      ))}
    </div>
  );
}
