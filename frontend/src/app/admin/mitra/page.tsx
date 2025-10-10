"use client";

import { useState } from "react";
import Image from "next/image";
import Swal from "sweetalert2";
import { Plus, Pencil, Trash2 } from "lucide-react";

interface Partner {
  id: number;
  name: string;
  img_id: string; // gambar versi Bahasa Indonesia (webp)
  img_en: string; // gambar versi Bahasa Inggris (webp)
}

export default function MitraPage() {
  const [partners, setPartners] = useState<Partner[]>([
    {
      id: 1,
      name: "Komatsu",
      img_id: "/webp/komatsu_id.webp",
      img_en: "/webp/komatsu_en.webp",
    },
    {
      id: 2,
      name: "Panasonic",
      img_id: "/webp/panasonic_id.webp",
      img_en: "/webp/panasonic_en.webp",
    },
  ]);

  const [form, setForm] = useState<Partial<Partner>>({});
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

  // === Simpan (Tambah / Edit) ===
  const handleSave = () => {
    if (!form.name || !form.img_id || !form.img_en) {
      Swal.fire("Lengkapi Data", "Semua field harus diisi!", "warning");
      return;
    }

    if (editId) {
      setPartners((prev) =>
        prev.map((p) => (p.id === editId ? { ...p, ...form } as Partner : p))
      );
      Swal.fire("Berhasil", "Data mitra diperbarui.", "success");
    } else {
      const newPartner: Partner = {
        id: Date.now(),
        name: form.name!,
        img_id: form.img_id!,
        img_en: form.img_en!,
      };
      setPartners((prev) => [...prev, newPartner]);
      Swal.fire("Berhasil", "Data mitra ditambahkan.", "success");
    }

    setForm({});
    setEditId(null);
    setModalOpen(false);
  };

  // === Edit ===
  const handleEdit = (partner: Partner) => {
    setForm(partner);
    setEditId(partner.id);
    setModalOpen(true);
  };

  // === Hapus ===
  const handleDelete = (id: number) => {
    Swal.fire({
      title: "Hapus Mitra?",
      text: "Data tidak bisa dikembalikan setelah dihapus.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#FE4D01",
      cancelButtonColor: "#243771",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        setPartners((prev) => prev.filter((p) => p.id !== id));
        Swal.fire("Terhapus!", "Data mitra berhasil dihapus.", "success");
      }
    });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* === Header === */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[#243771]">
          🤝 Manajemen Mitra Industri
        </h1>
        <button
          onClick={() => {
            setForm({});
            setEditId(null);
            setModalOpen(true);
          }}
          className="flex items-center gap-2 bg-[#FE4D01] text-white px-4 py-2 rounded-lg hover:bg-[#fe5d20] transition"
        >
          <Plus size={18} /> Tambah Mitra
        </button>
      </div>

      {/* === Tabel Mitra === */}
      <div className="bg-white rounded-2xl shadow-md overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-[#243771] text-white text-left">
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">Nama</th>
              <th className="p-3">Logo (ID)</th>
              <th className="p-3">Logo (EN)</th>
              <th className="p-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {partners.length > 0 ? (
              partners.map((p, i) => (
                <tr
                  key={p.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition"
                >
                  <td className="p-3 font-medium">{i + 1}</td>
                  <td className="p-3 font-semibold">{p.name}</td>
                  <td className="p-3">
                    <Image
                      src={p.img_id}
                      alt="Logo ID"
                      width={80}
                      height={80}
                      className="rounded-md border border-gray-200 object-contain"
                    />
                  </td>
                  <td className="p-3">
                    <Image
                      src={p.img_en}
                      alt="Logo EN"
                      width={80}
                      height={80}
                      className="rounded-md border border-gray-200 object-contain"
                    />
                  </td>
                  <td className="p-3 flex justify-center gap-2">
                    <button
                      onClick={() => handleEdit(p)}
                      className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
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
                  Belum ada data mitra.
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
              {editId ? "Edit Mitra Industri" : "Tambah Mitra Industri"}
            </h2>

            <div className="space-y-4">
              {/* Nama Mitra */}
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">
                  Nama Mitra
                </label>
                <input
                  type="text"
                  value={form.name || ""}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border rounded-lg p-2"
                  placeholder="Contoh: Komatsu"
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
