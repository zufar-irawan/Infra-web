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
			<div className="bg-[#243771] text-white text-sm px-4 py-2">
				<div className="container mx-auto flex items-center justify-end">
					{/* <button className="hover:underline">
						{lang === "id" ? "Berita" : "News"}
					</button> */}

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
			</div>

			<div className={`transition duration-300 px-4 py-2 
				${
					/* isScrolled ? "bg-white/10 backdrop-blur shadow" : "bg-orange-600" */
					isScrolled ? "bg-gradient-to-r from-orange-600 to-orange-700 shadow-lg" : "bg-gradient-to-r from-transparent to-transparent shadow-none"
				}
			`}>
				<div className="container mx-auto flex items-center justify-between">
					
					<a href="/" className="flex items-center gap-2">
						<Image src="/smk.png" alt="Logo" width={50} height={50} className="rounded-full" />
						<span className="text-white font-bold tracking-wide text-2xl">SMK Prestasi Prima</span>
					</a>

					<div className="flex items-center gap-6">
						<nav className="flex items-center gap-6 text-white relative">
							<div className="relative dropdown">
								<button onClick={() => toggleDropdown("informasi")} className="hover:underline">
									{lang === "id" ? "Informasi Sekolah" : "School Information"}
								</button>
								{openDropdown === "informasi" && (
									<div className="absolute left-0 mt-2 bg-white shadow-lg rounded text-orange-600 w-48">
										<a href="#about-us" className="block px-4 py-2 hover:bg-gray-100 transition">
											Tentang Kami
										</a>
										<a href="#visi" className="block px-4 py-2 hover:bg-gray-100 transition">
											Visi & Misi
										</a>
										<a href="#manajemen" className="block px-4 py-2 hover:bg-gray-100 transition">
											Manajemen
										</a>
										<a href="#fasilitas" className="block px-4 py-2 hover:bg-gray-100 transition">
											Fasilitas
										</a>
										<a href="#testimoni" className="block px-4 py-2 hover:bg-gray-100 transition">
											Testimoni
										</a>
										<a href="#faq" className="block px-4 py-2 hover:bg-gray-100 transition">
											FAQ
										</a>
									</div>
								)}
							</div>

							<div className="relative dropdown">
								<button onClick={() => toggleDropdown("kegiatan")} className="hover:underline">
									{lang === "id" ? "Kegiatan Siswa" : "Student Activity"}
								</button>
								{openDropdown === "kegiatan" && (
									<div className="absolute left-0 mt-2 bg-white shadow-lg rounded text-orange-600 w-40">
										<a href="#ekskul" className="block px-4 py-2 hover:bg-gray-100 transition">
											Ekstrakurikuler
										</a>
										<a href="#ekskul" className="block px-4 py-2 hover:bg-gray-100 transition">
											Acara
										</a>
										<a href="#prestasi" className="block px-4 py-2 hover:bg-gray-100 transition">
											Prestasi
										</a>
									</div>
								)}
							</div>

							<a href="#dokumentasi">{lang === "id" ? "Dokumentasi" : "Documentation"}</a>
							<a href="#berita">{lang === "id" ? "Berita" : "News"}</a>
							
						</nav>

						<button className="hidden md:block bg-[#243771] hover:bg-[#1b2a5a] px-4 py-2 rounded text-white font-medium">
							{lang === "id" ? "Pendaftaran" : "Register"}
						</button>
					</div>
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
