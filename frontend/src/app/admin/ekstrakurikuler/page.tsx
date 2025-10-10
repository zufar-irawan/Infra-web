"use client";

import { useState } from "react";
import Image from "next/image";
import Swal from "sweetalert2";
import { Plus, Pencil, Trash2, Link2 } from "lucide-react";

interface EkskulItem {
  id: number;
  name_id: string;
  name_en: string;
  img_id: string; // gambar Bahasa Indonesia (.webp)
  img_en: string; // gambar Bahasa Inggris (.webp)
  ig: string; // tautan Instagram
}

export default function EkstrakurikulerAdminPage() {
  const [ekskul, setEkskul] = useState<EkskulItem[]>([
    {
      id: 1,
      name_id: "Saman",
      name_en: "Saman Dance",
      img_id: "/webp/saman_id.webp",
      img_en: "/webp/saman_en.webp",
      ig: "https://instagram.com/saman",
    },
    {
      id: 2,
      name_id: "Futsal",
      name_en: "Futsal",
      img_id: "/webp/futsal_id.webp",
      img_en: "/webp/futsal_en.webp",
      ig: "https://instagram.com/futsal",
    },
  ]);

  const [form, setForm] = useState<Partial<EkskulItem>>({});
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

  // === Simpan Data ===
  const handleSave = () => {
    if (!form.name_id || !form.name_en || !form.img_id || !form.img_en || !form.ig) {
      Swal.fire("Lengkapi Data", "Semua field wajib diisi!", "warning");
      return;
    }

    if (editId) {
      setEkskul((prev) =>
        prev.map((e) => (e.id === editId ? { ...e, ...form } as EkskulItem : e))
      );
      Swal.fire("Berhasil", "Data ekstrakurikuler berhasil diperbarui.", "success");
    } else {
      const newEkskul: EkskulItem = {
        id: Date.now(),
        name_id: form.name_id!,
        name_en: form.name_en!,
        img_id: form.img_id!,
        img_en: form.img_en!,
        ig: form.ig!,
      };
      setEkskul((prev) => [...prev, newEkskul]);
      Swal.fire("Berhasil", "Data ekstrakurikuler berhasil ditambahkan.", "success");
    }

    setForm({});
    setEditId(null);
    setModalOpen(false);
  };

  // === Edit Data ===
  const handleEdit = (item: EkskulItem) => {
    setForm(item);
    setEditId(item.id);
    setModalOpen(true);
  };

  // === Hapus Data ===
  const handleDelete = (id: number) => {
    Swal.fire({
      title: "Hapus Ekstrakurikuler?",
      text: "Data tidak bisa dikembalikan setelah dihapus.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#FE4D01",
      cancelButtonColor: "#243771",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        setEkskul((prev) => prev.filter((e) => e.id !== id));
        Swal.fire("Terhapus!", "Data ekstrakurikuler berhasil dihapus.", "success");
      }
    });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* === Header === */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[#243771]">
          🎓 Manajemen Ekstrakurikuler
        </h1>
        <button
          onClick={() => {
            setForm({});
            setEditId(null);
            setModalOpen(true);
          }}
          className="flex items-center gap-2 bg-[#FE4D01] text-white px-4 py-2 rounded-lg hover:bg-[#fe5d20] transition"
        >
          <Plus size={18} /> Tambah Ekstrakurikuler
        </button>
      </div>

      {/* === Tabel Data === */}
      <div className="bg-white rounded-2xl shadow-md overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-[#243771] text-white text-left">
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">Nama (ID)</th>
              <th className="p-3">Nama (EN)</th>
              <th className="p-3">Logo (ID)</th>
              <th className="p-3">Logo (EN)</th>
              <th className="p-3">Instagram</th>
              <th className="p-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {ekskul.length > 0 ? (
              ekskul.map((item, i) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition"
                >
                  <td className="p-3 font-medium">{i + 1}</td>
                  <td className="p-3 font-semibold">{item.name_id}</td>
                  <td className="p-3">{item.name_en}</td>
                  <td className="p-3">
                    <Image
                      src={item.img_id}
                      alt="Logo ID"
                      width={60}
                      height={60}
                      className="rounded-md border border-gray-200 object-contain"
                    />
                  </td>
                  <td className="p-3">
                    <Image
                      src={item.img_en}
                      alt="Logo EN"
                      width={60}
                      height={60}
                      className="rounded-md border border-gray-200 object-contain"
                    />
                  </td>
                  <td className="p-3">
                    <a
                      href={item.ig}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#FE4D01] flex items-center gap-1 hover:underline"
                    >
                      <Link2 size={14} /> Instagram
                    </a>
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
                <td colSpan={7} className="text-center py-6 text-gray-500 italic">
                  Belum ada data ekstrakurikuler.
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
              {editId ? "Edit Ekstrakurikuler" : "Tambah Ekstrakurikuler"}
            </h2>

            <div className="space-y-4">
              {/* Nama ID */}
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">
                  Nama (Bahasa Indonesia)
                </label>
                <input
                  type="text"
                  value={form.name_id || ""}
                  onChange={(e) => setForm({ ...form, name_id: e.target.value })}
                  className="w-full border rounded-lg p-2"
                  placeholder="Contoh: Saman"
                />
              </div>

              {/* Nama EN */}
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">
                  Nama (English)
                </label>
                <input
                  type="text"
                  value={form.name_en || ""}
                  onChange={(e) => setForm({ ...form, name_en: e.target.value })}
                  className="w-full border rounded-lg p-2"
                  placeholder="Example: Saman Dance"
                />
              </div>

              {/* Instagram */}
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">
                  Tautan Instagram
                </label>
                <input
                  type="url"
                  value={form.ig || ""}
                  onChange={(e) => setForm({ ...form, ig: e.target.value })}
                  className="w-full border rounded-lg p-2"
                  placeholder="https://instagram.com/..."
                />
              </div>

              {/* Gambar ID */}
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">
                  Logo Bahasa Indonesia (.webp)
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
                  Logo Bahasa Inggris (.webp)
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
