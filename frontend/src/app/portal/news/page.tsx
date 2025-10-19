"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Swal from "sweetalert2";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import api from "@/app/lib/api"; // ✅ langsung pakai API global (bukan route proxy)

interface News {
  id: number;
  title_id: string;
  title_en: string;
  desc_id: string;
  desc_en: string;
  date: string;
  image: string;
}

export default function AdminNewsPage() {
  const [news, setNews] = useState<News[]>([]);
  const [form, setForm] = useState<Partial<News> & { imageFile?: File | null }>({});
  const [editId, setEditId] = useState<number | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // === Fetch data dari API Laravel ===
  const fetchNews = async () => {
    try {
      const res = await api.get("/news");
      if (res.data.success || Array.isArray(res.data.data)) {
        setNews(res.data.data || res.data);
      } else {
        console.warn("⚠️ Format data berita tidak sesuai:", res.data);
      }
    } catch (err) {
      console.error("❌ Gagal memuat berita:", err);
      Swal.fire("Gagal", "Tidak bisa memuat berita dari server.", "error");
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  // === Upload handler ===
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowed = [".webp", ".jpg", ".jpeg", ".png"];
    if (!allowed.some((ext) => file.name.toLowerCase().endsWith(ext))) {
      Swal.fire("Format Salah", "Gunakan gambar .webp, .jpg, atau .png", "warning");
      return;
    }
    setForm((prev) => ({ ...prev, imageFile: file }));
  };

  // === Save (Create / Update langsung ke API Laravel) ===
  const handleSave = async () => {
    if (!form.title_id || !form.title_en || !form.desc_id || !form.desc_en || !form.date) {
      Swal.fire("Lengkapi Data", "Semua field wajib diisi!", "warning");
      return;
    }

    const formData = new FormData();
    formData.append("title_id", form.title_id);
    formData.append("title_en", form.title_en);
    formData.append("desc_id", form.desc_id);
    formData.append("desc_en", form.desc_en);
    formData.append("date", form.date);
    if (form.imageFile) formData.append("image", form.imageFile);

    try {
      if (editId) {
        // Laravel biasanya pakai spoof _method=PUT
        formData.append("_method", "PUT");
        await api.post(`/news/${editId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/news", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      Swal.fire("Berhasil!", editId ? "Berita diperbarui." : "Berita ditambahkan.", "success");
      setModalOpen(false);
      setForm({});
      setEditId(null);
      fetchNews();
    } catch (err: any) {
      console.error("❌ Gagal menyimpan:", err);
      Swal.fire("Gagal", err.response?.data?.message || "Upload gagal", "error");
    }
  };

  // === Delete ===
  const handleDelete = async (id: number) => {
    const confirm = await Swal.fire({
      title: "Hapus Berita?",
      text: "Data yang dihapus tidak bisa dikembalikan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#FE4D01",
      cancelButtonColor: "#243771",
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
    });
    if (!confirm.isConfirmed) return;

    try {
      await api.delete(`/news/${id}`);
      Swal.fire("Terhapus!", "Berita berhasil dihapus.", "success");
      fetchNews();
    } catch (err: any) {
      console.error("❌ Gagal menghapus:", err);
      Swal.fire("Gagal", err.response?.data?.message || "Tidak dapat menghapus berita.", "error");
    }
  };

  // === Edit ===
  const handleEdit = (n: News) => {
    setEditId(n.id);
    setForm({
      title_id: n.title_id,
      title_en: n.title_en,
      desc_id: n.desc_id,
      desc_en: n.desc_en,
      date: n.date,
      image: n.image,
      imageFile: null,
    });
    setModalOpen(true);
  };

  // === Close modal if click outside / Esc ===
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

  // === UI ===
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#f5f7ff] via-[#fffdfb] to-[#fff5f0] px-4 py-10 md:px-10">
      <div className="max-w-6xl mx-auto bg-white rounded-md shadow-md border border-gray-100 p-5 sm:p-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#243771]">📰 Manajemen Berita</h1>
            <p className="text-gray-500 text-sm mt-1">Kelola seluruh berita sekolah</p>
          </div>
          <button
            onClick={() => {
              setForm({});
              setEditId(null);
              setModalOpen(true);
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-[#FE4D01] to-[#ff7433] text-white px-4 py-2 rounded-md font-medium shadow-sm hover:shadow-md transition w-full sm:w-auto justify-center"
          >
            <Plus size={18} /> Tambah Berita
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border border-gray-200 rounded-md">
          <table className="min-w-full text-sm">
            <thead className="bg-gradient-to-r from-[#243771] to-[#3b5bb1] text-white">
              <tr>
                <th className="p-3 text-center w-[50px]">#</th>
                <th className="p-3">Judul (ID)</th>
                <th className="p-3 text-center">Tanggal</th>
                <th className="p-3 text-center">Gambar</th>
                <th className="p-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {news.length > 0 ? (
                news.map((n, i) => (
                  <tr key={n.id} className="border-b hover:bg-[#f9fafc] transition">
                    <td className="p-3 text-center font-medium text-[#243771]">{i + 1}</td>
                    <td className="p-3 text-gray-700">{n.title_id}</td>
                    <td className="p-3 text-center text-gray-600">
                      {new Date(n.date).toLocaleDateString("id-ID")}
                    </td>
                    <td className="p-3 text-center">
                      {n.image ? (
                        <Image
                          src={
                            n.image.startsWith("http")
                              ? n.image
                              : `https://api.smkprestasiprima.sch.id${n.image}`
                          }
                          alt={n.title_id}
                          width={100}
                          height={70}
                          className="rounded-sm border border-gray-200 object-cover mx-auto"
                        />
                      ) : (
                        <span className="text-gray-400 italic">Tidak ada</span>
                      )}
                    </td>
                    <td className="p-3 flex justify-center gap-2 flex-wrap">
                      <button
                        onClick={() => handleEdit(n)}
                        className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-sm transition w-[42px]"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(n.id)}
                        className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-sm transition w-[42px]"
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
      </div>

      {/* Modal Input */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div
            ref={modalRef}
            className="bg-white rounded-md w-full max-w-2xl shadow-2xl border border-gray-200 animate-fadeIn relative z-50"
          >
            {/* Header */}
            <div className="flex justify-between items-center px-5 py-4 border-b border-gray-200 bg-gradient-to-r from-[#243771]/90 to-[#FE4D01]/80 text-white rounded-t-md">
              <h2 className="font-semibold text-lg">{editId ? "Edit Berita" : "Tambah Berita"}</h2>
              <button onClick={() => setModalOpen(false)}>
                <X size={20} className="opacity-80 hover:opacity-100" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Judul (Indonesia)"
                  className="border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-[#FE4D01]"
                  value={form.title_id || ""}
                  onChange={(e) => setForm({ ...form, title_id: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Judul (English)"
                  className="border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-[#FE4D01]"
                  value={form.title_en || ""}
                  onChange={(e) => setForm({ ...form, title_en: e.target.value })}
                />
              </div>

              <textarea
                placeholder="Deskripsi (Indonesia)"
                className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-[#243771]"
                rows={3}
                value={form.desc_id || ""}
                onChange={(e) => setForm({ ...form, desc_id: e.target.value })}
              />
              <textarea
                placeholder="Deskripsi (English)"
                className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-[#243771]"
                rows={3}
                value={form.desc_en || ""}
                onChange={(e) => setForm({ ...form, desc_en: e.target.value })}
              />

              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="date"
                  className="border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-[#FE4D01]"
                  value={form.date || ""}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
                <input
                  type="file"
                  accept=".webp,.jpg,.jpeg,.png"
                  className="border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-[#243771]"
                  onChange={handleImageUpload}
                />
              </div>

              {(form.image || form.imageFile) && (
                <div className="text-center mt-2">
                  <Image
                    src={
                      form.imageFile
                        ? URL.createObjectURL(form.imageFile)
                        : form.image?.startsWith("http")
                        ? form.image
                        : `https://api.smkprestasiprima.sch.id${form.image}`
                    }
                    alt="Preview"
                    width={300}
                    height={160}
                    className="rounded-sm border border-gray-200 object-cover mx-auto"
                  />
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex flex-col sm:flex-row sm:justify-end gap-3 px-5 py-4 border-t border-gray-200 bg-gray-50 rounded-b-md">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-sm text-gray-600 hover:bg-gray-100 transition"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-gradient-to-r from-[#FE4D01] to-[#ff7433] text-white rounded-sm hover:scale-[1.03] transition"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
