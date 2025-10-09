"use client";

import Link from "next/link";
import Image from "next/image";
import { useLang } from "../../components/LangContext";

export default function Berita() {
  const { lang } = useLang();

  // === Data Berita (contoh) ===
  const beritaList = [
    {
      id: 1,
      date_id: "17 Agustus 2025",
      date_en: "August 17, 2025",
      title_id:
        "Upacara HUT RI 80 di Lapangan Utama SMK Prestasi Prima",
      title_en:
        "Independence Day Ceremony at SMK Prestasi Prima Main Field",
      desc_id:
        "SMK Prestasi Prima hari ini menggelar upacara memperingati HUT ke-80 Kemerdekaan Republik Indonesia. Acara yang dilaksanakan dengan khidmat...",
      desc_en:
        "SMK Prestasi Prima held a ceremony to commemorate Indonesia’s 80th Independence Day. The event was conducted solemnly...",
      img: "/berita/1.jpg",
      href: "#",
    },
    {
      id: 2,
      date_id: "22 September 2025",
      date_en: "September 22, 2025",
      title_id:
        "Bandtols Wakili Sekolah Prestasi Prima di Ajang Awesome Skool Fest",
      title_en:
        "Bandtols Represents SMK Prestasi Prima at Awesome Skool Fest",
      desc_id:
        "Bandtols, grup musik kebanggaan sekolah, sukses memukau penonton dan mengharumkan nama sekolah...",
      desc_en:
        "Bandtols, the school’s pride, stunned the audience and brought honor to the school...",
      img: "/berita/2.jpg",
      href: "#",
    },
    {
      id: 3,
      date_id: "19 Agustus 2025",
      date_en: "August 19, 2025",
      title_id:
        "Skrining Kesehatan Siswa Siswi Kelas 10 SMK Prestasi Prima",
      title_en: "Health Screening for Grade 10 Students",
      desc_id:
        "Upaya memastikan peserta didik baru memiliki kondisi fisik dan mental optimal...",
      desc_en:
        "An effort to ensure new students are physically and mentally fit...",
      img: "/berita/3.jpg",
      href: "#",
    },
    {
      id: 4,
      date_id: "4 Agustus 2025",
      date_en: "August 4, 2025",
      title_id: "Pelaksanaan ANBK Tahun Pelajaran 2025–2026",
      title_en: "ANBK Implementation for AY 2025–2026",
      desc_id:
        "Asesmen Nasional Berbasis Komputer diselenggarakan di laboratorium sekolah...",
      desc_en:
        "The Computer-Based National Assessment was held in the school’s labs...",
      img: "/berita/4.jpg",
      href: "#",
    },
    {
      id: 5,
      date_id: "29 Juli 2025",
      date_en: "July 29, 2025",
      title_id:
        "Lulusan SMK Prestasi Prima Melangkah PTN Melalui Jalur Mandiri",
      title_en:
        "Graduates Admitted to Public Universities via Independent Track",
      desc_id:
        "Banyak alumni berhasil menembus PTN melalui jalur mandiri dengan prestasi membanggakan...",
      desc_en:
        "Many alumni were accepted into public universities through the independent track...",
      img: "/berita/5.jpg",
      href: "#",
    },
    {
      id: 6,
      date_id: "25 Juli 2025",
      date_en: "July 25, 2025",
      title_id: "Sekolah Nonton Bersama Film Believe",
      title_en: "School Movie Day: Believe",
      desc_id:
        "Kegiatan nobar menjadi ajang mempererat kebersamaan sekaligus sarana edukatif bagi siswa...",
      desc_en:
        "A movie day to strengthen togetherness while providing an educational experience...",
      img: "/berita/6.jpg",
      href: "#",
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
              href="/informasi/berita"
              className="text-[#FE4D01] hover:underline"
            >
              {lang === "id" ? "Informasi" : "Information"}
            </Link>
            <span className="text-[#243771]">{">"}</span>
            <span className="text-[#243771]">
              {lang === "id" ? "Berita" : "News"}
            </span>
          </nav>
        </div>
      </section>

      {/* === Konten Utama === */}
      <main className="flex-1 w-full bg-white">
        {/* === Section Intro dengan Dekorasi Kotak (tetap) === */}
        <section className="relative w-full bg-white">
          {/* Dekorasi kotak: pertahankan posisi custom via inline style */}
          <div className="absolute bottom-0 right-0 w-[50px] h-[50px] bg-[#FE4D01] hidden sm:block"/>
          <div className="absolute bottom-12.5 right-12.5 w-[50px] h-[50px] bg-[#FE4D01] hidden sm:block"/>
          <div className="absolute bottom-25 right-12.5 w-[50px] h-[50px] bg-[#243771] hidden sm:block"/>
          <div className="absolute bottom-37.5 right-0 w-[50px] h-[50px] bg-[#243771] hidden sm:block"/>

          <div className="max-w-6xl mx-auto px-4 pt-16 pb-24">
            <h2 className="text-3xl sm:text-4xl font-semibold text-[#243771] text-center mb-12">
              {lang === "id" ? "Berita" : "News"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Gambar */}
              <div>
                <img
                  src="/avif/ppdb.avif"
                  alt="SMK Prestasi Prima"
                  className="rounded-xl w-full h-auto object-cover aspect-[4/3] hover:scale-[1.03] hover:shadow-xl transition-transform duration-500"
                />
              </div>

              {/* Teks */}
              <div>
                <p className="text-gray-700 leading-relaxed text-justify text-base sm:text-lg mb-6">
                  {lang === "id"
                    ? "Telusuri berita terbaru untuk mendapatkan informasi terkini tentang kegiatan, prestasi, dan inovasi di SMK Prestasi Prima. Dari acara kampus hingga penghargaan nasional, semuanya kami sajikan untuk Anda."
                    : "Explore the latest news to stay updated on SMK Prestasi Prima’s activities, achievements, and innovations—from campus events to national awards."}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* === Section Berita Terbaru (card mirip referensi) === */}
        <section className="w-full bg-white py-10 sm:py-16">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-[#243771] mb-10">
              {lang === "id" ? "Berita Terbaru" : "Latest News"}
            </h2>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {beritaList.map((b) => (
                <article
                  key={b.id}
                  className="bg-white rounded-2xl border border-gray-200 shadow-[0_10px_24px_rgba(17,24,32,0.06)] hover:shadow-[0_14px_32px_rgba(17,24,32,0.12)] transition-all duration-300 overflow-hidden"
                >
                  {/* Gambar atas */}
                  <div className="relative w-full h-48 md:h-52">
                    <Image
                      src={b.img}
                      alt={lang === "id" ? b.title_id : b.title_en}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>

                  {/* Isi card */}
                  <div className="p-4 md:p-5">
                    <p className="text-xs md:text-sm font-semibold text-[#FE4D01] mb-2">
                      {lang === "id" ? b.date_id : b.date_en}
                    </p>

                    <h3 className="text-[15px] md:text-lg font-semibold text-[#111820] leading-snug mb-2">
                      {lang === "id" ? b.title_id : b.title_en}
                    </h3>

                    <p className="text-gray-600 text-sm md:text-[15px] leading-relaxed mb-3 line-clamp-3">
                      {lang === "id" ? b.desc_id : b.desc_en}
                    </p>

                    <Link
                      href={b.href}
                      className="inline-block text-[13px] md:text-sm font-semibold text-[#FE4D01] hover:underline"
                    >
                      {lang === "id" ? "Baca Selengkapnya..." : "Read More..."}
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* === Section Gedung (warna & gaya konsisten) === */}
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
