"use client";

import { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { Pencil, Trash2, Plus, X } from "lucide-react";

interface Partner {
  id: number;
  name: string;
  img_id: string;
  img_en: string;
}

export default function AdminMitraPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [form, setForm] = useState<
    Partial<Partner> & { imgIdFile?: File | null; imgEnFile?: File | null }
  >({});
  const [editId, setEditId] = useState<number | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // === Ambil data ===
  const fetchMitra = async () => {
    try {
      const res = await axios.get("/api/portal/mitra/public");
      if (res.data.success) setPartners(res.data.data);
    } catch (err) {
      console.error("❌ Gagal memuat mitra:", err);
      Swal.fire("Gagal", "Tidak bisa memuat data mitra.", "error");
    }
  };

  useEffect(() => {
    fetchMitra();
  }, []);

  // === Upload handler ===
  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    lang: "id" | "en"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = [".webp", ".jpg", ".jpeg", ".png", ".svg"];
    if (!allowed.some((ext) => file.name.toLowerCase().endsWith(ext))) {
      Swal.fire("Format Salah", "Gunakan gambar .webp, .jpg, .png, atau .svg", "warning");
      return;
    }

    if (lang === "id") setForm((prev) => ({ ...prev, imgIdFile: file }));
    if (lang === "en") setForm((prev) => ({ ...prev, imgEnFile: file }));
  };

  // === Simpan data ===
  const handleSave = async () => {
    if (!form.name) {
      Swal.fire("Lengkapi Data", "Nama mitra wajib diisi!", "warning");
      return;
    }

    const formData = new FormData();
    formData.append("name", form.name);
    if (form.imgIdFile) formData.append("img_id", form.imgIdFile);
    if (form.imgEnFile) formData.append("img_en", form.imgEnFile);

    try {
      setLoading(true);
      const url = editId ? `/api/portal/mitra/${editId}` : `/api/portal/mitra`;
      const method = editId ? "put" : "post";

      await axios({
        method,
        url,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.fire(
        "Berhasil!",
        editId ? "Data mitra diperbarui." : "Data mitra ditambahkan.",
        "success"
      );

      setModalOpen(false);
      setForm({});
      setEditId(null);
      fetchMitra();
    } catch (err: any) {
      console.error("❌ Gagal menyimpan mitra:", err);
      Swal.fire("Gagal", err.response?.data?.message || "Upload gagal", "error");
    } finally {
      setLoading(false);
    }
  };

  // === Hapus data ===
  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Hapus Mitra?",
      text: "Data yang dihapus tidak dapat dikembalikan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#FE4D01",
      cancelButtonColor: "#243771",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`/api/portal/mitra/${id}`);
      Swal.fire("Terhapus!", "Mitra berhasil dihapus.", "success");
      fetchMitra();
    } catch {
      Swal.fire("Gagal", "Tidak dapat menghapus mitra.", "error");
    }
  };

  // === Edit data ===
  const handleEdit = (p: Partner) => {
    setEditId(p.id);
    setForm({
      name: p.name,
      img_id: p.img_id,
      img_en: p.img_en,
      imgIdFile: null,
      imgEnFile: null,
    });
    setModalOpen(true);
  };

  // === Tutup modal ===
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setModalOpen(false);
      }
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
    <main className="min-h-screen bg-gradient-to-br from-[#f5f7ff] via-[#fffdfb] to-[#fff5f0] px-4 py-10 md:px-10">
      <div className="relative z-10 max-w-6xl mx-auto bg-white rounded-md shadow-md border border-gray-100 p-5 sm:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#243771]">
              🤝 Manajemen Mitra Industri
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Kelola seluruh mitra industri sekolah
            </p>
          </div>

          <button
            onClick={() => {
              setForm({});
              setEditId(null);
              setModalOpen(true);
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-[#FE4D01] to-[#ff7433] text-white px-4 py-2 rounded-md font-medium shadow-sm hover:shadow-md transition w-full sm:w-auto justify-center"
          >
            <Plus size={18} /> Tambah Mitra
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border border-gray-200 rounded-md">
          <table className="min-w-full text-sm">
            <thead className="bg-gradient-to-r from-[#243771] to-[#3b5bb1] text-white">
              <tr>
                <th className="p-3 text-center w-[50px]">#</th>
                <th className="p-3">Nama</th>
                <th className="p-3 text-center">Logo (ID)</th>
                <th className="p-3 text-center">Logo (EN)</th>
                <th className="p-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {partners.length > 0 ? (
                partners.map((p, i) => (
                  <tr
                    key={p.id}
                    className="border-b hover:bg-[#f9fafc] transition"
                  >
                    <td className="p-3 text-center font-medium text-[#243771]">
                      {i + 1}
                    </td>
                    <td className="p-3 text-gray-700">{p.name}</td>
                    <td className="p-3 text-center">
                      {p.img_id ? (
                        <img
                          src={p.img_id}
                          alt="Logo ID"
                          className="h-20 w-auto object-contain mx-auto border border-gray-200 rounded-md"
                        />
                      ) : (
                        <span className="text-gray-400 italic">Tidak ada</span>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      {p.img_en ? (
                        <img
                          src={p.img_en}
                          alt="Logo EN"
                          className="h-20 w-auto object-contain mx-auto border border-gray-200 rounded-md"
                        />
                      ) : (
                        <span className="text-gray-400 italic">Tidak ada</span>
                      )}
                    </td>
                    <td className="p-3 flex justify-center gap-2 flex-wrap">
                      <button
                        onClick={() => handleEdit(p)}
                        className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-sm transition w-[42px]"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-sm transition w-[42px]"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-6 text-gray-500 italic"
                  >
                    Belum ada mitra.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div
            ref={modalRef}
            className="bg-white rounded-md w-full max-w-md shadow-2xl border border-gray-200 animate-fadeIn relative z-50"
          >
            {/* Header */}
            <div className="flex justify-between items-center px-5 py-4 border-b border-gray-200 bg-gradient-to-r from-[#243771]/90 to-[#FE4D01]/80 text-white rounded-t-md">
              <h2 className="font-semibold text-lg">
                {editId ? "Edit Mitra" : "Tambah Mitra"}
              </h2>
              <button onClick={() => setModalOpen(false)}>
                <X size={20} className="opacity-80 hover:opacity-100" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              <input
                type="text"
                placeholder="Nama Mitra"
                className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-[#FE4D01] focus:outline-none"
                value={form.name || ""}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1 block">
                    Logo Bahasa Indonesia
                  </label>
                  <input
                    type="file"
                    accept=".webp,.jpg,.jpeg,.png,.svg"
                    className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-[#243771]"
                    onChange={(e) => handleImageUpload(e, "id")}
                  />
                  {(form.imgIdFile || form.img_id) && (
                    <img
                      src={
                        form.imgIdFile
                          ? URL.createObjectURL(form.imgIdFile)
                          : form.img_id || ""
                      }
                      alt="Preview ID"
                      className="mt-2 rounded-md border border-gray-200 w-full h-24 object-contain"
                    />
                  )}
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1 block">
                    Logo Bahasa Inggris
                  </label>
                  <input
                    type="file"
                    accept=".webp,.jpg,.jpeg,.png,.svg"
                    className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-[#243771]"
                    onChange={(e) => handleImageUpload(e, "en")}
                  />
                  {(form.imgEnFile || form.img_en) && (
                    <img
                      src={
                        form.imgEnFile
                          ? URL.createObjectURL(form.imgEnFile)
                          : form.img_en || ""
                      }
                      alt="Preview EN"
                      className="mt-2 rounded-md border border-gray-200 w-full h-24 object-contain"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 px-5 py-4 border-t border-gray-200 bg-gray-50 rounded-b-md">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-sm text-gray-600 hover:bg-gray-100 transition"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className={`px-4 py-2 rounded-sm text-white transition ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-[#FE4D01] to-[#ff7433] hover:scale-[1.03]"
                }`}
              >
                {loading ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
