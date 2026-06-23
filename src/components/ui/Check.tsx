import { C } from "@/lib/tokens";

type CheckProps = {
  size?: number;
  bg?: string;
  color?: string;
};

export function Check({ size = 13, bg = C.verified, color = "#ffffff" }: CheckProps) {
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-full"
      style={{ width: size, height: size, background: bg }}
    >
      <svg width={size * 0.62} height={size * 0.62} viewBox="0 0 12 12">
        <path
          d="M2.5 6.2 L5 8.5 L9.5 3.5"
          stroke={color}
          strokeWidth="1.8"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
