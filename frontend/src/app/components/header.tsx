"use client";

import { useEffect, useState, useRef } from "react";
import { useLang } from "./LangContext";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ExternalLink } from "lucide-react";

export default function Header() {
  const pathname = usePathname();
  const { lang, setLang } = useLang();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(null);

  const [hoveredDropdown, setHoveredDropdown] = useState<string | null>(null);
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // detect mobile
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1300px)");
    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(e.matches);
    };
    handleChange(mediaQuery);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // sticky header
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // close mobile menu when click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest("button.hamburger-btn")
      ) {
        setIsMobileMenuOpen(false);
      }
    };
    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileMenuOpen]);

  // handle hover dropdown with delay close
  const handleMouseEnter = (menu: string) => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setHoveredDropdown(menu);
  };
  const handleMouseLeave = () => {
    hoverTimeout.current = setTimeout(() => {
      setHoveredDropdown(null);
    }, 200); // 200ms delay
  };

  return (
    <header className="fixed top-0 w-full z-50 select-none">
      {/* Navbar */}
      <div
        className={`transition duration-300 p-3 text-white ${
          pathname === "/"
            ? isScrolled
              ? "bg-[#243771] shadow-md"
              : "bg-transparent shadow-none"
            : "bg-[#243771] shadow-md"
        }`}
      >
        <div className="container mx-auto flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <Image src="/smk.png" alt="Logo" width={46} height={46} className="rounded-full bg-[#243771]" />
            <span className="font-bold text-xl">SMK Prestasi Prima</span>
          </a>

          {/* Desktop Menu */}
          {!isMobile ? (
            <div className="text-[15px] hidden md:flex items-center gap-6">
              <nav className="flex items-center gap-6 text-white relative">
                {/* Home */}
                <a href={`${pathname === "/" ? "#" : "/"}`} className="relative font-medium transition cursor-pointer group">
                  {lang === "id" ? "Beranda" : "Home"}
                  <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
                </a>

                {/* Profil Sekolah */}
                <div
                  className="relative dropdown"
                  onMouseEnter={() => handleMouseEnter("profil")}
                  onMouseLeave={handleMouseLeave}
                >
                  <button className="relative flex items-center gap-1 font-medium transition cursor-pointer group-hover:text-white">
                    {lang === "id" ? "Profil Sekolah" : "School Profile"}
                    <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                      viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                      className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round"
                        d="m19.5 8.25-7.5 7.5-7.5-7.5"/></svg>
                  </button>
                  {hoveredDropdown === "profil" && (
                    <div className="absolute left-0 mt-3 text-sm bg-white/95 shadow-lg rounded text-orange-600 w-40 transition duration-300 opacity-100">
                      <a href="/profil/tentang-kami" className="block px-4 py-2 hover:bg-gray-200">Tentang Kami</a>
                      <a href="/profil/visi-misi" className="block px-4 py-2 hover:bg-gray-200">Visi & Misi</a>
                      <a href="/profil/prestasi" className="block px-4 py-2 hover:bg-gray-200">Prestasi</a>
                      <a href="/profil/manajemen" className="block px-4 py-2 hover:bg-gray-200">Manajemen</a>
                      <a href="/profil/fasilitas" className="block px-4 py-2 hover:bg-gray-200">Fasilitas</a>
                      <a href="/profil/mitra" className="block px-4 py-2 hover:bg-gray-200">Mitra</a>
                      <a href="/profil/testimoni" className="block px-4 py-2 hover:bg-gray-200">Testimoni</a>
                      <a href="/profil/faq" className="block px-4 py-2 hover:bg-gray-200">FAQ</a>
                    </div>
                  )}
                </div>

                {/* Kegiatan Siswa */}
                <div
                  className="relative dropdown"
                  onMouseEnter={() => handleMouseEnter("kegiatan")}
                  onMouseLeave={handleMouseLeave}
                >
                  <button className="relative flex items-center gap-1 font-medium transition cursor-pointer group-hover:text-white">
                    {lang === "id" ? "Kegiatan Siswa" : "Students Activity"}
                    <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                      viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                      className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round"
                        d="m19.5 8.25-7.5 7.5-7.5-7.5"/></svg>
                  </button>
                  {hoveredDropdown === "kegiatan" && (
                    <div className="absolute left-0 mt-3 text-sm bg-white/95 shadow-lg rounded text-orange-600 w-44 transition duration-300 opacity-100">
                      <a href="/kegiatansiswa/ekstrakurikuler" className="block px-4 py-2 hover:bg-gray-200">Ekstrakurikuler</a>
                      <a href="/kegiatansiswa/prestasi" className="block px-4 py-2 hover:bg-gray-200">Prestasi</a>
                      <a href="#berita" className="block px-4 py-2 hover:bg-gray-200">Berita Terkini</a>
                    </div>
                  )}
                </div>

                {/* lainnya */}
                <a href="/penerimaansiswa" className="relative font-medium transition cursor-pointer group">
                  {lang === "id" ? "Penerimaan Siswa" : "Students Registration"}
                  <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
                </a>

                <a href="/edu/login" target="_blank" className="relative font-medium transition cursor-pointer flex items-center gap-1 group">
                  {lang === "id" ? "Presma Edu" : "Presma Edu"} <ExternalLink size={16}/>
                  <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
                </a>

                <button className="px-4 py-2 rounded bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition font-semibold">
                  {lang === "id" ? "Pendaftaran" : "Registration"}
                </button>
              </nav>
            </div>
          ) : (
            // Mobile Menu button
            <button className="text-white hamburger-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <div
        ref={mobileMenuRef}
        className={`fixed top-0 right-0 h-full w-64 bg-white text-orange-600 shadow-lg transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col px-6 py-4 space-y-2">
          <a href="/" className="py-2 hover:bg-gray-200">{lang === "id" ? "Beranda" : "Home"}</a>

          {/* Profil Sekolah mobile */}
          <button onClick={() => setOpenMobileDropdown(openMobileDropdown === "profil" ? null : "profil")}
            className="flex justify-between items-center py-2 hover:bg-gray-200">
            {lang === "id" ? "Profil Sekolah" : "School Profile"}
            <span>{openMobileDropdown === "profil" ? "-" : "+"}</span>
          </button>
          <div className={`pl-4 flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${
              openMobileDropdown === "profil" ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}>
            <a href="/profil/tentang-kami" className="py-1 hover:bg-gray-200">Tentang Kami</a>
            <a href="/profil/visi-misi" className="py-1 hover:bg-gray-200">Visi & Misi</a>
            <a href="/profil/prestasi" className="py-1 hover:bg-gray-200">Prestasi</a>
            <a href="/profil/manajemen" className="py-1 hover:bg-gray-200">Manajemen</a>
            <a href="/profil/fasilitas" className="py-1 hover:bg-gray-200">Fasilitas</a>
            <a href="/profil/mitra" className="py-1 hover:bg-gray-200">Mitra</a>
            <a href="/profil/testimoni" className="py-1 hover:bg-gray-200">Testimoni</a>
            <a href="/profil/faq" className="py-1 hover:bg-gray-200">FAQ</a>
          </div>

          {/* Kegiatan Siswa mobile */}
          <button onClick={() => setOpenMobileDropdown(openMobileDropdown === "kegiatan" ? null : "kegiatan")}
            className="flex justify-between items-center py-2 hover:bg-gray-200">
            {lang === "id" ? "Kegiatan Siswa" : "Students Activity"}
            <span>{openMobileDropdown === "kegiatan" ? "-" : "+"}</span>
          </button>
          <div className={`pl-4 flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${
              openMobileDropdown === "kegiatan" ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}>
            <a href="/kegiatansiswa/ekstrakurikuler" className="py-1 hover:bg-gray-200">Ekstrakurikuler</a>
            <a href="/kegiatansiswa/prestasi" className="py-1 hover:bg-gray-200">Prestasi</a>
            <a href="#berita" className="py-1 hover:bg-gray-200">Berita Terkini</a>
          </div>

          <a href="/penerimaansiswa" className="py-2 hover:bg-gray-200">{lang === "id" ? "Penerimaan Siswa" : "Students Registration"}</a>
          <a href="/edu/login" target="_blank" className="flex items-center gap-1 py-2 hover:bg-gray-200">
            {lang === "id" ? "Presma Edu" : "Presma Edu"} <ExternalLink size={16}/>
          </a>
          <button className="px-4 py-2 text-white rounded bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition font-semibold">
            {lang === "id" ? "Pendaftaran" : "Registration"}
          </button>
        </div>
      </div>
    </header>
  );
}
