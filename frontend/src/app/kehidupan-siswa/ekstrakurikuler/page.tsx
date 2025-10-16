"use client";

import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { useLang } from "../../components/LangContext";
import { useEffect, useState } from "react";

interface Ekskul {
  id: number;
  name_id: string;
  name_en: string;
  img: string;
  ig: string;
}

export default function Ekstrakurikuler() {
  const { lang } = useLang();
  const [ekskul, setEkskul] = useState<Ekskul[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

  useEffect(() => {
    const fetchEkskul = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/ekskul/list`);
        setEkskul(res.data.data);
      } catch (err) {
        console.error("Gagal memuat data ekskul:", err);
        setError("Gagal memuat data ekstrakurikuler.");
      } finally {
        setLoading(false);
      }
    };
    fetchEkskul();
  }, []);

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
            <Link
              href="/kehidupan-siswa/ekstrakurikuler"
              className="text-[#FE4D01] hover:underline"
            >
              {lang === "id" ? "Kehidupan Siswa" : "Student Life"}
            </Link>
            <span className="text-[#243771]">{">"}</span>
            <span className="text-[#243771]">
              {lang === "id" ? "Ekstrakurikuler" : "Extracurricular"}
            </span>
          </nav>
        </div>
      </section>

      {/* === Section Ekstrakurikuler === */}
      <section className="w-full bg-white py-10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-[#243771] mb-2">
            {lang === "id" ? "Ekstrakurikuler" : "Extracurricular"}
          </h2>
          <p className="text-[#243771] mb-10 text-sm md:text-base">
            {lang === "id"
              ? "Ekstrakurikuler: Wadah Bakat dan Ciptakan Generasi Berprestasi."
              : "Extracurricular: A place to develop talents and create achievers."}
          </p>

          {/* === Kondisi Loading / Error === */}
          {loading ? (
            <p className="text-gray-500 italic">Memuat data...</p>
          ) : error ? (
            <p className="text-red-500 italic">{error}</p>
          ) : ekskul.length === 0 ? (
            <p className="text-gray-500 italic">
              Tidak ada data ekstrakurikuler.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 justify-items-center">
              {ekskul.map((item) => (
                <a
                  key={item.id}
                  href={item.ig}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative group flex items-center justify-between w-[297.04px] h-[168.47px] bg-white rounded-[10px] shadow-[0_4px_4px_rgba(0,0,0,0.25)] overflow-hidden hover:scale-[1.02] transition-transform duration-300"
                >
                  {/* Gambar Ekskul */}
                  <div className="flex-1 flex items-center justify-center">
                    <Image
                      src={item.img}
                      alt={item.name_id}
                      width={95}
                      height={95}
                      className="object-contain z-10"
                      unoptimized
                    />
                  </div>

                  {/* Panel Biru Kanan */}
                  <div className="h-full w-[50.84px] bg-[#243771] flex items-center justify-center rounded-r-[10px] z-10">
                    <span
                      className="text-white font-semibold text-[13px] transform -rotate-90 whitespace-nowrap"
                      style={{ letterSpacing: "0.5px" }}
                    >
                      {lang === "id" ? item.name_id : item.name_en}
                    </span>
                  </div>

                  {/* Overlay Hover */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white text-sm font-medium z-20 text-center px-2">
                    {lang === "id"
                      ? "Klik untuk menuju Instagram"
                      : "Click to open Instagram"}
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* === Section Gedung === */}
      <main className="flex-1 w-full bg-white">
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
