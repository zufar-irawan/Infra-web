"use client";

import { useEffect } from "react";
import { useLang } from "./LangContext";

export default function Footer() {
  const { lang } = useLang();

  // === Scroll smooth + balik posisi saat back ===
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";

    // simpan posisi scroll tiap kali berpindah halaman
    const saveScroll = () => {
      sessionStorage.setItem("scrollPos", String(window.scrollY));
    };

    window.addEventListener("beforeunload", saveScroll);

    // kalau user klik tombol Back → scroll ke posisi terakhir
    window.addEventListener("popstate", () => {
      const pos = sessionStorage.getItem("scrollPos");
      if (pos) {
        setTimeout(() => {
          window.scrollTo({ top: Number(pos), behavior: "smooth" });
        }, 100);
      }
    });

    return () => {
      window.removeEventListener("beforeunload", saveScroll);
      window.removeEventListener("popstate", () => {});
    };
  }, []);

  // === Konten footer ===
  const link = {
    whatsapp: "https://api.whatsapp.com/send/?phone=6285195928886",
    instagram: "https://www.instagram.com/smkprestasiprima",
    youtube: "https://m.youtube.com/@SEKOLAHPRESTASIPRIMA",
    tiktok: "https://www.tiktok.com/@smkprestasiprima",
  };

  return (
    <footer className="bg-[#0f1b3d] text-white py-12 mt-auto scroll-smooth">
      <div className="w-full max-w-7xl mx-auto px-4">
        {/* === Grid 4 Kolom === */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* === MAP SECTION === */}
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
                Timur, Daerah Khusus Ibukota Jakarta 13870
              </p>
            </div>
          </div>

          {/* === YAYASAN SECTION === */}
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

            {/* === Kotak Putih "Supported by" === */}
            <div className="mt-5 bg-white p-3 text-center w-fit mx-auto shadow-md rounded-lg">
              <p className="text-xs md:text-sm font-medium text-[#0f1b3d] mb-2">
                Supported by :
              </p>
              <img
                src="/4logo.png"
                alt="Logo Prestasi Prima Group"
                className="w-[180px] sm:w-[220px] md:w-[250px] lg:w-[280px] mx-auto object-contain"
              />
            </div>
          </div>

          {/* === MENU SECTION === */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Menu</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/"
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Beranda
                </a>
              </li>
              <li>
                <a
                  href="/tentang/identitas"
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Identitas Sekolah
                </a>
              </li>
              <li>
                <a
                  href="/program"
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Program Keahlian
                </a>
              </li>
              <li>
                <a
                  href="/informasi/faq"
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="/kehidupan-siswa/penerimaan"
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Penerimaan Siswa
                </a>
              </li>
            </ul>
          </div>

          {/* === INFO SECTION === */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Info</h3>
            <div className="space-y-3">
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
                  Jl. Hankam Raya No. 89, Cilangkap, Cipayung, Jakarta Timur,
                  DKI Jakarta.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="min-w-5 h-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z"
                    clipRule="evenodd"
                  />
                </svg>
                <a
                  href="tel:+6285195928886"
                  className="text-sm text-gray-300 hover:text-white"
                >
                  +62 851-9592-8886
                </a>
              </div>

              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="min-w-5 h-5"
                >
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
            </div>
          </div>
        </div>

        {/* === COPYRIGHT === */}
        <div className="pt-6 border-t border-gray-700 text-center">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} Presma AIO | Gold And Glory
          </p>
        </div>
      </div>
    </footer>
  );
}
