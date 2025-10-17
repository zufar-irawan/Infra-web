"use client";

import DashHeader from "@/app/components/DashHeader";
import { useEduData } from "@/app/edu/context";
import api from "../../lib/api";
import Swal from "sweetalert2";
import {
  GraduationCap,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  Users,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

type StudentRecord = {
  id: number;
  user_id: number;
  nis: string | null;
  status: string;
  class_id: number | null;
  class?: any;
  user?: any;
  guardian_name?: string | null;
  guardian_contact?: string | null;
  enrollment_date?: string | null;
  rfid_id?: number | null;
  rfid?: any;
};

type StudentFormState = {
  accountMode: "existing" | "new";
  user_id: string;
  user_name: string;
  user_email: string;
  user_password: string;
  user_phone: string;
  user_status: string;
  nis: string;
  class_id: string;
  guardian_name: string;
  guardian_contact: string;
  enrollment_date: string;
  rfid_id: string;
  status: string;
};

const STATUS_BADGE: Record<string, string> = {
  aktif: "bg-emerald-100 text-emerald-700",
  nonaktif: "bg-gray-100 text-gray-600",
};

const STATUS_OPTIONS = [
  { value: "aktif", label: "Aktif" },
  { value: "nonaktif", label: "Nonaktif" },
];

const ACCOUNT_MODE_OPTIONS = [
  { value: "new" as const, label: "Buat akun baru" },
  { value: "existing" as const, label: "Gunakan akun yang ada" },
];

const initialFormState: StudentFormState = {
  accountMode: "new",
  user_id: "",
  user_name: "",
  user_email: "",
  user_password: "",
  user_phone: "",
  user_status: "aktif",
  nis: "",
  class_id: "",
  guardian_name: "",
  guardian_contact: "",
  enrollment_date: "",
  rfid_id: "",
  status: "aktif",
};

const getToken = () => {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem("token");
};

export default function SiswaPage() {
  const {
    user,
    student,
    teacher,
    classes,
    students: studentsContext,
  } = useEduData();

  const [students, setStudents] = useState<StudentRecord[]>(
    (studentsContext as StudentRecord[]) ?? [],
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [formState, setFormState] = useState<StudentFormState>(
    initialFormState,
  );
  const [selectedStudent, setSelectedStudent] = useState<StudentRecord | null>(
    null,
  );
  const [submitting, setSubmitting] = useState<boolean>(false);

  const isStaff = user?.role === "admin" || user?.role === "guru";
  const canCreate = user?.role === "admin";
  const canDelete = user?.role === "admin";
  const classesList = useMemo(() => classes ?? [], [classes]);

  const teacherClassId = useMemo(() => {
    if (!teacher) return null;
    return teacher.class_id ?? teacher.class?.id ?? null;
  }, [teacher]);

  useEffect(() => {
    if (studentsContext && studentsContext.length) {
      setStudents(studentsContext as StudentRecord[]);
      setLoading(false);
    }
  }, [studentsContext]);

  useEffect(() => {
    if (user?.role === "guru" && teacherClassId) {
      setSelectedClass(String(teacherClassId));
    }
  }, [user?.role, teacherClassId]);

  const fetchStudents = useCallback(async () => {
    const token = getToken();
    if (!token || !user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await api.get("/lms/students", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const list = Array.isArray(res.data)
        ? res.data
        : res.data?.data ?? [];
      setStudents(list);
    } catch (error: any) {
      console.error("Gagal mengambil data siswa", error);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text:
          error?.response?.data?.message ??
          "Tidak dapat mengambil data siswa.",
      });
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    fetchStudents();
  }, [user, fetchStudents]);

  const filteredStudents = useMemo(() => {
    let data = [...students];

    if (user?.role === "guru" && teacherClassId) {
      data = data.filter((s) => {
        const clsId = s.class_id ?? s.class?.id ?? null;
        return Number(clsId) === Number(teacherClassId);
      });
    }

    if (selectedClass !== "all") {
      data = data.filter((s) => {
        const clsId = s.class_id ?? s.class?.id ?? null;
        return Number(clsId) === Number(selectedClass);
      });
    }

    if (statusFilter !== "all") {
      data = data.filter((s) => (s.status ?? "aktif") === statusFilter);
    }

    if (search.trim()) {
      const query = search.toLowerCase();
      data = data.filter((s) => {
        const name = s.user?.name ?? s.user?.username ?? "";
        const email = s.user?.email ?? "";
        const className = s.class?.name ?? "";
        return (
          name.toLowerCase().includes(query) ||
          (s.nis ?? "").toLowerCase().includes(query) ||
          email.toLowerCase().includes(query) ||
          className.toLowerCase().includes(query)
        );
      });
    }

    return data;
  }, [students, user?.role, teacherClassId, selectedClass, statusFilter, search]);

  const stats = useMemo(() => {
    const total = students.length;
    const aktif = students.filter((s) => (s.status ?? "aktif") === "aktif").length;
    const nonaktif = students.filter((s) => (s.status ?? "aktif") !== "aktif").length;
    return { total, aktif, nonaktif };
  }, [students]);

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setSelectedClass(user?.role === "guru" && teacherClassId ? String(teacherClassId) : "all");
    fetchStudents();
  };

  const openCreateModal = () => {
    setModalMode("create");
    setSelectedStudent(null);
    setFormState({
      ...initialFormState,
      accountMode: "new",
      class_id:
        user?.role === "guru" && teacherClassId
          ? String(teacherClassId)
          : "",
      enrollment_date: new Date().toISOString().slice(0, 10),
    });
    setIsModalOpen(true);
  };

  const openEditModal = (studentRecord: StudentRecord) => {
    setModalMode("edit");
    setSelectedStudent(studentRecord);
    setFormState({
      accountMode: "existing",
      user_id: String(studentRecord.user_id ?? ""),
      user_name: studentRecord.user?.name ?? "",
      user_email: studentRecord.user?.email ?? "",
      user_password: "",
      user_phone: studentRecord.user?.phone ?? "",
      user_status: studentRecord.user?.status ?? "aktif",
      nis: studentRecord.nis ?? "",
      class_id: studentRecord.class_id
        ? String(studentRecord.class_id)
        : studentRecord.class?.id
        ? String(studentRecord.class.id)
        : "",
      guardian_name: studentRecord.guardian_name ?? "",
      guardian_contact: studentRecord.guardian_contact ?? "",
      enrollment_date: studentRecord.enrollment_date
        ? studentRecord.enrollment_date.slice(0, 10)
        : "",
      rfid_id: studentRecord.rfid_id ? String(studentRecord.rfid_id) : "",
      status: studentRecord.status ?? "aktif",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
    setFormState(initialFormState);
  };

  const handleFormChange = (field: keyof StudentFormState, value: string) => {
    setFormState((prev) => {
      if (field === "accountMode") {
        return {
          ...prev,
          accountMode: value as StudentFormState["accountMode"],
          user_id: "",
          user_name: "",
          user_email: "",
          user_password: "",
          user_phone: "",
          user_status: "aktif",
        };
      }

      return { ...prev, [field]: value };
    });
  };

  const buildPayload = () => {
    const payload: Record<string, any> = {
      nis: formState.nis || null,
      class_id: formState.class_id ? Number(formState.class_id) : null,
      guardian_name: formState.guardian_name || null,
      guardian_contact: formState.guardian_contact || null,
      enrollment_date: formState.enrollment_date || null,
      rfid_id: formState.rfid_id ? Number(formState.rfid_id) : null,
      status: formState.status,
    };

    if (modalMode === "create") {
      if (formState.accountMode === "existing") {
        payload.user_id = formState.user_id ? Number(formState.user_id) : null;
      } else {
        payload.user_name = formState.user_name;
        payload.user_email = formState.user_email;
        payload.user_password = formState.user_password;
        if (formState.user_phone) {
          payload.user_phone = formState.user_phone;
        }
        if (formState.user_status) {
          payload.user_status = formState.user_status;
        }
      }
    }

    return payload;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = getToken();
    if (!token) {
      Swal.fire({ icon: "warning", title: "Tidak ada token" });
      return;
    }

    if (modalMode === "create") {
      if (!formState.nis || !formState.enrollment_date) {
        Swal.fire({
          icon: "warning",
          title: "Form belum lengkap",
          text: "NIS dan tanggal masuk wajib diisi.",
        });
        return;
      }

      if (formState.accountMode === "existing") {
        if (!formState.user_id) {
          Swal.fire({
            icon: "warning",
            title: "User belum dipilih",
            text: "Isi User ID atau pilih opsi buat akun baru.",
          });
          return;
        }
      } else {
        if (!formState.user_name || !formState.user_email || !formState.user_password) {
          Swal.fire({
            icon: "warning",
            title: "Data akun belum lengkap",
            text: "Nama, email, dan password wajib diisi untuk membuat akun baru.",
          });
          return;
        }
      }
    }

    const payload = buildPayload();

    setSubmitting(true);
    try {
      if (modalMode === "create") {
        await api.post("/lms/students", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Data siswa berhasil ditambahkan.",
        });
      } else if (selectedStudent) {
        await api.put(`/lms/students/${selectedStudent.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Data siswa berhasil diperbarui.",
        });
      }
      closeModal();
      fetchStudents();
    } catch (error: any) {
      console.error("Gagal menyimpan siswa", error);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text:
          error?.response?.data?.message ??
          "Terjadi kesalahan saat menyimpan data siswa.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (studentRecord: StudentRecord) => {
    if (!canDelete) return;
    const confirm = await Swal.fire({
      icon: "warning",
      title: "Hapus siswa?",
      text: `Data siswa ${studentRecord.user?.name ?? ""} akan dihapus permanen.`,
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
    });
    if (!confirm.isConfirmed) return;

    const token = getToken();
    if (!token) return;

    try {
      await api.delete(`/lms/students/${studentRecord.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Swal.fire({ icon: "success", title: "Berhasil", text: "Data siswa dihapus." });
      fetchStudents();
    } catch (error: any) {
      console.error("Gagal menghapus siswa", error);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text:
          error?.response?.data?.message ??
          "Tidak dapat menghapus data siswa.",
      });
    }
  };

  const renderModal = () => {
    if (!isModalOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
        <div className="w-full max-w-3xl rounded-2xl bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                {modalMode === "create" ? "Tambah Siswa" : "Edit Data Siswa"}
              </h2>
              <p className="text-sm text-gray-500">
                {modalMode === "create"
                  ? "Lengkapi form untuk menambahkan siswa baru ke LMS."
                  : "Perbarui informasi siswa sesuai kebutuhan."}
              </p>
            </div>
            <button
              onClick={closeModal}
              className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
              aria-label="Tutup"
            >
              <span className="text-xl leading-none">×</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-5 px-6 py-6">
            {modalMode === "create" && (
              <div className="space-y-4 rounded-2xl border border-gray-100 bg-gray-50/40 p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700">Pengaturan Akun LMS</h3>
                    <p className="text-xs text-gray-500">
                      Pilih apakah ingin menggunakan akun yang sudah ada atau membuat akun baru sekaligus.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {ACCOUNT_MODE_OPTIONS.map((option) => {
                      const isActive = formState.accountMode === option.value;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => handleFormChange("accountMode", option.value)}
                          className={`rounded-xl border px-3 py-2 text-sm font-semibold transition ${
                            isActive
                              ? "border-orange-500 bg-white text-orange-600 shadow-sm"
                              : "border-transparent bg-transparent text-gray-500 hover:border-orange-200 hover:text-orange-500"
                          }`}
                        >
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {formState.accountMode === "existing" ? (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-1">
                      <label className="mb-1 block text-sm font-medium text-gray-600">
                        User ID (akun siswa)
                      </label>
                      <input
                        type="number"
                        value={formState.user_id}
                        onChange={(e) => handleFormChange("user_id", e.target.value)}
                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                        placeholder="Masukkan ID user yang sudah ada"
                        required={formState.accountMode === "existing"}
                      />
                      <p className="mt-1 text-xs text-gray-400">
                        Pastikan user sudah memiliki peran siswa sebelum ditautkan.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-600">
                        Nama Lengkap
                      </label>
                      <input
                        type="text"
                        value={formState.user_name}
                        onChange={(e) => handleFormChange("user_name", e.target.value)}
                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                        placeholder="Nama sesuai akun"
                        required={formState.accountMode === "new"}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-600">
                        Email
                      </label>
                      <input
                        type="email"
                        value={formState.user_email}
                        onChange={(e) => handleFormChange("user_email", e.target.value)}
                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                        placeholder="contoh@email.com"
                        required={formState.accountMode === "new"}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-600">
                        Password Awal
                      </label>
                      <input
                        type="password"
                        value={formState.user_password}
                        onChange={(e) => handleFormChange("user_password", e.target.value)}
                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                        placeholder="Minimal 6 karakter"
                        required={formState.accountMode === "new"}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-600">
                        Nomor Telepon (opsional)
                      </label>
                      <input
                        type="text"
                        value={formState.user_phone}
                        onChange={(e) => handleFormChange("user_phone", e.target.value)}
                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                        placeholder="08xxxxxxxxxx"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-600">
                        Status Akun
                      </label>
                      <select
                        value={formState.user_status}
                        onChange={(e) => handleFormChange("user_status", e.target.value)}
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
                )}
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-600">
                  NIS
                </label>
                <input
                  type="text"
                  value={formState.nis}
                  onChange={(e) => handleFormChange("nis", e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                  placeholder="Nomor Induk Siswa"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-600">
                  Kelas
                </label>
                <select
                  value={formState.class_id}
                  onChange={(e) => handleFormChange("class_id", e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
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
                  Tanggal Masuk
                </label>
                <input
                  type="date"
                  value={formState.enrollment_date}
                  onChange={(e) => handleFormChange("enrollment_date", e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                  required={modalMode === "create"}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-600">
                  Nama Wali
                </label>
                <input
                  type="text"
                  value={formState.guardian_name}
                  onChange={(e) => handleFormChange("guardian_name", e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                  placeholder="Opsional"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-600">
                  Kontak Wali
                </label>
                <input
                  type="text"
                  value={formState.guardian_contact}
                  onChange={(e) => handleFormChange("guardian_contact", e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                  placeholder="Opsional"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-600">
                  RFID ID
                </label>
                <input
                  type="number"
                  value={formState.rfid_id}
                  onChange={(e) => handleFormChange("rfid_id", e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                  placeholder="Opsional"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-600">
                  Status
                </label>
                <select
                  value={formState.status}
                  onChange={(e) => handleFormChange("status", e.target.value)}
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
    <div className="min-h-screen overflow-y-auto bg-gray-50">
      <DashHeader user={user} student={student} teacher={teacher} />

      <section className="space-y-6 px-4 pb-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <Users className="h-10 w-10 rounded-full bg-orange-100 p-2 text-orange-500" />
              <div>
                <p className="text-xs font-medium uppercase text-gray-500">Total Siswa</p>
                <p className="text-3xl font-semibold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <GraduationCap className="h-10 w-10 rounded-full bg-emerald-100 p-2 text-emerald-600" />
              <div>
                <p className="text-xs font-medium uppercase text-gray-500">Aktif</p>
                <p className="text-3xl font-semibold text-emerald-600">{stats.aktif}</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <GraduationCap className="h-10 w-10 rounded-full bg-gray-100 p-2 text-gray-500" />
              <div>
                <p className="text-xs font-medium uppercase text-gray-500">Nonaktif</p>
                <p className="text-3xl font-semibold text-gray-600">{stats.nonaktif}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-4">
              <div className="relative">
                <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">
                  Cari
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Nama, NIS, email, kelas"
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                  />
                  <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">
                  Kelas
                </label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                  disabled={user?.role === "guru" && !!teacherClassId}
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
                <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                >
                  <option value="all">Semua</option>
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-3 self-end">
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
                >
                  <RefreshCw className="h-4 w-4" /> Reset
                </button>
              </div>
            </div>

            {canCreate && (
              <button
                onClick={openCreateModal}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-orange-600"
              >
                <Plus className="h-4 w-4" /> Tambah Siswa
              </button>
            )}
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100 text-sm">
              <thead className="bg-gray-50 text-xs font-semibold uppercase text-gray-500">
                <tr>
                  <th className="px-6 py-3 text-left">Nama</th>
                  <th className="px-6 py-3 text-left">NIS</th>
                  <th className="px-6 py-3 text-left">Kelas</th>
                  <th className="px-6 py-3 text-left">Email</th>
                  <th className="px-6 py-3 text-left">Wali</th>
                  <th className="px-6 py-3 text-left">RFID</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  {isStaff && <th className="px-6 py-3 text-right">Aksi</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={isStaff ? 8 : 7} className="px-6 py-10 text-center text-sm text-gray-500">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin text-orange-500" />
                        Memuat data siswa...
                      </div>
                    </td>
                  </tr>
                ) : filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={isStaff ? 8 : 7} className="px-6 py-12 text-center text-sm font-medium text-gray-500">
                      Tidak ada data siswa yang cocok dengan filter.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((s) => {
                    const className = s.class?.name ?? "-";
                    const wali = s.guardian_name
                      ? `${s.guardian_name}${s.guardian_contact ? ` • ${s.guardian_contact}` : ""}`
                      : "-";
                    return (
                      <tr key={s.id} className="hover:bg-orange-50/50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-800">
                          {s.user?.name ?? s.user?.username ?? "-"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{s.nis ?? "-"}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{className}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{s.user?.email ?? "-"}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{wali}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{s.rfid?.id ?? s.rfid_id ?? "-"}</td>
                        <td className="px-6 py-4">
                          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_BADGE[s.status ?? "aktif"] ?? STATUS_BADGE.aktif}`}>
                            {STATUS_OPTIONS.find((opt) => opt.value === (s.status ?? "aktif"))?.label ?? s.status}
                          </span>
                        </td>
                        {isStaff && (
                          <td className="px-6 py-4 text-right text-sm">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => openEditModal(s)}
                                className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 px-3 py-1.5 text-xs font-medium text-emerald-600 hover:bg-emerald-50"
                              >
                                <Pencil className="h-3.5 w-3.5" /> Edit
                              </button>
                              {canDelete && (
                                <button
                                  onClick={() => handleDelete(s)}
                                  className="inline-flex items-center gap-1 rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50"
                                >
                                  <Trash2 className="h-3.5 w-3.5" /> Hapus
                                </button>
                              )}
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
