"use client";

import Image from "next/image";
import { useLang } from "./LangContext";

export default function Footer() {
  const { lang } = useLang();

  // Ubah link menjadi objek
  const link = {
    whatsapp: 'https://api.whatsapp.com/send/?phone=6285195928886',
    instagram: 'https://www.instagram.com/smkprestasiprima',
    youtube: 'https://m.youtube.com/@SEKOLAHPRESTASIPRIMA',
    tiktok: 'https://www.tiktok.com/@smkprestasiprima',
  };

  return (
    <footer className="bg-[#243771] text-white py-12 mt-auto">
      <div className="w-full max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 md:gap-12">
          {/* Logo + Info */}
          <div className="flex-1 min-w-[220px] mb-8 md:mb-0">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Image
                  src="/smk.png"
                  alt="Logo SMK"
                  width={50}
                  height={50}
                  className=""
                />
                <h2 className="font-bold text-2xl">SMK Prestasi Prima</h2>
              </div>
              <div className="flex items-start gap-3 mb-5 text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="min-w-7 h-7">
                    <path fillRule="evenodd" d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clipRule="evenodd" />
                  </svg>
                <span>
                  Jl. Hankam Raya No. 89, Cilangkap, Cipayung, Jakarta Timur, DKI Jakarta.
                </span>
              </div>
              <div className="flex items-start gap-3 mb-5 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="min-w-7 h-7">
                  <path fillRule="evenodd" d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z" clipRule="evenodd" />
                </svg>
                <span>
                +62 851-9592-8886
                </span>
              </div>
            </div>
            <div className="flex gap-2 mt-4 md:mt-0">
              <a
                href={link.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-gray-400 rounded-full flex items-center justify-center w-12 h-12 hover:border-white transition"
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
                href={link.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-gray-400 rounded-full flex items-center justify-center w-12 h-12 hover:border-white transition"
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
                href={link.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-gray-400 rounded-full flex items-center justify-center w-12 h-12 hover:border-white transition"
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
                href={link.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-gray-400 rounded-full flex items-center justify-center w-12 h-12 hover:border-white transition"
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

          {/* Navbar Footer */}
          <div className="flex-[2] min-w-[200px] grid grid-cols-2 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Profil Sekolah</h3>
              <ul className="space-y-1 text-sm">
                <li><a href="/profil/tentang-kami" className="hover:underline">Tentang Kami</a></li>
                <li><a href="/profil/visi-misi" className="hover:underline">Visi & Misi</a></li>
                <li><a href="/profil/manajemen" className="hover:underline">Manajemen</a></li>
                <li><a href="/profil/fasilitas" className="hover:underline">Fasilitas</a></li>
                <li><a href="/profil/mitra" className="hover:underline">Mitra</a></li>
                <li><a href="/profil/testimoni" className="hover:underline">Testimoni</a></li>
                <li><a href="/berita" className="hover:underline">Berita</a></li>
                <li><a href="/profil/faq" className="hover:underline">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Kegiatan Siswa</h3>
              <ul className="space-y-1 text-sm">
                <li><a href="/kegiatansiswa/ekstrakurikuler" className="hover:underline">Ekstrakurikuler</a></li>
                <li><a href="/kegiatansiswa/prestasi" className="hover:underline">Prestasi</a></li>
                <li><a href="/kegiatansiswa/osis-mpk" className="hover:underline">OSIS & MPK</a></li>
                <li><a href="/kegiatansiswa/acara" className="hover:underline">Acara</a></li>
                <li><a href="/kegiatansiswa/study-tour" className="hover:underline">Study Tour</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Lainnya</h3>
              <ul className="space-y-1 text-sm">
                <li><a href="/" className="hover:underline">Beranda</a></li>
                <li><a href="/edu/login" target="_blank" className="hover:underline">Presma Edu</a></li>
                <li><a href="/" className="hover:underline">Pendaftaran</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Garis */}
        <div className="border-t border-gray-500 my-10"></div>

        {/* Copyright */}
        <p className="text-center text-xs text-gray-300">
          &copy; {new Date().getFullYear()} SMK Prestasi Prima. All rights reserved. <br />
          Developed by <span className="text-orange-400">Gold and Glory</span>
        </p>
      </div>
    </footer>
  );
}
