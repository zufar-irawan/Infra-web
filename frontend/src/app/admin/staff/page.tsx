"use client";

import { useState } from "react";
import Image from "next/image";
import Swal from "sweetalert2";
import { Plus, Pencil, Trash2, Upload } from "lucide-react";

interface Staff {
  id: number;
  img_id: string; // gambar versi Indonesia
  img_en: string; // gambar versi Inggris
}

export default function StaffPage() {
  const [staffList, setStaffList] = useState<Staff[]>([
    {
      id: 1,
      img_id: "/webp/staff1_id.webp",
      img_en: "/webp/staff1_en.webp",
    },
    {
      id: 2,
      img_id: "/webp/staff2_id.webp",
      img_en: "/webp/staff2_en.webp",
    },
  ]);

  const [form, setForm] = useState<Partial<Staff>>({});
  const [editId, setEditId] = useState<number | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);

  // === Upload Gambar (hanya .webp) ===
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

  // === Simpan Staff ===
  const handleSave = () => {
    if (!form.img_id || !form.img_en) {
      Swal.fire("Lengkapi Data", "Upload gambar untuk kedua bahasa!", "warning");
      return;
    }

    if (editId) {
      setStaffList((prev) =>
        prev.map((s) => (s.id === editId ? { ...s, ...form } as Staff : s))
      );
      Swal.fire("Berhasil", "Data staff berhasil diperbarui", "success");
    } else {
      const newStaff: Staff = {
        id: Date.now(),
        img_id: form.img_id!,
        img_en: form.img_en!,
      };
      setStaffList((prev) => [...prev, newStaff]);
      Swal.fire("Berhasil", "Data staff berhasil ditambahkan", "success");
    }

    setForm({});
    setEditId(null);
    setModalOpen(false);
  };

  // === Edit ===
  const handleEdit = (staff: Staff) => {
    setForm(staff);
    setEditId(staff.id);
    setModalOpen(true);
  };

  // === Hapus ===
  const handleDelete = (id: number) => {
    Swal.fire({
      title: "Hapus Staff?",
      text: "Data tidak bisa dikembalikan setelah dihapus.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#FE4D01",
      cancelButtonColor: "#243771",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        setStaffList((prev) => prev.filter((s) => s.id !== id));
        Swal.fire("Terhapus!", "Data staff berhasil dihapus.", "success");
      }
    });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* === Header === */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[#243771]">
          👩‍🏫 Manajemen Staff
        </h1>
        <button
          onClick={() => {
            setForm({});
            setEditId(null);
            setModalOpen(true);
          }}
          className="flex items-center gap-2 bg-[#FE4D01] text-white px-4 py-2 rounded-lg hover:bg-[#fe5d20] transition"
        >
          <Plus size={18} /> Tambah Staff
        </button>
      </div>

      {/* === Tabel Staff === */}
      <div className="bg-white rounded-2xl shadow-md overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-[#243771] text-white">
            <tr>
              <th className="p-3 text-left">#</th>
              <th className="p-3 text-left">Gambar (ID)</th>
              <th className="p-3 text-left">Gambar (EN)</th>
              <th className="p-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {staffList.length > 0 ? (
              staffList.map((s, i) => (
                <tr
                  key={s.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition"
                >
                  <td className="p-3 font-medium">{i + 1}</td>
                  <td className="p-3">
                    <Image
                      src={s.img_id}
                      alt="Gambar Bahasa Indonesia"
                      width={80}
                      height={80}
                      className="rounded-md border border-gray-200 object-cover"
                    />
                  </td>
                  <td className="p-3">
                    <Image
                      src={s.img_en}
                      alt="Gambar Bahasa Inggris"
                      width={80}
                      height={80}
                      className="rounded-md border border-gray-200 object-cover"
                    />
                  </td>
                  <td className="p-3 flex justify-center gap-2">
                    <button
                      onClick={() => handleEdit(s)}
                      className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(s.id)}
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
                  colSpan={4}
                  className="text-center py-6 text-gray-500 italic"
                >
                  Belum ada data staff.
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
              {editId ? "Edit Data Staff" : "Tambah Staff"}
            </h2>

            <div className="space-y-4">
              {/* Upload ID */}
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

              {/* Upload EN */}
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
