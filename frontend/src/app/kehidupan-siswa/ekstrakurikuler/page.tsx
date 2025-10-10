"use client";

import Link from "next/link";
import Image from "next/image";
import { useLang } from "../../components/LangContext";

export default function Ekstrakurikuler() {
  const { lang } = useLang();

  const ekskul = [
    { name_id: "Saman", name_en: "Saman Dance", img: "/svg/saman.svg", ig: "https://instagram.com/saman" },
    { name_id: "PPOC", name_en: "PPOC", img: "/svg/ppoc.svg", ig: "https://instagram.com/ppoc" },
    { name_id: "ICT Club", name_en: "ICT Club", img: "/svg/ict.svg", ig: "https://instagram.com/ictclub" },
    { name_id: "Silat", name_en: "Silat", img: "/svg/silat.svg", ig: "https://instagram.com/silat" },
    { name_id: "Badminton", name_en: "Badminton", img: "/svg/bultang.svg", ig: "https://instagram.com/badminton" },
    { name_id: "Voli", name_en: "Volleyball", img: "/svg/voli.svg", ig: "https://instagram.com/voli" },
    { name_id: "Futsal", name_en: "Futsal", img: "/svg/futsal.svg", ig: "https://instagram.com/futsal" },
    { name_id: "Basket", name_en: "Basketball", img: "/svg/basket.svg", ig: "https://instagram.com/basket" },
    { name_id: "Rohkris", name_en: "Rohkris", img: "/svg/rohkris.svg", ig: "https://instagram.com/rohkris" },
    { name_id: "Rohis", name_en: "Rohis", img: "/svg/rohis.svg", ig: "https://instagram.com/rohis" },
    { name_id: "English Club", name_en: "English Club", img: "/svg/ec.svg", ig: "https://instagram.com/englishclub" },
    { name_id: "Tari Tradisional", name_en: "Traditional Dance", img: "/svg/tari.svg", ig: "https://instagram.com/tari" },
    { name_id: "Pramuka", name_en: "Scout", img: "/svg/pramuka.svg", ig: "https://instagram.com/pramuka" },
    { name_id: "PMR", name_en: "PMR", img: "/svg/pmr.svg", ig: "https://instagram.com/pmr" },
    { name_id: "KIR", name_en: "Research Club", img: "/svg/kir.svg", ig: "https://instagram.com/kir" },
    { name_id: "Ganefo", name_en: "Ganefo", img: "/svg/ganefo.svg", ig: "https://instagram.com/ganefo" },
    { name_id: "Orens Network", name_en: "Orens Network", img: "/svg/network.svg", ig: "https://instagram.com/orensnetwork" },
    { name_id: "Orens Studio", name_en: "Orens Studio", img: "/svg/studio.svg", ig: "https://instagram.com/orensstudio" },
    { name_id: "Orens Digital", name_en: "Orens Digital", img: "/svg/digital.svg", ig: "https://instagram.com/orensdigital" },
    { name_id: "Orens Solution", name_en: "Orens Solution", img: "/svg/solution.svg", ig: "https://instagram.com/orenssolution" },
    { name_id: "Modern Dance", name_en: "Modern Dance", img: "/svg/geniale.svg", ig: "https://instagram.com/moderndance" },
    { name_id: "Esports", name_en: "Esports", img: "/svg/esports.svg", ig: "https://instagram.com/esports" },
  ];

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
            <span className="text-[#FE4D01]">{">"}</span>
            <Link
              href="/kehidupan-siswa/ekstrakurikuler"
              className="text-[#FE4D01] hover:underline"
            >
              {lang === "id" ? "Kehidupan Siswa" : "Student Life"}
            </Link>
            <span className="text-[#243771]">{">"}</span>
            <span className="text-[#243771]">
              {lang === "id" ? "Ekstrakurikuler" : "Extracurricular"}
            </span>
          </nav>
        </div>
      </section>

      {/* === Section Ekstrakurikuler === */}
      <section className="w-full bg-white py-10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-[#243771] mb-2">
            {lang === "id" ? "Ekstrakurikuler" : "Extracurricular"}
          </h2>
          <p className="text-[#243771] mb-10 text-sm md:text-base">
            {lang === "id"
              ? "Ekstrakurikuler: Wadah Bakat dan Ciptakan Generasi Berprestasi."
              : "Extracurricular: A place to develop talents and create achievers."}
          </p>

          {/* === Grid Ekskul === */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 justify-items-center">
            {ekskul.map((item, index) => (
              <a
                key={index}
                href={item.ig}
                target="_blank"
                rel="noopener noreferrer"
                className="relative group flex items-center justify-between w-[297.04px] h-[168.47px] bg-white rounded-[10px] shadow-[0_4px_4px_rgba(0,0,0,0.25)] overflow-hidden hover:scale-[1.02] transition-transform duration-300"
              >
                {/* Gambar Ekskul */}
                <div className="flex-1 flex items-center justify-center">
                  <Image
                    src={item.img}
                    alt={item.name_id}
                    width={95}
                    height={95}
                    className="object-contain z-10"
                  />
                </div>

                {/* Panel Biru Kanan */}
                <div className="h-full w-[50.84px] bg-[#243771] flex items-center justify-center rounded-r-[10px] z-10">
                  <span
                    className="text-white font-semibold text-[13px] transform -rotate-90 whitespace-nowrap"
                    style={{ letterSpacing: "0.5px" }}
                  >
                    {lang === "id" ? item.name_id : item.name_en}
                  </span>
                </div>

                {/* Overlay Hover */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white text-sm font-medium z-20 text-center px-2">
                  {lang === "id"
                    ? "Klik untuk menuju Instagram"
                    : "Click to open Instagram"}
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* === Section Gedung === */}
      <main className="flex-1 w-full bg-white">
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
              hover:scale-[1.02]
              transition-transform duration-700
            "
          />
        </section>
      </main>
    </>
  );
}
