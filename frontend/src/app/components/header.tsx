"use client";

import { useEffect, useState, useRef } from "react";
import { useLang } from "./LangContext";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ExternalLink, ChevronDown } from "lucide-react";

export default function Header() {
  const pathname = usePathname();
  const { lang, setLang } = useLang();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [openMobileDropdown1, setOpenMobileDropdown1] = useState<string | null>(null);
  const [openMobileDropdown2, setOpenMobileDropdown2] = useState<string | null>(null);

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

  // handle hover dropdown with delay close (desktop)
  const handleMouseEnter = (menu: string) => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setHoveredDropdown(menu);
  };
  const handleMouseLeave = () => {
    hoverTimeout.current = setTimeout(() => {
      setHoveredDropdown(null);
    }, 200);
  };

  // handle sidebar click
  const handleSidebarClick = (event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!target.closest("button.dropdown-btn") && !target.closest(".submenu")) {
      setOpenMobileDropdown1(null);
      setOpenMobileDropdown2(null);
    }
  };

  // flag url
  const flagUrl =
    lang === "id"
      ? "https://flagcdn.com/w20/id.png"
      : "https://flagcdn.com/w20/us.png";

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
        <div className="w-full max-w-4/5 mx-auto flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <Image src="/webp/smk.webp" alt="Logo" width={46} height={46} className="rounded-full bg-[#243771]" />
            <span className="font-bold text-xl">SMK Prestasi Prima</span>
          </a>

          {/* Desktop Menu */}
          {!isMobile ? (
            <div className="text-[15px] hidden md:flex items-center">
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
                  <button className="relative flex items-center gap-1 font-medium transition cursor-pointer group">
                    {lang === "id" ? "Profil Sekolah" : "School Profile"}
                    <ChevronDown size={16} className="ml-1" />
                    <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
                  </button>
                  {hoveredDropdown === "profil" && (
                    <div className="absolute left-0 mt-3 text-sm bg-white/95 shadow-lg rounded text-orange-600 w-44 transition duration-300">
                      <a href="/profil/tentang-kami" className="block px-4 py-2 hover:bg-gray-200">
                        {lang === "id" ? "Tentang Kami" : "About Us"}
                      </a>
                      <a href="/profil/visi-misi" className="block px-4 py-2 hover:bg-gray-200">
                        {lang === "id" ? "Visi & Misi" : "Vision & Mission"}
                      </a>
                      <a href="/profil/prestasi" className="block px-4 py-2 hover:bg-gray-200">
                        {lang === "id" ? "Prestasi" : "Achievements"}
                      </a>
                      <a href="/profil/manajemen" className="block px-4 py-2 hover:bg-gray-200">
                        {lang === "id" ? "Manajemen" : "Management"}
                      </a>
                      <a href="/profil/fasilitas" className="block px-4 py-2 hover:bg-gray-200">
                        {lang === "id" ? "Fasilitas" : "Facilities"}
                      </a>
                      <a href="/profil/mitra" className="block px-4 py-2 hover:bg-gray-200">
                        {lang === "id" ? "Mitra" : "Partners"}
                      </a>
                      <a href="/profil/testimoni" className="block px-4 py-2 hover:bg-gray-200">
                        {lang === "id" ? "Testimoni" : "Testimonials"}
                      </a>
                      <a href="/profil/faq" className="block px-4 py-2 hover:bg-gray-200">
                        {lang === "id" ? "FAQ" : "FAQ"}
                      </a>
                    </div>
                  )}
                </div>

                {/* Kegiatan Siswa */}
                <div
                  className="relative dropdown"
                  onMouseEnter={() => handleMouseEnter("kegiatan")}
                  onMouseLeave={handleMouseLeave}
                >
                  <button className="relative flex items-center gap-1 font-medium transition cursor-pointer group">
                    {lang === "id" ? "Kegiatan Siswa" : "Students Activity"}
                    <ChevronDown size={16} className="ml-1" />
                    <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
                  </button>
                  {hoveredDropdown === "kegiatan" && (
                    <div className="absolute left-0 mt-3 text-sm bg-white/95 shadow-lg rounded text-orange-600 w-48 transition duration-300">
                      <a href="/kegiatansiswa/ekstrakurikuler" className="block px-4 py-2 hover:bg-gray-200">
                        {lang === "id" ? "Ekstrakurikuler" : "Extracurricular"}
                      </a>
                      <a href="/kegiatansiswa/prestasi" className="block px-4 py-2 hover:bg-gray-200">
                        {lang === "id" ? "Prestasi" : "Achievements"}
                      </a>
                      <a href="#berita" className="block px-4 py-2 hover:bg-gray-200">
                        {lang === "id" ? "Berita Terkini" : "Latest News"}
                      </a>
                    </div>
                  )}
                </div>

                <a href="/edu/login" target="_blank" className="relative font-medium transition cursor-pointer flex items-center gap-1 group">
                  {lang === "id" ? "Presma Edu" : "Presma Edu"} <ExternalLink size={16}/>
                  <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
                </a>

                  <div className="flex items-center gap-2">
                    <button className="px-4 py-2 rounded bg-orange-600 hover:bg-orange-700 transition font-semibold cursor-pointer">
                      {lang === "id" ? "Pendaftaran" : "Registration"}
                    </button>

                    {/* Tombol bilingual desktop */}
                    <button
                      onClick={() => setLang(lang === "id" ? "en" : "id")}
                      className="px-3 py-2 rounded bg-white/30 hover:bg-white/20 flex items-center gap-2 transition cursor-pointer"
                    >
                      <Image src={flagUrl} alt={lang === "id" ? "ID Flag" : "EN Flag"} width={20} height={15} className="rounded-sm"/>
                      <span>{lang === "id" ? "ID" : "EN"}</span>
                    </button>
                  </div>
                
              </nav>
            </div>
          ) : (
            <button className="text-white hamburger-btn cursor-pointer hover:opacity-70" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>
            </button>
          )}
        </div>
      </div>

      {/* Overlay when sidebar open */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/30 z-40 transition-opacity duration-300" onClick={() => setIsMobileMenuOpen(false)}/>
      )}

      {/* Mobile Sidebar */}
      <div
        ref={mobileMenuRef}
        onClick={handleSidebarClick}
        className={`fixed top-0 right-0 h-full w-64 bg-[#243771] text-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-4">
          {/* Back Button Icon */}
          <button onClick={() => setIsMobileMenuOpen(false)} className="text-white hover:text-gray-300">
            <span className="text-xl cursor-pointer">&#10005;</span>
          </button>

          {/* Tombol bilingual mobile */}
          <button
            onClick={() => setLang(lang === "id" ? "en" : "id")}
            className="px-3 py-2 rounded bg-white/10 hover:bg-white/20 flex items-center gap-2 transition"
          >
            <Image src={flagUrl} alt={lang === "id" ? "ID Flag" : "EN Flag"} width={20} height={15} className="rounded-sm"/>
            <span>{lang === "id" ? "ID" : "EN"}</span>
          </button>
        </div>

        {/* Sidebar MENU bilingual */}
        <div className="flex flex-col px-6 py-4 space-y-2">
          <a href="/" className="relative py-2 group">
            {lang === "id" ? "Beranda" : "Home"}
            <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
          </a>

          {/* Profil Sekolah mobile */}
          <button
            onClick={() => setOpenMobileDropdown1(openMobileDropdown1 === "profil" ? null : "profil")}
            className="flex justify-between items-center py-2 dropdown-btn relative group cursor-pointer"
          >
            {lang === "id" ? "Profil Sekolah" : "School Profile"}
            <span>{openMobileDropdown1 === "profil" ? "-" : "+"}</span>
            <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
          </button>
          <div className={`submenu pl-4 flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${
              openMobileDropdown1 === "profil" ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}>
            <a href="/profil/tentang-kami" className="relative py-1 group">
              {lang === "id" ? "Tentang Kami" : "About Us"}
              <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="/profil/visi-misi" className="relative py-1 group">
              {lang === "id" ? "Visi & Misi" : "Vision & Mission"}
              <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="/profil/prestasi" className="relative py-1 group">
              {lang === "id" ? "Prestasi" : "Achievements"}
              <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="/profil/manajemen" className="relative py-1 group">
              {lang === "id" ? "Manajemen" : "Management"}
              <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="/profil/fasilitas" className="relative py-1 group">
              {lang === "id" ? "Fasilitas" : "Facilities"}
              <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="/profil/mitra" className="relative py-1 group">
              {lang === "id" ? "Mitra" : "Partners"}
              <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="/profil/testimoni" className="relative py-1 group">
              {lang === "id" ? "Testimoni" : "Testimonials"}
              <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="/profil/faq" className="relative py-1 group">
              {lang === "id" ? "FAQ" : "FAQ"}
              <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
            </a>
          </div>

          {/* Kegiatan Siswa mobile */}
          <button
            onClick={() => setOpenMobileDropdown2(openMobileDropdown2 === "kegiatan" ? null : "kegiatan")}
            className="flex justify-between items-center py-2 dropdown-btn relative group cursor-pointer"
          >
            {lang === "id" ? "Kegiatan Siswa" : "Students Activity"}
            <span>{openMobileDropdown2 === "kegiatan" ? "-" : "+"}</span>
            <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
          </button>
          <div className={`submenu pl-4 flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${
              openMobileDropdown2 === "kegiatan" ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}>
            <a href="/kegiatansiswa/ekstrakurikuler" className="relative py-1 group">
              {lang === "id" ? "Ekstrakurikuler" : "Extracurricular"}
              <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="/kegiatansiswa/prestasi" className="relative py-1 group">
              {lang === "id" ? "Prestasi" : "Achievements"}
              <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#berita" className="relative py-1 group">
              {lang === "id" ? "Berita Terkini" : "Latest News"}
              <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
            </a>
          </div>

          <a href="/edu/login" target="_blank" className="px-4 py-2 mt-2 text-white rounded border border-white hover:opacity-70 transition font-semibold flex items-center gap-2 justify-center">
            Presma Edu <ExternalLink size={16}/>
            <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
          </a>

          <button className="px-4 py-2 mt-2 text-white rounded bg-orange-600 hover:bg-orange-700 transition font-semibold cursor-pointer">
            {lang === "id" ? "Pendaftaran" : "Registration"}
          </button>
        </div>
      </div>
    </header>
  );
}
