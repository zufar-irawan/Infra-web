"use client";

import Link from "next/link";
import { useLang } from "../../components/LangContext";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

interface BeritaItem {
  id: number;
  title_id: string;
  title_en: string;
  desc_id: string;
  desc_en: string;
  date: string;
  image: string;
}

export default function Berita() {
  const { lang } = useLang();
  const [beritaList, setBeritaList] = useState<BeritaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  // urutan gambar fix
  const fixedImages = [
    "/berita/expo.webp",
    "/berita/ppdb.webp",
    "/berita/kokurikuler.webp",
  ];

  // === Ambil data dari API ===
  useEffect(() => {
    fetch("/api/portal/berita/public", { cache: "no-store" })
      .then((r) => r.json())
      .then((j) => {
        if (j.success && Array.isArray(j.data)) {
          // ambil 3 teratas, dan ganti gambar sesuai urutan tetap
          const top3 = j.data.slice(0, 3).map((b: any, i: number) => ({
            ...b,
            image: fixedImages[i % fixedImages.length],
          }));
          setBeritaList(top3);
        }
      })
      .catch((e) => console.error("❌ Gagal ambil berita:", e))
      .finally(() => setLoading(false));
  }, []);

  // animasi muncul
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
      <div className="h-[100px] bg-white" />

      {/* === Breadcrumbs === */}
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
                {lang === "id" ? "Berita" : "News"}
              </span>
            </nav>
          </div>
        </section>

      {/* === Section Berita === */}
      <section ref={sectionRef} className="w-full bg-white py-16 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="container mx-auto px-6"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center text-[#243771] mb-10">
            {lang === "id" ? "Berita Terbaru" : "Latest News"}
          </h2>

          {loading ? (
            <p className="text-center text-gray-500 italic">
              {lang === "id" ? "Memuat berita..." : "Loading news..."}
            </p>
          ) : beritaList.length === 0 ? (
            <p className="text-center text-gray-500 italic">
              {lang === "id" ? "Belum ada berita." : "No news available."}
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {beritaList.map((b, i) => (
                <article
                  key={b.id}
                  className="bg-white rounded-2xl border border-gray-200 shadow-[0_10px_24px_rgba(17,24,32,0.06)] hover:shadow-[0_14px_32px_rgba(17,24,32,0.12)] transition-all duration-300 overflow-hidden"
                >
                  <div className="relative w-full aspect-[4/3]">
                    <img
                      src={b.image}
                      alt={lang === "id" ? b.title_id : b.title_en}
                      className="object-cover w-full h-full"
                      loading="lazy"
                    />
                  </div>

                  <div className="p-4 md:p-5">
                    <p className="text-xs md:text-sm font-semibold text-[#FE4D01] mb-2">
                      {new Date(b.date).toLocaleDateString(
                        lang === "id" ? "id-ID" : "en-US"
                      )}
                    </p>

                    <h3 className="text-[15px] md:text-lg font-semibold text-[#111820] leading-snug mb-2">
                      {lang === "id" ? b.title_id : b.title_en}
                    </h3>

                    <p className="text-gray-600 text-sm md:text-[15px] leading-relaxed mb-3 line-clamp-3">
                      {lang === "id" ? b.desc_id : b.desc_en}
                    </p>

                    <Link
                      href={{
                        pathname: `/informasi/berita/${b.id}`,
                        query: { img: b.image },
                      }}
                      className="inline-block text-[13px] md:text-sm font-semibold text-[#FE4D01] hover:underline"
                    >
                      {lang === "id" ? "Baca Selengkapnya..." : "Read More..."}
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </motion.div>
      </section>
    </>
  );
}
