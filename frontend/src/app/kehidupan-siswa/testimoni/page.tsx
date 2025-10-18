"use client";

import Link from "next/link";
import { useLang } from "../../components/LangContext";
import Testimoni from "@/app/sections/testimoni";
import Faq from "@/app/informasi/faq/page";
import Pesan from "@/app/sections/pesan";

export default function TestiPage() {
  const { lang } = useLang();

  return (
    <>
      {/* Spacer agar tidak ketiban header */}
      <div className="h-[100px] bg-white" />

      {/* === Breadcrumbs === */}
      <section className="w-full py-3 bg-white">
        <div className="container mx-auto px-4">
          <nav className="flex items-center text-sm font-medium space-x-2">
            <Link href="/" className="text-[#FE4D01] hover:underline">
              {lang === "id" ? "Beranda" : "Home"}
            </Link>
            <span className="text-[#FE4D01]">{">"}</span>
            <Link
              href="/kehidupan-siswa/testimoni"
              className="text-[#FE4D01] hover:underline"
            >
              {lang === "id" ? "Kehidupan Siswa" : "Student Life"}
            </Link>
            <span className="text-[#243771]">{">"}</span>
            <span className="text-[#243771]">
              {lang === "id" ? "Testimoni" : "Testimonials"}
            </span>
          </nav>
        </div>
      </section>

      {/* === Section Testimoni (Re-use dari /sections/testimoni, tanpa dekorasi) === */}
      <Testimoni hideDecorations />

      {/* === Section Pesan === */}
      <Pesan />

      {/* === Section FAQ (Re-use dari /informasi/faq/page.tsx) === */}
      <Faq />

      {/* === Section Gedung === */}
      <main className="flex-1 w-full bg-white">
        <section className="relative w-full bg-white overflow-hidden">
          <img
            src="/avif/gedung.avif"
            alt={
              lang === "id"
                ? "Gedung SMK Prestasi Prima"
                : "Prestasi Prima Building"
            }
            className="w-full h-[40vh] sm:h-[55vh] lg:h-screen object-cover object-center hover:scale-[1.02] transition-transform duration-700"
          />
        </section>
      </main>
    </>
  );
}
