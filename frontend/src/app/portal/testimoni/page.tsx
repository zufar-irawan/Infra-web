"use client";

import {useEffect, useState} from "react";
import Image from "next/image";
import Swal from "sweetalert2";
import {Plus, Pencil, Trash2} from "lucide-react";

interface TestimoniItem {
    id: number;
    name: string;
    major_id: string;
    major_en: string;
    message_id: string;
    message_en: string;
    photo_id: string;
    photo_en: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export default function TestimoniAdminPage() {
    const [testimoni, setTestimoni] = useState<TestimoniItem[]>([]);
    const [form, setForm] = useState<Partial<TestimoniItem>>({});
    const [editId, setEditId] = useState<number | null>(null);
    const [isModalOpen, setModalOpen] = useState(false);

    // === Ambil Data dari Backend ===
    const fetchTestimoni = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/testimoni`, {cache: "no-store"});
            const json = await res.json();
            if (json.success) setTestimoni(json.data);
        } catch (error) {
            console.error("Gagal memuat testimoni:", error);
            Swal.fire("Gagal", "Tidak bisa memuat data testimoni", "error");
        }
    };

    useEffect(() => {
        fetchTestimoni();
    }, []);

    // === Upload File ===
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: "id" | "en") => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.name.endsWith(".webp")) {
            Swal.fire("Format Salah", "Gunakan gambar .webp", "warning");
            return;
        }
        // @ts-ignore
        if (type === "id") setForm({...form, photo_id: file});
        // @ts-ignore
        else setForm({...form, photo_en: file});
    };

    // === Simpan Data (Tambah / Edit) ===
    const handleSave = async () => {
        if (
            !form.name ||
            !form.major_id ||
            !form.major_en ||
            !form.message_id ||
            !form.message_en
        ) {
            Swal.fire("Lengkapi Data", "Semua field wajib diisi!", "warning");
            return;
        }

        const formData = new FormData();
        formData.append("name", form.name);
        formData.append("major_id", form.major_id);
        formData.append("major_en", form.major_en);
        formData.append("message_id", form.message_id);
        formData.append("message_en", form.message_en);
        // @ts-ignore
        if (form.photo_id instanceof File) formData.append("photo_id", form.photo_id);
        // @ts-ignore
        if (form.photo_en instanceof File) formData.append("photo_en", form.photo_en);

        try {
            const url = editId
                ? `${API_BASE_URL}/testimoni/${editId}`
                : `${API_BASE_URL}/testimoni`;

            await fetch(url, {
                method: "POST",
                body: formData,
            });

            Swal.fire(
                "Berhasil!",
                editId ? "Testimoni berhasil diperbarui." : "Testimoni berhasil ditambahkan.",
                "success"
            );

            setForm({});
            setEditId(null);
            setModalOpen(false);
            fetchTestimoni();
        } catch (error) {
            console.error("Gagal menyimpan:", error);
            Swal.fire("Gagal", "Tidak bisa menyimpan data testimoni", "error");
        }
    };

    // === Edit ===
    const handleEdit = (item: TestimoniItem) => {
        setEditId(item.id);
        setForm(item);
        setModalOpen(true);
    };

    // === Hapus ===
    const handleDelete = async (id: number) => {
        const result = await Swal.fire({
            title: "Hapus Data?",
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
            await fetch(`${API_BASE_URL}/testimoni/${id}`, {method: "DELETE"});
            Swal.fire("Terhapus!", "Data testimoni telah dihapus.", "success");
            fetchTestimoni();
        } catch (error) {
            Swal.fire("Gagal", "Tidak dapat menghapus testimoni.", "error");
        }
    };

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-[#243771]">💬 Manajemen Testimoni</h1>
                <button
                    onClick={() => {
                        setForm({});
                        setEditId(null);
                        setModalOpen(true);
                    }}
                    className="flex items-center gap-2 bg-[#FE4D01] text-white px-4 py-2 rounded-lg hover:bg-[#fe5d20] transition"
                >
                    <Plus size={18}/> Tambah Testimoni
                </button>
            </div>

            {/* Tabel */}
            <div className="bg-white rounded-2xl shadow-md overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead className="bg-[#243771] text-white">
                    <tr>
                        <th className="p-3">#</th>
                        <th className="p-3">Nama</th>
                        <th className="p-3">Jurusan (ID)</th>
                        <th className="p-3">Jurusan (EN)</th>
                        <th className="p-3">Pesan (ID)</th>
                        <th className="p-3">Pesan (EN)</th>
                        <th className="p-3">Foto (ID)</th>
                        <th className="p-3">Foto (EN)</th>
                        <th className="p-3 text-center">Aksi</th>
                    </tr>
                    </thead>
                    <tbody>
                    {testimoni.length > 0 ? (
                        testimoni.map((item, i) => (
                            <tr key={item.id} className="border-b hover:bg-gray-50">
                                <td className="p-3">{i + 1}</td>
                                <td className="p-3 font-semibold">{item.name}</td>
                                <td className="p-3">{item.major_id}</td>
                                <td className="p-3">{item.major_en}</td>
                                <td className="p-3 max-w-[200px] truncate">{item.message_id}</td>
                                <td className="p-3 max-w-[200px] truncate">{item.message_en}</td>
                                <td className="p-3 text-center">
                                    {item.photo_id ? (
                                        <Image
                                            src={item.photo_id}
                                            alt="Foto ID"
                                            width={60}
                                            height={60}
                                            className="rounded-md border object-cover mx-auto"
                                        />
                                    ) : (
                                        "-"
                                    )}
                                </td>
                                <td className="p-3 text-center">
                                    {item.photo_en ? (
                                        <Image
                                            src={item.photo_en}
                                            alt="Foto EN"
                                            width={60}
                                            height={60}
                                            className="rounded-md border object-cover mx-auto"
                                        />
                                    ) : (
                                        "-"
                                    )}
                                </td>
                                <td className="p-3 flex justify-center gap-2">
                                    <button
                                        onClick={() => handleEdit(item)}
                                        className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                    >
                                        <Pencil size={16}/>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                                    >
                                        <Trash2 size={16}/>
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={9} className="text-center py-6 text-gray-500 italic">
                                Belum ada data testimoni.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            {/* Modal Tambah/Edit */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 w-[95%] max-w-lg shadow-xl">
                        <h2 className="text-xl font-bold text-[#243771] mb-4">
                            {editId ? "Edit Testimoni" : "Tambah Testimoni"}
                        </h2>

                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Nama"
                                className="border p-2 w-full rounded"
                                value={form.name || ""}
                                onChange={(e) => setForm({...form, name: e.target.value})}
                            />
                            <div className="grid grid-cols-2 gap-3">
                                <input
                                    type="text"
                                    placeholder="Jurusan (ID)"
                                    className="border p-2 rounded"
                                    value={form.major_id || ""}
                                    onChange={(e) => setForm({...form, major_id: e.target.value})}
                                />
                                <input
                                    type="text"
                                    placeholder="Jurusan (EN)"
                                    className="border p-2 rounded"
                                    value={form.major_en || ""}
                                    onChange={(e) => setForm({...form, major_en: e.target.value})}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                <textarea
                    placeholder="Pesan (ID)"
                    className="border p-2 rounded h-24"
                    value={form.message_id || ""}
                    onChange={(e) => setForm({...form, message_id: e.target.value})}
                />
                                <textarea
                                    placeholder="Pesan (EN)"
                                    className="border p-2 rounded h-24"
                                    value={form.message_en || ""}
                                    onChange={(e) => setForm({...form, message_en: e.target.value})}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <input type="file" accept=".webp" onChange={(e) => handleImageUpload(e, "id")}/>
                                <input type="file" accept=".webp" onChange={(e) => handleImageUpload(e, "en")}/>
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
