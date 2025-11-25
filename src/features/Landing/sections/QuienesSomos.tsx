"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import SectionTitle from "../components/SectionTitle";

export default function QuienesSomos() {
  const [isHovered, setIsHovered] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [className, setClassName] = useState("");

  const sectionData = [
    {
      title: "Confidencialidad absoluta",
      description:
        "Tus datos están protegidos con los más altos estándares de seguridad. Solo compartimos tu perfil con oportunidades que realmente valen la pena.",
      image: "/landing/persona1.png",
      align: "object-center",
    },
    {
      title: "Red de oportunidades exclusivas",
      description:
        "Acceso a posiciones que no encontrarás en portales públicos. Conectamos con empresas líderes que buscan talento excepcional.",
      image: "/landing/persona2.png",
      align: "object-right",
    },
    {
      title: "Experiencia comprobada",
      description:
        "Años especializándonos en tech y posiciones C-level. Conocemos el mercado, entendemos tu perfil y sabemos dónde encajas mejor.",
      image: "/landing/persona3.png",
      align: "object-center",
    },
  ];

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % sectionData.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isHovered, sectionData.length]);

  return (
    <section className="flex flex-col items-center w-full px-4" id="creations">
      <SectionTitle
        title="Por qué confiar en nosotros"
        description="Somos más que un servicio de reclutamiento. Somos tu puente hacia oportunidades que transforman carreras."
      />

      <div
        className="flex flex-col lg:flex-row items-stretch gap-4 w-full max-w-5xl mt-14 mx-auto"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {sectionData.map((data, index) => {
          const isActive = index === activeIndex;
          const widthClasses =
            isHovered && className
              ? "md:w-56 md:hover:w-full"
              : isActive
              ? "md:w-full"
              : "md:w-56";
          const infoLayerVisibility =
            isHovered && className
              ? "md:opacity-0 md:group-hover:opacity-100"
              : isActive
              ? "md:opacity-100"
              : "md:opacity-0";

          return (
            <motion.div
              key={data.title}
              className={`relative group flex-grow h-[320px] sm:h-[360px] md:h-[420px] w-full rounded-2xl overflow-hidden bg-slate-900/40 border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur ${
                className || ""
              } ${widthClasses} ${
                !className ? "pointer-events-none" : ""
              } transition-all duration-500`}
              initial={{ y: 150, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              onAnimationComplete={() =>
                setClassName("transition-all duration-500")
              }
              transition={{
                delay: index * 0.15,
                type: "spring",
                stiffness: 320,
                damping: 70,
                mass: 1,
              }}
            >
              <img
                className={`h-full w-full object-cover ${data.align}`}
                src={data.image}
                alt={data.title}
              />
              <div
                className={`absolute inset-0 flex flex-col justify-end gap-2 p-6 sm:p-8 text-white bg-gradient-to-t from-black/85 via-black/35 to-transparent opacity-100 ${infoLayerVisibility}`}
              >
                <h1 className="text-2xl sm:text-3xl font-semibold leading-tight">
                  {data.title}
                </h1>
                <p className="text-sm sm:text-base text-slate-200/90">
                  {data.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
