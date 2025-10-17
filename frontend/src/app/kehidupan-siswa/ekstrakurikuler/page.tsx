"use client";

import Link from "next/link";
import Image from "next/image";
import { useLang } from "../../components/LangContext";

export default function Ekstrakurikuler() {
  const { lang } = useLang();

  // === Static 21 Ekskul dengan link Instagram ===
  const ekskul = [
    { id: 1,  name_id: "Badminton",         name_en: "Badminton Club",       img: "/svg/bultang.svg", ig: "https://www.instagram.com/badminton_presma?igsh=N291OWZ1NTMxa2R3" },
    { id: 2,  name_id: "Basket",            name_en: "Basketball Club",      img: "/svg/basket.svg",  ig: "https://www.instagram.com/smkppbasketball?igsh=NmFncTAzbms4NjJ3" },
    { id: 3,  name_id: "Voli",              name_en: "Volleyball Club",      img: "/svg/voli.svg",    ig: "https://www.instagram.com/presma_vollyball?igsh=eW5tY2htdjcwdHoz" },
    { id: 4,  name_id: "English Club",      name_en: "English Club",         img: "/svg/ec.svg",      ig: "https://www.instagram.com/engclub.presma?igsh=d2w2bHA1MnNtbGsx" },
    { id: 5,  name_id: "Futsal",            name_en: "Futsal Club",          img: "/svg/futsal.svg",  ig: "https://www.instagram.com/futsalprestasiprima?igsh=bXY2cXZlZ2Y3cWhx" },
    { id: 6,  name_id: "GANEFO",            name_en: "GANEFO",               img: "/svg/ganefo.svg",  ig: "https://www.instagram.com/historyganefoclub?igsh=ZGplbmxqcXU5ZDN6" },
    { id: 7,  name_id: "ICT Club",          name_en: "ICT Club",             img: "/svg/ict.svg",     ig: "https://www.instagram.com/ictclub.presma?igsh=cjljdDBtczAzbzVo" },
    { id: 8,  name_id: "KIR",               name_en: "Scientific Youth (KIR)",img: "/svg/kir.svg",    ig: "https://www.instagram.com/bestiesciencee?igsh=MWgyM3l2aXI1ODV5dw==" },
    { id: 9,  name_id: "Modern Dance",      name_en: "Modern Dance",         img: "/svg/geniale.svg", ig: "https://www.instagram.com/geniale.dance?igsh=MWNnN2U2MXo3cHplMA==" },
    { id: 10, name_id: "Orens Digital",     name_en: "Orens Digital",        img: "/svg/digital.svg", ig: "https://www.instagram.com/orensdigital_?igsh=MXFqb2s3dG5yZm56dQ==" },
    { id: 11, name_id: "Orens Network",     name_en: "Orens Network",        img: "/svg/network.svg", ig: "https://www.instagram.com/orens.network?igsh=MW84eTV2dzdkOGZnaQ==" },
    { id: 12, name_id: "Orens Solution",    name_en: "Orens Solution",       img: "/svg/solution.svg",ig: "https://www.instagram.com/orensolutionspresma?igsh=dzc5Nmp1NnRkN3Ay" },
    { id: 13, name_id: "Orens Studio",      name_en: "Orens Studio",         img: "/svg/studio.svg",  ig: "https://www.instagram.com/orens_studio_prestasiprima?igsh=emFla2Y3Mmg3NHg1" },
    { id: 14, name_id: "PMR",               name_en: "Red Cross Youth (PMR)",img: "/svg/pmr.svg",    ig: "https://www.instagram.com/pmr_presma?igsh=bTc2MDdzZGw0MDF5" },
    { id: 15, name_id: "PPOC",              name_en: "PPOC",                 img: "/svg/ppoc.svg",   ig: "https://www.instagram.com/ppoc_geniuses?igsh=MTFxOG52Y20zNWxydA==" },
    { id: 16, name_id: "Pramuka",           name_en: "Scouting",             img: "/svg/pramuka.svg",ig: "https://www.instagram.com/scoutofventures?igsh=dDEyN25xZDBhczVk" },
    { id: 17, name_id: "Rohis",             name_en: "Islamic Spirituality", img: "/svg/rohis.svg",  ig: "https://www.instagram.com/rohis_prestasiprima?igsh=b2d1N3Q1Mmx5cG5q" },
    { id: 18, name_id: "Rohkris",           name_en: "Christian Spirituality",img: "/svg/rohkris.svg",ig: "https://www.instagram.com/rohkrispp?igsh=MTZqNmk5ejBzNzh3dg==" },
    { id: 19, name_id: "Silat",             name_en: "Pencak Silat",         img: "/svg/silat.svg",  ig: "#" },
    { id: 20, name_id: "Tari Tradisional",  name_en: "Traditional Dance",    img: "/svg/tari.svg",   ig: "https://www.instagram.com/artesatra?igsh=aHNtcXVqN2NwODVw" },
    { id: 21, name_id: "Esport",            name_en: "E-sport Team",         img: "/svg/esports.svg",ig: "#" },
  ];

  return (
    <>
      <div className="h-[100px] bg-white" />

      {/* === Breadcrumbs === */}
      <section className="w-full py-4 bg-white">
        <div className="container mx-auto px-4">
          <nav className="flex items-center text-sm font-medium space-x-2">
            <Link href="/" className="text-[#FE4D01] hover:underline">
              {lang === "id" ? "Beranda" : "Home"}
            </Link>
            <span className="text-[#FE4D01]">{">"}</span>
            <Link
              href="/kehidupan-siswa/ekstrakurikuler"
              className="text-[#FE4D01] hover:underline"
            >
              {lang === "id" ? "Kehidupan Siswa" : "Student Life"}
            </Link>
            <span className="text-[#243771]">{">"}</span>
            <span className="text-[#243771]">
              {lang === "id" ? "Ekstrakurikuler" : "Extracurricular"}
            </span>
          </nav>
        </div>
      </section>

      {/* === Section Ekstrakurikuler === */}
      <section className="w-full bg-white py-10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-[#243771] mb-2">
            {lang === "id" ? "Ekstrakurikuler" : "Extracurricular"}
          </h2>
          <p className="text-[#243771] mb-10 text-sm md:text-base">
            {lang === "id"
              ? "Ekstrakurikuler: Wadah Bakat dan Ciptakan Generasi Berprestasi."
              : "Extracurricular: A place to develop talents and create achievers."}
          </p>

          {/* === Grid Ekskul === */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 justify-items-center">
            {ekskul.map((item) => (
              <a
                key={item.id}
                href={item.ig}
                target="_blank"
                rel="noopener noreferrer"
                className="relative group flex items-center justify-between w-[297.04px] h-[168.47px] bg-white rounded-[10px] shadow-[0_4px_4px_rgba(0,0,0,0.25)] overflow-hidden hover:scale-[1.02] transition-transform duration-300"
              >
                <div className="flex-1 flex items-center justify-center">
                  <Image
                    src={item.img}
                    alt={item.name_id}
                    width={95}
                    height={95}
                    className="object-contain z-10"
                    unoptimized
                  />
                </div>
                <div className="h-full w-[50.84px] bg-[#243771] flex items-center justify-center rounded-r-[10px] z-10">
                  <span
                    className="text-white font-semibold text-[13px] transform -rotate-90 whitespace-nowrap"
                    style={{ letterSpacing: "0.5px" }}
                  >
                    {lang === "id" ? item.name_id : item.name_en}
                  </span>
                </div>
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white text-sm font-medium z-20 text-center px-2">
                  {lang === "id"
                    ? "Klik untuk menuju Instagram"
                    : "Click to open Instagram"}
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* === Section Gedung === */}
      <main className="flex-1 w-full bg-white">
        <section className="relative w-full bg-white overflow-hidden">
          <img
            src="/avif/gedung.avif"
            alt={
              lang === "id"
                ? "Gedung SMK Prestasi Prima"
                : "Prestasi Prima Building"
            }
            className="w-full h-[40vh] sm:h-[55vh] lg:h-screen object-cover object-center hover:scale-[1.02] transition-transform duration-700"
          />
        </section>
      </main>
    </>
  );
}
