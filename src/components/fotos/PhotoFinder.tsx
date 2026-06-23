import { Container } from "@/components/landing/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { Check } from "@/components/ui/Check";
import { Icon, type IconName } from "@/components/ui/Icon";
import { C } from "@/lib/tokens";

function RunnerFig({ color, scale = 1, flip = false }: { color: string; scale?: number; flip?: boolean }) {
  return (
    <g transform={`translate(50 52) scale(${flip ? -scale : scale} ${scale})`} fill={color}>
      <circle cx="6" cy="-26" r="7" />
      <rect x="-4" y="-20" width="13" height="26" rx="6" transform="rotate(14 2 -7)" />
      <rect x="6" y="-18" width="7" height="20" rx="3.5" transform="rotate(58 9 -8)" />
      <rect x="-12" y="-16" width="7" height="19" rx="3.5" transform="rotate(-42 -8 -6)" />
      <rect x="2" y="2" width="8" height="26" rx="4" transform="rotate(40 6 15)" />
      <rect x="-14" y="2" width="8" height="20" rx="4" transform="rotate(-30 -10 12)" />
      <rect x="-22" y="14" width="8" height="16" rx="4" transform="rotate(28 -18 22)" />
    </g>
  );
}

type Photo = {
  bg: string;
  fig: string;
  bib: string;
  conf: string;
  caption: string;
  faces?: number;
};

function RacePhoto({ bg, fig, bib, conf, caption, featured = false, faces = 1 }: Photo & { featured?: boolean }) {
  return (
    <div
      className="relative w-full overflow-hidden rounded-[14px]"
      style={{
        aspectRatio: featured ? "21 / 9" : "4 / 3",
        background: bg,
        boxShadow: bib ? `0 0 0 2px ${C.teal}` : "0 1px 2px rgba(15,27,45,0.08)",
      }}
    >
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        width="100%"
        height="100%"
        className="absolute inset-0 block"
      >
        {faces > 1 && <RunnerFig color={fig} scale={featured ? 1.3 : 1.5} flip />}
        <g transform={faces > 1 ? "translate(26 0)" : featured ? "translate(0 0) scale(1)" : "translate(0 4)"}>
          <RunnerFig color={fig} scale={featured ? 2.0 : 1.9} />
        </g>
      </svg>

      {bib && (
        <div className="absolute left-2.5 top-2.5 inline-flex items-center gap-1.5 rounded-full bg-navy/80 py-1 pl-[5px] pr-[9px]">
          <Check size={13} bg={C.tealBright} color={C.navy} />
          <span className="font-mono text-[11px] font-bold tracking-[0.02em] text-white">{bib}</span>
          <span className="font-mono text-[9.5px] text-teal-bright">{conf}</span>
        </div>
      )}

      <div
        className="absolute inset-x-0 bottom-0 flex items-end justify-between px-3 pb-2.5 pt-[18px]"
        style={{ background: "linear-gradient(180deg, transparent, rgba(11,20,48,0.55))" }}
      >
        <span className="font-mono text-[10px] tracking-[0.08em] text-white/90">{caption}</span>
        <div className="flex gap-1.5">
          {(["download", "share"] as IconName[]).map((ic) => (
            <span key={ic} className="flex h-[26px] w-[26px] items-center justify-center rounded-lg bg-white/90">
              <Icon name={ic} size={13} color={C.ink} />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

const PHOTOS: Photo[] = [
  { bg: "#0B1430", fig: "#33414F", bib: "#287", conf: "98%", caption: "META · 07:31", faces: 2 },
  { bg: "#C2CFC9", fig: "#8C9C97", bib: "#287", conf: "96%", caption: "KM 4 · 07:24" },
  { bg: "#0A7F75", fig: "#0C6058", bib: "#287", conf: "94%", caption: "SALIDA · 07:02" },
  { bg: "#B8C6CE", fig: "#8795A0", bib: "#287", conf: "92%", caption: "KM 2 · 07:14" },
  { bg: "#CDD3CE", fig: "#A2ABA4", bib: "#287", conf: "91%", caption: "PODIO · 08:10", faces: 2 },
  { bg: "#11324A", fig: "#2C4A60", bib: "#287", conf: "88%", caption: "KM 3 · 07:19" },
];

export function PhotoFinder() {
  return (
    <Container className="py-10 lg:py-12">
      <Eyebrow>Fotos de la 5ª edición</Eyebrow>
      <h1 className="mt-3.5 mb-1 font-display text-[28px] font-bold tracking-[-0.03em] lg:text-[32px]">
        Encontrá tus fotos con IA
      </h1>
      <p className="mb-6 max-w-[580px] font-display text-[15.5px] text-mut">
        El fotógrafo subió 3.482 fotos. La IA reconoce tu{" "}
        <b className="font-semibold text-ink">dorsal</b> y tu{" "}
        <b className="font-semibold text-ink">cara</b> y te deja solo en las que
        salís vos.
      </p>

      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-white p-4 shadow-[0_1px_2px_rgba(15,27,45,0.06)]">
        <div className="flex items-center gap-2 rounded-[10px] border border-line bg-paper px-3 py-2">
          <span className="font-mono text-[10px] tracking-[0.1em] text-mut">DORSAL</span>
          <span className="font-mono text-[16px] font-bold text-ink">#287</span>
        </div>
        <div className="flex items-center gap-2 rounded-[10px] border border-line bg-paper py-1.5 pl-2 pr-3">
          <span className="flex h-[26px] w-[26px] items-center justify-center rounded-full bg-mint">
            <Icon name="user" size={15} color={C.tealDeep} />
          </span>
          <span className="font-mono text-[11px] tracking-[0.06em] text-ink">SELFIE ✓</span>
        </div>
        <Button variant="primary" className="ml-auto">
          <Icon name="spark" size={17} color="#ffffff" />
          Buscar con IA
        </Button>
      </div>

      <div className="my-[22px] flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between lg:my-6">
        <div className="flex items-center gap-2.5">
          <Check size={18} bg={C.verified} color="#ffffff" />
          <span className="font-display text-[18px] font-semibold">14 fotos donde aparecés</span>
          <span className="hidden font-mono text-[11px] tracking-[0.06em] text-mut sm:inline">
            · ORDENADAS POR LA IA
          </span>
        </div>
        <div className="flex gap-2.5">
          <Button variant="ghost" size="sm">
            <Icon name="download" size={16} color={C.ink} />
            Descargar todas
          </Button>
          <Button variant="ghost" size="sm">
            <Icon name="share" size={16} color={C.ink} />
            Compartir álbum
          </Button>
        </div>
      </div>

      <RacePhoto {...PHOTOS[0]} featured />
      <div className="mt-3.5 grid grid-cols-2 gap-3.5 lg:grid-cols-3">
        {PHOTOS.slice(1).map((p) => (
          <RacePhoto key={p.caption} {...p} />
        ))}
      </div>

      <div className="mt-[22px] flex flex-wrap items-center gap-3 rounded-[14px] bg-mint px-[18px] py-3.5">
        <Icon name="users" size={20} color={C.tealDeep} />
        <span className="flex-1 font-display text-[14.5px] text-teal-deep">
          <b className="text-ink">Etiquetá a quien corrió con vos.</b> Le llega su
          álbum y descubre sus fotos — y de paso, su constancia.
        </span>
        <span className="font-mono text-[10px] tracking-[0.06em] text-teal-deep">
          + AÑADIR FOTO A MI CONSTANCIA
        </span>
      </div>
    </Container>
  );
}
