"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [lang, setLang] = useState<"id" | "en">("id");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleDropdown = (menu: string) => {
    setOpenDropdown((prev) => (prev === menu ? null : menu));
  };

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/10 backdrop-blur shadow" : "bg-transparent"
      }`}
    >
      {/* Top Bar Ungu */}
      <div className="bg-[#243771] text-white text-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-end px-6 py-1 gap-6">
          <button className="hover:underline">
            {lang === "id" ? "Berita" : "News"}
          </button>

          {/* Dropdown Bahasa */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown("lang")}
              className="flex items-center gap-2 hover:underline"
            >
              <Image
                src={lang === "id" ? "https://flagcdn.com/id.svg" : "https://flagcdn.com/gb.svg"}
                alt="flag"
                width={20}
                height={15}
              />
              {lang === "id" ? "Bahasa Indonesia" : "English"}
            </button>
            {openDropdown === "lang" && (
              <div className="absolute right-0 mt-1 w-44 bg-white shadow-lg rounded text-[#FE4D01]">
                <button
                  onClick={() => {
                    setLang("id");
                    setOpenDropdown(null);
                  }}
                  className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100 transition"
                >
                  <Image
                    src="https://flagcdn.com/id.svg"
                    alt="ID Flag"
                    width={20}
                    height={15}
                  />
                  Bahasa Indonesia
                </button>
                <button
                  onClick={() => {
                    setLang("en");
                    setOpenDropdown(null);
                  }}
                  className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100 transition"
                >
                  <Image
                    src="https://flagcdn.com/gb.svg"
                    alt="EN Flag"
                    width={20}
                    height={15}
                  />
                  English
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
            <Image
              src="/LOGO SMK PRESTASI PRIMA.png"
              alt="Logo"
              width={48}
              height={48}
              className="rounded-full"
            />
            <span className="text-white font-semibold text-lg">
              SMK Prestasi Prima
            </span>
          </div>

          {/* Menu Tengah (Desktop) */}
          <nav className="hidden md:flex items-center gap-6 text-white font-medium relative">
            {/* Informasi Siswa */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown("informasi")}
                className="hover:underline"
              >
                {lang === "id" ? "Informasi Siswa" : "School Info"}
              </button>
              {openDropdown === "informasi" && (
                <div className="absolute left-0 mt-2 bg-white shadow-lg rounded text-[#FE4D01] w-48">
                  <a href="#tentang" className="block px-4 py-2 hover:bg-gray-100 transition">Tentang Kami</a>
                  <a href="#visi" className="block px-4 py-2 hover:bg-gray-100 transition">Visi Misi</a>
                  <a href="#manajemen" className="block px-4 py-2 hover:bg-gray-100 transition">Manajemen</a>
                  <a href="#fasilitas" className="block px-4 py-2 hover:bg-gray-100 transition">Fasilitas</a>
                  <a href="#faq" className="block px-4 py-2 hover:bg-gray-100 transition">FAQ</a>
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
                <div className="absolute left-0 mt-2 bg-white shadow-lg rounded text-[#FE4D01] w-40">
                  <a href="#prestasi" className="block px-4 py-2 hover:bg-gray-100 transition">Prestasi</a>
                  <a href="#ekskul" className="block px-4 py-2 hover:bg-gray-100 transition">Ekstrakurikuler</a>
                </div>
              )}
            </div>

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
                <div className="absolute left-0 mt-2 bg-white shadow-lg rounded text-[#FE4D01] w-48">
                  <a href="#daftar" className="block px-4 py-2 hover:bg-gray-100 transition">Daftar Sekarang</a>
                  <a href="#testimoni" className="block px-4 py-2 hover:bg-gray-100 transition">Testimoni</a>
                </div>
              )}
            </div>
          </nav>

          {/* Tombol Pendaftaran (Desktop) */}
          <button className="hidden md:block bg-[#243771] hover:bg-[#1b2a5a] px-4 py-2 rounded text-white font-medium">
            {lang === "id" ? "Pendaftaran" : "Register"}
          </button>

          {/* Hamburger (Mobile) */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white text-[#FE4D01] shadow-lg">
          <div className="flex flex-col px-6 py-4 space-y-3">
            <button onClick={() => toggleDropdown("informasi")} className="text-left hover:bg-gray-100 px-2 py-1 rounded transition">
              {lang === "id" ? "Informasi Siswa" : "School Info"}
            </button>
            {openDropdown === "informasi" && (
              <div className="pl-4 space-y-2">
                <a href="#tentang" className="block hover:bg-gray-100 px-2 py-1 rounded transition">Tentang Kami</a>
                <a href="#visi" className="block hover:bg-gray-100 px-2 py-1 rounded transition">Visi Misi</a>
                <a href="#manajemen" className="block hover:bg-gray-100 px-2 py-1 rounded transition">Manajemen</a>
                <a href="#fasilitas" className="block hover:bg-gray-100 px-2 py-1 rounded transition">Fasilitas</a>
                <a href="#faq" className="block hover:bg-gray-100 px-2 py-1 rounded transition">FAQ</a>
              </div>
            )}

            <button onClick={() => toggleDropdown("kehidupan")} className="text-left hover:bg-gray-100 px-2 py-1 rounded transition">
              {lang === "id" ? "Kehidupan Siswa" : "Student Life"}
            </button>
            {openDropdown === "kehidupan" && (
              <div className="pl-4 space-y-2">
                <a href="#prestasi" className="block hover:bg-gray-100 px-2 py-1 rounded transition">Prestasi</a>
                <a href="#ekskul" className="block hover:bg-gray-100 px-2 py-1 rounded transition">Ekstrakurikuler</a>
              </div>
            )}

            <a href="#mitra" className="hover:bg-gray-100 px-2 py-1 rounded transition">
              {lang === "id" ? "Mitra" : "Partners"}
            </a>

            <button onClick={() => toggleDropdown("penerimaan")} className="text-left hover:bg-gray-100 px-2 py-1 rounded transition">
              {lang === "id" ? "Penerimaan Siswa" : "Admission"}
            </button>
            {openDropdown === "penerimaan" && (
              <div className="pl-4 space-y-2">
                <a href="#daftar" className="block hover:bg-gray-100 px-2 py-1 rounded transition">Daftar Sekarang</a>
                <a href="#testimoni" className="block hover:bg-gray-100 px-2 py-1 rounded transition">Testimoni</a>
              </div>
            )}

            <button className="bg-[#243771] hover:bg-[#1b2a5a] px-4 py-2 rounded text-white font-medium mt-4 transition">
              {lang === "id" ? "Pendaftaran" : "Register"}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}