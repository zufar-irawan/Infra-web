"use client";

import {useTranslations} from "next-intl";

export default function Jurusan() {
  const t = useTranslations('expertisePrograms')

  const items = [
    {
      img: "https://images.unsplash.com/photo-1505685296765-3a2736de412f?auto=format&fit=crop&w=800&q=80",
      title: t('programs.visualDesign'),
    },
    {
      img: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",
      title: t('programs.broadcasting'),
    },
    {
      img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
      title: t('programs.softwareDev'),
    },
    {
      img: "https://images.unsplash.com/photo-1581091012184-5c45c1b1e5c1?auto=format&fit=crop&w=800&q=80",
      title: t('programs.networkEng'),
    },
  ];

  return (
    <section id="jurusan" className="relative py-30 bg-white overflow-hidden">
      <div className="w-full max-w-7xl sm:max-w-4/5 mx-auto px-6 md:px-12 lg:px-20">
        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-center">
          <span className="text-[#FE4D01]">
            {t('title')}
          </span>
        </h2>

        <p className="text-center text-gray-600 max-w-3xl mx-auto mt-3 mb-12 text-sm md:text-base leading-relaxed">
          {t('description')}
        </p>

        {/* Scratch Cards */}
        <div className="flex flex-col sm:flex-row items-stretch gap-3 sm:gap-2 h-[400px] w-full max-w-6xl mx-auto">
          {items.map((item, i) => (
            <div
              key={i}
              className="relative group flex-grow transition-all duration-500 ease-in-out rounded-xl overflow-hidden hover:flex-[3] flex-[1]"
            >
              <img
                src={item.img}
                alt={item.title}
                className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4">
                <h3 className="text-white font-semibold text-sm md:text-base text-center">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dekorasi kotak pojok kanan bawah */}
      <div className="absolute top-0 left-0 w-[50px] h-[50px] bg-[#243771] z-10" />
      <div className="absolute top-12.5 left-12.5 w-[50px] h-[50px] bg-[#243771] z-10" />
    </section>
  );
}
