"use client";

import Image from "next/image";
import { useLang } from "../components/LangContext";

export default function Mitra() {
  const { lang } = useLang();

  const logos = [
    { src: "/panasonic.png", alt: "Panasonic" },
    { src: "/jatelindo.png", alt: "Jatelindo" },
    { src: "/antam.png", alt: "Antam" },
  ];

  return (
    <section id="mitra" className="py-20 bg-white">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          <span className="text-[#FE4D01]">
            {lang === "id" ? "Mitra" : "Partners"}
          </span>
        </h2>

        {/* Marquee Container */}
        <div className="overflow-hidden relative w-full">
          <div className="flex animate-marquee whitespace-nowrap">
            {[...logos, ...logos].map((logo, i) => (
              <div
                key={i}
                className="flex items-center justify-center mx-8 min-w-[150px]"
              >
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={180}
                  height={80}
                  className="object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Marquee Animation */}
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </section>
  );
}
