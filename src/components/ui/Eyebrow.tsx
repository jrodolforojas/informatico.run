import type { ReactNode } from "react";

type EyebrowProps = {
  children: ReactNode;
  light?: boolean;
  className?: string;
};

export function Eyebrow({ children, light = false, className = "" }: EyebrowProps) {
  return (
    <div
      className={`font-mono text-xs font-medium uppercase tracking-[0.18em] ${
        light ? "text-teal-bright" : "text-teal-deep"
      } ${className}`}
    >
      <span className={`tracking-[-0.05em] ${light ? "text-teal-bright" : "text-teal"}`}>
        {"/// "}
      </span>
      {children}
    </div>
  );
}
