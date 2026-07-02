import { Hero } from "@/components/landing/Hero";
import { Distances } from "@/components/landing/Distances";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { ShareOnChain } from "@/components/landing/ShareOnChain";
import { MedalSection } from "@/components/landing/MedalSection";
import { Referral } from "@/components/landing/Referral";
import { Sponsors } from "@/components/landing/Sponsors";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { getSocialProof } from "@/lib/social-proof";

export const revalidate = 60;

function daysUntil(iso: string | null | undefined) {
  if (!iso) return null;
  const target = new Date(`${iso}T00:00:00`).getTime();
  if (Number.isNaN(target)) return null;
  return Math.max(Math.ceil((target - Date.now()) / 86_400_000), 0);
}

export default async function Home() {
  const sp = await getSocialProof();
  return (
    <>
      <Hero
        registered={sp?.registered}
        capacity={sp?.capacity}
        eventDate={sp?.eventDate}
        daysLeft={daysUntil(sp?.eventDate)}
      />
      <Distances />
      <HowItWorks />
      <ShareOnChain />
      <MedalSection />
      <Referral />
      <Sponsors />
      <FinalCTA />
    </>
  );
}
