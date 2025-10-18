// oxlint-disable no-unused-vars
import {useLang} from "../components/LangContext";
import SocialBar from "@/components/Social";

export default function Home() {
    const {lang} = useLang();

    return (
        <section id="home" className="relative">
            <div
                className="relative w-full min-h-screen bg-gray-800 text-white bg-cover bg-no-repeat bg-center bg-fixed"
                style={{backgroundImage: "url('/webp/sekolah_ls.webp')"}}
            >
                {/* overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-gray-800/80 to-gray-800/20"></div>

                {/* content */}
                <div className="relative z-20 w-full min-h-screen flex items-center justify-center px-4">
                    <div
                        className="w-full max-w-7xl sm:max-w-4/5 flex flex-col items-center sm:items-start text-center sm:text-left">
                        <p className="uppercase text-xl sm:text-2xl xl:text-3xl font-semibold">
                            {lang === "id" ? "SELAMAT DATANG DI SITUS RESMI" : "WELCOME TO OFFICIAL WEBSITE"}
                        </p>
                        <h1 className="uppercase text-4xl sm:text-5xl xl:text-6xl bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent selection:text-white font-bold leading-tight">
                            SMK PRESTASI PRIMA
                        </h1>
                        <q className="uppercase italic text-base sm:text-lg xl:text-xl opacity-90">
                            IF BETTER IS POSSIBLE, GOOD IS NOT ENOUGH
                        </q>

                        {/* buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 mt-6 w-fit sm:w-auto">
                            {/* Daftar Sekarang */}
                            <a
                                href="/kehidupan-siswa/penerimaan"
                                className="w-full sm:w-auto text-center px-5 py-2 text-white rounded bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition font-semibold flex items-center justify-center gap-2"
                            >
                                {lang === "id" ? "DAFTAR SEKARANG" : "REGISTER NOW"}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="min-w-4 h-4"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                                    />
                                </svg>
                            </a>
                        </div>

                    </div>
                </div>

                {/* curved bottom (smooth + responsive) */}
                <div className="absolute bottom-0 w-full overflow-hidden leading-none">
                    <svg
                        className="relative block w-full h-20 sm:h-28 lg:h-40"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 1440 320"
                        preserveAspectRatio="none"
                    >
                        <path
                            fill="#ffffff"
                            fillOpacity="1"
                            d="M0,240 Q720,160 1440,240 L1440,320 L0,320Z"
                        ></path>
                    </svg>
                </div>
            </div>
        </section>
    );
}
