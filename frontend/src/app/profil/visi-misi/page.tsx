"use client";

import Link from "next/link";
import Navbar from "@/app/components/header";
import Footer from "@/app/components/footer";
import { useLang } from "../../components/LangContext";
import { useEffect, useState, useRef } from "react";

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
              {lang === "id" ? "Visi Misi" : "Vision & Mission"}
            </span>
          </nav>
        </div>
      </section>

      {/* Visi & Misi Section */}
      <VisiMisiSection />

      {/* Sejarah Section */}
      <SejarahSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* Footer */}
      <Footer />
    </div>
  );
}

/* -------------------- Visi & Misi Section -------------------- */
function VisiMisiSection() {
  const { lang } = useLang();

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Gambar di kiri */}
        <div className="flex justify-center md:order-1 order-1">
          <img
            src="/pp1.png"
            alt={lang === "id" ? "Visi Misi" : "Vision & Mission"}
            className="rounded-lg w-full object-cover"
          />
        </div>

        {/* Teks di kanan */}
        <div className="space-y-10 md:order-2 order-2">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#FE4D01] mb-4">
              {lang === "id" ? "Visi" : "Vision"}
            </h2>
            <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
              {lang === "id"
                ? "Mewujudkan lulusan yang “unggul” dan “terpercaya”..."
                : "To produce graduates who are 'superior' and 'trustworthy'..."}
            </p>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#FE4D01] mb-4">
              {lang === "id" ? "Misi" : "Mission"}
            </h2>
            <p className="text-gray-700 leading-relaxed text-base sm:text-lg mb-4">
              {lang === "id"
                ? "Menyelenggarakan proses belajar mengajar yang berkualitas ..."
                : "Organize a quality teaching and learning process ..."}
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 text-base sm:text-lg">
              <li>{lang === "id" ? "Pengembangan Perangkat Lunak dan Gim (PPLG)" : "Software and Game Development (PPLG)"}</li>
              <li>{lang === "id" ? "Teknik Jaringan Komputer dan Telekomunikasi (TJKT)" : "Computer Network and Telecommunication Engineering (TJKT)"}</li>
              <li>{lang === "id" ? "Desain Komunikasi Visual (DKV)" : "Visual Communication Design (DKV)"}</li>
              <li>{lang === "id" ? "Broadcasting dan Film (BCF)" : "Broadcasting and Film (BCF)"}</li>
            </ul>
            <p className="text-gray-700 leading-relaxed text-base sm:text-lg mt-4">
              {lang === "id"
                ? "Memberikan pelayanan pendidikan berbasis pembelajaran abad 21 ..."
                : "Provide 21st-century learning-based educational services ..."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------- Sejarah Section -------------------- */
function SejarahSection() {
  const { lang } = useLang();
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl sm:text-4xl font-bold text-[#243771] mb-6">
          {lang === "id" ? "Sejarah" : "History"}
        </h2>
        <p className="text-gray-700 leading-relaxed mb-8">
          {lang === "id"
            ? `Sebagai dikenal, SMK Prestasi Prima adalah salah satu sekolah IT terbaik se-Jakarta Timur...
               Jika ada yang lebih baik, baik saja tidak cukup.`
            : `Known as one of the best IT vocational schools in East Jakarta, Prestasi Prima prepares its students...
               If there is something better, being just good is not enough.`}
        </p>
        <img
          src="/pp2.png"
          alt="Sejarah Sekolah"
          className="rounded-lg shadow-lg w-full"
        />
      </div>
    </section>
  );
}

/* -------------------- FAQ Section (FIX) -------------------- */
function FAQSection() {
  const { lang } = useLang();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const contentRefs = useRef<Array<HTMLDivElement | null>>([]);

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

  // ✅ Klik / tap di luar -> close
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
    document.addEventListener("touchstart", handleClickOutside); // biar jalan di mobile
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  // ✅ Handle animasi expand/collapse
  useEffect(() => {
    contentRefs.current.forEach((el, idx) => {
      if (!el) return;
      if (openIndex === idx) {
        el.style.maxHeight = `${el.scrollHeight}px`;
      } else {
        el.style.maxHeight = "0px";
      }
      el.style.transition = "max-height 400ms ease";
    });
  }, [openIndex, lang]);

  // ✅ Recalc on resize
  useEffect(() => {
    const onResize = () => {
      if (openIndex === null) return;
      const el = contentRefs.current[openIndex];
      if (el) el.style.maxHeight = `${el.scrollHeight}px`;
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [openIndex]);

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
                  <span className="text-left">{lang === "id" ? item.q_id : item.q_en}</span>
                  <span className="text-lg ml-4">{isOpen ? "−" : "+"}</span>
                </button>

                <div
                  id={`faq-content-${i}`}
                  role="region"
                  aria-labelledby={`faq-btn-${i}`}
                  ref={(el) => (contentRefs.current[i] = el)}
                  className="overflow-hidden"
                  style={{ maxHeight: "0px", transition: "max-height 400ms ease" }}
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
