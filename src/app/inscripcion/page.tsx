import type { Metadata } from "next";
import { InscripcionForm } from "@/components/inscripcion/InscripcionForm";

export const metadata: Metadata = {
  title: "Inscripción — informático.run()",
};

export default function Page() {
  return <InscripcionForm />;
}
