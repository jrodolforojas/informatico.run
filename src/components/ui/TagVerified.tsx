import type { ReactNode } from "react";
import { C } from "@/lib/tokens";
import { Check } from "./Check";

type TagVerifiedProps = {
  light?: boolean;
  children?: ReactNode;
};

export function TagVerified({
  light = false,
  children = "VERIFICADO EN STELLAR",
}: TagVerifiedProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-[5px] font-mono text-[10px] font-medium tracking-[0.1em] ${
        light
          ? "border border-teal-bright/40 bg-teal-bright/15 text-teal-bright"
          : "bg-mint text-verified"
      }`}
    >
      <Check size={13} bg={light ? C.tealBright : C.verified} color={light ? C.navy : "#ffffff"} />
      {children}
    </span>
  );
}
