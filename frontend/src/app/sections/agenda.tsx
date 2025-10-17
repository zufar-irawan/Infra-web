"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import { useLang } from "../components/LangContext";

interface AgendaItem {
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

export default function Agenda() {
  const { lang } = useLang();
  const [agenda, setAgenda] = useState<AgendaItem[]>([]);

  // === Ambil data dari backend ===
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/kegiatan/public`)
      .then((res) => {
        if (res.data.success && Array.isArray(res.data.data)) {
          setAgenda(res.data.data);
        } else {
          console.warn("⚠️ Format API agenda tidak sesuai");
          setAgenda([]);
        }
      })
      .catch((err) => console.error("❌ Gagal load agenda:", err));
  }, []);

  return (
    <section
      id="agenda"
      className="py-20 bg-[#243771] relative overflow-hidden flex flex-col items-center justify-center"
    >
      <div className="container mx-auto px-6 md:px-12 lg:px-20 text-center relative z-10">
        {/* === Title === */}
        <h2 className="text-3xl md:text-4xl font-bold mb-3 text-white">
          {lang === "id" ? "Agenda Terbaru" : "Latest Agenda"}
        </h2>
        <p className="text-gray-200 mb-12 text-sm md:text-base">
          {lang === "id"
            ? "Ikuti kegiatan dan acara terbaru di SMK Prestasi Prima"
            : "Follow the latest activities and events at SMK Prestasi Prima"}
        </p>

        {/* === Cards === */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center">
          {agenda.length === 0 ? (
            <p className="text-gray-200 italic col-span-full">
              {lang === "id"
                ? "Belum ada agenda yang tersedia."
                : "No agenda available."}
            </p>
          ) : (
            agenda.map((item) => (
              <div
                key={item.id}
                className="bg-white w-[410px] h-[245px] rounded-[10px] shadow-md border-t-[5px] border-[#FE4D01] p-6 text-left flex flex-col justify-between transition-transform duration-300 hover:-translate-y-2"
              >
                <div>
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-6 h-6 rounded-full bg-[#FE4D01] mt-1"></div>
                    <div>
                      <p className="text-[#FE4D01] font-medium text-sm">
                        {new Date(item.date).toLocaleDateString(
                          lang === "id" ? "id-ID" : "en-US",
                          {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }
                        )}
                      </p>
                      <p className="text-gray-800 text-sm">{item.time}</p>
                    </div>
                  </div>
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
            ))
          )}
        </div>

        {/* === Button === */}
        <div className="flex justify-center mt-14">
          <Link
            href="/informasi/agenda"
            className="px-6 py-3 md:px-8 md:py-3 bg-white rounded-[10px] shadow-[0_4px_10px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_14px_rgba(254,77,1,0.3)] transition font-semibold text-[#FE4D01]"
          >
            {lang === "id" ? "Selengkapnya" : "View More"}
          </Link>
        </div>
      </div>

      {/* === Decorative Blocks === */}
      <div className="absolute bottom-0 left-12.5 w-[50px] h-[50px] bg-[#FE4D01]" />
      <div className="absolute top-0 right-12.5 w-[50px] h-[50px] bg-[#FE4D01]" />
      <div className="absolute top-0 left-50 w-[50px] h-[50px] bg-white" />
      <div className="absolute bottom-0 right-50 w-[50px] h-[50px] bg-white" />
    </section>
  );
}
