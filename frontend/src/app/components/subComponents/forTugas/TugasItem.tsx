"use client";

import React, { useMemo, useState } from 'react';
import { Upload, CheckCircle, Clock, User, Calendar, Users, Paperclip, FileText, ExternalLink, Download } from 'lucide-react';
import TugasUploadModal from './TugasUploadModal';
import { useEduData } from "@/app/edu/context";
import { useRouter } from "next/navigation";

interface TugasItemProps {
    tugas: any;
    isCompleted?: boolean;
    student?: any;
}

type SubmissionFileSummary = {
    id?: number | string;
    path?: string | null;
    url?: string | null;
    name?: string | null;
    original_name?: string | null;
    filename?: string | null;
};

type SubmissionSummary = {
    key: string;
    studentName: string;
    files: SubmissionFileSummary[];
    submittedAt?: string | null;
};

export default function TugasItem({ student, tugas, isCompleted = false }: TugasItemProps) {
    const { user, students } = useEduData();
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const STORAGE_BASE_URL = "https://api.smkprestasiprima.sch.id/storage";

    const formatDeadline = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const isOverdue = () => {
        const now = new Date();
        const deadline = new Date(tugas.deadline);
        return now > deadline;
    };

    // Teacher-specific counters
    const { submittedCount, notSubmittedCount, totalClassStudents } = useMemo(() => {
        if (user?.role !== 'guru') return { submittedCount: 0, notSubmittedCount: 0, totalClassStudents: 0 };

        const classId = tugas?.class_id;
        const classStudents = (students || [])
            .filter((s: any) => {
                const sid = s?.class_id ?? s?.class?.id;
                return sid != null && classId != null && String(sid) === String(classId);
            });

        const subs = Array.isArray(tugas?.submissions) ? tugas.submissions : [];
        const uniqueSubmitters = new Set<string>();
        subs.forEach((sub: any) => {
            const sid = sub?.student_id ?? sub?.student?.id;
            if (sid != null) uniqueSubmitters.add(String(sid));
        });

        const submitted = classStudents.filter((s: any) => uniqueSubmitters.has(String(s.id))).length;
        const notSubmitted = Math.max(classStudents.length - submitted, 0);

        return { submittedCount: submitted, notSubmittedCount: notSubmitted, totalClassStudents: classStudents.length };
    }, [user?.role, tugas?.class_id, tugas?.submissions, students]);

    const handleUploadComplete = async (files: any[]) => {
        if (isSubmitting) return;

        // Basic validation
        const studentId = String(student?.id ?? "");
        const assignId = String(tugas?.id ?? "");
        if (!assignId) {
            alert("ID tugas tidak tersedia.");
            return;
        }
        if (!studentId) {
            alert("ID siswa tidak tersedia.");
            return;
        }

        // Normalize files (FileWithPreview[] | File[])
        const blobs: File[] = (files || [])
            .map((f: any) => (f?.file instanceof File ? f.file : f))
            .filter((f: any) => f instanceof File);
        if (blobs.length === 0) {
            alert("Pilih minimal satu file untuk diunggah.");
            return;
        }

        // Format submitted_at: YYYY-MM-DD HH:mm:ss
        const pad = (n: number) => String(n).padStart(2, '0');
        const now = new Date();
        const submittedAt = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

        setIsSubmitting(true);
        try {
            const fd = new FormData();
            // As requested, use the alias field name assignmet_id; the API route normalizes it.
            fd.append("assignmet_id", assignId);
            fd.append("student_id", studentId);
            fd.append("grade", "0");
            fd.append("feedback", "");
            fd.append("submitted_at", submittedAt);
            for (const file of blobs) fd.append("files[]", file);

            const res = await fetch("/api/tugas/submit", { method: "POST", body: fd });
            if (!res.ok) {
                const ct = res.headers.get('content-type') || '';
                let errPayload: any = {};
                if (ct.includes('application/json')) errPayload = await res.json().catch(() => ({}));
                else {
                    const text = await res.text().catch(() => '');
                    errPayload = { message: text };
                }

                // Laravel validation error formatting
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

            // Success
            await res.json().catch(() => ({}));
            alert("Tugas berhasil dikumpulkan!");
            setIsUploadModalOpen(false);
        } catch (e) {
            console.error("Upload error:", e);
            alert("Terjadi kesalahan saat upload tugas.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const isTeacher = user?.role === 'guru';

    const goToDetail = () => {
        const id = tugas?.id;
        if (id == null) return;
        router.push(`/edu/tugas/${id}`);
    };

    const buildSubmissionFileUrl = (file: SubmissionFileSummary) => {
        const raw = file?.url ?? file?.path ?? "";
        if (!raw) return "";
        if (/^https?:\/\//i.test(raw)) return raw;
        const trimmed = raw.replace(/^\/+/, "");
        const withoutStorage = trimmed.startsWith("storage/") ? trimmed.slice("storage/".length) : trimmed;
        return `${STORAGE_BASE_URL}/${withoutStorage}`;
    };

    const submissionSummaries = useMemo<SubmissionSummary[]>(() => {
        if (!isTeacher) return [];
        const subs = Array.isArray(tugas?.submissions) ? tugas.submissions : [];
        return subs.map((sub: any, idx: number): SubmissionSummary => {
            const studentName = sub?.student?.user?.name ?? sub?.student?.name ?? `Siswa ${sub?.student_id ?? idx + 1}`;
            const filesRaw = Array.isArray(sub?.files) ? sub.files : [];
            const normalizedFiles = filesRaw
                .map((file: any, fileIdx: number): SubmissionFileSummary | null => {
                    if (!file) return null;
                    if (typeof file === "string") {
                        return { id: fileIdx, path: file };
                    }
                    if (typeof file === "object") return file;
                    return null;
                }) // @ts-ignore
                .filter((file): file is SubmissionFileSummary => !!file && (!!file.path || !!file.url));
            return {
                key: String(sub?.id ?? sub?.submission_id ?? `${idx}`),
                studentName,
                files: normalizedFiles,
                submittedAt: sub?.submitted_at ?? sub?.created_at ?? null,
            };
        }).filter((entry: SubmissionSummary) => entry.files.length > 0);
    }, [isTeacher, tugas?.submissions]);

    const openSubmissionFile = (url: string) => {
        if (!url) return;
        window.open(url, "_blank", "noopener,noreferrer");
    };

    return (
        <>
            {/* Uploading overlay */}
            {isSubmitting && (
                <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center">
                    <div className="bg-white rounded-2xl p-6 shadow-2xl flex flex-col items-center gap-3">
                        <div className="relative">
                            <div className="h-12 w-12 rounded-full border-4 border-gray-200"></div>
                            <div className="h-12 w-12 rounded-full border-4 border-t-orange-500 border-r-orange-400 border-b-transparent border-l-transparent animate-spin absolute top-0 left-0"></div>
                        </div>
                        <p className="text-sm text-gray-700">Mengunggah tugas...</p>
                    </div>
                </div>
            )}

            <div className="flex items-start sm:items-center justify-between py-4 gap-2">
                <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1">
                    <div
                        className="flex-1 cursor-pointer rounded-lg p-1 -m-1 hover:bg-gray-50"
                        onClick={goToDetail}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); goToDetail(); } }}
                    >
                        <h3 className="font-medium text-gray-800 mb-1">{tugas.title}</h3>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                                <User className="w-4 h-4" />
                                <span>{tugas.teacher?.user?.name || 'Guru'}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>Deadline: {formatDeadline(tugas.deadline)}</span>
                            </div>
                            {isTeacher && (
                                <div className="flex items-center gap-1">
                                    <Users className="w-4 h-4" />
                                    <span>Total siswa kelas: {totalClassStudents}</span>
                                </div>
                            )}
                        </div>
                        {tugas.description && (
                            <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                                {tugas.description}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        {!isTeacher ? (
                            // Student status badge
                            <div className={`px-3 py-1 rounded-full text-xs font-medium ${isCompleted
                                ? 'bg-green-100 text-green-700'
                                : isOverdue()
                                    ? 'bg-red-100 text-red-700'
                                    : 'bg-orange-100 text-orange-700'
                                }`}>
                                {isCompleted ? (
                                    <div className="flex items-center gap-1">
                                        <CheckCircle className="w-3 h-3" />
                                        Selesai
                                    </div>
                                ) : isOverdue() ? (
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        Terlambat
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        Pending
                                    </div>
                                )}
                            </div>
                        ) : (
                            // Teacher counters
                            <div className="flex items-center gap-2">
                                <div className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3" />
                                    Mengumpulkan: {submittedCount}
                                </div>
                                <div className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    Belum: {notSubmittedCount}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {!isTeacher && (
                    <div className="flex flex-col sm:flex-row items-center gap-2">
                        {isCompleted ? (
                            <button className="text-sm bg-emerald-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-emerald-600 hover:shadow transition-all duration-200">
                                <CheckCircle className="w-4 h-4" />
                                Sudah Dikumpulkan
                            </button>
                        ) : (
                            <button
                                onClick={() => setIsUploadModalOpen(true)}
                                className={`text-sm px-4 py-2 rounded-lg flex items-center gap-2 hover:shadow transition-all duration-200 ${isOverdue()
                                    ? 'bg-red-500 text-white hover:bg-red-600'
                                    : 'bg-orange-500 text-white hover:bg-orange-600'
                                    }`}
                            >
                                <Upload className="w-4 h-4" />
                                {isOverdue() ? 'Upload (Terlambat)' : 'Upload Tugas'}
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Upload Modal (students only) */}
            {!isTeacher && (
                <TugasUploadModal
                    isOpen={isUploadModalOpen}
                    onClose={() => setIsUploadModalOpen(false)}
                    tugasId={tugas.id}
                    tugasTitle={tugas.title}
                    deadline={tugas.deadline}
                    onUploadComplete={(files) => { void handleUploadComplete(files as any[]); }}
                />
            )}

            {isTeacher && submissionSummaries.length > 0 && (
                <div className="mt-3 rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-700 flex items-center gap-2">
                        <Paperclip className="w-3.5 h-3.5" />
                        Lampiran Pengumpulan
                    </p>
                    <div className="mt-2 space-y-3">
                        {submissionSummaries.map((submission: SubmissionSummary) => (
                            <div key={submission.key} className="rounded-lg border border-blue-100 bg-white px-3 py-2 shadow-sm">
                                <div className="flex items-center justify-between gap-3">
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-gray-800 truncate">{submission.studentName}</p>
                                        {submission.submittedAt && (
                                            <p className="text-xs text-gray-500">{formatDeadline(submission.submittedAt)}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="mt-2 space-y-1.5">
                                    {submission.files.map((file: SubmissionFileSummary, idx: number) => {
                                        const url = buildSubmissionFileUrl(file);
                                        const name = file?.name || file?.original_name || file?.filename || file?.path || `Lampiran ${idx + 1}`;
                                        return (
                                            <div key={String(file?.id ?? `${submission.key}-${idx}`)} className="flex items-center justify-between gap-3 rounded-lg border border-blue-100 bg-blue-50/60 px-3 py-2 text-sm">
                                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                                    <FileText className="w-4 h-4 text-blue-500 flex-shrink-0" />
                                                    <a
                                                        href={url || undefined}
                                                        target={url ? "_blank" : undefined}
                                                        rel={url ? "noopener noreferrer" : undefined}
                                                        className="truncate font-medium text-blue-700 hover:underline"
                                                    >
                                                        {name}
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
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}