"use client";

import Image from "next/image";
import { useLang } from "./LangContext";

export default function Footer() {
  const { lang } = useLang();

  // Link sosial media
  const link = {
    whatsapp: 'https://api.whatsapp.com/send/?phone=6285195928886',
    instagram: 'https://www.instagram.com/smkprestasiprima',
    youtube: 'https://m.youtube.com/@SEKOLAHPRESTASIPRIMA',
    tiktok: 'https://www.tiktok.com/@smkprestasiprima',
  };

  return (
    <footer className="bg-[#0f1b3d] text-white py-12 mt-auto">
      <div className="w-full max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          
          {/* Map Section */}
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
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="min-w-5 h-5 mt-1">
                <path fillRule="evenodd" d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-gray-300">
                Jl. Hankam Raya No. 89, Cilangkap, Kec. Cipayung, Kota Jakarta Timur, Daerah Khusus Ibukota Jakarta 13870
              </p>
            </div>
            <div className="flex items-center gap-2">
              <a
                href="https://maps.google.com/?q=Jl.+Hankam+Raya+No.+89+Cilangkap+Jakarta+Timur"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 text-sm underline"
              >
                Lihat peta lebih besar
              </a>
            </div>
          </div>

          {/* Yayasan Wahana Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Yayasan Wahana Prestasi Prima</h3>
            <ul className="space-y-2">
              <li>
                <a href="/sma" className="text-gray-300 hover:text-white transition-colors text-sm">
                  SMA Prestasi Prima
                </a>
              </li>
              <li>
                <a href="/smk" className="text-gray-300 hover:text-white transition-colors text-sm">
                  SMK Prestasi Prima
                </a>
              </li>
              <li>
                <a href="/politeknik" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Politeknik Prestasi Prima
                </a>
              </li>
            </ul>
          </div>

          {/* Menu Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Menu</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Beranda
                </a>
              </li>
              <li>
                <a href="/profil/tentang-kami" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Tentang Kami
                </a>
              </li>
              <li>
                <a href="/kegiatansiswa" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Program Keahlian
                </a>
              </li>
              <li>
                <a href="/kegiatansiswa" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Kehidupan Siswa
                </a>
              </li>
              <li>
                <a href="/" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Penerimaan Siswa
                </a>
              </li>
            </ul>
          </div>

          {/* Info Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Info</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="min-w-5 h-5 mt-1">
                  <path fillRule="evenodd" d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-gray-300">
                  Jl. Hankam Raya No. 89, Cilangkap, Cipayung, Jakarta Timur, DKI Jakarta.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="min-w-5 h-5">
                  <path fillRule="evenodd" d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z" clipRule="evenodd" />
                </svg>
                <a
                  href="tel:+6285195928886"
                  className="text-sm text-gray-300 hover:text-white"
                >
                  +62 851-9592-8886
                </a>
              </div>
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="min-w-5 h-5">
                  <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
                  <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
                </svg>
                <a
                  href="mailto:ppdb@smkprestasiprima.sch.id"
                  className="text-sm text-gray-300 hover:text-white break-all"
                >
                  ppdb@smkprestasiprima.sch.id
                </a>
              </div>
              <div className="flex gap-3 mt-4">
                <a
                  href={link.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 border-2 border-white rounded-lg flex items-center justify-center hover:bg-white transition-all group"
                  aria-label="WhatsApp"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    fill="currentColor"
                    className="w-5 h-5 text-white group-hover:text-[#0f1b3d]"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                </a>
                <a
                  href={link.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 border-2 border-white rounded-lg flex items-center justify-center hover:bg-white transition-all group"
                  aria-label="Instagram"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    fill="currentColor"
                    className="w-5 h-5 text-white group-hover:text-[#0f1b3d]"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a
                  href={link.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 border-2 border-white rounded-lg flex items-center justify-center hover:bg-white transition-all group"
                  aria-label="YouTube"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    fill="currentColor"
                    className="w-5 h-5 text-white group-hover:text-[#0f1b3d]"
                  >
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                  </svg>
                </a>
                <a
                  href={link.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 border-2 border-white rounded-lg flex items-center justify-center hover:bg-white transition-all group"
                  aria-label="TikTok"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    fill="currentColor"
                    className="w-5 h-5 text-white group-hover:text-[#0f1b3d]"
                  >
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-gray-700 pt-6 mt-6 text-center">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} Orens Solution - Version 2.0 | orang-orang
          </p>
        </div>
      </div>
    </footer>
  );
}