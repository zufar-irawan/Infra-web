"use client";

import Link from "next/link";
import { useLang } from "../../components/LangContext";
import { useState, useRef, useEffect } from "react";

interface FaqItem {
  id: number;
  q_id: string;
  a_id: string;
  q_en: string;
  a_en: string;
}

export default function Faq() {
  const { lang } = useLang();
  const hideBreadcrumb = false;

  return (
    <>
      {/* Spacer header */}
      {!hideBreadcrumb && <div className="h-[100px] bg-white" />}

      {/* === Breadcrumbs === */}
      {!hideBreadcrumb && (
        <section className="w-full py-4 bg-white">
          <div className="container mx-auto px-4">
            <nav className="flex items-center text-sm font-medium flex-wrap gap-1">
              <Link href="/" className="text-[#FE4D01] hover:underline">
                {lang === "id" ? "Beranda" : "Home"}
              </Link>
              <span className="text-[#FE4D01]">{">"}</span>
              <Link
                href="/informasi-sekolah/tentang-kami"
                className="text-[#FE4D01] hover:underline"
              >
                {lang === "id" ? "Informasi" : "Information"}
              </Link>
              <span className="text-[#243771]">{">"}</span>
              <span className="text-[#243771]">
                {lang === "id" ? "FAQ" : "FAQ"}
              </span>
            </nav>
          </div>
        </section>
      )}

      {/* === Section FAQ === */}
      <FAQSection />

      {/* === Gambar Gedung === */}
      {!hideBreadcrumb && (
        <section className="relative w-full bg-white overflow-hidden">
          <img
            src="/svg/gedung.svg"
            alt={
              lang === "id"
                ? "Gedung SMK Prestasi Prima"
                : "Prestasi Prima Building"
            }
            className="w-full h-[40vh] sm:h-[50vh] lg:h-screen object-cover object-center hover:scale-[1.02] transition-transform duration-700"
          />
        </section>
      )}
    </>
  );
}

function FAQSection() {
  const { lang } = useLang();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [faq, setFaq] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchFaq = async () => {
      try {
        const res = await fetch("/api/portal/faq/public", { cache: "no-store" });
        const json = await res.json();
        if (json.success) setFaq(json.data);
      } catch (err) {
        console.error("❌ Gagal memuat FAQ publik:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFaq();
  }, []);

  // Tutup panel FAQ saat klik luar atau tekan ESC
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
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="text-3xl sm:text-4xl font-bold text-[#243771] text-center mb-4">
          {lang === "id" ? "FAQ SMK Prestasi Prima" : "SMK Prestasi Prima FAQ"}
        </h2>
        <p className="text-gray-600 text-center mb-10">
          {lang === "id"
            ? "Kami menyiapkan daftar pertanyaan yang sering diajukan oleh calon siswa dan orang tua."
            : "We’ve prepared a list of frequently asked questions for prospective students and parents."}
        </p>

        {loading ? (
          <p className="text-center text-gray-400 italic">Memuat FAQ...</p>
        ) : (
          <div className="space-y-4" ref={containerRef}>
            {faq.length > 0 ? (
              faq.map((item, i) => {
                const isOpen = openIndex === i;
                return (
                  <div
                    key={i}
                    className="border rounded-lg shadow-sm overflow-hidden transition-all duration-500 ease-in-out"
                  >
                    <button
                      aria-expanded={isOpen}
                      aria-controls={`faq-content-${i}`}
                      id={`faq-btn-${i}`}
                      className="w-full flex justify-between items-center p-4 font-medium text-[#243771] hover:text-[#FE4D01] transition-colors"
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
                      className={`overflow-hidden transition-[max-height] duration-500 ease-in-out ${
                        isOpen ? "max-h-40" : "max-h-0"
                      }`}
                    >
                      <div className="p-4 pt-0 text-gray-600">
                        {lang === "id" ? item.a_id : item.a_en}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-center text-gray-500 italic">
                {lang === "id" ? "Belum ada FAQ." : "No FAQs yet."}
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
