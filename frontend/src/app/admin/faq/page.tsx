"use client";

import { useState } from "react";
import Swal from "sweetalert2";
import { Pencil, Trash2, Plus } from "lucide-react";

interface FaqItem {
  id: number;
  q_id: string;
  a_id: string;
  q_en: string;
  a_en: string;
}

export default function AdminFaqPage() {
  const [faqList, setFaqList] = useState<FaqItem[]>([
    {
      id: 1,
      q_id: "Dimana alamat SMK Prestasi Prima?",
      a_id: "Alamat kami berada di Jl. Kayu Manis Timur No. 99, Jakarta Timur.",
      q_en: "Where is SMK Prestasi Prima located?",
      a_en: "Our address is Jl. Kayu Manis Timur No. 99, East Jakarta.",
    },
    {
      id: 2,
      q_id: "Apa saja jurusan yang tersedia?",
      a_id: "Kami memiliki jurusan RPL, TJKT, DKV, dan lainnya.",
      q_en: "What majors are available?",
      a_en: "We offer majors such as Software Engineering, Network Engineering, Visual Communication Design, and more.",
    },
    {
      id: 3,
      q_id: "Apakah ada kegiatan ekstrakurikuler?",
      a_id: "Ya, tersedia banyak ekstrakurikuler seperti futsal, basket, musik, dan robotik.",
      q_en: "Are there extracurricular activities?",
      a_en: "Yes, we provide many extracurriculars such as futsal, basketball, music, and robotics.",
    },
  ]);

  const [form, setForm] = useState<Partial<FaqItem>>({});
  const [editId, setEditId] = useState<number | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);

  // === Simpan FAQ (Dummy CRUD) ===
  const handleSave = () => {
    if (!form.q_id || !form.a_id || !form.q_en || !form.a_en) {
      Swal.fire("Lengkapi Data", "Semua field wajib diisi!", "warning");
      return;
    }

    if (editId) {
      setFaqList((prev) =>
        prev.map((f) => (f.id === editId ? { ...f, ...form } as FaqItem : f))
      );
      Swal.fire("Berhasil", "FAQ berhasil diperbarui.", "success");
    } else {
      const newItem: FaqItem = {
        id: Date.now(),
        q_id: form.q_id!,
        a_id: form.a_id!,
        q_en: form.q_en!,
        a_en: form.a_en!,
      };
      setFaqList((prev) => [...prev, newItem]);
      Swal.fire("Berhasil", "FAQ berhasil ditambahkan.", "success");
    }

    setForm({});
    setEditId(null);
    setModalOpen(false);
  };

  // === Hapus FAQ ===
  const handleDelete = (id: number) => {
    Swal.fire({
      title: "Hapus FAQ?",
      text: "Data yang dihapus tidak dapat dikembalikan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#FE4D01",
      cancelButtonColor: "#243771",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        setFaqList((prev) => prev.filter((f) => f.id !== id));
        Swal.fire("Terhapus!", "FAQ berhasil dihapus.", "success");
      }
    });
  };

  // === Edit FAQ ===
  const handleEdit = (f: FaqItem) => {
    setForm(f);
    setEditId(f.id);
    setModalOpen(true);
  };

  return (
    <div className="space-y-8 animate-fadeIn p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[#243771]">❓ Manajemen FAQ</h1>
        <button
          onClick={() => {
            setForm({});
            setEditId(null);
            setModalOpen(true);
          }}
          className="flex items-center gap-2 bg-[#FE4D01] text-white px-4 py-2 rounded-lg hover:bg-[#fe5d20] transition"
        >
          <Plus size={18} /> Tambah FAQ
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-md overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-[#243771] text-white text-left">
            <tr>
              <th className="p-3">#</th>
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
                  className="border-b border-gray-100 hover:bg-gray-50 transition"
                >
                  <td className="p-3">{i + 1}</td>
                  <td className="p-3 font-semibold">{f.q_id}</td>
                  <td className="p-3 text-gray-600 truncate max-w-[300px]">
                    {f.a_id}
                  </td>
                  <td className="p-3 flex justify-center gap-2">
                    <button
                      onClick={() => handleEdit(f)}
                      className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(f.id)}
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
                  colSpan={4}
                  className="text-center py-6 text-gray-500 italic"
                >
                  Belum ada FAQ.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Tambah/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-[95%] max-w-2xl shadow-xl relative">
            <h2 className="text-xl font-bold text-[#243771] mb-4">
              {editId ? "Edit FAQ" : "Tambah FAQ"}
            </h2>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Pertanyaan (Indonesia)"
                className="border p-2 w-full rounded"
                value={form.q_id || ""}
                onChange={(e) => setForm({ ...form, q_id: e.target.value })}
              />
              <textarea
                placeholder="Jawaban (Indonesia)"
                className="border p-2 w-full rounded"
                value={form.a_id || ""}
                onChange={(e) => setForm({ ...form, a_id: e.target.value })}
              />

              <input
                type="text"
                placeholder="Question (English)"
                className="border p-2 w-full rounded"
                value={form.q_en || ""}
                onChange={(e) => setForm({ ...form, q_en: e.target.value })}
              />
              <textarea
                placeholder="Answer (English)"
                className="border p-2 w-full rounded"
                value={form.a_en || ""}
                onChange={(e) => setForm({ ...form, a_en: e.target.value })}
              />
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
