"use client";

import { useEffect, useMemo, useState } from "react";
import DashHeader from "@/app/components/DashHeader";
import { useEduData } from "@/app/edu/context";
import api from "../../lib/api";
import Swal from "sweetalert2";
import { Loader2, Trash2 } from "lucide-react";

type RfidRecord = {
  id: number;
  code: string;
  status: string;
  created_at?: string;
};

const getToken = () => {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem("token");
};

export default function RfidPage() {
  const { user, student } = useEduData();
  const [rfids, setRfids] = useState<RfidRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const isStaff = user?.role === "admin" || user?.role === "guru";

  useEffect(() => {
    if (!isStaff) {
      setLoading(false);
      return;
    }

    const fetchRfids = async () => {
      const token = getToken();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get("/lms/rfid", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const list = Array.isArray(res.data?.data) ? res.data?.data : [];
        setRfids(list);
      } catch (error: any) {
        console.error("Gagal mengambil data RFID", error);
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: error?.response?.data?.message ?? "Tidak dapat memuat data RFID.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRfids();
  }, [isStaff]);

  const filtered = useMemo(() => {
    if (!search.trim()) return rfids;
    const query = search.toLowerCase();
    return rfids.filter((item) =>
      (item.code ?? "").toLowerCase().includes(query) ||
      (item.status ?? "").toLowerCase().includes(query)
    );
  }, [rfids, search]);

  const handleDelete = async (id: number) => {
    const token = getToken();
    if (!token) {
      Swal.fire({ icon: "warning", title: "Token tidak ditemukan" });
      return;
    }

    const confirmation = await Swal.fire({
      icon: "warning",
      title: "Hapus kartu RFID?",
      text: "Data yang dihapus tidak dapat dikembalikan.",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
    });

    if (!confirmation.isConfirmed) return;

    setDeletingId(id);
    try {
      await api.delete(`/lms/rfid/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRfids((prev) => prev.filter((item) => item.id !== id));
      Swal.fire({ icon: "success", title: "Berhasil", text: "RFID berhasil dihapus." });
    } catch (error: any) {
      console.error("Gagal menghapus RFID", error);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: error?.response?.data?.message ?? "Tidak dapat menghapus data RFID.",
      });
    } finally {
      setDeletingId(null);
    }
  };

  if (!isStaff) {
    return (
      <div className="overflow-y-auto min-h-screen bg-gray-50">
        <DashHeader user={user} student={student} />
        <div className="p-6">
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-700">
            Halaman ini hanya tersedia untuk admin atau guru.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto min-h-screen bg-gray-50">
      <DashHeader user={user} student={student} />

      <section className="p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">Manajemen RFID</h1>
            <p className="text-sm text-gray-500">Pantau dan kelola kartu RFID yang terdaftar.</p>
          </div>
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="Cari kode atau status RFID..."
              className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="pointer-events-none absolute right-3 top-2.5 h-5 w-5 text-gray-400"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 3a7.5 7.5 0 006.15 13.65z" />
            </svg>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-md">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-orange-400 text-sm font-semibold uppercase tracking-wide text-white">
                <tr>
                  <th className="px-6 py-3 text-left">No</th>
                  <th className="px-6 py-3 text-left">Kode RFID</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Terdaftar</th>
                  <th className="px-6 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                      <div className="inline-flex items-center gap-2 rounded-xl border border-orange-100 bg-orange-50 px-4 py-2 text-sm text-orange-600">
                        <Loader2 className="h-4 w-4 animate-spin" /> Memuat data RFID...
                      </div>
                    </td>
                  </tr>
                ) : filtered.length > 0 ? (
                  filtered.map((item, index) => (
                    <tr key={item.id} className="border-t hover:bg-orange-50/50 transition">
                      <td className="px-6 py-3 font-medium text-gray-700">{index + 1}</td>
                      <td className="px-6 py-3 font-mono text-sm text-gray-800">{item.code}</td>
                      <td className="px-6 py-3">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            item.status === "active"
                              ? "bg-emerald-100 text-emerald-700"
                              : item.status === "inactive"
                              ? "bg-rose-100 text-rose-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {item.status ?? "-"}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-500">
                        {item.created_at ? new Date(item.created_at).toLocaleString("id-ID") : "-"}
                      </td>
                      <td className="px-6 py-3 text-right">
                        <button
                          onClick={() => handleDelete(item.id)}
                          disabled={deletingId === item.id}
                          className="inline-flex items-center gap-1 rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 disabled:opacity-60"
                        >
                          {deletingId === item.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="h-3.5 w-3.5" />
                          )}
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-sm font-medium text-gray-500">
                      {search ? "Tidak ada RFID yang cocok dengan pencarian." : "Belum ada data RFID yang tersedia."}
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
