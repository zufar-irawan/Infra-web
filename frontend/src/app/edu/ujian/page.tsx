"use client";

import DashHeader from "@/app/components/DashHeader";
import { useEduData } from "@/app/edu/context";
import UjianCard from "@/components/subComponents/forUjian/Ujiancard";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { AlertCircle, ChevronDown, ChevronUp, Loader2 } from "lucide-react";

type PaginationMeta = {
    currentPage: number;
    lastPage: number;
    total: number;
};

type NormalizedExamResponse = {
    items: any[];
    meta: Record<string, any>;
};

const pickMeta = (...sources: any[]): Record<string, any> => {
    for (const source of sources) {
        if (source && typeof source === "object" && !Array.isArray(source)) {
            return source;
        }
    }
    return {};
};

const normalizeExamResponse = (payload: any): NormalizedExamResponse => {
    if (!payload) {
        return { items: [], meta: {} };
    }

    if (Array.isArray(payload)) {
        return { items: payload, meta: {} };
    }

    if (Array.isArray(payload?.data?.data)) {
        const { data, ...rest } = payload.data ?? {};
        return {
            items: payload.data.data,
            meta: pickMeta(payload.meta, rest?.meta, rest),
        };
    }

    if (Array.isArray(payload?.data)) {
        const { data: _omitData, ...rest } = payload ?? {};
        return {
            items: payload.data,
            meta: pickMeta(payload.meta, payload.pagination, rest),
        };
    }

    if (payload?.data && typeof payload.data === "object" && !Array.isArray(payload.data)) {
        const nested = normalizeExamResponse(payload.data);
        if (nested.items.length) {
            return {
                items: nested.items,
                meta: Object.keys(nested.meta).length
                    ? nested.meta
                    : pickMeta(payload.meta, payload.pagination),
            };
        }
    }

    const fallbackKeys = ["items", "records", "rows", "results", "exams"] as const;
    for (const key of fallbackKeys) {
        const candidate = (payload as Record<string, any>)?.[key];
        if (Array.isArray(candidate)) {
            return {
                items: candidate,
                meta: pickMeta(payload.meta, payload.pagination, (payload as Record<string, any>)?.[`${key}Meta`]),
            };
        }
    }

    return { items: [], meta: pickMeta(payload?.meta, payload?.pagination) };
};

const toIdString = (value: any) =>
    value === undefined || value === null ? null : String(value);

const buildIdSet = (items: any[]) =>
    new Set(
        items
            .map((item: any) => toIdString(item?.id))
            .filter((id): id is string => typeof id === "string" && id.length > 0)
    );

export default function UjianSiswa() {
    const router = useRouter();
    const { user, student, exams, subjects } = useEduData();

    const [rawExams, setRawExams] = useState<any[]>([]);
    const [pagination, setPagination] = useState<PaginationMeta>({
        currentPage: 1,
        lastPage: 1,
        total: 0,
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [isFetching, setIsFetching] = useState(false);
    const [fetchError, setFetchError] = useState<string | null>(null);

    const [uncompletedExam, setUncompletedExam] = useState<any[]>([]);
    const [examSelesai, setExamSelesai] = useState<any[]>([]);
    const [ujian, setUjian] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const [searchQuery, setSearchQuery] = useState("");
    const [filterMataPelajaran, setFilterMataPelajaran] = useState("all");
    const [filterStatus, setFilterStatus] = useState("all");
    const [openSubjects, setOpenSubjects] = useState<Record<string, boolean>>({});

    const classId = useMemo(
        () => student?.class?.id ?? student?.class_id ?? student?.classId ?? null,
        [student]
    );

    const isStudent = user?.role === "siswa";
    const isStaff = user && ["teacher", "admin"].includes(user.role);

    useEffect(() => {
        if (!user) return;

        let cancelled = false;
        setIsFetching(true);
        setFetchError(null);

        axios
            .get("/api/exam", {
                params: {
                    page: currentPage,
                    per_page: 15,
                },
            })
            .then((res) => {
                if (cancelled) return;
                console.log("Fetched exam data:", res.data);
                const payload = res.data;
                const { items, meta } = normalizeExamResponse(payload);

                setRawExams(Array.isArray(items) ? items : []);

                const nextCurrentRaw =
                    meta?.current_page ??
                    meta?.currentPage ??
                    meta?.page ??
                    currentPage ??
                    1;
                const nextLastRaw =
                    meta?.last_page ??
                    meta?.lastPage ??
                    meta?.total_pages ??
                    meta?.totalPages ??
                    nextCurrentRaw ??
                    1;
                const nextTotalRaw =
                    meta?.total ?? meta?.count ?? meta?.total_items ?? meta?.totalItems ?? items.length ?? 0;

                const nextCurrent = Number(nextCurrentRaw);
                const nextLast = Number(nextLastRaw);
                const nextTotal = Number(nextTotalRaw);

                setPagination({
                    currentPage: Number.isFinite(nextCurrent) && nextCurrent > 0 ? nextCurrent : 1,
                    lastPage: Number.isFinite(nextLast) && nextLast > 0 ? nextLast : 1,
                    total: Number.isFinite(nextTotal) && nextTotal >= 0 ? nextTotal : items.length,
                });
            })
            .catch((err) => {
                if (cancelled) return;
                const message =
                    err?.response?.data?.message ??
                    err?.message ??
                    "Gagal memuat data ujian.";
                setFetchError(
                    typeof message === "string" ? message : "Gagal memuat data ujian."
                );
            })
            .finally(() => {
                if (!cancelled) setIsFetching(false);
            });

        return () => {
            cancelled = true;
        };
    }, [user, currentPage]);

    useEffect(() => {
        if (!user) return;

            const selesaiArray = Array.isArray(exams?.selesaiExams)
                ? exams.selesaiExams
                : Array.isArray(exams?.completedExams)
                ? exams.completedExams
                : [];

            const uncompletedArray = Array.isArray(exams?.uncompletedExams)
                ? exams.uncompletedExams
                : [];

            const completedIds = buildIdSet(selesaiArray ?? []);
            const pendingIds = buildIdSet(uncompletedArray ?? []);

        const source: any[] = rawExams.length
            ? rawExams
            : Array.isArray(exams?.exams)
            ? exams.exams
            : [];

        const studentClassKey = toIdString(classId);

        const relevant = source.filter((exam: any) => {
            const examClassCandidate =
                exam.class_id ?? exam.classId ?? exam.class?.id ?? null;
            const examClassKey = toIdString(examClassCandidate);

            if (isStudent) {
                if (!studentClassKey) return false;
                if (!examClassKey) return true;
                return examClassKey === studentClassKey;
            }
            return true;
        });

        const resolved = relevant.map((exam: any) => {
            const subjectCandidate =
                exam.subject ??
                subjects?.find(
                    (s: any) =>
                        toIdString(s?.id) ===
                        toIdString(exam.subject_id ?? exam.subjectId)
                );

            const examIdKey = toIdString(exam.id);

            return {
                ...exam,
                subject: subjectCandidate ?? null,
                class: exam.class ?? null,
                isCompleted: examIdKey ? completedIds.has(examIdKey) : false,
                isPending: examIdKey ? pendingIds.has(examIdKey) : false,
            };
        });

        setUjian(resolved);
        setUncompletedExam(resolved.filter((item: any) => item?.isPending));
        setExamSelesai(resolved.filter((item: any) => item?.isCompleted));
    }, [rawExams, exams, subjects, classId, user]);

    useEffect(() => {
        setCurrentIndex(0);
    }, [uncompletedExam]);

    const uniqueSubjects = useMemo(() => {
        if (!ujian) return [] as string[];
        const subjectNames = ujian
            .map((u: any) => u?.subject?.name || "Mata Pelajaran Lain")
            .filter(Boolean);
        return Array.from(new Set(subjectNames));
    }, [ujian]);

    const filteredUjian = useMemo(() => {
        if (!ujian) return [] as any[];

        return ujian.filter((item: any) => {
            const subjectName = item.subject?.name || "Mata Pelajaran Lain";
            const matchesSearch =
                searchQuery === "" ||
                subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.title.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesMataPelajaran =
                filterMataPelajaran === "all" || subjectName === filterMataPelajaran;

            let matchesStatus = true;

            if (filterStatus !== "all") {
                if (isStaff) {
                    const startTs = new Date(`${item.date}T${item.start_time}`);
                    const endTs = new Date(`${item.date}T${item.end_time}`);
                    const now = new Date();

                    const isUpcoming = now < startTs;
                    const isCompletedTime = now > endTs;
                    const isOngoing = !isUpcoming && !isCompletedTime;

                    if (filterStatus === "upcoming") {
                        matchesStatus = isUpcoming;
                    } else if (filterStatus === "ongoing") {
                        matchesStatus = isOngoing;
                    } else if (filterStatus === "completed") {
                        matchesStatus = isCompletedTime;
                    }
                } else {
                    matchesStatus =
                        (filterStatus === "selesai" && item.isCompleted) ||
                        (filterStatus === "belum" && !item.isCompleted);
                }
            }

            return matchesSearch && matchesMataPelajaran && matchesStatus;
        });
    }, [ujian, searchQuery, filterMataPelajaran, filterStatus, isStaff]);

    const groupedUjian = useMemo(() => {
        return filteredUjian.reduce((acc: Record<string, any[]>, item: any) => {
            const subjectName = item.subject?.name || "Mata Pelajaran Lain";
            if (!acc[subjectName]) {
                acc[subjectName] = [];
            }
            acc[subjectName].push(item);
            return acc;
        }, {} as Record<string, any[]>);
    }, [filteredUjian]);

    const staffSummary = useMemo(() => {
        if (!isStaff) {
            return { total: ujian.length, upcoming: 0, ongoing: 0, completed: 0 };
        }

        const now = new Date();
        let upcoming = 0;
        let ongoing = 0;
        let completed = 0;

        ujian.forEach((item: any) => {
            const startTs = new Date(`${item.date}T${item.start_time}`);
            const endTs = new Date(`${item.date}T${item.end_time}`);

            if (Number.isNaN(startTs.getTime()) || Number.isNaN(endTs.getTime())) {
                return;
            }

            if (now < startTs) {
                upcoming += 1;
            } else if (now > endTs) {
                completed += 1;
            } else {
                ongoing += 1;
            }
        });

        return { total: ujian.length, upcoming, ongoing, completed };
    }, [isStaff, ujian]);

    const nextSlide = () => {
        if (!uncompletedExam?.length) return;
        setCurrentIndex((prev) => (prev + 1) % uncompletedExam.length);
    };

    const prevSlide = () => {
        if (!uncompletedExam?.length) return;
        setCurrentIndex((prev) => (prev - 1 + uncompletedExam.length) % uncompletedExam.length);
    };

    const handleNavigate = (id: number | string) => {
        router.push(`/edu/ujian/${id}`);
    };

    const handleViewResult = (id: number | string) => {
        router.push(`/edu/ujian/${id}?mode=hasil`);
    };

    const handleResetFilter = () => {
        setSearchQuery("");
        setFilterMataPelajaran("all");
        setFilterStatus("all");
    };

    const handlePagination = (direction: "prev" | "next") => {
        setCurrentPage((prev) => {
            if (direction === "prev") {
                return Math.max(1, prev - 1);
            }
            if (direction === "next") {
                return Math.min(pagination.lastPage, prev + 1);
            }
            return prev;
        });
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500">
                Memuat data akun...
            </div>
        );
    }

    return (
        <div className="overflow-y-auto min-h-screen">
            <DashHeader user={user} student={student} />

            {isStudent && (
                <>
                    <div id="ujian-main-data" className="w-full p-4 flex flex-col lg:flex-row gap-4">
                        <div className="lg:flex-1 bg-white rounded-2xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex flex-col gap-4 h-[220px]">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold">Ujian Belum Dikerjakan</h2>
                                    <p className="text-black/60 text-sm">
                                        Fokus pada ujian yang harus kamu selesaikan berikutnya.
                                    </p>
                                </div>
                                {uncompletedExam.length > 1 && (
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={prevSlide}
                                            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                                            disabled={uncompletedExam.length <= 1}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={1.5}
                                                stroke="currentColor"
                                                className="w-5 h-5"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M15.75 19.5L8.25 12l7.5-7.5"
                                                />
                                            </svg>
                                        </button>
                                        <span className="text-xs text-gray-500">
                                            {currentIndex + 1} / {uncompletedExam.length}
                                        </span>
                                        <button
                                            onClick={nextSlide}
                                            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                                            disabled={uncompletedExam.length <= 1}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={1.5}
                                                stroke="currentColor"
                                                className="w-5 h-5"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 flex items-center">
                                {uncompletedExam.length > 0 ? (
                                    <div className="w-full overflow-hidden">
                                        <div
                                            className="flex transition-transform duration-300 ease-in-out"
                                            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                                        >
                                            {uncompletedExam.map((item: any, index: number) => (
                                                <div key={index} className="w-full flex-shrink-0">
                                                    <div className="border-t border-black/10 pt-4">
                                                        <UjianCard ujian={item} />
                                                        <div className="mt-3 flex items-center justify-between">
                                                            <div className="text-xs text-gray-500">
                                                                {item.class?.name ? `Kelas ${item.class.name}` : ""}
                                                            </div>
                                                            <button
                                                                onClick={() => handleNavigate(item.id)}
                                                                className="text-xs bg-orange-500 text-white px-3 py-2 rounded-md hover:bg-orange-400 transition"
                                                            >
                                                                Kerjakan Sekarang
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-full flex flex-col items-center justify-center py-6 bg-gray-50 rounded-xl border border-dashed border-orange-200 h-[120px]">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                            className="w-8 h-8 text-orange-400 mb-1"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="m4.5 12.75 6 6 9-13.5"
                                            />
                                        </svg>
                                        <h3 className="text-sm font-semibold text-orange-600 mb-0.5">
                                            Semua ujian sudah selesai!
                                        </h3>
                                        <p className="text-black/60 text-xs">
                                            Tidak ada ujian pending. Pertahankan prestasimu!
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="w-full lg:w-auto lg:min-w-[400px] grid grid-cols-2 gap-4">
                            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex flex-col items-center justify-center text-center h-[200px]">
                                <div className="bg-red-100 p-3 rounded-full mb-4">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={2}
                                        stroke="currentColor"
                                        className="w-8 h-8 text-red-600"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-3xl font-bold text-red-600 mb-2">
                                    {uncompletedExam.length}
                                </h3>
                                <p className="text-sm font-medium text-gray-700">Ujian Belum Selesai</p>
                                <p className="text-xs text-gray-500 mt-1">Perlu dikerjakan</p>
                            </div>

                            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex flex-col items-center justify-center text-center h-[200px]">
                                <div className="bg-green-100 p-3 rounded-full mb-4">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={2}
                                        stroke="currentColor"
                                        className="w-8 h-8 text-green-600"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-3xl font-bold text-green-600 mb-2">
                                    {examSelesai.length}
                                </h3>
                                <p className="text-sm font-medium text-gray-700">Ujian Sudah Selesai</p>
                                <p className="text-xs text-gray-500 mt-1">Sudah dikumpulkan</p>
                            </div>
                        </div>
                    </div>

                    <section className="w-full px-4 pb-4 space-y-3">
                        {fetchError && (
                            <div className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                                <AlertCircle className="h-4 w-4" />
                                {fetchError}
                            </div>
                        )}

                        <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100">
                            <div className="flex flex-col sm:flex-row gap-4 items-center">
                                <div className="relative flex-1 w-full">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                            className="w-5 h-5 text-gray-400"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                                            />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Cari berdasarkan mata pelajaran atau judul ujian..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 focus:outline-none rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-sm"
                                    />
                                </div>

                                <div className="w-full sm:w-auto">
                                    <select
                                        value={filterMataPelajaran}
                                        onChange={(e) => setFilterMataPelajaran(e.target.value)}
                                        className="w-full sm:w-48 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-sm bg-white"
                                    >
                                        <option value="all">Semua Mata Pelajaran</option>
                                        {uniqueSubjects.map((mataPelajaran) => (
                                            <option key={mataPelajaran} value={mataPelajaran}>
                                                {mataPelajaran}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="w-full sm:w-auto">
                                    <select
                                        value={filterStatus}
                                        onChange={(e) => setFilterStatus(e.target.value)}
                                        className="w-full sm:w-40 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-sm bg-white"
                                    >
                                        <option value="all">Semua Status</option>
                                        <option value="belum">Belum Dikerjakan</option>
                                        <option value="selesai">Sudah Selesai</option>
                                    </select>
                                </div>

                                {(searchQuery !== "" ||
                                    filterMataPelajaran !== "all" ||
                                    filterStatus !== "all") && (
                                    <button
                                        onClick={handleResetFilter}
                                        className="w-full sm:w-auto px-4 py-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors duration-200 text-sm font-medium flex items-center justify-center gap-2"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                            className="w-4 h-4"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M6 18 18 6M6 6l12 12"
                                            />
                                        </svg>
                                        Reset
                                    </button>
                                )}
                            </div>
                        </div>
                    </section>

                    <section id="list-ujian" className="w-full grid grid-cols-1 gap-4 p-4">
                        {isFetching && filteredUjian.length === 0 ? (
                            <div className="flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white py-12 text-gray-500">
                                <Loader2 className="h-5 w-5 animate-spin" />
                                Memuat ujian...
                            </div>
                        ) : Object.keys(groupedUjian).length > 0 ? (
                            Object.entries(groupedUjian).map(([subjectName, ujianList]) => (
                                <div
                                    key={subjectName}
                                    className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex flex-col gap-4"
                                >
                                    <div
                                        className="flex items-center justify-between cursor-pointer"
                                        onClick={() =>
                                            setOpenSubjects((prev) => ({
                                                ...prev,
                                                [subjectName]: !prev[subjectName],
                                            }))
                                        }
                                    >
                                        <div>
                                            <h2 className="text-lg font-semibold">{subjectName}</h2>
                                            <p className="text-black/60 text-sm">
                                                {ujianList.length} Ujian •{' '}
                                                {ujianList[0]?.class?.name ??
                                                    ujianList[0]?.subject?.category ??
                                                    "Kategori"}
                                            </p>
                                        </div>
                                        <span
                                            className="p-1 rounded hover:bg-gray-100 transition"
                                            aria-label={openSubjects[subjectName] ? "Tutup" : "Buka"}
                                        >
                                            {openSubjects[subjectName] ? (
                                                <ChevronUp className="w-5 h-5" />
                                            ) : (
                                                <ChevronDown className="w-5 h-5" />
                                            )}
                                        </span>
                                    </div>

                                    {openSubjects[subjectName] && (
                                        <div className="divide-y divide-black/10 transition-all duration-300">
                                            {ujianList.map((item: any) => (
                                                <div
                                                    key={item.id}
                                                    className="flex items-start sm:items-center justify-between py-4 gap-2"
                                                >
                                                    <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1">
                                                        <div>
                                                            <h3 className="font-medium">{item.title}</h3>
                                                            <p className="text-black/60 text-sm">
                                                                Tanggal: {new Date(item.date).toLocaleDateString("id-ID", {
                                                                    day: "2-digit",
                                                                    month: "long",
                                                                    year: "numeric",
                                                                })}{" "}
                                                                • {item.start_time} - {item.end_time}
                                                            </p>
                                                            <p className="text-black/60 text-xs">
                                                                Ruangan: {item.room?.name || "Belum ditentukan"}
                                                            </p>
                                                        </div>
                                                        <p
                                                            className={`text-xs ${
                                                                item.isCompleted
                                                                    ? "text-emerald-600"
                                                                    : "text-orange-700"
                                                            }`}
                                                        >
                                                            {item.isCompleted ? "Selesai" : "Belum dikerjakan"}
                                                        </p>
                                                    </div>
                                                    <div className="flex flex-col sm:flex-row items-center gap-2">
                                                        {item.isCompleted ? (
                                                            <button
                                                                onClick={() => handleViewResult(item.id)}
                                                                className="text-sm bg-emerald-500 text-white px-3 py-2 rounded-sm flex items-center gap-1 hover:bg-emerald-400 hover:shadow transition"
                                                            >
                                                                Lihat Nilai
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    fill="none"
                                                                    viewBox="0 0 24 24"
                                                                    strokeWidth={1.5}
                                                                    stroke="currentColor"
                                                                    className="w-3 h-3"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        d="m4.5 12.75 6 6 9-13.5"
                                                                    />
                                                                </svg>
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => handleNavigate(item.id)}
                                                                className="text-sm bg-orange-500 text-white px-3 py-2 rounded-sm flex items-center gap-1 hover:bg-orange-400 hover:shadow transition"
                                                            >
                                                                Kerjakan
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    fill="none"
                                                                    viewBox="0 0 24 24"
                                                                    strokeWidth={1.5}
                                                                    stroke="currentColor"
                                                                    className="w-4 h-4"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                                                                    />
                                                                </svg>
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-gray-400 py-8 bg-white rounded-2xl border border-dashed border-gray-200">
                                Tidak ada ujian untuk ditampilkan.
                            </div>
                        )}
                    </section>

                    {pagination.lastPage > 1 && (
                        <div className="px-4 pb-8">
                            <div className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center justify-between shadow-sm">
                                <button
                                    onClick={() => handlePagination("prev")}
                                    disabled={currentPage <= 1}
                                    className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Sebelumnya
                                </button>
                                <span className="text-sm text-gray-500">
                                    Halaman {pagination.currentPage} dari {pagination.lastPage}
                                </span>
                                <button
                                    onClick={() => handlePagination("next")}
                                    disabled={currentPage >= pagination.lastPage}
                                    className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Selanjutnya
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}

            {isStaff && (
                <div className="w-full flex flex-col gap-6 p-4">
                    <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
                            <p className="text-xs uppercase tracking-wide text-gray-500">Total Ujian</p>
                            <p className="mt-2 text-3xl font-semibold text-gray-900">{staffSummary.total}</p>
                            <p className="text-xs text-gray-500 mt-1">Semua ujian aktif di sekolah</p>
                        </div>
                        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
                            <p className="text-xs uppercase tracking-wide text-gray-500">Akan Berlangsung</p>
                            <p className="mt-2 text-3xl font-semibold text-orange-500">{staffSummary.upcoming}</p>
                            <p className="text-xs text-gray-500 mt-1">Jadwal yang dimulai setelah hari ini</p>
                        </div>
                        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
                            <p className="text-xs uppercase tracking-wide text-gray-500">Selesai</p>
                            <p className="mt-2 text-3xl font-semibold text-emerald-600">{staffSummary.completed}</p>
                            <p className="text-xs text-gray-500 mt-1">Ujian yang sudah berakhir</p>
                        </div>
                    </section>

                    <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                            <input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari ujian berdasarkan judul, mapel, atau kelas"
                                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                            />
                            <div className="flex w-full flex-col gap-3 sm:flex-row sm:w-auto sm:items-center">
                                <select
                                    value={filterMataPelajaran}
                                    onChange={(e) => setFilterMataPelajaran(e.target.value)}
                                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 sm:w-48"
                                >
                                    <option value="all">Semua Mata Pelajaran</option>
                                    {uniqueSubjects.map((mataPelajaran) => (
                                        <option key={mataPelajaran} value={mataPelajaran}>
                                            {mataPelajaran}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 sm:w-40"
                                >
                                    <option value="all">Semua Status</option>
                                    <option value="upcoming">Belum Mulai</option>
                                    <option value="ongoing">Sedang Berlangsung</option>
                                    <option value="completed">Sudah Selesai</option>
                                </select>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => router.push("/edu/ujian/manage/new")}
                                    className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white shadow hover:bg-orange-400"
                                >
                                    Tambah Ujian
                                </button>
                                {(searchQuery || filterMataPelajaran !== "all" || filterStatus !== "all") && (
                                    <button
                                        onClick={handleResetFilter}
                                        className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
                                    >
                                        Reset
                                    </button>
                                )}
                            </div>
                        </div>
                    </section>

                    <section className="grid gap-3">
                        {isFetching && (
                            <div className="flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white py-12 text-gray-500">
                                <Loader2 className="h-5 w-5 animate-spin" />
                                Memuat daftar ujian...
                            </div>
                        )}

                        {!isFetching && filteredUjian.length === 0 && (
                            <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-6 text-center text-gray-400">
                                Tidak ada ujian yang cocok dengan filter.
                            </div>
                        )}

                        {filteredUjian.map((item: any) => {
                            const startDate = new Date(item.date);
                            const startTime = `${item.start_time}`;
                            const endTime = `${item.end_time}`;

                            return (
                                <div
                                    key={item.id}
                                    className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow"
                                >
                                    <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-orange-500">
                                        <span>{item.subject?.name ?? "Mata Pelajaran"}</span>
                                        <span className="text-gray-300">•</span>
                                        <span>{item.class?.name ?? "Kelas"}</span>
                                    </div>
                                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                        <div>
                                            <h2 className="text-lg font-semibold text-gray-900">{item.title}</h2>
                                            <p className="text-sm text-gray-500">
                                                {startDate.toLocaleDateString("id-ID", {
                                                    day: "2-digit",
                                                    month: "long",
                                                    year: "numeric",
                                                })}
                                                {" • "}
                                                {startTime} - {endTime}
                                            </p>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <button
                                                onClick={() => router.push(`/edu/ujian/${item.id}?mode=hasil`)}
                                                className="rounded-lg border border-emerald-200 px-3 py-2 text-xs font-medium text-emerald-600 hover:bg-emerald-50"
                                            >
                                                Cek Nilai & Jawaban
                                            </button>
                                            <button
                                                onClick={() => router.push(`/edu/ujian/manage/${item.id}`)}
                                                className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50"
                                            >
                                                Kelola Ujian
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </section>
                </div>
            )}
        </div>
    );
}
