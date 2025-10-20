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
  const API_BASE = "https://api.smkprestasiprima.sch.id";

  // === Ambil berita terbaru dari proxy HTTPS ===
  useEffect(() => {
    async function fetchBerita() {
      try {
        const res = await fetch("/api/portal/berita/public", { cache: "no-store" });
        const j = await res.json();

        if (j.success && Array.isArray(j.data)) {
          // ambil 3 berita terbaru, pastikan image selalu HTTPS
          const mapped = j.data.slice(0, 3).map((b: any) => {
            let img = b.image || "";
            if (img.startsWith("http://")) img = img.replace("http://", "https://");
            else if (!img.startsWith("https://"))
              img = `${API_BASE}${img.startsWith("/") ? "" : "/"}${img}`;

            return {
              id: b.id,
              title_id: b.title_id || "-",
              title_en: b.title_en || "-",
              desc_id: b.desc_id || "",
              desc_en: b.desc_en || "",
              date: b.date || "",
              image: img,
            };
          });

          setBeritaList(mapped);
        } else {
          setBeritaList([]);
        }
      } catch (err) {
        console.error("❌ Gagal ambil berita section:", err);
        setBeritaList([]);
      } finally {
        setLoading(false);
      }
    }

    fetchBerita();
  }, []);

  // === Animasi saat muncul di viewport ===
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setIsVisible(true)),
      { threshold: 0.2 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full bg-white py-20 overflow-hidden">
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
            {beritaList.map((b) => (
              <article
                key={b.id}
                className="bg-white rounded-2xl border border-gray-200 shadow-[0_10px_24px_rgba(17,24,32,0.06)] hover:shadow-[0_14px_32px_rgba(17,24,32,0.12)] transition-all duration-300 overflow-hidden"
              >
                {b.image && (
                  <div className="relative w-full h-48 md:h-52">
                    <img
                      src={b.image}
                      alt={lang === "id" ? b.title_id : b.title_en}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = "none";
                      }}
                      className="object-cover w-full h-full"
                      loading="lazy"
                    />
                  </div>
                )}

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
  );
}
