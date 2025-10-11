"use client";

import { useState } from "react";
import Image from "next/image";
import Swal from "sweetalert2";
import { Pencil, Trash2, Plus } from "lucide-react";

interface News {
  id: number;
  title_id: string;
  title_en: string;
  desc_id: string;
  desc_en: string;
  image: string | File | null;
  date: string;
}

export default function AdminNewsPage() {
  // === Data Dummy ===
  const [news, setNews] = useState<News[]>([
    {
      id: 1,
      title_id: "Upacara HUT RI ke-80 di SMK Prestasi Prima",
      title_en: "Independence Day Ceremony at Prestasi Prima",
      desc_id:
        "SMK Prestasi Prima mengadakan upacara peringatan Hari Kemerdekaan dengan khidmat dan semangat nasionalisme tinggi.",
      desc_en:
        "Prestasi Prima Vocational School held an Independence Day ceremony with pride and great enthusiasm.",
      image: "/berita/1.jpg",
      date: "2025-08-17",
    },
    {
      id: 2,
      title_id: "Bandtols Wakili Sekolah di Ajang Skool Fest",
      title_en: "Bandtols Represents School in Skool Fest",
      desc_id:
        "Bandtols sukses memukau penonton dalam ajang musik antar sekolah se-Jabodetabek.",
      desc_en:
        "Bandtols successfully impressed the audience in the interschool music festival in Jakarta area.",
      image: "/berita/2.jpg",
      date: "2025-09-22",
    },
  ]);

  const [form, setForm] = useState<Partial<News>>({});
  const [editId, setEditId] = useState<number | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);

  // === Upload Gambar ===
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".webp") && !file.name.endsWith(".jpg") && !file.name.endsWith(".png")) {
      Swal.fire("Format Salah", "Gunakan gambar .webp, .jpg, atau .png", "warning");
      return;
    }

    setForm({ ...form, image: file });
  };

  // === Simpan Berita (Dummy) ===
  const handleSave = () => {
    if (!form.title_id || !form.title_en || !form.desc_id || !form.desc_en || !form.date) {
      Swal.fire("Lengkapi Data", "Semua field wajib diisi!", "warning");
      return;
    }

    if (editId) {
      setNews((prev) =>
        prev.map((n) =>
          n.id === editId ? { ...n, ...form, id: editId } as News : n
        )
      );
      Swal.fire("Berhasil", "Berita berhasil diperbarui.", "success");
    } else {
      const newItem: News = {
        id: Date.now(),
        title_id: form.title_id!,
        title_en: form.title_en!,
        desc_id: form.desc_id!,
        desc_en: form.desc_en!,
        image: form.image || "/placeholder-news.jpg",
        date: form.date!,
      };
      setNews((prev) => [...prev, newItem]);
      Swal.fire("Berhasil", "Berita berhasil ditambahkan.", "success");
    }

    setForm({});
    setEditId(null);
    setModalOpen(false);
  };

  // === Hapus Berita ===
  const handleDelete = (id: number) => {
    Swal.fire({
      title: "Hapus Berita?",
      text: "Data yang dihapus tidak dapat dikembalikan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#FE4D01",
      cancelButtonColor: "#243771",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        setNews((prev) => prev.filter((n) => n.id !== id));
        Swal.fire("Terhapus!", "Berita berhasil dihapus.", "success");
      }
    });
  };

  // === Edit Berita ===
  const handleEdit = (n: News) => {
    setForm(n);
    setEditId(n.id);
    setModalOpen(true);
  };

  return (
    <div className="space-y-8 animate-fadeIn p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[#243771]">📰 Manajemen Berita</h1>
        <button
          onClick={() => {
            setForm({});
            setEditId(null);
            setModalOpen(true);
          }}
          className="flex items-center gap-2 bg-[#FE4D01] text-white px-4 py-2 rounded-lg hover:bg-[#fe5d20] transition"
        >
          <Plus size={18} /> Tambah Berita
        </button>
      </div>

      {/* Tabel */}
      <div className="bg-white rounded-2xl shadow-md overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-[#243771] text-white text-left">
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">Judul (ID)</th>
              <th className="p-3">Tanggal</th>
              <th className="p-3">Gambar</th>
              <th className="p-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {news.length > 0 ? (
              news.map((n, i) => (
                <tr
                  key={n.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition"
                >
                  <td className="p-3">{i + 1}</td>
                  <td className="p-3 font-semibold">{n.title_id}</td>
                  <td className="p-3">
                    {new Date(n.date).toLocaleDateString("id-ID")}
                  </td>
                  <td className="p-3">
                    {n.image ? (
                      <Image
                        src={
                          typeof n.image === "string"
                            ? n.image
                            : URL.createObjectURL(n.image)
                        }
                        alt={n.title_id}
                        width={80}
                        height={60}
                        className="rounded border object-cover"
                      />
                    ) : (
                      <span className="text-gray-400 italic">Tidak ada</span>
                    )}
                  </td>
                  <td className="p-3 flex justify-center gap-2">
                    <button
                      onClick={() => handleEdit(n)}
                      className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(n.id)}
                      className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-500 italic">
                  Belum ada berita.
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
              {editId ? "Edit Berita" : "Tambah Berita"}
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
                  type="file"
                  accept=".webp,.jpg,.png"
                  className="border p-2 rounded"
                  onChange={handleImageUpload}
                />
              </div>

              {form.image && (
                <div className="mt-2">
                  <Image
                    src={
                      typeof form.image === "string"
                        ? form.image
                        : URL.createObjectURL(form.image)
                    }
                    alt="Preview"
                    width={200}
                    height={120}
                    className="rounded border object-cover"
                  />
                </div>
              )}
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
