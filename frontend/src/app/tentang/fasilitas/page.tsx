"use client";

import Link from "next/link";
import { useLang } from "../../components/LangContext";
import { useEffect, useState } from "react";
import axios from "axios";

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

  // === Fallback lokal (berdasarkan ID DB) ===
  const staticFacilities: Record<number, Facility> = {
    9:  { id: 9,  img_id: "/fasilitas/ldkv-w.webp", img_en: "/fasilitas/ldkv-eng-w.webp", category: "Laboratorium & Studio" },
    12: { id: 12, img_id: "/fasilitas/lrpl-w.webp", img_en: "/fasilitas/lrpl-eng-w.webp", category: "Laboratorium & Studio" },
    13: { id: 13, img_id: "/fasilitas/ltkj-w.webp", img_en: "/fasilitas/ltkj-eng-w.webp", category: "Laboratorium & Studio" },
    14: { id: 14, img_id: "/fasilitas/lsbc-w.webp", img_en: "/fasilitas/lsbc-eng-w.webp", category: "Laboratorium & Studio" },
    15: { id: 15, img_id: "/fasilitas/kelas (1).webp", img_en: "/fasilitas/kelas-eng.webp", category: "Fasilitas Akademik" },
    18: { id: 18, img_id: "/fasilitas/perpustakaan.webp", img_en: "/fasilitas/perpustakaan-eng.webp", category: "Fasilitas Akademik" },
    19: { id: 19, img_id: "/fasilitas/lap.webp", img_en: "/fasilitas/lap-eng.webp", category: "Fasilitas Olahraga" },
    21: { id: 21, img_id: "/fasilitas/mushola.webp", img_en: "/fasilitas/mushola-eng.webp", category: "Fasilitas Umum" },
    22: { id: 22, img_id: "/fasilitas/aula.webp", img_en: "/fasilitas/aula-eng.webp", category: "Fasilitas Umum" },
    23: { id: 23, img_id: "/fasilitas/uks.webp", img_en: "/fasilitas/uks-eng.webp", category: "Fasilitas Umum" },
    24: { id: 24, img_id: "/fasilitas/kantin.webp", img_en: "/fasilitas/kantin-eng.webp", category: "Fasilitas Umum" },
  };

  const categories = [
    "Laboratorium & Studio",
    "Fasilitas Akademik",
    "Fasilitas Olahraga",
    "Fasilitas Umum",
  ];

  // === Ambil data API (fallback lokal jika gagal) ===
  useEffect(() => {
    axios
      .get("/api/portal/facilities/public")
      .then((res) => {
        if (res.data.success && Array.isArray(res.data.data)) {
          setFacilities(res.data.data);
        } else {
          console.warn("⚠️ API kosong, pakai lokal berdasarkan ID DB");
          setFacilities(Object.values(staticFacilities));
        }
      })
      .catch((err) => {
        console.error("❌ API error:", err);
        setFacilities(Object.values(staticFacilities));
      })
      .finally(() => setLoading(false));
  }, []);

  const resolveImage = (url: string) =>
    url?.startsWith("http") ? url : `${API_BASE}${url}`;

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>, id: number) => {
    const fallback = staticFacilities[id];
    if (fallback) {
      e.currentTarget.src = lang === "id" ? fallback.img_id : fallback.img_en;
    }
  };

  // === Kelompokkan per kategori ===
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
              {lang === "id" ? "Tentang Kami" : "About Us"}
            </Link>
            <span className="text-[#243771]">{">"}</span>
            <span className="text-[#243771]">
              {lang === "id" ? "Fasilitas" : "Facilities"}
            </span>
          </nav>
        </div>
      </section>

      <main className="flex-1 w-full bg-white">
        <section className="w-full py-20">
          <div className="max-w-[95rem] mx-auto px-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#243771] text-center mb-4">
              {lang === "id" ? "Fasilitas" : "Facilities"}
            </h2>
            <p className="text-center text-gray-600 max-w-2xl mx-auto mb-8 text-sm sm:text-base">
              {lang === "id"
                ? "Kami percaya bahwa setiap siswa memiliki potensi dan keunikan untuk dikembangkan menjadi individu yang utuh dengan karakter kuat, dasar akademik, dan keterampilan."
                : "We believe every student has potential and uniqueness to be developed into a whole individual with strong character, academic foundation, and skills."}
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
                        onError={(e) => handleImageError(e, f.id)}
                        className="w-full max-w-[420px] aspect-[392/362] object-contain cursor-pointer transition-transform duration-500 hover:scale-[1.02]"
                      />
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

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
