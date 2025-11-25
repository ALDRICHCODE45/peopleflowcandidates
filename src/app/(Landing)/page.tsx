"use client";

import CallToAction from "@/features/Landing/sections/CallToAction";
import CandidateForm from "@/features/Landing/sections/CandidateForm";
import HeroSection from "@/features/Landing/sections/HeroSection";
import NuestrosValores from "@/features/Landing/sections/NuestrosValores";
import QuienesSomos from "@/features/Landing/sections/QuienesSomos";

export default function Page() {
  return (
    <main className="px-6 md:px-16 lg:px-24 xl:px-32">
      <HeroSection />
      <QuienesSomos />
      <NuestrosValores />
      <CallToAction />
      <CandidateForm />
    </main>
  );
}
