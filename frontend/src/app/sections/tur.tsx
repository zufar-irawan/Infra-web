"use client";

import Link from "next/link";
import { useLang } from "../components/LangContext";
import { useState, useEffect } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface NewsItem {
  id: number;
  title_id: string;
  title_en: string;
  desc_id: string;
  desc_en: string;
  date: string;
  image: string;
}

const API_BASE_URL = "http://api.smkprestasiprima.sch.id/api";

export default function Berita() {
  const { lang } = useLang();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [current, setCurrent] = useState(0);

  // === Ambil data dari API ===
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/news`, { cache: "no-store" });
        const json = await res.json();
        console.log("📦 Data berita:", json);

        // Jika struktur Laravel pakai { success, data: [...] }
        if (json.success && Array.isArray(json.data)) {
          setNews(json.data);
        } else if (Array.isArray(json)) {
          setNews(json);
        } else {
          console.warn("⚠️ Format berita tidak sesuai, tampilkan kosong");
          setNews([]);
        }
      } catch (error) {
        console.error("❌ Gagal ambil berita:", error);
      }
    };

    fetchNews();
  }, []);

  // === Navigasi Carousel ===
  const nextSlide = () => setCurrent((prev) => (prev + 1) % news.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + news.length) % news.length);

  // === Posisi Card ===
  const getPositionClass = (index: number) => {
    const diff = (index - current + news.length) % news.length;
    switch (diff) {
      case 0:
        return "z-30 scale-100 opacity-100 translate-x-0";
      case 1:
        return "z-20 scale-90 opacity-80 translate-x-[270px] sm:translate-x-[500px]";
      case news.length - 1:
        return "z-20 scale-90 opacity-80 -translate-x-[270px] sm:-translate-x-[500px]";
      default:
        return "opacity-0 scale-75 pointer-events-none";
    }
  };

  return (
    <section id="berita" className="py-20 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 lg:px-20 text-center">
        {/* === Title === */}
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#FE4D01]">
          {lang === "id" ? "Berita Terkini" : "Latest News"}
        </h2>
        <p className="text-[#243771] mb-12 text-sm md:text-base">
          {lang === "id"
            ? "Ikuti perkembangan berita terbaru dari SMK Prestasi Prima"
            : "Stay updated with the latest news from SMK Prestasi Prima"}
        </p>

        {/* === Carousel Container === */}
        <div className="relative flex flex-col items-center justify-center">
          <div className="relative flex items-center justify-center w-full h-[460px]">
            {news.length === 0 ? (
              <p className="text-gray-500">
                {lang === "id" ? "Memuat berita..." : "Loading news..."}
              </p>
            ) : (
              news.map((item, index) => (
                <div
                  key={item.id}
                  className={`absolute transition-all duration-700 ease-[cubic-bezier(0.68,-0.55,0.27,1.55)] ${getPositionClass(
                    index
                  )}`}
                >
                  <div className="bg-white rounded-[12px] shadow-xl border border-gray-100 overflow-hidden w-[280px] sm:w-[340px] md:w-[420px] h-[440px] flex flex-col mx-auto">
                    <div className="h-[200px] w-full overflow-hidden">
                      <img
                        src={
                          item.image?.startsWith("http")
                            ? item.image
                            : `http://api.smkprestasiprima.sch.id/storage/${item.image}`
                        }
                        alt={lang === "id" ? item.title_id : item.title_en}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      />
                    </div>
                    <div className="p-4 text-left flex flex-col justify-between flex-1">
                      <p className="text-sm text-[#FE4D01] font-medium">
                        {new Date(item.date).toLocaleDateString(
                          lang === "id" ? "id-ID" : "en-US",
                          { day: "numeric", month: "long", year: "numeric" }
                        )}
                      </p>
                      <h3 className="font-bold text-md mb-2 line-clamp-2">
                        {lang === "id" ? item.title_id : item.title_en}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                        {lang === "id" ? item.desc_id : item.desc_en}
                      </p>
                      <Link
                        href={`/informasi/berita/${item.id}`}
                        className="text-sm font-semibold text-[#FE4D01] hover:underline mt-auto"
                      >
                        {lang === "id"
                          ? "Baca Selengkapnya..."
                          : "Read More..."}
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* === Navigation + Button === */}
          {news.length > 0 && (
            <div className="flex justify-center gap-6 mt-8 items-center">
              <button
                onClick={prevSlide}
                className="p-3 md:p-4 bg-white rounded-[10px] shadow-[0_4px_10px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_14px_rgba(254,77,1,0.3)] transition"
              >
                <FiChevronLeft className="w-6 h-6 text-[#FE4D01]" />
              </button>

              <button
                onClick={nextSlide}
                className="p-3 md:p-4 bg-white rounded-[10px] shadow-[0_4px_10px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_14px_rgba(254,77,1,0.3)] transition"
              >
                <FiChevronRight className="w-6 h-6 text-[#FE4D01]" />
              </button>

              <Link
                href="/informasi/berita"
                className="p-3 md:p-4 bg-white rounded-[10px] shadow-[0_4px_10px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_14px_rgba(254,77,1,0.3)] transition font-semibold text-[#FE4D01] text-sm"
              >
                {lang === "id" ? "Selengkapnya" : "View All"}
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* === Ornamen Oranye === */}
      <div className="absolute bottom-0 right-0 w-[50px] h-[50px] bg-[#FE4D01]" />
      <div className="absolute bottom-0 right-25 w-[50px] h-[50px] bg-[#FE4D01]" />
    </section>
  );
}
