"use client";

import { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import { Plus, Pencil, Trash2, X } from "lucide-react";

interface Achievement {
  id: number;
  poster: string;
}

export default function PrestasiPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // === Ambil data dari API Next.js Proxy ===
  const fetchAchievements = async () => {
    try {
      const res = await fetch("/api/portal/prestasi", { cache: "no-store" });
      const json = await res.json();

      if (json.success) setAchievements(json.data);
      else throw new Error(json.message);
    } catch (err) {
      console.error("❌ Gagal memuat data prestasi:", err);
      Swal.fire("Gagal", "Tidak bisa memuat data prestasi", "error");
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  // === File upload handler ===
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.name.endsWith(".webp")) {
      Swal.fire("Format Salah", "Gunakan gambar berformat .webp", "warning");
      return;
    }
    setFile(f);
  };

  // === Simpan data ===
  const handleSave = async () => {
    if (!file) {
      Swal.fire("Lengkapi Data", "Upload gambar terlebih dahulu.", "warning");
      return;
    }

    const formData = new FormData();
    formData.append("poster", file);

    try {
      let res;
      if (editId) {
        // UPDATE pakai spoof _method=PUT
        formData.append("_method", "PUT");
        res = await fetch(`/api/portal/prestasi/${editId}`, {
          method: "POST",
          body: formData,
        });
      } else {
        // CREATE baru
        res = await fetch(`/api/portal/prestasi`, {
          method: "POST",
          body: formData,
        });
      }

      const json = await res.json();
      if (json.success) {
        Swal.fire(
          "Berhasil!",
          editId ? "Data prestasi diperbarui." : "Data prestasi ditambahkan.",
          "success"
        );
        setModalOpen(false);
        setFile(null);
        setEditId(null);
        fetchAchievements();
      } else {
        throw new Error(json.message);
      }
    } catch (err: any) {
      console.error("❌ Gagal menyimpan data:", err);
      Swal.fire("Gagal", err.message || "Upload gagal", "error");
    }
  };

  // === Edit & Delete ===
  const handleEdit = (item: Achievement) => {
    setEditId(item.id);
    setFile(null);
    setModalOpen(true);
  };

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
      const res = await fetch(`/api/portal/prestasi/${id}`, { method: "DELETE" });
      const json = await res.json();

      if (json.success) {
        Swal.fire("Terhapus!", "Data prestasi telah dihapus.", "success");
        fetchAchievements();
      } else {
        throw new Error(json.message);
      }
    } catch (err) {
      Swal.fire("Gagal", "Tidak dapat menghapus prestasi.", "error");
    }
  };

  // === Tutup modal dengan klik luar / ESC ===
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node))
        setModalOpen(false);
    };
    const handleEsc = (e: KeyboardEvent) =>
      e.key === "Escape" && setModalOpen(false);
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
      <div className="max-w-6xl mx-auto bg-white rounded-md shadow-md border border-gray-100 p-5 sm:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#243771]">
              🏆 Manajemen Prestasi
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Kelola seluruh data prestasi sekolah
            </p>
          </div>

          <button
            onClick={() => {
              setFile(null);
              setEditId(null);
              setModalOpen(true);
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-[#FE4D01] to-[#ff7433] text-white px-4 py-2 rounded-md font-medium shadow-sm hover:shadow-md transition w-full sm:w-auto justify-center"
          >
            <Plus size={18} /> Tambah Prestasi
          </button>
        </div>

        {/* Tabel */}
        <div className="overflow-x-auto border border-gray-200 rounded-md">
          <table className="min-w-full text-sm">
            <thead className="bg-gradient-to-r from-[#243771] to-[#3b5bb1] text-white">
              <tr>
                <th className="p-3 w-[60px] text-center">#</th>
                <th className="p-3 text-center">Poster</th>
                <th className="p-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {achievements.length > 0 ? (
                achievements.map((a, i) => (
                  <tr
                    key={a.id}
                    className="border-b hover:bg-[#f9fafc] transition"
                  >
                    <td className="p-3 text-center font-medium text-[#243771]">
                      {i + 1}
                    </td>
                    <td className="p-3 text-center">
                      <img
                        src={
                          a.poster.startsWith("http")
                            ? a.poster
                            : `/storage/${a.poster}`
                        }
                        alt={`Prestasi ${a.id}`}
                        className="w-[100px] h-auto rounded-md border border-gray-200 object-contain mx-auto"
                      />
                    </td>
                    <td className="p-3 flex justify-center gap-2 flex-wrap">
                      <button
                        onClick={() => handleEdit(a)}
                        className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-sm transition w-[42px]"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(a.id)}
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
                    colSpan={3}
                    className="text-center py-6 text-gray-500 italic"
                  >
                    Belum ada data prestasi.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div
            ref={modalRef}
            className="bg-white rounded-md w-full max-w-md shadow-2xl border border-gray-200 animate-fadeIn"
          >
            <div className="flex justify-between items-center px-5 py-4 border-b border-gray-200 bg-gradient-to-r from-[#243771]/90 to-[#FE4D01]/80 text-white">
              <h2 className="font-semibold text-lg">
                {editId ? "Edit Prestasi" : "Tambah Prestasi"}
              </h2>
              <button onClick={() => setModalOpen(false)}>
                <X size={20} className="opacity-80 hover:opacity-100" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1 block">
                  Upload Gambar (.webp)
                </label>
                <input
                  type="file"
                  accept=".webp"
                  onChange={handleFileChange}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#FE4D01] focus:outline-none transition"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-end gap-3 px-5 py-4 border-t border-gray-200 bg-gray-50">
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
