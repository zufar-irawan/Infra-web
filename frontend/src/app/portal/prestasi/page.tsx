"use client";

import { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { Plus, Pencil, Trash2, X } from "lucide-react";

interface Achievement {
  id: number;
  poster: string; // contoh: "storage/achievements/namafile.webp"
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
const BASE_URL = API_BASE_URL.replace(/\/api$/, "");

export default function PrestasiPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // === Ambil data dari API ===
  const fetchAchievements = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/achievements`);
      if (res.data.success) setAchievements(res.data.data);
    } catch (err) {
      console.error("Gagal memuat data prestasi:", err);
      Swal.fire("Gagal", "Tidak bisa memuat data prestasi", "error");
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  // === Upload handler ===
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.name.endsWith(".webp")) {
      Swal.fire("Format Salah", "Gunakan gambar berformat .webp", "warning");
      return;
    }
    setFile(f);
  };

  // === Simpan (Tambah / Edit) ===
  const handleSave = async () => {
    if (!file) {
      Swal.fire("Lengkapi Data", "Upload gambar terlebih dahulu.", "warning");
      return;
    }

    const formData = new FormData();
    formData.append("poster", file);

    try {
      const url = editId
        ? `${API_BASE_URL}/achievements/${editId}`
        : `${API_BASE_URL}/achievements`;

      await axios.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.fire(
        "Berhasil!",
        editId ? "Data prestasi diperbarui." : "Data prestasi ditambahkan.",
        "success"
      );

      setModalOpen(false);
      setFile(null);
      setEditId(null);
      fetchAchievements();
    } catch (err: any) {
      console.error("Gagal menyimpan data:", err);
      Swal.fire("Gagal", err.response?.data?.message || "Upload gagal", "error");
    }
  };

  // === Edit ===
  const handleEdit = (item: Achievement) => {
    setEditId(item.id);
    setFile(null);
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
      await axios.delete(`${API_BASE_URL}/achievements/${id}`);
      Swal.fire("Terhapus!", "Data prestasi telah dihapus.", "success");
      fetchAchievements();
    } catch (err) {
      Swal.fire("Gagal", "Tidak dapat menghapus prestasi.", "error");
    }
  };

  // === Tutup modal di luar / tekan ESC ===
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
              <th className="p-3 text-center">Poster</th>
              <th className="p-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {achievements.length > 0 ? (
              achievements.map((a, i) => (
                <tr key={a.id} className="border-b hover:bg-gray-50 transition">
                  <td className="p-3 font-medium">{i + 1}</td>
                  <td className="p-3 text-center">
                    <img
                      src={
                        a.poster.startsWith("http")
                          ? a.poster
                          : `${BASE_URL}/${a.poster.replace(/^\/+/, "")}`
                      }
                      alt={`Prestasi ${a.id}`}
                      className="w-[120px] h-auto rounded-md border object-contain mx-auto"
                    />
                  </td>
                  <td className="p-3 flex justify-center gap-2">
                    <button
                      onClick={() => handleEdit(a)}
                      className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(a.id)}
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
                className="px-4 py-2 bg-[#FE4D01] text-white rounded-lg hover:bg-[#fe5d20] transition"
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
