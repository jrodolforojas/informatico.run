import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Error de autenticación — informático.run()",
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ reason?: string }>;
}) {
  const { reason } = await searchParams;

  return (
    <div className="mx-auto flex max-w-[480px] flex-col items-center px-5 py-20 text-center">
      <h1 className="mb-2 font-display text-[26px] font-bold tracking-[-0.03em]">
        No pudimos iniciar sesión
      </h1>
      <p className="mb-6 font-display text-[15px] text-mut">
        {reason ?? "Ocurrió un error durante la autenticación."}
      </p>
      <Link
        href="/conectar"
        className="rounded-full bg-ink px-6 py-3 font-display text-[15px] font-semibold text-white"
      >
        Volver a intentar
      </Link>
    </div>
  );
}
