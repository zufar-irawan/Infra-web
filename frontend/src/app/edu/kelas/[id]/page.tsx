"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Users, BookOpen, GraduationCap } from "lucide-react";
import DashHeader from "@/app/components/DashHeader";

export default function DetailKelasPage() {
  const { id } = useParams();
  const router = useRouter();

  const [kelas, setKelas] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // === Simulasi data dummy ===
  const dummyClasses = [
    {
      id: 1,
      name: "X-PPLG-1",
      description: "Kelas X PPLG 1 - Pemrograman dan Rekayasa Perangkat Lunak",
      status: "aktif",
      students: [
        { id: 1, name: "Zufar Rafid Irawan", nis: "20250001" },
        { id: 2, name: "Ardi Gantenk", nis: "1023" },
      ],
      teachers: [
        { id: 1, name: "Bu Dinda", subject: "Pemrograman Dasar" },
        { id: 2, name: "Pak Andi", subject: "Basis Data" },
      ],
    },
    {
      id: 2,
      name: "XI-TJKT-2",
      description: "Kelas XI Teknik Jaringan Komputer dan Telekomunikasi",
      status: "nonaktif",
      students: [{ id: 1, name: "Fahmi", nis: "20251234" }],
      teachers: [{ id: 1, name: "Pak Hendra", subject: "Jaringan LAN/WAN" }],
    },
  ];

  // === Ambil data sesuai id ===
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = dummyClasses.find((c) => c.id === Number(id));
      setKelas(data);
      setLoading(false);
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-600">
        <BookOpen className="w-6 h-6 mr-2 animate-spin" />
        Memuat detail kelas...
      </div>
    );
  }

  if (!kelas) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-600">
        <p className="text-lg font-medium">Kelas tidak ditemukan 😢</p>
        <button
          onClick={() => router.push("/edu/kelas")}
          className="mt-4 px-4 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600"
        >
          Kembali ke daftar kelas
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashHeader />

      <div className="p-6 max-w-5xl mx-auto">
        {/* === Tombol Back === */}
        <button
          onClick={() => router.push("/edu/kelas")}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-orange-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali
        </button>

        {/* === Header Detail === */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <GraduationCap className="w-7 h-7 text-orange-500" />
              {kelas.name}
            </h1>
            <span
              className={`px-3 py-1 text-xs font-semibold rounded-full ${
                kelas.status === "aktif"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {kelas.status === "aktif" ? "Aktif" : "Nonaktif"}
            </span>
          </div>
          <p className="text-gray-600 text-sm mt-2">{kelas.description}</p>
        </div>

        {/* === Guru === */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-purple-500" /> Guru Pengajar
          </h2>
          <table className="w-full text-sm border-t border-gray-100">
            <thead className="bg-gray-50 text-gray-700 font-medium">
              <tr>
                <th className="px-4 py-2 text-left">No</th>
                <th className="px-4 py-2 text-left">Nama Guru</th>
                <th className="px-4 py-2 text-left">Mata Pelajaran</th>
              </tr>
            </thead>
            <tbody>
              {kelas.teachers.map((t: any, i: number) => (
                <tr
                  key={i}
                  className="border-t border-gray-100 hover:bg-orange-50 transition"
                >
                  <td className="px-4 py-2">{i + 1}</td>
                  <td className="px-4 py-2">{t.name}</td>
                  <td className="px-4 py-2">{t.subject}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* === Siswa === */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-blue-500" /> Daftar Siswa
          </h2>
          <table className="w-full text-sm border-t border-gray-100">
            <thead className="bg-gray-50 text-gray-700 font-medium">
              <tr>
                <th className="px-4 py-2 text-left">No</th>
                <th className="px-4 py-2 text-left">Nama</th>
                <th className="px-4 py-2 text-left">NIS</th>
              </tr>
            </thead>
            <tbody>
              {kelas.students.map((s: any, i: number) => (
                <tr
                  key={i}
                  className="border-t border-gray-100 hover:bg-orange-50 transition"
                >
                  <td className="px-4 py-2">{i + 1}</td>
                  <td className="px-4 py-2">{s.name}</td>
                  <td className="px-4 py-2">{s.nis}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
