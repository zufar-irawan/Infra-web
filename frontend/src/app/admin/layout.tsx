"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Menu, X, LogOut } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // menu utama
  const menus = [
    { name: "Dashboard", href: "/admin", icon: "📊" },
    { name: "Staff", href: "/admin/staff", icon: "👩‍🏫" },
    { name: "Fasilitas", href: "/admin/fasilitas", icon: "🏫" },
    { name: "Mitra", href: "/admin/mitra", icon: "🤝" },
    { name: "Prestasi", href: "/admin/prestasi", icon: "🏆" },
    { name: "Ekstrakurikuler", href: "/admin/ekstrakurikuler", icon: "🎭" },
    { name: "Testimoni", href: "/admin/testimoni", icon: "💬" },
    { name: "Berita", href: "/admin/news", icon: "📰" },
    { name: "Kegiatan", href: "/admin/kegiatan", icon: "📅" },
    { name: "FAQ", href: "/admin/faq", icon: "❓" },
  ];

  // deteksi ukuran layar
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // klik di luar sidebar menutup (hanya mobile)
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

  // logout handler (nanti bisa ganti logic API)
  const handleLogout = () => {
    alert("Berhasil logout (simulasi).");
  };

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-800 relative overflow-hidden">
      {/* === Sidebar === */}
      <aside
        ref={sidebarRef}
        className={`fixed top-0 left-0 z-40 h-full bg-[#243771] text-white shadow-xl transform transition-all duration-300
          ${open ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0 lg:w-64`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <h1 className="font-bold text-lg tracking-wide">Admin Panel</h1>
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
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {menus.map((menu) => {
            const active = pathname === menu.href;
            return (
              <Link
                key={menu.href}
                href={menu.href}
                onClick={() => isMobile && setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 group
                  ${active
                    ? "bg-[#FE4D01] text-white"
                    : "text-white/80 hover:bg-[#ffffff20] hover:text-white"} `}
              >
                <span className="text-lg group-hover:scale-110 transition-transform">
                  {menu.icon}
                </span>
                <span className="text-sm font-medium truncate">{menu.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-white/10 px-4 py-4">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full py-2 rounded-md bg-[#FE4D01] text-white font-semibold hover:bg-[#fe5d20] transition"
          >
            <LogOut size={18} />
            Logout
          </button>
          <p className="text-xs text-white/60 text-center mt-4">
            SMK Prestasi Prima
          </p>
        </div>
      </aside>

      {/* === Overlay (klik di luar) === */}
      {isMobile && open && (
        <div className="fixed inset-0 bg-black/40 z-30 backdrop-blur-sm" />
      )}

      {/* === Button Toggle Sidebar (mobile) === */}
      {isMobile && (
        <button
          onClick={() => setOpen(true)}
          className="fixed top-4 left-4 z-50 p-2 bg-[#243771] text-white rounded-md shadow-lg hover:bg-[#FE4D01] transition"
        >
          <Menu size={20} />
        </button>
      )}

      {/* === Main Content === */}
      <main
        className={`flex-1 min-h-screen transition-all duration-300 overflow-y-auto ${
          !isMobile ? "lg:ml-64" : ""
        }`}
      >
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
