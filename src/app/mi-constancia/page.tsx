import type { Metadata } from "next";
import { CredencialStates } from "@/components/constancia/CredencialStates";
import { Customizer } from "@/components/constancia/Customizer";

export const metadata: Metadata = {
  title: "Mi constancia — informático.run()",
};

export default function Page() {
  return (
    <>
      <CredencialStates />
      <Customizer />
    </>
  );
}
