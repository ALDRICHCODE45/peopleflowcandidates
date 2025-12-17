"use client";
import { motion } from "framer-motion";
import SectionTitle from "../components/SectionTitle";
import Link from "next/link";
import { RainbowButton } from "@/core/components/shadcn/rainbow-button";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

export default function CallToAction() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Si no está montado aún, asumimos dark mode (defaultTheme es "dark")
  // Esto previene el flash de estilos incorrectos
  const isDark = !mounted ? true : resolvedTheme === "dark";
  return (
    <section id="testimonials" className="flex flex-col items-center">
      <SectionTitle
        title="Tu próxima oportunidad te espera"
        description="Únete a profesionales que ya confiaron en nosotros. Tu carrera merece el mejor match."
      />
      <motion.div
        className={`relative max-w-5xl py-12 md:py-20 lg:py-26 mt-12 md:mt-18 md:w-full overflow-hidden mx-2 md:mx-auto border flex flex-col items-center justify-center rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-10 text-center shadow-lg ${
          isDark
            ? "border-indigo-900 bg-gradient-to-br from-[#401B98]/5 to-[#180027]/10 text-white shadow-none"
            : "border-gray-200 bg-white text-gray-900"
        }`}
        initial={{ y: 150, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 320, damping: 70, mass: 1 }}
      >
        {/* Gradientes de fondo */}
        <div
          className={`absolute pointer-events-none top-10 -z-1 left-20 size-64 bg-gradient-to-br blur-[180px] ${
            isDark
              ? "from-[#536DFF] to-[#4F39F6]/60"
              : "from-purple-200 to-purple-100/60 opacity-40"
          }`}
        ></div>
        <div
          className={`absolute pointer-events-none bottom-10 -z-1 right-20 size-64 bg-gradient-to-br blur-[180px] ${
            isDark
              ? "from-[#536DFF] to-[#4F39F6]/60"
              : "from-purple-200 to-purple-100/60 opacity-40"
          }`}
        ></div>
        <div className="flex flex-col items-center text-center w-full">
          <a
            href="#"
            className={`group flex flex-col sm:flex-row items-center justify-center gap-2 rounded-full text-xs sm:text-sm p-1 pr-2 sm:pr-3 mx-auto ${
              isDark
                ? "text-indigo-300 bg-indigo-200/15"
                : "text-purple-700 bg-purple-50"
            }`}
          >
            <span
              className={`text-white text-xs px-3 sm:px-3.5 py-1 rounded-full ${
                isDark ? "bg-indigo-600" : "bg-purple-600"
              }`}
            >
              SEGURO
            </span>
            <p className="flex items-center gap-1">
              <span className="text-xs sm:text-sm">
                Proceso 100% confidencial y protegido{" "}
              </span>
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
                className="lucide lucide-chevron-right-icon lucide-chevron-right group-hover:translate-x-0.5 transition duration-300 hidden sm:block"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </p>
          </a>
          <h1
            className={`text-2xl sm:text-3xl md:text-3xl font-medium max-w-xl mt-4 md:mt-5 mx-auto px-4 ${
              isDark
                ? "bg-gradient-to-r from-white to-[#b6abff] text-transparent bg-clip-text"
                : "text-gray-900"
            }`}
          >
            Confiado por profesionales de élite.
          </h1>
          <p
            className={`text-sm sm:text-base max-w-lg mt-3 md:mt-4 mx-auto px-4 ${
              isDark ? "text-slate-400" : "text-gray-600"
            }`}
          >
            Miles de profesionales han confiado en nosotros para encontrar su
            próxima oportunidad. Tu información está segura y solo la usamos
            para conectarte con posiciones que realmente valen la pena.
          </p>
          <Link
            href={"#contact"}
            className="mt-3 md:mt-4 w-full sm:w-auto px-4"
          >
            <RainbowButton className="w-full sm:w-auto">
              Deja tu CV actualizado
            </RainbowButton>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
