"use client";
import { motion } from "framer-motion";
import SectionTitle from "../components/SectionTitle";
import Link from "next/link";
import { RainbowButton } from "@/core/components/shadcn/rainbow-button";

export default function CallToAction() {
  return (
    <section id="testimonials" className="flex flex-col items-center">
      <SectionTitle
        title="Tu próxima oportunidad te espera"
        description="Únete a profesionales que ya confiaron en nosotros. Tu carrera merece el mejor match."
      />
      <motion.div
        className="relative max-w-5xl py-20 md:py-26 mt-18 md:w-full overflow-hidden mx-2 md:mx-auto border border-indigo-900 flex flex-col items-center justify-center bg-gradient-to-br from-[#401B98]/5 to-[#180027]/10 rounded-3xl p-4 md:p-10 text-white text-center"
        initial={{ y: 150, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 320, damping: 70, mass: 1 }}
      >
        <div className="absolute pointer-events-none top-10 -z-1 left-20 size-64 bg-gradient-to-br from-[#536DFF] to-[#4F39F6]/60 blur-[180px]"></div>
        <div className="absolute pointer-events-none bottom-10 -z-1 right-20 size-64 bg-gradient-to-br from-[#536DFF] to-[#4F39F6]/60 blur-[180px]"></div>
        <div className="flex flex-col items-center text-center w-full">
          <a
            href="#"
            className="group flex items-center justify-center gap-2 rounded-full text-sm p-1 pr-3 text-indigo-300 bg-indigo-200/15 mx-auto"
          >
            <span className="bg-indigo-600 text-white text-xs px-3.5 py-1 rounded-full">
              SEGURO
            </span>
            <p className="flex items-center gap-1">
              <span>Proceso 100% confidencial y protegido </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-chevron-right-icon lucide-chevron-right group-hover:translate-x-0.5 transition duration-300"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </p>
          </a>
          <h1 className="text-3xl font-medium max-w-xl mt-5 bg-gradient-to-r from-white to-[#b6abff] text-transparent bg-clip-text mx-auto">
            Confiado por profesionales de élite.
          </h1>
          <p className="text-base text-slate-400 max-w-lg mt-4 mx-auto">
            Miles de profesionales han confiado en nosotros para encontrar su
            próxima oportunidad. Tu información está segura y solo la usamos
            para conectarte con posiciones que realmente valen la pena.
          </p>
          <Link href={"#contact"} className="mt-3">
            <RainbowButton>Deja tu CV actualizado</RainbowButton>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
