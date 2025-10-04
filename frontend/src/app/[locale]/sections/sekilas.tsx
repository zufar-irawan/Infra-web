"use client";

import Image from "next/image";
import {useEffect, useState, useRef} from "react";
import {useTranslations} from "next-intl";

export default function Sekilas() {
    const t = useTranslations('glimpse')
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLDivElement | null>(null);

    // Observer untuk trigger animasi saat masuk viewport
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) setIsVisible(true);
                });
            },
            {threshold: 0.2}
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <section
            id="sekilas"
            className="relative py-30 bg-white overflow-hidden"
            ref={sectionRef}
        >
            <div className="w-full max-w-7xl sm:max-w-4/5 mx-auto px-6 md:px-12 lg:px-20 relative z-10">
                <div className="flex flex-col md:flex-row items-center gap-10">
                    {/* Kiri: Foto Kepala Sekolah */}
                    <div
                        className={`relative w-full md:w-1/2 flex justify-start md:justify-center transform transition-all duration-1000 ${
                            isVisible
                                ? "opacity-100 translate-x-0"
                                : "opacity-0 -translate-x-10"
                        }`}
                    >
                        <Image
                            src="/svg/sirHendryGaris.svg"
                            alt={t('principalImageAlt')}
                            width={500}
                            height={650}
                            className="relative z-10 w-auto h-auto max-w-full"
                            priority
                        />
                    </div>

                    {/* Kanan: Teks Penjelasan */}
                    <div
                        className={`md:w-1/2 text-left space-y-6 transform transition-all duration-1000 delay-300 ${
                            isVisible
                                ? "opacity-100 translate-x-0"
                                : "opacity-0 translate-x-10"
                        }`}
                    >
                        <h2 className="text-2xl md:text-3xl font-bold text-[#FE4D01]">
                            {t('title')}
                        </h2>

                        <p className="text-gray-700 leading-relaxed">
                            {t('description')}
                        </p>

                        <a
                            href="#"
                            className="inline-block bg-[#FE4D01] hover:bg-orange-600 text-white px-6 py-3 rounded-md font-semibold transition"
                        >
                            {t('readMoreButton')}
                        </a>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-25 right-12 w-[50px] h-[50px] bg-[#243771]"/>
            <div className="absolute bottom-12.5 right-0 w-[50px] h-[50px] bg-[#243771]"/>
            <div className="absolute bottom-0 right-0 w-[50px] h-[50px] bg-[#FE4D01]"/>
        </section>
    );
}
