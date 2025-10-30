// filepath: c:\laragon\www\Infra-web\frontend\src\app\edu\tugas\[id]\page.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { useEduData } from "@/app/edu/context";
import { Calendar, FileText, Link as LinkIcon, Loader2, Download, ExternalLink, Clock, CheckCircle2, XCircle, User, Paperclip } from "lucide-react";
import TugasUploadModal from "@/app/components/subComponents/forTugas/TugasUploadModal";
import Swal from "sweetalert2";

// Types are defensive to tolerate partial payloads
interface AssignmentFile {
  id?: number | string;
  path: string; // e.g. "storage/assignments/filename.pdf" (may vary)
  name?: string | null;
  original_name?: string | null;
  type?: 'file' | 'link' | string; // added: to distinguish between file and link
  mime?: string | null;
}

interface SubmissionFile {
  id?: number | string;
  path?: string | null;
  url?: string | null;
  name?: string | null;
  original_name?: string | null;
  mime?: string | null;
  size?: number | null;
}

interface AssignmentDetail {
  id: number | string;
  title: string;
  description?: string | null;
  deadline?: string | null; // ISO or Y-m-d H:i:s
  created_by?: number | string;
  teacher?: any;
  creator?: any;
  class?: any;
  class_id?: number | string; // added: direct class id if provided
  links?: string[];
  reference_links?: string[]; // possible alt field
  files?: AssignmentFile[] | string[]; // accept strings too
  submissions?: any[]; // added: list of submissions
}

function formatDeadline(dateString?: string | null) {
  if (!dateString) return "-";
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return dateString;
  return d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function basename(p: string) {
  try {
    const seg = p.split("/");
    return seg[seg.length - 1] || p;
  } catch {
    return p;
  }
}

const STORAGE_BASE_URL = "https://api.smkprestasiprima.sch.id/storage";

function buildAssignmentFileUrl(assignmentId: string | number, fileId: string | number) {
  // Use frontend proxy API route to handle authentication
  return `/api/tugas/files/${assignmentId}/${fileId}`;
}

function buildSubmissionFileUrl(file: SubmissionFile) {
  const raw = file?.url ?? file?.path ?? "";
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw)) return raw;
  const trimmed = raw.replace(/^\/+/, "");
  const withoutStorage = trimmed.startsWith("storage/") ? trimmed.slice("storage/".length) : trimmed;
  return `${STORAGE_BASE_URL}/${withoutStorage}`;
}

export default function AssignmentDetailPage() {
  const { user, student, students } = useEduData();
  const params = useParams();
  const router = useRouter();
  const id = useMemo(() => (params?.id ? String(params.id) : undefined), [params?.id]);

  const [data, setData] = useState<AssignmentDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [gradingBusyId, setGradingBusyId] = useState<string | null>(null);

  const hasSubmitted = useMemo(() => {
    if (user?.role !== 'siswa') return false;
    const sid = student?.id != null ? String(student.id) : "";
    if (!sid) return false;
    const subs = Array.isArray(data?.submissions) ? data!.submissions! : [];
    return subs.some((sub: any) => String(sub?.student_id ?? sub?.student?.id) === sid);
  }, [user?.role, student?.id, data?.submissions]);

  // Student's own submission and grade (if any)
  const mySubmission = useMemo(() => {
    if (user?.role !== 'siswa') return null;
    const sid = student?.id != null ? String(student.id) : "";
    if (!sid) return null;
    const subs = Array.isArray(data?.submissions) ? data!.submissions! : [];
    return subs.find((sub: any) => String(sub?.student_id ?? sub?.student?.id) === sid) || null;
  }, [user?.role, student?.id, data?.submissions]);

  const myGrade = useMemo(() => {
    const g = mySubmission?.grade ?? mySubmission?.score ?? mySubmission?.value;
    return g !== undefined && g !== null && g !== "" ? g : null;
  }, [mySubmission]);

  const mySubmissionFiles = useMemo<SubmissionFile[]>(() => {
    if (!mySubmission) return [];
    const filesRaw = Array.isArray(mySubmission?.files) ? mySubmission.files : [];
    return filesRaw
      .map((file: any, idx: number): SubmissionFile | null => {
        if (!file) return null;
        if (typeof file === "string") return { id: idx, path: file };
        if (typeof file === "object") return file as SubmissionFile;
        return null;
      })
      .filter((file: SubmissionFile | null): file is SubmissionFile => !!file && (!!file.path || !!file.url));
  }, [mySubmission]);

  // Handle real upload after modal simulates progress
  const handleModalUploadComplete = async (picked: any[]) => {
    try {
      const assignmentId = String(data?.id ?? id ?? "");
      const studentId = String(student?.id ?? "");
      if (!assignmentId || !studentId) {
        alert("ID tugas atau siswa tidak tersedia.");
        return;
      }

      // Extract File objects from FileWithPreview[]
      const files: File[] = (picked || [])
        .map((it: any) => (it?.file instanceof File ? it.file : null))
        .filter((f: any) => f instanceof File);

      if (files.length === 0) {
        alert("Tidak ada file yang dipilih.");
        return;
      }

      // Format submitted_at: YYYY-MM-DD HH:mm:ss
      const pad = (n: number) => String(n).padStart(2, '0');
      const now = new Date();
      const submittedAt = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

      const fd = new FormData();
      // The upstream proxy accepts assignment_id (alias assignmet_id)
      fd.append("assignment_id", assignmentId);
      fd.append("student_id", studentId);
      fd.append("grade", "0");
      fd.append("feedback", "");
      fd.append("submitted_at", submittedAt);
      files.forEach((f) => fd.append("files[]", f));

      const res = await fetch("/api/tugas/submit", { method: "POST", body: fd });
      if (!res.ok) {
        const ct = res.headers.get('content-type') || '';
        let errPayload: any; // simplified: no redundant initializer
        if (ct.includes('application/json')) errPayload = await res.json().catch(() => ({}));
        else {
          const text = await res.text().catch(() => '');
          errPayload = { message: text };
        }
        const messages: string[] = [];
        if (errPayload?.errors && typeof errPayload.errors === 'object') {
          for (const key of Object.keys(errPayload.errors)) {
            const arr = errPayload.errors[key];
            if (Array.isArray(arr)) messages.push(...arr);
          }
        }
        const msg = messages.length ? messages.join('\n') : (errPayload?.message || 'Gagal mengirim tugas. Coba lagi nanti.');
        alert(msg);
        return;
      }

      await res.json().catch(() => ({}));
      alert("Tugas berhasil dikumpulkan!");
      // Reflect submission locally so UI updates immediately
      setData((prev) => {
        if (!prev) return prev;
        const prevSubs = Array.isArray(prev.submissions) ? prev.submissions : [];
        return {
          ...prev,
          submissions: [
            ...prevSubs,
            { student_id: Number.isNaN(Number(studentId)) ? studentId : Number(studentId), submitted_at: submittedAt },
          ],
        } as AssignmentDetail;
      });
      setIsUploadOpen(false);
    } catch (e) {
      console.error("Upload error:", e);
      alert("Terjadi kesalahan saat upload tugas.");
    }
  };

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    axios
      .get(`/api/tugas/${encodeURIComponent(id)}`)
      .then((res) => {
        if (cancelled) return;
        const payload: AssignmentDetail = res.data?.data ?? res.data;
        setData(payload || null);
      })
      .catch((e) => {
        if (cancelled) return;
        const msg = e?.response?.data?.message || e?.message || "Gagal memuat detail tugas";
        setError(msg);
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  const displayLinks = useMemo(() => {
    const arr = (data?.links && Array.isArray(data.links) ? data.links : undefined)
      || (data?.reference_links && Array.isArray(data.reference_links) ? data.reference_links : undefined)
      || [];
    return arr as string[];
  }, [data?.links, data?.reference_links]);

  const normalizedFiles = useMemo<AssignmentFile[]>(() => {
    const raw = data?.files ?? [];
    if (!Array.isArray(raw)) return [];
    return raw.map((f: any, idx: number) => {
      if (typeof f === 'string') return { id: idx, path: f } as AssignmentFile;
      if (f && typeof f === 'object') return f as AssignmentFile;
      return { id: idx, path: String(f ?? "") } as AssignmentFile;
    }).filter((f) => !!f.path);
  }, [data?.files]);

  const handleOpen = (file: AssignmentFile) => {
    if (!file?.path) return;

    // If type is 'link', open the path directly
    if (file.type === 'link') {
      window.open(file.path, "_blank", "noopener,noreferrer");
      return;
    }

    // For files, navigate to the viewer page
    if (file.id && data?.id) {
      router.push(`/edu/tugas/${data.id}/view/${file.id}`);
    }
  };

  const handleDownload = async (file: AssignmentFile) => {
    if (!file?.path) return;

    // If type is 'link', just open it (can't download external links)
    if (file.type === 'link') {
      window.open(file.path, "_blank", "noopener,noreferrer");
      return;
    }

    // For files, use the correct API endpoint
    if (file.id && data?.id) {
      const url = buildAssignmentFileUrl(data.id, file.id);
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const openSubmissionFile = (url: string) => {
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  // Compute class students and submission status (teacher view)
  const classId = useMemo(() => {
    return (data?.class_id ?? data?.class?.id) as any;
  }, [data?.class_id, data?.class]);

  const { classStudents, submittedIds } = useMemo(() => {
    const list = Array.isArray(students) ? students : [];
    const cid = classId != null ? String(classId) : null;
    const classList = list.filter((s: any) => {
      const sid = s?.class_id ?? s?.class?.id;
      return sid != null && cid != null && String(sid) === cid;
    });

    const subs = Array.isArray(data?.submissions) ? data!.submissions! : [];
    const ids = new Set<string>();
    subs.forEach((sub: any) => {
      const sid = sub?.student_id ?? sub?.student?.id;
      if (sid != null) ids.add(String(sid));
    });

    return { classStudents: classList, submittedIds: ids };
  }, [students, classId, data?.submissions]);

  // Helpers to find a submission for a given student and extract its id
  const findSubmissionByStudent = (studentId: any) => {
    const subs = Array.isArray(data?.submissions) ? data!.submissions! : [];
    const sidStr = String(studentId);
    return subs.find((sub: any) => String(sub?.student_id ?? sub?.student?.id) === sidStr);
  };
  const getSubmissionId = (sub: any) => {
    return (
      sub?.id ??
      sub?.submission_id ??
      sub?.pivot?.id ??
      sub?.pivot?.submission_id ??
      sub?.assignment_submission_id ??
      null
    );
  };

  const handleGiveGrade = async (targetStudent: any) => {
    try {
      const sub = findSubmissionByStudent(targetStudent?.id);
      if (!sub) {
        await Swal.fire({ icon: "info", title: "Belum mengumpulkan", text: "Siswa belum mengumpulkan, tidak bisa memberikan nilai." });
        return;
      }
      const submissionId = getSubmissionId(sub);
      if (!submissionId) {
        await Swal.fire({ icon: "error", title: "ID submission tidak ditemukan" });
        return;
      }

      const currentGrade = sub?.grade ?? sub?.score ?? sub?.value ?? "";
      const currentFeedback = sub?.feedback ?? "";

      setGradingBusyId(String(targetStudent?.id ?? ""));
      const result = await Swal.fire<{ grade: string | number; feedback?: string } | undefined>({
        title: (currentGrade !== "" ? "Edit Nilai" : "Beri Nilai"),
        html: `
          <div style="text-align:left">
            <label for="swal-input-grade" style="font-size:12px;color:#4b5563;">Nilai (0-100) <span style="color:#ef4444">*</span></label>
            <input id="swal-input-grade" class="swal2-input" placeholder="Contoh: 85" value="${String(currentGrade)}" inputmode="numeric" />
            <label for="swal-input-feedback" style="font-size:12px;color:#4b5563;margin-top:6px;display:block;">Feedback (opsional)</label>
            <textarea id="swal-input-feedback" class="swal2-textarea" placeholder="Masukan feedback untuk siswa" rows="3">${String(currentFeedback)}</textarea>
          </div>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: "Simpan",
        cancelButtonText: "Batal",
        showLoaderOnConfirm: true,
        allowOutsideClick: () => !Swal.isLoading(),
        preConfirm: async () => {
          const gradeEl = document.getElementById("swal-input-grade") as HTMLInputElement | null;
          const feedbackEl = document.getElementById("swal-input-feedback") as HTMLTextAreaElement | null;
          const gradeInput = gradeEl?.value?.trim() ?? "";
          const feedbackInput = feedbackEl?.value?.trim() ?? "";

          if (!gradeInput) {
            Swal.showValidationMessage("Nilai wajib diisi");
            return;
          }

          const isNumeric = !Number.isNaN(Number(gradeInput));
          if (isNumeric) {
            const n = Number(gradeInput);
            if (n < 0 || n > 100) {
              Swal.showValidationMessage("Nilai harus antara 0 dan 100");
              return;
            }
          }

          try {
            const res = await fetch(`/api/tugas/${encodeURIComponent(String(submissionId))}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ grade: gradeInput, ...(feedbackInput ? { feedback: feedbackInput } : {}) }),
            });
            const ct = res.headers.get('content-type') || '';
            const payload = ct.includes('application/json') ? await res.json().catch(() => ({})) : await res.text().catch(() => '');
            if (!res.ok) {
              const msg = typeof payload === 'string' ? payload : (payload?.message || payload?.error || 'Gagal menyimpan nilai');
              // Avoid throwing; use SweetAlert validation message instead
              Swal.showValidationMessage(msg);
              return;
            }
            return { grade: isNumeric ? Number(gradeInput) : gradeInput, feedback: feedbackInput || undefined };
          } catch (err: any) {
            Swal.showValidationMessage(err?.message || 'Gagal menyimpan nilai');
            return;
          }
        },
      });

      if (result.isConfirmed && result.value) {
        const { grade, feedback } = result.value;
        setData((prev) => {
          if (!prev) return prev;
          const list = Array.isArray(prev.submissions) ? [...prev.submissions] : [];
          const idx = list.findIndex((x: any) => String(x?.student_id ?? x?.student?.id) === String(targetStudent?.id));
          if (idx >= 0) {
            const updated = { ...list[idx] } as any;
            updated.grade = grade as any;
            if (feedback !== undefined) updated.feedback = feedback;
            list[idx] = updated;
          }
          return { ...prev, submissions: list } as any;
        });

        await Swal.fire({ icon: "success", title: "Nilai berhasil disimpan" });
      }
    } catch (e) {
      console.error("Grade error:", e);
      await Swal.fire({ icon: "error", title: "Terjadi kesalahan", text: "Gagal menyimpan nilai." });
    } finally {
      setGradingBusyId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Google Classroom style header bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            <span className="font-medium">Kembali</span>
          </button>

          {user?.role === 'siswa' && !hasSubmitted && (
            <button
              onClick={() => setIsUploadOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
              disabled={!data?.id}
            >
              Kumpulkan Tugas
            </button>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 lg:py-8">
        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-3" />
            <p className="text-gray-600">Memuat detail tugas...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
            <div className="flex items-start">
              <XCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3" />
              <div>
                <h3 className="font-semibold text-red-800">Terjadi Kesalahan</h3>
                <p className="text-red-700 text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        {!loading && !error && data && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Assignment Header Card */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* Header with gradient */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8 text-white">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h1 className="text-2xl sm:text-3xl font-semibold mb-2">
                        {data.title}
                      </h1>
                      {data.teacher?.user?.name || data.creator?.name ? (
                        <p className="text-blue-100 flex items-center gap-2">
                          <User className="w-4 h-4" />
                          {data.teacher?.user?.name || data.creator?.name}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>

                {/* Description Section */}
                {data.description && (
                  <div className="px-6 py-5 border-b border-gray-200">
                    <p className="text-gray-800 text-base leading-relaxed whitespace-pre-line">
                      {data.description}
                    </p>
                  </div>
                )}

                {/* Reference Links */}
                {Array.isArray(displayLinks) && displayLinks.length > 0 && (
                  <div className="px-6 py-5 border-b border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
                      Tautan Referensi
                    </h3>
                    <div className="space-y-2">
                      {displayLinks.map((lnk, idx) => (
                        <a
                          key={idx}
                          href={lnk}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                        >
                          <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <LinkIcon className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-blue-600 group-hover:underline truncate">
                              {lnk}
                            </p>
                          </div>
                          <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Files Section */}
                <div className="px-6 py-5">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
                    Lampiran
                  </h3>
                  {normalizedFiles.length > 0 ? (
                    <div className="space-y-2">
                      {normalizedFiles.map((f, idx) => {
                        const displayName = f.name || f.original_name || basename(f.path);
                        return (
                          <div
                            key={String(f.id ?? idx)}
                            className="flex items-center justify-between gap-3 p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all group"
                          >
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                <FileText className="w-5 h-5 text-red-600" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {displayName}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleOpen(f)}
                                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Buka"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => { void handleDownload(f); }}
                                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Unduh"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm">Tidak ada lampiran</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Teacher View - Student List */}
              {user?.role === 'guru' && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Daftar Siswa</h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {submittedIds.size} dari {classStudents.length} siswa telah mengumpulkan
                    </p>
                  </div>

                  <div className="divide-y divide-gray-200">
                    {!classId ? (
                      <div className="px-6 py-8 text-center text-gray-500">
                        <p>Kelas untuk tugas ini tidak ditemukan.</p>
                      </div>
                    ) : classStudents.length === 0 ? (
                      <div className="px-6 py-8 text-center text-gray-500">
                        <p>Tidak ada data siswa untuk kelas ini.</p>
                      </div>
                    ) : (
                      classStudents.map((s: any) => {
                        const sid = s?.id;
                        const submitted = sid != null && submittedIds.has(String(sid));
                        const sub = submitted ? findSubmissionByStudent(sid) : null;
                        const gradeVal = sub?.grade ?? sub?.score ?? sub?.value;
                        const submissionFilesRaw = submitted ? sub?.files : null;
                        const submissionFiles = Array.isArray(submissionFilesRaw) ? submissionFilesRaw : [];
                        const normalizedSubmissionFiles = submissionFiles
                          .map((file: any, fileIdx: number) => {
                            if (!file) return null;
                            if (typeof file === "string") {
                              return { id: fileIdx, path: file } as SubmissionFile;
                            }
                            if (typeof file === "object") {
                              return file as SubmissionFile;
                            }
                            return null;
                          })
                          .filter((file): file is SubmissionFile => !!file && (!!file.path || !!file.url));
                        const hasSubmissionFiles = normalizedSubmissionFiles.length > 0;

                        return (
                          <div key={String(sid)} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                            <div className="flex items-center justify-between gap-4">
                              <div className="flex items-center gap-3 min-w-0 flex-1">
                                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                                  {(s?.user?.name ?? s?.name ?? '?').charAt(0).toUpperCase()}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm font-medium text-gray-900 truncate">
                                    {s?.user?.name ?? s?.name ?? `Siswa ${sid}`}
                                  </p>
                                  {s?.nis && (
                                    <p className="text-xs text-gray-500">NIS: {s.nis}</p>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                {submitted ? (
                                  <>
                                    {gradeVal != null && (
                                      <div className="text-right">
                                        <p className="text-lg font-bold text-green-600">{String(gradeVal)}</p>
                                        <p className="text-xs text-gray-500">/ 100</p>
                                      </div>
                                    )}
                                    <button
                                      onClick={() => { void handleGiveGrade(s); }}
                                      className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                                      disabled={gradingBusyId === String(sid)}
                                    >
                                      {gradingBusyId === String(sid) ? 'Menyimpan...' : (gradeVal != null ? 'Edit Nilai' : 'Beri Nilai')}
                                    </button>
                                  </>
                                ) : (
                                  <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-orange-100 text-orange-700 font-medium">
                                    <Clock className="w-3.5 h-3.5" />
                                    Belum dikerjakan
                                  </span>
                                )}
                              </div>
                            </div>
                            {submitted && hasSubmissionFiles && (
                              <div className="mt-3 rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-3">
                                <p className="text-xs font-semibold uppercase tracking-wide text-blue-700 flex items-center gap-2">
                                  <Paperclip className="w-3.5 h-3.5" />
                                  Lampiran Pengumpulan
                                </p>
                                <div className="mt-2 space-y-2">
                                  {normalizedSubmissionFiles.map((file, fileIdx) => {
                                    const displayName = file.name || file.original_name || basename(file.path || file.url || "");
                                    const url = buildSubmissionFileUrl(file);
                                    return (
                                      <div
                                        key={String(file.id ?? `${sid}-${fileIdx}`)}
                                        className="flex items-center justify-between gap-3 rounded-lg border border-blue-100 bg-white px-3 py-2 text-sm shadow-sm"
                                      >
                                        <div className="flex items-center gap-2 min-w-0 flex-1">
                                          <FileText className="w-4 h-4 text-blue-500 flex-shrink-0" />
                                          <a
                                            href={url || undefined}
                                            target={url ? "_blank" : undefined}
                                            rel={url ? "noopener noreferrer" : undefined}
                                            className="truncate font-medium text-blue-700 hover:underline"
                                          >
                                            {displayName || "Lampiran"}
                                          </a>
                                        </div>
                                        <div className="flex items-center gap-1">
                                          <button
                                            type="button"
                                            onClick={() => openSubmissionFile(url)}
                                            className="p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-colors"
                                            title="Buka lampiran"
                                          >
                                            <ExternalLink className="w-4 h-4" />
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => openSubmissionFile(url)}
                                            className="p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-colors"
                                            title="Unduh"
                                          >
                                            <Download className="w-4 h-4" />
                                          </button>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Status & Info */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-4">
                {/* Student Status Card */}
                {user?.role === 'siswa' && (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-200 bg-gray-50">
                      <h3 className="font-semibold text-gray-900">Status Pengerjaan</h3>
                    </div>
                    <div className="px-5 py-5">
                      {hasSubmitted ? (
                        <div className="space-y-4">
                          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                            <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
                            <div>
                              <p className="text-sm font-semibold text-green-800">Sudah Dikumpulkan</p>
                              <p className="text-xs text-green-600 mt-0.5">
                                {mySubmission?.submitted_at ? formatDeadline(mySubmission.submitted_at) : ''}
                              </p>
                            </div>
                          </div>
                          {mySubmissionFiles.length > 0 && (
                            <div className="rounded-lg border border-blue-100 bg-blue-50/60 px-4 py-3">
                              <p className="text-xs font-semibold uppercase tracking-wide text-blue-700 flex items-center gap-2">
                                <Paperclip className="w-3.5 h-3.5" />
                                Lampiran Pengumpulan Anda
                              </p>
                              <div className="mt-2 space-y-2">
                                {mySubmissionFiles.map((file, idx) => {
                                  const displayName = file.name || file.original_name || basename(file.path || file.url || "");
                                  const url = buildSubmissionFileUrl(file);
                                  return (
                                    <div
                                      key={String(file.id ?? `me-${idx}`)}
                                      className="flex items-center justify-between gap-3 rounded-lg border border-blue-100 bg-white px-3 py-2 text-sm shadow-sm"
                                    >
                                      <div className="flex items-center gap-2 min-w-0 flex-1">
                                        <FileText className="w-4 h-4 text-blue-500 flex-shrink-0" />
                                        <a
                                          href={url || undefined}
                                          target={url ? "_blank" : undefined}
                                          rel={url ? "noopener noreferrer" : undefined}
                                          className="truncate font-medium text-blue-700 hover:underline"
                                        >
                                          {displayName || `Lampiran ${idx + 1}`}
                                        </a>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <button
                                          type="button"
                                          onClick={() => openSubmissionFile(url)}
                                          className="p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-colors"
                                          title="Buka lampiran"
                                        >
                                          <ExternalLink className="w-4 h-4" />
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => openSubmissionFile(url)}
                                          className="p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-colors"
                                          title="Unduh"
                                        >
                                          <Download className="w-4 h-4" />
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {myGrade != null && (
                            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
                              <p className="text-sm text-gray-600 mb-1">Nilai Anda</p>
                              <p className="text-4xl font-bold text-green-600">{String(myGrade)}</p>
                              <p className="text-xs text-gray-500 mt-1">/ 100</p>
                            </div>
                          )}

                          {mySubmission?.feedback && (
                            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                              <p className="text-xs font-semibold text-blue-900 mb-2">Feedback Guru</p>
                              <p className="text-sm text-blue-800">{mySubmission.feedback}</p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                            <Clock className="w-6 h-6 text-orange-600 flex-shrink-0" />
                            <div>
                              <p className="text-sm font-semibold text-orange-800">Belum Dikumpulkan</p>
                              <p className="text-xs text-orange-600 mt-0.5">Segera kumpulkan tugas Anda</p>
                            </div>
                          </div>

                          <button
                            onClick={() => setIsUploadOpen(true)}
                            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
                            disabled={!data?.id}
                          >
                            Kumpulkan Tugas
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Deadline Card */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="px-5 py-4 border-b border-gray-200 bg-gray-50">
                    <h3 className="font-semibold text-gray-900">Tenggat Waktu</h3>
                  </div>
                  <div className="px-5 py-5">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Deadline</p>
                        <p className="text-base font-semibold text-gray-900 mt-0.5">
                          {formatDeadline(data.deadline)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Teacher Info Card */}
                {(data.teacher?.user?.name || data.creator?.name) && (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-200 bg-gray-50">
                      <h3 className="font-semibold text-gray-900">Guru</h3>
                    </div>
                    <div className="px-5 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {(data.teacher?.user?.name || data.creator?.name || '?').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {data.teacher?.user?.name || data.creator?.name}
                          </p>
                          {data.teacher?.specialization && (
                            <p className="text-xs text-gray-500 mt-0.5">
                              {data.teacher.specialization}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Upload Modal for students */}
      {user?.role === 'siswa' && !hasSubmitted && (
        <TugasUploadModal
          isOpen={isUploadOpen}
          onClose={() => setIsUploadOpen(false)}
          tugasId={String(data?.id ?? id ?? "")}
          tugasTitle={data?.title ?? "Tugas"}
          deadline={(data?.deadline ?? new Date().toISOString()) as string}
          onUploadComplete={handleModalUploadComplete}
        />
      )}
    </div>
  );
}
