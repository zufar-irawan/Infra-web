"use client";

export default function TugasSiswa() {
    return (
        <>
            <section id="statistic" className="w-full grid grid-cols-1 gap-4 p-4">
                <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex flex-col gap-4">
                    <div>
                        <h2 className="text-lg font-semibold">Matematika</h2>
                        <p className="text-black/60 text-sm">John Doe &middot; XII DKV 1</p>
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
            </section>
        </>
    )
}