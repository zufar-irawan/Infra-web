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

  const menus = [
    { name: "Dashboard", href: "/portal/dashboard", icon: "📊" },
    { name: "Staff", href: "/portal/staff", icon: "👩‍🏫" },
    { name: "Fasilitas", href: "/portal/fasilitas", icon: "🏫" },
    { name: "Mitra", href: "/portal/mitra", icon: "🤝" },
    { name: "Prestasi", href: "/portal/prestasi", icon: "🏆" },
    { name: "Ekstrakurikuler", href: "/portal/ekstrakurikuler", icon: "🎭" },
    { name: "Testimoni", href: "/portal/testimoni", icon: "💬" },
    { name: "Berita", href: "/portal/news", icon: "📰" },
    { name: "Kegiatan", href: "/portal/kegiatan", icon: "📅" },
    { name: "FAQ", href: "/portal/faq", icon: "❓" },
  ];

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // klik luar sidebar
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

  const handleLogout = () => {
    alert("Berhasil logout (simulasi).");
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#f9fafb] via-white to-[#eef2ff] text-gray-800 relative overflow-hidden">
      {/* === Sidebar === */}
      <aside
        ref={sidebarRef}
        className={`fixed top-0 left-0 z-40 h-full lg:w-64 transform transition-all duration-300
        ${open ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0`}
      >
        <div className="relative h-full bg-[#243771]/95 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.25)] border-r border-white/10 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
            <h1 className="font-bold text-lg tracking-wide text-white">
              <span className="text-[#FE4D01]">SMK</span> Admin
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
          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
            {menus.map((menu) => {
              const active = pathname === menu.href;
              return (
                <Link
                  key={menu.href}
                  href={menu.href}
                  onClick={() => isMobile && setOpen(false)}
                  className={`group flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 relative
                    ${
                      active
                        ? "bg-gradient-to-r from-[#FE4D01] to-[#FE7A32] text-white shadow-md"
                        : "text-white/80 hover:bg-white/10 hover:text-white"
                    }`}
                >
                  <span className="text-lg group-hover:scale-110 transition-transform">
                    {menu.icon}
                  </span>
                  <span className="text-sm font-medium truncate">{menu.name}</span>
                  {active && (
                    <div className="absolute right-2 w-[6px] h-[6px] rounded-full bg-white shadow-md"></div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-white/10 px-4 py-5">
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg font-semibold text-sm text-white bg-gradient-to-r from-[#FE4D01] to-[#FE7A32] hover:brightness-110 transition"
            >
              <LogOut size={18} />
              Logout
            </button>
            <p className="text-xs text-white/50 text-center mt-4">
              © 2025 SMK Prestasi Prima
            </p>
          </div>
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
          className="fixed top-4 left-4 z-50 p-2 bg-gradient-to-br from-[#243771] to-[#2a4fa5] text-white rounded-lg shadow-lg hover:scale-105 transition"
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
