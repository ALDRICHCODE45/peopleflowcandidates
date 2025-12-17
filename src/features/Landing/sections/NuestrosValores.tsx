"use client";
import { motion } from "framer-motion";
import SectionTitle from "../components/SectionTitle";

export default function NuestrosValores() {
  const sectionData = [
    {
      title: "Privacidad garantizada",
      description:
        "Tu información es confidencial. Solo la compartimos cuando tú lo autorizas y con empresas que realmente te interesan.",
      image:
        "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/aboutSection/flashEmoji.png",
      className:
        "py-10 border-b border-slate-700 md:py-0 md:border-r md:border-b-0 md:px-10",
    },
    {
      title: "Especialización en tech y C-level",
      description:
        "Conocemos a fondo el mercado tecnológico y las posiciones ejecutivas. Sabemos qué buscan las empresas y qué necesitas tú.",
      image:
        "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/aboutSection/colorsEmoji.png",
      className:
        "py-10 border-b border-slate-700 md:py-0 lg:border-r md:border-b-0 md:px-10",
    },
    {
      title: "Proceso personalizado",
      description:
        "No eres un número. Analizamos tu perfil, entendemos tus aspiraciones y te conectamos con oportunidades que realmente encajan contigo.",
      image:
        "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/aboutSection/puzzelEmoji.png",
      className:
        "py-10 border-b border-slate-700 md:py-0 md:border-b-0 md:px-10",
    },
  ];
  return (
    <section className="flex flex-col items-center" id="about">
      <SectionTitle
        title="Nuestros valores"
        description="La confianza se construye con transparencia, especialización y resultados. Estos son los pilares que nos definen."
      />
      <div className="relative max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-8 md:px-0 mt-18">
        {sectionData.map((data, index) => (
          <motion.div
            key={data.title}
            className={data.className.replace('border-slate-700', 'border-gray-200')}
            initial={{ y: 150, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{
              delay: index * 0.15,
              type: "spring",
              stiffness: 320,
              damping: 70,
              mass: 1,
            }}
          >
            <div className="size-10 p-2 bg-pink-100 dark:bg-indigo-600/20 border border-pink-200 dark:border-indigo-600/30 rounded">
              <img src={data.image} alt="" />
            </div>
            <div className="mt-5 space-y-2">
              <h3 className="text-base font-medium text-gray-900 dark:text-slate-200">
                {data.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-slate-400">{data.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
