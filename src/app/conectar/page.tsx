import type { Metadata } from "next";
import { LoginConnect } from "@/components/clasificacion/LoginConnect";

export const metadata: Metadata = {
  title: "Conectá tu actividad — informático.run()",
};

export default function Page() {
  return <LoginConnect />;
}
