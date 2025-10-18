"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from "axios";
import { Plus, Pencil, Trash2, Link2, Upload } from "lucide-react";

const MySwal = withReactContent(Swal);

interface EkskulItem {
  id: number;
  name_id: string;
  name_en: string;
  img: string;
  ig: string;
}

export default function EkstrakurikulerAdminPage() {
  const [ekskul, setEkskul] = useState<EkskulItem[]>([]);
  const [form, setForm] = useState<Partial<EkskulItem>>({});
  const [editId, setEditId] = useState<number | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://api.smkprestasiprima.sch.id/api";

  // === Ambil data dari backend ===
  const fetchEkskul = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/ekskul`);
      setEkskul(res.data.data);
    } catch (err) {
      console.error(err);
      MySwal.fire("Gagal", "Tidak dapat memuat data ekstrakurikuler.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEkskul();
  }, []);

  // === Upload Gambar ke Laravel ===
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".webp")) {
      MySwal.fire("Format Salah", "Gunakan gambar berformat .webp", "warning");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/upload/ekskul`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setForm({ ...form, img: res.data.url });
      MySwal.fire("Berhasil", "Gambar berhasil diupload.", "success");
    } catch (err) {
      console.error(err);
      MySwal.fire("Gagal", "Upload gambar gagal.", "error");
    } finally {
      setUploading(false);
    }
  };

  // === Simpan Data (Create / Update) ===
  const handleSave = async () => {
    if (!form.name_id || !form.name_en || !form.img || !form.ig) {
      MySwal.fire("Lengkapi Data", "Semua field wajib diisi!", "warning");
      return;
    }

    try {
      if (editId) {
        await axios.put(`${API_BASE_URL}/ekskul/${editId}`, form);
        MySwal.fire("Berhasil", "Data berhasil diperbarui.", "success");
      } else {
        await axios.post(`${API_BASE_URL}/ekskul`, form);
        MySwal.fire("Berhasil", "Data berhasil ditambahkan.", "success");
      }

      setForm({});
      setEditId(null);
      setModalOpen(false);
      fetchEkskul();
    } catch (err) {
      console.error(err);
      MySwal.fire("Gagal", "Terjadi kesalahan saat menyimpan data.", "error");
    }
  };

  // === Hapus Data ===
  const handleDelete = (id: number) => {
    MySwal.fire({
      title: "Hapus Ekstrakurikuler?",
      text: "Data tidak bisa dikembalikan setelah dihapus.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#FE4D01",
      cancelButtonColor: "#243771",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${API_BASE_URL}/ekskul/${id}`);
          MySwal.fire("Terhapus!", "Data berhasil dihapus.", "success");
          fetchEkskul();
        } catch (err) {
          console.error(err);
          MySwal.fire("Gagal", "Tidak bisa menghapus data.", "error");
        }
      }
    });
  };

  // === Edit Data ===
  const handleEdit = (item: EkskulItem) => {
    setForm(item);
    setEditId(item.id);
    setModalOpen(true);
  };

  return (
    <div className="space-y-8 animate-fadeIn p-6">
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
        {loading ? (
          <div className="text-center py-10 text-gray-500">Memuat data...</div>
        ) : (
          <table className="min-w-full text-sm">
            <thead className="bg-[#243771] text-white text-left">
              <tr>
                <th className="p-3">#</th>
                <th className="p-3">Nama (ID)</th>
                <th className="p-3">Nama (EN)</th>
                <th className="p-3">Logo</th>
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
                    <td className="p-3">{i + 1}</td>
                    <td className="p-3 font-semibold">{item.name_id}</td>
                    <td className="p-3">{item.name_en}</td>
                    <td className="p-3">
                      <Image
                        src={item.img || "/noimg.webp"}
                        alt="logo"
                        width={60}
                        height={60}
                        className="rounded-md border border-gray-200 object-contain"
                        unoptimized
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
                  <td
                    colSpan={6}
                    className="text-center py-6 text-gray-500 italic"
                  >
                    Belum ada data ekstrakurikuler.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* === Modal Tambah/Edit === */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-[95%] max-w-md shadow-xl relative">
            <h2 className="text-xl font-bold text-[#243771] mb-4">
              {editId ? "Edit Ekstrakurikuler" : "Tambah Ekstrakurikuler"}
            </h2>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Nama (Bahasa Indonesia)"
                value={form.name_id || ""}
                onChange={(e) => setForm({ ...form, name_id: e.target.value })}
                className="border p-2 w-full rounded"
              />
              <input
                type="text"
                placeholder="Nama (English)"
                value={form.name_en || ""}
                onChange={(e) => setForm({ ...form, name_en: e.target.value })}
                className="border p-2 w-full rounded"
              />
              <input
                type="url"
                placeholder="Tautan Instagram"
                value={form.ig || ""}
                onChange={(e) => setForm({ ...form, ig: e.target.value })}
                className="border p-2 w-full rounded"
              />

              {/* Upload Gambar */}
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">
                  Upload Gambar (.webp)
                </label>
                <input
                  type="file"
                  accept=".webp"
                  onChange={handleImageUpload}
                  className="w-full border rounded-lg p-2"
                />
                {uploading && (
                  <p className="text-sm text-gray-500 mt-1 italic">
                    Mengupload gambar...
                  </p>
                )}
                {form.img && (
                  <Image
                    src={form.img}
                    alt="Preview"
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
                disabled={uploading}
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
