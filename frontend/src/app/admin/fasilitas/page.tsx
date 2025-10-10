"use client";

import { useState } from "react";
import Image from "next/image";
import Swal from "sweetalert2";
import { Plus, Pencil, Trash2 } from "lucide-react";

interface Facility {
  id: number;
  img_id: string;
  img_en: string;
  category: string;
}

export default function FasilitasPage() {
  const [facilities, setFacilities] = useState<Facility[]>([
    {
      id: 1,
      img_id: "/webp/labRpl_id.webp",
      img_en: "/webp/labRpl_en.webp",
      category: "Laboratorium & Studio",
    },
    {
      id: 2,
      img_id: "/webp/lapangan_id.webp",
      img_en: "/webp/lapangan_en.webp",
      category: "Fasilitas Olahraga",
    },
  ]);

  const [form, setForm] = useState<Partial<Facility>>({});
  const [editId, setEditId] = useState<number | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const categories = [
    "Laboratorium & Studio",
    "Fasilitas Akademik",
    "Fasilitas Olahraga",
    "Fasilitas Umum",
  ];

  // === Upload Gambar (.webp) ===
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
      if (type === "id") setForm({ ...form, img_id: reader.result as string });
      else setForm({ ...form, img_en: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  // === Simpan (Tambah / Edit) ===
  const handleSave = () => {
    if (!form.img_id || !form.img_en || !form.category) {
      Swal.fire("Lengkapi Data", "Semua field harus diisi.", "warning");
      return;
    }

    if (editId) {
      setFacilities((prev) =>
        prev.map((f) => (f.id === editId ? { ...f, ...form } as Facility : f))
      );
      Swal.fire("Berhasil", "Data fasilitas berhasil diperbarui.", "success");
    } else {
      const newFacility: Facility = {
        id: Date.now(),
        img_id: form.img_id!,
        img_en: form.img_en!,
        category: form.category!,
      };
      setFacilities((prev) => [...prev, newFacility]);
      Swal.fire("Berhasil", "Data fasilitas berhasil ditambahkan.", "success");
    }

    setForm({});
    setEditId(null);
    setModalOpen(false);
  };

  // === Edit ===
  const handleEdit = (facility: Facility) => {
    setForm(facility);
    setEditId(facility.id);
    setModalOpen(true);
  };

  // === Hapus ===
  const handleDelete = (id: number) => {
    Swal.fire({
      title: "Hapus Data?",
      text: "Data tidak bisa dikembalikan setelah dihapus!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#FE4D01",
      cancelButtonColor: "#243771",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        setFacilities((prev) => prev.filter((f) => f.id !== id));
        Swal.fire("Terhapus!", "Data fasilitas telah dihapus.", "success");
      }
    });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* === Header === */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[#243771]">
          🏫 Manajemen Fasilitas
        </h1>
        <button
          onClick={() => {
            setForm({});
            setEditId(null);
            setModalOpen(true);
          }}
          className="flex items-center gap-2 bg-[#FE4D01] text-white px-4 py-2 rounded-lg hover:bg-[#fe5d20] transition"
        >
          <Plus size={18} /> Tambah Fasilitas
        </button>
      </div>

      {/* === Tabel Fasilitas === */}
      <div className="bg-white rounded-2xl shadow-md overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-[#243771] text-white text-left">
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">Gambar (ID)</th>
              <th className="p-3">Gambar (EN)</th>
              <th className="p-3">Kategori</th>
              <th className="p-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {facilities.length > 0 ? (
              facilities.map((f, i) => (
                <tr
                  key={f.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition"
                >
                  <td className="p-3 font-medium">{i + 1}</td>
                  <td className="p-3">
                    <Image
                      src={f.img_id}
                      alt="Gambar ID"
                      width={80}
                      height={80}
                      className="rounded-md border border-gray-200 object-cover"
                    />
                  </td>
                  <td className="p-3">
                    <Image
                      src={f.img_en}
                      alt="Gambar EN"
                      width={80}
                      height={80}
                      className="rounded-md border border-gray-200 object-cover"
                    />
                  </td>
                  <td className="p-3">{f.category}</td>
                  <td className="p-3 flex justify-center gap-2">
                    <button
                      onClick={() => handleEdit(f)}
                      className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(f.id)}
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
                  Belum ada data fasilitas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* === Modal Tambah/Edit === */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-[95%] max-w-md shadow-xl relative">
            <h2 className="text-xl font-bold text-[#243771] mb-4">
              {editId ? "Edit Fasilitas" : "Tambah Fasilitas"}
            </h2>

            <div className="space-y-4">
              {/* Kategori */}
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">
                  Kategori
                </label>
                <select
                  value={form.category || ""}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  className="w-full border rounded-lg p-2"
                >
                  <option value="">-- Pilih Kategori --</option>
                  {categories.map((cat, idx) => (
                    <option key={idx} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Gambar ID */}
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">
                  Gambar Bahasa Indonesia (.webp)
                </label>
                <input
                  type="file"
                  accept=".webp"
                  onChange={(e) => handleImageUpload(e, "id")}
                  className="w-full border rounded-lg p-2"
                />
                {form.img_id && (
                  <Image
                    src={form.img_id}
                    alt="Preview ID"
                    width={120}
                    height={120}
                    className="rounded-lg mt-2 border border-gray-200"
                  />
                )}
              </div>

              {/* Gambar EN */}
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">
                  Gambar Bahasa Inggris (.webp)
                </label>
                <input
                  type="file"
                  accept=".webp"
                  onChange={(e) => handleImageUpload(e, "en")}
                  className="w-full border rounded-lg p-2"
                />
                {form.img_en && (
                  <Image
                    src={form.img_en}
                    alt="Preview EN"
                    width={120}
                    height={120}
                    className="rounded-lg mt-2 border border-gray-200"
                  />
                )}
              </div>
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
