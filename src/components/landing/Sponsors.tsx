import { Container } from "./Container";

const NAMES = ["Coopenae", "golabs", "Electrolit", "Coopelesca", "CPIC"];

export function Sponsors() {
  return (
    <section>
      <Container className="py-12">
        <div className="text-center font-mono text-[11px] tracking-[0.14em] text-mut">
          POWERED BY <b className="text-ink">STELLAR</b> · CON EL APOYO DE
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-11 gap-y-[18px]">
          {NAMES.map((n) => (
            <span
              key={n}
              className="font-display text-[15px] font-semibold text-silver lg:text-[19px]"
            >
              {n}
            </span>
          ))}
        </div>
      </Container>
    </section>
  );
}
