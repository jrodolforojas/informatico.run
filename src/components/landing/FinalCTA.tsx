import { Container } from "./Container";
import { Button } from "@/components/ui/Button";

export function FinalCTA() {
  return (
    <section>
      <Container className="pt-6 pb-[72px]">
        <div className="overflow-hidden rounded-[22px] bg-mint px-6 py-8 text-center lg:px-10 lg:py-14">
          <h2 className="font-display text-[28px] font-bold tracking-[-0.03em] text-ink lg:text-[40px]">
            ¿Listo para correr?
          </h2>
          <p className="mb-5 mt-2.5 font-display text-[14.5px] text-teal-deep lg:text-[17px]">
            Quedan 173 dorsales. Asegurá tu camiseta y tu lugar en la línea de
            salida.
          </p>
          <Button href="/inscripcion" size="lg" className="w-full lg:w-auto">
            Inscribite ahora
          </Button>
        </div>
      </Container>
    </section>
  );
}
