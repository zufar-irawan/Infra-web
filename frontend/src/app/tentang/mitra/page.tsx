"use client";

import Link from "next/link";
import { useLang } from "../../components/LangContext";
import { useEffect, useState } from "react";
import axios from "axios";

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

  useEffect(() => {
    axios
      .get("/api/portal/mitra/public")
      .then((res) => {
        if (res.data.success) setPartners(res.data.data);
        else console.error("Gagal ambil data mitra:", res.data.message);
      })
      .catch((err) => console.error("Gagal memuat data mitra:", err))
      .finally(() => setLoading(false));
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
            <Link href="/tentang/mitra" className="text-[#FE4D01] hover:underline">
              {lang === "id" ? "Tentang Kami" : "About Us"}
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
              <p className="text-center text-gray-500 italic">Memuat data mitra...</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-items-center">
                {partners.length > 0 ? (
                  partners.map((p) => (
                    <div
                      key={p.id}
                      className="w-[280px] sm:w-[320px] lg:w-[370px] h-[180px] bg-white border border-gray-100 rounded-tr-[70px] rounded-bl-[70px] flex items-center justify-center transition-transform duration-500 hover:scale-[1.04] shadow-md"
                    >
                      <img
                        src={lang === "id" ? p.img_id : p.img_en}
                        alt={p.name}
                        loading="lazy"
                        className="max-h-[70%] max-w-[70%] object-contain"
                      />
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 italic">Belum ada data mitra.</p>
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
