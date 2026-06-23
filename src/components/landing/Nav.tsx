"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mark } from "@/components/ui/Mark";
import { Wordmark } from "@/components/ui/Wordmark";
import { Button } from "@/components/ui/Button";

const NAV_ITEMS: { label: string; href: string; match?: string }[] = [
  { label: "Inicio", href: "/", match: "/" },
  { label: "Distancias", href: "/#distancias" },
  { label: "Cómo funciona", href: "/#como-funciona" },
  { label: "Clasificación", href: "/clasificacion", match: "/clasificacion" },
  { label: "Mi constancia", href: "/mi-constancia", match: "/mi-constancia" },
];

export function Nav() {
  const pathname = usePathname();
  const isActive = (m?: string) =>
    !!m && (m === "/" ? pathname === "/" : pathname.startsWith(m));

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-paper/[0.86] backdrop-blur-md">
      <div className="mx-auto flex max-w-[1080px] items-center justify-between px-5 py-4 lg:px-10">
        <Link href="/" aria-label="informático.run()">
          <span className="flex items-center gap-2 lg:hidden">
            <Mark size={28} />
            <span className="font-display text-base font-bold tracking-[-0.035em] text-ink">
              informático<span className="text-teal">.run()</span>
            </span>
          </span>
          <span className="hidden lg:block">
            <Wordmark size={17} />
          </span>
        </Link>
        <div className="flex items-center gap-6">
          <nav className="hidden items-center gap-[26px] lg:flex">
            {NAV_ITEMS.map((it) => {
              const active = isActive(it.match);
              return (
                <Link
                  key={it.label}
                  href={it.href}
                  className={`border-b-2 pb-[3px] font-display text-sm font-medium ${
                    active
                      ? "border-teal text-ink"
                      : "border-transparent text-mut hover:text-ink"
                  }`}
                >
                  {it.label}
                </Link>
              );
            })}
          </nav>
          <Button href="/inscripcion" size="sm">
            Inscribite
          </Button>
        </div>
      </div>
    </header>
  );
}
