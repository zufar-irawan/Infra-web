"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Pencil, Trash2, Plus } from "lucide-react";

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

    try {
      if (editId) {
        await axios.put(`/api/portal/kegiatan/${editId}`, form);
        Swal.fire("Berhasil", "Kegiatan diperbarui.", "success");
      } else {
        await axios.post("/api/portal/kegiatan", form);
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

  return (
    <div className="space-y-8 animate-fadeIn p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[#243771]">📅 Manajemen Kegiatan</h1>
        <button
          onClick={() => {
            setForm({});
            setEditId(null);
            setModalOpen(true);
          }}
          className="flex items-center gap-2 bg-[#FE4D01] text-white px-4 py-2 rounded-lg hover:bg-[#fe5d20] transition"
        >
          <Plus size={18} /> Tambah Kegiatan
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-md overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-[#243771] text-white text-left">
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">Judul (ID)</th>
              <th className="p-3">Tanggal</th>
              <th className="p-3">Waktu</th>
              <th className="p-3">Tempat</th>
              <th className="p-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-6">
                  Memuat data...
                </td>
              </tr>
            ) : kegiatan.length > 0 ? (
              kegiatan.map((e, i) => (
                <tr key={e.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="p-3">{i + 1}</td>
                  <td className="p-3 font-semibold">{e.title_id}</td>
                  <td className="p-3">{new Date(e.date).toLocaleDateString("id-ID")}</td>
                  <td className="p-3">{e.time}</td>
                  <td className="p-3">{e.place}</td>
                  <td className="p-3 flex justify-center gap-2">
                    <button
                      onClick={() => handleEdit(e)}
                      className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(e.id)}
                      className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
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

      {/* Modal Tambah/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-[95%] max-w-2xl shadow-xl relative">
            <h2 className="text-xl font-bold text-[#243771] mb-4">
              {editId ? "Edit Kegiatan" : "Tambah Kegiatan"}
            </h2>

            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Judul (Indonesia)"
                  className="border p-2 rounded"
                  value={form.title_id || ""}
                  onChange={(e) => setForm({ ...form, title_id: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Judul (English)"
                  className="border p-2 rounded"
                  value={form.title_en || ""}
                  onChange={(e) => setForm({ ...form, title_en: e.target.value })}
                />
              </div>

              <textarea
                placeholder="Deskripsi (Indonesia)"
                className="border p-2 w-full rounded"
                value={form.desc_id || ""}
                onChange={(e) => setForm({ ...form, desc_id: e.target.value })}
              />
              <textarea
                placeholder="Deskripsi (English)"
                className="border p-2 w-full rounded"
                value={form.desc_en || ""}
                onChange={(e) => setForm({ ...form, desc_en: e.target.value })}
              />

              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="date"
                  className="border p-2 rounded"
                  value={form.date || ""}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
                <input
                  type="time"
                  className="border p-2 rounded"
                  value={form.time || ""}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                />
              </div>

              <input
                type="text"
                placeholder="Tempat kegiatan"
                className="border p-2 w-full rounded"
                value={form.place || ""}
                onChange={(e) => setForm({ ...form, place: e.target.value })}
              />
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-100"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-[#FE4D01] text-white rounded-lg hover:bg-[#fe5d20]"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
