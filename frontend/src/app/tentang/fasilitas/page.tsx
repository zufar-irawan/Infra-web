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

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export default function Fasilitas() {
  const { lang } = useLang();
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    "Laboratorium & Studio",
    "Fasilitas Akademik",
    "Fasilitas Olahraga",
    "Fasilitas Umum",
  ];

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/facilities/public`);
        if (res.data.success) setFacilities(res.data.data);
      } catch (err) {
        console.error("Gagal memuat data fasilitas:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFacilities();
  }, []);

  const groupedFacilities = categories.map((cat) => ({
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
            <Link
              href="/tentang/fasilitas"
              className="text-[#FE4D01] hover:underline"
            >
              {lang === "id" ? "Tentang Kami" : "About Us"}
            </Link>
            <span className="text-[#243771]">{">"}</span>
            <span className="text-[#243771]">
              {lang === "id" ? "Fasilitas" : "Facilities"}
            </span>
          </nav>
        </div>
      </section>

      {/* === Konten Utama === */}
      <main className="flex-1 w-full bg-white">
        {/* === Section Fasilitas === */}
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

            {/* === Gambar Interaktif di bawah deskripsi === */}
            <div className="flex justify-center mb-16">
              <Link
                href="/virtual-tour"
                className="relative w-[1060px] h-[504px] rounded-2xl overflow-hidden group block"
              >
                <img
                  src={
                    lang === "id"
                      ? "/webp/turv-id.webp"
                      : "/webp/turv-eng.webp"
                  }
                  alt={
                    lang === "id"
                      ? "Fasilitas SMK Prestasi Prima"
                      : "Facilities of Prestasi Prima"
                  }
                  width={1060}
                  height={504}
                  loading="lazy"
                  className="w-full h-full object-cover transition-all duration-500"
                />

                {/* Overlay saat hover */}
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
                Memuat fasilitas...
              </p>
            ) : facilities.length === 0 ? (
              <p className="text-center text-gray-500 italic">
                Belum ada data fasilitas.
              </p>
            ) : (
              groupedFacilities.map((group, idx) => (
                <div key={idx} className="mb-24">
                  <h3 className="text-2xl sm:text-3xl font-semibold text-[#FE4D01] mb-10 text-center">
                    {group.title}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
                    {group.items.map((item, i) => (
                      <img
                        key={i}
                        src={lang === "id" ? item.img_id : item.img_en}
                        alt={`${group.title} ${i + 1}`}
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

        {/* === Section Gedung === */}
        <section className="relative w-full bg-white overflow-hidden">
          <img
            src="/avif/gedung.avif"
            alt={
              lang === "id"
                ? "Gedung SMK Prestasi Prima"
                : "Prestasi Prima Building"
            }
            loading="lazy"
            className="w-full h-[40vh] sm:h-[55vh] lg:h-screen object-cover object-center transition-transform duration-700"
          />
        </section>
      </main>
    </>
  );
}
