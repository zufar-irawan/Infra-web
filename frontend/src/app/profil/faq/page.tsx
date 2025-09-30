"use client";

import Link from "next/link";
import Navbar from "@/app/components/header";
import Footer from "@/app/components/footer";
import { useLang } from "../../components/LangContext";
import { useState, useRef, useEffect } from "react";

/* -------------------- Halaman Tentang -------------------- */
export default function Tentang() {
  const { lang } = useLang();

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Navbar */}
      <Navbar />

      {/* Spacer biar ga ketiban header */}
      <div className="h-[100px] bg-white" />

      {/* Breadcrumbs */}
      <section className="w-full py-4 bg-white">
        <div className="container mx-auto px-4">
          <nav className="flex items-center text-sm font-medium space-x-2">
            <Link href="/" className="text-[#FE4D01] hover:underline">
              {lang === "id" ? "Beranda" : "Home"}
            </Link>
            <span className="text-[#FE4D01]">{">"}</span>
            <Link
              href="/informasi-sekolah/tentang-kami"
              className="text-[#FE4D01] hover:underline"
            >
              {lang === "id" ? "Informasi Sekolah" : "School Information"}
            </Link>
            <span className="text-[#243771]">{">"}</span>
            <span className="text-[#243771]">
              {lang === "id" ? "FAQ" : "FAQ"}
            </span>
          </nav>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection />

      {/* Footer */}
      <Footer />
    </div>
  );
}

/* -------------------- FAQ Section -------------------- */
function FAQSection() {
  const { lang } = useLang();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const faq = [
    {
      q_id: "Dimana alamat SMK Prestasi Prima?",
      a_id: "Alamat kami berada di Jl. Kayu Manis Timur No. 99, Jakarta Timur.",
      q_en: "Where is SMK Prestasi Prima located?",
      a_en: "Our address is Jl. Kayu Manis Timur No. 99, East Jakarta.",
    },
    {
      q_id: "Apa saja jurusan yang tersedia?",
      a_id: "Kami memiliki jurusan RPL, TJKT, DKV, dan lainnya.",
      q_en: "What majors are available?",
      a_en: "We offer majors such as Software Engineering, Network Engineering, Visual Communication Design, and more.",
    },
    {
      q_id: "Apakah ada kegiatan ekstrakurikuler?",
      a_id: "Ya, tersedia banyak ekstrakurikuler seperti futsal, basket, musik, dan robotik.",
      q_en: "Are there extracurricular activities?",
      a_en: "Yes, we provide many extracurriculars such as futsal, basketball, music, and robotics.",
    },
  ];

  // close jika klik luar atau tekan Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpenIndex(null);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenIndex(null);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="text-3xl sm:text-4xl font-bold text-[#243771] text-center mb-4">
          {lang === "id" ? "FAQ SMK Prestasi Prima" : "SMK Prestasi Prima FAQ"}
        </h2>
        <p className="text-gray-600 text-center mb-10">
          {lang === "id"
            ? "Kami menyiapkan daftar pertanyaan yang sering diajukan..."
            : "We provide a list of frequently asked questions..."}
        </p>

        {/* Ref ditempel ke wrapper card FAQ */}
        <div className="space-y-4" ref={containerRef}>
          {faq.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={i} className="border rounded-lg shadow-sm overflow-hidden">
                <button
                  aria-expanded={isOpen}
                  aria-controls={`faq-content-${i}`}
                  id={`faq-btn-${i}`}
                  className="w-full flex justify-between items-center p-4 font-medium text-[#243771] focus:outline-none"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                >
                  <span className="text-left">
                    {lang === "id" ? item.q_id : item.q_en}
                  </span>
                  <span className="text-lg ml-4">{isOpen ? "−" : "+"}</span>
                </button>

                <div
                  id={`faq-content-${i}`}
                  role="region"
                  aria-labelledby={`faq-btn-${i}`}
                  className={`overflow-hidden transition-[max-height] duration-500 ease-in-out ${
                    isOpen ? "max-h-40" : "max-h-0"
                  }`}
                >
                  <div className="p-4 pt-0">
                    <p className="text-gray-600">
                      {lang === "id" ? item.a_id : item.a_en}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
