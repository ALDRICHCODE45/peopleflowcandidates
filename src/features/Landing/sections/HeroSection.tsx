"use client";
import { motion } from "framer-motion";
import { RainbowButton } from "@/core/components/shadcn/rainbow-button";
import Link from "next/link";
import CandidateForm from "./CandidateForm";

export default function HeroSection() {
  return (
    <section id="hero" className="flex flex-col items-center -mt-18">
      <motion.svg
        className="absolute -z-10 w-full -mt-20 md:mt-0"
        width="1440"
        height="676"
        viewBox="0 0 1440 676"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <rect
          x="-92"
          y="-948"
          width="1624"
          height="1624"
          rx="812"
          fill="url(#a)"
        />
        <defs>
          <radialGradient
            id="a"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="rotate(90 428 292)scale(812)"
          >
            <stop offset=".63" stopColor="#372AAC" stopOpacity="0" />
            <stop offset="1" stopColor="#372AAC" />
          </radialGradient>
        </defs>
      </motion.svg>
      <motion.a
        className="flex items-center mt-24 md:mt-48 gap-2 border border-slate-600 text-gray-50 rounded-full px-3 py-1.5 md:px-4 md:py-2"
        initial={{ y: -20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{
          delay: 0.2,
          type: "spring",
          stiffness: 320,
          damping: 70,
          mass: 1,
        }}
      >
        <div className="size-2.5 bg-green-500 rounded-full animate-pulse"></div>
        <span className="text-xs md:text-sm">
          Tu próxima oportunidad te está esperando
        </span>
      </motion.a>
      <motion.h1
        className="text-center text-3xl leading-tight md:text-4xl md:leading-[60px] lg:text-5xl lg:leading-[70px] mt-4 font-semibold max-w-2xl px-4"
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 240, damping: 70, mass: 1 }}
      >
        Encuentra el trabajo de tus sueños completamente gratis aquí.
      </motion.h1>
      <motion.p
        className="text-center text-sm md:text-base max-w-lg mt-2 px-4"
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{
          delay: 0.2,
          type: "spring",
          stiffness: 320,
          damping: 70,
          mass: 1,
        }}
      >
        somos el enlace mas actual y{" "}
        <span className="font-bold">SIN COSTO</span> entre candidatos y las
        mejores empresas para trabajar en mexico y latam
      </motion.p>
      <motion.div
        className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mt-6 md:mt-8 w-full sm:w-auto px-4"
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 320, damping: 70, mass: 1 }}
      >
        <Link href={"#contact"} className="w-full sm:w-auto">
          <RainbowButton className="w-full sm:w-auto">Deja tu CV actualizado</RainbowButton>
        </Link>

        <a
          href="#creations"
          className="border border-slate-400 active:scale-95 hover:bg-white/10 transition rounded-lg px-6 md:px-8 h-11 flex items-center justify-center w-full sm:w-auto"
        >
          Conoce más
        </a>
      </motion.div>
      <section className="mt-8">
        <CandidateForm />
      </section>
    </section>
  );
}
