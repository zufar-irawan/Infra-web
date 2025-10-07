"use client";

import Link from "next/link";
import { useLang } from "../../components/LangContext";

export default function MitraIndustri() {
  const { lang } = useLang();

  const partners = [
    { img: "/svg/komatsu.svg", name: "Komatsu" },
    { img: "/svg/panasonic.svg", name: "Panasonic" },
    { img: "/svg/telkom.svg", name: "Telkom Indonesia" },
    { img: "/svg/wika.svg", name: "WIKA" },
    { img: "/svg/transvision.svg", name: "Transvision" },
    { img: "/svg/kemenkop.svg", name: "KemenkopUKM" },
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
            <Link href="/tentang/mitra" className="text-[#FE4D01] hover:underline">
              {lang === "id" ? "Tentang Kami" : "About Us"}
            </Link>
            <span className="text-[#243771]">{">"}</span>
            <span className="text-[#243771]">
              {lang === "id" ? "Mitra Industri" : "Industry Partners"}
            </span>
          </nav>
        </div>
      </section>

      {/* === Section Mitra Industri === */}
      <main className="flex-1 w-full bg-white">
        <section className="w-full py-16">
          <div className="max-w-[80rem] mx-auto px-6">
            {/* Title */}
            <h2 className="text-3xl sm:text-4xl font-bold text-[#243771] text-center mb-12">
              {lang === "id" ? "Mitra Industri" : "Industry Partners"}
            </h2>

            {/* Grid of Cards */}
            <div
              className="
                grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
                gap-10 justify-items-center
              "
            >
              {partners.map((partner, idx) => (
                <div
                  key={idx}
                  className="
                    w-[280px] sm:w-[320px] lg:w-[370px]
                    h-[160px] sm:h-[190px] lg:h-[210px]
                    bg-white border border-gray-100
                    rounded-tr-[70px] rounded-bl-[70px]
                    flex items-center justify-center
                    transition-transform duration-500
                    hover:scale-[1.04]
                    cursor-pointer
                  "
                  style={{
                    boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)", // shadow default
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow =
                      "0px 6px 10px 0px rgba(0, 0, 0, 0.3)"; // shadow saat hover
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow =
                      "0px 4px 4px 0px rgba(0, 0, 0, 0.25)"; // kembali ke default
                  }}
                >
                  <img
                    src={partner.img}
                    alt={partner.name}
                    loading="lazy"
                    className="max-h-[70%] max-w-[70%] object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* === Section Gedung === */}
        <section className="relative w-full bg-white overflow-hidden">
          <img
            src="/avif/gedung.avif"
            alt={lang === "id" ? "Gedung SMK Prestasi Prima" : "Prestasi Prima Building"}
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
