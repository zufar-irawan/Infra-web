"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Swal from "sweetalert2";
import { Plus, Pencil, Trash2, X, CheckSquare, Square } from "lucide-react";

interface Facility {
  id: number;
  img_id: string;
  img_en: string;
  category: string;
}

export default function FasilitasPage() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
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

  // === Ambil data lewat proxy API ===
  const fetchFacilities = async () => {
    try {
      const res = await fetch("/api/portal/facilities", { cache: "no-store" });
      const json = await res.json();
      if (json.success) setFacilities(json.data);
      else throw new Error(json.message);
    } catch (err) {
      console.error("❌ Gagal memuat fasilitas:", err);
      Swal.fire("Gagal", "Tidak bisa memuat data fasilitas", "error");
    }
  };

  useEffect(() => {
    fetchFacilities();
  }, []);

  // === Upload gambar ===
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: "id" | "en") => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith(".webp")) {
      Swal.fire("Format Salah", "Gunakan gambar berformat .webp", "warning");
      return;
    }
    setForm((prev) => ({ ...prev, [type === "id" ? "img_id" : "img_en"]: file }));
  };

  // === Tambah / Update ===
  const handleSave = async () => {
    if (!form.category) {
      Swal.fire("Lengkapi Data", "Kategori wajib diisi.", "warning");
      return;
    }

    const formData = new FormData();
    formData.append("category", form.category);
    if (form.img_id) formData.append("img_id", form.img_id);
    if (form.img_en) formData.append("img_en", form.img_en);

    try {
      const url = editId ? `/api/portal/facilities/${editId}` : `/api/portal/facilities`;
      const res = await fetch(url, {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.message);

      Swal.fire("Berhasil!", editId ? "Data fasilitas diperbarui." : "Data fasilitas ditambahkan.", "success");
      setModalOpen(false);
      setForm({ img_id: null, img_en: null, category: "" });
      setEditId(null);
      fetchFacilities();
    } catch (err: any) {
      console.error("❌ Gagal menyimpan:", err);
      Swal.fire("Gagal", err.message || "Upload gagal", "error");
    }
  };

  // === Edit ===
  const handleEdit = (facility: Facility) => {
    setEditId(facility.id);
    setForm({ img_id: null, img_en: null, category: facility.category });
    setModalOpen(true);
  };

  // === Pilih ===
  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // === Hapus ===
  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) {
      Swal.fire("Tidak ada yang dipilih", "Pilih minimal satu data.", "info");
      return;
    }

    const result = await Swal.fire({
      title: "Hapus Data?",
      text: `${selectedIds.length} fasilitas akan dihapus.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#FE4D01",
      cancelButtonColor: "#243771",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    try {
      await Promise.all(
        selectedIds.map((id) =>
          fetch(`/api/portal/facilities/${id}`, { method: "DELETE" })
        )
      );
      Swal.fire("Terhapus!", "Data fasilitas telah dihapus.", "success");
      setSelectedIds([]);
      fetchFacilities();
    } catch {
      Swal.fire("Gagal", "Tidak dapat menghapus fasilitas.", "error");
    }
  };

  // === Tutup modal ===
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

  // === UI ===
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#f5f7ff] via-[#fffdfb] to-[#fef6f0] px-4 py-10 md:px-10">
      <div className="max-w-6xl mx-auto bg-white rounded-md shadow-md border border-gray-100 p-5 sm:p-8">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#243771]">🏫 Manajemen Fasilitas</h1>
            <p className="text-gray-500 text-sm mt-1">Kelola seluruh fasilitas sekolah</p>
          </div>

          <div className="flex flex-wrap gap-3">
            {selectedIds.length > 0 && (
              <button
                onClick={handleDeleteSelected}
                className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
              >
                <Trash2 size={18} /> Hapus Terpilih
              </button>
            )}
            <button
              onClick={() => {
                setForm({ img_id: null, img_en: null, category: "" });
                setEditId(null);
                setModalOpen(true);
              }}
              className="flex items-center gap-2 bg-gradient-to-r from-[#FE4D01] to-[#ff7433] text-white px-4 py-2 rounded-md font-medium shadow-sm hover:shadow-md transition"
            >
              <Plus size={18} /> Tambah Fasilitas
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto border border-gray-200 rounded-md">
          <table className="min-w-full text-sm">
            <thead className="bg-gradient-to-r from-[#243771] to-[#3b5bb1] text-white">
              <tr>
                <th className="p-3 w-[40px] text-center"></th>
                <th className="p-3 text-center">ID</th>
                <th className="p-3 text-center">Gambar (ID)</th>
                <th className="p-3 text-center">Gambar (EN)</th>
                <th className="p-3">Kategori</th>
                <th className="p-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {facilities.length > 0 ? (
                facilities.map((f) => (
                  <tr
                    key={f.id}
                    className={`border-b ${
                      selectedIds.includes(f.id) ? "bg-[#fff0e6]" : "hover:bg-[#f9fafc]"
                    } transition`}
                  >
                    <td className="p-3 text-center cursor-pointer" onClick={() => toggleSelect(f.id)}>
                      {selectedIds.includes(f.id) ? (
                        <CheckSquare size={18} className="text-[#FE4D01]" />
                      ) : (
                        <Square size={18} className="text-gray-400" />
                      )}
                    </td>
                    <td className="p-3 text-center font-medium text-[#243771]">{f.id}</td>
                    <td className="p-3 text-center">
                      <Image
                        src={f.img_id}
                        alt="Gambar ID"
                        width={60}
                        height={60}
                        className="rounded-sm border border-gray-200 object-cover mx-auto"
                      />
                    </td>
                    <td className="p-3 text-center">
                      <Image
                        src={f.img_en}
                        alt="Gambar EN"
                        width={60}
                        height={60}
                        className="rounded-sm border border-gray-200 object-cover mx-auto"
                      />
                    </td>
                    <td className="p-3 text-gray-700">{f.category}</td>
                    <td className="p-3 flex justify-center gap-2 flex-wrap">
                      <button
                        onClick={() => handleEdit(f)}
                        className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-sm transition"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => toggleSelect(f.id)}
                        className={`p-2 ${
                          selectedIds.includes(f.id)
                            ? "bg-gray-300"
                            : "bg-gray-100 hover:bg-gray-200"
                        } rounded-sm text-[#243771] transition`}
                      >
                        {selectedIds.includes(f.id) ? "✓" : "Pilih"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-gray-500 italic">
                    Belum ada data fasilitas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div ref={modalRef} className="bg-white rounded-md w-full max-w-md shadow-2xl border border-gray-200">
            <div className="flex justify-between items-center px-5 py-4 bg-gradient-to-r from-[#243771]/90 to-[#FE4D01]/80 text-white">
              <h2 className="font-semibold text-lg">{editId ? "Edit Fasilitas" : "Tambah Fasilitas"}</h2>
              <button onClick={() => setModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Kategori</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full border p-2 rounded"
                >
                  <option value="">-- Pilih Kategori --</option>
                  {categories.map((cat, i) => (
                    <option key={i} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Gambar Bahasa Indonesia (.webp)</label>
                <input type="file" accept=".webp" onChange={(e) => handleImageUpload(e, "id")} className="w-full border p-2 rounded" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Gambar Bahasa Inggris (.webp)</label>
                <input type="file" accept=".webp" onChange={(e) => handleImageUpload(e, "en")} className="w-full border p-2 rounded" />
              </div>
            </div>

            <div className="flex justify-end gap-3 px-5 py-4 bg-gray-50 border-t">
              <button onClick={() => setModalOpen(false)} className="px-4 py-2 border rounded">
                Batal
              </button>
              <button onClick={handleSave} className="px-4 py-2 bg-gradient-to-r from-[#FE4D01] to-[#ff7433] text-white rounded">
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
