"use client";

import Link from "next/link";
import { useLang } from "../../components/LangContext";
import { useEffect, useState, useRef } from "react";

interface BeritaItem {
  id: number;
  title_id: string;
  title_en: string;
  desc_id: string;
  desc_en: string;
  date: string;
  image: string;
}

export default function Berita() {
  const { lang } = useLang();
  const [beritaList, setBeritaList] = useState<BeritaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const API_BASE = "https://api.smkprestasiprima.sch.id";

  // ✅ Ambil berita dari proxy HTTPS
  useEffect(() => {
    fetch("/api/portal/berita/public", { cache: "no-store" })
      .then((r) => r.json())
      .then((j) => {
        if (j.success && Array.isArray(j.data)) {
          const mapped = j.data.map((b: any) => {
            let img = b.image || "";
            if (img.startsWith("http://")) img = img.replace("http://", "https://");
            else if (!img.startsWith("https://"))
              img = `${API_BASE}${img.startsWith("/") ? "" : "/"}${img}`;
            return { ...b, image: img };
          });
          setBeritaList(mapped);
        } else setBeritaList([]);
      })
      .catch((err) => console.error("❌ Gagal ambil berita:", err))
      .finally(() => setLoading(false));
  }, []);

  // Animasi muncul
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setIsVisible(true)),
      { threshold: 0.2 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  const top3 = beritaList.slice(0, 3);
  const others = beritaList.slice(3);

  return (
    <>
      <div className="h-[100px] bg-white" />

      <section className="w-full py-4 bg-white">
  <div className="container mx-auto px-4">
    <nav className="flex items-center text-sm font-medium flex-wrap gap-1">
      <Link href="/" className="text-[#FE4D01] hover:underline">
        {lang === "id" ? "Beranda" : "Home"}
      </Link>
      <span className="text-[#FE4D01]">{">"}</span>
      <Link href="/informasi" className="text-[#FE4D01] hover:underline">
        {lang === "id" ? "Informasi" : "Information"}
      </Link>
      <span className="text-[#243771]">{">"}</span>
      <span className="text-[#243771]">
        {lang === "id" ? "Berita" : "News"}
      </span>
    </nav>
  </div>
</section>


      <section
        ref={sectionRef}
        className={`w-full bg-white py-16 overflow-hidden transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-[#243771] mb-10">
            {lang === "id" ? "Berita Terbaru" : "Latest News"}
          </h2>

          {loading ? (
            <p className="text-center text-gray-500 italic">
              {lang === "id" ? "Memuat berita..." : "Loading news..."}
            </p>
          ) : beritaList.length === 0 ? (
            <p className="text-center text-gray-500 italic">
              {lang === "id" ? "Belum ada berita." : "No news available."}
            </p>
          ) : (
            <>
              {/* === 3 berita utama === */}
              <div className="grid gap-6 md:grid-cols-3 mb-10">
                {top3.map((b) => (
                  <article
                    key={b.id}
                    className="bg-white rounded-2xl border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
                  >
                    {b.image && (
                      <div className="relative w-full aspect-[4/3]">
                        <img
                          src={b.image}
                          alt={lang === "id" ? b.title_id : b.title_en}
                          className="object-cover w-full h-full"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div className="p-4 md:p-5">
                      <p className="text-xs md:text-sm font-semibold text-[#FE4D01] mb-2">
                        {new Date(b.date).toLocaleDateString(
                          lang === "id" ? "id-ID" : "en-US"
                        )}
                      </p>
                      <h3 className="text-[15px] md:text-lg font-semibold text-[#111820] leading-snug mb-2">
                        {lang === "id" ? b.title_id : b.title_en}
                      </h3>
                      <p className="text-gray-600 text-sm md:text-[15px] leading-relaxed mb-3 line-clamp-3">
                        {lang === "id" ? b.desc_id : b.desc_en}
                      </p>
                      <Link
                        href={{
                          pathname: `/informasi/berita/${b.id}`,
                          query: { img: b.image },
                        }}
                        className="text-[#FE4D01] font-semibold text-sm hover:underline"
                      >
                        {lang === "id" ? "Baca Selengkapnya..." : "Read More..."}
                      </Link>
                    </div>
                  </article>
                ))}
              </div>

              {/* === Sisa berita === */}
              {others.length > 0 && (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {others.map((b) => (
                    <article
                      key={b.id}
                      className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
                    >
                      {b.image && (
                        <div className="relative w-full aspect-[4/3]">
                          <img
                            src={b.image}
                            alt={lang === "id" ? b.title_id : b.title_en}
                            className="object-cover w-full h-full"
                            loading="lazy"
                          />
                        </div>
                      )}
                      <div className="p-3">
                        <p className="text-xs text-[#FE4D01] mb-1">
                          {new Date(b.date).toLocaleDateString(
                            lang === "id" ? "id-ID" : "en-US"
                          )}
                        </p>
                        <h4 className="text-[14px] font-semibold text-[#111820] mb-1 line-clamp-2">
                          {lang === "id" ? b.title_id : b.title_en}
                        </h4>
                        <Link
                          href={{
                            pathname: `/informasi/berita/${b.id}`,
                            query: { img: b.image },
                          }}
                          className="text-[13px] text-[#FE4D01] font-medium hover:underline"
                        >
                          {lang === "id" ? "Baca" : "Read"}
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
