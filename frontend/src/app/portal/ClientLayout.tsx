"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";

export default function ClientLayout({
  token,
  children,
}: {
  token: string | null;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage =
    pathname === "/portal" || pathname.startsWith("/portal/verify");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isAuthPage) return <>{children}</>;

  return (
    <div className="flex min-h-screen bg-[#f4f6fb] text-gray-800 overflow-hidden">
      <Sidebar isMobile={isMobile} />

      <main
        className={`flex-1 min-h-screen transition-all duration-300 ${
          isMobile ? "" : "lg:ml-64"
        }`}
      >
        {/* 🩶 ganti padding besar jadi kecil supaya ga dobel */}
        <div className="p-3 sm:p-6 md:p-8">{children}</div>
      </main>
    </div>
  );
}
