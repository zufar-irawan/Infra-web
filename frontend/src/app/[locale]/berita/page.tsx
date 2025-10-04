"use client";

import Link from "next/link";
import { useLang } from "../components/LangContext";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Berita() {
    const { lang } = useLang();

    return (
      <div>
        <Header/>

        <main className="py-25">
            {/* Breadcrumbs */}
            <section className="w-full py-4 bg-white">
              <div className="container mx-auto px-4">
                <nav className="flex items-center text-sm font-medium space-x-2">
                  <Link href="/frontend/public" className="text-[#FE4D01] hover:underline">
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
                    {lang === "id" ? "Berita" : "News"}
                  </span>
                </nav>
              </div>
            </section>
            <section className="w-full h-100">
                <div className="flex">

                </div>
            </section>
        </main>

        <Footer/>
      </div>
    )
}