"use client";

import Link from "next/link";
import Navbar from "@/components/Header";
import Footer from "@/components/Footer";
import { useLang } from "../../components/LangContext";
import { useState, useRef, useEffect } from "react";
import axios from "axios";

export default function Faq() {
  const { lang } = useLang();

  return (
    <>
      <div className="h-[100px] bg-white" />

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
              {lang === "id" ? "Informasi" : "Information"}
            </Link>
            <span className="text-[#243771]">{">"}</span>
            <span className="text-[#243771]">
              {lang === "id" ? "FAQ" : "FAQ"}
            </span>
          </nav>
        </div>
      </section>

      <FAQSection />

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
    </>
  );
}

function FAQSection() {
  const { lang } = useLang();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [faq, setFaq] = useState<any[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

  useEffect(() => {
    const fetchFaq = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/faq/list`);
        setFaq(res.data.data);
      } catch (err) {
        console.error("Gagal memuat FAQ:", err);
      }
    };
    fetchFaq();
  }, []);

  // Tutup jika klik luar atau tekan Escape
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

        <div className="space-y-4" ref={containerRef}>
          {faq.length > 0 ? (
            faq.map((item, i) => {
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
            })
          ) : (
            <p className="text-center text-gray-500 italic">Tidak ada FAQ.</p>
          )}
        </div>
      </div>
    </section>
  );
}
