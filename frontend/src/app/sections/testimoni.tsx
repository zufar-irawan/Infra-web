"use client";

import Image from "next/image";
import { useLang } from "../components/LangContext";

export default function Testimoni() {
  const { lang } = useLang();

  return (
    <section
      id="testimoni"
      className="py-20 bg-white relative flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Title */}
      <h2 className="text-3xl md:text-4xl font-bold text-[#FE4D01] mb-12 text-center">
        {lang === "id" ? "Testimoni" : "Testimonial"}
      </h2>

      {/* Container */}
      <div className="container mx-auto px-6 md:px-12 lg:px-20 flex flex-col md:flex-row items-center justify-between gap-12">
        {/* Left: Kutip + Teks */}
        <div className="flex-1 text-left relative max-w-xl">
          {/* Icon Kutip */}
          <div className="w-[125px] h-[85px] mb-6 scale-90">
            <Image
              src="/svg/kutip.svg"
              alt="Kutip"
              width={140}
              height={97}
              className="object-contain"
            />
          </div>

          {/* Isi Testimoni */}
          <p className="text-[#1e2a5e] leading-relaxed mb-6 text-[15px] md:text-[17px]">
            {lang === "id"
              ? "Saya sungguh terkesan dengan apa yang telah saya saksikan di SMK Prestasi Prima hari ini. Saya datang ke Indonesia dengan harapan dapat melihat semangat generasi muda yang baru, dan sekolah ini telah melampaui ekspektasi saya."
              : "I am truly impressed with what I have witnessed at SMK Prestasi Prima today. I came to Indonesia hoping to see the spirit of a new young generation, and this school has exceeded my expectations."}
          </p>

          <p className="text-[#1e2a5e] font-semibold">
            Yao Ming Abdul Rahman{" "}
            <span className="font-normal">
              –{" "}
              {lang === "id"
                ? "Desain Komunikasi Visual"
                : "Visual Communication Design"}
            </span>
          </p>
        </div>

        {/* Right: Foto + Ornamen Line */}
        <div className="flex-1 flex flex-col items-center relative">
          {/* Foto */}
          <div className="relative w-[300px] sm:w-[370px] md:w-[430px] h-[529px] overflow-hidden rounded-tr-[20px] rounded-bl-[20px]">
            <Image
              src="/svg/yoming.svg"
              alt="Yao Ming Abdul Rahman"
              width={430}
              height={529}
              className="object-cover"
            />
          </div>

          {/* Line Zigzag */}
          <div className="absolute -bottom-6 left-10 md:left-0 lg:left-10 scale-110">
            <Image
              src="/svg/line.svg"
              alt="Ornamen Zigzag"
              width={220}
              height={45}
              className="object-contain"
            />
          </div>
        </div>
      </div>

      {/* Ornamen Background */}
      <div className="absolute top-0 left-0 w-[50px] h-[50px] bg-[#FE4D01]" />
      <div className="absolute top-0 left-25 w-[50px] h-[50px] bg-[#FE4D01]" />
    </section>
  );
}
