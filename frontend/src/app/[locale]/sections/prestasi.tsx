"use client";

import Image from "next/image";
import {useEffect, useState, useRef} from "react";
import {useTranslations} from "next-intl";

export default function Prestasi() {
    const t = useTranslations('achievements')
    const [current, setCurrent] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLDivElement | null>(null);

    const achievements = [
        {img: "/pp2.png", title: "Juara Dua"},
        {img: "/pp2.png", title: "Juara Tiga"},
        {img: "/pp2.png", title: "Juara Satu"},
    ];

    // observer animasi masuk
    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) setIsVisible(true);
                });
            },
            {threshold: 0.2}
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    // next & prev slide
    const nextSlide = () => {
        setCurrent((prev) => (prev + 1) % achievements.length);
    };
    const prevSlide = () => {
        setCurrent((prev) => (prev - 1 + achievements.length) % achievements.length);
    };

    return (
        <>
            {/* === SECTION PRESTASI === */}
            <section
                id="prestasi"
                ref={sectionRef}
                className="relative overflow-hidden py-24 md:py-28 bg-white"
            >
                {/* Background oranye miring */}
                <div
                    className="absolute top-120 left-0 right-0 h-100 bg-[#FE4D01] transform -skew-y-6 origin-top-left z-0"></div>

                <div className="relative z-10 container mx-auto px-6 md:px-12 lg:px-20">
                    <div
                        className={`flex flex-col md:flex-row items-start gap-10 transition-all duration-1000 ease-out ${
                            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                        }`}
                    >
                        {/* Kiri: Text */}
                        <div className="md:w-1/2">
                            <h2 className="text-2xl md:text-3xl font-bold text-[#FE4D01] mb-4">
                                {t('title')}
                            </h2>
                            <p className="text-[#243771] text-sm md:text-base leading-relaxed">
                                {t('description')}
                            </p>
                        </div>

                        {/* Kanan: Slider */}
                        <div className="md:w-1/2 flex flex-col">
                            {/* Cards */}
                            <div className="flex gap-4 overflow-hidden transition-all duration-500 ease-in-out">
                                {achievements
                                    .slice(current, current + 2)
                                    .concat(
                                        current + 2 > achievements.length
                                            ? achievements.slice(0, (current + 2) % achievements.length)
                                            : []
                                    )
                                    .map((item, i) => (
                                        <div
                                            key={i}
                                            className="bg-white rounded-xl shadow-md overflow-hidden flex-shrink-0 transform transition hover:scale-105 hover:shadow-xl"
                                            style={{width: "295px", height: "369px"}}
                                        >
                                            <Image
                                                src={item.img}
                                                alt={item.title}
                                                width={295}
                                                height={369}
                                                className="object-cover w-full h-full"
                                            />
                                        </div>
                                    ))}
                            </div>

                            {/* Tombol Navigasi + Selengkapnya */}
                            <div className="flex items-center justify-between mt-6">
                                <a
                                    href="/profil/prestasi"
                                    className="px-6 py-2 rounded-md bg-[#243771] text-white text-sm md:text-base font-semibold shadow hover:shadow-lg hover:bg-[#1a2a5c] transition"
                                >
                                    {t('moreButton')}
                                </a>
                                <div className="flex gap-3">
                                    <button
                                        onClick={prevSlide}
                                        aria-label="Previous slide"
                                        className="w-10 h-10 flex items-center justify-center rounded-full bg-[#243771] text-white shadow hover:shadow-lg hover:bg-[#1a2a5c] transition"
                                    >
                                        ‹
                                    </button>
                                    <button
                                        onClick={nextSlide}
                                        aria-label="Next slide"
                                        className="w-10 h-10 flex items-center justify-center rounded-full bg-[#243771] text-white shadow hover:shadow-lg hover:bg-[#1a2a5c] transition"
                                    >
                                        ›
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* === SECTION GEDUNG FULLSCREEN === */}
            <section className="relative w-full bg-[#FE4D01]">
                <div className="w-full h-screen relative">
                    <Image
                        src="svg/gedung.svg"
                        alt="Gedung SMK Prestasi Prima"
                        fill
                        priority
                        className="object-cover object-center"
                    />
                </div>
            </section>
        </>
    );
}
