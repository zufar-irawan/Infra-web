"use client";

import { useState } from "react";
import Image from "next/image";
import Swal from "sweetalert2";
import { Plus, Pencil, Trash2 } from "lucide-react";

interface PrestasiItem {
  id: number;
  title_id: string;
  title_en: string;
  img_id: string; // gambar Bahasa Indonesia (.webp)
  img_en: string; // gambar Bahasa Inggris (.webp)
}

export default function PrestasiAdminPage() {
  const [prestasi, setPrestasi] = useState<PrestasiItem[]>([
    {
      id: 1,
      title_id: "Juara 1 Lomba Desain Grafis Nasional",
      title_en: "1st Place in National Graphic Design Competition",
      img_id: "/webp/p1_id.webp",
      img_en: "/webp/p1_en.webp",
    },
    {
      id: 2,
      title_id: "Juara 2 Kompetisi Robotik SMK se-Jakarta",
      title_en: "2nd Place in Jakarta Vocational Robotics Competition",
      img_id: "/webp/p2_id.webp",
      img_en: "/webp/p2_en.webp",
    },
  ]);

  const [form, setForm] = useState<Partial<PrestasiItem>>({});
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
      if (type === "id") setForm({ ...form, img_id: reader.result as string });
      else setForm({ ...form, img_en: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  // === Simpan Data (Tambah / Edit) ===
  const handleSave = () => {
    if (!form.title_id || !form.title_en || !form.img_id || !form.img_en) {
      Swal.fire("Lengkapi Data", "Semua field wajib diisi!", "warning");
      return;
    }

    if (editId) {
      setPrestasi((prev) =>
        prev.map((p) => (p.id === editId ? { ...p, ...form } as PrestasiItem : p))
      );
      Swal.fire("Berhasil", "Data prestasi berhasil diperbarui.", "success");
    } else {
      const newItem: PrestasiItem = {
        id: Date.now(),
        title_id: form.title_id!,
        title_en: form.title_en!,
        img_id: form.img_id!,
        img_en: form.img_en!,
      };
      setPrestasi((prev) => [...prev, newItem]);
      Swal.fire("Berhasil", "Prestasi baru berhasil ditambahkan.", "success");
    }

    setForm({});
    setEditId(null);
    setModalOpen(false);
  };

  // === Edit Data ===
  const handleEdit = (item: PrestasiItem) => {
    setForm(item);
    setEditId(item.id);
    setModalOpen(true);
  };

  // === Hapus Data ===
  const handleDelete = (id: number) => {
    Swal.fire({
      title: "Hapus Prestasi?",
      text: "Data tidak bisa dikembalikan setelah dihapus.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#FE4D01",
      cancelButtonColor: "#243771",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        setPrestasi((prev) => prev.filter((p) => p.id !== id));
        Swal.fire("Terhapus!", "Data prestasi berhasil dihapus.", "success");
      }
    });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* === Header === */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[#243771]">🏆 Manajemen Prestasi</h1>
        <button
          onClick={() => {
            setForm({});
            setEditId(null);
            setModalOpen(true);
          }}
          className="flex items-center gap-2 bg-[#FE4D01] text-white px-4 py-2 rounded-lg hover:bg-[#fe5d20] transition"
        >
          <Plus size={18} /> Tambah Prestasi
        </button>
      </div>

      {/* === Tabel Data === */}
      <div className="bg-white rounded-2xl shadow-md overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-[#243771] text-white text-left">
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">Judul (ID)</th>
              <th className="p-3">Judul (EN)</th>
              <th className="p-3">Gambar (ID)</th>
              <th className="p-3">Gambar (EN)</th>
              <th className="p-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {prestasi.length > 0 ? (
              prestasi.map((item, i) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition"
                >
                  <td className="p-3 font-medium">{i + 1}</td>
                  <td className="p-3 font-semibold">{item.title_id}</td>
                  <td className="p-3 font-semibold">{item.title_en}</td>
                  <td className="p-3">
                    <Image
                      src={item.img_id}
                      alt="Gambar ID"
                      width={80}
                      height={80}
                      className="rounded-md border border-gray-200 object-contain"
                    />
                  </td>
                  <td className="p-3">
                    <Image
                      src={item.img_en}
                      alt="Gambar EN"
                      width={80}
                      height={80}
                      className="rounded-md border border-gray-200 object-contain"
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
                <td
                  colSpan={6}
                  className="text-center py-6 text-gray-500 italic"
                >
                  Belum ada data prestasi.
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
              {editId ? "Edit Prestasi" : "Tambah Prestasi"}
            </h2>

            <div className="space-y-4">
              {/* Judul ID */}
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">
                  Judul (Bahasa Indonesia)
                </label>
                <input
                  type="text"
                  value={form.title_id || ""}
                  onChange={(e) => setForm({ ...form, title_id: e.target.value })}
                  className="w-full border rounded-lg p-2"
                  placeholder="Contoh: Juara 1 Lomba Desain Grafis"
                />
              </div>

              {/* Judul EN */}
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">
                  Judul (English)
                </label>
                <input
                  type="text"
                  value={form.title_en || ""}
                  onChange={(e) => setForm({ ...form, title_en: e.target.value })}
                  className="w-full border rounded-lg p-2"
                  placeholder="Example: 1st Place in Design Competition"
                />
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
