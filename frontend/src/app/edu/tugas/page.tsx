"use client";

import DashHeader from "@/app/components/DashHeader";
import { ChevronDown, ChevronUp } from "lucide-react";
import React, { useState, useEffect, useMemo } from 'react';
import TugasPending from "@/components/subComponents/forTugas/tugasPending";
import TugasItem from "@/components/subComponents/forTugas/TugasItem";
import { useEduData } from "@/app/edu/context";
import CreateTaskModal from "@/app/components/CreateTaskModal";

export default function Tugas() {
    const { user, student, tugas, teacher, teachers, subjects, classes, rooms } = useEduData();

    const [tugasPending, setTugasPending] = useState<any[]>([])
    const [tugasSelesai, setTugasSelesai] = useState<any[]>([])
    const [tugasWithTeacher, setTugasWithTeacher] = useState<any[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

    // Search and filter states
    const [searchQuery, setSearchQuery] = useState("")
    const [filterMataPelajaran, setFilterMataPelajaran] = useState("all")
    const [filterStatus, setFilterStatus] = useState("all")

    const classId = useMemo(() => student?.class?.id ?? student?.class_id ?? student?.classId ?? teacher?.class_id ?? null, [student])

    useEffect(() => {
        if (!tugas) return;

        let tugasList: any[] = [];
        if (user?.role === 'guru') {

            // Untuk guru, filter tugas yang dibuat olehnya (tanpa memfilter teacher)
            const creatorId = teacher?.user_id ?? user.id;
            tugasList = tugas.filter((t: any) => (t.created_by ?? t.teacher_id) === creatorId);

        } else if (user?.role === 'siswa' && classId) {

            // Untuk siswa, filter tugas berdasarkan classId
            tugasList = tugas.filter((t: any) => t.class_id === classId);
        } else {
            setTugasWithTeacher([]);
            return;
        }

        // Map tugas dengan teacher yang sesuai
        const tugasWithAssignedTeacher = tugasList.map((t: any) => {

            if (user?.role === 'guru') {
                // Untuk guru, lampirkan objek teacher yang sudah tersedia
                return { ...t, teacher };
            } else if (user?.role === 'siswa') {
                // Untuk siswa, cari teacher yang sesuai dari array teachers berdasarkan created_by
                const teacherForThisTask = Array.isArray(teachers)
                    ? teachers.find((tch: any) => tch.user_id === t.created_by)
                    : null;
                return { ...t, teacher: teacherForThisTask };
            }

            return t;
        });

        setTugasWithTeacher(tugasWithAssignedTeacher);

    }, [tugas, teacher, teachers, classId, user]);

    useEffect(() => {
        if (!tugasWithTeacher) return;

        const belumSelesai = tugasWithTeacher.filter((t: any) => !t.submissions || t.submissions.length === 0);
        const sudahSelesai = tugasWithTeacher.filter((t: any) => t.submissions && t.submissions.length > 0);

        setTugasPending(belumSelesai);
        setTugasSelesai(sudahSelesai);
    }, [tugasWithTeacher]);

    // Reset carousel index when tugasPending changes
    useEffect(() => {
        setCurrentIndex(0);
    }, [tugasPending]);

    // Carousel functions
    const nextSlide = () => {
        if (tugasPending && tugasPending.length > 0) {
            setCurrentIndex((prev) => (prev + 1) % tugasPending.length);
        }
    };

    const prevSlide = () => {
        if (tugasPending && tugasPending.length > 0) {
            setCurrentIndex((prev) => (prev - 1 + tugasPending.length) % tugasPending.length);
        }
    };

    const [openSubjects, setOpenSubjects] = useState<{ [key: string]: boolean }>({});

    // Get unique mata pelajaran for filter dropdown
    const getUniqueMataPelajaran = () => {
        if (!tugasWithTeacher) return [] as string[];
        const specializations = tugasWithTeacher.map((t: any) => t.teacher?.specialization || 'Mata Pelajaran Lain');
        return [...new Set(specializations)];
    };

    // Filter tugas based on search query and filters
    const getFilteredTugas = () => {
        if (!tugasWithTeacher) return [] as any[];

        return tugasWithTeacher.filter((item: any) => {
            const specialization = item.teacher?.specialization || 'Mata Pelajaran Lain';
            const isCompleted = item.submissions && item.submissions.length > 0;

            // Search filter - search in mata pelajaran and title
            const matchesSearch = searchQuery === "" ||
                specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.title.toLowerCase().includes(searchQuery.toLowerCase());

            // Mata pelajaran filter
            const matchesMataPelajaran = filterMataPelajaran === "all" ||
                specialization === filterMataPelajaran;

            // Status filter
            const matchesStatus = filterStatus === "all" ||
                (filterStatus === "selesai" && isCompleted) ||
                (filterStatus === "belum" && !isCompleted);

            return matchesSearch && matchesMataPelajaran && matchesStatus;
        });
    };

    return (
        <>
            {user?.role === 'siswa' && (
                <div className="overflow-y-auto min-h-screen">
                    <DashHeader user={user} student={student} />

                    <div className="w-full p-4 flex flex-col lg:flex-row gap-4">
                        {/* TASK PENDING DETAILS */}
                        <div className="lg:flex-1 bg-white rounded-2xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex flex-col gap-4 h-[200px]">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold">Tugas Belum Dikerjakan</h2>
                                    <p className="text-black/60 text-sm">Daftar tugas belum dikerjakan anda</p>
                                </div>
                                {tugasPending && tugasPending.length > 1 && (
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={prevSlide}
                                            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                                            disabled={tugasPending.length <= 1}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                            </svg>
                                        </button>
                                        <span className="text-xs text-gray-500">
                                            {currentIndex + 1} / {tugasPending.length}
                                        </span>
                                        <button
                                            onClick={nextSlide}
                                            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                                            disabled={tugasPending.length <= 1}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                            </svg>
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 flex items-center">
                                {tugasPending && tugasPending.length > 0 ? (
                                    <div className="w-full overflow-hidden">
                                        <div
                                            className="flex transition-transform duration-300 ease-in-out"
                                            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                                        >
                                            {tugasPending.map((item: any, index: number) => (
                                                <div key={index} className="w-full flex-shrink-0">
                                                    <div className="border-t border-black/10 pt-4">
                                                        <TugasPending tugas={item} />
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
                                        <h3 className="text-sm font-semibold text-orange-600 mb-0.5">Semua tugas sudah selesai!</h3>
                                        <p className="text-black/60 text-xs">Tidak ada tugas pending. Pertahankan prestasimu!</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Jumlah tugas */}
                        <div className="w-full lg:w-auto lg:min-w-[400px] grid grid-cols-2 gap-4">
                            {/* tugas belum selesai */}
                            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex flex-col items-center justify-center text-center h-[200px]">
                                <div className="bg-red-100 p-3 rounded-full mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-red-600">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                    </svg>
                                </div>
                                <h3 className="text-3xl font-bold text-red-600 mb-2">{tugasPending ? tugasPending.length : 0}</h3>
                                <p className="text-sm font-medium text-gray-700">Tugas Belum Selesai</p>
                                <p className="text-xs text-gray-500 mt-1">Perlu dikerjakan</p>
                            </div>

                            {/* Tugas sudah selesai */}
                            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex flex-col items-center justify-center text-center h-[200px]">
                                <div className="bg-green-100 p-3 rounded-full mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-green-600">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                    </svg>
                                </div>
                                <h3 className="text-3xl font-bold text-green-600 mb-2">{tugasSelesai ? tugasSelesai.length : 0}</h3>
                                <p className="text-sm font-medium text-gray-700">Tugas Sudah Selesai</p>
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
                                        placeholder="Cari berdasarkan mata pelajaran atau judul tugas..."
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

                    {/* List tugas */}
                    <section id="list-tugas" className="w-full grid grid-cols-1 gap-4 p-4">
                        {(() => {
                            const filteredTugas = getFilteredTugas();
                            return filteredTugas && filteredTugas.length > 0 ? (
                                // Group filtered tugas by specialization (mata pelajaran)
                                Object.entries(
                                    filteredTugas.reduce((acc: Record<string, any[]>, item: any) => {
                                        const specialization = item.teacher?.specialization || 'Mata Pelajaran Lain';
                                        if (!acc[specialization]) {
                                            acc[specialization] = [];
                                        }
                                        acc[specialization].push(item);
                                        return acc;
                                    }, {})
                                ).map(([specialization, tugasList]) => (
                                    <div key={specialization} className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex flex-col gap-4">
                                        <div
                                            className="flex items-center justify-between cursor-pointer"
                                            onClick={() => setOpenSubjects(prev => ({
                                                ...prev,
                                                [specialization]: !prev[specialization]
                                            }))}
                                        >
                                            <div>
                                                <h2 className="text-lg font-semibold">{specialization}</h2>
                                                <p className="text-black/60 text-sm">{
                                                    // @ts-ignore
                                                    tugasList.length} Tugas • {tugasList[0]?.teacher?.user?.name || 'Guru'
                                                    }</p>
                                            </div>
                                            <span
                                                className="p-1 rounded hover:bg-gray-100 transition"
                                                aria-label={openSubjects[specialization] ? "Tutup" : "Buka"}
                                            >
                                                {openSubjects[specialization] ?
                                                    <ChevronUp className="w-5 h-5" /> :
                                                    <ChevronDown className="w-5 h-5" />
                                                }
                                            </span>
                                        </div>

                                        {openSubjects[specialization] && (
                                            <div className="divide-y divide-black/10 transition-all duration-300">
                                                { // @ts-ignore
                                                    tugasList.map((item) => (
                                                        <TugasItem
                                                            student={student}
                                                            key={item.id}
                                                            tugas={item}
                                                            isCompleted={item.submissions && item.submissions.length > 0}
                                                        />
                                                    ))}
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-gray-400 py-8">
                                    Tidak ada tugas.
                                </div>
                            );
                        })()}
                    </section>
                </div>
            )}

            {user?.role === 'guru' && (
                <div className="overflow-y-auto min-h-screen">
                    <DashHeader user={user} teacher={teacher} />

                    <div className="w-full p-4 flex flex-col lg:flex-row gap-4">
                        {/* CREATE TASK BUTTON */}
                        <div className="lg:flex-1 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 shadow-md border border-orange-400 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex flex-col justify-center items-center text-center h-[200px] cursor-pointer group"
                            onClick={() => setIsCreateModalOpen(true)}>
                            <div className="bg-white/20 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10 text-white">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">Buat Tugas Baru</h2>
                            <p className="text-white/90 text-sm">Klik untuk membuat tugas baru untuk siswa</p>
                        </div>

                        {/* Jumlah tugas */}
                        <div className="w-full lg:w-auto lg:min-w-[400px] grid grid-cols-2 gap-4">
                            {/* Total Tugas */}
                            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex flex-col items-center justify-center text-center h-[200px]">
                                <div className="bg-blue-100 p-3 rounded-full mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-blue-600">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
                                    </svg>
                                </div>
                                <h3 className="text-3xl font-bold text-blue-600 mb-2">{tugasWithTeacher ? tugasWithTeacher.length : 0}</h3>
                                <p className="text-sm font-medium text-gray-700">Total Tugas</p>
                                <p className="text-xs text-gray-500 mt-1">Tugas yang dibuat</p>
                            </div>

                            {/* Tugas Aktif */}
                            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex flex-col items-center justify-center text-center h-[200px]">
                                <div className="bg-green-100 p-3 rounded-full mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-green-600">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                    </svg>
                                </div>
                                <h3 className="text-3xl font-bold text-green-600 mb-2">{tugasPending ? tugasPending.length : 0}</h3>
                                <p className="text-sm font-medium text-gray-700">Tugas Aktif</p>
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
                                        placeholder="Cari berdasarkan mata pelajaran atau judul tugas..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 focus:outline-none rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-sm"
                                    />
                                </div>

                                {/* Filter Mata Pelajaran */}
                                {/* <div className="w-full sm:w-auto">
                                    <select
                                        value={filterMataPelajaran}
                                        onChange={(e) => setFilterMataPelajaran(e.target.value)}
                                        className="w-full sm:w-48 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-sm bg-white"
                                    >
                                        <option value="all">Semua Mata Pelajaran</option>
                                        {getUniqueMataPelajaran().map((mataPelajaran) => (
                                            <option key={mataPelajaran} value={mataPelajaran}>
                                                { mataPelajaran }
                                            </option>
                                        ))}
                                    </select>
                                </div> */}

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

                    {/* List tugas */}
                    <section id="list-tugas" className="w-full grid grid-cols-1 gap-4 p-4">
                        {(() => {
                            const filteredTugas = getFilteredTugas();
                            return filteredTugas && filteredTugas.length > 0 ? (
                                // Group filtered tugas by specialization (mata pelajaran)
                                Object.entries(
                                    filteredTugas.reduce((acc: Record<string, any[]>, item: any) => {
                                        const specialization = item.teacher?.specialization || 'Mata Pelajaran Lain';
                                        if (!acc[specialization]) {
                                            acc[specialization] = [];
                                        }
                                        acc[specialization].push(item);
                                        return acc;
                                    }, {})
                                ).map(([specialization, tugasList]) => (
                                    <div key={specialization} className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex flex-col gap-4">
                                        <div
                                            className="flex items-center justify-between cursor-pointer"
                                            onClick={() => setOpenSubjects(prev => ({
                                                ...prev,
                                                [specialization]: !prev[specialization]
                                            }))}
                                        >
                                            <div>
                                                <h2 className="text-lg font-semibold">{specialization}</h2>
                                                <p className="text-black/60 text-sm">{
                                                    // @ts-ignore
                                                    tugasList.length} Tugas • {tugasList[0]?.teacher?.user?.name || 'Guru'
                                                    }</p>
                                            </div>
                                            <span
                                                className="p-1 rounded hover:bg-gray-100 transition"
                                                aria-label={openSubjects[specialization] ? "Tutup" : "Buka"}
                                            >
                                                {openSubjects[specialization] ?
                                                    <ChevronUp className="w-5 h-5" /> :
                                                    <ChevronDown className="w-5 h-5" />
                                                }
                                            </span>
                                        </div>

                                        {openSubjects[specialization] && (
                                            <div className="divide-y divide-black/10 transition-all duration-300">
                                                { // @ts-ignore
                                                    tugasList.map((item) => (
                                                        <TugasItem
                                                            student={student}
                                                            key={item.id}
                                                            tugas={item}
                                                            isCompleted={item.submissions && item.submissions.length > 0}
                                                        />
                                                    ))}
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-gray-400 py-8">
                                    Tidak ada tugas.
                                </div>
                            );
                        })()}
                    </section>
                </div>
            )}

            {/* Create Task Modal */}
            <CreateTaskModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={() => {
                    // Optionally refresh tugas data here
                    window.location.reload();
                }}
                teacher={teacher}
                subjects={subjects}
                rooms={rooms}
                classes={classes}
            />
        </>
    )
}
