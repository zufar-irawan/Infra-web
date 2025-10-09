"use client";

import Link from "next/link";
import { useLang } from "../../components/LangContext";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

export default function Prestasi() {
  const { lang } = useLang();

  // === DATA GAMBAR ===
  const images = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    src: `/webp/p${i + 1}.webp`,
  }));

  // === PAGINATION ===
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const totalPages = Math.ceil(images.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentImages = images.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // === ANIMASI FADE-IN ===
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
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

  return (
    <>
      {/* Spacer biar ga ketiban header */}
      <div className="h-[100px] bg-white" />

      {/* Breadcrumbs */}
      <section className="w-full py-3 bg-white">
        <div className="container mx-auto px-4">
          <nav className="flex items-center text-sm font-medium space-x-2">
            <Link href="/" className="text-[#FE4D01] hover:underline">
              {lang === "id" ? "Beranda" : "Home"}
            </Link>
            <span className="text-[#FE4D01]">{">"}</span>
            <Link
              href="/kehidupan-siswa/prestasi"
              className="text-[#FE4D01] hover:underline"
            >
              {lang === "id" ? "Informasi" : "Information"}
            </Link>
            <span className="text-[#243771]">{">"}</span>
            <span className="text-[#243771]">
              {lang === "id" ? "Prestasi" : "Achievements"}
            </span>
          </nav>
        </div>
      </section>

      {/* === SECTION PRESTASI === */}
      <section
        ref={sectionRef}
        className={`py-16 bg-white transition-all duration-1000 ease-out ${
          isVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        }`}
      >
        <div className="container mx-auto px-4">
          <h2 className="text-center text-2xl sm:text-3xl font-bold text-[#243771] mb-2">
            {lang === "id" ? "Prestasi" : "Achievements"}
          </h2>
          <p className="text-center text-gray-600 mb-10">
            {lang === "id"
              ? "Pencapaian dan kebanggaan SMK Prestasi Prima"
              : "Achievements and pride of SMK Prestasi Prima"}
          </p>

          {/* Grid Gambar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 justify-center">
            {currentImages.map((img) => (
              <div
                key={img.id}
                className="w-full max-w-[295px] mx-auto bg-white rounded-md overflow-hidden shadow-[0_4px_4px_rgba(0,0,0,0.25)] hover:scale-[1.02] transition-transform duration-300"
              >
                <Image
                  src={img.src}
                  alt={`Prestasi ${img.id}`}
                  width={295}
                  height={368}
                  loading="lazy"
                  className="w-full h-auto object-cover"
                />
              </div>
            ))}
          </div>

          {/* Pagination Oranye */}
          <div className="flex items-center justify-center gap-2 mt-10">
            <button
              type="button"
              aria-label="Previous"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`mr-4 transition-all ${
                currentPage === 1 ? "opacity-30 cursor-not-allowed" : "hover:scale-95"
              }`}
            >
              <svg
                width="9"
                height="16"
                viewBox="0 0 12 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11 1L2 9.24242L11 17"
                  stroke="#FE4D01"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            <div className="flex gap-2 text-gray-500 text-sm md:text-base">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handlePageChange(i + 1)}
                  className={`flex items-center justify-center active:scale-95 w-9 md:w-12 h-9 md:h-12 aspect-square rounded-md transition-all font-medium ${
                    currentPage === i + 1
                      ? "bg-[#FE4D01] text-white"
                      : "bg-white border border-gray-200 text-[#FE4D01] hover:bg-[#FE4D01]/10"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              type="button"
              aria-label="Next"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`ml-4 transition-all ${
                currentPage === totalPages
                  ? "opacity-30 cursor-not-allowed"
                  : "hover:scale-95"
              }`}
            >
              <svg
                width="9"
                height="16"
                viewBox="0 0 12 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 1L10 9.24242L1 17"
                  stroke="#FE4D01"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* === SECTION GEDUNG (pindah ke bawah) === */}
      <main className="flex-1 w-full bg-white">
        <section className="relative w-full bg-white overflow-hidden">
          <img
            src="/avif/gedung.avif"
            alt={
              lang === "id"
                ? "Gedung SMK Prestasi Prima"
                : "Prestasi Prima Building"
            }
            className="w-full h-[40vh] sm:h-[55vh] lg:h-screen object-cover object-center hover:scale-[1.02] transition-transform duration-700"
          />
        </section>
      </main>
    </>
  );
}
