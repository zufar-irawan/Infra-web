"use client";

import DashHeader from "@/app/components/DashHeader";
import CreateExamModal from "@/app/components/CreateExamModal";
import { useEduData } from "@/app/edu/context";
import UjianCard from "@/components/subComponents/forUjian/Ujiancard";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";

type ScheduleStatus = "upcoming" | "ongoing" | "completed";

type NormalizedExam = Record<string, any> & {
    scheduleStatus: ScheduleStatus;
    subject?: any;
    class?: any;
    room?: any;
    isCompleted?: boolean;
};

const coerceToArray = (value: any): any[] => {
    if (!value) {
        return [];
    }

    if (Array.isArray(value)) {
        return value;
    }

    if (typeof value === "object") {
        if (Array.isArray(value.data)) {
            return value.data;
        }
        if (Array.isArray(value.items)) {
            return value.items;
        }
        if (Array.isArray(value.rows)) {
            return value.rows;
        }
    }

    return [];
};

const toComparableId = (value: any): string | null => {
    if (value === undefined || value === null) {
        return null;
    }
    return String(value);
};

const getScheduleStatus = (date?: string, start?: string, end?: string): ScheduleStatus => {
    if (!date || !start || !end) {
        return "upcoming";
    }

    const startDate = new Date(`${date}T${start}`);
    const endDate = new Date(`${date}T${end}`);

    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
        return "upcoming";
    }

    const now = new Date();

    if (now < startDate) {
        return "upcoming";
    }

    if (now > endDate) {
        return "completed";
    }

    return "ongoing";
};

const getStaffStatusCopy = (status: ScheduleStatus): string => {
    switch (status) {
        case "completed":
            return "Sudah selesai";
        case "ongoing":
            return "Sedang berlangsung";
        default:
            return "Belum dimulai";
    }
};

const getStaffStatusClass = (status: ScheduleStatus): string => {
    switch (status) {
        case "completed":
            return "text-emerald-600";
        case "ongoing":
            return "text-sky-600";
        default:
            return "text-orange-600";
    }
};

export default function UjianSiswa() {
    const router = useRouter();
    const { user, student, exams, subjects, classes, rooms } = useEduData();

    const isStudent = user?.role === "siswa";
    const isStaff = user?.role === "guru" || user?.role === "admin";

    const [currentIndex, setCurrentIndex] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterMataPelajaran, setFilterMataPelajaran] = useState("all");
    const [filterStatus, setFilterStatus] = useState("all");
    const [openSubjects, setOpenSubjects] = useState<Record<string, boolean>>({});
    const [isCreateExamModalOpen, setIsCreateExamModalOpen] = useState(false);

    const subjectsList = useMemo(() => coerceToArray(subjects), [subjects]);
    const classesList = useMemo(() => coerceToArray(classes), [classes]);
    const roomsList = useMemo(() => coerceToArray(rooms), [rooms]);

    const classId = useMemo(() => {
        return toComparableId(student?.class?.id ?? student?.class_id ?? student?.classId);
    }, [student]);

    const rawAllExams = useMemo(() => {
        const payload: any = exams;

        const direct = coerceToArray(payload?.exams);
        if (direct.length > 0) {
            return direct;
        }

        const nested = coerceToArray(payload?.exams?.data);
        if (nested.length > 0) {
            return nested;
        }

        const fromData = coerceToArray(payload?.data);
        if (fromData.length > 0) {
            return fromData;
        }

        return coerceToArray(exams);
    }, [exams]);

    const normalizedAllExams = useMemo<NormalizedExam[]>(() => {
        if (!rawAllExams.length) {
            return [];
        }

        const subjectMap = new Map(subjectsList.map((item: any) => [item.id ?? item.subject_id, item]));
        const classMap = new Map(classesList.map((item: any) => [item.id ?? item.class_id, item]));
        const roomMap = new Map(roomsList.map((item: any) => [item.id ?? item.room_id, item]));

        return rawAllExams.map((exam: any) => {
            const subjectId = exam.subject_id ?? exam.subjectId ?? exam.subject?.id;
            const classIdValue = exam.class_id ?? exam.classId ?? exam.class?.id;
            const roomIdValue = exam.room_id ?? exam.roomId ?? exam.room?.id;

            const scheduleStatus = getScheduleStatus(
                exam.date,
                exam.start_time ?? exam.startTime,
                exam.end_time ?? exam.endTime,
            );

            return {
                ...exam,
                subject: exam.subject ?? subjectMap.get(subjectId) ?? null,
                class: exam.class ?? classMap.get(classIdValue) ?? null,
                room: exam.room ?? roomMap.get(roomIdValue) ?? null,
                scheduleStatus,
            } as NormalizedExam;
        });
    }, [rawAllExams, subjectsList, classesList, roomsList]);

    const studentExamData = useMemo(() => {
        if (!isStudent || !classId) {
            return {
                all: [] as NormalizedExam[],
                completed: [] as NormalizedExam[],
                uncompleted: [] as NormalizedExam[],
            };
        }

        const completedSources = [
            ...coerceToArray(exams?.selesaiExams),
            ...coerceToArray(exams?.completedExams),
        ];

        const completedSet = new Set(
            completedSources
                .map((item: any) => item?.id)
                .filter((id: any) => id !== undefined && id !== null)
                .map((id: any) => String(id)),
        );

        const filtered = normalizedAllExams
            .filter((exam) => toComparableId(exam.class_id ?? exam.classId ?? exam.class?.id) === classId)
            .map((exam) => ({
                ...exam,
                isCompleted: completedSet.has(String(exam.id)),
            }));

        return {
            all: filtered,
            completed: filtered.filter((exam) => exam.isCompleted),
            uncompleted: filtered.filter((exam) => !exam.isCompleted),
        };
    }, [isStudent, classId, normalizedAllExams, exams]);

    const staffExamList = useMemo(() => {
        if (!isStaff) {
            return [] as NormalizedExam[];
        }

        return normalizedAllExams.map((exam) => ({
            ...exam,
            isCompleted: exam.scheduleStatus === "completed",
        }));
    }, [isStaff, normalizedAllExams]);

    const baseExamList = isStaff ? staffExamList : studentExamData.all;

    const uniqueSubjects = useMemo(() => {
        const names = baseExamList.map((exam) => exam.subject?.name ?? "Mata Pelajaran Lain");
        return Array.from(new Set(names));
    }, [baseExamList]);

    const filteredUjian = useMemo(() => {
        return baseExamList.filter((exam) => {
            const subjectName = exam.subject?.name ?? "Mata Pelajaran Lain";
            const examTitle = (exam.title ?? "").toLowerCase();
            const query = searchQuery.trim().toLowerCase();

            const matchesSearch =
                query === "" ||
                subjectName.toLowerCase().includes(query) ||
                examTitle.includes(query);

            if (!matchesSearch) {
                return false;
            }

            const matchesMataPelajaran =
                filterMataPelajaran === "all" || subjectName === filterMataPelajaran;

            if (!matchesMataPelajaran) {
                return false;
            }

            if (filterStatus === "all") {
                return true;
            }

            if (isStaff) {
                return exam.scheduleStatus === filterStatus;
            }

            if (filterStatus === "selesai") {
                return !!exam.isCompleted;
            }

            if (filterStatus === "belum") {
                return !exam.isCompleted;
            }

            return true;
        });
    }, [baseExamList, searchQuery, filterMataPelajaran, filterStatus, isStaff]);

    const groupedFilteredUjian = useMemo(() => {
        return filteredUjian.reduce<Record<string, NormalizedExam[]>>((acc, exam) => {
            const subjectName = exam.subject?.name ?? "Mata Pelajaran Lain";
            if (!acc[subjectName]) {
                acc[subjectName] = [];
            }
            acc[subjectName].push(exam);
            return acc;
        }, {});
    }, [filteredUjian]);

    const groupedEntries = useMemo(() => Object.entries(groupedFilteredUjian), [groupedFilteredUjian]);

    const staffSummary = useMemo(() => {
        if (!isStaff) {
            return {
                total: studentExamData.all.length,
                upcoming: 0,
                ongoing: 0,
                completed: studentExamData.completed.length,
            };
        }

        return staffExamList.reduce(
            (acc, exam) => {
                if (exam.scheduleStatus === "completed") {
                    acc.completed += 1;
                } else if (exam.scheduleStatus === "ongoing") {
                    acc.ongoing += 1;
                } else {
                    acc.upcoming += 1;
                }
                return acc;
            },
            {
                total: staffExamList.length,
                upcoming: 0,
                ongoing: 0,
                completed: 0,
            },
        );
    }, [isStaff, staffExamList, studentExamData]);

    const uncompletedExam = studentExamData.uncompleted;
    const examSelesai = studentExamData.completed;
    const uncompletedExamLength = uncompletedExam.length;

    useEffect(() => {
        if (isStudent) {
            setCurrentIndex(0);
        }
    }, [isStudent, uncompletedExamLength]);

    const nextSlide = useCallback(() => {
        if (uncompletedExamLength > 0) {
            setCurrentIndex((prev) => (prev + 1) % uncompletedExamLength);
        }
    }, [uncompletedExamLength]);

    const prevSlide = useCallback(() => {
        if (uncompletedExamLength > 0) {
            setCurrentIndex((prev) => (prev - 1 + uncompletedExamLength) % uncompletedExamLength);
        }
    }, [uncompletedExamLength]);

    const toggleSubjectOpen = useCallback((subjectName: string) => {
        setOpenSubjects((prev) => ({
            ...prev,
            [subjectName]: !prev[subjectName],
        }));
    }, []);

    const handleResetFilters = useCallback(() => {
        setSearchQuery("");
        setFilterMataPelajaran("all");
        setFilterStatus("all");
    }, []);

    const handleCreateExam = useCallback((examData: any) => {
        console.log("Creating exam with data:", examData);
        setIsCreateExamModalOpen(false);
    }, []);

    return (
        <>
            {isStudent && (
                <div className="overflow-y-auto min-h-screen">
                    <DashHeader user={user} student={student} />

                    <div id="ujian-main-data" className="w-full p-4 flex flex-col lg:flex-row gap-4">
                        <div className="lg:flex-1 bg-white rounded-2xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex flex-col gap-4 h-[200px]">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold">Ujian Belum Dikerjakan</h2>
                                    <p className="text-black/60 text-sm">Daftar ujian belum dikerjakan anda</p>
                                </div>
                                {uncompletedExamLength > 1 && (
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={prevSlide}
                                            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                                            disabled={uncompletedExamLength <= 1}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                            </svg>
                                        </button>
                                        <span className="text-xs text-gray-500">
                                            {currentIndex + 1} / {uncompletedExamLength}
                                        </span>
                                        <button
                                            onClick={nextSlide}
                                            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                                            disabled={uncompletedExamLength <= 1}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                            </svg>
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 flex items-center">
                                {uncompletedExamLength > 0 ? (
                                    <div className="w-full overflow-hidden">
                                        <div
                                            className="flex transition-transform duration-300 ease-in-out"
                                            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                                        >
                                            {uncompletedExam.map((item: any, index: number) => (
                                                <div key={item.id ?? index} className="w-full flex-shrink-0">
                                                    <div className="border-t border-black/10 pt-4">
                                                        <UjianCard ujian={item} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-full flex flex-col items-center justify-center py-4 bg-gray-50 rounded-xl border border-dashed border-orange-200 h-[80px]">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-orange-400 mb-1">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                        </svg>
                                        <h3 className="text-sm font-semibold text-orange-600 mb-0.5">Semua ujian sudah selesai!</h3>
                                        <p className="text-black/60 text-xs">Tidak ada ujian pending. Pertahankan prestasimu!</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="w-full lg:w-auto lg:min-w-[400px] grid grid-cols-2 gap-4">
                            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex flex-col items-center justify-center text-center h-[200px]">
                                <div className="bg-red-100 p-3 rounded-full mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-red-600">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                    </svg>
                                </div>
                                <h3 className="text-3xl font-bold text-red-600 mb-2">{uncompletedExamLength}</h3>
                                <p className="text-sm font-medium text-gray-700">Ujian Belum Selesai</p>
                                <p className="text-xs text-gray-500 mt-1">Perlu dikerjakan</p>
                            </div>

                            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex flex-col items-center justify-center text-center h-[200px]">
                                <div className="bg-green-100 p-3 rounded-full mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-green-600">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                    </svg>
                                </div>
                                <h3 className="text-3xl font-bold text-green-600 mb-2">{examSelesai.length}</h3>
                                <p className="text-sm font-medium text-gray-700">Ujian Sudah Selesai</p>
                                <p className="text-xs text-gray-500 mt-1">Sudah dikumpulkan</p>
                            </div>
                        </div>
                    </div>

                    <section className="w-full px-4 pb-4">
                        <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100">
                            <div className="flex flex-col sm:flex-row gap-4 items-center">
                                <div className="relative flex-1 w-full">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
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

                                {(searchQuery !== "" || filterMataPelajaran !== "all" || filterStatus !== "all") && (
                                    <button
                                        onClick={handleResetFilters}
                                        className="w-full sm:w-auto px-4 py-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors duration-200 text-sm font-medium flex items-center justify-center gap-2"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                        </svg>
                                        Reset
                                    </button>
                                )}
                            </div>
                        </div>
                    </section>

                    <section id="list-ujian" className="w-full grid grid-cols-1 gap-4 p-4">
                        {groupedEntries.length > 0 ? (
                            groupedEntries.map(([subjectName, ujianList]) => (
                                <div key={subjectName} className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex flex-col gap-4">
                                    <div
                                        className="flex items-center justify-between cursor-pointer"
                                        onClick={() => toggleSubjectOpen(subjectName)}
                                    >
                                        <div>
                                            <h2 className="text-lg font-semibold">{subjectName}</h2>
                                            <p className="text-black/60 text-sm">{ujianList.length} Ujian</p>
                                        </div>
                                        <span className="p-1 rounded hover:bg-gray-100 transition" aria-label={openSubjects[subjectName] ? "Tutup" : "Buka"}>
                                            {openSubjects[subjectName] ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                        </span>
                                    </div>

                                    {openSubjects[subjectName] && (
                                        <div className="divide-y divide-black/10 transition-all duration-300">
                                            {ujianList.map((item) => (
                                                <div key={item.id} className="flex items-start sm:items-center justify-between py-4 gap-2">
                                                    <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1">
                                                        <div>
                                                            <h3 className="font-medium">{item.title}</h3>
                                                            <p className="text-black/60 text-sm">
                                                                Tanggal: {item.date ? new Date(item.date).toLocaleDateString("id-ID", {
                                                                    day: "2-digit",
                                                                    month: "long",
                                                                    year: "numeric",
                                                                }) : "-"}
                                                                {item.start_time && item.end_time ? ` • ${item.start_time} - ${item.end_time}` : ""}
                                                            </p>
                                                            <p className="text-black/60 text-xs">Ruangan: {item.room?.name || "Belum ditentukan"}</p>
                                                        </div>
                                                        <p className={`text-xs ${item.isCompleted ? "text-emerald-600" : "text-orange-700"}`}>
                                                            {item.isCompleted ? "Selesai" : "Belum dikerjakan"}
                                                        </p>
                                                    </div>
                                                    <div className="flex flex-col sm:flex-row items-center gap-2">
                                                        {item.isCompleted ? (
                                                            <button
                                                                onClick={() => router.push(`/edu/ujian/${item.id}?mode=hasil`)}
                                                                className="text-sm bg-emerald-500 text-white px-3 py-2 rounded-sm flex items-center gap-1 hover:bg-emerald-400 hover:shadow transition"
                                                            >
                                                                Lihat Hasil
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                                                </svg>
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => router.push(`/edu/ujian/${item.id}`)}
                                                                className="text-sm bg-orange-500 text-white px-3 py-2 rounded-sm flex items-center gap-1 hover:bg-orange-400 hover:shadow transition"
                                                            >
                                                                Kerjakan
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
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
                            <div className="text-center text-gray-400 py-8">Tidak ada ujian.</div>
                        )}
                    </section>
                </div>
            )}

            {isStaff && (
                <div className="overflow-y-auto min-h-screen">
                    <DashHeader user={user} student={student} />

                    <div id="ujian-main-data" className="w-full p-4 flex flex-col lg:flex-row gap-4">
                        <div className="lg:flex-1 bg-white rounded-2xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex flex-col gap-4 h-[200px]">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold">Buat Ujian Baru</h2>
                                    <p className="text-black/60 text-sm">Klik tombol di bawah untuk membuat ujian baru</p>
                                </div>
                            </div>

                            <div className="flex-1 flex items-center justify-center">
                                <button
                                    onClick={() => setIsCreateExamModalOpen(true)}
                                    className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-all duration-200 flex items-center gap-3 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                    Buat Ujian Baru
                                </button>
                            </div>
                        </div>

                        <div className="w-full lg:w-auto lg:min-w-[400px] grid grid-cols-2 gap-4">
                            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex flex-col items-center justify-center text-center h-[200px]">
                                <div className="bg-blue-100 p-3 rounded-full mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-blue-600">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3-6h-7.5M21 7.5c0-1.05-.84-1.89-1.89-1.89H4.89C3.84 5.61 3 6.45 3 7.5v9c0 1.05.84 1.89 1.89 1.89h14.22c1.05 0 1.89-.84 1.89-1.89v-9Z" />
                                    </svg>
                                </div>
                                <h3 className="text-3xl font-bold text-blue-600 mb-2">{staffSummary.total}</h3>
                                <p className="text-sm font-medium text-gray-700">Total Ujian</p>
                                <p className="text-xs text-gray-500 mt-1">Yang telah dijadwalkan</p>
                            </div>

                            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex flex-col items-center justify-center text-center h-[200px]">
                                <div className="bg-green-100 p-3 rounded-full mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-green-600">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                    </svg>
                                </div>
                                <h3 className="text-3xl font-bold text-green-600 mb-2">{staffSummary.ongoing}</h3>
                                <p className="text-sm font-medium text-gray-700">Ujian Sedang Berlangsung</p>
                                <p className="text-xs text-gray-500 mt-1">Periksa proktor dan peserta</p>
                            </div>
                        </div>
                    </div>

                    <section className="w-full px-4 pb-4">
                        <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100">
                            <div className="flex flex-col sm:flex-row gap-4 items-center">
                                <div className="relative flex-1 w-full">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
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
                                        className="w-full sm:w-48 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-sm bg-white"
                                    >
                                        <option value="all">Semua Status</option>
                                        <option value="upcoming">Belum Dimulai</option>
                                        <option value="ongoing">Sedang Berlangsung</option>
                                        <option value="completed">Sudah Selesai</option>
                                    </select>
                                </div>

                                {(searchQuery !== "" || filterMataPelajaran !== "all" || filterStatus !== "all") && (
                                    <button
                                        onClick={handleResetFilters}
                                        className="w-full sm:w-auto px-4 py-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors duration-200 text-sm font-medium flex items-center justify-center gap-2"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                        </svg>
                                        Reset
                                    </button>
                                )}
                            </div>
                        </div>
                    </section>

                    <section id="list-ujian" className="w-full grid grid-cols-1 gap-4 p-4">
                        {groupedEntries.length > 0 ? (
                            groupedEntries.map(([subjectName, ujianList]) => (
                                <div key={subjectName} className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex flex-col gap-4">
                                    <div
                                        className="flex items-center justify-between cursor-pointer"
                                        onClick={() => toggleSubjectOpen(subjectName)}
                                    >
                                        <div>
                                            <h2 className="text-lg font-semibold">{subjectName}</h2>
                                            <p className="text-black/60 text-sm">{ujianList.length} Ujian</p>
                                        </div>
                                        <span className="p-1 rounded hover:bg-gray-100 transition" aria-label={openSubjects[subjectName] ? "Tutup" : "Buka"}>
                                            {openSubjects[subjectName] ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                        </span>
                                    </div>

                                    {openSubjects[subjectName] && (
                                        <div className="divide-y divide-black/10 transition-all duration-300">
                                            {ujianList.map((item) => (
                                                <div key={item.id} className="flex flex-col gap-3 py-4">
                                                    <div className="flex items-center gap-3 text-xs uppercase tracking-wide text-orange-500">
                                                        <span>{item.subject?.name ?? "Mata Pelajaran"}</span>
                                                        <span className="text-gray-300">•</span>
                                                        <span>{item.class?.name ?? "Kelas"}</span>
                                                    </div>
                                                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                                        <div>
                                                            <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                                                            <p className="text-sm text-gray-500">
                                                                {item.date
                                                                    ? new Date(item.date).toLocaleDateString("id-ID", {
                                                                          day: "2-digit",
                                                                          month: "long",
                                                                          year: "numeric",
                                                                      })
                                                                    : ""}
                                                                {item.start_time && item.end_time ? ` • ${item.start_time} - ${item.end_time}` : ""}
                                                            </p>
                                                            <p className="text-xs text-gray-500">Ruangan: {item.room?.name ?? "Belum ditentukan"}</p>
                                                        </div>
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <span className={`text-xs font-medium ${getStaffStatusClass(item.scheduleStatus)} bg-gray-50 px-3 py-1 rounded-full`}>
                                                                {getStaffStatusCopy(item.scheduleStatus)}
                                                            </span>
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
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-gray-400 py-8">Tidak ada ujian yang cocok dengan filter.</div>
                        )}
                    </section>
                </div>
            )}

            {!isStudent && !isStaff && (
                <div className="min-h-screen flex items-center justify-center text-gray-400 text-sm">
                    Data ujian akan muncul setelah akun memiliki peran siswa atau staf.
                </div>
            )}

            <CreateExamModal
                isOpen={isStaff && isCreateExamModalOpen}
                onClose={() => setIsCreateExamModalOpen(false)}
                subjects={subjectsList}
                classes={classesList}
                rooms={roomsList}
                onSubmit={handleCreateExam}
            />
        </>
    );
}
