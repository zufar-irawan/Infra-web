"use client";

import { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from "axios";
import { Pencil, Trash2, Plus, X } from "lucide-react";

const MySwal = withReactContent(Swal);

interface FaqItem {
  id: number;
  q_id: string;
  a_id: string;
  q_en: string;
  a_en: string;
}

export default function AdminFaqPage() {
  const [faqList, setFaqList] = useState<FaqItem[]>([]);
  const [form, setForm] = useState<Partial<FaqItem>>({});
  const [editId, setEditId] = useState<number | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  /**
   * ==========================================
   * 🔹 Ambil data FAQ via API Route Next.js
   * ==========================================
   */
  const fetchFaqs = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/portal/faq");
      const data = res.data?.data || res.data;
      if (Array.isArray(data)) setFaqList(data);
      else if (data?.data) setFaqList(data.data);
      else setFaqList([]);
    } catch (err) {
      console.error("❌ Gagal memuat FAQ:", err);
      MySwal.fire("Gagal", "Tidak bisa memuat data FAQ.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  /**
   * ==========================================
   * 🔹 Tambah / Update FAQ
   * ==========================================
   */
  const handleSave = async () => {
    if (!form.q_id || !form.a_id || !form.q_en || !form.a_en) {
      MySwal.fire("Lengkapi Data", "Semua field wajib diisi!", "warning");
      return;
    }

    try {
      if (editId) {
        // Update FAQ → PUT ke route proxy Next.js
        await axios.put(`/api/portal/faq/${editId}`, form);
        MySwal.fire("Berhasil", "FAQ berhasil diperbarui.", "success");
      } else {
        // Tambah FAQ → POST ke route proxy Next.js
        await axios.post("/api/portal/faq", form);
        MySwal.fire("Berhasil", "FAQ berhasil ditambahkan.", "success");
      }

      setForm({});
      setEditId(null);
      setModalOpen(false);
      fetchFaqs();
    } catch (err: any) {
      console.error("❌ Gagal menyimpan FAQ:", err);
      MySwal.fire(
        "Gagal",
        err.response?.data?.message || "Terjadi kesalahan saat menyimpan data.",
        "error"
      );
    }
  };

  /**
   * ==========================================
   * 🔹 Hapus FAQ
   * ==========================================
   */
  const handleDelete = async (id: number) => {
    const confirm = await MySwal.fire({
      title: "Hapus FAQ?",
      text: "Data yang dihapus tidak dapat dikembalikan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#FE4D01",
      cancelButtonColor: "#243771",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axios.delete(`/api/portal/faq/${id}`);
      MySwal.fire("Terhapus!", "FAQ berhasil dihapus.", "success");
      fetchFaqs();
    } catch (err: any) {
      console.error("❌ Gagal menghapus FAQ:", err);
      MySwal.fire(
        "Gagal",
        err.response?.data?.message || "Tidak dapat menghapus FAQ.",
        "error"
      );
    }
  };

  /**
   * ==========================================
   * 🔹 Edit FAQ
   * ==========================================
   */
  const handleEdit = (f: FaqItem) => {
    setForm(f);
    setEditId(f.id);
    setModalOpen(true);
  };

  /**
   * ==========================================
   * 🔹 Tutup modal klik luar / ESC
   * ==========================================
   */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setModalOpen(false);
      }
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

  /**
   * ==========================================
   * 🔹 UI
   * ==========================================
   */
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#f5f7ff] via-[#fffdfb] to-[#fff5f0] px-4 py-10 md:px-10">
      <div className="max-w-6xl mx-auto bg-white rounded-md shadow-md border border-gray-100 p-5 sm:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#243771]">
              ❓ Manajemen FAQ
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Kelola daftar pertanyaan umum untuk portal
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
            <Plus size={18} /> Tambah FAQ
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border border-gray-200 rounded-md">
          {loading ? (
            <div className="text-center py-10 text-gray-500">
              Memuat data...
            </div>
          ) : (
            <table className="min-w-full text-sm">
              <thead className="bg-gradient-to-r from-[#243771] to-[#3b5bb1] text-white">
                <tr>
                  <th className="p-3 text-center w-[50px]">#</th>
                  <th className="p-3">Pertanyaan (ID)</th>
                  <th className="p-3">Jawaban (ID)</th>
                  <th className="p-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {faqList.length > 0 ? (
                  faqList.map((f, i) => (
                    <tr
                      key={f.id}
                      className="border-b hover:bg-[#f9fafc] transition"
                    >
                      <td className="p-3 text-center font-medium text-[#243771]">
                        {i + 1}
                      </td>
                      <td className="p-3 font-medium text-gray-700">
                        {f.q_id}
                      </td>
                      <td className="p-3 text-gray-600 truncate max-w-[300px]">
                        {f.a_id}
                      </td>
                      <td className="p-3 flex justify-center gap-2 flex-wrap">
                        <button
                          onClick={() => handleEdit(f)}
                          className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-sm transition w-[42px]"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(f.id)}
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
                      colSpan={4}
                      className="text-center py-6 text-gray-500 italic"
                    >
                      Belum ada FAQ.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal Tambah/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div
            ref={modalRef}
            className="bg-white rounded-md w-full max-w-2xl shadow-2xl border border-gray-200 animate-fadeIn"
          >
            {/* Header modal */}
            <div className="flex justify-between items-center px-5 py-4 border-b border-gray-200 bg-gradient-to-r from-[#243771]/90 to-[#FE4D01]/80 text-white">
              <h2 className="font-semibold text-lg">
                {editId ? "Edit FAQ" : "Tambah FAQ"}
              </h2>
              <button onClick={() => setModalOpen(false)}>
                <X size={20} className="opacity-80 hover:opacity-100" />
              </button>
            </div>

            {/* Body modal */}
            <div className="p-6 space-y-4">
              <input
                type="text"
                placeholder="Pertanyaan (Indonesia)"
                className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-[#FE4D01] focus:outline-none transition"
                value={form.q_id || ""}
                onChange={(e) => setForm({ ...form, q_id: e.target.value })}
              />
              <textarea
                placeholder="Jawaban (Indonesia)"
                className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-[#243771] focus:outline-none transition"
                rows={3}
                value={form.a_id || ""}
                onChange={(e) => setForm({ ...form, a_id: e.target.value })}
              />
              <input
                type="text"
                placeholder="Question (English)"
                className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-[#FE4D01] focus:outline-none transition"
                value={form.q_en || ""}
                onChange={(e) => setForm({ ...form, q_en: e.target.value })}
              />
              <textarea
                placeholder="Answer (English)"
                className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-[#243771] focus:outline-none transition"
                rows={3}
                value={form.a_en || ""}
                onChange={(e) => setForm({ ...form, a_en: e.target.value })}
              />
            </div>

            {/* Footer modal */}
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
