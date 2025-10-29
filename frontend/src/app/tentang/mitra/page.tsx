"use client";

import Link from "next/link";
import { useLang } from "../../components/LangContext";
import { useEffect, useState } from "react";
import { showError } from "@/lib/swalClient";

interface Mitra {
  id: number;
  name: string;
  img_id: string;
  img_en: string;
}

export default function MitraIndustri() {
  const { lang } = useLang();
  const [partners, setPartners] = useState<Mitra[]>([]);
  const [loading, setLoading] = useState(true);

  const API_BASE = "https://api.smkprestasiprima.sch.id";

  // === Resolver URL Gambar ===
  const resolveImageUrl = (path?: string) => {
    if (!path) return "";
    if (path.startsWith("http://")) return path.replace("http://", "https://");
    if (path.startsWith("https://")) return path;
    return `${API_BASE}${path.startsWith("/") ? "" : "/"}${path}`;
  };

  // === Fallback SVG lokal (urutan tetap) ===
  const fallbackImages = [
    "/svg/jatelindo.svg",
    "/svg/kemhan.svg",
    "/svg/kemenkop.svg",
    "/svg/Komatsu.svg",
    "/svg/Panasonic.svg",
    "/svg/transvision.svg",
    "/svg/starvision.svg",
    "/svg/wika.svg",
    "/svg/antam.svg",
  ];

  // === Ambil data mitra dari proxy HTTPS ===
  useEffect(() => {
    fetch("/api/portal/mitra/public", { cache: "no-store" })
      .then((r) => r.json())
      .then((j) => {
        if (j.success && Array.isArray(j.data)) setPartners(j.data);
        else console.warn("⚠️ Format data mitra tidak sesuai:", j);
      })
      .catch((err) => {
        console.error("❌ Gagal memuat data mitra:", err);
        showError("Gagal memuat mitra", "Tidak dapat mengambil data mitra saat ini.");
      })
      .finally(() => setLoading(false));
  }, []);

  // === Ganti gambar jika error ===
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>, idx: number) => {
    const fallback = fallbackImages[idx % fallbackImages.length];
    e.currentTarget.src = fallback;
  };

  return (
    <>
      {/* Spacer agar tidak tertutup navbar */}
      <div className="h-[100px] bg-white" />

      {/* === Breadcrumbs === */}
      <section className="w-full py-4 bg-white">
        <div className="container mx-auto px-4">
          <nav className="flex items-center text-sm font-medium space-x-2">
            <Link href="/" className="text-[#FE4D01] hover:underline">
              {lang === "id" ? "Beranda" : "Home"}
            </Link>
            <span className="text-[#FE4D01]">{">"}</span>
            <Link href="/informasi/mitra" className="text-[#FE4D01] hover:underline">
              {lang === "id" ? "Informasi" : "Information"}
            </Link>
            <span className="text-[#243771]">{">"}</span>
            <span className="text-[#243771]">
              {lang === "id" ? "Mitra Industri" : "Industry Partners"}
            </span>
          </nav>
        </div>
      </section>

      {/* === Section Mitra Industri === */}
      <main className="flex-1 w-full bg-white">
        <section className="w-full py-16">
          <div className="max-w-[80rem] mx-auto px-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#243771] text-center mb-12">
              {lang === "id" ? "Mitra Industri" : "Industry Partners"}
            </h2>

            {loading ? (
              <p className="text-center text-gray-500 italic">
                {lang === "id" ? "Memuat data mitra..." : "Loading partners..."}
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-items-center">
                {partners.length > 0 ? (
                  partners.map((p, i) => (
                    <div
                      key={p.id}
                      className="w-[280px] sm:w-[320px] lg:w-[370px] h-[180px] bg-white border border-gray-100 rounded-tr-[70px] rounded-bl-[70px] flex items-center justify-center transition-transform duration-500 hover:scale-[1.04] shadow-md"
                    >
                      <img
                        src={resolveImageUrl(lang === "id" ? p.img_id : p.img_en)}
                        alt={p.name}
                        loading="lazy"
                        className="max-h-[70%] max-w-[70%] object-contain"
                        onError={(e) => handleImageError(e, i)}
                      />
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 italic">
                    {lang === "id" ? "Belum ada data mitra." : "No partners available."}
                  </p>
                )}
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
      </main>
    </>
  );
}
