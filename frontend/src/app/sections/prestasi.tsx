"use client";

import Image from "next/image";
import { useLang } from "../components/LangContext";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

type PrestasiItem = {
  id: number;
  poster: string;
};

export default function Prestasi() {
  const { lang } = useLang();
  const [items, setItems] = useState<PrestasiItem[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  // === Ambil data dari route API internal ===
  useEffect(() => {
    fetch("/api/portal/prestasi/public", { cache: "no-store" })
      .then((r) => r.json())
      .then((j) => {
        const data = j?.data ?? [];
        setItems(data.slice(0, 2)); // ambil 2 teratas
      })
      .catch((e) => console.error("Gagal memuat data prestasi:", e));
  }, []);

  // === Animasi muncul saat scroll ===
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => entry.isIntersecting && setIsVisible(true)),
      { threshold: 0.2 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <section
        id="prestasi"
        ref={sectionRef}
        className="relative overflow-hidden py-24 md:py-28 bg-white"
      >
        {/* BG miring */}
        <div className="absolute top-120 left-0 right-0 h-100 bg-[#FE4D01] transform -skew-y-6 origin-top-left z-0" />

        <div className="relative z-10 container mx-auto px-6 md:px-12 lg:px-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col md:flex-row items-start gap-10"
          >
            {/* === Kiri text === */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isVisible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="md:w-1/2"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-[#FE4D01] mb-4">
                {lang === "id" ? "Prestasi" : "Achievements"}
              </h2>
              <p className="text-[#243771] text-sm md:text-base leading-relaxed">
                {lang === "id"
                  ? "Dari berbagai macam program keahlian yang ada, lahirlah berbagai prestasi yang membanggakan nama sekolah. Namun, tidak hanya dari bidang akademik. Bidang non akademik juga sama membanggakannya."
                  : "From various expertise programs, numerous achievements have brought pride to our school. These accomplishments come not only from academic areas but also from non-academic fields that are equally outstanding."}
              </p>
            </motion.div>

            {/* === Kanan: card dari API (tanpa carousel) + tombol di bawahnya === */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isVisible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="md:w-1/2 flex flex-col items-center md:items-end"
            >
              <div className="flex flex-wrap gap-6 items-center justify-center md:justify-end">
                {items.length > 0 ? (
                  items.map((img) => (
                    <div
                      key={img.id}
                      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition w-[260px] h-[340px] sm:w-[280px] sm:h-[360px] md:w-[295px] md:h-[369px]"
                    >
                      <Image
                        src={
                          img.poster.startsWith("http")
                            ? img.poster
                            : `/storage/${img.poster}`
                        }
                        alt={`Prestasi ${img.id}`}
                        width={295}
                        height={369}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center">
                    {lang === "id"
                      ? "Memuat data prestasi..."
                      : "Loading achievements..."}
                  </p>
                )}
              </div>

              {/* Tombol Selengkapnya */}
              <div className="mt-8 w-full flex justify-center md:justify-end">
                <a
                  href="/kehidupan-siswa/prestasi"
                  className="inline-block px-8 py-3 md:px-10 md:py-3.5 rounded-lg bg-[#243771] text-white text-sm md:text-base font-semibold shadow-[0_4px_10px_rgba(0,0,0,0.2)] hover:shadow-[0_6px_14px_rgba(0,0,0,0.25)] hover:bg-[#1a2a5c] transition-all duration-300 text-center"
                >
                  {lang === "id" ? "Selengkapnya" : "More"}
                </a>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* === Section Gedung Responsif === */}
      <section className="relative w-full bg-[#FE4D01] overflow-hidden">
        <div className="relative w-full h-[40vh] sm:h-[55vh] lg:h-screen">
          <Image
            src="/svg/gedung.svg"
            alt={
              lang === "id"
                ? "Gedung SMK Prestasi Prima"
                : "Prestasi Prima Building"
            }
            fill
            priority
            sizes="0vw"
            className="object-contain md:object-cover object-center"
          />

          <div className="absolute inset-0 flex items-center justify-center z-20 p-4 sm:p-6">
            <div className="bg-[#243771]/95 rounded-[20px] sm:rounded-[25px] flex flex-col items-center justify-center text-center px-6 sm:px-10 py-10 sm:py-12 w-full max-w-[1000px] min-h-[300px] sm:min-h-[380px] md:min-h-[444px]">
              <img
                src="/webp/smk.webp"
                alt="SMK Prestasi Prima Logo"
                className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 mb-4 sm:mb-5 object-contain"
              />
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 sm:mb-3">
                {lang === "id"
                  ? "Mulai Pengalaman Virtual"
                  : "Start Your Virtual Experience"}
              </h2>
              <p className="text-white/90 text-xs sm:text-sm md:text-base max-w-[700px] leading-relaxed mb-5 sm:mb-6 px-2">
                {lang === "id"
                  ? "Ikuti tur virtual kami untuk melihat SMK Prestasi Prima kapan saja dan di mana saja."
                  : "Join our virtual tour to explore SMK Prestasi Prima anytime and anywhere."}
              </p>
              <a
                href="/virtual-tour"
                className="inline-block px-5 sm:px-6 py-2.5 sm:py-3 rounded-[8px] sm:rounded-[10px] bg-white text-[#243771] font-semibold text-xs sm:text-sm md:text-base shadow-[0_4px_10px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_14px_rgba(254,77,1,0.3)] transition"
              >
                {lang === "id"
                  ? "TUR VIRTUAL SEKOLAH"
                  : "SCHOOL VIRTUAL TOUR"}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
