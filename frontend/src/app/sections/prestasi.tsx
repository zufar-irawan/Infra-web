"use client";

import Image from "next/image";
import { useLang } from "../components/LangContext";
import { useEffect, useState, useRef } from "react";

export default function Prestasi() {
  const { lang } = useLang();
  const [current, setCurrent] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const autoSlideRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartX = useRef<number | null>(null);

  const achievements = [
    { img: "/pp2.png", title: "Juara Dua" },
    { img: "/pp2.png", title: "Juara Tiga" },
    { img: "/pp2.png", title: "Juara Satu" },
  ];

  // animasi masuk
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setIsVisible(true);
        });
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // autoplay
  useEffect(() => {
    autoSlideRef.current = setInterval(() => {
      setCurrent(prev => (prev + 1) % achievements.length);
    }, 4000);
    return () => {
      if (autoSlideRef.current) clearInterval(autoSlideRef.current);
    };
  }, [achievements.length]);

  const nextSlide = () => {
    if (autoSlideRef.current) clearInterval(autoSlideRef.current);
    setCurrent(prev => (prev + 1) % achievements.length);
  };

  const prevSlide = () => {
    if (autoSlideRef.current) clearInterval(autoSlideRef.current);
    setCurrent(prev => (prev - 1 + achievements.length) % achievements.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(diff) > 50) {
      diff > 0 ? prevSlide() : nextSlide();
    }
    touchStartX.current = null;
  };

  // posisi kartu
  const getTranslateX = (index: number) => {
    const diff = (index - current + achievements.length) % achievements.length;
    if (diff === 0) return "translate-x-0 scale-100 opacity-100 z-20";
    if (diff === 1) return "translate-x-[110%] scale-95 opacity-80 z-10";
    if (diff === achievements.length - 1)
      return "-translate-x-[110%] scale-95 opacity-80 z-10";
    return "opacity-0 scale-90 z-0";
  };

  return (
    <>
      {/* === SECTION PRESTASI === */}
      <section
        id="prestasi"
        ref={sectionRef}
        className="relative overflow-hidden py-24 md:py-28 bg-white"
      >
        {/* Background miring oranye */}
        <div className="absolute top-120 left-0 right-0 h-100 bg-[#FE4D01] transform -skew-y-6 origin-top-left z-0"></div>

        <div className="relative z-10 container mx-auto px-6 md:px-12 lg:px-20">
          <div
            className={`flex flex-col md:flex-row items-start gap-10 transition-all duration-1000 ease-out ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            {/* Kiri: Text */}
            <div className="md:w-1/2">
              <h2 className="text-2xl md:text-3xl font-bold text-[#FE4D01] mb-4">
                {lang === "id" ? "Prestasi" : "Achievements"}
              </h2>
              <p className="text-[#243771] text-sm md:text-base leading-relaxed">
                {lang === "id"
                  ? "Dari berbagai macam program keahlian yang ada, lahirlah berbagai prestasi yang membanggakan nama sekolah. Namun, tidak hanya dari bidang akademik. Bidang non akademik juga sama membanggakannya."
                  : "From various expertise programs, achievements were born that make the school proud. Not only in academics but also in non-academic fields."}
              </p>
            </div>

            {/* Kanan: Slider */}
            <div className="md:w-1/2 flex flex-col items-center justify-center relative">
              {/* Container */}
              <div
                className="relative w-full flex items-center justify-center overflow-hidden h-[380px] touch-pan-y"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                {achievements.map((item, i) => (
                  <div
                    key={i}
                    className={`absolute transition-all duration-700 ease-[cubic-bezier(0.68,-0.55,0.27,1.55)] ${getTranslateX(
                      i
                    )}`}
                  >
                    <div
                      className="bg-white rounded-xl shadow-md overflow-hidden flex-shrink-0 transform transition hover:scale-105 hover:shadow-xl mx-auto"
                      style={{
                        width: "295px",
                        height: "369px",
                      }}
                    >
                      <Image
                        src={item.img}
                        alt={item.title}
                        width={295}
                        height={369}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Tombol Navigasi + Selengkapnya */}
              <div className="flex items-center justify-between mt-6 w-full">
                <a
                  href="/profil/prestasi"
                  className="px-6 py-2 rounded-md bg-[#243771] text-white text-sm md:text-base font-semibold shadow hover:shadow-lg hover:bg-[#1a2a5c] transition"
                >
                  {lang === "id" ? "Selengkapnya" : "More"}
                </a>
                <div className="flex gap-3">
                  <button
                    onClick={prevSlide}
                    aria-label="Previous slide"
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-[#243771] text-white shadow hover:shadow-lg hover:bg-[#1a2a5c] transition"
                  >
                    ‹
                  </button>
                  <button
                    onClick={nextSlide}
                    aria-label="Next slide"
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-[#243771] text-white shadow hover:shadow-lg hover:bg-[#1a2a5c] transition"
                  >
                    ›
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === SECTION GEDUNG FULLSCREEN === */}
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
