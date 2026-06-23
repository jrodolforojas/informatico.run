import type { Metadata } from "next";
import { Leaderboard } from "@/components/clasificacion/Leaderboard";

export const metadata: Metadata = {
  title: "Clasificación — informático.run()",
};

export default function Page() {
  return <Leaderboard />;
}
