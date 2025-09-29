// import Image from "next/image";
// import { redirect } from "next/navigation";

import { useLang } from "../components/LangContext";

export default function Home() {
    const { lang, setLang } = useLang();

    return (
        <section id="home">
            <div className="relative w-full min-h-screen bg-gray-800 bg-cover bg-no-repeat bg-center bg-fixed" style={{backgroundImage: "url('/sekolah_ls.png')"}}>
                <div className="absolute inset-0 bg-gradient-to-r from-gray-800/80 to-gray-800/20"></div>
                <div className="relative z-20 w-full min-h-screen flex items-center justify-center px-4">
                    <div className="container flex flex-col items-start gap-2">
                        <p className="uppercase text-3xl font-semibold">
                            {lang === "id" ? "SELAMAT DATANG DI SITUS RESMI" : "WELCOME TO OFFICIAL WEBSITE"}
                        </p>
                        <h1 className="uppercase text-6xl bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent selection:text-white font-bold">
                            SMK PRESTASI PRIMA
                            </h1>
                        <q className="uppercase italic text-xl">
                            IF BETTER IS POSSIBLE, GOOD IS NOT ENOUGH
                        </q>
                        <button className="bg-orange-600 hover:bg-orange-700 px-5 py-3 text-lg font-bold tracking-wide rounded-full cursor-pointer mt-5 flex items-center gap-2">
                            {lang === "id" ? "DAFTAR SEKARANG" : "REGISTER NOW"}
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="min-w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}