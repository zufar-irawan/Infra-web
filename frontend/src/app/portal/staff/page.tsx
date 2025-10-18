"use client";

import { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { Plus, Pencil, Trash2, X } from "lucide-react";

interface Staff {
  id: number;
  img_id: string;
  img_en: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://api.smkprestasiprima.sch.id/api";

export default function StaffPage() {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [form, setForm] = useState<{ img_id: File | null; img_en: File | null }>({
    img_id: null,
    img_en: null,
  });
  const [editId, setEditId] = useState<number | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // === Fetch data dari backend ===
  const fetchStaff = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/management`);
      if (res.data.success) setStaffList(res.data.data);
    } catch (err) {
      console.error("Gagal memuat data staff:", err);
      Swal.fire("Gagal", "Tidak bisa memuat data staff", "error");
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  // === Upload handler ===
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, type: "id" | "en") => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith(".webp")) {
      Swal.fire("Format Salah", "Gunakan gambar berformat .webp", "warning");
      return;
    }
    setForm((prev) => ({ ...prev, [type === "id" ? "img_id" : "img_en"]: file }));
  };

  // === Simpan data (tambah / update) ===
  const handleSave = async () => {
    if (!form.img_id || !form.img_en) {
      Swal.fire("Lengkapi Data", "Upload gambar untuk kedua bahasa!", "warning");
      return;
    }

    const formData = new FormData();
    formData.append("img_id", form.img_id);
    formData.append("img_en", form.img_en);

    try {
      const url = editId
        ? `${API_BASE_URL}/management/${editId}`
        : `${API_BASE_URL}/management`;

      await axios.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.fire(
        "Berhasil!",
        editId ? "Data staff diperbarui." : "Data staff ditambahkan.",
        "success"
      );

      setForm({ img_id: null, img_en: null });
      setEditId(null);
      setModalOpen(false);
      fetchStaff();
    } catch (err: any) {
      console.error("Gagal menyimpan data:", err);
      Swal.fire("Gagal", err.response?.data?.message || "Upload gagal", "error");
    }
  };

  // === Hapus data ===
  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Hapus Staff?",
      text: "Data tidak dapat dikembalikan setelah dihapus.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#FE4D01",
      cancelButtonColor: "#243771",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`${API_BASE_URL}/management/${id}`);
      Swal.fire("Terhapus!", "Data staff berhasil dihapus.", "success");
      fetchStaff();
    } catch (err) {
      Swal.fire("Gagal", "Tidak dapat menghapus staff.", "error");
    }
  };

  // === Tutup modal jika klik luar / Esc ===
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
    <div className="min-h-screen bg-white">
      <div className="w-full flex justify-center">
        <div className="w-full max-w-6xl px-8 py-10 space-y-10 animate-fadeIn">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 pb-4">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#243771]">
              👩‍🏫 Manajemen Staff
            </h1>
            <button
              onClick={() => {
                setEditId(null);
                setForm({ img_id: null, img_en: null });
                setModalOpen(true);
              }}
              className="flex items-center gap-2 bg-gradient-to-r from-[#FE4D01] to-[#FE7A32] text-white px-6 py-2.5 rounded-md shadow-md hover:scale-105 transition"
            >
              <Plus size={18} /> Tambah Staff
            </button>
          </div>

          {/* Tabel Staff */}
          <div className="bg-white border border-gray-200 rounded-md shadow-sm overflow-x-auto">
            <table className="min-w-full text-sm table-fixed align-middle">
              <thead className="bg-gradient-to-r from-[#243771] to-[#3A4FA3] text-white">
                <tr>
                  <th className="p-3 text-center">No</th>
                  <th className="p-3 text-center">Gambar (ID)</th>
                  <th className="p-3 text-center">Gambar (EN)</th>
                  <th className="p-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {staffList.length > 0 ? (
                  staffList.map((s, i) => (
                    <tr key={s.id} className="border-b hover:bg-gray-50 transition">
                      <td className="p-3 text-center font-semibold">{i + 1}</td>
                      <td className="p-3 text-center">
                        <img
                          src={s.img_id}
                          alt="ID"
                          className="h-24 mx-auto object-contain rounded-lg border"
                        />
                      </td>
                      <td className="p-3 text-center">
                        <img
                          src={s.img_en}
                          alt="EN"
                          className="h-24 mx-auto object-contain rounded-lg border"
                        />
                      </td>
                      <td className="p-3 text-center flex justify-center gap-2">
                        <button
                          onClick={() => {
                            setEditId(s.id);
                            setModalOpen(true);
                          }}
                          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(s.id)}
                          className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center py-6 text-gray-500 italic">
                      Belum ada data staff.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Tambah/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div
            ref={modalRef}
            className="relative bg-white border border-gray-200 rounded-lg p-7 w-[95%] max-w-md shadow-xl"
          >
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-[#FE4D01]"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-semibold text-[#243771] mb-5 text-center">
              {editId ? "Edit Data Staff" : "Tambah Staff"}
            </h2>

            <div className="space-y-5">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1 block">
                  Gambar Bahasa Indonesia (.webp)
                </label>
                <input
                  type="file"
                  accept=".webp"
                  onChange={(e) => handleImageChange(e, "id")}
                  className="w-full border border-gray-300 rounded-lg p-2"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1 block">
                  Gambar Bahasa Inggris (.webp)
                </label>
                <input
                  type="file"
                  accept=".webp"
                  onChange={(e) => handleImageChange(e, "en")}
                  className="w-full border border-gray-300 rounded-lg p-2"
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
                className="px-4 py-2 bg-gradient-to-r from-[#FE4D01] to-[#FE7A32] text-white rounded-lg font-semibold hover:scale-105 transition"
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
