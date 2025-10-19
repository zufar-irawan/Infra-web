"use client";

import Link from "next/link";
import { useLang } from "../components/LangContext";
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

export default function BeritaSection() {
  const { lang } = useLang();
  const [beritaList, setBeritaList] = useState<BeritaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  const API_BASE = "http://api.smkprestasiprima.sch.id"; // masih HTTP
  const fallbackImages = [
    "/berita/expo.webp",
    "/berita/ppdb.webp",
    "/berita/kokurikuler.webp",
  ];

  // === Ambil berita terbaru dari API ===
  useEffect(() => {
    async function loadBerita() {
      try {
        const res = await fetch("/api/portal/berita/public", { cache: "no-store" });
        const j = await res.json();

        if (j.success && Array.isArray(j.data) && j.data.length > 0) {
          // hanya ambil 3 berita terbaru
          const fixed = j.data.slice(0, 3).map((b: BeritaItem, i: number) => ({
            ...b,
            image:
              b.image?.startsWith("http") && !b.image.includes("https://")
                ? b.image.replace("https://", "http://")
                : `${API_BASE}${b.image}`,
          }));
          setBeritaList(fixed);
        } else {
          // fallback dummy
          setBeritaList(
            fallbackImages.map((img, i) => ({
              id: i + 1,
              title_id: "Berita Sekolah",
              title_en: "School News",
              desc_id:
                "Berita sementara ditampilkan karena server API tidak dapat dijangkau.",
              desc_en: "Temporary news shown because API is unreachable.",
              date: "2025-10-19",
              image: img,
            }))
          );
        }
      } catch (err) {
        console.error("❌ Gagal ambil berita section:", err);
        // fallback jika total gagal
        setBeritaList(
          fallbackImages.map((img, i) => ({
            id: i + 1,
            title_id: "Berita Sekolah",
            title_en: "School News",
            desc_id:
              "Berita sementara ditampilkan karena server API tidak dapat dijangkau.",
            desc_en: "Temporary news shown because API is unreachable.",
            date: "2025-10-19",
            image: img,
          }))
        );
      } finally {
        setLoading(false);
      }
    }

    loadBerita();
  }, []);

  // === Animasi saat muncul ===
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => entry.isIntersecting && setIsVisible(true)),
      { threshold: 0.2 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  // === Fallback runtime kalau gambar gagal load ===
  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement>,
    idx: number
  ) => {
    e.currentTarget.src = fallbackImages[idx % fallbackImages.length];
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-white py-20 overflow-hidden"
    >
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
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {beritaList.map((b, i) => (
              <article
                key={b.id}
                className="bg-white rounded-2xl border border-gray-200 shadow-[0_10px_24px_rgba(17,24,32,0.06)] hover:shadow-[0_14px_32px_rgba(17,24,32,0.12)] transition-all duration-300 overflow-hidden"
              >
                <div className="relative w-full h-48 md:h-52">
                  <img
                    src={b.image}
                    alt={lang === "id" ? b.title_id : b.title_en}
                    onError={(e) => handleImageError(e, i)}
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
                    href={`/informasi/berita/${b.id}`}
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
  );
}
