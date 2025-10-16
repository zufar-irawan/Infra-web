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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

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
        const res = await fetch(`${API_BASE_URL}/news/${id}`, { cache: "no-store" });
        if (!res.ok) throw new Error("Not Found");

        const json = await res.json();
        if (json?.success && json.data) {
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

  // === Loading State ===
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500 text-lg animate-pulse">
          {lang === "id" ? "Memuat berita..." : "Loading news..."}
        </p>
      </div>
    );
  }

  // === Tidak ditemukan ===
  if (notFound || !berita) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-[#243771] mb-4">
          {lang === "id" ? "Berita tidak ditemukan" : "News not found"}
        </h1>
        <Link href="/informasi/berita" className="text-[#FE4D01] font-semibold hover:underline">
          ← {lang === "id" ? "Kembali ke Berita" : "Back to News"}
        </Link>
      </div>
    );
  }

  // === Tampilan Detail ===
  return (
    <>
      {/* Spacer biar gak ketutup navbar */}
      <div className="h-[100px] bg-white" />

      {/* === Breadcrumbs === */}
      <section className="w-full py-4 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4">
          <nav className="flex items-center text-sm font-medium space-x-2">
            <Link href="/" className="text-[#FE4D01] hover:underline">
              {lang === "id" ? "Beranda" : "Home"}
            </Link>
            <span className="text-[#FE4D01]">{">"}</span>
            <Link href="/informasi/berita" className="text-[#FE4D01] hover:underline">
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
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#243771] mb-2">
          {lang === "id" ? berita.title_id : berita.title_en}
        </h1>

        <p className="text-sm text-gray-500 mb-6">
          {new Date(berita.date).toLocaleDateString(lang === "id" ? "id-ID" : "en-US")}
        </p>

        <div className="relative w-full h-80 sm:h-96 mb-8 rounded-xl overflow-hidden shadow-md">
          <Image
            src={berita.image}
            alt={lang === "id" ? berita.title_id : berita.title_en}
            fill
            className="object-cover"
          />
        </div>

        <p className="text-gray-700 leading-relaxed text-justify text-lg whitespace-pre-line">
          {lang === "id" ? berita.desc_id : berita.desc_en}
        </p>

        {/* Tombol kembali */}
        <div className="mt-10 text-center">
          <Link
            href="/informasi/berita"
            className="inline-block text-[#FE4D01] font-semibold hover:underline"
          >
            ← {lang === "id" ? "Kembali ke Berita" : "Back to News"}
          </Link>
        </div>
      </div>
    </>
  );
}
