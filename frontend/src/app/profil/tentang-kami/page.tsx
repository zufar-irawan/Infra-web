"use client";

import Link from "next/link";
import Navbar from "@/app/components/header";
import Footer from "@/app/components/footer";
import { useLang } from "../../components/LangContext";
import { useEffect, useRef, useState } from "react";

export default function Tentang() {
  const { lang } = useLang();

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Navbar */}
      <Navbar />

      {/* Spacer biar ga ketiban header */}
      <div className="h-[100px] bg-white" />

      {/* Breadcrumbs */}
      <section className="w-full py-4 bg-white">
        <div className="container mx-auto px-4">
          <nav className="flex items-center text-sm font-medium space-x-2">
            <Link href="/" className="text-[#FE4D01] hover:underline">
              {lang === "id" ? "Beranda" : "Home"}
            </Link>
            <span className="text-[#FE4D01]">{">"}</span>
            <Link
              href="/profil/tentang-kami"
              className="text-[#FE4D01] hover:underline"
            >
              {lang === "id" ? "Informasi Sekolah" : "School Information"}
            </Link>
            <span className="text-[#243771]">{">"}</span>
            <span className="text-[#243771]">
              {lang === "id" ? "Tentang Kami" : "About Us"}
            </span>
          </nav>
        </div>
      </section>

      {/* Konten utama */}
      <main className="flex-1 w-full bg-white py-16">
        <div className="container mx-auto px-4 space-y-16">
          {/* Judul + pembuka */}
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <h1 className="text-4xl font-semibold text-[#243771]">
              {lang === "id" ? "Tentang Kami" : "About Us"}
            </h1>
            <p className="text-gray-700 leading-relaxed text-lg">
              {lang === "id"
                ? "SMK Prestasi Prima adalah sekolah yang berkomitmen pada pendidikan berkualitas dan pengembangan keterampilan siswa. Kami berfokus pada membangun generasi yang siap menghadapi tantangan masa depan."
                : "SMK Prestasi Prima is a school committed to quality education and student skill development. We focus on building a generation ready to face the challenges of the future."}
            </p>
          </div>

          {/* Section Profil */}
          <section className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl sm:text-4xl font-semibold text-[#243771] text-center mb-12">
              {lang === "id"
                ? "Profil SMK Prestasi Prima"
                : "Profile of SMK Prestasi Prima"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Gambar */}
              <div>
                <img
                  src="/pp.png"
                  alt="SMK Prestasi Prima"
                  className="rounded-lg w-full h-auto object-cover aspect-[4/3]"
                />
              </div>

              {/* Teks */}
              <div>
                <h3 className="text-xl sm:text-2xl font-semibold text-[#243771] mb-4">
                  {lang === "id"
                    ? "Selamat datang di SMK Prestasi Prima!"
                    : "Welcome to SMK Prestasi Prima!"}
                </h3>
                <p className="text-gray-700 leading-relaxed text-justify text-base sm:text-lg">
                  {lang === "id"
                    ? "Di sekolah Prestasi Prima yang unggul dan terpercaya siswa & siswi disiapkan untuk menjadi tenaga yang terampil dan mandiri. Tidak hanya itu ketakwaan dan kecerdasan pun harus dimiliki, dan percaya diri selalu terjaga dengan berkarakter Pancasila. Jika ada yang lebih baik, baik saja tidak cukup."
                    : "At the superior and trusted Prestasi Prima school, students are prepared to become skilled and independent workforce. Not only that, piety and intelligence must be possessed, and self-confidence is always maintained with Pancasila character. If there is something better, good is not enough."}
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Section Statistik */}
      <StatistikSection />

      {/* Section Visi & Misi */}
      <VisiMisiSection />

      {/* Section Manajemen */}
      <ManajemenSection />

      {/* Section Fasilitas */}
      <FasilitasSection />

      {/* Footer */}
      <Footer />
    </div>
  );
}

/* -------------------- Statistik Section -------------------- */
function StatistikSection() {
  const { lang } = useLang();

  const stats = [
    { img: "/alumni.png", angka: 4000, label: lang === "id" ? "Alumni" : "Alumni" },
    { img: "/siswa.png", angka: 2000, label: lang === "id" ? "Siswa" : "Students" },
    { img: "/pengajar.png", angka: 3000, label: lang === "id" ? "Pengajar" : "Teachers" },
    { img: "/kelas.png", angka: 1000, label: lang === "id" ? "Kelas" : "Classes" },
  ];

  const [startCount, setStartCount] = useState(false);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setStartCount(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="w-full bg-[#243771] py-16">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
        {stats.map((item, i) => (
          <div key={i} className="flex flex-col items-center text-white space-y-3">
            <div className="w-14 h-14 flex items-center justify-center">
              <img
                src={item.img}
                alt={item.label}
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <h3 className="text-3xl sm:text-4xl font-bold">
              <Counter target={item.angka} start={startCount} />
            </h3>
            <p className="text-gray-200 text-sm sm:text-base">{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* -------------------- Counter -------------------- */
function Counter({ target, start }: { target: number; start: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;

    let current = 0;
    const duration = 2000;
    const stepTime = Math.max(Math.floor(duration / target), 20);

    const timer = setInterval(() => {
      current += Math.ceil(target / (duration / stepTime));
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      setCount(current);
    }, stepTime);

    return () => clearInterval(timer);
  }, [start, target]);

  return <span>{count.toLocaleString()}</span>;
}

/* -------------------- Visi & Misi Section -------------------- */
function VisiMisiSection() {
  const { lang } = useLang();

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Teks */}
        <div className="space-y-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#FE4D01] mb-4">
              {lang === "id" ? "Visi" : "Vision"}
            </h2>
            <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
              {lang === "id"
                ? "Mewujudkan lulusan yang “unggul” dan “terpercaya” dalam mengembangkan dan mempersiapkan tenaga terampil di bidang Teknologi Informasi dan Komunikasi yang beriman, bertaqwa, cerdas, percaya diri, berwawasan global, dan berkarakter Pancasilais."
                : "To produce graduates who are 'superior' and 'trustworthy' in developing and preparing skilled workforce in the field of Information and Communication Technology who are faithful, pious, intelligent, confident, globally minded, and have Pancasila character."}
            </p>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#FE4D01] mb-4">
              {lang === "id" ? "Misi" : "Mission"}
            </h2>
            <p className="text-gray-700 leading-relaxed text-base sm:text-lg mb-4">
              {lang === "id"
                ? "Menyelenggarakan proses belajar mengajar yang berkualitas ... sesuai dengan kompetensi yang dimiliki dalam bidang:"
                : "Organize a quality teaching and learning process ... according to the competencies in the field of:"}
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 text-base sm:text-lg">
              <li>{lang === "id" ? "Pengembangan Perangkat Lunak dan Gim (PPLG)" : "Software and Game Development (PPLG)"}</li>
              <li>{lang === "id" ? "Teknik Jaringan Komputer dan Telekomunikasi (TJKT)" : "Computer Network and Telecommunication Engineering (TJKT)"}</li>
              <li>{lang === "id" ? "Desain Komunikasi Visual (DKV)" : "Visual Communication Design (DKV)"}</li>
              <li>{lang === "id" ? "Broadcasting dan Film (BCF)" : "Broadcasting and Film (BCF)"}</li>
            </ul>
            <p className="text-gray-700 leading-relaxed text-base sm:text-lg mt-4">
              {lang === "id"
                ? "Memberikan pelayanan pendidikan berbasis pembelajaran abad 21 ... relevan dengan karakter bangsa."
                : "Provide 21st-century learning-based educational services ... relevant to national character."}
            </p>
            <Link
            href="/profil/visi-misi"
            className="mt-6 inline-block px-6 py-3 rounded bg-[#FE4D01] text-white font-medium hover:bg-orange-700 transition text-center"
            >
            {lang === "id" ? "Selengkapnya" : "More"}
            </Link>
          </div>
        </div>

        {/* Gambar */}
        <div className="flex justify-center">
          <img
            src="/pp1.png"
            alt={lang === "id" ? "Visi Misi" : "Vision & Mission"}
            className="rounded-lg w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}

/* -------------------- Manajemen Section -------------------- */
function ManajemenSection() {
  const { lang } = useLang();

  const manajemenAwal = [
    { img: "/man3.png", nama: "Dr. Wannen Pakpahan M.M", jabatan: lang === "id" ? "Direktur Penjamin Mutu Yayasan" : "Head of Program" },
    { img: "/man2.png", nama: "Flores Sagala, S.E.", jabatan: lang === "id" ? "Ketua Yayasan" : "Vice Principal" },
    { img: "/man1.png", nama: "Hendry Kurniawan, S.Kom, M.I.Kom", jabatan: lang === "id" ? "Kepala Sekolah" : "Principal" },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-[#243771] mb-12">
          {lang === "id" ? "Manajemen" : "Management"}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 mb-10">
          {manajemenAwal.map((person, i) => (
            <div key={i} className="flex flex-col items-center space-y-4">
              <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full overflow-hidden shadow-lg">
                <img src={person.img} alt={person.nama} className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">{person.nama}</h3>
                <p className="text-gray-600">{person.jabatan}</p>
              </div>
            </div>
          ))}
        </div>

        <Link href="/profil/manajemen">
          <button className="mt-6 px-6 py-3 rounded bg-[#FE4D01] text-white font-medium hover:bg-orange-700 transition">
            {lang === "id" ? "Selengkapnya" : "More"}
          </button>
        </Link>
      </div>
    </section>
  );
}

/* -------------------- Fasilitas Section (FIX) -------------------- */
function FasilitasSection() {
  const { lang } = useLang();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const fasilitas = [
    {
      img: "/dummy1.png",
      nama: lang === "id" ? "Kelas" : "Classroom",
      deskripsi_id: "Lorem ipsum dolor sit amet, kelas nyaman untuk belajar.",
      deskripsi_en: "Lorem ipsum dolor sit amet, comfortable classroom for learning."
    },
    {
      img: "/dummy2.png",
      nama: lang === "id" ? "Perpustakaan" : "Library",
      deskripsi_id: "Lorem ipsum, perpustakaan lengkap dengan berbagai buku.",
      deskripsi_en: "Lorem ipsum, library equipped with various books."
    },
    {
      img: "/dummy3.png",
      nama: lang === "id" ? "Aula Mora" : "Mora Hall",
      deskripsi_id: "Lorem ipsum, aula luas untuk acara sekolah dan seminar.",
      deskripsi_en: "Lorem ipsum, spacious hall for school events and seminars."
    },
    {
      img: "/dummy4.png",
      nama: lang === "id" ? "Lapangan" : "Field",
      deskripsi_id: "Lorem ipsum, lapangan hijau untuk olahraga dan kegiatan outdoor.",
      deskripsi_en: "Lorem ipsum, green field for sports and outdoor activities."
    },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setActiveIndex(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-[#243771] mb-12">
          {lang === "id" ? "Fasilitas" : "Facilities"}
        </h2>

        {/* Ref ditempel di grid, bukan di container utama */}
        <div
          ref={containerRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {fasilitas.map((item, i) => (
            <div
              key={i}
              className="flex flex-col items-center bg-gray-100 rounded-lg shadow hover:shadow-lg transition overflow-hidden cursor-pointer"
              onClick={() => setActiveIndex(activeIndex === i ? null : i)}
            >
              <img src={item.img} alt={item.nama} className="w-full h-40 object-cover" />
              <div className="p-4 w-full text-left">
                <h3 className="text-lg font-semibold text-[#243771]">{item.nama}</h3>

                <div
                  className={`overflow-hidden transition-[max-height] duration-500 ease-in-out ${
                    activeIndex === i ? "max-h-40 mt-2" : "max-h-0"
                  }`}
                >
                  <p className="text-gray-600 text-sm">
                    {lang === "id" ? item.deskripsi_id : item.deskripsi_en}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tombol Selengkapnya / More */}
        <Link href="/profil/fasilitas">
          <button className="mt-8 px-6 py-3 rounded bg-[#FE4D01] text-white font-medium hover:bg-orange-700 transition">
            {lang === "id" ? "Selengkapnya" : "More"}
          </button>
        </Link>
      </div>
    </section>
  );
}
