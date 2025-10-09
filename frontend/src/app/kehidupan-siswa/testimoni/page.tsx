"use client";

import Link from "next/link";
import { useLang } from "../../components/LangContext";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Pesan from "@/app/sections/pesan";
import Testimoni from "@/app/sections/testimoni";
import Faq from "@/app/informasi/faq/page";

export default function Testi() {
  const { lang } = useLang();

  return (
    <>
      {/* Spacer biar ga ketiban header */}
      <div className="h-[100px] bg-white" />

      {/* === Breadcrumbs === */}
      <section className="w-full py-3 bg-white">
        <div className="container mx-auto px-4">
          <nav className="flex items-center text-sm font-medium space-x-2">
            <Link href="/" className="text-[#FE4D01] hover:underline">
              {lang === "id" ? "Beranda" : "Home"}
            </Link>
            <span className="text-[#FE4D01]">{">"}</span>
            <Link
              href="/kehidupan-siswa/testimoni"
              className="text-[#FE4D01] hover:underline"
            >
              {lang === "id" ? "Kehidupan Siswa" : "Student Life"}
            </Link>
            <span className="text-[#243771]">{">"}</span>
            <span className="text-[#243771]">
              {lang === "id" ? "Testimoni" : "Testimonials"}
            </span>
          </nav>
        </div>
      </section>

      {/* === Section Testimoni === */}
      <Testimoni />

      {/* === Section Pesan === */}
      <Pesan />

      {/* === Section FAQ === */}
      <FAQSection />

      {/* === SECTION GEDUNG === */}
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

/* === Komponen FAQ === */
function FAQSection() {
  const { lang } = useLang();
  const [openIndex, setOpenIndex] = useState(null);
  const containerRef = useRef(null);

  const faq = [
    {
      q_id: "Di mana alamat SMK Prestasi Prima?",
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

  // Tutup jika klik di luar area atau tekan Escape
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpenIndex(null);
      }
    };

    const handleEsc = (e) => {
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
            ? "Kami menyiapkan daftar pertanyaan yang sering diajukan oleh calon siswa dan orang tua. Jika Anda memiliki pertanyaan lainnya, jangan ragu untuk menghubungi kami."
            : "We’ve prepared a list of frequently asked questions for prospective students and parents. If you have any other questions, don’t hesitate to contact us."}
        </p>

        {/* Daftar FAQ */}
        <div className="space-y-4" ref={containerRef}>
          {faq.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className={`border rounded-lg shadow-sm overflow-hidden transition-all duration-500 ease-in-out ${
                  isOpen ? "bg-[#fff9f7]" : "bg-white"
                }`}
              >
                <button
                  aria-expanded={isOpen}
                  aria-controls={`faq-content-${i}`}
                  id={`faq-btn-${i}`}
                  className="w-full flex justify-between items-center p-4 font-medium text-[#243771] focus:outline-none hover:text-[#FE4D01] transition-colors"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                >
                  <span>{lang === "id" ? item.q_id : item.q_en}</span>
                  <span
                    className={`text-lg ml-4 transform transition-transform duration-300 ${
                      isOpen ? "rotate-45 text-[#FE4D01]" : ""
                    }`}
                  >
                    +
                  </span>
                </button>

                <div
                  id={`faq-content-${i}`}
                  role="region"
                  aria-labelledby={`faq-btn-${i}`}
                  className={`grid transition-all duration-500 ease-in-out ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="p-4 pt-0 text-gray-600">
                      {lang === "id" ? item.a_id : item.a_en}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Daftar Sekarang */}
        <div className="text-center mt-12">
          <Link
            href="/daftar"
            className="inline-block bg-[#FE4D01] text-white font-medium px-8 py-3 rounded-lg shadow-md hover:bg-[#e34400] transition-all duration-300"
          >
            {lang === "id" ? "Daftar Sekarang" : "Register Now"}
          </Link>
        </div>
      </div>
    </section>
  );
}
