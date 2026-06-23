import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { Slashes } from "@/components/ui/decorations";
import { C } from "@/lib/tokens";

type ComingSoonProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function ComingSoon({ eyebrow, title, description }: ComingSoonProps) {
  return (
    <div className="relative mx-auto flex min-h-[72vh] max-w-[1080px] flex-col items-center justify-center px-5 py-24 text-center lg:px-10">
      <div className="pointer-events-none absolute right-8 top-16 hidden opacity-70 lg:block">
        <Slashes color={C.mint} n={3} w={10} h={96} gap={12} skew={-16} />
      </div>

      <div className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-teal-deep">
        <span className="h-2 w-2 animate-pulse rounded-full bg-teal" />
        Próximamente
      </div>

      <Eyebrow className="mt-7">{eyebrow}</Eyebrow>
      <h1 className="mt-3 max-w-[660px] font-display text-[38px] font-bold leading-[1.02] tracking-[-0.03em] lg:text-[58px]">
        {title}
      </h1>
      <p className="mt-5 max-w-[460px] font-display text-[16px] leading-[1.55] text-ink-80 lg:text-[18px]">
        {description}
      </p>

      <div className="mt-9 flex flex-col gap-3 sm:flex-row">
        <Button href="/" size="lg">
          Volver al inicio
        </Button>
        <Button href="/#distancias" variant="ghost" size="lg">
          Ver distancias
        </Button>
      </div>
    </div>
  );
}
