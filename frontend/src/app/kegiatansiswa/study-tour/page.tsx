"use client";

import Link from "next/link";
import { useLang } from "@/components/LangContext";

export default function StudyTour() {
    const { lang } = useLang();

    return (
        <main className="py-25">
            {/* Breadcrumbs */}
            <section className="w-full py-4 bg-white">
              <div className="container mx-auto px-4">
                <nav className="flex items-center text-sm font-medium space-x-2">
                  <Link href="/" className="text-[#FE4D01] hover:underline">
                    {lang === "id" ? "Beranda" : "Home"}
                  </Link>
                  <span className="text-[#FE4D01]">{">"}</span>
                  <Link
                    href="/profil/tentang-kami"
                    className="text-[#FE4D01] hover:underline"
                  >
                    {lang === "id" ? "Informasi Sekolah" : "School Information"}
                  </Link>
                  <span className="text-[#243771]">{">"}</span>
                  <span className="text-[#243771]">
                    Study Tour
                  </span>
                </nav>
              </div>
            </section>
            <section className="w-full h-100">
                <div className="flex">

                </div>
            </section>
        </main>
    )
}