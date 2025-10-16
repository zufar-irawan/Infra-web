"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashHeader from "@/app/components/DashHeader";
import {
  Users,
  BookOpen,
  GraduationCap,
  Info,
  Settings,
  Search,
  ChevronRight,
} from "lucide-react";

export default function KelasPage() {
  const [search, setSearch] = useState("");
  const [filteredClasses, setFilteredClasses] = useState<any[]>([]);
  const router = useRouter();

  // === Data dummy sementara ===
  const dummyClasses = [
    {
      id: 1,
      name: "X-PPLG-1",
      description: "Kelas X PPLG 1 - Pemrograman dan Rekayasa Perangkat Lunak",
      status: "aktif",
      students: [
        { id: 1, name: "Zufar Rafid Irawan" },
        { id: 2, name: "Ardi Gantenk" },
      ],
      teachers: [
        { id: 1, name: "Bu Dinda" },
        { id: 2, name: "Pak Andi" },
      ],
    },
    {
      id: 2,
      name: "XI-TJKT-2",
      description: "Kelas XI Teknik Jaringan Komputer dan Telekomunikasi",
      status: "nonaktif",
      students: [{ id: 1, name: "Fahmi" }],
      teachers: [{ id: 1, name: "Pak Hendra" }],
    },
  ];

  useEffect(() => {
    let data = dummyClasses;

    if (search.trim()) {
      const query = search.toLowerCase();
      data = data.filter((c) => c.name.toLowerCase().includes(query));
    }

    setFilteredClasses(data);
  }, [search]);

  return (
    <div className="overflow-y-auto min-h-screen bg-gray-50">
      <DashHeader />

      <section className="p-6">
        {/* === Header === */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <BookOpen className="w-7 h-7 text-orange-500" />
              Daftar Kelas
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Kelola dan pantau seluruh kelas aktif maupun nonaktif dalam sistem
              LMS.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Cari nama kelas..."
              className="w-full px-4 py-2.5 pl-10 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:outline-none shadow-sm bg-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* === Daftar Kelas === */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredClasses.length > 0 ? (
            filteredClasses.map((kelas, i) => (
              <div
                key={i}
                className="group bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-orange-200 transition-all duration-200"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="text-orange-500 w-6 h-6" />
                    <h2 className="text-lg font-semibold text-gray-800">
                      {kelas.name}
                    </h2>
                  </div>
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

                {/* Deskripsi */}
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {kelas.description}
                </p>

                {/* Statistik */}
                <div className="flex items-center justify-between text-sm text-gray-700 mb-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-500" />
                    <span>{kelas.students.length} siswa</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-purple-500" />
                    <span>{kelas.teachers.length} guru</span>
                  </div>
                </div>

                {/* Tombol Aksi */}
                <div className="flex justify-between gap-3">
                  <button
                    onClick={() => router.push(`/edu/kelas/${kelas.id}`)}
                    className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm font-medium rounded-xl bg-orange-500 text-white hover:bg-orange-600 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                    Lihat Detail
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center col-span-full text-gray-500 py-10 font-medium">
              {search
                ? "Tidak ada kelas dengan nama tersebut."
                : "Belum ada data kelas yang tersedia."}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
