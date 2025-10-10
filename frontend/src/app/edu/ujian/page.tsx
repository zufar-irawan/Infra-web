"use client";


import DashHeader from "@/app/components/DashHeader";
import { ChevronDown, ChevronUp } from "lucide-react";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from "axios";
import {User} from "@/app/api/me/route";
import TugasPending from "@/components/subComponents/forTugas/tugasPending";
import UjianCard from "@/components/subComponents/forUjian/Ujiancard";

export default function UjianSiswa() {
    const [user, setUser] = useState<User | null>(null)
    const [student, setStudent] = useState<any>()
    const [uncompletedExam, setUncompletedExam] = useState<any>()
    const [examSelesai, setExamSelesai] = useState<any>()
    const [currentIndex, setCurrentIndex] = useState(0)

    // Add new state variables for exam list functionality
    const [ujian, setUjian] = useState<any>()
    const [subjects, setSubjects] = useState<any>()

    // Search and filter states
    const [searchQuery, setSearchQuery] = useState("")
    const [filterMataPelajaran, setFilterMataPelajaran] = useState("all")
    const [filterStatus, setFilterStatus] = useState("all")

    const router = useRouter();

    useEffect(() => {
        const fetchAll = async () => {
            try {
                // user
                const meRes = await axios.get("/api/me");
                const userData = meRes.data.user;
                setUser(userData);

                // student
                const studentRes = await axios.get("/api/student");
                const studentList = studentRes.data.data;
                const studentMe = studentList.find(
                    (s: any) => s.user_id === userData.id
                );
                if (!studentMe) return;
                setStudent(studentMe);

                // fetch exam
                const examRes = await axios.get("/api/exam-card");
                const uncompletedExamList = examRes.data.uncompletedExams;
                const examSelesaiList = examRes.data.selesaiExams;
                const allExams = examRes.data.exams;

                const uncompletedExamMe = uncompletedExamList.filter(
                    (s: any) => s.class_id === studentMe.class_id
                )
                const examSelesaiMe = examSelesaiList.filter(
                    (s: any) => s.class_id === studentMe.class_id
                )

                // Filter all exams for student's class
                const ujianMe = allExams.filter(
                    (e: any) => e.class_id === studentMe.class_id
                );

                // Fetch subjects
                const subjectsRes = await axios.get("/api/subject");
                const subjectsList = subjectsRes.data.data;

                // Merge exams with subjects and exam results
                const ujianWithSubjects = ujianMe.map((exam: any) => {
                    const subject = subjectsList.find((s: any) => s.id === exam.subject_id);
                    const isCompleted = [...examSelesaiMe, ...examSelesaiList].some((completed: any) => completed.id === exam.id);
                    return {
                        ...exam,
                        subject,
                        isCompleted
                    };
                });

                if (!uncompletedExamMe) return;
                if (!examSelesaiMe) return;

                setUncompletedExam(uncompletedExamMe);
                setExamSelesai(examSelesaiMe);
                setUjian(ujianWithSubjects);
                setSubjects(subjectsList);

                console.log('Ujian with subjects:', ujianWithSubjects);
            } catch (e:any) {
                console.error(e)

                if (e.response && (e.response.status === 401 || e.response.status === 403)) {
                    handleLogout();
                }
            }
        }

        fetchAll()
    }, []);

    // Reset carousel index when uncompletedExam changes
    useEffect(() => {
        setCurrentIndex(0);
    }, [uncompletedExam]);

    const handleLogout = async () => {
        await axios.post("/api/logout")
            .then((res) => {
                if(res.status === 200) {
                    router.push("/edu/login");
                }
            })
            .catch((err) => {
                console.error(err);
            })
    };

    const [open1, setOpen1] = useState(true);
    const [open2, setOpen2] = useState(true);
    const [openSubjects, setOpenSubjects] = useState<{ [key: string]: boolean }>({});

    // Get unique mata pelajaran for filter dropdown
    const getUniqueMataPelajaran = () => {
        if (!ujian) return [];
        const subjectNames = ujian.map((u: any) => u.subject?.name || 'Mata Pelajaran Lain');
        return [...new Set(subjectNames)];
    };

    // Filter ujian based on search query and filters
    const getFilteredUjian = () => {
        if (!ujian) return [];

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

            // Status filter
            const matchesStatus = filterStatus === "all" ||
                (filterStatus === "selesai" && isCompleted) ||
                (filterStatus === "belum" && !isCompleted);

            return matchesSearch && matchesMataPelajaran && matchesStatus;
        });
    };

    // Filtered ujian for display
    const filteredUjian = getFilteredUjian();

    // Subjects for filter dropdown
    const mataPelajaranOptions = getUniqueMataPelajaran();

    // Carousel functions
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
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-sm"
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
                                    // @ts-ignore
                                    <option key={mataPelajaran} value={mataPelajaran}>
                                        {/* @ts-ignore */}
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
                                                            : "Belum dikerjakan"
                                                        }
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
                                                        <a href="#" className="text-sm bg-blue-500 text-white px-3 py-2 rounded-sm flex items-center gap-1 hover:bg-blue-400 hover:shadow transition">
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
                        <div className="w-full flex flex-col items-center justify-center py-8 bg-gray-50 rounded-xl border border-dashed border-orange-200">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-orange-400 mb-3">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                            </svg>
                            <h3 className="text-lg font-semibold text-orange-600 mb-1">
                                {(searchQuery !== "" || filterMataPelajaran !== "all" || filterStatus !== "all")
                                    ? "Tidak ada ujian yang sesuai filter"
                                    : "Tidak ada ujian tersedia"
                                }
                            </h3>
                            <p className="text-black/60 text-sm text-center max-w-md">
                                {(searchQuery !== "" || filterMataPelajaran !== "all" || filterStatus !== "all")
                                    ? "Coba ubah kata kunci pencarian atau filter untuk melihat ujian lainnya"
                                    : "Silakan cek kembali nanti untuk ujian yang baru"
                                }
                            </p>
                            {(searchQuery !== "" || filterMataPelajaran !== "all" || filterStatus !== "all") && (
                                <button
                                    onClick={() => {
                                        setSearchQuery("");
                                        setFilterMataPelajaran("all");
                                        setFilterStatus("all");
                                    }}
                                    className="mt-3 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-200 text-sm font-medium"
                                >
                                    Reset Filter
                                </button>
                            )}
                        </div>
                    );
                })()}
            </section>
        </div>
        )}
        </>
    )
}

