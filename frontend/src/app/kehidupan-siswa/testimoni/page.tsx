"use client";

import Link from "next/link";
import { useLang } from "../../components/LangContext";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Pesan from "@/app/sections/pesan";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

interface TestimoniItem {
  id: number;
  name: string;
  major_id: string;
  major_en: string;
  message_id: string;
  message_en: string;
  photo_id: string;
  photo_en: string;
}

export default function Testi() {
  const { lang } = useLang();
  const [testimoni, setTestimoni] = useState<TestimoniItem[]>([]);
  const [loading, setLoading] = useState(true);

  // === Fetch data dari Laravel ===
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/testimoni`, { cache: "no-store" });
        const json = await res.json();
        if (json.success) setTestimoni(json.data);
      } catch (error) {
        console.error("Gagal memuat data testimoni:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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

      {/* === Section Testimoni (Dynamic from API) === */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#243771] mb-10">
            {lang === "id" ? "Testimoni Siswa & Alumni" : "Students & Alumni Testimonials"}
          </h2>

          {loading ? (
            <p className="text-gray-500 italic">
              {lang === "id" ? "Memuat data..." : "Loading data..."}
            </p>
          ) : testimoni.length === 0 ? (
            <p className="text-gray-500 italic">
              {lang === "id" ? "Belum ada testimoni." : "No testimonials yet."}
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {testimoni.map((t) => (
                <div
                  key={t.id}
                  className="bg-white border border-gray-100 rounded-2xl shadow-[0_8px_20px_rgba(17,24,39,0.08)] p-6 transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(17,24,39,0.12)]"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="relative w-32 h-32 mb-4">
                      <Image
                        src={lang === "id" ? t.photo_id : t.photo_en}
                        alt={t.name}
                        fill
                        className="object-cover rounded-full border border-gray-200"
                      />
                    </div>

                    <h3 className="font-semibold text-lg text-[#243771] mb-1">{t.name}</h3>
                    <p className="text-sm text-[#FE4D01] mb-3">
                      {lang === "id" ? t.major_id : t.major_en}
                    </p>

                    <p className="text-gray-600 italic leading-relaxed text-sm">
                      “{lang === "id" ? t.message_id : t.message_en}”
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* === Section Pesan === */}
      <Pesan />

      {/* === Section FAQ === */}
      <FAQSection />

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
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

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
      a_en:
        "We offer majors such as Software Engineering, Network Engineering, Visual Communication Design, and more.",
    },
    {
      q_id: "Apakah ada kegiatan ekstrakurikuler?",
      a_id: "Ya, tersedia banyak ekstrakurikuler seperti futsal, basket, musik, dan robotik.",
      q_en: "Are there extracurricular activities?",
      a_en:
        "Yes, we provide many extracurriculars such as futsal, basketball, music, and robotics.",
    },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpenIndex(null);
      }
    };
    const handleEsc = (e: KeyboardEvent) => e.key === "Escape" && setOpenIndex(null);

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
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
                  className={`grid transition-all duration-500 ease-in-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
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
