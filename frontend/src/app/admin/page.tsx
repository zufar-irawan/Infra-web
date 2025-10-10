"use client";

import { BarChart3, Users, Newspaper, Award, CalendarDays } from "lucide-react";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [stats, setStats] = useState([
    { title: "Staff", value: 8, icon: <Users size={22} />, color: "bg-[#243771]" },
    { title: "Berita", value: 12, icon: <Newspaper size={22} />, color: "bg-[#FE4D01]" },
    { title: "Prestasi", value: 6, icon: <Award size={22} />, color: "bg-[#FECF01]" },
    { title: "Kegiatan", value: 9, icon: <CalendarDays size={22} />, color: "bg-[#0C77FF]" },
  ]);

  // nanti bisa fetch dari API Laravel
  useEffect(() => {
    // contoh simulasi update data (misal dari API)
  }, []);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* === Header === */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#243771]">📊 Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Selamat datang kembali, <span className="font-semibold">Admin!</span>
          </p>
        </div>
        <div className="text-sm text-gray-500">
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
            className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-5 flex items-center justify-between"
          >
            <div>
              <h3 className="text-sm font-medium text-gray-500">{s.title}</h3>
              <p className="text-3xl font-bold text-gray-800 mt-1">{s.value}</p>
            </div>
            <div className={`${s.color} text-white p-3 rounded-xl shadow-md`}>
              {s.icon}
            </div>
          </div>
        ))}
      </section>

      {/* === Grafik (dummy) === */}
      <section className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-lg font-semibold text-[#243771] mb-4">
          Aktivitas Bulanan
        </h2>

        {/* Grafik dummy, nanti bisa ganti pakai Chart.js / Recharts */}
        <div className="w-full h-48 sm:h-64 flex items-end gap-2 sm:gap-4">
          {[
            { bulan: "Jan", nilai: 20 },
            { bulan: "Feb", nilai: 35 },
            { bulan: "Mar", nilai: 50 },
            { bulan: "Apr", nilai: 40 },
            { bulan: "Mei", nilai: 70 },
            { bulan: "Jun", nilai: 55 },
          ].map((b, i) => (
            <div key={i} className="flex-1 flex flex-col items-center">
              <div
                className="w-full rounded-t-md bg-[#FE4D01] transition-all"
                style={{ height: `${b.nilai}%` }}
              ></div>
              <span className="text-xs sm:text-sm text-gray-600 mt-2">{b.bulan}</span>
            </div>
          ))}
        </div>
      </section>

      {/* === Aktivitas Log (dummy) === */}
      <section className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-lg font-semibold text-[#243771] mb-4">
          Aktivitas Terbaru
        </h2>
        <ul className="divide-y divide-gray-100 text-sm">
          <li className="py-3 flex justify-between">
            <span>Menambahkan berita baru “Upacara HUT RI 80”</span>
            <span className="text-gray-500">2 jam lalu</span>
          </li>
          <li className="py-3 flex justify-between">
            <span>Update data fasilitas “Lab Komputer 1”</span>
            <span className="text-gray-500">5 jam lalu</span>
          </li>
          <li className="py-3 flex justify-between">
            <span>Menambahkan testimoni siswa baru</span>
            <span className="text-gray-500">Kemarin</span>
          </li>
        </ul>
      </section>
    </div>
  );
}
