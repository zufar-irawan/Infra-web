"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Menu, X, LogOut } from "lucide-react";
import Cookies from "js-cookie";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  // === MENU ===
  const menus = [
    { name: "Dashboard", href: "/portal/dashboard" },
    { name: "Staff", href: "/portal/staff" },
    { name: "Fasilitas", href: "/portal/fasilitas" },
    { name: "Mitra", href: "/portal/mitra" },
    { name: "Prestasi", href: "/portal/prestasi" },
    { name: "Ekstrakurikuler", href: "/portal/ekstrakurikuler" },
    { name: "Testimoni", href: "/portal/testimoni" },
    { name: "Berita", href: "/portal/news" },
    { name: "Kegiatan", href: "/portal/kegiatan" },
    { name: "FAQ", href: "/portal/faq" },
  ];

  const isAuthPage = pathname === "/portal" || pathname.startsWith("/portal/verify");

  // === CEK LOGIN ===
  useEffect(() => {
    const token = Cookies.get("portal-auth-token");
    if (!token && !isAuthPage) {
      router.replace("/portal");
    } else {
      setIsLoggedIn(!!token);
      setIsReady(true);
    }
  }, [pathname, isAuthPage, router]);

  // === RESPONSIVE ===
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // === CLICK OUTSIDE (MOBILE) ===
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        isMobile &&
        open &&
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, isMobile]);

  // === LOGOUT ===
  const handleLogout = () => {
    Cookies.remove("portal-auth-token");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("verifyEmail");
    router.replace("/portal");
  };

  // === RENDER ===
  let content: React.ReactNode = null;

  if (!isReady) {
    content = null;
  } else if (isAuthPage) {
    content = <>{children}</>;
  } else if (!isLoggedIn) {
    content = null;
  } else {
    content = (
      <div className="flex min-h-screen bg-[#f4f6fb] text-gray-800">
        {/* Sidebar */}
        <aside
          ref={sidebarRef}
          className={`fixed top-0 left-0 z-40 h-full lg:w-64 transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0 bg-[#1e2b63] border-r border-[#141c44]`}
        >
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#141c44] bg-[#1a2554]">
              <h1 className="font-semibold text-lg text-white tracking-wide">
                SMK <span className="text-[#FE4D01]">Admin</span>
              </h1>
              {isMobile && (
                <button
                  onClick={() => setOpen(false)}
                  className="text-white hover:text-[#FE4D01] transition"
                >
                  <X size={22} />
                </button>
              )}
            </div>

            {/* Menu */}
            <nav className="flex-1 overflow-y-auto px-3 py-5 space-y-1">
              {menus.map((menu) => {
                const active = pathname === menu.href;
                return (
                  <Link
                    key={menu.href}
                    href={menu.href}
                    onClick={() => isMobile && setOpen(false)}
                    className={`block px-4 py-2.5 text-sm font-medium tracking-wide rounded-md transition-all duration-150
                      ${
                        active
                          ? "bg-[#FE4D01] text-white shadow-sm"
                          : "text-gray-300 hover:bg-[#2b377a] hover:text-white"
                      }`}
                  >
                    {menu.name}
                  </Link>
                );
              })}
            </nav>

            {/* Footer */}
            <div className="border-t border-[#141c44] px-4 py-5">
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-md font-semibold text-sm text-white bg-[#FE4D01] hover:bg-[#ff6a33] transition"
              >
                <LogOut size={18} />
                Logout
              </button>
              <p className="text-xs text-gray-400 text-center mt-4">
                © 2025 SMK Prestasi Prima
              </p>
            </div>
          </div>
        </aside>

        {/* Overlay (mobile) */}
        {isMobile && open && (
          <div className="fixed inset-0 bg-black/50 z-30" />
        )}

        {/* Tombol buka sidebar (mobile) */}
        {isMobile && (
          <button
            onClick={() => setOpen(true)}
            className="fixed top-4 left-4 z-50 p-2 bg-[#1e2b63] text-white rounded-md shadow-md hover:bg-[#243771] transition"
          >
            <Menu size={20} />
          </button>
        )}

        {/* Konten utama */}
        <main
          className={`flex-1 min-h-screen transition-all duration-300 ${
            !isMobile ? "lg:ml-64" : ""
          }`}
        >
          <div className="p-8">{children}</div>
        </main>
      </div>
    );
  }

  return <>{content}</>;
}
