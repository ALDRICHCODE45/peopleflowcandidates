"use client";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <motion.footer
      className="px-6 md:px-16 lg:px-24 xl:px-32 w-full text-sm text-slate-400 mt-40"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1 }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-14">
        <div className="sm:col-span-2 lg:col-span-1">
          <a href="#hero">
            <Image
              src="/candidateslogo.webp"
              width={230}
              height={50}
              alt="logo"
            />
          </a>
          <p className="text-sm/7 mt-6">
            People Flow Candidates es un servicio especializado de headhunting
            para perfiles tech y posiciones C-level. Conectamos talento
            excepcional con oportunidades extraordinarias, garantizando
            confidencialidad y resultados.
          </p>
        </div>
        <div className="flex flex-col lg:items-center lg:justify-center">
          <div className="flex flex-col text-sm space-y-2.5">
            <h2 className="font-semibold mb-5 text-white">Empresa</h2>
            <a className="hover:text-slate-500 transition" href="#creations">
              Sobre nosotros
            </a>
            <a className="hover:text-slate-500 transition" href="#about">
              Cómo funciona
            </a>
            <a className="hover:text-slate-500 transition" href="#contact">
              Contáctanos
            </a>
            <a className="hover:text-slate-500 transition" href="#">
              Política de privacidad
            </a>
          </div>
        </div>
        <div>
          <h2 className="font-semibold text-white mb-5">
            Recibe oportunidades exclusivas
          </h2>
          <div className="text-sm space-y-6 max-w-sm">
            <p>
              Déjanos tu email y te notificaremos cuando tengamos una posición
              que encaje perfectamente con tu perfil.
            </p>
            <div className="flex items-center justify-center gap-2 p-2 rounded-md bg-slate-900">
              <input
                className="outline-none w-full max-w-64 py-2 rounded px-2"
                type="email"
                placeholder="Tu email"
              />
              <button className="bg-indigo-600 px-4 py-2 text-white rounded">
                Suscribirse
              </button>
            </div>
          </div>
        </div>
      </div>
      <p className="py-4 text-center border-t mt-6 border-slate-700">
        Copyright 2025 ©{" "}
        <a href="#hero" className="hover:text-slate-300 transition">
          People Flow Candidates
        </a>{" "}
        Todos los derechos reservados.
      </p>
    </motion.footer>
  );
}
