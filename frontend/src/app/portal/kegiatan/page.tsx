"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Pencil, Trash2, Plus, X } from "lucide-react";

interface Kegiatan {
  id: number;
  title_id: string;
  title_en: string;
  desc_id: string;
  desc_en: string;
  date: string;
  time: string;
  place: string;
}

export default function AdminKegiatanPage() {
  const [kegiatan, setKegiatan] = useState<Kegiatan[]>([]);
  const [form, setForm] = useState<Partial<Kegiatan>>({});
  const [editId, setEditId] = useState<number | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const modalRef = useRef<HTMLDivElement>(null);

  // === Ambil data dari API Proxy Next.js ===
  const fetchData = async () => {
    try {
      const res = await axios.get("/api/portal/kegiatan");
      if (res.data.success) setKegiatan(res.data.data);
    } catch (err) {
      console.error("❌ Gagal mengambil data kegiatan:", err);
      Swal.fire("Gagal", "Tidak bisa memuat data kegiatan", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // === Simpan atau update kegiatan ===
  const handleSave = async () => {
    if (
      !form.title_id ||
      !form.title_en ||
      !form.desc_id ||
      !form.desc_en ||
      !form.date ||
      !form.time ||
      !form.place
    ) {
      Swal.fire("Lengkapi Data", "Semua field wajib diisi!", "warning");
      return;
    }

    // 🔧 PERBAIKAN: potong detik agar sesuai format H:i
    const sanitizedForm = {
      ...form,
      time: form.time.slice(0, 5),
    };

    try {
      if (editId) {
        await axios.put(`/api/portal/kegiatan/${editId}`, sanitizedForm);
        Swal.fire("Berhasil", "Kegiatan diperbarui.", "success");
      } else {
        await axios.post("/api/portal/kegiatan", sanitizedForm);
        Swal.fire("Berhasil", "Kegiatan ditambahkan.", "success");
      }

      setModalOpen(false);
      setForm({});
      setEditId(null);
      fetchData();
    } catch (err: any) {
      console.error("❌ Gagal menyimpan kegiatan:", err);
      Swal.fire("Gagal", err.response?.data?.message || "Terjadi kesalahan.", "error");
    }
  };

  // === Hapus kegiatan ===
  const handleDelete = async (id: number) => {
    const confirm = await Swal.fire({
      title: "Hapus Kegiatan?",
      text: "Data yang dihapus tidak dapat dikembalikan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#FE4D01",
      cancelButtonColor: "#243771",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axios.delete(`/api/portal/kegiatan/${id}`);
      Swal.fire("Terhapus!", "Kegiatan berhasil dihapus.", "success");
      fetchData();
    } catch {
      Swal.fire("Gagal", "Tidak dapat menghapus kegiatan.", "error");
    }
  };

  const handleEdit = (item: Kegiatan) => {
    setForm(item);
    setEditId(item.id);
    setModalOpen(true);
  };

  // === Tutup modal saat klik luar / ESC ===
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) setModalOpen(false);
    };
    const handleEsc = (e: KeyboardEvent) => e.key === "Escape" && setModalOpen(false);
    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEsc);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isModalOpen]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#f5f7ff] via-[#fffdfb] to-[#fff5f0] px-4 py-10 md:px-10">
      <div className="max-w-6xl mx-auto bg-white rounded-md shadow-md border border-gray-100 p-5 sm:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#243771]">
              📅 Manajemen Kegiatan
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Kelola seluruh agenda dan kegiatan sekolah
            </p>
          </div>

          <button
            onClick={() => {
              setForm({});
              setEditId(null);
              setModalOpen(true);
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-[#FE4D01] to-[#ff7433] text-white px-4 py-2 rounded-md font-medium shadow-sm hover:shadow-md transition w-full sm:w-auto justify-center"
          >
            <Plus size={18} /> Tambah Kegiatan
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border border-gray-200 rounded-md">
          <table className="min-w-full text-sm">
            <thead className="bg-gradient-to-r from-[#243771] to-[#3b5bb1] text-white">
              <tr>
                <th className="p-3 text-center w-[40px]">#</th>
                <th className="p-3">Judul (ID)</th>
                <th className="p-3 text-center">Tanggal</th>
                <th className="p-3 text-center">Waktu</th>
                <th className="p-3 text-center">Tempat</th>
                <th className="p-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-gray-500">
                    Memuat data...
                  </td>
                </tr>
              ) : kegiatan.length > 0 ? (
                kegiatan.map((e, i) => (
                  <tr key={e.id} className="border-b hover:bg-[#f9fafc] transition">
                    <td className="p-3 text-center font-medium text-[#243771]">{i + 1}</td>
                    <td className="p-3 text-gray-700 font-medium">{e.title_id}</td>
                    <td className="p-3 text-center text-gray-600">
                      {new Date(e.date).toLocaleDateString("id-ID")}
                    </td>
                    <td className="p-3 text-center text-gray-600">{e.time}</td>
                    <td className="p-3 text-center text-gray-600">{e.place}</td>
                    <td className="p-3 flex justify-center gap-2 flex-wrap">
                      <button
                        onClick={() => handleEdit(e)}
                        className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-sm transition w-[42px]"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(e.id)}
                        className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-sm transition w-[42px]"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-gray-500 italic">
                    Belum ada kegiatan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div
            ref={modalRef}
            className="bg-white rounded-md w-full max-w-2xl shadow-2xl border border-gray-200 animate-fadeIn"
          >
            {/* Header modal */}
            <div className="flex justify-between items-center px-5 py-4 border-b border-gray-200 bg-gradient-to-r from-[#243771]/90 to-[#FE4D01]/80 text-white">
              <h2 className="font-semibold text-lg">
                {editId ? "Edit Kegiatan" : "Tambah Kegiatan"}
              </h2>
              <button onClick={() => setModalOpen(false)}>
                <X size={20} className="opacity-80 hover:opacity-100" />
              </button>
            </div>

            {/* Body modal */}
            <div className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Judul (Indonesia)"
                  className="border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-[#FE4D01] focus:outline-none transition"
                  value={form.title_id || ""}
                  onChange={(e) => setForm({ ...form, title_id: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Judul (English)"
                  className="border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-[#FE4D01] focus:outline-none transition"
                  value={form.title_en || ""}
                  onChange={(e) => setForm({ ...form, title_en: e.target.value })}
                />
              </div>

              <textarea
                placeholder="Deskripsi (Indonesia)"
                className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-[#243771] focus:outline-none transition"
                rows={3}
                value={form.desc_id || ""}
                onChange={(e) => setForm({ ...form, desc_id: e.target.value })}
              />
              <textarea
                placeholder="Deskripsi (English)"
                className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-[#243771] focus:outline-none transition"
                rows={3}
                value={form.desc_en || ""}
                onChange={(e) => setForm({ ...form, desc_en: e.target.value })}
              />

              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="date"
                  className="border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-[#FE4D01] focus:outline-none transition"
                  value={form.date || ""}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
                <input
                  type="time"
                  className="border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-[#FE4D01] focus:outline-none transition"
                  value={form.time || ""}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                />
              </div>

              <input
                type="text"
                placeholder="Tempat kegiatan"
                className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-[#243771] focus:outline-none transition"
                value={form.place || ""}
                onChange={(e) => setForm({ ...form, place: e.target.value })}
              />
            </div>

            {/* Footer modal */}
            <div className="flex flex-col sm:flex-row sm:justify-end gap-3 px-5 py-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-sm text-gray-600 hover:bg-gray-100 transition"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-gradient-to-r from-[#FE4D01] to-[#ff7433] text-white rounded-sm hover:scale-[1.03] transition"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
