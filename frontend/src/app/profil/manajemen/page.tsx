"use client";

import Link from "next/link";
import Navbar from "@/app/components/header";
import Footer from "@/app/components/Footer";
import { useLang } from "../../components/LangContext";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";

interface Person {
  img: string;
  name_id: string;
  name_en: string;
  jabatan_id?: string;
  jabatan_en?: string;
}

export default function Tentang() {
  const { lang } = useLang();
  const [isVisible, setIsVisible] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const manajemen: Person[] = [
    {
      img: "/manajemen1.jpg",
      name_id: "Budi Santoso",
      name_en: "Budi Santoso",
      jabatan_id: "Direktur Penjamin Mutu",
      jabatan_en: "Director of Quality Assurance",
    },
    {
      img: "/manajemen2.jpg",
      name_id: "Siti Aminah",
      name_en: "Siti Aminah",
      jabatan_id: "Ketua Yayasan",
      jabatan_en: "Foundation Chairman",
    },
    {
      img: "/manajemen3.jpg",
      name_id: "Andi Pratama",
      name_en: "Andi Pratama",
      jabatan_id: "Kepala SMK",
      jabatan_en: "Principal",
    },
  ];

  const pengajar: Person[] = [
    {
      img: "/guru.jpg",
      name_id: "Guru 1",
      name_en: "Teacher 1",
      jabatan_id: "Pengajar",
      jabatan_en: "Teacher",
    },
    {
      img: "/guru.jpg",
      name_id: "Guru 2",
      name_en: "Teacher 2",
      jabatan_id: "Pengajar",
      jabatan_en: "Teacher",
    },
    {
      img: "/guru.jpg",
      name_id: "Guru 3",
      name_en: "Teacher 3",
      jabatan_id: "Pengajar",
      jabatan_en: "Teacher",
    },
  ];

  const renderCard = (
    person: Person,
    idx: number,
    section: "manajemen" | "pengajar"
  ) => {
    const isSelected = selected === idx + (section === "pengajar" ? 100 : 0);

    return (
      <div
        key={idx}
        onClick={() =>
          setSelected(isSelected ? null : idx + (section === "pengajar" ? 100 : 0))
        }
        className={`relative cursor-pointer rounded-xl overflow-hidden shadow-lg bg-white transform transition duration-500 hover:scale-105 hover:shadow-2xl
          ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
        `}
        style={{
          width: section === "manajemen" ? "18rem" : "11rem",
          transitionDelay: `${idx * 120}ms`,
        }}
      >
        <Image
          src={person.img}
          alt={lang === "id" ? person.name_id : person.name_en}
          width={section === "manajemen" ? 288 : 176}
          height={section === "manajemen" ? 320 : 192}
          className={`object-cover w-full ${section === "manajemen" ? "h-80" : "h-48"
            } transition-all duration-300 ${isSelected ? "brightness-50" : "brightness-100"
            }`}
        />

        {/* Default footer */}
        {!isSelected && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#243771]/95 via-[#243771]/70 to-transparent p-3">
            <p
              className={`text-white text-center ${section === "manajemen" ? "text-base" : "text-xs sm:text-sm"
                } font-medium`}
            >
              {lang === "id" ? person.name_id : person.name_en}
            </p>
          </div>
        )}

        {/* Overlay saat dipilih */}
        {isSelected && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 px-2 text-center">
            <p className="text-white font-semibold text-lg">
              {lang === "id" ? person.name_id : person.name_en}
            </p>
            {person.jabatan_id && (
              <p className="text-white text-sm mt-1">
                {lang === "id" ? person.jabatan_id : person.jabatan_en}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Navbar */}
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
              {lang === "id" ? "Manajemen" : "Management"}
            </span>
          </nav>
        </div>
      </section>

      {/* Manajemen */}
      <section className="px-4 sm:px-6 py-12 bg-white">
        <h2 className="text-center text-2xl font-bold text-[#243771] mb-10">
          {lang === "id" ? "Manajemen" : "Management"}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 justify-items-center mb-16">
          {manajemen.map((person, idx) => renderCard(person, idx, "manajemen"))}
        </div>

        {/* Pengajar */}
        <h2 className="text-center text-2xl font-bold text-[#243771] mb-10">
          {lang === "id" ? "Pengajar" : "Teachers"}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 justify-items-center">
          {pengajar.map((person, idx) => renderCard(person, idx, "pengajar"))}
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
                  ref={(el) => (contentRefs.current[i] = el)}
                  className="overflow-hidden"
                  style={{
                    maxHeight: "0px",
                    transition: "max-height 400ms ease",
                  }}
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
