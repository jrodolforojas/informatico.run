/**
 * Color tokens mirrored from the design system (colors_and_type.css).
 * Use Tailwind utilities (bg-teal, text-ink, fill-mint…) in markup;
 * reach for these raw hex values only where an SVG fill/stroke or a
 * dynamic accent needs a literal color.
 */
export const C = {
  ink: "#0f1b2d",
  ink80: "#34404f",
  mut: "#5e6b73",
  line: "#e6eae8",
  paper: "#fafaf8",
  white: "#ffffff",
  teal: "#0fb3a3",
  tealDeep: "#0a7f75",
  tealBright: "#2be0cc",
  mint: "#ddf4ee",
  mint2: "#eff9f5",
  verified: "#0e8a6e",
  gold: "#c99a3f",
  silver: "#9aa6ad",
  bronze: "#b07a4a",
  danger: "#d8503c",
  navy: "#0b1430",
  mutDark: "#7f8da0",
  bodyDark: "#aeb9cb",
} as const;
