"use client";

import { useLang } from "../components/LangContext";

export default function Mitra() {
  const { lang } = useLang();

  // === LOGO PARTNERS ===
  const companyLogos = [
    "/svg/antam.svg",
    "/svg/jatelindo.svg",
    "/svg/kemenkop.svg",
    "/svg/kemhan.svg",
    "/svg/komatsu.svg",
    "/svg/panasonic.svg",
    "/svg/starvision.svg",
    "/svg/telkom.svg",
    "/svg/wika.svg",
  ];

  // buat 30 kotak dengan spacing 6.4rem antar kotak
  const boxes = Array.from({ length: 30 }, (_, i) => i * 6.4);

  return (
    <section
      id="mitra"
      className="relative bg-white overflow-hidden py-32 md:py-40" // ➡️ tambah padding section
    >
      {/* === Dekorasi Kotak Baris 1 (atas) === */}
      <div className="absolute top-0 left-0 w-full z-0">
        {boxes.map((pos, idx) => (
          <div
            key={`top1-${idx}`}
            className="absolute w-[50px] h-[50px] bg-[#FE4D01]"
            style={{ left: `${pos}rem`, top: "0px" }}
          />
        ))}
      </div>

      {/* === Dekorasi Kotak Baris 2 (atas geser) === */}
      <div className="absolute top-0 left-[53px] w-full z-0">
        {boxes.map((pos, idx) => (
          <div
            key={`top2-${idx}`}
            className="absolute w-[50px] h-[50px] bg-[#FE4D01]"
            style={{ left: `${pos}rem`, top: "50px" }}
          />
        ))}
      </div>

      {/* === Dekorasi Kotak Baris 3 (bawah) === */}
      <div className="absolute bottom-0 left-12 w-full z-0">
        {boxes.map((pos, idx) => (
          <div
            key={`bottom1-${idx}`}
            className="absolute w-[50px] h-[50px] bg-[#FE4D01]"
            style={{ left: `${pos}rem`, bottom: "0px" }}
          />
        ))}
      </div>

      {/* === Dekorasi Kotak Baris 4 (bawah geser) === */}
      <div className="absolute bottom-0 left-0 w-full z-0">
        {boxes.map((pos, idx) => (
          <div
            key={`bottom2-${idx}`}
            className="absolute w-[50px] h-[50px] bg-[#FE4D01]"
            style={{ left: `${pos}rem`, bottom: "50px" }}
          />
        ))}
      </div>

      {/* === Konten Mitra === */}
      <div className="container relative z-10 mx-auto px-6 md:px-20 lg:px-30">
        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          <span className="text-[#FE4D01]">
            {lang === "id" ? "Mitra" : "Partners"}
          </span>
        </h2>

        {/* === Marquee Logo === */}
        <div className="overflow-hidden w-full relative max-w-6xl mx-auto select-none">
          {/* Fade gradient kiri */}
          <div className="absolute left-0 top-0 h-full w-20 z-20 pointer-events-none bg-gradient-to-r from-white to-transparent" />

          {/* Isi marquee */}
          <div
            className="marquee-inner flex will-change-transform min-w-[200%]"
            style={{ animationDuration: "18s" }}
          >
            <div className="flex items-center">
              {[...companyLogos, ...companyLogos].map((logo, index) => (
                <div
                  key={index}
                  className="flex items-center justify-center mx-10"
                  style={{ minWidth: "160px" }}
                >
                  <img
                    src={logo}
                    alt={`Logo ${index + 1}`}
                    className="h-28 w-auto object-contain"
                    draggable={false}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Fade gradient kanan */}
          <div className="absolute right-0 top-0 h-full w-20 md:w-40 z-20 pointer-events-none bg-gradient-to-l from-white to-transparent" />
        </div>
      </div>

      {/* === Animasi marquee === */}
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
