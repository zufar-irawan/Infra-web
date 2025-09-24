"use client";

import { useEffect, useState } from "react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [lang, setLang] = useState<"id" | "en">("id");
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleDropdown = (menu: string) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/10 backdrop-blur shadow" : "bg-transparent"
      }`}
    >
      {/* Top Bar Ungu */}
      <div className="bg-[#243771] text-white text-sm relative">
        <div className="max-w-7xl mx-auto flex items-center justify-end px-6 py-1 gap-6">
          <button className="hover:underline">
            {lang === "id" ? "Berita" : "News"}
          </button>

          {/* Dropdown Bahasa */}
          <div className="relative">
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-1 hover:underline"
            >
              {lang === "id" ? "🇮🇩 Bahasa Indonesia" : "🇬🇧 English"}
            </button>
            {isLangOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded shadow-lg overflow-hidden">
                <button
                  onClick={() => {
                    setLang("id");
                    setIsLangOpen(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 w-full text-left text-[#FE4D01]"
                >
                  🇮🇩 Bahasa Indonesia
                </button>
                <button
                  onClick={() => {
                    setLang("en");
                    setIsLangOpen(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 w-full text-left text-[#FE4D01]"
                >
                  🇬🇧 English
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navbar Oranye */}
      <div className="bg-[#FE4D01]">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
          {/* Logo + Nama */}
          <div className="flex items-center gap-3">
            <img
              src="/LOGO SMK PRESTASI PRIMA.png"
              alt="Logo"
              className="h-12 w-12 rounded-full"
            />
            <span className="text-white font-semibold text-lg">
              SMK Prestasi Prima
            </span>
          </div>

          {/* Menu Tengah */}
          <nav className="hidden md:flex items-center gap-6 text-white font-medium">
            {/* Informasi Siswa */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown("informasi")}
                className="hover:underline"
              >
                {lang === "id" ? "Informasi Siswa" : "School Info"}
              </button>
              {openDropdown === "informasi" && (
                <div className="absolute bg-white mt-2 rounded shadow-lg">
                  <a href="#tentang" className="block px-4 py-2 hover:bg-gray-100 text-[#FE4D01]">
                    {lang === "id" ? "Tentang Kami" : "About Us"}
                  </a>
                  <a href="#visi" className="block px-4 py-2 hover:bg-gray-100 text-[#FE4D01]">
                    {lang === "id" ? "Visi Misi" : "Vision & Mission"}
                  </a>
                  <a href="#manajemen" className="block px-4 py-2 hover:bg-gray-100 text-[#FE4D01]">
                    {lang === "id" ? "Manajemen" : "Management"}
                  </a>
                  <a href="#fasilitas" className="block px-4 py-2 hover:bg-gray-100 text-[#FE4D01]">
                    {lang === "id" ? "Fasilitas" : "Facilities"}
                  </a>
                  <a href="#faq" className="block px-4 py-2 hover:bg-gray-100 text-[#FE4D01]">
                    FAQ
                  </a>
                </div>
              )}
            </div>

            {/* Kehidupan Siswa */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown("kehidupan")}
                className="hover:underline"
              >
                {lang === "id" ? "Kehidupan Siswa" : "Student Life"}
              </button>
              {openDropdown === "kehidupan" && (
                <div className="absolute bg-white mt-2 rounded shadow-lg">
                  <a href="#prestasi" className="block px-4 py-2 hover:bg-gray-100 text-[#FE4D01]">
                    {lang === "id" ? "Prestasi" : "Achievements"}
                  </a>
                  <a href="#ekskul" className="block px-4 py-2 hover:bg-gray-100 text-[#FE4D01]">
                    {lang === "id" ? "Ekstrakurikuler" : "Extracurricular"}
                  </a>
                </div>
              )}
            </div>

            {/* Mitra */}
            <a href="#mitra">{lang === "id" ? "Mitra" : "Partners"}</a>

            {/* Penerimaan Siswa */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown("penerimaan")}
                className="hover:underline"
              >
                {lang === "id" ? "Penerimaan Siswa" : "Admission"}
              </button>
              {openDropdown === "penerimaan" && (
                <div className="absolute bg-white mt-2 rounded shadow-lg">
                  <a href="#daftar" className="block px-4 py-2 hover:bg-gray-100 text-[#FE4D01]">
                    {lang === "id" ? "Daftar Sekarang" : "Register Now"}
                  </a>
                  <a href="#testimoni" className="block px-4 py-2 hover:bg-gray-100 text-[#FE4D01]">
                    {lang === "id" ? "Testimoni" : "Testimonials"}
                  </a>
                </div>
              )}
            </div>
          </nav>

          {/* Tombol Pendaftaran */}
          <button className="bg-[#243771] hover:bg-[#1b2a5a] px-4 py-2 rounded text-white font-medium">
            {lang === "id" ? "Pendaftaran" : "Register"}
          </button>
        </div>
      </div>
    </header>
  );
}
