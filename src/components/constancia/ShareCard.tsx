import { Mark } from "@/components/ui/Mark";
import { Check } from "@/components/ui/Check";
import { TagVerified } from "@/components/ui/TagVerified";
import { C } from "@/lib/tokens";

type ShareCardData = { time: string; pace: string; dist: string };

type ShareCardProps = {
  template?: "dark" | "light" | "block";
  accent?: string;
  dorsal?: string;
  phrase?: string;
  ratio?: "square" | "story";
  data?: ShareCardData;
};

function Stats({
  pace,
  dorsal,
  dist,
  mutColor,
  accentPos,
}: {
  pace: string;
  dorsal: string;
  dist: string;
  mutColor: string;
  accentPos: string;
}) {
  return (
    <div className="flex" style={{ gap: "9%", marginTop: "4%" }}>
      <div>
        <div className="font-mono font-bold" style={{ fontSize: "5.5cqw" }}>
          {pace}
          <span style={{ fontSize: "2.8cqw", color: mutColor }}>/km</span>
        </div>
        <div
          className="font-mono"
          style={{ fontSize: "2.2cqw", letterSpacing: "0.1em", color: mutColor, marginTop: 2 }}
        >
          RITMO
        </div>
      </div>
      <div>
        <div className="font-mono font-bold" style={{ fontSize: "5.5cqw", color: accentPos }}>
          {dorsal}
        </div>
        <div
          className="font-mono"
          style={{ fontSize: "2.2cqw", letterSpacing: "0.1em", color: mutColor, marginTop: 2 }}
        >
          POSICIÓN
        </div>
      </div>
      <div>
        <div className="font-mono font-bold" style={{ fontSize: "5.5cqw" }}>
          {dist}
        </div>
        <div
          className="font-mono"
          style={{ fontSize: "2.2cqw", letterSpacing: "0.1em", color: mutColor, marginTop: 2 }}
        >
          DISTANCIA
        </div>
      </div>
    </div>
  );
}

export function ShareCard({
  template = "dark",
  accent = C.teal,
  dorsal = "#42",
  phrase = "Mi primer 5K, verificado.",
  ratio = "square",
  data,
}: ShareCardProps) {
  const d = data ?? { time: "21:37", pace: "4:19", dist: "5K" };
  const isStory = ratio === "story";
  const pad = isStory ? "8% 8%" : "8%";
  const timeSize = isStory ? "23cqw" : "20cqw";
  const markSize = isStory ? 30 : 28;
  const [tMin, tSec] = d.time.split(":");
  const footer = `${phrase ? `"${phrase}"` : "TX 7a3f…d29c"} · #YoCorríInformático`;

  if (template === "light") {
    return (
      <div
        className="flex h-full w-full flex-col justify-between font-display text-ink"
        style={{ containerType: "size", background: C.paper, padding: pad }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center" style={{ gap: 8 }}>
            <Mark size={markSize} tile={accent} />
            <span className="font-display font-bold" style={{ fontSize: "4cqw", letterSpacing: "-0.035em" }}>
              informático<span style={{ color: accent }}>.run()</span>
            </span>
          </div>
          <TagVerified />
        </div>
        <div>
          <div className="flex items-center" style={{ gap: "2.5%" }}>
            <div
              style={{ width: "1.6%", minWidth: 5, alignSelf: "stretch", background: accent, borderRadius: 99 }}
            />
            <div>
              <div
                className="font-mono"
                style={{ fontSize: "2.8cqw", letterSpacing: "0.16em", color: C.mut }}
              >
                MI TIEMPO OFICIAL · {d.dist}
              </div>
              <div
                className="font-mono font-bold"
                style={{ fontSize: timeSize, letterSpacing: "-0.05em", lineHeight: 0.88, marginTop: "2%", color: C.ink }}
              >
                {tMin}
                <span style={{ color: accent }}>:</span>
                {tSec}
              </div>
            </div>
          </div>
          <Stats pace={d.pace} dorsal={dorsal} dist={d.dist} mutColor={C.mut} accentPos={C.tealDeep} />
        </div>
        <div className="font-mono" style={{ fontSize: "2.3cqw", color: C.mut, lineHeight: 1.6 }}>
          {footer}
        </div>
      </div>
    );
  }

  if (template === "block") {
    return (
      <div
        className="flex h-full w-full flex-col justify-between font-display"
        style={{ containerType: "size", background: accent, color: C.navy, padding: pad }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center" style={{ gap: 8 }}>
            <Mark size={markSize} tile={C.navy} glyph={accent} />
            <span
              className="font-display font-bold"
              style={{ fontSize: "4cqw", letterSpacing: "-0.035em", color: C.navy }}
            >
              informático.run()
            </span>
          </div>
          <span
            className="inline-flex items-center"
            style={{ gap: 5, background: "rgba(11,20,48,0.12)", borderRadius: 999, padding: "4px 9px" }}
          >
            <Check size={12} bg={C.navy} color={accent} />
            <span className="font-mono" style={{ fontSize: "2cqw", color: C.navy, letterSpacing: "0.06em" }}>
              VERIFICADO
            </span>
          </span>
        </div>
        <div>
          <div
            className="font-mono"
            style={{ fontSize: "2.8cqw", letterSpacing: "0.16em", color: "rgba(11,20,48,0.7)" }}
          >
            MI TIEMPO OFICIAL · {d.dist}
          </div>
          <div
            className="font-mono font-bold"
            style={{ fontSize: timeSize, letterSpacing: "-0.05em", lineHeight: 0.88, marginTop: "2%" }}
          >
            {d.time}
          </div>
          <Stats pace={d.pace} dorsal={dorsal} dist={d.dist} mutColor="rgba(11,20,48,0.6)" accentPos={C.navy} />
        </div>
        <div className="font-mono" style={{ fontSize: "2.3cqw", color: "rgba(11,20,48,0.7)", lineHeight: 1.6 }}>
          {footer}
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex h-full w-full flex-col justify-between font-display text-white"
      style={{ containerType: "size", background: C.navy, padding: pad }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center" style={{ gap: 8 }}>
          <Mark size={markSize} tile={accent} glyph={C.navy} />
          <span className="font-display font-bold" style={{ fontSize: "4cqw", letterSpacing: "-0.035em" }}>
            informático<span style={{ color: accent }}>.run()</span>
          </span>
        </div>
        <span
          className="inline-flex items-center"
          style={{
            gap: 5,
            background: "rgba(43,224,204,0.13)",
            border: "1px solid rgba(43,224,204,0.4)",
            borderRadius: 999,
            padding: "4px 9px",
          }}
        >
          <Check size={12} bg={accent} color={C.navy} />
          <span className="font-mono" style={{ fontSize: "2cqw", color: accent, letterSpacing: "0.06em" }}>
            VERIFICADO
          </span>
        </span>
      </div>
      <div>
        <div className="font-mono" style={{ fontSize: "2.8cqw", letterSpacing: "0.16em", color: "#7f8da0" }}>
          MI TIEMPO OFICIAL · {d.dist}
        </div>
        <div
          className="font-mono font-bold"
          style={{ fontSize: timeSize, letterSpacing: "-0.05em", lineHeight: 0.88, marginTop: "2%" }}
        >
          {tMin}
          <span style={{ color: accent }}>:</span>
          {tSec}
        </div>
        <Stats pace={d.pace} dorsal={dorsal} dist={d.dist} mutColor="#7f8da0" accentPos={accent} />
      </div>
      <div className="font-mono" style={{ fontSize: "2.3cqw", color: "#7f8da0", lineHeight: 1.6 }}>
        {footer}
      </div>
    </div>
  );
}
