"use client";

import Image from "next/image";
import { useLang } from "../components/LangContext";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Prestasi() {
  const { lang } = useLang();
  const [current, setCurrent] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const autoSlideRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartX = useRef<number | null>(null);

  const achievements = [
    { img: "/svg/1.svg", title: "Prestasi1" },
    { img: "/svg/2.svg", title: "Prestasi2" },
    { img: "/svg/4.svg", title: "Prestasi3" },
  ];

  // === animasi muncul saat scroll ===
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => e.isIntersecting && setIsVisible(true)),
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // === autoplay
  useEffect(() => {
    autoSlideRef.current = setInterval(() => {
      setCurrent((p) => (p + 1) % achievements.length);
    }, 4000);
    return () => autoSlideRef.current && clearInterval(autoSlideRef.current);
  }, []);

  const nextSlide = () =>
    setCurrent((p) => (p + 1) % achievements.length);
  const prevSlide = () =>
    setCurrent((p) => (p - 1 + achievements.length) % achievements.length);

  const handleTouchStart = (e: React.TouchEvent) =>
    (touchStartX.current = e.touches[0].clientX);

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(diff) > 50) diff > 0 ? prevSlide() : nextSlide();
    touchStartX.current = null;
  };

  // posisi card desktop
  const desktopPos = (diff: number) => {
    if (diff === 0) return { x: 0, scale: 1.1, opacity: 1, z: 20 };
    if (diff === 1) return { x: 320, scale: 0.9, opacity: 0.7, z: 10 };
    if (diff === achievements.length - 1)
      return { x: -320, scale: 0.9, opacity: 0.7, z: 10 };
    return { x: 0, scale: 0.7, opacity: 0, z: 0 };
  };

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
                  : "From various expertise programs, achievements were born that make the school proud. Not only in academics but also in non-academic fields."}
              </p>
            </motion.div>

            {/* === Kanan carousel === */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isVisible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="md:w-1/2 flex flex-col items-center justify-center relative"
            >
              {/* desktop carousel */}
              <div className="hidden md:flex relative w-full h-[380px] items-center justify-center overflow-hidden">
                {achievements.map((item, i) => {
                  const diff =
                    (i - current + achievements.length) % achievements.length;
                  const pos = desktopPos(diff);
                  return (
                    <motion.div
                      key={i}
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                      animate={{
                        x: pos.x,
                        scale: pos.scale,
                        opacity: pos.opacity,
                      }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      style={{ zIndex: pos.z }}
                    >
                      <motion.div
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition"
                        style={{ width: "295px", height: "369px" }}
                      >
                        <Image
                          src={item.img}
                          alt={item.title}
                          width={295}
                          height={369}
                          className="object-cover w-full h-full"
                        />
                      </motion.div>
                    </motion.div>
                  );
                })}
              </div>

              {/* mobile carousel */}
              <div className="relative md:hidden flex flex-col items-center justify-center w-full">
                <div
                  className="w-[295px] h-[350px] overflow-hidden rounded-xl"
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={current}
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="w-full h-full bg-white rounded-xl shadow-lg overflow-hidden"
                    >
                      <Image
                        src={achievements[current].img}
                        alt={achievements[current].title}
                        fill
                        className="object-cover"
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* tombol navigasi */}
              <div className="flex items-center justify-between mt-6 w-full md:w-auto md:gap-6">
                <a
                  href="/profil/prestasi"
                  className="px-6 py-2 rounded-md bg-[#243771] text-white text-sm font-semibold shadow hover:shadow-lg hover:bg-[#1a2a5c] transition text-center"
                >
                  {lang === "id" ? "Selengkapnya" : "More"}
                </a>
                <div className="flex gap-3 justify-center">
                  <motion.button
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={prevSlide}
                    aria-label="Previous slide"
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-[#243771] text-white shadow hover:shadow-lg hover:bg-[#1a2a5c] transition"
                  >
                    ‹
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={nextSlide}
                    aria-label="Next slide"
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-[#243771] text-white shadow hover:shadow-lg hover:bg-[#1a2a5c] transition"
                  >
                    ›
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Section Gedung */}
      <section className="relative w-full bg-[#FE4D01] overflow-hidden">
        <div className="relative w-full h-[29vh] md:h-[50vh] lg:h-screen">
          <Image
            src="/svg/gedung.svg"
            alt="Gedung SMK Prestasi Prima"
            fill
            priority
            sizes="0vw"
            className="object-contain md:object-cover object-center"
          />
        </div>
      </section>
    </>
  );
}
