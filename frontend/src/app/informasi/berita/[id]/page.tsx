"use client";

import { useParams, useSearchParams } from "next/navigation";
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
  image?: string;
}

export default function DetailBerita() {
  const { lang } = useLang();
  const { id } = useParams();
  const query = useSearchParams();
  const [berita, setBerita] = useState<BeritaItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const API_BASE = "https://api.smkprestasiprima.sch.id";

  // === Ambil gambar dari query ===
  useEffect(() => {
    const imgQuery = query.get("img");
    if (imgQuery) {
      let img = imgQuery;
      if (img.startsWith("http://")) img = img.replace("http://", "https://");
      else if (!img.startsWith("https://"))
        img = `${API_BASE}${img.startsWith("/") ? "" : "/"}${img}`;
      setImage(img);
    }
  }, [query]);

  // === Ambil detail berita dari API ===
  useEffect(() => {
    if (!id) return;
    const fetchDetail = async () => {
      try {
        const res = await fetch(`/api/portal/berita/${id}/public`, { cache: "no-store" });
        const json = await res.json();

        if (json.success && json.data) {
          const data = json.data;
          let img = data.image || "";
          if (img.startsWith("http://")) img = img.replace("http://", "https://");
          else if (!img.startsWith("https://"))
            img = `${API_BASE}${img.startsWith("/") ? "" : "/"}${img}`;
          setImage(img || null);

          setBerita({
            id: data.id,
            date: data.date,
            title_id: data.title_id,
            title_en: data.title_en,
            desc_id: data.desc_id,
            desc_en: data.desc_en,
          });
          setNotFound(false);
        } else setNotFound(true);
      } catch (error) {
        console.error("❌ Gagal memuat detail berita:", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500 text-lg animate-pulse">
          {lang === "id" ? "Memuat berita..." : "Loading news..."}
        </p>
      </div>
    );

  if (notFound || !berita)
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

  return (
    <>
      <div className="h-[100px] bg-white" />
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


      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#243771] mb-2 leading-snug">
            {lang === "id" ? berita.title_id : berita.title_en}
          </h1>
          <p className="text-sm text-gray-500">
            {new Date(berita.date).toLocaleDateString(lang === "id" ? "id-ID" : "en-US", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>

        {image && (
          <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-8 shadow-md">
            <img
              src={image}
              alt={lang === "id" ? berita.title_id : berita.title_en}
              className="object-cover w-full h-full"
              loading="lazy"
            />
          </div>
        )}

        <div className="text-gray-700 leading-relaxed text-justify text-lg whitespace-pre-line mb-10">
          {lang === "id" ? berita.desc_id : berita.desc_en}
        </div>

        <div className="flex justify-center">
          <Link
            href="/informasi/berita"
            className="inline-block bg-[#FE4D01] hover:bg-orange-600 text-white font-semibold px-6 py-2.5 rounded-md transition-all duration-300"
          >
            ← {lang === "id" ? "Kembali ke Berita" : "Back to News"}
          </Link>
        </div>
      </div>
    </>
  );
}
