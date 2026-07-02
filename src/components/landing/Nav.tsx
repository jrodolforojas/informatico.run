"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { Mark } from "@/components/ui/Mark";
import { Wordmark } from "@/components/ui/Wordmark";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import { signOut } from "@/lib/supabase/auth-actions";

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

  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    const load = async (u: User | null) => {
      setUser(u);
      if (!u) {
        setIsAdmin(false);
        return;
      }
      const { data } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", u.id)
        .single();
      setIsAdmin(Boolean(data?.is_admin));
    };
    supabase.auth.getUser().then(({ data }) => load(data.user));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) =>
      load(session?.user ?? null),
    );
    return () => sub.subscription.unsubscribe();
  }, []);

  const displayName =
    (user?.user_metadata?.full_name as string | undefined) ?? user?.email;

  async function handleSignOut() {
    await signOut();
    window.location.assign("/");
  }

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
          {user ? (
            <div className="flex items-center gap-3">
              {isAdmin && (
                <Link
                  href="/admin"
                  className={`border-b-2 pb-[3px] font-display text-sm font-semibold ${
                    isActive("/admin")
                      ? "border-teal text-ink"
                      : "border-transparent text-teal-deep hover:text-ink"
                  }`}
                >
                  Admin
                </Link>
              )}
              <Link
                href="/perfil"
                className={`hidden max-w-[160px] truncate font-display text-sm font-medium sm:block ${
                  isActive("/perfil") ? "text-teal-deep" : "text-ink hover:text-teal-deep"
                }`}
              >
                {displayName}
              </Link>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                Salir
              </Button>
            </div>
          ) : (
            <Button href="/inscripcion" size="sm">
              Inscribite
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
