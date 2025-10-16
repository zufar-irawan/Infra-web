"use client";

import { useLang } from "../components/LangContext";
import { motion } from "framer-motion";
import { useState } from "react";

interface JurusanProps {
  hideDecoration?: boolean;
}

export default function Jurusan({ hideDecoration = false }: JurusanProps) {
  const { lang } = useLang();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const items = [
    {
      img: "/svg/dkv.jpg",
      logo: "/svg/logodkv.svg",
      title_id: "Desain Komunikasi Visual",
      title_en: "Visual Communication Design",
    },
    {
      img: "/svg/bcf.jpg",
      logo: "/svg/logobc.svg",
      title_id: "Broadcasting dan Film",
      title_en: "Broadcasting and Film",
    },
    {
      img: "/svg/rpl.jpg",
      logo: "/svg/logopplg.svg",
      title_id: "Pengembangan Perangkat Lunak dan Gim",
      title_en: "Software & Game Development",
    },
    {
      img: "/svg/tkj.jpg",
      logo: "/svg/logotjkt.svg",
      title_id: "Teknik Jaringan Komputer dan Telekomunikasi",
      title_en: "Computer & Telecommunication Network",
    },
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: i * 0.2,
        duration: 0.8,
        ease: "easeOut",
      },
    }),
  };

  return (
    <section id="jurusan" className="relative py-30 bg-white overflow-hidden">
      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        {/* Title */}
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="text-[#FE4D01]">
            {lang === "id" ? "Program Keahlian" : "Expertise Programs"}
          </span>
        </motion.h2>

        <motion.p
          className="text-center text-gray-600 max-w-3xl mx-auto mt-3 mb-12 text-sm md:text-base leading-relaxed"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          {lang === "id"
            ? "Program keahlian ini dirancang untuk membekali siswa dengan keterampilan spesifik dan pengetahuan praktis yang relevan dengan kebutuhan dunia kerja saat ini, menggabungkan teori dengan praktik intensif."
            : "These programs are designed to equip students with specific skills and practical knowledge relevant to today's job market, combining theory with intensive practice."}
        </motion.p>

        {/* Cards */}
        <div className="flex flex-col sm:flex-row items-stretch gap-3 sm:gap-4 h-[400px] w-full max-w-6xl mx-auto">
          {items.map((item, i) => (
            <motion.div
              key={i}
              className="relative group flex-grow transition-all duration-500 ease-in-out rounded-xl overflow-hidden hover:flex-[3] flex-[1] cursor-pointer shadow-lg hover:shadow-2xl"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={cardVariants}
              custom={i}
              onClick={() =>
                setActiveIndex(activeIndex === i ? null : i)
              }
            >
              {/* Gambar */}
              <img
                src={item.img}
                alt={lang === "id" ? item.title_id : item.title_en}
                className="h-[400px] w-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:brightness-105"
              />

              {/* Overlay */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-6 flex flex-col items-center justify-end text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.3 + 0.5, duration: 0.7 }}
              >
                {/* ✅ Logo */}
                <img
                  src={item.logo}
                  alt="Logo Jurusan"
                  className={`
                    w-16 h-16 mb-3 object-contain transition-all duration-500
                    opacity-0 scale-75           /* default: hilang (termasuk mobile) */
                    group-hover:opacity-100 group-hover:scale-100  /* hover: muncul */
                    ${activeIndex === i ? "opacity-100 scale-100" : ""}
                    sm:opacity-100 sm:scale-100   /* desktop selalu muncul */
                  `}
                />

                <h3 className="text-white font-semibold text-sm md:text-base leading-tight">
                  {lang === "id" ? item.title_id : item.title_en}
                </h3>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Dekorasi kotak biru */}
      {!hideDecoration && (
        <>
          <motion.div
            className="absolute top-0 left-0 w-[50px] h-[50px] bg-[#243771] z-10"
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          />
          <motion.div
            className="absolute top-12 left-12 w-[50px] h-[50px] bg-[#243771] z-10"
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          />
        </>
      )}
    </section>
  );
}
