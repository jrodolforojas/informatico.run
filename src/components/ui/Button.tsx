import type { ButtonHTMLAttributes } from "react";
import Link from "next/link";

type Variant = "primary" | "dark" | "ghost" | "light" | "tealGhost";
type Size = "sm" | "md" | "lg";

const BASE =
  "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full font-display font-semibold transition duration-200 ease-out active:scale-[0.97]";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-teal text-white hover:bg-teal-deep",
  dark: "bg-ink text-white hover:opacity-90",
  ghost: "border border-line bg-white text-ink hover:border-teal hover:text-teal-deep",
  light: "bg-white text-ink hover:opacity-90",
  tealGhost:
    "border border-teal-bright/40 bg-transparent text-teal-bright hover:bg-teal-bright/10",
};

const SIZES: Record<Size, string> = {
  sm: "px-4 py-2.5 text-sm",
  md: "px-6 py-[13px] text-[15px]",
  lg: "px-7 py-[15px] text-base",
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  href?: string;
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  href,
  children,
  ...props
}: ButtonProps) {
  const cls = `${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${className}`;
  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button className={cls} {...props}>
      {children}
    </button>
  );
}
