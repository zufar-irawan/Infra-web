"use client";

import Link from "next/link";
import { useLang } from "../components/LangContext";
import { useState } from "react";

export default function Berita() {
  const { lang } = useLang();
  const [current, setCurrent] = useState(0);

  const news = [
    {
      id: 1,
      date_id: "22 September 2025",
      date_en: "September 22, 2025",
      title_id: "Bandtols Wakili Sekolah Prestasi Prima di Ajang Awesome Skool Fest",
      title_en: "Bandtols Represent SMK Prestasi Prima at Awesome Skool Fest",
      desc_id:
        "Bandtols, grup musik kebanggaan Sekolah Prestasi Prima, berhasil meraih pencapaian luar biasa dengan resmi lolos dan mengamankan posisi untuk tampil di ajang bergengsi Awesome Skool Fest...",
      desc_en:
        "Bandtols, the pride of SMK Prestasi Prima, achieved an extraordinary milestone by officially qualifying to perform at the prestigious Awesome Skool Fest...",
      img: "https://source.unsplash.com/600x400/?concert,music",
    },
    {
      id: 2,
      date_id: "17 Agustus 2025",
      date_en: "August 17, 2025",
      title_id: "Upacara HUT RI 80 di Lapangan Utama SMK Prestasi Prima",
      title_en: "80th Independence Day Ceremony at SMK Prestasi Prima",
      desc_id:
        "SMK Prestasi Prima menggelar upacara bendera memperingati Hari Ulang Tahun ke-80 Republik Indonesia. Acara berjalan dengan khidmat dan penuh semangat...",
      desc_en:
        "SMK Prestasi Prima held a flag ceremony to commemorate the 80th Anniversary of the Republic of Indonesia. The event was solemn and full of spirit...",
      img: "https://source.unsplash.com/600x400/?ceremony,indonesia",
    },
    {
      id: 3,
      date_id: "10 Juli 2025",
      date_en: "July 10, 2025",
      title_id: "Siswa SMK Prestasi Prima Raih Juara 1 Lomba Coding Nasional",
      title_en: "SMK Prestasi Prima Student Wins 1st Place in National Coding Competition",
      desc_id:
        "Prestasi membanggakan kembali diraih oleh siswa SMK Prestasi Prima dalam ajang lomba coding tingkat nasional dengan meraih juara pertama...",
      desc_en:
        "A proud achievement was made by an SMK Prestasi Prima student by winning 1st place in the national coding competition...",
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
          {lang === "id" ? "Berita Terkini" : "Latest News"}
        </h2>
        <p className="text-[#243771] mb-10">
          {lang === "id"
            ? "Ikuti perkembangan berita terbaru dari SMK Prestasi Prima"
            : "Stay updated with the latest news from SMK Prestasi Prima"}
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
                    alt={lang === "id" ? item.title_id : item.title_en}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 text-left flex flex-col justify-between flex-1">
                  <p className="text-sm text-[#FE4D01] font-medium">
                    {lang === "id" ? item.date_id : item.date_en}
                  </p>
                  <h3 className="font-bold text-md mb-2 line-clamp-2">
                    {lang === "id" ? item.title_id : item.title_en}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                    {lang === "id" ? item.desc_id : item.desc_en}
                  </p>
                  <Link
                    href="#"
                    className="text-sm font-semibold text-[#FE4D01] hover:underline mt-auto"
                  >
                    {lang === "id" ? "Baca Selengkapnya..." : "Read More..."}
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
