import type { ReactNode } from "react";

type ChipProps = {
  children: ReactNode;
  active?: boolean;
  className?: string;
};

export function Chip({ children, active = false, className = "" }: ChipProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-[14px] py-1.5 font-display text-[13px] font-semibold transition ${
        active ? "border-ink bg-ink text-white" : "border-line bg-white text-mut"
      } ${className}`}
    >
      {children}
    </span>
  );
}
