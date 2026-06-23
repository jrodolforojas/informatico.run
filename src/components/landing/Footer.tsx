import Link from "next/link";
import { Wordmark } from "@/components/ui/Wordmark";

const LINKS = [
  { label: "Inscripción", href: "/inscripcion" },
  { label: "Clasificación", href: "/clasificacion" },
  { label: "Mi constancia", href: "/mi-constancia" },
  { label: "Fotos", href: "/fotos" },
  { label: "Conectar", href: "/conectar" },
];

export function Footer() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="mx-auto max-w-[1080px] px-5 py-8 lg:px-10 lg:py-[34px]">
        <div className="flex flex-col items-center gap-5 lg:flex-row lg:justify-between">
          <Wordmark size={15} />
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-display text-[13px] font-medium text-mut">
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="transition hover:text-ink">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-5 border-t border-line pt-5 text-center font-mono text-[11px] tracking-[0.04em] text-mut lg:text-left">
          © 2026 · TEC San Carlos · powered by Stellar
        </div>
      </div>
    </footer>
  );
}
