import type { Metadata } from "next";
import { LoginConnect } from "@/components/clasificacion/LoginConnect";

export const metadata: Metadata = {
  title: "Conectá tu actividad — informático.run()",
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  return <LoginConnect next={next} />;
}
