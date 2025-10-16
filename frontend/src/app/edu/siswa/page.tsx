"use client";

import { useEffect, useMemo, useState } from "react";
import DashHeader from "@/app/components/DashHeader";
import api from "../../lib/api";
import axios from "axios";

export default function SiswaPage() {
  const [user, setUser] = useState<any>(null);
  const [teacher, setTeacher] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const API_BASE =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

  // === Ambil data user login + data siswa ===
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) return;

        // === Ambil info user login
        const meRes = await api.get(`/lms/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const me = meRes.data;
        setUser(me);

        // === Kalau guru, ambil detail guru
        let teacherRes = null;
        if (me.role === "guru") {
          teacherRes = await api.get(`/lms/teachers/${me.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setTeacher(teacherRes.data);
        }

        // === Ambil data semua siswa (pakai pagination)
        const studentsRes = await api.get(`/lms/students`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const list = Array.isArray(studentsRes.data)
          ? studentsRes.data
          : studentsRes.data.data || [];

        setStudents(list);
        setFilteredStudents(list);
      } catch (error) {
        console.error("Gagal mengambil data siswa:", error);
      }
    };

    fetchData();
  }, []);

  // === Ambil classId untuk guru ===
  const classId = useMemo(() => {
    if (user?.role === "admin") return "all";
    return teacher?.class_id ?? teacher?.class?.id ?? null;
  }, [user, teacher]);

  // === Filter data siswa ===
  useEffect(() => {
    if (!students || students.length === 0) return;

    let data = students;

    // === Guru hanya lihat siswa di kelasnya ===
    if (user?.role === "guru" && classId !== "all") {
      data = data.filter(
        (s: any) => s.class_id === classId || s.class?.id === classId
      );
    }

    // === Filter pencarian ===
    if (search.trim()) {
      const query = search.toLowerCase();
      data = data.filter(
        (s: any) =>
          s.user?.name?.toLowerCase().includes(query) ||
          s.nis?.toString().includes(query) ||
          s.class?.name?.toLowerCase().includes(query)
      );
    }

    setFilteredStudents(data);
  }, [students, user, classId, search]);

  return (
    <div className="overflow-y-auto min-h-screen bg-gray-50">
      <DashHeader user={user} teacher={teacher} />

      <section className="p-6">
        {/* === Header Section === */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              {user?.role === "guru"
                ? "Daftar Siswa di Kelas Anda"
                : "Daftar Siswa Aktif"}
            </h1>
            <p className="text-gray-500 text-sm">
              {user?.role === "guru"
                ? "Pantau siswa yang berada di bawah pengajaran Anda"
                : "Lihat semua siswa terdaftar di LMS"}
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Cari nama atau NIS..."
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

        {/* === Table Section === */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-700 text-sm font-semibold uppercase">
                <tr>
                  <th className="px-6 py-3">No</th>
                  <th className="px-6 py-3">Nama</th>
                  <th className="px-6 py-3">NIS</th>
                  <th className="px-6 py-3">Kelas</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">RFID ID</th>
                  <th className="px-6 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents && filteredStudents.length > 0 ? (
                  filteredStudents.map((s, i) => (
                    <tr
                      key={i}
                      className="border-t hover:bg-orange-50 transition-all duration-200"
                    >
                      <td className="px-6 py-3 font-medium">{i + 1}</td>
                      <td className="px-6 py-3">{s.user?.name || "-"}</td>
                      <td className="px-6 py-3">{s.nis || "-"}</td>
                      <td className="px-6 py-3">{s.class?.name || "-"}</td>
                      <td className="px-6 py-3">{s.user?.email || "-"}</td>
                      <td className="px-6 py-3">{s.rfid?.id || "-"}</td>
                      <td className="px-6 py-3 text-right">
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            s.status === "aktif"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {s.status === "aktif" ? "Aktif" : "Nonaktif"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center py-8 text-gray-500 font-medium"
                    >
                      {search
                        ? "Tidak ada siswa dengan kata kunci tersebut."
                        : "Belum ada data siswa yang tersedia."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
