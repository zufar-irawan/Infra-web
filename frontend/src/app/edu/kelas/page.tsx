"use client";

import { useEffect, useState } from "react";
import DashHeader from "@/app/components/DashHeader";

export default function KelasPage() {
  const [search, setSearch] = useState("");
  const [filteredClasses, setFilteredClasses] = useState<any[]>([]);

  // === Data dummy sementara ===
  const dummyClasses = [
    {
      id: 1,
      name: "X-PPLG-1",
      description: "Kelas X PPLG 1",
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
      description: "Kelas XI Teknik Jaringan Komputer",
      status: "nonaktif",
      students: [{ id: 1, name: "Fahmi" }],
      teachers: [{ id: 1, name: "Pak Hendra" }],
    },
  ];

  // === Inisialisasi & filter pencarian ===
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
            <h1 className="text-2xl font-semibold text-gray-800">
              Daftar Kelas
            </h1>
            <p className="text-gray-500 text-sm">
              Lihat seluruh kelas aktif dan nonaktif di sistem LMS
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Cari nama kelas..."
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 text-gray-400 absolute right-3 top-2.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 3a7.5 7.5 0 006.15 13.65z"
              />
            </svg>
          </div>
        </div>

        {/* === Daftar Kelas === */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredClasses.length > 0 ? (
            filteredClasses.map((kelas, i) => (
              <div
                key={i}
                className="bg-white p-5 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-semibold text-gray-800">
                    {kelas.name}
                  </h2>
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

                <p className="text-gray-600 text-sm mb-4">
                  {kelas.description}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-700">
                  <p>
                    👨‍🎓 <strong>{kelas.students.length}</strong> siswa
                  </p>
                  <p>
                    👩‍🏫 <strong>{kelas.teachers.length}</strong> guru
                  </p>
                </div>

                {/* === List Guru & Siswa (optional tampil) === */}
                <details className="mt-3 text-sm">
                  <summary className="cursor-pointer text-orange-600 font-medium">
                    Lihat Detail
                  </summary>
                  <div className="mt-2 pl-3 text-gray-700 space-y-1">
                    <p className="font-medium">Guru:</p>
                    <ul className="list-disc list-inside text-gray-600 mb-2">
                      {kelas.teachers.map((t) => (
                        <li key={t.id}>{t.name}</li>
                      ))}
                    </ul>

                    <p className="font-medium">Siswa:</p>
                    <ul className="list-disc list-inside text-gray-600">
                      {kelas.students.map((s) => (
                        <li key={s.id}>{s.name}</li>
                      ))}
                    </ul>
                  </div>
                </details>
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
