import type { Metadata } from "next";
import { PhotoFinder } from "@/components/fotos/PhotoFinder";

export const metadata: Metadata = {
  title: "Fotos de la edición — informático.run()",
};

export default function Page() {
  return <PhotoFinder />;
}
