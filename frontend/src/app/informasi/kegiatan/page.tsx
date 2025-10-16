"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import { useLang } from "../../components/LangContext";

interface Kegiatan {
  id: number;
  title_id: string;
  title_en: string;
  desc_id: string;
  desc_en: string;
  date: string;
  time: string;
  place: string;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export default function KegiatanPage() {
  const { lang } = useLang();
  const [kegiatan, setKegiatan] = useState<Kegiatan[]>([]);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/kegiatan/public`)
      .then((res) => {
        if (res.data.success) setKegiatan(res.data.data);
      })
      .catch((err) => console.error("Gagal load kegiatan:", err));
  }, []);

  return (
    <>
      {/* Spacer agar tidak tertutup navbar */}
      <div className="h-[100px] bg-white" />

      {/* Breadcrumb */}
      <section className="w-full py-4 bg-white">
        <div className="container mx-auto px-4">
          <nav className="flex items-center text-sm font-medium space-x-2">
            <Link href="/" className="text-[#FE4D01] hover:underline">
              {lang === "id" ? "Beranda" : "Home"}
            </Link>
            <span className="text-[#FE4D01]">{">"}</span>
            <Link
              href="/informasi/kegiatan"
              className="text-[#FE4D01] hover:underline"
            >
              {lang === "id" ? "Informasi" : "Information"}
            </Link>
            <span className="text-[#243771]">{">"}</span>
            <span className="text-[#243771]">
              {lang === "id" ? "Kegiatan" : "Events"}
            </span>
          </nav>
        </div>
      </section>

      {/* Section Agenda */}
      <section className="py-20 bg-[#243771] flex flex-col items-center justify-center">
        <div className="container mx-auto px-6 md:px-12 lg:px-20 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-white">
            {lang === "id"
              ? "Agenda Kegiatan Terbaru"
              : "Latest Activity Schedule"}
          </h2>
          <p className="text-gray-200 mb-12 text-sm md:text-base">
            {lang === "id"
              ? "Ikuti kegiatan dan acara terbaru di SMK Prestasi Prima"
              : "Follow the latest events and activities at SMK Prestasi Prima"}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center">
            {kegiatan.map((item) => (
              <div
                key={item.id}
                className="bg-white w-full md:w-[410px] rounded-[10px] shadow-md border-t-[5px] border-[#FE4D01] p-6 text-left flex flex-col justify-between transition-transform duration-300 hover:-translate-y-2"
              >
                <div>
                  <p className="text-[#FE4D01] font-medium text-sm">
                    {new Date(item.date).toLocaleDateString(
                      lang === "id" ? "id-ID" : "en-US",
                      { weekday: "long", year: "numeric", month: "long", day: "numeric" }
                    )}
                  </p>
                  <p className="text-gray-800 text-sm mb-2">{item.time}</p>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {lang === "id" ? item.title_id : item.title_en}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed line-clamp-2">
                    {lang === "id" ? item.desc_id : item.desc_en}
                  </p>
                </div>
                <p className="text-sm text-gray-700 font-medium mt-auto">
                  {item.place}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
