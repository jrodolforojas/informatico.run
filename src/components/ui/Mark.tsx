import { C } from "@/lib/tokens";

type MarkProps = {
  size?: number;
  light?: boolean;
  tile?: string;
  glyph?: string;
};

export function Mark({ size = 64, light = false, tile, glyph }: MarkProps) {
  const t = tile ?? (light ? C.tealBright : C.teal);
  const g = glyph ?? (light ? C.navy : C.white);
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      className="block shrink-0"
      aria-label="informático.run()"
    >
      <rect x="3" y="3" width="66" height="66" rx="18" fill={t} />
      <path
        d="M22 26 L31 36 L22 46"
        fill="none"
        stroke={g}
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M38 28 L51 36 L38 44 Z"
        fill={g}
        stroke={g}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}
