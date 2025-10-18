"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Swal from "sweetalert2";
import axios from "axios";
import { Pencil, Trash2, Plus, X } from "lucide-react";

interface News {
  id: number;
  title_id: string;
  title_en: string;
  desc_id: string;
  desc_en: string;
  image: string;
  date: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://api.smkprestasiprima.sch.id/api";

export default function AdminNewsPage() {
  const [news, setNews] = useState<News[]>([]);
  const [form, setForm] = useState<Partial<News> & { imageFile?: File | null }>({});
  const [editId, setEditId] = useState<number | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // === Ambil data dari API ===
  const fetchNews = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/news`);
      if (res.data.success) setNews(res.data.data);
    } catch (err) {
      console.error("Gagal memuat berita:", err);
      Swal.fire("Gagal", "Tidak bisa memuat berita.", "error");
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
    if (!allowed.some((ext) => file.name.endsWith(ext))) {
      Swal.fire("Format Salah", "Gunakan gambar .webp, .jpg, atau .png", "warning");
      return;
    }

    setForm((prev) => ({ ...prev, imageFile: file }));
  };

  // === Simpan data (Tambah / Edit) ===
  const handleSave = async () => {
    if (
      !form.title_id ||
      !form.title_en ||
      !form.desc_id ||
      !form.desc_en ||
      !form.date
    ) {
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
      const url = editId
        ? `${API_BASE_URL}/news/${editId}`
        : `${API_BASE_URL}/news`;

      await axios.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.fire(
        "Berhasil!",
        editId ? "Berita berhasil diperbarui." : "Berita berhasil ditambahkan.",
        "success"
      );

      setModalOpen(false);
      setForm({});
      setEditId(null);
      fetchNews();
    } catch (err: any) {
      console.error("Gagal menyimpan berita:", err);
      Swal.fire("Gagal", err.response?.data?.message || "Upload gagal", "error");
    }
  };

  // === Hapus data ===
  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Hapus Berita?",
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
      await axios.delete(`${API_BASE_URL}/news/${id}`);
      Swal.fire("Terhapus!", "Berita berhasil dihapus.", "success");
      fetchNews();
    } catch {
      Swal.fire("Gagal", "Tidak dapat menghapus berita.", "error");
    }
  };

  // === Edit data ===
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

  // === Tutup modal di luar atau ESC ===
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
    <div className="space-y-8 animate-fadeIn p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[#243771]">📰 Manajemen Berita</h1>
        <button
          onClick={() => {
            setForm({});
            setEditId(null);
            setModalOpen(true);
          }}
          className="flex items-center gap-2 bg-[#FE4D01] text-white px-4 py-2 rounded-lg hover:bg-[#fe5d20] transition"
        >
          <Plus size={18} /> Tambah Berita
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-md overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-[#243771] text-white text-left">
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">Judul (ID)</th>
              <th className="p-3">Tanggal</th>
              <th className="p-3 text-center">Gambar</th>
              <th className="p-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {news.length > 0 ? (
              news.map((n, i) => (
                <tr
                  key={n.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition"
                >
                  <td className="p-3">{i + 1}</td>
                  <td className="p-3 font-semibold">{n.title_id}</td>
                  <td className="p-3">{new Date(n.date).toLocaleDateString("id-ID")}</td>
                  <td className="p-3 text-center">
                    {n.image ? (
                      <Image
                        src={n.image}
                        alt={n.title_id}
                        width={100}
                        height={70}
                        className="rounded border object-cover mx-auto"
                      />
                    ) : (
                      <span className="text-gray-400 italic">Tidak ada</span>
                    )}
                  </td>
                  <td className="p-3 flex justify-center gap-2">
                    <button
                      onClick={() => handleEdit(n)}
                      className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(n.id)}
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
                  Belum ada berita.
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
            className="bg-white rounded-2xl p-6 w-[95%] max-w-2xl shadow-xl relative"
          >
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-[#FE4D01]"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-bold text-[#243771] mb-4">
              {editId ? "Edit Berita" : "Tambah Berita"}
            </h2>

            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Judul (Indonesia)"
                  className="border p-2 rounded"
                  value={form.title_id || ""}
                  onChange={(e) => setForm({ ...form, title_id: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Judul (English)"
                  className="border p-2 rounded"
                  value={form.title_en || ""}
                  onChange={(e) => setForm({ ...form, title_en: e.target.value })}
                />
              </div>

              <textarea
                placeholder="Deskripsi (Indonesia)"
                className="border p-2 w-full rounded"
                value={form.desc_id || ""}
                onChange={(e) => setForm({ ...form, desc_id: e.target.value })}
              />
              <textarea
                placeholder="Deskripsi (English)"
                className="border p-2 w-full rounded"
                value={form.desc_en || ""}
                onChange={(e) => setForm({ ...form, desc_en: e.target.value })}
              />

              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="date"
                  className="border p-2 rounded"
                  value={form.date || ""}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
                <input
                  type="file"
                  accept=".webp,.jpg,.png"
                  className="border p-2 rounded"
                  onChange={handleImageUpload}
                />
              </div>

              {form.image || form.imageFile ? (
                <div className="mt-2 text-center">
                  <Image
                    src={
                      form.imageFile
                        ? URL.createObjectURL(form.imageFile)
                        : (form.image as string)
                    }
                    alt="Preview"
                    width={300}
                    height={160}
                    className="rounded border object-cover mx-auto"
                  />
                </div>
              ) : null}
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
