"use client";

import Link from "next/link";
import { useLang } from "../../components/LangContext";
import { useEffect, useState, useRef } from "react";

interface PrestasiItem {
  id: number;
  poster: string | null;
}

export default function Prestasi() {
  const { lang } = useLang();
  const [items, setItems] = useState<PrestasiItem[]>([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const API_BASE = "https://api.smkprestasiprima.sch.id";

  // === Gambar fallback lokal ===
  const fallbackItems: string[] = [
    "/prestasi/p1.webp",
    "/prestasi/p2.webp",
    "/prestasi/p3.webp",
    "/prestasi/p4.webp",
    "/prestasi/p5.webp",
    "/prestasi/p6.webp",
    "/prestasi/p7.webp",
    "/prestasi/p8.webp",
    "/prestasi/p9.webp",
    "/prestasi/p10.webp",
  ];

  // === Ambil data prestasi dari backend Laravel via proxy ===
  useEffect(() => {
    fetch("/api/portal/prestasi/public", { cache: "no-store" })
      .then((r) => r.json())
      .then((j) => {
        if (j.success && Array.isArray(j.data) && j.data.length > 0) {
          const mapped = j.data.map((item: any, i: number) => {
            let img = item.poster || "";

            // 🔒 FIX: pastikan URL gambar 100% valid HTTPS
            if (img.startsWith("http://") || img.startsWith("https://")) {
              img = img.replace("http://", "https://");
            } else if (img.trim() !== "") {
              img = `${API_BASE}${img.startsWith("/") ? "" : "/"}${img}`;
            }

            return {
              id: item.id,
              poster: img || fallbackItems[i % fallbackItems.length],
            };
          });
          setItems(mapped);
        } else {
          setItems(fallbackItems.map((f, i) => ({ id: i + 1, poster: f })));
        }
      })
      .catch(() => {
        setItems(fallbackItems.map((f, i) => ({ id: i + 1, poster: f })));
      })
      .finally(() => setLoading(false));
  }, []);

  // === Animasi muncul ===
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
              {lang === "id" ? "Kehidupan Siswa" : "Student Life"}
            </Link>
            <span className="text-[#243771]">{">"}</span>
            <span className="text-[#243771]">
              {lang === "id" ? "Prestasi" : "Achievements"}
            </span>
          </nav>
        </div>
      </section>

      {/* === Section Prestasi === */}
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

          {loading ? (
            <p className="text-center text-gray-500 italic">
              {lang === "id"
                ? "Memuat data prestasi..."
                : "Loading achievements..."}
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 justify-center">
              {items.map((img, i) => (
                <div
                  key={img.id}
                  className="w-full max-w-[295px] mx-auto bg-white rounded-md overflow-hidden shadow-[0_4px_4px_rgba(0,0,0,0.25)] hover:scale-[1.02] transition-transform duration-300"
                >
                  <img
                    src={img.poster ?? fallbackItems[i % fallbackItems.length]}
                    alt={`Prestasi ${img.id}`}
                    className="w-full h-auto object-cover"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src =
                        fallbackItems[i % fallbackItems.length];
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* === Section Gedung === */}
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
    </>
  );
}
