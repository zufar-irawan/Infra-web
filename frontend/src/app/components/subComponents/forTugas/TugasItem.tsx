"use client";

import React, { useMemo, useState } from 'react';
import { Upload, CheckCircle, Clock, User, Calendar, Users } from 'lucide-react';
import TugasUploadModal from './TugasUploadModal';
import {useEduData} from "@/app/edu/context";

interface TugasItemProps {
    tugas: any;
    isCompleted?: boolean;
    student?: any;
}

export default function TugasItem({ student, tugas, isCompleted = false }: TugasItemProps) {
    const { user, students } = useEduData();
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

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
                    <div className="flex-1">
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
                            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                                isCompleted 
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
                                className={`text-sm px-4 py-2 rounded-lg flex items-center gap-2 hover:shadow transition-all duration-200 ${
                                    isOverdue()
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
        </>
    );
}