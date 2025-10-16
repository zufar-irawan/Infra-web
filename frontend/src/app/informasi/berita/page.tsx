"use client";

import Link from "next/link";
import Image from "next/image";
import { useLang } from "../../components/LangContext";
import { useEffect, useState } from "react";

interface BeritaItem {
  id: number;
  title_id: string;
  title_en: string;
  desc_id: string;
  desc_en: string;
  date: string;
  image: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export default function Berita() {
  const { lang } = useLang();
  const [beritaList, setBeritaList] = useState<BeritaItem[]>([]);
  const [isBackendActive, setIsBackendActive] = useState(false);

  useEffect(() => {
    const fetchBerita = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/news`, { cache: "no-store" });
        const json = await res.json();
        console.log("📦 Data dari backend:", json);

        // ✅ gunakan json.data sesuai struktur yang kamu kirim
        if (json.success && Array.isArray(json.data)) {
          setBeritaList(json.data);
          setIsBackendActive(true);
        } else {
          console.warn("⚠️ Format tidak sesuai atau data kosong");
          setIsBackendActive(false);
        }
      } catch (error) {
        console.error("❌ Gagal ambil berita dari backend:", error);
        setIsBackendActive(false);
      }
    };

    fetchBerita();
  }, []);

  return (
    <>
      <div className="h-[100px] bg-white" />

      {/* === Breadcrumbs === */}
      <section className="w-full py-4 bg-white">
        <div className="container mx-auto px-4">
          <nav className="flex items-center text-sm font-medium space-x-2">
            <Link href="/" className="text-[#FE4D01] hover:underline">
              {lang === "id" ? "Beranda" : "Home"}
            </Link>
            <span className="text-[#FE4D01]">{">"}</span>
            <Link href="/informasi/berita" className="text-[#FE4D01] hover:underline">
              {lang === "id" ? "Informasi" : "Information"}
            </Link>
            <span className="text-[#243771]">{">"}</span>
            <span className="text-[#243771]">{lang === "id" ? "Berita" : "News"}</span>
          </nav>
        </div>
      </section>

      {/* === Intro Section === */}
      <section className="relative w-full bg-white">
        <div className="max-w-6xl mx-auto px-4 pt-16 pb-24">
          <h2 className="text-3xl sm:text-4xl font-semibold text-[#243771] text-center mb-12">
            {lang === "id" ? "Berita" : "News"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <img
                src="/avif/ppdb.avif"
                alt="SMK Prestasi Prima"
                className="rounded-xl w-full h-auto object-cover aspect-[4/3] hover:scale-[1.03] hover:shadow-xl transition-transform duration-500"
              />
            </div>

            <div>
              <p className="text-gray-700 leading-relaxed text-justify text-base sm:text-lg mb-6">
                {lang === "id"
                  ? "Telusuri berita terbaru untuk mendapatkan informasi terkini tentang kegiatan, prestasi, dan inovasi di SMK Prestasi Prima."
                  : "Explore the latest news to stay updated on SMK Prestasi Prima’s activities, achievements, and innovations."}
              </p>

              <p className="text-sm text-gray-500">
                {isBackendActive
                  ? "✅ Data diambil dari server Laravel."
                  : "⚠️ Backend belum aktif atau tidak ada data."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* === Section Berita === */}
      <section className="w-full bg-white py-10 sm:py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-[#243771] mb-10">
            {lang === "id" ? "Berita Terbaru" : "Latest News"}
          </h2>

          {beritaList.length === 0 ? (
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
                  <div className="relative w-full h-48 md:h-52">
                    <Image
                      src={b.image}
                      alt={lang === "id" ? b.title_id : b.title_en}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="p-4 md:p-5">
                    <p className="text-xs md:text-sm font-semibold text-[#FE4D01] mb-2">
                      {new Date(b.date).toLocaleDateString(lang === "id" ? "id-ID" : "en-US")}
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
        </div>
      </section>

      {/* === Section Gedung === */}
      <section className="relative w-full bg-white overflow-hidden">
        <img
          src="/avif/gedung.avif"
          alt={lang === "id" ? "Gedung SMK Prestasi Prima" : "Prestasi Prima Building"}
          className="w-full h-[40vh] sm:h-[55vh] lg:h-screen object-cover object-center hover:scale-[1.02] transition-transform duration-700"
        />
      </section>
    </>
  );
}
