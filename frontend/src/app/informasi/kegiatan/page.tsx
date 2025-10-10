"use client";

import Link from "next/link";
import Image from "next/image";
import { useLang } from "../../components/LangContext";

export default function Berita() {
  const { lang } = useLang();

  const agenda = [
    {
      id: 1,
      date_id: "Kamis, 2 Oktober 2025",
      date_en: "Thursday, October 2, 2025",
      title_id: "EXPONER 2025",
      title_en: "EXPONER 2025",
      time: "23.00",
      desc_id:
        "Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet.",
      desc_en:
        "Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet.",
      place: "Lapangan SMK Prestasi Prima",
    },
    {
      id: 2,
      date_id: "Jumat, 3 Oktober 2025",
      date_en: "Friday, October 3, 2025",
      title_id: "Saintek Fair 2025",
      title_en: "Saintek Fair 2025",
      time: "23.00",
      desc_id:
        "Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet.",
      desc_en:
        "Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet.",
      place: "Lapangan SMK Prestasi Prima",
    },
    {
      id: 3,
      date_id: "Sabtu, 4 Oktober 2025",
      date_en: "Saturday, October 4, 2025",
      title_id: "Job Fair 2025",
      title_en: "Job Fair 2025",
      time: "23.00",
      desc_id:
        "Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet.",
      desc_en:
        "Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet.",
      place: "Lapangan SMK Prestasi Prima",
    },
  ];

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

      {/* === Section Intro dengan Dekorasi Kotak (tetap) === */}
      <section className="relative w-full bg-white overflow-hidden">
        {/* BG miring */}
        <div className="absolute top-[620px] left-0 right-0 h-[300px] bg-[#243771] transform -skew-y-6 origin-top-left z-[0] hidden sm:block" />

        {/* Dekorasi kotak (jangan diubah) */}
        <div className="absolute bottom-45 left-0 w-[50px] h-[50px] bg-[#FE4D01] hidden sm:block" />
        <div className="absolute bottom-57.5 left-12.5 w-[50px] h-[50px] bg-[#FE4D01] hidden sm:block" />
        <div className="absolute bottom-70 left-12.5 w-[50px] h-[50px] bg-[#243771] hidden sm:block" />
        <div className="absolute bottom-82.5 left-0 w-[50px] h-[50px] bg-[#243771] hidden sm:block" />

        <div className="relative z-[5] max-w-6xl mx-auto px-4 pt-16 pb-24">
          <h2 className="text-3xl sm:text-4xl font-semibold text-[#243771] text-center mb-12">
            {lang === "id" ? "Kegiatan" : "Events"}
          </h2>

          {/* Grid konten — teks kiri, gambar kanan */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* === Teks === */}
            <div>
              <p className="text-gray-700 leading-relaxed text-justify text-base sm:text-lg mb-6">
                {lang === "id"
                  ? "Telusuri berita terbaru untuk mendapatkan informasi terkini tentang kegiatan, prestasi, dan inovasi di SMK Prestasi Prima. Dari acara kampus hingga penghargaan nasional, semuanya kami sajikan untuk Anda."
                  : "Explore the latest news to stay updated on SMK Prestasi Prima’s activities, achievements, and innovations—from campus events to national awards."}
              </p>
            </div>

            {/* === Gambar === */}
            <div className="relative z-[10]">
              <img
                src="/avif/ppdb.avif"
                alt="SMK Prestasi Prima"
                className="rounded-xl w-full h-auto object-cover aspect-[4/3] hover:scale-[1.03] hover:shadow-xl transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* === Section Agenda Kegiatan Terbaru === */}
      <section
        id="agenda"
        className="py-20 bg-[#243771] relative overflow-hidden flex flex-col items-center justify-center"
      >
        <div className="container mx-auto px-6 md:px-12 lg:px-20 text-center relative z-10">
          {/* Title */}
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

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center">
            {agenda.map((item) => (
              <div
                key={item.id}
                className="bg-white w-full md:w-[410px] h-auto rounded-[10px] shadow-md border-t-[5px] border-[#FE4D01] p-6 text-left flex flex-col justify-between transition-transform duration-300 hover:-translate-y-2"
              >
                <div>
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-6 h-6 rounded-full bg-[#FE4D01] mt-1"></div>
                    <div>
                      <p className="text-[#FE4D01] font-medium text-sm">
                        {lang === "id" ? item.date_id : item.date_en}
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
            ))}
          </div>
        </div>
      </section>

      {/* === Section Gedung (fix background biru muncul) === */}
      <section className="relative w-full bg-[#243771] overflow-hidden">
        <div className="absolute inset-0 bg-[#243771]/70 z-[1]" />
        <img
          src="/webp/gedungtp.webp"
          alt={
            lang === "id"
              ? "Gedung SMK Prestasi Prima"
              : "Prestasi Prima Building"
          }
          className="relative z-[2] w-full h-[40vh] sm:h-[55vh] lg:h-screen object-cover object-center hover:scale-[1.02] transition-transform duration-700"
        />
      </section>
    </>
  );
}
