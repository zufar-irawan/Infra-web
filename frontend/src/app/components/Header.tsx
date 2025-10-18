"use client";

import { useEffect, useState, useRef } from "react";
import { useLang } from "./LangContext";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ExternalLink, ChevronDown } from "lucide-react";

type HeaderMenuItem = {
  id: string;
  name_id: string;
  name_en: string;
  href?: string;
  submenu?: Array<{ href: string; id: string; en: string }>;
};

export default function Header() {
  const pathname = usePathname();
  const { lang, setLang } = useLang();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(null);
  const [hoveredDropdown, setHoveredDropdown] = useState<string | null>(null);
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);

  // detect mobile
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1300px)");
    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      // @ts-ignore
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

  const handleMouseEnter = (menu: string) => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setHoveredDropdown(menu);
  };
  const handleMouseLeave = () => {
    hoverTimeout.current = setTimeout(() => {
      setHoveredDropdown(null);
    }, 200);
  };

  // === Header Menu ===
  const headerMenus: HeaderMenuItem[] = [
    {
      id: "beranda",
      name_id: "Beranda",
      name_en: "Home",
      href: "/",
    },
    {
      id: "tentang",
      name_id: "Tentang Kami",
      name_en: "About Us",
      submenu: [
        { href: "/tentang/identitas", id: "Identitas Sekolah", en: "School Identity" },
        { href: "/tentang/visi-misi", id: "Visi & Misi", en: "Vision & Mission" },
        { href: "/tentang/manajemen", id: "Manajemen Staff", en: "Management Staff" },
        { href: "/tentang/fasilitas", id: "Fasilitas", en: "Facilities" },
        { href: "/tentang/mitra", id: "Mitra", en: "Partners" },
        { href: "/program", id: "Program Keahlian", en: "Expertise Programs" },
      ],
    },
    {
      id: "siswa",
      name_id: "Kehidupan Siswa",
      name_en: "Student Life",
      submenu: [
        { href: "/kehidupan-siswa/prestasi", id: "Prestasi", en: "Achievements" },
        { href: "/kehidupan-siswa/ekstrakurikuler", id: "Ekstrakurikuler", en: "Extracurricular" },
        { href: "/kehidupan-siswa/penerimaan", id: "Penerimaan Siswa", en: "Admissions" },
        { href: "/kehidupan-siswa/testimoni", id: "Testimoni", en: "Testimonials" },
      ],
    },
    {
      id: "info",
      name_id: "Informasi",
      name_en: "Information",
      submenu: [
        { href: "/informasi/berita", id: "Berita", en: "News" },
        { href: "/informasi/kegiatan", id: "Kegiatan", en: "Events" },
        { href: "/informasi/faq", id: "FAQ", en: "FAQ" },
      ],
    },
  ];

  // Use a simple language label instead of flag images
  const flagLabel = lang === "id" ? "ID" : "EN";

  return (
    <header className="fixed top-0 w-full z-50 select-none">
      <div
        className={`transition duration-300 p-3 text-white ${
          pathname === "/"
            ? isScrolled
              ? "bg-[#243771] shadow-md"
              : "bg-transparent"
            : "bg-[#243771] shadow-md"
        }`}
      >
        <div className="w-full max-w-[80%] mx-auto flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <Image
              src="/webp/smk.webp"
              alt="Logo"
              width={46}
              height={46}
              className="rounded-full bg-[#243771]"
            />
            <span className="hidden sm:inline font-bold text-xl">
              SMK Prestasi Prima
            </span>
          </a>

          {/* Desktop Menu */}
          {!isMobile ? (
            <nav className="hidden md:flex items-center gap-6 text-[15px] text-white relative">
              {headerMenus.map((menu) =>
                menu.submenu ? (
                  <div
                    key={menu.id}
                    className="relative dropdown"
                    onMouseEnter={() => handleMouseEnter(menu.id)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <button className="relative flex items-center gap-1 font-medium transition group cursor-pointer">
                      {lang === "id" ? menu.name_id : menu.name_en}
                      <ChevronDown size={16} className="ml-1" />
                      <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
                    </button>
                    {hoveredDropdown === menu.id && (
                      <div className="absolute left-0 mt-3 text-sm bg-white/95 shadow-lg rounded text-orange-600 w-52 transition duration-300 z-50">
                        {menu.submenu.map((sub, i) => (
                          <a
                            key={i}
                            href={sub.href}
                            className="block px-4 py-2 hover:bg-gray-200"
                          >
                            {lang === "id" ? sub.id : sub.en}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div key={menu.id}>
                    <a
                      href={menu.href ?? "#"}
                      className="relative font-medium transition cursor-pointer group"
                    >
                      {lang === "id" ? menu.name_id : menu.name_en}
                      <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
                    </a>
                  </div>
                )
              )}

              <a
                href="/edu/login"
                target="_blank"
                className="relative font-medium flex items-center gap-1 transition group"
              >
                Presma Edu <ExternalLink size={16} />
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
              </a>

              <div className="flex items-center gap-2 ml-4">
                <button className="px-4 py-2 rounded bg-orange-600 hover:bg-orange-700 transition font-semibold">
                  {lang === "id" ? "Pendaftaran" : "Registration"}
                </button>
                <button
                  onClick={() => setLang(lang === "id" ? "en" : "id")}
                  className="px-3 py-2 rounded bg-white/30 hover:bg-white/20 flex items-center gap-2 transition"
                >
                  {/* show simple language label instead of flag image */}
                  <span className="font-semibold">{flagLabel}</span>
                </button>
              </div>
            </nav>
          ) : (
            <button
              className="text-white cursor-pointer hover:opacity-70"
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
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* === MOBILE SIDEBAR === */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-[#243771] text-white shadow-lg transform transition-transform duration-300 z-50 ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-4">
          <button onClick={() => setIsMobileMenuOpen(false)} className="text-white text-xl">
            ✕
          </button>
          <button
            onClick={() => setLang(lang === "id" ? "en" : "id")}
            className="px-3 py-2 rounded bg-white/10 hover:bg-white/20 flex items-center gap-2"
          >
            {/* show simple language label instead of flag image */}
            <span className="font-semibold">{flagLabel}</span>
          </button>
        </div>

        <div className="flex flex-col px-6 py-4 space-y-2">
          {/* === Tambahan Beranda di Mobile === */}
          <a
            href="/"
            className="relative py-2 block font-medium group border-b border-white/20"
          >
            {lang === "id" ? "Beranda" : "Home"}
            <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
          </a>

          {[
            {
              title_id: "Tentang Kami",
              title_en: "About Us",
              submenu: [
                { href: "/tentang/identitas", id: "Identitas Sekolah", en: "School Identity" },
                { href: "/tentang/visi-misi", id: "Visi & Misi", en: "Vision & Mission" },
                { href: "/tentang/manajemen", id: "Manajemen Staff", en: "Management Staff" },
                { href: "/tentang/fasilitas", id: "Fasilitas", en: "Facilities" },
                { href: "/tentang/mitra", id: "Mitra", en: "Partners" },
                { href: "/program", id: "Program Keahlian", en: "Expertise Programs" },
              ],
            },
            {
              title_id: "Kehidupan Siswa",
              title_en: "Student Life",
              submenu: [
                { href: "/kehidupan-siswa/prestasi", id: "Prestasi", en: "Achievements" },
                { href: "/kehidupan-siswa/ekstrakurikuler", id: "Ekstrakurikuler", en: "Extracurricular" },
                { href: "/kehidupan-siswa/penerimaan", id: "Penerimaan Siswa", en: "Admissions" },
                { href: "/kehidupan-siswa/testimoni", id: "Testimoni", en: "Testimonials" },
              ],
            },
            {
              title_id: "Informasi",
              title_en: "Information",
              submenu: [
                { href: "/informasi/berita", id: "Berita", en: "News" },
                { href: "/informasi/kegiatan", id: "Kegiatan", en: "Events" },
                { href: "/informasi/faq", id: "FAQ", en: "FAQ" },
              ],
            },
          ].map((menu, i) => (
            <div key={i}>
              <div className="relative">
                <button
                  onClick={() =>
                    setOpenMobileDropdown(
                      openMobileDropdown === menu.title_id ? null : menu.title_id
                    )
                  }
                  className="w-full flex justify-between items-center py-2 relative font-medium group"
                >
                  <span>
                    {lang === "id" ? menu.title_id : menu.title_en}
                    <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
                  </span>
                  <span className="text-lg">
                    {openMobileDropdown === menu.title_id ? "−" : "+"}
                  </span>
                </button>
                <div
                  className={`pl-4 overflow-hidden transition-all duration-300 ease-in-out ${
                    openMobileDropdown === menu.title_id
                      ? "max-h-96 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  {menu.submenu.map((sub, j) => (
                    <a key={j} href={sub.href} className="block py-1 text-sm relative group">
                      {lang === "id" ? sub.id : sub.en}
                      <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ))}

          <a
            href="/edu/login"
            target="_blank"
            className="px-4 py-2 mt-3 border border-white rounded flex items-center gap-2 justify-center font-semibold hover:opacity-80"
          >
            Presma Edu <ExternalLink size={16} />
          </a>

          <button className="px-4 py-2 mt-2 bg-orange-600 hover:bg-orange-700 rounded font-semibold">
            {lang === "id" ? "Pendaftaran" : "Registration"}
          </button>
        </div>
      </div>
    </header>
  );
}
