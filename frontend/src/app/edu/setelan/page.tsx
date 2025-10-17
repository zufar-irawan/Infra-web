"use client";

import React, { FormEvent, useEffect, useMemo, useState } from "react";
import DashHeader from "@/app/components/DashHeader";
import { useEduData } from "@/app/edu/context";
import api from "../../lib/api";
import Swal from "sweetalert2";
import { Loader2 } from "lucide-react";

type SettingKey =
    | "mulai_masuk_siswa"
    | "jam_masuk_siswa"
    | "jam_pulang_siswa"
    | "batas_pulang_siswa";

type SettingState = Record<SettingKey, string>;

const DEFAULT_SETTING: SettingState = {
    mulai_masuk_siswa: "07:00",
    jam_masuk_siswa: "07:15",
    jam_pulang_siswa: "15:00",
    batas_pulang_siswa: "16:00",
};

const getToken = () => {
    if (typeof window === "undefined") return null;
    return sessionStorage.getItem("token");
};

export default function Setelan() {
    const { user, student } = useEduData();
    const [settingId, setSettingId] = useState<number | null>(null);
    const [settings, setSettings] = useState<SettingState>(DEFAULT_SETTING);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const isAdmin = user?.role === "admin";

    const labels = useMemo(
        () => ({
            mulai_masuk_siswa: "Mulai absen masuk siswa",
            jam_masuk_siswa: "Batas absen masuk siswa",
            jam_pulang_siswa: "Mulai absen pulang siswa",
            batas_pulang_siswa: "Batas absen pulang siswa",
        }),
        []
    );

    useEffect(() => {
        if (!isAdmin) {
            setLoading(false);
            return;
        }

        const fetchSettings = async () => {
            const token = getToken();
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const res = await api.get("/lms/settings", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const list = Array.isArray(res.data?.data) ? res.data.data : [];
                if (list.length > 0) {
                    const first = list[0];
                    setSettingId(first.id ?? null);
                    setSettings({
                        mulai_masuk_siswa: first.mulai_masuk_siswa ?? DEFAULT_SETTING.mulai_masuk_siswa,
                        jam_masuk_siswa: first.jam_masuk_siswa ?? DEFAULT_SETTING.jam_masuk_siswa,
                        jam_pulang_siswa: first.jam_pulang_siswa ?? DEFAULT_SETTING.jam_pulang_siswa,
                        batas_pulang_siswa: first.batas_pulang_siswa ?? DEFAULT_SETTING.batas_pulang_siswa,
                    });
                }
            } catch (error: any) {
                console.error("Gagal mengambil setelan", error);
                Swal.fire({
                    icon: "error",
                    title: "Gagal",
                    text:
                        error?.response?.data?.message ??
                        "Tidak dapat mengambil data setelan.",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, [isAdmin]);

    const handleChange = (key: SettingKey, value: string) => {
        setSettings((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const token = getToken();
        if (!token) {
            Swal.fire({ icon: "warning", title: "Token tidak ditemukan" });
            return;
        }

        setSubmitting(true);
        try {
            const payload = { ...settings };

            if (settingId) {
                const res = await api.put(`/lms/settings/${settingId}`, payload, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const updated = res.data?.data ?? res.data;
                if (updated?.id) {
                    setSettingId(updated.id);
                }
                Swal.fire({ icon: "success", title: "Berhasil", text: "Setelan berhasil diperbarui." });
            } else {
                const res = await api.post("/lms/settings", payload, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const created = res.data?.data ?? res.data;
                if (created?.id) {
                    setSettingId(created.id);
                }
                Swal.fire({ icon: "success", title: "Berhasil", text: "Setelan berhasil dibuat." });
            }
        } catch (error: any) {
            console.error("Gagal menyimpan setelan", error);
            Swal.fire({
                icon: "error",
                title: "Gagal",
                text: error?.response?.data?.message ?? "Terjadi kesalahan saat menyimpan setelan.",
            });
        } finally {
            setSubmitting(false);
        }
    };

    if (!isAdmin) {
        return (
            <div className="overflow-y-auto min-h-screen bg-gray-50">
                <DashHeader user={user} student={student} />
                <div className="p-6">
                    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-700">
                        Hanya admin yang dapat mengakses halaman setelan.
                    </div>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="overflow-y-auto min-h-screen bg-gray-50">
                <DashHeader user={user} student={student} />
                <div className="flex items-center justify-center p-10">
                    <div className="flex items-center gap-2 rounded-xl border border-orange-100 bg-white px-4 py-3 text-sm text-orange-600 shadow">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Memuat setelan presensi...
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="overflow-y-auto min-h-screen bg-gray-50">
            <DashHeader user={user} student={student} />

            <section className="w-full p-4">
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-gray-800">Pengaturan Presensi</h1>
                    <p className="text-sm text-gray-500">Sesuaikan jam operasional presensi siswa.</p>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {Object.entries(labels).map(([key, label]) => (
                        <div
                            key={key}
                            className="rounded-2xl border border-gray-100 bg-white p-4 shadow-md"
                        >
                            <h2 className="text-base font-semibold mb-2">{label}</h2>
                            <input
                                type="time"
                                value={settings[key as SettingKey]}
                                onChange={(event) => handleChange(key as SettingKey, event.target.value)}
                                className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm text-gray-700 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100"
                                required
                                disabled={loading}
                            />
                        </div>
                    ))}

                    <div className="md:col-span-2 flex justify-end gap-3">
                        <button
                            type="submit"
                            disabled={loading || submitting}
                            className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-orange-600 disabled:opacity-60"
                        >
                            {submitting ? "Menyimpan..." : settingId ? "Simpan Perubahan" : "Buat Setelan"}
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
}