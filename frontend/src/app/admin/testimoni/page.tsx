"use client";

import { useState } from "react";
import Image from "next/image";
import Swal from "sweetalert2";
import { Plus, Pencil, Trash2 } from "lucide-react";

interface TestimoniItem {
  id: number;
  name: string;
  major_id: string; // jurusan versi Indonesia
  major_en: string; // jurusan versi Inggris
  message_id: string; // isi testimoni versi Indonesia
  message_en: string; // isi testimoni versi Inggris
  photo_id: string; // foto versi Indonesia (.webp)
  photo_en: string; // foto versi Inggris (.webp)
}

export default function TestimoniAdminPage() {
  const [testimoni, setTestimoni] = useState<TestimoniItem[]>([
    {
      id: 1,
      name: "Yao Ming Abdul Rahman",
      major_id: "Desain Komunikasi Visual",
      major_en: "Visual Communication Design",
      message_id:
        "Saya sungguh terkesan dengan apa yang telah saya saksikan di SMK Prestasi Prima hari ini. Sekolah ini melampaui ekspektasi saya.",
      message_en:
        "I am truly impressed with what I have witnessed at SMK Prestasi Prima today. This school has exceeded my expectations.",
      photo_id: "/webp/yoming_id.webp",
      photo_en: "/webp/yoming_en.webp",
    },
  ]);

  const [form, setForm] = useState<Partial<TestimoniItem>>({});
  const [editId, setEditId] = useState<number | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);

  // === Upload Gambar ===
  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "id" | "en"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".webp")) {
      Swal.fire("Format Salah", "Gunakan gambar berformat .webp", "warning");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (type === "id") setForm({ ...form, photo_id: reader.result as string });
      else setForm({ ...form, photo_en: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  // === Simpan Data ===
  const handleSave = () => {
    if (
      !form.name ||
      !form.major_id ||
      !form.major_en ||
      !form.message_id ||
      !form.message_en ||
      !form.photo_id ||
      !form.photo_en
    ) {
      Swal.fire("Lengkapi Data", "Semua field wajib diisi!", "warning");
      return;
    }

    if (editId) {
      setTestimoni((prev) =>
        prev.map((t) => (t.id === editId ? { ...t, ...form } as TestimoniItem : t))
      );
      Swal.fire("Berhasil", "Data testimoni berhasil diperbarui.", "success");
    } else {
      const newItem: TestimoniItem = {
        id: Date.now(),
        name: form.name!,
        major_id: form.major_id!,
        major_en: form.major_en!,
        message_id: form.message_id!,
        message_en: form.message_en!,
        photo_id: form.photo_id!,
        photo_en: form.photo_en!,
      };
      setTestimoni((prev) => [...prev, newItem]);
      Swal.fire("Berhasil", "Data testimoni berhasil ditambahkan.", "success");
    }

    setForm({});
    setEditId(null);
    setModalOpen(false);
  };

  // === Edit Data ===
  const handleEdit = (item: TestimoniItem) => {
    setForm(item);
    setEditId(item.id);
    setModalOpen(true);
  };

  // === Hapus Data ===
  const handleDelete = (id: number) => {
    Swal.fire({
      title: "Hapus Testimoni?",
      text: "Data tidak bisa dikembalikan setelah dihapus.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#FE4D01",
      cancelButtonColor: "#243771",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        setTestimoni((prev) => prev.filter((t) => t.id !== id));
        Swal.fire("Terhapus!", "Data testimoni berhasil dihapus.", "success");
      }
    });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* === Header === */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[#243771]">💬 Manajemen Testimoni</h1>
        <button
          onClick={() => {
            setForm({});
            setEditId(null);
            setModalOpen(true);
          }}
          className="flex items-center gap-2 bg-[#FE4D01] text-white px-4 py-2 rounded-lg hover:bg-[#fe5d20] transition"
        >
          <Plus size={18} /> Tambah Testimoni
        </button>
      </div>

      {/* === Tabel Data === */}
      <div className="bg-white rounded-2xl shadow-md overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-[#243771] text-white text-left">
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">Nama</th>
              <th className="p-3">Jurusan (ID)</th>
              <th className="p-3">Jurusan (EN)</th>
              <th className="p-3">Pesan (ID)</th>
              <th className="p-3">Pesan (EN)</th>
              <th className="p-3">Foto (ID)</th>
              <th className="p-3">Foto (EN)</th>
              <th className="p-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {testimoni.length > 0 ? (
              testimoni.map((item, i) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition"
                >
                  <td className="p-3 font-medium">{i + 1}</td>
                  <td className="p-3 font-semibold">{item.name}</td>
                  <td className="p-3">{item.major_id}</td>
                  <td className="p-3">{item.major_en}</td>
                  <td className="p-3 max-w-[240px] truncate">{item.message_id}</td>
                  <td className="p-3 max-w-[240px] truncate">{item.message_en}</td>
                  <td className="p-3">
                    <Image
                      src={item.photo_id}
                      alt="Foto ID"
                      width={60}
                      height={60}
                      className="rounded-md border border-gray-200 object-cover"
                    />
                  </td>
                  <td className="p-3">
                    <Image
                      src={item.photo_en}
                      alt="Foto EN"
                      width={60}
                      height={60}
                      className="rounded-md border border-gray-200 object-cover"
                    />
                  </td>
                  <td className="p-3 flex justify-center gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="text-center py-6 text-gray-500 italic">
                  Belum ada data testimoni.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* === Modal Tambah/Edit === */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-[95%] max-w-lg shadow-xl relative">
            <h2 className="text-xl font-bold text-[#243771] mb-4">
              {editId ? "Edit Testimoni" : "Tambah Testimoni"}
            </h2>

            <div className="space-y-4">
              {/* Nama */}
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">
                  Nama
                </label>
                <input
                  type="text"
                  value={form.name || ""}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border rounded-lg p-2"
                  placeholder="Contoh: Yao Ming Abdul Rahman"
                />
              </div>

              {/* Jurusan */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">
                    Jurusan (ID)
                  </label>
                  <input
                    type="text"
                    value={form.major_id || ""}
                    onChange={(e) =>
                      setForm({ ...form, major_id: e.target.value })
                    }
                    className="w-full border rounded-lg p-2"
                    placeholder="Contoh: Desain Komunikasi Visual"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">
                    Jurusan (EN)
                  </label>
                  <input
                    type="text"
                    value={form.major_en || ""}
                    onChange={(e) =>
                      setForm({ ...form, major_en: e.target.value })
                    }
                    className="w-full border rounded-lg p-2"
                    placeholder="Example: Visual Communication Design"
                  />
                </div>
              </div>

              {/* Pesan */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">
                    Pesan (ID)
                  </label>
                  <textarea
                    value={form.message_id || ""}
                    onChange={(e) =>
                      setForm({ ...form, message_id: e.target.value })
                    }
                    className="w-full border rounded-lg p-2 h-24"
                    placeholder="Tuliskan testimoni versi Indonesia"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">
                    Pesan (EN)
                  </label>
                  <textarea
                    value={form.message_en || ""}
                    onChange={(e) =>
                      setForm({ ...form, message_en: e.target.value })
                    }
                    className="w-full border rounded-lg p-2 h-24"
                    placeholder="Write the English version"
                  />
                </div>
              </div>

              {/* Gambar */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">
                    Foto (ID) .webp
                  </label>
                  <input
                    type="file"
                    accept=".webp"
                    onChange={(e) => handleImageUpload(e, "id")}
                    className="w-full border rounded-lg p-2"
                  />
                  {form.photo_id && (
                    <Image
                      src={form.photo_id}
                      alt="Preview ID"
                      width={100}
                      height={100}
                      className="rounded-lg mt-2 border border-gray-200"
                    />
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">
                    Foto (EN) .webp
                  </label>
                  <input
                    type="file"
                    accept=".webp"
                    onChange={(e) => handleImageUpload(e, "en")}
                    className="w-full border rounded-lg p-2"
                  />
                  {form.photo_en && (
                    <Image
                      src={form.photo_en}
                      alt="Preview EN"
                      width={100}
                      height={100}
                      className="rounded-lg mt-2 border border-gray-200"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Tombol Aksi */}
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
