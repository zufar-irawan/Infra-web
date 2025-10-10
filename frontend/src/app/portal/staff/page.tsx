"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Swal from "sweetalert2";
import { Plus, Pencil, Trash2, X } from "lucide-react";

interface Staff {
  id: number;
  img_id: string;
  img_en: string;
}

export default function StaffPage() {
  const [staffList, setStaffList] = useState<Staff[]>([
    { id: 1, img_id: "/webp/staff1_id.webp", img_en: "/webp/staff1_en.webp" },
    { id: 2, img_id: "/webp/staff2_id.webp", img_en: "/webp/staff2_en.webp" },
  ]);

  const [form, setForm] = useState<Partial<Staff>>({});
  const [editId, setEditId] = useState<number | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // === Tutup modal jika klik luar atau tekan Esc ===
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setModalOpen(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModalOpen(false);
    };
    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEsc);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isModalOpen]);

  // === Upload gambar (hanya .webp) ===
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: "id" | "en") => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith(".webp")) {
      Swal.fire("Format Salah", "Gunakan gambar berformat .webp", "warning");
      return;
    }
    const reader = new FileReader();
    reader.onload = () =>
      setForm((prev) => ({ ...prev, [type === "id" ? "img_id" : "img_en"]: reader.result as string }));
    reader.readAsDataURL(file);
  };

  // === Simpan ===
  const handleSave = () => {
    if (!form.img_id || !form.img_en) {
      Swal.fire("Lengkapi Data", "Upload gambar untuk kedua bahasa!", "warning");
      return;
    }

    if (editId) {
      setStaffList((prev) =>
        prev.map((s) => (s.id === editId ? { ...s, ...form } as Staff : s))
      );
      Swal.fire("Berhasil", "Data staff diperbarui.", "success");
    } else {
      setStaffList((prev) => [
        ...prev,
        { id: Date.now(), img_id: form.img_id!, img_en: form.img_en! },
      ]);
      Swal.fire("Berhasil", "Data staff ditambahkan.", "success");
    }

    setForm({});
    setEditId(null);
    setModalOpen(false);
  };

  const handleEdit = (s: Staff) => {
    setForm(s);
    setEditId(s.id);
    setModalOpen(true);
  };

  const handleDelete = (id: number) => {
    Swal.fire({
      title: "Hapus Staff?",
      text: "Data tidak dapat dikembalikan setelah dihapus.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#FE4D01",
      cancelButtonColor: "#243771",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    }).then((r) => {
      if (r.isConfirmed) {
        setStaffList((prev) => prev.filter((s) => s.id !== id));
        Swal.fire("Terhapus!", "Data staff berhasil dihapus.", "success");
      }
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full flex justify-center">
        <div className="w-full max-w-6xl px-8 py-10 space-y-10 animate-fadeIn">
          {/* === Header (judul & tombol sejajar sempurna) === */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 pb-4">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#243771] tracking-tight">
              👩‍🏫 Manajemen Staff
            </h1>
            <button
              onClick={() => {
                setForm({});
                setEditId(null);
                setModalOpen(true);
              }}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#FE4D01] to-[#FE7A32] text-white px-6 py-2.5 rounded-md shadow-md hover:shadow-lg hover:scale-[1.03] transition-all duration-200"
            >
              <Plus size={18} /> Tambah Staff
            </button>
          </div>

          {/* === Tabel (sejajar dengan header) === */}
          <div className="bg-white border border-gray-200 rounded-md shadow-sm overflow-x-auto transition hover:shadow-md">
            <table className="min-w-full text-sm table-fixed align-middle">
              <colgroup>
                <col className="w-16" />
                <col className="w-[38%]" />
                <col className="w-[38%]" />
                <col className="w-32" />
              </colgroup>

              <thead className="bg-gradient-to-r from-[#243771] to-[#3A4FA3] text-white">
                <tr>
                  <th className="p-3 text-center font-medium">No</th>
                  <th className="p-3 text-center font-medium">Gambar (ID)</th>
                  <th className="p-3 text-center font-medium">Gambar (EN)</th>
                  <th className="p-3 text-center font-medium">Aksi</th>
                </tr>
              </thead>

              <tbody className="text-gray-700">
                {staffList.length > 0 ? (
                  staffList.map((s, i) => (
                    <tr
                      key={s.id}
                      className="border-b border-gray-100 hover:bg-[#fff7f4] transition-all duration-200"
                    >
                      <td className="p-3 text-center font-semibold">{i + 1}</td>

                      <td className="p-3">
                        <div className="h-[100px] w-full flex items-center justify-center">
                          <div className="relative group">
                            <Image
                              src={s.img_id}
                              alt="Gambar Indonesia"
                              width={96}
                              height={96}
                              className="rounded-[8px] border border-gray-200 object-cover transition-transform duration-200 group-hover:scale-[1.06]"
                              onError={(e: any) => { e.currentTarget.src = '/webp/placeholder.webp'; }}
                              unoptimized
                            />
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-black/30 rounded-[8px] flex items-center justify-center text-white text-xs font-medium">
                              🇮🇩 Indonesia
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="p-3">
                        <div className="h-[100px] w-full flex items-center justify-center">
                          <div className="relative group">
                            <Image
                              src={s.img_en}
                              alt="Gambar Inggris"
                              width={96}
                              height={96}
                              className="rounded-[8px] border border-gray-200 object-cover transition-transform duration-200 group-hover:scale-[1.06]"
                              onError={(e: any) => { e.currentTarget.src = '/webp/placeholder.webp'; }}
                              unoptimized
                            />
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-black/30 rounded-[8px] flex items-center justify-center text-white text-xs font-medium">
                              🇬🇧 English
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="p-3">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEdit(s)}
                            className="p-2 bg-blue-500 text-white rounded-[6px] hover:bg-blue-600 hover:scale-105 transition"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(s.id)}
                            className="p-2 bg-red-500 text-white rounded-[6px] hover:bg-red-600 hover:scale-105 transition"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
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

      {/* === Modal Tambah/Edit === */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn">
          <div
            ref={modalRef}
            className="relative bg-white border border-gray-200 rounded-lg p-7 w-[95%] max-w-md shadow-xl animate-slideUp"
          >
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-[#FE4D01] transition"
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
                  onChange={(e) => handleImageUpload(e, "id")}
                  className="w-full border border-gray-300 rounded-[6px] p-2 hover:border-[#FE4D01] transition"
                />
                {form.img_id && (
                  <div className="mt-3 animate-fadeIn">
                    <Image
                      src={form.img_id}
                      alt="Preview ID"
                      width={120}
                      height={120}
                      className="rounded-[8px] border border-gray-200 shadow-sm"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1 block">
                  Gambar Bahasa Inggris (.webp)
                </label>
                <input
                  type="file"
                  accept=".webp"
                  onChange={(e) => handleImageUpload(e, "en")}
                  className="w-full border border-gray-300 rounded-[6px] p-2 hover:border-[#FE4D01] transition"
                />
                {form.img_en && (
                  <div className="mt-3 animate-fadeIn">
                    <Image
                      src={form.img_en}
                      alt="Preview EN"
                      width={120}
                      height={120}
                      className="rounded-[8px] border border-gray-200 shadow-sm"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-[6px] text-gray-600 hover:bg-gray-100 transition"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-gradient-to-r from-[#FE4D01] to-[#FE7A32] text-white rounded-[6px] font-semibold hover:scale-[1.03] shadow-sm transition"
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
