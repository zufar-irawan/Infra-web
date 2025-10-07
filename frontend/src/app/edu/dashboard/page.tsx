"use client"

import DashHeader from "@/app/components/DashHeader"

export default function Dashboard() {
    
    return (
        <div className="overflow-y-auto min-h-screen">
            <DashHeader />
            <section id="task" className="w-full grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-4 p-4">
                <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2">
                    <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center text-center text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 w-full">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold">12</h2>
                        <p className="text-sm text-black/60">Tugas Terbaru</p>
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2">
                    <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center text-center text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 w-full">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold">6</h2>
                        <p className="text-sm text-black/60">Tugas Selesai</p>
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2">
                    <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center text-center text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 w-full">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold">3</h2>
                        <p className="text-sm text-black/60">Total Ujian</p>
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2">
                    <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center text-center text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 w-full">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold">9</h2>
                        <p className="text-sm text-black/60">Ujian Selesai</p>
                    </div>
                </div>
            </section>
            <section id="statistic" className="w-full grid grid-cols-1 2xl:grid-cols-2 gap-4 p-4">
                {/* TASK */}
                <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex flex-col gap-4">
                    <div>
                        <h2 className="text-lg font-semibold">Tugas Terbaru</h2>
                        <p className="text-black/60 text-sm">Dimohon untuk selesaikan tugas anda dengan tepat waktu</p>
                    </div>
                    <div className="divide-y divide-black/10">
                        <div className="flex items-start sm:items-center justify-between py-4 gap-2">
                            <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1">
                                <div>
                                    <h3>PENGAYAAN MATEMATIKA</h3>
                                    <p className="text-black/60 text-sm">Matematika &middot; John Doe, S.Pd.</p>
                                </div>
                                <p className="text-xs text-orange-700">Sampai 9 Des 2025</p>
                            </div>
                            <div className="flex flex-col sm:flex-row items-center gap-2">
                                <a href="" className="text-sm bg-orange-500 text-white px-3 py-2 rounded-sm flex items-center gap-1 hover:bg-orange-400 hover:shadow transition">
                                    Kerjakan
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                        <div className="flex items-start sm:items-center justify-between py-4 gap-2">
                            <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1">
                                <div>
                                    <h3>PENGAYAAN KEWIRAUSAHAAN</h3>
                                    <p className="text-black/60 text-sm">Kewirausahaan &middot; Jack Smith, S.Pd.</p>
                                </div>
                                <p className="text-xs text-orange-700">Sampai 4 Des 2025</p>
                            </div>
                            <div className="flex flex-col sm:flex-row items-center gap-2">
                                <a href="" className="text-sm bg-orange-500 text-white px-3 py-2 rounded-sm flex items-center gap-1 hover:bg-orange-400 hover:shadow transition">
                                    Kerjakan
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                        <div className="flex items-start sm:items-center justify-between py-4 gap-2">
                            <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1">
                                <div>
                                    <h3>PENGAYAAN DKV</h3>
                                    <p className="text-black/60 text-sm">DKV &middot; Reine Smith, S.Kom.</p>
                                </div>
                                <p className="text-xs text-orange-700">Sampai 22 Nov 2025</p>
                            </div>
                            <div className="flex flex-col sm:flex-row items-center gap-2">
                                <a href="" className="text-sm bg-orange-500 text-white px-3 py-2 rounded-sm flex items-center gap-1 hover:bg-orange-400 hover:shadow transition">
                                    Kerjakan
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                        <div className="flex items-start sm:items-center justify-between py-4 gap-2">
                            <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1">
                                <div>
                                    <h3>PENGAYAAN ENGLISH</h3>
                                    <p className="text-black/60 text-sm">Bahasa Inggris &middot; Jane Doe, S.S.</p>
                                </div>
                                <p className="text-xs text-orange-700">Selesai tepat waktu</p>
                            </div>
                            <div className="flex flex-col sm:flex-row items-center gap-2">
                                <a href="" className="text-sm bg-emerald-400 text-white px-3 py-2 rounded-sm flex items-center gap-1 hover:bg-emerald-300 hover:shadow transition">
                                    Selesai
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                    </svg>
                                </a>
                            </div>
                        </div>                       
                    </div>
                </div>
                {/* EXAM */}
                <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex flex-col gap-4">
                    <div>
                        <h2 className="text-lg font-semibold">Ujian Terbaru</h2>
                        <p className="text-black/60 text-sm">Dimohon untuk selesaikan ujian anda dengan tepat waktu</p>
                    </div>
                    
                    <div className="divide-y divide-black/10">
                        <div className="flex items-start sm:items-center justify-between py-4 gap-2">
                            <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1">
                                <div>
                                    <h3>NARRATIVE TEXT</h3>
                                    <p className="text-black/60 text-sm">Bahasa Inggris &middot; Jane Doe, S.S.</p>
                                </div>
                                <p className="text-xs text-orange-700">Sampai 12 Des 2025</p>
                            </div>
                            <div className="flex flex-col sm:flex-row items-center gap-2">
                                
                                <a href="" className="text-sm bg-orange-500 text-white px-3 py-2 rounded-sm flex items-center gap-1 hover:bg-orange-400 hover:shadow transition">
                                    Kerjakan
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                        <div className="flex items-start sm:items-center justify-between py-4 gap-2">
                            <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1">
                                <div>
                                    <h3>SPLDV & SPLTV</h3>
                                    <p className="text-black/60 text-sm">Matematika &middot; John Doe, S.Pd.</p>
                                </div>
                                <p className="text-xs text-orange-700">Selesai tepat waktu</p>
                            </div>
                            <div className="flex flex-col sm:flex-row items-center gap-2">
                                <a href="" className="text-sm bg-emerald-400 text-white px-3 py-2 rounded-sm flex items-center gap-1 hover:bg-emerald-300 hover:shadow transition">
                                    Selesai
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                    </svg>
                                </a>
                            </div>
                        </div>               
                    </div>
                </div>
            </section>
        </div>
    )
}