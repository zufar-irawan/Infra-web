"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useLang } from "../../../components/LangContext";
import { useEffect, useState } from "react";

interface BeritaItem {
  id: number;
  date_id: string;
  date_en: string;
  title_id: string;
  title_en: string;
  desc_id: string;
  desc_en: string;
  img: string;
}

export default function DetailBerita() {
  const { lang } = useLang();
  const { id } = useParams();
  const [berita, setBerita] = useState<BeritaItem | null>(null);

  // === Dummy data sama persis kayak di /informasi/berita/page.tsx ===
  const beritaList: BeritaItem[] = [
    {
      id: 1,
      date_id: "17 Agustus 2025",
      date_en: "August 17, 2025",
      title_id: "Upacara HUT RI 80 di Lapangan Utama SMK Prestasi Prima",
      title_en: "Independence Day Ceremony at SMK Prestasi Prima Main Field",
      desc_id:
        "SMK Prestasi Prima hari ini menggelar upacara memperingati HUT ke-80 Kemerdekaan Republik Indonesia. Acara yang dilaksanakan dengan khidmat diikuti oleh seluruh siswa dan guru. Kepala sekolah menyampaikan pesan penting tentang semangat perjuangan dan nilai-nilai nasionalisme yang harus terus dijaga oleh generasi muda.",
      desc_en:
        "SMK Prestasi Prima held a ceremony to commemorate Indonesia’s 80th Independence Day. The event was conducted solemnly and attended by all students and teachers. The principal delivered an inspiring message about preserving the spirit of patriotism among the youth.",
      img: "/berita/1.jpg",
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
        "Bandtols, grup musik kebanggaan sekolah, sukses memukau penonton di ajang Awesome Skool Fest dengan performa yang enerjik dan profesional. Lagu-lagu yang dibawakan berhasil mencuri perhatian juri dan penonton.",
      desc_en:
        "Bandtols, the pride of the school, amazed the audience at Awesome Skool Fest with their energetic and professional performance. Their music captivated both the judges and the audience.",
      img: "/berita/2.jpg",
    },
    {
      id: 3,
      date_id: "19 Agustus 2025",
      date_en: "August 19, 2025",
      title_id: "Skrining Kesehatan Siswa Siswi Kelas 10 SMK Prestasi Prima",
      title_en: "Health Screening for Grade 10 Students",
      desc_id:
        "Dalam rangka menjaga kesehatan peserta didik, SMK Prestasi Prima bekerja sama dengan puskesmas setempat mengadakan kegiatan skrining kesehatan untuk siswa kelas 10. Pemeriksaan mencakup tinggi badan, berat badan, tekanan darah, serta konseling gizi.",
      desc_en:
        "To maintain student health, SMK Prestasi Prima collaborated with the local clinic to hold a health screening for grade 10 students. The checkup included height, weight, blood pressure, and nutrition counseling.",
      img: "/berita/3.jpg",
    },
  ];

  useEffect(() => {
    if (id) {
      const beritaId = Number(id);
      const found = beritaList.find((b) => b.id === beritaId);
      setBerita(found || null);
    }
  }, [id]);

  if (!berita) {
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
  }

  return (
    <>
      <div className="h-[100px] bg-white" />

      <div className="max-w-4xl mx-auto px-4 py-10">
        <Link
          href="/informasi/berita"
          className="text-[#FE4D01] hover:underline mb-6 inline-block"
        >
          ← {lang === "id" ? "Kembali ke Berita" : "Back to News"}
        </Link>

        <h1 className="text-3xl sm:text-4xl font-bold text-[#243771] mb-2">
          {lang === "id" ? berita.title_id : berita.title_en}
        </h1>

        <p className="text-sm text-gray-500 mb-6">
          {lang === "id" ? berita.date_id : berita.date_en}
        </p>

        <div className="relative w-full h-80 sm:h-96 mb-8 rounded-xl overflow-hidden shadow">
          <Image
            src={berita.img}
            alt={lang === "id" ? berita.title_id : berita.title_en}
            fill
            className="object-cover"
          />
        </div>

        <p className="text-gray-700 leading-relaxed text-justify text-lg">
          {lang === "id" ? berita.desc_id : berita.desc_en}
        </p>
      </div>
    </>
  );
}
