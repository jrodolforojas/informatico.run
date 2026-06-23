import type { Metadata } from "next";
import { DorsalReveal } from "@/components/inscripcion/DorsalReveal";

export const metadata: Metadata = {
  title: "¡Estás dentro! — informático.run()",
};

export default function Page() {
  return <DorsalReveal />;
}
