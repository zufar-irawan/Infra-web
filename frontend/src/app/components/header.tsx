"use client";

import { useEffect, useState } from "react";
import { useLang } from "./LangContext";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const { lang, setLang } = useLang();
  const [isScrolled, setIsScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".dropdown")) setOpenDropdown(null);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const toggleDropdown = (menu: string) =>
    setOpenDropdown((prev) => (prev === menu ? null : menu));

  return (
    <header className="fixed top-0 w-full z-50 select-none">

      {/* Navbar */}
      <div
        className={`transition duration-300 p-3 text-white ${pathname === "/"
          ? isScrolled
            ? "bg-[#243771] shadow-md"
            : "bg-transparent shadow-none"
          : "bg-[#243771] shadow-md"
          }`}
      >
        <div className="container mx-auto flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <Image
              src="/smk.png"
              alt="Logo"
              width={46}
              height={46}
              className="rounded-full bg-[#243771]"
            />
            <span className="font-bold text-2xl">SMK Prestasi Prima</span>
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <nav className="flex items-center gap-6 text-white relative">
              <a
                href={`${pathname === "/" ? "#" : "/"}`}
                className="hover:text-yellow-400 transition cursor-pointer"
              >
                {lang === "id" ? "Beranda" : "Home"}
              </a>

              {/* Informasi Dropdown */}
              <div className="relative dropdown">
                <button
                  onClick={() => toggleDropdown("informasi")}
                  className="flex items-center gap-1 hover:text-yellow-400 transition cursor-pointer"
                >
                  {lang === "id" ? "Profil Sekolah" : "School Profile"}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m19.5 8.25-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                </button>
                {openDropdown === "informasi" && (
                  <div className="absolute left-0 mt-3 text-sm bg-white/90 shadow-lg rounded text-orange-600 w-36">
                    <a
                      href="/profil/tentang-kami"
                      className="block px-4 py-2 hover:bg-gray-200 rounded-t transition"
                    >
                      Tentang Kami
                    </a>
                    <a
                      href="/profil/visi-misi"
                      className="block px-4 py-2 hover:bg-gray-200 transition"
                    >
                      Visi & Misi
                    </a>
                    <a
                      href="/profil/prestasi"
                      className="block px-4 py-2 hover:bg-gray-200 transition"
                    >
                      Prestasi
                    </a>
                    <a
                      href="/profil/manajemen"
                      className="block px-4 py-2 hover:bg-gray-200 transition"
                    >
                      Manajemen
                    </a>
                    <a
                      href="/profil/fasilitas"
                      className="block px-4 py-2 hover:bg-gray-200 transition"
                    >
                      Fasilitas
                    </a>
                    <a
                      href="/profil/mitra"
                      className="block px-4 py-2 hover:bg-gray-200 transition"
                    >
                      Mitra
                    </a>
                    <a
                      href="/profil/testimoni"
                      className="block px-4 py-2 hover:bg-gray-200 transition"
                    >
                      Testimoni
                    </a>
                    <a
                      href="/profil/faq"
                      className="block px-4 py-2 hover:bg-gray-200 rounded-b transition"
                    >
                      FAQ
                    </a>
                  </div>
                )}
              </div>

              {/* Kegiatan Siswa Dropdown */}
              <div className="relative dropdown">
                <button
                  onClick={() => toggleDropdown("kegiatan-siswa")}
                  className="flex items-center gap-1 hover:text-yellow-400 transition cursor-pointer"
                >
                  {lang === "id" ? "Kegiatan Siswa" : "Students Activity"}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m19.5 8.25-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                </button>
                {openDropdown === "kegiatan-siswa" && (
                  <div className="absolute left-0 mt-3 text-sm bg-white/90 shadow-lg rounded text-orange-600 w-36">
                    <a
                      className="block px-4 py-2 hover:bg-gray-200 rounded-t transition"
                      href="#ekstrakurikuler"
                    >
                      Ekstrakurikuler
                    </a>
                    <a
                      className="block px-4 py-2 hover:bg-gray-200 rounded-t transition"
                      href="#osis-mpk"
                    >
                      Prestasi
                    </a>
                    <a
                      className="block px-4 py-2 hover:bg-gray-200 transition"
                      href="#acara"
                    >
                      Mitra
                    </a>
                    {/* <a
                      className="block px-4 py-2 hover:bg-gray-200 rounded-b transition"
                      href="#study-tour"
                    >
                      Study Tour
                    </a> */}
                  </div>
                )}
              </div>

              {/* News */}
              <a
                href="#berita"
                className="hover:text-yellow-400 transition cursor-pointer"
              >
                {lang === "id" ? "Berita Terkini" : "Latest News"}
              </a>

              {/* Registration */}
              <button className="px-4 py-2 rounded bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition font-medium">
                {lang === "id" ? "Pendaftaran" : "Registration"}
              </button>

              <div className="relative dropdown">
                <button
                  onClick={() => toggleDropdown("lang")}
                  className="px-4 py-2 rounded flex cursor-pointer items-center gap-2 bg-transparent border-1 border-gray-100 hover:border-gray-300 transition font-medium"
                >
                  <Image
                    src={
                      lang === "id"
                        ? "https://flagcdn.com/id.svg"
                        : "https://flagcdn.com/gb.svg"
                    }
                    alt="flag"
                    width={20}
                    height={15}
                  />
                  {lang === "id" ? "ID" : "EN"}
                </button>

                {openDropdown === "lang" && (
                  <div className="absolute left-0 mt-3 text-sm bg-white/90 shadow-lg rounded text-orange-600 w-36">
                    <button
                      onClick={() => {
                        setLang("id");
                        setOpenDropdown(null);
                      }}
                      className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-200 transition cursor-pointer rounded-t"
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
                      className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-200 transition cursor-pointer rounded-b"
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
            </nav>
          </div>

          {/* Hamburger for Mobile */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white text-orange-600 shadow-lg">
          <div className="flex flex-col px-6 py-4 space-y-3">
            <a href="/profil/tentang-kami">Tentang Kami</a>
            <a href="/profil/visi-misi">Visi & Misi</a>
            <a href="#manajemen">Manajemen</a>
            <a href="#fasilitas">Fasilitas</a>
            <a href="#testimoni">Testimoni</a>
            <a href="#faq">FAQ</a>
            <a href="#ekstrakurikuler">Ekstrakurikuler</a>
            <a href="#acara">Acara</a>
            <a href="#study-tour">Study Tour</a>
            <a href="#berita">{lang === "id" ? "Berita" : "News"}</a>
            <button className="px-4 py-2 rounded bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition font-medium">
              {lang === "id" ? "Pendaftaran" : "Registration"}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
