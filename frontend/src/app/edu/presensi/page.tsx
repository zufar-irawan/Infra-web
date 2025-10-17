"use client";

import DashHeader from "@/app/components/DashHeader";
import { useEduData } from "@/app/edu/context";
import api from "../../lib/api";
import Swal from "sweetalert2";
import {
    CalendarDays,
    Filter,
    Loader2,
    Pencil,
    Plus,
    RefreshCw,
    Trash2,
} from "lucide-react";
import React, {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

type AttendanceStatusKey =
    | "tidak_absen_masuk"
    | "tidak_absen_pulang"
    | "absen_masuk"
    | "absen_pulang";

type KehadiranStatus =
    | "telat"
    | "tepat_waktu"
    | "sakit"
    | "izin"
    | "alfa";

type AttendanceRecord = {
    id: number;
    class_id: number | null;
    student_id: number | null;
    date: string;
    attendance_status: AttendanceStatusKey;
    time_in?: string | null;
    time_out?: string | null;
    status: KehadiranStatus;
    description?: string | null;
    class?: any;
    student?: any;
};

type AttendanceFormState = {
    id: number | null;
    class_id: string;
    student_id: string;
    date: string;
    attendance_status: AttendanceStatusKey;
    status: KehadiranStatus;
    time_in: string;
    time_out: string;
    description: string;
};

const ATTENDANCE_OPTIONS: { value: AttendanceStatusKey; label: string }[] = [
    { value: "absen_masuk", label: "Absen Masuk" },
    { value: "absen_pulang", label: "Absen Pulang" },
    { value: "tidak_absen_masuk", label: "Tidak Absen Masuk" },
    { value: "tidak_absen_pulang", label: "Tidak Absen Pulang" },
];

const STATUS_OPTIONS: { value: KehadiranStatus; label: string }[] = [
    { value: "tepat_waktu", label: "Tepat Waktu" },
    { value: "telat", label: "Telat" },
    { value: "sakit", label: "Sakit" },
    { value: "izin", label: "Izin" },
    { value: "alfa", label: "Alpha" },
];

const STATUS_BADGE: Record<KehadiranStatus, string> = {
    tepat_waktu: "bg-emerald-100 text-emerald-700",
    telat: "bg-amber-100 text-amber-700",
    sakit: "bg-sky-100 text-sky-700",
    izin: "bg-indigo-100 text-indigo-700",
    alfa: "bg-rose-100 text-rose-700",
};

const ATTENDANCE_BADGE: Record<AttendanceStatusKey, string> = {
    absen_masuk: "bg-emerald-50 text-emerald-600",
    absen_pulang: "bg-sky-50 text-sky-600",
    tidak_absen_masuk: "bg-amber-50 text-amber-600",
    tidak_absen_pulang: "bg-rose-50 text-rose-600",
};

const ATTENDANCE_LABEL: Record<AttendanceStatusKey, string> = ATTENDANCE_OPTIONS.reduce(
    (acc, option) => {
        acc[option.value] = option.label;
        return acc;
    },
    {} as Record<AttendanceStatusKey, string>,
);

const getToken = () => {
    if (typeof window === "undefined") return null;
    return sessionStorage.getItem("token");
};

const initialFormState: AttendanceFormState = {
    id: null,
    class_id: "",
    student_id: "",
    date: "",
    attendance_status: "absen_masuk",
    status: "tepat_waktu",
    time_in: "",
    time_out: "",
    description: "",
};

export default function PresensiPage() {
    const { user, student, teacher, students: studentsContext, classes } = useEduData();

    const isStaff = user?.role === "admin" || user?.role === "guru";

    const [attendances, setAttendances] = useState<AttendanceRecord[]>([]);
    const [attendanceLoading, setAttendanceLoading] = useState<boolean>(true);
    const [studentsList, setStudentsList] = useState<any[]>(studentsContext ?? []);

    const [filters, setFilters] = useState({
        classId: "all",
        studentId: "all",
        date: "",
    });
    const [statusFilter, setStatusFilter] = useState<string>("all");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<"create" | "edit">("create");
    const [formState, setFormState] = useState<AttendanceFormState>(initialFormState);
    const [submitting, setSubmitting] = useState(false);

    const classesList = useMemo(() => classes ?? [], [classes]);

    useEffect(() => {
        if (studentsContext && studentsContext.length) {
            setStudentsList(studentsContext);
        }
    }, [studentsContext]);

    const fetchStudents = useCallback(async () => {
        if (!isStaff) return;
        if (studentsContext && studentsContext.length) return;
        const token = getToken();
        if (!token) return;
        try {
            const res = await api.get("/lms/students", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const list = Array.isArray(res.data)
                ? res.data
                : res.data?.data ?? [];
            setStudentsList(list);
        } catch (error) {
            console.error("Gagal mengambil daftar siswa", error);
        }
    }, [isStaff, studentsContext]);

    const fetchAttendances = useCallback(async () => {
        const token = getToken();
        if (!token || !user) {
            setAttendanceLoading(false);
            return;
        }

        setAttendanceLoading(true);
        try {
            const res = await api.get("/lms/attendance", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const list = Array.isArray(res.data)
                ? res.data
                : res.data?.data ?? [];
            setAttendances(list);
        } catch (error: any) {
            console.error("Gagal mengambil data presensi", error);
            Swal.fire({
                icon: "error",
                title: "Gagal",
                text:
                    error?.response?.data?.message ??
                    "Tidak dapat mengambil data presensi.",
            });
        } finally {
            setAttendanceLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (!user) return;
        fetchAttendances();
        fetchStudents();
    }, [user, fetchAttendances, fetchStudents]);

    const filteredStudentsForSelect = useMemo(() => {
        if (!studentsList) return [];
        if (filters.classId === "all" || !filters.classId) {
            return studentsList;
        }
        const classIdNum = Number(filters.classId);
        return studentsList.filter((s: any) => {
            const studentClassId = s.class_id ?? s.class?.id ?? null;
            return Number(studentClassId) === classIdNum;
        });
    }, [studentsList, filters.classId]);

    const formStudentOptions = useMemo(() => {
        if (!studentsList) return [];
        if (!formState.class_id) return studentsList;
        const classIdNum = Number(formState.class_id);
        return studentsList.filter((s: any) => {
            const studentClassId = s.class_id ?? s.class?.id ?? null;
            return Number(studentClassId) === classIdNum;
        });
    }, [studentsList, formState.class_id]);

    const visibleAttendances = useMemo(() => {
        const byStatus = statusFilter === "all"
            ? attendances
            : attendances.filter(
                  (item) => (item.status ?? "tepat_waktu") === statusFilter,
              );

        const sorted = [...byStatus].sort((a, b) => {
            const aDate = new Date(`${a.date}T${a.time_in ?? "00:00"}`);
            const bDate = new Date(`${b.date}T${b.time_in ?? "00:00"}`);
            return bDate.getTime() - aDate.getTime();
        });

        if (!isStaff && student?.id) {
            return sorted.filter(
                (item) => Number(item.student_id) === Number(student.id),
            );
        }

        return sorted;
    }, [attendances, statusFilter, isStaff, student?.id]);

    const studentsLookup = useMemo(() => {
        if (!studentsList || !studentsList.length) return new Map<number, any>();
        return studentsList.reduce((map, item) => {
            const id = Number(item.id ?? item.student_id);
            if (!Number.isNaN(id)) {
                map.set(id, item);
            }
            return map;
        }, new Map<number, any>());
    }, [studentsList]);

    const stats = useMemo(() => {
        const total = attendances.length;
        const hadir = attendances.filter((item) =>
            ["absen_masuk", "absen_pulang"].includes(item.attendance_status),
        ).length;
        const telat = attendances.filter((item) => item.status === "telat").length;
        const izin = attendances.filter((item) => item.status === "izin").length;
        return { total, hadir, telat, izin };
    }, [attendances]);

    const handleFilter = async () => {
        if (!isStaff) return;
        const token = getToken();
        if (!token) return;

        setAttendanceLoading(true);
        try {
            const params: Record<string, any> = {};
            if (filters.classId !== "all" && filters.classId) {
                params.class_id = filters.classId;
            }
            if (filters.studentId !== "all" && filters.studentId) {
                params.student_id = filters.studentId;
            }
            if (filters.date) {
                params.date = filters.date;
            }

            let list: AttendanceRecord[] = [];
            if (Object.keys(params).length > 0) {
                const res = await api.get("/lms/attendance-filter", {
                    headers: { Authorization: `Bearer ${token}` },
                    params,
                });
                list = Array.isArray(res.data)
                    ? res.data
                    : res.data?.data ?? [];
            } else {
                const res = await api.get("/lms/attendance", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                list = Array.isArray(res.data)
                    ? res.data
                    : res.data?.data ?? [];
            }

            setAttendances(list);
        } catch (error: any) {
            console.error("Gagal menerapkan filter", error);
            Swal.fire({
                icon: "error",
                title: "Gagal",
                text:
                    error?.response?.data?.message ??
                    "Tidak dapat menerapkan filter presensi.",
            });
        } finally {
            setAttendanceLoading(false);
        }
    };

    const resetFilters = () => {
        setFilters({ classId: "all", studentId: "all", date: "" });
        setStatusFilter("all");
        fetchAttendances();
    };

    const openCreateModal = () => {
        setModalMode("create");
        setFormState({
            ...initialFormState,
            date: new Date().toISOString().slice(0, 10),
            class_id:
                user?.role === "guru"
                    ? String(teacher?.class_id ?? teacher?.class?.id ?? "")
                    : "",
        });
        setIsModalOpen(true);
    };

    const openEditModal = (record: AttendanceRecord) => {
        setModalMode("edit");
        setFormState({
            id: record.id,
            class_id: record.class_id ? String(record.class_id) : "",
            student_id: record.student_id ? String(record.student_id) : "",
            date: record.date,
            attendance_status: record.attendance_status,
            status: record.status,
            time_in: (record.time_in ?? "").slice(0, 5),
            time_out: (record.time_out ?? "").slice(0, 5),
            description: record.description ?? "",
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setFormState(initialFormState);
    };

    const handleFormChange = (field: keyof AttendanceFormState, value: string) => {
        setFormState((prev) => ({ ...prev, [field]: value }));
        if (field === "class_id") {
            setFormState((prev) => ({ ...prev, student_id: "" }));
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const token = getToken();
        if (!token) {
            Swal.fire({ icon: "warning", title: "Tidak ada token" });
            return;
        }

        if (!formState.class_id || !formState.student_id || !formState.date) {
            Swal.fire({
                icon: "warning",
                title: "Lengkapi data",
                text: "Kelas, siswa, dan tanggal wajib diisi.",
            });
            return;
        }

        const payload = {
            class_id: Number(formState.class_id),
            student_id: Number(formState.student_id),
            date: formState.date,
            attendance_status: formState.attendance_status,
            status: formState.status,
            time_in: formState.time_in || null,
            time_out: formState.time_out || null,
            description: formState.description || null,
        };

        setSubmitting(true);
        try {
            if (modalMode === "create") {
                await api.post("/lms/attendance", payload, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                Swal.fire({ icon: "success", title: "Berhasil", text: "Presensi berhasil dibuat." });
            } else if (formState.id !== null) {
                await api.put(`/lms/attendance/${formState.id}`, payload, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                Swal.fire({ icon: "success", title: "Berhasil", text: "Presensi berhasil diperbarui." });
            }
            closeModal();
            fetchAttendances();
        } catch (error: any) {
            console.error("Gagal menyimpan presensi", error);
            Swal.fire({
                icon: "error",
                title: "Gagal",
                text:
                    error?.response?.data?.message ??
                    "Terjadi kesalahan saat menyimpan presensi.",
            });
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (record: AttendanceRecord) => {
        const confirm = await Swal.fire({
            icon: "warning",
            title: "Hapus presensi?",
            text: "Data yang dihapus tidak dapat dikembalikan.",
            showCancelButton: true,
            confirmButtonText: "Hapus",
            cancelButtonText: "Batal",
        });
        if (!confirm.isConfirmed) return;

        const token = getToken();
        if (!token) return;

        try {
            await api.delete(`/lms/attendance/${record.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            Swal.fire({ icon: "success", title: "Berhasil", text: "Presensi dihapus." });
            fetchAttendances();
        } catch (error: any) {
            console.error("Gagal menghapus presensi", error);
            Swal.fire({
                icon: "error",
                title: "Gagal",
                text:
                    error?.response?.data?.message ??
                    "Tidak dapat menghapus presensi.",
            });
        }
    };

    const renderModal = () => {
        if (!isModalOpen) return null;

        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl">
                    <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">
                                {modalMode === "create" ? "Tambah Presensi" : "Edit Presensi"}
                            </h2>
                            <p className="text-sm text-gray-500">
                                Isi form berikut untuk {modalMode === "create" ? "mencatat" : "memperbarui"} presensi siswa.
                            </p>
                        </div>
                        <button
                            onClick={closeModal}
                            className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
                            aria-label="Tutup"
                        >
                            <Trash2 className="hidden" />
                            <span className="text-xl leading-none">×</span>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="grid gap-4 px-6 py-6">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-600">
                                    Kelas
                                </label>
                                <select
                                    value={formState.class_id}
                                    onChange={(e) => handleFormChange("class_id", e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                                    required
                                >
                                    <option value="">Pilih kelas</option>
                                    {classesList?.map((cls: any) => (
                                        <option key={cls.id} value={cls.id}>
                                            {cls.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-600">
                                    Siswa
                                </label>
                                <select
                                    value={formState.student_id}
                                    onChange={(e) => handleFormChange("student_id", e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                                    required
                                >
                                    <option value="">Pilih siswa</option>
                                    {formStudentOptions.map((s: any) => (
                                        <option key={s.id} value={s.id}>
                                            {s.user?.name ?? s.user?.username ?? `Siswa ${s.id}`}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-600">Tanggal</label>
                                <input
                                    type="date"
                                    value={formState.date}
                                    onChange={(e) => handleFormChange("date", e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-600">Masuk</label>
                                    <input
                                        type="time"
                                        value={formState.time_in}
                                        onChange={(e) => handleFormChange("time_in", e.target.value)}
                                        className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-600">Pulang</label>
                                    <input
                                        type="time"
                                        value={formState.time_out}
                                        onChange={(e) => handleFormChange("time_out", e.target.value)}
                                        className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-600">
                                    Jenis Kehadiran
                                </label>
                                <select
                                    value={formState.attendance_status}
                                    onChange={(e) => handleFormChange("attendance_status", e.target.value as AttendanceStatusKey)}
                                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                                >
                                    {ATTENDANCE_OPTIONS.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-600">
                                    Status
                                </label>
                                <select
                                    value={formState.status}
                                    onChange={(e) => handleFormChange("status", e.target.value as KehadiranStatus)}
                                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                                >
                                    {STATUS_OPTIONS.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-600">Catatan</label>
                            <textarea
                                value={formState.description}
                                onChange={(e) => handleFormChange("description", e.target.value)}
                                rows={3}
                                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                                placeholder="Tambahkan keterangan tambahan (opsional)"
                            />
                        </div>

                        <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-orange-600 disabled:opacity-70"
                            >
                                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                                {modalMode === "create" ? "Simpan" : "Perbarui"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    return (
        <div className="overflow-y-auto min-h-screen bg-gray-50">
            <DashHeader user={user} student={student} teacher={teacher} />

            <section className="w-full space-y-4 px-4 pb-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                        <p className="text-xs font-medium uppercase text-gray-500">Total Catatan</p>
                        <p className="mt-2 text-3xl font-semibold text-gray-900">{stats.total}</p>
                        <p className="text-xs text-gray-500">Jumlah seluruh catatan presensi</p>
                    </div>
                    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                        <p className="text-xs font-medium uppercase text-gray-500">Kehadiran</p>
                        <p className="mt-2 text-3xl font-semibold text-emerald-600">{stats.hadir}</p>
                        <p className="text-xs text-emerald-500">Tercatat hadir</p>
                    </div>
                    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                        <p className="text-xs font-medium uppercase text-gray-500">Terlambat</p>
                        <p className="mt-2 text-3xl font-semibold text-amber-600">{stats.telat}</p>
                        <p className="text-xs text-amber-500">Kedatangan terhitung telat</p>
                    </div>
                    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                        <p className="text-xs font-medium uppercase text-gray-500">Izin/Sakit</p>
                        <p className="mt-2 text-3xl font-semibold text-sky-600">{stats.izin}</p>
                        <p className="text-xs text-sky-500">Izin atau sakit</p>
                    </div>
                </div>

                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
                            <div>
                                <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">Kelas</label>
                                <select
                                    value={filters.classId}
                                    onChange={(e) => setFilters((prev) => ({ ...prev, classId: e.target.value, studentId: "all" }))}
                                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                                >
                                    <option value="all">Semua kelas</option>
                                    {classesList?.map((cls: any) => (
                                        <option key={cls.id} value={cls.id}>
                                            {cls.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">Siswa</label>
                                <select
                                    value={filters.studentId}
                                    onChange={(e) => setFilters((prev) => ({ ...prev, studentId: e.target.value }))}
                                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                                >
                                    <option value="all">Semua siswa</option>
                                    {filteredStudentsForSelect.map((s: any) => (
                                        <option key={s.id} value={s.id}>
                                            {s.user?.name ?? s.user?.username ?? `Siswa ${s.id}`}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">Tanggal</label>
                                <input
                                    type="date"
                                    value={filters.date}
                                    onChange={(e) => setFilters((prev) => ({ ...prev, date: e.target.value }))}
                                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                                />
                            </div>
                        </div>

                        <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-end">
                            <div className="flex flex-1 items-center gap-2 sm:flex-none">
                                <label className="text-xs font-semibold uppercase text-gray-500">Status</label>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 sm:w-40"
                                >
                                    <option value="all">Semua</option>
                                    {STATUS_OPTIONS.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {isStaff && (
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleFilter}
                                        className="inline-flex items-center gap-2 rounded-xl border border-orange-200 px-4 py-2 text-sm font-medium text-orange-600 hover:bg-orange-50"
                                    >
                                        <Filter className="h-4 w-4" /> Terapkan
                                    </button>
                                    <button
                                        onClick={resetFilters}
                                        className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
                                    >
                                        <RefreshCw className="h-4 w-4" /> Reset
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {isStaff && (
                        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <CalendarDays className="h-4 w-4" />
                                {filters.date ? (
                                    <span>
                                        Menampilkan presensi tanggal {new Date(filters.date).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })}
                                    </span>
                                ) : (
                                    <span>Menampilkan semua tanggal</span>
                                )}
                            </div>
                            <button
                                onClick={openCreateModal}
                                className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-orange-600"
                            >
                                <Plus className="h-4 w-4" /> Tambah Presensi
                            </button>
                        </div>
                    )}
                </div>

                <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-100 text-sm">
                            <thead className="bg-gray-50 text-xs font-semibold uppercase text-gray-500">
                                <tr>
                                    <th className="px-6 py-3 text-left">Tanggal</th>
                                    <th className="px-6 py-3 text-left">Siswa</th>
                                    <th className="px-6 py-3 text-left">Kelas</th>
                                    <th className="px-6 py-3 text-left">Masuk</th>
                                    <th className="px-6 py-3 text-left">Pulang</th>
                                    <th className="px-6 py-3 text-left">Status</th>
                                    <th className="px-6 py-3 text-left">Jenis</th>
                                    <th className="px-6 py-3 text-left">Catatan</th>
                                    {isStaff && <th className="px-6 py-3 text-right">Aksi</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {attendanceLoading ? (
                                    <tr>
                                        <td colSpan={isStaff ? 8 : 7} className="px-6 py-10 text-center text-sm text-gray-500">
                                            <div className="flex items-center justify-center gap-2">
                                                <Loader2 className="h-5 w-5 animate-spin text-orange-500" />
                                                Memuat data presensi...
                                            </div>
                                        </td>
                                    </tr>
                                ) : visibleAttendances.length === 0 ? (
                                    <tr>
                                        <td colSpan={isStaff ? 8 : 7} className="px-6 py-12 text-center text-sm font-medium text-gray-500">
                                            Belum ada data presensi yang cocok.
                                        </td>
                                    </tr>
                                ) : (
                                    visibleAttendances.map((item) => {
                                        const fallbackStudent = studentsLookup.get(Number(item.student_id));
                                        const studentName = item.student?.user?.name
                                            ?? item.student?.user?.username
                                            ?? fallbackStudent?.user?.name
                                            ?? fallbackStudent?.user?.username
                                            ?? fallbackStudent?.name
                                            ?? "-";
                                        const className = item.class?.name ?? "-";
                                        const timeIn = item.time_in ? item.time_in.slice(0, 5) : "-";
                                        const timeOut = item.time_out ? item.time_out.slice(0, 5) : "-";
                                        return (
                                            <tr key={item.id} className="hover:bg-orange-50/40">
                                                <td className="px-6 py-4 text-sm text-gray-700">
                                                    {new Date(item.date).toLocaleDateString("id-ID", {
                                                        day: "2-digit",
                                                        month: "long",
                                                        year: "numeric",
                                                    })}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-700">{studentName}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{className}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{timeIn}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{timeOut}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_BADGE[item.status]}`}>
                                                        {STATUS_OPTIONS.find((opt) => opt.value === item.status)?.label ?? item.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${ATTENDANCE_BADGE[item.attendance_status]}`}>
                                                        {ATTENDANCE_LABEL[item.attendance_status]}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    {item.description || "-"}
                                                </td>
                                                {isStaff && (
                                                    <td className="px-6 py-4 text-right text-sm">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                onClick={() => openEditModal(item)}
                                                                className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 px-3 py-1.5 text-xs font-medium text-emerald-600 hover:bg-emerald-50"
                                                            >
                                                                <Pencil className="h-3.5 w-3.5" /> Edit
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(item)}
                                                                className="inline-flex items-center gap-1 rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50"
                                                            >
                                                                <Trash2 className="h-3.5 w-3.5" /> Hapus
                                                            </button>
                                                        </div>
                                                    </td>
                                                )}
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {renderModal()}
        </div>
    );
}