"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useLang } from "@/app/components/LangContext";

interface BeritaItem {
  id: number;
  date: string;
  title_id: string;
  title_en: string;
  desc_id: string;
  desc_en: string;
  image: string;
}

export default function DetailBerita() {
  const { lang } = useLang();
  const { id } = useParams();
  const [berita, setBerita] = useState<BeritaItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchDetail = async () => {
      try {
        const res = await fetch(`/api/portal/berita/${id}/public`, {
          cache: "no-store",
        });
        const json = await res.json();
        if (json.success && json.data) {
          setBerita(json.data);
          setNotFound(false);
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error("❌ Gagal memuat detail berita:", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500 text-lg animate-pulse">
          {lang === "id" ? "Memuat berita..." : "Loading news..."}
        </p>
      </div>
    );
  }

  if (notFound || !berita) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-[#243771] mb-4">
          {lang === "id" ? "Berita tidak ditemukan" : "News not found"}
        </h1>
        <Link
          href="/informasi/berita"
          className="text-[#FE4D01] font-semibold hover:underline"
        >
          ← {lang === "id" ? "Kembali ke Berita" : "Back to News"}
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Spacer biar gak ketutup navbar */}
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
              href="/informasi/berita"
              className="text-[#FE4D01] hover:underline"
            >
              {lang === "id" ? "Berita" : "News"}
            </Link>
            <span className="text-[#243771]">{">"}</span>
            <span className="text-[#243771] truncate max-w-[200px] sm:max-w-[400px]">
              {lang === "id" ? berita.title_id : berita.title_en}
            </span>
          </nav>
        </div>
      </section>

      {/* === Konten Utama === */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Judul dan Tanggal */}
        <div className="text-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#243771] mb-2 leading-snug">
            {lang === "id" ? berita.title_id : berita.title_en}
          </h1>
          <p className="text-sm text-gray-500">
            {new Date(berita.date).toLocaleDateString(
              lang === "id" ? "id-ID" : "en-US",
              { day: "numeric", month: "long", year: "numeric" }
            )}
          </p>
        </div>

        {/* Gambar Berita */}
        <div className="relative w-full h-80 sm:h-96 mb-8 rounded-xl overflow-hidden">
          <Image
            src={berita.image}
            alt={lang === "id" ? berita.title_id : berita.title_en}
            fill
            className="object-cover"
            unoptimized
          />
        </div>

        {/* Tombol kembali */}
        <div className="flex justify-center mb-10">
          <Link
            href="/informasi/berita"
            className="inline-block bg-[#FE4D01] hover:bg-orange-600 text-white font-semibold px-6 py-2.5 rounded-md transition-all duration-300"
          >
            ← {lang === "id" ? "Kembali ke Berita" : "Back to News"}
          </Link>
        </div>

        {/* Isi berita */}
        <div className="text-gray-700 leading-relaxed text-justify text-lg whitespace-pre-line">
          {lang === "id" ? berita.desc_id : berita.desc_en}
        </div>
      </div>
    </>
  );
}
