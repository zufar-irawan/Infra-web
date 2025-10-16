"use client";

import Link from "next/link";
import { useLang } from "../../components/LangContext";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

interface Staff {
  id: number;
  img_id: string;
  img_en: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export default function Manajemen() {
  const { lang } = useLang();
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [showStaff, setShowStaff] = useState(false);
  const staffRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/management/public`)
      .then((res) => {
        if (res.data.success) setStaffList(res.data.data);
      })
      .catch((err) => console.error("Gagal memuat data staff:", err));
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target === staffRef.current) {
            setShowStaff(true);
          }
        });
      },
      { threshold: 0.2 }
    );
    if (staffRef.current) observer.observe(staffRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div className="h-[100px] bg-white" />
      <section className="w-full py-4 bg-white">
        <div className="container mx-auto px-4">
          <nav className="flex items-center text-sm font-medium space-x-2">
            <Link href="/" className="text-[#FE4D01] hover:underline">
              {lang === "id" ? "Beranda" : "Home"}
            </Link>
            <span className="text-[#FE4D01]">{">"}</span>
            <Link href="/tentang/manajemen" className="text-[#FE4D01] hover:underline">
              {lang === "id" ? "Tentang Kami" : "About Us"}
            </Link>
            <span className="text-[#243771]">{">"}</span>
            <span className="text-[#243771]">
              {lang === "id" ? "Manajemen Staf" : "Management Staff"}
            </span>
          </nav>
        </div>
      </section>

      <main className="flex-1 w-full bg-white">
        <section
          ref={staffRef}
          className={`relative w-full bg-white py-14 transition-all duration-1000 ease-out ${
            showStaff ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#243771] text-center mb-12">
              {lang === "id" ? "Manajemen Staf" : "Management Staff"}
            </h2>

            <div className="flex flex-wrap justify-center gap-8">
              {staffList.map((staff) => (
                <img
                  key={staff.id}
                  src={lang === "id" ? staff.img_id : staff.img_en}
                  alt={`Staff ${staff.id}`}
                  className="w-[150px] sm:w-[180px] md:w-[200px] lg:w-[220px] object-contain rounded-lg shadow hover:scale-[1.05] transition-transform duration-500"
                />
              ))}
            </div>
          </div>
        </section>

        <section className="relative w-full bg-white overflow-hidden">
          <img
            src="/svg/gedung.svg"
            alt={lang === "id" ? "Gedung SMK Prestasi Prima" : "Prestasi Prima Building"}
            className="w-full h-[40vh] sm:h-[50vh] lg:h-screen object-cover object-center hover:scale-[1.02] transition-transform duration-700"
          />
        </section>
      </main>
    </>
  );
}
