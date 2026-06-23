import type { ReactNode } from "react";

type LabelProps = {
  children: ReactNode;
  light?: boolean;
  className?: string;
};

export function Label({ children, light = false, className = "" }: LabelProps) {
  return (
    <div
      className={`font-mono text-[11px] font-medium uppercase tracking-[0.16em] ${
        light ? "text-[#7f8da0]" : "text-mut"
      } ${className}`}
    >
      {children}
    </div>
  );
}
