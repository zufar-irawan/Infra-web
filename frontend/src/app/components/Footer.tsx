"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useLang } from "./LangContext";

export default function Footer() {
  const { lang } = useLang();

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
  }, []);

  const link = {
    whatsapp: "https://api.whatsapp.com/send/?phone=6285195928886",
    instagram: "https://www.instagram.com/smkprestasiprima",
    youtube: "https://m.youtube.com/@SEKOLAHPRESTASIPRIMA",
    tiktok: "https://www.tiktok.com/@smkprestasiprima",
  };

  const supportedLogos = [
    { src: "/1infra.png", alt: "Infra Competition" },
    { src: "/2jagoan.png", alt: "Jagoan Hosting" },
    { src: "/3komdigi.png", alt: "Komdigi" },
    { src: "/4maspion.png", alt: "Maspion IT" },
    { src: "/5garuda.png", alt: "Garuda Spark" },
  ];

  return (
    <footer className="bg-[#0f1b3d] text-white py-12 mt-auto scroll-smooth">
      <div className="w-full max-w-7xl mx-auto px-4">
        {/* === GRID 4 KOLOM === */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* === MAP === */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg overflow-hidden h-48 shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.4748678015185!2d106.89464377576586!3d-6.332471161962127!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69ed2681bc7c67%3A0x777152b1d3f74a62!2sSMK%20Prestasi%20Prima!5e0!3m2!1sid!2sid!4v1759710767268!5m2!1sid!2sid"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

            <div className="flex items-start gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="min-w-5 h-5 mt-1"
              >
                <path
                  fillRule="evenodd"
                  d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-sm text-gray-300">
                Jl. Hankam Raya No. 89, Cilangkap, Kec. Cipayung, Kota Jakarta
                Timur, DKI Jakarta 13870
              </p>
            </div>
          </div>

          {/* === YAYASAN === */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">
              Yayasan Wahana Prestasi Prima
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://sma.prestasiprima.sch.id/"
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  SMA Prestasi Prima
                </a>
              </li>
              <li>
                <a
                  href="/"
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  SMK Prestasi Prima
                </a>
              </li>
              <li>
                <a
                  href="https://prestasiprima.ac.id/"
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Politeknik Prestasi Prima
                </a>
              </li>
              <li>
                <a
                  href="https://perpustakaan.prestasiprima.sch.id/"
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Perpustakaan Prestasi Prima
                </a>
              </li>
            </ul>
          </div>

          {/* === MENU === */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Menu</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-300 hover:text-white text-sm">
                  Beranda
                </a>
              </li>
              <li>
                <a
                  href="/tentang/identitas"
                  className="text-gray-300 hover:text-white text-sm"
                >
                  Identitas Sekolah
                </a>
              </li>
              <li>
                <a
                  href="/program"
                  className="text-gray-300 hover:text-white text-sm"
                >
                  Program Keahlian
                </a>
              </li>
              <li>
                <a
                  href="/informasi/faq"
                  className="text-gray-300 hover:text-white text-sm"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="/kehidupan-siswa/penerimaan"
                  className="text-gray-300 hover:text-white text-sm"
                >
                  Penerimaan Siswa
                </a>
              </li>
            </ul>
          </div>

          {/* === INFO + SOSMED === */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Info</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <p className="text-sm text-gray-300">
                  Jl. Hankam Raya No. 89, Cilangkap, Cipayung, Jakarta Timur.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href="tel:+6285195928886"
                  className="text-sm text-gray-300 hover:text-white"
                >
                  +62 851-9592-8886
                </a>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href="mailto:ppdb@smkprestasiprima.sch.id"
                  className="text-sm text-gray-300 hover:text-white break-all"
                >
                  ppdb@smkprestasiprima.sch.id
                </a>
              </div>

              {/* === SOSMED === */}
              <div className="flex gap-3 mt-5 flex-wrap">
                <a
                  href={link.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 border-2 border-white rounded-lg flex items-center justify-center hover:bg-white transition-all group"
                >
                  <Image
                    src="/whatsapp-white.png"
                    alt="WhatsApp"
                    width={20}
                    height={20}
                    className="group-hover:invert"
                  />
                </a>
                <a
                  href={link.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 border-2 border-white rounded-lg flex items-center justify-center hover:bg-white transition-all group"
                >
                  <Image
                    src="/instagram-white.png"
                    alt="Instagram"
                    width={20}
                    height={20}
                    className="group-hover:invert"
                  />
                </a>
                <a
                  href={link.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 border-2 border-white rounded-lg flex items-center justify-center hover:bg-white transition-all group"
                >
                  <Image
                    src="/youtube-white.png"
                    alt="YouTube"
                    width={20}
                    height={20}
                    className="group-hover:invert"
                  />
                </a>
                <a
                  href={link.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 border-2 border-white rounded-lg flex items-center justify-center hover:bg-white transition-all group"
                >
                  <Image
                    src="/tiktok-white.png"
                    alt="TikTok"
                    width={20}
                    height={20}
                    className="group-hover:invert"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* SUPPORTED BY */}
        <div className="mb-10">
          <div className="w-full bg-white/5 border border-white/15 rounded-2xl px-4 py-4 sm:px-6 sm:py-5 shadow-lg flex flex-col items-center gap-4">
            <span className="text-[11px] md:text-xs font-semibold tracking-[0.18em] uppercase text-orange-200">
              Supported By
            </span>
            <div className="w-full flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-6">
              {supportedLogos.map((logo) => (
                <div
                  key={logo.src}
                  className="flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 bg-white rounded-full shadow-lg"
                >
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    width={220}
                    height={120}
                    className="w-16 sm:w-20 md:w-24 h-auto object-contain"
                    sizes="(max-width: 640px) 160px, (max-width: 1024px) 200px, 240px"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* COPYRIGHT */}
        <div className="pt-6 border-t border-gray-700 text-center">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} Presma AIO | Gold And Glory
          </p>
        </div>
      </div>
    </footer>
  );
}
