"use client";

import Image from "next/image";
import { useLang } from "./LangContext";

export default function Footer() {
  const { lang } = useLang();

  const texts = {
    id: {
      school_name: "SMK Prestasi Prima",
      school_address: "Jl. Hankam Raya No. 89, Cilangkap, Cipayung,\nJakarta Timur, DKI Jakarta.",
      menu_info: "Informasi Sekolah",
      menu_life: "Kehidupan Siswa",
      menu_partner: "Mitra",
      menu_admission: "Penerimaan Siswa",
      menu_news: "Berita",
      footer_text: "© 2025 SMK Prestasi Prima | Gold And Glory",
    },
    en: {
      school_name: "SMK Prestasi Prima",
      school_address: "Jl. Hankam Raya No. 89, Cilangkap, Cipayung,\nEast Jakarta, DKI Jakarta.",
      menu_info: "School Info",
      menu_life: "Student Life",
      menu_partner: "Partners",
      menu_admission: "Admission",
      menu_news: "News",
      footer_text: "© 2025 Prestasi Prima VSH | Gold And Glory",
    },
  };

  const t = texts[lang];

  return (
    <footer className="bg-[#243771] text-white py-12 mt-auto">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          {/* Logo + Info + Menu */}
          <div>
            <div className="flex items-center gap-5 mb-6">
              <Image
                src="/smk.png"
                alt={t.school_name}
                width={64}
                height={64}
                className="h-16 w-auto"
              />
              <h2 className="font-bold text-2xl">{t.school_name}</h2>
            </div>
            <p className="text-sm leading-relaxed mb-6 whitespace-pre-line">{t.school_address}</p>

            {/* Menu */}
            <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm font-medium">
              <a href="#" className="hover:underline">{t.menu_info}</a>
              <a href="#" className="hover:underline">{t.menu_life}</a>
              <a href="#" className="hover:underline">{t.menu_partner}</a>
              <a href="#" className="hover:underline">{t.menu_admission}</a>
              <a href="#" className="hover:underline">{t.menu_news}</a>
            </div>
          </div>

          {/* Sosial Media */}
          <div className="flex gap-4 mt-4 md:mt-0">
            <a
              href="https://api.whatsapp.com/send/?phone=6285195928886"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-gray-400 rounded-md flex items-center justify-center w-12 h-12 hover:border-white transition"
            >
              <Image
                src="/whatsapp-white.png"
                alt="WhatsApp"
                width={24}
                height={24}
                className="object-contain"
              />
            </a>
            <a
              href="https://www.instagram.com/smkprestasiprima"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-gray-400 rounded-md flex items-center justify-center w-12 h-12 hover:border-white transition"
            >
              <Image
                src="/instagram-white.png"
                alt="Instagram"
                width={24}
                height={24}
                className="object-contain"
              />
            </a>
            <a
              href="https://m.youtube.com/@SEKOLAHPRESTASIPRIMA"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-gray-400 rounded-md flex items-center justify-center w-12 h-12 hover:border-white transition"
            >
              <Image
                src="/youtube-white.png"
                alt="YouTube"
                width={24}
                height={24}
                className="object-contain"
              />
            </a>
            <a
              href="https://www.tiktok.com/@smkprestasiprima"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-gray-400 rounded-md flex items-center justify-center w-12 h-12 hover:border-white transition"
            >
              <Image
                src="/tiktok-white.png"
                alt="TikTok"
                width={24}
                height={24}
                className="object-contain"
              />
            </a>
          </div>
        </div>

        {/* Garis */}
        <div className="border-t border-gray-500 my-10"></div>

        {/* Copyright */}
        <p className="text-center text-xs text-gray-300">{t.footer_text}</p>
      </div>
    </footer>
  );
}
