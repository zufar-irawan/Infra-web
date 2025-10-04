"use client";

import {useTranslations} from "next-intl";

export default function Mitra() {
    const t = useTranslations('mitraHome')

  const companyLogos = [
    "slack",
    "framer",
    "netflix",
    "google",
    "linkedin",
    "instagram",
    "facebook",
  ];

  // buat 30 kotak dengan spacing 6.5rem antar kotak
  const boxes = Array.from({ length: 30 }, (_, i) => i * 6.4);

  return (
    <section id="mitra" className="relative bg-white overflow-hidden">
      {/* Dekorasi kotak baris 1 (atas) */}
      <div className="absolute top-0 left-0 w-full z-0">
        {boxes.map((pos, idx) => (
          <div
            key={`top1-${idx}`}
            className="absolute w-[50px] h-[50px] bg-[#FE4D01]"
            style={{ left: `${pos}rem`, top: "0px" }}
          />
        ))}
      </div>

      {/* Dekorasi kotak baris 2 (atas, geser 5px ke kanan + turun 55px) */}
      <div className="absolute top-0 left-[53px] w-full z-0">
        {boxes.map((pos, idx) => (
          <div
            key={`top2-${idx}`}
            className="absolute w-[50px] h-[50px] bg-[#FE4D01]"
            style={{ left: `${pos}rem`, top: "50px" }}
          />
        ))}
      </div>

      {/* Dekorasi kotak baris 3 (bawah) */}
      <div className="absolute bottom-0 left-12.5 w-full z-0">
        {boxes.map((pos, idx) => (
          <div
            key={`bottom1-${idx}`}
            className="absolute w-[50px] h-[50px] bg-[#FE4D01]"
            style={{ left: `${pos}rem`, bottom: "0px" }}
          />
        ))}
      </div>

      {/* Dekorasi kotak baris 4 (bawah, geser 5px ke kanan + naik 55px) */}
      <div className="absolute bottom-0 left-[0px] w-full z-0">
        {boxes.map((pos, idx) => (
          <div
            key={`bottom2-${idx}`}
            className="absolute w-[50px] h-[50px] bg-[#FE4D01]"
            style={{ left: `${pos}rem`, bottom: "50px" }}
          />
        ))}
      </div>

      {/* Konten dengan jarak lebih jauh dari kotak */}
      <div className="container relative z-15 mx-auto px-6 md:px-20 lg:px-30 py-50">
        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          <span className="text-[#FE4D01]">
            {t('title')}
          </span>
        </h2>

        {/* Marquee */}
        <div className="overflow-hidden w-full relative max-w-6xl mx-auto select-none">
          {/* Fade gradient kiri */}
          <div className="absolute left-0 top-0 h-full w-20 z-20 pointer-events-none bg-gradient-to-r from-white to-transparent" />

          {/* Isi marquee */}
          <div
            className="marquee-inner flex will-change-transform min-w-[200%]"
            style={{ animationDuration: "18s" }}
          >
            <div className="flex">
              {[...companyLogos, ...companyLogos].map((company, index) => (
                <img
                  key={index}
                  src={`https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/companyLogo/${company}.svg`}
                  alt={company}
                  className="h-14 w-auto mx-8 object-contain"
                  draggable={false}
                />
              ))}
            </div>
          </div>

          {/* Fade gradient kanan */}
          <div className="absolute right-0 top-0 h-full w-20 md:w-40 z-20 pointer-events-none bg-gradient-to-l from-white to-transparent" />
        </div>
      </div>

      {/* Animasi marquee */}
      <style jsx>{`
        .marquee-inner {
          animation: marqueeScroll linear infinite;
        }

        @keyframes marqueeScroll {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
}
