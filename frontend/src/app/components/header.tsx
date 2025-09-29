"use client";

import { useEffect, useState } from "react";
import { useLang } from "./LangContext";
import Image from "next/image";

export default function Header() {
const { lang, setLang } = useLang();
const [isScrolled, setIsScrolled] = useState(false);
const [openDropdown, setOpenDropdown] = useState<string | null>(null);
const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

useEffect(() => {
	const handleScroll = () => setIsScrolled(window.scrollY > 50);
	window.addEventListener("scroll", handleScroll);
	return () => window.removeEventListener("scroll", handleScroll);
}, []);

useEffect(() => {
	const handleClickOutside = (event: MouseEvent) => {
		const target = event.target as HTMLElement;
		if (!target.closest(".dropdown")) setOpenDropdown(null);
	};
	document.addEventListener("click", handleClickOutside);
	return () => document.removeEventListener("click", handleClickOutside);
}, []);

const toggleDropdown = (menu: string) =>
	setOpenDropdown(prev => (prev === menu ? null : menu));

	return (
		<header className="fixed top-0 w-full z-50 select-none">
			{/* <div className="bg-[#243771] text-white text-sm px-4 py-2">
				<div className="container mx-auto flex items-center justify-end">
					{<button className="hover:underline">
						{lang === "id" ? "Berita" : "News"}
					</button>}

					<div className="relative dropdown">
						<button onClick={() => toggleDropdown("lang")} className="flex items-center gap-2 hover:underline">
							<Image src={lang === "id" ? "https://flagcdn.com/id.svg" : "https://flagcdn.com/gb.svg"} alt="flag" width={20} height={15}/>
							{lang === "id" ? "Bahasa Indonesia" : "English"}
						</button>
						{openDropdown === "lang" && (
							<div className="absolute right-0 mt-1 w-44 bg-white shadow-lg rounded text-gray-800">
								<button onClick={() => { setLang("id"); setOpenDropdown(null); }} className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100 transition">
									<Image src="https://flagcdn.com/id.svg" alt="ID Flag" width={20} height={15} />
									Bahasa Indonesia
								</button>
								<button onClick={() => { setLang("en"); setOpenDropdown(null); }} className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100 transition">
									<Image src="https://flagcdn.com/gb.svg" alt="EN Flag" width={20} height={15} />
									English
								</button>
							</div>
						)}
					</div>
				</div>
			</div> */}

			<div className={`transition duration-300 p-3 text-white ${isScrolled ? "bg-[#243771] shadow-md" : "bg-transparent shadow-none"}`}>
				<div className="container mx-auto flex items-center justify-between">
					
					<a href="/" className="flex items-center gap-2">
						<Image src="/smk.png" alt="Logo" width={46} height={46} className="rounded-full bg-[#243771]" />
						<span className="font-bold text-2xl">SMK Prestasi Prima</span>
					</a>
	
					<nav className="flex items-center gap-6">
						<div className="relative dropdown">
							<button onClick={() => toggleDropdown("profil-sekolah")} className="flex items-center gap-1 hover:text-yellow-400 cursor-pointer transition">
								{lang === "id" ? "Profil Sekolah" : "School Profile"}
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="min-w-4 h-4">
									<path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
								</svg>
							</button>
							{openDropdown === "profil-sekolah" && (
								<div className="absolute left-0 mt-3 text-sm bg-white/90 shadow-lg rounded text-orange-600 w-36">
									<a className="block px-4 py-2 rounded hover:bg-gray-200/90 transition" href="#tentang-kami">
										Tentang Kami
									</a>
									<a className="block px-4 py-2 rounded hover:bg-gray-200/90 transition" href="#visi-misi">
										Visi & Misi
									</a>
									<a className="block px-4 py-2 rounded hover:bg-gray-200/90 transition" href="#prestasi">
										Prestasi
									</a>
									<a className="block px-4 py-2 rounded hover:bg-gray-200/90 transition" href="#manajemen">
										Manajemen
									</a>
									<a className="block px-4 py-2 rounded hover:bg-gray-200/90 transition" href="#fasilitas">
										Fasilitas
									</a>
									<a className="block px-4 py-2 rounded hover:bg-gray-200/90 transition" href="#mitra">
										Mitra
									</a>
									<a className="block px-4 py-2 rounded hover:bg-gray-200/90 transition" href="#testimoni">
										Testimoni
									</a>
									<a className="block px-4 py-2 rounded hover:bg-gray-200/90 transition" href="#faq">
										FAQ
									</a>
								</div>
							)}
						</div>

						<div className="relative dropdown">
							<button onClick={() => toggleDropdown("kegiatan-siswa")} className="flex items-center gap-1 hover:text-yellow-400 cursor-pointer transition">
								{lang === "id" ? "Kegiatan Siswa" : "Students Activity"}
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="min-w-4 h-4">
									<path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
								</svg>
							</button>
							{openDropdown === "kegiatan-siswa" && (
								<div className="absolute left-0 mt-3 text-sm bg-white/90 shadow-lg rounded text-orange-600 w-36">
									<a className="block px-4 py-2 rounded hover:bg-gray-200/90 transition" href="#tentang-kami">
										Ekstrakurikuler
									</a>
									<a className="block px-4 py-2 rounded hover:bg-gray-200/90 transition" href="#tentang-kami">
										Acara
									</a>
									<a className="block px-4 py-2 rounded hover:bg-gray-200/90 transition" href="#tentang-kami">
										Study Tour
									</a>
								</div>
							)}
						</div>
						{/* <a href="#dokumentasi">{lang === "id" ? "Dokumentasi" : "Documentation"}</a> */}
						<a className="flex items-center gap-1 hover:text-yellow-400 cursor-pointer transition" href="">
							{lang === "id" ? "Berita Terkini" : "Latest News"}
						</a>
						
						<button className="hidden md:block px-4 py-2 rounded bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition font-medium cursor-pointer">
							{lang === "id" ? "Pendaftaran" : "Register"}
						</button>
					</nav>

					{/* Hamburger */}
					<button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
						☰
					</button>
				</div>
			</div>

			{/* Mobile Menu */}
			{isMobileMenuOpen && (
				<div className="md:hidden bg-white text-orange-600 shadow-lg">
					<div className="flex flex-col px-6 py-4 space-y-3">
						{/* ... isi mobile menu tetap sama */}
					</div>
				</div>
			)}
		</header>
	);
}
