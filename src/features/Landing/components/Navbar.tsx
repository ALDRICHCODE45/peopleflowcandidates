"use client";

import { useState } from "react";
import { MenuIcon, XIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { RainbowButton } from "@/core/components/shadcn/rainbow-button";
import { ThemeToogle } from "@/core/components/ThemeToogle";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navlinks = [
    {
      href: "#creations",
      text: "Por qué confiar",
    },
    {
      href: "#about",
      text: "Nuestros valores",
    },
    {
      href: "#contact",
      text: "Contacto",
    },
  ];
  return (
    <>
      <motion.nav
        className="sticky top-0 z-50 flex items-center justify-between w-full h-18 px-4 md:px-16 lg:px-24 xl:px-32 backdrop-blur bg-white/80 dark:bg-black/80 border-b border-gray-200 dark:border-gray-800"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1 }}
      >
        <Link href="#hero">
          <Image
            src="/candidateslogo.webp"
            width={180}
            height={40}
            alt="logo"
            className="w-[140px] h-auto md:w-[180px] lg:w-[230px] logo-invert"
          />
        </Link>

        <div className="hidden lg:flex items-center gap-8 transition duration-500">
          {navlinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-purple-600 dark:hover:text-slate-300 text-gray-700 dark:text-gray-300 transition font-medium"
            >
              {link.text}
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <ThemeToogle />
          <Link href={"#contact"}>
            <RainbowButton>Deja tu CV actualizado</RainbowButton>
          </Link>
          <a
            href="#creations"
            className="hover:bg-gray-50 dark:hover:bg-slate-300/20 transition px-6 py-2 border border-gray-300 dark:border-slate-400 text-gray-900 dark:text-gray-50 bg-white dark:bg-transparent rounded-md active:scale-95 inline-block font-medium"
          >
            Conoce más
          </a>
        </div>
        <div className="lg:hidden flex items-center gap-2">
          <ThemeToogle />
          <button
            onClick={() => setIsMenuOpen(true)}
            className="active:scale-90 transition text-gray-900 dark:text-white"
          >
            <MenuIcon className="size-6.5" />
          </button>
        </div>
      </motion.nav>
      <div
        className={`fixed inset-0 z-[100] bg-white/95 dark:bg-black/95 backdrop-blur flex flex-col items-center justify-center text-lg gap-8 lg:hidden transition-transform duration-400 ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {navlinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setIsMenuOpen(false)}
            className="text-gray-900 dark:text-white hover:text-pink-600 dark:hover:text-pink-400"
          >
            {link.text}
          </Link>
        ))}
        <button
          onClick={() => setIsMenuOpen(false)}
          className="active:ring-3 active:ring-gray-300 dark:active:ring-gray-700 aspect-square size-10 p-1 items-center justify-center bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition text-gray-900 dark:text-white rounded-md flex"
        >
          <XIcon />
        </button>
      </div>
    </>
  );
}
