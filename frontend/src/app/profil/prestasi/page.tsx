"use client";

import Link from "next/link";
import Navbar from "@/app/components/header";
import Footer from "@/app/components/Footer";
import { useLang } from "../../components/LangContext";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";

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
      <section className="w-full py-3 bg-white">
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
              {lang === "id" ? "Prestasi" : "Achievements"}
            </span>
          </nav>
        </div>
      </section>

      {/* Prestasi */}
      <PrestasiSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* Footer */}
      <Footer />
    </div>
  );
}

/* -------------------- Prestasi Section -------------------- */
function PrestasiSection() {
  const { lang } = useLang();

  const akademik = Array(9).fill("/pp2.png");
  const nonAkademik = Array(9).fill("/pp2.png");

  // animasi scroll masuk
  const [visibleItems, setVisibleItems] = useState<number[]>([]);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"));
            setVisibleItems((prev) => [...new Set([...prev, index])]);
          }
        });
      },
      { threshold: 0.2 }
    );
    const items = sectionRef.current?.querySelectorAll(".prestasi-card");
    items?.forEach((el, i) => {
      el.setAttribute("data-index", i.toString());
      observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const CardGrid = ({ title, items }: { title: string; items: string[] }) => {
    const [page, setPage] = useState(0);
    const itemsPerPage = 9;
    const totalPages = Math.ceil(items.length / itemsPerPage);

    const startIdx = page * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;
    const currentItems = items.slice(startIdx, endIdx);

    const nextPage = () => setPage((prev) => (prev + 1) % totalPages);
    const prevPage = () => setPage((prev) => (prev - 1 + totalPages) % totalPages);

    return (
      <div className="mb-14">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#243771] text-center mb-6">
          {title}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 justify-items-center">
          {currentItems.map((img, i) => (
            <div
              key={i}
              className={`prestasi-card bg-white rounded-[10px] overflow-hidden shadow-md transform transition-all duration-700 ease-out hover:scale-105 hover:shadow-xl ${visibleItems.includes(i)
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
                }`}
              style={{
                transitionDelay: `${i * 80}ms`,
                width: "346px",
                height: "402px",
              }}
            >
              <Image
                src={img}
                alt={`Prestasi ${i}`}
                width={346}
                height={402}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* Navigasi bawah */}
        <div className="flex justify-center gap-3 mt-8">
          <button
            onClick={prevPage}
            className="px-4 py-2 border rounded-lg bg-white shadow hover:bg-[#FE4D01] hover:text-white transition focus:ring-2 focus:ring-[#FE4D01]"
          >
            ◀
          </button>
          <button
            onClick={nextPage}
            className="px-4 py-2 border rounded-lg bg-white shadow hover:bg-[#FE4D01] hover:text-white transition focus:ring-2 focus:ring-[#FE4D01]"
          >
            ▶
          </button>
        </div>
      </div>
    );
  };

  return (
    <section
      ref={sectionRef}
      className="bg-white py-14 container mx-auto px-4"
    >
      <CardGrid
        title={lang === "id" ? "Prestasi Akademik" : "Academic Achievements"}
        items={akademik}
      />
      <CardGrid
        title={
          lang === "id" ? "Prestasi Non-Akademik" : "Non-Academic Achievements"
        }
        items={nonAkademik}
      />
    </section>
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
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
    <section className="py-14 bg-white">
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="text-3xl sm:text-4xl font-bold text-[#243771] text-center mb-5">
          {lang === "id" ? "FAQ SMK Prestasi Prima" : "SMK Prestasi Prima FAQ"}
        </h2>
        <p className="text-gray-600 text-center mb-8">
          {lang === "id"
            ? "Kami menyiapkan daftar pertanyaan yang sering diajukan..."
            : "We provide a list of frequently asked questions..."}
        </p>

        <div className="space-y-3" ref={containerRef}>
          {faq.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className="border rounded-lg shadow-sm overflow-hidden transition hover:shadow-md"
              >
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
                  className={`overflow-hidden transition-[max-height] duration-500 ease-in-out ${isOpen ? "max-h-40" : "max-h-0"
                    }`}
                >
                  <div className="p-4 pt-0 text-gray-600">
                    {lang === "id" ? item.a_id : item.a_en}
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
