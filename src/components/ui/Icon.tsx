import type { ReactNode } from "react";

export type IconName =
  | "user"
  | "shirt"
  | "trophy"
  | "share"
  | "shield"
  | "bolt"
  | "flag"
  | "clock"
  | "users"
  | "chevR"
  | "link"
  | "pencil"
  | "download"
  | "qr"
  | "spark"
  | "medal";

const PATHS: Record<IconName, ReactNode> = {
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 3.5-6 8-6s8 2 8 6" />
    </>
  ),
  shirt: <path d="M8 3l4 2 4-2 5 4-3 3-2-1v11H8V9L6 10 3 7z" />,
  trophy: (
    <>
      <path d="M7 4h10v4a5 5 0 0 1-10 0z" />
      <path d="M7 6H4a3 3 0 0 0 3 3M17 6h3a3 3 0 0 1-3 3" />
      <path d="M12 13v4M8 21h8M9 17h6" />
    </>
  ),
  share: (
    <>
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3l8 3v5c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6z" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
  bolt: <path d="M13 2L4 14h7l-1 8 9-12h-7z" />,
  flag: (
    <>
      <path d="M5 21V4M5 4h13l-2 4 2 4H5" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3 20c0-3.3 2.7-5 6-5s6 1.7 6 5" />
      <path d="M16 5.5a3.2 3.2 0 0 1 0 6M21 20c0-2.6-1.6-4.2-4-4.7" />
    </>
  ),
  chevR: <path d="M9 6l6 6-6 6" />,
  link: (
    <>
      <path d="M9 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1.5 1.5" />
      <path d="M15 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1.5-1.5" />
    </>
  ),
  pencil: (
    <>
      <path d="M4 20h4L19 9l-4-4L4 16z" />
      <path d="M14 6l4 4" />
    </>
  ),
  download: (
    <>
      <path d="M12 3v12M7 11l5 5 5-5" />
      <path d="M4 21h16" />
    </>
  ),
  qr: (
    <>
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <path d="M14 14h3v3M20 14v7M14 20h3" />
    </>
  ),
  spark: <path d="M12 2l2 7 7 2-7 2-2 7-2-7-7-2 7-2z" />,
  medal: (
    <>
      <circle cx="12" cy="15" r="6" />
      <path d="M9 9L7 3h10l-2 6M12 13l1 2 2 .2-1.4 1.4.4 2-2-1-2 1 .4-2L9 15.2 11 15z" />
    </>
  ),
};

type IconProps = {
  name: IconName;
  size?: number;
  color?: string;
  stroke?: number;
};

export function Icon({ name, size = 20, color = "currentColor", stroke = 1.75 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="block shrink-0"
    >
      {PATHS[name]}
    </svg>
  );
}
