"use client";

import { useState } from "react";
import Swal from "sweetalert2";
import { Pencil, Trash2, Plus } from "lucide-react";

interface Event {
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
  const [events, setEvents] = useState<Event[]>([
    {
      id: 1,
      title_id: "EXPONER 2025",
      title_en: "EXPONER 2025",
      desc_id:
        "Pameran karya inovatif dan kreatifitas siswa SMK Prestasi Prima dalam berbagai bidang.",
      desc_en:
        "An exhibition of innovation and creativity by Prestasi Prima students in various fields.",
      date: "2025-10-02",
      time: "23:00",
      place: "Lapangan SMK Prestasi Prima",
    },
    {
      id: 2,
      title_id: "Saintek Fair 2025",
      title_en: "Saintek Fair 2025",
      desc_id:
        "Ajang tahunan untuk memperkenalkan teknologi dan sains kepada siswa.",
      desc_en:
        "An annual event to introduce science and technology to students.",
      date: "2025-10-03",
      time: "23:00",
      place: "Lapangan SMK Prestasi Prima",
    },
  ]);

  const [form, setForm] = useState<Partial<Event>>({});
  const [editId, setEditId] = useState<number | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);

  // === Simpan Kegiatan (Dummy CRUD) ===
  const handleSave = () => {
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

    if (editId) {
      setEvents((prev) =>
        prev.map((e) => (e.id === editId ? { ...e, ...form } as Event : e))
      );
      Swal.fire("Berhasil", "Kegiatan berhasil diperbarui.", "success");
    } else {
      const newItem: Event = {
        id: Date.now(),
        title_id: form.title_id!,
        title_en: form.title_en!,
        desc_id: form.desc_id!,
        desc_en: form.desc_en!,
        date: form.date!,
        time: form.time!,
        place: form.place!,
      };
      setEvents((prev) => [...prev, newItem]);
      Swal.fire("Berhasil", "Kegiatan berhasil ditambahkan.", "success");
    }

    setForm({});
    setEditId(null);
    setModalOpen(false);
  };

  // === Hapus Kegiatan ===
  const handleDelete = (id: number) => {
    Swal.fire({
      title: "Hapus Kegiatan?",
      text: "Data yang dihapus tidak dapat dikembalikan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#FE4D01",
      cancelButtonColor: "#243771",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        setEvents((prev) => prev.filter((e) => e.id !== id));
        Swal.fire("Terhapus!", "Kegiatan berhasil dihapus.", "success");
      }
    });
  };

  // === Edit Kegiatan ===
  const handleEdit = (e: Event) => {
    setForm(e);
    setEditId(e.id);
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
            {events.length > 0 ? (
              events.map((e, i) => (
                <tr
                  key={e.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition"
                >
                  <td className="p-3">{i + 1}</td>
                  <td className="p-3 font-semibold">{e.title_id}</td>
                  <td className="p-3">
                    {new Date(e.date).toLocaleDateString("id-ID")}
                  </td>
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
                <td
                  colSpan={6}
                  className="text-center py-6 text-gray-500 italic"
                >
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
