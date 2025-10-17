// filepath: c:\laragon\www\Infra-web\frontend\src\app\edu\tugas\[id]\page.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { useEduData } from "@/app/edu/context";
import { Calendar, FileText, Link as LinkIcon, Loader2, Download, ExternalLink } from "lucide-react";
import TugasUploadModal from "@/app/components/subComponents/forTugas/TugasUploadModal";
import Swal from "sweetalert2";

// Types are defensive to tolerate partial payloads
interface AssignmentFile {
  id?: number | string;
  path: string; // e.g. "storage/assignments/filename.pdf" (may vary)
  name?: string | null;
  original_name?: string | null;
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

function buildFileUrl(path: string) {
  // If backend gives "storage/...", serve from Laravel at http://localhost:8000/
  // Keep the path as-is; don't try to fix potential typos like "asssignments".
  const clean = path.replace(/^\/+/, "");
  return `http://localhost:8000/${clean}`;
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
    const url = buildFileUrl(file.path);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleDownload = async (file: AssignmentFile) => {
    if (!file?.path) return;
    const url = buildFileUrl(file.path);
    try {
      const resp = await fetch(url);
      if (!resp.ok) {
        // If not ok, just open in a new tab as fallback instead of throwing
        window.open(url, "_blank", "noopener,noreferrer");
        return;
      }
      const blob = await resp.blob();
      const dlUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const filename = file.name || file.original_name || basename(file.path);
      a.href = dlUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(dlUrl);
    } catch (e) {
      // Fallback to simply opening the URL if download fails
      window.open(url, "_blank", "noopener,noreferrer");
    }
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
    <div className="overflow-y-auto min-h-screen">
      {/*<DashHeader user={user} student={student} />*/}

      <div className="w-full min-h-screen p-4 flex items-center justify-center">
        <div className="w-full max-w-4xl bg-white rounded-2xl p-6 shadow-md border border-gray-100">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-1">
                {data?.title || (loading ? "Memuat..." : "Detail Tugas")}
              </h1>
              {data?.teacher?.user?.name || data?.creator?.name ? (
                <p className="text-sm text-gray-600">
                  {data?.teacher?.user?.name || data?.creator?.name}
                </p>
              ) : null}
              {data?.deadline && (
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Deadline: {formatDeadline(data.deadline)}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              {user?.role === 'siswa' && (
                hasSubmitted ? (
                  myGrade != null ? (
                    <span className="px-3 py-2 text-sm rounded-lg bg-emerald-100 text-emerald-700">
                      Nilai Anda: {String(myGrade)}
                    </span>
                  ) : (
                    <span className="px-3 py-2 text-sm rounded-lg bg-emerald-100 text-emerald-700">
                      Sudah mengumpulkan
                    </span>
                  )
                ) : (
                  <button
                    onClick={() => setIsUploadOpen(true)}
                    className="px-3 py-2 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                    disabled={!data?.id}
                  >
                    Upload Tugas
                  </button>
                )
              )}
              <button
                onClick={() => router.back()}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Kembali
              </button>
            </div>
          </div>

          {/* Loading / Error */}
          {loading && (
            <div className="flex items-center gap-2 text-gray-600 mt-4">
              <Loader2 className="w-4 h-4 animate-spin" /> Memuat detail...
            </div>
          )}
          {error && (
            <div className="mt-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm border border-red-200">
              {error}
            </div>
          )}

          {/* Description */}
          {data?.description && (
            <div className="mt-6">
              <h2 className="text-sm font-semibold text-gray-700 mb-2">Deskripsi</h2>
              <p className="text-gray-700 text-sm whitespace-pre-line">{data.description}</p>
            </div>
          )}

          {/* Reference Links */}
          {Array.isArray(displayLinks) && displayLinks.length > 0 && (
            <div className="mt-6">
              <h2 className="text-sm font-semibold text-gray-700 mb-2">Tautan Referensi</h2>
              <ul className="space-y-2">
                {displayLinks.map((lnk, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm">
                    <LinkIcon className="w-4 h-4 text-blue-600" />
                    <a
                      href={lnk}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline break-all"
                    >
                      {lnk}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Files */}
          <div className="mt-6">
            <h2 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-orange-600" /> Lampiran Tugas
            </h2>
            {normalizedFiles.length > 0 ? (
              <ul className="divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden">
                {normalizedFiles.map((f, idx) => {
                  const displayName = f.name || f.original_name || basename(f.path);
                  const url = buildFileUrl(f.path);
                  return (
                    <li key={String(f.id ?? idx)} className="flex items-center justify-between gap-3 p-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-gray-800 truncate">{displayName}</p>
                        <p className="text-xs text-gray-500 truncate">{url}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpen(f)}
                          className="px-3 py-1.5 text-xs bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-1"
                          title="Buka di tab baru"
                        >
                          <ExternalLink className="w-3.5 h-3.5" /> Buka
                        </button>
                        <button
                          onClick={() => { void handleDownload(f); }}
                          className="px-3 py-1.5 text-xs bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center gap-1"
                          title="Unduh file"
                        >
                          <Download className="w-3.5 h-3.5" /> Unduh
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="text-sm text-gray-500 border border-dashed border-gray-200 rounded-xl p-4">
                Tidak ada lampiran.
              </div>
            )}
          </div>

          {/* Teacher view: list siswa & status pengerjaan */}
          {user?.role === 'guru' && (
            <div className="mt-6">
              <h2 className="text-sm font-semibold text-gray-700 mb-3">Daftar Siswa</h2>
              {!classId ? (
                <div className="text-sm text-gray-500 border border-dashed border-gray-200 rounded-xl p-4">
                  Kelas untuk tugas ini tidak ditemukan.
                </div>
              ) : classStudents.length === 0 ? (
                <div className="text-sm text-gray-500 border border-dashed border-gray-200 rounded-xl p-4">
                  Tidak ada data siswa untuk kelas ini.
                </div>
              ) : (
                <ul className="divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden">
                  {classStudents.map((s: any) => {
                    const sid = s?.id;
                    const submitted = sid != null && submittedIds.has(String(sid));
                    const sub = submitted ? findSubmissionByStudent(sid) : null;
                    const gradeVal = sub?.grade ?? sub?.score ?? sub?.value;
                    return (
                      <li key={String(sid)} className="flex items-center justify-between gap-3 p-3">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-gray-800 truncate">{s?.user?.name ?? s?.name ?? `Siswa ${sid}`}</p>
                          {s?.nis && (
                            <p className="text-xs text-gray-500 truncate">NIS: {s.nis}</p>
                          )}
                          {submitted && gradeVal != null && (
                            <p className="text-xs text-emerald-700 mt-1">Nilai: {String(gradeVal)}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {submitted ? (
                            <>
                              <span className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-green-100 text-green-700">
                                Sudah mengerjakan
                              </span>
                              <button
                                onClick={() => { void handleGiveGrade(s); }}
                                className="px-3 py-1.5 text-xs bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
                                disabled={gradingBusyId === String(sid)}
                              >
                                {gradingBusyId === String(sid) ? 'Menyimpan...' : (gradeVal != null ? 'Edit Nilai' : 'Beri Nilai')}
                              </button>
                            </>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-orange-100 text-orange-700">
                              Belum dikerjakan
                            </span>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          )}
        </div>
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