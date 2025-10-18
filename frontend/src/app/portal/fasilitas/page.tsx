"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Swal from "sweetalert2";
import axios from "axios";
import { Plus, Pencil, Trash2, X } from "lucide-react";

interface Facility {
  id: number;
  img_id: string;
  img_en: string;
  category: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://api.smkprestasiprima.sch.id/api";

export default function FasilitasPage() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [form, setForm] = useState<{ img_id: File | null; img_en: File | null; category: string }>({
    img_id: null,
    img_en: null,
    category: "",
  });
  const [editId, setEditId] = useState<number | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const categories = [
    "Laboratorium & Studio",
    "Fasilitas Akademik",
    "Fasilitas Olahraga",
    "Fasilitas Umum",
  ];

  // === Ambil data dari API ===
  const fetchFacilities = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/facilities`);
      if (res.data.success) setFacilities(res.data.data);
    } catch (err) {
      console.error("Gagal memuat data fasilitas:", err);
      Swal.fire("Gagal", "Tidak bisa memuat data fasilitas", "error");
    }
  };

  useEffect(() => {
    fetchFacilities();
  }, []);

  // === Upload handler ===
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: "id" | "en") => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".webp")) {
      Swal.fire("Format Salah", "Gunakan gambar berformat .webp", "warning");
      return;
    }

    setForm((prev) => ({
      ...prev,
      [type === "id" ? "img_id" : "img_en"]: file,
    }));
  };

  // === Simpan data (tambah / edit) ===
  const handleSave = async () => {
    if (!form.img_id || !form.img_en || !form.category) {
      Swal.fire("Lengkapi Data", "Semua field harus diisi.", "warning");
      return;
    }

    const formData = new FormData();
    formData.append("category", form.category);
    formData.append("img_id", form.img_id);
    formData.append("img_en", form.img_en);

    try {
      const url = editId
        ? `${API_BASE_URL}/facilities/${editId}`
        : `${API_BASE_URL}/facilities`;

      await axios.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.fire(
        "Berhasil!",
        editId ? "Data fasilitas diperbarui." : "Data fasilitas ditambahkan.",
        "success"
      );

      setModalOpen(false);
      setForm({ img_id: null, img_en: null, category: "" });
      setEditId(null);
      fetchFacilities();
    } catch (err: any) {
      console.error("Gagal menyimpan data:", err);
      Swal.fire("Gagal", err.response?.data?.message || "Upload gagal", "error");
    }
  };

  // === Edit ===
  const handleEdit = (facility: Facility) => {
    setEditId(facility.id);
    setForm({
      img_id: null,
      img_en: null,
      category: facility.category,
    });
    setModalOpen(true);
  };

  // === Hapus ===
  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Hapus Data?",
      text: "Data tidak dapat dikembalikan setelah dihapus!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#FE4D01",
      cancelButtonColor: "#243771",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`${API_BASE_URL}/facilities/${id}`);
      Swal.fire("Terhapus!", "Data fasilitas telah dihapus.", "success");
      fetchFacilities();
    } catch (err) {
      Swal.fire("Gagal", "Tidak dapat menghapus fasilitas.", "error");
    }
  };

  // === Tutup modal di luar / ESC ===
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
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[#243771]">🏫 Manajemen Fasilitas</h1>
        <button
          onClick={() => {
            setForm({ img_id: null, img_en: null, category: "" });
            setEditId(null);
            setModalOpen(true);
          }}
          className="flex items-center gap-2 bg-[#FE4D01] text-white px-4 py-2 rounded-lg hover:bg-[#fe5d20] transition"
        >
          <Plus size={18} /> Tambah Fasilitas
        </button>
      </div>

      {/* Tabel */}
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
                <tr key={f.id} className="border-b hover:bg-gray-50 transition">
                  <td className="p-3 font-medium">{i + 1}</td>
                  <td className="p-3 text-center">
                    <Image
                      src={f.img_id}
                      alt="Gambar ID"
                      width={80}
                      height={80}
                      className="rounded-md border object-cover mx-auto"
                    />
                  </td>
                  <td className="p-3 text-center">
                    <Image
                      src={f.img_en}
                      alt="Gambar EN"
                      width={80}
                      height={80}
                      className="rounded-md border object-cover mx-auto"
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

      {/* Modal Tambah/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div
            ref={modalRef}
            className="bg-white rounded-2xl p-6 w-[95%] max-w-md shadow-xl relative"
          >
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-[#FE4D01]"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-bold text-[#243771] mb-4 text-center">
              {editId ? "Edit Fasilitas" : "Tambah Fasilitas"}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">
                  Kategori
                </label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
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
              </div>

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
