import { Hero } from "@/components/landing/Hero";
import { Distances } from "@/components/landing/Distances";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { ShareOnChain } from "@/components/landing/ShareOnChain";
import { MedalSection } from "@/components/landing/MedalSection";
import { Referral } from "@/components/landing/Referral";
import { Sponsors } from "@/components/landing/Sponsors";
import { FinalCTA } from "@/components/landing/FinalCTA";

export default function Home() {
  return (
    <>
      <Hero />
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
