"use client";

import Image from "next/image";
import { useLang } from "../components/LangContext";

interface TestimoniProps {
  hideDecorations?: boolean; // ✅ opsional: untuk sembunyikan dekorasi
}

export default function Testimoni({ hideDecorations = false }: TestimoniProps) {
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
              ? "Kami sungguh bangga dengan sekolah kami karena mewadahi bakat dan minat kami di bidang IT hingga memperoleh banyak prestasi. Berkat itu kini kami mendapatkan beasiswa 100% di MNC University."
              : "We are truly proud of our school for supporting our talents and interests in the field of IT, which has led us to achieve many accomplishments. Thanks to that, we have now received 100% scholarships at MNC University."}
          </p>

          <p className="text-[#1e2a5e] font-semibold">
            Erlangga dan Ayyub{" "}
            <span className="font-normal">
              –{" "}
              {lang === "id"
                ? "Pengembangan Perangkat Lunak dan Gim"
                : "Software & Game Development"}
            </span>
          </p>
        </div>

        {/* Right: Foto + Ornamen Line */}
        <div className="flex-1 flex flex-col items-center relative">
          {/* Foto */}
          <div className="relative w-[300px] sm:w-[370px] md:w-[430px] h-[529px] overflow-hidden rounded-tr-[20px] rounded-bl-[20px]">
            <Image
              src="/webp/erlang.webp"
              alt="Erlangga & Ayyub"
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

      {/* ✅ Ornamen Background hanya muncul jika tidak disembunyikan */}
      {!hideDecorations && (
        <>
          <div className="absolute top-0 left-0 w-[50px] h-[50px] bg-[#FE4D01]" />
          <div className="absolute top-0 left-25 w-[50px] h-[50px] bg-[#FE4D01]" />
        </>
      )}
    </section>
  );
}
