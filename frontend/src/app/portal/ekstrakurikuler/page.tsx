"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Swal from "sweetalert2";
import { Plus, Pencil, Trash2 } from "lucide-react";
import API from "../../lib/axios"; // ✅ pakai axios instance baru

interface PrestasiItem {
  id: number;
  poster: string;
}

export default function PrestasiAdminPage() {
  const [prestasi, setPrestasi] = useState<PrestasiItem[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);

  // === Fetch Prestasi ===
  const fetchPrestasi = async () => {
    try {
      const res = await API.get("/prestasi");
      if (res.data.success) {
        setPrestasi(res.data.data.data || res.data.data);
      }
    } catch (err: any) {
      console.error("Gagal load data prestasi:", err);
      Swal.fire(
        "Sesi Habis",
        "Silakan login ulang untuk mengakses portal.",
        "warning"
      );
    }
  };

  useEffect(() => {
    fetchPrestasi();
  }, []);

  // === Upload file ===
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.name.endsWith(".webp")) {
      Swal.fire("Format Salah", "Gunakan gambar .webp", "warning");
      return;
    }
    setFile(f);
  };

  // === Simpan / Update ===
  const handleSave = async () => {
    if (!file) {
      Swal.fire("Lengkapi Data", "Upload gambar terlebih dahulu", "warning");
      return;
    }

    const formData = new FormData();
    formData.append("poster", file);

    try {
      if (editId) {
        await API.post(`/prestasi/${editId}?_method=PUT`, formData);
        Swal.fire("Berhasil", "Prestasi diperbarui", "success");
      } else {
        await API.post("/prestasi", formData);
        Swal.fire("Berhasil", "Prestasi baru ditambahkan", "success");
      }
      setFile(null);
      setEditId(null);
      setModalOpen(false);
      fetchPrestasi();
    } catch (err: any) {
      Swal.fire("Gagal", err.response?.data?.message || "Upload gagal", "error");
    }
  };

  // === Hapus ===
  const handleDelete = async (id: number) => {
    const confirm = await Swal.fire({
      title: "Hapus Prestasi?",
      text: "Data tidak bisa dikembalikan setelah dihapus.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#FE4D01",
      cancelButtonColor: "#243771",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    });
    if (!confirm.isConfirmed) return;

    try {
      await API.delete(`/prestasi/${id}`);
      Swal.fire("Terhapus!", "Prestasi berhasil dihapus.", "success");
      fetchPrestasi();
    } catch {
      Swal.fire("Gagal", "Token tidak valid atau sesi sudah habis", "error");
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[#243771]">🏆 Manajemen Prestasi</h1>
        <button
          onClick={() => {
            setFile(null);
            setEditId(null);
            setModalOpen(true);
          }}
          className="flex items-center gap-2 bg-[#FE4D01] text-white px-4 py-2 rounded-lg hover:bg-[#fe5d20] transition"
        >
          <Plus size={18} /> Tambah Prestasi
        </button>
      </div>

      {/* Tabel */}
      <div className="bg-white rounded-2xl shadow-md overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-[#243771] text-white text-left">
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">Poster</th>
              <th className="p-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {prestasi.length > 0 ? (
              prestasi.map((item, i) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition"
                >
                  <td className="p-3 font-medium">{i + 1}</td>
                  <td className="p-3">
                    <Image
                      src={item.poster}
                      alt={`Prestasi ${item.id}`}
                      width={120}
                      height={120}
                      className="rounded-md border border-gray-200 object-contain"
                    />
                  </td>
                  <td className="p-3 flex justify-center gap-2">
                    <button
                      onClick={() => {
                        setEditId(item.id);
                        setModalOpen(true);
                      }}
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
                <td colSpan={3} className="text-center py-6 text-gray-500 italic">
                  Belum ada data prestasi.
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
              {editId ? "Edit Prestasi" : "Tambah Prestasi"}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">
                  Upload Gambar (.webp)
                </label>
                <input
                  type="file"
                  accept=".webp"
                  onChange={handleFileChange}
                  className="w-full border rounded-lg p-2"
                />
                {file && (
                  <Image
                    src={URL.createObjectURL(file)}
                    alt="Preview"
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
