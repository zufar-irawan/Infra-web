"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";

export default function ClientLayout({
  token,
  children,
}: {
  token: string | null;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthPage =
    pathname === "/portal" || pathname.startsWith("/portal/verify");
  const [isMobile, setIsMobile] = useState(false);

  // Deteksi lebar layar
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Redirect jika belum login dan bukan halaman auth
  useEffect(() => {
    if (!token && !isAuthPage) {
      router.replace("/portal");
    }
  }, [token, isAuthPage, router]);

  // Halaman login/verify jangan render sidebar
  if (isAuthPage) return <>{children}</>;

  // Kalau belum login, tampilkan loader redirect
  if (!token) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#1e2b63] text-white">
        Mengalihkan ke halaman login...
      </div>
    );
  }

  // Layout admin tampil penuh
  return (
    <div className="flex min-h-screen bg-[#f4f6fb] text-gray-800">
      <Sidebar isMobile={isMobile} />
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
