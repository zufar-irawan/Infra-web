"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Menu, X, LogOut } from "lucide-react";

export default function Sidebar({ isMobile }: { isMobile: boolean }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const sidebarRef = useRef<HTMLDivElement>(null);

  const menus = [
    { name: "Dashboard", href: "/portal/dashboard" },
    { name: "Fasilitas", href: "/portal/fasilitas" },
    { name: "Prestasi", href: "/portal/prestasi" },
    { name: "Berita", href: "/portal/news" },
    { name: "Mitra", href: "/portal/mitra" },
    { name: "Kegiatan", href: "/portal/kegiatan" },
    { name: "FAQ", href: "/portal/faq" },
  ];

  /**
   * ===============================
   *  HANDLE LOGOUT (via API server)
   * ===============================
   */
  const handleLogout = async () => {
    try {
      // 🧠 Hapus cookie HttpOnly via API route server
      await fetch("/api/portal/logout", { method: "GET" });

      // Bersihkan data session di browser
      sessionStorage.clear();

      // Efek visual kecil
      document.body.classList.add("opacity-50");

      // Redirect ke halaman login portal
      setTimeout(() => {
        window.location.href = "/portal";
      }, 300);
    } catch (error) {
      console.error("Logout error:", error);
      window.location.href = "/portal";
    }
  };

  // Tutup sidebar kalau klik di luar (khusus mobile)
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

  return (
    <>
      {/* Tombol buka sidebar (mobile) */}
      {isMobile && (
        <button
          onClick={() => setOpen(true)}
          className="fixed top-4 left-4 z-50 p-2 bg-[#1e2b63] text-white rounded-md shadow-md hover:bg-[#243771] transition"
        >
          <Menu size={20} />
        </button>
      )}

      {/* Sidebar utama */}
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

          {/* Menu list */}
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

      {/* Overlay mobile */}
      {isMobile && open && <div className="fixed inset-0 bg-black/50 z-30" />}
    </>
  );
}
