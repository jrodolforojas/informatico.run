import type { ReactNode } from "react";

type ChipProps = {
  children: ReactNode;
  active?: boolean;
  className?: string;
  onClick?: () => void;
};

export function Chip({ children, active = false, className = "", onClick }: ChipProps) {
  const cls = `inline-flex items-center rounded-full border px-[14px] py-1.5 font-display text-[13px] font-semibold transition ${
    active ? "border-ink bg-ink text-white" : "border-line bg-white text-mut"
  } ${className}`;

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={`${cls} cursor-pointer`}>
        {children}
      </button>
    );
  }

  return <span className={cls}>{children}</span>;
}
