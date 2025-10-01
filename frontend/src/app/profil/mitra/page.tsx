"use client";

import Link from "next/link";
import Navbar from "@/app/components/header";
import Footer from "@/app/components/Footer";
import { useLang } from "../../components/LangContext";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/* -------------------- Halaman Tentang -------------------- */
export default function Tentang() {
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
              href="/informasi-sekolah/tentang-kami"
              className="text-[#FE4D01] hover:underline"
            >
              {lang === "id" ? "Informasi Sekolah" : "School Information"}
            </Link>
            <span className="text-[#243771]">{">"}</span>
            <span className="text-[#243771]">
              {lang === "id" ? "Mitra" : "Partners"}
            </span>
          </nav>
        </div>
      </section>

      <MitraSection />

      <Footer />
    </div>
  );
}

/* -------------------- Mitra Section -------------------- */
function MitraSection() {
  const { lang } = useLang();

  const partners = [
    {
      id: 1,
      name: "Starvision",
      logo: "/dummy-logo.png",
      desc_id:
        "PT Kharisma Starvision Plus adalah rumah produksi yang didirikan pada tahun 1995...",
      desc_en:
        "PT Kharisma Starvision Plus is a production house founded in 1995...",
    },
    {
      id: 2,
      name: "Telkom Indonesia",
      logo: "/dummy-logo.png",
      desc_id:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In fringilla venenatis tellus...",
      desc_en:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In fringilla venenatis tellus...",
    },
    {
      id: 3,
      name: "Panasonic",
      logo: "/dummy-logo.png",
      desc_id:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In fringilla venenatis tellus...",
      desc_en:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In fringilla venenatis tellus...",
    },
    {
      id: 4,
      name: "Kementerian",
      logo: "/dummy-logo.png",
      desc_id:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In fringilla venenatis tellus...",
      desc_en:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In fringilla venenatis tellus...",
    },
  ];

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        {/* Title */}
        <h2 className="text-3xl sm:text-4xl font-bold text-[#243771] text-center mb-4">
          {lang === "id" ? "Mitra Sekolah" : "School Partners"}
        </h2>
        <p className="text-gray-600 text-center max-w-2xl mx-auto mb-8">
          {lang === "id"
            ? "Jelajahi jaringan mitra luar biasa kami..."
            : "Explore our amazing partner network..."}
        </p>
        <div className="flex justify-center mb-12">
          <button className="bg-[#FE4D01] text-white font-semibold px-6 py-3 rounded-lg shadow hover:bg-[#243771] transition-colors duration-300">
            {lang === "id" ? "Hubungi Kami" : "Contact Us"}
          </button>
        </div>

        {/* Partner List */}
        <div className="space-y-10">
          {partners.map((partner, i) => (
            <FadeInCard key={partner.id} delay={i * 200}>
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-6 rounded-xl border bg-white shadow hover:shadow-lg transition duration-500 transform hover:-translate-y-1">
                {/* Logo */}
                <div className="flex-shrink-0 w-32 h-32 flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden shadow-inner">
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    width={120}
                    height={120}
                    className="object-contain p-4 transition-transform duration-500 hover:scale-110"
                  />
                </div>
                {/* Text */}
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-[#243771] mb-2">
                    {partner.name}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {lang === "id" ? partner.desc_id : partner.desc_en}
                  </p>
                </div>
              </div>
            </FadeInCard>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------- FadeInCard (trigger on scroll) -------------------- */
function FadeInCard({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(node);
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(node);

    return () => {
      if (node) observer.unobserve(node);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out transform ${visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-10"
        }`}
      style={{
        transitionDelay: visible ? `${delay}ms` : "0ms",
      }}
    >
      {children}
    </div>
  );
}
