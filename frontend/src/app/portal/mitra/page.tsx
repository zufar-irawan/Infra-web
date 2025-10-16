"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import Swal from "sweetalert2";
import { Plus, Pencil, Trash2 } from "lucide-react";

interface Partner {
  id: number;
  name: string;
  img_id: string;
  img_en: string;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
const BASE_URL = API_BASE_URL.replace("/api", ""); // 👉 base Laravel tanpa /api

export default function MitraPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [form, setForm] = useState<Partial<Partner>>({});
  const [editId, setEditId] = useState<number | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // === Ambil Data dari API ===
  const fetchData = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/mitra`);
      if (res.data.success) setPartners(res.data.data);
    } catch (err) {
      console.error("Gagal mengambil data mitra:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // === Upload file handler ===
  const [fileID, setFileID] = useState<File | null>(null);
  const [fileEN, setFileEN] = useState<File | null>(null);

  // === Simpan (Tambah / Edit) ===
  const handleSave = async () => {
    if (!form.name || (!fileID && !editId) || (!fileEN && !editId)) {
      Swal.fire("Lengkapi Data", "Semua field wajib diisi!", "warning");
      return;
    }

    const formData = new FormData();
    formData.append("name", form.name || "");
    if (fileID) formData.append("img_id", fileID);
    if (fileEN) formData.append("img_en", fileEN);

    try {
      if (editId) {
        await axios.post(`${API_BASE_URL}/mitra/${editId}?_method=PUT`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        Swal.fire("Berhasil", "Data mitra berhasil diperbarui.", "success");
      } else {
        await axios.post(`${API_BASE_URL}/mitra`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        Swal.fire("Berhasil", "Data mitra berhasil ditambahkan.", "success");
      }

      setForm({});
      setFileID(null);
      setFileEN(null);
      setEditId(null);
      setModalOpen(false);
      fetchData();
    } catch (err) {
      console.error(err);
      Swal.fire("Gagal", "Terjadi kesalahan saat menyimpan data.", "error");
    }
  };

  // === Edit Data ===
  const handleEdit = (partner: Partner) => {
    setForm({ name: partner.name });
    setEditId(partner.id);
    setModalOpen(true);
  };

  // === Hapus Data ===
  const handleDelete = async (id: number) => {
    Swal.fire({
      title: "Hapus Mitra?",
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
          await axios.delete(`${API_BASE_URL}/mitra/${id}`);
          Swal.fire("Terhapus!", "Data mitra berhasil dihapus.", "success");
          fetchData();
        } catch {
          Swal.fire("Gagal", "Tidak dapat menghapus mitra.", "error");
        }
      }
    });
  };

  return (
    <div className="space-y-8 animate-fadeIn p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[#243771]">
          🤝 Manajemen Mitra Industri
        </h1>
        <button
          onClick={() => {
            setForm({});
            setFileID(null);
            setFileEN(null);
            setEditId(null);
            setModalOpen(true);
          }}
          className="flex items-center gap-2 bg-[#FE4D01] text-white px-4 py-2 rounded-lg hover:bg-[#fe5d20] transition"
        >
          <Plus size={18} /> Tambah Mitra
        </button>
      </div>

      {/* Table */}
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
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-6">
                  Memuat data...
                </td>
              </tr>
            ) : partners.length > 0 ? (
              partners.map((p, i) => (
                <tr
                  key={p.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition"
                >
                  <td className="p-3 font-medium">{i + 1}</td>
                  <td className="p-3 font-semibold">{p.name}</td>
                  <td className="p-3">
                    <Image
                      src={`${BASE_URL}${p.img_id}`}
                      alt="Logo ID"
                      width={80}
                      height={80}
                      className="rounded-md border border-gray-200 object-contain"
                      unoptimized
                    />
                  </td>
                  <td className="p-3">
                    <Image
                      src={`${BASE_URL}${p.img_en}`}
                      alt="Logo EN"
                      width={80}
                      height={80}
                      className="rounded-md border border-gray-200 object-contain"
                      unoptimized
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
                <td
                  colSpan={5}
                  className="text-center py-6 text-gray-500 italic"
                >
                  Belum ada data mitra.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-[95%] max-w-md shadow-xl relative">
            <h2 className="text-xl font-bold text-[#243771] mb-4">
              {editId ? "Edit Mitra Industri" : "Tambah Mitra Industri"}
            </h2>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Nama Mitra"
                value={form.name || ""}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border rounded-lg p-2"
              />

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Logo Bahasa Indonesia (.webp)
                </label>
                <input
                  type="file"
                  accept=".webp"
                  onChange={(e) => setFileID(e.target.files?.[0] || null)}
                  className="w-full border rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Logo Bahasa Inggris (.webp)
                </label>
                <input
                  type="file"
                  accept=".webp"
                  onChange={(e) => setFileEN(e.target.files?.[0] || null)}
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
