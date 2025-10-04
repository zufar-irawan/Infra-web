"use client";

import Image from "next/image";
import Link from "next/link";
import { useLang } from "../components/LangContext";

export default function Tur() {
  const { lang } = useLang();

  return (
    <section
      id="tur"
      className="relative w-full min-h-screen flex items-center justify-center text-white"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src="/sekolah_ls.png"
          alt="SMK Prestasi Prima"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" /> {/* overlay gelap */}
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 flex flex-col items-center justify-center text-center">
        {/* Logo */}
        <div className="mb-6">
          <Image
            src="/smk.png"
            alt="Logo SMK Prestasi Prima"
            width={100}
            height={100}
            className="mx-auto rounded-full bg-white p-2 shadow-md"
          />
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-4xl font-bold mb-4">
          {lang === "id" ? "Mulai Pengalaman Virtual!" : "Start Virtual Experience!"}
        </h1>

        {/* Subtitle */}
        <p className="text-sm md:text-lg mb-8 max-w-2xl leading-relaxed">
          {lang === "id"
            ? "Ikuti tur virtual kami untuk melihat SMK Prestasi Prima kapan saja dan di mana saja."
            : "Join our virtual tour to explore SMK Prestasi Prima anytime and anywhere."}
        </p>

        {/* Link Button */}
        <Link
          href="/virtual-tour"
          className="uppercase px-6 py-3 bg-[#FE4D01] hover:bg-[#e54400] rounded-md font-semibold text-white transition"
        >
          {lang === "id" ? "Tur Virtual Sekolah" : "School Virtual Tour"}
        </Link>
      </div>
    </section>
  );
}
