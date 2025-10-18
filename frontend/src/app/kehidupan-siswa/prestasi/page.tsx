"use client";

import Link from "next/link";
import { useLang } from "../../components/LangContext";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

type PrestasiItem = {
  id: number;
  poster: string; // backend kirim "poster", bukan "poster_url"
};

const API_BASE = "http://api.smkprestasiprima.sch.id/api";

export default function Prestasi() {
  const { lang } = useLang();
  const [items, setItems] = useState<PrestasiItem[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/achievements`, { cache: "no-store" })
      .then((r) => r.json())
      .then((j) => setItems(j?.data ?? []))
      .catch((e) => console.error("Gagal memuat data prestasi:", e));
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => entry.isIntersecting && setIsVisible(true)),
      { threshold: 0.2 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <>
      {/* Spacer */}
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
              href="/kehidupan-siswa/prestasi"
              className="text-[#FE4D01] hover:underline"
            >
              {lang === "id" ? "Informasi" : "Information"}
            </Link>
            <span className="text-[#243771]">{">"}</span>
            <span className="text-[#243771]">
              {lang === "id" ? "Prestasi" : "Achievements"}
            </span>
          </nav>
        </div>
      </section>

      {/* Section Prestasi */}
      <section
        ref={sectionRef}
        className={`py-16 bg-white transition-all duration-1000 ease-out ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="container mx-auto px-4">
          <h2 className="text-center text-2xl sm:text-3xl font-bold text-[#243771] mb-2">
            {lang === "id" ? "Prestasi" : "Achievements"}
          </h2>
          <p className="text-center text-gray-600 mb-10">
            {lang === "id"
              ? "Pencapaian dan kebanggaan SMK Prestasi Prima"
              : "Achievements and pride of SMK Prestasi Prima"}
          </p>

          {/* Grid dari API */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 justify-center">
            {items.map((img) => (
              <div
                key={img.id}
                className="w-full max-w-[295px] mx-auto bg-white rounded-md overflow-hidden shadow-[0_4px_4px_rgba(0,0,0,0.25)] hover:scale-[1.02] transition-transform duration-300"
              >
                <Image
                  src={img.poster.startsWith("http")
                    ? img.poster
                    : `http://api.smkprestasiprima.sch.id/storage/${img.poster}`}
                  alt={`Prestasi ${img.id}`}
                  width={295}
                  height={368}
                  loading="lazy"
                  className="w-full h-auto object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Gedung */}
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
