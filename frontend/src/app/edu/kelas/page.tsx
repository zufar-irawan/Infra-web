"use client";

import DashHeader from "@/app/components/DashHeader";
import { useEduData } from "@/app/edu/context";
import api from "../../lib/api";
import Swal from "sweetalert2";
import {
  BookOpen,
  GraduationCap,
  Info,
  Loader2,
  Pencil,
  Plus,
  Search,
  Settings,
  Trash2,
  Users,
  UserMinus,
  UserPlus,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

type ClassRecord = {
  id: number;
  name: string;
  description?: string | null;
  status: string;
  students?: any[];
  teachers?: any[];
  class_students?: any[];
  class_teachers?: any[];
};

type ClassFormState = {
  name: string;
  description: string;
  status: "aktif" | "nonaktif";
};

type TeacherAssignmentState = {
  teacher_id: string;
  subject_id: string;
};

type StudentAssignmentState = {
  student_id: string;
};

const STATUS_OPTIONS = [
  { value: "aktif", label: "Aktif" },
  { value: "nonaktif", label: "Nonaktif" },
];

const STATUS_BADGE: Record<string, string> = {
  aktif: "bg-emerald-100 text-emerald-700",
  nonaktif: "bg-gray-100 text-gray-600",
};

const initialFormState: ClassFormState = {
  name: "",
  description: "",
  status: "aktif",
};

const initialTeacherAssignment: TeacherAssignmentState = {
  teacher_id: "",
  subject_id: "",
};

const initialStudentAssignment: StudentAssignmentState = {
  student_id: "",
};

const getToken = () => {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem("token");
};

export default function KelasPage() {
  const {
    user,
    student,
    teacher,
    classes: classesContext,
    teachers: teachersContext,
    students: studentsContext,
    subjects,
  } = useEduData();

  const [classes, setClasses] = useState<ClassRecord[]>(
    Array.isArray(classesContext) ? (classesContext as ClassRecord[]) : [],
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [formState, setFormState] = useState<ClassFormState>(initialFormState);
  const [selectedClass, setSelectedClass] = useState<ClassRecord | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const [isManageModalOpen, setIsManageModalOpen] = useState<boolean>(false);
  const [detailClass, setDetailClass] = useState<ClassRecord | null>(null);
  const [detailLoading, setDetailLoading] = useState<boolean>(false);
  const [teacherAssignment, setTeacherAssignment] =
    useState<TeacherAssignmentState>(initialTeacherAssignment);
  const [studentAssignment, setStudentAssignment] =
    useState<StudentAssignmentState>(initialStudentAssignment);
  const [teacherAssignSubmitting, setTeacherAssignSubmitting] =
    useState<boolean>(false);
  const [studentAssignSubmitting, setStudentAssignSubmitting] =
    useState<boolean>(false);

  const canManage = user?.role === "admin";

  useEffect(() => {
    if (Array.isArray(classesContext) && classesContext.length) {
      setClasses(classesContext as ClassRecord[]);
      setLoading(false);
    }
  }, [classesContext]);

  const fetchClasses = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await api.get("/lms/classes", {
        headers: { Authorization: `Bearer ${token}` },
        params: { per_page: 100 },
      });
      const payload = Array.isArray(res.data)
        ? res.data
        : res.data?.data ?? [];
      setClasses(payload);
    } catch (error: any) {
      console.error("Gagal mengambil data kelas", error);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text:
          error?.response?.data?.message ??
          "Tidak dapat mengambil data kelas.",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    fetchClasses();
  }, [user, fetchClasses]);

  const filteredClasses = useMemo(() => {
    let data = [...classes];

    if (statusFilter !== "all") {
      data = data.filter((kelas) => (kelas.status ?? "aktif") === statusFilter);
    }

    if (search.trim()) {
      const query = search.toLowerCase();
      data = data.filter((kelas) =>
        [kelas.name, kelas.description]
          .filter(Boolean)
          .some((text) => String(text).toLowerCase().includes(query)),
      );
    }

    return data;
  }, [classes, statusFilter, search]);

  const stats = useMemo(() => {
    const total = classes.length;
    const aktif = classes.filter((kelas) => (kelas.status ?? "aktif") === "aktif").length;
    const nonaktif = classes.filter((kelas) => (kelas.status ?? "aktif") !== "aktif").length;
    return { total, aktif, nonaktif };
  }, [classes]);

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("all");
    fetchClasses();
  };

  const openCreateModal = () => {
    setModalMode("create");
    setSelectedClass(null);
    setFormState(initialFormState);
    setIsModalOpen(true);
  };

  const openEditModal = (kelas: ClassRecord) => {
    setModalMode("edit");
    setSelectedClass(kelas);
    setFormState({
      name: kelas.name ?? "",
      description: kelas.description ?? "",
      status: (kelas.status as "aktif" | "nonaktif") ?? "aktif",
    });
    setIsModalOpen(true);
  };

  const closeClassModal = () => {
    setIsModalOpen(false);
    setSelectedClass(null);
    setFormState(initialFormState);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = getToken();
    if (!token) {
      Swal.fire({ icon: "warning", title: "Tidak ada token" });
      return;
    }

    setSubmitting(true);
    try {
      if (modalMode === "create") {
        await api.post(
          "/lms/classes",
          {
            name: formState.name,
            description: formState.description || null,
            status: formState.status,
          },
          { headers: { Authorization: `Bearer ${token}` } },
        );
        Swal.fire({ icon: "success", title: "Berhasil", text: "Kelas berhasil dibuat." });
      } else if (selectedClass) {
        await api.put(
          `/lms/classes/${selectedClass.id}`,
          {
            name: formState.name,
            description: formState.description || null,
            status: formState.status,
          },
          { headers: { Authorization: `Bearer ${token}` } },
        );
        Swal.fire({ icon: "success", title: "Berhasil", text: "Kelas berhasil diperbarui." });
      }

      closeClassModal();
      fetchClasses();
    } catch (error: any) {
      console.error("Gagal menyimpan kelas", error);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text:
          error?.response?.data?.message ??
          "Terjadi kesalahan saat menyimpan data kelas.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (kelas: ClassRecord) => {
    if (!canManage) return;

    const confirm = await Swal.fire({
      icon: "warning",
      title: "Hapus kelas?",
      text: `Kelas ${kelas.name} akan dihapus permanen.`,
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
      confirmButtonColor: "#ef4444",
    });

    if (!confirm.isConfirmed) return;

    const token = getToken();
    if (!token) return;

    try {
      await api.delete(`/lms/classes/${kelas.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Swal.fire({ icon: "success", title: "Berhasil", text: "Kelas dihapus." });
      fetchClasses();
    } catch (error: any) {
      console.error("Gagal menghapus kelas", error);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text:
          error?.response?.data?.message ??
          "Tidak dapat menghapus data kelas.",
      });
    }
  };

  const fetchClassDetail = useCallback(
    async (classId: number) => {
      const token = getToken();
      if (!token) return;

      setDetailLoading(true);
      try {
        const res = await api.get(`/lms/classes/${classId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDetailClass(res.data);
      } catch (error: any) {
        console.error("Gagal mengambil detail kelas", error);
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text:
            error?.response?.data?.message ??
            "Tidak dapat memuat detail kelas.",
        });
      } finally {
        setDetailLoading(false);
      }
    },
    [],
  );

  const openManageModal = (kelas: ClassRecord) => {
    if (!canManage) return;
    setDetailClass(kelas);
    setTeacherAssignment(initialTeacherAssignment);
    setStudentAssignment(initialStudentAssignment);
    setIsManageModalOpen(true);
    fetchClassDetail(kelas.id);
  };

  const closeManageModal = () => {
    setIsManageModalOpen(false);
    setDetailClass(null);
    setTeacherAssignment(initialTeacherAssignment);
    setStudentAssignment(initialStudentAssignment);
  };

  const teacherAssignments = useMemo(() => {
    if (!detailClass) return [];
    const raw = (detailClass as any)?.class_teachers ?? [];
    return Array.isArray(raw) ? raw : [];
  }, [detailClass]);

  const studentAssignments = useMemo(() => {
    if (!detailClass) return [];
    const raw = (detailClass as any)?.class_students ?? [];
    return Array.isArray(raw) ? raw : [];
  }, [detailClass]);

  const assignedStudentIds = useMemo(() => {
    return new Set<number>(studentAssignments.map((item: any) => item.student_id));
  }, [studentAssignments]);

  const availableStudents = useMemo(() => {
    const list = Array.isArray(studentsContext) ? (studentsContext as any[]) : [];
    return list.filter((s) => !assignedStudentIds.has(s.id));
  }, [studentsContext, assignedStudentIds]);

  const availableSubjects = useMemo(() => {
    return Array.isArray(subjects) ? (subjects as any[]) : [];
  }, [subjects]);

  const availableTeachers = useMemo(() => {
    const list = Array.isArray(teachersContext) ? (teachersContext as any[]) : [];
    return list.filter((t) => (t.status ?? "aktif") === "aktif");
  }, [teachersContext]);

  const handleAssignTeacher = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!detailClass) return;
    const token = getToken();
    if (!token) return;

    if (!teacherAssignment.teacher_id || !teacherAssignment.subject_id) {
      Swal.fire({
        icon: "warning",
        title: "Form belum lengkap",
        text: "Pilih guru dan mata pelajaran sebelum menyimpan.",
      });
      return;
    }

    setTeacherAssignSubmitting(true);
    try {
      await api.post(
        "/lms/class-teachers",
        {
          class_id: detailClass.id,
          teacher_id: Number(teacherAssignment.teacher_id),
          subject_id: Number(teacherAssignment.subject_id),
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      Swal.fire({ icon: "success", title: "Berhasil", text: "Guru ditambahkan." });
      setTeacherAssignment(initialTeacherAssignment);
      fetchClassDetail(detailClass.id);
      fetchClasses();
    } catch (error: any) {
      console.error("Gagal menambahkan guru ke kelas", error);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text:
          error?.response?.data?.message ??
          "Tidak dapat menambahkan guru. Pastikan kombinasi guru & mapel belum digunakan.",
      });
    } finally {
      setTeacherAssignSubmitting(false);
    }
  };

  const handleAssignStudent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!detailClass) return;
    const token = getToken();
    if (!token) return;

    if (!studentAssignment.student_id) {
      Swal.fire({
        icon: "warning",
        title: "Form belum lengkap",
        text: "Pilih siswa terlebih dahulu.",
      });
      return;
    }

    setStudentAssignSubmitting(true);
    try {
      await api.post(
        "/lms/class-students",
        {
          class_id: detailClass.id,
          student_id: Number(studentAssignment.student_id),
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      Swal.fire({ icon: "success", title: "Berhasil", text: "Siswa ditambahkan." });
      setStudentAssignment(initialStudentAssignment);
      fetchClassDetail(detailClass.id);
      fetchClasses();
    } catch (error: any) {
      console.error("Gagal menambahkan siswa ke kelas", error);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text:
          error?.response?.data?.message ??
          "Tidak dapat menambahkan siswa ke kelas ini.",
      });
    } finally {
      setStudentAssignSubmitting(false);
    }
  };

  const handleRemoveTeacher = async (assignment: any) => {
    const token = getToken();
    if (!token || !detailClass) return;

    const confirm = await Swal.fire({
      icon: "warning",
      title: "Hapus guru dari kelas?",
      text: `Guru ${(assignment?.teacher?.user?.name) ?? ""} akan dilepas dari kelas ini.`,
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
      confirmButtonColor: "#ef4444",
    });

    if (!confirm.isConfirmed) return;

    try {
      await api.delete(`/lms/class-teachers/${assignment.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Swal.fire({ icon: "success", title: "Berhasil", text: "Guru dihapus dari kelas." });
      fetchClassDetail(detailClass.id);
      fetchClasses();
    } catch (error: any) {
      console.error("Gagal menghapus guru dari kelas", error);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text:
          error?.response?.data?.message ??
          "Tidak dapat menghapus guru dari kelas ini.",
      });
    }
  };

  const handleRemoveStudent = async (assignment: any) => {
    const token = getToken();
    if (!token || !detailClass) return;

    const confirm = await Swal.fire({
      icon: "warning",
      title: "Hapus siswa dari kelas?",
      text: `Siswa ${(assignment?.student?.user?.name) ?? ""} akan dilepas dari kelas ini.`,
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
      confirmButtonColor: "#ef4444",
    });

    if (!confirm.isConfirmed) return;

    try {
      await api.delete(`/lms/class-students/${assignment.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Swal.fire({ icon: "success", title: "Berhasil", text: "Siswa dihapus dari kelas." });
      fetchClassDetail(detailClass.id);
      fetchClasses();
    } catch (error: any) {
      console.error("Gagal menghapus siswa dari kelas", error);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text:
          error?.response?.data?.message ??
          "Tidak dapat menghapus siswa dari kelas ini.",
      });
    }
  };

  const renderClassModal = () => {
    if (!isModalOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
        <div className="w-full max-w-xl rounded-2xl bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                {modalMode === "create" ? "Tambah Kelas" : "Edit Kelas"}
              </h2>
              <p className="text-sm text-gray-500">
                {modalMode === "create"
                  ? "Lengkapi form berikut untuk membuat kelas baru."
                  : "Perbarui informasi kelas sesuai kebutuhan."}
              </p>
            </div>
            <button
              onClick={closeClassModal}
              className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
              aria-label="Tutup"
            >
              <span className="text-xl leading-none">×</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-4 px-6 py-6">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-600">
                Nama Kelas
              </label>
              <input
                type="text"
                value={formState.name}
                onChange={(e) => setFormState((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                placeholder="Contoh: XI PPLG 1"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-600">
                Deskripsi
              </label>
              <textarea
                value={formState.description}
                onChange={(e) => setFormState((prev) => ({ ...prev, description: e.target.value }))}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                rows={3}
                placeholder="Tuliskan ringkasan atau catatan untuk kelas ini (opsional)."
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-600">
                Status Kelas
              </label>
              <select
                value={formState.status}
                onChange={(e) =>
                  setFormState((prev) => ({ ...prev, status: e.target.value as "aktif" | "nonaktif" }))
                }
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
              <button
                type="button"
                onClick={closeClassModal}
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

  const renderManageModal = () => {
    if (!isManageModalOpen || !detailClass) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
        <div className="w-full max-w-4xl rounded-2xl bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Kelola Keanggotaan Kelas</h2>
              <p className="text-sm text-gray-500">
                Tambah atau hapus guru dan siswa untuk kelas {detailClass.name}.
              </p>
            </div>
            <button
              onClick={closeManageModal}
              className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
              aria-label="Tutup"
            >
              <span className="text-xl leading-none">×</span>
            </button>
          </div>

          <div className="grid gap-6 px-6 py-6">
            <div className="rounded-2xl bg-gray-50/60 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{detailClass.name}</h3>
                  <p className="text-sm text-gray-500">{detailClass.description || "Belum ada deskripsi."}</p>
                </div>
                <span
                  className={`h-fit rounded-full px-3 py-1 text-xs font-semibold ${
                    STATUS_BADGE[detailClass.status ?? "aktif"] ?? STATUS_BADGE.aktif
                  }`}
                >
                  {(detailClass.status ?? "aktif") === "aktif" ? "Aktif" : "Nonaktif"}
                </span>
              </div>
            </div>

            {detailLoading ? (
              <div className="flex items-center justify-center py-10 text-sm text-gray-500">
                <Loader2 className="mr-2 h-5 w-5 animate-spin text-orange-500" /> Memuat data kelas...
              </div>
            ) : (
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2">
                        <Users className="h-5 w-5 text-orange-500" /> Guru Pengajar
                      </h3>
                      <p className="text-xs text-gray-500">Kelola guru beserta mata pelajaran yang diampu.</p>
                    </div>
                  </div>

                  <form onSubmit={handleAssignTeacher} className="mb-4 grid gap-3">
                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">
                        Pilih Guru
                      </label>
                      <select
                        value={teacherAssignment.teacher_id}
                        onChange={(e) =>
                          setTeacherAssignment((prev) => ({ ...prev, teacher_id: e.target.value }))
                        }
                        className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                      >
                        <option value="">Pilih guru</option>
                        {availableTeachers.map((t: any) => (
                          <option key={t.id} value={t.id}>
                            {t.user?.name ?? `Guru ${t.id}`}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">
                        Mata Pelajaran
                      </label>
                      <select
                        value={teacherAssignment.subject_id}
                        onChange={(e) =>
                          setTeacherAssignment((prev) => ({ ...prev, subject_id: e.target.value }))
                        }
                        className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                      >
                        <option value="">Pilih mapel</option>
                        {availableSubjects.map((s: any) => (
                          <option key={s.id} value={s.id}>
                            {s.name ?? `Mapel ${s.id}`}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button
                      type="submit"
                      disabled={teacherAssignSubmitting}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-orange-600 disabled:opacity-70"
                    >
                      {teacherAssignSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                      <UserPlus className="h-4 w-4" /> Tambah Guru
                    </button>
                  </form>

                  <div className="space-y-3">
                    {teacherAssignments.length === 0 ? (
                      <p className="rounded-xl border border-dashed border-gray-200 bg-gray-50 py-6 text-center text-sm text-gray-500">
                        Belum ada guru di kelas ini.
                      </p>
                    ) : (
                      teacherAssignments.map((assignment: any) => (
                        <div
                          key={assignment.id}
                          className="flex items-center justify-between rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm"
                        >
                          <div>
                            <p className="text-sm font-semibold text-gray-800">
                              {assignment.teacher?.user?.name ?? "Nama guru tidak tersedia"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {assignment.subject?.name ?? "Mata pelajaran belum diatur"}
                            </p>
                          </div>
                          <button
                            onClick={() => handleRemoveTeacher(assignment)}
                            className="inline-flex items-center gap-1 rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50"
                          >
                            <UserMinus className="h-3.5 w-3.5" /> Hapus
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2">
                        <GraduationCap className="h-5 w-5 text-orange-500" /> Siswa Terdaftar
                      </h3>
                      <p className="text-xs text-gray-500">Kelola anggota siswa yang tergabung.</p>
                    </div>
                  </div>

                  <form onSubmit={handleAssignStudent} className="mb-4 grid gap-3">
                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">
                        Pilih Siswa
                      </label>
                      <select
                        value={studentAssignment.student_id}
                        onChange={(e) =>
                          setStudentAssignment((prev) => ({ ...prev, student_id: e.target.value }))
                        }
                        className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                      >
                        <option value="">Pilih siswa</option>
                        {availableStudents.map((s: any) => (
                          <option key={s.id} value={s.id}>
                            {s.user?.name ?? `Siswa ${s.id}`} {s.nis ? `(${s.nis})` : ""}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button
                      type="submit"
                      disabled={studentAssignSubmitting}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-orange-600 disabled:opacity-70"
                    >
                      {studentAssignSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                      <UserPlus className="h-4 w-4" /> Tambah Siswa
                    </button>
                  </form>

                  <div className="space-y-3">
                    {studentAssignments.length === 0 ? (
                      <p className="rounded-xl border border-dashed border-gray-200 bg-gray-50 py-6 text-center text-sm text-gray-500">
                        Belum ada siswa di kelas ini.
                      </p>
                    ) : (
                      studentAssignments.map((assignment: any) => (
                        <div
                          key={assignment.id}
                          className="flex items-center justify-between rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm"
                        >
                          <div>
                            <p className="text-sm font-semibold text-gray-800">
                              {assignment.student?.user?.name ?? "Nama siswa tidak tersedia"}
                            </p>
                            <p className="text-xs text-gray-500">
                              NIS: {assignment.student?.nis ?? "-"}
                            </p>
                          </div>
                          <button
                            onClick={() => handleRemoveStudent(assignment)}
                            className="inline-flex items-center gap-1 rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50"
                          >
                            <UserMinus className="h-3.5 w-3.5" /> Hapus
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-6 py-4">
            <button
              onClick={closeManageModal}
              className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
            >
              Tutup
            </button>
          </div>
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
              <BookOpen className="h-10 w-10 rounded-full bg-orange-100 p-2 text-orange-500" />
              <div>
                <p className="text-xs font-medium uppercase text-gray-500">Total Kelas</p>
                <p className="text-3xl font-semibold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <Users className="h-10 w-10 rounded-full bg-emerald-100 p-2 text-emerald-600" />
              <div>
                <p className="text-xs font-medium uppercase text-gray-500">Aktif</p>
                <p className="text-3xl font-semibold text-emerald-600">{stats.aktif}</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <Settings className="h-10 w-10 rounded-full bg-gray-100 p-2 text-gray-500" />
              <div>
                <p className="text-xs font-medium uppercase text-gray-500">Nonaktif</p>
                <p className="text-3xl font-semibold text-gray-600">{stats.nonaktif}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
              <div className="relative">
                <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">
                  Cari
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Nama atau deskripsi kelas"
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                  />
                  <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                </div>
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
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-3 self-end">
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
                >
                  Reset
                </button>
              </div>
            </div>

            {canManage && (
              <button
                onClick={openCreateModal}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-orange-600"
              >
                <Plus className="h-4 w-4" /> Tambah Kelas
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
          {loading ? (
            <div className="col-span-full flex items-center justify-center py-16 text-sm text-gray-500">
              <Loader2 className="mr-2 h-5 w-5 animate-spin text-orange-500" /> Memuat data kelas...
            </div>
          ) : filteredClasses.length === 0 ? (
            <p className="col-span-full rounded-2xl border border-dashed border-gray-200 bg-white py-10 text-center text-sm font-medium text-gray-500">
              {search || statusFilter !== "all"
                ? "Tidak ada kelas yang cocok dengan filter."
                : "Belum ada data kelas yang tersedia."}
            </p>
          ) : (
            filteredClasses.map((kelas) => {
              const teacherNames = ((kelas as any)?.class_teachers ?? []).map(
                (assignment: any) => assignment.teacher?.user?.name,
              );
              const studentCount = ((kelas as any)?.class_students ?? []).length;

              return (
                <div
                  key={kelas.id}
                  className="group flex h-full flex-col justify-between rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-200 hover:border-orange-200 hover:shadow-lg"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-6 w-6 text-orange-500" />
                        <h2 className="text-lg font-semibold text-gray-800">{kelas.name}</h2>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          STATUS_BADGE[kelas.status ?? "aktif"] ?? STATUS_BADGE.aktif
                        }`}
                      >
                        {(kelas.status ?? "aktif") === "aktif" ? "Aktif" : "Nonaktif"}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600">
                      {kelas.description || "Belum ada deskripsi kelas."}
                    </p>

                    <div className="rounded-xl bg-gray-50 p-4">
                      <div className="flex items-center justify-between text-sm text-gray-700">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-blue-500" />
                          <span>{studentCount} siswa</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Info className="h-4 w-4 text-purple-500" />
                          <span>{teacherNames.length} guru</span>
                        </div>
                      </div>
                      {teacherNames.length > 0 && (
                        <div className="mt-3 text-xs text-gray-500">
                          <p className="font-medium text-gray-600">Guru pengajar:</p>
                          <p>{teacherNames.slice(0, 3).join(", ")}{teacherNames.length > 3 ? " dan lainnya" : ""}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {canManage ? (
                      <>
                        <button
                          onClick={() => openManageModal(kelas)}
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-medium text-orange-600 transition hover:bg-orange-100"
                        >
                          Kelola Anggota
                        </button>
                        <button
                          onClick={() => openEditModal(kelas)}
                          className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 px-4 py-2 text-sm font-medium text-emerald-600 hover:bg-emerald-50"
                        >
                          <Pencil className="h-4 w-4" /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(kelas)}
                          className="inline-flex items-center gap-2 rounded-xl border border-rose-200 px-4 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50"
                        >
                          <Trash2 className="h-4 w-4" /> Hapus
                        </button>
                      </>
                    ) : (
                      <p className="text-xs text-gray-400">Hubungi administrator untuk mengubah keanggotaan kelas.</p>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {renderClassModal()}
      {renderManageModal()}
    </div>
  );
}
