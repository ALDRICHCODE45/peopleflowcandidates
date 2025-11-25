"use client";

import CallToAction from "@/features/Landing/sections/CallToAction";
import CandidateForm from "@/features/Landing/sections/CandidateForm";
import HeroSection from "@/features/Landing/sections/HeroSection";
import NuestrosValores from "@/features/Landing/sections/NuestrosValores";
import QuienesSomos from "@/features/Landing/sections/QuienesSomos";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "PeopleFlow Candidates",
  description:
    "PeopleFlow Candidates es un servicio especializado de headhunting para perfiles tech y posiciones C-level. Conectamos talento excepcional con oportunidades extraordinarias, garantizando confidencialidad y resultados.",
};

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
