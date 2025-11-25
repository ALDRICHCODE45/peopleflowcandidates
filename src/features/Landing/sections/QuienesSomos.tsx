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
    <section className="flex flex-col items-center" id="creations">
      <SectionTitle
        title="Por qué confiar en nosotros"
        description="Somos más que un servicio de reclutamiento. Somos tu puente hacia oportunidades que transforman carreras."
      />

      <div
        className="flex items-center gap-4 h-100 w-full max-w-5xl mt-18 mx-auto"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {sectionData.map((data, index) => (
          <motion.div
            key={data.title}
            className={`relative group flex-grow h-[400px] rounded-xl overflow-hidden ${
              isHovered && className
                ? "hover:w-full w-56"
                : index === activeIndex
                ? "w-full"
                : "w-56"
            } ${className} ${!className ? "pointer-events-none" : ""}`}
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
              className={`absolute inset-0 flex flex-col justify-end p-10 text-white bg-black/50 transition-all duration-300 ${
                isHovered && className
                  ? "opacity-0 group-hover:opacity-100"
                  : index === activeIndex
                  ? "opacity-100"
                  : "opacity-0"
              }`}
            >
              <h1 className="text-3xl font-semibold">{data.title}</h1>
              <p className="text-sm mt-2">{data.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
