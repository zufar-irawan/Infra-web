"use client";

import { BarChart3, Users, Newspaper, Award, CalendarDays } from "lucide-react";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [stats, setStats] = useState([
    { title: "Staff", value: 8, icon: <Users size={22} />, color: "from-[#243771] to-[#3A4FA3]" },
    { title: "Berita", value: 12, icon: <Newspaper size={22} />, color: "from-[#FE4D01] to-[#FF7A3D]" },
    { title: "Prestasi", value: 6, icon: <Award size={22} />, color: "from-[#FECF01] to-[#FFD93B]" },
    { title: "Kegiatan", value: 9, icon: <CalendarDays size={22} />, color: "from-[#0C77FF] to-[#2A9DFF]" },
  ]);

  useEffect(() => {
    // Nanti bisa fetch dari API Laravel
  }, []);

  return (
    <div className="space-y-10 animate-fadeIn relative">
      {/* === Gradient Background === */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#f9fafb] via-white to-[#eef2ff]" />

      {/* === Header === */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-[#243771] tracking-tight">
            Dashboard Admin
          </h1>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">
            Selamat datang kembali,{" "}
            <span className="font-semibold text-[#FE4D01]">Admin!</span>
          </p>
        </div>
        <div className="text-sm text-gray-600 bg-white/70 backdrop-blur-md px-4 py-2 rounded-lg shadow-sm border border-gray-100">
          {new Date().toLocaleDateString("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </div>
      </header>

      {/* === Statistik Cards === */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <div
            key={i}
            className="relative group bg-white/70 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-[0_6px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.08)] transition-all duration-300 p-6 overflow-hidden"
          >
            {/* gradient blur bg */}
            <div
              className={`absolute top-0 right-0 w-[130px] h-[130px] rounded-full opacity-30 blur-3xl bg-gradient-to-br ${s.color}`}
            ></div>

            <div className="relative z-10 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                  {s.title}
                </h3>
                <p className="text-4xl font-bold text-[#111827] mt-2">{s.value}</p>
              </div>
              <div
                className={`p-3 rounded-xl bg-gradient-to-br ${s.color} text-white shadow-lg`}
              >
                {s.icon}
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* === Grafik (dummy) === */}
      <section className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-100 shadow-md p-6 transition hover:shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-[#243771]">
            Aktivitas Bulanan
          </h2>
          <BarChart3 className="text-[#FE4D01]" size={20} />
        </div>

        <div className="relative w-full h-52 sm:h-64 flex items-end gap-4 px-2 sm:px-6">
          {[
            { bulan: "Jan", nilai: 25 },
            { bulan: "Feb", nilai: 40 },
            { bulan: "Mar", nilai: 55 },
            { bulan: "Apr", nilai: 45 },
            { bulan: "Mei", nilai: 70 },
            { bulan: "Jun", nilai: 60 },
          ].map((b, i) => (
            <div key={i} className="flex-1 flex flex-col items-center">
              <div className="w-5 sm:w-8 bg-gradient-to-t from-[#FE4D01] to-[#FF8B3D] rounded-t-lg transition-all hover:scale-105" style={{ height: `${b.nilai}%` }}></div>
              <span className="text-xs sm:text-sm text-gray-600 mt-2">{b.bulan}</span>
            </div>
          ))}
        </div>
      </section>

      {/* === Aktivitas Log === */}
      <section className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-100 shadow-md p-6 transition hover:shadow-lg">
        <h2 className="text-xl font-semibold text-[#243771] mb-5">
          Aktivitas Terbaru
        </h2>

        <ul className="divide-y divide-gray-100 text-sm">
          {[
            { act: "Menambahkan berita baru “Upacara HUT RI 80”", time: "2 jam lalu" },
            { act: "Update data fasilitas “Lab Komputer 1”", time: "5 jam lalu" },
            { act: "Menambahkan testimoni siswa baru", time: "Kemarin" },
            { act: "Menambah kegiatan “Saintek Fair 2025”", time: "2 hari lalu" },
          ].map((a, i) => (
            <li
              key={i}
              className="py-3 flex justify-between items-center hover:bg-gray-50 rounded-lg px-2 transition"
            >
              <span className="text-gray-700">{a.act}</span>
              <span className="text-gray-400 text-xs sm:text-sm">{a.time}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
