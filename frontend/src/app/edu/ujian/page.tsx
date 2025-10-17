"use client";

import DashHeader from "@/app/components/DashHeader";
import { ChevronDown, ChevronUp } from "lucide-react";
import React, { useState, useEffect, useMemo } from 'react';
import UjianCard from "@/components/subComponents/forUjian/Ujiancard";
import { useEduData } from "@/app/edu/context";
import CreateExamModal from "@/app/components/CreateExamModal";

export default function UjianSiswa() {
    const { user, student, exams, subjects, classes, rooms } = useEduData();

    const [uncompletedExam, setUncompletedExam] = useState<any[]>([])
    const [examSelesai, setExamSelesai] = useState<any[]>([])
    const [ujian, setUjian] = useState<any[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)

    // Search and filter states
    const [searchQuery, setSearchQuery] = useState("")
    const [filterMataPelajaran, setFilterMataPelajaran] = useState("all")
    const [filterStatus, setFilterStatus] = useState("all")

    // Modal state for teacher
    const [isCreateExamModalOpen, setIsCreateExamModalOpen] = useState(false)

    const classId = useMemo(() => student?.class?.id ?? student?.class_id ?? student?.classId ?? null, [student])

    // Derive exam lists from context
    useEffect(() => {
        if (!exams || !subjects || !classId) return;

        const allExams = exams?.exams ?? [];
        const uncompleted = exams?.uncompletedExams ?? [];
        const selesai = exams?.selesaiExams ?? exams?.completedExams ?? [];

        // Filter to student's class
        const filterByClass = (arr: any[]) => arr.filter((e: any) => (e.class_id ?? e.classId ?? e.class?.id) === classId)

        const uncompletedMe = filterByClass(Array.isArray(uncompleted) ? uncompleted : []);
        const selesaiMe = filterByClass(Array.isArray(selesai) ? selesai : []);
        const allMe = filterByClass(Array.isArray(allExams) ? allExams : []);

        // Merge subjects and completion flag
        const ujianWithSubjects = allMe.map((exam: any) => {
            const subject = subjects.find((s: any) => s.id === (exam.subject_id ?? exam.subjectId));
            const isCompleted = [...selesaiMe].some((completed: any) => completed.id === exam.id);
            return { ...exam, subject, isCompleted };
        });

        setUncompletedExam(uncompletedMe)
        setExamSelesai(selesaiMe)
        setUjian(ujianWithSubjects)
    }, [exams, subjects, classId])

    // Reset carousel index when uncompletedExam changes
    useEffect(() => {
        setCurrentIndex(0);
    }, [uncompletedExam]);

    const [openSubjects, setOpenSubjects] = useState<{ [key: string]: boolean }>({});

    // Get unique mata pelajaran for filter dropdown
    const getUniqueMataPelajaran = () => {
        if (!ujian) return [] as string[];
        const subjectNames = ujian.map((u: any) => u.subject?.name || 'Mata Pelajaran Lain');
        return [...new Set(subjectNames)];
    };

    // Filter ujian based on search query and filters
    const getFilteredUjian = () => {
        if (!ujian) return [] as any[];

        return ujian.filter((item: any) => {
            const subjectName = item.subject?.name || 'Mata Pelajaran Lain';
            const isCompleted = item.isCompleted;

            // Search filter - search in mata pelajaran and title
            const matchesSearch = searchQuery === "" ||
                subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.title.toLowerCase().includes(searchQuery.toLowerCase());

            // Mata pelajaran filter
            const matchesMataPelajaran = filterMataPelajaran === "all" ||
                subjectName === filterMataPelajaran;

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
        if (uncompletedExam && uncompletedExam.length > 0) {
            setCurrentIndex((prev) => (prev + 1) % uncompletedExam.length);
        }
    };

    const prevSlide = () => {
        if (uncompletedExam && uncompletedExam.length > 0) {
            setCurrentIndex((prev) => (prev - 1 + uncompletedExam.length) % uncompletedExam.length);
        }
    };

    // Handle exam creation
    const handleCreateExam = (examData: any) => {
        console.log('Creating exam with data:', examData);
        // Here you would typically call an API to create the exam
        // For now, we'll just log the data
        // You can implement the actual API call based on your backend
    };

    return (
        <>
        {user?.role === 'siswa' && (
        <div className="overflow-y-auto min-h-screen">
            <DashHeader user={user} student={student} />

            <div id="ujian-main-data" className="w-full p-4 flex flex-col lg:flex-row gap-4">
                {/* Ujian list */}
                <div className="lg:flex-1 bg-white rounded-2xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex flex-col gap-4 h-[200px]">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold">Ujian Belum Dikerjakan</h2>
                            <p className="text-black/60 text-sm">Daftar ujian belum dikerjakan anda</p>
                        </div>
                        {uncompletedExam && uncompletedExam.length > 1 && (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={prevSlide}
                                    className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                                    disabled={uncompletedExam.length <= 1}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
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
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="flex-1 flex items-center">
                        {uncompletedExam && uncompletedExam.length > 0 ? (
                            <div className="w-full overflow-hidden">
                                <div
                                    className="flex transition-transform duration-300 ease-in-out"
                                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                                >
                                    {uncompletedExam.map((item: any, index: number) => (
                                        <div key={index} className="w-full flex-shrink-0">
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

                {/* Jumlah ujian */}
                <div className="w-full lg:w-auto lg:min-w-[400px] grid grid-cols-2 gap-4">
                    {/* ujian belum selesai */}
                    <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex flex-col items-center justify-center text-center h-[200px]">
                        <div className="bg-red-100 p-3 rounded-full mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-red-600">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                        </div>
                        <h3 className="text-3xl font-bold text-red-600 mb-2">{uncompletedExam ? uncompletedExam.length : 0}</h3>
                        <p className="text-sm font-medium text-gray-700">Ujian Belum Selesai</p>
                        <p className="text-xs text-gray-500 mt-1">Perlu dikerjakan</p>
                    </div>

                    {/* ujian sudah selesai */}
                    <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex flex-col items-center justify-center text-center h-[200px]">
                        <div className="bg-green-100 p-3 rounded-full mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-green-600">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                        </div>
                        <h3 className="text-3xl font-bold text-green-600 mb-2">{examSelesai ? examSelesai.length : 0}</h3>
                        <p className="text-sm font-medium text-gray-700">Ujian Sudah Selesai</p>
                        <p className="text-xs text-gray-500 mt-1">Sudah dikumpulkan</p>
                    </div>
                </div>
            </div>

            {/*Search & filter*/}
            <section className="w-full px-4 pb-4">
                <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100">
                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                        {/* Search Bar */}
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

                        {/* Filter Mata Pelajaran */}
                        <div className="w-full sm:w-auto">
                            <select
                                value={filterMataPelajaran}
                                onChange={(e) => setFilterMataPelajaran(e.target.value)}
                                className="w-full sm:w-48 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-sm bg-white"
                            >
                                <option value="all">Semua Mata Pelajaran</option>
                                {getUniqueMataPelajaran().map((mataPelajaran) => (
                                    <option key={mataPelajaran} value={mataPelajaran}>
                                        {mataPelajaran}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Filter Status */}
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

                        {/* Clear Filters Button */}
                        {(searchQuery !== "" || filterMataPelajaran !== "all" || filterStatus !== "all") && (
                            <button
                                onClick={() => {
                                    setSearchQuery("");
                                    setFilterMataPelajaran("all");
                                    setFilterStatus("all");
                                }}
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

            {/* List ujian */}
            <section id="list-ujian" className="w-full grid grid-cols-1 gap-4 p-4">
                {(() => {
                    const filteredUjian = getFilteredUjian();
                    return filteredUjian && filteredUjian.length > 0 ? (
                        // Group filtered ujian by subject (mata pelajaran)
                        Object.entries(
                            filteredUjian.reduce((acc: Record<string, any[]>, item: any) => {
                                const subjectName = item.subject?.name || 'Mata Pelajaran Lain';
                                if (!acc[subjectName]) {
                                    acc[subjectName] = [];
                                }
                                acc[subjectName].push(item);
                                return acc;
                            }, {})
                        ).map(([subjectName, ujianList]) => (
                            <div key={subjectName} className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex flex-col gap-4">
                                <div
                                    className="flex items-center justify-between cursor-pointer"
                                    onClick={() => setOpenSubjects(prev => ({
                                        ...prev,
                                        [subjectName]: !prev[subjectName]
                                    }))}
                                >
                                    <div>
                                        <h2 className="text-lg font-semibold">{subjectName}</h2>
                                        <p className="text-black/60 text-sm">{
                                            // @ts-ignore
                                            ujianList.length} Ujian • {ujianList[0]?.subject?.category || 'Kategori'
                                        }</p>
                                    </div>
                                    <span
                                        className="p-1 rounded hover:bg-gray-100 transition"
                                        aria-label={openSubjects[subjectName] ? "Tutup" : "Buka"}
                                    >
                                        {openSubjects[subjectName] ?
                                            <ChevronUp className="w-5 h-5" /> :
                                            <ChevronDown className="w-5 h-5" />
                                        }
                                    </span>
                                </div>

                                {openSubjects[subjectName] && (
                                    <div className="divide-y divide-black/10 transition-all duration-300">
                                        { // @ts-ignore
                                            ujianList.map((item) => (
                                            <div key={item.id} className="flex items-start sm:items-center justify-between py-4 gap-2">
                                                <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1">
                                                    <div>
                                                        <h3 className="font-medium">{item.title}</h3>
                                                        <p className="text-black/60 text-sm">
                                                            Tanggal: {new Date(item.date).toLocaleDateString('id-ID', {
                                                                day: '2-digit',
                                                                month: 'long',
                                                                year: 'numeric'
                                                            })} • {item.start_time} - {item.end_time}
                                                        </p>
                                                        <p className="text-black/60 text-xs">
                                                            Ruangan: {item.room?.name || 'Belum ditentukan'}
                                                        </p>
                                                    </div>
                                                    <p className={`text-xs ${
                                                        item.isCompleted
                                                            ? "text-emerald-600" 
                                                            : "text-orange-700"
                                                    }`}>
                                                        {item.isCompleted
                                                            ? "Selesai"
                                                            : "Belum dikerjakan"}
                                                    </p>
                                                </div>
                                                <div className="flex flex-col sm:flex-row items-center gap-2">
                                                    {item.isCompleted ? (
                                                        <a href="#" className="text-sm bg-emerald-400 text-white px-3 py-2 rounded-sm flex items-center gap-1 hover:bg-emerald-300 hover:shadow transition">
                                                            Selesai
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                                            </svg>
                                                        </a>
                                                    ) : (
                                                        <a href="#" className="text-sm bg-orange-500 text-white px-3 py-2 rounded-sm flex items-center gap-1 hover:bg-orange-400 hover:shadow transition">
                                                            Kerjakan
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                                            </svg>
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-gray-400 py-8">
                            Tidak ada ujian.
                        </div>
                    );
                })()}
            </section>
        </div>
        )}

        {user?.role === 'guru' && (
            <div className="overflow-y-auto min-h-screen">
                <DashHeader user={user} student={student} />

                <div id="ujian-main-data" className="w-full p-4 flex flex-col lg:flex-row gap-4">
                    {/* Create Exam Button Section - Replace exam pending detail */}
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

                    {/* Statistics */}
                    <div className="w-full lg:w-auto lg:min-w-[400px] grid grid-cols-2 gap-4">
                        {/* Total ujian */}
                        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex flex-col items-center justify-center text-center h-[200px]">
                            <div className="bg-blue-100 p-3 rounded-full mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-blue-600">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3-6h-7.5M21 7.5c0-1.05-.84-1.89-1.89-1.89H4.89C3.84 5.61 3 6.45 3 7.5v9c0 1.05.84 1.89 1.89 1.89h14.22c1.05 0 1.89-.84 1.89-1.89v-9Z" />
                                </svg>
                            </div>
                            <h3 className="text-3xl font-bold text-blue-600 mb-2">{ujian ? ujian.length : 0}</h3>
                            <p className="text-sm font-medium text-gray-700">Total Ujian</p>
                            <p className="text-xs text-gray-500 mt-1">Yang telah dibuat</p>
                        </div>

                        {/* Active ujian */}
                        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex flex-col items-center justify-center text-center h-[200px]">
                            <div className="bg-green-100 p-3 rounded-full mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-green-600">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                            </div>
                            <h3 className="text-3xl font-bold text-green-600 mb-2">{uncompletedExam ? uncompletedExam.length : 0}</h3>
                            <p className="text-sm font-medium text-gray-700">Ujian Aktif</p>
                            <p className="text-xs text-gray-500 mt-1">Sedang berjalan</p>
                        </div>
                    </div>
                </div>

                {/*Search & filter*/}
                <section className="w-full px-4 pb-4">
                    <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100">
                        <div className="flex flex-col sm:flex-row gap-4 items-center">
                            {/* Search Bar */}
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

                            {/* Filter Mata Pelajaran */}
                            <div className="w-full sm:w-auto">
                                <select
                                    value={filterMataPelajaran}
                                    onChange={(e) => setFilterMataPelajaran(e.target.value)}
                                    className="w-full sm:w-48 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-sm bg-white"
                                >
                                    <option value="all">Semua Mata Pelajaran</option>
                                    {getUniqueMataPelajaran().map((mataPelajaran) => (
                                        <option key={mataPelajaran} value={mataPelajaran}>
                                            {mataPelajaran}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Filter Status */}
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

                            {/* Clear Filters Button */}
                            {(searchQuery !== "" || filterMataPelajaran !== "all" || filterStatus !== "all") && (
                                <button
                                    onClick={() => {
                                        setSearchQuery("");
                                        setFilterMataPelajaran("all");
                                        setFilterStatus("all");
                                    }}
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

                {/* List ujian */}
                <section id="list-ujian" className="w-full grid grid-cols-1 gap-4 p-4">
                    {(() => {
                        const filteredUjian = getFilteredUjian();
                        return filteredUjian && filteredUjian.length > 0 ? (
                            // Group filtered ujian by subject (mata pelajaran)
                            Object.entries(
                                filteredUjian.reduce((acc: Record<string, any[]>, item: any) => {
                                    const subjectName = item.subject?.name || 'Mata Pelajaran Lain';
                                    if (!acc[subjectName]) {
                                        acc[subjectName] = [];
                                    }
                                    acc[subjectName].push(item);
                                    return acc;
                                }, {})
                            ).map(([subjectName, ujianList]) => (
                                <div key={subjectName} className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex flex-col gap-4">
                                    <div
                                        className="flex items-center justify-between cursor-pointer"
                                        onClick={() => setOpenSubjects(prev => ({
                                            ...prev,
                                            [subjectName]: !prev[subjectName]
                                        }))}
                                    >
                                        <div>
                                            <h2 className="text-lg font-semibold">{subjectName}</h2>
                                            <p className="text-black/60 text-sm">{
                                                // @ts-ignore
                                                ujianList.length} Ujian • {ujianList[0]?.subject?.category || 'Kategori'
                                            }</p>
                                        </div>
                                        <span
                                            className="p-1 rounded hover:bg-gray-100 transition"
                                            aria-label={openSubjects[subjectName] ? "Tutup" : "Buka"}
                                        >
                                            {openSubjects[subjectName] ?
                                                <ChevronUp className="w-5 h-5" /> :
                                                <ChevronDown className="w-5 h-5" />
                                            }
                                        </span>
                                    </div>

                                    {openSubjects[subjectName] && (
                                        <div className="divide-y divide-black/10 transition-all duration-300">
                                            { // @ts-ignore
                                                ujianList.map((item) => (
                                                    <div key={item.id} className="flex items-start sm:items-center justify-between py-4 gap-2">
                                                        <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1">
                                                            <div>
                                                                <h3 className="font-medium">{item.title}</h3>
                                                                <p className="text-black/60 text-sm">
                                                                    Tanggal: {new Date(item.date).toLocaleDateString('id-ID', {
                                                                    day: '2-digit',
                                                                    month: 'long',
                                                                    year: 'numeric'
                                                                })} • {item.start_time} - {item.end_time}
                                                                </p>
                                                                <p className="text-black/60 text-xs">
                                                                    Ruangan: {item.room?.name || 'Belum ditentukan'}
                                                                </p>
                                                            </div>
                                                            <p className={`text-xs ${
                                                                item.isCompleted
                                                                    ? "text-emerald-600"
                                                                    : "text-orange-700"
                                                            }`}>
                                                                {item.isCompleted
                                                                    ? "Selesai"
                                                                    : "Aktif"}
                                                            </p>
                                                        </div>
                                                        <div className="flex flex-col sm:flex-row items-center gap-2">
                                                            <button className="text-sm bg-blue-500 text-white px-3 py-2 rounded-sm flex items-center gap-1 hover:bg-blue-400 hover:shadow transition">
                                                                Edit
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                                                </svg>
                                                            </button>
                                                            <button className="text-sm bg-red-500 text-white px-3 py-2 rounded-sm flex items-center gap-1 hover:bg-red-400 hover:shadow transition">
                                                                Hapus
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-gray-400 py-8">
                                Tidak ada ujian.
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
