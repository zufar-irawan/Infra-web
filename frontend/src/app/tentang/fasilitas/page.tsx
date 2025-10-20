"use client";

import Link from "next/link";
import { useLang } from "../../components/LangContext";
import { useEffect, useState } from "react";

interface Facility {
  id: number;
  img_id: string;
  img_en: string;
  category: string;
}

export default function Fasilitas() {
  const { lang } = useLang();
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const API_BASE = "https://api.smkprestasiprima.sch.id";

  const resolveImage = (url: string) => {
    if (!url) return "";
    if (url.startsWith("http://")) return url.replace("http://", "https://");
    if (url.startsWith("https://")) return url;
    return `${API_BASE}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  useEffect(() => {
    fetch("/api/portal/facilities/public", { cache: "no-store" })
      .then((r) => r.json())
      .then((j) => {
        if (j.success && Array.isArray(j.data)) setFacilities(j.data);
        else setFacilities([]);
      })
      .catch((err) => {
        console.error("❌ Gagal memuat data fasilitas:", err);
        setFacilities([]);
      })
      .finally(() => setLoading(false));
  }, []);

  // === Kelompok kategori unik ===
  const categories = Array.from(new Set(facilities.map((f) => f.category)));

  const grouped = categories.map((cat) => ({
    title: cat,
    items: facilities.filter((f) => f.category === cat),
  }));

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
            <Link href="/tentang/fasilitas" className="text-[#FE4D01] hover:underline">
              {lang === "id" ? "Fasilitas" : "Facility"}
            </Link>
            <span className="text-[#243771]">{">"}</span>
            <span className="text-[#243771]">
              {lang === "id" ? "Fasilitas" : "Facilities"}
            </span>
          </nav>
        </div>
      </section>

      {/* === Section Fasilitas === */}
      <main className="flex-1 w-full bg-white">
        <section className="w-full py-20">
          <div className="max-w-[95rem] mx-auto px-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#243771] text-center mb-4">
              {lang === "id" ? "Fasilitas" : "Facilities"}
            </h2>
            <p className="text-center text-gray-600 max-w-2xl mx-auto mb-8 text-sm sm:text-base">
              {lang === "id"
                ? "Kami menyediakan berbagai fasilitas modern untuk mendukung proses pembelajaran siswa."
                : "We provide various modern facilities to support students' learning process."}
            </p>

            {/* Virtual Tour */}
            <div className="flex justify-center mb-16">
              <Link
                href="/virtual-tour"
                className="relative w-[1060px] h-[504px] rounded-2xl overflow-hidden group block"
              >
                <img
                  src={lang === "id" ? "/webp/turv-id.webp" : "/webp/turv-eng.webp"}
                  alt="Virtual tour SMK Prestasi Prima"
                  width={1060}
                  height={504}
                  className="w-full h-full object-cover transition-all duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-500 flex items-center justify-center">
                  <span className="text-white text-2xl sm:text-3xl font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    {lang === "id" ? "Mulai" : "Start"}
                  </span>
                </div>
              </Link>
            </div>

            {/* === Daftar Fasilitas === */}
            {loading ? (
              <p className="text-center text-gray-500 italic">
                {lang === "id" ? "Memuat fasilitas..." : "Loading facilities..."}
              </p>
            ) : grouped.length === 0 ? (
              <p className="text-center text-gray-500 italic">
                {lang === "id" ? "Belum ada data fasilitas." : "No facilities available."}
              </p>
            ) : (
              grouped.map((group) => (
                <div key={group.title} className="mb-24">
                  <h3 className="text-2xl sm:text-3xl font-semibold text-[#FE4D01] mb-10 text-center">
                    {group.title}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
                    {group.items.map((f) => (
                      <img
                        key={f.id}
                        src={resolveImage(lang === "id" ? f.img_id : f.img_en)}
                        alt={f.category}
                        loading="lazy"
                        className="w-full max-w-[420px] aspect-[392/362] object-contain cursor-pointer transition-transform duration-500 hover:scale-[1.02]"
                      />
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Gambar gedung */}
        <section className="relative w-full bg-white overflow-hidden">
          <img
            src="/avif/gedung.avif"
            alt={lang === "id" ? "Gedung SMK Prestasi Prima" : "Prestasi Prima Building"}
            loading="lazy"
            className="w-full h-[40vh] sm:h-[55vh] lg:h-screen object-cover object-center transition-transform duration-700"
          />
        </section>
      </main>
    </>
  );
}
