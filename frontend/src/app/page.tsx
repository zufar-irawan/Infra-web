"use client";

import Navbar from "@/app/components/header";
import Footer from "@/app/components/footer";

import Home from "./sections/home";
import Sekilas from "./sections/sekilas";
import Prestasi from "./sections/prestasi";
import Pesan from "./sections/pesan";
import Tur from "./sections/tur";
import Mitra from "./sections/mitra";
import SocialBar from "./components/social";
import Jurusan from "./sections/jurusan";


export default function Main() {
	return (
		<div className="flex-1 w-full min-h-screen">
			<Navbar />
			<SocialBar />

			<Home />
			<Sekilas />
			<Pesan />
			<Jurusan />
			<Prestasi />
			<Tur />
			<Mitra />
			<Footer />
		</div>
	);
}
