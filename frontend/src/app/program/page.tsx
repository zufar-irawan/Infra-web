"use client";

import Link from "next/link";
import { useLang } from "../components/LangContext";
import Testimoni from "../sections/testimoni";

export default function Program() {
  const { lang } = useLang();

  return (
    <>
      {/* Spacer agar tidak tertutup navbar */}
      <div className="h-[100px] bg-white" />

      {/* === Breadcrumbs === */}
      <section className="w-full py-4 bg-white">
        <div className="container mx-auto px-4">
          <nav className="flex items-center text-sm font-medium space-x-2">
            <Link href="/" className="text-[#FE4D01] hover:underline">
              {lang === "id" ? "Beranda" : "Home"}
            </Link>
            <span className="text-[#243771]">{">"}</span>
            <span className="text-[#243771]">
              {lang === "id" ? "Program Keahlian" : "Expertise Programs"}
            </span>
          </nav>
        </div>
      </section>

      {/* === Heading Program Keahlian === */}
      <section className="w-full bg-white pt-10">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#243771] text-center">
            {lang === "id" ? "Program Keahlian" : "Expertise Programs"}
          </h2>
        </div>
      </section>

      <main className="flex-1 w-full bg-white">
        {/* === Desain Komunikasi Visual === */}
        <section className="relative w-full bg-white py-12 md:py-16 overflow-visible">
          <div
            className="
              max-w-7xl mx-auto px-6
              grid grid-cols-1 lg:grid-cols-2 gap-12 items-center
            "
          >
            {/* Kiri: Gambar fdkv.svg */}
            <div className="relative flex justify-center">
              <img
                src="/svg/fdkv.svg"
                alt="Desain Komunikasi Visual"
                loading="lazy"
                className="w-[92%] max-w-[325px] object-contain"
              />
            </div>

            {/* Kanan: Teks */}
            <div className="relative">
              <h3 className="text-2xl sm:text-3xl font-bold text-[#FE4D01] mb-5 leading-snug">
                {lang === "id"
                  ? "Desain Komunikasi Visual"
                  : "Visual Communication Design"}
              </h3>

              <p className="text-[#243771] leading-relaxed text-base sm:text-lg max-w-2xl">
                {lang === "id"
                  ? "Jurusan ini melatih siswa untuk menyampaikan pesan atau informasi melalui media visual yang kreatif dan efektif. Siswa belajar tentang desain grafis (logo, branding, poster), ilustrasi, fotografi, hingga UI/UX design (merancang antarmuka aplikasi). Lulusannya bekerja sebagai desainer grafis, illustrator, atau content creator."
                  : "This major trains students to deliver messages or information through creative and effective visual media. Students learn graphic design (logos, branding, posters), illustration, photography, and UI/UX design (designing application interfaces). Graduates work as graphic designers, illustrators, or content creators."}
              </p>
            </div>
          </div>
        </section>

        {/* === Broadcasting dan Film === */}
        <section className="relative w-full bg-white py-16 md:py-20 overflow-visible">
          <div
            className="
              max-w-7xl mx-auto px-6
              grid grid-cols-1 lg:grid-cols-2 gap-12 items-center
            "
          >
            {/* Kiri: Teks */}
            <div className="relative order-2 lg:order-1">
              <h3 className="text-2xl sm:text-3xl font-bold text-[#FE4D01] mb-5 leading-snug">
                {lang === "id"
                  ? "Broadcasting dan Film"
                  : "Broadcasting and Film"}
              </h3>

              <p className="text-[#243771] leading-relaxed text-base sm:text-lg max-w-2xl">
                {lang === "id"
                  ? "Jurusan ini fokus pada proses produksi konten audio-visual untuk penyiaran (televisi, radio) dan industri film. Siswa mempelajari teknik penyutradaraan, sinematografi (pengambilan gambar), penulisan skenario, dan editing video. Lulusannya bisa bekerja di stasiun TV, rumah produksi, atau sebagai filmmaker dan editor profesional."
                  : "This major focuses on audio-visual content production for broadcasting (television, radio) and the film industry. Students learn directing techniques, cinematography (shooting), scriptwriting, and video editing. Graduates can work in TV stations, production houses, or as filmmakers and professional editors."}
              </p>
            </div>

            {/* Kanan: Gambar fbcf.svg */}
            <div className="relative flex justify-center order-1 lg:order-2">
              <img
                src="/svg/fbc.svg"
                alt="Broadcasting dan Film"
                loading="lazy"
                className="w-[92%] max-w-[325px] object-contain"
              />
            </div>
          </div>
        </section>

        {/* === Desain Komunikasi Visual === */}
        <section className="relative w-full bg-white py-12 md:py-16 overflow-visible">
          <div
            className="
              max-w-7xl mx-auto px-6
              grid grid-cols-1 lg:grid-cols-2 gap-12 items-center
            "
          >
            {/* Kiri: Gambar fdkv.svg */}
            <div className="relative flex justify-center">
              <img
                src="/svg/fdkv.svg"
                alt="Desain Komunikasi Visual"
                loading="lazy"
                className="w-[92%] max-w-[325px] object-contain"
              />
            </div>

            {/* Kanan: Teks */}
            <div className="relative">
              <h3 className="text-2xl sm:text-3xl font-bold text-[#FE4D01] mb-5 leading-snug">
                {lang === "id"
                  ? "Desain Komunikasi Visual"
                  : "Visual Communication Design"}
              </h3>

              <p className="text-[#243771] leading-relaxed text-base sm:text-lg max-w-2xl">
                {lang === "id"
                  ? "Jurusan ini melatih siswa untuk menyampaikan pesan atau informasi melalui media visual yang kreatif dan efektif. Siswa belajar tentang desain grafis (logo, branding, poster), ilustrasi, fotografi, hingga UI/UX design (merancang antarmuka aplikasi). Lulusannya bekerja sebagai desainer grafis, illustrator, atau content creator."
                  : "This major trains students to deliver messages or information through creative and effective visual media. Students learn graphic design (logos, branding, posters), illustration, photography, and UI/UX design (designing application interfaces). Graduates work as graphic designers, illustrators, or content creators."}
              </p>
            </div>
          </div>
        </section>

        {/* === Broadcasting dan Film === */}
        <section className="relative w-full bg-white py-16 md:py-20 overflow-visible">
          <div
            className="
              max-w-7xl mx-auto px-6
              grid grid-cols-1 lg:grid-cols-2 gap-12 items-center
            "
          >
            {/* Kiri: Teks */}
            <div className="relative order-2 lg:order-1">
              <h3 className="text-2xl sm:text-3xl font-bold text-[#FE4D01] mb-5 leading-snug">
                {lang === "id"
                  ? "Broadcasting dan Film"
                  : "Broadcasting and Film"}
              </h3>

              <p className="text-[#243771] leading-relaxed text-base sm:text-lg max-w-2xl">
                {lang === "id"
                  ? "Jurusan ini fokus pada proses produksi konten audio-visual untuk penyiaran (televisi, radio) dan industri film. Siswa mempelajari teknik penyutradaraan, sinematografi (pengambilan gambar), penulisan skenario, dan editing video. Lulusannya bisa bekerja di stasiun TV, rumah produksi, atau sebagai filmmaker dan editor profesional."
                  : "This major focuses on audio-visual content production for broadcasting (television, radio) and the film industry. Students learn directing techniques, cinematography (shooting), scriptwriting, and video editing. Graduates can work in TV stations, production houses, or as filmmakers and professional editors."}
              </p>
            </div>

            {/* Kanan: Gambar fbcf.svg */}
            <div className="relative flex justify-center order-1 lg:order-2">
              <img
                src="/svg/fbc.svg"
                alt="Broadcasting dan Film"
                loading="lazy"
                className="w-[92%] max-w-[325px] object-contain"
              />
            </div>
          </div>
        </section>

        {/* === Testimoni === */}
        <Testimoni />

        {/* === Section Gedung === */}
        <section className="relative w-full bg-white overflow-hidden">
          <img
            src="/avif/gedung.avif"
            alt={
              lang === "id"
                ? "Gedung SMK Prestasi Prima"
                : "Prestasi Prima Building"
            }
            className="
              w-full h-[40vh] sm:h-[55vh] lg:h-screen
              object-cover object-center
              hover:scale-[1.02] transition-transform duration-700
            "
          />
        </section>
      </main>
    </>
  );
}
