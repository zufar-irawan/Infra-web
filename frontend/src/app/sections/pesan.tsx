"use client";

import Image from "next/image";
import { useLang } from "../components/LangContext";
import { useEffect, useState, useRef } from "react";

export default function Pesan() {
  const { lang } = useLang();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setIsVisible(true);
        });
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const Card = ({
    img,
    title,
    name,
    text,
    delay,
  }: {
    img: string;
    title: string;
    name: string;
    text: string;
    delay: string;
  }) => (
    <div
      className={`flex flex-col md:flex-row items-center gap-6 transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      style={{ transitionDelay: delay }}
    >
      {/* Foto */}
      <div className="flex-shrink-0 w-[236px] h-[352px] rounded-[10px] shadow-md overflow-hidden transform transition duration-500 hover:-translate-y-2 hover:shadow-2xl">
        <Image
          src={img}
          alt={name}
          width={236}
          height={352}
          className="object-cover w-full h-full"
        />
      </div>

      {/* Bubble Text */}
      <div className="relative bg-[#243771] text-white rounded-[10px] p-6 md:p-8 shadow-md flex flex-col justify-center transform transition duration-500 hover:-translate-y-2 hover:shadow-2xl w-full md:w-[370px] h-auto md:h-[352px]">
        {/* Panah hanya di desktop */}
        <div className="hidden md:block absolute left-[-14px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[14px] border-b-[14px] border-r-[14px] border-transparent border-r-[#243771]" />
        <h3 className="font-bold uppercase mb-3 text-sm md:text-base">{title}</h3>
        <p className="text-sm leading-relaxed flex-1">{text}</p>
        <p className="mt-4 text-sm font-semibold">{name}</p>
      </div>
    </div>
  );

  return (
    <section id="pesan" className="py-20 bg-white" ref={sectionRef}>
      <div className="container mx-auto px-4 md:px-12 lg:px-20">
        {/* Title */}
        <h2
          className={`text-3xl md:text-4xl font-bold text-center mb-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <span className="text-[#243771]">
            {lang === "id" ? "Pesan " : "Message "}
          </span>
          <span className="text-[#FE4D01]">
            {lang === "id" ? "Pimpinan" : "From Leaders"}
          </span>
        </h2>

        {/* 2 Kolom di Desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <Card
            img="/pp2.png"
            title="PEMBINA YAYASAN"
            name="Dr. Wannen Pakpahan, M.M."
            text="“Di sekolah Prestasi Prima yang unggul dan terpercaya siswa & siswi disiapkan untuk menjadi tenaga yang terampil dan mandiri. Tidak hanya itu, ketakwaan dan kecerdasan pun harus dimiliki, dan percaya diri selalu terjaga dengan berkarakter Pancasila. Jika ada yang lebih baik, baik saja tidak cukup.”"
            delay="200ms"
          />
          <Card
            img="/pp2.png"
            title="KEPALA SEKOLAH SMK PRESTASI PRIMA"
            name="Hendry Kurniawan, S.Kom., M.I.Kom."
            text="“Selamat datang di website resmi SMK Prestasi Prima. Kami percaya, tapi juga yang berkarakter, beriman, dan percaya diri. Kami membekali siswa untuk siap bersaing di dunia kerja dan dunia global — terutama di bidang PPLG, TJKT, DKV, dan Broadcasting.”"
            delay="400ms"
          />
        </div>
      </div>
    </section>
  );
}
