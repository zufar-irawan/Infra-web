"use client";

import Link from "next/link";
import Image from "next/image";
import { useLang } from "../../components/LangContext";
import Pesan from "@/app/sections/pesan";
import { useState, useEffect, useRef } from "react";

export default function PPDB() {
  const { lang } = useLang();
  const [activeIndex, setActiveIndex] = useState(null);
  const [activeIndex2, setActiveIndex2] = useState(null);

  // @ts-ignore
  const toggleAccordion = (index, setActive) => {
      // @ts-ignore
      setActive((prev) => (prev === index ? null : index));
  };

  // === ANIMASI FADE-IN ===
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setIsVisible(true);
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
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
            <Link
              href="/kehidupan-siswa/penerimaan"
              className="text-[#FE4D01] hover:underline"
            >
              {lang === "id" ? "Kehidupan Siswa" : "Student Life"}
            </Link>
            <span className="text-[#243771]">{">"}</span>
            <span className="text-[#243771]">
              {lang === "id" ? "Penerimaan Siswa" : "Admissions"}
            </span>
          </nav>
        </div>
      </section>

      {/* === Konten Utama === */}
      <main className="flex-1 w-full bg-white">
        {/* === Section Profil dengan Kotak Dekorasi === */}
        <section className="relative w-full bg-white">
          {/* Dekorasi kotak */}
          <div className="absolute bottom-0 right-0 w-[50px] h-[50px] bg-[#FE4D01] hidden sm:block" />
          <div className="absolute bottom-12 right-0 w-[50px] h-[50px] bg-[#243771] hidden sm:block" />
          <div className="absolute bottom-24 right-12 w-[50px] h-[50px] bg-[#243771] hidden sm:block" />

          <div className="max-w-6xl mx-auto px-4 pt-16 pb-24">
            <h2 className="text-3xl sm:text-4xl font-semibold text-[#243771] text-center mb-12">
              {lang === "id"
                ? "Penerimaan Siswa SMK Prestasi Prima"
                : "Student Admissions of SMK Prestasi Prima"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Gambar */}
              <div>
                <img
                  src="/avif/ppdb.avif"
                  alt="SMK Prestasi Prima"
                  className="rounded-lg w-full h-auto object-cover aspect-[4/3] hover:scale-[1.03] hover:shadow-xl transition-transform duration-500"
                />
              </div>

              {/* Teks */}
              <div>
                <h3 className="text-xl sm:text-2xl font-semibold text-[#FE4D01] mb-4">
                  {lang === "id"
                    ? "Bergabunglah dengan Kami"
                    : "Join Our Community"}
                </h3>
                <p className="text-gray-700 leading-relaxed text-justify text-base sm:text-lg mb-6">
                  {lang === "id"
                    ? "Kami menyambut siswa dari berbagai latar belakang, di mana mereka dan seluruh keluarga mereka menjadi bagian dari komunitas kami yang suportif. Kami percaya bahwa keberagaman adalah salah satu kekuatan terbesar kami, dan kami bangga akan hubungan erat yang kami bangun dengan setiap keluarga di SMK Prestasi Prima. Bergabunglah bersama kami dan temukan bagaimana kesatuan visi dan perbedaan latar belakang dapat menciptakan sesuatu yang istimewa!"
                    : "We welcome students from diverse backgrounds, where they and their families become part of our supportive community. We believe that diversity is one of our greatest strengths, and we take pride in the strong relationships we have built with every family at SMK Prestasi Prima. Join us and discover how unity of vision and diversity of backgrounds can create something truly special!"}
                </p>

                {/* Tombol Daftar Sekarang */}
                <Link
                  href="/daftar"
                  className="inline-block bg-[#FE4D01] text-white font-medium px-6 py-3 rounded-lg shadow-md hover:bg-[#e34400] transition-all duration-300"
                >
                  {lang === "id" ? "Daftar Sekarang" : "Register Now"}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* === Section Pesan === */}
        <Pesan />

        {/* === Section Langkah Pendaftaran === */}
        <section
          ref={sectionRef}
          className={`py-16 bg-white relative transition-all duration-1000 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {/* Dekorasi Kotak */}
          <div className="absolute top-0 left-0 w-[50px] h-[50px] bg-[#243771] hidden sm:block" />
          <div className="absolute top-12.5 left-12.5 w-[50px] h-[50px] bg-[#243771] hidden sm:block" />

          <div className="max-w-3xl mx-auto px-6 text-center">
            {/* Bagian 1 */}
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#243771] mb-3">
              {lang === "id" ? "5 Langkah Pendaftaran" : "5 Steps to Register"}
            </h2>
            <p className="text-gray-600 mb-8 text-sm sm:text-base">
              {lang === "id"
                ? "Kami menyiapkan panduan pendaftaran agar proses Anda mudah dan terarah. Jika ada pertanyaan lain, jangan ragu untuk menghubungi kami."
                : "We’ve prepared a registration guide to help you complete the process smoothly. If you have any questions, don’t hesitate to reach out to us."}
            </p>

            <div className="text-left space-y-3">
              {(lang === "id"
                ? [
                    "Persiapan Dokumen dan Pembuatan Akun",
                    "Verifikasi Berkas dan Pengambilan PIN/Token",
                    "Pemilihan Jalur dan Sekolah Tujuan",
                    "Pelaksanaan Tes Minat dan Bakat",
                    "Pengumuman Hasil Seleksi dan Daftar Ulang",
                  ]
                : [
                    "Prepare Documents and Create an Account",
                    "Verify Documents and Get PIN/Token",
                    "Choose Pathway and Target School",
                    "Take Interest and Aptitude Test",
                    "Check Results and Re-Registration",
                  ]
              ).map((item, index) => (
                <div
                  key={index}
                  onClick={() => toggleAccordion(index, setActiveIndex)}
                  className="border-b border-gray-200 pb-3 flex justify-between items-center cursor-pointer hover:text-[#FE4D01] transition-colors"
                >
                  <span className="text-[#243771] font-medium text-sm sm:text-base">
                    {item}
                  </span>
                  <span
                    className={`text-[#243771] transition-transform duration-300 ${
                      activeIndex === index ? "rotate-45" : ""
                    }`}
                  >
                    +
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Bagian 2 */}
          <div className="max-w-3xl mx-auto px-6 text-center mt-16">
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#243771] mb-3">
              {lang === "id"
                ? "5 Langkah Setelah Pendaftaran"
                : "5 Steps After Registration"}
            </h2>
            <p className="text-gray-600 mb-8 text-sm sm:text-base">
              {lang === "id"
                ? "Setelah pendaftaran selesai, pastikan Anda mengikuti langkah-langkah berikut agar proses berjalan lancar."
                : "After registering, make sure you follow these steps to ensure the process runs smoothly."}
            </p>

            <div className="text-left space-y-3">
              {(lang === "id"
                ? [
                    "Pantau Status Verifikasi Berkas",
                    "Ikuti Seleksi Khusus (Tes Minat & Bakat)",
                    "Lihat Hasil Seleksi Sementara (Real-Time)",
                    "Cek Pengumuman Resmi Kelulusan",
                    "Lakukan Daftar Ulang (Wajib)",
                  ]
                : [
                    "Monitor Verification Status",
                    "Join Special Selection (Interest & Aptitude Test)",
                    "View Temporary Results (Real-Time)",
                    "Check Official Graduation Announcement",
                    "Complete Re-Registration (Mandatory)",
                  ]
              ).map((item, index) => (
                <div
                  key={index}
                  onClick={() => toggleAccordion(index, setActiveIndex2)}
                  className="border-b border-gray-200 pb-3 flex justify-between items-center cursor-pointer hover:text-[#FE4D01] transition-colors"
                >
                  <span className="text-[#243771] font-medium text-sm sm:text-base">
                    {item}
                  </span>
                  <span
                    className={`text-[#243771] transition-transform duration-300 ${
                      activeIndex2 === index ? "rotate-45" : ""
                    }`}
                  >
                    +
                  </span>
                </div>
              ))}
            </div>
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
