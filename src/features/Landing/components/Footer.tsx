"use client";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <motion.footer
      className="px-4 md:px-16 lg:px-24 xl:px-32 w-full text-sm text-gray-600 dark:text-gray-400 mt-20 md:mt-40"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1 }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-14">
        <div className="sm:col-span-2 lg:col-span-1">
          <a href="#hero">
            <Image
              src="/candidateslogo.webp"
              width={180}
              height={40}
              alt="logo"
              className="w-[140px] h-auto md:w-[180px] lg:w-[230px] logo-invert"
            />
          </a>
          <p className="text-sm/7 mt-4 md:mt-6 text-gray-600 dark:text-gray-400">
            People Flow Candidates es un servicio especializado de headhunting
            para perfiles tech y posiciones C-level. Conectamos talento
            excepcional con oportunidades extraordinarias, garantizando
            confidencialidad y resultados.
          </p>
        </div>
        <div className="flex flex-col lg:items-center lg:justify-center">
          <div className="flex flex-col text-sm space-y-2.5">
            <h2 className="font-semibold mb-4 md:mb-5 text-gray-900 dark:text-white">
              Enlaces de interés.
            </h2>
            <a
              className="hover:text-pink-600 dark:hover:text-slate-500 transition text-gray-600 dark:text-gray-400"
              href="#creations"
            >
              Sobre nosotros
            </a>
            <a
              className="hover:text-pink-600 dark:hover:text-slate-500 transition text-gray-600 dark:text-gray-400"
              href="#about"
            >
              Cómo funciona
            </a>
            <a
              className="hover:text-pink-600 dark:hover:text-slate-500 transition text-gray-600 dark:text-gray-400"
              href="#contact"
            >
              Contáctanos
            </a>
            <a
              className="hover:text-pink-600 dark:hover:text-slate-500 transition text-gray-600 dark:text-gray-400"
              href="#"
            >
              Política de privacidad
            </a>
          </div>
        </div>
      </div>
      <p className="py-4 text-center border-t mt-6 border-gray-200 dark:border-gray-800 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
        Copyright 2025 ©{" "}
        <a
          href="#hero"
          className="hover:text-pink-600 dark:hover:text-slate-300 transition text-gray-900 dark:text-white"
        >
          People Flow Candidates
        </a>{" "}
        Todos los derechos reservados.
      </p>
    </motion.footer>
  );
}
