"use client";

import Link from "next/link";
import { useLang } from "../components/LangContext";
import { useState } from "react";
import {useTranslations} from "next-intl";

export default function Berita() {
    const t = useTranslations('beritaHome')
  const [current, setCurrent] = useState(0);

  const news = [
    {
      id: 1,
      date: "22 September 2025",
      title: "Bandtols Wakili Sekolah Prestasi Prima di Ajang Awesome Skool Fest",
      desc:
        "Bandtols, grup musik kebanggaan Sekolah Prestasi Prima, berhasil meraih pencapaian luar biasa dengan resmi lolos dan mengamankan posisi untuk tampil di ajang bergengsi Awesome Skool Fest...",
      img: "https://source.unsplash.com/600x400/?concert,music",
    },
    {
      id: 2,
      date: "17 Agustus 2025",
      title: "Upacara HUT RI 80 di Lapangan Utama SMK Prestasi Prima",
      desc:
        "SMK Prestasi Prima menggelar upacara bendera memperingati Hari Ulang Tahun ke-80 Republik Indonesia. Acara berjalan dengan khidmat dan penuh semangat...",
      img: "https://source.unsplash.com/600x400/?ceremony,indonesia",
    },
    {
      id: 3,
      date: "10 Juli 2025",
      title: "Siswa SMK Prestasi Prima Raih Juara 1 Lomba Coding Nasional",
      desc:
        "Prestasi membanggakan kembali diraih oleh siswa SMK Prestasi Prima dalam ajang lomba coding tingkat nasional dengan meraih juara pertama...",
      img: "https://source.unsplash.com/600x400/?coding,computer",
    },
  ];

  const nextSlide = () => setCurrent((prev) => (prev + 1) % news.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + news.length) % news.length);

  return (
    <section id="berita" className="py-20 bg-white">
      <div className="container mx-auto px-6 md:px-12 lg:px-20 text-center">
        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#FE4D01]">
          {t('title')}
        </h2>
        <p className="text-[#243771] mb-10">
          {t('description')}
        </p>

        {/* Carousel */}
        <div className="relative flex justify-center items-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {news.slice(current, current + 3).map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-[10px] shadow-md overflow-hidden w-[410px] h-[440px] flex flex-col transform transition duration-500 hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className="h-[200px] w-full overflow-hidden">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 text-left flex flex-col justify-between flex-1">
                  <p className="text-sm text-[#FE4D01] font-medium">
                    {item.date}
                  </p>
                  <h3 className="font-bold text-md mb-2 line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                    {item.desc}
                  </p>
                  <Link
                    href="#"
                    className="text-sm font-semibold text-[#FE4D01] hover:underline mt-auto"
                  >
                    {t('button')}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={prevSlide}
            className="p-3 border border-gray-300 rounded-full hover:bg-[#FE4D01] hover:text-white transition"
          >
            ◀
          </button>
          <button
            onClick={nextSlide}
            className="p-3 border border-gray-300 rounded-full hover:bg-[#FE4D01] hover:text-white transition"
          >
            ▶
          </button>
        </div>
      </div>
    </section>
  );
}
