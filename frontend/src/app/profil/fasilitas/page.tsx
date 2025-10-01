"use client";

import Link from "next/link";
import Navbar from "@/app/components/header";
import Footer from "@/app/components/footer";
import { useLang } from "../../components/LangContext";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

export default function FasilitasPage() {
  const { lang } = useLang();

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
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
              href="/profil/tentang-kami"
              className="text-[#FE4D01] hover:underline"
            >
              {lang === "id" ? "Informasi Sekolah" : "School Information"}
            </Link>
            <span className="text-[#243771]">{">"}</span>
            <span className="text-[#243771]">
              {lang === "id" ? "Fasilitas" : "Facilities"}
            </span>
          </nav>
        </div>
      </section>

      <FasilitasSection />
      <FAQSection />
      <Footer />
    </div>
  );
}

/* -------------------- Fasilitas Section -------------------- */
function FasilitasSection() {
  const { lang } = useLang();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(3);
  const touchStartX = useRef<number | null>(null);

  const fasilitas = [
    { title_id: "Kelas", title_en: "Classroom", img: "/dummy.jpg" },
    { title_id: "Perpus", title_en: "Library", img: "/dummy.jpg" },
    { title_id: "Aula Mora", title_en: "Mora Hall", img: "/dummy.jpg" },
    { title_id: "Lapangan", title_en: "Field", img: "/dummy.jpg" },
    { title_id: "Lab RPL", title_en: "Software Lab", img: "/dummy.jpg" },
    { title_id: "Lab TJKT", title_en: "Network Lab", img: "/dummy.jpg" },
    { title_id: "Lab DKV", title_en: "Design Lab", img: "/dummy.jpg" },
    { title_id: "Lab BC", title_en: "Broadcasting Lab", img: "/dummy.jpg" },
    { title_id: "Toilet", title_en: "Restroom", img: "/dummy.jpg" },
    { title_id: "Kantin", title_en: "Canteen", img: "/dummy.jpg" },
    { title_id: "Studio BC", title_en: "Broadcasting Studio", img: "/dummy.jpg" },
    { title_id: "Musholla", title_en: "Prayer Room", img: "/dummy.jpg" },
    { title_id: "Iceboard", title_en: "Iceboard", img: "/dummy.jpg" },
    { title_id: "CCTV", title_en: "CCTV", img: "/dummy.jpg" },
  ];

  // Responsif
  useEffect(() => {
    const updateVisible = () => {
      if (window.innerWidth < 640) setVisible(1); // mobile
      else if (window.innerWidth < 1024) setVisible(2); // tablet
      else setVisible(3); // desktop
    };
    updateVisible();
    window.addEventListener("resize", updateVisible);
    return () => window.removeEventListener("resize", updateVisible);
  }, []);

  const nextSlide = () =>
    setCurrentIndex((prev) => (prev + 1) % fasilitas.length);

  const prevSlide = () =>
    setCurrentIndex((prev) => (prev === 0 ? fasilitas.length - 1 : prev - 1));

  // Swipe gesture
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) nextSlide(); // swipe left
    if (diff < -50) prevSlide(); // swipe right
    touchStartX.current = null;
  };

  const cardWidth = 100 / visible;

  return (
    <section className="bg-white py-16">
      <h2 className="text-3xl sm:text-4xl font-bold text-[#243771] text-center mb-8">
        {lang === "id" ? "Fasilitas" : "Facilities"}
      </h2>

      <div className="relative max-w-6xl mx-auto px-6">
        <div
          className="overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * cardWidth}%)`,
            }}
          >
            {fasilitas.map((item, i) => (
              <Link
                key={i}
                href={"#"} // 🔹 Dummy link
                className="px-2 group bg-white border rounded-xl shadow hover:shadow-xl transition transform hover:-translate-y-1"
                style={{ flex: `0 0 ${cardWidth}%` }}
              >
                <Image
                  src={item.img}
                  alt={lang === "id" ? item.title_id : item.title_en}
                  width={400}
                  height={250}
                  className="rounded-t-xl h-48 w-full object-cover"
                />
                <div className="p-4">
                  <h3 className="text-[#243771] font-bold text-lg group-hover:text-[#FE4D01] transition">
                    {lang === "id" ? item.title_id : item.title_en}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Arrows */}
        <button
          onClick={prevSlide}
          className="absolute top-1/2 left-3 sm:left-4 lg:left-6 transform -translate-y-1/2 bg-white border rounded-full shadow p-2 sm:p-3 hover:bg-[#FE4D01] hover:text-white transition"
        >
          ◀
        </button>
        <button
          onClick={nextSlide}
          className="absolute top-1/2 right-3 sm:right-4 lg:right-6 transform -translate-y-1/2 bg-white border rounded-full shadow p-2 sm:p-3 hover:bg-[#FE4D01] hover:text-white transition"
        >
          ▶
        </button>
      </div>
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

  // Close jika klik luar / tekan ESC
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
            ? "Kami menyiapkan daftar pertanyaan yang sering diajukan..."
            : "We provide a list of frequently asked questions..."}
        </p>

        <div className="space-y-4" ref={containerRef}>
          {faq.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className="border rounded-lg shadow-sm overflow-hidden"
              >
                <button
                  aria-expanded={isOpen}
                  className="w-full flex justify-between items-center p-4 font-medium text-[#243771] focus:outline-none"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                >
                  <span>{lang === "id" ? item.q_id : item.q_en}</span>
                  <span className="text-lg ml-4">{isOpen ? "−" : "+"}</span>
                </button>
                <div
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
