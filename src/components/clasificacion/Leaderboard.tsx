"use client";

import { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/landing/Container";
import { LeaderboardClassic } from "./LeaderboardClassic";
import { LeaderboardPodium } from "./LeaderboardPodium";

const VIEWS = [
  { k: "tabla", label: "Tabla" },
  { k: "podio", label: "Podio" },
] as const;

type View = (typeof VIEWS)[number]["k"];

export function Leaderboard() {
  const [view, setView] = useState<View>("tabla");
  return (
    <Container className="py-10 lg:py-12">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-full border border-line bg-white p-1">
          {VIEWS.map((v) => (
            <button
              key={v.k}
              type="button"
              onClick={() => setView(v.k)}
              className={`rounded-full px-4 py-2 font-display text-[13px] font-semibold transition ${
                view === v.k ? "bg-ink text-white" : "text-mut hover:text-ink"
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>
        <Link
          href="/conectar"
          className="font-mono text-[11px] tracking-[0.08em] text-teal-deep hover:text-teal"
        >
          CONECTÁ TU CUENTA →
        </Link>
      </div>

      {view === "tabla" ? <LeaderboardClassic /> : <LeaderboardPodium />}
    </Container>
  );
}
